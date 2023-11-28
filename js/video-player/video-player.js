class VideoPlayer extends EventTarget {

    decorated = {}; // { decoratorName: true/false, ... }
    listeners = {}; // { decoratorName: { listener, ... }, ... }
    observers = {}; // { decoratorName: { observer, ... }, ... }

    constructor(videoPlayerElement) {
        super();
        this.element = videoPlayerElement;
    }
}
