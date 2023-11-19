function init() {
    const optionsDiv = document.getElementById('options');
    for (const optionCheckboxDiv of optionsDiv.getElementsByClassName('option-checkbox')) {
        const checkbox = optionCheckboxDiv.querySelector('input');
        chrome.storage.sync.get(checkbox.name, (items) => {
            checkbox.checked = items[checkbox.name];
        });
        checkbox.addEventListener('change', (event) => {
            const checkbox = event.currentTarget;
            const items = { [checkbox.name]: checkbox.checked };
            chrome.storage.sync.set(items, sendOptionChangedMessage);
        });
    }
    for (const optionRangeDiv of optionsDiv.getElementsByClassName('option-range')) {
        const range = optionRangeDiv.querySelector('input');
        const indicator = optionRangeDiv.querySelector('.range-value-indicator');
        const setIndicator = (value) => indicator.textContent = (parseFloat(value) * 100).toFixed() + '%';
        chrome.storage.sync.get(range.name, (items) => {
            const value = items[range.name];
            range.value = value;
            setIndicator(value);
        });
        range.addEventListener('input', (event) => {
            const range = event.currentTarget;
            setIndicator(range.value);
        });
        range.addEventListener('change', (event) => {
            const range = event.currentTarget;
            const items = { [range.name]: range.value };
            chrome.storage.sync.set(items);
        });
    }
}

async function sendOptionChangedMessage() {
    const message = { event: 'optionChanged' };
    const urlMatches = chrome.runtime.getManifest().content_scripts[0].matches;
    const tabs = await chrome.tabs.query({ url: urlMatches });
    for (const tab of tabs) {
        try {
            chrome.tabs.sendMessage(tab.id, message);
        } catch (e) {
            console.debug(`sendMessage failed: ${e}`);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
