class QualityDisplayDecorator extends Decorator {

    async decorate(videoPlayerElements) {
        const selectMaxQuality = await getSyncValue('selectMaxQuality'); // TODO: 별도로 분리?
        if (selectMaxQuality) {
            for (const videoPlayerDiv of videoPlayerElements) {
                try {
                    // Show current quality
                    this.updateCurrentVideoQualityDisplay(videoPlayerDiv);

                    // Add quality change click event listener
                    videoPlayerDiv.getElementsByClassName(QUALITY_SELECT_UL_CLASS)[0]
                        .addEventListener('click', () => videoPlayerElements.forEach(vid => this.updateCurrentVideoQualityDisplay(vid)));
                } catch (e) {
                    console.warn(`Failed to display current quality: ${e}`); // Mostly due to slow loading
                }
            }
        }
    }

    updateCurrentVideoQualityDisplay(videoPlayerDiv, qualityText) {
        const displayCurrentVideoQualityDiv = videoPlayerDiv.getElementsByClassName(DISPLAY_CURRENT_VIDEO_QUALITY_CLASS)[0];
        const currentVideoQualityText = qualityText ? qualityText : videoPlayerDiv.getElementsByClassName(CURRENT_VIDEO_QUALITY_CLASS)[0]
            .getElementsByClassName(QUALITY_TEXT_CLASS)[0]
            .textContent
            .replace(/[^A-Za-z0-9]/g, '')
            .trim();
        const displayCurrentVideoQualityElement = this.createDisplayCurrentVideoQualityElement(currentVideoQualityText);
        console.debug(`currentVideoQualityText: ${currentVideoQualityText}`);

        if (displayCurrentVideoQualityDiv) {
            displayCurrentVideoQualityDiv.replaceWith(displayCurrentVideoQualityElement);
        } else {
            const bottomRightButtonDiv = videoPlayerDiv.getElementsByClassName(BOTTOM_RIGHT_BUTTON_CLASS)[0];
            bottomRightButtonDiv.prepend(displayCurrentVideoQualityElement);
        }
    }

    createDisplayCurrentVideoQualityElement(qualityText) {
        const element = document.createElement('div');
        element.className = DISPLAY_CURRENT_VIDEO_QUALITY_CLASS;
        element.innerHTML = `<span class="${QUALITY_TEXT_CLASS}">${qualityText}</span>`;
        return element;
    }
}

