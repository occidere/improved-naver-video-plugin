class MuteShortcutDecorator extends Decorator {

    decorate(prismPlayer) {
        const playerKeyDownListener = (event) => {
            if (!event.isTrusted) return;
            if (event.key !== 'm' && event.key !== 'M') return;
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
