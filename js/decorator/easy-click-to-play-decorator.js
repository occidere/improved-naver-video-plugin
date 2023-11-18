// 기존: play 버튼을 눌러야 재생됨, 로딩 중에는 클릭이 무시됨
// 적용시: 로딩중이더라도 video 아무 곳이나 클릭했을 때 재생이 시작됨
class EasyClickToPlayDecorator extends Decorator {

    async decorate(video) {
        try {
            // don't decorate after playing
            if (video.querySelector('.' + VIDEO_PLAYING_CLASS)) return;

            const clickListener = (event) => {
                const video = this.getParentVideo(event.currentTarget);
                const dim = video.querySelector('.' + VIDEO_DIM_CLASS);
                const header = video.querySelector('.' + VIDEO_HEADER_CLASS);

                // only for 'beforeplay'
                if (video.querySelector('.' + VIDEO_BEFORE_PLAY_CLASS)) {
                    // <video>.play()는 blog.naver.com에서 에러 발생
                    const playButton = video.querySelector('.' + VIDEO_PLAY_BUTTON_CLASS);
                    playButton?.click();
                }

                // reset listener (once: true 효과)
                dim.removeEventListener('click', clickListener);
                header.removeEventListener('click', clickListener);

                // reset style
                dim.style.cursor = '';
                header.style.cursor = '';
            };

            // set listener & style
            const dim = video.querySelector('.' + VIDEO_DIM_CLASS);
            const header = video.querySelector('.' + VIDEO_HEADER_CLASS);
            dim.addEventListener('click', clickListener);
            header.addEventListener('click', clickListener);
            dim.style.cursor = 'pointer';
            header.style.cursor = 'pointer';
        } catch (e) {
            console.warn(`Failed to click play button: ${e}`);
        }
    }

    getParentVideo(element) {
        if (location.hostname === 'kin.naver.com') {
            return element.closest('.' + KIN_VIDEO_MODULE_CLASS);
        }
        return element.closest('.' + VIDEO_PLAYER_CLASS);
    }
}
