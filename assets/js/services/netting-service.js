import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    collection,
    getDocs,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const COMPANIES_COLLECTION =
    "companies";
  
  const TRANSACTIONS_COLLECTION =
    "transactions";
  
  
  /*
   * تحميل جميع الشركات والمعاملات المكتملة
   * التي ستظهر داخل شبكة المقاصة.
   */
  export async function getNettingNetworkData() {
    const [
      companiesSnapshot,
      transactionsSnapshot,
    ] = await Promise.all([
      getDocs(
        collection(
          db,
          COMPANIES_COLLECTION,
        ),
      ),
  
      getDocs(
        collection(
          db,
          TRANSACTIONS_COLLECTION,
        ),
      ),
    ]);
  
  
    const companies =
      companiesSnapshot.docs.map(
        (companyDocument) => {
          const companyData =
            companyDocument.data();
  
          return {
            id:
              companyDocument.id,
  
            companyName:
              companyData.companyName
              ?? companyData.name
              ?? "منشأة بدون اسم",
  
            businessType:
              companyData.businessType
              ?? companyData.category
              ?? "نشاط غير محدد",
  
            city:
              companyData.city
              ?? "غير محدد",
  
            balance:
              Number(
                companyData.balance,
              ) || 0,
  
            trustScore:
              Number(
                companyData.trustScore,
              ) || 0,
  
            riskLevel:
              companyData.riskLevel
              ?? "غير محدد",
          };
        },
      );
  
  
    const transactions =
      transactionsSnapshot.docs
        .map(
          (transactionDocument) => ({
            id:
              transactionDocument.id,
  
            ...transactionDocument.data(),
  
            amount:
              Number(
                transactionDocument
                  .data()
                  .amount,
              ) || 0,
          }),
        )
        .filter(
          (transaction) =>
            transaction.status
              === "completed"
            && transaction.amount > 0,
        );
  
  
    return {
      companies,
      transactions,
    };
  }
  
  
  /*
   * دمج المعاملات المتعددة بين نفس الشركتين
   * في رابط واحد داخل الرسم.
   */
  export function aggregateTransactions(
    transactions,
  ) {
    const aggregatedEdges =
      new Map();
  
  
    transactions.forEach(
      (transaction) => {
        const edgeKey =
          `${transaction.buyerCompanyId}__${transaction.sellerCompanyId}`;
  
        const existingEdge =
          aggregatedEdges.get(
            edgeKey,
          );
  
  
        if (existingEdge) {
          existingEdge.amount +=
            Number(
              transaction.amount,
            ) || 0;
  
          existingEdge.transactionsCount += 1;
  
          return;
        }
  
  
        aggregatedEdges.set(
          edgeKey,
          {
            id:
              edgeKey,
  
            sourceId:
              transaction.buyerCompanyId,
  
            targetId:
              transaction.sellerCompanyId,
  
            sourceName:
              transaction.buyerCompanyName,
  
            targetName:
              transaction.sellerCompanyName,
  
            amount:
              Number(
                transaction.amount,
              ) || 0,
  
            transactionsCount:
              1,
          },
        );
      },
    );
  
  
    return Array.from(
      aggregatedEdges.values(),
    );
  }
  
  
  /*
   * حساب صافي كل منشأة:
   *
   * المبالغ الواردة - المبالغ الصادرة
   *
   * موجب = دائن
   * سالب = مدين
   */
  export function calculateCompanyNetBalances(
    companies,
    transactions,
  ) {
    const companyBalances =
      new Map();
  
  
    companies.forEach(
      (company) => {
        companyBalances.set(
          company.id,
          {
            companyId:
              company.id,
  
            companyName:
              company.companyName,
  
            incoming:
              0,
  
            outgoing:
              0,
  
            net:
              0,
          },
        );
      },
    );
  
  
    transactions.forEach(
      (transaction) => {
        const amount =
          Number(
            transaction.amount,
          ) || 0;
  
  
        if (
          !companyBalances.has(
            transaction.buyerCompanyId,
          )
        ) {
          companyBalances.set(
            transaction.buyerCompanyId,
            {
              companyId:
                transaction.buyerCompanyId,
  
              companyName:
                transaction.buyerCompanyName
                ?? "منشأة",
  
              incoming:
                0,
  
              outgoing:
                0,
  
              net:
                0,
            },
          );
        }
  
  
        if (
          !companyBalances.has(
            transaction.sellerCompanyId,
          )
        ) {
          companyBalances.set(
            transaction.sellerCompanyId,
            {
              companyId:
                transaction.sellerCompanyId,
  
              companyName:
                transaction.sellerCompanyName
                ?? "منشأة",
  
              incoming:
                0,
  
              outgoing:
                0,
  
              net:
                0,
            },
          );
        }
  
  
        const buyer =
          companyBalances.get(
            transaction.buyerCompanyId,
          );
  
        const seller =
          companyBalances.get(
            transaction.sellerCompanyId,
          );
  
  
        buyer.outgoing += amount;
  
        seller.incoming += amount;
      },
    );
  
  
    companyBalances.forEach(
      (companyBalance) => {
        companyBalance.net =
          companyBalance.incoming
          - companyBalance.outgoing;
      },
    );
  
  
    return Array.from(
      companyBalances.values(),
    );
  }
  
  
  /*
   * خوارزمية المقاصة متعددة الأطراف.
   *
   * تربط الشركات المدينة بالشركات الدائنة
   * بناءً على صافي الالتزامات بدل تنفيذ
   * جميع المعاملات الأصلية.
   */
  export function calculateNettingSettlements(
    companyNetBalances,
  ) {
    const debtors =
      companyNetBalances
        .filter(
          (company) =>
            company.net < -0.01,
        )
        .map(
          (company) => ({
            ...company,
  
            remaining:
              Math.abs(
                company.net,
              ),
          }),
        )
        .sort(
          (firstCompany, secondCompany) =>
            secondCompany.remaining
            - firstCompany.remaining,
        );
  
  
    const creditors =
      companyNetBalances
        .filter(
          (company) =>
            company.net > 0.01,
        )
        .map(
          (company) => ({
            ...company,
  
            remaining:
              company.net,
          }),
        )
        .sort(
          (firstCompany, secondCompany) =>
            secondCompany.remaining
            - firstCompany.remaining,
        );
  
  
    const settlements = [];
  
    let debtorIndex = 0;
    let creditorIndex = 0;
  
  
    while (
      debtorIndex < debtors.length
      && creditorIndex < creditors.length
    ) {
      const debtor =
        debtors[debtorIndex];
  
      const creditor =
        creditors[creditorIndex];
  
      const settlementAmount =
        Math.min(
          debtor.remaining,
          creditor.remaining,
        );
  
  
      if (settlementAmount > 0.01) {
        settlements.push({
          id:
            `settlement-${debtor.companyId}-${creditor.companyId}`,
  
          sourceId:
            debtor.companyId,
  
          targetId:
            creditor.companyId,
  
          sourceName:
            debtor.companyName,
  
          targetName:
            creditor.companyName,
  
          amount:
            Number(
              settlementAmount.toFixed(2),
            ),
  
          transactionsCount:
            1,
  
          isSettlement:
            true,
        });
      }
  
  
      debtor.remaining -=
        settlementAmount;
  
      creditor.remaining -=
        settlementAmount;
  
  
      if (
        debtor.remaining <= 0.01
      ) {
        debtorIndex += 1;
      }
  
  
      if (
        creditor.remaining <= 0.01
      ) {
        creditorIndex += 1;
      }
    }
  
  
    return settlements;
  }
  
  
  /*
   * إنشاء ملخص المقاصة قبل وبعد.
   */
  export function calculateNettingSummary(
    originalEdges,
    settlementEdges,
  ) {
    const originalAmount =
      originalEdges.reduce(
        (total, edge) =>
          total
          + Number(
            edge.amount,
          ),
  
        0,
      );
  
  
    const settlementAmount =
      settlementEdges.reduce(
        (total, edge) =>
          total
          + Number(
            edge.amount,
          ),
  
        0,
      );
  
  
    const reducedAmount =
      Math.max(
        originalAmount
        - settlementAmount,
  
        0,
      );
  
  
    const reductionPercentage =
      originalAmount > 0
        ? (
            reducedAmount
            / originalAmount
          ) * 100
        : 0;
  
  
    return {
      originalAmount,
      settlementAmount,
      reducedAmount,
      reductionPercentage,
      originalTransfers:
        originalEdges.length,
      settlementTransfers:
        settlementEdges.length,
    };
  }