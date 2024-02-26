class MuteShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.code !== 'KeyM') return;
            prismPlayer.query('volumeButton').click();
        };
        prismPlayer.element.addEventListener('keydown', playerKeyDownListener);

        prismPlayer.attachListeners(this, { playerKeyDownListener });
    }

    async clear(prismPlayer) {
        const { playerKeyDownListener } = prismPlayer.getAttachedListeners(this);

        prismPlayer.element.removeEventListener('keydown', playerKeyDownListener);

        prismPlayer.detachListeners(this);
        return true;
    }
}
