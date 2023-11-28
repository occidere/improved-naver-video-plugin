class SetDefaultVolumeDecorator extends Decorator {

    async decorate(prismPlayer) {
        const maxVolume = await prismPlayer.getMaxVolume();

        let isVolumeChangedByUser = false;

        let volumeChangeCount = 0; // prevent unwanted loop
        const onVolumeChange = (event) => {
            const video = event.currentTarget;
            if (isVolumeChangedByUser || volumeChangeCount >= 100) {
                video.removeEventListener('volumechange', onVolumeChange);
                return;
            }
            this.setVolume(video, maxVolume);
            volumeChangeCount++;
        };

        // prevent volume reset
        const video = prismPlayer.query('video');
        video.addEventListener('volumechange', onVolumeChange);

        // apply now
        this.setVolume(video, maxVolume);

        // detect user volume change
        const onTrustedKeyDown = (event) => {
            if (!event.isTrusted) return;
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                isVolumeChangedByUser = true;
            }
        };
        const volumeControlObserver = new ClassChangeObserver(PrismPlayer.playerStateClassNames['volumeControlActive'],
            (appeared, _, observer) => {
                if (appeared) {
                    observer.disconnect();
                    isVolumeChangedByUser = true;
                }
            });
        prismPlayer.element.addEventListener('keydown', onTrustedKeyDown, { once: true });
        volumeControlObserver.observe(prismPlayer.element);

        // for clear()
        prismPlayer.listeners[this.constructor.name]
            = { onVolumeChange };
    }

    clear(prismPlayer) {
        const { onVolumeChange } = prismPlayer.listeners[this.constructor.name];

        const video = prismPlayer.query('video');
        video.removeEventListener('volumechange', onVolumeChange);

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }

    async setVolume(video, maxVolume) {
        const items = await chrome.storage.sync.get('defaultVolume');
        const defaultVolume = parseFloat(items.defaultVolume);

        // 1.0 : defaultVolume = maxVolume : adjustedVolume
        const adjustedVolume = maxVolume * defaultVolume;

        if (!isNaN(adjustedVolume) && (video.volume.toFixed(2) !== adjustedVolume.toFixed(2))) {
            video.volume = adjustedVolume;
        }
    }
}
