const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const skillTabs = document.querySelectorAll('.skill-tab');
const skillPanels = document.querySelectorAll('.skill-panel');
const API_BASE = (() => {
    const fallback = 'http://localhost:5000/api';
    const origin = window.location.origin;
    if (!origin || origin === 'null') return fallback;

    const localStaticPorts = [':3000', ':5500', ':5501', ':8000', ':8080'];
    if (localStaticPorts.some((port) => origin.includes(port))) {
        return fallback;
    }

    return `${origin}/api`;
})();
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const year = document.getElementById('year');
const counters = document.querySelectorAll('.counter');
const heroText = document.getElementById('heroText');
const themeToggle = document.getElementById('themeToggle');
const langButtons = document.querySelectorAll('.lang-btn');
const heroWords = ['modern websites', 'scalable products', 'AI-powered solutions', 'smart digital experiences'];
const heroWordsAr = ['مواقع حديثة', 'منتجات قابلة للتوسع', 'حلول مدعومة بالذكاء الاصطناعي', 'تجارب رقمية ذكية'];

const visitorId = () => {
    let id = localStorage.getItem('portfolio_visitor_id');
    if (!id) {
        id = `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem('portfolio_visitor_id', id);
    }
    return id;
};

const trackVisitor = async (page = 'contact') => {
    const id = visitorId();
    try {
        await fetch(`${API_BASE}/analytics/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Visitor-Id': id },
            body: JSON.stringify({ page, visitorId: id })
        });
    } catch (error) {
        console.warn('Visitor tracking failed', error);
    }
};

const translations = {
    en: {
        nav_home: 'Home',
        nav_about: 'About',
        nav_services: 'Services',
        nav_skills: 'Skills',
        nav_experience: 'Experience',
        nav_projects: 'Projects',
        nav_contact: 'Contact',
        hero_eyebrow: 'Full-Stack Software Developer • Generative AI Enthusiast • Business Leader',
        hero_name: 'ALI ABDALLA ISMAIL ABDALLA',
        hero_prefix: 'I create',
        hero_text: 'I build modern, scalable digital experiences with thoughtful strategy, strong engineering, and AI-powered innovation. My work combines elegant design, reliable backend systems, and business-focused problem solving.',
        hero_projects: 'View Projects',
        hero_contact: 'Let’s Connect',
        about_title: 'Professional Summary',
        about_p1: 'Motivated and results-driven Full-Stack Software Developer with strong knowledge of modern web development, backend systems, databases, and Generative AI. I am passionate about building scalable, user-friendly applications while applying solid problem-solving and analytical thinking.',
        about_p2: 'Combining technical expertise with business management and leadership insight, I bring both creativity and strategic thinking to every digital product I build.',
        contact_details_title: 'Contact Details',
        contact_location: 'Rwanda · Remote Opportunities',
        objective_title: 'Professional Objective',
        objective_text: 'Seeking opportunities as a Full-Stack Developer where I can contribute strong technical skills, business knowledge, and AI expertise while continuing to grow as a software engineer and create impactful digital products.'
    },
    ar: {
        nav_home: 'الرئيسية',
        nav_about: 'من أنا',
        nav_services: 'الخدمات',
        nav_skills: 'المهارات',
        nav_experience: 'الخبرة',
        nav_projects: 'المشاريع',
        nav_contact: 'التواصل',
        hero_eyebrow: 'مطور برمجيات full-stack • مهتم بالذكاء الاصطناعي التوليدي • قائد أعمال',
        hero_name: 'علي عبد الله إسماعيل عبد الله',
        hero_prefix: 'أقوم بإنشاء',
        hero_text: 'أبني تجارب رقمية حديثة وقابلة للتوسع باستخدام استراتيجية مدروسة وهندسة قوية وابتكار مدعوم بالذكاء الاصطناعي. يعمل عملي على الجمع بين التصميم الأنيق والأنظمة الخلفية الموثوقة وحل المشكلات الموجه نحو الأعمال.',
        hero_projects: 'عرض المشاريع',
        hero_contact: 'لنرتبط',
        about_title: 'الملخص المهني',
        about_p1: 'مطور برمجيات full-stack متحمس وذو توجه عملي، لديه معرفة قوية بتطوير الويب الحديث وأنظمة backend وقواعد البيانات والذكاء الاصطناعي التوليدي. أنا شغوف ببناء تطبيقات قابلة للتوسع وسهلة الاستخدام مع تطبيق مهارات قوية في حل المشكلات والتحليل.',
        about_p2: 'من خلال الجمع بين الخبرة التقنية والفهم الإداري والقيادي، أحمل التفكير الإبداعي والاستراتيجي إلى كل منتج رقمي أتبناه.',
        contact_details_title: 'تفاصيل التواصل',
        contact_location: 'رواندا · فرص العمل عن بعد',
        objective_title: 'الهدف المهني',
        objective_text: 'أبحث عن فرص كمطور full-stack أساهم فيها بمهارات تقنية قوية ومعرفة أعمال وخبرة في الذكاء الاصطناعي مع متابعة نموي كمطور برمجيات وإنتاج منتجات رقمية مؤثرة.'
    }
};

