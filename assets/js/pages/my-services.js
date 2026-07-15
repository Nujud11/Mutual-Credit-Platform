import {
    createService,
    deleteService,
    getCompanyServices,
  } from "../services/service-repository.js";
  
  import {
    escapeHtml,
    formatNumber,
  } from "../utils/formatters.js";
  
  
  export function renderMyServicesPage() {
    return `
      <div class="services-page">
  
        <section class="services-header">
          <div>
            <span class="section-label">
              إدارة الخدمات
            </span>
  
            <h2>
              خدماتي
            </h2>
  
            <p>
              أضف الخدمات التي تقدمها منشأتك
              لتظهر للشركات الأخرى داخل الشبكة.
            </p>
          </div>
  
          <button
            id="show-service-form-button"
            class="primary-action-button"
            type="button"
          >
            + إضافة خدمة
          </button>
        </section>
  
  
        <section
          id="service-form-container"
          class="card service-form-card hidden"
        >
          <div class="card-heading">
            <div>
              <h3>
                إضافة خدمة جديدة
              </h3>
  
              <p>
                أدخل تفاصيل الخدمة التي تقدمها منشأتك.
              </p>
            </div>
  
            <button
              id="close-service-form-button"
              class="icon-button"
              type="button"
              aria-label="إغلاق النموذج"
            >
              ×
            </button>
          </div>
  
  
          <form
            id="add-service-form"
            class="service-form"
            novalidate
          >
            <div
              id="service-form-message"
              class="hidden"
            ></div>
  
  
            <div class="service-fields-grid">
  
              <div class="form-group">
                <label
                  class="form-label"
                  for="service-title"
                >
                  اسم الخدمة
                </label>
  
                <input
                  id="service-title"
                  class="form-input"
                  type="text"
                  placeholder="مثال: ضيافة اجتماعات"
                >
              </div>
  
  
              <div class="form-group">
                <label
                  class="form-label"
                  for="service-category"
                >
                  التصنيف
                </label>
  
                <select
                  id="service-category"
                  class="form-select"
                >
                  <option value="">
                    اختر التصنيف
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
  
  
              <div class="form-group">
                <label
                  class="form-label"
                  for="service-price"
                >
                  السعر بالوحدات
                </label>
  
                <input
                  id="service-price"
                  class="form-input"
                  type="number"
                  min="1"
                  placeholder="مثال: 300"
                >
              </div>
  
  
              <div class="form-group full-width">
                <label
                  class="form-label"
                  for="service-description"
                >
                  وصف الخدمة
                </label>
  
                <textarea
                  id="service-description"
                  class="form-textarea"
                  placeholder="اكتب وصفًا واضحًا للخدمة..."
                ></textarea>
              </div>
  
            </div>
  
  
            <div class="service-form-actions">
              <button
                id="cancel-service-button"
                class="secondary-action-button"
                type="button"
              >
                إلغاء
              </button>
  
              <button
                id="save-service-button"
                class="primary-action-button"
                type="submit"
              >
                حفظ الخدمة
              </button>
            </div>
          </form>
        </section>
  
  
        <section class="services-content">
  
          <div class="services-summary">
            <div>
              <span>
                إجمالي الخدمات
              </span>
  
              <strong id="services-count">
                0
              </strong>
            </div>
  
            <p>
              الخدمات النشطة التي تقدمها منشأتك.
            </p>
          </div>
  
  
          <div
            id="services-list"
            class="services-list"
          >
            ${renderLoadingState()}
          </div>
  
        </section>
  
      </div>
    `;
  }
  
  
  export async function initializeMyServicesPage({
    currentUser,
  }) {
    const formContainer =
      document.getElementById(
        "service-form-container",
      );
  
    const showFormButton =
      document.getElementById(
        "show-service-form-button",
      );
  
    const closeFormButton =
      document.getElementById(
        "close-service-form-button",
      );
  
    const cancelButton =
      document.getElementById(
        "cancel-service-button",
      );
  
    const serviceForm =
      document.getElementById(
        "add-service-form",
      );
  
  
    function showForm() {
      formContainer.classList.remove(
        "hidden",
      );
  
      document
        .getElementById("service-title")
        .focus();
    }
  
  
    function hideForm() {
      formContainer.classList.add(
        "hidden",
      );
  
      serviceForm.reset();
  
      hideFormMessage();
    }
  
  
    showFormButton.addEventListener(
      "click",
      showForm,
    );
  
    closeFormButton.addEventListener(
      "click",
      hideForm,
    );
  
    cancelButton.addEventListener(
      "click",
      hideForm,
    );
  
  
    serviceForm.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
  
        const serviceData =
          getServiceFormData(
            currentUser,
          );
  
        const validationError =
          validateServiceData(
            serviceData,
          );
  
        if (validationError) {
          showFormMessage(
            validationError,
            "error",
          );
  
          return;
        }
  
        setFormLoading(true);
  
        try {
          await createService(
            serviceData,
          );
  
          showFormMessage(
            "تمت إضافة الخدمة بنجاح.",
            "success",
          );
  
          await loadServices(
            currentUser.id,
          );
  
          setTimeout(
            hideForm,
            800,
          );
  
        } catch (error) {
          console.error(
            "تعذر إضافة الخدمة:",
            error,
          );
  
          showFormMessage(
            "تعذر حفظ الخدمة. حاول مرة أخرى.",
            "error",
          );
  
        } finally {
          setFormLoading(false);
        }
      },
    );
  
  
    await loadServices(
      currentUser.id,
    );
  }
  
  
  function getServiceFormData(
    currentUser,
  ) {
    return {
      companyId:
        currentUser.id,
  
      companyName:
        currentUser.companyName,
  
      title:
        document
          .getElementById("service-title")
          .value,
  
      category:
        document
          .getElementById("service-category")
          .value,
  
      price:
        document
          .getElementById("service-price")
          .value,
  
      description:
        document
          .getElementById(
            "service-description",
          )
          .value,
    };
  }
  
  
  function validateServiceData(
    serviceData,
  ) {
    if (!serviceData.title.trim()) {
      return "يرجى إدخال اسم الخدمة.";
    }
  
    if (!serviceData.category) {
      return "يرجى اختيار تصنيف الخدمة.";
    }
  
    if (
      !Number(serviceData.price)
      || Number(serviceData.price) <= 0
    ) {
      return "يرجى إدخال سعر صحيح أكبر من صفر.";
    }
  
    if (
      serviceData.description
        .trim()
        .length < 10
    ) {
      return "يجب ألا يقل وصف الخدمة عن 10 أحرف.";
    }
  
    return null;
  }
  
  
  async function loadServices(
    companyId,
  ) {
    const servicesList =
      document.getElementById(
        "services-list",
      );
  
    servicesList.innerHTML =
      renderLoadingState();
  
    try {
      const services =
        await getCompanyServices(
          companyId,
        );
  
      updateServicesCount(
        services.length,
      );
  
      if (!services.length) {
        servicesList.innerHTML =
          renderEmptyState();
  
        return;
      }
  
      servicesList.innerHTML =
        services
          .map(renderServiceCard)
          .join("");
  
      attachDeleteEvents(
        companyId,
      );
  
    } catch (error) {
      console.error(
        "تعذر جلب الخدمات:",
        error,
      );
  
      servicesList.innerHTML =
        renderErrorState();
    }
  }
  
  
  function renderServiceCard(
    service,
  ) {
    return `
      <article class="service-card">
  
        <div class="service-card-header">
  
          <div class="service-category-icon">
            ${getCategoryIcon(
              service.category,
            )}
          </div>
  
          <div class="service-card-actions">
            <span class="service-status">
              نشطة
            </span>
  
            <button
              class="delete-service-button"
              data-service-id="${service.id}"
              type="button"
              aria-label="حذف الخدمة"
            >
              حذف
            </button>
          </div>
  
        </div>
  
  
        <span class="service-category">
          ${escapeHtml(
            service.category,
          )}
        </span>
  
        <h3>
          ${escapeHtml(
            service.title,
          )}
        </h3>
  
        <p>
          ${escapeHtml(
            service.description,
          )}
        </p>
  
  
        <div class="service-card-footer">
          <span>
            السعر
          </span>
  
          <strong>
            ${formatNumber(
              service.price,
            )}
            وحدة
          </strong>
        </div>
  
      </article>
    `;
  }
  
  
  function attachDeleteEvents(
    companyId,
  ) {
    const deleteButtons =
      document.querySelectorAll(
        ".delete-service-button",
      );
  
    deleteButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const shouldDelete =
              window.confirm(
                "هل أنت متأكد من حذف هذه الخدمة؟",
              );
  
            if (!shouldDelete) {
              return;
            }
  
            button.disabled = true;
  
            try {
              await deleteService(
                button.dataset.serviceId,
              );
  
              await loadServices(
                companyId,
              );
  
            } catch (error) {
              console.error(
                "تعذر حذف الخدمة:",
                error,
              );
  
              window.alert(
                "تعذر حذف الخدمة.",
              );
  
              button.disabled = false;
            }
          },
        );
      },
    );
  }
  
  
  function showFormMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "service-form-message",
      );
  
    messageElement.textContent =
      message;
  
    messageElement.className =
      type === "error"
        ? "form-error-message"
        : "form-success-message";
  }
  
  
  function hideFormMessage() {
    const messageElement =
      document.getElementById(
        "service-form-message",
      );
  
    messageElement.textContent = "";
  
    messageElement.className =
      "hidden";
  }
  
  
  function setFormLoading(
    isLoading,
  ) {
    const saveButton =
      document.getElementById(
        "save-service-button",
      );
  
    saveButton.disabled =
      isLoading;
  
    saveButton.textContent =
      isLoading
        ? "جاري الحفظ..."
        : "حفظ الخدمة";
  }
  
  
  function updateServicesCount(
    count,
  ) {
    document
      .getElementById(
        "services-count",
      )
      .textContent =
        formatNumber(count);
  }
  
  
  function renderLoadingState() {
    return `
      <div class="services-state">
        <span class="state-icon">
          ◌
        </span>
  
        <h3>
          جاري تحميل الخدمات...
        </h3>
      </div>
    `;
  }
  
  
  function renderEmptyState() {
    return `
      <div class="services-state">
        <span class="state-icon">
          ◇
        </span>
  
        <h3>
          لم تضف أي خدمة بعد
        </h3>
  
        <p>
          أضف أول خدمة لتظهر للشركات
          الأخرى داخل الشبكة.
        </p>
      </div>
    `;
  }
  
  
  function renderErrorState() {
    return `
      <div class="services-state services-state--error">
        <span class="state-icon">
          !
        </span>
  
        <h3>
          تعذر تحميل الخدمات
        </h3>
  
        <p>
          حدث خطأ أثناء الاتصال بقاعدة البيانات.
        </p>
      </div>
    `;
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
  
    return icons[category] ?? "◇";
  }