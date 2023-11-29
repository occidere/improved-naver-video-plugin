class VideoPlayer extends EventTarget {

    decorated = {}; // { decoratorName: true/false, ... }
    listeners = {}; // { decoratorName: { listener | observer, ... }, ... }
    source = null; // MediaElementAudioSourceNode

    constructor(videoPlayerElement) {
        super();
        this.element = videoPlayerElement;
    }
}
