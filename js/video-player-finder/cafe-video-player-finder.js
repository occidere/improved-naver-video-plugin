class CafeVideoPlayerFinder extends VideoPlayerFinder {

    static create(document) {
        // [document] -> #app
        const app = document.querySelector('#app');
        if (!app) {
            return null;
        }
        return new this(app);
    }

    constructor(app) {
        super();
        const findNext = getOrObserveChildByClassName;

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
    }
}
