import {
    aggregateTransactions,
    calculateCompanyNetBalances,
    calculateNettingSettlements,
    calculateNettingSummary,
    getNettingNetworkData,
  } from "../services/netting-service.js";
  
  import {
    escapeHtml,
    formatNumber,
  } from "../utils/formatters.js";
  
  
  let networkCompanies = [];
  
  let completedTransactions = [];
  
  let originalEdges = [];
  
  let settlementEdges = [];
  
  let currentDisplayMode =
    "original";
  
  let selectedCompanyId =
    null;
  
  
  /*
   * واجهة صفحة شبكة المقاصة.
   */
  export function renderNetworkPage() {
    return `
      <div class="network-page">
  
        <section class="network-hero">
  
          <div>
            <span class="network-hero-label">
              شبكة الائتمان المتبادل
            </span>
  
            <h2>
              شبكة المقاصة
            </h2>
  
            <p>
              استعرض حركة الالتزامات بين المنشآت،
              ثم شغّل المقاصة لتحويل المعاملات
              المتعددة إلى التزامات صافية ومبسطة.
            </p>
          </div>
  
          <div class="network-hero-actions">
  
            <button
              id="run-netting-button"
              class="network-primary-button"
              type="button"
              disabled
            >
              تشغيل المقاصة
            </button>
  
            <button
              id="reset-network-button"
              class="network-secondary-button hidden"
              type="button"
            >
              عرض الشبكة الأصلية
            </button>
  
          </div>
  
        </section>
  
  
        <section
          id="network-message"
          class="hidden"
        ></section>
  
  
        <section class="network-summary">
  
          <article class="network-summary-card">
            <span>
              المنشآت النشطة
            </span>
  
            <strong id="network-companies-count">
              0
            </strong>
  
            <small>
              داخل شبكة المقاصة
            </small>
          </article>
  
  
          <article class="network-summary-card">
            <span>
              العلاقات المالية
            </span>
  
            <strong id="network-relations-count">
              0
            </strong>
  
            <small>
              بين أعضاء الشبكة
            </small>
          </article>
  
  
          <article class="network-summary-card">
            <span>
              إجمالي الالتزامات
            </span>
  
            <strong id="network-original-amount">
              0 وحدة
            </strong>
  
            <small>
              قبل تشغيل المقاصة
            </small>
          </article>
  
  
          <article
            class="
              network-summary-card
              network-summary-card--highlight
            "
          >
            <span>
              التوفير المتوقع
            </span>
  
            <strong id="network-saved-amount">
              0 وحدة
            </strong>
  
            <small id="network-saved-percentage">
              شغّل المقاصة لعرض النتيجة
            </small>
          </article>
  
        </section>
  
  
        <section class="network-workspace">
  
          <article class="network-visualization-card">
  
            <div class="network-card-header">
  
              <div>
                <span
                  id="network-mode-badge"
                  class="network-mode-badge"
                >
                  قبل المقاصة
                </span>
  
                <h3>
                  خريطة التبادل بين المنشآت
                </h3>
  
                <p id="network-mode-description">
                  الأسهم تمثل قيمة المعاملات
                  المكتملة بين المنشآت.
                </p>
              </div>
  
              <button
                id="refresh-network-button"
                class="network-icon-button"
                type="button"
                aria-label="تحديث الشبكة"
                title="تحديث الشبكة"
              >
                ↻
              </button>
  
            </div>
  
  
            <div
              id="network-canvas-container"
              class="network-canvas-container"
            >
              ${renderNetworkLoadingState()}
            </div>
  
  
            <div class="network-legend">
  
              <div>
                <span
                  class="
                    network-legend-dot
                    network-legend-dot--current
                  "
                ></span>
  
                منشأتك
              </div>
  
              <div>
                <span
                  class="
                    network-legend-dot
                    network-legend-dot--positive
                  "
                ></span>
  
                رصيد موجب
              </div>
  
              <div>
                <span
                  class="
                    network-legend-dot
                    network-legend-dot--negative
                  "
                ></span>
  
                رصيد سالب
              </div>
  
              <div>
                <span class="network-legend-line"></span>
  
                التزام مالي
              </div>
  
            </div>
  
          </article>
  
  
          <aside
            id="company-details-panel"
            class="network-details-card"
          >
            ${renderNoCompanySelectedState()}
          </aside>
  
        </section>
  
  
        <section
          id="netting-results-section"
          class="
            netting-results-section
            hidden
          "
        >
  
          <div class="netting-results-header">
  
            <div>
              <span>
                نتيجة الخوارزمية
              </span>
  
              <h3>
                الالتزامات بعد المقاصة
              </h3>
  
              <p>
                تم احتساب صافي المبالغ المستحقة
                لكل منشأة وإعادة توزيع التحويلات.
              </p>
            </div>
  
            <div class="netting-success-icon">
              ✓
            </div>
  
          </div>
  
  
          <div
            id="netting-comparison"
            class="netting-comparison"
          ></div>
  
  
          <div
            id="netting-settlements-list"
            class="netting-settlements-list"
          ></div>
  
        </section>
  
      </div>
    `;
  }
  
  
  /*
   * تشغيل الصفحة بعد إضافتها إلى DOM.
   */
  export async function initializeNetworkPage({
    currentUser,
  }) {
    selectedCompanyId =
      currentUser?.id
      ?? null;
  
    currentDisplayMode =
      "original";
  
    attachNetworkEvents(
      currentUser,
    );
  
    await loadNetworkData(
      currentUser,
    );
  }
  
  
  /*
   * تحميل البيانات الحقيقية من Firestore.
   */
  async function loadNetworkData(
    currentUser,
  ) {
    const canvasContainer =
      document.getElementById(
        "network-canvas-container",
      );
  
    const runNettingButton =
      document.getElementById(
        "run-netting-button",
      );
  
  
    canvasContainer.innerHTML =
      renderNetworkLoadingState();
  
    runNettingButton.disabled =
      true;
  
  
    try {
      const networkData =
        await getNettingNetworkData();
  
  
      networkCompanies =
        networkData.companies;
  
      completedTransactions =
        networkData.transactions;
  
      originalEdges =
        aggregateTransactions(
          completedTransactions,
        );
  
  
      const netBalances =
        calculateCompanyNetBalances(
          networkCompanies,
          completedTransactions,
        );
  
      settlementEdges =
        calculateNettingSettlements(
          netBalances,
        );
  
  
      currentDisplayMode =
        "original";
  
  
      updateNetworkSummary();
  
      renderNetworkGraph(
        originalEdges,
        currentUser,
      );
  
      renderCompanyDetails(
        selectedCompanyId,
        currentUser,
      );
  
  
      runNettingButton.disabled =
        originalEdges.length === 0;
  
  
      document
        .getElementById(
          "reset-network-button",
        )
        .classList
        .add(
          "hidden",
        );
  
  
      document
        .getElementById(
          "netting-results-section",
        )
        .classList
        .add(
          "hidden",
        );
  
  
      if (!originalEdges.length) {
        canvasContainer.innerHTML =
          renderNetworkEmptyState();
      }
  
    } catch (error) {
      console.error(
        "تعذر تحميل شبكة المقاصة:",
        error,
      );
  
      canvasContainer.innerHTML =
        renderNetworkErrorState();
  
      showNetworkMessage(
        "تعذر تحميل بيانات شبكة المقاصة.",
        "error",
      );
    }
  }
  
  
  /*
   * رسم الشركات والعلاقات داخل SVG.
   */
  function renderNetworkGraph(
    edges,
    currentUser,
  ) {
    const canvasContainer =
      document.getElementById(
        "network-canvas-container",
      );
  
  
    const connectedCompanyIds =
      new Set();
  
  
    edges.forEach(
      (edge) => {
        connectedCompanyIds.add(
          edge.sourceId,
        );
  
        connectedCompanyIds.add(
          edge.targetId,
        );
      },
    );
  
  
    /*
     * نظهر الشركات المرتبطة بمعاملات.
     * ونضمن ظهور الشركة الحالية أيضًا.
     */
    if (currentUser?.id) {
      connectedCompanyIds.add(
        currentUser.id,
      );
    }
  
  
    const visibleCompanies =
      networkCompanies.filter(
        (company) =>
          connectedCompanyIds.has(
            company.id,
          ),
      );
  
  
    if (!visibleCompanies.length) {
      canvasContainer.innerHTML =
        renderNetworkEmptyState();
  
      return;
    }
  
  
    const canvasWidth =
      1000;
  
    const canvasHeight =
      620;
  
    const centerX =
      canvasWidth / 2;
  
    const centerY =
      canvasHeight / 2;
  
    const horizontalRadius =
      visibleCompanies.length <= 4
        ? 300
        : 370;
  
    const verticalRadius =
      visibleCompanies.length <= 4
        ? 205
        : 230;
  
  
    const companyPositions =
      calculateCircularPositions(
        visibleCompanies,
        centerX,
        centerY,
        horizontalRadius,
        verticalRadius,
      );
  
  
    const edgesMarkup =
      edges
        .filter(
          (edge) =>
            companyPositions.has(
              edge.sourceId,
            )
            && companyPositions.has(
              edge.targetId,
            ),
        )
        .map(
          (edge, edgeIndex) =>
            renderNetworkEdge(
              edge,
              edgeIndex,
              companyPositions,
            ),
        )
        .join("");
  
  
    const nodesMarkup =
      visibleCompanies
        .map(
          (company) =>
            renderCompanyNode(
              company,
              companyPositions.get(
                company.id,
              ),
              currentUser,
            ),
        )
        .join("");
  
  
    canvasContainer.innerHTML = `
      <svg
        class="network-svg"
        viewBox="0 0 ${canvasWidth} ${canvasHeight}"
        role="img"
        aria-label="شبكة المقاصة بين المنشآت"
      >
  
        <defs>
  
          <marker
            id="network-arrow-original"
            markerWidth="10"
            markerHeight="10"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L8,3 z"
              class="network-arrow-path"
            ></path>
          </marker>
  
          <marker
            id="network-arrow-netted"
            markerWidth="10"
            markerHeight="10"
            refX="7"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L8,3 z"
              class="
                network-arrow-path
                network-arrow-path--netted
              "
            ></path>
          </marker>
  
          <filter
            id="network-node-shadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="8"
              stdDeviation="8"
              flood-opacity="0.12"
            ></feDropShadow>
          </filter>
  
        </defs>
  
  
        <g class="network-edges-layer">
          ${edgesMarkup}
        </g>
  
        <g class="network-nodes-layer">
          ${nodesMarkup}
        </g>
  
      </svg>
    `;
  
  
    attachCompanyNodeEvents(
      currentUser,
    );
  }
  
  
  /*
   * توزيع الشركات على شكل دائرة.
   */
  function calculateCircularPositions(
    companies,
    centerX,
    centerY,
    horizontalRadius,
    verticalRadius,
  ) {
    const positions =
      new Map();
  
  
    companies.forEach(
      (company, index) => {
        const angle =
          (
            Math.PI * 2 * index
          ) / companies.length
          - Math.PI / 2;
  
  
        positions.set(
          company.id,
          {
            x:
              centerX
              + Math.cos(angle)
                * horizontalRadius,
  
            y:
              centerY
              + Math.sin(angle)
                * verticalRadius,
          },
        );
      },
    );
  
  
    return positions;
  }
  
  
  /*
   * رسم سهم من المشتري إلى البائع.
   */
  function renderNetworkEdge(
    edge,
    edgeIndex,
    companyPositions,
  ) {
    const source =
      companyPositions.get(
        edge.sourceId,
      );
  
    const target =
      companyPositions.get(
        edge.targetId,
      );
  
  
    const shortenedLine =
      shortenLine(
        source.x,
        source.y,
        target.x,
        target.y,
        72,
      );
  
  
    const middleX =
      (
        shortenedLine.x1
        + shortenedLine.x2
      ) / 2;
  
    const middleY =
      (
        shortenedLine.y1
        + shortenedLine.y2
      ) / 2;
  
  
    const isNetted =
      currentDisplayMode
        === "netted";
  
  
    const edgeClass =
      isNetted
        ? "network-edge network-edge--netted"
        : "network-edge";
  
  
    const markerId =
      isNetted
        ? "network-arrow-netted"
        : "network-arrow-original";
  
  
    const amountLabel =
      `${formatNumber(edge.amount)} وحدة`;
  
  
    return `
      <g
        class="network-edge-group"
        data-edge-id="${escapeHtml(
          edge.id,
        )}"
      >
  
        <line
          x1="${shortenedLine.x1}"
          y1="${shortenedLine.y1}"
          x2="${shortenedLine.x2}"
          y2="${shortenedLine.y2}"
          class="${edgeClass}"
          marker-end="url(#${markerId})"
        ></line>
  
  
        <g
          class="network-edge-label-group"
          transform="
            translate(
              ${middleX},
              ${middleY}
            )
          "
        >
  
          <rect
            x="-52"
            y="-18"
            width="104"
            height="36"
            rx="18"
            class="
              network-edge-label-background
              ${
                isNetted
                  ? "network-edge-label-background--netted"
                  : ""
              }
            "
          ></rect>
  
          <text
            x="0"
            y="5"
            text-anchor="middle"
            class="network-edge-label"
          >
            ${amountLabel}
          </text>
  
        </g>
  
      </g>
    `;
  }
  
  
  /*
   * تقصير الخط حتى لا يدخل داخل دائرة الشركة.
   */
  function shortenLine(
    x1,
    y1,
    x2,
    y2,
    distance,
  ) {
    const differenceX =
      x2 - x1;
  
    const differenceY =
      y2 - y1;
  
    const length =
      Math.sqrt(
        differenceX * differenceX
        + differenceY * differenceY,
      );
  
  
    if (!length) {
      return {
        x1,
        y1,
        x2,
        y2,
      };
    }
  
  
    const unitX =
      differenceX / length;
  
    const unitY =
      differenceY / length;
  
  
    return {
      x1:
        x1
        + unitX * distance,
  
      y1:
        y1
        + unitY * distance,
  
      x2:
        x2
        - unitX * distance,
  
      y2:
        y2
        - unitY * distance,
    };
  }
  
  
  /*
   * رسم عقدة الشركة.
   */
  function renderCompanyNode(
    company,
    position,
    currentUser,
  ) {
    const isCurrentCompany =
      company.id
        === currentUser?.id;
  
    const isSelected =
      company.id
        === selectedCompanyId;
  
  
    const balanceClass =
      company.balance < 0
        ? "network-node--negative"
        : "network-node--positive";
  
  
    const nodeClasses = [
      "network-node",
  
      balanceClass,
  
      isCurrentCompany
        ? "network-node--current"
        : "",
  
      isSelected
        ? "network-node--selected"
        : "",
    ]
      .filter(Boolean)
      .join(" ");
  
  
    const initials =
      getCompanyInitials(
        company.companyName,
      );
  
  
    const shortCompanyName =
      truncateText(
        company.companyName,
        18,
      );
  
  
    return `
      <g
        class="${nodeClasses}"
        data-company-id="${company.id}"
        transform="
          translate(
            ${position.x},
            ${position.y}
          )
        "
        role="button"
        tabindex="0"
      >
  
        <circle
          cx="0"
          cy="0"
          r="64"
          class="network-node-circle"
          filter="url(#network-node-shadow)"
        ></circle>
  
  
        <circle
          cx="0"
          cy="-10"
          r="25"
          class="network-node-avatar"
        ></circle>
  
  
        <text
          x="0"
          y="-3"
          text-anchor="middle"
          class="network-node-initials"
        >
          ${escapeHtml(initials)}
        </text>
  
  
        <text
          x="0"
          y="33"
          text-anchor="middle"
          class="network-node-name"
        >
          ${escapeHtml(
            shortCompanyName,
          )}
        </text>
  
  
        ${
          isCurrentCompany
            ? `
              <g
                transform="
                  translate(
                    0,
                    61
                  )
                "
              >
                <rect
                  x="-34"
                  y="-11"
                  width="68"
                  height="22"
                  rx="11"
                  class="network-current-company-badge"
                ></rect>
  
                <text
                  x="0"
                  y="4"
                  text-anchor="middle"
                  class="network-current-company-text"
                >
                  منشأتك
                </text>
              </g>
            `
            : ""
        }
  
      </g>
    `;
  }
  
  
  /*
   * تشغيل المقاصة وتغيير الرسم.
   */
  function runNettingSimulation(
    currentUser,
  ) {
    if (!originalEdges.length) {
      showNetworkMessage(
        "لا توجد معاملات مكتملة لتشغيل المقاصة.",
        "error",
      );
  
      return;
    }
  
  
    currentDisplayMode =
      "netted";
  
  
    renderNetworkGraph(
      settlementEdges,
      currentUser,
    );
  
  
    updateNetworkModeHeader();
  
    renderNettingResults();
  
    updateNetworkSummary();
  
  
    document
      .getElementById(
        "reset-network-button",
      )
      .classList
      .remove(
        "hidden",
      );
  
  
    document
      .getElementById(
        "netting-results-section",
      )
      .classList
      .remove(
        "hidden",
      );
  
  
    showNetworkMessage(
      "تم تشغيل المقاصة وعرض صافي الالتزامات بنجاح.",
      "success",
    );
  
  
    document
      .getElementById(
        "netting-results-section",
      )
      .scrollIntoView({
        behavior:
          "smooth",
  
        block:
          "start",
      });
  }
  
  
  /*
   * الرجوع للشبكة الأصلية.
   */
  function resetNetworkView(
    currentUser,
  ) {
    currentDisplayMode =
      "original";
  
  
    renderNetworkGraph(
      originalEdges,
      currentUser,
    );
  
  
    updateNetworkModeHeader();
  
    updateNetworkSummary();
  
  
    document
      .getElementById(
        "reset-network-button",
      )
      .classList
      .add(
        "hidden",
      );
  
  
    document
      .getElementById(
        "netting-results-section",
      )
      .classList
      .add(
        "hidden",
      );
  }
  
  
  /*
   * تغيير عنوان ووصف حالة الشبكة.
   */
  function updateNetworkModeHeader() {
    const modeBadge =
      document.getElementById(
        "network-mode-badge",
      );
  
    const modeDescription =
      document.getElementById(
        "network-mode-description",
      );
  
  
    if (
      currentDisplayMode
        === "netted"
    ) {
      modeBadge.textContent =
        "بعد المقاصة";
  
      modeBadge.classList.add(
        "network-mode-badge--netted",
      );
  
      modeDescription.textContent =
        "الأسهم تعرض صافي الالتزامات بعد تقليل التحويلات المتقاطعة.";
  
      return;
    }
  
  
    modeBadge.textContent =
      "قبل المقاصة";
  
    modeBadge.classList.remove(
      "network-mode-badge--netted",
    );
  
    modeDescription.textContent =
      "الأسهم تمثل قيمة المعاملات المكتملة بين المنشآت.";
  }
  
  
  /*
   * تحديث بطاقات الملخص.
   */
  function updateNetworkSummary() {
    const summary =
      calculateNettingSummary(
        originalEdges,
        settlementEdges,
      );
  
  
    const activeCompanyIds =
      new Set();
  
  
    originalEdges.forEach(
      (edge) => {
        activeCompanyIds.add(
          edge.sourceId,
        );
  
        activeCompanyIds.add(
          edge.targetId,
        );
      },
    );
  
  
    setElementText(
      "network-companies-count",
      formatNumber(
        activeCompanyIds.size,
      ),
    );
  
  
    setElementText(
      "network-relations-count",
      formatNumber(
        currentDisplayMode
          === "netted"
          ? settlementEdges.length
          : originalEdges.length,
      ),
    );
  
  
    setElementText(
      "network-original-amount",
      `${formatNumber(
        summary.originalAmount,
      )} وحدة`,
    );
  
  
    setElementText(
      "network-saved-amount",
      `${formatNumber(
        summary.reducedAmount,
      )} وحدة`,
    );
  
  
    setElementText(
      "network-saved-percentage",
      currentDisplayMode
        === "netted"
        ? `انخفاض بنسبة ${formatNumber(
            summary.reductionPercentage,
          )}%`
        : "شغّل المقاصة لعرض النتيجة",
    );
  }
  
  
  /*
   * تفاصيل الشركة عند الضغط عليها.
   */
  function renderCompanyDetails(
    companyId,
    currentUser,
  ) {
    const detailsPanel =
      document.getElementById(
        "company-details-panel",
      );
  
  
    const company =
      networkCompanies.find(
        (networkCompany) =>
          networkCompany.id
            === companyId,
      );
  
  
    if (!company) {
      detailsPanel.innerHTML =
        renderNoCompanySelectedState();
  
      return;
    }
  
  
    const companyTransactions =
      completedTransactions.filter(
        (transaction) =>
          transaction.buyerCompanyId
            === company.id
          || transaction.sellerCompanyId
            === company.id,
      );
  
  
    const incomingAmount =
      companyTransactions
        .filter(
          (transaction) =>
            transaction.sellerCompanyId
              === company.id,
        )
        .reduce(
          (total, transaction) =>
            total
            + Number(
              transaction.amount,
            ),
  
          0,
        );
  
  
    const outgoingAmount =
      companyTransactions
        .filter(
          (transaction) =>
            transaction.buyerCompanyId
              === company.id,
        )
        .reduce(
          (total, transaction) =>
            total
            + Number(
              transaction.amount,
            ),
  
          0,
        );
  
  
    const netAmount =
      incomingAmount
      - outgoingAmount;
  
  
    const isCurrentCompany =
      company.id
        === currentUser?.id;
  
  
    detailsPanel.innerHTML = `
      <div class="network-details-header">
  
        <div class="network-details-avatar">
          ${escapeHtml(
            getCompanyInitials(
              company.companyName,
            ),
          )}
        </div>
  
        <div>
          ${
            isCurrentCompany
              ? `
                <span class="network-details-current-label">
                  منشأتك
                </span>
              `
              : ""
          }
  
          <h3>
            ${escapeHtml(
              company.companyName,
            )}
          </h3>
  
          <p>
            ${escapeHtml(
              company.businessType,
            )}
          </p>
        </div>
  
      </div>
  
  
      <div class="network-details-location">
        <span>⌖</span>
  
        ${escapeHtml(
          company.city,
        )}
      </div>
  
  
      <div class="network-details-metrics">
  
        <article>
          <span>
            الرصيد الحالي
          </span>
  
          <strong
            class="
              ${
                company.balance < 0
                  ? "metric-negative"
                  : "metric-positive"
              }
            "
          >
            ${formatNumber(
              company.balance,
            )}
            وحدة
          </strong>
        </article>
  
  
        <article>
          <span>
            مستوى الثقة
          </span>
  
          <strong>
            ${formatNumber(
              company.trustScore,
            )}%
          </strong>
        </article>
  
  
        <article>
          <span>
            معاملات مكتملة
          </span>
  
          <strong>
            ${formatNumber(
              companyTransactions.length,
            )}
          </strong>
        </article>
  
  
        <article>
          <span>
            صافي الالتزامات
          </span>
  
          <strong
            class="
              ${
                netAmount < 0
                  ? "metric-negative"
                  : "metric-positive"
              }
            "
          >
            ${formatNumber(
              netAmount,
            )}
            وحدة
          </strong>
        </article>
  
      </div>
  
  
      <div class="network-details-flow">
  
        <div>
          <span>
            إجمالي الوارد
          </span>
  
          <strong>
            +${formatNumber(
              incomingAmount,
            )}
          </strong>
        </div>
  
  
        <div>
          <span>
            إجمالي الصادر
          </span>
  
          <strong>
            -${formatNumber(
              outgoingAmount,
            )}
          </strong>
        </div>
  
      </div>
    `;
  }
  
  
  /*
   * عرض مقارنة المقاصة.
   */
  function renderNettingResults() {
    const comparisonContainer =
      document.getElementById(
        "netting-comparison",
      );
  
    const settlementsContainer =
      document.getElementById(
        "netting-settlements-list",
      );
  
  
    const summary =
      calculateNettingSummary(
        originalEdges,
        settlementEdges,
      );
  
  
    comparisonContainer.innerHTML = `
      <article>
        <span>
          قبل المقاصة
        </span>
  
        <strong>
          ${formatNumber(
            summary.originalAmount,
          )}
          وحدة
        </strong>
  
        <small>
          ${formatNumber(
            summary.originalTransfers,
          )}
          تحويلات مالية
        </small>
      </article>
  
  
      <div class="netting-comparison-arrow">
        ←
      </div>
  
  
      <article
        class="netting-comparison-result"
      >
        <span>
          بعد المقاصة
        </span>
  
        <strong>
          ${formatNumber(
            summary.settlementAmount,
          )}
          وحدة
        </strong>
  
        <small>
          ${formatNumber(
            summary.settlementTransfers,
          )}
          تحويلات صافية
        </small>
      </article>
  
  
      <article
        class="netting-comparison-saving"
      >
        <span>
          إجمالي التخفيض
        </span>
  
        <strong>
          ${formatNumber(
            summary.reducedAmount,
          )}
          وحدة
        </strong>
  
        <small>
          ${formatNumber(
            summary.reductionPercentage,
          )}%
          من الالتزامات
        </small>
      </article>
    `;
  
  
    if (!settlementEdges.length) {
      settlementsContainer.innerHTML = `
        <div class="netting-balanced-state">
          <span>✓</span>
  
          <div>
            <h4>
              الشبكة متوازنة بالكامل
            </h4>
  
            <p>
              لا توجد تحويلات إضافية مطلوبة
              بعد إجراء المقاصة.
            </p>
          </div>
        </div>
      `;
  
      return;
    }
  
  
    settlementsContainer.innerHTML = `
      <div class="netting-settlements-title">
        <h4>
          التحويلات المطلوبة بعد المقاصة
        </h4>
  
        <span>
          ${formatNumber(
            settlementEdges.length,
          )}
          تحويلات
        </span>
      </div>
  
  
      ${settlementEdges
        .map(
          (settlement) => `
            <article class="netting-settlement-card">
  
              <div class="netting-settlement-company">
                <div>
                  ${escapeHtml(
                    getCompanyInitials(
                      settlement.sourceName,
                    ),
                  )}
                </div>
  
                <span>
                  ${escapeHtml(
                    settlement.sourceName,
                  )}
                </span>
              </div>
  
  
              <div class="netting-settlement-flow">
                <strong>
                  ${formatNumber(
                    settlement.amount,
                  )}
                  وحدة
                </strong>
  
                <span>
                  ─────←
                </span>
              </div>
  
  
              <div class="netting-settlement-company">
                <div>
                  ${escapeHtml(
                    getCompanyInitials(
                      settlement.targetName,
                    ),
                  )}
                </div>
  
                <span>
                  ${escapeHtml(
                    settlement.targetName,
                  )}
                </span>
              </div>
  
            </article>
          `,
        )
        .join("")}
    `;
  }
  
  
  /*
   * ربط أحداث الصفحة.
   */
  function attachNetworkEvents(
    currentUser,
  ) {
    const runNettingButton =
      document.getElementById(
        "run-netting-button",
      );
  
    const resetNetworkButton =
      document.getElementById(
        "reset-network-button",
      );
  
    const refreshNetworkButton =
      document.getElementById(
        "refresh-network-button",
      );
  
  
    runNettingButton.addEventListener(
      "click",
      () => {
        runNettingSimulation(
          currentUser,
        );
      },
    );
  
  
    resetNetworkButton.addEventListener(
      "click",
      () => {
        resetNetworkView(
          currentUser,
        );
      },
    );
  
  
    refreshNetworkButton.addEventListener(
      "click",
      async () => {
        refreshNetworkButton.disabled =
          true;
  
        refreshNetworkButton.classList.add(
          "network-icon-button--loading",
        );
  
  
        await loadNetworkData(
          currentUser,
        );
  
  
        refreshNetworkButton.disabled =
          false;
  
        refreshNetworkButton.classList.remove(
          "network-icon-button--loading",
        );
      },
    );
  }
  
  
  /*
   * أحداث الضغط على الشركات.
   */
  function attachCompanyNodeEvents(
    currentUser,
  ) {
    const companyNodes =
      document.querySelectorAll(
        "[data-company-id]",
      );
  
  
    companyNodes.forEach(
      (companyNode) => {
        const selectCompany =
          () => {
            selectedCompanyId =
              companyNode.dataset
                .companyId;
  
  
            renderNetworkGraph(
              currentDisplayMode
                === "netted"
                ? settlementEdges
                : originalEdges,
  
              currentUser,
            );
  
  
            renderCompanyDetails(
              selectedCompanyId,
              currentUser,
            );
          };
  
  
        companyNode.addEventListener(
          "click",
          selectCompany,
        );
  
  
        companyNode.addEventListener(
          "keydown",
          (event) => {
            if (
              event.key === "Enter"
              || event.key === " "
            ) {
              event.preventDefault();
  
              selectCompany();
            }
          },
        );
      },
    );
  }
  
  
  /*
   * حالات الصفحة.
   */
  function renderNetworkLoadingState() {
    return `
      <div class="network-state">
        <span class="network-state-spinner">
          ◌
        </span>
  
        <h3>
          جاري بناء شبكة المقاصة...
        </h3>
  
        <p>
          يتم تحميل المنشآت والمعاملات
          المكتملة من قاعدة البيانات.
        </p>
      </div>
    `;
  }
  
  
  function renderNetworkEmptyState() {
    return `
      <div class="network-state">
        <span class="network-state-icon">
          ⌘
        </span>
  
        <h3>
          لا توجد شبكة معاملات بعد
        </h3>
  
        <p>
          يجب إتمام معاملات بين منشأتين
          أو أكثر حتى تظهر شبكة المقاصة.
        </p>
      </div>
    `;
  }
  
  
  function renderNetworkErrorState() {
    return `
      <div
        class="
          network-state
          network-state--error
        "
      >
        <span class="network-state-icon">
          !
        </span>
  
        <h3>
          تعذر رسم الشبكة
        </h3>
  
        <p>
          تحقق من الاتصال بقاعدة البيانات
          ثم حاول مرة أخرى.
        </p>
      </div>
    `;
  }
  
  
  function renderNoCompanySelectedState() {
    return `
      <div class="network-details-empty">
        <span>
          ◎
        </span>
  
        <h3>
          تفاصيل المنشأة
        </h3>
  
        <p>
          اضغط على أي منشأة داخل الشبكة
          لعرض بياناتها وتدفقاتها المالية.
        </p>
      </div>
    `;
  }
  
  
  /*
   * أدوات مساعدة.
   */
  function getCompanyInitials(
    companyName,
  ) {
    return String(
      companyName
      ?? "م",
    )
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(
        (word) =>
          word.charAt(0),
      )
      .join("");
  }
  
  
  function truncateText(
    text,
    maximumLength,
  ) {
    const safeText =
      String(
        text
        ?? "",
      );
  
  
    if (
      safeText.length
        <= maximumLength
    ) {
      return safeText;
    }
  
  
    return `${safeText.slice(
      0,
      maximumLength,
    )}…`;
  }
  
  
  function setElementText(
    elementId,
    text,
  ) {
    const element =
      document.getElementById(
        elementId,
      );
  
  
    if (element) {
      element.textContent =
        text;
    }
  }
  
  
  function showNetworkMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "network-message",
      );
  
  
    messageElement.textContent =
      message;
  
    messageElement.className =
      type === "error"
        ? "form-error-message"
        : "form-success-message";
  
  
    setTimeout(
      () => {
        messageElement.textContent =
          "";
  
        messageElement.className =
          "hidden";
      },
  
      4000,
    );
  }