

function updateCurrentVideoQualityDisplay(videoPlayerDiv, qualityText) {
    const displayCurrentVideoQualityDiv = videoPlayerDiv.getElementsByClassName(DISPLAY_CURRENT_VIDEO_QUALITY_CLASS)[0];
    const currentVideoQualityText = qualityText ? qualityText : videoPlayerDiv.getElementsByClassName(CURRENT_VIDEO_QUALITY_CLASS)[0]
        .getElementsByClassName(QUALITY_TEXT_CLASS)[0]
        .textContent
        .replace(/[^A-Za-z0-9]/g, '')
        .trim();
    const displayCurrentVideoQualityElement = createDisplayCurrentVideoQualityElement(currentVideoQualityText);
    console.debug(`currentVideoQualityText: ${currentVideoQualityText}`);

    if (displayCurrentVideoQualityDiv) {
        displayCurrentVideoQualityDiv.replaceWith(displayCurrentVideoQualityElement);
    } else {
        const bottomRightButtonDiv = videoPlayerDiv.getElementsByClassName(BOTTOM_RIGHT_BUTTON_CLASS)[0];
        bottomRightButtonDiv.prepend(displayCurrentVideoQualityElement);
    }
}

function createDisplayCurrentVideoQualityElement(qualityText) {
    const element = document.createElement('div');
    element.className = DISPLAY_CURRENT_VIDEO_QUALITY_CLASS;
    element.innerHTML = `<span class="pzp-pc-ui-setting-quality-item__prefix">${qualityText}</span>`;
    return element;
}