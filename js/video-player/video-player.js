class VideoPlayer {

    decorated = {}; // { decoratorName: true/false, ... }
    listeners = {}; // { decoratorName: { listener, ... }, ... }
    observers = {}; // { decoratorName: { observer, ... }, ... }

    constructor(videoPlayerElement) {
        this.element = videoPlayerElement;
    }
}
