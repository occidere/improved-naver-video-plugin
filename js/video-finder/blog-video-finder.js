/*
[blog.naver.com 로딩 순서]

(1) html
      iframe#mainFrame
        #document >>

(2) #document
      div.se-module-video >>

(3) div.se-module-video
      div.prismplayer-area (video)
        div.pzp-pc__video
          video
        div.pzp-pc__setting-quality-pane
          ul.pzp-pc-setting-quality-pane__list-container >>

(4) ul.pzp-pc-setting-quality-pane__list-container
      li.pzp-pc-ui-setting-quality-item
*/
class BlogVideoFinder extends VideoFinder {

    // (1) -> (2)
    // document의 변경이 일어났을 때 connectDocument()가 실행되도록 한다.
    async connect(document) {
        const iframe = document.getElementById(BLOG_IFRAME_ID);
        if (iframe) {
            iframe.addEventListener('load', (event) => {
                this.connectDocument(event.target.contentDocument);
            });
            if (iframe.contentDocument.readyState === 'complete') {
                this.connectDocument(iframe.contentDocument);
            }
        } else {
            this.connectDocument(document);
        }
    }

    // (2) -> (3)
    // document에서 video를 찾아 connectVideo()가 실행되도록 한다.
    connectDocument(document) {
        this.videoObserver.disconnect();
        this.qualitySettingObserver.disconnect();

        const videos = document.getElementsByClassName(VIDEO_PLAYER_CLASS);
        for (const video of videos) {
            this.connectVideo(video);
        }
        if (videos.length == 0) {
            this.videoObserver.observe(document.body, { subtree: true, childList: true });
        }
    }

    videoObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.classList.contains(VIDEO_MODULE_CLASS) &&
                mutation.addedNodes.length > 0) {
                observer.disconnect();

                const document = mutation.target.ownerDocument;
                const videos = document.getElementsByClassName(VIDEO_PLAYER_CLASS);
                for (const video of videos) {
                    this.connectVideo(video);
                }
                return;
            }
        }
    });

    // (3) -> (4)
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
                const video = mutation.target.closest('.' + VIDEO_PLAYER_CLASS);
                return this.onVideoQualityFound?.(video);
            }
        }
    });
}
