import React from 'react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';


function TranslateButton({ onClick, isTranslated, isTranslating, error, compact = false }) {
    const { t } = useTranslation();

    if (compact) {
        return (
            <button
                onClick={onClick}
                disabled={isTranslating}
                title={isTranslated ? t('translate.showOriginal', 'Show Original') : t('translate.translate', 'Translate')}
                className={`p-1.5 rounded-lg transition-all duration-200 ${isTranslated
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${isTranslating ? 'animate-pulse' : ''}`}
            >
                <LanguageIcon className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={onClick}
                disabled={isTranslating}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${isTranslated
                        ? 'bg-primary/15 text-primary hover:bg-primary/25'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                    } ${isTranslating ? 'opacity-70 cursor-wait' : ''}`}
            >
                <LanguageIcon className="w-4 h-4" />
                {isTranslating
                    ? t('translate.translating', 'Translating...')
                    : isTranslated
                        ? t('translate.showOriginal', 'Show Original')
                        : t('translate.translate', 'Translate')
                }
            </button>
            {error && (
                <span className="text-xs text-red-500">{t('translate.failed', 'Translation failed')}</span>
            )}
        </div>
    );
}

export default TranslateButton;
