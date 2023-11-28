function init() {
    const videoPlayerFinder = getVideoPlayerFinder();
    if (!videoPlayerFinder) return; // video player cannot exist

    const decoratorMap = getDecoratorMap();
    update(videoPlayerFinder, decoratorMap);
    chrome.runtime.onMessage.addListener((message) => {
        if (message.app === APP_NAME) {
            if (message.event === SETTING_CHANGED_EVENT) {
                update(videoPlayerFinder, decoratorMap);
            } else if (message.event === DEFAULT_VOLUME_CHANGED_EVENT) {
                updateDefaultVolume(videoPlayerFinder, decoratorMap);
            }
        }
    });
}

function getVideoPlayerFinder() {
    switch (location.hostname) {
        case 'cafe.naver.com':
            return CafeVideoPlayerFinder.create(document);
        case 'blog.naver.com':
            return BlogVideoPlayerFinder.create(document);
    }
}

function getDecoratorMap() {
    switch (location.hostname) {
        case 'cafe.naver.com':
        case 'blog.naver.com':
            return new Map([
                ['selectMaxQuality', new SelectMaxQualityDecorator],
                ['autoPlayFirstVideo', new AutoPlayFirstVideoDecorator],
                ['easyClickToPlay', new EasyClickToPlayDecorator],
                ['qualityDisplay', new QualityDisplayDecorator],
                ['playbackRateDisplay', new PlaybackRateDisplayDecorator],
                ['setDefaultVolume', new SetDefaultVolumeDecorator],
            ]);
    }
}

async function getSettings() {
    return await chrome.storage.sync.get([
        'selectMaxQuality',
        'qualityDisplay',
        'playbackRateDisplay',
        'easyClickToPlay',
        'autoPlayFirstVideo',
        'setDefaultVolume',
    ]);
}

async function update(videoPlayerFinder, decoratorMap) {
    const settings = await getSettings();
    videoPlayerFinder.applyCallback((videoPlayer) => {
        for (const [key, decorator] of decoratorMap) {
            const decoratorName = decorator.constructor.name;
            const isDecorated = videoPlayer.decorated[decoratorName];
            const isEnabled = settings[key];
            try {
                if (!isDecorated && isEnabled) {
                    decorator.decorate(videoPlayer);
                    videoPlayer.decorated[decoratorName] = true;
                } else if (isDecorated && !isEnabled) {
                    if (decorator.clear(videoPlayer)) {
                        videoPlayer.decorated[decoratorName] = false;
                    }
                }
            } catch (e) {
                console.warn(e);
            }
        }
    });
}

async function updateDefaultVolume(videoPlayerFinder, decoratorMap) {
    for (const video of videoPlayerFinder.videoPlayers) {
        video.decorated[SetDefaultVolumeDecorator.name] = false; // reset decoration state
    }
    update(videoPlayerFinder, decoratorMap);
}

init();
