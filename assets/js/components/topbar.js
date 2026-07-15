export function renderTopbar(
    title = "الرئيسية",
    description = "نظرة عامة على نشاط شركتك",
    currentUser = null,
  ) {
    const companyName =
      currentUser?.companyName
      ?? "حساب الشركة";
  
    const businessType =
      currentUser?.businessType
      ?? "الحساب التجريبي";
  
    const companyInitial =
      companyName.charAt(0);
  
    return `
      <div class="page-heading">
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
  
      <div class="topbar-user-area">
  
        <div class="company-summary">
          <div>
            <strong>${companyName}</strong>
            <p>${businessType}</p>
          </div>
  
          <div class="company-avatar">
            ${companyInitial}
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