import {
    getAdminDashboardData,
  } from "../services/admin-service.js";
  
  
  export function renderAdminDashboardPage() {
    return `
      <section class="admin-page">
  
        <section class="admin-dashboard-hero">
  
          <div class="admin-dashboard-hero-content">
  
            <span class="admin-dashboard-hero-label">
              إدارة منصة مقاصة
            </span>
  
            <h2>
              لوحة التحكم
            </h2>
  
            <p>
              تابع طلبات المنشآت وحالة الحسابات،
              وراقب النشاط العام داخل المنصة
              من مكان واحد.
            </p>
  
          </div>
  
          <button
            id="view-registration-requests-button"
            class="admin-dashboard-hero-button"
            type="button"
          >
            مراجعة طلبات التسجيل
          </button>
  
        </section>
  
  
        <div
          id="admin-dashboard-message"
          class="hidden"
        ></div>
  
  
        <section
          id="admin-dashboard-statistics"
          class="admin-dashboard-statistics"
        >
          ${renderStatisticsLoadingState()}
        </section>
  
  
        <section class="admin-dashboard-content-grid">
  
          <article class="admin-dashboard-panel">
  
            <div class="admin-dashboard-panel-header">
              <div>
                <h3>
                  أحدث طلبات التسجيل
                </h3>
  
                <p>
                  آخر المنشآت التي تقدمت
                  للانضمام إلى المنصة.
                </p>
              </div>
  
              <button
                id="view-all-registration-requests"
                class="admin-dashboard-link-button"
                type="button"
              >
                عرض جميع الطلبات
              </button>
            </div>
  
            <div
              id="latest-company-requests"
              class="latest-company-requests"
            >
              ${renderRequestsLoadingState()}
            </div>
  
          </article>
  
  
          <article class="admin-dashboard-panel">
  
            <div class="admin-dashboard-panel-header">
              <div>
                <h3>
                  إجراءات سريعة
                </h3>
  
                <p>
                  اختصارات لأهم مهام إدارة المنصة.
                </p>
              </div>
            </div>
  
        <div class="admin-quick-actions">

        <button
            class="admin-quick-action"
            data-admin-navigation="admin-registration-requests"
            type="button"
        >
            <span class="admin-quick-action-icon">
            ▣
            </span>

            <span>
            <strong>
                مراجعة طلبات التسجيل
            </strong>

            <small>
                قبول أو رفض طلبات المنشآت الجديدة.
            </small>
            </span>
        </button>


        <button
            class="admin-quick-action"
            data-admin-navigation="admin-companies"
            type="button"
        >
            <span class="admin-quick-action-icon">
            ◫
            </span>

            <span>
            <strong>
                إدارة المنشآت
            </strong>

            <small>
                مراجعة حسابات المنشآت وحالاتها.
            </small>
            </span>
        </button>


        <button
            class="admin-quick-action"
            data-admin-navigation="admin-subscriptions"
            type="button"
        >
            <span class="admin-quick-action-icon">
            ◉
            </span>

            <span>
            <strong>
                إدارة الاشتراكات
            </strong>

            <small>
                مراجعة طلبات تغيير باقات المنشآت.
            </small>
            </span>
        </button>

        </div>
  
          </article>
  
        </section>
  
      </section>
    `;
  }
  
  
  export function initializeAdminDashboardPage({
    onNavigate,
  }) {
    attachNavigationButtons(
      onNavigate,
    );
  
    loadAdminDashboardData();
  }
  
  
  async function loadAdminDashboardData() {
    const statisticsContainer =
      document.getElementById(
        "admin-dashboard-statistics",
      );
  
    const latestRequestsContainer =
      document.getElementById(
        "latest-company-requests",
      );
  
    try {
      const dashboardData =
        await getAdminDashboardData();
  
      if (statisticsContainer) {
        statisticsContainer.innerHTML =
          renderStatisticsCards(
            dashboardData,
          );
      }
  
      if (latestRequestsContainer) {
        latestRequestsContainer.innerHTML =
          renderLatestRequests(
            dashboardData.latestRequests,
          );
      }
  
    } catch (error) {
      console.error(
        "تعذر تحميل بيانات لوحة الإدارة:",
        error,
      );
  
      if (statisticsContainer) {
        statisticsContainer.innerHTML =
          renderStatisticsErrorState();
      }
  
      if (latestRequestsContainer) {
        latestRequestsContainer.innerHTML =
          renderRequestsErrorState();
      }
    }
  }
  
  
  function renderStatisticsCards(
    dashboardData,
  ) {
    return `
      ${renderStatisticCard({
        label: "إجمالي المنشآت",
        value: dashboardData.totalCompanies,
        icon: "◫",
        type: "total",
      })}
  
      ${renderStatisticCard({
        label: "المنشآت النشطة",
        value: dashboardData.activeCompanies,
        icon: "✓",
        type: "active",
      })}
  
      ${renderStatisticCard({
        label: "الطلبات المعلقة",
        value: dashboardData.pendingCompanies,
        icon: "◷",
        type: "pending",
      })}
  
      ${renderStatisticCard({
        label: "الطلبات المرفوضة",
        value: dashboardData.rejectedCompanies,
        icon: "×",
        type: "rejected",
      })}
    `;
  }
  
  
  function renderStatisticCard({
    label,
    value,
    icon,
    type,
  }) {
    return `
      <article
        class="admin-dashboard-stat-card ${type}"
      >
        <div class="admin-dashboard-stat-icon">
          ${icon}
        </div>
  
        <div>
          <span>
            ${label}
          </span>
  
          <strong>
            ${value}
          </strong>
        </div>
      </article>
    `;
  }
  
  
  function renderLatestRequests(
    requests,
  ) {
    if (!requests.length) {
      return `
        <div class="admin-dashboard-empty-state">
          <div class="admin-dashboard-empty-icon">
            ✓
          </div>
  
          <h4>
            لا توجد منشآت مسجلة
          </h4>
  
          <p>
            ستظهر أحدث طلبات التسجيل هنا.
          </p>
        </div>
      `;
    }
  
    return requests
      .map(
        (company) =>
          renderLatestRequestItem(
            company,
          ),
      )
      .join("");
  }
  
  
  function renderLatestRequestItem(
    company,
  ) {
    const companyName =
      escapeHtml(
        company.companyName
        ?? "منشأة بدون اسم",
      );
  
    const businessType =
      escapeHtml(
        company.businessType
        ?? "نشاط غير محدد",
      );
  
    const city =
      escapeHtml(
        company.city
        ?? "مدينة غير محددة",
      );
  
    const statusInformation =
      getStatusInformation(
        company.accountStatus,
      );
  
    return `
      <div class="latest-company-request">
  
        <div class="latest-company-request-main">
  
          <div class="latest-company-avatar">
            ${companyName.charAt(0)}
          </div>
  
          <div>
            <strong>
              ${companyName}
            </strong>
  
            <p>
              ${businessType} • ${city}
            </p>
          </div>
  
        </div>
  
  
        <div class="latest-company-request-meta">
  
          <span
            class="company-account-status
            ${statusInformation.className}"
          >
            ${statusInformation.label}
          </span>
  
          <time>
            ${formatDate(company.createdAt)}
          </time>
  
        </div>
  
      </div>
    `;
  }
  
  
  function getStatusInformation(
    accountStatus,
  ) {
    const statuses = {
      active: {
        label: "نشط",
        className: "active",
      },
  
      pending: {
        label: "قيد المراجعة",
        className: "pending",
      },
  
      rejected: {
        label: "مرفوض",
        className: "rejected",
      },
    };
  
    return (
      statuses[accountStatus]
      ?? {
        label: "غير محدد",
        className: "unknown",
      }
    );
  }
  
  
  function attachNavigationButtons(
    onNavigate,
  ) {
    const heroButton =
      document.getElementById(
        "view-registration-requests-button",
      );
  
    const viewAllButton =
      document.getElementById(
        "view-all-registration-requests",
      );
  
    const quickActionButtons =
      document.querySelectorAll(
        "[data-admin-navigation]",
      );
  
    heroButton?.addEventListener(
      "click",
      () => {
        onNavigate(
          "admin-registration-requests",
        );
      },
    );
  
    viewAllButton?.addEventListener(
      "click",
      () => {
        onNavigate(
          "admin-registration-requests",
        );
      },
    );
  
    quickActionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            onNavigate(
              button.dataset
                .adminNavigation,
            );
          },
        );
      },
    );
  }
  
  
  function renderStatisticsLoadingState() {
    return Array.from(
      {
        length: 4,
      },
    )
      .map(
        () => `
          <article
            class="admin-dashboard-stat-card loading"
          >
            <div
              class="admin-dashboard-loading-block icon"
            ></div>
  
            <div class="admin-dashboard-loading-text">
              <div
                class="admin-dashboard-loading-block label"
              ></div>
  
              <div
                class="admin-dashboard-loading-block value"
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
          جاري تحميل أحدث الطلبات
        </h3>
  
        <p>
          يتم الآن جلب بيانات المنشآت.
        </p>
      </div>
    `;
  }
  
  
  function renderStatisticsErrorState() {
    return `
      <article class="admin-dashboard-error-card">
        تعذر تحميل إحصائيات لوحة الإدارة.
      </article>
    `;
  }
  
  
  function renderRequestsErrorState() {
    return `
      <div class="admin-dashboard-empty-state">
        <div class="admin-dashboard-empty-icon">
          !
        </div>
  
        <h4>
          تعذر تحميل الطلبات
        </h4>
  
        <p>
          تحقق من الاتصال ثم أعد تحميل الصفحة.
        </p>
      </div>
    `;
  }
  
  
  function formatDate(
    dateValue,
  ) {
    if (!dateValue) {
      return "تاريخ غير متوفر";
    }
  
    const date =
      new Date(
        dateValue,
      );
  
    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return "تاريخ غير متوفر";
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