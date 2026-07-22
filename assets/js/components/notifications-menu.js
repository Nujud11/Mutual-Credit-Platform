import {
    getUserNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } from "../services/notification-repository.js";
  
  
  let notificationsCurrentUser = null;
  
  let currentNotifications = [];
  
  
  export async function initializeNotificationsMenu({
    currentUser,
  }) {
    notificationsCurrentUser =
      currentUser;
  
    const menuButton =
      document.getElementById(
        "notifications-menu-button",
      );
  
    const dropdown =
      document.getElementById(
        "notifications-dropdown",
      );
  
    const markAllButton =
      document.getElementById(
        "mark-all-notifications-read-button",
      );
  
    if (
      !menuButton
      || !dropdown
    ) {
      return;
    }
  
    menuButton.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
  
        dropdown.classList.toggle(
          "hidden",
        );
  
        menuButton.setAttribute(
          "aria-expanded",
          String(
            !dropdown.classList.contains(
              "hidden",
            ),
          ),
        );
      },
    );
  
    dropdown.addEventListener(
      "click",
      (event) => {
        event.stopPropagation();
      },
    );
  
    document.addEventListener(
      "click",
      () => {
        dropdown.classList.add(
          "hidden",
        );
  
        menuButton.setAttribute(
          "aria-expanded",
          "false",
        );
      },
      {
        once: true,
      },
    );
  
    markAllButton?.addEventListener(
      "click",
      handleMarkAllAsRead,
    );
  
    await loadNotifications();
  }
  
  
  async function loadNotifications() {
    const listElement =
      document.getElementById(
        "notifications-list",
      );
  
    if (!listElement) {
      return;
    }
  
    listElement.innerHTML =
      renderLoadingState();
  
    try {
      currentNotifications =
        await getUserNotifications(
          notificationsCurrentUser,
          20,
        );
  
      renderNotifications();
  
    } catch (error) {
      console.error(
        "تعذر تحميل الإشعارات:",
        error,
      );
  
      listElement.innerHTML =
        renderErrorState();
  
      updateUnreadBadge(0);
    }
  }
  
  
  function renderNotifications() {
    const listElement =
      document.getElementById(
        "notifications-list",
      );
  
    const markAllButton =
      document.getElementById(
        "mark-all-notifications-read-button",
      );
  
    if (!listElement) {
      return;
    }
  
    const unreadCount =
      currentNotifications.filter(
        (notification) =>
          notification.isRead !== true,
      ).length;
  
    updateUnreadBadge(
      unreadCount,
    );
  
    if (markAllButton) {
      markAllButton.disabled =
        unreadCount === 0;
    }
  
    if (!currentNotifications.length) {
      listElement.innerHTML =
        renderEmptyState();
  
      return;
    }
  
    listElement.innerHTML =
      currentNotifications
        .map(
          renderNotificationItem,
        )
        .join("");
  
    attachNotificationEvents();
  }
  
  
  function renderNotificationItem(
    notification,
  ) {
    const unreadClass =
      notification.isRead === true
        ? ""
        : "notification-item--unread";
  
    return `
      <button
        class="
          notification-item
          ${unreadClass}
        "
        data-notification-id="${escapeHtml(
          notification.id,
        )}"
        data-notification-read="${
          notification.isRead === true
            ? "true"
            : "false"
        }"
        type="button"
      >
        <span
          class="
            notification-type-icon
            notification-type-icon--${escapeHtml(
              notification.type
              ?? "info",
            )}
          "
        >
          ${getNotificationIcon(
            notification.category,
          )}
        </span>
  
        <span class="notification-content">
          <strong>
            ${escapeHtml(
              notification.title
              ?? "إشعار جديد",
            )}
          </strong>
  
          <span>
            ${escapeHtml(
              notification.message
              ?? "",
            )}
          </span>
  
          <small>
            ${formatNotificationDate(
              notification.createdAt,
            )}
          </small>
        </span>
  
        ${
          notification.isRead === true
            ? ""
            : `
              <span
                class="notification-unread-dot"
                aria-label="غير مقروء"
              ></span>
            `
        }
      </button>
    `;
  }
  
  
  function attachNotificationEvents() {
    const notificationItems =
      document.querySelectorAll(
        "[data-notification-id]",
      );
  
    notificationItems.forEach(
      (item) => {
        item.addEventListener(
          "click",
          async () => {
            const notificationId =
              item.dataset.notificationId;
  
            const isAlreadyRead =
              item.dataset.notificationRead
                === "true";
  
            if (
              !notificationId
              || isAlreadyRead
            ) {
              return;
            }
  
            item.disabled = true;
  
            try {
              await markNotificationAsRead(
                notificationId,
              );
  
              currentNotifications =
                currentNotifications.map(
                  (notification) =>
                    notification.id
                      === notificationId
                      ? {
                          ...notification,
                          isRead: true,
                          readAt:
                            new Date()
                              .toISOString(),
                        }
                      : notification,
                );
  
              renderNotifications();
  
            } catch (error) {
              console.error(
                "تعذر تحديث الإشعار:",
                error,
              );
  
              item.disabled = false;
            }
          },
        );
      },
    );
  }
  
  
  async function handleMarkAllAsRead() {
    const markAllButton =
      document.getElementById(
        "mark-all-notifications-read-button",
      );
  
    if (!markAllButton) {
      return;
    }
  
    const originalText =
      markAllButton.textContent;
  
    markAllButton.disabled = true;
  
    markAllButton.textContent =
      "جاري التحديث...";
  
    try {
      await markAllNotificationsAsRead(
        notificationsCurrentUser,
      );
  
      const readAt =
        new Date().toISOString();
  
      currentNotifications =
        currentNotifications.map(
          (notification) => ({
            ...notification,
            isRead: true,
            readAt,
          }),
        );
  
      renderNotifications();
  
    } catch (error) {
      console.error(
        "تعذر تحديد الإشعارات كمقروءة:",
        error,
      );
  
      markAllButton.disabled = false;
  
    } finally {
      markAllButton.textContent =
        originalText;
    }
  }
  
  
  function updateUnreadBadge(
    unreadCount,
  ) {
    const badge =
      document.getElementById(
        "notifications-unread-badge",
      );
  
    if (!badge) {
      return;
    }
  
    if (unreadCount <= 0) {
      badge.classList.add(
        "hidden",
      );
  
      badge.textContent =
        "0";
  
      return;
    }
  
    badge.classList.remove(
      "hidden",
    );
  
    badge.textContent =
      unreadCount > 99
        ? "+99"
        : formatNumber(
            unreadCount,
          );
  }
  
  
  function getNotificationIcon(
    category,
  ) {
    const icons = {
      company: "▣",
      service: "◇",
      transaction: "⇄",
      subscription: "★",
      system: "◉",
    };
  
    return icons[category]
      ?? icons.system;
  }
  
  
  function formatNotificationDate(
    dateValue,
  ) {
    const date =
      parseDate(
        dateValue,
      );
  
    if (!date) {
      return "";
    }
  
    const difference =
      Date.now()
      - date.getTime();
  
    const minute =
      60 * 1000;
  
    const hour =
      60 * minute;
  
    const day =
      24 * hour;
  
    if (difference < minute) {
      return "الآن";
    }
  
    if (difference < hour) {
      const minutes =
        Math.floor(
          difference / minute,
        );
  
      return `قبل ${formatNumber(
        minutes,
      )} دقيقة`;
    }
  
    if (difference < day) {
      const hours =
        Math.floor(
          difference / hour,
        );
  
      return `قبل ${formatNumber(
        hours,
      )} ساعة`;
    }
  
    if (difference < 7 * day) {
      const days =
        Math.floor(
          difference / day,
        );
  
      return `قبل ${formatNumber(
        days,
      )} يوم`;
    }
  
    return new Intl.DateTimeFormat(
      "ar-SA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    ).format(date);
  }
  
  
  function parseDate(
    dateValue,
  ) {
    if (!dateValue) {
      return null;
    }
  
    const date =
      typeof dateValue?.toDate
        === "function"
        ? dateValue.toDate()
        : new Date(dateValue);
  
    return Number.isNaN(
      date.getTime(),
    )
      ? null
      : date;
  }
  
  
  function formatNumber(
    value,
  ) {
    return new Intl.NumberFormat(
      "ar-SA",
    ).format(
      Number(value ?? 0),
    );
  }
  
  
  function renderLoadingState() {
    return `
      <div class="notifications-state">
        <span class="notifications-loading-icon">
          ◌
        </span>
  
        <p>
          جاري تحميل الإشعارات...
        </p>
      </div>
    `;
  }
  
  
  function renderEmptyState() {
    return `
      <div class="notifications-state">
        <span>
          ◉
        </span>
  
        <strong>
          لا توجد إشعارات
        </strong>
  
        <p>
          ستظهر هنا آخر التحديثات
          المتعلقة بالحساب.
        </p>
      </div>
    `;
  }
  
  
  function renderErrorState() {
    return `
      <div
        class="
          notifications-state
          notifications-state--error
        "
      >
        <span>
          !
        </span>
  
        <strong>
          تعذر تحميل الإشعارات
        </strong>
  
        <p>
          تحقق من الاتصال ثم حاول مجددًا.
        </p>
      </div>
    `;
  }
  
  
  function escapeHtml(
    value,
  ) {
    return String(
      value ?? "",
    )
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }