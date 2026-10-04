const DashboardPage = (() => {
    function compactEmpty(title, description, action, label) {
        return `
            <div class="home-inline-empty">
                <span>◇</span>
                <div><strong>${title}</strong><small>${description}</small></div>
                ${action ? `<button class="text-button" data-action="${action}">${label} →</button>` : ""}
            </div>
        `;
    }

    function render(context) {
        const data = context.data;
        const profile = context.profile;
        const totals = context.totals();
        const balance = totals.income - totals.expense;
        const plan =
            data.plans.find((item) => item.status === "active") || data.plans[0];
        const allocations = plan
            ? data.allocations.filter((item) => item.plan_id === plan.id)
            : [];
        const totalAllocated = allocations.reduce(
            (sum, item) => sum + Number(item.planned_amount),
            0,
        );
        const recent = data.transactions.slice(0, 5);
        const allOpenTasks = data.tasks.filter((item) => item.status === "open");
        const tasks = allOpenTasks.slice(0, 4);
        const goals = data.goals.slice(0, 3);
        const firstName = profile?.full_name?.split(" ")[0] || "there";
        const daysLeft = plan
            ? Math.max(
                  0,
                  Math.ceil(
                      (new Date(plan.end_date) - new Date()) / 86400000,
                  ),
              )
            : 0;
        const spentInPlan = plan
            ? data.transactions
                  .filter(
                      (item) =>
                          item.type === "expense" &&
                          item.date >= plan.start_date &&
                          item.date <= plan.end_date,
                  )
                  .reduce((sum, item) => sum + Number(item.amount), 0)
            : totals.expense;
        const room = plan
            ? Math.max(0, Number(plan.total_amount) - spentInPlan)
            : Math.max(0, balance);
        const daily = room / Math.max(1, daysLeft);
        const spentPercent = plan
            ? Math.min(
                  100,
                  Number(plan.total_amount)
                      ? (spentInPlan / Number(plan.total_amount)) * 100
                      : 0,
              )
            : totals.income
              ? Math.min(100, (totals.expense / totals.income) * 100)
              : 0;

        const planSummary = plan
            ? `
                <div class="command-plan-number">
                    <strong>${UI.money(room)}</strong>
                    <span>left to work with</span>
                </div>
                <div class="command-plan-track"><i style="width:${spentPercent}%"></i></div>
                <div class="command-plan-meta">
                    <span>${Math.round(spentPercent)}% used</span>
                    <span>${daysLeft} days left</span>
                </div>
            `
            : compactEmpty(
                  "Give your money a plan",
                  "Decide what your available money should do next.",
                  "create-plan",
                  "Create plan",
              );

        const allocationRows = allocations.length
            ? allocations
                  .map((item) => {
                      const share = totalAllocated
                          ? (Number(item.planned_amount) / totalAllocated) * 100
                          : 0;
                      return `
                        <div class="allocation-row">
                            <span class="mini-icon">${item.protected ? "◆" : "◈"}</span>
                            <div>
                                <strong>
                                    ${UI.escape(item.name)}
                                    ${item.protected ? '<small class="protected-label">Protected</small>' : ""}
                                </strong>
                                <div class="mini-progress"><i style="width:${share}%"></i></div>
                            </div>
                            <b>${UI.money(item.planned_amount)}</b>
                        </div>
                    `;
                  })
                  .join("")
            : compactEmpty(
                  "No allocations yet",
                  "Create a plan to assign your money.",
                  "create-plan",
                  "Start",
              );

        const goalRows = goals.length
            ? goals
                  .map((goal) => {
                      const progress = context.percentage(
                          goal.current_amount,
                          goal.target_amount,
                      );
                      return `
                        <div class="goal-mini">
                            <div>
                                <span class="goal-badge">◇</span>
                                <strong>${UI.escape(goal.name)}</strong>
                                <b>${progress}%</b>
                            </div>
                            <div class="mini-progress"><i style="width:${progress}%"></i></div>
                            <small>${UI.money(goal.current_amount)} of ${UI.money(goal.target_amount)}</small>
                        </div>
                    `;
                  })
                  .join("")
            : compactEmpty(
                  "No goals yet",
                  "Create something worth building toward.",
                  "add-goal",
                  "Create goal",
              );

        const taskRows = tasks.length
            ? tasks
                  .map(
                      (task) => `
                        <button
                            class="task-preview"
                            data-action="toggle-task"
                            data-id="${task.id}"
                            data-status="done"
                        >
                            <span>○</span>
                            <div>
                                <strong>${UI.escape(task.title)}</strong>
                                <small>${task.due_date ? UI.date(task.due_date) : "No due date"}</small>
                            </div>
                            <b>${task.amount ? UI.money(task.amount) : ""}</b>
                        </button>
                    `,
                  )
                  .join("")
            : compactEmpty(
                  "Nothing waiting",
                  "Add a purchase, bill, fee or reminder.",
                  "new-task",
                  "Add task",
              );

        return `
            <header class="command-head">
                <div>
                    <p class="eyebrow">PERSONAL MONEY WORKSPACE</p>
                    <h1>Good morning, ${UI.escape(firstName)}.</h1>
                    <p>Here’s what your money looks like right now.</p>
                </div>
                <div class="command-actions">
                    <button class="button secondary" data-action="add-spending">− Spending</button>
                    <button class="button primary" data-action="add-money">+ Money in</button>
                </div>
            </header>

            <section class="home-overview" aria-label="Financial overview">
                <article class="command-balance">
                    <div class="command-balance-top">
                        <span>AVAILABLE BALANCE</span>
                        <span class="balance-status"><i class="status-dot"></i> Updated</span>
                    </div>
                    <strong>${UI.money(balance)}</strong>
                    <div class="command-balance-bottom">
                        <span>${UI.money(totals.income)} received</span>
                        <span>${UI.money(totals.expense)} spent</span>
                    </div>
                </article>
                <article class="command-plan">
                    <div class="command-plan-head">
                        <div>
                            <span>ACTIVE PLAN</span>
                            <strong>${plan ? UI.escape(plan.name) : "No active plan"}</strong>
                        </div>
                        <button class="text-button" data-route="plan">
                            ${plan ? "Open plan" : "Create plan"} →
                        </button>
                    </div>
                    ${planSummary}
                </article>
                <div class="home-metric-strip">
                    <div>
                        <span>Spending room today</span>
                        <strong>${UI.money(daily)}</strong>
                        <small>${plan ? `${daysLeft} days remain` : "Set a plan to calculate"}</small>
                    </div>
                    <div>
                        <span>Money in</span>
                        <strong class="positive">${UI.money(totals.income)}</strong>
                        <small>Total received</small>
                    </div>
                    <div>
                        <span>Goals in progress</span>
                        <strong>${goals.length}</strong>
                        <small>${goals.length ? "Keep building" : "Create your first goal"}</small>
                    </div>
                    <div>
                        <span>Things to handle</span>
                        <strong>${allOpenTasks.length}</strong>
                        <small>Purchases, bills and more</small>
                    </div>
                </div>
            </section>

            <section class="home-report-grid">
                <article class="home-ledger">
                    <section class="cashflow-section">
                        <div class="report-heading">
                            <div>
                                <p class="eyebrow">30-DAY VIEW</p>
                                <h2>Cash-flow trend</h2>
                            </div>
                            <div class="cashflow-legend" aria-label="Chart legend">
                                <span><i class="income"></i> Money in</span>
                                <span><i class="expense"></i> Spending</span>
                            </div>
                        </div>
                        ${
                            data.transactions.length
                                ? '<div class="home-chart-wrap"><canvas id="home-cashflow-chart" aria-label="Income and spending over the last 30 days"></canvas></div>'
                                : compactEmpty(
                                      "Your trend starts here",
                                      "Add money or spending to build a cash-flow view.",
                                      "add-money",
                                      "Add money",
                                  )
                        }
                    </section>

                    <section class="activity-section">
                        <div class="report-heading">
                            <div>
                                <p class="eyebrow">ACTIVITY</p>
                                <h2>Recent money movement</h2>
                            </div>
                            <button class="text-button" data-route="money">See all →</button>
                        </div>
                        <div class="transaction-list">
                            ${
                                recent.length
                                    ? recent.map((item) => UI.row(item)).join("")
                                    : compactEmpty(
                                          "No activity yet",
                                          "Your latest money movements will appear here.",
                                          "add-spending",
                                          "Add spending",
                                      )
                            }
                        </div>
                    </section>
                </article>

                <aside class="home-priorities" aria-label="Plans, goals and tasks">
                    <section class="priority-section allocation-panel">
                        <div class="report-heading">
                            <div><p class="eyebrow">MONEY PLAN</p><h2>Give your money a job</h2></div>
                            <button class="text-button" data-route="plan">Manage →</button>
                        </div>
                        ${allocationRows}
                    </section>
                    <section class="priority-section">
                        <div class="report-heading">
                            <div><p class="eyebrow">GOALS</p><h2>What you’re building</h2></div>
                            <button class="text-button" data-route="goals">View →</button>
                        </div>
                        ${goalRows}
                    </section>
                    <section class="priority-section">
                        <div class="report-heading">
                            <div><p class="eyebrow">NEXT UP</p><h2>Money tasks</h2></div>
                            <button class="text-button" data-route="tasks">Open →</button>
                        </div>
                        ${taskRows}
                    </section>
                </aside>
            </section>

            <section class="insight-strip">
                <span>✦</span>
                <div>
                    <strong>Make the next money decision clearer.</strong>
                    <p>Use your plan, goals, lists and tools together instead of keeping everything in your head.</p>
                </div>
                <button class="text-button" data-route="tools">Open tools →</button>
            </section>
        `;
    }

    function createCharts(context, charts) {
        const canvas = document.querySelector("#home-cashflow-chart");
        if (!canvas || typeof Chart === "undefined") return;

        const end = new Date();
        end.setHours(12, 0, 0, 0);
        const start = new Date(end);
        start.setDate(end.getDate() - 29);
        const days = Array.from({ length: 30 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            return date;
        });
        const keys = days.map((date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        });
        const income = Object.fromEntries(keys.map((key) => [key, 0]));
        const expenses = Object.fromEntries(keys.map((key) => [key, 0]));

        context.data.transactions.forEach((transaction) => {
            const bucket = transaction.type === "income" ? income : expenses;
            if (Object.hasOwn(bucket, transaction.date)) {
                bucket[transaction.date] += Number(transaction.amount);
            }
        });

        const styles = getComputedStyle(document.documentElement);
        const textColor = styles.getPropertyValue("--text-muted").trim() || "#68766f";
        const borderColor = styles.getPropertyValue("--border").trim() || "#dfe4dc";
        const incomeColor = styles.getPropertyValue("--success").trim() || "#13795b";
        const expenseColor = styles.getPropertyValue("--danger").trim() || "#c96a66";
        const money = new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        });

        charts.push(
            new Chart(canvas, {
                type: "line",
                data: {
                    labels: days.map((date) =>
                        date.toLocaleDateString("en-NG", {
                            day: "numeric",
                            month: "short",
                        }),
                    ),
                    datasets: [
                        {
                            label: "Money in",
                            data: keys.map((key) => income[key]),
                            borderColor: incomeColor,
                            backgroundColor: "rgba(19, 121, 91, 0.09)",
                            fill: true,
                            tension: 0.35,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            borderWidth: 2,
                        },
                        {
                            label: "Spending",
                            data: keys.map((key) => expenses[key]),
                            borderColor: expenseColor,
                            backgroundColor: "rgba(201, 106, 102, 0.055)",
                            fill: true,
                            tension: 0.35,
                            pointRadius: 0,
                            pointHoverRadius: 4,
                            borderWidth: 2,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: "index", intersect: false },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            displayColors: true,
                            callbacks: {
                                label(item) {
                                    return `${item.dataset.label}: ${money.format(item.parsed.y)}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            border: { display: false },
                            ticks: {
                                color: textColor,
                                maxTicksLimit: 6,
                                font: { size: 9 },
                            },
                        },
                        y: {
                            beginAtZero: true,
                            border: { display: false },
                            grid: { color: borderColor },
                            ticks: {
                                color: textColor,
                                maxTicksLimit: 5,
                                font: { size: 9 },
                                callback(value) {
                                    return value >= 1000
                                        ? `₦${Math.round(value / 1000)}k`
                                        : `₦${value}`;
                                },
                            },
                        },
                    },
                },
            }),
        );
    }

    return { render, createCharts };
})();
