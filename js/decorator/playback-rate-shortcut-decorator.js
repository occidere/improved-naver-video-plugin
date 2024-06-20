class PlaybackRateShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.code !== 'BracketLeft' && event.code !== 'BracketRight' && event.code !== 'Backslash') return;
            const items = prismPlayer.queryAll('playbackRateSettingItems');
            const index = this.getCheckedSettingItemIndex(items);
            if (event.code === 'BracketLeft') {
                items[index - 1]?.click();
            } else if (event.code === 'BracketRight') {
                items[index + 1]?.click();
            } else if (event.code === 'Backslash') {
                this.getPlaybackRateSettingItemByText(items, '1.0x').click();
            }
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.attachListeners(this, { playerKeyDownListener });
    }

    async clear(prismPlayer) {
        const { playerKeyDownListener } = prismPlayer.getAttachedListeners(this);

        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        prismPlayer.detachListeners(this);
        return true;
    }

    getCheckedSettingItemIndex(lis) {
        for (let index = 0; index < lis.length; index++) {
            if (this.isSettingItemChecked(lis[index])) {
                return index;
            }
        }
    }

    isSettingItemChecked(li) {
        return li.classList.contains(CHECKED_SETTING_ITEM_CLASS);
    }

    getPlaybackRateSettingItemByText(lis, playbackRateText) {
        for (const li of lis) {
            const span = this.getPlaybackRateSettingItemSpan(li);
            if (span.textContent.includes(playbackRateText)) {
                return li;
            }
        }
    }

    getPlaybackRateSettingItemSpan(li) {
        return li.querySelector('span.' + PLAYBACK_RATE_SETTING_ITEM_SPAN_CLASS);
    }
}
