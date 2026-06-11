import './lk.js';
import './test-razvod.js';
import './test-str-shablon.js';
import './contact.js';
import './payment.js';
import './patients.js';

document.addEventListener('DOMContentLoaded', () => {




    // Находим все элементы с атрибутом data-include
    const includes = document.querySelectorAll('[data-include]');

    // Умное определение базового пути:
    // На GitHub Pages подставит '/KdK-rehab-prototype'
    // На локальном Live Server оставит пустую строку ''
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/KdK-rehab-prototype' : '';

    includes.forEach(element => {
        const file = element.getAttribute('data-include');

        // Скачиваем файл с правильным префиксом basePath
        fetch(`${basePath}/${file}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка загрузки: ${file}`);
                return response.text();
            })
            .then(data => {
                let htmlText = data;

                // Если мы на GitHub Pages, корректируем пути КАРТИНОК и ССЫЛОК внутри загруженного хедера/футера
                if (basePath) {
                    // Эта магия превращает href="/кдкреабцентр.html" в href="/KdK-rehab-prototype/кдкреабцентр.html"
                    // А также src="./conten/logo.svg" или src="/conten/logo.svg" в правильные пути
                    htmlText = htmlText.replace(/(href|src)="\/([^"]*)"/g, `$1="${basePath}/$2"`);
                    htmlText = htmlText.replace(/(href|src)="\.\/([^"]*)"/g, `$1="${basePath}/$2"`);
                }

                element.innerHTML = htmlText;

                // Активируем клики после вставки HTML
                if (file === 'header') {
                    initHeaderEvents();
                }
                if (file === 'footer') {
                    initFooterEvents();
                }
            })
            .catch(error => console.error(`Error loading ${file}:`, error));
    });










    const slider = document.querySelector('.news-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (slider && prevBtn && nextBtn) {
        // Вычисляем ширину прокрутки (ширина одной карточки + gap)
        const getScrollStep = () => {
            const card = slider.querySelector('.news-card');
            return card ? card.offsetWidth + 30 : 300;
        };

        nextBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: getScrollStep(),
                behavior: 'smooth'
            });
        });

        prevBtn.addEventListener('click', () => {
            slider.scrollBy({
                left: -getScrollStep(),
                behavior: 'smooth'
            });
        });
    };

    // 1. Логика слайдера лицензий
    const licSlider = document.querySelector('.licenses-slider');
    const licPrevBtn = document.querySelector('.lic-prev-btn');
    const licNextBtn = document.querySelector('.lic-next-btn');

    if (licSlider && licPrevBtn && licNextBtn) {
        const getScrollStep = () => {
            const card = licSlider.querySelector('.license-card');
            return card ? card.offsetWidth + 30 : 250;
        };

        licNextBtn.addEventListener('click', () => {
            licSlider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        licPrevBtn.addEventListener('click', () => {
            licSlider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });
    };

    const revSlider = document.querySelector('.reviews-slider');
    const revPrevBtn = document.querySelector('.rev-prev-btn');
    const revNextBtn = document.querySelector('.rev-next-btn');

    if (revSlider && revPrevBtn && revNextBtn) {
        const getScrollStep = () => {
            const card = revSlider.querySelector('.review-card');
            return card ? card.offsetWidth + 30 : 400; // Ширина карточки + gap
        };

        revNextBtn.addEventListener('click', () => {
            revSlider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        revPrevBtn.addEventListener('click', () => {
            revSlider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });
    };

    // Управление слайдером видеоотзывов
    const vrevSlider = document.querySelector('.video-reviews-slider');
    const vrevPrevBtn = document.querySelector('.vrev-prev-btn');
    const vrevNextBtn = document.querySelector('.vrev-next-btn');

    if (vrevSlider && vrevPrevBtn && vrevNextBtn) {
        const getScrollStep = () => {
            const card = vrevSlider.querySelector('.video-review-card');
            return card ? card.offsetWidth + 30 : 350;
        };

        vrevNextBtn.addEventListener('click', () => {
            vrevSlider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
        });

        vrevPrevBtn.addEventListener('click', () => {
            vrevSlider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
        });
    }

    const banner = document.getElementById("cookie-banner");
    const closeButtons = document.querySelectorAll(".js-cookie-close");

    if (localStorage.getItem("cookie_accepted") === "true" && banner) {
        banner.classList.remove("active");
        banner.style.display = "none";
    }

    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            banner.classList.remove("active");
            localStorage.setItem("cookie_accepted", "true");
            setTimeout(() => { banner.style.display = "none"; }, 300);
        });
    });

    /* === Новая логика: Панель виджетов === */
    const scrollUpBtn = document.querySelector(".js-scroll-up");
    const accessibilityBtn = document.querySelector(".js-accessible-toggle");
    const chatBtn = document.querySelector(".js-doctor-chat");

    // 1. Поведение кнопки "Наверх" при скролле
    window.addEventListener("scroll", function () {
        // Если прокрутили больше чем на 400px — показываем кнопку
        if (window.scrollY > 400) {
            scrollUpBtn.classList.add("is-visible");
        } else {
            scrollUpBtn.classList.remove("is-visible");
        }
    });

    // 2. Плавный скролл наверх при клике
    scrollUpBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // 3. Заглушка для режима слабовидящих
    accessibilityBtn.addEventListener("click", function () {
        alert("Здесь будет включаться версия для слабовидящих (изменение шрифтов и контрастности).");
    });

    // 4. Заглушка для чата с доктором
    chatBtn.addEventListener("click", function () {
        alert("Открытие окна чата с дежурным врачом / раскрытие виджета.");
    });

    /* === Логика Попапа Авторизации === */
    const authPopup = document.getElementById("auth-popup");
    const openAuthButtons = document.querySelectorAll(".js-open-auth");
    const closeAuthButtons = document.querySelectorAll(".js-close-auth");

    // Открытие по клику на любую кнопку ЛК
    openAuthButtons.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            authPopup.classList.add("is-active");
            document.body.classList.add("popup-opened"); // блокируем скролл сайта под попапом
        });
    });

    // Закрытие по клику на крестик или оверлей
    closeAuthButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            authPopup.classList.remove("is-active");
            document.body.classList.remove("popup-opened");
        });
    });

    // Закрытие по кнопке Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authPopup.classList.contains("is-active")) {
            authPopup.classList.remove("is-active");
            document.body.classList.remove("popup-opened");
        }
    });











});


