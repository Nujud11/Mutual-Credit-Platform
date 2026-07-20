import {
    renderSidebar,
  } from "./components/sidebar.js";
  
  import {
    renderTopbar,
  } from "./components/topbar.js";
  
  import {
    getPageInformation,
  } from "./router.js";
  
  import {
    renderLoginPage,
    initializeLoginPage,
  } from "./pages/login.js";
  
  import {
    renderRegisterCompanyPage,
    initializeRegisterCompanyPage,
  } from "./pages/register-company.js";
  
  import {
    renderDashboard,
    initializeDashboard,
  } from "./pages/dashboard.js";
  
  import {
    renderMyServicesPage,
    initializeMyServicesPage,
  } from "./pages/my-services.js";

  import {
    renderMarketplacePage,
    initializeMarketplacePage,
  } from "./pages/marketplace.js";

  import {
    renderTransactionsPage,
    initializeTransactionsPage,
  } from "./pages/transactions.js";

  import {
    renderRecommendationsPage,
    initializeRecommendationsPage,
  } from "./pages/recommendations.js";

  import {
    renderNetworkPage,
    initializeNetworkPage,
  } from "./pages/network.js";

  import {
    getCurrentUser,
    logout,
  } from "./services/auth-service.js";
  
  
  let activePage = "dashboard";
  
  let currentUser =
    getCurrentUser();
  
  
  const authRootElement =
    document.getElementById(
      "auth-root",
    );
  
  const appRootElement =
    document.getElementById(
      "app-root",
    );
  
  const sidebarElement =
    document.getElementById(
      "sidebar",
    );
  
  const topbarElement =
    document.getElementById(
      "topbar",
    );
  
  const pageContentElement =
    document.getElementById(
      "page-content",
    );
  
  
  function initializeApplication() {
    if (currentUser) {
      showMainApplication();
    } else {
      showLoginPage();
    }
  }
  
  
  function showLoginPage() {
    appRootElement.classList.add(
      "hidden",
    );
  
    authRootElement.classList.remove(
      "hidden",
    );
  
    authRootElement.innerHTML =
      renderLoginPage();
  
    initializeLoginPage({
      onLoginSuccess:
        handleLoginSuccess,
  
      onShowRegister:
        showRegisterCompanyPage,
    });
  }
  
  
  function showRegisterCompanyPage() {
    appRootElement.classList.add(
      "hidden",
    );
  
    authRootElement.classList.remove(
      "hidden",
    );
  
    authRootElement.innerHTML =
      renderRegisterCompanyPage();
  
    initializeRegisterCompanyPage({
      onRegistrationSuccess:
        handleLoginSuccess,
  
      onShowLogin:
        showLoginPage,
    });
  }
  
  
  function handleLoginSuccess(user) {
    currentUser = user;
  
    activePage = "dashboard";
  
    showMainApplication();
  }
  
  
  function showMainApplication() {
    authRootElement.classList.add(
      "hidden",
    );
  
    appRootElement.classList.remove(
      "hidden",
    );
  
    renderApplication();
  }
  
  
  function renderApplication() {
    const pageInformation =
      getPageInformation(activePage);
  
    sidebarElement.innerHTML =
      renderSidebar(activePage);
  
    topbarElement.innerHTML =
      renderTopbar(
        pageInformation.title,
        pageInformation.description,
        currentUser,
      );
  
    renderActivePage();
  
    attachNavigationEvents();
  
    attachLogoutEvent();
  }
  
  
  function renderActivePage() {
    if (activePage === "dashboard") {
      pageContentElement.innerHTML =
        renderDashboard(currentUser);

      initializeDashboard({
        currentUser,
      
        onNavigate:
          navigateToPage,
      
        onUserUpdated:
          (freshUser) => {
            currentUser =
              freshUser;
      
            const pageInformation =
              getPageInformation(
                activePage,
              );
      
            topbarElement.innerHTML =
              renderTopbar(
                pageInformation.title,
                pageInformation.description,
                currentUser,
              );
      
            attachLogoutEvent();
          },
      });
  
      return;
    }

    if (activePage === "my-services") {
        pageContentElement.innerHTML =
          renderMyServicesPage();
      
        initializeMyServicesPage({
          currentUser,
        });
      
        return;
    }

    if (activePage === "marketplace") {
        pageContentElement.innerHTML =
          renderMarketplacePage();
      
        initializeMarketplacePage({
          currentUser,
        });
      
        return;
      }

    if (activePage === "transactions") {
    pageContentElement.innerHTML =
        renderTransactionsPage();
    
    initializeTransactionsPage({
        currentUser,
    });
    
    return;
    }

    if (activePage === "recommendations") {
        pageContentElement.innerHTML =
          renderRecommendationsPage();
      
        initializeRecommendationsPage({
          currentUser,
        });
      
        return;
      }

    if (activePage === "netting-network") {
      pageContentElement.innerHTML =
        renderNetworkPage();
    
      initializeNetworkPage({
        currentUser,
      });
    
      return;
    }
    
  
    const pageInformation =
      getPageInformation(activePage);
  
    pageContentElement.innerHTML = `
      <div class="card page-placeholder">
        <div>
          <h2>
            ${pageInformation.title}
          </h2>
  
          <p>
            سيتم بناء محتوى هذه الصفحة
            في الخطوة القادمة.
          </p>
        </div>
      </div>
    `;
  }
  
  
  function navigateToPage(pageId) {
    activePage = pageId;
  
    renderApplication();
  }
  
  
  function attachNavigationEvents() {
    const navigationButtons =
      document.querySelectorAll(
        ".navigation-button",
      );
  
    navigationButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            navigateToPage(
              button.dataset.page,
            );
          },
        );
      },
    );
  }
  
  
  function attachLogoutEvent() {
    const logoutButton =
      document.getElementById(
        "logout-button",
      );
  
    if (!logoutButton) {
      return;
    }
  
    logoutButton.addEventListener(
      "click",
      async () => {
        await logout();
  
        currentUser = null;
  
        activePage = "dashboard";
  
        showLoginPage();
      },
    );
  }
  
  
  initializeApplication();