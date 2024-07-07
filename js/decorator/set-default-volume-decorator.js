class SetDefaultVolumeDecorator extends Decorator {

    // can be decorated any time
    async decorate(prismPlayer) {
        const isDecoratedBeforeLoaded = !prismPlayer.loaded;

        // get defaultVolume (volume that user can see in popup.html)
        const settings = await chrome.storage.sync.get(['defaultVolume', 'extendMaxVolume']);
        const defaultVolume = parseFloat(settings['defaultVolume']);

        // 1.0 : userVolume = maxVolume : adjustedVolume
        const maxVolume = await prismPlayer.getMaxVolume();
        let adjustedVolume = maxVolume * defaultVolume;
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
