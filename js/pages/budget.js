const BudgetPage = (() => {
    function render(context) {
        const { data, pageHeader, monthly, percentage } = context;
        const monthlySpending = monthly().reduce((total, transaction) => {
            return total + Number(transaction.amount);
        }, 0);
        const percentageUsed = percentage(monthlySpending, data.budget?.amount);
        const buttonLabel = data.budget ? "Update budget" : "Set budget";

        if (!data.budget) {
            return `
                ${pageHeader(
                    "Budget",
                    "Plan your monthly spending and stay on track.",
                    `<button class="button primary" data-action="edit-budget">
                        ${buttonLabel}
                    </button>`,
                )}
                <section class="card">
                    ${UI.empty(
                        "No monthly budget yet",
                        "Set a monthly budget to start monitoring your spending.",
                        "edit-budget",
                        "Set budget",
                    )}
                </section>
            `;
        }

        const remaining = Math.max(data.budget.amount - monthlySpending, 0);
        const progressState =
            percentageUsed >= 90 ? "danger" : percentageUsed >= 70 ? "warning" : "";

        return `
            ${pageHeader(
                "Budget",
                "Plan your monthly spending and stay on track.",
                `<button class="button primary" data-action="edit-budget">
                    ${buttonLabel}
                </button>`,
            )}

            <section class="stats-grid budget-summary stagger-group">
                <article class="stat-card featured">
                    <span>Monthly budget</span>
                    <strong>${UI.money(data.budget.amount)}</strong>
                </article>
                <article class="stat-card">
                    <span>Spent this month</span>
                    <strong>${UI.money(monthlySpending)}</strong>
                </article>
                <article class="stat-card">
                    <span>Remaining</span>
                    <strong>${UI.money(remaining)}</strong>
                </article>
                <article class="stat-card">
                    <span>Budget used</span>
                    <strong>${percentageUsed}%</strong>
                </article>
            </section>

            <section class="card">
                <div class="card-head"><h2>Monthly progress</h2></div>
                ${UI.progress(percentageUsed, progressState)}
                <p class="form-hint">
                    Your budget covers
                    ${new Date().toLocaleDateString("en-NG", {
                        month: "long",
                        year: "numeric",
                    })}.
                </p>
            </section>
        `;
    }

    return { render };
})();
