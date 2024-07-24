class ExtendMaxVolumeDecorator extends Decorator {

    static AMPLIFY_FACTOR = 2.5;

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
        const volumeControl = prismPlayer.query('volumeControl');
        const button = this.createVolumeExtendButton();
        volumeControl.appendChild(button);

        button.addEventListener('click', () => {
            const audioContext = ExtendMaxVolumeDecorator.getAudioContext();
            const gainNode = ExtendMaxVolumeDecorator.getGainNode(audioContext);
            if (!prismPlayer.source) {
                prismPlayer.source = audioContext.createMediaElementSource(prismPlayer.query('video'));
            }
            prismPlayer.source.disconnect();
            prismPlayer.source.connect(gainNode);

            this.getQualityDisplay(prismPlayer)?.remove();
        });
    }

    async clear(prismPlayer) {
        // reconnect source
        if (prismPlayer.source) {
            const audioContext = ExtendMaxVolumeDecorator.getAudioContext();
            prismPlayer.source.disconnect();
            prismPlayer.source.connect(audioContext.destination);
        }

        this.getQualityDisplay(prismPlayer)?.remove();
        return true;
    }

    createVolumeExtendButton() {
        const button = document.createElement('button');
              button.classList.add(PLAYER_BUTTON_CLASS,
                                   PLAYER_UI_BUTTON_CLASS, // for compatible
                                   APP_UI_BUTTON_CLASS,
                                   APP_EXTEND_MAX_VOLUME_CLASS);
        const tooltip = document.createElement('span');
              tooltip.classList.add(PLAYER_UI_TOOLTIP_CLASS,
                                    PLAYER_UI_TOOLTIP_TOP_CLASS);
              tooltip.textContent = '볼륨 키우기';
              button.appendChild(tooltip);
        const label = document.createElement('span');
              label.classList.add(APP_UI_LABEL_CLASS);
              label.textContent = 'MAX';
              button.appendChild(label);
        return button;
    }

    getQualityDisplay(prismPlayer) {
        return prismPlayer.element.querySelector('button.' + APP_EXTEND_MAX_VOLUME_CLASS);
    }
}
