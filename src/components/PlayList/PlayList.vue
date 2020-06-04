<template>
  <div id="play-list" :class="mode" :style="menuHandler()">
    <div class="logo" @click="showMenu=false">
      <img src="../../assets/img/logo.png" />
      <div class="text">YT Player</div>
      <div class="menu" @click.stop="toggleMenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="#ffffff" />
        </svg>
      </div>
    </div>
    <div class="add">
      <input ref="videoId" placeholder="Video ID" />
      <button class="add-video" @click="addVideo">+</button>
    </div>
    <div class="title">
      <span class="text">Play List</span>
      <span :class="{repeat: true, on: repeat ? true : false}" @click="repeat=!repeat">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"
            fill="currentColor"
          />
        </svg>
      </span>
    </div>
    <div class="video-list">
      <PlayBlock
        v-for="(video, i) in playList"
        :key="i"
        :index="i"
        :current-index="index"
        :video="video"
        :play-video="playVideo"
        :remove-video="removeVideo"
        :drop="drop"
      ></PlayBlock>
    </div>
    <div class="footer">
      <a href="http://www.calicomoomoo.ml/entrance/" target="_blank">入口網站</a>
      <span class="vertical-line">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <a href="https://github.com/EricChiou/yt-player" target="_blank">
        <img src="../../assets/img/github.png" width="20" height="20" /> Github
      </a>
      <br />© 2019 Calico & MooMoo
      <br />
    </div>
    <div v-if="showMenu" class="mask" @click="showMenu=false"></div>
  </div>
</template>

<script>
import { getVideoById } from '@/api/search.js';
import ListHub from '@/service/list.js';
import PlayHub from '@/service/play.js';
import Cookie from '@/service/cookie.js';
import Cons from '@/util/constants.js';
import PlayBlock from '@/components/PlayList/PlayBlock/PlayBlock.vue';

