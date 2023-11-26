function init() {
    const videoPlayerFinder = getVideoPlayerFinderClass()?.create(document);
    if (!videoPlayerFinder) return;

    updateCallback(videoPlayerFinder);

    // receive setting change message
    chrome.runtime.onMessage.addListener((message) => {
        if (message.app === APP_NAME &&
            message.event === SETTING_CHANGED_EVENT) {
            updateCallback(videoPlayerFinder);
        }
    });
}

function getVideoPlayerFinderClass() {
    switch (location.hostname) {
        case 'cafe.naver.com':
            return CafeVideoPlayerFinder
        case 'blog.naver.com':
            return BlogVideoPlayerFinder
    }
}

async function updateCallback(videoPlayerFinder) {
    const decoratorsAsync = [];
    const decoratorsSync = [];

    const settings = await chrome.storage.sync.get([
        'selectMaxQuality',
        'qualityDisplay',
        'playbackRateDisplay',
        'autoPlayFirstVideo',
        'easyClickToPlay',
        'setDefaultVolume'
    ]);

    // create decorators
    switch (videoPlayerFinder.constructor) {
        case CafeVideoPlayerFinder:
        case BlogVideoPlayerFinder:
            push(decoratorsAsync,
                [new PlaybackRateDisplayDecorator, settings.playbackRateDisplay],
                [new EasyClickToPlayDecorator, settings.easyClickToPlay],
                [new AutoPlayFirstVideoDecorator, settings.autoPlayFirstVideo],
                [new SetDefaultVolumeDecorator, settings.setDefaultVolume],
            );
            push(decoratorsSync,
                [new QualityDisplayDecorator, settings.qualityDisplay],
                [new SelectMaxQualityDecorator, settings.selectMaxQuality],
            );
            break;
    }
    // utility function (item = [decorator, isEnabled])
    function push(array, ...items) {
        for (const item of items) {
            if (item[1]) array.push(item[0]);
        }
    }

    videoPlayerFinder.applyCallback(async (videoPlayer) => {
        for (const decorator of decoratorsAsync) {
            try {
                decorator.decorate(videoPlayer);
            } catch (e) {
                console.warn(e);
            }
        }
        for (const decorator of decoratorsSync) {
            try {
                await decorator.decorate(videoPlayer);
            } catch (e) {
                console.warn(e);
            }
        }
    });
}

init();
