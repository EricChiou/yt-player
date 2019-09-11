<template>
  <div id="video-block" @click="addVideo2PlayList">
    <img :src="video.snippet.thumbnails.medium.url" />
    <div class="title">{{video.snippet.title}}</div>
    <div class="info">{{dataHandler(video.snippet.publishedAt)}}</div>
    <div class="mask">
      <div class="align-middle"></div>
      <div class="add">+</div>
    </div>
  </div>
</template>

<script>
import ListHub from '@/service/list.js';

export default {
  name: 'videoBlock',
  props: {
    video: Object
  },
  methods: {
    addVideo2PlayList() {
      ListHub.addVideo(this.video);
    },
    dataHandler(date) {
      return `${date.slice(0, 4)}/${date.slice(5, 7)}/${date.slice(
        8,
        10
      )} ${date.slice(11, 13)}:${date.slice(14, 16)}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/breakpoint.scss';
@import '@/assets/css/theme.scss';

#video-block {
  position: relative;
  display: inline-block;
  margin: 5px 5px 10px 5px;
  width: calc(25% - 10px);
  cursor: pointer;
  user-select: none;

  @include breakpoint(xl) {
    width: calc(100% / 3 - 10px);
  }

  @include breakpoint(l) {
    width: calc(50% - 10px);
  }

  @include breakpoint(s) {
    width: calc(100% - 10px);
  }

  img {
    display: block;
    width: 100%;
  }

  .title {
    padding: 0 2px;
    width: calc(100% - 4px);
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .info {
    padding: 0 5px;
    font-size: 14px;
    text-align: right;
    color: theme(gray, dark);
  }

  .mask {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.6);

    .add {
      display: inline-block;
      color: theme(white);
      font-size: 100px;
      font-weight: bold;
      vertical-align: middle;
    }
  }

  &:hover {
    .mask {
      display: block;
    }
  }

  &:active {
    .mask {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
}
</style>
