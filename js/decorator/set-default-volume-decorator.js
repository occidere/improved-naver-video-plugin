class SetDefaultVolumeDecorator extends Decorator {

    async decorate(prismPlayer) {
        const defaultVolume = await this.getDefaultVolume();
        if (defaultVolume === null) return;

        let isVolumeChangedByUser = false;
        prismPlayer.getVideo().addEventListener('loadstart', (event) => {
            const video = event.currentTarget;
            const maxVolume = video.volume;
            console.log('max', video.volume);

            // 1.0 : defaultVolume = maxVolume : adjustedVolume
            const adjustedVolume = maxVolume * defaultVolume;
            console.log('1', video.volume, adjustedVolume);
            video.volume = adjustedVolume;

            // prevent volume reset
            video.addEventListener('volumechange', (event) => {
                if (!isVolumeChangedByUser) {
                    const video = event.currentTarget;
                    if (video.volume.toFixed(2) !== adjustedVolume.toFixed(2)) {
                        console.log('2', video.volume, adjustedVolume);
                        video.volume = adjustedVolume;
                    }
                }
            })
        }, { once: true });

        // detect user volume change
        const volumeButton = prismPlayer.getVolumeButton();
        const volumeSlider = prismPlayer.getVolumeSlider();
        volumeButton.addEventListener('click', (event) => {
            if (event.isTrusted) isVolumeChangedByUser = true;
        }, { once: true });
        volumeSlider.addEventListener('mousedown', (event) => {
            if (event.isTrusted) isVolumeChangedByUser = true;
        }, { once: true });
        volumeSlider.addEventListener('pointerdown', (event) => {
            if (event.isTrusted) isVolumeChangedByUser = true;
        }, { once: true });
        prismPlayer.element.addEventListener('keydown', (event) => {
            if (event.isTrusted && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
                isVolumeChangedByUser = true;
            }
        }, { once: true });
        new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.target.classList.contains('pzp-pc--active-volume-control')) {
                    isVolumeChangedByUser = true;
                    return observer.disconnect();
                }
            }
        }).observe(prismPlayer.element, { attributeFilter: ['class'] });
    }

    async getDefaultVolume() {
        try {
            const items = await chrome.storage.sync.get('defaultVolume');
            if (!items) return;
            return parseFloat(items.defaultVolume);
        } catch (e) {
            console.warn(e);
        }
        return null;
    }
}
