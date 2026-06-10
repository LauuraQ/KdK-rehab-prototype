

const tabButtons = document.querySelectorAll(".lk-menu__btn");
const tabContents = document.querySelectorAll(".lk-tab-content");

tabButtons.forEach(button => {
    button.addEventListener("click", function () {
        const targetTab = this.getAttribute("data-tab");

        // Убираем активный класс у всех кнопок меню
        tabButtons.forEach(btn => btn.classList.remove("active"));
        // Скрываем все вкладки с контентом
        tabContents.forEach(content => content.classList.remove("active"));

        // Добавляем активный класс текущей кнопке и показываем нужный контент
        this.classList.add("active");
        const activeContent = document.getElementById(`tab-${targetTab}`);
        if (activeContent) {
            activeContent.classList.add("active");
        }
    });
});