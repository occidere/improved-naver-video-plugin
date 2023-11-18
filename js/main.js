async function init() {
    // create videoFinder
    const videoFinder = getVideoFinder();
    if (!videoFinder) return;

    // set option change listener
    chrome.runtime.onMessage.addListener((message) => {
        if (message.event === 'optionChanged') {
            updateCallbacks(videoFinder);
        }
    });

    // update videoFinder and connect
    await updateCallbacks(videoFinder);
    videoFinder.connect(document);
}

function getVideoFinder() {
    switch (location.hostname) {
        case 'cafe.naver.com':
            return new CafeVideoFinder;
        case 'blog.naver.com':
            return new BlogVideoFinder;
        case 'kin.naver.com':
            return new KinVideoFinder;
    }
}

async function updateCallbacks(videoFinder) {
    const decoratorsOnVideoFoundAsync = [];
    const decoratorsOnVideoFound = [];
    const decoratorsOnVideoQualityFoundAsync = [];
    const decoratorsOnVideoQualityFound = [];

    // get options
    const options = await chrome.storage.sync.get([
        'selectMaxQuality'
    ]);

    // create callbacks
    switch (videoFinder.constructor) {
        case CafeVideoFinder:
        case BlogVideoFinder:
        case KinVideoFinder:
            push(decoratorsOnVideoFoundAsync,
                [new EasyClickToPlayDecorator, true]);
            push(decoratorsOnVideoQualityFound,
                [new QualityDisplayDecorator, true],
                [new SelectMaxQualityDecorator, options.selectMaxQuality]);
    }
    // utility function (item = [decorator, isEnabled])
    function push(array, ...items) {
        for (const item of items) {
            if (item[1]) array.push(item[0]);
        }
    }

    // set callbacks
    videoFinder.setCallbacks({
        onVideoFound: async (video) => {
            for (const decorator of decoratorsOnVideoFoundAsync) {
                decorator.decorate(video);
            }
            for (const decorator of decoratorsOnVideoFound) {
                await decorator.decorate(video);
            }
        },
        onVideoQualityFound: async (video) => {
            for (const decorator of decoratorsOnVideoQualityFoundAsync) {
                decorator.decorate(video);
            }
            for (const decorator of decoratorsOnVideoQualityFound) {
                await decorator.decorate(video);
            }
        }
    });
}

init();
