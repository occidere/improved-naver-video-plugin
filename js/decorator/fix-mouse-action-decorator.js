class FixMouseActionDecorator extends Decorator {

    decorate(prismPlayer) {
        const onClickHeader = () => {
            prismPlayer.query('video').click();
        };
        const header = prismPlayer.query('header');
        header.addEventListener('click', onClickHeader);

        const dim = prismPlayer.query('dim');
        header.classList.add(APP_MOUSE_POINTER_CLASS);
        dim.classList.add(APP_MOUSE_POINTER_CLASS);

        prismPlayer.attachListeners(this, { onClickHeader });
    }

    async clear(prismPlayer) {
        const { onClickHeader } = prismPlayer.getAttachedListeners(this);

        const header = prismPlayer.query('header');
        header.removeEventListener('click', onClickHeader);

        const dim = prismPlayer.query('dim');
        header.classList.remove(APP_MOUSE_POINTER_CLASS);
        dim.classList.remove(APP_MOUSE_POINTER_CLASS);

        prismPlayer.detachListeners(this);
        return true;
    }
}
