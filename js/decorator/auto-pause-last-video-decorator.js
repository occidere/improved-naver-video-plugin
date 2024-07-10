class AutoPauseLastVideoDecorator extends Decorator {

    decorate(prismPlayer) {
        const onPlayVideo = () => {
            const video = prismPlayer.query('video');
            const otherVideos = prismPlayer.element.ownerDocument.querySelectorAll('video');
            for (const otherVideo of otherVideos) {
                if (otherVideo !== video && !otherVideo.paused) {
                    otherVideo.pause();
                }
            }
        };

        prismPlayer.query('video').addEventListener('play', onPlayVideo);

        prismPlayer.attachListeners(this, { onPlayVideo });
    }

    async clear(prismPlayer) {
        const { onPlayVideo } = prismPlayer.getAttachedListeners(this);

        prismPlayer.query('video').removeEventListener('play', onPlayVideo);

        prismPlayer.detachListeners(this);
        return true;
    }
}
