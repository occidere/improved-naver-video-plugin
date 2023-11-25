class PrismPlayer extends VideoPlayer {

    static getQualitySettingItemText = (li) => li.querySelector('span.' + QUALITY_SETTING_ITEM_TEXT_CLASS);
    static getQualitySettingItemText = (li) => li.querySelector('span.' + QUALITY_SETTING_ITEM_TEXT_CLASS);
    static getPlaybackRateSettingItemText = (li) => li.querySelector('span.' + PLAYBACK_RATE_SETTING_ITEM_TEXT_CLASS);

    static isSettingItemChecked = (li) => li.classList.contains(CHECKED_SETTING_ITEM_CLASS);

    isQualitySettingPaneVisible = () => this.element.classList.contains(PLAYER_QUALITY_SETTING_PANE_VISIBLE_CLASS);
    isPlaybackRateSettingPaneVisible = () => this.element.classList.contains(PLAYER_PLAYBACK_RATE_SETTING_PANE_VISIBLE_CLASS);
    isVolumeControlActive = () => this.element.classList.contains(PLAYER_VOLUME_CONTROL_ACTIVE_CLASS);
    isVideoBeforePlay = () => this.element.classList.contains(VIDEO_BEFORE_PLAY_CLASS);
    isVideoPlaying = () => this.element.classList.contains(VIDEO_PLAYING_CLASS);
    isVideoEnded = () => this.element.classList.contains(VIDEO_ENDED_CLASS);
    isVideoLoading = () => this.element.classList.contains(VIDEO_LOADING_CLASS);

    getVideo = () => this.element.querySelector('video');
    getDim = () => this.element.querySelector('.' + PLAYER_DIM_CLASS);
    getHeader = () => this.element.querySelector('.' + PLAYER_HEADER_CLASS);
    getPlayButton = () => this.element.querySelector('button.' + PLAYER_PLAY_BUTTON_CLASS);
    getBottom = () => this.element.querySelector('.' + PLAYER_BOTTOM_CLASS);
    getPlayPauseButton = () => this.element.querySelector('button.' + PLAYER_PLAY_PAUSE_BUTTON_CLASS);
    getVolumeButton = () => this.element.querySelector('button.' + PLAYER_VOLUME_BUTTON_CLASS);
    getVolumeSlider = () => this.element.querySelector('.' + PLAYER_VOLUME_SLIDER_CLASS);
    getBottomRightButtons = () => this.element.querySelector('.' + PLAYER_BOTTOM_RIGHT_BUTTONS_CLASS);
    getSettingButton = () => this.element.querySelector('button.' + PLAYER_SETTING_BUTTON_CLASS);
    getFullScreenButton = () => this.element.querySelector('button.' + PLAYER_FULL_SCREEN_BUTTON_CLASS);

    getQualitySettingMenu = () => this.element.querySelector('.' + QUALITY_SETTING_MENU_CLASS);
    getQualityDisplay = () => this.element.querySelector('.' + APP_QUALITY_DISPLAY_CLASS);

    getPlaybackRateSettingMenu = () => this.element.querySelector('.' + PLAYBACK_RATE_SETTING_MENU_CLASS);
    getPlaybackRateSettingItems = () => this.element.querySelectorAll('li.' + PLAYBACK_RATE_SETTING_ITEM_CLASS);
    getPlaybackRateDisplay = () => this.element.querySelector('.' + APP_PLAYBACK_RATE_DISPLAY_CLASS);

    // onQualitySettingItemsFound: (lis: NodeList) => void
    getQualitySettingItems(onQualitySettingItemsFound) {
        const ul = this.element.querySelector('ul.' + QUALITY_SETTING_LIST_CLASS);
        if (ul) {
            if (!findQualitySettingItems(ul)) {
                observeQualitySettingList(ul);
            }
        }

        function observeQualitySettingList(ul) {
            new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.addedNodes.length > 0) {
                        if (findQualitySettingItems(mutation.target)) {
                            return observer.disconnect();
                        }
                    }
                }
            }).observe(ul, { childList: true });
        }

        function findQualitySettingItems(ul) {
            const lis = ul.querySelectorAll('li.' + QUALITY_SETTING_ITEM_CLASS);
            if (lis.length > 0) {
                onQualitySettingItemsFound(lis);
                return true;
            }
            return false;
        }
    }

    isFirstPrismPlayer() {
        const document = this.element.ownerDocument;
        const firstPlayer = document.querySelector('.' + PRISM_PLAYER_CLASS);
        return this.element === firstPlayer;
    }
}

