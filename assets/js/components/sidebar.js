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
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </button>
        `;
      })
      .join("");

  const brandDescription =
    isAdmin
      ? "إدارة شبكة الائتمان المتبادل"
      : "شبكة الائتمان المتبادل";

  return `
    <div class="brand">
      <div class="brand-logo">م</div>

      <div>
        <div class="brand-name">
          مقاصة
        </div>

        <div class="brand-description">
          ${brandDescription}
        </div>
      </div>
    </div>

    <nav class="sidebar-navigation">
      ${navigationButtons}
    </nav>
  `;
}