const PublicViews = (() => {
    function brand() {
        return `
            <a class="brand" href="#home">
                <span class="brand-mark">P</span>
                <strong>PocketWise</strong>
            </a>
        `;
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

    function productPreview() {
        return `
            <div class="hero-visual hero-enter-preview" data-parallax-dashboard>
                <div class="hero-visual-glow" aria-hidden="true"></div>

                <article class="student-scene scene-spending" data-parallax-card="1">
                    <div class="scene-photo photo-spending" role="img" aria-label="University student checking spending on a smartphone"></div>
                    <div class="device device-phone" aria-hidden="true">
                        <div class="device-notch"></div>
                        <div class="device-screen">
                            <small>PocketWise</small>
                            <strong>₦2,500</strong>
                            <span>Food · Today</span>
                            <i>−</i>
                        </div>
                    </div>
                    <div class="scene-tag"><b>−₦2,500</b><span>Food</span></div>
                </article>

                <article class="student-scene scene-budget" data-parallax-card="-1">
                    <div class="scene-photo photo-budget" role="img" aria-label="University student planning a budget on a laptop"></div>
                    <div class="device device-laptop" aria-hidden="true">
                        <div class="laptop-screen">
                            <span>Monthly budget</span>
                            <strong>₦50,000</strong>
                            <div class="mini-progress"><i></i></div>
                            <small>72% used</small>
                        </div>
                        <div class="laptop-base"></div>
                    </div>
                    <div class="scene-tag"><b>₦50,000</b><span>Monthly budget</span></div>
                </article>

                <article class="student-scene scene-savings" data-parallax-card="1">
                    <div class="scene-photo photo-savings" role="img" aria-label="University student working toward a savings goal"></div>
                    <div class="device device-tablet" aria-hidden="true">
                        <div class="tablet-screen">
                            <small>Savings goal</small>
                            <strong>₦25,000</strong>
                            <div class="mini-progress"><i></i></div>
                            <span>50% complete</span>
                        </div>
                    </div>
                    <div class="scene-tag"><b>₦25,000 / ₦50,000</b><span>Laptop goal</span></div>
                </article>

                <div class="hero-dashboard-card">
                    <div class="dashboard-card-top">
                        <div>
                            <small>POCKETWISE</small>
                            <span>Your finances, organized</span>
                        </div>
                        <i>●</i>
                    </div>
                    <div class="dashboard-balance">
                        <small>Available balance</small>
                        <strong data-demo-amount="85400" data-demo-start="75000">₦75,000</strong>
                    </div>
                    <div class="dashboard-metrics">
                        <div><span>Income</span><b data-demo-amount="120000">₦0</b></div>
                        <div><span>Expenses</span><b data-demo-amount="34600">₦0</b></div>
                        <div><span>Saved</span><b>₦25,000</b></div>
                    </div>
                    <div class="dashboard-activity">
                        <small>RECENT ACTIVITY</small>
                        <div><span><i>+</i> Income added</span><b>+₦120,000</b></div>
                        <div><span><i>−</i> Food</span><b>−₦2,500</b></div>
                        <div><span><i>+</i> Savings</span><b>+₦5,000</b></div>
                    </div>
                    <div class="dashboard-footer"><span>Monthly budget</span><b>62% used</b></div>
                </div>

                <div class="finance-event event-one">+₦120,000 <span>income</span></div>
                <div class="finance-event event-two">−₦2,500 <span>food</span></div>
                <div class="finance-event event-three">+₦5,000 <span>savings</span></div>
            </div>
        `;
    }

    function landing() {
        const features = [
            ["↕", "Track spending", "Know exactly where your money goes."],
            ["◉", "Set budgets", "See what you have spent and what remains."],
            ["◇", "Save toward goals", "Build steady progress toward what matters."],
            ["▥", "Understand habits", "Use clear analytics to spot spending patterns."],
        ];

        return `
            <div class="landing">
                <header class="landing-header hero-enter-nav">
                    <nav class="landing-nav">
                        ${brand()}
                        <div class="landing-links">
                            <a href="#features">Features</a>
                            <a href="#how">How it works</a>
                            <a href="#security">Security</a>
                        </div>
                        <div class="landing-actions">
                            <a class="button secondary" href="#login">Sign in</a>
                            <a class="button primary" href="#signup">Get started</a>
                        </div>
                        <button
                            class="icon-button mobile-menu"
                            data-action="mobile-menu"
                            aria-label="Open navigation"
                            aria-expanded="false"
                        >
                            ☰
                        </button>
                    </nav>
                </header>

                <main class="landing-main">
                    <section class="hero-section">
                      <div class="hero" data-hero>
                        <div class="hero-atmosphere" data-parallax-background aria-hidden="true"></div>
                        <div class="hero-copy" data-parallax-copy>
                            <p class="eyebrow hero-enter-eyebrow">POCKETWISE</p>
                            <h1 class="hero-enter-title">Take control of your money.</h1>
                            <p class="hero-enter-copy">
                                Track spending, manage your budget and stay focused on the
                                things you're saving for — all in one simple workspace.
                            </p>
                            <div class="hero-actions hero-enter-actions">
                                <a class="button primary" href="#signup">
                                    Get started <span>→</span>
                                </a>
                                <a class="button secondary" href="#how">See how it works</a>
                            </div>
                            <small class="hero-enter-actions">
                                A clean workspace for clearer money decisions.
                            </small>
                        </div>
                        ${productPreview()}
                      </div>
                    </section>

                    <section id="features" class="section reveal-group">
                        <div class="section-heading reveal">
                            <p class="eyebrow">Built for everyday money</p>
                            <h2>Everything you need. Nothing you don't.</h2>
                        </div>
                        <div class="feature-grid stagger-group">
                            ${features
                                .map(
                                    ([icon, title, description]) => `
                                <article class="feature reveal">
                                    <span>${icon}</span>
                                    <h3>${title}</h3>
                                    <p>${description}</p>
                                </article>
                            `,
                                )
                                .join("")}
                        </div>
                    </section>

                    <section id="how" class="how section reveal">
                        <div>
                            <p class="eyebrow">How it works</p>
                            <h2>Good money habits, made straightforward.</h2>
                        </div>
                        <ol class="stagger-group">
                            <li><b>01</b><span><strong>Create your account</strong><small>Open your private PocketWise workspace.</small></span></li>
                            <li><b>02</b><span><strong>Track your money</strong><small>Add income, expenses and a monthly budget.</small></span></li>
                            <li><b>03</b><span><strong>Reach your goals</strong><small>Follow progress and understand your habits.</small></span></li>
                        </ol>
                    </section>

                    <section id="workflow" class="workflow section reveal">
                        <div class="section-heading">
                            <p class="eyebrow">Your financial workflow</p>
                            <h2>From money in to better decisions.</h2>
                            <p>Each record adds clarity to the next step.</p>
                        </div>
                        <div class="workflow-track stagger-group">
                            <article><span>↙</span><strong>Income</strong><small>Record money received</small></article>
                            <i>→</i>
                            <article><span>↗</span><strong>Expenses</strong><small>Understand where it goes</small></article>
                            <i>→</i>
                            <article><span>◉</span><strong>Budget</strong><small>Set a monthly limit</small></article>
                            <i>→</i>
                            <article><span>◇</span><strong>Savings</strong><small>Build toward goals</small></article>
                            <i>→</i>
                            <article><span>▥</span><strong>Insights</strong><small>See useful patterns</small></article>
                        </div>
                    </section>

                    <section id="security" class="trust-shell">
                      <div class="trust section reveal">
                        <div class="trust-copy">
                            <p class="eyebrow">Your workspace stays yours</p>
                            <h2>Private by account, protected in the database.</h2>
                            <p>
                                PocketWise associates every financial record with your
                                signed-in account. Supabase Authentication and database
                                Row Level Security keep each user's workspace separate.
                            </p>
                        </div>
                        <div class="trust-points">
                            <span>✓ Secure authentication</span>
                            <span>✓ Account-based records</span>
                            <span>✓ Protected database access</span>
                        </div>
                      </div>
                    </section>

                    <section class="final-cta section reveal">
                        <p class="eyebrow">A clearer view starts here</p>
                        <h2>Your money deserves a clearer view.</h2>
                        <p>Create your private PocketWise workspace.</p>
                        <a class="button primary" href="#signup">Get started →</a>
                    </section>
                </main>

                <footer>
                    ${brand()}
                    <p>Take control of your money.</p>
                    <span>© ${new Date().getFullYear()} PocketWise · Private by account.</span>
                </footer>
            </div>
        `;
    }

    function authentication(kind) {
        const isSignup = kind === "signup";
        const isForgotPassword = kind === "forgot";
        const isPasswordUpdate = kind === "reset-password";
        const formId = isSignup
            ? "signup"
            : isForgotPassword
              ? "forgot"
              : isPasswordUpdate
                ? "reset"
                : "login";
        const title = isSignup
            ? "Create your account"
            : isForgotPassword
              ? "Reset your password"
              : isPasswordUpdate
                ? "Choose a new password"
                : "Welcome back";
        const submitLabel = isSignup
            ? "Create account"
            : isForgotPassword
              ? "Send reset link"
              : isPasswordUpdate
                ? "Update password"
                : "Sign in";

        return `
            <div class="auth-page">
                <section class="auth-brand">
                    ${brand()}
                    <div>
                        <p class="eyebrow">YOUR FINANCIAL WORKSPACE</p>
                        <h1>Money feels simpler when you can see it clearly.</h1>
                        <p>
                            Track spending, plan a budget and make steady progress
                            toward your goals.
                        </p>
                    </div>
                    <small>Private by account · Built for students</small>
                </section>
                <main class="auth-main">
                    <a href="#home" class="back-link">← Back to PocketWise</a>
                    <div class="auth-card">
                        <p class="eyebrow">POCKETWISE</p>
                        <h1>${title}</h1>
                        <p>
                            ${
                                isSignup
                                    ? "Start with a clean, private workspace."
                                    : isForgotPassword
                                      ? "We will send a secure reset link to your email."
                                      : isPasswordUpdate
                                        ? "Use at least eight characters."
                                        : "Sign in to continue to your workspace."
                            }
                        </p>
                        <form id="${formId}-form">
                            ${isSignup ? field("fullName", "Full name", "text", "e.g. Ada Okafor", 'autocomplete="name" required') : ""}
                            ${!isPasswordUpdate ? field("email", "Email address", "email", "you@example.com", 'autocomplete="email" required') : ""}
                            ${!isForgotPassword ? field("password", isPasswordUpdate ? "New password" : "Password", "password", "At least 8 characters", `minlength="8" autocomplete="${isSignup ? "new-password" : "current-password"}" required`) : ""}
                            ${isSignup ? field("confirm", "Confirm password", "password", "Enter it again", 'minlength="8" autocomplete="new-password" required') : ""}
                            <p class="form-error" aria-live="polite"></p>
                            <button class="button primary full-button">${submitLabel}</button>
                        </form>
                        ${
                            !isSignup && !isForgotPassword && !isPasswordUpdate
                                ? `
                            <button class="text-button auth-forgot" data-route="forgot">
                                Forgot password?
                            </button>
                            <p class="auth-switch">
                                New to PocketWise? <a href="#signup">Create an account</a>
                            </p>
                        `
                                : ""
                        }
                        ${isSignup ? `<p class="auth-switch">Already have an account? <a href="#login">Sign in</a></p>` : ""}
                        ${isForgotPassword ? `<p class="auth-switch"><a href="#login">Back to sign in</a></p>` : ""}
                    </div>
                </main>
            </div>
        `;
    }

    return { landing, authentication };
})();
