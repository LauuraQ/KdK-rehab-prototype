// Универсальный и безопасный скрипт для кликов (FAQ и Квиз) через делегирование
document.addEventListener('click', (event) => {

    // === ЛОГИКА ДЛЯ FAQ АККОРДЕОНА ===
    const question = event.target.closest('.faq-item__question') || event.target.closest('.faq-question');

    if (question) {
        const currentItem = question.closest('.faq-item');
        if (currentItem) {
            const allItems = document.querySelectorAll('.faq-item');
            allItems.forEach(item => {
                if (item !== currentItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                }
            });
            currentItem.classList.toggle('active');
        }
        return;
    }

    // === ЛОГИКА ДЛЯ КВИЗА-КОНВЕРТЕРА ===
    const nextBtn = event.target.closest('#quiz-btn-next');
    const prevBtn = event.target.closest('#quiz-btn-prev');

    if (nextBtn || prevBtn) {
        const quizForm = document.getElementById('rehab-quiz-form');
        if (!quizForm) return;

        const steps = quizForm.querySelectorAll('.quiz-step');
        const currentStepText = document.getElementById('quiz-current-step');
        const progressBarFill = document.getElementById('quiz-progress-fill');

        // Элементы интерактивного калькулятора в сайдбаре
        const calcStatusLevel = document.getElementById('calc-status-level');
        const calcStatusText = document.getElementById('calc-status-text');
        const calcRegimenText = document.getElementById('calc-regimen-text');

        let activeStepNum = 1;
        let activeStepEl = null;

        steps.forEach(step => {
            if (step.classList.contains('active')) {
                activeStepNum = parseInt(step.getAttribute('data-step'));
                activeStepEl = step;
            }
        });

        if (nextBtn) {
            if (activeStepNum < 4) {
                activeStepEl.classList.remove('active');
                const nextStepEl = quizForm.querySelector(`.quiz-step[data-step="${activeStepNum + 1}"]`);
                if (nextStepEl) nextStepEl.classList.add('active');
                activeStepNum++;
            }
        } else if (prevBtn) {
            if (activeStepNum > 1) {
                activeStepEl.classList.remove('active');
                const prevStepEl = quizForm.querySelector(`.quiz-step[data-step="${activeStepNum - 1}"]`);
                if (prevStepEl) prevStepEl.classList.add('active');
                activeStepNum--;
            }
        }

        // Обновляем прогресс-бар и счетчик шагов квиза
        if (currentStepText) currentStepText.textContent = activeStepNum;
        if (progressBarFill) {
            const progressPercent = activeStepNum === 4 ? 100 : activeStepNum * 25;
            progressBarFill.style.width = `${progressPercent}%`;
        }

        // ДИНАМИЧЕСКИЙ РАСЧЕТ ДЛЯ САЙДБАРА НА ОСНОВЕ ТЕКУЩЕГО ШАГА
        if (calcStatusLevel && calcStatusText && calcRegimenText) {
            if (activeStepNum === 1) {
                calcStatusLevel.style.width = '25%';
                calcStatusLevel.style.backgroundColor = '#10B981'; // Зеленый
                calcStatusText.textContent = 'Начальная';
                calcStatusText.style.color = '#10B981';
                calcRegimenText.textContent = 'Амбулаторный / Экспресс-вытрезвление';
            } else if (activeStepNum === 2) {
                calcStatusLevel.style.width = '55%';
                calcStatusLevel.style.backgroundColor = '#F59E0B'; // Оранжевый
                calcStatusText.textContent = 'Средняя (выраженная аддикция)';
                calcStatusText.style.color = '#F59E0B';
                calcRegimenText.textContent = 'Медикаментозный детокс + Мотивационные сессии';
            } else if (activeStepNum === 3) {
                calcStatusLevel.style.width = '85%';
                calcStatusLevel.style.backgroundColor = '#EF4444'; // Красный
                calcStatusText.textContent = 'Высокая (требуется интервенция)';
                calcStatusText.style.color = '#EF4444';
                calcRegimenText.textContent = 'Закрытый стационар + Психологическое принуждение (метод убеждения)';
            } else if (activeStepNum === 4) {
                calcStatusLevel.style.width = '100%';
                calcStatusLevel.style.backgroundColor = '#7C3AED'; // Фиолетовый
                calcStatusText.textContent = 'Комплексная оценка сформирована';
                calcStatusText.style.color = '#7C3AED';
                calcRegimenText.textContent = 'Полная индивидуальная программа (Детокс + Реабилитация)';
            }
        }

        // Управление кнопками навигации
        const btnPrevReal = document.getElementById('quiz-btn-prev');
        const btnNextReal = document.getElementById('quiz-btn-next');

        if (btnPrevReal && btnNextReal) {
            btnPrevReal.disabled = activeStepNum === 1;
            if (activeStepNum === 4) {
                btnNextReal.style.display = 'none';
                btnPrevReal.style.display = 'none';
            } else {
                btnNextReal.style.display = 'block';
                btnPrevReal.style.display = 'block';
            }
        }
    }
});