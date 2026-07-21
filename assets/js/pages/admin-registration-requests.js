import {
    approveCompanyRequest,
    getPendingCompanyRequests,
    rejectCompanyRequest,
  } from "../services/admin-service.js";
  
  
  export function renderAdminRegistrationRequestsPage() {
    return `
      <section class="admin-page">
  
        <div class="admin-page-header">
          <div>
            <span class="admin-section-label">
              إدارة المنشآت
            </span>
  
            <h2>
              طلبات تسجيل المنشآت
            </h2>
  
            <p>
              راجع بيانات المنشآت الجديدة
              واتخذ قرار القبول أو الرفض.
            </p>
          </div>
  
          <button
            id="refresh-registration-requests"
            class="admin-secondary-button"
            type="button"
          >
            تحديث الطلبات
          </button>
        </div>
  
  
        <div class="admin-summary-grid">
  
          <article class="admin-summary-card">
            <div class="admin-summary-icon">
              ◫
            </div>
  
            <div>
              <span>
                الطلبات المعلقة
              </span>
  
              <strong
                id="pending-requests-count"
              >
                —
              </strong>
            </div>
          </article>
  
        </div>
  
  
        <div
          id="admin-action-message"
          class="hidden"
        ></div>
  
  
        <div class="admin-content-card">
  
          <div class="admin-content-card-header">
            <div>
              <h3>
                الطلبات الجديدة
              </h3>
  
              <p>
                الطلبات التي تنتظر مراجعة الإدارة.
              </p>
            </div>
          </div>
  
  
          <div
            id="registration-requests-container"
            class="registration-requests-container"
          >
            ${renderLoadingState()}
          </div>
  
        </div>
  
      </section>
    `;
  }
  
  
  export function initializeAdminRegistrationRequestsPage() {
    const refreshButton =
      document.getElementById(
        "refresh-registration-requests",
      );
  
    refreshButton?.addEventListener(
      "click",
      loadRegistrationRequests,
    );
  
    loadRegistrationRequests();
  }
  
  
  async function loadRegistrationRequests() {
    const requestsContainer =
      document.getElementById(
        "registration-requests-container",
      );
  
    const requestsCount =
      document.getElementById(
        "pending-requests-count",
      );
  
    if (!requestsContainer) {
      return;
    }
  
    requestsContainer.innerHTML =
      renderLoadingState();
  
    try {
      const requests =
        await getPendingCompanyRequests();
  
      if (requestsCount) {
        requestsCount.textContent =
          requests.length;
      }
  
      if (requests.length === 0) {
        requestsContainer.innerHTML =
          renderEmptyState();
  
        return;
      }
  
      requestsContainer.innerHTML =
        requests
          .map(renderCompanyRequestCard)
          .join("");
  
      attachRequestActions();
  
    } catch (error) {
      console.error(
        "تعذر تحميل طلبات التسجيل:",
        error,
      );
  
      requestsContainer.innerHTML =
        renderErrorState();
    }
  }
  
  
  function renderCompanyRequestCard(company) {
    const companyName =
      escapeHtml(
        company.companyName
        ?? "منشأة بدون اسم",
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
  
    const email =
      escapeHtml(
        company.email
        ?? "غير متوفر",
      );
  
    const description =
      escapeHtml(
        company.description
        ?? "لا يوجد وصف للمنشأة.",
      );
  
    const commercialRecordStatus =
      company.isCommercialRecordVerified
        ? "موثق"
        : "غير موثق";
  
    const commercialRecordClass =
      company.isCommercialRecordVerified
        ? "verified"
        : "unverified";
  
    const registrationDate =
      formatDate(
        company.createdAt,
      );
  
    return `
      <article
        class="registration-request-card"
        data-company-id="${company.id}"
      >
  
        <div class="registration-request-main">
  
          <div class="registration-company-avatar">
            ${companyName.charAt(0)}
          </div>
  
          <div class="registration-company-details">
  
            <div class="registration-company-title">
              <div>
                <h4>
                  ${companyName}
                </h4>
  
                <p>
                  ${businessType} • ${city}
                </p>
              </div>
  
              <span class="request-status-badge">
                بانتظار المراجعة
              </span>
            </div>
  
  
            <p class="registration-company-description">
              ${description}
            </p>
  
  
            <div class="registration-company-metadata">
  
              <div>
                <span>
                  البريد الإلكتروني
                </span>
  
                <strong>
                  ${email}
                </strong>
              </div>
  
              <div>
                <span>
                  عمر المنشأة
                </span>
  
                <strong>
                  ${Number(company.companyAge) || 0}
                  سنوات
                </strong>
              </div>
  
              <div>
                <span>
                  السجل التجاري
                </span>
  
                <strong
                  class="commercial-record-status ${commercialRecordClass}"
                >
                  ${commercialRecordStatus}
                </strong>
              </div>
  
              <div>
                <span>
                  تاريخ الطلب
                </span>
  
                <strong>
                  ${registrationDate}
                </strong>
              </div>
  
            </div>
  
          </div>
  
        </div>
  
  
        <div class="registration-request-actions">
  
          <button
            class="admin-approve-button"
            data-action="approve"
            data-company-id="${company.id}"
            data-company-name="${companyName}"
            type="button"
          >
            قبول الطلب
          </button>
  
          <button
            class="admin-reject-button"
            data-action="reject"
            data-company-id="${company.id}"
            data-company-name="${companyName}"
            type="button"
          >
            رفض الطلب
          </button>
  
        </div>
  
      </article>
    `;
  }
  
  
  function attachRequestActions() {
    const actionButtons =
      document.querySelectorAll(
        "[data-action][data-company-id]",
      );
  
    actionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const companyId =
              button.dataset.companyId;
  
            const companyName =
              button.dataset.companyName;
  
            const action =
              button.dataset.action;
  
            if (action === "approve") {
              await handleApproveRequest(
                companyId,
                companyName,
                button,
              );
  
              return;
            }
  
            if (action === "reject") {
              await handleRejectRequest(
                companyId,
                companyName,
                button,
              );
            }
          },
        );
      },
    );
  }
  
  
  async function handleApproveRequest(
    companyId,
    companyName,
    button,
  ) {
    const confirmed =
      window.confirm(
        `هل تريد قبول طلب منشأة "${companyName}"؟`,
      );
  
    if (!confirmed) {
      return;
    }
  
    setButtonLoading(
      button,
      "جاري القبول...",
    );
  
    try {
      await approveCompanyRequest(
        companyId,
      );
  
      showAdminMessage(
        `تم قبول طلب منشأة "${companyName}" وتفعيل الحساب بنجاح.`,
        "success",
      );
  
      await loadRegistrationRequests();
  
    } catch (error) {
      console.error(
        "تعذر قبول الطلب:",
        error,
      );
  
      showAdminMessage(
        "تعذر قبول الطلب. حاول مرة أخرى.",
        "error",
      );
  
      resetButton(
        button,
        "قبول الطلب",
      );
    }
  }
  
  
  async function handleRejectRequest(
    companyId,
    companyName,
    button,
  ) {
    const rejectionReason =
      window.prompt(
        `اكتب سبب رفض طلب منشأة "${companyName}". يمكنك ترك الحقل فارغًا.`,
        "",
      );
  
    if (rejectionReason === null) {
      return;
    }
  
    const confirmed =
      window.confirm(
        `هل أنت متأكد من رفض طلب منشأة "${companyName}"؟`,
      );
  
    if (!confirmed) {
      return;
    }
  
    setButtonLoading(
      button,
      "جاري الرفض...",
    );
  
    try {
      await rejectCompanyRequest(
        companyId,
        rejectionReason,
      );
  
      showAdminMessage(
        `تم رفض طلب منشأة "${companyName}".`,
        "success",
      );
  
      await loadRegistrationRequests();
  
    } catch (error) {
      console.error(
        "تعذر رفض الطلب:",
        error,
      );
  
      showAdminMessage(
        "تعذر رفض الطلب. حاول مرة أخرى.",
        "error",
      );
  
      resetButton(
        button,
        "رفض الطلب",
      );
    }
  }
  
  
  function showAdminMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "admin-action-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.textContent =
      message;
  
    messageElement.className =
      type === "success"
        ? "admin-message admin-message-success"
        : "admin-message admin-message-error";
  
    window.setTimeout(
      () => {
        messageElement.classList.add(
          "hidden",
        );
      },
      4000,
    );
  }
  
  
  function setButtonLoading(
    button,
    loadingText,
  ) {
    button.disabled = true;
    button.textContent = loadingText;
  }
  
  
  function resetButton(
    button,
    originalText,
  ) {
    button.disabled = false;
    button.textContent = originalText;
  }
  
  
  function renderLoadingState() {
    return `
      <div class="admin-state-card">
        <div class="admin-loading-spinner"></div>
  
        <h3>
          جاري تحميل الطلبات
        </h3>
  
        <p>
          يتم الآن جلب طلبات التسجيل الجديدة.
        </p>
      </div>
    `;
  }
  
  
  function renderEmptyState() {
    return `
      <div class="admin-state-card">
        <div class="admin-state-icon">
          ✓
        </div>
  
        <h3>
          لا توجد طلبات معلقة
        </h3>
  
        <p>
          تمت مراجعة جميع طلبات التسجيل الحالية.
        </p>
      </div>
    `;
  }
  
  
  function renderErrorState() {
    return `
      <div class="admin-state-card">
        <div class="admin-state-icon">
          !
        </div>
  
        <h3>
          تعذر تحميل الطلبات
        </h3>
  
        <p>
          تحقق من الاتصال أو صلاحيات Firestore
          ثم حاول مرة أخرى.
        </p>
      </div>
    `;
  }
  
  
  function formatDate(dateValue) {
    if (!dateValue) {
      return "غير متوفر";
    }
  
    const date =
      new Date(dateValue);
  
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
  
  
  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }