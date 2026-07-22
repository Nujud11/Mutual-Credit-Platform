import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    runTransaction,
    serverTimestamp,
    updateDoc,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  import {
    evaluateCompaniesRisk,
  } from "./risk-service.js";

  import {
    createCompanyNotification,
  } from "./notification-repository.js";
  
  
  const TRANSACTIONS_COLLECTION =
    "transactions";
  
  const COMPANIES_COLLECTION =
    "companies";

  const SERVICES_COLLECTION =
    "services";
  
  
  export async function createTransaction(
    transactionData,
  ) {
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

    const serviceReference =
      doc(
        db,
        SERVICES_COLLECTION,
        transactionData.serviceId,
      );

    const [
      buyerSnapshot,
      sellerSnapshot,
      serviceSnapshot,
    ] = await Promise.all([
      getDoc(buyerReference),
      getDoc(sellerReference),
      getDoc(serviceReference),
    ]);

    if (
      !buyerSnapshot.exists()
      || !sellerSnapshot.exists()
    ) {
      throw new Error(
        "company-not-found",
      );
    }

    if (!serviceSnapshot.exists()) {
      throw new Error(
        "service-not-found",
      );
    }

    const buyerData =
      buyerSnapshot.data();

    const sellerData =
      sellerSnapshot.data();

    const serviceData =
      serviceSnapshot.data();

    if (
      buyerData.accountStatus
        !== "active"
      || sellerData.accountStatus
        !== "active"
    ) {
      throw new Error(
        "company-not-active",
      );
    }

    if (
      serviceData.status
        !== "active"
    ) {
      throw new Error(
        "service-not-active",
      );
    }

    if (
      serviceData.companyId
        !== transactionData
          .sellerCompanyId
    ) {
      throw new Error(
        "invalid-service-provider",
      );
    }

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
    
    /*
    * بعد نجاح إنشاء طلب الخدمة،
    * ننشئ إشعارًا لمقدم الخدمة.
    *
    * لا نوقف إنشاء المعاملة إذا فشل
    * الإشعار حتى لا يتكرر الطلب عند
    * إعادة المحاولة.
    */
    try {
      await createCompanyNotification({
        companyId:
          transactionData.sellerCompanyId,
    
        title:
          "طلب خدمة جديد",
    
        message:
          `تم استلام طلب لخدمة "${transactionData.serviceName}" من ${transactionData.buyerCompanyName} بقيمة ${Number(
            transactionData.amount,
          )} MQ.`,
    
        type:
          "info",
    
        category:
          "transaction",
    
        relatedEntityType:
          "transaction",
    
        relatedEntityId:
          documentReference.id,
      });
    
    } catch (notificationError) {
      console.error(
        "تم إنشاء طلب الخدمة، لكن تعذر إنشاء الإشعار:",
        notificationError,
      );
    }
    
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
  
    const transactionSnapshot =
      await getDoc(
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
  
      /*
        * عند قبول الطلب نتحقق من:
        * 1. أن الشركتين نشطتان.
        * 2. أن الخدمة ما زالت نشطة.
        *
        * عند رفض الطلب نسمح بالرفض
        * حتى لو كانت الخدمة متوقفة.
        */
    if (newStatus === "accepted") {
      await ensureCompaniesAreActive(
        transactionData.buyerCompanyId,
        transactionData.sellerCompanyId,
      );
    
      await ensureServiceIsActive(
        transactionData.serviceId,
      );
    }
  
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

  async function ensureCompaniesAreActive(
    buyerCompanyId,
    sellerCompanyId,
  ) {
    const buyerReference =
      doc(
        db,
        COMPANIES_COLLECTION,
        buyerCompanyId,
      );
  
    const sellerReference =
      doc(
        db,
        COMPANIES_COLLECTION,
        sellerCompanyId,
      );
  
    const [
      buyerSnapshot,
      sellerSnapshot,
    ] = await Promise.all([
      getDoc(buyerReference),
      getDoc(sellerReference),
    ]);
  
    if (
      !buyerSnapshot.exists()
      || !sellerSnapshot.exists()
    ) {
      throw new Error(
        "company-not-found",
      );
    }
  
    const buyerStatus =
      buyerSnapshot.data()
        .accountStatus;
  
    const sellerStatus =
      sellerSnapshot.data()
        .accountStatus;
  
    if (
      buyerStatus !== "active"
      || sellerStatus !== "active"
    ) {
      throw new Error(
        "company-not-active",
      );
    }
  }
  
  async function ensureServiceIsActive(
    serviceId,
  ) {
    if (!serviceId) {
      throw new Error(
        "service-not-found",
      );
    }
  
    const serviceReference =
      doc(
        db,
        SERVICES_COLLECTION,
        serviceId,
      );
  
    const serviceSnapshot =
      await getDoc(
        serviceReference,
      );
  
    if (!serviceSnapshot.exists()) {
      throw new Error(
        "service-not-found",
      );
    }
  
    const serviceData =
      serviceSnapshot.data();
  
    if (
      serviceData.status
        !== "active"
    ) {
      throw new Error(
        "service-not-active",
      );
    }
  
    return serviceData;
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

          if (
            buyerData.accountStatus
              !== "active"
            || sellerData.accountStatus
              !== "active"
          ) {
            throw new Error(
              "company-not-active",
            );
          }
  
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