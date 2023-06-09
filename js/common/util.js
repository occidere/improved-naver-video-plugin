function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getSyncValue(varName) {
    return new Promise(function (resolve, reject) {
            chrome.storage.sync.get(varName, function (res) {
                resolve(res[varName]);
            })
        }
    );
}

function isCafe() {
    return !!document.querySelector(CAFE_IFRAME_SELECTOR);
}

function isBlog() {
    return !!document.querySelector(BLOG_IFRAME_SELECTOR);
}

function getIframe() {
    const [cafeIframe, blogIframe] = [document.querySelector(CAFE_IFRAME_SELECTOR), document.querySelector(BLOG_IFRAME_SELECTOR)];
    return (cafeIframe ? cafeIframe : (blogIframe ? blogIframe : undefined));
}

function getIframeDocument() {
    const iframe = getIframe();
    return iframe ? iframe.contentWindow.document : document;
}
