class ExtendMaxVolumeDecorator extends Decorator {

    static AMPLIFY_FACTOR = 1.5;

    static audioContext;
    static gainNode;

    static getAudioContext() {
        if (this.audioContext) {
            return this.audioContext;
        }
        return this.audioContext = new AudioContext();
    }

    static getGainNode(audioContext) {
        if (this.gainNode) {
            return this.gainNode;
        }
        this.gainNode = new GainNode(audioContext, { gain: this.AMPLIFY_FACTOR });
        this.gainNode.connect(audioContext.destination);
        return this.gainNode;
    }

    async decorate(prismPlayer) {
        const isDecoratedBeforeLoaded = !prismPlayer.loaded;

        // extend slider
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.add(APP_EXTEND_MAX_VOLUME_CLASS);

        // connect source to gainNode
        const onUserActivation = () => {
            const audioContext = ExtendMaxVolumeDecorator.getAudioContext();
            const gainNode = ExtendMaxVolumeDecorator.getGainNode(audioContext);
            const video = prismPlayer.query('video');
            if (!prismPlayer.source) {
                prismPlayer.source = audioContext.createMediaElementSource(video);
            }
            prismPlayer.source.disconnect();
            prismPlayer.source.connect(gainNode);
        };
        if (isUserActivated()) {
            onUserActivation();
        } else {
            setUserActivationListener(prismPlayer.element.ownerDocument, onUserActivation);
        }

        // preserve output volume
        await prismPlayer.getMaxVolume(); // wait until maxVolume is set
        const video = prismPlayer.query('video');
        const currentVolume = video.volume;
        if (isDecoratedBeforeLoaded) {
            await sleep(100); // to fix volume slider bug
        }
        if (!prismPlayer.isMaxVolumeExtended) { // prevent conflict
            video.volume = currentVolume / ExtendMaxVolumeDecorator.AMPLIFY_FACTOR;
        }
        prismPlayer.isMaxVolumeExtended = true;
    }

    async clear(prismPlayer) {
        // restore slider
        const volumeControl = prismPlayer.query('volumeControl');
        volumeControl.classList.remove(APP_EXTEND_MAX_VOLUME_CLASS);

        // reconnect source
        if (prismPlayer.source) {
            const audioContext = ExtendMaxVolumeDecorator.getAudioContext();
            prismPlayer.source.disconnect();
            prismPlayer.source.connect(audioContext.destination);
        }

        // preserve output volume
        const maxVolume = await prismPlayer.getMaxVolume();
        const video = prismPlayer.query('video');
        const currentVolume = video.volume;
        video.volume = Math.min(maxVolume, currentVolume * ExtendMaxVolumeDecorator.AMPLIFY_FACTOR);
        prismPlayer.isMaxVolumeExtended = false;
        return true;
    }
}
