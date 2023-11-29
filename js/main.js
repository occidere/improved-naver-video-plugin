function init() {
    const videoPlayerFinder = getVideoPlayerFinder();
    if (!videoPlayerFinder) return; // video player cannot exist

    update(videoPlayerFinder);
    chrome.runtime.onMessage.addListener((message) => {
        if (message.app === APP_NAME) {
            if (message.event === SETTING_CHANGED_EVENT) {
                update(videoPlayerFinder);
            } else if (message.event === DEFAULT_VOLUME_CHANGED_EVENT) {
                updateDefaultVolume(videoPlayerFinder);
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

function getDecorators(settings) {
    switch (location.hostname) {
        case 'cafe.naver.com':
        case 'blog.naver.com':
            return [
                [new SelectMaxQualityDecorator, settings['selectMaxQuality']],
                [new AutoPlayFirstVideoDecorator, settings['autoPlayFirstVideo']],
                [new EasyClickToPlayDecorator, settings['easyClickToPlay']],
                [new QualityDisplayDecorator, settings['qualityDisplay']],
                [new PlaybackRateDisplayDecorator, settings['playbackRateDisplay']],
                [new ExtendMaxVolumeDecorator, settings['extendMaxVolume']],
                [new SetDefaultVolumeDecorator, settings['setDefaultVolume']],
                [new PreserveVolumeAfterReplayDecorator, settings['setDefaultVolume'] || settings['extendMaxVolume']],
            ];
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
        'extendMaxVolume',
    ]);
}

async function update(videoPlayerFinder) {
    const settings = await getSettings();
    const decorators = getDecorators(settings);
    videoPlayerFinder.applyCallback((videoPlayer) => {
        for (const [decorator, isEnabled] of decorators) {
            const decoratorName = decorator.constructor.name;
            const isDecorated = videoPlayer.decorated[decoratorName];
            try {
                if (!isDecorated && isEnabled) {
                    videoPlayer.decorated[decoratorName] = true;
                    decorator.decorate(videoPlayer);
                } else if (isDecorated && !isEnabled) {
                    decorator.clear(videoPlayer).then((res) => {
                        if (res) videoPlayer.decorated[decoratorName] = false;
                    });
                }
            } catch (e) {
                console.warn(e);
            }
        }
    });
}

function updateDefaultVolume(videoPlayerFinder) {
    for (const video of videoPlayerFinder.videoPlayers) {
        video.decorated['SetDefaultVolumeDecorator'] = false; // reset decoration state
    }
    update(videoPlayerFinder);
}

init();
