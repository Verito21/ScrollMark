document.addEventListener('DOMContentLoaded', () => {
    const pinList = document.getElementById('pinList');

    function loadPinList() {
        chrome.storage.local.get('pins', (result) => {
            pinList.innerHTML = '';
            if (result.pins) {
                result.pins.forEach((position, index) => {
                    const li = document.createElement('li');
                    li.textContent = `Pin ${index + 1}: ${position.toFixed(2)}%`;
                    li.onclick = () => {
                        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                            chrome.scripting.executeScript({
                                target: { tabId: tabs[0].id },
                                func: (position) => {
                                    window.scrollTo({ top: position * document.body.scrollHeight / 100, behavior: 'smooth' });
                                },
                                args: [position]
                            });
                        });
                    };
                    pinList.appendChild(li);
                });
            }
        });
    }

    loadPinList();
});
