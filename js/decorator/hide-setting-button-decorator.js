class HideSettingButtonDecorator extends Decorator {

    decorate(prismPlayer) {
        const settingButton = prismPlayer.query('settingButton');
        settingButton.style.display = 'none';
    }

    async clear(prismPlayer) {
        const settingButton = prismPlayer.query('settingButton');
        settingButton.style.display = '';
        return true;
    }
}
