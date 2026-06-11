document.addEventListener("DOMContentLoaded", function () {
    const feedbackForm = document.getElementById("js-feedback-form");
    const successMessage = document.getElementById("js-fb-success");
    const submitBtn = document.getElementById("js-fb-submit");

    if (feedbackForm && successMessage) {
        feedbackForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Предотвращаем классическую перезагрузку страницы

            // Визуально блокируем кнопку на время отправки
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Отправка...";
            }

            // Сбор данных из полей (для будущей интеграции с бэкендом)
            const formData = {
                name: document.getElementById("fb-name").value,
                phone: document.getElementById("fb-phone").value,
                email: document.getElementById("fb-email").value,
                message: document.getElementById("fb-message").value
            };

            console.log("Данные формы подготовлены к отправке:", formData);

            // Эмуляция задержки сервера (сеть) в 1 секунду
            setTimeout(() => {
                // Плавное появление экрана с благодарностью
                successMessage.style.opacity = "0";
                successMessage.style.display = "flex";

                setTimeout(() => {
                    successMessage.style.transition = "opacity 0.3s ease";
                    successMessage.style.opacity = "1";
                }, 50);

                // Очищаем форму
                feedbackForm.reset();
            }, 1000);
        });
    }
});