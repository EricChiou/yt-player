<template>
  <div id="play-block" @click="play">
    <div class="cover">
      <img :src="video.snippet.thumbnails.default.url" />
      <div v-if="index===currentIndex" class="playing">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" fill="#ff0000" />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </div>
    </div>
    <div class="title">{{video.snippet.title}}</div>
    <div class="mask"></div>
    <div class="drop-up" @click.stop="dropUp">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" fill="#ffffff" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
    <div class="drop-down" @click.stop="dropDown">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" fill="#ffffff" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
    <div class="remove" @click.stop="remove">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          fill="#ffffff"
        />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    </div>
  </div>
</template>

<script>
import PlayHub from '@/service/play.js';

export default {
  name: 'playBlock',
  props: {
    index: Number,
    currentIndex: Number,
    video: Object,
    playVideo: Function,
    removeVideo: Function,
    drop: Function
  },
  methods: {
    play() {
      this.playVideo(this.index);
      PlayHub.playVideo(this.video);
    },
    remove() {
      this.removeVideo(this.index);
    },
    dropUp() {
      this.drop('up', this.index);
    },
    dropDown() {
      this.drop('down', this.index);
    }
  }
};
</script>

<style lang="scss" scoped>
#play-block {
  position: relative;
  margin-bottom: 3px;
  padding-left: 20px;
  cursor: pointer;
  .cover,
  .title {
    display: inline-block;
    vertical-align: middle;
  }
  .cover {
    position: relative;
    width: 80px;
    img {
      display: block;
      width: 100%;
    }
    .playing {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
  .title {
    margin-left: 5px;
    width: calc(100% - 110px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .mask {
    display: none;
    position: absolute;
    top: 0;
    right: 25px;
    bottom: 0;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.25);
  }

  .remove {
    display: inline-block;
    width: 25px;
    height: 60px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.25);
    vertical-align: middle;

    svg {
      margin-top: 18px;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .drop-up,
  .drop-down {
    position: absolute;
    left: 0;
    width: 20px;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.25);
    svg {
      display: block;
      margin-top: 5px;
      width: 20px;
      height: 20px;
    }
    &:hover {
      background-color: rgba(0, 0, 0, 0.5);
    }
  }

  .drop-up {
    top: 0;
    svg {
      transform: rotate(-90deg);
    }
  }

  .drop-down {
    bottom: 0;
    svg {
      transform: rotate(90deg);
    }
  }

  &:hover {
    .mask {
      display: block;
    }
  }
}
</style>
