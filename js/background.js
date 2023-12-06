const defaultItems = {
    selectMaxQuality: true,
    qualityDisplay: true,
    dividePlaybackRate: false,
    playbackRateDisplay: true,
    easyClickToPlay: true,
    autoPauseLastVideo: false,
    autoPlayFirstVideo: false,
    hideSettingButton: false,
    easyOpenVolumeSlider: true,
    extendVolumeSlider: false,
    extendMaxVolume: false,
    setDefaultVolume: false,
    defaultVolume: '1.0'
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
    }
});
