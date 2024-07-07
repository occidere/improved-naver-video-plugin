class EasyOpenVolumeSliderDecorator extends Decorator {

    decorate(prismPlayer) {
        const bottom = prismPlayer.query('bottom');
        bottom.classList.add(APP_EASY_OPEN_VOLUME_SLIDER_CLASS);
    }

    async clear(prismPlayer) {
        const bottom = prismPlayer.query('bottom');
        bottom.classList.remove(APP_EASY_OPEN_VOLUME_SLIDER_CLASS);
        return true;
    }
}
