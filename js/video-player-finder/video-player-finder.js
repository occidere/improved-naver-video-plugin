class VideoPlayerFinder {
    // (document: HTMLDocument) => VideoPlayerFinder | null
    // return null if video player cannot exist in the document
    static create(document) {
        throw new Error("Static method 'create()' must be implemented.");
    }

    videoPlayers = [];

    // callback: (videoPlayer: VideoPlayer) => void
    applyCallback(callback) {
        this.callback = callback;
        for (const videoPlayer of this.videoPlayers) {
            callback(videoPlayer);
        }
    }
}
