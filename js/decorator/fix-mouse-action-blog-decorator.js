class FixMouseActionBlogDecorator extends Decorator {

    decorate(prismPlayer) {
        const onClick = () => {
            if (prismPlayer.isState('playing')) {
                prismPlayer.query('playPauseButton').click();
            } else {
                prismPlayer.query('video').autoplay = true;
                prismPlayer.query('playButton').click();
            }
        };
        const header = prismPlayer.query('header');
        const dim = prismPlayer.query('dim');
        header.addEventListener('click', onClick);
        dim.addEventListener('click', onClick);

        dim.classList.add(APP_MOUSE_POINTER_CLASS);

        prismPlayer.attachListeners(this, { onClick });
    }

    async clear(prismPlayer) {
        const { onClick } = prismPlayer.getAttachedListeners(this);

        const header = prismPlayer.query('header');
        const dim = prismPlayer.query('dim');
        header.removeEventListener('click', onClick);
        dim.removeEventListener('click', onClick);

        dim.classList.remove(APP_MOUSE_POINTER_CLASS);

        prismPlayer.detachListeners(this);
        return true;
    }
}
