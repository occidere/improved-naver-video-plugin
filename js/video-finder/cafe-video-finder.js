/*
[cafe.naver.com 로딩 순서]

(1) html
      iframe#cafe_main
        #document >>

(2) #document
      div#app >>

(3) div#app
      div.Article
        div.se-module-video >>

(4) div.se-module-video
      div.prismplayer-area (video)
        div.pzp-pc__video
          video
        div.pzp-pc__setting-quality-pane
          ul.pzp-pc-setting-quality-pane__list-container >>

(5) ul.pzp-pc-setting-quality-pane__list-container
      li.pzp-pc-ui-setting-quality-item
*/
class CafeVideoFinder extends VideoFinder {

    // (1) -> (2)
    // document의 변경이 일어났을 때 connectDocument()가 실행되도록 한다.
    async connect(document) {
        const iframe = document.getElementById(CAFE_IFRAME_ID);
        if (iframe) {
            iframe.addEventListener('load', (event) => {
                this.connectDocument(event.target.contentDocument);
            });
            if (iframe.contentDocument.readyState === 'complete') {
                this.connectDocument(iframe.contentDocument);
            }
        } else {
            // 인기글을 새 창에서 열면 iframe이 없다.
            this.connectDocument(document);
        }
    }

    // (2) -> (3)
    // article의 변경이 일어났을 때 connectArticle()이 실행되도록 한다.
    connectDocument(document) {
        this.articleObserver.disconnect();

        // 게시글은 app > article 형식이다.
        const app = document.getElementById(CAFE_APP_ID);
        if (app) {
            // 인기글에서 페이지를 이동하면 article만 변경되므로 이를 감지한다.
            this.articleObserver.observe(app, { childList: true });
            const article = app.querySelector('.' + CAFE_ARTICLE_CLASS);
            if (article) {
                this.connectArticle(article);
            }
        }
    }

    articleObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.addedNodes.length > 0) {
                const article = mutation.target.querySelector('.' + CAFE_ARTICLE_CLASS);
                if (article) {
                    return this.connectArticle(article);
                }
            }
        }
    });

    // (3) -> (4)
    // article에서 video를 찾아 connectVideo()가 실행되도록 한다.
    connectArticle(article) {
        this.videoObserver.disconnect();
        this.qualitySettingObserver.disconnect();

        const videos = article.getElementsByClassName(VIDEO_PLAYER_CLASS);
        for (const video of videos) {
            this.connectVideo(video);
        }
        if (videos.length == 0) {
            this.videoObserver.observe(article, { subtree: true, childList: true });
        }
    }

    videoObserver = new MutationObserver((mutationList, observer) => {
        for (const mutation of mutationList) {
            if (mutation.target.classList.contains(VIDEO_MODULE_CLASS) &&
                mutation.addedNodes.length > 0) {
                observer.disconnect();

                const article = mutation.target.closest('.' + CAFE_ARTICLE_CLASS);
                const videos = article.getElementsByClassName(VIDEO_PLAYER_CLASS);
                for (const video of videos) {
                    this.connectVideo(video);
                }
                return;
            }
        }
    });

    // (4) -> (5)
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
