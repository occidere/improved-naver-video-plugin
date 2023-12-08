class PreciseVolumeShortcutDecorator extends Decorator {

    static volumeNumber; // int

    static {
        this.updateVolumeNumber();
        chrome.runtime.onMessage.addListener((message) => {
            if (message.app !== APP_NAME) return;
            switch (message.event) {
                case VOLUME_NUMBER_CHANGED_EVENT:
                    this.updateVolumeNumber();
                    break;
            }
        });
    }

    static async updateVolumeNumber() {
        const settings = await chrome.storage.sync.get('volumeNumber');
        this.volumeNumber = parseInt(settings['volumeNumber']);
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
        let volume = currentVolume + maxVolume * (amount / 100);
        volume = Math.max(volume, 0);         // volume >= 0
        volume = Math.min(volume, maxVolume); // volume <= maxVolume
        prismPlayer.query('video').volume = volume;
    }
}
