async function init() {
    // create videoPlayerFinder
    const videoPlayerFinder = getVideoPlayerFinder();
    if (!videoPlayerFinder) return;

    // listen for setting change
    chrome.runtime.onMessage.addListener((message) => {
        if (message.app === APP_NAME &&
            message.event === SETTING_CHANGED_EVENT) {
            updateCallback(videoPlayerFinder);
        }
    });

    // update videoPlayerFinder and connect
    await updateCallback(videoPlayerFinder);
    videoPlayerFinder.connect(document);
}

function getVideoPlayerFinder() {
    switch (location.hostname) {
        case 'cafe.naver.com':
            return new CafeVideoPlayerFinder;
        case 'blog.naver.com':
            return new BlogVideoPlayerFinder;
    }
}

async function updateCallback(videoPlayerFinder) {
    const decoratorsAsync = [];
    const decoratorsSync = [];

    // get settings
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
                [new EasyClickToPlayDecorator, settings.easyClickToPlay],
                [new PlaybackRateDisplayDecorator, settings.playbackRateDisplay],
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

    // set callbacks
    videoPlayerFinder.setCallback(async (videoPlayer) => {
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
