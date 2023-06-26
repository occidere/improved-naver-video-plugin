const MAX_QUALITY_IDX = 1;

function init() {
    chrome.storage.sync.get('selectMaxQuality', ({selectMaxQuality}) => {
        if (isCafe()) {
            getIframe().addEventListener('load', () => applyMaxQuality(selectMaxQuality));
        } else if (isBlog()) {
            applyMaxQuality(selectMaxQuality);
        } else {
            console.warn(`Unknown source!`);
        }
    });
}

async function applyMaxQuality(selectMaxQuality) {
    if (selectMaxQuality) {
        const applied = []; // Max quality applied elements
        let [videoCnt, availRetryCnt] = [0, 10];

        // If no video found due to slow loading, retry until availRetryCnt value
        while ((videoCnt === 0 || applied.length < videoCnt) && 0 < availRetryCnt--) {
            const videoPlayerDivs = getIframeDocument().getElementsByClassName(VIDEO_PLAYER_CLASS);
            videoCnt = Math.max(videoCnt, videoPlayerDivs.length); // update video count
            for (const videoPlayerDiv of videoPlayerDivs) {
                try {
                    const ul = videoPlayerDiv.getElementsByClassName(QUALITY_SELECT_UL_CLASS)[0];
                    if (!applied.includes(ul)) {
                        // Change to max quality
                        ul.getElementsByClassName(QUALITY_SELECT_LI_CLASS)[MAX_QUALITY_IDX].click();
                        applied.push(ul);

                        // Show current quality
                        const qualityText = ul.getElementsByClassName(QUALITY_TEXT_CLASS)[MAX_QUALITY_IDX]
                            .textContent
                            .replace(/[^A-Za-z0-9]/g, '')
                            .trim();
                        updateCurrentVideoQualityDisplay(videoPlayerDiv, qualityText);

                        // Add quality change click event listener
                        ul.addEventListener('click', function () {
                            for (const videoPlayerDiv of videoPlayerDivs) {
                                updateCurrentVideoQualityDisplay(videoPlayerDiv);
                            }
                        });
                        console.debug(`${qualityText} selected!`);
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

init();
