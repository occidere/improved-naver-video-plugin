let selectMaxQuality = true;

chrome.runtime.onInstalled.addListener(() => chrome.storage.sync.set({selectMaxQuality}));