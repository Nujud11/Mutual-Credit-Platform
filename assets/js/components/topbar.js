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

    <button
      id="mobile-menu-button"
      class="mobile-menu-button"
      type="button"
      aria-label="فتح القائمة"
      aria-expanded="false"
      aria-controls="sidebar"
    >
      ☰
    </button>

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
            <svg
              class="notifications-bell-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 8C18 4.686 15.314 2 12 2C8.686 2 6 4.686 6 8V11.5C6 12.4 5.6 13.3 4.9 13.9L4 14.7V17H20V14.7L19.1 13.9C18.4 13.3 18 12.4 18 11.5V8Z"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <path
                d="M10 20C10.4 21.2 11.1 22 12 22C12.9 22 13.6 21.2 14 20"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>

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
        class="logout-button"
        data-logout-button
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