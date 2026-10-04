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
                    <div class="scene-photo photo-spending" role="img" aria-label="A person checking everyday spending on a smartphone"></div>
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
                    <div class="scene-photo photo-budget" role="img" aria-label="A person planning a monthly budget on a laptop"></div>
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
                    <div class="scene-photo photo-savings" role="img" aria-label="A person making progress toward a savings goal"></div>
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
            [
                "01",
                "SEE CLEARLY",
                "Know what is truly available",
                "Your balance should answer a simple question: what can I actually use? PocketWise keeps the answer close.",
                "₦85,400",
                "available now",
            ],
            [
                "02",
                "PLAN WITH PURPOSE",
                "Give every naira a next job",
                "Put bills and daily spending in their place before they compete for the same money.",
                "62%",
                "of plan used",
            ],
            [
                "03",
                "BUILD STEADILY",
                "Save at a pace that feels real",
                "Give the next important thing a real number, then watch each contribution bring it closer.",
                "50%",
                "goal complete",
            ],
            [
                "04",
                "LEARN YOUR RHYTHM",
                "Notice patterns before they cost you",
                "Your history should tell you something useful. See the habits worth keeping and the ones worth changing.",
                "Food",
                "top category",
            ],
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
                        <button
                            class="icon-button landing-theme-toggle"
                            data-action="toggle-theme"
                            aria-label="Switch colour theme"
                            title="Switch colour theme"
                        >
                            <span data-theme-icon aria-hidden="true">☾</span>
                            <span class="sr-only" data-theme-label>Dark mode</span>
                        </button>
                        <div class="landing-actions">
                            <a class="button secondary" href="#login">Sign in</a>
                            <a class="button primary" href="#signup">Get started</a>
                        </div>
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
                                See what you have, understand where it goes and keep your
                                plans within reach. Everything stays together in one calm workspace.
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

                    <section class="landing-intro landing-story section" data-reveal>
                        <div class="landing-story-copy">
                            <p class="eyebrow">Money rarely follows one schedule</p>
                            <h2>
                                Your money has a rhythm.<br>
                                <span>PocketWise helps you read it.</span>
                            </h2>
                            <p>
                                Payday is easy to recognise. Smaller deposits are easier to miss.
                                PocketWise brings every source together so you always know what
                                arrived and what is still available.
                            </p>
                            <p class="story-rotator">
                                <span class="sr-only">Every deposit belongs in the same clear picture.</span>
                                <span data-word-loop="rhythm" aria-hidden="true"></span>
                            </p>
                            <div class="income-rhythm" aria-label="Examples of income rhythms">
                                <span>Allowance</span><span>Salary</span><span>Side hustle</span><span>Support</span>
                            </div>
                        </div>
                        <figure class="story-media story-media-rhythm" data-story-media>
                            <img src="assets/images/money-rhythm-cutout.png" alt="A young woman calmly reviewing her everyday finances">
                            <figcaption class="story-float story-balance">
                                <small>AVAILABLE TO PLAN</small>
                                <strong>₦85,400</strong>
                                <span><i></i> All income, one clear view</span>
                            </figcaption>
                            <div class="story-float story-income" aria-hidden="true">
                                <span>+</span><div><small>INCOME ADDED</small><strong>Side hustle</strong></div><b>₦18,500</b>
                            </div>
                        </figure>
                    </section>

                    <section id="features" class="feature-showcase section">
                        <div class="feature-heading landing-story landing-story-reverse" data-reveal>
                            <figure class="story-media story-media-plan" data-story-media>
                                <img src="assets/images/clear-plan-cutout.png" alt="A young man making a calm and considered money plan">
                                <div class="story-float story-priorities" aria-hidden="true">
                                    <small>NEXT MONEY DECISION</small>
                                    <span><i style="--progress:78%"></i><b>Essentials</b><em>78%</em></span>
                                    <span><i style="--progress:54%"></i><b>Laptop goal</b><em>54%</em></span>
                                    <span><i style="--progress:36%"></i><b>Spending room</b><em>36%</em></span>
                                </div>
                            </figure>
                            <div class="landing-story-copy">
                                <p class="eyebrow">A clearer answer before you spend</p>
                                <h2>Less guessing.<br>More knowing what comes next.</h2>
                                <p>
                                    Bills, goals and everyday spending all ask for attention.
                                    PocketWise shows them together so the next choice feels considered.
                                </p>
                                <p class="story-rotator">
                                    <span class="sr-only">Know what is safe to spend before you spend it.</span>
                                    <span data-word-loop="clarity" aria-hidden="true"></span>
                                </p>
                            </div>
                        </div>
                        <div class="feature-grid">
                            ${features
                                .map(
                                    ([number, label, title, description, value, valueLabel], index) => `
                                <article class="feature" data-reveal style="--reveal-order:${index}">
                                    <div class="feature-topline">
                                        <span>${number}</span>
                                        <small>${label}</small>
                                    </div>
                                    <h3>${title}</h3>
                                    <p>${description}</p>
                                    <div class="feature-signal">
                                        <strong>${value}</strong>
                                        <small>${valueLabel}</small>
                                        <i aria-hidden="true"></i>
                                    </div>
                                </article>
                            `,
                                )
                                .join("")}
                        </div>
                    </section>

                    <section class="money-rhythm-section">
                        <div class="money-rhythm section" data-reveal>
                            <div class="money-rhythm-copy">
                                <p class="eyebrow">One connected money story</p>
                                <h2>See where your money came from and choose where it goes next.</h2>
                                <p>
                                    Money comes in and life makes a claim on it. PocketWise lets
                                    you choose the order before the month chooses for you.
                                </p>
                                <a class="text-link" href="#signup">Build your workspace <span>→</span></a>
                            </div>
                            <div class="money-path" aria-label="PocketWise money flow">
                                <div class="money-path-line" aria-hidden="true"><i></i></div>
                                <article><span>↙</span><div><small>MONEY IN</small><strong>Record what arrived</strong><p>Allowance, salary, support or side hustle income.</p></div></article>
                                <article><span>▣</span><div><small>MAKE A PLAN</small><strong>Protect what matters</strong><p>Set aside essentials before everyday spending begins.</p></div></article>
                                <article><span>◇</span><div><small>MOVE FORWARD</small><strong>Grow something meaningful</strong><p>Keep goals visible and make progress at your own pace.</p></div></article>
                            </div>
                        </div>
                    </section>

                    <section id="how" class="how-section section">
                        <div class="how-heading" data-reveal>
                            <p class="eyebrow">Start with today</p>
                            <h2>Build a money routine you can actually keep.</h2>
                            <p>Add what you know now. The useful picture grows as your real decisions pass through PocketWise.</p>
                        </div>
                        <ol class="how-steps">
                            <li data-reveal style="--reveal-order:0"><b>01</b><span><small>BEGIN WITH THE TRUTH</small><strong>Add the money you have</strong><p>Record what came in and what went out. Your balance becomes useful when it reflects the day you are actually having.</p></span></li>
                            <li data-reveal style="--reveal-order:1"><b>02</b><span><small>DECIDE THE ORDER</small><strong>Give important things their place</strong><p>Set aside essentials, leave room for daily life and keep meaningful goals visible.</p></span></li>
                            <li data-reveal style="--reveal-order:2"><b>03</b><span><small>NOTICE WHAT REPEATS</small><strong>Review and adjust</strong><p>Look back before the next decision. Small patterns often explain more than a perfect budget ever could.</p></span></li>
                        </ol>
                    </section>

                    <section id="security" class="trust-shell">
                      <div class="trust section" data-reveal>
                        <div class="trust-copy">
                            <p class="eyebrow">Privacy is part of the product</p>
                            <h2>Your financial picture belongs to you.</h2>
                            <p>
                                Your records stay connected to your account. Secure sign in and
                                database access rules keep each PocketWise workspace separate.
                            </p>
                        </div>
                        <div class="trust-points">
                            <span><i>01</i><b>Secure sign-in</b><small>Your workspace opens only through your account.</small></span>
                            <span><i>02</i><b>Separated records</b><small>Your financial entries stay connected to your user ID.</small></span>
                            <span><i>03</i><b>Database protection</b><small>Row Level Security reinforces access where the data lives.</small></span>
                        </div>
                      </div>
                    </section>

                    <section class="final-cta section" data-reveal>
                        <div>
                            <p class="eyebrow">Begin with one honest number</p>
                            <h2>A clearer month starts with what you know today.</h2>
                            <p>Open your private workspace and give the next decision a little more context.</p>
                        </div>
                        <a class="button primary" href="#signup">Create your workspace <span>→</span></a>
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
                    <small>Private by account. Made for everyday money.</small>
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
