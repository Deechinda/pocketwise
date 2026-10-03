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
        const bars = [35, 58, 42, 72, 49, 88]
            .map((height) => `<i style="height: ${height}%"></i>`)
            .join("");

        return `
            <div class="hero-preview hero-enter-preview" data-parallax-dashboard>
                <div class="preview-label">LIVE PRODUCT PREVIEW</div>
                <div class="preview-glow" aria-hidden="true"></div>
                <div class="preview-window">
                    <div class="preview-side">
                        <span class="brand-mark">P</span>
                        <i>⌂</i><i>↕</i><i>◉</i><i>◇</i><i>▥</i>
                    </div>
                    <div class="preview-content">
                        <div class="preview-status">
                            <i></i>
                            <span>Your finances, organized</span>
                        </div>
                        <small>Good afternoon, Ada 👋</small>
                        <h3>Financial overview</h3>
                        <div class="preview-stats">
                            <div>
                                <span>Current balance</span>
                                <b data-demo-amount="85400" data-demo-start="75000">₦75,000</b>
                            </div>
                            <div><span>Income</span><b data-demo-amount="120000">₦0</b></div>
                            <div><span>Expenses</span><b data-demo-amount="34600">₦0</b></div>
                        </div>
                        <div class="preview-lower">
                            <div class="preview-chart">
                                <span>Monthly spending</span>
                                <div class="bars">${bars}</div>
                            </div>
                            <div class="preview-goal">
                                <span>Laptop goal</span>
                                <b>₦25,000</b>
                                <div class="progress preview-progress" role="progressbar" aria-label="Laptop savings progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"><span style="width: 50%"></span></div>
                                <small>50% complete</small>
                            </div>
                        </div>
                        <div class="preview-feed" aria-label="Demonstration activity">
                            <span>RECENT ACTIVITY</span>
                            <div data-feed-item><i>✓</i><b>Income added</b><strong>+₦120,000</strong></div>
                            <div data-feed-item><i>✓</i><b>Food expense</b><strong>−₦2,500</strong></div>
                            <div data-feed-item><i>✓</i><b>Savings contribution</b><strong>+₦5,000</strong></div>
                            <div data-feed-item><i>✓</i><b>Budget on track</b><strong>62% used</strong></div>
                        </div>
                    </div>
                </div>
                <div class="preview-notice">
                    <span>✓</span>
                    <div><strong>Budget on track</strong><small>62% used this month</small></div>
                </div>
                <div class="floating-activity activity-food" data-parallax-card="1">
                    <span>−₦2,500</span><small>Food</small>
                </div>
                <div class="floating-activity activity-savings" data-parallax-card="-1">
                    <span>+₦5,000</span><small>Savings</small>
                </div>
                <div class="floating-activity activity-income" data-parallax-card="1">
                    <span>+₦120,000</span><small>Income added</small>
                </div>
                <div class="student-story" data-student-story data-parallax-card="-1" aria-label="A student reviewing their PocketWise finances">
                    <div class="student-avatar" aria-hidden="true">
                        <span class="student-hair"></span><span class="student-face"></span><span class="student-body"></span>
                    </div>
                    <div class="student-story-copy">
                        <small>ADA'S MONEY CHECK-IN</small>
                        <strong data-story-label>Reviewing today's spending</strong>
                        <span data-story-detail>Food budget is still on track</span>
                    </div>
                    <i class="story-live-dot" aria-hidden="true"></i>
                </div>
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
