export function renderTopbar(
  title = "الرئيسية",
  description = "نظرة عامة على نشاط المنشأة",
  currentUser = null,
) {
  const isAdmin =
    currentUser?.role === "admin";

  const accountName =
    isAdmin
      ? (
          currentUser?.companyName
          ?? "إدارة المنصة"
        )
      : (
          currentUser?.companyName
          ?? "حساب المنشأة"
        );

  const accountDescription =
    isAdmin
      ? "حساب الإدارة"
      : (
          currentUser?.businessType
          ?? "الحساب التجريبي"
        );

  const accountInitial =
    accountName
      .trim()
      .charAt(0)
    || "م";

  return `
    <div class="page-heading">
      <h1>
        ${escapeHtml(title)}
      </h1>

      <p>
        ${escapeHtml(description)}
      </p>
    </div>

    <div class="topbar-user-area">

      <div class="notifications-menu">

        <button
          id="notifications-menu-button"
          class="notifications-menu-button"
          type="button"
          aria-label="عرض الإشعارات"
          aria-expanded="false"
        >
          <span
            class="notifications-bell-icon"
            aria-hidden="true"
          >
            ♢
          </span>

          <span
            id="notifications-unread-badge"
            class="
              notifications-unread-badge
              hidden
            "
          >
            0
          </span>
        </button>


        <section
          id="notifications-dropdown"
          class="
            notifications-dropdown
            hidden
          "
        >
          <div class="notifications-dropdown-header">

            <div>
              <strong>
                الإشعارات
              </strong>

              <p>
                آخر تحديثات الحساب
              </p>
            </div>

            <button
              id="mark-all-notifications-read-button"
              class="mark-all-notifications-read-button"
              type="button"
            >
              تحديد الكل كمقروء
            </button>

          </div>

          <div
            id="notifications-list"
            class="notifications-list"
          ></div>
        </section>

      </div>


      <div class="company-summary">
        <div>
          <strong>
            ${escapeHtml(accountName)}
          </strong>

          <p>
            ${escapeHtml(accountDescription)}
          </p>
        </div>

        <div class="company-avatar">
          ${escapeHtml(accountInitial)}
        </div>
      </div>


      <button
        id="logout-button"
        class="logout-button"
        type="button"
      >
        تسجيل الخروج
      </button>

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