class FullScreenShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.key !== 'f' && event.key !== 'F') return;
            prismPlayer.query('fullScreenButton').click();
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
