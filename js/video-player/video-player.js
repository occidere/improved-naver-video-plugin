class VideoPlayer extends EventTarget {

    decorated = {}; // { decoratorName: true/false, ... }
    listeners = {}; // { decoratorName: { listener | observer, ... }, ... }

    constructor(videoPlayerElement) {
        super();
        this.element = videoPlayerElement;
    }
}
