APP_VERSION = '1.1.4';

// Add all decorators in here
DECORATORS = [
    new SelectMaxQualityDecorator(),
];

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
    const enabledDecorators = [];
    for (const decorator of DECORATORS) {
        if (await decorator.isEnabled()) {
            enabledDecorators.push(decorator);
        }
    }
    console.debug(`APP_VERSION: ${APP_VERSION}, enabled decorators (${enabledDecorators.length}): ${enabledDecorators.map(it => it.constructor.name)}`)
    await applyEnabledDecorators(enabledDecorators);
}

async function applyEnabledDecorators(enabledDecorators) {
    const startMs = new Date().getTime();
    const videoPlayerElements = [];
    let maxRetryCount = 30;
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
                console.debug(`Failed to gather video elements: ${e}`); // Mostly due to slow loading
            }
        }
        await sleep(10 <= maxRetryCount ? 70 : 250);
    }
    console.debug(`video count: ${videoPlayerElements.length}, (took: ${new Date().getTime() - startMs} ms)`);

    // Apply all enabled decorators
    for (const videoPlayerDiv of videoPlayerElements) {
        for (const decorator of enabledDecorators) {
            decorator.decorate(videoPlayerDiv);
        }
    }
}

init();
