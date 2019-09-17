<template>
  <div id="player" :class="mode">
    <div class="player-container">
      <div id="yt-player"></div>
    </div>
  </div>
</template>

<script>
import PlayHub from '@/service/play.js';

export default {
  name: 'player',
  props: {
    mode: String
  },
  data: () => ({
    PlayHubSubscriber: null,
    player: null,
    onPlayerStateChange(e) {
      // console.log('onPlayerStateChange', e);
      if (e.data === 0) {
        PlayHub.playNext();
      }
    }
  }),
  methods: {
    init(callBack = () => {}) {
      if (window.YT && window.YT.Player) {
        this.player = new window.YT.Player('yt-player', {
          width: '100%',
          height: '100%',
          events: {
            onReady: callBack,
            onStateChange: this.onPlayerStateChange
          }
        });
      }
    }
  },
  mounted() {
    this.init();
    this.PlayHubSubscriber = PlayHub.getSubject().subscribe(data => {
      if (data.action === 'play_video') {
        if (!this.player || !this.player.loadVideoById) {
          this.init(() => {
            this.player.loadVideoById(data.video.id.videoId);
          });
        } else {
          this.player.loadVideoById(data.video.id.videoId);
        }
      }
    });
  },
  beforeDestroy() {
    if (this.PlayHubSubscriber) {
      this.PlayHubSubscriber.unsubscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
#player {
  position: relative;
  .player-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #000000;
    iframe {
      display: block;
    }
  }
}

.narrow {
  margin-left: 300px;
  padding-top: calc((100% - 300px) * 0.5625);
}

.wide {
  padding-top: 0;
  height: calc(100vh - 50px);
}

.mobile {
  margin-top: 35px;
  padding-top: 0;
  height: calc(100vh - 35px);
}
</style>
