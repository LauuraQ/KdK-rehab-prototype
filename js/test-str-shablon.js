document.addEventListener("DOMContentLoaded", function () {
    // 1. Извлекаем название теста из URL (?type=audit)
    const urlParams = new URLSearchParams(window.location.search);
    const quizType = urlParams.get('type') || 'audit';

    // Динамически формируем путь к конкретному файлу теста
    const jsonUrl = `./json-tests/${quizType}.json`;

    let quizData = null; // Переменная для хранения полных данных текущего теста
    let quizQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = {};

    // DOM Элементы
    const btnStart = document.getElementById("js-quiz-start");
    const btnNext = document.getElementById("js-quiz-next");
    const btnPrev = document.getElementById("js-quiz-prev");
    const stepIntro = document.getElementById("step-intro");
    const stepQuestions = document.getElementById("step-questions");
    const stepResults = document.getElementById("step-results");
    const questionContainer = document.getElementById("quiz-question-container");
    const currentQuestionNumTxt = document.getElementById("current-question-num");
    const totalQuestionsNumTxt = document.getElementById("total-questions-num");
    const progressPercentTxt = document.getElementById("quiz-progress-percent");
    const progressFill = document.getElementById("quiz-progress-fill");

    // Блокируем кнопку старта до загрузки данных
    if (btnStart) btnStart.disabled = true;

    // 2. Асинхронный запрос к конкретному файлу (например, ./json-tests/audit.json)
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Файл теста ${quizType}.json не найден`);
            }
            return response.json();
        })
        .then(data => {
            // Сохраняем весь объект данных (он нужен для интервалов результатов)
            quizData = data;
            // Записываем массив вопросов
            quizQuestions = data.questions;

            // Наполняем контент интро-экрана
            document.querySelector(".quiz-main-title").textContent = data.title;
            document.querySelector(".quiz-description").textContent = data.description;
            if (totalQuestionsNumTxt) totalQuestionsNumTxt.textContent = quizQuestions.length;

            // Активируем кнопку старта
            if (btnStart) btnStart.disabled = false;
        })
        .catch(error => {
            console.error("Ошибка загрузки:", error);
            document.querySelector(".quiz-main-title").textContent = "Ошибка: Тест не найден";
            document.querySelector(".quiz-description").textContent = "Убедитесь, что файл с данным тестом существует в папке json-tests.";
        });

    // 3. Интерактивная логика шагов квиза
    if (btnStart) {
        btnStart.addEventListener("click", function () {
            if (quizQuestions.length === 0) return;
            stepIntro.classList.remove("active");
            stepQuestions.classList.add("active");
            renderQuestion();
        });
    }

    function renderQuestion() {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        currentQuestionNumTxt.textContent = currentQuestionIndex + 1;

        const percent = Math.round((currentQuestionIndex / quizQuestions.length) * 100);
        progressPercentTxt.textContent = `${percent}%`;
        progressFill.style.width = `${percent}%`;

        let answersHtml = "";
        currentQuestion.answers.forEach((ans) => {
            const isChecked = userAnswers[currentQuestionIndex] !== undefined && userAnswers[currentQuestionIndex] === ans.points ? "checked" : "";
            answersHtml += `
                <label class="quiz-answer-option">
                    <input type="radio" name="quiz-answer" value="${ans.points}" class="quiz-answer-input" ${isChecked}>
                    <span class="quiz-answer-text">${ans.text}</span>
                </label>
            `;
        });

        questionContainer.innerHTML = `
            <h3 class="quiz-question-title">${currentQuestion.title}</h3>
            <div class="quiz-answers">${answersHtml}</div>
        `;

        btnPrev.disabled = currentQuestionIndex === 0;
        btnNext.disabled = userAnswers[currentQuestionIndex] === undefined;

        const inputs = questionContainer.querySelectorAll(".quiz-answer-input");
        inputs.forEach(input => {
            input.addEventListener("change", function () {
                userAnswers[currentQuestionIndex] = parseInt(this.value);
                btnNext.disabled = false;
            });
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", function () {
            if (currentQuestionIndex < quizQuestions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                showResults();
            }
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", function () {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        });
    }

    // 4. Отображение результатов на основе диапазонов из JSON
    function showResults() {
        stepQuestions.classList.remove("active");
        stepResults.classList.add("active");

        let totalScore = 0;
        for (let key in userAnswers) {
            totalScore += userAnswers[key];
        }

        const scoreZone = document.getElementById("quiz-score-zone");
        const resText = document.getElementById("quiz-result-text");

        document.getElementById("quiz-result-points").textContent = `Набрано баллов: ${totalScore}`;
        scoreZone.className = "quiz-score-zone"; // Сбрасываем старые модификаторы классов

        // Проверяем, есть ли в JSON-файле настроенные диапазоны результатов
        if (quizData && quizData.result_ranges) {
            // Ищем объект диапазона, в который попадает итоговый балл
            const matchedResult = quizData.result_ranges.find(range => totalScore >= range.min && totalScore <= range.max);

            if (matchedResult) {
                scoreZone.classList.add(`quiz-score-zone--${matchedResult.class}`);
                document.getElementById("quiz-result-status").textContent = matchedResult.status;
                resText.textContent = matchedResult.text;
                return; // Успешно применили данные, выходим из функции
            }
        }

        // Дефолтный фолбек на случай, если структура JSON повреждена или диапазоны не найдены
        scoreZone.classList.add("quiz-score-zone--low");
        document.getElementById("quiz-result-status").textContent = "Тест завершен";
        resText.textContent = "Спасибо за прохождение тестирования. Ваши ответы успешно зафиксированы.";
    }
});