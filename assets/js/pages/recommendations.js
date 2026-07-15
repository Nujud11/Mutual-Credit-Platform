import {
    generateAndSaveSmartRecommendations,
    getSavedSmartRecommendations,
  } from "../services/recommendation-service.js";

  import {
    createTransaction,
  } from "../services/transaction-repository.js";
  
  import {
    escapeHtml,
    formatNumber,
  } from "../utils/formatters.js";
  
  
  let recommendationsCurrentUser =
    null;
  
  let smartRecommendations = [];
  
  let currentAnalysis = "";

  let lastAnalysisDate =
   null;
  
  let isGeneratingRecommendations =
    false;
  
  
  export function renderRecommendationsPage() {
    return `
      <div class="recommendations-page">
  
        <section class="recommendations-header">
  
          <div>
            <span class="recommendations-label">
              مستشار الأعمال الذكي
            </span>
  
            <h2>
              الفرص الذكية
            </h2>
  
            <p>
              دع الذكاء الاصطناعي يحلل نشاط منشأتك
              ويقترح أفضل فرص التعاون المتاحة
              داخل شبكة مقاصة.
            </p>
          </div>
  
          <div class="recommendations-header-icon">
            ✦
          </div>
  
        </section>
  
  
        <section class="ai-analysis-card card">
  
          <div class="ai-analysis-card-header">
  
            <div class="ai-analysis-title">
  
              <span class="ai-badge">
                AI
              </span>
  
              <div>
                <h3>
                  تحليل فرص منشأتك
                </h3>
  
                <p>
                  يعتمد التحليل على نشاط الشركة،
                  وصفها، والخدمات المتاحة في الشبكة.
                </p>
              </div>
  
            </div>
  
            
            <div class="recommendations-analysis-actions">

                <span
                    id="last-analysis-date"
                    class="last-analysis-date hidden"
                >
                </span>

                <button
                    id="generate-recommendations-button"
                    class="primary-button"
                    type="button"
                >
                    تحليل الفرص الذكية
                </button>

            </div>
  
          </div>
  
  
          <div
            id="recommendations-message"
            class="recommendations-message hidden"
          ></div>
  
  
          <div
            id="ai-analysis-content"
            class="ai-analysis-content"
          >
            ${renderInitialAnalysisState()}
          </div>
  
        </section>
  
  
        <section class="recommendations-results-section">
  
          <div class="recommendations-section-heading">
  
            <div>
              <span class="section-label">
                فرص مقترحة
              </span>
  
              <h3>
                أفضل فرص التعاون
              </h3>
            </div>
  
            <span
              id="recommendations-count"
              class="recommendations-count"
            >
              0 فرص
            </span>
  
          </div>
  
  
          <div
            id="recommendations-list"
            class="recommendations-list"
          >
            ${renderInitialRecommendationsState()}
          </div>
  
        </section>
  
      </div>
    `;
  }
  
  
  export async function initializeRecommendationsPage({
    currentUser,
  }) {
    recommendationsCurrentUser =
      currentUser;
  
    smartRecommendations = [];
  
    currentAnalysis = "";
  
    lastAnalysisDate =
      null;
  
    isGeneratingRecommendations =
      false;
  
    const generateButton =
      document.getElementById(
        "generate-recommendations-button",
      );
  
    if (!generateButton) {
      return;
    }
  
    generateButton.addEventListener(
      "click",
      handleGenerateRecommendations,
    );
  
    await loadSavedRecommendations();
  }


  async function loadSavedRecommendations() {
    if (!recommendationsCurrentUser?.id) {
      return;
    }
  
    try {
      const savedResult =
        await getSavedSmartRecommendations(
          recommendationsCurrentUser.id,
        );
  
      if (!savedResult) {
        return;
      }
  
      currentAnalysis =
        savedResult.analysis;
  
      smartRecommendations =
        savedResult.recommendations;
  
      lastAnalysisDate =
        savedResult.generatedAt;
  
      renderAnalysisResult(
        currentAnalysis,
      );
  
      renderRecommendations(
        smartRecommendations,
      );
  
      updateRecommendationsCount(
        smartRecommendations.length,
      );
  
      updateLastAnalysisDate(
        lastAnalysisDate,
      );
  
      updateGenerateButtonLabel(
        true,
      );
  
    } catch (error) {
      console.error(
        "تعذر تحميل التحليل المحفوظ:",
        error,
      );
  
      showRecommendationsMessage(
        "تعذر تحميل آخر تحليل محفوظ، ويمكنك إنشاء تحليل جديد.",
        "info",
      );
    }
  }
  
  
  async function handleGenerateRecommendations() {
    if (
      isGeneratingRecommendations
      || !recommendationsCurrentUser
    ) {
      return;
    }
  
    const generateButton =
      document.getElementById(
        "generate-recommendations-button",
      );
  
    isGeneratingRecommendations =
      true;
  
    clearRecommendationsMessage();
  
    setGenerateButtonLoading(
      generateButton,
      true,
    );
  
    renderAnalysisLoadingState();
  
    renderRecommendationsLoadingState();
  
    try {
        const result =
          await generateAndSaveSmartRecommendations(
            recommendationsCurrentUser,
        );
  
      currentAnalysis =
        result.analysis;
  
      smartRecommendations =
        result.recommendations;

    lastAnalysisDate =
        result.generatedAt;
  
      renderAnalysisResult(
        currentAnalysis,
      );
  
      renderRecommendations(
        smartRecommendations,
      );
  
      updateRecommendationsCount(
        smartRecommendations.length,
      );

      updateLastAnalysisDate(
        lastAnalysisDate,
      );
      
      updateGenerateButtonLabel(
        true,
      );
  
      if (
        smartRecommendations.length
          === 0
      ) {
        showRecommendationsMessage(
          "اكتمل التحليل، ولكن لا توجد خدمات نشطة كافية لإنشاء فرص مناسبة حاليًا.",
          "info",
        );
  
      } else {
        showRecommendationsMessage(
          `تم تحليل الشبكة واقتراح ${formatNumber(
            smartRecommendations.length,
          )} فرص مناسبة لمنشأتك.`,
          "success",
        );
      }
  
    } catch (error) {
      console.error(
        "تعذر إنشاء التوصيات الذكية:",
        error,
      );
  
      renderAnalysisErrorState();
  
      renderRecommendationsErrorState();
  
      showRecommendationsMessage(
        getRecommendationErrorMessage(
          error,
        ),
        "error",
      );
  
    } finally {
      isGeneratingRecommendations =
        false;
  
      setGenerateButtonLoading(
        generateButton,
        false,
      );
    }
  }
  
  
  function renderRecommendations(
    recommendations,
  ) {
    const recommendationsList =
      document.getElementById(
        "recommendations-list",
      );
  
    if (!recommendationsList) {
      return;
    }
  
    if (!recommendations.length) {
      recommendationsList.innerHTML =
        renderEmptyRecommendationsState();
  
      return;
    }
  
    recommendationsList.innerHTML =
      recommendations
        .map(
          (
            recommendation,
            index,
          ) =>
            renderRecommendationCard(
              recommendation,
              index,
            ),
        )
        .join("");
  
    attachRecommendationRequestEvents();
  }
  
  
  function renderRecommendationCard(
    recommendation,
    index,
  ) {
    return `
      <article class="recommendation-card">
  
        <div class="recommendation-card-top">
  
          <div class="recommendation-ranking">
            <span>
              ${formatNumber(
                index + 1,
              )}
            </span>
          </div>
  
  
          <div class="recommendation-company">
  
            <div class="recommendation-company-heading">
  
              <div>
                <span class="recommendation-category">
                  ${escapeHtml(
                    recommendation
                      .serviceCategory,
                  )}
                </span>
  
                <h3>
                  ${escapeHtml(
                    recommendation
                      .serviceName,
                  )}
                </h3>
              </div>
  
  
              <div class="recommendation-score">
                <strong>
                  ${formatNumber(
                    recommendation.score,
                  )}%
                </strong>
  
                <span>
                  درجة الملاءمة
                </span>
              </div>
  
            </div>
  
  
            <p class="recommendation-description">
              ${escapeHtml(
                recommendation
                  .serviceDescription,
              )}
            </p>
  
          </div>
  
        </div>
  
  
        <div class="recommendation-company-details">
  
          <div class="recommendation-company-identity">
  
            <span class="recommendation-company-icon">
              ${getCompanyInitial(
                recommendation.companyName,
              )}
            </span>
  
            <div>
              <small>
                مقدم الخدمة
              </small>
  
              <strong>
                ${escapeHtml(
                  recommendation
                    .companyName,
                )}
              </strong>
  
              <span>
                ${escapeHtml(
                  recommendation
                    .businessType,
                )}
                ·
                ${escapeHtml(
                  recommendation.city,
                )}
              </span>
            </div>
  
          </div>
  
  
          <div class="recommendation-company-metrics">
  
            <div>
              <small>
                درجة الثقة
              </small>
  
              <strong>
                ${formatNumber(
                  recommendation
                    .trustScore,
                )}%
              </strong>
            </div>
  
            <div>
              <small>
                السعر
              </small>
  
              <strong>
                ${formatNumber(
                  recommendation
                    .servicePrice,
                )}
                وحدة
              </strong>
            </div>
  
          </div>
  
        </div>
  
  
        <div class="recommendation-reason">
  
          <span class="recommendation-reason-icon">
            ✦
          </span>
  
          <div>
            <small>
              لماذا رشحها الذكاء الاصطناعي؟
            </small>
  
            <p>
              ${escapeHtml(
                recommendation.reason,
              )}
            </p>
          </div>
  
        </div>
  
  
        <div class="recommendation-card-actions">
  
          <button
            class="
              primary-button
              recommendation-request-button
            "
            type="button"
            data-recommendation-index="${index}"
          >
            طلب الخدمة
          </button>
  
          <span class="recommendation-risk">
            مستوى المخاطر:
            <strong>
              ${escapeHtml(
                recommendation.riskLevel,
              )}
            </strong>
          </span>
  
        </div>
  
      </article>
    `;
  }
  
  
  function attachRecommendationRequestEvents() {
    const requestButtons =
      document.querySelectorAll(
        ".recommendation-request-button",
      );
  
    requestButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const recommendationIndex =
              Number(
                button.dataset
                  .recommendationIndex,
              );
  
            const recommendation =
              smartRecommendations[
                recommendationIndex
              ];
  
            if (
              !recommendation
              || !recommendationsCurrentUser
            ) {
              return;
            }
  
            await handleRecommendationRequest({
              recommendation,
              button,
            });
          },
        );
      },
    );
  }
  
  
  async function handleRecommendationRequest({
    recommendation,
    button,
  }) {
    const shouldCreateRequest =
      window.confirm(
        `هل تريد طلب خدمة "${recommendation.serviceName}" من ${recommendation.companyName} بقيمة ${recommendation.servicePrice} وحدة؟`,
      );
  
    if (!shouldCreateRequest) {
      return;
    }
  
    button.disabled =
      true;
  
    button.textContent =
      "جاري إرسال الطلب...";
  
    clearRecommendationsMessage();
  
    try {
      await createTransaction({
        buyerCompanyId:
          recommendationsCurrentUser.id,
  
        buyerCompanyName:
          recommendationsCurrentUser
            .companyName,
  
        sellerCompanyId:
          recommendation.companyId,
  
        sellerCompanyName:
          recommendation.companyName,
  
        serviceId:
          recommendation.serviceId,
  
        serviceName:
          recommendation.serviceName,
  
        serviceCategory:
          recommendation.serviceCategory,
  
        amount:
          recommendation.servicePrice,
      });
  
      button.textContent =
        "تم إرسال الطلب";
  
      showRecommendationsMessage(
        `تم إرسال طلب خدمة "${recommendation.serviceName}" إلى ${recommendation.companyName} بنجاح.`,
        "success",
      );
  
    } catch (error) {
      console.error(
        "تعذر إرسال طلب الخدمة المقترحة:",
        error,
      );
  
      button.disabled =
        false;
  
      button.textContent =
        "طلب الخدمة";
  
      showRecommendationsMessage(
        "تعذر إرسال طلب الخدمة. حاول مرة أخرى.",
        "error",
      );
    }
  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  
  
  function renderAnalysisResult(
    analysis,
  ) {
    const analysisContent =
      document.getElementById(
        "ai-analysis-content",
      );
  
    if (!analysisContent) {
      return;
    }
  
    analysisContent.innerHTML = `
      <div class="ai-analysis-result">
  
        <span class="ai-analysis-result-icon">
          ✦
        </span>
  
        <div>
          <span class="section-label">
            قراءة الذكاء الاصطناعي
          </span>
  
          <p>
            ${escapeHtml(
              analysis,
            )}
          </p>
        </div>
  
      </div>
    `;
  }
  
  
  function renderAnalysisLoadingState() {
    const analysisContent =
      document.getElementById(
        "ai-analysis-content",
      );
  
    if (!analysisContent) {
      return;
    }
  
    analysisContent.innerHTML = `
      <div class="ai-analysis-state">
  
        <span class="ai-loading-icon">
          ◌
        </span>
  
        <div>
          <h4>
            جاري تحليل نشاط منشأتك...
          </h4>
  
          <p>
            يقرأ الذكاء الاصطناعي بيانات
            الشركات والخدمات المتاحة في الشبكة.
          </p>
        </div>
  
      </div>
    `;
  }
  
  
  function renderAnalysisErrorState() {
    const analysisContent =
      document.getElementById(
        "ai-analysis-content",
      );
  
    if (!analysisContent) {
      return;
    }
  
    analysisContent.innerHTML = `
      <div
        class="
          ai-analysis-state
          ai-analysis-state--error
        "
      >
  
        <span>
          !
        </span>
  
        <div>
          <h4>
            تعذر إكمال التحليل
          </h4>
  
          <p>
            تحقق من الاتصال بالإنترنت،
            ثم حاول تشغيل التحليل مرة أخرى.
          </p>
        </div>
  
      </div>
    `;
  }
  
  
  function renderRecommendationsLoadingState() {
    const recommendationsList =
      document.getElementById(
        "recommendations-list",
      );
  
    if (!recommendationsList) {
      return;
    }
  
    recommendationsList.innerHTML = `
      <div class="recommendations-state">
  
        <span class="recommendations-state-icon">
          ◌
        </span>
  
        <h3>
          جاري البحث عن أفضل الفرص...
        </h3>
  
        <p>
          تتم مقارنة نشاط منشأتك
          بالخدمات المتاحة داخل الشبكة.
        </p>
  
      </div>
    `;
  
    updateRecommendationsCount(0);
  }
  
  
  function renderRecommendationsErrorState() {
    const recommendationsList =
      document.getElementById(
        "recommendations-list",
      );
  
    if (!recommendationsList) {
      return;
    }
  
    recommendationsList.innerHTML = `
      <div
        class="
          recommendations-state
          recommendations-state--error
        "
      >
  
        <span class="recommendations-state-icon">
          !
        </span>
  
        <h3>
          تعذر إنشاء الفرص الذكية
        </h3>
  
        <p>
          لم يتمكن النظام من إكمال التحليل.
          حاول مرة أخرى بعد قليل.
        </p>
  
      </div>
    `;
  
    updateRecommendationsCount(0);
  }
  
  
  function renderInitialAnalysisState() {
    return `
      <div class="ai-analysis-state">
  
        <span class="ai-analysis-state-icon">
          AI
        </span>
  
        <div>
          <h4>
            التحليل جاهز للبدء
          </h4>
  
          <p>
            اضغط على زر تحليل الفرص الذكية
            لاكتشاف الشركات والخدمات
            الأكثر ملاءمة لمنشأتك.
          </p>
        </div>
  
      </div>
    `;
  }
  
  
  function renderInitialRecommendationsState() {
    return `
      <div class="recommendations-state">
  
        <span class="recommendations-state-icon">
          ✦
        </span>
  
        <h3>
          لم يتم تحليل الفرص بعد
        </h3>
  
        <p>
          ستظهر هنا أفضل فرص التعاون
          بعد تشغيل التحليل الذكي.
        </p>
  
      </div>
    `;
  }
  
  
  function renderEmptyRecommendationsState() {
    return `
      <div class="recommendations-state">
  
        <span class="recommendations-state-icon">
          ◇
        </span>
  
        <h3>
          لا توجد فرص مناسبة حاليًا
        </h3>
  
        <p>
          أضف شركات وخدمات جديدة للشبكة،
          ثم أعد تشغيل التحليل.
        </p>
  
      </div>
    `;
  }
  
  
  function updateRecommendationsCount(
    count,
  ) {
    const countElement =
      document.getElementById(
        "recommendations-count",
      );
  
    if (!countElement) {
      return;
    }
  
    countElement.textContent =
      count === 1
        ? "فرصة واحدة"
        : `${formatNumber(
          count,
        )} فرص`;
  }
  
  
  function setGenerateButtonLoading(
    button,
    isLoading,
  ) {
    if (!button) {
      return;
    }
  
    button.disabled =
      isLoading;
  
    if (isLoading) {
      button.textContent =
        "جاري التحليل...";
  
      return;
    }
  
    updateGenerateButtonLabel(
      Boolean(
        lastAnalysisDate,
      ),
    );
  }
  
  
  function updateGenerateButtonLabel(
    hasSavedAnalysis,
  ) {
    const generateButton =
      document.getElementById(
        "generate-recommendations-button",
      );
  
    if (!generateButton) {
      return;
    }
  
    generateButton.textContent =
      hasSavedAnalysis
        ? "إعادة تحليل الفرص"
        : "تحليل الفرص الذكية";
  }
  
  
  function showRecommendationsMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "recommendations-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.textContent =
      message;
  
    messageElement.className = `
      recommendations-message
      recommendations-message--${type}
    `;
  }
  
  
  function clearRecommendationsMessage() {
    const messageElement =
      document.getElementById(
        "recommendations-message",
      );
  
    if (!messageElement) {
      return;
    }
  
    messageElement.textContent =
      "";
  
    messageElement.className =
      "recommendations-message hidden";
  }
  
  
  function getRecommendationErrorMessage(
    error,
  ) {
    const errorMessage =
      error?.message ?? "";
  
    if (
      errorMessage.includes(
        "429",
      )
      || errorMessage
        .toLowerCase()
        .includes("quota")
      || errorMessage
        .toLowerCase()
        .includes("rate")
    ) {
      return "تم الوصول مؤقتًا إلى حد استخدام الذكاء الاصطناعي. انتظر قليلًا ثم حاول مرة أخرى.";
    }
  
    if (
      errorMessage
        === "invalid-gemini-json"
    ) {
      return "وصلت استجابة غير مكتملة من الذكاء الاصطناعي. أعد تشغيل التحليل.";
    }
  
    if (
      errorMessage
        === "current-company-not-found"
    ) {
      return "تعذر التعرف على بيانات الشركة الحالية. سجل الدخول مرة أخرى.";
    }
  
    if (
      errorMessage
        .toLowerCase()
        .includes("failed to fetch")
      || errorMessage
        .toLowerCase()
        .includes("network")
      || errorMessage
        .toLowerCase()
        .includes("offline")
    ) {
      return "تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت ثم حاول مرة أخرى.";
    }
  
    return "تعذر إنشاء الفرص الذكية حاليًا. حاول مرة أخرى بعد قليل.";
  }
  
  
  function getCompanyInitial(
    companyName,
  ) {
    const normalizedName =
      String(
        companyName ?? "",
      )
        .trim();
  
    if (!normalizedName) {
      return "ش";
    }
  
    return escapeHtml(
      normalizedName.charAt(0),
    );
  }

  function updateLastAnalysisDate(
    generatedAt,
  ) {
    const dateElement =
      document.getElementById(
        "last-analysis-date",
      );
  
    if (!dateElement) {
      return;
    }
  
    const analysisDate =
      convertToDate(
        generatedAt,
      );
  
    if (!analysisDate) {
      dateElement.classList.add(
        "hidden",
      );
  
      return;
    }
  
    dateElement.textContent =
      `آخر تحليل: ${formatAnalysisDate(
        analysisDate,
      )}`;
  
    dateElement.classList.remove(
      "hidden",
    );
  }
  
  
  function convertToDate(
    dateValue,
  ) {
    if (!dateValue) {
      return null;
    }
  
    if (
      typeof dateValue.toDate
        === "function"
    ) {
      return dateValue.toDate();
    }
  
    if (
      dateValue instanceof Date
    ) {
      return dateValue;
    }
  
    const convertedDate =
      new Date(
        dateValue,
      );
  
    if (
      Number.isNaN(
        convertedDate.getTime(),
      )
    ) {
      return null;
    }
  
    return convertedDate;
  }
  
  
  function formatAnalysisDate(
    date,
  ) {
    return new Intl.DateTimeFormat(
      "ar-SA",
      {
        dateStyle:
          "medium",
  
        timeStyle:
          "short",
      },
    ).format(
      date,
    );
  }