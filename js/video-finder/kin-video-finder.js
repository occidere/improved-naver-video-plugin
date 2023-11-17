/*
[kin.naver.com 로딩 순서]

(1) html
      div.kin_movie_info >>

(2) div.kin_movie_info (video)
      div.video-area
        div.pzp-pc__video
          video.webplayer-internal-video (detect this)
        div.pzp-pc__setting-quality-pane
          ul.pzp-pc-setting-quality-pane__list-container >>

(3) ul.pzp-pc-setting-quality-pane__list-container
      li.pzp-pc-ui-setting-quality-item
*/
class KinVideoFinder extends VideoFinder {

    // (1) -> (2)
    // document에서 video를 찾아 connectVideo()가 실행되도록 한다.
    async connect(document) {
        this.webplayerObserver.disconnect();
        this.qualitySettingObserver.disconnect();

        const webplayers = document.getElementsByClassName(VIDEO_WEBPLAYER_CLASS);
        if (webplayers.length > 0) {
            const videos = document.getElementsByClassName(KIN_VIDEO_MODULE_CLASS);
            for (const video of videos) {
                this.connectVideo(video);
            }
        } else {
            this.webplayerObserver.observe(document.body, { subtree: true, childList: true });
        }
    }

    webplayerObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.classList.contains(KIN_VIDEO_MODULE_CLASS) &&
                mutation.addedNodes.length > 0) {
                observer.disconnect();

                const document = mutation.target.ownerDocument;
                const videos = document.getElementsByClassName(KIN_VIDEO_MODULE_CLASS);
                for (const video of videos) {
                    this.connectVideo(video);
                }
                return;
            }
        }
    });

    // (2) -> (3)
    // video에서 quality setting li를 찾을 수 있으면 onVideoQualityFound()를 실행시킨다.
    async connectVideo(video) {
        this.onVideoFound?.(video);
        const ul = video.querySelector('.' + QUALITY_SETTING_UL_CLASS);
        if (ul) {
            if (ul.children.length > 0) {
                this.onVideoQualityFound?.(video);
            } else {
                this.qualitySettingObserver.observe(ul, { childList: true });
            }
        }
    }

    qualitySettingObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.addedNodes.length > 0 &&
                mutation.target.children.length > 0) {
                const video = mutation.target.closest('.' + KIN_VIDEO_MODULE_CLASS);
                return this.onVideoQualityFound?.(video);
            }
        }
    });
}
