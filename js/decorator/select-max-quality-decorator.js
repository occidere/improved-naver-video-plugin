class SelectMaxQualityDecorator extends Decorator {

    async decorate(prismPlayer) {
        const lis = await prismPlayer.getQualitySettingItems();
        for (const li of lis) {
            if (!this.isQualitySettingItemAuto(li)) {
                return li.click();
            }
        }
    }

    clear() {
        return true;
    }

    isQualitySettingItemAuto(li) {
        const span = this.getQualitySettingItemSpan(li);
        return span.textContent.includes('자동');
    }

    getQualitySettingItemSpan(li) {
        return li.querySelector('span.' + QUALITY_SETTING_ITEM_SPAN_CLASS);
    }
}
