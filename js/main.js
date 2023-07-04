async function init() {
    if (isCafe()) {
        getIframe().addEventListener('load', () => decorateAll());
    } else if (isBlog()) {
        await decorateAll();
    } else {
        console.warn(`Unknown source!`);
    }
}

async function decorateAll() {
    const decorators = [
        new SelectMaxQualityDecorator(),
        new QualityDisplayDecorator(), // Have to follow after SelectMaxQualityDecorator
    ];
    const videoPlayerElements = await getVideoPlayerElements();
    console.debug(`video count: ${videoPlayerElements.length}, decorator count: ${decorators.length}`);

    for (const decorator of decorators) {
        await decorator.decorate(videoPlayerElements);
    }
}

async function getVideoPlayerElements() {
    const videoPlayerElements = [];
    let maxRetryCount = 20;
    while (videoPlayerElements.length === 0 && 0 < maxRetryCount--) {
        console.debug(`Try to gather video elements (retry left: ${maxRetryCount})`);
        const videoPlayerDivs = getIframeDocument().getElementsByClassName(VIDEO_PLAYER_CLASS);
        for (const videoPlayerDiv of videoPlayerDivs) {
            try {
                // Explicitly check whether video all loaded or not
                videoPlayerDiv.getElementsByClassName(QUALITY_SELECT_UL_CLASS)[0]
                    .getElementsByClassName(QUALITY_SELECT_LI_CLASS);
                if (!videoPlayerElements.includes(videoPlayerDiv)) {
                    videoPlayerElements.push(videoPlayerDiv);
                }
            } catch (e) {
                console.debug(`Failed click max quality: ${e}`); // Mostly due to slow loading
            }
        }
        await sleep(750);
    }
    return videoPlayerElements;
}

init();
