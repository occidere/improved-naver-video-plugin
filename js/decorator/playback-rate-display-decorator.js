class PlaybackRateDisplayDecorator extends Decorator {

    async decorate(prismPlayer) {
        const lis = prismPlayer.getPlaybackRateSettingItems();
        for (const li of lis) {
            // update when item is clicked
            li.addEventListener('click', (event) => {
                this.updatePlaybackRateDisplay(prismPlayer, event.currentTarget);
            });

            // default state
            const span = PrismPlayer.getPlaybackRateSettingItemText(li);
            if (span.textContent.includes('1.0x')) {
                this.updatePlaybackRateDisplay(prismPlayer, li);
            }
        }
    }

    updatePlaybackRateDisplay(prismPlayer, li) {
        const span = PrismPlayer.getPlaybackRateSettingItemText(li);
        const playbackRateText = span.textContent.trim().replace(/[^0-9.x]/g, '');
        let playbackRateDisplay = prismPlayer.getPlaybackRateDisplay();
        if (playbackRateDisplay) {
            const span = PrismPlayer.getPlaybackRateSettingItemText(playbackRateDisplay);
            span.textContent = playbackRateText;
        } else {
            playbackRateDisplay = this.createPlaybackRateDisplay(playbackRateText, async () => {
                if (prismPlayer.isPlaybackRateSettingPaneVisible()) {
                    // close menu by clicking player when menu is already open
                    prismPlayer.element.click();
                } else {
                    // open menu when clicked
                    await sleep(10);
                    prismPlayer.getPlaybackRateSettingMenu().click();
                }
            });
            const bottomRightButtonsDiv = prismPlayer.getBottomRightButtons();
            bottomRightButtonsDiv.prepend(playbackRateDisplay);
        }
    }

    createPlaybackRateDisplay(playbackRateText, clickListener) {
        const button = document.createElement('button');
              button.classList.add(PLAYER_BUTTON_CLASS,
                                   PLAYER_UI_BUTTON_CLASS,
                                   APP_UI_BUTTON_CLASS,
                                   APP_PLAYBACK_RATE_DISPLAY_CLASS);
              button.addEventListener('click', clickListener);
        const tooltip = document.createElement('span');
              tooltip.classList.add(PLAYER_UI_TOOLTIP_CLASS,
                                    PLAYER_UI_TOOLTIP_TOP_CLASS);
              tooltip.textContent = '배속 변경';
              button.appendChild(tooltip);
        const span = document.createElement('span');
              span.classList.add(PLAYBACK_RATE_SETTING_ITEM_TEXT_CLASS);
              span.textContent = playbackRateText;
              button.appendChild(span);
        return button;
    }
}
