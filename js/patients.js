const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Если нужно, чтобы при открытии одного вопроса остальные закрывались автоматически:
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Переключаем класс active для текущего элемента
        item.classList.toggle('active');
    });
});