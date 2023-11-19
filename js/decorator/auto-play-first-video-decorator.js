class AutoPlayFirstVideoDecorator extends Decorator {

    playListener = (event) => {
        const videoMedia = event.currentTarget;
        videoMedia.autoplay = false;
        videoMedia.muted = false;
        // Without user interaction, unmuting will be failed and video will be paused.
    };

    async decorate(video) {
        try {
            if (!isFirstVideo(video)) return;
            const videoMedia = video.querySelector('video');
            if (videoMedia?.paused) {
                videoMedia.muted = true; // autoplay policy
                videoMedia.autoplay = true;
                videoMedia.addEventListener('play', this.playListener, { once: true });
            }
        } catch (e) {
            console.warn(`Failed to auto play video: ${e}`);
        }
    }
}
