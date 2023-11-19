class VideoFinder {

    // callback: (video) => void
    setCallbacks({ onVideoFound, onVideoQualityFound } = {}) {
        this.onVideoFound = onVideoFound;
        this.onVideoQualityFound = onVideoQualityFound;
    }

    async connect(document) {
        throw new Error(`Method 'connect()' must be implemented.`);
    }
}
