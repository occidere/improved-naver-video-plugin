class PlaybackRateDisplayDecorator extends Decorator {

    async decorate(video) {
        try {
            // Show current playback rate
            const checkedLi = video.querySelector('.' + PLAYBACK_RATE_SETTING_LI_CLASS + '.' + SETTING_CHECKED_LI_CLASS);
            this.updatePlaybackRateDisplay(video, checkedLi);

            // playback rate setting click listener
            const lis = video.getElementsByClassName(PLAYBACK_RATE_SETTING_LI_CLASS);
            for (const li of lis) {
                li.addEventListener('click', (event) => {
                    const li = event.currentTarget;
                    const video = getClosestVideo(li);
                    this.updatePlaybackRateDisplay(video, li);
                });
            }
        } catch (e) {
            console.warn(`Failed to display current playback rate: ${e}`);
        }
    }

    getPlaybackRateTextSpan(element) {
        return element.querySelector('.' + PLAYBACK_RATE_TEXT_SPAN_CLASS);
    }

    updatePlaybackRateDisplay(video, li) {
        if (!video) return;
        const span = this.getPlaybackRateTextSpan(li);
        if (!span) return;
        const playbackRateText = span.textContent.trim().replace(/[^A-Za-z0-9.]/g, '');
        const playbackRateDisplay = video.querySelector('.' + PLAYBACK_RATE_DISPLAY_CLASS);
        if (playbackRateDisplay) {
            playbackRateDisplay.firstElementChild.textContent = playbackRateText;
        } else {
            const bottomRightButtonDiv = video.querySelector('.' + BOTTOM_RIGHT_BUTTON_CLASS);
            bottomRightButtonDiv?.prepend(this.createPlaybackRateDisplay(playbackRateText));
        }
    }

    createPlaybackRateDisplay(playbackRateText) {
        const element = document.createElement('div');
        element.className = BOTTOM_RIGHT_BUTTON_STYLE_CLASSES + ' ' + PLAYBACK_RATE_DISPLAY_CLASS;
        element.innerHTML = `<span class="${PLAYBACK_RATE_TEXT_SPAN_CLASS}" style="white-space: nowrap; font-size: 12px">${playbackRateText}</span>`;
        // 클릭했을 때 재생 속도 설정 메뉴를 보여줌
        element.addEventListener('click', async (event) => {
            const video = getClosestVideo(event.currentTarget);
            if (video.querySelector('.' + VIDEO_PLAYBACK_RATE_PANE_VISIBLE_CLASS)) {
                // 재생 속도 설정 메뉴가 이미 떠 있는 상황이면 아무 곳이나 클릭함으로써 메뉴를 끔
                video.click();
            } else {
                await sleep(10); // 없으면 동작 안 함
                this.getPlaybackRateSettingMenuItem(video)?.click();
            }
        });
        return element;
    }

    getPlaybackRateSettingMenuItem(element) {
        if (location.hostname === 'kin.naver.com') {
            const menuItems = element.getElementsByClassName(VIDEO_SETTING_MENU_ITEM_CLASS);
            for (const menuItem of menuItems) {
                if (menuItem.querySelector('.' + VIDEO_SETTING_MENU_ITEM_SPAN_CLASS)?.textContent.includes('재생 속도')) {
                    return menuItem;
                }
            }
        } else {
            return element.querySelector('.' + PLAYBACK_RATE_SETTING_MENU_ITEM_CLASS);
        }
    }
}
