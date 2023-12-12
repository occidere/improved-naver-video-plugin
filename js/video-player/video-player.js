class VideoPlayer extends EventTarget {

    decorated = {}; // { [decoratorName]: true/false, ... }
    listeners = {}; // { [decoratorName]: { listener | observer, ... }, ... }

    constructor(videoPlayerElement) {
        super();
        this.element = videoPlayerElement;
    }

    attachListeners(decorator, listeners) {
        this.listeners[decorator.constructor.name] = listeners;
    }

    getAttachedListeners(decorator) {
        return this.listeners[decorator.constructor.name];
    }

    detachListeners(decorator) {
        delete this.listeners[decorator.constructor.name];
    }
}
