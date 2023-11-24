class CafeVideoPlayerFinder extends VideoPlayerFinder {

    // (1) [page]
    //       iframe#cafe_main
    //         >> [document]
    async connect(document) {
        const iframe = document.querySelector('iframe#cafe_main');
        if (iframe) {
            iframe.addEventListener('load', (event) => {
                this.connectDocument(event.currentTarget.contentDocument);
            });
            if (iframe.contentDocument.readyState === 'complete') {
                this.connectDocument(iframe.contentDocument);
            }
        } else {
            // 인기글을 새 창에서 열면 iframe이 없다.
            this.connectDocument(document);
        }
    }

    // (2) [document]
    //       #app
    //         >> .Article
    connectDocument(document) {
        const app = document.querySelector('#app');
        if (app) {
            this.findArticle(app);
            this.observeApp(app); // 인기글에서 페이지를 이동하면 .Article만 변경된다.
        }
    }

    observeApp(app) {
        new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                if (mutation.addedNodes.length > 0) {
                    if (this.findArticle(mutation.target)) {
                        return; // keep connecting
                    }
                }
            }
        }).observe(app, { childList: true });
    }

    findArticle(app) {
        const article = app.querySelector('.Article');
        if (article) {
            this.connectArticle(article);
            return true;
        }
        return false;
    }

    // (3) .Article
    //       >> .article_wrap
    connectArticle(article) {
        if (!this.findArticleWrap(article)) {
            this.observeArticle(article);
        }
    }

    observeArticle(article) {
        new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.addedNodes.length > 0) {
                    if (this.findArticleWrap(mutation.target)) {
                        return observer.disconnect();
                    }
                }
            }
        }).observe(article, { childList: true });
    }

    findArticleWrap(article) {
        const articleWrap = article.querySelector('.article_wrap');
        if (articleWrap) {
            this.connectArticleWrap(articleWrap);
            return true;
        }
        return false;
    }

    // (4) .article_wrap
    //       .se-module-video
    //         >> .prismplayer-area
    //              .pzp-pc
    connectArticleWrap(articleWrap) {
        const videoModules = articleWrap.querySelectorAll('.se-module-video');
        if (videoModules.length > 0) {
            for (const videoModule of videoModules) {
                if (!this.findPlayer(videoModule)) {
                    this.observeVideoModule(videoModule);
                }
            }
        }
    }

    observeVideoModule(videoModule) {
        new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.addedNodes.length > 0) {
                    if (this.findPlayer(mutation.target)) {
                        return observer.disconnect();
                    }
                }
            }
        }).observe(videoModule, { childList: true });
    }

    findPlayer(videoModule) {
        const player = videoModule.querySelector('.pzp-pc');
        if (player) {
            const prismPlayer = new PrismPlayer(player);
            this.onVideoPlayerFound?.(prismPlayer);
            return true;
        }
        return false;
    }
}
