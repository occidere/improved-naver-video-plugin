function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// parent: Element
// callback?: (child: Element) => void
// return: Promise<child: Element> | void
function getOrObserveChildByClassName(parent, className, callback) {
    if (callback) {
        return run(callback);
    }
    return new Promise((resolve) => run(resolve));

    function run(caller) {
        const findChild = () => {
            let foundChild;
            for (const child of parent.children) {
                if (child.classList.contains(className)) {
                    foundChild = child;
                    break;
                }
            }
            if (foundChild) {
                caller(foundChild);
            }
            return foundChild;
        }
        if (!findChild() || callback) {
            new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    for (const node of mutation.addedNodes) {
                        if (node.classList?.contains(className)) {
                            // .className is added
                            if (findChild()) {
                                if (!callback) {
                                    // end observing
                                    observer.disconnect();
                                }
                                // end loop
                                return;
                            }
                        }
                    }
                }
            }).observe(parent, { childList: true });
        }
    };
}
}
