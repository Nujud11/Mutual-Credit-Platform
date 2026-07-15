import {
    formatCreditBalance,
    formatNumber,
    formatPercentage,
    formatVerificationStatus,
  } from "../utils/formatters.js";
  
  import {
    refreshCurrentUser,
  } from "../services/auth-service.js";
  
  import {
    getCompanyServices,
  } from "../services/service-repository.js";
  
  import {
    getCompanyTransactions,
  } from "../services/transaction-repository.js";
  
  
  
  export function renderDashboard(
    currentUser,
    dashboardData = {},
  ) {
    const company =
      normalizeCompanyData(
        currentUser,
      );
  
    const servicesCount =
      Number(
        dashboardData.servicesCount,
      ) || 0;
  
    const transactionsCount =
      Number(
        dashboardData.transactionsCount,
      ) || 0;
  
    const completedTransactionsCount =
      Number(
        dashboardData.completedTransactionsCount,
      ) || 0;
  
    const opportunitiesCount =
      Number(
        dashboardData.opportunitiesCount,
      ) || 0;
  
    return `
      <div class="dashboard-page">
  
        <section class="welcome-banner">
          <div>
            <span class="welcome-label">
              مرحبًا بك في مقاصة
            </span>
  
            <h2>
              ${company.companyName}
            </h2>
  
            <p>
              تابع رصيد منشأتك،
              استكشف فرص التبادل،
              وأدر معاملاتك الائتمانية
              من مكان واحد.
            </p>
          </div>
  
          <div class="welcome-company-icon">
            ${getCompanyInitial(
              company.companyName,
            )}
          </div>
        </section>
  
  
        <section class="dashboard-statistics">
  
          ${renderStatisticCard({
            label: "الرصيد الحالي",
  
            value:
              formatCreditBalance(
                company.balance,
              ),
  
            description:
              getBalanceDescription(
                company.balance,
              ),
  
            icon: "⇄",
  
            modifier:
              getBalanceModifier(
                company.balance,
              ),
          })}
  
  
          ${renderStatisticCard({
            label: "الحد الائتماني",
  
            value:
              formatCreditBalance(
                company.creditLimit,
              ),
  
            description:
              "الحد المسموح للشراء داخل الشبكة",
  
            icon: "◈",
  
            modifier: "primary",
          })}
  
  
          ${renderStatisticCard({
            label: "درجة الثقة",
  
            value:
              formatPercentage(
                company.trustScore,
              ),
  
            description:
              getTrustDescription(
                company.trustScore,
              ),
  
            icon: "✓",
  
            modifier: "success",
          })}
  
  
          ${renderStatisticCard({
            label: "مستوى المخاطر",
  
            value:
              company.riskLevel,
  
            description:
              "يُحدث بناءً على نشاط المنشأة",
  
            icon: "⌁",
  
            modifier:
              getRiskModifier(
                company.riskLevel,
              ),
          })}
  
        </section>
  
  
        <section class="dashboard-main-grid">
  
          <article class="card company-profile-card">
  
            <div class="card-heading">
              <div>
                <h3>
                  ملف المنشأة
                </h3>
  
                <p>
                  المعلومات الأساسية المسجلة
                  في المنصة
                </p>
              </div>
  
              <span class="card-heading-icon">
                ◇
              </span>
            </div>
  
  
            <div class="company-information-grid">
  
              ${renderInformationItem(
                "اسم المنشأة",
                company.companyName,
              )}
  
              ${renderInformationItem(
                "نوع النشاط",
                company.businessType,
              )}
  
              ${renderInformationItem(
                "المدينة",
                company.city,
              )}
  
              ${renderInformationItem(
                "عمر المنشأة",
                `${formatNumber(
                  company.companyAge,
                )} سنوات`,
              )}
  
              ${renderInformationItem(
                "السجل التجاري",
  
                formatVerificationStatus(
                  company
                    .isCommercialRecordVerified,
                ),
  
                company
                  .isCommercialRecordVerified
                  ? "verified"
                  : "unverified",
              )}
  
              ${renderInformationItem(
                "البريد الإلكتروني",
                company.email,
              )}
  
            </div>
  
  
            <div class="company-description">
              <span>
                نبذة عن المنشأة
              </span>
  
              <p>
                ${
                  company.description
                  || "لم تتم إضافة وصف للمنشأة."
                }
              </p>
            </div>
  
          </article>
  
  
          <article class="card quick-overview-card">
  
            <div class="card-heading">
              <div>
                <h3>
                  نظرة سريعة
                </h3>
  
                <p>
                  بيانات محدثة من نشاط منشأتك
                  داخل المنصة
                </p>
              </div>
  
              <span class="card-heading-icon">
                ◫
              </span>
            </div>
  
  
            <div class="quick-overview-list">
  
              ${renderOverviewItem({
                title:
                  "الخدمات المعروضة",
  
                value:
                  formatNumber(
                    servicesCount,
                  ),
  
                description:
                  servicesCount > 0
                    ? `${formatNumber(
                        servicesCount,
                      )} خدمات نشطة`
                    : "لم تضف خدمات بعد",
  
                icon: "◇",
              })}
  
  
              ${renderOverviewItem({
                title:
                  "المعاملات",
  
                value:
                  formatNumber(
                    transactionsCount,
                  ),
  
                description:
                  transactionsCount > 0
                    ? `${formatNumber(
                        completedTransactionsCount,
                      )} معاملات مكتملة`
                    : "لا توجد معاملات حاليًا",
  
                icon: "⇄",
              })}
  
  
              ${renderOverviewItem({
                title:
                  "الفرص المقترحة",
  
                value:
                  formatNumber(
                    opportunitiesCount,
                  ),
  
                description:
                  opportunitiesCount > 0
                    ? "فرص مناسبة لمنشأتك"
                    : "ستظهر بعد تحليل الشبكة",
  
                icon: "✦",
              })}
  
            </div>
  
          </article>
  
        </section>
  
  
        <section class="dashboard-bottom-grid">
  
          <article class="card ai-insight-card">
  
            <div class="ai-insight-header">
              <div>
                <span class="ai-label">
                  AI
                </span>
  
                <h3>
                  التوصية الذكية
                </h3>
              </div>
  
              <span class="ai-icon">
                ✦
              </span>
            </div>
  
            ${renderDashboardRecommendation({
              company,
              servicesCount,
              transactionsCount,
            })}
  
          </article>
  
  
          <article class="card credit-usage-card">
  
            <div class="card-heading">
              <div>
                <h3>
                  استخدام الحد الائتماني
                </h3>
  
                <p>
                  نسبة الرصيد المستخدم
                  من الحد المتاح
                </p>
              </div>
            </div>
  
            ${renderCreditUsage(
              company.balance,
              company.creditLimit,
            )}
  
          </article>
  
        </section>
  
      </div>
    `;
  }
  
  
  export async function initializeDashboard({
    currentUser,
    onNavigate,
    onUserUpdated,
  }) {
    attachDashboardActionEvents(
      onNavigate,
    );
  
    try {
      const [
        freshCompany,
        services,
        transactions,
      ] =
        await Promise.all([
          refreshCurrentUser(
            currentUser.id,
          ),
  
          getCompanyServices(
            currentUser.id,
          ),
  
          getCompanyTransactions(
            currentUser.id,
          ),
        ]);
  
      const completedTransactionsCount =
        transactions.filter(
          (transaction) =>
            transaction.status
              === "completed",
        ).length;
  
      const dashboardData = {
        servicesCount:
          services.length,
  
        transactionsCount:
          transactions.length,
  
        completedTransactionsCount,
  
        opportunitiesCount: 0,
      };
  
      const dashboardElement =
        document.querySelector(
          ".dashboard-page",
        );
  
      if (!dashboardElement) {
        return;
      }
  
      dashboardElement.outerHTML =
        renderDashboard(
          freshCompany,
          dashboardData,
        );
  
      attachDashboardActionEvents(
        onNavigate,
      );
  
      if (onUserUpdated) {
        onUserUpdated(
          freshCompany,
        );
      }
  
    } catch (error) {
      console.error(
        "تعذر تحديث بيانات الصفحة الرئيسية:",
        error,
      );
    }
  }
  
  
  function attachDashboardActionEvents(
    onNavigate,
  ) {
    const actionButtons =
      document.querySelectorAll(
        "[data-dashboard-action]",
      );
  
    actionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            const targetPage =
              button.dataset
                .dashboardAction;
  
            onNavigate(
              targetPage,
            );
          },
        );
      },
    );
  }
  
  
  function renderDashboardRecommendation({
    company,
    servicesCount,
    transactionsCount,
  }) {
    if (servicesCount === 0) {
      return `
        <p>
          أضف الخدمات التي تقدمها منشأتك
          حتى تتمكن المنصة من مطابقتها
          مع احتياجات الشركات الأخرى.
        </p>
  
        <button
          class="dashboard-action-button"
          data-dashboard-action="my-services"
          type="button"
        >
          إضافة أول خدمة
        </button>
      `;
    }
  
    if (transactionsCount === 0) {
      return `
        <p>
          خدمات منشأتك أصبحت متاحة.
          استكشف السوق وابدأ أول معاملة
          ائتمانية داخل الشبكة.
        </p>
  
        <button
          class="dashboard-action-button"
          data-dashboard-action="marketplace"
          type="button"
        >
          استكشاف سوق الخدمات
        </button>
      `;
    }
  
    if (company.balance < 0) {
      return `
        <p>
          رصيد منشأتك مدين حاليًا.
          ننصح بتقديم المزيد من الخدمات
          للحصول على رصيد موجب وتقليل
          استخدام الحد الائتماني.
        </p>
  
        <button
          class="dashboard-action-button"
          data-dashboard-action="my-services"
          type="button"
        >
          إدارة خدماتي
        </button>
      `;
    }
  
    return `
      <p>
        منشأتك نشطة داخل الشبكة.
        استمر في تقديم الخدمات واستكشاف
        فرص جديدة لتحسين رصيدك ودرجة ثقتك.
      </p>
  
      <button
        class="dashboard-action-button"
        data-dashboard-action="marketplace"
        type="button"
      >
        استكشاف الفرص
      </button>
    `;
  }
  
  
  function normalizeCompanyData(
    currentUser,
  ) {
    return {
      companyName:
        currentUser?.companyName
        ?? "حساب الشركة",
  
      businessType:
        currentUser?.businessType
        ?? "غير محدد",
  
      city:
        currentUser?.city
        ?? "غير محددة",
  
      companyAge:
        Number(
          currentUser?.companyAge,
        ) || 0,
  
      description:
        currentUser?.description
        ?? "",
  
      email:
        currentUser?.email
        ?? "غير متوفر",
  
      isCommercialRecordVerified:
        Boolean(
          currentUser
            ?.isCommercialRecordVerified,
        ),
  
      balance:
        Number(
          currentUser?.balance,
        ) || 0,
  
      creditLimit:
        Number(
          currentUser?.creditLimit,
        ) || 0,
  
      trustScore:
        Number(
          currentUser?.trustScore,
        ) || 0,
  
      riskLevel:
        currentUser?.riskLevel
        ?? "قيد التقييم",
    };
  }
  
  
  function renderStatisticCard({
    label,
    value,
    description,
    icon,
    modifier,
  }) {
    return `
      <article
        class="
          dashboard-stat-card
          dashboard-stat-card--${modifier}
        "
      >
        <div class="stat-card-header">
          <span class="stat-card-label">
            ${label}
          </span>
  
          <span class="stat-card-icon">
            ${icon}
          </span>
        </div>
  
        <strong class="stat-card-value">
          ${value}
        </strong>
  
        <p class="stat-card-description">
          ${description}
        </p>
      </article>
    `;
  }
  
  
  function renderInformationItem(
    label,
    value,
    status = "",
  ) {
    const statusClass =
      status
        ? `company-information-value--${status}`
        : "";
  
    return `
      <div class="company-information-item">
        <span>
          ${label}
        </span>
  
        <strong
          class="
            company-information-value
            ${statusClass}
          "
        >
          ${value}
        </strong>
      </div>
    `;
  }
  
  
  function renderOverviewItem({
    title,
    value,
    description,
    icon,
  }) {
    return `
      <div class="overview-item">
  
        <span class="overview-item-icon">
          ${icon}
        </span>
  
        <div class="overview-item-content">
          <strong>
            ${title}
          </strong>
  
          <small>
            ${description}
          </small>
        </div>
  
        <span class="overview-item-value">
          ${value}
        </span>
  
      </div>
    `;
  }
  
  
  function renderCreditUsage(
    balance,
    creditLimit,
  ) {
    // الرصيد السالب يعني أن الشركة استخدمت جزءًا من حدها الائتماني.
    const usedCredit =
      balance < 0
        ? Math.abs(balance)
        : 0;
  
    // الرصيد الموجب هو رصيد فعلي متاح للشركة.
    const availableBalance =
      balance > 0
        ? balance
        : 0;
  
    // الجزء المتبقي الذي تستطيع الشركة اقتراضه.
    const remainingCredit =
      Math.max(
        creditLimit - usedCredit,
        0,
      );
  
    // القدرة الشرائية = الرصيد الموجب + الحد الائتماني المتبقي.
    const purchasingPower =
      availableBalance
      + remainingCredit;
  
    const percentage =
      creditLimit > 0
        ? Math.min(
            Math.round(
              (
                usedCredit
                / creditLimit
              ) * 100,
            ),
            100,
          )
        : 0;
  
    return `
      <div class="credit-usage-content">
  
        <div class="credit-usage-summary">
  
          <span>
            الرصيد المتاح:
            <strong>
              ${formatCreditBalance(
                availableBalance,
              )}
            </strong>
          </span>
  
          <span>
            الحد الائتماني المتبقي:
            <strong>
              ${formatCreditBalance(
                remainingCredit,
              )}
            </strong>
          </span>
  
          <span>
            إجمالي القدرة الشرائية:
            <strong>
              ${formatCreditBalance(
                purchasingPower,
              )}
            </strong>
          </span>
  
        </div>
  
        <div
          class="credit-progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="${percentage}"
        >
          <div
            class="credit-progress-value"
            style="width: ${percentage}%"
          ></div>
        </div>
  
        <div class="credit-percentage">
          تم استخدام
          ${formatPercentage(
            percentage,
          )}
          من الحد الائتماني
        </div>
  
      </div>
    `;
  }
  
  
  function getCompanyInitial(
    companyName,
  ) {
    return companyName
      .trim()
      .charAt(0)
      || "م";
  }
  
  
  function getBalanceModifier(
    balance,
  ) {
    if (balance > 0) {
      return "success";
    }
  
    if (balance < 0) {
      return "warning";
    }
  
    return "neutral";
  }
  
  
  function getBalanceDescription(
    balance,
  ) {
    if (balance > 0) {
      return "رصيد دائن ناتج عن تقديم الخدمات";
    }
  
    if (balance < 0) {
      return "رصيد مدين ناتج عن شراء الخدمات";
    }
  
    return "لا توجد التزامات حالية";
  }
  
  
  function getTrustDescription(
    trustScore,
  ) {
    if (trustScore >= 80) {
      return "درجة ثقة مرتفعة";
    }
  
    if (trustScore >= 50) {
      return "درجة ثقة متوسطة";
    }
  
    return "درجة ثقة تحتاج إلى تحسين";
  }
  
  
  function getRiskModifier(
    riskLevel,
  ) {
    if (
      riskLevel.includes("منخفض")
    ) {
      return "success";
    }
  
    if (
      riskLevel.includes("مرتفع")
    ) {
      return "danger";
    }
  
    if (
      riskLevel.includes("متوسط")
    ) {
      return "warning";
    }
  
    return "ai";
  }