// 2. Логика полноэкранного просмотра (Lightbox)
function openLightbox(cardElement) {
    const imgUrl = cardElement.querySelector('.license-img-box img').src;
    const imgAlt = cardElement.querySelector('.license-img-box img').alt;
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    lightboxImg.src = imgUrl;
    lightboxImg.alt = imgAlt;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Отключаем прокрутку сайта на фоне
};

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл
};
// Функции модального окна видео
function openVideoModal(videoUrl) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoModalIframe');

    // Добавляем autoplay для удобства, чтобы видео стартовало сразу при клике
    iframe.src = videoUrl + "?autoplay=1";

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoModalIframe');

    modal.classList.remove('active');
    iframe.src = ""; // Сбрасываем src, чтобы остановить воспроизведение видео
    document.body.style.overflow = '';
};

function initHeaderEvents() {
    const authPopup = document.getElementById("auth-popup");
    const openAuthBtns = document.querySelectorAll(".js-open-auth");
    const closeAuthBtns = document.querySelectorAll(".js-close-auth");

    if (!authPopup) return;

    // Открытие попапа по клику на "Личный кабинет" в хедере
    openAuthBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            // Добавляем классы 'active' и 'is-active' для надежности (смотря какой в вашем CSS)
            authPopup.classList.add("active");
            authPopup.classList.add("is-active");
            document.body.classList.add("popup-opened"); // Блокируем скролл сайта под попапом
        });
    });

    // Закрытие по клику на крестик или затемненный фон (overlay)
    closeAuthBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            authPopup.classList.remove("active");
            authPopup.classList.remove("is-active");
            document.body.classList.remove("popup-opened");
        });
    });

    // Закрытие по кнопке Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && (authPopup.classList.contains("active") || authPopup.classList.contains("is-active"))) {
            authPopup.classList.remove("active");
            authPopup.classList.remove("is-active");
            document.body.classList.remove("popup-opened");
        }
    });
};
function initFooterEvents() {
    const authPopup = document.getElementById("auth-popup");
    // Находим кнопку ЛК именно внутри футера
    const openAuthBtnsFooter = document.querySelectorAll(".site-footer .js-open-auth");

    if (!authPopup || !openAuthBtnsFooter) return;

    openAuthBtnsFooter.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            authPopup.classList.add("active");
            authPopup.classList.add("is-active");
            document.body.classList.add("popup-opened");
        });
    });
};