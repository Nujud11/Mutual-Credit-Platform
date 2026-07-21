import {
    getAllCompanies,
    updateCompanyAccountStatus,
  } from "../services/admin-service.js";
  
  
  let allCompanies = [];
  let currentSearchValue = "";
  let currentStatusFilter = "all";
  
  
  export function renderAdminCompaniesPage() {
    return `
      <section class="admin-page">
  
        <section class="admin-hero">
  
          <div class="admin-hero-content">
  
            <span class="admin-hero-label">
              إدارة منصة مقاصة
            </span>
  
            <h2>
              إدارة المنشآت
            </h2>
  
            <p>
              راقب حسابات المنشآت،
              وابحث عنها وعدّل حالتها
              من مكان واحد.
            </p>
  
          </div>
  
          <button
            id="refresh-admin-companies-button"
            class="admin-hero-button"
            type="button"
          >
            تحديث القائمة
          </button>
  
        </section>
  
  
        <div
          id="admin-companies-message"
          class="hidden"
        ></div>
  
  
        <section
          id="admin-companies-statistics"
          class="admin-companies-statistics"
        >
          ${renderStatisticsLoadingState()}
        </section>
  
  
        <section class="admin-companies-panel">
  
          <div class="admin-companies-toolbar">
  
            <div class="admin-companies-search">
  
              <span class="admin-companies-search-icon">
                ⌕
              </span>
  
              <input
                id="admin-companies-search-input"
                type="search"
                placeholder="ابحث باسم المنشأة أو البريد أو المدينة"
                autocomplete="off"
              >
  
            </div>
  
  
            <div class="admin-companies-filter">
  
              <label
                for="admin-companies-status-filter"
              >
                حالة الحساب
              </label>
  
              <select
                id="admin-companies-status-filter"
              >
                <option value="all">
                  جميع الحالات
                </option>
  
                <option value="active">
                  نشطة
                </option>
  
                <option value="pending">
                  قيد المراجعة
                </option>
  
                <option value="suspended">
                  معلقة
                </option>
  
                <option value="rejected">
                  مرفوضة
                </option>
              </select>
  
            </div>
  
          </div>
  
  
          <div
            id="admin-companies-results-summary"
            class="admin-companies-results-summary"
          ></div>
  
  
          <div
            id="admin-companies-list"
            class="admin-companies-list"
          >
            ${renderCompaniesLoadingState()}
          </div>
  
        </section>
  
      </section>
    `;
  }
  
  
  export function initializeAdminCompaniesPage() {
    attachAdminCompaniesEvents();
    loadCompanies();
  }
  
  
  function attachAdminCompaniesEvents() {
    const refreshButton =
      document.getElementById(
        "refresh-admin-companies-button",
      );
  
    const searchInput =
      document.getElementById(
        "admin-companies-search-input",
      );
  
    const statusFilter =
      document.getElementById(
        "admin-companies-status-filter",
      );
  
    refreshButton?.addEventListener(
      "click",
      () => {
        loadCompanies();
      },
    );
  
    searchInput?.addEventListener(
      "input",
      (event) => {
        currentSearchValue =
          event.target.value
            .trim()
            .toLowerCase();
  
        renderFilteredCompanies();
      },
    );
  
    statusFilter?.addEventListener(
      "change",
      (event) => {
        currentStatusFilter =
          event.target.value;
  
        renderFilteredCompanies();
      },
    );
  }
  
  
  async function loadCompanies() {
    const companiesList =
      document.getElementById(
        "admin-companies-list",
      );
  
    const statisticsContainer =
      document.getElementById(
        "admin-companies-statistics",
      );
  
    hideMessage();
  
    if (companiesList) {
      companiesList.innerHTML =
        renderCompaniesLoadingState();
    }
  
    if (statisticsContainer) {
      statisticsContainer.innerHTML =
        renderStatisticsLoadingState();
    }
  
    try {
      allCompanies =
        await getAllCompanies();
  
      renderStatistics();
      renderFilteredCompanies();
  
    } catch (error) {
      console.error(
        "تعذر تحميل المنشآت:",
        error,
      );
  
      if (companiesList) {
        companiesList.innerHTML =
          renderCompaniesErrorState();
      }
  
      if (statisticsContainer) {
        statisticsContainer.innerHTML =
          `
            <div class="admin-companies-error-card">
              تعذر تحميل إحصائيات المنشآت.
            </div>
          `;
      }
  
      showMessage(
        "تعذر تحميل بيانات المنشآت. تحقق من الاتصال ثم حاول مجددًا.",
        "error",
      );
    }
  }
  
  
  function renderStatistics() {
    const statisticsContainer =
      document.getElementById(
        "admin-companies-statistics",
      );
  
    if (!statisticsContainer) {
      return;
    }
  
    const activeCount =
      allCompanies.filter(
        (company) =>
          company.accountStatus
          === "active",
      ).length;
  
    const pendingCount =
      allCompanies.filter(
        (company) =>
          company.accountStatus
          === "pending",
      ).length;
  
    const suspendedCount =
      allCompanies.filter(
        (company) =>
          company.accountStatus
          === "suspended",
      ).length;
  
    const rejectedCount =
      allCompanies.filter(
        (company) =>
          company.accountStatus
          === "rejected",
      ).length;
  
    statisticsContainer.innerHTML = `
      ${renderStatisticCard({
        label: "إجمالي المنشآت",
        value: allCompanies.length,
        type: "total",
        icon: "▣",
      })}
  
      ${renderStatisticCard({
        label: "المنشآت النشطة",
        value: activeCount,
        type: "active",
        icon: "✓",
      })}
  
      ${renderStatisticCard({
        label: "قيد المراجعة",
        value: pendingCount,
        type: "pending",
        icon: "◷",
      })}
  
      ${renderStatisticCard({
        label: "المنشآت المعلقة",
        value: suspendedCount,
        type: "suspended",
        icon: "Ⅱ",
      })}
  
      ${renderStatisticCard({
        label: "المنشآت المرفوضة",
        value: rejectedCount,
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
        class="admin-company-stat-card ${type}"
      >
        <div class="admin-company-stat-icon">
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
  
  
  function renderFilteredCompanies() {
    const companiesList =
      document.getElementById(
        "admin-companies-list",
      );
  
    const resultsSummary =
      document.getElementById(
        "admin-companies-results-summary",
      );
  
    if (!companiesList) {
      return;
    }
  
    const filteredCompanies =
      allCompanies.filter(
        (company) => {
          const matchesStatus =
            currentStatusFilter === "all"
            || company.accountStatus
              === currentStatusFilter;
  
          const searchableText = [
            company.companyName,
            company.email,
            company.city,
            company.businessType,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
  
          const matchesSearch =
            !currentSearchValue
            || searchableText.includes(
              currentSearchValue,
            );
  
          return (
            matchesStatus
            && matchesSearch
          );
        },
      );
  
    if (resultsSummary) {
      resultsSummary.textContent =
        `تم العثور على ${filteredCompanies.length} منشأة`;
    }
  
    if (!filteredCompanies.length) {
      companiesList.innerHTML =
        renderEmptyCompaniesState();
  
      return;
    }
  
    companiesList.innerHTML =
      filteredCompanies
        .map(
          (company) =>
            renderCompanyCard(
              company,
            ),
        )
        .join("");
  
    attachCompanyActionEvents();
  }
  
  
  function renderCompanyCard(
    company,
  ) {
    const companyName =
      escapeHtml(
        company.companyName
        ?? "منشأة بدون اسم",
      );
  
    const email =
      escapeHtml(
        company.email
        ?? "غير متوفر",
      );
  
    const businessType =
      escapeHtml(
        company.businessType
        ?? "غير محدد",
      );
  
    const city =
      escapeHtml(
        company.city
        ?? "غير محددة",
      );
  
    const statusInformation =
      getStatusInformation(
        company.accountStatus,
      );
  
    return `
      <article
        class="admin-company-card"
        data-company-id="${escapeHtml(company.id)}"
      >
  
        <div class="admin-company-card-header">
  
          <div class="admin-company-identity">
  
            <div class="admin-company-avatar">
              ${companyName.charAt(0)}
            </div>
  
            <div class="admin-company-title">
  
              <div class="admin-company-title-row">
  
                <h3>
                  ${companyName}
                </h3>
  
                <span
                  class="admin-company-status
                  ${statusInformation.className}"
                >
                  ${statusInformation.label}
                </span>
  
              </div>
  
              <p>
                ${businessType} • ${city}
              </p>
  
            </div>
  
          </div>
  
  
          <div class="admin-company-actions">
            ${renderCompanyActions(company)}
          </div>
  
        </div>
  
  
        <div class="admin-company-information-grid">
  
          ${renderInformationItem({
            label: "البريد الإلكتروني",
            value: email,
          })}
  
          ${renderInformationItem({
            label: "الرصيد الحالي",
            value:
              `${formatNumber(company.balance)} MQ`,
          })}
  
          ${renderInformationItem({
            label: "الحد الائتماني",
            value:
              `${formatNumber(company.creditLimit)} MQ`,
          })}
  
          ${renderInformationItem({
            label: "تاريخ التسجيل",
            value:
              formatDate(company.createdAt),
          })}
  
        </div>
  
      </article>
    `;
  }
  
  
  function renderInformationItem({
    label,
    value,
  }) {
    return `
      <div class="admin-company-information-item">
        <span>
          ${label}
        </span>
  
        <strong>
          ${value}
        </strong>
      </div>
    `;
  }
  
  
  function renderCompanyActions(
    company,
  ) {
    const status =
      company.accountStatus;
  
    if (status === "active") {
      return `
        <button
          class="admin-company-action-button suspend"
          data-company-action="suspended"
          data-company-id="${escapeHtml(company.id)}"
          data-company-name="${escapeHtml(company.companyName ?? "")}"
          type="button"
        >
          تعليق الحساب
        </button>
      `;
    }
  
    if (status === "pending") {
      return `
        <button
          class="admin-company-action-button activate"
          data-company-action="active"
          data-company-id="${escapeHtml(company.id)}"
          data-company-name="${escapeHtml(company.companyName ?? "")}"
          type="button"
        >
          قبول وتفعيل
        </button>
  
        <button
          class="admin-company-action-button reject"
          data-company-action="rejected"
          data-company-id="${escapeHtml(company.id)}"
          data-company-name="${escapeHtml(company.companyName ?? "")}"
          type="button"
        >
          رفض
        </button>
      `;
    }
  
    if (
      status === "rejected"
      || status === "suspended"
    ) {
      return `
        <button
          class="admin-company-action-button activate"
          data-company-action="active"
          data-company-id="${escapeHtml(company.id)}"
          data-company-name="${escapeHtml(company.companyName ?? "")}"
          type="button"
        >
          إعادة التفعيل
        </button>
      `;
    }
  
    return `
      <button
        class="admin-company-action-button activate"
        data-company-action="active"
        data-company-id="${escapeHtml(company.id)}"
        data-company-name="${escapeHtml(company.companyName ?? "")}"
        type="button"
      >
        تفعيل الحساب
      </button>
    `;
  }
  
  
  function attachCompanyActionEvents() {
    const actionButtons =
      document.querySelectorAll(
        "[data-company-action]",
      );
  
    actionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const companyId =
              button.dataset.companyId;
  
            const companyName =
              button.dataset.companyName
              || "المنشأة";
  
            const newStatus =
              button.dataset.companyAction;
  
            await handleStatusChange({
              companyId,
              companyName,
              newStatus,
              button,
            });
          },
        );
      },
    );
  }
  
  
  async function handleStatusChange({
    companyId,
    companyName,
    newStatus,
    button,
  }) {
    const confirmationMessage =
      getConfirmationMessage(
        companyName,
        newStatus,
      );
  
    const confirmed =
      window.confirm(
        confirmationMessage,
      );
  
    if (!confirmed) {
      return;
    }
  
    const originalButtonText =
      button.textContent;
  
    button.disabled = true;
    button.textContent =
      "جاري الحفظ...";
  
    hideMessage();
  
    try {
      await updateCompanyAccountStatus(
        companyId,
        newStatus,
      );
  
      const companyIndex =
        allCompanies.findIndex(
          (company) =>
            company.id === companyId,
        );
  
      if (companyIndex !== -1) {
        allCompanies[companyIndex] = {
          ...allCompanies[companyIndex],
          accountStatus: newStatus,
        };
      }
  
      renderStatistics();
      renderFilteredCompanies();
  
      showMessage(
        getSuccessMessage(
          companyName,
          newStatus,
        ),
        "success",
      );
  
    } catch (error) {
      console.error(
        "تعذر تحديث حالة المنشأة:",
        error,
      );
  
      button.disabled = false;
      button.textContent =
        originalButtonText;
  
      showMessage(
        "تعذر تحديث حالة المنشأة. حاول مرة أخرى.",
        "error",
      );
    }
  }
  
  
  function getConfirmationMessage(
    companyName,
    newStatus,
  ) {
    const messages = {
      active:
        `هل تريد تفعيل حساب "${companyName}"؟`,
  
      suspended:
        `هل تريد تعليق حساب "${companyName}" مؤقتًا؟`,
  
      rejected:
        `هل تريد رفض حساب "${companyName}"؟`,
    };
  
    return (
      messages[newStatus]
      ?? "هل تريد تنفيذ هذا الإجراء؟"
    );
  }
  
  
  function getSuccessMessage(
    companyName,
    newStatus,
  ) {
    const messages = {
      active:
        `تم تفعيل حساب "${companyName}" بنجاح.`,
  
      suspended:
        `تم تعليق حساب "${companyName}" مؤقتًا.`,
  
      rejected:
        `تم رفض حساب "${companyName}".`,
    };
  
    return (
      messages[newStatus]
      ?? "تم تحديث حالة المنشأة بنجاح."
    );
  }
  
  
  function getStatusInformation(
    status,
  ) {
    const statuses = {
      active: {
        label: "نشطة",
        className: "active",
      },
  
      pending: {
        label: "قيد المراجعة",
        className: "pending",
      },
  
      suspended: {
        label: "معلقة",
        className: "suspended",
      },
  
      rejected: {
        label: "مرفوضة",
        className: "rejected",
      },
    };
  
    return (
      statuses[status]
      ?? {
        label: "غير محددة",
        className: "unknown",
      }
    );
  }
  
  
  function showMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "admin-companies-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      `admin-message admin-message-${type}`;
  
    messageElement.textContent =
      message;
  
    messageElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  
  
  function hideMessage() {
    const messageElement =
      document.getElementById(
        "admin-companies-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      "hidden";
  
    messageElement.textContent =
      "";
  }
  
  
  function renderStatisticsLoadingState() {
    return Array.from({
      length: 5,
    })
      .map(
        () => `
          <article class="admin-company-stat-card loading">
            <div class="admin-company-stat-loading-icon"></div>
  
            <div class="admin-company-stat-loading-content">
              <div class="admin-company-loading-line small"></div>
              <div class="admin-company-loading-line large"></div>
            </div>
          </article>
        `,
      )
      .join("");
  }
  
  
  function renderCompaniesLoadingState() {
    return `
      <div class="admin-state-card">
        <div class="admin-loading-spinner"></div>
  
        <h3>
          جاري تحميل المنشآت
        </h3>
  
        <p>
          يتم الآن جلب بيانات حسابات المنشآت.
        </p>
      </div>
    `;
  }
  
  
  function renderCompaniesErrorState() {
    return `
      <div class="admin-companies-empty-state">
  
        <div class="admin-companies-empty-icon">
          !
        </div>
  
        <h3>
          تعذر تحميل المنشآت
        </h3>
  
        <p>
          تحقق من الاتصال ثم أعد المحاولة.
        </p>
  
      </div>
    `;
  }
  
  
  function renderEmptyCompaniesState() {
    return `
      <div class="admin-companies-empty-state">
  
        <div class="admin-companies-empty-icon">
          ⌕
        </div>
  
        <h3>
          لا توجد نتائج مطابقة
        </h3>
  
        <p>
          جرّب تغيير كلمة البحث أو حالة الحساب.
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
        new Date(dateValue);
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