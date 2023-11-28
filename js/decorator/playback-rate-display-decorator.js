class PlaybackRateDisplayDecorator extends Decorator {

    decorate(prismPlayer) {
        // create display
        const playbackRateDisplay = this.createPlaybackRateDisplay();
        const bottomRightButtons = prismPlayer.query('bottomRightButtons');
        bottomRightButtons.prepend(playbackRateDisplay);

        // show setting pane when clicked
        playbackRateDisplay.addEventListener('click', async () => {
            if (prismPlayer.isState('playbackRateSettingPaneVisible')) {
                prismPlayer.element.click(); // click player to close pane
            } else {
                await sleep(10);
                prismPlayer.query('playbackRateSettingMenu').click();
            }
        });

        // detect item check
        const checkObserver = new ClassChangeObserver(CHECKED_SETTING_ITEM_CLASS,
            (appeared, li) => {
                if (appeared) {
                    const playbackRateDisplay = this.getPlaybackRateDisplay(prismPlayer);
                    this.setTextFromItem(playbackRateDisplay, li);
                }
            });

        // apply observer
        const lis = prismPlayer.queryAll('playbackRateSettingItems');
        for (const li of lis) {
            checkObserver.observe(li);
            // apply now
            if (this.isSettingItemChecked(li)) {
                this.setTextFromItem(playbackRateDisplay, li);
            }
        }

        // for clear()
        prismPlayer.observers[this.constructor.name] = { checkObserver };
    }

    clear(prismPlayer) {
        const { checkObserver } = prismPlayer.observers[this.constructor.name];

        this.getPlaybackRateDisplay(prismPlayer).remove();
        checkObserver.disconnect();

        delete prismPlayer.observers[this.constructor.name];
        return true;
    }

    createPlaybackRateDisplay() {
        const button = document.createElement('button');
              button.classList.add(PLAYER_BUTTON_CLASS,
                                   PLAYER_UI_BUTTON_CLASS,
                                   APP_UI_BUTTON_CLASS,
                                   APP_PLAYBACK_RATE_DISPLAY_CLASS);
        const tooltip = document.createElement('span');
              tooltip.classList.add(PLAYER_UI_TOOLTIP_CLASS,
                                    PLAYER_UI_TOOLTIP_TOP_CLASS);
              tooltip.textContent = '배속 변경';
              button.appendChild(tooltip);
        const span = document.createElement('span');
              span.classList.add(PLAYBACK_RATE_SETTING_ITEM_SPAN_CLASS);
              button.appendChild(span);
        return button;
    }

    getPlaybackRateDisplay(prismPlayer) {
        return prismPlayer.element.querySelector('button.' + APP_PLAYBACK_RATE_DISPLAY_CLASS);
    }

    setText(playbackRateDisplay, playbackRateText) {
        const span = this.getPlaybackRateSettingItemSpan(playbackRateDisplay);
        span.textContent = playbackRateText.trim().replace(/[^0-9.x]/g, '');
    }

    setTextFromItem(playbackRateDisplay, li) {
        const span = this.getPlaybackRateSettingItemSpan(li);
        const playbackRateText = span.textContent;
        this.setText(playbackRateDisplay, playbackRateText);
    }

    isPlaybackRateSettingItemDefault(li) {
        const span = this.getPlaybackRateSettingItemSpan(li);
        return span.textContent.includes('1.0x');
    }

    getPlaybackRateSettingItemSpan(el) {
        return el.querySelector('span.' + PLAYBACK_RATE_SETTING_ITEM_SPAN_CLASS);
    }

    isSettingItemChecked(li) {
        return li.classList.contains(CHECKED_SETTING_ITEM_CLASS);
    }
}
