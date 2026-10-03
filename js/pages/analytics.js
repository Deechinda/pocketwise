const AnalyticsPage = (() => {
    const chartColors = [
        "#1b9b68",
        "#e7a23b",
        "#5479d8",
        "#8857c8",
        "#df6262",
        "#3aa3a0",
    ];

    function render(context) {
        const { data, pageHeader } = context;

        if (data.transactions.length < 2) {
            return `
                ${pageHeader(
                    "Analytics",
                    "Simple insights from your financial activity.",
                )}
                <section class="card">
                    ${UI.empty(
                        "Not enough data yet",
                        "Add transactions to see your spending patterns.",
                        "add-expense",
                        "Add transaction",
                    )}
                </section>
            `;
        }

        return `
            ${pageHeader(
                "Analytics",
                "Simple insights from your real financial activity.",
            )}
            <section class="analytics-grid stagger-group">
                <article class="card">
                    <div class="card-head"><h2>Income vs expenses</h2></div>
                    <div class="chart-wrap">
                        <canvas id="income-expense-chart"></canvas>
                    </div>
                </article>
                <article class="card">
                    <div class="card-head"><h2>Spending by category</h2></div>
                    <div class="chart-wrap">
                        <canvas id="category-chart"></canvas>
                    </div>
                </article>
                <article class="card wide">
                    <div class="card-head"><h2>Monthly spending</h2></div>
                    <div class="chart-wrap line">
                        <canvas id="monthly-chart"></canvas>
                    </div>
                </article>
            </section>
            <section class="card analytics-insights">
                ${DashboardPage.renderInsights(context)}
            </section>
        `;
    }

    function createCharts(context, activeCharts) {
        if (typeof Chart === "undefined" || context.loading) {
            return;
        }

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 650,
                easing: "easeOutQuart",
            },
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        padding: 18,
                    },
                },
            },
        };

        function createChart(elementId, configuration) {
            const canvas = document.querySelector(`#${elementId}`);

            if (canvas) {
                activeCharts.push(new Chart(canvas, configuration));
            }
        }

        const categoryTotals = context.categoryTotals(context.data.transactions);
        const transactionTotals = context.totals();
        const currentMonthCategories = context.categoryTotals(context.monthly());

        createChart("spending-chart", {
            type: "doughnut",
            data: {
                labels: Object.keys(currentMonthCategories),
                datasets: [
                    {
                        data: Object.values(currentMonthCategories),
                        backgroundColor: chartColors,
                        borderWidth: 0,
                    },
                ],
            },
            options: { ...chartOptions, cutout: "70%" },
        });

        createChart("category-chart", {
            type: "doughnut",
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [
                    {
                        data: Object.values(categoryTotals),
                        backgroundColor: chartColors,
                        borderWidth: 0,
                    },
                ],
            },
            options: { ...chartOptions, cutout: "68%" },
        });

        createChart("income-expense-chart", {
            type: "bar",
            data: {
                labels: ["Income", "Expenses"],
                datasets: [
                    {
                        data: [transactionTotals.income, transactionTotals.expense],
                        backgroundColor: ["#1b9b68", "#df6262"],
                        borderRadius: 8,
                    },
                ],
            },
            options: {
                ...chartOptions,
                plugins: { legend: { display: false } },
            },
        });

        const months = [];

        for (let offset = 5; offset >= 0; offset -= 1) {
            const date = new Date();
            date.setMonth(date.getMonth() - offset);
            months.push({
                key: date.toISOString().slice(0, 7),
                label: date.toLocaleDateString("en", { month: "short" }),
            });
        }

        const monthlyTotals = months.map((month) => {
            return context.data.transactions
                .filter((transaction) => {
                    return (
                        transaction.type === "expense" &&
                        transaction.date.startsWith(month.key)
                    );
                })
                .reduce((total, transaction) => {
                    return total + Number(transaction.amount);
                }, 0);
        });

        createChart("monthly-chart", {
            type: "line",
            data: {
                labels: months.map((month) => month.label),
                datasets: [
                    {
                        data: monthlyTotals,
                        borderColor: "#1b9b68",
                        backgroundColor: "rgba(27, 155, 104, 0.1)",
                        fill: true,
                        tension: 0.35,
                    },
                ],
            },
            options: {
                ...chartOptions,
                plugins: { legend: { display: false } },
            },
        });
    }

    return { render, createCharts };
})();
