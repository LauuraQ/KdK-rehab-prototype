document.addEventListener("DOMContentLoaded", function () {

    // ==========================================================================
    // 1. ТАЙМЕР ОБРАТНОГО ОТСЧЕТА (50 MINUTES)
    // ==========================================================================
    const timerElement = document.getElementById("js-session-timer");
    let totalSeconds = 50 * 60; // 50 минут в секундах

    if (timerElement) {
        const countdown = setInterval(() => {
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = totalSeconds % 60;

            // Форматируем вызов (добавляем нули для префиксов)
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            timerElement.textContent = `${minutes}:${seconds}`;

            if (totalSeconds <= 0) {
                clearInterval(countdown);
                timerElement.textContent = "00:00";
                alert("Время консультации истекло. Сессия завершается.");
                window.location.href = "online-consultation.html"; // Возврат на витрину
            }

            totalSeconds--;
        }, 1000);
    }

    // ==========================================================================
    // 2. ИНТЕРАКТИВНЫЙ ТЕКСТОВЫЙ ЧАТ
    // ==========================================================================
    const chatForm = document.getElementById("js-chat-form");
    const messageInput = document.getElementById("js-message-input");
    const chatMessagesDisplay = document.getElementById("js-chat-messages");

    // Флаг для триггера эмуляции ответа врача
    let hasUserSentMessage = false;

    // Функция получения текущего времени в формате ЧЧ:ММ
    function getCurrentTimeStr() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutes}`;
    }

    // Функция автоскролла чата вниз
    function scrollToBottom() {
        if (chatMessagesDisplay) {
            chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight;
        }
    }

    if (chatForm && messageInput && chatMessagesDisplay) {
        chatForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const messageText = messageInput.value.trim();
            if (!messageText) return;

            // Строим пузырь исходящего сообщения (пользователь)
            const userMessageBubble = document.createElement("div");
            userMessageBubble.className = "message-bubble outgoing";

            userMessageBubble.innerHTML = `
                <div class="message-text">${messageText}</div>
                <div class="message-time">${getCurrentTimeStr()}</div>
            `;

            // Добавляем в чат и очищаем инпут
            chatMessagesDisplay.appendChild(userMessageBubble);
            messageInput.value = "";
            scrollToBottom();

            // Эмуляция реакции врача на первое сообщение пользователя
            if (!hasUserSentMessage) {
                hasUserSentMessage = true;
                simulateDoctorAction();
            }
        });
    }

    // ==========================================================================
    // 3. ЭМУЛЯЦИЯ ДЕЙСТВИЙ ВРАЧА (ПРИЕМ СИГНАЛА WebRTC)
    // ==========================================================================
    function simulateDoctorAction() {
        // Через 3 секунды после сообщения пользователя врач отвечает в чат
        setTimeout(() => {
            const doctorMessageBubble = document.createElement("div");
            doctorMessageBubble.className = "message-bubble incoming";

            doctorMessageBubble.innerHTML = `
                <div class="message-sender">Елена В. Романова</div>
                <div class="message-text">Спасибо, что поделились. Ситуация понятна, это классический маркер выгорания. Давайте попробуем сфокусироваться на заземляющих практиках. Я сейчас включу трансляцию.</div>
                <div class="message-time">${getCurrentTimeStr()}</div>
            `;

            chatMessagesDisplay.appendChild(doctorMessageBubble);
            scrollToBottom();

            // Еще через 2 секунды "подключается" видеокамера врача
            setTimeout(() => {
                const remoteStreamZone = document.getElementById("js-remote-stream");
                if (remoteStreamZone) {
                    // Скрываем заглушку загрузки P2P соединения
                    const loadingOverlay = remoteStreamZone.querySelector(".stream-loading-overlay");
                    if (loadingOverlay) {
                        loadingOverlay.style.display = "none";
                    }

                    // Меняем фон зоны, имитируя появление видеопотока
                    remoteStreamZone.style.backgroundImage = "url('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop')";
                    remoteStreamZone.style.backgroundSize = "cover";
                    remoteStreamZone.style.backgroundPosition = "center";
                }
            }, 2000);

        }, 3000);
    }

    // ==========================================================================
    // 4. УПРАВЛЕНИЕ КНОПКАМИ ТУЛБАРА (MUTE / CAMERA / DISCONNECT)
    // ==========================================================================
    const toggleAudioBtn = document.getElementById("js-toggle-audio");
    const toggleVideoBtn = document.getElementById("js-toggle-video");
    const disconnectBtn = document.getElementById("js-disconnect-call");
    const localPreview = document.getElementById("js-local-preview");

    // Вкл/Выкл микрофона
    if (toggleAudioBtn) {
        toggleAudioBtn.addEventListener("click", function () {
            this.classList.toggle("active");
            // В реальном WebRTC тут было бы: stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        });
    }

    // Вкл/Выкл собственной камеры
    if (toggleVideoBtn && localPreview) {
        toggleVideoBtn.addEventListener("click", function () {
            this.classList.toggle("active");

            if (this.classList.contains("active")) {
                // Имитируем включение селфи-камеры (заменяем заглушку на фон)
                localPreview.innerHTML = `<div class="doctor-overlay-badge" style="bottom: 10px; left: 10px;">Вы</div>`;
                localPreview.style.backgroundImage = "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop')";
                localPreview.style.backgroundSize = "cover";
            } else {
                // Возвращаем состояние "Камера выключена"
                localPreview.style.backgroundImage = "none";
                localPreview.innerHTML = `
                    <div class="camera-off-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        <span>Ваша камера выключена</span>
                    </div>
                `;
            }
        });
    }

    // Кнопка Сброса / Выхода из сессии
    if (disconnectBtn) {
        disconnectBtn.addEventListener("click", function () {
            if (confirm("Вы уверены, что хотите завершить сессию? Все незащищенные данные чата будут безвозвратно удалены.")) {
                window.location.href = "online-consultation.html"; // Перенаправление назад на страницу выбора врачей
            }
        });
    }
});