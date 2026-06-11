document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================================
    // ЛОГИКА 1: ОСНОВНАЯ ФОРМА ОБРАТНОЙ СВЯЗИ (СТАРАЯ)
    // ==========================================================================
    const feedbackForm = document.getElementById("js-feedback-form");
    const successMessage = document.getElementById("js-fb-success");
    const submitBtn = document.getElementById("js-fb-submit");

    if (feedbackForm && successMessage) {
        feedbackForm.addEventListener("submit", function (e) {
            e.preventDefault();

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Отправка...";
            }

            const formData = {
                name: document.getElementById("fb-name").value,
                phone: document.getElementById("fb-phone").value,
                email: document.getElementById("fb-email").value,
                message: document.getElementById("fb-message").value
            };

            console.log("Данные основной формы подготовлены к отправке:", formData);

            setTimeout(() => {
                successMessage.style.opacity = "0";
                successMessage.style.display = "flex";

                setTimeout(() => {
                    successMessage.style.transition = "opacity 0.3s ease";
                    successMessage.style.opacity = "1";
                }, 50);

                feedbackForm.reset();
            }, 1000);
        });
    }

    // ==========================================================================
    // ЛОГИКА 2: МОДАЛЬНОЕ ОКНО И ФОРМА ДЛЯ FAQ "ЗАДАТЬ ВОПРОС ЛИЧНО"
    // ==========================================================================
    const openModalBtn = document.querySelector(".sidebar-phone-btn"); // Наша кнопка в сайдбаре FAQ
    const modalOverlay = document.getElementById("js-faq-modal");
    const closeModalBtn = document.getElementById("js-modal-close");

    const faqFormWrapper = document.getElementById("js-modal-form-wrapper");
    const faqForm = document.getElementById("js-faq-feedback-form");
    const faqSuccessMessage = document.getElementById("js-faq-fb-success");
    const faqSubmitBtn = document.getElementById("js-faq-fb-submit");

    // Открытие модального окна
    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener("click", function (e) {
            e.preventDefault(); // Запрещаем переход по ссылке-заглушке

            // Сбрасываем состояния окон внутри модалки (если открывают повторно)
            faqFormWrapper.style.display = "block";
            faqSuccessMessage.style.display = "none";
            if (faqSubmitBtn) {
                faqSubmitBtn.disabled = false;
                faqSubmitBtn.textContent = "Отправить вопрос";
            }

            modalOverlay.classList.add("is-active");
        });
    }

    // Закрытие модального окна при клике на крестик
    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener("click", function () {
            modalOverlay.classList.remove("is-active");
        });
    }

    // Закрытие модального окна при клике на темную область вокруг него
    if (modalOverlay) {
        modalOverlay.addEventListener("click", function (e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove("is-active");
            }
        });
    }

    // Отправка формы внутри модального окна
    if (faqForm && faqSuccessMessage) {
        faqForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Визуально блокируем кнопку
            if (faqSubmitBtn) {
                faqSubmitBtn.disabled = true;
                faqSubmitBtn.textContent = "Отправка...";
            }

            // Сбор данных
            const faqFormData = {
                name: document.getElementById("faq-fb-name").value,
                phone: document.getElementById("faq-fb-phone").value,
                message: document.getElementById("faq-fb-message").value
            };

            console.log("Данные из FAQ-модалки подготовлены к отправке:", faqFormData);

            // Эмуляция ответа сервера (1 секунда)
            setTimeout(() => {
                // Скрываем обертку с формой
                faqFormWrapper.style.display = "none";

                // Плавное появление экрана с благодарностью (как в твоем примере)
                faqSuccessMessage.style.opacity = "0";
                faqSuccessMessage.style.display = "flex";

                setTimeout(() => {
                    faqSuccessMessage.style.transition = "opacity 0.3s ease";
                    faqSuccessMessage.style.opacity = "1";
                }, 50);

                // Очищаем поля формы
                faqForm.reset();
            }, 1000);
        });
    }
});