class DefaultVolumeDecorator extends Decorator {

    // onVideoFound 시점에서 실행하면 볼륨이 1로 재설정되는 현상이 있음
    // => select-max-quality 이후에 실행
    async decorate(video) {
        try {
            const videoMedia = video.querySelector('video');
            if (videoMedia) {
                const items = (await chrome.storage.sync.get('defaultVolume'))
                const volume = items?.defaultVolume;
                if (volume !== undefined) {
                    videoMedia.volume = parseFloat(volume);
                }
            }
        } catch (e) {
            console.warn(`Failed to set default volume: ${e}`);
        }
    }
}
