class ImageGenerator {
    constructor() {
        this.apiKey = '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';
        this.apiUrl = 'https://api-inference.huggingface.co/models/prompthero/openjourney';
        
        this.styleOptions = {
            'mdjrny-v4': 'Midjourney v4 Style',
            'mdjrny-anime': 'Anime Style',
            'mdjrny-realistic': 'Realistic',
            'mdjrny-painting': 'Painting Style',
            'mdjrny-fantasy': 'Fantasy Art'
        };
        
        this.init();
    }

    init() {
        this.promptInput = document.getElementById('promptInput');
        this.styleSelect = document.getElementById('styleSelect');
        this.generateBtn = document.getElementById('generateBtn');
        this.imageContainer = document.querySelector('.image-container');
        this.loadingSpinner = document.querySelector('.loading-spinner');
        this.historyContainer = document.querySelector('.history-container');

        this.styleSelect.innerHTML = Object.entries(this.styleOptions)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join('');

        this.generateBtn.addEventListener('click', () => this.generateImage());
        this.loadHistory();
    }

    async generateImage() {
        const prompt = this.promptInput.value;
        const style = this.styleSelect.value;

        if (!prompt) {
            alert('Please enter a description');
            return;
        }

        this.loadingSpinner.hidden = false;
        this.generateBtn.disabled = true;

        let retries = 3;
        
        while (retries > 0) {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: `/imagine prompt: ${prompt}, ${style}, highly detailed, 4k, trending on artstation, sharp focus, studio quality`,
                    })
                });

                if (!response.ok) {
                    const errorDetails = await response.json();
                    throw new Error(`Failed to generate image: ${errorDetails.error}`);
                }

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                this.displayImage(imageUrl, prompt);
                this.saveToHistory(imageUrl, prompt);
                return;
            } catch (error) {
                console.error('Error generating image:', error);
                alert('Error generating image. Please try again.');
                retries--;
            } finally {
                this.loadingSpinner.hidden = true;
                this.generateBtn.disabled = false;
            }
        }
    }
    displayImage(imageUrl, prompt) {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card';
        imageCard.innerHTML = `
            <img src="${imageUrl}" alt="${prompt}" onerror="this.onerror=null; this.src='https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';">
            <p>${prompt}</p>
            <button onclick="downloadImage('${imageUrl}', '${prompt}')">Download</button>
        `;
        this.imageContainer.insertBefore(imageCard, this.imageContainer.firstChild);
    }

    saveToHistory(imageUrl, prompt) {
        const history = JSON.parse(localStorage.getItem('imageHistory') || '[]');
        history.unshift({ imageUrl, prompt, date: new Date().toISOString() });
        localStorage.setItem('imageHistory', JSON.stringify(history.slice(0, 20)));
        this.loadHistory();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('imageHistory') || '[]');
        this.historyContainer.innerHTML = history.map(item => `
            <div class="image-card">
                <img src="${item.imageUrl}" alt="${item.prompt}">
                <p>${item.prompt}</p>
                <small>${new Date(item.date).toLocaleDateString()}</small>
                <button onclick="downloadImage('${item.imageUrl}', '${item.prompt}')">Download</button>
            </div>
        `).join('');
    }
}

function downloadImage(url, prompt) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prompt.slice(0, 30)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

new ImageGenerator();