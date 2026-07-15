import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    collection,
    doc,
    getDoc,
    getDocs,
    serverTimestamp,
    updateDoc,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const COMPANIES_COLLECTION =
    "companies";
  
  const TRANSACTIONS_COLLECTION =
    "transactions";
  
  
  export async function evaluateCompanyRisk(
    companyId,
  ) {
    const companyReference =
      doc(
        db,
        COMPANIES_COLLECTION,
        companyId,
      );
  
    const companySnapshot =
      await getDoc(
        companyReference,
      );
  
    if (!companySnapshot.exists()) {
      throw new Error(
        "company-not-found",
      );
    }
  
    const companyData =
      companySnapshot.data();
  
    const transactions =
      await getCompanyRelatedTransactions(
        companyId,
      );
  
    const completedAsSeller =
      transactions.filter(
        (transaction) =>
          transaction.sellerCompanyId
            === companyId
          && transaction.status
            === "completed",
      ).length;
  
    const completedAsBuyer =
      transactions.filter(
        (transaction) =>
          transaction.buyerCompanyId
            === companyId
          && transaction.status
            === "completed",
      ).length;
  
    const rejectedAsBuyer =
      transactions.filter(
        (transaction) =>
          transaction.buyerCompanyId
            === companyId
          && transaction.status
            === "rejected",
      ).length;
  
    const isVerified =
      Boolean(
        companyData
          .isCommercialRecordVerified,
      );
  
    const baseTrustScore =
      isVerified
        ? 60
        : 40;
  
    const calculatedTrustScore =
      baseTrustScore
      + (
        completedAsSeller
        * 5
      )
      + (
        completedAsBuyer
        * 3
      )
      - (
        rejectedAsBuyer
        * 5
      );
  
    const trustScore =
      clampNumber(
        calculatedTrustScore,
        20,
        95,
      );
  
    const riskAssessment =
      getRiskAssessment(
        trustScore,
      );
  
    const currentBalance =
      Number(
        companyData.balance,
      ) || 0;
  
    const usedCredit =
      currentBalance < 0
        ? Math.abs(
            currentBalance,
          )
        : 0;
  
    /*
     * لا نجعل الحد الجديد أقل من الدين
     * المستخدم حاليًا؛ حتى تبقى البيانات
     * منطقية ولا يصبح الحساب متجاوزًا
     * للحد فورًا.
     */
    const safeCreditLimit =
      Math.max(
        riskAssessment.creditLimit,
        usedCredit,
      );
  
    const evaluationDetails = {
      completedAsSeller,
      completedAsBuyer,
      rejectedAsBuyer,
      baseTrustScore,
    };
  
    await updateDoc(
      companyReference,
      {
        trustScore,
  
        creditLimit:
          safeCreditLimit,
  
        riskLevel:
          riskAssessment.riskLevel,
  
        riskEvaluation:
          evaluationDetails,
  
        riskEvaluatedAt:
          serverTimestamp(),
      },
    );
  
    return {
      companyId,
      trustScore,
  
      creditLimit:
        safeCreditLimit,
  
      riskLevel:
        riskAssessment.riskLevel,
  
      evaluationDetails,
    };
  }
  
  
  export async function evaluateCompaniesRisk(
    companyIds,
  ) {
    const uniqueCompanyIds =
      [
        ...new Set(
          companyIds.filter(
            Boolean,
          ),
        ),
      ];
  
    return Promise.all(
      uniqueCompanyIds.map(
        (companyId) =>
          evaluateCompanyRisk(
            companyId,
          ),
      ),
    );
  }
  
  
  async function getCompanyRelatedTransactions(
    companyId,
  ) {
    const querySnapshot =
      await getDocs(
        collection(
          db,
          TRANSACTIONS_COLLECTION,
        ),
      );
  
    return querySnapshot.docs
      .map(
        (transactionDocument) => ({
          id:
            transactionDocument.id,
  
          ...transactionDocument.data(),
        }),
      )
      .filter(
        (transaction) =>
          transaction.buyerCompanyId
            === companyId
          || transaction.sellerCompanyId
            === companyId,
      );
  }
  
  
  function getRiskAssessment(
    trustScore,
  ) {
    if (trustScore >= 80) {
      return {
        riskLevel:
          "مخاطر منخفضة",
  
        creditLimit:
          1000,
      };
    }
  
    if (trustScore >= 60) {
      return {
        riskLevel:
          "مخاطر متوسطة",
  
        creditLimit:
          700,
      };
    }
  
    if (trustScore >= 40) {
      return {
        riskLevel:
          "مخاطر مرتفعة نسبيًا",
  
        creditLimit:
          500,
      };
    }
  
    return {
      riskLevel:
        "مخاطر مرتفعة",
  
      creditLimit:
        300,
    };
  }
  
  
  function clampNumber(
    value,
    minimum,
    maximum,
  ) {
    return Math.min(
      Math.max(
        value,
        minimum,
      ),
      maximum,
    );
  }