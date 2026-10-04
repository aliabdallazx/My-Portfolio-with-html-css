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
const portfolioSyncChannel = 'portfolio_dashboard_sync';
const year = document.getElementById('year');
const counters = document.querySelectorAll('.counter');
const heroText = document.getElementById('heroText');
const themeToggle = document.getElementById('themeToggle');
const langButtons = document.querySelectorAll('.lang-btn');
const heroWords = ['modern websites', 'scalable products', 'AI-powered solutions', 'smart digital experiences'];
const heroWordsAr = ['مواقع حديثة', 'منتجات قابلة للتوسع', 'حلول مدعومة بالذكاء الاصطناعي', 'تجارب رقمية ذكية'];
let currentLanguage = 'en';
let heroAnimationTimeoutId = null;

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
        objective_text: 'Seeking opportunities as a Full-Stack Developer where I can contribute strong technical skills, business knowledge, and AI expertise while continuing to grow as a software engineer and create impactful digital products.',
        hero_stat_1: 'Core Expertise Areas',
        hero_stat_2: 'Growth Mindset',
        hero_stat_3: 'Hours of Focus Daily',
        tag_fullstack: 'Full-Stack Development',
        tag_ai: 'Generative AI',
        tag_leadership: 'Leadership',
        tag_strategy: 'Business Strategy',
        services_eyebrow: 'What I Offer',
        services_title: 'Professional Services Built for Modern Business Needs',
        services_desc: 'I combine technical execution with strategic insight to deliver solutions that are elegant, efficient, and built to last.',
        service_1_title: 'Custom Web Development',
        service_1_desc: 'Responsive websites and web applications tailored to business goals, performance, and long-term scalability.',
        service_2_title: 'API & Backend Systems',
        service_2_desc: 'Secure REST APIs, authentication, databases, and robust server-side architecture for reliable platforms.',
        service_3_title: 'AI Solution Integration',
        service_3_desc: 'Generative AI workflows, automation, prompt design, and intelligent features that elevate user experiences.',
        service_4_title: 'Business & Strategy Support',
        service_4_desc: 'Technical thinking aligned with leadership, planning, and project execution for smarter digital growth.',
        skills_eyebrow: 'Core Expertise',
        skills_title: 'Skills Organized by Professional Focus Area',
        skills_desc: 'Each skill category is presented as a dedicated section with modern styling and clear professional relevance.',
        skill_frontend_tab: 'Frontend',
        skill_backend_tab: 'Backend',
        skill_ai_tab: 'AI',
        skill_business_tab: 'Business',
        skill_office_tab: 'Office',
        skill_languages_tab: 'Languages',
        skill_frontend_title: 'Frontend Development',
        skill_frontend_desc: 'Crafting polished user interfaces with HTML5, CSS3, JavaScript, React, and Tailwind CSS for responsive and modern experiences.',
        skill_frontend_item: 'Responsive Design',
        skill_backend_title: 'Backend Development',
        skill_backend_desc: 'Building secure and scalable server-side logic with Node.js, Express, REST APIs, and authentication.',
        skill_ai_title: 'Artificial Intelligence',
        skill_ai_desc: 'Integrating Generative AI workflows into products with prompt engineering, automation, and intelligent features.',
        skill_ai_item_1: 'Generative AI',
        skill_ai_item_2: 'Prompt Engineering',
        skill_ai_item_3: 'AI Workflow Integration',
        skill_ai_item_4: 'AI-Assisted Development',
        skill_ai_item_5: 'Automation',
        skill_business_title: 'Business & Leadership',
        skill_business_desc: 'Combining technical execution with management insight, strategy, teamwork, and decision-making.',
        skill_business_item_1: 'Business Management',
        skill_business_item_2: 'Leadership',
        skill_business_item_3: 'Strategic Planning',
        skill_business_item_4: 'Project Management',
        skill_business_item_5: 'Team Collaboration',
        skill_business_item_6: 'Communication',
        skill_office_title: 'Microsoft Office',
        skill_office_desc: 'Professional productivity and documentation support through Microsoft Excel and Microsoft Word.',
        skill_office_item_1: 'Microsoft Excel',
        skill_office_item_2: 'Microsoft Word',
        skill_office_item_3: 'Data Organization',
        skill_office_item_4: 'Reporting',
        skill_languages_title: 'Languages',
        skill_languages_desc: 'Effective communication across languages for global collaboration and professional interaction.',
        skill_languages_item_1: 'Arabic — Native',
        skill_languages_item_2: 'English — Fluent',
        skill_languages_item_3: 'French — Intermediate',
        experience_badge: 'Growth Journey',
        experience_title: 'Learning by building, leading, and adapting',
        experience_text: 'Every milestone shaped a stronger foundation in technology, communication, and business impact.',
        experience_eyebrow: 'Experience & Growth',
        experience_h2: 'A Strong Foundation in Development, Leadership, and Continuous Learning',
        experience_intro: 'My journey combines technical depth, leadership growth, and practical problem-solving to create meaningful digital experiences.',
        timeline_2018_title: 'Academic Foundation',
        timeline_2018_small: 'School years and early growth',
        timeline_2022_title: 'Generative AI Exploration',
        timeline_2022_small: 'Practical learning and experimentation',
        timeline_2024_title: 'Full-Stack Development',
        timeline_2024_small: 'Building modern web experiences',
        timeline_2025_title: 'Leadership & Business Growth',
        timeline_2025_small: 'Turning ideas into impact',
        timeline_label: 'Current Highlight',
        timeline_default_title: 'Academic Foundation',
        timeline_default_text: 'Built a disciplined and analytical base through education, communication, and strong study habits that shaped my professional mindset.',
        timeline_tag_1: 'Communication',
        timeline_tag_2: 'Discipline',
        timeline_tag_3: 'Analytical Thinking',
        projects_eyebrow: 'Selected Work',
        projects_title: 'Projects That Blend Technology, Design, and Strategy',
        project_1_title: 'Prayer Timings App',
        project_1_desc: 'A modern React-based prayer timing application with a clean interface and practical user experience.',
        project_2_title: 'E-Commerce Website',
        project_2_desc: 'A polished ecommerce experience designed for product presentation, user interaction, and modern online shopping flow.',
        project_3_title: 'React Admin Dashboard',
        project_3_desc: 'A professional dashboard project featuring organized sections, modern UI patterns, and a strong administrative experience.',
        project_view_demo: 'View Demo',
        quote_text: '“I believe every digital product should be powerful, purposeful, and prepared for growth.”',
        contact_eyebrow: 'Let’s Build Something Meaningful',
        contact_h2: 'Open to opportunities in software development, AI integration, and digital product innovation.',
        contact_p: 'I am seeking opportunities as a Full-Stack Developer where I can contribute technical strength, business understanding, and AI expertise while continuing to grow as an engineer.',
        contact_email_btn: 'Email Me',
        contact_call_btn: 'Call Now',
        contact_form_title: 'Send a Message',
        contact_name: 'Name',
        contact_email: 'Email',
        contact_message: 'Message',
        contact_submit: 'Submit',
        footer_text: '© {year} Ali Abdalla Ismail Abdalla. Crafted with precision and purpose.'
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
        objective_text: 'أبحث عن فرص كمطور full-stack أساهم فيها بمهارات تقنية قوية ومعرفة أعمال وخبرة في الذكاء الاصطناعي مع متابعة نموي كمطور برمجيات وإنتاج منتجات رقمية مؤثرة.',
        hero_stat_1: 'مجالات الخبرة الأساسية',
        hero_stat_2: 'نمط النمو',
        hero_stat_3: 'ساعات التركيز يوميًا',
        tag_fullstack: 'تطوير Full-Stack',
        tag_ai: 'ذكاء اصطناعي مولّد',
        tag_leadership: 'القيادة',
        tag_strategy: 'استراتيجية الأعمال',
        services_eyebrow: 'ما الذي أقدمه',
        services_title: 'خدمات احترافية مصممة لتلبية احتياجات الأعمال الحديثة',
        services_desc: 'أجمع بين التنفيذ التقني والبصيرة الاستراتيجية لتقديم حلول أنيقة وفعالة ومصممة لتحقيق النجاح طويل المدى.',
        service_1_title: 'تطوير الويب المخصص',
        service_1_desc: 'مواقع ويب وتطبيقات واجهة مستخدم مصممة خصيصًا لتناسب أهداف العمل والأداء وقابلية التوسع.',
        service_2_title: 'نظم API والواجهة الخلفية',
        service_2_desc: 'واجهات API آمنة، نظام مصادقة، قواعد بيانات، وبنية خادم موثوقة لأنظمة قوية.',
        service_3_title: 'تكامل الذكاء الاصطناعي',
        service_3_desc: 'تدفقات ذكاء اصطناعي توليدي، أتمتة، وتصميم المطالبات وميزات ذكية تعزز التجربة.',
        service_4_title: 'الدعم الاستراتيجي للأعمال',
        service_4_desc: 'تفكير تقني متوافق مع القيادة والتخطيط والتنفيذ لتحقيق نمو رقمي أكثر ذكاءً.',
        skills_eyebrow: 'الخبرات الأساسية',
        skills_title: 'مهارات مرتبة حسب مجال الخبرة المهني',
        skills_desc: 'يتم عرض كل فئة مهارة كقسم مستقل بأسلوب حديث وواضح.',
        skill_frontend_tab: 'واجهة أمامية',
        skill_backend_tab: 'واجهة خلفية',
        skill_ai_tab: 'ذكاء اصطناعي',
        skill_business_tab: 'الأعمال',
        skill_office_tab: 'المكتب',
        skill_languages_tab: 'اللغات',
        skill_frontend_title: 'تطوير الواجهة الأمامية',
        skill_frontend_desc: 'تصميم واجهات مستخدم أنيقة باستخدام HTML5 وCSS3 وJavaScript وReact وTailwind CSS لتجارب حديثة ومتجاوبة.',
        skill_frontend_item: 'تصميم متجاوب',
        skill_backend_title: 'تطوير الواجهة الخلفية',
        skill_backend_desc: 'بناء منطق خادم آمن وقابل للتوسع باستخدام Node.js وExpress وREST APIs والمصادقة.',
        skill_ai_title: 'الذكاء الاصطناعي',
        skill_ai_desc: 'دمج تدفقات الذكاء الاصطناعي التوليدي في المنتجات باستخدام هندسة المطالبات والأتمتة والميزات الذكية.',
        skill_ai_item_1: 'ذكاء اصطناعي مولّد',
        skill_ai_item_2: 'هندسة المطالبات',
        skill_ai_item_3: 'تكامل سير العمل بالذكاء الاصطناعي',
        skill_ai_item_4: 'تطوير مدعوم بالذكاء الاصطناعي',
        skill_ai_item_5: 'الأتمتة',
        skill_business_title: 'الأعمال والقيادة',
        skill_business_desc: 'مزيج بين التنفيذ التقني والبصيرة الإدارية والاستراتيجية والعمل الجماعي وصنع القرار.',
        skill_business_item_1: 'إدارة الأعمال',
        skill_business_item_2: 'القيادة',
        skill_business_item_3: 'التخطيط الاستراتيجي',
        skill_business_item_4: 'إدارة المشاريع',
        skill_business_item_5: 'التعاون الجماعي',
        skill_business_item_6: 'التواصل',
        skill_office_title: 'مايكروسوفت أوفيس',
        skill_office_desc: 'إنتاجية احترافية ودعم توثيقي عبر Excel وWord.',
        skill_office_item_1: 'مايكروسوفت إكسل',
        skill_office_item_2: 'مايكروسوفت وورد',
        skill_office_item_3: 'تنظيم البيانات',
        skill_office_item_4: 'التقارير',
        skill_languages_title: 'اللغات',
        skill_languages_desc: 'تواصل فعال عبر اللغات للتعاون العالمي والتفاعل المهني.',
        skill_languages_item_1: 'العربية — أصلية',
        skill_languages_item_2: 'الإنجليزية — بطلاقة',
        skill_languages_item_3: 'الفرنسية — متوسطة',
        experience_badge: 'رحلة النمو',
        experience_title: 'التعلم من خلال البناء والقيادة والتكيف',
        experience_text: 'كل نقطة انطلاق شكّلت أساسًا أقوى في التكنولوجيا والتواصل وأثر الأعمال.',
        experience_eyebrow: 'التجربة والنمو',
        experience_h2: 'أساس قوي في التطوير والقيادة والتعلم المستمر',
        experience_intro: 'تجمع رحلتي بين العمق التقني ونمو القيادة وحل المشكلات العملية لإنشاء تجارب رقمية ذات معنى.',
        timeline_2018_title: 'الأساس الأكاديمي',
        timeline_2018_small: 'سنوات الدراسة والنمو المبكر',
        timeline_2022_title: 'استكشاف الذكاء الاصطناعي التوليدي',
        timeline_2022_small: 'تعلّم عملي وتجريب',
        timeline_2024_title: 'تطوير الواجهة الكامل',
        timeline_2024_small: 'بناء تجارب ويب حديثة',
        timeline_2025_title: 'القيادة ونمو الأعمال',
        timeline_2025_small: 'تحويل الأفكار إلى أثر',
        timeline_label: 'الإنجاز الحالي',
        timeline_default_title: 'الأساس الأكاديمي',
        timeline_default_text: 'بنيت قاعدة منضبطة وتحليلية من خلال التعليم والتواصل وعادات الدراسة القوية التي شكّلت فكرتي المهنية.',
        timeline_tag_1: 'التواصل',
        timeline_tag_2: 'الانضباط',
        timeline_tag_3: 'التفكير التحليلي',
        projects_eyebrow: 'أعمال مختارة',
        projects_title: 'مشاريع تجمع بين التكنولوجيا والتصميم والاستراتيجية',
        project_1_title: 'تطبيق مواقيت الصلاة',
        project_1_desc: 'تطبيق React حديث لمواقيت الصلاة بواجهة نظيفة وتجربة عملية.',
        project_2_title: 'موقع للتجارة الإلكترونية',
        project_2_desc: 'تجربة تجارة إلكترونية أنيقة مصممة لعرض المنتجات والتفاعل وتجربة شراء حديثة.',
        project_3_title: 'لوحة تحكم إدارية React',
        project_3_desc: 'مشروع لوحة تحكم احترافية تحتوي على أقسام منظمة وأنماط واجهة حديثة وتجربة إدارية قوية.',
        project_view_demo: 'عرض العرض التوضيحي',
        quote_text: '“أؤمن أن كل منتج رقمي يجب أن يكون قويًا وهادفًا ومستعدًا للنمو.”',
        contact_eyebrow: 'لنبني شيئًا ذا معنى',
        contact_h2: 'مفتوح أمام الفرص في تطوير البرمجيات وتكامل الذكاء الاصطناعي والابتكار الرقمي.',
        contact_p: 'أبحث عن فرص كمطور برمجيات full-stack أساهم فيها بقوة التقنية والفهم التجاري وخبرة الذكاء الاصطناعي مع متابعة التقدم في مجال البرمجيات.',
        contact_email_btn: 'راسلني',
        contact_call_btn: 'اتصل الآن',
        contact_form_title: 'أرسل رسالة',
        contact_name: 'الاسم',
        contact_email: 'البريد الإلكتروني',
        contact_message: 'الرسالة',
        contact_submit: 'إرسال',
        footer_text: '© {year} علي عبد الله إسماعيل عبد الله. مصمم بدقة وغاية.'
    }
};

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.style.textAlign = lang === 'ar' ? 'right' : 'left';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = translations[lang]?.[key];
        if (value) {
            if (key === 'footer_text') {
                el.innerHTML = value.replace('{year}', document.getElementById('year')?.textContent || new Date().getFullYear());
            } else {
                el.textContent = value;
            }
        }
    });

    document.querySelectorAll('[data-i18n-list]').forEach(el => {
        const key = el.getAttribute('data-i18n-list');
        const value = translations[lang]?.[key];
        if (value) {
            el.textContent = value;
        }
    });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    localStorage.setItem('portfolio-lang', lang);
    if (heroText) {
        startHeroAnimation();
    }
}

