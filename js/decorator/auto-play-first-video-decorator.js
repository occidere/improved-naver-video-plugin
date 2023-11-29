class AutoPlayFirstVideoDecorator extends Decorator {

    decorate(prismPlayer) {
        if (!prismPlayer.isFirstPrismPlayer()) return;
        if (!prismPlayer.isState('beforePlay')) return;

        // if no user interaction -> unmute when user interacted
        if (!isUserActivated()) {
            prismPlayer.query('volumeButton').click(); // mute video (autoplay policy)
            setUserActivationListener(prismPlayer.element.ownerDocument, () => {
                prismPlayer.query('video').muted = false;
            });
        }

        const video = prismPlayer.query('video');
        video.autoplay = true;

        // ignore this after first load
        if (!prismPlayer.loaded) {
            // Ignore next error message:
            // Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.
            video.play();
        }
    }
}
