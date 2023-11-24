class VideoPlayerFinder {

    async connect(document) {
        throw new Error("Method 'connect()' must be implemented.");
    }

    // onVideoPlayerFound: (videoPlayer: VideoPlayer) => void
    setCallback(onVideoPlayerFound) {
        this.onVideoPlayerFound = onVideoPlayerFound;
    }
}
