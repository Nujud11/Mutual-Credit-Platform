import {
    validateLoginData,
  } from "../utils/validators.js";
  
  import {
    login,
  } from "../services/auth-service.js";
  
  
  export function renderLoginPage() {
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
              تبادل الخدمات،
              وحقق توازنًا ماليًا أذكى.
            </h1>
  
            <p>
              منصة تربط المنشآت الصغيرة
              لتبادل الخدمات بالائتمان المتبادل،
              وتساعدها على خفض الحاجة إلى السيولة
              النقدية.
            </p>
  
            <div class="auth-feature-list">
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  ⇄
                </span>
  
                <span>
                  تبادل الخدمات دون دفع نقدي فوري
                </span>
              </div>
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  ✦
                </span>
  
                <span>
                  توصيات ذكية لتحسين الرصيد
                </span>
              </div>
  
              <div class="auth-feature">
                <span class="auth-feature-icon">
                  ⌘
                </span>
  
                <span>
                  تسوية الديون المتقاطعة تلقائيًا
                </span>
              </div>
  
            </div>
          </div>
        </section>
  
  
        <section class="auth-form-section">
          <div class="auth-form-container">
  
            <div class="auth-form-header">
              <h2>تسجيل الدخول</h2>
  
              <p>
                أدخل بيانات حساب شركتك
                للوصول إلى المنصة.
              </p>
            </div>
  
            <form
              id="login-form"
              class="auth-form"
              novalidate
            >
  
              <div
                id="login-message"
                class="hidden"
              ></div>
  
              <div class="form-group">
                <label
                  class="form-label"
                  for="login-email"
                >
                  البريد الإلكتروني
                </label>
  
                <input
                  id="login-email"
                  class="form-input"
                  type="email"
                  autocomplete="email"
                  placeholder="company@example.com"
                >
              </div>
  
              <div class="form-group">
                <label
                  class="form-label"
                  for="login-password"
                >
                  كلمة المرور
                </label>
  
                <input
                  id="login-password"
                  class="form-input"
                  type="password"
                  autocomplete="current-password"
                  placeholder="6 أحرف على الأقل"
                >
              </div>
  
              <button
                class="auth-submit-button"
                type="submit"
              >
                تسجيل الدخول
              </button>
            </form>
  
            <p class="auth-switch">
              ليس لديك حساب؟
  
              <button
                id="show-register-button"
                class="auth-link-button"
                type="button"
              >
                أنشئ حساب شركة
              </button>
            </p>
  
          </div>
        </section>
  
      </div>
    `;
  }
  
  
  export function initializeLoginPage({
    onLoginSuccess,
    onShowRegister,
  }) {
    const loginForm =
      document.getElementById("login-form");
  
    const messageElement =
      document.getElementById("login-message");
  
    const showRegisterButton =
      document.getElementById(
        "show-register-button",
      );
  
  
    showRegisterButton.addEventListener(
      "click",
      onShowRegister,
    );
  
  
    loginForm.addEventListener(
      "submit",
      async (event) => {
        event.preventDefault();
  
        const email =
          document
            .getElementById("login-email")
            .value;
  
        const password =
          document
            .getElementById("login-password")
            .value;
  
        const validationError =
          validateLoginData({
            email,
            password,
          });
  
        if (validationError) {
          showMessage(
            messageElement,
            validationError,
            "error",
          );
  
          return;
        }
  
        const result = await login({
          email,
          password,
        });
        
        if (result.accountStatus === "pending") {
        
          showMessage(
            messageElement,
            "تم استلام طلب تسجيل منشأتك وهو الآن قيد مراجعة إدارة المنصة. سيتم تفعيل الحساب بعد الموافقة.",
            "warning",
          );
        
          return;
        }
        
        if (result.accountStatus === "rejected") {
        
          showMessage(
            messageElement,
            "تم رفض طلب تسجيل المنشأة. يرجى التواصل مع إدارة المنصة.",
            "error",
          );
        
          return;
        }
        
        if (!result.success) {
        
          showMessage(
            messageElement,
            result.message,
            "error",
          );
        
          return;
        }
        
        onLoginSuccess(result.user);
      },
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
        : type === "warning"
        ? "form-warning-message"
        : "form-success-message";
  }