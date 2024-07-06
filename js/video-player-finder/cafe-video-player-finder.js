class CafeVideoPlayerFinder extends VideoPlayerFinder {

    connect(document) {
        const iframe = document.getElementById('cafe_main');
        if (iframe) {
            iframe.addEventListener('load', (event) => {
                this.connectDocument(event.target.contentDocument);
            });
            if (iframe.contentDocument.readyState === 'complete') {
                this.connectDocument(iframe.contentDocument);
            }
        } else {
            return this.connectDocument(document);
        }
        return true;
    }

    connectDocument(document) {
        const findNext = getOrObserveChildByClassName;

        // [document] -> #app
        const app = document.querySelector('#app');
        if (!app) return false;

        // #app >> .Article
        findNext(app, 'Article', async (article) => {
            this.videoPlayers.length = 0; // reset videoPlayer list

            // .Article >> .article_wrap -> .se-module-video
            const articleWrap = await findNext(article, 'article_wrap');
            const videoModules = articleWrap.querySelectorAll('.se-module-video');

            // .se-module-video >> .prismplayer-area -> .pzp-pc (=> prismPlayer)
            for (const videoModule of videoModules) {
                findNext(videoModule, 'prismplayer-area').then((prismPlayerArea) => {
                    const pzpPc = prismPlayerArea.querySelector('.pzp-pc');
                    if (pzpPc) {
                        const prismPlayer = new PrismPlayer(pzpPc);
                        this.callback?.(prismPlayer);
                        this.videoPlayers.push(prismPlayer);
                    }
                });
            }
        });
        return true;
    }
}
