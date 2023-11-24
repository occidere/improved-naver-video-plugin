class BlogVideoPlayerFinder extends VideoPlayerFinder {

    // (1) [page]
    //       iframe#mainFrame
    //         >> [document]
    async connect(document) {
        const iframe = document.querySelector('iframe#mainFrame');
        if (iframe) {
            iframe.addEventListener('load', (event) => {
                this.connectDocument(event.currentTarget.contentDocument);
            });
            if (iframe.contentDocument.readyState === 'complete') {
                this.connectDocument(iframe.contentDocument);
            }
        } else {
            this.connectDocument(document);
        }
    }

    // (2) [document]
    //       .se-module-video
    //         >> .prismplayer-area
    //              .pzp-pc
    connectDocument(document) {
        const videoModules = document.querySelectorAll('.se-module-video');
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
