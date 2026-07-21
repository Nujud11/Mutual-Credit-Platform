const navigationItems = [
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
      id: "recommendations",
      label: "الفرص الذكية",
      icon: "✦",
    },

  ];
  
  export function renderSidebar(activePage = "dashboard") {
    const navigationButtons = navigationItems
      .map((item) => {
        const activeClass =
          item.id === activePage ? "active" : "";
  
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
  
    return `
      <div class="brand">
        <div class="brand-logo">م</div>
  
        <div>
          <div class="brand-name">مقاصة</div>
  
          <div class="brand-description">
            شبكة الائتمان المتبادل
          </div>
        </div>
      </div>
  
      <nav class="sidebar-navigation">
        ${navigationButtons}
      </nav>
    `;
  }