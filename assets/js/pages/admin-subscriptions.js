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
              وتابع اشتراكات المنشآت
              داخل المنصة.
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
  
  
        <section class="admin-subscription-statistics">
  
          ${renderStatisticCard({
            label: "إجمالي الطلبات",
            value: 0,
            type: "total",
            icon: "▣",
          })}
  
          ${renderStatisticCard({
            label: "قيد المراجعة",
            value: 0,
            type: "pending",
            icon: "◷",
          })}
  
          ${renderStatisticCard({
            label: "تمت الموافقة",
            value: 0,
            type: "approved",
            icon: "✓",
          })}
  
          ${renderStatisticCard({
            label: "الطلبات المرفوضة",
            value: 0,
            type: "rejected",
            icon: "×",
          })}
  
        </section>
  
  
        <section class="admin-subscriptions-panel">
  
          <div class="admin-subscriptions-panel-header">
  
            <div>
              <h3>
                طلبات تغيير الباقات
              </h3>
  
              <p>
                ستظهر طلبات المنشآت هنا
                بعد ربط الصفحة بقاعدة البيانات.
              </p>
            </div>
  
            <select
              id="subscription-request-status-filter"
              disabled
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
  
  
          <div class="admin-subscriptions-empty-state">
  
            <div class="admin-subscriptions-empty-icon">
              ◉
            </div>
  
            <h3>
              لا توجد طلبات اشتراك حاليًا
            </h3>
  
            <p>
              بعد تفعيل إرسال الطلبات من حسابات
              المنشآت، ستظهر هنا للمراجعة والقبول
              أو الرفض.
            </p>
  
          </div>
  
        </section>
  
      </section>
    `;
  }
  
  
  export function initializeAdminSubscriptionsPage() {
    const refreshButton =
      document.getElementById(
        "refresh-subscription-requests-button",
      );
  
    refreshButton?.addEventListener(
      "click",
      () => {
        showAdminSubscriptionsMessage(
          "سيتم جلب طلبات الاشتراكات من Firebase في المرحلة التالية.",
          "info",
        );
      },
    );
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
            ${value}
          </strong>
        </div>
  
      </article>
    `;
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
  }