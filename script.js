"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const intro = document.getElementById("intro");
    const skipIntroButton = document.getElementById("skipIntro");
    const restartButton = document.getElementById("restartButton");
    const progressBar = document.getElementById("progressBar");

    const hasGSAP =
        typeof window.gsap !== "undefined" &&
        typeof window.ScrollTrigger !== "undefined";

    let introFinished = false;
    let introTimeline = null;

    /**
     * Desbloquea el scroll y elimina la introducción.
     */
    const finishIntro = () => {
        if (introFinished) {
            return;
        }

        introFinished = true;

        document.body.classList.remove("intro-active");

        if (!hasGSAP) {
            intro.remove();
            return;
        }

        gsap.to(intro, {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
                intro.remove();

                ScrollTrigger.refresh();

                window.scrollTo({
                    top: 0,
                    behavior: "instant"
                });
            }
        });
    };

    /**
     * Intro cinematográfica.
     */
    const createIntro = () => {
        if (!hasGSAP) {
            finishIntro();
            return;
        }

        gsap.set(
            [
                ".intro-heart",
                ".intro-hello",
                ".intro-message",
                ".intro-final"
            ],
            {
                autoAlpha: 0,
                y: 20
            }
        );

        introTimeline = gsap.timeline({
            defaults: {
                ease: "power2.out"
            },
            onComplete: finishIntro
        });

        introTimeline
            // Pantalla negra inicial
            .to({}, { duration: 1.2 })

            // Corazón
            .to(".intro-heart", {
                autoAlpha: 1,
                y: 0,
                duration: 1.1
            })
            .to(".intro-heart", {
                scale: 1.06,
                duration: 1.2,
                ease: "sine.inOut"
            })
            .to(".intro-heart", {
                autoAlpha: 0,
                y: -14,
                duration: 0.8
            })

            // Hola
            .to(".intro-hello", {
                autoAlpha: 1,
                y: 0,
                duration: 1
            })
            .to({}, { duration: 1.2 })
            .to(".intro-hello", {
                autoAlpha: 0,
                y: -14,
                duration: 0.8
            })

            // Mensaje
            .to(".intro-message", {
                autoAlpha: 1,
                y: 0,
                duration: 1
            })
            .to({}, { duration: 1.5 })
            .to(".intro-message", {
                autoAlpha: 0,
                y: -14,
                duration: 0.8
            })

            // Indicación final
            .to(".intro-final", {
                autoAlpha: 1,
                y: 0,
                duration: 1
            })
            .fromTo(
                ".intro-arrow span",
                {
                    y: 0,
                    opacity: 1
                },
                {
                    y: 18,
                    opacity: 0,
                    duration: 1.2,
                    repeat: 1,
                    ease: "power1.inOut"
                },
                "<"
            )
            .to({}, { duration: 1.8 })
            .to(".intro-final", {
                autoAlpha: 0,
                y: -10,
                duration: 0.7
            });
    };

    /**
     * Animaciones del contenido al hacer scroll.
     */
    const createScrollAnimations = () => {
        if (!hasGSAP) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const revealElements = gsap.utils.toArray(".reveal");

        revealElements.forEach((element) => {
            gsap.fromTo(
                element,
                {
                    autoAlpha: 0,
                    y: 48
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 1.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 84%",
                        once: true
                    }
                }
            );
        });

        gsap.to(".background-glow-one", {
            xPercent: 24,
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: "#experience",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.4
            }
        });

        gsap.to(".background-glow-two", {
            xPercent: -22,
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
                trigger: "#experience",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.6
            }
        });
    };

    /**
     * Actualiza la barra superior de progreso.
     */
    const updateProgressBar = () => {
        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress =
            scrollableHeight > 0
                ? (window.scrollY / scrollableHeight) * 100
                : 0;

        if (hasGSAP) {
            gsap.set(progressBar, {
                width: `${Math.min(progress, 100)}%`
            });
        } else {
            progressBar.style.width = `${Math.min(progress, 100)}%`;
        }
    };

    /**
     * Reinicia el recorrido.
     */
    const restartExperience = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    skipIntroButton.addEventListener("click", () => {
        if (introTimeline) {
            introTimeline.kill();
        }

        finishIntro();
    });

    restartButton.addEventListener("click", restartExperience);

    window.addEventListener("scroll", updateProgressBar, {
        passive: true
    });

    window.addEventListener("resize", updateProgressBar);

    createScrollAnimations();
    createIntro();
    updateProgressBar();
});xs