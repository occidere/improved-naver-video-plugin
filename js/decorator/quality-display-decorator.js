class QualityDisplayDecorator extends Decorator {

    async decorate(prismPlayer) {
        // create display
        const qualityDisplay = this.createQualityDisplay();
        const bottomRightButtons = prismPlayer.query('bottomRightButtons');
        const settingButton = prismPlayer.query('settingButton');
        bottomRightButtons.insertBefore(qualityDisplay, settingButton);

        // show setting pane when clicked
        qualityDisplay.addEventListener('click', async () => {
            if (prismPlayer.isState('qualitySettingPaneVisible')) {
                prismPlayer.element.click(); // close setting pane
            } else {
                await sleep(10);
                prismPlayer.query('qualitySettingMenu').click(); // open setting pane
            }
        });

        // detect item check
        const checkObserver = new ClassChangeObserver(CHECKED_SETTING_ITEM_CLASS,
            (appeared, li) => {
                if (appeared) {
                    const qualityDisplay = this.getQualityDisplay(prismPlayer);
                    this.setTextFromItem(qualityDisplay, li);
                }
            });

        // detect 'auto' item text changes
        const autoObserver = new TextChangeObserver(
            (changedText, span) => {
                const li = span.closest('li');
                if (this.isSettingItemChecked(li)) {
                    const qualityDisplay = this.getQualityDisplay(prismPlayer);
                    this.setText(qualityDisplay, changedText);
                }
            });

        // apply observers
        const lis = await prismPlayer.getQualitySettingItems();
        for (const li of lis) {
            checkObserver.observe(li);
            if (this.isQualitySettingItemAuto(li)) {
                const span = this.getQualitySettingItemSpan(li);
                autoObserver.observe(span);
            }
            // apply now
            if (this.isSettingItemChecked(li)) {
                this.setTextFromItem(qualityDisplay, li);
            }
        }

        prismPlayer.attachListeners(this, { checkObserver, autoObserver });
    }

    async clear(prismPlayer) {
        const { checkObserver, autoObserver } = prismPlayer.getAttachedListeners(this);

        this.getQualityDisplay(prismPlayer).remove();
        checkObserver.disconnect();
        autoObserver.disconnect();

        prismPlayer.detachListeners(this);
        return true;
    }

    createQualityDisplay() {
        const button = document.createElement('button');
              button.classList.add(PLAYER_BUTTON_CLASS,
                                   APP_UI_BUTTON_CLASS,
                                   APP_QUALITY_DISPLAY_CLASS);
        const tooltip = document.createElement('span');
              tooltip.classList.add(PLAYER_UI_TOOLTIP_CLASS,
                                    PLAYER_UI_TOOLTIP_TOP_CLASS);
              tooltip.textContent = '해상도 변경';
              button.appendChild(tooltip);
        const span = document.createElement('span');
              span.classList.add(QUALITY_SETTING_ITEM_SPAN_CLASS);
              button.appendChild(span);
        return button;
    }

    getQualityDisplay(prismPlayer) {
        return prismPlayer.element.querySelector('button.' + APP_QUALITY_DISPLAY_CLASS);
    }

    setText(qualityDisplay, qualityText) {
        const span = this.getQualitySettingItemSpan(qualityDisplay);
        span.textContent = qualityText.trim();
    }

    setTextFromItem(qualityDisplay, li) {
        const span = this.getQualitySettingItemSpan(li);
        const qualityText = span.textContent;
        this.setText(qualityDisplay, qualityText);
    }

    isQualitySettingItemAuto(li) {
        const span = this.getQualitySettingItemSpan(li);
        return span.textContent.includes('자동');
    }

    getQualitySettingItemSpan(el) {
        return el.querySelector('span.' + QUALITY_SETTING_ITEM_SPAN_CLASS);
    }

    isSettingItemChecked(li) {
        return li.classList.contains(CHECKED_SETTING_ITEM_CLASS);
    }
}
