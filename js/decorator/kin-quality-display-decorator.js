class KinQualityDisplayDecorator extends QualityDisplayDecorator {

    getParentVideo(element) {
        return element.closest('.' + KIN_VIDEO_MODULE_CLASS);
    }
}
