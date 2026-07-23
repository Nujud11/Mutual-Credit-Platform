const companyNavigationItems = [
  {
    id: "dashboard",
    label: "الرئيسية",
    icon: "⌂",
  },
  {
    id: "marketplace",
    label: "سوق الخدمات",
    icon: "◫",
  },
  {
    id: "my-services",
    label: "خدماتي",
    icon: "◇",
  },
  {
    id: "transactions",
    label: "المعاملات",
    icon: "⇄",
  },
  {
    id: "subscriptions",
    label: "الاشتراكات",
    icon: "◉",
  },
  {
    id: "recommendations",
    label: "الفرص الذكية",
    icon: "✦",
  },
  {
    id: "platform-guide",
    label: "دليل المنصة",
    icon: "◉",
  },
  {
    id: "project-team",
    label: "تواصل معنا",
    icon: "✉",
  },
];


const adminNavigationItems = [
  {
    id: "admin-dashboard",
    label: "لوحة التحكم",
    icon: "⌂",
  },
  {
    id: "admin-registration-requests",
    label: "طلبات التسجيل",
    icon: "▣",
  },
  {
    id: "admin-companies",
    label: "إدارة المنشآت",
    icon: "▥",
  },
  {
    id: "admin-subscriptions",
    label: "إدارة الاشتراكات",
    icon: "◉",
  },
  {
    id: "project-team",
    label: "تواصل معنا",
    icon: "✉",
  },
];


export function renderSidebar(
  activePage = "dashboard",
  currentUser = null,
) {
  const isAdmin =
    currentUser?.role === "admin";

  const navigationItems =
    isAdmin
      ? adminNavigationItems
      : companyNavigationItems;

  const navigationButtons =
    navigationItems
      .map((item) => {
        const activeClass =
          item.id === activePage
            ? "active"
            : "";

        return `
          <button
            class="navigation-button ${activeClass}"
            data-page="${item.id}"
            type="button"
          >
            <span
              class="navigation-button-icon"
              aria-hidden="true"
            >
              ${item.icon}
            </span>

            <span>
              ${item.label}
            </span>
          </button>
        `;
      })
      .join("");

  const brandDescription =
    isAdmin
      ? "إدارة شبكة الائتمان المتبادل"
      : "شبكة الائتمان المتبادل";

  return `
    <div class="sidebar-header">
      <div class="brand">
        <div class="brand-logo">
          م
        </div>

        <div>
          <div class="brand-name">
            مقاصة
          </div>

          <div class="brand-description">
            ${brandDescription}
          </div>
        </div>
      </div>

      <button
        id="close-sidebar-button"
        class="close-sidebar-button"
        type="button"
        aria-label="إغلاق القائمة"
      >
        ×
      </button>
    </div>

    <nav
      class="sidebar-navigation"
      aria-label="القائمة الرئيسية"
    >
      ${navigationButtons}
    </nav>

    <button
      class="sidebar-logout-button"
      data-logout-button
      type="button"
    >
      <span aria-hidden="true">↪</span>
      <span>تسجيل الخروج</span>
    </button>
  `;
}