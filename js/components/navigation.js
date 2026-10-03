const Navigation = (() => {
    function render(routes, activeRoute) {
        const desktop = routes
            .map(([routeId, label]) => {
                return `
                <a
                    href="#${routeId}"
                    data-route="${routeId}"
                    class="nav-item ${activeRoute === routeId ? "active" : ""}"
                >
                    <span>${UI.icons[routeId]}</span>
                    <span>${label}</span>
                </a>
            `;
            })
            .join("");

        const mobile = routes
            .slice(0, 5)
            .map(([routeId, label]) => {
                const shortLabel = label === "Transactions" ? "Activity" : label;

                return `
                <a href="#${routeId}" class="${activeRoute === routeId ? "active" : ""}">
                    <span>${UI.icons[routeId]}</span>
                    <small>${shortLabel}</small>
                </a>
            `;
            })
            .join("");

        document.querySelector("#desktop-nav").innerHTML = desktop;
        document.querySelector("#mobile-nav").innerHTML = mobile;
    }

    return { render };
})();