/*
[cafe.naver.com], [blog.naver.com]
.se-module-video
  .prismplayer-area
    [prism-player]

[prism-player]
.pzp-pc                                                     (PRISM_PLAYER_CLASS)
  .pzp-pc__video
    .webplayer-internal-core-shadow
      .webplayer-internal-core-source-container
        .webplayer-internal-source-shadow
          .webplayer-internal-source-wrapper
            video.webplayer-internal-video                  (video)
  .pzp-pc__dimmed                                           (PLAYER_DIM_CLASS)
  .pzp-pc__header                                           (PLAYER_HEADER_CLASS)
  button.pzp-pc__brand-playback-button                      (PLAYER_PLAY_BUTTON_CLASS)
  .pzp-pc__buttom                                           (PLAYER_BOTTOM_CLASS)
    .pzp-pc__bottom-buttons
      .pzp-pc__bottom-buttons-left
        button.pzp-pc__playback-switch                      (PLAYER_PLAY_PAUSE_BUTTON_CLASS)
        .pzp-pc__volume-control
          button.pzp-pc__volume-button                      (PLAYER_VOLUME_BUTTON_CLASS)
          .pzp-pc__volume-slider                            (PLAYER_VOLUME_SLIDER_CLASS)
      .pzp-pc__bottom-buttons-right                         (PLAYER_BOTTOM_RIGHT_BUTTONS_CLASS)
        button.pzp-pc__setting-button                       (PLAYER_SETTING_BUTTON_CLASS)
        button.pzp-pc__fullscreen-button                    (PLAYER_FULL_SCREEN_BUTTON_CLASS)
  .pzp-pc__settings
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-quality                (QUALITY_SETTING_MENU_CLASS)
      .pzp-pc-ui-setting-intro-panel__left
        span.pzp-pc-ui-setting-intro-panel__name
          "해상도"
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-subtitle
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-playbackrate           (PLAYBACK_RATE_SETTING_MENU_CLASS)
      .pzp-pc-ui-setting-intro-panel__left
        span.pzp-pc-ui-setting-intro-panel__name
          "재생 속도"
  .pzp-pc__setting-quality-pane
    .pzp-pc-setting-quality-pane
      .pzp-pc-setting-quality-pane__list
        ul.pzp-pc-setting-quality-pane__list-container                          (QUALITY_SETTING_LIST_CLASS)
          (이하는 동적으로 로딩됨)
          li.pzp-pc-ui-setting-quality-item                                     (QUALITY_SETTING_ITEM_CLASS)
          li.pzp-pc-ui-setting-quality-item .pzp-pc-ui-setting-item--checked    (CHECKED_SETTING_ITEM_CLASS)
          li.pzp-pc-ui-setting-quality-item
          li.pzp-pc-ui-setting-quality-item
          li.pzp-pc-ui-setting-quality-item
            .pzp-pc-ui-setting-item__slot
              .pzp-pc-ui-setting-quality-item__left
                span.pzp-pc-ui-setting-quality-item__prefix                     (QUALITY_SETTING_ITEM_TEXT_CLASS)
  .pzp-pc__setting-playbackrate-pane
    .pzp-pc-setting-playbackrate-pane
      (아래 두 클래스의 이름이 화질 설정의 경우와 반대임에 유의)
      .pzp-pc-setting-playbackrate-pane__list-container
        ul.pzp-pc-setting-playbackrate-pane__list                               (PLAYBACK_RATE_SETTING_LIST_CLASS)
          li.pzp-pc-ui-setting-playbackrate-item                                (PLAYBACK_RATE_SETTING_ITEM_CLASS)
          li.pzp-pc-ui-setting-playbackrate-item
          li.pzp-pc-ui-setting-playbackrate-item .pzp-pc-ui-setting-item--checked
          li.pzp-pc-ui-setting-playbackrate-item
          li.pzp-pc-ui-setting-playbackrate-item
            .pzp-pc-ui-setting-item__slot
              span.pzp-pc-ui-setting-playbackrate-item__value                   (PLAYBACK_RATE_SETTING_ITEM_TEXT_CLASS)
*/
