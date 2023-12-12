class MuteShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.key !== 'm' && event.key !== 'M') return;
            prismPlayer.query('volumeButton').click();
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.listeners[this.constructor.name] = { playerKeyDownListener };
    }

    async clear(prismPlayer) {
        const { playerKeyDownListener } = prismPlayer.listeners[this.constructor.name];

        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        delete prismPlayer.listeners[this.constructor.name];
        return true;
    }
}
