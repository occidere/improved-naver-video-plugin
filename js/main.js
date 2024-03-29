function init() {
    const videoPlayerFinder = getVideoPlayerFinder();
    if (!videoPlayerFinder?.connect(document)) {
        return; // video player cannot exist
    }

    update(videoPlayerFinder);

    chrome.runtime.onMessage.addListener((message) => {
        if (message.app !== APP_NAME) return;
        switch (message.event) {
            case SETTING_CHANGED_EVENT:
                update(videoPlayerFinder);
                break;
            case DEFAULT_VOLUME_CHANGED_EVENT:
                forceRedecorate(videoPlayerFinder.videoPlayers, 'SetDefaultVolumeDecorator');
                update(videoPlayerFinder);
                break;
        }
    });
}

function getVideoPlayerFinder() {
    switch (location.hostname) {
        case 'cafe.naver.com':
            return new CafeVideoPlayerFinder;
        case 'blog.naver.com':
            return new BlogVideoPlayerFinder;
    }
}

// [ [decorator, isEnabled], ... ]
function getDecorators(settings) {
    switch (location.hostname) {
        case 'cafe.naver.com':
        case 'blog.naver.com':
            return [
                [new SelectMaxQualityDecorator, settings['selectMaxQuality']],
                [new QualityDisplayDecorator, settings['qualityDisplay']],
                [new DividePlaybackRateDecorator, settings['dividePlaybackRate']],
                [new PlaybackRateDisplayDecorator, settings['playbackRateDisplay']],
                [new PlaybackRateShortcutDecorator, settings['playbackRateShortcut']],
                [new EasyClickToPlayDecorator, settings['easyClickToPlay']],
                [new AutoPauseLastVideoDecorator, settings['autoPauseLastVideo']],
                [new AutoPlayFirstVideoDecorator, settings['autoPlayFirstVideo']],
                [new HideSettingButtonDecorator, settings['hideSettingButton']],
                [new EasyOpenVolumeSliderDecorator, settings['easyOpenVolumeSlider']],
                [new FullScreenShortcutDecorator, settings['fullScreenShortcut']],
                [new MuteShortcutDecorator, settings['muteShortcut']],
                [new PreciseVolumeShortcutDecorator, settings['preciseVolumeShortcut']],
                [new ExtendVolumeSliderDecorator, settings['extendVolumeSlider']],
                [new ExtendMaxVolumeDecorator, settings['extendMaxVolume']],
                [new SetDefaultVolumeDecorator, settings['setDefaultVolume']],
                [new PreserveVolumeAfterReplayDecorator, settings['setDefaultVolume']
                                                      || settings['extendMaxVolume']
                                                      || settings['preciseVolumeShortcut']],
            ];
    }
}

async function update(videoPlayerFinder) {
    const settings = await chrome.storage.sync.get(null); // get all items
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
                        if (res) {
                            videoPlayer.decorated[decoratorName] = false;
                        }
                    });
                }
            } catch (e) {
                console.warn(e);
            }
        }
    });
}

function forceRedecorate(videoPlayers, decoratorName) {
    for (const video of videoPlayers) {
        video.decorated[decoratorName] = false;
    }
}

init();
