import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    collection,
    getDocs,
    query,
    updateDoc,
    doc,
    where,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  export async function getPendingCompanyRequests() {
    const pendingCompaniesQuery = query(
      collection(
        db,
        "companies",
      ),
      where(
        "accountStatus",
        "==",
        "pending",
      ),
    );
  
    const querySnapshot =
      await getDocs(
        pendingCompaniesQuery,
      );
  
    return querySnapshot.docs.map(
      (companyDocument) => ({
        id: companyDocument.id,
        ...companyDocument.data(),
      }),
    );
  }
  
  
  export async function approveCompanyRequest(
    companyId,
  ) {
    const companyReference = doc(
      db,
      "companies",
      companyId,
    );
  
    await updateDoc(
      companyReference,
      {
        accountStatus: "active",
        reviewedAt:
          new Date().toISOString(),
        rejectionReason: null,
      },
    );
  
    return {
      success: true,
    };
  }
  
  
  export async function rejectCompanyRequest(
    companyId,
    rejectionReason = "",
  ) {
    const companyReference = doc(
      db,
      "companies",
      companyId,
    );
  
    await updateDoc(
      companyReference,
      {
        accountStatus: "rejected",
        reviewedAt:
          new Date().toISOString(),
        rejectionReason:
          rejectionReason.trim(),
      },
    );
  
    return {
      success: true,
    };
  }