function startHeroAnimation() {
    if (!heroText) return;

    if (heroAnimationTimeoutId) {
        window.clearTimeout(heroAnimationTimeoutId);
        heroAnimationTimeoutId = null;
    }

    const words = currentLanguage === 'ar' ? heroWordsAr : heroWords;
    let wordIndex = 0;
    let letterIndex = 0;
    let isDeleting = false;

    const scheduleNext = (delay) => {
        window.clearTimeout(heroAnimationTimeoutId);
        heroAnimationTimeoutId = window.setTimeout(typeLoop, delay);
    };

    function typeLoop() {
        const currentWord = words[wordIndex] || words[0];
        heroText.textContent = currentWord.slice(0, letterIndex);

        if (!isDeleting && letterIndex < currentWord.length) {
            letterIndex += 1;
            scheduleNext(currentLanguage === 'ar' ? 110 : 90);
        } else if (isDeleting && letterIndex > 0) {
            letterIndex -= 1;
            scheduleNext(currentLanguage === 'ar' ? 60 : 45);
        } else {
            isDeleting = !isDeleting;
            if (!isDeleting) {
                wordIndex = (wordIndex + 1) % words.length;
            }
            scheduleNext(1200);
        }
    }

    heroText.textContent = '';
    wordIndex = 0;
    letterIndex = 0;
    isDeleting = false;
    scheduleNext(180);
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

startHeroAnimation();

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
    const syncMenuState = () => {
        const isOpen = navMenu.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Toggle navigation');
    };

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        syncMenuState();
    });

    syncMenuState();
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu?.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Toggle navigation');
        }
    });
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 760 && navMenu) {
        navMenu.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Toggle navigation');
        }
    }
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

const notifyDashboardSync = () => {
    try {
        if ('BroadcastChannel' in window) {
            const channel = new BroadcastChannel(portfolioSyncChannel);
            channel.postMessage({ type: 'message:new', source: 'portfolio' });
            channel.close();
        }
        localStorage.setItem('portfolio_dashboard_sync', JSON.stringify({ type: 'message:new', timestamp: Date.now() }));
    } catch (error) {
        console.warn('Dashboard sync notification failed', error);
    }
};

if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const message = formData.get('message')?.toString().trim();

        if (!name || !email || !message) {
            formMessage.textContent = 'Please complete all fields before sending.';
            formMessage.style.color = '#fb7185';
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

            formMessage.textContent = `Thank you, ${name}. Your message has been sent successfully.`;
            formMessage.style.color = '#14b8a6';
            contactForm.reset();
            notifyDashboardSync();
            trackVisitor('contact');
        } catch (error) {
            formMessage.textContent = error.message || 'Submission failed. Please try again.';
            formMessage.style.color = '#fb7185';
        }
    });
}
