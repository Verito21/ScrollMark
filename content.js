let pins = [];

function createPin(position) {
    const pin = document.createElement('div');
    pin.className = 'scrollbar-pin';
    pin.style.top = `${position}%`;
    pin.onclick = () => {
        window.scrollTo({ top: position * document.body.scrollHeight / 100, behavior: 'smooth' });
    };
    document.body.appendChild(pin);
    pins.push(pin);
    savePins();
}

function savePins() {
    const pinPositions = pins.map(pin => parseFloat(pin.style.top));
    chrome.storage.local.set({ pins: pinPositions });
}

function loadPins() {
    chrome.storage.local.get('pins', (result) => {
        if (result.pins) {
            result.pins.forEach(position => createPin(position));
        }
    });
}

function initPins() {
    // Remove existing pins
    pins.forEach(pin => pin.remove());
    pins = [];

    // Load saved pins
    loadPins();
}

// Monitor DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach(() => {
        // Recalculate pin positions if necessary
        updatePins();
    });
});

function updatePins() {
    const pinPositions = pins.map(pin => parseFloat(pin.style.top));
    pins.forEach(pin => pin.remove());
    pins = [];
    pinPositions.forEach(position => createPin(position));
}

observer.observe(document.body, { childList: true, subtree: true });

// Monitor URL changes for SPAs
let lastUrl = location.href;
new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        initPins();
    }
}).observe(document, { subtree: true, childList: true });

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'p') {
        const position = window.scrollY / document.body.scrollHeight * 100;
        createPin(position);
    }
});

// Initialize pins on page load
initPins();
