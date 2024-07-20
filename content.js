let pins = [];

function createPin(position) {
    const pin = document.createElement('img');
    pin.src = 'chrome-extension://fjnehckfcmbcjbldifdbjalejbgclfpg/icons/icon16.png';
   pin.className = 'scrollbar-pin';
    pin.style.top = `${position}%`;
    pin.onclick = () => {
        window.scrollTo({ top: position * document.body.scrollHeight / 100, behavior: 'smooth' });
    };
    document.body.appendChild(pin);
    pins.push(pin);
    savePins();
}

// Function to save pin positions to chrome.storage
function savePins() {
    const pinPositions = pins.map(pin => parseFloat(pin.style.top));
    chrome.storage.local.set({ pins: pinPositions }, () => {
        if (chrome.runtime.lastError) {
            console.error('Error saving pins:', chrome.runtime.lastError);
        } else {
            console.log('Pins saved successfully');
        }
    });
}

// Function to load pin positions from chrome.storage
function loadPins() {
    chrome.storage.local.get('pins', (result) => {
        if (chrome.runtime.lastError) {
            console.error('Error loading pins:', chrome.runtime.lastError);
        } else if (result.pins) {
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
