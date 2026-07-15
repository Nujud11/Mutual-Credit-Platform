import {
    validateRegistrationData,
  } from "../utils/validators.js";
  
  import {
    registerCompany,
    setCurrentUser,
  } from "../services/auth-service.js";
  
  
  export function renderRegisterCompanyPage() {
    return `
      <div class="auth-page">
  
        <section class="auth-visual">
          <div class="auth-brand">
            <div class="auth-brand-logo">م</div>
  
            <div>
              <div class="auth-brand-name">
                مقاصة
              </div>
  
              <div class="auth-brand-description">
                شبكة الائتمان المتبادل
              </div>
            </div>
          </div>
  
          <div class="auth-visual-content">
            <h1>
              انضم إلى شبكة أعمال
              قائمة على التعاون.
            </h1>
  
            <p>
              أنشئ حساب منشأتك، أضف خدماتك،
              واكتشف فرص تبادل جديدة تساعدك
              على إدارة السيولة بكفاءة.
            </p>
  
            <div class="auth-feature-list">
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  1
                </span>
  
                <span>
                  أنشئ ملف شركتك
                </span>
              </div>
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  2
                </span>
  
                <span>
                  اعرض الخدمات التي تقدمها
                </span>
              </div>
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  3
                </span>
  
                <span>
                  ابدأ التبادل داخل الشبكة
                </span>
              </div>
  
            </div>
          </div>
        </section>
  
  
        <section class="auth-form-section">
          <div class="auth-form-container">
  
            <div class="auth-form-header">
              <h2>إنشاء حساب شركة</h2>
  
              <p>
                أدخل المعلومات الأساسية
                لإنشاء حساب المنشأة.
              </p>
            </div>
  
            <form
              id="register-company-form"
              class="auth-form"
              novalidate
            >
  
              <div
                id="register-message"
                class="hidden"
              ></div>
  
              <div class="auth-fields-grid">
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="company-name"
                  >
                    اسم المنشأة
                  </label>
  
                  <input
                    id="company-name"
                    class="form-input"
                    type="text"
                    placeholder="مثال: مقهى النخبة"
                  >
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="business-type"
                  >
                    نوع النشاط
                  </label>
  
                  <select
                    id="business-type"
                    class="form-select"
                  >
                    <option value="">
                      اختر النشاط
                    </option>
  
                    <option value="ضيافة">
                      ضيافة ومطاعم
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
  
                    <option value="تجارة">
                      تجارة
                    </option>
  
                    <option value="أخرى">
                      أخرى
                    </option>
                  </select>
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="company-city"
                  >
                    المدينة
                  </label>
  
                  <input
                    id="company-city"
                    class="form-input"
                    type="text"
                    placeholder="مثال: الأحساء"
                  >
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="company-age"
                  >
                    عمر المنشأة بالسنوات
                  </label>
  
                  <input
                    id="company-age"
                    class="form-input"
                    type="number"
                    min="0"
                    placeholder="مثال: 3"
                  >
                </div>
  
  
                <div class="form-group full-width">
                  <label
                    class="form-label"
                    for="company-description"
                  >
                    وصف مختصر للمنشأة
                  </label>
  
                  <textarea
                    id="company-description"
                    class="form-textarea"
                    placeholder="اكتب وصفًا مختصرًا عن نشاط المنشأة..."
                  ></textarea>
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="register-email"
                  >
                    البريد الإلكتروني
                  </label>
  
                  <input
                    id="register-email"
                    class="form-input"
                    type="email"
                    autocomplete="email"
                    placeholder="company@example.com"
                  >
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="commercial-record"
                  >
                    حالة السجل التجاري
                  </label>
  
                  <select
                    id="commercial-record"
                    class="form-select"
                  >
                    <option value="false">
                      غير موثق
                    </option>
  
                    <option value="true">
                      موثق
                    </option>
                  </select>
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="register-password"
                  >
                    كلمة المرور
                  </label>
  
                  <input
                    id="register-password"
                    class="form-input"
                    type="password"
                    autocomplete="new-password"
                    placeholder="6 أحرف على الأقل"
                  >
                </div>
  
  
                <div class="form-group">
                  <label
                    class="form-label"
                    for="confirm-password"
                  >
                    تأكيد كلمة المرور
                  </label>
  
                  <input
                    id="confirm-password"
                    class="form-input"
                    type="password"
                    autocomplete="new-password"
                    placeholder="أعد كتابة كلمة المرور"
                  >
                </div>
  
              </div>
  
              <button
                class="auth-submit-button"
                type="submit"
              >
                إنشاء الحساب
              </button>
            </form>
  
            <p class="auth-switch">
              لديك حساب بالفعل؟
  
              <button
                id="show-login-button"
                class="auth-link-button"
                type="button"
              >
                تسجيل الدخول
              </button>
            </p>
  
          </div>
        </section>
  
      </div>
    `;
  }
  
  
  export function initializeRegisterCompanyPage({
    onRegistrationSuccess,
    onShowLogin,
  }) {
    const registerForm =
      document.getElementById(
        "register-company-form",
      );
  
    const messageElement =
      document.getElementById(
        "register-message",
      );
  
    const showLoginButton =
      document.getElementById(
        "show-login-button",
      );
  
  
    showLoginButton.addEventListener(
      "click",
      onShowLogin,
    );
  
  
    registerForm.addEventListener(
        "submit",
        async (event) => {
      
          event.preventDefault();
      
          const registrationData = {
      
            companyName:
              document
                .getElementById("company-name")
                .value,
      
            businessType:
              document
                .getElementById("business-type")
                .value,
      
            city:
              document
                .getElementById("company-city")
                .value,
      
            companyAge:
              document
                .getElementById("company-age")
                .value,
      
            description:
              document
                .getElementById(
                  "company-description"
                )
                .value,
      
            email:
              document
                .getElementById("register-email")
                .value,
      
            isCommercialRecordVerified:
              document
                .getElementById(
                  "commercial-record"
                )
                .value === "true",
      
            password:
              document
                .getElementById(
                  "register-password"
                )
                .value,
      
            confirmPassword:
              document
                .getElementById(
                  "confirm-password"
                )
                .value,
      
          };
      
          const validationError =
            validateRegistrationData(
              registrationData
            );
      
          if (validationError) {
      
            showMessage(
              messageElement,
              validationError,
              "error"
            );
      
            return;
      
          }
      
          const result =
            await registerCompany(
              registrationData
            );
      
          if (!result.success) {
      
            showMessage(
              messageElement,
              result.message,
              "error"
            );
      
            return;
      
          }
      
          showMessage(
            messageElement,
            "✅ تم إنشاء الحساب بنجاح، جاري تحويلك...",
            "success"
          );
      
          setTimeout(() => {
      
            setCurrentUser(result.user);
      
            onRegistrationSuccess(
              result.user
            );
      
          }, 1500);
      
        }
      );
  }
  
  
  function showMessage(
    element,
    message,
    type,
  ) {
    element.textContent = message;
    
    element.classList.remove("hidden");

    element.className =
      type === "error"
        ? "form-error-message"
        : "form-success-message";
  }