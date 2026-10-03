/**
 * PocketWise application coordinator.
 *
 * Page markup lives in js/pages and shared public/navigation markup lives in
 * js/components. This file owns application state, routing, global events,
 * form submissions, and Supabase session startup.
 */
const App = (() => {
    const expenseCategories = [
        "Food",
        "Transport",
        "Education",
        "Data & Airtime",
        "Entertainment",
        "Shopping",
        "Health",
        "Other",
    ];
    const incomeCategories = ["Allowance", "Salary", "Business", "Gift", "Other"];
    const routes = [
        ["dashboard", "Dashboard"],
        ["transactions", "Transactions"],
        ["budget", "Budget"],
        ["savings", "Savings"],
        ["analytics", "Analytics"],
        ["settings", "Settings"],
    ];
    const pageModules = {
        dashboard: DashboardPage,
        transactions: TransactionsPage,
        budget: BudgetPage,
        savings: SavingsPage,
        analytics: AnalyticsPage,
        settings: SettingsPage,
    };

    let session = null;
    let profile = null;
    let workspace = { transactions: [], budget: null, goals: [] };
    let activeRoute = "dashboard";
    let activeCharts = [];
    let loading = false;
    let filters = { query: "", type: "all", month: "" };

    function select(selector) {
        return document.querySelector(selector);
    }

    function currentMonth() {
        return new Date().toISOString().slice(0, 7);
    }

    function transactionTotals() {
        return workspace.transactions.reduce(
            (totals, transaction) => {
                totals[transaction.type] += Number(transaction.amount);
                return totals;
            },
            { income: 0, expense: 0 },
        );
    }

    function monthlyExpenses() {
        return workspace.transactions.filter((transaction) => {
            return (
                transaction.type === "expense" &&
                transaction.date.startsWith(currentMonth())
            );
        });
    }

    function percentage(value, total) {
        return total ? Math.round((value / total) * 100) : 0;
    }

    function categoryTotals(transactions) {
        return transactions.reduce((totals, transaction) => {
            if (transaction.type === "expense") {
                totals[transaction.category] =
                    (totals[transaction.category] || 0) + Number(transaction.amount);
            }
            return totals;
        }, {});
    }

    function field(name, label, type = "text", placeholder = "", extra = "") {
        return `
            <label class="field">
                <span>${label}</span>
                <input
                    name="${name}"
                    type="${type}"
                    placeholder="${placeholder}"
                    ${extra}
                >
            </label>
        `;
    }

    function pageHeader(title, subtitle, actions = "") {
        return `
            <header class="page-head">
                <div>
                    <p class="eyebrow">PocketWise</p>
                    <h1>${title}</h1>
                    <p>${subtitle}</p>
                </div>
                <div class="page-actions">${actions}</div>
            </header>
        `;
    }

    function pageContext() {
        return {
            data: workspace,
            session,
            profile,
            filters,
            loading,
            pageHeader,
            field,
            totals: transactionTotals,
            monthly: monthlyExpenses,
            percentage,
            categoryTotals,
        };
    }

    function applyTheme(theme = localStorage.getItem("pocketwise_theme") || "light") {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("pocketwise_theme", theme);

        document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
            icon.textContent = theme === "dark" ? "☀" : "☾";
        });
        document.querySelectorAll("[data-theme-label]").forEach((label) => {
            label.textContent = theme === "dark" ? "Light mode" : "Dark mode";
        });
    }

    function renderPublic() {
        const publicRoute = location.hash.slice(1);
        const authenticationRoutes = ["login", "signup", "forgot", "reset-password"];

        select("#private-root").hidden = true;
        select("#public-root").hidden = false;
        select("#public-root").innerHTML = authenticationRoutes.includes(publicRoute)
            ? PublicViews.authentication(publicRoute)
            : PublicViews.landing();

        observeReveals();
        updateLandingNavigation();
        HeroMotion.start();
    }

    function loadingSkeleton() {
        return `
            <div class="skeleton-head"></div>
            <div class="stats-grid">
                ${'<div class="skeleton-card"></div>'.repeat(4)}
            </div>
            <div class="skeleton-panel"></div>
        `;
    }

    function userInitials() {
        return (profile?.full_name || session?.user?.email || "PW")
            .split(/[ @]/)
            .filter(Boolean)
            .slice(0, 2)
            .map((namePart) => namePart[0])
            .join("")
            .toUpperCase();
    }

    function renderPrivate() {
        if (!session) {
            renderPublic();
            return;
        }

        const requestedRoute = location.hash.slice(1);
        activeRoute = routes.some(([routeId]) => routeId === requestedRoute)
            ? requestedRoute
            : "dashboard";

        select("#public-root").hidden = true;
        select("#private-root").hidden = false;
        select(".avatar").textContent = userInitials();
        select("#today-label").textContent = new Date().toLocaleDateString("en-NG", {
            weekday: "short",
            day: "numeric",
            month: "short",
        });

        Navigation.render(routes, activeRoute);
        activeCharts.forEach((chart) => chart.destroy());
        activeCharts = [];

        select("#view").innerHTML = loading
            ? loadingSkeleton()
            : pageModules[activeRoute].render(pageContext());

        window.requestAnimationFrame(() => {
            AnalyticsPage.createCharts(pageContext(), activeCharts);
            revealApplicationCards();
        });
    }

    function observeReveals() {
        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
            document.querySelectorAll(".reveal").forEach((element) => {
                element.classList.add("visible");
            });
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 },
        );

        document.querySelectorAll(".reveal").forEach((element) => {
            observer.observe(element);
        });
    }

    function revealApplicationCards() {
        select("#view")?.classList.remove("view-ready");
        window.requestAnimationFrame(() => {
            select("#view")?.classList.add("view-ready");
        });
    }

    function updateLandingNavigation() {
        const landingNavigation = select(".landing-nav");
        if (!landingNavigation) return;

        landingNavigation
            .closest(".landing-header")
            ?.classList.toggle("scrolled", window.scrollY > 18);
    }

    function openTransactionModal(type = "expense", transaction = null) {
        const transactionType = transaction?.type || type;
        const categories =
            transactionType === "income" ? incomeCategories : expenseCategories;
        const categoryOptions = categories
            .map((category) => {
                return `
                <option ${transaction?.category === category ? "selected" : ""}>
                    ${category}
                </option>
            `;
            })
            .join("");

        UI.modal(
            transaction ? "Edit transaction" : `Add ${transactionType}`,
            `
                <form id="transaction-form" data-id="${transaction?.id || ""}">
                    <input type="hidden" name="type" value="${transactionType}">
                    <div class="form-grid">
                        ${field("amount", "Amount (₦)", "number", "0", `value="${transaction?.amount || ""}" min="1" required`)}
                        ${field("date", "Date", "date", "", `value="${transaction?.date || new Date().toISOString().slice(0, 10)}" required`)}
                        ${field("description", "Description", "text", "e.g. Lunch", `value="${UI.escape(transaction?.description || "")}" required maxlength="80"`)}
                        <label class="field">
                            <span>Category</span>
                            <select name="category" required>
                                <option value="">Select category</option>
                                ${categoryOptions}
                            </select>
                        </label>
                    </div>
                    <p class="form-error"></p>
                    <div class="modal-actions">
                        <button type="button" class="button ghost" data-action="close-modal">Cancel</button>
                        <button class="button primary">Save transaction</button>
                    </div>
                </form>
            `,
            "Transaction",
        );
    }

    function openBudgetModal() {
        UI.modal(
            workspace.budget ? "Update budget" : "Set monthly budget",
            `
                <form id="budget-form">
                    ${field("amount", "Monthly budget (₦)", "number", "e.g. 60000", `value="${workspace.budget?.amount || ""}" min="1" required`)}
                    <p class="form-error"></p>
                    <div class="modal-actions">
                        <button type="button" class="button ghost" data-action="close-modal">Cancel</button>
                        <button class="button primary">Save budget</button>
                    </div>
                </form>
            `,
            "Budget",
        );
    }

    function openGoalModal(goal = null) {
        UI.modal(
            goal ? "Edit savings goal" : "Create savings goal",
            `
                <form id="goal-form" data-id="${goal?.id || ""}">
                    <div class="form-grid">
                        ${field("name", "Goal name", "text", "e.g. New laptop", `value="${UI.escape(goal?.name || "")}" required`)}
                        ${field("target", "Target amount (₦)", "number", "0", `value="${goal?.target_amount || ""}" min="1" required`)}
                        ${field("current", "Current amount (₦)", "number", "0", `value="${goal?.current_amount || 0}" min="0" required`)}
                        ${field("date", "Target date", "date", "", `value="${goal?.target_date || ""}" required`)}
                        <label class="field full">
                            <span>Description (optional)</span>
                            <textarea name="description" maxlength="140">${UI.escape(goal?.description || "")}</textarea>
                        </label>
                    </div>
                    <p class="form-error"></p>
                    <div class="modal-actions">
                        <button type="button" class="button ghost" data-action="close-modal">Cancel</button>
                        <button class="button primary">Save goal</button>
                    </div>
                </form>
            `,
            "Savings",
        );
    }

    function openSavingModal(goal) {
        UI.modal(
            `Add money to ${goal.name}`,
            `
                <form id="saving-form" data-id="${goal.id}">
                    ${field("amount", "Amount (₦)", "number", "0", `min="1" max="${goal.target_amount - goal.current_amount}" required`)}
                    <p class="form-error"></p>
                    <div class="modal-actions">
                        <button type="button" class="button ghost" data-action="close-modal">Cancel</button>
                        <button class="button primary">Add money</button>
                    </div>
                </form>
            `,
            "Savings",
        );
    }

    async function reloadWorkspace(message) {
        loading = true;
        renderPrivate();

        try {
            workspace = await Data.all();
            if (message) UI.toast(message);
        } catch (error) {
            console.error("Unable to reload workspace:", error);
            UI.toast("Could not connect to PocketWise. Please try again.", "error");
        } finally {
            loading = false;
            renderPrivate();
        }
    }

    function exportPersonalData() {
        const exportContent = JSON.stringify(
            {
                ...workspace,
                profile,
                exportedAt: new Date().toISOString(),
            },
            null,
            2,
        );
        const blob = new Blob([exportContent], { type: "application/json" });
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = downloadUrl;
        link.download = `pocketwise-data-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(downloadUrl);
        UI.toast("Your personal data export is ready.");
    }

    async function handleClick(event) {
        const target = event.target.closest("[data-action], [data-route]");
        if (!target) return;

        if (target.dataset.route) {
            location.hash = target.dataset.route;
            return;
        }

        const action = target.dataset.action;
        const recordId = target.dataset.id;

        if (action === "toggle-theme" || action === "set-theme") {
            const nextTheme =
                action === "set-theme"
                    ? target.dataset.value
                    : document.documentElement.dataset.theme === "dark"
                      ? "light"
                      : "dark";
            applyTheme(nextTheme);
            if (session) renderPrivate();
        }
        if (action === "mobile-menu") {
            const navigation = select(".landing-nav");
            navigation?.classList.toggle("open");
            target.setAttribute(
                "aria-expanded",
                String(navigation?.classList.contains("open")),
            );
        }
        if (action === "profile-menu")
            select("#profile-menu").hidden = !select("#profile-menu").hidden;
        if (action === "close-modal") UI.close();
        if (action === "add-income") openTransactionModal("income");
        if (action === "add-expense") openTransactionModal("expense");
        if (action === "edit-transaction") {
            openTransactionModal(
                "",
                workspace.transactions.find((item) => item.id === recordId),
            );
        }
        if (action === "delete-transaction" && confirm("Delete this transaction?")) {
            try {
                await Data.deleteTransaction(recordId);
                await reloadWorkspace("Transaction deleted.");
            } catch (error) {
                console.error("Unable to delete transaction:", error);
                UI.toast("Unable to delete your transaction.", "error");
            }
        }
        if (action === "edit-budget") openBudgetModal();
        if (action === "add-goal") openGoalModal();
        if (action === "edit-goal") {
            openGoalModal(workspace.goals.find((goal) => goal.id === recordId));
        }
        if (action === "delete-goal" && confirm("Delete this savings goal?")) {
            try {
                await Data.deleteGoal(recordId);
                await reloadWorkspace("Savings goal deleted.");
            } catch (error) {
                console.error("Unable to delete savings goal:", error);
                UI.toast("Unable to delete your savings goal.", "error");
            }
        }
        if (action === "add-saving") {
            openSavingModal(workspace.goals.find((goal) => goal.id === recordId));
        }
        if (action === "clear-filters") {
            filters = { query: "", type: "all", month: "" };
            renderPrivate();
        }
        if (action === "export-data") exportPersonalData();
        if (action === "sign-out") await signOut();
    }

    async function signOut() {
        try {
            await Auth.signOut();
            session = null;
            profile = null;
            workspace = { transactions: [], budget: null, goals: [] };
            location.hash = "home";
            renderPublic();
            UI.toast("Signed out.");
        } catch (error) {
            console.error("Unable to sign out:", error);
            UI.toast("Unable to sign out.", "error");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const errorMessage = form.querySelector(".form-error");
        const submitButton = form.querySelector(
            'button[type="submit"], button:not([type])',
        );
        const originalButtonText = submitButton?.textContent;

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.classList.add("loading");
            submitButton.textContent = "Please wait…";
        }

        try {
            await submitForm(form, formData);
        } catch (error) {
            console.error("Form submission failed:", error);
            const friendlyMessage = error.message?.includes("Invalid login")
                ? "Email or password is incorrect."
                : error.message || "Something went wrong. Please try again.";

            if (errorMessage) errorMessage.textContent = friendlyMessage;
            else UI.toast(friendlyMessage, "error");
        } finally {
            if (submitButton?.isConnected) {
                submitButton.disabled = false;
                submitButton.classList.remove("loading");
                submitButton.textContent = originalButtonText;
            }
        }
    }

    async function submitForm(form, formData) {
        if (form.id === "login-form") {
            const { data, error } = await Auth.signIn(
                formData.get("email").trim(),
                formData.get("password"),
            );
            if (error) throw error;
            session = data.session;
            await enterWorkspace();
        }

        if (form.id === "signup-form") {
            if (formData.get("password") !== formData.get("confirm")) {
                throw new Error("Passwords do not match.");
            }
            const { data, error } = await Auth.signUp({
                fullName: formData.get("fullName").trim(),
                email: formData.get("email").trim(),
                password: formData.get("password"),
            });
            if (error) throw error;
            if (data.session) {
                session = data.session;
                await enterWorkspace();
            } else {
                form.innerHTML = `
                    <div class="auth-success">
                        <span>✓</span><h2>Check your email</h2>
                        <p>Confirm your email address, then return to sign in.</p>
                        <a class="button primary" href="#login">Go to sign in</a>
                    </div>
                `;
            }
        }

        if (form.id === "forgot-form") {
            const { error } = await Auth.reset(formData.get("email").trim());
            if (error) throw error;
            form.innerHTML = `
                <div class="auth-success">
                    <span>✓</span><h2>Check your email</h2>
                    <p>If an account exists for that address, a reset link is on its way.</p>
                </div>
            `;
        }

        if (form.id === "reset-form") {
            const { error } = await Auth.updatePassword(formData.get("password"));
            if (error) throw error;
            UI.toast("Password updated.");
            location.hash = "dashboard";
        }

        if (form.id === "transaction-form") {
            await Data.saveTransaction(
                {
                    user_id: session.user.id,
                    type: formData.get("type"),
                    amount: Number(formData.get("amount")),
                    description: formData.get("description").trim(),
                    category: formData.get("category"),
                    date: formData.get("date"),
                },
                form.dataset.id || null,
            );
            UI.close();
            await reloadWorkspace(
                form.dataset.id ? "Transaction updated." : "Transaction added.",
            );
        }

        if (form.id === "budget-form") {
            await Data.saveBudget(
                {
                    user_id: session.user.id,
                    month: `${currentMonth()}-01`,
                    amount: Number(formData.get("amount")),
                },
                workspace.budget?.id,
            );
            UI.close();
            await reloadWorkspace("Budget updated.");
        }

        if (form.id === "goal-form") {
            const targetAmount = Number(formData.get("target"));
            const currentAmount = Number(formData.get("current"));
            if (currentAmount > targetAmount) {
                throw new Error("Current savings cannot exceed the target.");
            }
            await Data.saveGoal(
                {
                    user_id: session.user.id,
                    name: formData.get("name").trim(),
                    target_amount: targetAmount,
                    current_amount: currentAmount,
                    target_date: formData.get("date"),
                    description: formData.get("description").trim(),
                },
                form.dataset.id || null,
            );
            UI.close();
            await reloadWorkspace(
                form.dataset.id ? "Savings goal updated." : "Savings goal created.",
            );
        }

        if (form.id === "saving-form") {
            const goal = workspace.goals.find((item) => item.id === form.dataset.id);
            const amount = Number(formData.get("amount"));
            if (amount <= 0 || amount > goal.target_amount - goal.current_amount) {
                throw new Error("Enter an amount within the remaining goal balance.");
            }
            await Data.saveGoal(
                {
                    current_amount: Number(goal.current_amount) + amount,
                },
                goal.id,
            );
            UI.close();
            await reloadWorkspace("Savings added.");
        }

        if (form.id === "profile-form") {
            const fullName = formData.get("fullName").trim();
            await Data.updateProfile(session.user.id, fullName);
            profile.full_name = fullName;
            renderPrivate();
            UI.toast("Profile updated.");
        }
    }

    async function enterWorkspace() {
        location.hash = "dashboard";
        loading = true;
        renderPrivate();
        try {
            profile = await Data.profile(session.user);
            workspace = await Data.all();
        } catch (error) {
            console.error("Unable to load workspace:", error);
            UI.toast("Unable to load your workspace.", "error");
        } finally {
            loading = false;
            renderPrivate();
        }
    }

    function registerEvents() {
        document.addEventListener("click", handleClick);
        document.addEventListener("submit", handleSubmit);
        document.addEventListener("input", (event) => {
            if (event.target.id === "search-transactions") {
                filters.query = event.target.value;
                renderPrivate();
                select("#search-transactions")?.focus();
            }
        });
        document.addEventListener("change", (event) => {
            if (event.target.id === "type-filter") filters.type = event.target.value;
            if (event.target.id === "month-filter") filters.month = event.target.value;
            if (event.target.matches("#type-filter, #month-filter")) renderPrivate();
        });
        window.addEventListener("hashchange", () => {
            session ? renderPrivate() : renderPublic();
        });
        window.addEventListener("scroll", updateLandingNavigation, { passive: true });
    }

    async function initialize() {
        applyTheme();
        registerEvents();

        if (!SupabaseConfig.configured) {
            renderPublic();
            window.setTimeout(() => {
                UI.toast(
                    "Add your Supabase URL and anon key in js/supabase.js to enable accounts.",
                    "error",
                );
            }, 800);
            return;
        }

        try {
            session = await Auth.session();
            Auth.onChange((event, nextSession) => {
                if (event === "SIGNED_OUT") {
                    session = null;
                    renderPublic();
                } else if (nextSession && !session) {
                    session = nextSession;
                    enterWorkspace();
                }
            });
            if (session) await enterWorkspace();
            else renderPublic();
        } catch (error) {
            console.error("PocketWise startup failed:", error);
            renderPublic();
            UI.toast("Could not connect to PocketWise.", "error");
        }
    }

    return { init: initialize };
})();

document.addEventListener("DOMContentLoaded", App.init);
