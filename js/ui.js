/**
 * Reusable user-interface helpers.
 *
 * This module contains formatting functions and shared components such as
 * toasts, modals, empty states, progress bars, and transaction rows.
 */
const UI = (() => {
    let elementFocusedBeforeModal = null;

    const icons = {
        dashboard: "⌂",
        transactions: "↕",
        budget: "◉",
        savings: "◇",
        analytics: "▥",
        settings: "⚙",
        income: "↙",
        expense: "↗",
    };

    // ========================================
    // Formatting helpers
    // ========================================

    function formatCurrency(amount) {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(Number(amount) || 0);
    }

    function formatDate(dateString) {
        if (!dateString) {
            return "No date";
        }

        const date = new Date(`${dateString}T00:00:00`);

        return date.toLocaleDateString("en-NG", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    function escapeHtml(value) {
        const unsafeCharacters = /[&<>'"]/g;
        const safeCharacters = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;",
        };

        return String(value ?? "").replace(
            unsafeCharacters,
            (character) => safeCharacters[character],
        );
    }

    // ========================================
    // Toast messages
    // ========================================

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        const statusIcon = type === "error" ? "!" : "✓";

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <b>${statusIcon}</b>
            <span>${escapeHtml(message)}</span>
        `;

        document.querySelector("#toast-region").append(toast);

        window.setTimeout(() => {
            toast.remove();
        }, 3400);
    }

    // ========================================
    // Modal dialog
    // ========================================

    function showModal(title, content, eyebrow = "PocketWise") {
        elementFocusedBeforeModal = document.activeElement;

        document.querySelector("#modal-title").textContent = title;
        document.querySelector("#modal-eyebrow").textContent = eyebrow;
        document.querySelector("#modal-body").innerHTML = content;
        document.querySelector("#modal-backdrop").hidden = false;
        document.body.classList.add("modal-open");

        window.setTimeout(() => {
            document.querySelector("#modal-body input, #modal-body button")?.focus();
        });
    }

    function closeModal() {
        document.querySelector("#modal-backdrop").hidden = true;
        document.body.classList.remove("modal-open");
        elementFocusedBeforeModal?.focus();
    }

    // ========================================
    // Reusable view components
    // ========================================

    function renderEmptyState(title, message, action, actionLabel) {
        const actionButton = action
            ? `
                <button class="button primary" data-action="${action}">
                    ${actionLabel}
                </button>
            `
            : "";

        return `
            <div class="empty-state">
                <span>◇</span>
                <h3>${title}</h3>
                <p>${message}</p>
                ${actionButton}
            </div>
        `;
    }

    function renderProgressBar(value, state = "") {
        const safeValue = Math.min(100, Math.max(0, value));

        return `
            <div
                class="progress ${state}"
                role="progressbar"
                aria-valuenow="${Math.round(value)}"
            >
                <span style="width: ${safeValue}%"></span>
            </div>
        `;
    }

    function renderTransactionRow(transaction, showActions = false) {
        const sign = transaction.type === "income" ? "+" : "−";

        const actions = showActions
            ? `
                <div class="row-actions">
                    <button
                        class="icon-button"
                        data-action="edit-transaction"
                        data-id="${transaction.id}"
                        aria-label="Edit transaction"
                    >
                        ✎
                    </button>
                    <button
                        class="icon-button danger-icon"
                        data-action="delete-transaction"
                        data-id="${transaction.id}"
                        aria-label="Delete transaction"
                    >
                        ×
                    </button>
                </div>
            `
            : "";

        return `
            <article class="transaction-row">
                <span class="category-icon ${transaction.type}">
                    ${icons[transaction.type]}
                </span>
                <div class="transaction-info">
                    <strong>${escapeHtml(transaction.description)}</strong>
                    <span>
                        ${escapeHtml(transaction.category)} ·
                        ${formatDate(transaction.date)}
                    </span>
                </div>
                <strong class="amount ${transaction.type}">
                    ${sign}${formatCurrency(transaction.amount)}
                </strong>
                ${actions}
            </article>
        `;
    }

    // The short property names are retained as aliases so existing views keep
    // the same public UI API during this readability-only refactor.
    return {
        icons,
        money: formatCurrency,
        date: formatDate,
        escape: escapeHtml,
        toast: showToast,
        modal: showModal,
        close: closeModal,
        empty: renderEmptyState,
        progress: renderProgressBar,
        row: renderTransactionRow,
    };
})();
