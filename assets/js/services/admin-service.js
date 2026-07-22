import {
    db,
  } from "../../../firebase/firebase-config.js";

  import {
    createCompanyNotification,
  } from "./notification-repository.js";

  import {
    collection,
    getDocs,
    getDoc,
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
  if (!companyId) {
    throw new Error(
      "company-id-required",
    );
  }

  const companyReference =
    doc(
      db,
      "companies",
      companyId,
    );

  await updateDoc(
    companyReference,
    {
      accountStatus:
        "active",

      reviewedAt:
        new Date().toISOString(),

      rejectionReason:
        null,
    },
  );

  try {
    await createCompanyNotification({
      companyId,

      title:
        "تمت الموافقة على تسجيل المنشأة",

      message:
        "تمت الموافقة على طلب تسجيل منشأتكم، وأصبح الحساب نشطًا ويمكنكم الآن استخدام المنصة.",

      type:
        "success",

      category:
        "company",

      relatedEntityType:
        "company",

      relatedEntityId:
        companyId,
    });
  } catch (notificationError) {
    console.error(
      "تمت الموافقة على الشركة، لكن تعذر إنشاء الإشعار:",
      notificationError,
    );
  }

  return {
    success: true,
  };
}
  
  
export async function rejectCompanyRequest(
    companyId,
    rejectionReason = "",
  ) {
    if (!companyId) {
      throw new Error(
        "company-id-required",
      );
    }
  
    const normalizedRejectionReason =
      String(
        rejectionReason
        ?? "",
      ).trim();
  
    const companyReference =
      doc(
        db,
        "companies",
        companyId,
      );
  
    await updateDoc(
      companyReference,
      {
        accountStatus:
          "rejected",
  
        reviewedAt:
          new Date().toISOString(),
  
        rejectionReason:
          normalizedRejectionReason,
      },
    );
  
    try {
      await createCompanyNotification({
        companyId,
  
        title:
          "تم رفض طلب التسجيل",
  
        message:
          normalizedRejectionReason
            ? `تم رفض طلب تسجيل منشأتكم. السبب: ${normalizedRejectionReason}`
            : "تم رفض طلب تسجيل منشأتكم. يمكنكم التواصل مع إدارة المنصة لمزيد من التفاصيل.",
  
        type:
          "error",
  
        category:
          "company",
  
        relatedEntityType:
          "company",
  
        relatedEntityId:
          companyId,
      });
    } catch (notificationError) {
      console.error(
        "تم رفض الشركة، لكن تعذر إنشاء الإشعار:",
        notificationError,
      );
    }
  
    return {
      success: true,
    };
  }

  export async function getAllCompanies() {
    const companiesSnapshot =
      await getDocs(
        collection(
          db,
          "companies",
        ),
      );
  
    return companiesSnapshot.docs
      .map(
        (companyDocument) => ({
          id: companyDocument.id,
          ...companyDocument.data(),
        }),
      )
      .filter(
        (company) =>
          company.role !== "admin",
      )
      .sort(
        (firstCompany, secondCompany) => {
          const firstDate =
            getDateTimestamp(
              firstCompany.createdAt,
            );
  
          const secondDate =
            getDateTimestamp(
              secondCompany.createdAt,
            );
  
          return secondDate - firstDate;
        },
      );
  }
  
  
  export async function updateCompanyAccountStatus(
    companyId,
    accountStatus,
  ) {
    const allowedStatuses = [
      "active",
      "pending",
      "rejected",
      "suspended",
    ];
  
    if (!companyId) {
      throw new Error(
        "company-id-required",
      );
    }
  
    if (
      !allowedStatuses.includes(
        accountStatus,
      )
    ) {
      throw new Error(
        "حالة الحساب المطلوبة غير صالحة.",
      );
    }
  
    const companyReference =
      doc(
        db,
        "companies",
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
  
    const currentAccountStatus =
      companySnapshot.data()
        .accountStatus;
  
    if (
      currentAccountStatus
      === accountStatus
    ) {
      return {
        success: true,
        changed: false,
      };
    }
  
    await updateDoc(
      companyReference,
      {
        accountStatus,
  
        statusUpdatedAt:
          new Date().toISOString(),
      },
    );
  
    const notificationContent =
      getAccountStatusNotification(
        accountStatus,
      );
  
    if (notificationContent) {
      try {
        await createCompanyNotification({
          companyId,
  
          title:
            notificationContent.title,
  
          message:
            notificationContent.message,
  
          type:
            notificationContent.type,
  
          category:
            "company",
  
          relatedEntityType:
            "company",
  
          relatedEntityId:
            companyId,
        });
      } catch (notificationError) {
        console.error(
          "تم تحديث حالة الشركة، لكن تعذر إنشاء الإشعار:",
          notificationError,
        );
      }
    }
  
    return {
      success: true,
      changed: true,
    };
  }
  
  function getAccountStatusNotification(
    accountStatus,
  ) {
    const notificationsByStatus = {
      active: {
        title:
          "تم تفعيل الحساب",
  
        message:
          "تم تفعيل حساب منشأتكم، ويمكنكم الآن استخدام جميع الخدمات المتاحة في المنصة.",
  
        type:
          "success",
      },
  
      suspended: {
        title:
          "تم تعليق الحساب",
  
        message:
          "تم تعليق حساب منشأتكم مؤقتًا. يرجى التواصل مع إدارة المنصة لمعرفة التفاصيل.",
  
        type:
          "warning",
      },
  
      pending: {
        title:
          "الحساب قيد المراجعة",
  
        message:
          "تم تحويل حالة حساب منشأتكم إلى قيد المراجعة من قبل إدارة المنصة.",
  
        type:
          "info",
      },
  
      rejected: {
        title:
          "تم رفض الحساب",
  
        message:
          "تم تغيير حالة حساب منشأتكم إلى مرفوض. يرجى التواصل مع إدارة المنصة لمعرفة التفاصيل.",
  
        type:
          "error",
      },
    };
  
    return (
      notificationsByStatus[
        accountStatus
      ]
      ?? null
    );
  }

  function getDateTimestamp(
    dateValue,
  ) {
    if (!dateValue) {
      return 0;
    }
  
    if (
      typeof dateValue?.toDate
      === "function"
    ) {
      return dateValue
        .toDate()
        .getTime();
    }
  
    const parsedDate =
      new Date(
        dateValue,
      );
  
    return Number.isNaN(
      parsedDate.getTime(),
    )
      ? 0
      : parsedDate.getTime();
  }
