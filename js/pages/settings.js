const SettingsPage = (() => {
    function render(context) {
        const { profile, session, pageHeader, field } = context;

        return `
            ${pageHeader("Settings", "Manage your profile, appearance and account.")}

            <div class="settings-grid stagger-group">
                <section class="card">
                    <div class="card-head">
                        <div>
                            <p class="eyebrow">Profile</p>
                            <h2>Your details</h2>
                        </div>
                    </div>
                    <form id="profile-form">
                        ${field(
                            "fullName",
                            "Full name",
                            "text",
                            "Your name",
                            `value="${UI.escape(profile?.full_name || "")}" required`,
                        )}
                        <label class="field">
                            <span>Email address</span>
                            <input value="${UI.escape(session.user.email)}" disabled>
                        </label>
                        <p class="form-error"></p>
                        <button class="button primary">Save profile</button>
                    </form>
                </section>

                <section class="card settings-card">
                    <div class="settings-icon">◐</div>
                    <div>
                        <h2>Appearance</h2>
                        <p>Choose a comfortable theme.</p>
                    </div>
                    <div class="segmented">
                        <button data-action="set-theme" data-value="light">☀ Light</button>
                        <button data-action="set-theme" data-value="dark">☾ Dark</button>
                    </div>
                </section>

                <section class="card settings-card">
                    <div class="settings-icon">⇩</div>
                    <div>
                        <h2>Your data</h2>
                        <p>Download a copy of your personal records.</p>
                    </div>
                    <button class="button secondary" data-action="export-data">
                        Export personal data
                    </button>
                </section>

                <section class="card settings-card">
                    <div class="settings-icon">→</div>
                    <div>
                        <h2>Account</h2>
                        <p>Securely end your current session.</p>
                    </div>
                    <button class="button danger-button" data-action="sign-out">
                        Sign out
                    </button>
                </section>
            </div>
        `;
    }

    return { render };
})();
