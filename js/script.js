document.addEventListener("DOMContentLoaded", function () {
  function animateNumbers() {
    const statNumbers = document.querySelectorAll(".stat-number");

    if (statNumbers.length === 0) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute("data-target"));

            if (!target || isNaN(target)) return;

            const duration = 2000;
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

    statNumbers.forEach(function (el) {
      observer.observe(el);
    });
  }

  setTimeout(animateNumbers, 300);

  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length > 0) {
    faqItems.forEach(function (item) {
      const question = item.querySelector(".faq-question");
      if (question) {
        question.addEventListener("click", function () {
          const parent = this.closest(".faq-item");
          const isActive = parent.classList.contains("active");

          faqItems.forEach(function (el) {
            el.classList.remove("active");
          });

          if (!isActive) {
            parent.classList.add("active");
          }
        });
      }
    });

    if (faqItems[0]) {
      faqItems[0].classList.add("active");
    }
  }

  const phoneInput = document.getElementById("userPhone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      let value = this.value.replace(/\D/g, "");
      if (value.length === 0) {
        this.value = "";
        return;
      }

      let formatted = "";
      if (value.length <= 1) {
        formatted = "+" + value;
      } else if (value.length <= 4) {
        formatted = "+" + value.substring(0, 1) + " (" + value.substring(1);
      } else if (value.length <= 7) {
        formatted =
          "+" +
          value.substring(0, 1) +
          " (" +
          value.substring(1, 4) +
          ") " +
          value.substring(4);
      } else if (value.length <= 9) {
        formatted =
          "+" +
          value.substring(0, 1) +
          " (" +
          value.substring(1, 4) +
          ") " +
          value.substring(4, 7) +
          "-" +
          value.substring(7);
      } else {
        formatted =
          "+" +
          value.substring(0, 1) +
          " (" +
          value.substring(1, 4) +
          ") " +
          value.substring(4, 7) +
          "-" +
          value.substring(7, 9) +
          "-" +
          value.substring(9, 11);
      }
      this.value = formatted;
    });

    phoneInput.addEventListener("blur", function () {
      const digits = this.value.replace(/\D/g, "");
      if (digits.length < 11) {
        this.classList.add("error");
        this.closest(".form-group")?.classList.add("error");
      } else {
        this.classList.remove("error");
        this.closest(".form-group")?.classList.remove("error");
      }
    });
  }

  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      let isValid = true;

      const name = document.getElementById("userName");
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add("error");
        name.closest(".form-group")?.classList.add("error");
        isValid = false;
      } else {
        name.classList.remove("error");
        name.closest(".form-group")?.classList.remove("error");
      }

      const phone = document.getElementById("userPhone");
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 11) {
        phone.classList.add("error");
        phone.closest(".form-group")?.classList.add("error");
        isValid = false;
      } else {
        phone.classList.remove("error");
        phone.closest(".form-group")?.classList.remove("error");
      }

      const agree = document.getElementById("userAgree");
      if (!agree.checked) {
        agree.closest(".checkbox-group")?.classList.add("error");
        isValid = false;
      } else {
        agree.closest(".checkbox-group")?.classList.remove("error");
      }

      if (!isValid) {
        showToast("Ошибка", "Заполните все обязательные поля", "error");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
      btn.disabled = true;

      const formData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        city: document.getElementById("userCity")?.value.trim() || "",
        message: document.getElementById("userMessage")?.value.trim() || "",
        agree: agree.checked,
      };

      console.log("📤 Отправка данных:", formData);

      setTimeout(function () {
        showToast(
          "Успешно!",
          "Заявка отправлена. Мы свяжемся с вами.",
          "success",
        );
        form.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;

        document.querySelectorAll(".form-group.error").forEach(function (el) {
          el.classList.remove("error");
        });
        document
          .querySelectorAll("input.error, textarea.error")
          .forEach(function (el) {
            el.classList.remove("error");
          });
      }, 1500);
    });
  }

  function showToast(title, message, type) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    const toastIcon = document.getElementById("toastIcon");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");

    toast.className = "toast";
    if (type === "error") {
      toast.classList.add("error");
      if (toastIcon)
        toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    } else {
      if (toastIcon)
        toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    }

    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 5000);
  }

  const closeBtn = document.getElementById("toastClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      document.getElementById("toast")?.classList.remove("show");
    });
  }

  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
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

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
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

    window.addEventListener("resize", function () {
      if (window.lenis) {
        window.lenis.resize();
      }
    });
  }

  document.addEventListener("click", function (e) {
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
});
