class ExtendVolumeSliderDecorator extends Decorator {

    decorate(prismPlayer) {
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.add(APP_EXTEND_VOLUME_SLIDER_CLASS);
    }

    async clear(prismPlayer) {
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.remove(APP_EXTEND_VOLUME_SLIDER_CLASS);
        return true;
    }
}
