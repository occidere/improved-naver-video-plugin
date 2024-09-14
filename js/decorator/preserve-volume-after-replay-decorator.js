class PreserveVolumeAfterReplayDecorator extends Decorator {

    decorate(prismPlayer) {
        const video = prismPlayer.query('video');
        const preserveVolumeAfterPlay = () => {
            const volume = video.volume;
            video.addEventListener('play', () => { video.volume = volume; }, { once: true });
        };
        video.addEventListener('ended', preserveVolumeAfterPlay);
        if (prismPlayer.isState('ended')) {
            preserveVolumeAfterPlay();
        }
    }
}
