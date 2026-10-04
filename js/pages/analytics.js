const AnalyticsPage = (() => {
    function render(context) {
        const data = context.data;
        const totals = context.totals();
        const categories = context.categoryTotals(data.transactions);
        const top = Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
        const insights = [];

        if (top[0]) {
            insights.push(
                `${top[0][0]} is currently your largest spending category at ${UI.money(top[0][1])}.`,
            );
        }
        if (totals.income) {
            insights.push(
                `You have recorded ${Math.round((totals.expense / totals.income) * 100)}% of your money-in as spending.`,
            );
        }
        if (data.goals.length) {
            const completed = data.goals.filter(
                (goal) => Number(goal.current_amount) >= Number(goal.target_amount),
            ).length;
            insights.push(
                `${completed} of ${data.goals.length} goals have reached their target.`,
            );
        }

        return `${context.pageHeader("Insights", "Simple patterns from your real PocketWise activity.")}
            <section class="insight-metrics">
                <div><span>Total in</span><strong class="positive">${UI.money(totals.income)}</strong></div>
                <div><span>Total out</span><strong class="negative">${UI.money(totals.expense)}</strong></div>
                <div><span>Net</span><strong>${UI.money(totals.income - totals.expense)}</strong></div>
            </section>
            <section class="analytics-grid">
                <article class="surface-card chart-panel">
                    <div class="card-head"><h2>Money in vs out</h2></div>
                    <div class="chart-wrap"><canvas id="income-expense-chart"></canvas></div>
                </article>
                <article class="surface-card chart-panel">
                    <div class="card-head"><h2>Where money goes</h2></div>
                    <div class="chart-wrap"><canvas id="category-chart"></canvas></div>
                </article>
                <article class="surface-card wide">
                    <div class="card-head"><h2>Useful patterns</h2></div>
                    ${
                        insights.length
                            ? insights
                                  .map(
                                      (insight) =>
                                          `<div class="insight"><span>✦</span><p>${insight}</p></div>`,
                                  )
                                  .join("")
                            : UI.empty(
                                  "Insights are waiting",
                                  "Add a few money entries to see patterns.",
                              )
                    }
                </article>
            </section>`;
    }

    function createCharts(context, charts) {
        if (typeof Chart === "undefined") return;

        const totals = context.totals();
        const categories = context.categoryTotals(context.data.transactions);
        const styles = getComputedStyle(document.documentElement);
        const textColor = styles.getPropertyValue("--text-muted").trim() || "#718079";
        const borderColor = styles.getPropertyValue("--border").trim() || "#e2e9e5";
        const incomeColor = styles.getPropertyValue("--success").trim() || "#15805c";
        const expenseColor = styles.getPropertyValue("--danger").trim() || "#d96a6a";
        const base = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: textColor,
                        usePointStyle: true,
                        padding: 14,
                    },
                },
            },
            scales: {
                x: {
                    grid: { display: false },
                    border: { display: false },
                    ticks: { color: textColor },
                },
                y: {
                    beginAtZero: true,
                    border: { display: false },
                    grid: { color: borderColor },
                    ticks: { color: textColor },
                },
            },
        };
        const incomeExpenseCanvas = document.querySelector(
            "#income-expense-chart",
        );
        const categoryCanvas = document.querySelector("#category-chart");

        if (incomeExpenseCanvas) {
            charts.push(
                new Chart(incomeExpenseCanvas, {
                    type: "bar",
                    data: {
                        labels: ["Money in", "Money out"],
                        datasets: [
                            {
                                data: [totals.income, totals.expense],
                                backgroundColor: [incomeColor, expenseColor],
                                borderRadius: 9,
                            },
                        ],
                    },
                    options: {
                        ...base,
                        plugins: { legend: { display: false } },
                    },
                }),
            );
        }

        if (categoryCanvas) {
            charts.push(
                new Chart(categoryCanvas, {
                    type: "doughnut",
                    data: {
                        labels: Object.keys(categories),
                        datasets: [
                            {
                                data: Object.values(categories),
                                backgroundColor: [
                                    incomeColor,
                                    "#8ecdb3",
                                    "#f0b866",
                                    "#6f8bd9",
                                    "#c27bdc",
                                    expenseColor,
                                ],
                                borderWidth: 0,
                            },
                        ],
                    },
                    options: {
                        ...base,
                        cutout: "68%",
                        scales: undefined,
                    },
                }),
            );
        }
    }

    return { render, createCharts };
})();
