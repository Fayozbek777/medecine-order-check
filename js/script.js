// script.js
document.addEventListener("DOMContentLoaded", function () {
  const checkFaq = setInterval(function () {
    const questions = document.querySelectorAll(".faq-question");

    if (questions.length > 0) {
      clearInterval(checkFaq);

      questions.forEach(function (btn) {
        btn.addEventListener("click", function () {
          const item = this.closest(".faq-item");
          const isActive = item.classList.contains("active");

          document.querySelectorAll(".faq-item").forEach(function (el) {
            el.classList.remove("active");
          });

          if (!isActive) {
            item.classList.add("active");
          }
        });
      });

      const firstItem = document.querySelector(".faq-item");
      if (firstItem) {
        firstItem.classList.add("active");
      }
    }
  }, 300);

  const checkForm = setInterval(function () {
    const phoneInput = document.getElementById("userPhone");
    if (phoneInput) {
      clearInterval(checkForm);
      initPhoneMask();
      initForm();
      initToast();
    }
  }, 300);

  function initPhoneMask() {
    const phoneInput = document.getElementById("userPhone");

    phoneInput.addEventListener("input", function (e) {
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
        this.closest(".form-group").classList.add("error");
      } else {
        this.classList.remove("error");
        this.closest(".form-group").classList.remove("error");
      }
    });
  }

  function initForm() {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      const name = document.getElementById("userName");
      if (!name.value.trim() || name.value.trim().length < 2) {
        name.classList.add("error");
        name.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        name.classList.remove("error");
        name.closest(".form-group").classList.remove("error");
      }

      const phone = document.getElementById("userPhone");
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length < 11) {
        phone.classList.add("error");
        phone.closest(".form-group").classList.add("error");
        isValid = false;
      } else {
        phone.classList.remove("error");
        phone.closest(".form-group").classList.remove("error");
      }

      const agree = document.getElementById("userAgree");
      if (!agree.checked) {
        agree.closest(".checkbox-group").classList.add("error");
        isValid = false;
      } else {
        agree.closest(".checkbox-group").classList.remove("error");
      }

      if (!isValid) {
        showToast(
          "Ошибка",
          "Пожалуйста, заполните все обязательные поля",
          "error",
        );
        return;
      }

      const formData = {
        name: name.value.trim(),
        phone: phone.value.trim(),
        city: document.getElementById("userCity").value.trim(),
        message: document.getElementById("userMessage").value.trim(),
        agree: agree.checked,
      };

      console.log("📤 Отправка данных:", formData);

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
      btn.disabled = true;

      setTimeout(function () {
        showToast(
          "Успешно!",
          "Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.",
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

  function initToast() {
    const closeBtn = document.getElementById("toastClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        document.getElementById("toast").classList.remove("show");
      });
    }
  }

  function showToast(title, message, type) {
    const toast = document.getElementById("toast");
    const toastIcon = document.getElementById("toastIcon");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");

    toast.className = "toast";
    if (type === "error") {
      toast.classList.add("error");
      toastIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    } else {
      toastIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    }

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(function () {
      toast.classList.remove("show");
    }, 5000);
  }
});
