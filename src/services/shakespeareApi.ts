import type { ShakespeareTranslationResponse } from '../types/pokemon';

export const translateToShakespeare = async (text: string): Promise<string | undefined> => {
    try {
        const cleanText = text.replace(/[\f\n\r\t\v]/g, ' ').trim();
        
        const formData = new URLSearchParams();
        formData.append('text', cleanText);
        
        const response = await fetch('https://api.funtranslations.com/translate/shakespeare.json', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as ShakespeareTranslationResponse;
        return data.contents.translated;
    } catch (error) {
        console.error('Error translating to Shakespeare:', error);
        return undefined;
    }
};

