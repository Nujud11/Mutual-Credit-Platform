import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    serverTimestamp,
    where,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const SERVICES_COLLECTION =
    "services";
  
  
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
    await deleteDoc(
      doc(
        db,
        SERVICES_COLLECTION,
        serviceId,
      ),
    );
  }

  export async function getMarketplaceServices(
    currentCompanyId,
  ) {
    const querySnapshot =
      await getDocs(
        collection(
          db,
          SERVICES_COLLECTION,
        ),
      );
  
    const services =
      querySnapshot.docs
        .map((serviceDocument) => ({
          id: serviceDocument.id,
          ...serviceDocument.data(),
        }))
        .filter((service) => {
          const belongsToAnotherCompany =
            service.companyId
            !== currentCompanyId;
  
          const isActive =
            service.status === "active";
  
          return (
            belongsToAnotherCompany
            && isActive
          );
        });
  
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