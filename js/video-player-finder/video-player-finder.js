class VideoPlayerFinder {

    callback = null;
    videoPlayers = [];

    // return true if connected successfully
    // return false if video player cannot exist
    connect(document) {
        throw new Error("Method 'connect(...)' must be implemented.");
        // '->' means statically loaded
        // '>>' means dynamically loaded
        // loading order can be found by using MutationObserver
    }

    // callback: (VideoPlayer) => void
    applyCallback(callback) {
        this.callback = callback;
        for (const videoPlayer of this.videoPlayers) {
            callback(videoPlayer);
        }
    }
}
