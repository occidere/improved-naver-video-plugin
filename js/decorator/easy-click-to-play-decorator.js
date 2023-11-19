// 기존: play 버튼을 눌러야 재생됨, 로딩 중에는 클릭이 무시됨
// 적용시: 로딩중이더라도 video 아무 곳이나 클릭했을 때 재생이 시작됨
class EasyClickToPlayDecorator extends Decorator {

    playPauseVideo = (event) => {
        const video = getClosestVideo(event.currentTarget);
        const videoMedia = video.querySelector('video');
        if (videoMedia?.paused && video.querySelector('.' + VIDEO_BEFORE_PLAY_CLASS)) {
            videoMedia.autoplay = true;
            videoMedia.addEventListener('play', (event) => {
                const videoMedia = event.currentTarget;
                videoMedia.autoplay = false;
            }, { once: true });
        } else {
            const playPauseButton = video.querySelector('.' + VIDEO_PLAY_PAUSE_BUTTON_CLASS);
            playPauseButton?.click();
        }
    };

    toggleFullScreen = (event) => {
        const video = getClosestVideo(event.currentTarget);
        const fullScreenButton = video.querySelector('.' + VIDEO_FULL_SCREEN_BUTTON_CLASS);
        fullScreenButton?.click();
    };

    setupEasyClick(video) {
        const dim = video.querySelector('.' + VIDEO_DIM_CLASS);
        const header = video.querySelector('.' + VIDEO_HEADER_CLASS);
        const videoMedia = video.querySelector('video');

        // set styles
        if (dim) dim.style.cursor = 'pointer';
        if (header) header.style.cursor = 'pointer';

        // add one-shot listener
        dim?.addEventListener('click', this.playPauseVideo);

        videoMedia?.addEventListener('play', () => this.clearEasyClick(video), { once: true });
    }

    clearEasyClick(video) {
        const dim = video.querySelector('.' + VIDEO_DIM_CLASS);
        const header = video.querySelector('.' + VIDEO_HEADER_CLASS);
        const videoMedia = video.querySelector('video');

        // reset styles
        if (dim) dim.style.cursor = '';
        if (header) header.style.cursor = '';

        // remove one-shot listener
        dim?.removeEventListener('click', this.playPauseVideo);

        videoMedia?.addEventListener('ended', () => this.setupEasyClick(video), { once: true });
    }

    async decorate(video) {
        try {
            // 부가 기능: 비디오 윗 부분(header) 클릭 활성화
            const header = video.querySelector('.' + VIDEO_HEADER_CLASS);
            header?.addEventListener('click', this.playPauseVideo);
            header?.addEventListener('dblclick', this.toggleFullScreen);

            const videoMedia = video.querySelector('video');
            if (videoMedia?.paused && !video.querySelector('.' + VIDEO_PLAYING_CLASS)) {
                this.setupEasyClick(video);
            } else {
                this.clearEasyClick(video); // for video 'ended' listener
            }
        } catch (e) {
            console.warn(`Failed to click play button: ${e}`);
        }
    }
}
