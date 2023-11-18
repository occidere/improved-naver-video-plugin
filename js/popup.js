function init() {
    const optionsDiv = document.getElementById('options');
    for (const optionCheckboxDiv of optionsDiv.getElementsByClassName('option-checkbox')) {
        const checkbox = optionCheckboxDiv.getElementsByTagName('input')[0];
        chrome.storage.sync.get(checkbox.name, (items) => {
            checkbox.checked = items[checkbox.name];
        });
        checkbox.addEventListener('change', (event) => {
            const checkbox = event.currentTarget;
            const items = { [checkbox.name]: checkbox.checked };
            chrome.storage.sync.set(items, sendOptionChangedMessage);
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
