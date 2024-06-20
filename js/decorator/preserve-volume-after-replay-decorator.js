class PreserveVolumeAfterReplayDecorator extends Decorator {

    decorate(prismPlayer) {
        const addListeners = () => {
            prismPlayer.query('playButton').addEventListener('click', preserveVolumeAfterPlay, { once: true });
            prismPlayer.query('playPauseButton').addEventListener('click', preserveVolumeAfterPlay, { once: true });
            prismPlayer.element.addEventListener('keydown', onSpacebarDown);
        };
        const clearListeners = () => {
            prismPlayer.query('playButton').removeEventListener('click', preserveVolumeAfterPlay, { once: true });
            prismPlayer.query('playPauseButton').removeEventListener('click', preserveVolumeAfterPlay, { once: true });
            prismPlayer.element.removeEventListener('keydown', onSpacebarDown);
        };
        const onSpacebarDown = (event) => {
            if (!event.isTrusted) return;
            if (event.code !== 'Space') return;
            preserveVolumeAfterPlay();
        };
        const preserveVolumeAfterPlay = () => {
            clearListeners();
            const video = prismPlayer.query('video');
            const volume = video.volume;
            video.addEventListener('play', () => { video.volume = volume; }, { once: true });
        };
        if (prismPlayer.isState('ended')) {
            addListeners();
        } else {
            prismPlayer.query('video').addEventListener('ended', addListeners);
        }
    }
}
