// 기존: play 버튼을 눌러야 재생됨, 로딩 중에는 클릭이 무시됨
// 적용시: 로딩중이더라도 video 아무 곳이나 클릭했을 때 재생이 시작됨
class EasyClickToPlayDecorator extends Decorator {

    async decorate(video) {
        try {
            video.addEventListener('click', (event) => {
                if (video.querySelector('.' + VIDEO_BEFORE_PLAY_CLASS)) {
                    const videoElement = event.currentTarget.querySelector('video');
                    videoElement?.play();
                }
            }, { once: true });
        } catch (e) {
            console.warn(`Failed to click play button: ${e}`);
        }
    }
}