const defaultItems = {
    enableApp: true,
    qualityDisplay: true,
    selectMaxQuality: true,
    playbackRateDisplay: true,
    dividePlaybackRate: true,
    autoPlayFirstVideo: false,
    autoPauseLastVideo: false,
    fixMouseAction: true,
    hideSettingButton: false,
    easyOpenVolumeSlider: true,
    extendVolumeSlider: true,
    removeVolumeSliderAnimation: true,
    preciseVolumeShortcut: true,
    volumeNumber: '10',
    morePreciseInLowVolume: true,
    extendMaxVolume: true,
    setDefaultVolume: true,
    defaultVolume: '0.50',
};

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === 'install') {
        chrome.storage.sync.set(defaultItems);
    } else if (details.reason === 'update') {
        const allItems = await chrome.storage.sync.get(null);
        const validKeys = Object.keys(defaultItems);
        const validItems = await chrome.storage.sync.get(validKeys);
        const addedItems = {};
        for (const key of validKeys) {
            if (!(key in validItems)) {
                addedItems[key] = defaultItems[key];
            }
        }
        chrome.storage.sync.set(addedItems);
        const removedKeys = [];
        for (const key in allItems) {
            if (!(key in validItems)) {
                removedKeys.push(key);
            }
        }
        chrome.storage.sync.remove(removedKeys);
        forceUpdateValues(details.previousVersion);
    }
});

function forceUpdateValues(previousVersion) {
    if (previousVersion < '2.3.0') {
        chrome.storage.sync.set({
            extendMaxVolume: true,
            setDefaultVolume: true,
            defaultVolume: '0.50',
        });
    }
}
