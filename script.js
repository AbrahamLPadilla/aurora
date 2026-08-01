// Inicializar GSAP
gsap.registerPlugin(ScrollTrigger);

// Animación del título
gsap.from(".hero h1", {
    opacity: 0,
    y: 80,
    duration: 1.5,
    ease: "power3.out"
});

// Animación del subtítulo
gsap.from(".hero p", {
    opacity: 0,
    y: 30,
    delay: 0.6,
    duration: 1.2,
    ease: "power3.out"
});

// Animación de cada sección al hacer scroll
gsap.utils.toArray(".message").forEach((section) => {
    gsap.from(section, {
        opacity: 0,
        y: 80,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none none"
        }
    });
});

// Barra de progreso
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / height) * 100;

    gsap.to("#progressBar", {
        width: progress + "%",
        duration: 0.15,
        ease: "none"
    });
});

// Botón AR
document.getElementById("arButton").addEventListener("click", () => {
    window.location.href = "models/sorpresa.usdz";
});