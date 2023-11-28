class VideoPlayerFinder {

    // return: VideoPlayerFinder | null (video player cannot exist)
    static create(document) {
        throw new Error("Static method 'create(...)' must be implemented.");
    }

    callback = null;
    videoPlayers = [];

    // callback: (VideoPlayer) => void
    applyCallback(callback) {
        this.callback = callback;
        for (const videoPlayer of this.videoPlayers) {
            callback(videoPlayer);
        }
    }
}
