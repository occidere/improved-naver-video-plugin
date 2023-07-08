class Decorator {

    async isEnabled() {
        throw new Error("Method 'isEnabled()' must be implemented.");
    }

    async decorate(videoPlayerElement) {
        throw new Error("Method 'decorate(...)' must be implemented.");
    }
}