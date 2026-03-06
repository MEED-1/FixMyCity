import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'ar', name: 'العربية', flag: 'https://flagcdn.com/w40/ma.png' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode) => {
        i18n.changeLanguage(langCode);
        document.dir = langCode === 'ar' ? 'rtl' : 'ltr';
        setIsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-100/80 hover:bg-gray-200 dark:bg-surface dark:hover:bg-muted border border-transparent dark:border-border transition-all duration-300"
            >
                <img src={currentLang.flag} alt={`${currentLang.name} flag`} className="w-5 h-auto rounded-sm shadow-sm" />
                <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface border border-gray-100 dark:border-border rounded-xl shadow-lg z-50 origin-top-right transform transition-all overflow-hidden">
                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`w-full text-left px-4 py-2.5 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-muted transition-colors ${currentLang.code === lang.code ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                            >
                                <img src={lang.flag} alt={`${lang.name} flag`} className="w-5 h-auto rounded-sm shadow-sm" />
                                <span className={`text-sm ${currentLang.code === lang.code ? 'font-bold text-primary' : 'text-gray-700 dark:text-gray-200 font-medium'}`}>
                                    {lang.name}
                                </span>
                                {currentLang.code === lang.code && (
                                    <svg className="w-4 h-4 text-primary ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
