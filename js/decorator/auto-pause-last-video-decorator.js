class AutoPauseLastVideoDecorator extends Decorator {

    decorate(prismPlayer) {
        const onPlayVideo = () => {
            const video = prismPlayer.query('video');
            const otherVideos = document.querySelectorAll('video');
            for (const otherVideo of otherVideos) {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            }
        };

        prismPlayer.query('video').addEventListener('play', onPlayVideo);

        prismPlayer.listeners[this.constructor.name] = { onPlayVideo };
    }

    async clear(prismPlayer) {
        const { onPlayVideo } = prismPlayer.listeners[this.constructor.name];

        prismPlayer.query('video').removeEventListener('play', onPlayVideo);

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }
}
