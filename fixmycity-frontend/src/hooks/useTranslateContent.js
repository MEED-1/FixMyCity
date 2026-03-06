import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translateFields } from '../services/translateService';


export function useTranslateContent(originalFields) {
    const { i18n } = useTranslation();
    const [translatedFields, setTranslatedFields] = useState(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isTranslated, setIsTranslated] = useState(false);
    const [error, setError] = useState(null);

    const toggleTranslation = useCallback(async () => {
        if (isTranslated) {
            setIsTranslated(false);
            return;
        }

        setIsTranslating(true);
        setError(null);

        try {
            const result = await translateFields(originalFields, i18n.language);
            setTranslatedFields(result);
            setIsTranslated(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsTranslating(false);
        }
    }, [originalFields, i18n.language, isTranslated]);

    const displayFields = isTranslated && translatedFields ? translatedFields : originalFields;

    return {
        displayFields,
        isTranslating,
        isTranslated,
        toggleTranslation,
        error,
    };
}
