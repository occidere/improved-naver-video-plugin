class PreserveVolumeAfterReplayDecorator extends Decorator {

    decorate(prismPlayer) {
        const onceOption = { once: true };
        const onReplay = () => {
            prismPlayer.query('playButton').removeEventListener('click', onReplay, onceOption);
            prismPlayer.query('playPauseButton').removeEventListener('click', onReplay, onceOption);
            const video = prismPlayer.query('video');
            const volume = video.volume;
            video.addEventListener('play', () => { video.volume = volume; }, onceOption);
        };
        const onEnded = () => {
            prismPlayer.query('playButton').addEventListener('click', onReplay, onceOption);
            prismPlayer.query('playPauseButton').addEventListener('click', onReplay, onceOption);
        };
        if (prismPlayer.isState('ended')) {
            onEnded();
        } else {
            prismPlayer.query('video').addEventListener('ended', onEnded);
        }
    }
}
