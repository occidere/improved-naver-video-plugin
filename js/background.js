let selectMaxQuality = false;

chrome.runtime.onInstalled.addListener(() => chrome.storage.sync.set({selectMaxQuality}));