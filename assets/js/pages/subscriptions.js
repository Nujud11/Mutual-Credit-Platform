import {
    createSubscriptionRequest,
    getPendingSubscriptionRequest,
  } from "../services/subscription-repository.js";

const subscriptionPlans = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: "مجانية",
      description:
        "مناسبة للمنشآت التي تبدأ باستخدام شبكة مقاصة.",
      badge: "البدء مجانًا",
      features: [
        "الوصول إلى سوق الخدمات",
        "إضافة وإدارة الخدمات",
        "إدارة المعاملات الائتمانية",
        "الفرص الذكية",
        "لوحة تحكم أساسية",
        "دعم عبر البريد الإلكتروني",
      ],
    },
  
    {
      id: "professional",
      name: "الباقة الاحترافية",
      price: "99 ريال / شهر",
      description:
        "مناسبة للمنشآت التي ترغب في توسيع حضورها داخل الشبكة.",
      badge: "الأكثر شيوعًا",
      featured: true,
      features: [
        "جميع مزايا الباقة الأساسية",
        "الفرص الذكية",
        "ظهور مميز في سوق الخدمات",
        "لوحة تحكم وتحليلات متقدمة",
        "تقارير شهرية",
        "أولوية في الدعم الفني",
        "شارة منشأة احترافية",
      ],
    },
  
    {
      id: "enterprise",
      name: "الباقة المؤسسية",
      price: "299 ريال / شهر",
      description:
        "مناسبة للمنشآت الكبيرة التي تحتاج إلى دعم وخدمات موسعة.",
      badge: "للمنشآت الكبيرة",
      features: [
        "جميع مزايا الباقة الاحترافية",
        "الفرص الذكية",
        "مساعد ذكي",
        "تقارير تنفيذية متقدمة",
        "مدير حساب مخصص",
        "دعم فني مستمر",
        "تدريب وتعريف بالمنصة",
      ],
    },
  ];
  
  
  export function renderSubscriptionsPage(
    currentUser,
  ) {
    const currentPlan =
      normalizePlan(
        currentUser?.subscriptionPlan,
      );
  
    return `
      <section class="subscriptions-page">
  
        <section class="subscriptions-hero">
  
          <div>
            <span class="subscriptions-hero-label">
              باقات مقاصة
            </span>
  
            <h2>
              اختر الباقة المناسبة لمنشأتك
            </h2>
  
            <p>
              استعرض باقات الاشتراك ومزاياها،
              وقدّم طلب الترقية ليتم مراجعته
              من إدارة المنصة.
            </p>
          </div>
  
          <div class="current-subscription-summary">
            <span>
              باقتك الحالية
            </span>
  
            <strong>
              ${getPlanName(currentPlan)}
            </strong>
  
            <small>
              ${getPlanPrice(currentPlan)}
            </small>
          </div>
  
        </section>
  
  
        <div
          id="subscriptions-message"
          class="hidden"
        ></div>
  
  
        <section class="subscription-plans-grid">
          ${subscriptionPlans
            .map(
              (plan) =>
                renderSubscriptionPlanCard(
                  plan,
                  currentPlan,
                ),
            )
            .join("")}
        </section>
  
  
        <section class="subscription-note-card">
  
          <span class="subscription-note-icon">
            ◉
          </span>
  
          <div>
            <h3>
              آلية تغيير الباقة
            </h3>
  
            <p>
              عند طلب باقة جديدة، يتم إرسال الطلب
              إلى إدارة المنصة للمراجعة. لا تتغير
              باقتك الحالية إلا بعد موافقة الإدارة.
              الدفع الإلكتروني غير مفعّل في النسخة
              التجريبية الحالية.
            </p>
          </div>
  
        </section>
  
      </section>
    `;
  }
  
  
  export async function initializeSubscriptionsPage({
    currentUser,
  }) {
    const requestButtons =
      document.querySelectorAll(
        "[data-subscription-plan]",
      );
  
    setSubscriptionButtonsDisabled(
      true,
    );
  
    try {
      const pendingRequest =
        await getPendingSubscriptionRequest(
          currentUser.id,
        );
  
      if (pendingRequest) {
        showPendingRequestMessage(
          pendingRequest,
        );
  
        updateButtonsForPendingRequest(
          pendingRequest,
        );
  
        return;
      }
  
      setSubscriptionButtonsDisabled(
        false,
      );
  
    } catch (error) {
      console.error(
        "تعذر التحقق من طلبات الاشتراك:",
        error,
      );
  
      setSubscriptionButtonsDisabled(
        false,
      );
  
      showSubscriptionsMessage(
        "تعذر التحقق من طلبات الاشتراك السابقة. يمكنك المحاولة مرة أخرى.",
        "error",
      );
    }
  
    requestButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const requestedPlan =
              button.dataset
                .subscriptionPlan;
  
            await handleSubscriptionRequest({
              currentUser,
              requestedPlan,
              button,
            });
          },
        );
      },
    );
  }

  async function handleSubscriptionRequest({
    currentUser,
    requestedPlan,
    button,
  }) {
    const currentPlan =
      normalizePlan(
        currentUser
          ?.subscriptionPlan,
      );
  
    const requestedPlanName =
      getPlanName(
        requestedPlan,
      );
  
    const confirmed =
      window.confirm(
        `هل تريد إرسال طلب تغيير الباقة إلى "${requestedPlanName}"؟`,
      );
  
    if (!confirmed) {
      return;
    }
  
    const originalButtonText =
      button.textContent;
  
    setSubscriptionButtonsDisabled(
      true,
    );
  
    button.textContent =
      "جاري إرسال الطلب...";
  
    hideSubscriptionsMessage();
  
    try {
      const request =
        await createSubscriptionRequest({
          companyId:
            currentUser.id,
  
          companyName:
            currentUser.companyName,
  
          currentPlan,
  
          requestedPlan,
        });
  
      showSubscriptionsMessage(
        `تم إرسال طلب الاشتراك في "${requestedPlanName}" إلى إدارة المنصة بنجاح.`,
        "success",
      );
  
      updateButtonsForPendingRequest(
        request,
      );
  
    } catch (error) {
      console.error(
        "تعذر إرسال طلب الاشتراك:",
        error,
      );
  
      button.textContent =
        originalButtonText;
  
      setSubscriptionButtonsDisabled(
        false,
      );
  
      showSubscriptionsMessage(
        getSubscriptionErrorMessage(
          error,
        ),
        "error",
      );
    }
  }


  function showPendingRequestMessage(
    pendingRequest,
  ) {
    const requestedPlanName =
      getPlanName(
        pendingRequest.requestedPlan,
      );
  
    showSubscriptionsMessage(
      `لديك طلب معلق للانتقال إلى "${requestedPlanName}". لا يمكنك إرسال طلب آخر حتى تتم مراجعته من الإدارة.`,
      "info",
    );
  }
  
  
  function updateButtonsForPendingRequest(
    pendingRequest,
  ) {
    const requestButtons =
      document.querySelectorAll(
        "[data-subscription-plan]",
      );
  
    requestButtons.forEach(
      (button) => {
        button.disabled = true;
  
        const isRequestedPlan =
          button.dataset
            .subscriptionPlan
          === pendingRequest
            .requestedPlan;
  
        button.textContent =
          isRequestedPlan
            ? "الطلب قيد المراجعة"
            : "يوجد طلب معلق";
  
        button.classList.toggle(
          "pending",
          isRequestedPlan,
        );
      },
    );
  }
  
  
  function setSubscriptionButtonsDisabled(
    isDisabled,
  ) {
    const requestButtons =
      document.querySelectorAll(
        "[data-subscription-plan]",
      );
  
    requestButtons.forEach(
      (button) => {
        button.disabled =
          isDisabled;
      },
    );
  }


  function hideSubscriptionsMessage() {
    const messageElement =
      document.getElementById(
        "subscriptions-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      "hidden";
  
    messageElement.textContent =
      "";
  }
  
  
  function getSubscriptionErrorMessage(
    error,
  ) {
    const errorCode =
      error?.message
      ?? error?.code;
  
    const messages = {
      "company-id-required":
        "تعذر تحديد حساب المنشأة.",
  
      "invalid-requested-plan":
        "الباقة المطلوبة غير صالحة.",
  
      "same-subscription-plan":
        "هذه هي باقتك الحالية بالفعل.",
  
      "pending-request-exists":
        "لديك طلب اشتراك معلق بالفعل. انتظر مراجعة الإدارة قبل إرسال طلب جديد.",
  
      "permission-denied":
        "لا تملك صلاحية إرسال طلب الاشتراك.",
  
      "unavailable":
        "تعذر الاتصال بقاعدة البيانات. تحقق من اتصال الإنترنت.",
    };
  
    return (
      messages[errorCode]
      ?? "تعذر إرسال طلب الاشتراك. حاول مرة أخرى."
    );
  }
  
  
  function renderSubscriptionPlanCard(
    plan,
    currentPlan,
  ) {
    const isCurrentPlan =
      plan.id === currentPlan;
  
    const featuredClass =
      plan.featured
        ? "subscription-plan-card--featured"
        : "";
  
    const currentClass =
      isCurrentPlan
        ? "subscription-plan-card--current"
        : "";
  
    return `
      <article
        class="
          subscription-plan-card
          ${featuredClass}
          ${currentClass}
        "
      >
  
        <div class="subscription-plan-header">
  
          <span class="subscription-plan-badge">
            ${
              isCurrentPlan
                ? "باقتك الحالية"
                : plan.badge
            }
          </span>
  
          <h3>
            ${plan.name}
          </h3>
  
          <strong class="subscription-plan-price">
            ${plan.price}
          </strong>
  
          <p>
            ${plan.description}
          </p>
  
        </div>
  
  
        <ul class="subscription-features-list">
  
          ${plan.features
            .map(
              (feature) => `
                <li>
                  <span>✓</span>
                  ${feature}
                </li>
              `,
            )
            .join("")}
  
        </ul>
  
  
        ${
          isCurrentPlan
            ? `
              <button
                class="subscription-plan-button current"
                type="button"
                disabled
              >
                الباقة الحالية
              </button>
            `
            : `
              <button
                class="subscription-plan-button"
                data-subscription-plan="${plan.id}"
                type="button"
              >
                طلب الاشتراك
              </button>
            `
        }
  
      </article>
    `;
  }
  
  
  function showSubscriptionsMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "subscriptions-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.className =
      `subscription-message subscription-message--${type}`;
  
    messageElement.textContent =
      message;
  
    messageElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  
  
  function normalizePlan(
    plan,
  ) {
    const allowedPlans = [
      "basic",
      "professional",
      "enterprise",
    ];
  
    return allowedPlans.includes(plan)
      ? plan
      : "basic";
  }
  
  
  function getPlanName(
    planId,
  ) {
    const plan =
      subscriptionPlans.find(
        (item) =>
          item.id === planId,
      );
  
    return (
      plan?.name
      ?? "الباقة الأساسية"
    );
  }
  
  
  function getPlanPrice(
    planId,
  ) {
    const plan =
      subscriptionPlans.find(
        (item) =>
          item.id === planId,
      );
  
    return (
      plan?.price
      ?? "مجانية"
    );
  }