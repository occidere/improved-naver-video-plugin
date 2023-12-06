class EasyClickToPlayDecorator extends Decorator {

    decorate(prismPlayer) {
        // click -> playPause
        // dblclick -> fullScreen
        // dblclick before play -> play & fullScreen
        // => pause after playing
        let isPlayAndFullScreen = false;

        const onClickElement = () => {
            if (prismPlayer.isState('playing')) {
                prismPlayer.query('playPauseButton').click();
            } else {
                prismPlayer.query('video').autoplay = true;
                prismPlayer.query('playButton').click();
                isPlayAndFullScreen = false; // interrupt playingObserver
            }
        };
        const onDoubleClickElement = () => {
            prismPlayer.query('fullScreenButton').click();
            if (!prismPlayer.isState('playing')) {
                isPlayAndFullScreen = true;
            }
        };
        const playingObserver = new ClassChangeObserver(PrismPlayer.playerStateClassNames['playing'],
            async (appeared) => {
                if (appeared && isPlayAndFullScreen) {
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

        // first click on not-playing, second click on playing -> play & no fullScreen
        // => pause and fullScreen at second click
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

        prismPlayer.listeners[this.constructor.name] = {
            onClickElement, onDoubleClickElement,
            onClickPlayer, onDoubleClickPlayer,
            pointerOn, pointerOff, playingObserver
        };
    }

    async clear(prismPlayer) {
        const {
            onClickElement, onDoubleClickElement,
            onClickPlayer, onDoubleClickPlayer,
            pointerOn, pointerOff, playingObserver
        } = prismPlayer.listeners[this.constructor.name];

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
        return true;
    }
}
