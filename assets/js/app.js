import {
  renderSidebar,
} from "./components/sidebar.js";

import {
  renderTopbar,
} from "./components/topbar.js";

import {
  initializeNotificationsMenu,
} from "./components/notifications-menu.js";

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
  renderSubscriptionsPage,
  initializeSubscriptionsPage,
} from "./pages/subscriptions.js";

import {
  renderRecommendationsPage,
  initializeRecommendationsPage,
} from "./pages/recommendations.js";

import {
  renderPlatformGuidePage,
  initializePlatformGuidePage,
} from "./pages/platform-guide.js";

import {
  renderAdminRegistrationRequestsPage,
  initializeAdminRegistrationRequestsPage,
} from "./pages/admin-registration-requests.js";

import {
  renderAdminDashboardPage,
  initializeAdminDashboardPage,
} from "./pages/admin-dashboard.js";

import {
  renderAdminCompaniesPage,
  initializeAdminCompaniesPage,
} from "./pages/admin-companies.js";

import {
  renderAdminSubscriptionsPage,
  initializeAdminSubscriptionsPage,
} from "./pages/admin-subscriptions.js";

import {
  getCurrentUser,
  logout,
} from "./services/auth-service.js";


const ADMIN_DEFAULT_PAGE =
  "admin-dashboard";

const COMPANY_DEFAULT_PAGE =
  "dashboard";


const adminPages = [
  "admin-dashboard",
  "admin-registration-requests",
  "admin-companies",
  "admin-subscriptions",
];

const companyPages = [
  "dashboard",
  "marketplace",
  "my-services",
  "transactions",
  "subscriptions",
  "recommendations",
  "platform-guide",
];


let currentUser =
  getCurrentUser();

let activePage =
  getDefaultPageForUser(
    currentUser,
  );


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
    activePage =
      getDefaultPageForUser(
        currentUser,
      );

    showMainApplication();

    return;
  }

  showLoginPage();
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

  activePage =
    getDefaultPageForUser(
      currentUser,
    );

  showMainApplication();
}


function showMainApplication() {
  if (!currentUser) {
    showLoginPage();

    return;
  }

  activePage =
    getAuthorizedPage(
      activePage,
      currentUser,
    );

  authRootElement.classList.add(
    "hidden",
  );

  appRootElement.classList.remove(
    "hidden",
  );

  renderApplication();
}


function renderApplication() {
  if (!currentUser) {
    showLoginPage();

    return;
  }

  activePage =
    getAuthorizedPage(
      activePage,
      currentUser,
    );

  const pageInformation =
    getPageInformation(
      activePage,
    );

  sidebarElement.innerHTML =
    renderSidebar(
      activePage,
      currentUser,
    );

  topbarElement.innerHTML =
    renderTopbar(
      pageInformation.title,
      pageInformation.description,
      currentUser,
    );

  renderActivePage();

  attachNavigationEvents();

  attachLogoutEvent();

  initializeNotificationsMenu({
    currentUser,
  });
}


function renderActivePage() {
  if (
    activePage === "dashboard"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderDashboard(
        currentUser,
      );

    initializeDashboard({
      currentUser,

      onNavigate:
        navigateToPage,

      onUserUpdated:
        handleCurrentUserUpdate,
    });

    return;
  }


  if (
    activePage === "marketplace"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderMarketplacePage();

    initializeMarketplacePage({
      currentUser,
    });

    return;
  }


  if (
    activePage === "my-services"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderMyServicesPage();

    initializeMyServicesPage({
      currentUser,
    });

    return;
  }


  if (
    activePage === "transactions"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderTransactionsPage();

    initializeTransactionsPage({
      currentUser,
    });

    return;
  }

  if (
    activePage === "subscriptions"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderSubscriptionsPage(
        currentUser,
      );
  
    initializeSubscriptionsPage({
      currentUser,
    });
  
    return;
  }


  if (
    activePage === "recommendations"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderRecommendationsPage();

    initializeRecommendationsPage({
      currentUser,
    });

    return;
  }


  if (
    activePage === "platform-guide"
    && currentUser?.role !== "admin"
  ) {
    pageContentElement.innerHTML =
      renderPlatformGuidePage();

    initializePlatformGuidePage();

    return;
  }

  if (
    activePage === "admin-dashboard"
    && currentUser?.role === "admin"
  ) {
    pageContentElement.innerHTML =
      renderAdminDashboardPage();
  
    initializeAdminDashboardPage({
      onNavigate:
        navigateToPage,
    });
  
    return;
  }

  if (
    activePage === "admin-companies"
    && currentUser?.role === "admin"
  ) {
    pageContentElement.innerHTML =
      renderAdminCompaniesPage();
  
    initializeAdminCompaniesPage();
  
    return;
  }

  if (
    activePage === "admin-subscriptions"
    && currentUser?.role === "admin"
  ) {
    pageContentElement.innerHTML =
      renderAdminSubscriptionsPage();
  
    initializeAdminSubscriptionsPage();
  
    return;
  }


  if (
    activePage
      === "admin-registration-requests"
    && currentUser?.role === "admin"
  ) {
    pageContentElement.innerHTML =
      renderAdminRegistrationRequestsPage();

    initializeAdminRegistrationRequestsPage();

    return;
  }


  activePage =
    getDefaultPageForUser(
      currentUser,
    );

  renderApplication();
}


function handleCurrentUserUpdate(
  freshUser,
) {
  currentUser = freshUser;

  activePage =
    getAuthorizedPage(
      activePage,
      currentUser,
    );

  const pageInformation =
    getPageInformation(
      activePage,
    );

  sidebarElement.innerHTML =
    renderSidebar(
      activePage,
      currentUser,
    );

  topbarElement.innerHTML =
    renderTopbar(
      pageInformation.title,
      pageInformation.description,
      currentUser,
    );

  attachNavigationEvents();

  attachLogoutEvent();

  initializeNotificationsMenu({
    currentUser,
  });
}


function navigateToPage(pageId) {
  const authorizedPage =
    getAuthorizedPage(
      pageId,
      currentUser,
    );

  activePage =
    authorizedPage;

  renderApplication();
}


function getAuthorizedPage(
  requestedPage,
  user,
) {
  if (!user) {
    return COMPANY_DEFAULT_PAGE;
  }

  const isAdmin =
    user.role === "admin";

  if (isAdmin) {
    return adminPages.includes(
      requestedPage,
    )
      ? requestedPage
      : ADMIN_DEFAULT_PAGE;
  }

  return companyPages.includes(
    requestedPage,
  )
    ? requestedPage
    : COMPANY_DEFAULT_PAGE;
}


function getDefaultPageForUser(
  user,
) {
  return user?.role === "admin"
    ? ADMIN_DEFAULT_PAGE
    : COMPANY_DEFAULT_PAGE;
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

      activePage =
        COMPANY_DEFAULT_PAGE;

      showLoginPage();
    },
  );
}


initializeApplication();