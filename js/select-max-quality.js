const QUALITY_SELECT_UL_CLASS = 'pzp-pc-setting-quality-pane__list-container';
const QUALITY_SELECT_LI_CLASS = 'pzp-pc-ui-setting-quality-item pzp-pc-ui-setting-item';
const QUALITY_TEXT_CLASS = 'pzp-pc-ui-setting-quality-item__prefix';
const MAX_QUALITY_IDX = 1;
const CAFE_IFRAME_SELECTOR = 'iframe#cafe_main';
const BLOG_IFRAME_SELECTOR = 'iframe#mainFrame';

function init() {
    chrome.storage.sync.get('selectMaxQuality', ({selectMaxQuality}) => {
        const cafeIframe = document.querySelector(CAFE_IFRAME_SELECTOR);
        if (cafeIframe) {
            cafeIframe.addEventListener('load', () => applyMaxQuality(selectMaxQuality));
        } else {
            applyMaxQuality(selectMaxQuality);
        }
    });
}

async function applyMaxQuality(selectMaxQuality) {
    if (selectMaxQuality) {
        const applied = []; // Max quality applied elements
        let [videoCnt, availRetryCnt] = [0, 10];

        // If no video found due to slow loading, retry until availRetryCnt value
        while ((videoCnt === 0 || applied.length < videoCnt) && 0 < availRetryCnt--) {
            const [cafeIframe, blogIframe] = [document.querySelector(CAFE_IFRAME_SELECTOR), document.querySelector(BLOG_IFRAME_SELECTOR)];
            const qualitySelectUls = (cafeIframe ? cafeIframe.contentWindow.document :
                    (blogIframe ? blogIframe.contentWindow.document : document)
            ).getElementsByClassName(QUALITY_SELECT_UL_CLASS);
            videoCnt = Math.max(videoCnt, qualitySelectUls.length); // update video count
            for (const ul of qualitySelectUls) {
                try {
                    if (!applied.includes(ul)) {
                        ul.getElementsByClassName(QUALITY_SELECT_LI_CLASS)[MAX_QUALITY_IDX].click();
                        applied.push(ul);
                        console.debug(`${ul.getElementsByClassName(QUALITY_TEXT_CLASS)[MAX_QUALITY_IDX].textContent.trim()} selected!`);
                    }
                } catch (e) {
                    console.warn(`Failed click max quality: ${e}`); // Mostly due to slow loading
                }
            }
            console.debug(`Video count: ${videoCnt}, applied count: ${applied.length}`);
            await sleep(1000);
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

init();
