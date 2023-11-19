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
                    const li = event.currentTarget;
                    const video = getClosestVideo(li);
                    this.updateQualityDisplay(video, li);
                });
            }

            // 화질이 '자동' 상태일 때 화질의 변화를 실시간으로 반영함
            if (lis[0]) {
                const span = this.getQualityTextSpan(lis[0]);
                const textNode = span?.firstChild;
                if (textNode?.nodeType === Node.TEXT_NODE) {
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
                const video = getClosestVideo(li);
                return this.updateQualityDisplay(video, li);
            }
        }
    });

    getQualityTextSpan(element) {
        return element.querySelector('.' + QUALITY_TEXT_SPAN_CLASS);
    }

    updateQualityDisplay(video, li) {
        if (!video) return;
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
        element.innerHTML = `<span class="${QUALITY_TEXT_SPAN_CLASS}" style="white-space: nowrap; font-size: 12px">${qualityText}</span>`;
        // 클릭했을 때 화질 설정 메뉴를 보여줌
        element.addEventListener('click', async (event) => {
            const video = getClosestVideo(event.currentTarget);
            if (video.querySelector('.' + VIDEO_QUALITY_PANE_VISIBLE_CLASS)) {
                // 화질 설정 메뉴가 이미 떠 있는 상황이면 아무 곳이나 클릭함으로써 메뉴를 끔
                video.click();
            } else {
                await sleep(10); // 없으면 동작 안 함
                this.getQualitySettingMenuItem(video)?.click();
            }
        });
        return element;
    }

    getQualitySettingMenuItem(element) {
        if (location.hostname === 'kin.naver.com') {
            const menuItems = element.getElementsByClassName(VIDEO_SETTING_MENU_ITEM_CLASS);
            for (const menuItem of menuItems) {
                if (menuItem.querySelector('.' + VIDEO_SETTING_MENU_ITEM_SPAN_CLASS)?.textContent.includes('해상도')) {
                    return menuItem;
                }
            }
        } else {
            return element.querySelector('.' + QUALITY_SETTING_MENU_ITEM_CLASS);
        }
    }
}
