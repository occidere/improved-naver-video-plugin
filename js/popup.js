function init() {
    document.addEventListener('DOMContentLoaded', () => {
        const selectMaxQualityCheckbox = document.getElementById('selectMaxQualityCheckbox');
        selectMaxQualityCheckbox.addEventListener('change', (event) => onCheckboxChanged(selectMaxQualityCheckbox, event));
        changeSelectMaxQualityCheckboxStatus(selectMaxQualityCheckbox);
    });
}

function onCheckboxChanged(selectMaxQualityCheckbox, event) {
    chrome.storage.sync.set(({selectMaxQuality: event.target.checked}), () => changeSelectMaxQualityCheckboxStatus(selectMaxQualityCheckbox));
}

function changeSelectMaxQualityCheckboxStatus(selectMaxQualityCheckbox) {
    chrome.storage.sync.get('selectMaxQuality', ({selectMaxQuality}) => selectMaxQualityCheckbox.checked = selectMaxQuality);
}

init();