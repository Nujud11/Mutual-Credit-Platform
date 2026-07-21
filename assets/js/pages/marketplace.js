import {
    getMarketplaceServices,
  } from "../services/service-repository.js";
  
  import {
    createTransaction,
  } from "../services/transaction-repository.js";
  
  import {
    escapeHtml,
    formatNumber,
  } from "../utils/formatters.js";
  
  
  let marketplaceServices = [];
  
  let marketplaceCurrentUser = null;
  
  
  export function renderMarketplacePage() {
    return `
      <div class="marketplace-page">
  
        <section class="marketplace-header">
          <div>
            <span class="marketplace-label">
              شبكة الأعمال
            </span>
  
            <h2>
              سوق الخدمات
            </h2>
  
            <p>
              اكتشف الخدمات التي تقدمها
              المنشآت الأخرى، واختر الخدمة
              المناسبة لاحتياج شركتك.
            </p>
          </div>
  
          <div class="marketplace-header-icon">
            ◫
          </div>
        </section>
  
  
        <section class="marketplace-controls card">
  
          <div class="marketplace-search-group">
            <label
              class="form-label"
              for="marketplace-search"
            >
              البحث عن خدمة
            </label>
  
            <input
              id="marketplace-search"
              class="form-input"
              type="search"
              placeholder="ابحث باسم الخدمة أو الشركة..."
            >
          </div>
  
  
          <div class="marketplace-filter-group">
            <label
              class="form-label"
              for="marketplace-category"
            >
              التصنيف
            </label>
  
            <select
              id="marketplace-category"
              class="form-select"
            >
              <option value="all">
                جميع التصنيفات
              </option>
  
              <option value="ضيافة">
                ضيافة
              </option>
  
              <option value="طباعة">
                طباعة وتصميم
              </option>
  
              <option value="توصيل">
                نقل وتوصيل
              </option>
  
              <option value="تقنية">
                تقنية
              </option>
  
              <option value="تسويق">
                تسويق
              </option>
  
              <option value="استشارات">
                استشارات
              </option>
  
              <option value="أخرى">
                أخرى
              </option>
            </select>
          </div>
  
  
          <div class="marketplace-results-summary">
            <span>
              النتائج
            </span>
  
            <strong id="marketplace-results-count">
              0
            </strong>
          </div>
  
        </section>
  
  
        <section
          id="marketplace-message"
          class="hidden"
        ></section>
  
  
        <section
          id="marketplace-services-list"
          class="marketplace-services-list"
        >
          ${renderLoadingState()}
        </section>
  
      </div>
    `;
  }
  
  
  export async function initializeMarketplacePage({
    currentUser,
  }) {
    marketplaceCurrentUser =
      currentUser;
  
    const searchInput =
      document.getElementById(
        "marketplace-search",
      );
  
    const categorySelect =
      document.getElementById(
        "marketplace-category",
      );
  
    searchInput.addEventListener(
      "input",
      applyMarketplaceFilters,
    );
  
    categorySelect.addEventListener(
      "change",
      applyMarketplaceFilters,
    );
  
    await loadMarketplaceServices(
      currentUser.id,
    );
  }
  
  
  async function loadMarketplaceServices(
    currentCompanyId,
  ) {
    const servicesList =
      document.getElementById(
        "marketplace-services-list",
      );
  
    servicesList.innerHTML =
      renderLoadingState();
  
    try {
      marketplaceServices =
        await getMarketplaceServices(
          currentCompanyId,
        );
  
      renderFilteredServices(
        marketplaceServices,
      );
  
    } catch (error) {
      console.error(
        "تعذر تحميل سوق الخدمات:",
        error,
      );
  
      updateResultsCount(0);
  
      servicesList.innerHTML =
        renderErrorState();
    }
  }
  
  
  function applyMarketplaceFilters() {
    const searchValue =
      document
        .getElementById(
          "marketplace-search",
        )
        .value
        .trim()
        .toLowerCase();
  
    const selectedCategory =
      document
        .getElementById(
          "marketplace-category",
        )
        .value;
  
    const filteredServices =
      marketplaceServices.filter(
        (service) => {
          const searchableText = `
            ${service.title ?? ""}
            ${service.description ?? ""}
            ${service.companyName ?? ""}
            ${service.category ?? ""}
          `.toLowerCase();
  
          const matchesSearch =
            searchableText.includes(
              searchValue,
            );
  
          const matchesCategory =
            selectedCategory === "all"
            || service.category
              === selectedCategory;
  
          return (
            matchesSearch
            && matchesCategory
          );
        },
      );
  
    renderFilteredServices(
      filteredServices,
    );
  }
  
  
  function renderFilteredServices(
    services,
  ) {
    const servicesList =
      document.getElementById(
        "marketplace-services-list",
      );
  
    updateResultsCount(
      services.length,
    );
  
    if (!services.length) {
      servicesList.innerHTML =
        marketplaceServices.length
          ? renderNoResultsState()
          : renderEmptyMarketplaceState();
  
      return;
    }
  
    servicesList.innerHTML =
      services
        .map(
          renderMarketplaceServiceCard,
        )
        .join("");
  
    attachRequestServiceEvents();
  }
  
  
  function renderMarketplaceServiceCard(
    service,
  ) {
    return `
      <article class="marketplace-service-card">
  
        <div class="marketplace-card-header">
  
          <div class="marketplace-category-icon">
            ${getCategoryIcon(
              service.category,
            )}
          </div>
  
          <span class="marketplace-service-status">
            متاحة
          </span>
  
        </div>
  
  
        <span class="marketplace-service-category">
          ${escapeHtml(
            service.category,
          )}
        </span>
  
  
        <h3>
          ${escapeHtml(
            service.title,
          )}
        </h3>
  
  
        <p class="marketplace-service-description">
          ${escapeHtml(
            service.description,
          )}
        </p>
  
  
        <div class="marketplace-company">
          <span class="marketplace-company-avatar">
            ${getCompanyInitial(
              service.companyName,
            )}
          </span>
  
          <div>
            <small>
              مقدم الخدمة
            </small>
  
            <strong>
              ${escapeHtml(
                service.companyName,
              )}
            </strong>
          </div>
        </div>
  
  
        <div class="marketplace-card-footer">
  
          <div>
            <small>
              السعر
            </small>
  
            <strong>
              ${formatNumber(
                service.price,
              )}
              MQ
            </strong>
          </div>
  
          <button
            class="request-service-button"
            data-service-id="${service.id}"
            type="button"
          >
            طلب الخدمة
          </button>
  
        </div>
  
      </article>
    `;
  }
  
  
  function attachRequestServiceEvents() {
    const requestButtons =
      document.querySelectorAll(
        ".request-service-button",
      );
  
    requestButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const selectedService =
              marketplaceServices.find(
                (service) =>
                  service.id
                  === button.dataset.serviceId,
              );
  
            if (
              !selectedService
              || !marketplaceCurrentUser
            ) {
              return;
            }
  
            const shouldCreateRequest =
              window.confirm(
                `هل تريد طلب خدمة "${selectedService.title}" بقيمة ${selectedService.price} MQ`,
              );
  
            if (!shouldCreateRequest) {
              return;
            }
  
            button.disabled = true;
  
            button.textContent =
              "جاري إرسال الطلب...";
  
            try {
              await createTransaction({
                buyerCompanyId:
                  marketplaceCurrentUser.id,
  
                buyerCompanyName:
                  marketplaceCurrentUser
                    .companyName,
  
                sellerCompanyId:
                  selectedService.companyId,
  
                sellerCompanyName:
                  selectedService.companyName,
  
                serviceId:
                  selectedService.id,
  
                serviceName:
                  selectedService.title,
  
                serviceCategory:
                  selectedService.category,
  
                amount:
                  selectedService.price,
              });
  
              showMarketplaceMessage(
                `تم إرسال طلب خدمة "${selectedService.title}" إلى ${selectedService.companyName} بنجاح.`,
                "success",
              );
  
              button.textContent =
                "تم إرسال الطلب";
  
            } catch (error) {
              console.error(
                "تعذر إنشاء طلب الخدمة:",
                error,
              );

              showMarketplaceMessage(
                getMarketplaceTransactionErrorMessage(
                  error,
                ),
                "error",
              );
  
              button.disabled = false;
  
              button.textContent =
                "طلب الخدمة";
            }
  
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          },
        );
      },
    );
  }
  
  function getMarketplaceTransactionErrorMessage(
    error,
  ) {
    const messages = {
      "company-not-active":
        "لا يمكن إرسال الطلب لأن إحدى المنشأتين غير نشطة حاليًا.",
  
      "company-not-found":
        "تعذر العثور على بيانات إحدى المنشأتين.",
  
      "service-not-found":
        "هذه الخدمة لم تعد موجودة.",
  
      "service-not-active":
        "هذه الخدمة غير متاحة حاليًا.",
  
      "invalid-service-provider":
        "تعذر التحقق من مقدم الخدمة.",
    };
  
    return (
      messages[error?.message]
      ?? "تعذر إرسال طلب الخدمة. حاول مرة أخرى."
    );
  }
  
  function showMarketplaceMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "marketplace-message",
      );
  
    messageElement.textContent =
      message;
  
    messageElement.className =
      type === "error"
        ? "form-error-message"
        : "form-success-message";
  
    setTimeout(() => {
      messageElement.className =
        "hidden";
  
      messageElement.textContent =
        "";
    }, 4000);
  }
  
  
  function updateResultsCount(
    count,
  ) {
    document
      .getElementById(
        "marketplace-results-count",
      )
      .textContent =
        formatNumber(count);
  }
  
  
  function renderLoadingState() {
    return `
      <div class="marketplace-state">
        <span class="marketplace-state-icon">
          ◌
        </span>
  
        <h3>
          جاري تحميل سوق الخدمات...
        </h3>
      </div>
    `;
  }
  
  
  function renderEmptyMarketplaceState() {
    return `
      <div class="marketplace-state">
        <span class="marketplace-state-icon">
          ◫
        </span>
  
        <h3>
          لا توجد خدمات متاحة حاليًا
        </h3>
  
        <p>
          ستظهر هنا الخدمات التي تضيفها
          الشركات الأخرى داخل الشبكة.
        </p>
      </div>
    `;
  }
  
  
  function renderNoResultsState() {
    return `
      <div class="marketplace-state">
        <span class="marketplace-state-icon">
          ⌕
        </span>
  
        <h3>
          لا توجد نتائج مطابقة
        </h3>
  
        <p>
          جرب تغيير كلمة البحث
          أو اختيار تصنيف آخر.
        </p>
      </div>
    `;
  }
  
  
  function renderErrorState() {
    return `
      <div
        class="
          marketplace-state
          marketplace-state--error
        "
      >
        <span class="marketplace-state-icon">
          !
        </span>
  
        <h3>
          تعذر تحميل الخدمات
        </h3>
  
        <p>
          حدث خطأ أثناء الاتصال
          بقاعدة البيانات.
        </p>
      </div>
    `;
  }
  
  
  function getCompanyInitial(
    companyName,
  ) {
    return String(
      companyName ?? "ش",
    )
      .trim()
      .charAt(0);
  }
  
  
  function getCategoryIcon(
    category,
  ) {
    const icons = {
      "ضيافة": "☕",
      "طباعة": "▣",
      "توصيل": "↗",
      "تقنية": "⌘",
      "تسويق": "◎",
      "استشارات": "◇",
      "أخرى": "◫",
    };
  
    return icons[category]
      ?? "◇";
  }