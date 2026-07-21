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

  export async function getAdminDashboardData() {
    const companiesSnapshot =
      await getDocs(
        collection(
          db,
          "companies",
        ),
      );
  
    const companies =
      companiesSnapshot.docs.map(
        (companyDocument) => ({
          id: companyDocument.id,
          ...companyDocument.data(),
        }),
      );
  
    const companyAccounts =
      companies.filter(
        (company) =>
          company.role !== "admin",
      );
  
    const activeCompanies =
      companyAccounts.filter(
        (company) =>
          company.accountStatus === "active",
      );
  
    const pendingCompanies =
      companyAccounts.filter(
        (company) =>
          company.accountStatus === "pending",
      );
  
    const rejectedCompanies =
      companyAccounts.filter(
        (company) =>
          company.accountStatus === "rejected",
      );
  
    const latestRequests =
      [...companyAccounts]
        .sort(
          (firstCompany, secondCompany) => {
            const firstDate =
              new Date(
                firstCompany.createdAt ?? 0,
              ).getTime();
  
            const secondDate =
              new Date(
                secondCompany.createdAt ?? 0,
              ).getTime();
  
            return secondDate - firstDate;
          },
        )
        .slice(0, 5);
  
    return {
      totalCompanies:
        companyAccounts.length,
  
      activeCompanies:
        activeCompanies.length,
  
      pendingCompanies:
        pendingCompanies.length,
  
      rejectedCompanies:
        rejectedCompanies.length,
  
      latestRequests,
    };
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