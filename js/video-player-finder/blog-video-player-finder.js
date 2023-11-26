class BlogVideoPlayerFinder extends VideoPlayerFinder {

    static create(document) {
        // [document] -> .se-module-video
        const videoModules = document.querySelectorAll('.se-module-video');
        if (videoModules.length == 0) {
            return null;
        }
        return new this(videoModules);
    }

    constructor(videoModules) {
        super();
        const findNext = getOrObserveChildByClassName; // shorten name

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
    }
}
