// Универсальный и безопасный скрипт для аккордеонов FAQ через делегирование событий
document.addEventListener('click', (event) => {
    // Проверяем, кликнул ли пользователь на заголовок (новый или старый класс)
    const question = event.target.closest('.faq-item__question') || event.target.closest('.faq-question');

    // Если клик был не по заголовку FAQ, то ничего не делаем
    if (!question) return;

    // Находим родительский элемент всей карточки вопроса
    const currentItem = question.closest('.faq-item');
    if (!currentItem) return;

    // Находим вообще все карточки FAQ на странице для организации аккордеона
    const allItems = document.querySelectorAll('.faq-item');

    // Автоматически закрываем другие открытые вопросы
    allItems.forEach(item => {
        if (item !== currentItem && item.classList.contains('active')) {
            item.classList.remove('active');
        }
    });

    // Переключаем класс active для текущего выбранного вопроса
    currentItem.classList.toggle('active');
});