import {
    approveSubscriptionRequest,
    getAllSubscriptionRequests,
    rejectSubscriptionRequest,
  } from "../services/subscription-repository.js";
  
  
  const subscriptionPlans = {
    basic: {
      name: "الباقة الأساسية",
      price: "مجانية",
    },
  
    professional: {
      name: "الباقة الاحترافية",
      price: "99 ريال / شهر",
    },
  
    enterprise: {
      name: "الباقة المؤسسية",
      price: "299 ريال / شهر",
    },
  };
  
  
  let allSubscriptionRequests = [];
  
  let currentStatusFilter =
    "all";
  
  
  export function renderAdminSubscriptionsPage() {
    return `
      <section class="admin-page">
  
        <section class="admin-hero">
  
          <div class="admin-hero-content">
  
            <span class="admin-hero-label">
              إدارة منصة مقاصة
            </span>
  
            <h2>
              إدارة الاشتراكات
            </h2>
  
            <p>
              راجع طلبات تغيير الباقات،
              واعتمد اشتراكات المنشآت
              أو ارفضها من مكان واحد.
            </p>
  
          </div>
  
          <button
            id="refresh-subscription-requests-button"
            class="admin-hero-button"
            type="button"
          >
            تحديث الطلبات
          </button>
  
        </section>
  
  
        <div
          id="admin-subscriptions-message"
          class="hidden"
        ></div>
  
  
        <section
          id="admin-subscription-statistics"
          class="admin-subscription-statistics"
        >
          ${renderStatisticsLoadingState()}
        </section>
  
  
        <section class="admin-subscriptions-panel">
  
          <div class="admin-subscriptions-panel-header">
  
            <div>
              <h3>
                طلبات تغيير الباقات
              </h3>
  
              <p>
                يمكنك مراجعة الباقة الحالية
                والمطلوبة واتخاذ القرار المناسب.
              </p>
            </div>
  
            <select
              id="subscription-request-status-filter"
            >
              <option value="all">
                جميع الحالات
              </option>
  
              <option value="pending">
                قيد المراجعة
              </option>
  
              <option value="approved">
                تمت الموافقة
              </option>
  
              <option value="rejected">
                مرفوضة
              </option>
            </select>
  
          </div>
  
  
          <div
            id="admin-subscription-results-summary"
            class="admin-subscription-results-summary"
          ></div>
  
  
          <div
            id="admin-subscription-requests-list"
            class="admin-subscription-requests-list"
          >
            ${renderRequestsLoadingState()}
          </div>
  
        </section>
  
      </section>
    `;
  }
  
  
  export function initializeAdminSubscriptionsPage() {
    attachPageEvents();
  
    loadSubscriptionRequests();
  }
  
  
  function attachPageEvents() {
    const refreshButton =
      document.getElementById(
        "refresh-subscription-requests-button",
      );
  
    const statusFilter =
      document.getElementById(
        "subscription-request-status-filter",
      );
  
    refreshButton?.addEventListener(
      "click",
      () => {
        loadSubscriptionRequests();
      },
    );
  
    statusFilter?.addEventListener(
      "change",
      (event) => {
        currentStatusFilter =
          event.target.value;
  
        renderFilteredRequests();
      },
    );
  }
  
  
  async function loadSubscriptionRequests() {
    const requestsList =
      document.getElementById(
        "admin-subscription-requests-list",
      );
  
    const statisticsContainer =
      document.getElementById(
        "admin-subscription-statistics",
      );
  
    hideAdminSubscriptionsMessage();
  
    if (requestsList) {
      requestsList.innerHTML =
        renderRequestsLoadingState();
    }
  
    if (statisticsContainer) {
      statisticsContainer.innerHTML =
        renderStatisticsLoadingState();
    }
  
    try {
      allSubscriptionRequests =
        await getAllSubscriptionRequests();
  
      renderStatistics();
  
      renderFilteredRequests();
  
    } catch (error) {
      console.error(
        "تعذر تحميل طلبات الاشتراك:",
        error,
      );
  
      if (requestsList) {
        requestsList.innerHTML =
          renderRequestsErrorState();
      }
  
      if (statisticsContainer) {
        statisticsContainer.innerHTML =
          renderStatisticsErrorState();
      }
  
      showAdminSubscriptionsMessage(
        "تعذر تحميل طلبات الاشتراك. تحقق من الاتصال ثم حاول مجددًا.",
        "error",
      );
    }
  }
  
  
  function renderStatistics() {
    const statisticsContainer =
      document.getElementById(
        "admin-subscription-statistics",
      );
  
    if (!statisticsContainer) {
      return;
    }
  
    const pendingCount =
      allSubscriptionRequests.filter(
        (request) =>
          request.status === "pending",
      ).length;
  
    const approvedCount =
      allSubscriptionRequests.filter(
        (request) =>
          request.status === "approved",
      ).length;
  
    const rejectedCount =
      allSubscriptionRequests.filter(
        (request) =>
          request.status === "rejected",
      ).length;
  
    statisticsContainer.innerHTML = `
      ${renderStatisticCard({
        label: "إجمالي الطلبات",
        value:
          allSubscriptionRequests.length,
        type: "total",
        icon: "▣",
      })}
  
      ${renderStatisticCard({
        label: "قيد المراجعة",
        value:
          pendingCount,
        type: "pending",
        icon: "◷",
      })}
  
      ${renderStatisticCard({
        label: "تمت الموافقة",
        value:
          approvedCount,
        type: "approved",
        icon: "✓",
      })}
  
      ${renderStatisticCard({
        label: "الطلبات المرفوضة",
        value:
          rejectedCount,
        type: "rejected",
        icon: "×",
      })}
    `;
  }
  
  
  function renderStatisticCard({
    label,
    value,
    type,
    icon,
  }) {
    return `
      <article
        class="
          admin-subscription-stat-card
          ${type}
        "
      >
  
        <span class="admin-subscription-stat-icon">
          ${icon}
        </span>
  
        <div>
          <span>
            ${label}
          </span>
  
          <strong>
            ${formatNumber(value)}
          </strong>
        </div>
  
      </article>
    `;
  }
  
  
  function renderFilteredRequests() {
    const requestsList =
      document.getElementById(
        "admin-subscription-requests-list",
      );
  
    const resultsSummary =
      document.getElementById(
        "admin-subscription-results-summary",
      );
  
    if (!requestsList) {
      return;
    }
  
    const filteredRequests =
      allSubscriptionRequests.filter(
        (request) =>
          currentStatusFilter === "all"
          || request.status
            === currentStatusFilter,
      );
  
    if (resultsSummary) {
      resultsSummary.textContent =
        `تم العثور على ${formatNumber(
          filteredRequests.length,
        )} طلب`;
    }
  
    if (!filteredRequests.length) {
      requestsList.innerHTML =
        renderEmptyRequestsState();
  
      return;
    }
  
    requestsList.innerHTML =
      filteredRequests
        .map(
          (request) =>
            renderSubscriptionRequestCard(
              request,
            ),
        )
        .join("");
  
    attachRequestActionEvents();
  }
  
  
  function renderSubscriptionRequestCard(
    request,
  ) {
    const companyName =
      escapeHtml(
        request.companyName
        ?? "منشأة بدون اسم",
      );
  
    const currentPlan =
      getPlanInformation(
        request.currentPlan,
      );
  
    const requestedPlan =
      getPlanInformation(
        request.requestedPlan,
      );
  
    const statusInformation =
      getRequestStatusInformation(
        request.status,
      );
  
    return `
      <article
        class="admin-subscription-request-card"
        data-subscription-request-id="${escapeHtml(
          request.id,
        )}"
      >
  
        <div class="admin-subscription-request-header">
  
          <div class="admin-subscription-company">
  
            <div class="admin-subscription-company-avatar">
              ${companyName.charAt(0)}
            </div>
  
            <div>
              <h3>
                ${companyName}
              </h3>
  
              <p>
                طلب تغيير باقة الاشتراك
              </p>
            </div>
  
          </div>
  
  
          <span
            class="
              admin-subscription-status
              ${statusInformation.className}
            "
          >
            ${statusInformation.label}
          </span>
  
        </div>
  
  
        <div class="admin-subscription-request-details">
  
          ${renderRequestInformationItem({
            label: "الباقة الحالية",
            value:
              currentPlan.name,
            description:
              currentPlan.price,
          })}
  
          ${renderRequestInformationItem({
            label: "الباقة المطلوبة",
            value:
              requestedPlan.name,
            description:
              requestedPlan.price,
            modifier: "requested",
          })}
  
          ${renderRequestInformationItem({
            label: "تاريخ الطلب",
            value:
              formatDate(
                request.createdAt,
              ),
          })}
  
          ${renderRequestInformationItem({
            label: "تاريخ المراجعة",
            value:
              request.reviewedAt
                ? formatDate(
                    request.reviewedAt,
                  )
                : "لم تتم المراجعة بعد",
          })}
  
        </div>
  
  
        ${
          request.status === "rejected"
          && request.rejectionReason
            ? `
              <div class="admin-subscription-rejection-reason">
                <span>
                  سبب الرفض
                </span>
  
                <p>
                  ${escapeHtml(
                    request.rejectionReason,
                  )}
                </p>
              </div>
            `
            : ""
        }
  
  
        ${renderRequestActions(request)}
  
      </article>
    `;
  }
  
  
  function renderRequestInformationItem({
    label,
    value,
    description = "",
    modifier = "",
  }) {
    const modifierClass =
      modifier
        ? `admin-subscription-information-item--${modifier}`
        : "";
  
    return `
      <div
        class="
          admin-subscription-information-item
          ${modifierClass}
        "
      >
        <span>
          ${label}
        </span>
  
        <strong>
          ${value}
        </strong>
  
        ${
          description
            ? `
              <small>
                ${description}
              </small>
            `
            : ""
        }
      </div>
    `;
  }
  
  
  function renderRequestActions(
    request,
  ) {
    if (
      request.status
      !== "pending"
    ) {
      return `
        <div class="admin-subscription-reviewed-note">
          تمت مراجعة هذا الطلب ولا يمكن تعديله.
        </div>
      `;
    }
  
    return `
      <div class="admin-subscription-request-actions">
  
        <button
          class="admin-subscription-action-button approve"
          data-subscription-action="approve"
          data-subscription-request-id="${escapeHtml(
            request.id,
          )}"
          data-company-name="${escapeHtml(
            request.companyName
            ?? "",
          )}"
          data-requested-plan="${escapeHtml(
            request.requestedPlan
            ?? "",
          )}"
          type="button"
        >
          قبول الطلب
        </button>
  
  
        <button
          class="admin-subscription-action-button reject"
          data-subscription-action="reject"
          data-subscription-request-id="${escapeHtml(
            request.id,
          )}"
          data-company-name="${escapeHtml(
            request.companyName
            ?? "",
          )}"
          type="button"
        >
          رفض الطلب
        </button>
  
      </div>
    `;
  }
  
  
  function attachRequestActionEvents() {
    const actionButtons =
      document.querySelectorAll(
        "[data-subscription-action]",
      );
  
    actionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const action =
              button.dataset
                .subscriptionAction;
  
            const requestId =
              button.dataset
                .subscriptionRequestId;
  
            const companyName =
              button.dataset
                .companyName
              || "المنشأة";
  
            if (action === "approve") {
              await handleApproveRequest({
                requestId,
                companyName,
                requestedPlan:
                  button.dataset
                    .requestedPlan,
                button,
              });
  
              return;
            }
  
            if (action === "reject") {
              await handleRejectRequest({
                requestId,
                companyName,
                button,
              });
            }
          },
        );
      },
    );
  }
  
  
  async function handleApproveRequest({
    requestId,
    companyName,
    requestedPlan,
    button,
  }) {
    const planInformation =
      getPlanInformation(
        requestedPlan,
      );
  
    const confirmed =
      window.confirm(
        `هل تريد قبول طلب "${companyName}" وتغيير الباقة إلى "${planInformation.name}"؟`,
      );
  
    if (!confirmed) {
      return;
    }
  
    const originalButtonText =
      button.textContent;
  
    disableRequestButtons(
      requestId,
      true,
    );
  
    button.textContent =
      "جاري القبول...";
  
    hideAdminSubscriptionsMessage();
  
    try {
      await approveSubscriptionRequest(
        requestId,
      );
  
      updateLocalRequest({
        requestId,
        status: "approved",
        rejectionReason: null,
      });
  
      renderStatistics();
  
      renderFilteredRequests();
  
      showAdminSubscriptionsMessage(
        `تم قبول طلب "${companyName}" وتحديث باقة المنشأة إلى "${planInformation.name}" بنجاح.`,
        "success",
      );
  
    } catch (error) {
      console.error(
        "تعذر قبول طلب الاشتراك:",
        error,
      );
  
      disableRequestButtons(
        requestId,
        false,
      );
  
      button.textContent =
        originalButtonText;
  
      showAdminSubscriptionsMessage(
        getAdminSubscriptionErrorMessage(
          error,
        ),
        "error",
      );
    }
  }
  
  
  async function handleRejectRequest({
    requestId,
    companyName,
    button,
  }) {
    const rejectionReason =
      window.prompt(
        `اكتبي سبب رفض طلب "${companyName}"، أو اتركي الحقل فارغًا:`,
        "",
      );
  
    if (rejectionReason === null) {
      return;
    }
  
    const confirmed =
      window.confirm(
        `هل تريد رفض طلب اشتراك "${companyName}"؟`,
      );
  
    if (!confirmed) {
      return;
    }
  
    const originalButtonText =
      button.textContent;
  
    disableRequestButtons(
      requestId,
      true,
    );
  
    button.textContent =
      "جاري الرفض...";
  
    hideAdminSubscriptionsMessage();
  
    try {
      await rejectSubscriptionRequest(
        requestId,
        rejectionReason,
      );
  
      updateLocalRequest({
        requestId,
        status: "rejected",
        rejectionReason,
      });
  
      renderStatistics();
  
      renderFilteredRequests();
  
      showAdminSubscriptionsMessage(
        `تم رفض طلب اشتراك "${companyName}".`,
        "success",
      );
  
    } catch (error) {
      console.error(
        "تعذر رفض طلب الاشتراك:",
        error,
      );
  
      disableRequestButtons(
        requestId,
        false,
      );
  
      button.textContent =
        originalButtonText;
  
      showAdminSubscriptionsMessage(
        getAdminSubscriptionErrorMessage(
          error,
        ),
        "error",
      );
    }
  }
  
  
  function updateLocalRequest({
    requestId,
    status,
    rejectionReason,
  }) {
    const requestIndex =
      allSubscriptionRequests.findIndex(
        (request) =>
          request.id === requestId,
      );
  
    if (requestIndex === -1) {
      return;
    }
  
    const now =
      new Date().toISOString();
  
    allSubscriptionRequests[
      requestIndex
    ] = {
      ...allSubscriptionRequests[
        requestIndex
      ],
  
      status,
  
      rejectionReason:
        rejectionReason
        || null,
  
      reviewedAt:
        now,
  
      updatedAt:
        now,
    };
  }
  
  
  function disableRequestButtons(
    requestId,
    isDisabled,
  ) {
    const buttons =
      document.querySelectorAll(
        `[data-subscription-request-id="${requestId}"][data-subscription-action]`,
      );
  
    buttons.forEach(
      (button) => {
        button.disabled =
          isDisabled;
      },
    );
  }
  
  
  function getPlanInformation(
    planId,
  ) {
    return (
      subscriptionPlans[planId]
      ?? subscriptionPlans.basic
    );
  }
  
  
  function getRequestStatusInformation(
    status,
  ) {
    const statuses = {
      pending: {
        label: "قيد المراجعة",
        className: "pending",
      },
  
      approved: {
        label: "تمت الموافقة",
        className: "approved",
      },
  
      rejected: {
        label: "مرفوض",
        className: "rejected",
      },
    };
  
    return (
      statuses[status]
      ?? {
        label: "غير محدد",
        className: "unknown",
      }
    );
  }
  
  
  function showAdminSubscriptionsMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "admin-subscriptions-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      `subscription-message subscription-message--${type}`;
  
    messageElement.textContent =
      message;
  
    messageElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  
  
  function hideAdminSubscriptionsMessage() {
    const messageElement =
      document.getElementById(
        "admin-subscriptions-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      "hidden";
  
    messageElement.textContent =
      "";
  }
  
  
  function getAdminSubscriptionErrorMessage(
    error,
  ) {
    const errorCode =
      error?.message
      ?? error?.code;
  
    const messages = {
      "subscription-request-id-required":
        "تعذر تحديد طلب الاشتراك.",
  
      "subscription-request-not-found":
        "طلب الاشتراك غير موجود.",
  
      "subscription-request-already-reviewed":
        "تمت مراجعة هذا الطلب مسبقًا ولا يمكن تغييره.",
  
      "invalid-requested-plan":
        "الباقة المطلوبة غير صالحة.",
  
      "company-id-required":
        "تعذر تحديد حساب المنشأة.",
  
      "company-not-found":
        "لم يتم العثور على حساب المنشأة.",
  
      "permission-denied":
        "لا تملك صلاحية إدارة طلبات الاشتراك.",
  
      "unavailable":
        "تعذر الاتصال بقاعدة البيانات. تحقق من اتصال الإنترنت.",
    };
  
    return (
      messages[errorCode]
      ?? "تعذر تنفيذ الإجراء. حاول مرة أخرى."
    );
  }
  
  
  function renderStatisticsLoadingState() {
    return Array.from({
      length: 4,
    })
      .map(
        () => `
          <article
            class="
              admin-subscription-stat-card
              loading
            "
          >
            <div
              class="admin-subscription-loading-icon"
            ></div>
  
            <div class="admin-subscription-loading-content">
              <div
                class="admin-subscription-loading-line small"
              ></div>
  
              <div
                class="admin-subscription-loading-line large"
              ></div>
            </div>
          </article>
        `,
      )
      .join("");
  }
  
  
  function renderRequestsLoadingState() {
    return `
      <div class="admin-state-card">
  
        <div class="admin-loading-spinner"></div>
  
        <h3>
          جاري تحميل طلبات الاشتراك
        </h3>
  
        <p>
          يتم الآن جلب طلبات تغيير الباقات.
        </p>
  
      </div>
    `;
  }
  
  
  function renderStatisticsErrorState() {
    return `
      <div class="admin-subscriptions-error-card">
        تعذر تحميل إحصائيات الاشتراكات.
      </div>
    `;
  }
  
  
  function renderRequestsErrorState() {
    return `
      <div class="admin-subscriptions-empty-state">
  
        <div class="admin-subscriptions-empty-icon">
          !
        </div>
  
        <h3>
          تعذر تحميل الطلبات
        </h3>
  
        <p>
          تحقق من الاتصال ثم أعد المحاولة.
        </p>
  
      </div>
    `;
  }
  
  
  function renderEmptyRequestsState() {
    const isFiltered =
      currentStatusFilter !== "all";
  
    return `
      <div class="admin-subscriptions-empty-state">
  
        <div class="admin-subscriptions-empty-icon">
          ${
            isFiltered
              ? "⌕"
              : "◉"
          }
        </div>
  
        <h3>
          ${
            isFiltered
              ? "لا توجد طلبات مطابقة"
              : "لا توجد طلبات اشتراك حاليًا"
          }
        </h3>
  
        <p>
          ${
            isFiltered
              ? "جرّب اختيار حالة أخرى لعرض المزيد من الطلبات."
              : "ستظهر طلبات تغيير الباقات هنا بعد إرسالها من المنشآت."
          }
        </p>
  
      </div>
    `;
  }
  
  
  function formatNumber(
    value,
  ) {
    const number =
      Number(value ?? 0);
  
    if (
      Number.isNaN(number)
    ) {
      return "0";
    }
  
    return new Intl.NumberFormat(
      "ar-SA",
    ).format(number);
  }
  
  
  function formatDate(
    dateValue,
  ) {
    if (!dateValue) {
      return "غير متوفر";
    }
  
    let date;
  
    if (
      typeof dateValue?.toDate
      === "function"
    ) {
      date =
        dateValue.toDate();
    } else {
      date =
        new Date(
          dateValue,
        );
    }
  
    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "غير متوفر";
    }
  
    return new Intl.DateTimeFormat(
      "ar-SA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(date);
  }
  
  
  function escapeHtml(
    value,
  ) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }