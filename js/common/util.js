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

class ClassChangeObserver extends MutationObserver {

    static options = { attributeOldValue: true, attributeFilter: ['class'] };

    // callback: (appeared: boolean, target: Element, observer) => void
    constructor(className, callback) {
        super((mutationList, observer) => {
            for (const mutation of mutationList) {
                const existed = mutation.oldValue.includes(className);
                const exist = mutation.target.classList.contains(className);
                if (existed != exist) {
                    callback(exist, mutation.target, observer);
                }
            }
        });
    }

    observe(target) {
        super.observe(target, ClassChangeObserver.options);
    }
}

class TextChangeObserver extends MutationObserver {

    static options = { characterData: true };

    // callback: (changedText: string, target: Element) => void
    constructor(callback) {
        super((mutationList) => {
            for (const mutation of mutationList) {
                const textNode = mutation.target;
                callback(textNode.textContent, textNode.parentElement);
            }
        });
    }

    // target: Element whose first child is TEXT_NODE
    observe(target) {
        const textNode = target.firstChild;
        if (textNode?.nodeType !== Node.TEXT_NODE) {
            return;
        }
        super.observe(textNode, TextChangeObserver.options);
    }
}
