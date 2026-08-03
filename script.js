"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const intro =
        document.getElementById("intro");

    const skipIntroButton =
        document.getElementById("skipIntro");

    const progressBar =
        document.getElementById("progressBar");

    const musicButton =
        document.getElementById("musicButton");

    const musicButtonText =
        document.getElementById("musicButtonText");

    const backgroundMusic =
        document.getElementById("backgroundMusic");

    const arLink =
        document.getElementById("arLink");

    const arTransition =
        document.getElementById("arTransition");

    const videos =
        document.querySelectorAll(
            ".memory-video-element"
        );

    const hasGSAP =
        typeof window.gsap !== "undefined" &&
        typeof window.ScrollTrigger !== "undefined";

    let introFinished = false;
    let introTimeline = null;

    let musicIsPlaying = false;
    let musicFadeAnimation = null;

    let arLaunchStarted = false;

    /* =====================================================
       INTRODUCCIÓN
    ===================================================== */

    const showMusicButton = () => {
        if (!musicButton) {
            return;
        }

        musicButton.classList.add(
            "is-visible"
        );

        if (hasGSAP) {
            gsap.fromTo(
                musicButton,
                {
                    autoAlpha: 0,
                    y: -12
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        }
    };

    const finishIntro = () => {
        if (introFinished) {
            return;
        }

        introFinished = true;

        document.body.classList.remove(
            "intro-active"
        );

        if (!hasGSAP) {
            intro?.remove();
            showMusicButton();
            return;
        }

        gsap.to(intro, {
            autoAlpha: 0,
            duration: 1.25,
            ease: "power2.inOut",

            onComplete: () => {
                intro?.remove();

                ScrollTrigger.refresh();

                window.scrollTo({
                    top: 0,
                    behavior: "auto"
                });

                showMusicButton();
            }
        });
    };

    const createIntro = () => {
        if (!hasGSAP) {
            finishIntro();
            return;
        }

        gsap.set(
            [
                ".intro-heart",
                ".intro-story",
                ".intro-change",
                ".intro-final-message",
                ".intro-instruction"
            ],
            {
                autoAlpha: 0,
                y: 24
            }
        );

        introTimeline = gsap.timeline({
            defaults: {
                ease: "power3.out"
            },

            onComplete: finishIntro
        });

        introTimeline
            .to({}, {
                duration: 1.3
            })

            .to(".intro-heart", {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.1
            })

            .to(".intro-heart", {
                scale: 1.08,
                duration: 1.1,
                ease: "sine.inOut"
            })

            .to(".intro-heart", {
                autoAlpha: 0,
                y: -14,
                duration: 0.75
            })

            .to(".intro-story", {
                autoAlpha: 1,
                y: 0,
                duration: 1
            })

            .to({}, {
                duration: 1.15
            })

            .to(".intro-story", {
                autoAlpha: 0,
                y: -14,
                duration: 0.75
            })

            .to(".intro-change", {
                autoAlpha: 1,
                y: 0,
                duration: 1
            })

            .to({}, {
                duration: 1.3
            })

            .to(".intro-change", {
                autoAlpha: 0,
                y: -14,
                duration: 0.75
            })

            .to(".intro-final-message", {
                autoAlpha: 1,
                y: 0,
                duration: 1.1
            })

            .to({}, {
                duration: 1.6
            })

            .to(".intro-final-message", {
                autoAlpha: 0,
                y: -14,
                duration: 0.8
            })

            .to(".intro-instruction", {
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
                    duration: 1.15,
                    repeat: 1,
                    ease: "power1.inOut"
                },
                "<"
            )

            .to({}, {
                duration: 1.5
            })

            .to(".intro-instruction", {
                autoAlpha: 0,
                y: -10,
                duration: 0.7
            });
    };

    /* =====================================================
       MÚSICA
    ===================================================== */

    const stopMusicFade = () => {
        if (!musicFadeAnimation) {
            return;
        }

        cancelAnimationFrame(
            musicFadeAnimation
        );

        musicFadeAnimation = null;
    };

    const fadeMusicTo = (
        targetVolume,
        duration = 1000,
        pauseAtEnd = false
    ) => {
        if (!backgroundMusic) {
            return;
        }

        stopMusicFade();

        const startingVolume =
            backgroundMusic.volume;

        const volumeDifference =
            targetVolume - startingVolume;

        const startingTime =
            performance.now();

        const updateVolume = (
            currentTime
        ) => {
            const progress =
                Math.min(
                    (
                        currentTime -
                        startingTime
                    ) / duration,
                    1
                );

            const easedProgress =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );

            backgroundMusic.volume =
                Math.min(
                    Math.max(
                        startingVolume +
                        volumeDifference *
                        easedProgress,
                        0
                    ),
                    1
                );

            if (progress < 1) {
                musicFadeAnimation =
                    requestAnimationFrame(
                        updateVolume
                    );

                return;
            }

            musicFadeAnimation = null;

            if (pauseAtEnd) {
                backgroundMusic.pause();
            }
        };

        musicFadeAnimation =
            requestAnimationFrame(
                updateVolume
            );
    };

    const updateMusicButton = (
        isPlaying
    ) => {
        musicIsPlaying = isPlaying;

        musicButton?.classList.toggle(
            "is-playing",
            isPlaying
        );

        musicButton?.setAttribute(
            "aria-pressed",
            String(isPlaying)
        );

        musicButton?.setAttribute(
            "aria-label",
            isPlaying
                ? "Pausar música"
                : "Reproducir música"
        );

        if (musicButtonText) {
            musicButtonText.textContent =
                isPlaying
                    ? "Pausar música"
                    : "Escuchar con música";
        }

        document.body.classList.toggle(
            "music-active",
            isPlaying
        );
    };

    const playMusic = async () => {
        if (!backgroundMusic) {
            return;
        }

        try {
            stopMusicFade();

            backgroundMusic.volume = 0;

            await backgroundMusic.play();

            updateMusicButton(true);

            fadeMusicTo(
                0.24,
                1800
            );
        } catch (error) {
            updateMusicButton(false);

            if (musicButtonText) {
                musicButtonText.textContent =
                    "Toca otra vez";
            }

            console.error(
                "No fue posible reproducir la música:",
                error
            );
        }
    };

    const pauseMusic = () => {
        updateMusicButton(false);

        fadeMusicTo(
            0,
            700,
            true
        );
    };

    const toggleMusic = () => {
        if (musicIsPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    };

    musicButton?.addEventListener(
        "click",
        toggleMusic
    );

    backgroundMusic?.addEventListener(
        "error",
        () => {
            updateMusicButton(false);

            if (musicButtonText) {
                musicButtonText.textContent =
                    "No se encontró la canción";
            }
        }
    );

    /* =====================================================
       ANIMACIONES DE SCROLL
    ===================================================== */

    const createScrollAnimations = () => {
        if (!hasGSAP) {
            return;
        }

        gsap.registerPlugin(
            ScrollTrigger
        );

        gsap.utils
            .toArray(".reveal")
            .forEach((element) => {
                gsap.fromTo(
                    element,
                    {
                        autoAlpha: 0,
                        y: 52
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

        gsap.to(".glow-one", {
            xPercent: 28,
            yPercent: 18,
            ease: "none",

            scrollTrigger: {
                trigger: "#experience",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });

        gsap.to(".glow-two", {
            xPercent: -25,
            yPercent: -20,
            ease: "none",

            scrollTrigger: {
                trigger: "#experience",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.7
            }
        });

        gsap.to(".hero-orbit", {
            rotate: 18,
            scale: 1.1,
            opacity: 0.45,
            ease: "none",

            scrollTrigger: {
                trigger: ".hero-scene",
                start: "top top",
                end: "bottom top",
                scrub: 1.2
            }
        });

        gsap.to(".scroll-hint-line", {
            scaleY: 0.45,
            opacity: 0.25,
            transformOrigin: "top",
            duration: 1.3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        gsap.utils
            .toArray(".memory")
            .forEach((memory) => {
                const media =
                    memory.querySelector(
                        ".memory-media img, .memory-media video"
                    );

                if (!media) {
                    return;
                }

                gsap.fromTo(
                    media,
                    {
                        scale: 1.12,
                        yPercent: -4
                    },
                    {
                        scale: 1,
                        yPercent: 4,
                        ease: "none",

                        scrollTrigger: {
                            trigger: memory,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: 1.2
                        }
                    }
                );
            });

        gsap.to(".ar-button", {
            boxShadow:
                "0 20px 60px rgba(0, 0, 0, 0.35), 0 0 80px rgba(169, 199, 255, 0.35)",
            duration: 1.7,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    };

    /* =====================================================
       VIDEO DE RECUERDO
    ===================================================== */

    const createVideoObservers = () => {
        if (
            !(
                "IntersectionObserver"
                in window
            )
        ) {
            return;
        }

        const observer =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            const video =
                                entry.target;

                            if (
                                entry.isIntersecting
                            ) {
                                video
                                    .play()
                                    .catch(
                                        () => {}
                                    );
                            } else {
                                video.pause();
                            }
                        }
                    );
                },
                {
                    threshold: 0.45
                }
            );

        videos.forEach((video) => {
            observer.observe(video);
        });
    };

    /* =====================================================
       BARRA DE PROGRESO
    ===================================================== */

    const updateProgressBar = () => {
        const scrollableHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        const percentage =
            scrollableHeight > 0
                ? (
                    window.scrollY /
                    scrollableHeight
                ) * 100
                : 0;

        const safePercentage =
            Math.min(
                Math.max(
                    percentage,
                    0
                ),
                100
            );

        if (
            hasGSAP &&
            progressBar
        ) {
            gsap.set(
                progressBar,
                {
                    width:
                        `${safePercentage}%`
                }
            );

            return;
        }

        if (progressBar) {
            progressBar.style.width =
                `${safePercentage}%`;
        }
    };

    /* =====================================================
       REALIDAD AUMENTADA
    ===================================================== */

    const resetARTransition = () => {
        arTransition?.classList.remove(
            "is-active"
        );

        document.body.classList.remove(
            "ar-opening"
        );

        arLaunchStarted = false;

        if (
            musicIsPlaying &&
            backgroundMusic
        ) {
            fadeMusicTo(
                0.24,
                1200
            );
        }
    };

    const openARWithTransition = (
        event
    ) => {
        if (
            arLaunchStarted ||
            !arLink ||
            !arTransition
        ) {
            return;
        }

        event.preventDefault();

        arLaunchStarted = true;

        document.body.classList.add(
            "ar-opening"
        );

        if (musicIsPlaying) {
            fadeMusicTo(
                0.06,
                900
            );
        }

        const openQuickLook = () => {
            window.location.href =
                arLink.href;

            window.setTimeout(
                resetARTransition,
                1800
            );
        };

        if (hasGSAP) {
            arTransition.classList.add(
                "is-active"
            );

            gsap.fromTo(
                arTransition,
                {
                    autoAlpha: 0
                },
                {
                    autoAlpha: 1,
                    duration: 0.65,
                    ease: "power2.inOut"
                }
            );

            gsap.fromTo(
                "#arTransition p",
                {
                    autoAlpha: 0,
                    y: 18
                },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.25,
                    ease: "power2.out",

                    onComplete: () => {
                        window.setTimeout(
                            openQuickLook,
                            650
                        );
                    }
                }
            );

            return;
        }

        arTransition.classList.add(
            "is-active"
        );

        window.setTimeout(
            openQuickLook,
            1000
        );
    };

    arLink?.addEventListener(
        "click",
        openARWithTransition
    );

    document.addEventListener(
        "visibilitychange",
        () => {
            if (
                !document.hidden &&
                arLaunchStarted
            ) {
                resetARTransition();
            }
        }
    );

    window.addEventListener(
        "pageshow",
        () => {
            if (arLaunchStarted) {
                resetARTransition();
            }
        }
    );

    /* =====================================================
       BOTONES Y EVENTOS
    ===================================================== */

    skipIntroButton?.addEventListener(
        "click",
        () => {
            introTimeline?.kill();
            finishIntro();
        }
    );

    window.addEventListener(
        "scroll",
        updateProgressBar,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateProgressBar
    );

    /* =====================================================
       INICIO
    ===================================================== */

    createScrollAnimations();
    createVideoObservers();
    createIntro();
    updateProgressBar();
});