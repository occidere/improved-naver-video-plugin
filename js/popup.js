function init() {
    // settings (checkbox)
    for (const container of document.querySelectorAll('.setting-checkbox')) {
        const checkbox = container.querySelector('input');
        // initialize
        chrome.storage.sync.get(checkbox.name, (items) => {
            checkbox.checked = items[checkbox.name];
            activateSetting(checkbox);
        });
        // update storage when clicked
        checkbox.addEventListener('change', (event) => {
            const checkbox = event.currentTarget;
            const items = { [checkbox.name]: checkbox.checked };
            chrome.storage.sync.set(items, () => sendSettingChangedMessage(SETTING_CHANGED_EVENT));
            activateSetting(checkbox);
        });
    }

    // extend-max-volume changes max value of default-volume range
    const onChangeExtendMaxVolumeCheckbox = (checked) => {
        const range = document.querySelector('#setDefaultVolumeRange');
        if (checked) {
            range.max = '1.5';
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
    };
    const extendMaxVolumeCheckbox = document.querySelector('#extendMaxVolumeCheckbox');
    extendMaxVolumeCheckbox.addEventListener('change', (event) => {
        const checkbox = event.currentTarget;
        onChangeExtendMaxVolumeCheckbox(checkbox.checked);
    });
    chrome.storage.sync.get('extendMaxVolume', (items) => {
        onChangeExtendMaxVolumeCheckbox(items['extendMaxVolume']);
    });

    // settings (range)
    for (const container of document.querySelectorAll('.setting-range')) {
        const range = container.querySelector('input');
        const indicator = container.querySelector('span.indicator');
        const setIndicator = (value) => {
            indicator.textContent = (parseFloat(value) * 100).toFixed() + '%';
        };
        // initialize
        chrome.storage.sync.get(range.name, (items) => {
            range.value = items[range.name];
            setIndicator(range.value);
        });
        // update indicator when dragged
        range.addEventListener('input', (event) => {
            const range = event.currentTarget;
            setIndicator(range.value);
        });
        // update storage when value is changed
        range.addEventListener('change', (event) => {
            const range = event.currentTarget;
            const items = { [range.name]: range.value };
            chrome.storage.sync.set(items, () => sendSettingChangedMessage(DEFAULT_VOLUME_CHANGED_EVENT));
        });
        // activate by mousedown when it is disabled
        range.addEventListener('mousedown', (event) => {
            const range = event.currentTarget;
            if (range.classList.contains('disabled')) {
                const checkbox = document.querySelector(`#${range.name}Checkbox`);
                checkbox.click();
            }
        });
    }
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

function activateSetting(checkbox) {
    if (checkbox.classList.contains('activate-range')) {
        const range = document.querySelector(`#${checkbox.name}Range`);
        if (checkbox.checked) {
            range.classList.remove('disabled');
        } else {
            range.classList.add('disabled');
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
