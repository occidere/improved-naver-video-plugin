class SelectMaxQualityDecorator extends Decorator {

    MAX_QUALITY_IDX = 1;

    async decorate(videoPlayerElements) {
        const selectMaxQuality = await getSyncValue('selectMaxQuality');
        if (selectMaxQuality) {
            try {
                for (const videoPlayerDiv of videoPlayerElements) {
                    // Change to max quality
                    videoPlayerDiv.getElementsByClassName(QUALITY_SELECT_UL_CLASS)[0]
                        .getElementsByClassName(QUALITY_SELECT_LI_CLASS)[this.MAX_QUALITY_IDX]
                        .click();
                }
            } catch (e) {
                console.warn(`Failed click max quality: ${e}`); // Mostly due to slow loading
            }
        }
    }
}