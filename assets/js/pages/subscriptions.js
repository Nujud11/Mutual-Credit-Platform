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
  
  
  export function initializeSubscriptionsPage() {
    const requestButtons =
      document.querySelectorAll(
        "[data-subscription-plan]",
      );
  
    requestButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const planId =
              button.dataset
                .subscriptionPlan;
  
            showSubscriptionsMessage(
              `سيتم ربط طلب باقة "${getPlanName(
                planId,
              )}" بقاعدة البيانات في المرحلة التالية.`,
              "info",
            );
          },
        );
      },
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