document.addEventListener("DOMContentLoaded", function () {
    // Путь к вашему общему файлу-манифесту, где лежат мета-данные карточек
    const jsonUrl = './json-tests/list.json';

    // Контейнер, куда будут складываться карточки
    const container = document.getElementById("js-tests-container");

    // Кнопки фильтров
    const verticalButtons = document.querySelectorAll(".tests-nav-vertical__btn");
    const horizontalButtons = document.querySelectorAll(".tests-nav-horizontal__btn");

    // Текущее состояние фильтров (по умолчанию показывать "Все")
    let currentAudience = "all";
    let currentCategory = "all";
    let testCards = []; // Сюда запишем ссылки на созданные HTML-карточки

    // === 1. ЗАГРУЗКА ДАННЫХ И СБОРОК КАРТОЧЕК ===
    fetch(jsonUrl)
        .then(response => {
            if (!response.ok) throw new Error("Не удалось загрузить list.json");
            return response.json();
        })
        .then(data => {
            if (!container) return;
            container.innerHTML = ""; // Очищаем текст "Загрузка..."

            // Перебираем каждый тест в файле list.json
            for (let key in data) {
                const test = data[key];

                // Создаем элемент карточки
                const card = document.createElement("div");
                card.classList.add("test-card");

                // Навешиваем дата-атрибуты, по которым JS будет их скрывать/показывать
                card.setAttribute("data-audience", test.audience);
                card.setAttribute("data-category", test.category);

                // Собираем верстку карточки. 
                // В кнопку подставляем dynamic-ссылку: quiz.html?type=имя_ключа
                card.innerHTML = `
                    <div class="test-card__image-wrapper">
                        <img src="${test.image}" alt="${test.title}" class="test-card__image">
                    </div>
                    <div class="test-card__body">
                        <div class="test-card__main-info">
                            <h3 class="test-card__title">${test.title}</h3>
                            <p class="test-card__desc">${test.description}</p>
                        </div>
                        <div class="test-card__footer">
                            <div class="test-card__meta">
                                <span class="test-card__time">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    ~ ${test.time}
                                </span>
                                <span class="test-card__badge">Анонимно</span>
                            </div>
                            <a href="current-test.html?type=${key}" class="test-card__btn">Пройти тест</a>
                        </div>
                    </div>
                `;

                // Добавляем готовую карточку на страницу
                container.appendChild(card);
            }

            // Запоминаем все сгенерированные карточки в массив для фильтрации
            testCards = document.querySelectorAll(".test-card");

            // Запускаем фильтрацию, чтобы отобразить всё согласно дефолтным табам
            filterTests();
        })
        .catch(error => {
            console.error("Ошибка:", error);
            if (container) {
                container.innerHTML = `<div class="tests-error">Не удалось загрузить список тестов. Пожалуйста, обновите страницу.</div>`;
            }
        });


    // === 2. ЛОГИКА ФИЛЬТРАЦИИ С ОДНОВРЕМЕННЫМ УЧЕТОМ ДВУХ ТАБОВ ===
    function filterTests() {
        if (testCards.length === 0) return;

        testCards.forEach(card => {
            const cardAudience = card.getAttribute("data-audience");
            const cardCategory = card.getAttribute("data-category");

            // Проверяем совпадение по левому меню (Аудитория)
            const matchAudience = (currentAudience === "all") || (cardAudience === currentAudience);

            // Проверяем совпадение по верхнему меню (Категория)
            const matchCategory = (currentCategory === "all") || (cardCategory === currentCategory);

            // Если карточка подходит под оба условия — плавно показываем её через flex
            if (matchAudience && matchCategory) {
                card.style.display = "flex";
                card.style.opacity = "0";
                setTimeout(() => {
                    card.style.transition = "opacity 0.25s ease";
                    card.style.opacity = "1";
                }, 10);
            } else {
                // Если не подходит — полностью скрываем
                card.style.display = "none";
            }
        });
    }

    // === 3. ОБРАБОТЧИКИ КЛИКОВ ПО КНОПКАМ ТАБОВ ===

    // Клики по левым табам (Аудитория)
    verticalButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            verticalButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            currentAudience = this.getAttribute("data-audience");
            filterTests(); // Пересчитываем видимость карточек
        });
    });

    // Клики по верхним табам (Категории)
    horizontalButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            horizontalButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            currentCategory = this.getAttribute("data-category");
            filterTests(); // Пересчитываем видимость карточек
        });
    });
});