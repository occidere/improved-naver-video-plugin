class SelectMaxQualityDecorator extends Decorator {

    static MAX_QUALITY_IDX = 1;

    async decorate(video) {
        try {
            const lis = video.getElementsByClassName(QUALITY_SETTING_LI_CLASS);
            lis[SelectMaxQualityDecorator.MAX_QUALITY_IDX]?.click();
        } catch (e) {
            console.warn(`Failed to click max quality: ${e}`);
        }
    }
}
