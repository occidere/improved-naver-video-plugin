class EasyClickToPlayDecorator extends Decorator {

    decorate(prismPlayer) {
        // click -> playPause
        // dblclick -> fullscreen
        // dblclick before play -> play & fullscreen
        // => pause after playing
        let isPlayAndFullscreen = false;

        const onClickElement = () => {
            if (prismPlayer.isState('playing')) {
                prismPlayer.query('playPauseButton').click();
            } else {
                prismPlayer.query('video').autoplay = true;
                prismPlayer.query('playButton').click();
                isPlayAndFullscreen = false; // interrupt playingObserver
            }
        };
        const onDoubleClickElement = () => {
            prismPlayer.query('fullScreenButton').click();
            if (!prismPlayer.isState('playing')) {
                isPlayAndFullscreen = true;
            }
        };
        const playingObserver = new ClassChangeObserver(PrismPlayer.playerStateClassNames['playing'],
            async (appeared) => {
                if (appeared && isPlayAndFullscreen) {
                    await sleep(10);
                    prismPlayer.query('playPauseButton').click();
                }
            });
        const header = prismPlayer.query('header');
        const dim = prismPlayer.query('dim');
        header.addEventListener('click', onClickElement);
        header.addEventListener('dblclick', onDoubleClickElement);
        dim.addEventListener('click', onClickElement);
        dim.addEventListener('dblclick', onDoubleClickElement);
        playingObserver.observe(prismPlayer.element);

        // first click on not-playing, second click on playing -> play & no fullscreen
        // => pause and fullscreen at second click
        let isPlayerClickedOnPlaying = false;
        let isSecondClickOnPlaying = false;

        const onClickPlayer = (event) => {
            if (!event.isTrusted) return;
            const wasPlayerClickedOnPlaying = isPlayerClickedOnPlaying;
            isPlayerClickedOnPlaying = prismPlayer.isState('playing');
            isSecondClickOnPlaying = !wasPlayerClickedOnPlaying && isPlayerClickedOnPlaying;
        };
        const onDoubleClickPlayer = (event) => {
            if (!event.isTrusted) return;
            if (isSecondClickOnPlaying &&
                !prismPlayer.query('bottom').contains(event.target)) { // exclude control area
                prismPlayer.query('playPauseButton').click();
                prismPlayer.query('fullScreenButton').click();
            }
        };
        prismPlayer.element.addEventListener('click', onClickPlayer);
        prismPlayer.element.addEventListener('dblclick', onDoubleClickPlayer);

        // beforePlay, ended -> cursor: pointer
        // playing           -> cursor: none
        const pointerOn = () => {
            prismPlayer.query('header').style.cursor = 'pointer';
            prismPlayer.query('dim').style.cursor = 'pointer';
            prismPlayer.query('video').addEventListener('play', pointerOff, { once: true });
        }
        const pointerOff = () => {
            prismPlayer.query('header').style.cursor = '';
            prismPlayer.query('dim').style.cursor = '';
            prismPlayer.query('video').addEventListener('ended', pointerOn, { once: true });
        }
        if (!prismPlayer.isState('playing')) {
            pointerOn();
        } else {
            pointerOff();
        }

        // for clear()
        prismPlayer.listeners[this.constructor.name]
            = { onClickElement, onDoubleClickElement, onClickPlayer, onDoubleClickPlayer, pointerOn, pointerOff };
        prismPlayer.observers[this.constructor.name] = { playingObserver };
    }

    clear(prismPlayer) {
        const { onClickElement, onDoubleClickElement, onClickPlayer, onDoubleClickPlayer, pointerOn, pointerOff }
            = prismPlayer.listeners[this.constructor.name];
        const { playingObserver } = prismPlayer.observers[this.constructor.name];

        if (!prismPlayer.isState('playing')) {
            pointerOff();
        }

        const header = prismPlayer.query('header');
        const dim = prismPlayer.query('dim');
        header.removeEventListener('click', onClickElement);
        header.removeEventListener('dblclick', onDoubleClickElement);
        dim.removeEventListener('click', onClickElement);
        dim.removeEventListener('dblclick', onDoubleClickElement);
        playingObserver.disconnect();

        prismPlayer.element.removeEventListener('click', onClickPlayer);
        prismPlayer.element.removeEventListener('dblclick', onDoubleClickPlayer);

        const video = prismPlayer.query('video');
        video.removeEventListener('ended', pointerOn, { once: true });
        video.removeEventListener('play', pointerOff, { once: true });

        delete prismPlayer.listeners[this.constructor.name];
        delete prismPlayer.observers[this.constructor.name];
        return true;
    }
}
