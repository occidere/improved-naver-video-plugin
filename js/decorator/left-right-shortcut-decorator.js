class LeftRightShortcutDecorator extends Decorator {

    static timeNumber; // int

    static {
        this.updateTimeNumber();
        chrome.runtime.onMessage.addListener((message) => {
            if (message.app !== APP_NAME) return;
            switch (message.event) {
                case TIME_NUMBER_CHANGED_EVENT:
                    this.updateTimeNumber();
                    break;
            }
        });
    }

    static async updateTimeNumber() {
        const settings = await chrome.storage.sync.get('timeNumber');
        this.timeNumber = parseInt(settings['timeNumber']);
    }

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.code !== 'KeyJ' && event.code !== 'KeyL') return;
            const video = prismPlayer.query('video');
            const amount = LeftRightShortcutDecorator.timeNumber;
            if (event.code === 'KeyJ') {
                video.currentTime -= amount;
            } else if (event.code === 'KeyL') {
                video.currentTime += amount;
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
}
