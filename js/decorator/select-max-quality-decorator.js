class SelectMaxQualityDecorator extends Decorator {

    MAX_QUALITY_IDX = 1;

    async isEnabled() {
        return await getSyncValue('selectMaxQuality');
    }

    async decorate(videoPlayerElement) {
        let maxRetryCount = 10;
        while (maxRetryCount-- > 0) {
            try {
                const ul = videoPlayerElement.getElementsByClassName(QUALITY_SELECT_UL_CLASS)[0];
                const li = ul.getElementsByClassName(QUALITY_SELECT_LI_CLASS)[this.MAX_QUALITY_IDX];

                // Show current quality
                const maxVideoQualityText = this.getVideoQualityText(li.getElementsByClassName(QUALITY_TEXT_CLASS)[0]);
                this.updateCurrentVideoQualityDisplay(videoPlayerElement, maxVideoQualityText);

                // Change to max quality
                li.click(); // Took the longest time

                // Add quality change click event listener
                ul.addEventListener('click', () => this.updateCurrentVideoQualityDisplay(videoPlayerElement));

                break;
            } catch (e) {
                console.debug(`Failed click max quality: ${e}`); // Mostly due to slow loading
                await sleep(50);
            }
        }
    }

    getVideoQualityText = (videoQualityElement) => videoQualityElement.textContent
        .replace(/[^A-Za-z0-9]/g, '')
        .trim();

    updateCurrentVideoQualityDisplay(videoPlayerDiv, qualityText) {
        const displayCurrentVideoQualityDiv = videoPlayerDiv.getElementsByClassName(DISPLAY_CURRENT_VIDEO_QUALITY_CLASS)[0];
        const currentVideoQualityText = qualityText ? qualityText : this.getVideoQualityText(
            videoPlayerDiv.getElementsByClassName(CURRENT_VIDEO_QUALITY_CLASS)[0]
                .getElementsByClassName(QUALITY_TEXT_CLASS)[0]
        );
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