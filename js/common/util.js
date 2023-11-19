function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getClosestVideo(element) {
    if (location.hostname === 'kin.naver.com') {
        return element.closest('.' + KIN_VIDEO_MODULE_CLASS);
    }
    return element.closest('.' + VIDEO_PLAYER_CLASS);
}

function getFirstVideo(document) {
    if (location.hostname === 'kin.naver.com') {
        return document.querySelector('.' + KIN_VIDEO_MODULE_CLASS);
    }
    return document.querySelector('.' + VIDEO_PLAYER_CLASS);
}

function isFirstVideo(video) {
    const document = video.ownerDocument;
    const firstVideo = getFirstVideo(document);
    return video === firstVideo;
}
