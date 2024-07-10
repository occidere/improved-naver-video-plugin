class EasyOpenVolumeSliderDecorator extends Decorator {

    decorate(prismPlayer) {
        const bottomButtons = prismPlayer.query('bottomButtons');
        bottomButtons.classList.add(APP_EASY_OPEN_VOLUME_SLIDER_CLASS);
    }

    async clear(prismPlayer) {
        const bottomButtons = prismPlayer.query('bottomButtons');
        bottomButtons.classList.remove(APP_EASY_OPEN_VOLUME_SLIDER_CLASS);
        return true;
    }
}
