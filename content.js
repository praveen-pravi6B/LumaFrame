let edgeLight = null;
let cameraActive = false;
let checkInterval = null;

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

async function checkCamera() {
    // 1. Check if any video element is currently using an active media stream
    const videos = document.getElementsByTagName('video');
    let videoActive = false;
    for (const v of videos) {
        // We look for videos that are actually playing and have an active media stream
        if (v.srcObject && v.srcObject instanceof MediaStream && v.srcObject.active && !v.paused) {
            videoActive = true;
            break;
        }
    }

    if (videoActive !== cameraActive) {
        cameraActive = videoActive;
        // Refresh UI
        chrome.storage.local.get(['enabled', 'color', 'brightness', 'width', 'smartEnabled'], (result) => {
            updateLight(result);
        });
    }
}

function updateLight(settings) {
    if (!edgeLight) createEdgeLight();

    const { enabled, color, brightness, width, smartEnabled } = settings;

    // Logic: Power must be ON. If Smart Activation is ON, Camera must be ACTIVE.
    const shouldShow = enabled && (!smartEnabled || cameraActive);

    if (shouldShow) {
        edgeLight.style.opacity = brightness / 100;
        const safeWidth = Math.min(width || 20, 40);
        edgeLight.style.border = `${safeWidth}px solid ${color}`;
        edgeLight.style.boxShadow = `0 0 30px 5px ${color}, inset 0 0 30px 5px ${color}`;
    } else {
        edgeLight.style.opacity = '0';
    }
}

// Initialize on load
chrome.storage.local.get(['enabled', 'color', 'brightness', 'width', 'smartEnabled'], (result) => {
    updateLight(result);
    checkCamera();
    if (!checkInterval) {
        checkInterval = setInterval(checkCamera, 1000);
    }
});

// Listen for storage changes to update live
chrome.storage.onChanged.addListener(() => {
    chrome.storage.local.get(['enabled', 'color', 'brightness', 'width', 'smartEnabled'], (result) => {
        updateLight(result);
    });
});
