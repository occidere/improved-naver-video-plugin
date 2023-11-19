class SelectMaxQualityDecorator extends Decorator {

    async decorate(video) {
        try {
            const lis = video.getElementsByClassName(QUALITY_SETTING_LI_CLASS);
            let maxQualityLi;
            for (const li of lis) {
                const span = li.querySelector('.' + QUALITY_TEXT_SPAN_CLASS);
                if (!span?.textContent.includes('자동')) {
                    maxQualityLi = li;
                    break;
                }
            }
            maxQualityLi?.click();
        } catch (e) {
            console.warn(`Failed to click max quality: ${e}`);
        }
    }
}
