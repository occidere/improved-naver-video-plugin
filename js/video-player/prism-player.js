class PrismPlayer extends VideoPlayer {

    static elementSelectors = {
        video: 'video',
        dim: '.pzp-pc__dimmed',
        header: '.pzp-pc__header',
        playButton: 'button.pzp-pc__brand-playback-button',
        durationIndicator: '.pzp-pc__duration-indicator',
        bottom: '.pzp-pc__bottom',
        bottomButtons: '.pzp-pc__bottom-buttons',
        playPauseButton: 'button.pzp-pc__playback-switch',
        volumeControl: '.pzp-pc__volume-control',
        volumeButton: 'button.pzp-pc__volume-button',
        volumeSlider: '.pzp-pc__volume-slider',
        bottomRightButtons: '.pzp-pc__bottom-buttons-right',
        settingButton: 'button.pzp-pc__setting-button',
        fullScreenButton: 'button.pzp-pc__fullscreen-button',
        qualitySettingMenu: '.pzp-setting-intro-quality',
        playbackRateSettingMenu: '.pzp-setting-intro-playbackrate',
    };
    static elementsSelectors = {
        playbackRateSettingItems: 'li.pzp-ui-setting-playbackrate-item',
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
    source = null; // MediaElementAudioSourceNode

    _maxVolume = 1.0;

    constructor(videoPlayerElement) {
        super(videoPlayerElement);

        // initialize maxVolume
        const onFirstLoaded = () => {
            this.loaded = true;
            this._maxVolume = this.query('video').volume;
        };

        // initialize crossOrigin
        const onSrcLoaded = () => {
            const video = this.query('video');
            const srcUrl = new URL(video.src);
            if (srcUrl.origin !== location.origin) {
                video.crossOrigin = 'anonymous';
            }
        };

        // observing should be before first loading of video
        new ClassChangeObserver(PrismPlayer.playerStateClassNames['loading'],
            (appeared, _, observer) => {
                if (!appeared) {
                    observer.disconnect();
                    onFirstLoaded();
                    this.dispatchEvent(new Event('firstloaded'));
                }
            }).observe(this.element);

        new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.target.src) {
                    observer.disconnect();
                    onSrcLoaded();
                }
            }
        }).observe(this.query('video'), { attributeFilter: ['src'] });
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
        const QUALITY_SETTING_ITEM_CLASS = 'pzp-ui-setting-quality-item';
        const lis = this.element.querySelectorAll('li.' + QUALITY_SETTING_ITEM_CLASS);
        if (lis.length > 0) {
            return lis;
        }

        const ul = this.element.querySelector('ul.pzp-setting-quality-pane__list');
        await getOrObserveChildByClassName(ul, QUALITY_SETTING_ITEM_CLASS); // wait until items are loaded
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
  .pzp-pc__duration-indicator                                                   'durationIndicator'
  .pzp-pc__buttom                                                               'bottom'
    .pzp-pc__bottom-buttons                                                     'bottomButtons'
      .pzp-pc__bottom-buttons-left
        button.pzp-pc__playback-switch                                          'playPauseButton'
        .pzp-pc__volume-control                                                 'volumeControl'
          button.pzp-pc__volume-button                                          'volumeButton'
          .pzp-pc__volume-slider                                                'volumeSlider'
      .pzp-pc__bottom-buttons-right                                             'bottomRightButtons'
        button.pzp-pc__setting-button                                           'settingButton'
        button.pzp-pc__fullscreen-button                                        'fullScreenButton'
  .pzp-pc__settings
    .pzp-ui-setting-home-item .pzp-setting-intro-quality                        'qualitySettingMenu'
      .pzp-ui-setting-home-item__left
        span.pzp-ui-setting-home-item__name
          "해상도"
    .pzp-ui-setting-home-item .pzp-setting-intro-subtitle
    .pzp-ui-setting-home-item .pzp-setting-intro-playbackrate                   'playbackRateSettingMenu'
      .pzp-ui-setting-home-item__left
        span.pzp-ui-setting-home-item__name
          "재생 속도"
      .pzp-ui-setting-home-item__right
        span.pzp-ui-setting-home-item__value (SETTING_MENU_VALUE_SPAN)
          "1.0x (기본)"
  .pzp-pc__setting-quality-pane
    .pzp-setting-quality-pane__list-container
      ul.pzp-setting-quality-pane__list
        (이하는 동적으로 로딩됨)
        li.pzp-ui-setting-quality-item (QUALITY_SETTING_ITEM_CLASS)             getQualitySettingItems()
        li.pzp-ui-setting-quality-item .pzp-ui-setting-pane-item--checked (CHECKED_SETTING_ITEM)
        li.pzp-ui-setting-quality-item
        li.pzp-ui-setting-quality-item
        li.pzp-ui-setting-quality-item
          .pzp-ui-setting-pane-item__slot
            span.pzp-ui-setting-pane-item__value
              .pzp-ui-setting-quality-item__left
                span.pzp-ui-setting-quality-item__prefix (QUALITY_SETTING_ITEM_SPAN)
  .pzp-pc__setting-playbackrate-pane
    .pzp-setting-playbackrate-pane__list-container
      ul.pzp-setting-playbackrate-pane__list
        li.pzp-ui-setting-playbackrate-item                                    'playbackRateSettingItems'
        li.pzp-ui-setting-playbackrate-item
        li.pzp-ui-setting-playbackrate-item .pzp-ui-setting-pane-item--checked
        li.pzp-ui-setting-playbackrate-item
        li.pzp-ui-setting-playbackrate-item
          .pzp-ui-setting-item__slot
            span.pzp-ui-setting-pane-item__value
              span.pzp-ui-setting-playbackrate-item__value (PLAYBACK_RATE_SETTING_ITEM_SPAN)
*/
