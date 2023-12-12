class PreciseVolumeShortcutDecorator extends Decorator {

    static PRECISE_FACTOR = 1 / 4;

    static volumeNumber; // int
    static isMorePreciseMode; // boolean

    static {
        this.updateVolumeNumber();
        this.updateVolumeAddMode();
        chrome.runtime.onMessage.addListener((message) => {
            if (message.app !== APP_NAME) return;
            switch (message.event) {
                case VOLUME_NUMBER_CHANGED_EVENT:
                    this.updateVolumeNumber();
                    break;
                case MORE_PRECISE_IN_LOW_VOLUME_SETTING_CHANGED:
                    this.updateVolumeAddMode();
                    break;
            }
        });
    }

    static async updateVolumeNumber() {
        const settings = await chrome.storage.sync.get('volumeNumber');
        this.volumeNumber = parseInt(settings['volumeNumber']);
    }

    static async updateVolumeAddMode() {
        const settings = await chrome.storage.sync.get('morePreciseInLowVolume');
        this.isMorePreciseMode = settings['morePreciseInLowVolume'];
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
            prismPlayer.query('video').volume = currentVolume; // ignore default action
            const amount = PreciseVolumeShortcutDecorator.volumeNumber;
            if (event.key === 'ArrowUp') {
                this.addVolume(prismPlayer, currentVolume, amount);
            } else if (event.key === 'ArrowDown') {
                this.addVolume(prismPlayer, currentVolume, -amount);
            }
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.attachListeners(this, { volumeChangeListener, playerKeyDownListener });
    }

    async clear(prismPlayer) {
        const { volumeChangeListener, playerKeyDownListener } = prismPlayer.getAttachedListeners(this);

        prismPlayer.query('video').removeEventListener('volumechange', volumeChangeListener);
        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        prismPlayer.detachListeners(this);
        return true;
    }

    // currentVolume: float
    // amount: int - percentage with regard to max volume
    async addVolume(prismPlayer, currentVolume, amount) {
        const maxVolume = await prismPlayer.getMaxVolume();
        if (prismPlayer.isMaxVolumeExtended) {
            amount /= ExtendMaxVolumeDecorator.AMPLIFY_FACTOR;
        }
        let diffVolumeRatio = amount / 100;
        if (PreciseVolumeShortcutDecorator.isMorePreciseMode) {
            diffVolumeRatio = this.getDiffVolumeRatioInMorePreciseMode(diffVolumeRatio, currentVolume / maxVolume);
        }
        let volume = currentVolume + maxVolume * diffVolumeRatio;
        volume = Math.max(volume, 0);         // volume >= 0
        volume = Math.min(volume, maxVolume); // volume <= maxVolume
        prismPlayer.query('video').volume = volume;
    }

    // more precise in low volume (minimum diffVolumeRatio * PRECISE_FACTOR)
    getDiffVolumeRatioInMorePreciseMode(diffVolumeRatio, currentVolumeRatio) {
        const c = PreciseVolumeShortcutDecorator.PRECISE_FACTOR;
        const k = Math.abs(diffVolumeRatio);
        if (diffVolumeRatio > 0) {
            return k * ((1 - c) / (1 - k) * currentVolumeRatio + c);
        } else {
            return -k * ((1 - c) * currentVolumeRatio + c * (1 - k)) / (1 - c * k);
        }
    }
}
