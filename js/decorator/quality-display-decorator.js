class QualityDisplayDecorator extends Decorator {

    async decorate(prismPlayer) {
        prismPlayer.getQualitySettingItems((lis) => {
            for (const li of lis) {
                // update when item is clicked
                li.addEventListener('click', (event) => {
                    this.updateQualityDisplay(prismPlayer, event.currentTarget);
                });

                // update current selected item
                if (PrismPlayer.isSettingItemChecked(li)) {
                    this.updateQualityDisplay(prismPlayer, li);
                }

                // detect 'auto' item text changes
                const span = PrismPlayer.getQualitySettingItemText(li);
                if (span.textContent.includes('자동')) {
                    const textNode = span.firstChild;
                    new MutationObserver((mutationList) => {
                        for (const mutation of mutationList) {
                            const textNode = mutation.target;
                            const li = textNode.parentElement.closest('li');
                            if (PrismPlayer.isSettingItemChecked(li)) {
                                this.updateQualityDisplay(prismPlayer, li);
                                return;
                            }
                        }
                    }).observe(textNode, { characterData: true });
                }
            }
        });
    }

    updateQualityDisplay(prismPlayer, li) {
        const span = PrismPlayer.getQualitySettingItemText(li);
        const qualityText = span.textContent.trim();
        let qualityDisplay = prismPlayer.getQualityDisplay();
        if (qualityDisplay) {
            const span = PrismPlayer.getQualitySettingItemText(qualityDisplay);
            span.textContent = qualityText;
        } else {
            qualityDisplay = this.createQualityDisplay(qualityText, async () => {
                if (prismPlayer.isQualitySettingPaneVisible()) {
                    // close menu by clicking player when menu is already open
                    prismPlayer.element.click();
                } else {
                    // open menu when clicked
                    await sleep(10);
                    prismPlayer.getQualitySettingMenu().click();
                }
            });
            const bottomRightButtonsDiv = prismPlayer.getBottomRightButtons();
            const settingButton = prismPlayer.getSettingButton();
            bottomRightButtonsDiv.insertBefore(qualityDisplay, settingButton);
        }
    }

    createQualityDisplay(qualityText, clickListener) {
        const button = document.createElement('button');
              button.classList.add(PLAYER_BUTTON_CLASS,
                                   PLAYER_UI_BUTTON_CLASS,
                                   APP_UI_BUTTON_CLASS,
                                   APP_QUALITY_DISPLAY_CLASS);
              button.addEventListener('click', clickListener);
        const tooltip = document.createElement('span');
              tooltip.classList.add(PLAYER_UI_TOOLTIP_CLASS,
                                    PLAYER_UI_TOOLTIP_TOP_CLASS);
              tooltip.textContent = '해상도 변경';
              button.appendChild(tooltip);
        const span = document.createElement('span');
              span.classList.add(QUALITY_SETTING_ITEM_TEXT_CLASS);
              span.textContent = qualityText;
              button.appendChild(span);
        return button;
    }
}
