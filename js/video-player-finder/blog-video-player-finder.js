class BlogVideoPlayerFinder extends VideoPlayerFinder {

    connect(document) {
        const iframe = document.getElementById('mainFrame');
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

        // [document] -> .se-module-video
        const videoModules = document.querySelectorAll('.se-module-video');
        if (videoModules.length == 0) return false;

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
        return true;
    }
}
