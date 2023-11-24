class AutoPlayFirstVideoDecorator extends Decorator {

    async decorate(prismPlayer) {
        if (!prismPlayer.isFirstPrismPlayer()) return;

        const video = prismPlayer.getVideo();
        if (!this.isUserActivated()) {
            prismPlayer.getVolumeButton().click(); // for visual effect
            video.muted = true; // autoplay policy
            video.addEventListener('play', (event) => {
                if (this.isUserActivated()) {
                    const videoMedia = event.currentTarget;
                    videoMedia.muted = false;
                }
            }, { once: true });
            this.setUserActivationListener(video.ownerDocument, () => {
                if (this.isUserActivated()) {
                    video.muted = false;
                }
            });
        }
        video.autoplay = true;
        prismPlayer.getPlayButton().click();
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
