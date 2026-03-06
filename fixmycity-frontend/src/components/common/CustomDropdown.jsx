import React, { useState, useEffect, useRef } from 'react';

const CustomDropdown = ({ value, onChange, options, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

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
        <div className="relative w-full" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center justify-between w-full px-5 py-3.5 
                    text-sm font-medium tracking-wide
                    bg-gray-50/50 dark:bg-surface backdrop-blur-md
                    border transition-all duration-300 cursor-pointer
                    rounded-2xl shadow-sm hover:shadow-md
                    hover:border-gray-300 dark:hover:border-white/20
                    ${isOpen ? 'border-primary ring-2 ring-primary/20 dark:ring-primary/40 text-primary bg-white shadow-inner dark:border-primary' : 'border-gray-200/80 dark:border-white/10 text-gray-700 dark:text-gray-200'}
                `}
            >
                <span className="truncate">{selectedOption?.label || placeholder}</span>
                <svg
                    className={`w-4 h-4 ml-2 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : 'text-gray-400 group-hover:text-primary'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {}
            <div
                className={`
                    absolute z-50 w-full mt-2 origin-top
                    bg-white/95 dark:bg-surface/95 backdrop-blur-xl
                    border border-gray-100 dark:border-white/10
                    rounded-2xl shadow-lg overflow-hidden
                    transition-all duration-300 ease-out
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'}
                `}
            >
                <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full text-left px-5 py-3 text-sm font-medium transition-colors
                                ${value === option.value
                                    ? 'bg-primary/10 text-primary dark:text-primary dark:bg-primary/20'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                                }
                            `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomDropdown;
