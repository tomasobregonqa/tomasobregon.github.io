document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggleButton = document.getElementById('theme-toggle');
    const langToggleButton = document.getElementById('lang-toggle');
    const copyrightYearSpan = document.getElementById('copyright-year');
    const htmlElement = document.documentElement;
    const downloadCvLink = document.getElementById('cv-download');
    
    
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyToast = document.getElementById('copy-toast');

    
    let translations = {};

    
    const setLanguage = (lang) => {
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.dataset.translateKey;
            
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });

        
        if (lang === 'en') {
            downloadCvLink.href = 'downloads/cv-tomas-english.pdf';
            downloadCvLink.setAttribute('download', 'cv-tomas-english.pdf');
        } else {
            downloadCvLink.href = 'downloads/cv-tomas-spanish.pdf';
            downloadCvLink.setAttribute('download', 'cv-tomas-spanish.pdf');
        }

        
        downloadCvLink.title = translations[lang].downloadCvTitle;
        langToggleButton.title = translations[lang].langToggleTitle;
        themeToggleButton.title = translations[lang].themeToggleTitle;
        
        
        if (copyEmailBtn) {
            copyEmailBtn.title = translations[lang].copyEmailTitle;
        }

        
        htmlElement.setAttribute('lang', lang);
        langToggleButton.textContent = lang === 'en' ? 'ES' : 'EN';
    };
    
    
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
    };

    
    const initializeApp = () => {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });

        langToggleButton.addEventListener('click', () => {
            const currentLang = htmlElement.getAttribute('lang');
            const newLang = currentLang === 'en' ? 'es' : 'en';
            setLanguage(newLang);
            localStorage.setItem('language', newLang);
        });

        
        if (copyEmailBtn) {
            copyEmailBtn.addEventListener('click', () => {
                const textToCopy = emailText.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    
                    const currentLang = htmlElement.getAttribute('lang') || 'en';
                    copyToast.textContent = translations[currentLang].copySuccess;
                    copyToast.classList.add('show');
                    
                    
                    setTimeout(() => {
                        copyToast.classList.remove('show');
                    }, 3000);
                }).catch(err => {
                    console.error('Error al copiar el email: ', err);
                });
            });
        }


        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);

        
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');

        
        let finalLang = urlLang || localStorage.getItem('language') || 'en';

        
        if (finalLang !== 'es' && finalLang !== 'en') {
            finalLang = 'en';
        }

        
        setLanguage(finalLang);

        
        if (urlLang) {
            localStorage.setItem('language', finalLang);
        }

        copyrightYearSpan.textContent = new Date().getFullYear();
    };

    
    fetch('translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data; 
            initializeApp();    
        })
        .catch(error => {
            console.error("Error loading translations:", error);

        });
});
