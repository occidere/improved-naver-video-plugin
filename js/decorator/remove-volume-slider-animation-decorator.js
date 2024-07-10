class RemoveVolumeSliderAnimationDecorator extends Decorator {

    decorate(prismPlayer) {
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.add(APP_REMOVE_VOLUME_SLIDER_ANIMATION_CLASS);
    }

    async clear(prismPlayer) {
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.remove(APP_REMOVE_VOLUME_SLIDER_ANIMATION_CLASS);
        return true;
    }
}
