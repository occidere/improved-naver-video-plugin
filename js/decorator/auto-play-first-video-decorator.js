class AutoPlayFirstVideoDecorator extends Decorator {

    decorate(prismPlayer) {
        if (!prismPlayer.isFirstPrismPlayer()) return;
        if (!prismPlayer.isState('beforePlay')) return;

        const video = prismPlayer.query('video');
        video.autoplay = true;

        // if no user interaction -> unmute when user interacted
        if (!this.isUserActivated()) {
            prismPlayer.query('volumeButton').click(); // autoplay policy
            this.setUserActivationListener(prismPlayer.element.ownerDocument, () => {
                if (this.isUserActivated()) {
                    const video = prismPlayer.query('video');
                    video.muted = false;
                }
            });
        }

        // Ignore next error message:
        // Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.
        if (!prismPlayer.loaded) {
            video.play();
        }
    }

    isUserActivated() {
        return navigator.userActivation.hasBeenActive;
    }

    setUserActivationListener(ownerDocument, listener) {
        const userActivationEvents = ['keydown', 'mousedown', 'pointerdown', 'pointerup', 'touchend'];
        const userActivationListener = (event) => {
            if (event.isTrusted) {
                listener();
                // clear userActivationListener
                for (const userActivationEvent of userActivationEvents) {
                    document.removeEventListener(userActivationEvent, userActivationListener);
                    if (ownerDocument !== document) {
                        ownerDocument.removeEventListener(userActivationEvent, userActivationListener);
                    }
                }
            }
        };
        for (const userActivationEvent of userActivationEvents) {
            document.addEventListener(userActivationEvent, userActivationListener);
            if (ownerDocument !== document) {
                ownerDocument.addEventListener(userActivationEvent, userActivationListener);
            }
        }
    }
}
