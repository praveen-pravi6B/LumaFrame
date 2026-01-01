let edgeLight = null;

function createEdgeLight() {
    if (edgeLight) return;

    edgeLight = document.createElement('div');
    edgeLight.id = 'edge-light-overlay';

    // Initial styles
    Object.assign(edgeLight.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '2147483647',
        transition: 'opacity 0.5s ease-in-out',
        opacity: '0',
        boxSizing: 'border-box',
        overflow: 'hidden',
        borderRadius: '80px' // Polished constant roundness
    });

    document.documentElement.appendChild(edgeLight);
}

function updateLight(settings) {
    if (!edgeLight) createEdgeLight();

    const { enabled, color, brightness, width } = settings;

    if (enabled) {
        edgeLight.style.opacity = brightness / 100;
        // Clamp width significantly for the studio look (max 40 as requested)
        const safeWidth = Math.min(width || 20, 40);
        edgeLight.style.border = `${safeWidth}px solid ${color}`;

        // Studio dual glow
        edgeLight.style.boxShadow = `0 0 30px 5px ${color}, inset 0 0 30px 5px ${color}`;
    } else {
        edgeLight.style.opacity = '0';
    }
}

// Initialize on load
chrome.storage.local.get(['enabled', 'color', 'brightness', 'width'], (result) => {
    const settings = {
        enabled: result.enabled ?? false,
        color: result.color || '#ff9329',
        brightness: result.brightness ?? 50,
        width: result.width ?? 20
    };
    updateLight(settings);
});

// Listen for storage changes to update live
chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(['enabled', 'color', 'brightness', 'width'], (result) => {
        updateLight({
            enabled: result.enabled ?? false,
            color: result.color || '#ff9329',
            brightness: result.brightness ?? 50,
            width: result.width ?? 20
        });
    });
});
