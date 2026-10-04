/**
 * Lightweight motion for the public PocketWise hero.
 * Demonstration values are visual only and never touch application state.
 */
const HeroMotion = (() => {
    let animationFrame = null;
    let cleanupHandlers = [];

    function prefersReducedMotion() {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }

    function formatDemoAmount(value) {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            maximumFractionDigits: 0,
        }).format(value);
    }

    function animateAmounts(hero) {
        const amountElements = hero.querySelectorAll("[data-demo-amount]");
        const duration = 900;
        const startTime = performance.now();

        function update(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            amountElements.forEach((element) => {
                const finalAmount = Number(element.dataset.demoAmount);
                const startAmount = Number(element.dataset.demoStart || 0);
                element.textContent = formatDemoAmount(
                    Math.round(startAmount + (finalAmount - startAmount) * easedProgress),
                );
            });

            if (progress < 1) {
                animationFrame = window.requestAnimationFrame(update);
            }
        }

        window.setTimeout(() => {
            animationFrame = window.requestAnimationFrame(update);
        }, 850);
    }

    function sequenceActivity(hero) {
        const activityItems = hero.querySelectorAll("[data-feed-item]");
        if (!activityItems.length) return;

        let activeIndex = 0;
        function showActivity(index) {
            activityItems.forEach((item, itemIndex) => {
                item.classList.toggle("active", itemIndex === index);
            });
        }

        const startTimeout = window.setTimeout(() => {
            showActivity(activeIndex);
            const interval = window.setInterval(() => {
                activeIndex = (activeIndex + 1) % activityItems.length;
                showActivity(activeIndex);
            }, 2900);
            cleanupHandlers.push(() => window.clearInterval(interval));
        }, 1600);
        cleanupHandlers.push(() => window.clearTimeout(startTimeout));
    }

    function sequenceStudentStory(hero) {
        const label = hero.querySelector("[data-story-label]");
        const detail = hero.querySelector("[data-story-detail]");
        if (!label || !detail) return;

        const stories = [
            ["Reviewing today's spending", "Food budget is still on track"],
            ["Building a laptop fund", "Halfway to the savings goal"],
            ["Planning the week ahead", "A clear budget for every day"],
        ];
        let index = 0;
        const interval = window.setInterval(() => {
            const story = label.closest(".student-story");
            story?.classList.add("changing");
            const swapTimeout = window.setTimeout(() => {
                index = (index + 1) % stories.length;
                [label.textContent, detail.textContent] = stories[index];
                story?.classList.remove("changing");
            }, 450);
            cleanupHandlers.push(() => window.clearTimeout(swapTimeout));
        }, 4300);
        cleanupHandlers.push(() => window.clearInterval(interval));
    }

    function observeHero(hero, beginMotion) {
        if (!("IntersectionObserver" in window)) {
            hero.classList.add("hero-in-view");
            beginMotion();
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                hero.classList.add("hero-in-view");
                beginMotion();
                observer.disconnect();
            },
            { threshold: 0.2 },
        );
        observer.observe(hero);
        cleanupHandlers.push(() => observer.disconnect());
    }

    function observeLandingSections() {
        const sections = document.querySelectorAll("[data-reveal], .reveal");
        if (!sections.length) return;

        if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
            sections.forEach((section) => section.classList.add("visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                });
            },
            { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
        );

        sections.forEach((section) => observer.observe(section));
        cleanupHandlers.push(() => observer.disconnect());
    }

    function sequenceLandingCopy() {
        const messageSets = {
            rhythm: [
                "Every kind of income deserves a clear plan.",
                "See what arrived before deciding what leaves.",
                "Bring every naira into one calm view.",
            ],
            clarity: [
                "Know what is safe to spend before you spend it.",
                "Protect the important things first.",
                "Make the next money decision with confidence.",
            ],
        };

        document.querySelectorAll("[data-word-loop]").forEach((element) => {
            const messages = messageSets[element.dataset.wordLoop];
            if (!messages?.length) return;

            if (prefersReducedMotion()) {
                element.textContent = messages[0];
                return;
            }

            let messageIndex = 0;
            let started = false;
            let active = true;
            const timers = new Set();

            function schedule(callback, delay) {
                const timer = window.setTimeout(() => {
                    timers.delete(timer);
                    if (active) callback();
                }, delay);
                timers.add(timer);
            }

            function showMessage() {
                const words = messages[messageIndex].split(" ");
                element.replaceChildren(
                    ...words.map((word, index) => {
                        const span = document.createElement("span");
                        span.className = "story-word";
                        span.style.setProperty("--word-index", index);
                        span.textContent = word;
                        return span;
                    }),
                );

                schedule(() => {
                    element
                        .querySelectorAll(".story-word")
                        .forEach((word) => word.classList.add("is-visible"));
                }, 35);

                const readingTime = words.length * 72 + 2600;
                schedule(() => {
                    element
                        .querySelectorAll(".story-word")
                        .forEach((word) => word.classList.add("is-leaving"));
                    schedule(() => {
                        messageIndex = (messageIndex + 1) % messages.length;
                        showMessage();
                    }, words.length * 34 + 520);
                }, readingTime);
            }

            function begin() {
                if (started) return;
                started = true;
                showMessage();
            }

            if ("IntersectionObserver" in window) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (!entry.isIntersecting) return;
                        begin();
                        observer.disconnect();
                    },
                    { threshold: 0.45 },
                );
                observer.observe(element);
                cleanupHandlers.push(() => observer.disconnect());
            } else {
                begin();
            }

            cleanupHandlers.push(() => {
                active = false;
                timers.forEach((timer) => window.clearTimeout(timer));
                timers.clear();
            });
        });
    }

    function enablePointerParallax(hero) {
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
        if (!finePointer.matches || prefersReducedMotion()) return;

        const background = hero.querySelector("[data-parallax-background]");
        const dashboard = hero.querySelector("[data-parallax-dashboard]");
        const copy = hero.querySelector("[data-parallax-copy]");
        const floatingCards = hero.querySelectorAll("[data-parallax-card]");
        let pointerX = 0;
        let pointerY = 0;
        let scheduled = false;

        function renderParallax() {
            background?.style.setProperty(
                "transform",
                `translate3d(${pointerX * 2}px, ${pointerY * 2}px, 0)`,
            );
            copy?.style.setProperty(
                "transform",
                `translate3d(${pointerX * -1.5}px, ${pointerY * -1.5}px, 0)`,
            );
            dashboard?.style.setProperty(
                "transform",
                `translate3d(${pointerX * 3}px, ${pointerY * 3}px, 0)`,
            );
            floatingCards.forEach((card) => {
                const direction = Number(card.dataset.parallaxCard) || 1;
                card.style.setProperty("--parallax-x", `${pointerX * 6 * direction}px`);
                card.style.setProperty("--parallax-y", `${pointerY * 5 * direction}px`);
            });
            scheduled = false;
        }

        function handlePointerMove(event) {
            const bounds = hero.getBoundingClientRect();
            pointerX = (event.clientX - bounds.left) / bounds.width - 0.5;
            pointerY = (event.clientY - bounds.top) / bounds.height - 0.5;

            if (!scheduled) {
                scheduled = true;
                animationFrame = window.requestAnimationFrame(renderParallax);
            }
        }

        function resetParallax() {
            pointerX = 0;
            pointerY = 0;
            renderParallax();
        }

        hero.addEventListener("pointermove", handlePointerMove);
        hero.addEventListener("pointerleave", resetParallax);
        cleanupHandlers.push(() => {
            hero.removeEventListener("pointermove", handlePointerMove);
            hero.removeEventListener("pointerleave", resetParallax);
        });
    }

    function stop() {
        if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
        cleanupHandlers.forEach((cleanup) => cleanup());
        cleanupHandlers = [];
    }

    function start() {
        stop();
        const hero = document.querySelector("[data-hero]");
        if (!hero) return;

        observeLandingSections();
        sequenceLandingCopy();

        if (prefersReducedMotion()) {
            hero.classList.add("hero-in-view", "motion-ready");
            hero.querySelectorAll("[data-demo-amount]").forEach((element) => {
                element.textContent = formatDemoAmount(
                    Number(element.dataset.demoAmount),
                );
            });
            hero.querySelectorAll("[data-feed-item]").forEach((item) => {
                item.classList.add("active");
            });
            return;
        }

        enablePointerParallax(hero);
        observeHero(hero, () => {
            animateAmounts(hero);
            sequenceActivity(hero);
            sequenceStudentStory(hero);

            // Release entrance transforms before pointer parallax takes control.
            const motionReadyTimeout = window.setTimeout(() => {
                hero.classList.add("motion-ready");
            }, 1900);
            cleanupHandlers.push(() => window.clearTimeout(motionReadyTimeout));
        });
    }

    return { start, stop };
})();
