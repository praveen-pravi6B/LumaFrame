const powerToggle = document.getElementById('power-toggle');
const brightnessSlider = document.getElementById('brightness-slider');
const brightnessLabel = document.getElementById('brightness-label');
const widthSlider = document.getElementById('width-slider');
const widthLabel = document.getElementById('width-label');
const presetButtons = document.querySelectorAll('.preset');

// Load settings
chrome.storage.local.get(['enabled', 'color', 'brightness', 'width', 'presetName'], (result) => {
    powerToggle.checked = result.enabled ?? false;

    const brightness = result.brightness ?? 50;
    brightnessSlider.value = brightness;
    brightnessLabel.innerText = `Brightness: ${brightness}%`;

    const width = Math.min(result.width ?? 20, 40);
    widthSlider.value = width;
    widthLabel.innerText = `Border Width: ${width}px`;

    const activePreset = result.presetName || '3000K';
    presetButtons.forEach(btn => {
        if (btn.getAttribute('data-value') === activePreset) {
            btn.classList.add('active');
        }
    });
});

// Power toggle
powerToggle.addEventListener('change', () => {
    chrome.storage.local.set({ enabled: powerToggle.checked });
});

// Brightness slider
brightnessSlider.addEventListener('input', () => {
    const val = brightnessSlider.value;
    brightnessLabel.innerText = `Brightness: ${val}%`;
    chrome.storage.local.set({ brightness: parseInt(val) });
});

// Width slider
widthSlider.addEventListener('input', () => {
    const val = widthSlider.value;
    widthLabel.innerText = `Border Width: ${val}px`;
    chrome.storage.local.set({ width: parseInt(val) });
});

// Presets
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        const presetName = btn.getAttribute('data-value');

        // Update UI
        presetButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Save
        chrome.storage.local.set({
            color: color,
            presetName: presetName
        });
    });
});
