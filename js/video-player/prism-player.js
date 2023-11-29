class PrismPlayer extends VideoPlayer {

    static elementSelectors = {
        video: 'video',
        dim: '.pzp-pc__dimmed',
        header: '.pzp-pc__header',
        playButton: 'button.pzp-pc__brand-playback-button', // center play button
        bottom: '.pzp-pc__bottom',
        playPauseButton: 'button.pzp-pc__playback-switch',
        volumeButton: 'button.pzp-pc__volume-button',
        volumeSlider: '.pzp-pc__volume-slider',
        bottomRightButtons: '.pzp-pc__bottom-buttons-right',
        settingButton: 'button.pzp-pc__setting-button',
        fullScreenButton: 'button.pzp-pc__fullscreen-button',
        qualitySettingMenu: '.pzp-pc-setting-intro-quality',
        playbackRateSettingMenu: '.pzp-pc-setting-intro-playbackrate',
    };
    static elementsSelectors = {
        playbackRateSettingItems: 'li.pzp-pc-ui-setting-playbackrate-item',
    };
    static playerStateClassNames = {
        qualitySettingPaneVisible: 'pzp-pc--setting-quality',
        playbackRateSettingPaneVisible: 'pzp-pc--setting-playbackrate',
        volumeControlActive: 'pzp-pc--active-volume-control',
        beforePlay: 'pzp-pc--beforeplay',
        playing: 'pzp-pc--playing',
        ended: 'pzp-pc--ended',
        loading: 'pzp-pc--loading',
    };

    loaded = false;

    _maxVolume = 1.0;

    constructor(videoPlayerElement) {
        super(videoPlayerElement);
        const onFirstLoaded = () => {
            const video = this.query('video');
            this._maxVolume = video.volume;
        };

        // this code should be run before first loading of video
        this.addEventListener('firstloaded', onFirstLoaded, { once: true });
        const loadingObserver = new ClassChangeObserver(PrismPlayer.playerStateClassNames['loading'],
            (appeared, _, observer) => {
                if (!appeared) {
                    observer.disconnect();
                    this.loaded = true;
                    this.dispatchEvent(new Event('firstloaded'));
                }
            });
        loadingObserver.observe(this.element);
    }

    query(key) {
        return this.element.querySelector(PrismPlayer.elementSelectors[key]);
    }
    queryAll(key) {
        return this.element.querySelectorAll(PrismPlayer.elementsSelectors[key]);
    }
    isState(key) {
        return this.element.classList.contains(PrismPlayer.playerStateClassNames[key]);
    }

    getMaxVolume() {
        if (this.loaded) {
            return Promise.resolve(this._maxVolume);
        }
        return new Promise((resolve) => {
            this.addEventListener('firstloaded', () => {
                resolve(this._maxVolume);
            }, { once: true });
        });
    }

    isFirstPrismPlayer() {
        const document = this.element.ownerDocument;
        const firstPlayer = document.querySelector('.pzp-pc');
        return this.element === firstPlayer;
    }

    // ul.pzp-pc-setting-quality-pane__list-container
    //   >> li.pzp-pc-ui-setting-quality-item
    async getQualitySettingItems() {
        const QUALITY_SETTING_ITEM_CLASS = 'pzp-pc-ui-setting-quality-item';
        const lis = this.element.querySelectorAll('li.' + QUALITY_SETTING_ITEM_CLASS);
        if (lis.length > 0) return lis;

        const QUALITY_SETTING_LIST_SELECTOR = 'ul.pzp-pc-setting-quality-pane__list-container';
        const ul = this.element.querySelector(QUALITY_SETTING_LIST_SELECTOR);
        await getOrObserveChildByClassName(ul, QUALITY_SETTING_ITEM_CLASS);
        return ul.querySelectorAll('li.' + QUALITY_SETTING_ITEM_CLASS);
    }
}

/*
[cafe.naver.com], [blog.naver.com]
.se-module-video
  .prismplayer-area
    [prism-player]

[prism-player]
.pzp-pc
  .pzp-pc__video
    .webplayer-internal-core-shadow
      .webplayer-internal-core-source-container
        .webplayer-internal-source-shadow
          .webplayer-internal-source-wrapper
            video.webplayer-internal-video                                      'video'
  .pzp-pc__dimmed                                                               'dim'
  .pzp-pc__header                                                               'header'
  button.pzp-pc__brand-playback-button                                          'playButton'
  .pzp-pc__buttom                                                               'bottom'
    .pzp-pc__bottom-buttons
      .pzp-pc__bottom-buttons-left
        button.pzp-pc__playback-switch                                          'playPauseButton'
          button.pzp-pc__volume-button                                          'volumeButton'
          .pzp-pc__volume-slider                                                'volumeSlider'
          .pzp-pc__bottom-buttons-right                                         'bottomRightButtons'
        button.pzp-pc__setting-button                                           'settingButton'
        button.pzp-pc__fullscreen-button                                        'fullScreenButton'
  .pzp-pc__settings
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-quality                'qualitySettingMenu'
      .pzp-pc-ui-setting-intro-panel__left
        span.pzp-pc-ui-setting-intro-panel__name
          "해상도"
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-subtitle
    .pzp-pc-ui-setting-intro-panel .pzp-pc-setting-intro-playbackrate           'playbackRateSettingMenu'
      .pzp-pc-ui-setting-intro-panel__left
        span.pzp-pc-ui-setting-intro-panel__name
          "재생 속도"
  .pzp-pc__setting-quality-pane
    .pzp-pc-setting-quality-pane
      .pzp-pc-setting-quality-pane__list
        ul.pzp-pc-setting-quality-pane__list-container
          (이하는 동적으로 로딩됨)
          li.pzp-pc-ui-setting-quality-item                                     getQualitySettingItems()
          li.pzp-pc-ui-setting-quality-item .pzp-pc-ui-setting-item--checked
          li.pzp-pc-ui-setting-quality-item             CHECKED_SETTING_ITEM
          li.pzp-pc-ui-setting-quality-item
          li.pzp-pc-ui-setting-quality-item
            .pzp-pc-ui-setting-item__slot
              .pzp-pc-ui-setting-quality-item__left
                span.pzp-pc-ui-setting-quality-item__prefix                     QUALITY_SETTING_ITEM_SPAN
  .pzp-pc__setting-playbackrate-pane
    .pzp-pc-setting-playbackrate-pane
      (아래 두 클래스의 이름이 화질 설정의 경우와 반대임에 유의)
      .pzp-pc-setting-playbackrate-pane__list-container
        ul.pzp-pc-setting-playbackrate-pane__list
          li.pzp-pc-ui-setting-playbackrate-item                                'playbackRateSettingItems'
          li.pzp-pc-ui-setting-playbackrate-item
          li.pzp-pc-ui-setting-playbackrate-item .pzp-pc-ui-setting-item--checked
          li.pzp-pc-ui-setting-playbackrate-item             CHECKED_SETTING_ITEM
          li.pzp-pc-ui-setting-playbackrate-item
            .pzp-pc-ui-setting-item__slot
              span.pzp-pc-ui-setting-playbackrate-item__value                   PLAYBACK_RATE_SETTING_ITEM_SPAN
*/
