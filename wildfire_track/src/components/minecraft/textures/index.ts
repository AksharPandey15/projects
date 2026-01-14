const createTexture = (color: string, noiseFactor: number = 20) => {
    if (typeof document === 'undefined') return ''; // SSR safety
    
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Fill background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);

    // Add noise
    const imageData = ctx.getImageData(0, 0, 256, 256);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseFactor;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

// Cache textures
const textures: Record<string, string> = {};

const getUrl = (type: string) => {
    if (textures[type]) return textures[type];

    let color = '#ffffff';
    let noise = 20;

    switch (type) {
        case 'dirt':
            color = '#5d4037';
            noise = 40;
            break;
        case 'grass':
            color = '#388e3c';
            noise = 30;
            break;
        case 'glass':
            color = '#e1f5fe'; // Light blueish
            noise = 10;
            break;
        case 'wood':
            color = '#8d6e63';
            noise = 25;
            break;
        case 'log':
            color = '#3e2723';
            noise = 35;
            break;
    }

    // For grass, maybe add some "blades"? (Simple noise is fine for now)
    
    const url = createTexture(color, noise);
    textures[type] = url;
    return url;
}

export const textureUrls = {
    get dirt() { return getUrl('dirt'); },
    get grass() { return getUrl('grass'); },
    get glass() { return getUrl('glass'); },
    get wood() { return getUrl('wood'); },
    get log() { return getUrl('log'); },
};

export const getTextureColor = (texture: string) => {
    // Fallback colors if needed
     const colors: any = {
        dirt: '#5d4037',
        grass: '#388e3c',
        glass: '#e1f5fe',
        wood: '#8d6e63',
        log: '#3e2723',
    };
    return colors[texture] || '#ffffff';
};
