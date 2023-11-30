function init() {
    // settings (checkbox)
    for (const container of document.querySelectorAll('.setting-checkbox')) {
        const checkbox = container.querySelector('input');
        // initialize checkbox
        chrome.storage.sync.get(checkbox.name, (items) => {
            checkbox.checked = items[checkbox.name];
        });
        // update storage when checkbox is changed
        checkbox.addEventListener('change', (event) => {
            const checkbox = event.currentTarget;
            const items = { [checkbox.name]: checkbox.checked };
            chrome.storage.sync.set(items, () => sendSettingChangedMessage(SETTING_CHANGED_EVENT));
        });
    }

    // set-default-volume disables default-volume range
    connectCheckboxAndRange('setDefaultVolume', 'defaultVolume', (checked, range) => {
        if (checked) {
            range.classList.remove('disabled');
        } else {
            range.classList.add('disabled');
        }
    });

    // extend-max-volume changes max value of default-volume range
    connectCheckboxAndRange('extendMaxVolume', 'defaultVolume', (checked, range) => {
        if (checked) {
            range.max = '2.0'; // sync with ExtendMaxVolumeDecorator.AMPLIFY_FACTOR
            range.classList.add('extended');
        } else {
            if (parseFloat(range.value) > 1.0) {
                range.value = '1.0'
                range.dispatchEvent(new Event('input'));
                range.dispatchEvent(new Event('change'));
            }
            range.max = '1.0';
            range.classList.remove('extended');
        }
    });

    // settings (range)
    for (const container of document.querySelectorAll('.setting-range')) {
        const range = container.querySelector('input');
        const indicator = container.querySelector('span.indicator');
        // initialize range
        chrome.storage.sync.get(range.name, (items) => {
            range.value = items[range.name];
            setIndicator(indicator, range.value);
        });
        // update indicator when range is dragged
        range.addEventListener('input', (event) => {
            const range = event.currentTarget;
            const indicator = range.closest('.setting-range').querySelector('span.indicator');
            setIndicator(indicator, range.value);
        });
        // update storage when range value is changed
        range.addEventListener('change', (event) => {
            const range = event.currentTarget;
            const items = { [range.name]: range.value };
            chrome.storage.sync.set(items, () => sendSettingChangedMessage(DEFAULT_VOLUME_CHANGED_EVENT));
        });
    }

    // pressing default-volume range enables set-default-volume checkbox
    const defaultVolumeRange = document.querySelector('#defaultVolumeRange');
    defaultVolumeRange.addEventListener('mousedown', (event) => {
        const range = event.currentTarget;
        if (range.classList.contains('disabled')) {
            const checkbox = document.querySelector('#setDefaultVolumeCheckbox');
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
        }
    });
}

async function sendSettingChangedMessage(event) {
    const message = { app: APP_NAME, event };
    const tabs = await chrome.tabs.query({});
    for (const tab of tabs) {
        try {
            chrome.tabs.sendMessage(tab.id, message);
        } catch (e) {
            console.warn(`sendMessage failed: ${e}`);
        }
    }
}

// callback: (checked: boolean, range: HTMLInputElement) => void
function connectCheckboxAndRange(checkboxName, rangeName, callback) {
    const checkbox = document.querySelector(`#${checkboxName}Checkbox`);
    // apply current state of checkbox
    chrome.storage.sync.get(checkboxName, (items) => {
        const range = document.querySelector(`#${rangeName}Range`);
        callback(items[checkboxName], range);
    });
    // apply callback when checkbox changes
    checkbox.addEventListener('change', (event) => {
        const range = document.querySelector(`#${rangeName}Range`);
        callback(event.currentTarget.checked, range);
    });
}

function setIndicator(indicator, value) {
    indicator.textContent = (parseFloat(value) * 100).toFixed() + '%';
}

document.addEventListener('DOMContentLoaded', init);
