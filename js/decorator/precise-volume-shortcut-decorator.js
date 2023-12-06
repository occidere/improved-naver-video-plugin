class PreciseVolumeShortcutDecorator extends Decorator {

    static volumeNumber; // int

    static {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.app === APP_NAME && message.event === VOLUME_NUMBER_CHANGED_EVENT) {
                this.updateVolumeNumber();
            }
        });
        this.updateVolumeNumber();
    }

    static async updateVolumeNumber() {
        const items = await chrome.storage.sync.get('volumeNumber');
        this.volumeNumber = parseInt(items['volumeNumber']);
    }

    async decorate(prismPlayer) {
        await prismPlayer.getMaxVolume(); // wait until max volume is set
        const video = prismPlayer.query('video');
        let currentVolume = video.volume;
        const volumeChangeListener = (event) => {
            currentVolume = event.currentTarget.volume;
        };
        video.addEventListener('volumechange', volumeChangeListener);

        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
            const amount = PreciseVolumeShortcutDecorator.volumeNumber;
            if (event.key === 'ArrowUp') {
                this.addVolume(prismPlayer, currentVolume, amount);
            } else if (event.key === 'ArrowDown') {
                this.addVolume(prismPlayer, currentVolume, -amount);
            }
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.listeners[this.constructor.name] = { volumeChangeListener, playerKeyDownListener };
    }

    async clear(prismPlayer) {
        const { volumeChangeListener, playerKeyDownListener } = prismPlayer.listeners[this.constructor.name];

        prismPlayer.query('video').removeEventListener('volumechange', volumeChangeListener);
        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }

    // currentVolume: float - adjusted absolute value
    // amount: int - percentage with regard to max volume
    async addVolume(prismPlayer, currentVolume, amount) {
        const maxVolume = await prismPlayer.getMaxVolume();
        if (prismPlayer.isMaxVolumeExtended) {
            amount /= ExtendMaxVolumeDecorator.AMPLIFY_FACTOR;
        }
        const currentRatio = currentVolume / maxVolume;
        let addedVolume = maxVolume * (currentRatio + amount / 100);
        if (addedVolume > maxVolume) {
            addedVolume = maxVolume;
        }
        if (addedVolume < 0) {
            addedVolume = 0;
        }
        prismPlayer.query('video').volume = addedVolume;
    }
}
