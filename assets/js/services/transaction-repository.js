import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    doc,
    getDocs,
    runTransaction,
    serverTimestamp,
    updateDoc,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  import {
    evaluateCompaniesRisk,
  } from "./risk-service.js";
  
  
  const TRANSACTIONS_COLLECTION =
    "transactions";
  
  const COMPANIES_COLLECTION =
    "companies";
  
  
  export async function createTransaction(
    transactionData,
  ) {
    const transactionDocument = {
      buyerCompanyId:
        transactionData.buyerCompanyId,
  
      buyerCompanyName:
        transactionData.buyerCompanyName,
  
      sellerCompanyId:
        transactionData.sellerCompanyId,
  
      sellerCompanyName:
        transactionData.sellerCompanyName,
  
      serviceId:
        transactionData.serviceId,
  
      serviceName:
        transactionData.serviceName,
  
      serviceCategory:
        transactionData.serviceCategory,
  
      amount:
        Number(
          transactionData.amount,
        ),
  
      status:
        "pending",
  
      createdAt:
        serverTimestamp(),
  
      updatedAt:
        serverTimestamp(),
    };
  
    const documentReference =
      await addDoc(
        collection(
          db,
          TRANSACTIONS_COLLECTION,
        ),
        transactionDocument,
      );
  
    return {
      id:
        documentReference.id,
  
      ...transactionDocument,
    };
  }
  
  
  export async function getCompanyTransactions(
    companyId,
  ) {
    const querySnapshot =
      await getDocs(
        collection(
          db,
          TRANSACTIONS_COLLECTION,
        ),
      );
  
    const transactions =
      querySnapshot.docs
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
  
    return transactions.sort(
      (
        firstTransaction,
        secondTransaction,
      ) => {
        const firstDate =
          firstTransaction.createdAt
            ?.toMillis?.()
          ?? 0;
  
        const secondDate =
          secondTransaction.createdAt
            ?.toMillis?.()
          ?? 0;
  
        return secondDate - firstDate;
      },
    );
  }
  
  
  export async function updateTransactionStatus(
    transactionId,
    newStatus,
  ) {
    const allowedStatuses = [
      "accepted",
      "rejected",
    ];
  
    if (
      !allowedStatuses.includes(
        newStatus,
      )
    ) {
      throw new Error(
        "invalid-transaction-status",
      );
    }
  
    const transactionReference =
      doc(
        db,
        TRANSACTIONS_COLLECTION,
        transactionId,
      );
  
    await updateDoc(
      transactionReference,
      {
        status:
          newStatus,
  
        updatedAt:
          serverTimestamp(),
      },
    );
  }
  
  
  export async function completeTransaction(
    transactionId,
    currentSellerCompanyId,
  ) {
    const transactionReference =
      doc(
        db,
        TRANSACTIONS_COLLECTION,
        transactionId,
      );
  
    /*
     * أولًا ننفذ تحديث المعاملة والأرصدة
     * كعملية Firestore آمنة واحدة.
     */
    const completionResult =
      await runTransaction(
        db,
        async (
          firestoreTransaction,
        ) => {
          const transactionSnapshot =
            await firestoreTransaction.get(
              transactionReference,
            );
  
          if (
            !transactionSnapshot.exists()
          ) {
            throw new Error(
              "transaction-not-found",
            );
          }
  
          const transactionData =
            transactionSnapshot.data();
  
          if (
            transactionData.sellerCompanyId
              !== currentSellerCompanyId
          ) {
            throw new Error(
              "unauthorized-transaction-completion",
            );
          }
  
          if (
            transactionData.status
              !== "accepted"
          ) {
            throw new Error(
              "transaction-not-accepted",
            );
          }
  
          const buyerReference =
            doc(
              db,
              COMPANIES_COLLECTION,
              transactionData.buyerCompanyId,
            );
  
          const sellerReference =
            doc(
              db,
              COMPANIES_COLLECTION,
              transactionData.sellerCompanyId,
            );
  
          const buyerSnapshot =
            await firestoreTransaction.get(
              buyerReference,
            );
  
          const sellerSnapshot =
            await firestoreTransaction.get(
              sellerReference,
            );
  
          if (
            !buyerSnapshot.exists()
            || !sellerSnapshot.exists()
          ) {
            throw new Error(
              "company-not-found",
            );
          }
  
          const buyerData =
            buyerSnapshot.data();
  
          const sellerData =
            sellerSnapshot.data();
  
          const transactionAmount =
            Number(
              transactionData.amount,
            ) || 0;
  
          const buyerCurrentBalance =
            Number(
              buyerData.balance,
            ) || 0;
  
          const sellerCurrentBalance =
            Number(
              sellerData.balance,
            ) || 0;
  
          const buyerCreditLimit =
            Number(
              buyerData.creditLimit,
            ) || 0;
  
          const buyerNewBalance =
            buyerCurrentBalance
            - transactionAmount;
  
          const sellerNewBalance =
            sellerCurrentBalance
            + transactionAmount;
  
          if (
            buyerNewBalance
              < -buyerCreditLimit
          ) {
            throw new Error(
              "credit-limit-exceeded",
            );
          }
  
          firestoreTransaction.update(
            buyerReference,
            {
              balance:
                buyerNewBalance,
            },
          );
  
          firestoreTransaction.update(
            sellerReference,
            {
              balance:
                sellerNewBalance,
            },
          );
  
          firestoreTransaction.update(
            transactionReference,
            {
              status:
                "completed",
  
              completedAt:
                serverTimestamp(),
  
              updatedAt:
                serverTimestamp(),
            },
          );
  
          return {
            buyerCompanyId:
              transactionData.buyerCompanyId,
  
            sellerCompanyId:
              transactionData.sellerCompanyId,
  
            buyerNewBalance,
            sellerNewBalance,
          };
        },
      );
  
    /*
     * بعد نجاح المعاملة نعيد تقييم
     * المشتري والبائع اعتمادًا على
     * سجل المعاملات المحدث.
     */
    const riskEvaluations =
      await evaluateCompaniesRisk([
        completionResult
          .buyerCompanyId,
  
        completionResult
          .sellerCompanyId,
      ]);
  
    return {
      ...completionResult,
      riskEvaluations,
    };
  }