class DividePlaybackRateDecorator extends Decorator {

    decorate(prismPlayer) {
        // force certain playback rate to video
        let currentPlaybackRate = null;
        const rateChangeListener = (event) => {
            if (currentPlaybackRate === null || isNaN(currentPlaybackRate)) {
                return;
            }
            const video = event.currentTarget;
            if (Math.abs(currentPlaybackRate - video.playbackRate) > 0.01) {
                video.playbackRate = currentPlaybackRate;
            }
        };
        prismPlayer.query('video').addEventListener('ratechange', rateChangeListener);

        // create and insert items
        const originalItems = prismPlayer.queryAll('playbackRateSettingItems');
        const addedItems = [
            this.insertPlaybackRateSettingItem(originalItems, '0.25', '0.5'),
            this.insertPlaybackRateSettingItem(originalItems, '0.75', '1.0'),
            this.insertPlaybackRateSettingItem(originalItems, '1.25', '1.5'),
            this.insertPlaybackRateSettingItem(originalItems, '1.75', '2.0'),
        ];

        // set playback rate value when added item is clicked
        const addedItemClickListener = (event) => {
            const clickedItem = event.currentTarget;
            const playbackRate = parseFloat(clickedItem.getAttribute('playback-rate'));
            if (isNaN(playbackRate)) {
                return;
            }
            const allItems = prismPlayer.queryAll('playbackRateSettingItems');
            const checkedItem = allItems[this.getCheckedSettingItemIndex(allItems)];
            if (clickedItem === checkedItem) {
                return;
            }
            checkedItem?.classList.remove(CHECKED_SETTING_ITEM_CLASS); // uncheck
            clickedItem.classList.add(CHECKED_SETTING_ITEM_CLASS); // check
            if (Math.abs(playbackRate - currentPlaybackRate) > 0.01) {
                currentPlaybackRate = playbackRate;
                prismPlayer.query('video').dispatchEvent(new Event('ratechange'));
            }
            prismPlayer.element.click(); // close setting pane
        };
        addedItems.forEach((item) => item.addEventListener('click', addedItemClickListener));

        // reset when original item is clicked
        const originalItemClickListener = (event) => {
            const clickedItem = event.currentTarget;
            const addedItems = prismPlayer.element.querySelectorAll('.' + APP_ADDED_PLAYBACK_RATE_ITEM_CLASS);
            const checkedItem = addedItems[this.getCheckedSettingItemIndex(addedItems)];
            currentPlaybackRate = null;
            checkedItem?.classList.remove(CHECKED_SETTING_ITEM_CLASS); // uncheck
            clickedItem.classList.add(CHECKED_SETTING_ITEM_CLASS); // force check
        };
        originalItems.forEach((item) => item.addEventListener('click', originalItemClickListener));

        // shortcuts for changing playback rate
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

        // playback-rate-display compatible
        if (prismPlayer.decorated['PlaybackRateDisplayDecorator']) {
            for (const item of addedItems) {
                prismPlayer.listeners['PlaybackRateDisplayDecorator']['checkObserver'].observe(item);
            }
        }

        prismPlayer.listeners[this.constructor.name] = { rateChangeListener, originalItemClickListener, playerKeyDownListener };
    }

    async clear(prismPlayer) {
        const { rateChangeListener, originalItemClickListener, playerKeyDownListener } = prismPlayer.listeners[this.constructor.name];

        const addedItems = prismPlayer.element.querySelectorAll('.' + APP_ADDED_PLAYBACK_RATE_ITEM_CLASS);
        addedItems.forEach((item) => item.remove());

        const originalItems = prismPlayer.queryAll('playbackRateSettingItems');
        originalItems.forEach((item) => item.removeEventListener('click', originalItemClickListener));

        prismPlayer.query('video').removeEventListener('ratechange', rateChangeListener);

        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        // select default playback rate
        const defaultItem = this.getPlaybackRateSettingItemByText(originalItems, '1.0x');
        defaultItem.click();
        defaultItem.classList.add(CHECKED_SETTING_ITEM_CLASS); // force check

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }

    // newItemPlaybackRate: string, referenceItemPlaybackRate: string
    insertPlaybackRateSettingItem(originalItems, newItemPlaybackRate, referenceItemPlaybackRate) {
        const referenceItem = this.getPlaybackRateSettingItemByText(originalItems, referenceItemPlaybackRate + 'x');
        const newItem = referenceItem.cloneNode(true);
              newItem.classList.remove(CHECKED_SETTING_ITEM_CLASS);
              newItem.classList.add(APP_ADDED_PLAYBACK_RATE_ITEM_CLASS);
              newItem.ariaLabel = newItemPlaybackRate;
              newItem.setAttribute('playback-rate', newItemPlaybackRate);
        const newItemSpan = this.getPlaybackRateSettingItemSpan(newItem);
              newItemSpan.textContent = newItemPlaybackRate + 'x';
              referenceItem.parentElement.insertBefore(newItem, referenceItem);
        return newItem;
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

    isSettingItemAdded(li) {
        return li.classList.contains(APP_ADDED_PLAYBACK_RATE_ITEM_CLASS);
    }
}
