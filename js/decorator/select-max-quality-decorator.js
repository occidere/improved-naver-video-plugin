class SelectMaxQualityDecorator extends Decorator {

    async decorate(prismPlayer) {
        prismPlayer.getQualitySettingItems((lis) => {
            let maxQualityLi;
            for (const li of lis) {
                const span = PrismPlayer.getQualitySettingItemText(li);
                if (!span.textContent.includes('자동')) {
                    maxQualityLi = li;
                    break;
                }
            }
            maxQualityLi?.click();
        });
    }
}
