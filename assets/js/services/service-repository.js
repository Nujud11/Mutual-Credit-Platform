import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    updateDoc,
    query,
    serverTimestamp,
    where,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const SERVICES_COLLECTION =
    "services";

  const COMPANIES_COLLECTION =
    "companies";

  const TRANSACTIONS_COLLECTION =
    "transactions";

  
  export async function createService(
    serviceData,
  ) {
    const serviceDocument = {
      companyId:
        serviceData.companyId,
  
      companyName:
        serviceData.companyName,
  
      title:
        serviceData.title.trim(),
  
      category:
        serviceData.category,
  
      description:
        serviceData.description.trim(),
  
      price:
        Number(serviceData.price),
  
      status:
        "active",
  
      createdAt:
        serverTimestamp(),
    };
  
    const documentReference =
      await addDoc(
        collection(
          db,
          SERVICES_COLLECTION,
        ),
        serviceDocument,
      );
  
    return {
      id: documentReference.id,
      ...serviceDocument,
    };
  }
  
  
  export async function getCompanyServices(
    companyId,
  ) {
    const servicesQuery =
      query(
        collection(
          db,
          SERVICES_COLLECTION,
        ),
  
        where(
          "companyId",
          "==",
          companyId,
        ),
      );
  
    const querySnapshot =
      await getDocs(servicesQuery);
  
    const services =
      querySnapshot.docs.map(
        (serviceDocument) => ({
          id: serviceDocument.id,
          ...serviceDocument.data(),
        }),
      );
  
    return services.sort(
      (firstService, secondService) => {
        const firstDate =
          firstService.createdAt
            ?.toMillis?.()
          ?? 0;
  
        const secondDate =
          secondService.createdAt
            ?.toMillis?.()
          ?? 0;
  
        return secondDate - firstDate;
      },
    );
  }
  
  
  export async function deleteService(
    serviceId,
  ) {
    if (!serviceId) {
      throw new Error(
        "service-not-found",
      );
    }

    const relatedTransactionsQuery =
      query(
        collection(
          db,
          TRANSACTIONS_COLLECTION,
        ),
        where(
          "serviceId",
          "==",
          serviceId,
        ),
      );

    const transactionsSnapshot =
      await getDocs(
        relatedTransactionsQuery,
      );

    const blockingStatuses =
      new Set([
        "pending",
        "accepted",
      ]);

    const hasActiveTransactions =
      transactionsSnapshot.docs.some(
        (transactionDocument) => {
          const transactionData =
            transactionDocument.data();

          return blockingStatuses.has(
            transactionData.status,
          );
        },
      );

    if (hasActiveTransactions) {
      throw new Error(
        "service-has-active-transactions",
      );
    }

    await deleteDoc(
      doc(
        db,
        SERVICES_COLLECTION,
        serviceId,
      ),
    );
  }

  export async function updateServiceStatus(
    serviceId,
    status,
  ) {
    const allowedStatuses = [
      "active",
      "inactive",
    ];
  
    if (
      !allowedStatuses.includes(status)
    ) {
      throw new Error(
        "invalid-service-status",
      );
    }
  
    await updateDoc(
      doc(
        db,
        SERVICES_COLLECTION,
        serviceId,
      ),
      {
        status,
        updatedAt:
          serverTimestamp(),
      },
    );
  }

  export async function getMarketplaceServices(
    currentCompanyId,
  ) {
    const [
      servicesSnapshot,
      companiesSnapshot,
    ] = await Promise.all([
      getDocs(
        collection(
          db,
          SERVICES_COLLECTION,
        ),
      ),
  
      getDocs(
        collection(
          db,
          COMPANIES_COLLECTION,
        ),
      ),
    ]);
  
    const activeCompanyIds =
      new Set(
        companiesSnapshot.docs
          .filter(
            (companyDocument) =>
              companyDocument.data()
                .accountStatus
                === "active",
          )
          .map(
            (companyDocument) =>
              companyDocument.id,
          ),
      );
  
    const services =
      servicesSnapshot.docs
        .map(
          (serviceDocument) => ({
            id: serviceDocument.id,
            ...serviceDocument.data(),
          }),
        )
        .filter(
          (service) => {
            const belongsToAnotherCompany =
              service.companyId
              !== currentCompanyId;
  
            const isServiceActive =
              service.status
              === "active";
  
            const isCompanyActive =
              activeCompanyIds.has(
                service.companyId,
              );
  
            return (
              belongsToAnotherCompany
              && isServiceActive
              && isCompanyActive
            );
          },
        );
  
    return services.sort(
      (
        firstService,
        secondService,
      ) => {
        const firstDate =
          firstService.createdAt
            ?.toMillis?.()
          ?? 0;
  
        const secondDate =
          secondService.createdAt
            ?.toMillis?.()
          ?? 0;
  
        return secondDate - firstDate;
      },
    );
  }