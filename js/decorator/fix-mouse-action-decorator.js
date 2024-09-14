class FixMouseActionDecorator extends Decorator {

    decorate(prismPlayer) {
        const clickVideo = () => {
            prismPlayer.query('video').click();
        };
        const header = prismPlayer.query('header');
        const durationIndicator = prismPlayer.query('durationIndicator');
        header.addEventListener('click', clickVideo);
        durationIndicator.addEventListener('click', clickVideo);

        const dim = prismPlayer.query('dim');
        header.classList.add(APP_MOUSE_POINTER_CLASS);
        durationIndicator.classList.add(APP_MOUSE_POINTER_CLASS);
        dim.classList.add(APP_MOUSE_POINTER_CLASS);

        prismPlayer.attachListeners(this, { clickVideo });
    }

    async clear(prismPlayer) {
        const { clickVideo } = prismPlayer.getAttachedListeners(this);

        const header = prismPlayer.query('header');
        const durationIndicator = prismPlayer.query('durationIndicator');
        header.removeEventListener('click', clickVideo);
        durationIndicator.removeEventListener('click', clickVideo);

        const dim = prismPlayer.query('dim');
        header.classList.remove(APP_MOUSE_POINTER_CLASS);
        durationIndicator.classList.remove(APP_MOUSE_POINTER_CLASS);
        dim.classList.remove(APP_MOUSE_POINTER_CLASS);

        prismPlayer.detachListeners(this);
        return true;
    }
}
