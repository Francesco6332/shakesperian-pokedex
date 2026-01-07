export const translateToShakespeare = async (text: string): Promise<string | undefined> => {
    try {
        const cleanText = text.replace(/[\f\n\r\t\v]/g, ' ').replace(/\s+/g, ' ').trim();
        
        if (!cleanText) {
            console.warn('Testo vuoto dopo la pulizia');
            return undefined;
        }
        
        const encodedText = encodeURIComponent(cleanText);
        const url = `https://api.funtranslations.com/translate/shakespeare.json?text=${encodedText}`;
        
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 429) {
                console.warn('Rate limit raggiunto per Shakespeare API. Usando testo originale.');
            } else {
                console.warn(`HTTP error! status: ${response.status}`, errorData);
            }
            return undefined;
        }

        const data = await response.json();

        if (data?.contents?.translated) {
            return data.contents.translated;
        }

        if (data?.error) {
            console.warn('Errore dalla API Shakespeare:', data.error);
            return undefined;
        }

        console.warn('Struttura risposta inaspettata:', data);
        return undefined;
    } catch (error) {
        console.error('Errore nella traduzione Shakespeare:', error);
        return undefined;
    }
};