export default {
  name: 'playList',
  components: {
    PlayBlock
  },
  props: {
    mode: String
  },
  data: () => ({
    ListHubSubscriber: null,
    PlayHubSubscriber: null,
    playList: [],
    index: null,
    onLoading: false,
    showMenu: false,
    repeat: false
  }),
  methods: {
    playVideo(index) {
      this.index = index;
    },
    removeVideo(index) {
      this.playList.splice(index, 1);
      if (index < this.index) {
        this.index--;
      } else if (index === this.index) {
        if (this.playList[index]) {
          PlayHub.playVideo(this.playList[index]);
        } else {
          this.index = null;
        }
      }
    },
    drop(value, index) {
      if (this.playList[index + value]) {
        const temp = this.playList[index];
        this.playList.splice(index, 1);
        this.playList.splice(index + value, 0, temp);
        if (this.index === index) {
          this.index = index + value;
        } else if (this.index === index + value) {
          this.index = index;
        }
      }
    },
    addVideo() {
      if (this.onLoading) {
        return;
      }
      if (!this.$refs.videoId.value) {
        return;
      }
      this.onLoading = true;
      getVideoById(this.$refs.videoId.value).then(response => {
        if (response.status === 200) {
          if (response.data.items.length) {
            this.$refs.videoId.value = '';
            const video = response.data.items[0];
            video.id = { videoId: video.id };
            this.playList.push(video);
          }
        }
        this.onLoading = false;
      });
    },
    menuHandler() {
      return {
        right: this.showMenu ? '0px' : '-300px'
      };
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    getPlayListFromCookie() {
      const cookie = Cookie.get(Cons.cookieName);
      if (cookie) {
        try {
          const ids = JSON.parse(cookie);

          if (Array.isArray(ids) && ids.length) {
            let idsStr = '';
            ids.forEach(id => {
              idsStr += `${id},`;
            });
            idsStr = idsStr.slice(0, -1);
            this.onLoading = true;
            getVideoById(idsStr).then(response => {
              if (response.status === 200) {
                if (response.data.items.length) {
                  const videos = response.data.items.map(video => {
                    video.id = { videoId: video.id };
                    return video;
                  });
                  // console.log(videos);
                  videos.forEach(video => {
                    this.playList.push(video);
                  });
                }
              }
              this.onLoading = false;
            });
          }
        } catch (error) {}
      }
    }
  },
  mounted() {
    this.getPlayListFromCookie();

    this.ListHubSubscriber = ListHub.getSubject().subscribe(data => {
      if (data.action === 'add_video') {
        // console.log(data.video);
        this.playList.push(data.video);
      }
    });
    this.PlayHubSubscriber = PlayHub.getSubject().subscribe(data => {
      if (data.action === 'play_next') {
        this.index++;
        if (this.playList[this.index]) {
          PlayHub.playVideo(this.playList[this.index]);
        } else {
          if (this.repeat && this.playList[0]) {
            this.index = 0;
            PlayHub.playVideo(this.playList[this.index]);
          }
        }
      }
    });

    window.onbeforeunload = () => {
      const ids = [];
      this.playList.forEach(video => {
        if (video.id && video.id.videoId) {
          ids.push(video.id.videoId);
        }
      });
      Cookie.set(Cons.cookieName, JSON.stringify(ids), 365);
    };
  },
  beforeDestroy() {
    if (this.ListHubSubscriber) {
      this.ListHubSubscriber.unsubscribe();
    }
    if (this.PlayHubSubscriber) {
      this.PlayHubSubscriber.unsubscribe();
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/breakpoint.scss';
@import '@/assets/css/theme.scss';

#play-list {
  padding-bottom: 50px;
  width: 300px;
  background-color: theme(gray);
  overflow: auto;

  .logo {
    padding: 2px 5px;
    height: 46px;
    color: theme(white);
    background-color: #e84545;
    z-index: 999;

    img {
      display: inline-block;
      width: 42px;
      height: 42px;
      vertical-align: middle;
    }

    .text {
      display: inline-block;
      margin-left: 8px;
      font-size: 28px;
      font-weight: bold;
      font-style: italic;
      vertical-align: middle;
    }

    .menu {
      display: none;
      float: right;
      margin-top: 3px;
      cursor: pointer;

      svg {
        display: block;
      }

      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }

    @include breakpoint(m) {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      padding: 2px 5px;
      height: 31px;

      img {
        width: 27px;
        height: 27px;
      }

      .text {
        padding-bottom: 0px;
        font-size: 18px;
      }

      .menu {
        display: block;
      }
    }
  }

  .add {
    padding: 10px 5px 0 5px;

    input {
      width: calc(100% - 43px);
      height: 22px;
      padding: 3px 5px 1px 5px;
      font-size: 18px;
    }
    .add-video {
      margin-left: -1px;
      width: 30px;
      height: 30px;
      font-size: 22px;
      font-weight: bold;
      line-height: 24px;
      color: theme(gray, dark);
      vertical-align: top;
    }
  }

  .title {
    padding: 3px 5px;
    font-size: 16px;
    .text {
      display: inline-block;
      vertical-align: middle;
    }

    .repeat {
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;

      svg {
        display: block;
        width: 24px;
        height: 24px;
      }
    }

    .on {
      color: #e84545;
    }
  }

  .video-list {
    padding: 3px 5px 0 5px;
    box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.2);

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: #bababa;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb {
      background: #909090;
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #787878;
    }

    scrollbar-color: #909090 #bababa;
    scrollbar-width: thin;

    &:hover {
      scrollbar-color: #787878 #bababa;
    }
  }

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 5px;
    height: 40px;
    font-size: 14px;
    text-align: center;
    color: theme(gray, dark);

    a,
    .vertical-line {
      display: inline-block;
      vertical-align: middle;
    }

    a {
      text-decoration: none;
      color: theme(gray, dark);
      img {
        margin-bottom: -3px;
        width: 20px;
        height: 20px;
      }

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .mask {
    position: fixed;
    top: 0;
    right: 300px;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 99;
  }
}

.narrow {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;

  .video-list {
    max-height: calc(100% - 126px);
    overflow: auto;
  }
}

.wide {
  min-height: 50vh;

  .footer {
    display: none;
  }
}

.mobile {
  position: fixed;
  top: 30px;
  right: 0px;
  bottom: 0;
  transition: right 0.2s;
  z-index: 999;

  .video-list {
    max-height: calc(100% - 76px);
    overflow: auto;
  }
}
</style>
