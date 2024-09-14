async function init() {
    const settings = await chrome.storage.sync.get(null); // get all items

    // checkbox settings
    for (const wrapper of document.querySelectorAll('.setting-checkbox')) {
        const checkbox = wrapper.querySelector('input[type=checkbox]');
        checkbox.checked = settings[checkbox.name];
        checkbox.addEventListener('change', () => {
            saveSetting(checkbox.name, checkbox.checked, getEventFromCheckbox(checkbox.name));
        });
    }

    // enable-app switch
    {
        const checkbox = document.querySelector('#enableSwitch');
        const contents = document.querySelector('#settingContents');
        if (!settings[checkbox.name]) {
            contents.style.display = 'none';
        }
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                contents.style.display = 'block';
            } else {
                contents.style.display = 'none';
            }
        });
    }

    // default-volume range setting
    {
        const range = document.querySelector('#defaultVolumeRange');
        const setIndicator = (value) => {
            const indicator = document.querySelector('#defaultVolumeIndicator');
            const percentage = (parseFloat(value) * 100).toFixed();
            indicator.textContent = `${percentage}%`;
        };
        range.value = settings[range.name];
        setIndicator(range.value);
        range.addEventListener('input', () => { // range is dragged
            setIndicator(range.value);
        });
        range.addEventListener('change', () => { // range is released
            saveSetting(range.name, range.value, DEFAULT_VOLUME_CHANGED_EVENT);
        });
    }

    // connect set-default-volume checkbox & default-volume range
    {
        const checkbox = document.querySelector('#setDefaultVolumeCheckbox');
        const range = document.querySelector('#defaultVolumeRange');
        const indicator = document.querySelector('#defaultVolumeIndicator');
        if (!settings[checkbox.name]) {
            range.classList.add('disabled');
            indicator.classList.add('disabled');
        }
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                range.classList.remove('disabled');
                indicator.classList.remove('disabled');
            } else {
                range.classList.add('disabled');
                indicator.classList.add('disabled');
            }
        });
    }

    // connect extend-volume-slider checkbox & default-volume range
    {
        const checkbox = document.querySelector('#extendVolumeSliderCheckbox');
        const range = document.querySelector('#defaultVolumeRange');
        if (settings[checkbox.name]) {
            range.classList.add('extended');
        }
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                range.classList.add('extended');
            } else {
                range.classList.remove('extended');
            }
        });
    }

    // connect default-volume range & set-default-volume checkbox
    // mouse down range -> enable checkbox
    {
        const range = document.querySelector('#defaultVolumeRange');
        const checkbox = document.querySelector('#setDefaultVolumeCheckbox');
        range.addEventListener('mousedown', () => {
            if (range.classList.contains('disabled')) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
    }

    // connect precise-volume-shortcut checkbox & volume-number input
    {
        const checkbox = document.querySelector('#preciseVolumeShortcutCheckbox');
        const input = document.querySelector('#volumeNumberInput');
        input.disabled = !settings[checkbox.name];
        checkbox.addEventListener('change', () => {
            input.disabled = !checkbox.checked;
        });
    }

    // volume-number input setting
    {
        const input = document.querySelector('#volumeNumberInput');
        input.value = settings[input.name];
        input.addEventListener('change', () => {
            let value = parseInt(input.value);
            value = Math.max(value, 1);  // value >= 1
            value = Math.min(value, 20); // value <= 20
            saveSetting(input.name, value.toFixed(), VOLUME_NUMBER_CHANGED_EVENT);
        });
    }

    // connect precise-volume-shortcut checkbox & more-precise-in-low-volume wrapper
    {
        const checkbox = document.querySelector('#preciseVolumeShortcutCheckbox');
        const wrapper = document.querySelector('#morePreciseInLowVolumeWrapper');
        if (!settings[checkbox.name]) {
            wrapper.classList.add('disabled');
        }
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                wrapper.classList.remove('disabled');
            } else {
                wrapper.classList.add('disabled');
            }
        });
    }

    // connect left-right-shortcut checkbox & time-number input
    {
        const checkbox = document.querySelector('#leftRightShortcutCheckbox');
        const input = document.querySelector('#timeNumberInput');
        input.disabled = !settings[checkbox.name];
        checkbox.addEventListener('change', () => {
            input.disabled = !checkbox.checked;
        });
    }

    // time-number input setting
    {
        const input = document.querySelector('#timeNumberInput');
        input.value = settings[input.name];
        input.addEventListener('change', () => {
            let value = parseFloat(input.value);
            value = Math.max(value, 0.1); // value >= 0.1
            value = Math.min(value, 60);  // value <= 60
            saveSetting(input.name, value.toFixed(1), TIME_NUMBER_CHANGED_EVENT);
        });
    }
}

function getEventFromCheckbox(checkboxName) {
    switch (checkboxName) {
        case 'morePreciseInLowVolume':
            return MORE_PRECISE_IN_LOW_VOLUME_SETTING_CHANGED;
    }
    return SETTING_CHANGED_EVENT;
}

async function saveSetting(key, value, event) {
    await chrome.storage.sync.set({ [key]: value });
    if (event) {
        sendAppMessage(event)
    }
}

async function sendAppMessage(event) {
    const message = { app: APP_NAME, event: event };
    const tabs = await chrome.tabs.query({}); // query all tabs
    for (const tab of tabs) {
        try {
            chrome.tabs.sendMessage(tab.id, message);
        } catch (e) {
            console.warn(e);
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
