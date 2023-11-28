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
    }
}
