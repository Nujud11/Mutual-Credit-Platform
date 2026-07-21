import {
    completeTransaction,
    getCompanyTransactions,
    updateTransactionStatus,
  } from "../services/transaction-repository.js";
  
  import {
    escapeHtml,
    formatNumber,
  } from "../utils/formatters.js";
  
  
  let pageCurrentUser = null;
  
  let pageTransactions = [];
  
  let activeTransactionFilter =
    "all";
  
  
  export function renderTransactionsPage() {
    return `
      <div class="transactions-page">
  
        <section class="transactions-header">
          <div>
            <span class="transactions-label">
              دورة التبادل
            </span>
  
            <h2>
              المعاملات
            </h2>
  
            <p>
              تابع طلبات الخدمات الصادرة
              والواردة وحالة كل معاملة.
            </p>
          </div>
  
          <div class="transactions-header-icon">
            ⇄
          </div>
        </section>
  
  
        <section
          id="transactions-message"
          class="hidden"
        ></section>
  
  
        <section class="transactions-summary">
  
          <article class="transaction-summary-card">
            <span>
              إجمالي المعاملات
            </span>
  
            <strong id="total-transactions-count">
              0
            </strong>
          </article>
  
  
          <article class="transaction-summary-card">
            <span>
              طلبات صادرة
            </span>
  
            <strong id="outgoing-transactions-count">
              0
            </strong>
          </article>
  
  
          <article class="transaction-summary-card">
            <span>
              طلبات واردة
            </span>
  
            <strong id="incoming-transactions-count">
              0
            </strong>
          </article>
  
  
          <article class="transaction-summary-card">
            <span>
              بانتظار الموافقة
            </span>
  
            <strong id="pending-transactions-count">
              0
            </strong>
          </article>
  
        </section>
  
  
        <section class="transactions-filters card">
  
          <button
            class="transaction-filter-button active"
            data-transaction-filter="all"
            type="button"
          >
            جميع المعاملات
          </button>
  
          <button
            class="transaction-filter-button"
            data-transaction-filter="outgoing"
            type="button"
          >
            الطلبات الصادرة
          </button>
  
          <button
            class="transaction-filter-button"
            data-transaction-filter="incoming"
            type="button"
          >
            الطلبات الواردة
          </button>
  
          <button
            class="transaction-filter-button"
            data-transaction-filter="pending"
            type="button"
          >
            بانتظار الموافقة
          </button>
  
        </section>
  
  
        <section
          id="transactions-list"
          class="transactions-list"
        >
          ${renderLoadingState()}
        </section>
  
      </div>
    `;
  }
  
  
  export async function initializeTransactionsPage({
    currentUser,
  }) {
    pageCurrentUser =
      currentUser;
  
    activeTransactionFilter =
      "all";
  
    attachFilterEvents();
  
    await loadTransactions();
  }
  
  
  async function loadTransactions() {
    const transactionsList =
      document.getElementById(
        "transactions-list",
      );
  
    transactionsList.innerHTML =
      renderLoadingState();
  
    try {
      pageTransactions =
        await getCompanyTransactions(
          pageCurrentUser.id,
        );
  
      updateTransactionStatistics(
        pageTransactions,
        pageCurrentUser.id,
      );
  
      renderActiveFilter();
  
    } catch (error) {
      console.error(
        "تعذر تحميل المعاملات:",
        error,
      );
  
      transactionsList.innerHTML =
        renderErrorState();
    }
  }
  
  
  function renderActiveFilter() {
    const filteredTransactions =
      filterTransactions(
        pageTransactions,
        activeTransactionFilter,
        pageCurrentUser.id,
      );
  
    renderTransactions(
      filteredTransactions,
      pageCurrentUser.id,
    );
  }
  
  
  function filterTransactions(
    transactions,
    selectedFilter,
    currentCompanyId,
  ) {
    return transactions.filter(
      (transaction) => {
        if (
          selectedFilter === "all"
        ) {
          return true;
        }
  
        if (
          selectedFilter === "outgoing"
        ) {
          return (
            transaction.buyerCompanyId
              === currentCompanyId
          );
        }
  
        if (
          selectedFilter === "incoming"
        ) {
          return (
            transaction.sellerCompanyId
              === currentCompanyId
          );
        }
  
        if (
          selectedFilter === "pending"
        ) {
          return (
            transaction.status
              === "pending"
          );
        }
  
        return true;
      },
    );
  }
  
  
  function renderTransactions(
    transactions,
    currentCompanyId,
  ) {
    const transactionsList =
      document.getElementById(
        "transactions-list",
      );
  
    if (!transactions.length) {
      transactionsList.innerHTML =
        renderEmptyState();
  
      return;
    }
  
    transactionsList.innerHTML =
      transactions
        .map((transaction) =>
          renderTransactionCard(
            transaction,
            currentCompanyId,
          )
        )
        .join("");
  
    attachTransactionActionEvents();
  }
  
  
  function renderTransactionCard(
    transaction,
    currentCompanyId,
  ) {
    const isBuyer =
      transaction.buyerCompanyId
        === currentCompanyId;
  
    const isSeller =
      transaction.sellerCompanyId
        === currentCompanyId;
  
    const transactionDirection =
      isBuyer
        ? "طلب صادر"
        : "طلب وارد";
  
    const otherCompanyName =
      isBuyer
        ? transaction.sellerCompanyName
        : transaction.buyerCompanyName;
  
    const otherCompanyLabel =
      isBuyer
        ? "مقدم الخدمة"
        : "طالب الخدمة";
  
    const canRespondToRequest =
      isSeller
      && transaction.status
        === "pending";
  
    const canCompleteService =
      isSeller
      && transaction.status
        === "accepted";
  
    return `
      <article class="transaction-card">
  
        <div class="transaction-card-main">
  
          <div class="transaction-direction-icon">
            ${isBuyer ? "↗" : "↙"}
          </div>
  
          <div class="transaction-information">
  
            <div class="transaction-card-labels">
              <span
                class="
                  transaction-direction
                  ${
                    isBuyer
                      ? "transaction-direction--outgoing"
                      : "transaction-direction--incoming"
                  }
                "
              >
                ${transactionDirection}
              </span>
  
              ${renderStatusBadge(
                transaction.status,
              )}
            </div>
  
            <h3>
              ${escapeHtml(
                transaction.serviceName,
              )}
            </h3>
  
            <p>
              ${otherCompanyLabel}:
              <strong>
                ${escapeHtml(
                  otherCompanyName,
                )}
              </strong>
            </p>
  
            ${
              canRespondToRequest
                ? renderPendingActions(
                    transaction.id,
                  )
                : ""
            }
  
            ${
              canCompleteService
                ? renderCompletionAction(
                    transaction.id,
                  )
                : ""
            }
  
          </div>
  
        </div>
  
  
        <div class="transaction-card-amount">
          <small>
            قيمة المعاملة
          </small>
  
          <strong>
            ${formatNumber(
              transaction.amount,
            )}
            MQ
          </strong>
        </div>
  
      </article>
    `;
  }
  
  
  function renderPendingActions(
    transactionId,
  ) {
    return `
      <div class="transaction-actions">
  
        <button
          class="
            transaction-action-button
            transaction-action-button--accept
          "
          data-transaction-action="accepted"
          data-transaction-id="${transactionId}"
          type="button"
        >
          قبول الطلب
        </button>
  
        <button
          class="
            transaction-action-button
            transaction-action-button--reject
          "
          data-transaction-action="rejected"
          data-transaction-id="${transactionId}"
          type="button"
        >
          رفض الطلب
        </button>
  
      </div>
    `;
  }

  function renderCompletionAction(
    transactionId,
  ) {
    return `
      <div class="transaction-actions">
  
        <button
          class="
            transaction-action-button
            transaction-action-button--complete
          "
          data-transaction-action="completed"
          data-transaction-id="${transactionId}"
          type="button"
        >
          تأكيد إتمام الخدمة
        </button>
  
      </div>
    `;
  }
  
  
  function attachTransactionActionEvents() {
    const actionButtons =
      document.querySelectorAll(
        "[data-transaction-action]",
      );
  
    actionButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          async () => {
            const transactionId =
              button.dataset.transactionId;
  
            const selectedAction =
              button.dataset.transactionAction;
  
            const isAcceptAction =
              selectedAction === "accepted";
  
            const isRejectAction =
              selectedAction === "rejected";
  
            const isCompleteAction =
              selectedAction === "completed";
  
            let confirmationMessage = "";
  
            if (isAcceptAction) {
              confirmationMessage =
                "هل تريد قبول هذا الطلب؟";
            }
  
            if (isRejectAction) {
              confirmationMessage =
                "هل تريد رفض هذا الطلب؟";
            }
  
            if (isCompleteAction) {
              confirmationMessage =
                "هل تم تنفيذ الخدمة وتريد إتمام المعاملة وتحديث الأرصدة؟";
            }
  
            const shouldContinue =
              window.confirm(
                confirmationMessage,
              );
  
            if (!shouldContinue) {
              return;
            }
  
            setTransactionButtonsLoading(
              transactionId,
              true,
            );
  
            try {
              if (isCompleteAction) {
                await completeTransaction(
                  transactionId,
                  pageCurrentUser.id,
                );
  
                showTransactionsMessage(
                  "تم إتمام الخدمة وتحديث أرصدة الشركتين بنجاح.",
                  "success",
                );
  
              } else {
                await updateTransactionStatus(
                  transactionId,
                  selectedAction,
                );
  
                showTransactionsMessage(
                  isAcceptAction
                    ? "تم قبول الطلب بنجاح."
                    : "تم رفض الطلب.",
                  "success",
                );
              }
  
              await loadTransactions();
  
            } catch (error) {
              console.error(
                "تعذر تحديث المعاملة:",
                error,
              );
  
              const errorMessage =
                getTransactionErrorMessage(
                  error,
                );
  
              showTransactionsMessage(
                errorMessage,
                "error",
              );
  
              setTransactionButtonsLoading(
                transactionId,
                false,
              );
            }
          },
        );
      },
    );
  }


  function getTransactionErrorMessage(
    error,
  ) {
    const errorCode =
      error?.message;
  
    const messages = {
      "credit-limit-exceeded":
        "لا يمكن إتمام المعاملة؛ لأنها تتجاوز الحد الائتماني للشركة المشترية.",
  
      "transaction-not-found":
        "لم يتم العثور على المعاملة.",
  
      "transaction-not-accepted":
        "لا يمكن إتمام معاملة لم تتم الموافقة عليها.",
  
      "unauthorized-transaction-completion":
        "لا تملك صلاحية إتمام هذه المعاملة.",
  
      "company-not-found":
        "تعذر العثور على بيانات إحدى الشركتين.",
    };
  
    return (
      messages[errorCode]
      ?? "تعذر إتمام المعاملة. حاول مرة أخرى."
    );
  }
  
  
  function setTransactionButtonsLoading(
    transactionId,
    isLoading,
  ) {
    const relatedButtons =
      document.querySelectorAll(
        `[data-transaction-id="${transactionId}"]`,
      );
  
    relatedButtons.forEach(
      (button) => {
        button.disabled =
          isLoading;
      },
    );
  }
  
  
  function attachFilterEvents() {
    const filterButtons =
      document.querySelectorAll(
        ".transaction-filter-button",
      );
  
    filterButtons.forEach(
      (button) => {
        button.addEventListener(
          "click",
          () => {
            filterButtons.forEach(
              (filterButton) => {
                filterButton.classList.remove(
                  "active",
                );
              },
            );
  
            button.classList.add(
              "active",
            );
  
            activeTransactionFilter =
              button.dataset
                .transactionFilter;
  
            renderActiveFilter();
          },
        );
      },
    );
  }
  
  
  function updateTransactionStatistics(
    transactions,
    currentCompanyId,
  ) {
    const outgoingCount =
      transactions.filter(
        (transaction) =>
          transaction.buyerCompanyId
            === currentCompanyId,
      ).length;
  
    const incomingCount =
      transactions.filter(
        (transaction) =>
          transaction.sellerCompanyId
            === currentCompanyId,
      ).length;
  
    const pendingCount =
      transactions.filter(
        (transaction) =>
          transaction.status
            === "pending",
      ).length;
  
    document
      .getElementById(
        "total-transactions-count",
      )
      .textContent =
        formatNumber(
          transactions.length,
        );
  
    document
      .getElementById(
        "outgoing-transactions-count",
      )
      .textContent =
        formatNumber(outgoingCount);
  
    document
      .getElementById(
        "incoming-transactions-count",
      )
      .textContent =
        formatNumber(incomingCount);
  
    document
      .getElementById(
        "pending-transactions-count",
      )
      .textContent =
        formatNumber(pendingCount);
  }
  
  
  function showTransactionsMessage(
    message,
    type,
  ) {
    const messageElement =
      document.getElementById(
        "transactions-message",
      );
  
    messageElement.textContent =
      message;
  
    messageElement.className =
      type === "error"
        ? "form-error-message"
        : "form-success-message";
  
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  
    setTimeout(() => {
      messageElement.textContent =
        "";
  
      messageElement.className =
        "hidden";
    }, 4000);
  }
  
  
  function renderStatusBadge(
    status,
  ) {
    const statuses = {
      pending: {
        label:
          "بانتظار الموافقة",
  
        className:
          "pending",
      },
  
      accepted: {
        label:
          "تمت الموافقة",
  
        className:
          "accepted",
      },
  
      completed: {
        label:
          "مكتملة",
  
        className:
          "completed",
      },
  
      rejected: {
        label:
          "مرفوضة",
  
        className:
          "rejected",
      },
    };
  
    const statusInformation =
      statuses[status]
      ?? statuses.pending;
  
    return `
      <span
        class="
          transaction-status
          transaction-status--${statusInformation.className}
        "
      >
        ${statusInformation.label}
      </span>
    `;
  }
  
  
  function renderLoadingState() {
    return `
      <div class="transactions-state">
        <span class="transactions-state-icon">
          ◌
        </span>
  
        <h3>
          جاري تحميل المعاملات...
        </h3>
      </div>
    `;
  }
  
  
  function renderEmptyState() {
    return `
      <div class="transactions-state">
        <span class="transactions-state-icon">
          ⇄
        </span>
  
        <h3>
          لا توجد معاملات في هذا التصنيف
        </h3>
  
        <p>
          عند طلب خدمة أو استقبال طلب،
          ستظهر المعاملة هنا.
        </p>
      </div>
    `;
  }
  
  
  function renderErrorState() {
    return `
      <div
        class="
          transactions-state
          transactions-state--error
        "
      >
        <span class="transactions-state-icon">
          !
        </span>
  
        <h3>
          تعذر تحميل المعاملات
        </h3>
  
        <p>
          حدث خطأ أثناء الاتصال
          بقاعدة البيانات.
        </p>
      </div>
    `;
  }