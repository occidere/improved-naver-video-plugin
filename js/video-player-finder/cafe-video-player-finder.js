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
        const findNext = getOrObserveChildByClassName; // shorten name

        // #app >> .Article
        findNext(app, 'Article', true, async (article) => {
            this.videoPlayers.length = 0; // reset videoPlayer list

            // .Article >> .article_wrap
            const articleWrap = await findNext(article, 'article_wrap');

            // .article_wrap -> .se-module-video
            const videoModules = articleWrap.querySelectorAll('.se-module-video');
            for (const videoModule of videoModules) {

                // .se-module-video >> .prismplayer-area
                findNext(videoModule, 'prismplayer-area', false, (prismPlayerArea) => {

                    // .prismplayer-area -> .pzp-pc (=> prismPlayer)
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
