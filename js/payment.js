document.addEventListener('DOMContentLoaded', () => {
    const infoSection = document.getElementById('payment-info-section');
    if (!infoSection) return;

    const blocks = infoSection.querySelectorAll('.payment-info__block');

    blocks.forEach((block) => {
        block.style.opacity = '0';
        block.style.transition = 'opacity 0.8s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                blocks.forEach(block => block.style.opacity = '1');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(infoSection);
});