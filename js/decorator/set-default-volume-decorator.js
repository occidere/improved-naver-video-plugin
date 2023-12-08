class SetDefaultVolumeDecorator extends Decorator {

    // can be decorated any time
    async decorate(prismPlayer) {
        const isDecoratedBeforeLoaded = !prismPlayer.loaded;

        // get defaultVolume (volume that user can see in popup.html)
        const settings = await chrome.storage.sync.get(['defaultVolume', 'extendMaxVolume']);
        const defaultVolume = parseFloat(settings['defaultVolume']);

        // extend-max-volume should be checked before setting volume
        prismPlayer.isMaxVolumeExtended = settings['extendMaxVolume'];

        // 1.0 : userVolume = maxVolume : adjustedVolume
        const maxVolume = await prismPlayer.getMaxVolume();
        let adjustedVolume = maxVolume * defaultVolume;
        if (prismPlayer.isMaxVolumeExtended) {
            // maximum value of volume cannot exceed maxVolume
            adjustedVolume = adjustedVolume / ExtendMaxVolumeDecorator.AMPLIFY_FACTOR;
        }
        if (!isNaN(adjustedVolume)) {
            if (isDecoratedBeforeLoaded) {
                await sleep(100); // fix volume slider bug
            }
            prismPlayer.query('video').volume = adjustedVolume;
        }
    }

    async clear() {
        return true;
    }
}
