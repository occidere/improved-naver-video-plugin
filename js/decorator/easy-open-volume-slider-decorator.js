class EasyOpenVolumeSliderDecorator extends Decorator {

    decorate(prismPlayer) {
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.prepend(this.createVolumeSliderHoverHelper());

        const bottomRightButtons = prismPlayer.query('bottomRightButtons');
        const blocker = this.createVolumeSliderHoverHelperBlocker();
        bottomRightButtons.prepend(blocker);

        // observe width of bottomRightButtons
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const blocker = this.getVolumeSliderHoverHelperBlocker(prismPlayer);
                this.setBlockerWidth(blocker, entry.target.clientWidth);
            }
        });
        resizeObserver.observe(bottomRightButtons);

        // apply now
        this.setBlockerWidth(blocker, bottomRightButtons.clientWidth);

        prismPlayer.listeners[this.constructor.name] = { resizeObserver };
    }

    async clear(prismPlayer) {
        const { resizeObserver } = prismPlayer.listeners[this.constructor.name];

        this.getVolumeSliderHoverHelper(prismPlayer).remove();
        this.getVolumeSliderHoverHelperBlocker(prismPlayer).remove();

        resizeObserver.disconnect();

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }

    getVolumeSliderHoverHelper(prismPlayer) {
        return prismPlayer.element.querySelector('.' + APP_VOLUME_SLIDER_HOVER_HELPER_CLASS);
    }

    createVolumeSliderHoverHelper() {
        const div = document.createElement('div');
        div.classList.add(APP_VOLUME_SLIDER_HOVER_HELPER_CLASS);
        return div;
    }

    getVolumeSliderHoverHelperBlocker(prismPlayer) {
        return prismPlayer.element.querySelector('.' + APP_VOLUME_SLIDER_HOVER_HELPER_BLOCKER_CLASS);
    }

    createVolumeSliderHoverHelperBlocker() {
        const div = document.createElement('div');
        div.classList.add(APP_VOLUME_SLIDER_HOVER_HELPER_BLOCKER_CLASS);
        return div;
    }

    setBlockerWidth(blocker, controlWidth) {
        // margin-right: 23px
        // margin-left: 10px
        blocker.style.width = (controlWidth + 23 - 10).toFixed() + 'px';
    }
}
