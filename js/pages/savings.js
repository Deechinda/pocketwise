const SavingsPage = (() => {
    function renderGoal(goal, percentage) {
        const progress = percentage(goal.current_amount, goal.target_amount);
        const isComplete = progress >= 100;
        const remaining = goal.target_amount - goal.current_amount;

        return `
            <article class="card goal-card ${isComplete ? "complete" : ""}">
                <div class="goal-top">
                    <span class="goal-icon">${isComplete ? "✓" : "◇"}</span>
                    <div class="row-actions">
                        <button
                            class="icon-button"
                            data-action="edit-goal"
                            data-id="${goal.id}"
                            aria-label="Edit ${UI.escape(goal.name)}"
                        >
                            ✎
                        </button>
                        <button
                            class="icon-button danger-icon"
                            data-action="delete-goal"
                            data-id="${goal.id}"
                            aria-label="Delete ${UI.escape(goal.name)}"
                        >
                            ×
                        </button>
                    </div>
                </div>
                <h2>${UI.escape(goal.name)}</h2>
                <p>${UI.escape(goal.description || "A PocketWise savings goal")}</p>
                <strong class="big-number">${UI.money(goal.current_amount)}</strong>
                <span>of ${UI.money(goal.target_amount)} saved</span>
                ${UI.progress(progress)}
                <div class="split">
                    <strong>${Math.min(progress, 100)}% complete</strong>
                    <span>
                        ${isComplete ? "Goal achieved" : `${UI.money(remaining)} left`}
                    </span>
                </div>
                <div class="goal-footer">
                    <span>Target · ${UI.date(goal.target_date)}</span>
                    <button
                        class="button small primary"
                        data-action="add-saving"
                        data-id="${goal.id}"
                        ${isComplete ? "disabled" : ""}
                    >
                        ${isComplete ? "Completed" : "+ Add money"}
                    </button>
                </div>
            </article>
        `;
    }

    function render(context) {
        const { data, pageHeader, percentage } = context;
        const goals = data.goals.length
            ? data.goals.map((goal) => renderGoal(goal, percentage)).join("")
            : UI.empty(
                  "No savings goals yet",
                  "Create your first goal and start tracking your progress.",
                  "add-goal",
                  "Create goal",
              );

        return `
            ${pageHeader(
                "Savings goals",
                "Turn your plans into steady progress.",
                `<button class="button primary" data-action="add-goal">
                    + Create goal
                </button>`,
            )}
            <section class="goals-grid stagger-group">${goals}</section>
        `;
    }

    return { render };
})();
