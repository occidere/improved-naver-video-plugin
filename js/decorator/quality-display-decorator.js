class QualityDisplayDecorator extends Decorator {

    async decorate(video) {
        try {
            // Show current quality
            const checkedLi = video.querySelector('.' + QUALITY_SETTING_LI_CLASS + '.' + SETTING_CHECKED_LI_CLASS);
            this.updateQualityDisplay(video, checkedLi);

            // quality setting click listener
            const lis = video.getElementsByClassName(QUALITY_SETTING_LI_CLASS);
            for (const li of lis) {
                li.addEventListener('click', (event) => {
                    const video = this.getParentVideo(event.target);
                    this.updateQualityDisplay(video, event.target);
                });
            }

            // auto quality change observer
            if (lis[0]) {
                const span = this.getQualityTextSpan(lis[0]);
                const textNode = span?.firstChild;
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    this.autoQualityObserver.observe(textNode, { characterData: true });
                }
            }
        } catch (e) {
            console.warn(`Failed to display current quality: ${e}`);
        }
    }

    autoQualityObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            const textNode = mutation.target;
            const span = textNode.parentElement;
            const li = span.closest('li');
            if (li?.classList.contains(SETTING_CHECKED_LI_CLASS)) {
                const video = this.getParentVideo(li);
                return this.updateQualityDisplay(video, li);
            }
        }
    });

    getParentVideo(element) {
        return element.closest('.' + VIDEO_PLAYER_CLASS);
    }

    getQualityTextSpan(element) {
        return element.querySelector('.' + QUALITY_TEXT_SPAN_CLASS);
    }

    updateQualityDisplay(video, li) {
        const span = this.getQualityTextSpan(li);
        if (!span) return;
        const qualityText = span.textContent.trim(); // .replace(/[^A-Za-z0-9]/g, '')
        const qualityDisplay = video.querySelector('.' + QUALITY_DISPLAY_CLASS);
        if (qualityDisplay) {
            qualityDisplay.firstElementChild.textContent = qualityText;
        } else {
            const bottomRightButtonDiv = video.querySelector('.' + BOTTOM_RIGHT_BUTTON_CLASS);
            bottomRightButtonDiv?.prepend(this.createQualityDisplay(qualityText));
        }
    }

    createQualityDisplay(qualityText) {
        const element = document.createElement('div');
        element.className = BOTTOM_RIGHT_BUTTON_STYLE_CLASSES + ' ' + QUALITY_DISPLAY_CLASS;
        element.innerHTML = `<span class="${QUALITY_TEXT_SPAN_CLASS}" style="white-space: nowrap">${qualityText}</span>`;
        return element;
    }
}
