// fetch.js
document.addEventListener("DOMContentLoaded", () => {
  const components = document.querySelectorAll("[data-component]");

  const loadComponent = async (element) => {
    const path = element.getAttribute("data-component");
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Не удалось загрузить: ${path}`);
      const html = await response.text();
      element.innerHTML = html;
    } catch (error) {
      console.error("Ошибка при сборке страницы:", error);
    }
  };

  components.forEach((el) => loadComponent(el));

  document.addEventListener("click", (e) => {
    const toggleBtn = e.target.closest(".nav-toggle");
    const menuWrapper = document.querySelector(".nav-menu-wrapper");
    const overlay = document.querySelector(".nav-overlay");

    if (toggleBtn) {
      if (menuWrapper) {
        toggleBtn.classList.toggle("active");
        menuWrapper.classList.toggle("active");
        if (overlay) overlay.classList.toggle("active");
        document.body.style.overflow = menuWrapper.classList.contains("active")
          ? "hidden"
          : "";
      }
      return;
    }

    if (!menuWrapper || !menuWrapper.classList.contains("active")) return;

    const isLink =
      e.target.closest(".nav-link") ||
      e.target.closest(".nav-btn") ||
      e.target.closest(".nav-logo");
    const isClickOutside =
      !menuWrapper.contains(e.target) || e.target.closest(".nav-overlay");

    if (isLink || isClickOutside) {
      const activeToggle = document.querySelector(".nav-toggle");
      if (activeToggle) activeToggle.classList.remove("active");
      menuWrapper.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        lenis.scrollTo(target, {
          offset: -80,
          duration: 1.5,
        });
      }
    });
  });

  function animateNumbers() {
    const statNumbers = document.querySelectorAll(".stat-number");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"));
            const duration = 2500;
            const startTime = performance.now();

            function easeOut(t) {
              return 1 - Math.pow(1 - t, 3);
            }

            function updateNumber(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easedProgress = easeOut(progress);
              const current = Math.floor(easedProgress * target);
              el.textContent = current;
              if (progress < 1) {
                requestAnimationFrame(updateNumber);
              } else {
                el.textContent = target;
              }
            }
            requestAnimationFrame(updateNumber);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.3 },
    );
    statNumbers.forEach((el) => observer.observe(el));
  }

  setTimeout(() => {
    animateNumbers();
  }, 500);
});

window.addEventListener("resize", () => {
  if (window.lenis) {
    window.lenis.resize();
  }
});
