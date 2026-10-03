const DashboardPage = (() => {
    function renderInsights(context) {
        const { data, totals, monthly, categoryTotals } = context;

        if (data.transactions.length < 3) {
            return UI.empty(
                "Insights are waiting",
                "Add a few transactions to unlock spending insights.",
            );
        }

        const transactionTotals = totals();
        const topCategory = Object.entries(categoryTotals(monthly())).sort(
            (first, second) => second[1] - first[1],
        )[0];
        const insights = [];

        if (topCategory) {
            insights.push(
                `${topCategory[0]} is your largest spending category this month.`,
            );
        }

        insights.push(
            transactionTotals.expense > transactionTotals.income
                ? "Your recorded expenses are higher than your income."
                : "Your income is covering your recorded expenses.",
        );

        if (data.budget) {
            const monthlySpending = monthly().reduce((total, transaction) => {
                return total + Number(transaction.amount);
            }, 0);

            insights.push(
                monthlySpending <= data.budget.amount
                    ? "You are currently within your monthly budget."
                    : "You have exceeded your monthly budget.",
            );
        }

        return insights
            .map((insight) => {
                return `
                    <div class="insight">
                        <span>◉</span>
                        <p>${insight}</p>
                    </div>
                `;
            })
            .join("");
    }

    function render(context) {
        const { data, profile, pageHeader, totals, monthly, percentage } = context;
        const transactionTotals = totals();
        const totalSavings = data.goals.reduce((total, goal) => {
            return total + Number(goal.current_amount);
        }, 0);
        const monthlyExpenses = monthly();
        const monthlySpending = monthlyExpenses.reduce((total, transaction) => {
            return total + Number(transaction.amount);
        }, 0);
        const budgetUsed = percentage(monthlySpending, data.budget?.amount);
        const firstName = profile?.full_name?.split(" ")[0] || "";
        const currentHour = new Date().getHours();
        const greeting =
            currentHour < 12
                ? "Good morning"
                : currentHour < 17
                  ? "Good afternoon"
                  : "Good evening";
        const greetingName = firstName ? `, ${UI.escape(firstName)}` : "";

        const headerActions = `
            <button class="button secondary" data-action="add-income">
                + Add income
            </button>
            <button class="button primary" data-action="add-expense">
                + Add expense
            </button>
        `;

        const spendingContent = monthlyExpenses.length
            ? `
                <div class="chart-wrap">
                    <canvas id="spending-chart"></canvas>
                </div>
            `
            : UI.empty(
                  "No spending this month",
                  "Expenses you add will appear here.",
                  "add-expense",
                  "Add expense",
              );

        const budgetContent = data.budget
            ? `
                <strong class="big-number">${UI.money(monthlySpending)}</strong>
                <p>spent of ${UI.money(data.budget.amount)}</p>
                ${UI.progress(
                    budgetUsed,
                    budgetUsed >= 90 ? "danger" : budgetUsed >= 70 ? "warning" : "",
                )}
                <div class="split">
                    <span>${budgetUsed}% used</span>
                    <strong>
                        ${UI.money(Math.max(data.budget.amount - monthlySpending, 0))}
                        left
                    </strong>
                </div>
            `
            : UI.empty(
                  "No monthly budget yet",
                  "Set a budget to start monitoring your spending.",
                  "edit-budget",
                  "Set budget",
              );

        const recentTransactions = data.transactions.length
            ? data.transactions
                  .slice(0, 5)
                  .map((transaction) => {
                      return UI.row(transaction);
                  })
                  .join("")
            : UI.empty(
                  "No transactions yet",
                  "Start tracking your money by adding your first transaction.",
                  "add-expense",
                  "Add transaction",
              );

        return `
            ${pageHeader(
                `${greeting}${greetingName} <span aria-hidden="true">👋</span>`,
                "Here's your financial overview.",
                headerActions,
            )}

            <section class="stats-grid stagger-group">
                <article class="stat-card featured">
                    <span>Current balance</span>
                    <strong data-animate-number="${transactionTotals.income - transactionTotals.expense}">
                        ${UI.money(transactionTotals.income - transactionTotals.expense)}
                    </strong>
                    <small>Income minus expenses</small>
                </article>
                <article class="stat-card">
                    <span>Total income</span>
                    <strong>${UI.money(transactionTotals.income)}</strong>
                    <small>Money received</small>
                </article>
                <article class="stat-card">
                    <span>Total expenses</span>
                    <strong>${UI.money(transactionTotals.expense)}</strong>
                    <small>Money spent</small>
                </article>
                <article class="stat-card">
                    <span>Total savings</span>
                    <strong>${UI.money(totalSavings)}</strong>
                    <small>Across ${data.goals.length} goals</small>
                </article>
            </section>

            <section class="quick-actions mobile-only">
                <button data-action="add-income">↙ Income</button>
                <button data-action="add-expense">↗ Expense</button>
                <button data-action="add-goal">◇ Goal</button>
            </section>

            <section class="dashboard-grid stagger-group">
                <article class="card chart-card">
                    <div class="card-head">
                        <div>
                            <p class="eyebrow">This month</p>
                            <h2>Spending overview</h2>
                        </div>
                    </div>
                    ${spendingContent}
                </article>

                <article class="card budget-card">
                    <div class="card-head">
                        <div>
                            <p class="eyebrow">Monthly plan</p>
                            <h2>Budget</h2>
                        </div>
                        <button class="text-button" data-route="budget">Manage</button>
                    </div>
                    ${budgetContent}
                </article>

                <article class="card recent-card">
                    <div class="card-head">
                        <div>
                            <p class="eyebrow">Latest activity</p>
                            <h2>Recent transactions</h2>
                        </div>
                        <button class="text-button" data-route="transactions">
                            View all
                        </button>
                    </div>
                    ${recentTransactions}
                </article>

                <article class="card insight-card">
                    <div class="card-head">
                        <div>
                            <p class="eyebrow">Simple, useful patterns</p>
                            <h2>PocketWise Insights</h2>
                        </div>
                    </div>
                    ${renderInsights(context)}
                </article>
            </section>
        `;
    }

    return { render, renderInsights };
})();
