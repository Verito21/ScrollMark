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

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === '.') {
        const position = window.scrollY / document.body.scrollHeight * 100;
        createPin(position);
    }
});

loadPins();
