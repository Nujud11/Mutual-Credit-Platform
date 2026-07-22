import {
    db,
  } from "../../../firebase/firebase-config.js";
  
  import {
    addDoc,
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
    writeBatch,
  } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
  
  
  const NOTIFICATIONS_COLLECTION =
    "notifications";
  
  const allowedRecipientRoles = [
    "admin",
    "company",
  ];
  
  const allowedNotificationTypes = [
    "info",
    "success",
    "warning",
    "error",
  ];
  
  const allowedNotificationCategories = [
    "company",
    "service",
    "transaction",
    "subscription",
    "system",
  ];
  
  
  /**
   * إنشاء إشعار عام.
   */
  export async function createNotification({
    recipientRole,
    recipientId = null,
    title,
    message,
    type = "info",
    category = "system",
    relatedEntityType = null,
    relatedEntityId = null,
  }) {
    validateNotificationData({
      recipientRole,
      recipientId,
      title,
      message,
      type,
      category,
    });
  
    const now =
      new Date().toISOString();
  
    const notificationData = {
      recipientRole,
  
      recipientId:
        recipientRole === "admin"
          ? null
          : recipientId,
  
      title:
        String(title).trim(),
  
      message:
        String(message).trim(),
  
      type,
  
      category,
  
      relatedEntityType:
        relatedEntityType
          ? String(
              relatedEntityType,
            ).trim()
          : null,
  
      relatedEntityId:
        relatedEntityId
          ? String(
              relatedEntityId,
            ).trim()
          : null,
  
      isRead: false,
  
      createdAt:
        now,
  
      readAt:
        null,
    };
  
    const notificationReference =
      await addDoc(
        collection(
          db,
          NOTIFICATIONS_COLLECTION,
        ),
        notificationData,
      );
  
    return {
      id:
        notificationReference.id,
  
      ...notificationData,
    };
  }
  
  
  /**
   * إنشاء إشعار لجميع حسابات الإدارة.
   */
  export async function createAdminNotification({
    title,
    message,
    type = "info",
    category = "system",
    relatedEntityType = null,
    relatedEntityId = null,
  }) {
    return createNotification({
      recipientRole:
        "admin",
  
      recipientId:
        null,
  
      title,
  
      message,
  
      type,
  
      category,
  
      relatedEntityType,
  
      relatedEntityId,
    });
  }
  
  
  /**
   * إنشاء إشعار لمنشأة محددة.
   */
  export async function createCompanyNotification({
    companyId,
    title,
    message,
    type = "info",
    category = "system",
    relatedEntityType = null,
    relatedEntityId = null,
  }) {
    if (!companyId) {
      throw new Error(
        "notification-company-id-required",
      );
    }
  
    return createNotification({
      recipientRole:
        "company",
  
      recipientId:
        companyId,
  
      title,
  
      message,
  
      type,
  
      category,
  
      relatedEntityType,
  
      relatedEntityId,
    });
  }
  
  
  /**
   * جلب إشعارات المستخدم الحالي.
   *
   * الإداري يرى جميع الإشعارات الموجهة للإدارة.
   * المنشأة ترى الإشعارات الموجهة إلى حسابها فقط.
   */
  export async function getUserNotifications(
    currentUser,
    maximumResults = 20,
  ) {
    if (!currentUser) {
      throw new Error(
        "notification-user-required",
      );
    }
  
    const userRole =
      currentUser.role === "admin"
        ? "admin"
        : "company";
  
    let notificationsQuery;
  
    if (userRole === "admin") {
      notificationsQuery =
        query(
          collection(
            db,
            NOTIFICATIONS_COLLECTION,
          ),
  
          where(
            "recipientRole",
            "==",
            "admin",
          ),
        );
    } else {
      if (!currentUser.id) {
        throw new Error(
          "notification-company-id-required",
        );
      }
  
      notificationsQuery =
        query(
          collection(
            db,
            NOTIFICATIONS_COLLECTION,
          ),
  
          where(
            "recipientId",
            "==",
            currentUser.id,
          ),
        );
    }
  
    const notificationsSnapshot =
      await getDocs(
        notificationsQuery,
      );
  
    return notificationsSnapshot.docs
      .map(
        (notificationDocument) => ({
          id:
            notificationDocument.id,
  
          ...notificationDocument.data(),
        }),
      )
      .filter(
        (notification) =>
          notification.recipientRole
            === userRole,
      )
      .sort(
        (
          firstNotification,
          secondNotification,
        ) => {
          const firstDate =
            getDateTimestamp(
              firstNotification.createdAt,
            );
  
          const secondDate =
            getDateTimestamp(
              secondNotification.createdAt,
            );
  
          return secondDate - firstDate;
        },
      )
      .slice(
        0,
        normalizeMaximumResults(
          maximumResults,
        ),
      );
  }
  
  
  /**
   * حساب الإشعارات غير المقروءة.
   */
  export async function getUnreadNotificationsCount(
    currentUser,
  ) {
    const notifications =
      await getUserNotifications(
        currentUser,
        100,
      );
  
    return notifications.filter(
      (notification) =>
        notification.isRead !== true,
    ).length;
  }
  
  
  /**
   * تحديد إشعار واحد كمقروء.
   */
  export async function markNotificationAsRead(
    notificationId,
  ) {
    if (!notificationId) {
      throw new Error(
        "notification-id-required",
      );
    }
  
    const notificationReference =
      doc(
        db,
        NOTIFICATIONS_COLLECTION,
        notificationId,
      );
  
    await updateDoc(
      notificationReference,
      {
        isRead:
          true,
  
        readAt:
          new Date().toISOString(),
      },
    );
  
    return {
      success: true,
    };
  }
  
  
  /**
   * تحديد جميع إشعارات المستخدم كمقروءة.
   */
  export async function markAllNotificationsAsRead(
    currentUser,
  ) {
    const notifications =
      await getUserNotifications(
        currentUser,
        100,
      );
  
    const unreadNotifications =
      notifications.filter(
        (notification) =>
          notification.isRead !== true,
      );
  
    if (!unreadNotifications.length) {
      return {
        success: true,
        updatedCount: 0,
      };
    }
  
    const batch =
      writeBatch(db);
  
    const readAt =
      new Date().toISOString();
  
    unreadNotifications.forEach(
      (notification) => {
        const notificationReference =
          doc(
            db,
            NOTIFICATIONS_COLLECTION,
            notification.id,
          );
  
        batch.update(
          notificationReference,
          {
            isRead:
              true,
  
            readAt,
          },
        );
      },
    );
  
    await batch.commit();
  
    return {
      success: true,
  
      updatedCount:
        unreadNotifications.length,
    };
  }
  
  
  /**
   * التحقق من صحة بيانات الإشعار.
   */
  function validateNotificationData({
    recipientRole,
    recipientId,
    title,
    message,
    type,
    category,
  }) {
    if (
      !allowedRecipientRoles.includes(
        recipientRole,
      )
    ) {
      throw new Error(
        "invalid-notification-recipient-role",
      );
    }
  
    if (
      recipientRole === "company"
      && !recipientId
    ) {
      throw new Error(
        "notification-company-id-required",
      );
    }
  
    if (
      !String(
        title ?? "",
      ).trim()
    ) {
      throw new Error(
        "notification-title-required",
      );
    }
  
    if (
      !String(
        message ?? "",
      ).trim()
    ) {
      throw new Error(
        "notification-message-required",
      );
    }
  
    if (
      !allowedNotificationTypes.includes(
        type,
      )
    ) {
      throw new Error(
        "invalid-notification-type",
      );
    }
  
    if (
      !allowedNotificationCategories.includes(
        category,
      )
    ) {
      throw new Error(
        "invalid-notification-category",
      );
    }
  }
  
  
  function normalizeMaximumResults(
    maximumResults,
  ) {
    const parsedMaximum =
      Number(maximumResults);
  
    if (
      !Number.isInteger(
        parsedMaximum,
      )
      || parsedMaximum <= 0
    ) {
      return 20;
    }
  
    return Math.min(
      parsedMaximum,
      100,
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