function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    localStorage.setItem('portfolio-lang', lang);
}

function setTheme(theme) {
    document.body.classList.toggle('light', theme === 'light');
    localStorage.setItem('portfolio-theme', theme);
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
const savedLang = localStorage.getItem('portfolio-lang') || 'en';

setTheme(savedTheme);
setLanguage(savedLang);

if (year) {
    year.textContent = new Date().getFullYear();
}
trackVisitor('landing');

if (heroText) {
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    const typeLoop = () => {
        const currentWord = (savedLang === 'ar' ? heroWordsAr : heroWords)[wordIndex] || (savedLang === 'ar' ? heroWordsAr : heroWords)[0];
        heroText.textContent = currentWord.slice(0, letterIndex);

        if (!isDeleting && letterIndex < currentWord.length) {
            letterIndex++;
            setTimeout(typeLoop, 90);
        } else if (isDeleting && letterIndex > 0) {
            letterIndex--;
            setTimeout(typeLoop, 55);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % heroWords.length;
            }
            setTimeout(typeLoop, 1200);
        }
    };

    typeLoop();
}

themeToggle?.addEventListener('click', () => {
    const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(nextTheme);
});

langButtons.forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.dataset.lang);
    });
});

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
    });
});

skillTabs.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;

        skillTabs.forEach(tab => tab.classList.remove('active'));
        button.classList.add('active');

        skillPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === target);
        });
    });
});

const revealItems = document.querySelectorAll('.reveal');
const experienceItems = document.querySelectorAll('.timeline-item');
const detailTitle = document.getElementById('detailTitle');
const detailText = document.getElementById('detailText');
const detailTags = document.getElementById('detailTags');
const timelineDetail = document.getElementById('timelineDetail');

function updateExperienceCard(activeItem) {
    if (!activeItem || !detailTitle || !detailText || !detailTags || !timelineDetail) return;

    experienceItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');

    detailTitle.textContent = activeItem.dataset.title || 'Experience';
    detailText.textContent = activeItem.dataset.description || '';
    detailTags.innerHTML = (activeItem.dataset.tags || '')
        .split(',')
        .map(tag => `<span>${tag.trim()}</span>`)
        .join('');

    timelineDetail.classList.remove('is-changing');
    void timelineDetail.offsetWidth;
    timelineDetail.classList.add('is-changing');
}

experienceItems.forEach(item => {
    item.addEventListener('click', () => updateExperienceCard(item));
});

if (experienceItems.length) {
    updateExperienceCard(experienceItems[0]);
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('hero-content') || entry.target.classList.contains('hero-visual')) {
                animateCounters();
            }
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.16 });

revealItems.forEach(item => observer.observe(item));

function animateCounters() {
    counters.forEach(counter => {
        const target = Number(counter.dataset.target || 0);
        const duration = 1200;
        const startTime = performance.now();

        const step = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = value + (target === 100 ? '%' : '+');
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target + (target === 100 ? '%' : '+');
            }
        };

        requestAnimationFrame(step);
    });
}

const sections = document.querySelectorAll('main section[id]');
const updateActiveLink = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (scrollPos >= top && scrollPos < bottom) {
            navLinks.forEach(item => item.classList.remove('active'));
            if (link) link.classList.add('active');
        }
    });
};
window.addEventListener('scroll', updateActiveLink);
updateActiveLink();

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const message = formData.get('message')?.toString().trim();

        if (!name || !email || !message) {
            formMessage.textContent = 'Please complete all fields before sending.';
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, message })
            });

            const text = await response.text();
            let result = {};
            if (text) {
                try {
                    result = JSON.parse(text);
                } catch {
                    result = { message: text };
                }
            }

            if (!response.ok) {
                throw new Error(result.message || response.statusText || 'Unable to send message right now.');
            }

            formMessage.textContent = `Thank you, ${name}. Your message has been received.`;
            formMessage.style.color = '#14b8a6';
            contactForm.reset();
            trackVisitor('contact');
        } catch (error) {
            formMessage.textContent = error.message || 'Submission failed. Please try again.';
            formMessage.style.color = '#fb7185';
        }
    });
}
