class EasyClickToPlayDecorator extends Decorator {

    async decorate(prismPlayer) {
        const playPauseVideo = () => {
            const video = prismPlayer.getVideo();
            if (video.paused && prismPlayer.isVideoBeforePlay()) {
                video.autoplay = true;
                prismPlayer.getPlayButton().click();
            } else {
                prismPlayer.getPlayPauseButton().click();
            }
        };

        const toggleFullScreen = () => {
            prismPlayer.getFullScreenButton().click();
        };

        const header = prismPlayer.getHeader();
        header.addEventListener('click', playPauseVideo);
        header.addEventListener('dblclick', toggleFullScreen);

        const dim = prismPlayer.getDim();
        dim.addEventListener('click', playPauseVideo);
        this.handleDoubleClickOnDimmed(prismPlayer);

        if (prismPlayer.getVideo().paused && !prismPlayer.isVideoPlaying()) {
            this.setupEasyClick(prismPlayer);
        } else {
            this.clearEasyClick(prismPlayer);
        }
    }

    setupEasyClick(prismPlayer) {
        prismPlayer.getHeader().style.cursor = 'pointer';
        prismPlayer.getDim().style.cursor = 'pointer';
        prismPlayer.getVideo().addEventListener('play',
            () => this.clearEasyClick(prismPlayer),
            { once: true });
    }

    clearEasyClick(prismPlayer) {
        prismPlayer.getHeader().style.cursor = '';
        prismPlayer.getDim().style.cursor = '';
        prismPlayer.getVideo().addEventListener('ended',
            () => this.setupEasyClick(prismPlayer),
            { once: true });
    }

    handleDoubleClickOnDimmed(prismPlayer) {
        const PAUSE_ICON = 'pzp-pc-playback-switch__pause-icon';
        const isPauseIconVisible = () => prismPlayer.getPlayPauseButton().querySelector('span.' + PAUSE_ICON);

        let isClickOnDim = false;
        let isDblClickOnDim = false;
        let isDblClickedOnDim = false;
        const onClickPlayer = (event) => {
            if (!event.isTrusted) return;
            const wasClickOnDim = isClickOnDim;
            isClickOnDim = !prismPlayer.isVideoPlaying();
            isDblClickOnDim = wasClickOnDim && !isClickOnDim; // first on dim but second is not
            isDblClickedOnDim = false; // interrupt double click
        };
        const toggleFullScreenOnDimmed = (event) => {
            if (isDblClickOnDim && !prismPlayer.getBottom().contains(event.target)) { // exclude control area
                prismPlayer.getFullScreenButton().click();
                if (prismPlayer.isVideoPlaying() && isPauseIconVisible()) {
                    prismPlayer.getPlayPauseButton().click();
                }
                isDblClickedOnDim = true;
            }
        };
        prismPlayer.getDim().addEventListener('dblclick', () => {
            prismPlayer.getFullScreenButton().click();
            if (prismPlayer.getVideo().paused && !prismPlayer.isVideoPlaying()) {
                prismPlayer.getPlayPauseButton().click(); // cancel double input of click
            }
            isDblClickedOnDim = true;
        });
        new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                if (!mutation.oldValue.includes(VIDEO_PLAYING_CLASS) &&
                    mutation.target.classList.contains(VIDEO_PLAYING_CLASS)) {
                    if (isDblClickedOnDim && isPauseIconVisible()) {
                        prismPlayer.getPlayPauseButton().click();
                    }
                }
            }
        }).observe(prismPlayer.element, { attributeOldValue: true, attributeFilter: ['class'] });

        prismPlayer.element.addEventListener('click', onClickPlayer);
        prismPlayer.element.addEventListener('dblclick', toggleFullScreenOnDimmed);
    }
}
