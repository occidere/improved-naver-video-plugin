// set default values
chrome.runtime.onInstalled.addListener(() => chrome.storage.sync.set({
    selectMaxQuality: true,
    playbackRateDisplay: true,
    autoPlayFirstVideo: false,
    defaultVolume: '1.0'
}));
