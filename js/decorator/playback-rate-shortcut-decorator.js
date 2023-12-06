class PlaybackRateShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.key !== '<' && event.key !== '>') return;
            const items = prismPlayer.queryAll('playbackRateSettingItems');
            const index = this.getCheckedSettingItemIndex(items);
            if (event.key === '<') {
                items[index - 1]?.click();
            } else if (event.key === '>') {
                items[index + 1]?.click();
            }
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.listeners[this.constructor.name] = { playerKeyDownListener };
    }

    async clear(prismPlayer) {
        const { playerKeyDownListener } = prismPlayer.listeners[this.constructor.name];

        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        delete prismPlayer.listeners[this.constructor.name];
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
}
