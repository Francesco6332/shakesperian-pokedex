export const translateToShakespeare = async (text: string): Promise<string | undefined> => {
    try {
        const cleanText = text.replace(/[\f\n\r\t\v]/g, ' ').trim();
        
        const formData = new URLSearchParams();
        formData.append('text', cleanText);
        
        const response = await fetch('https://api.funtranslations.com/translate/shakespeare.json', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data && data.contents && data.contents.translated) {
            return data.contents.translated;
        }

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`, data);
            return undefined;
        }

        console.error('Unexpected response structure:', data);
        return undefined;
    } catch (error) {
        console.error('Error translating to Shakespeare:', error);
        return undefined;
    }
};

