<template>
  <div id="search" :class="mode">
    <div class="search-video">
      <button class="trending" @click="searchNewTrending">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24">
          <path
            :d="`M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4
            10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14
            0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z`"
          />
          <path d="M0 0h24v24H0z" fill="none" />
        </svg>
      </button>
      <input id="keyword" placeholder="搜尋" @keydown="searchNewKeyword" />
      <button class="wide-mode" @click="change2Wide">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg">
          <line x1="3" y1="6.5" x2="3" y2="18.5" stroke-width="2" stroke="#000" />
          <line x1="3" y1="6.5" x2="22" y2="6.5" stroke-width="2" stroke="#000" />
          <line x1="3" y1="18.5" x2="22" y2="18.5" stroke-width="2" stroke="#000" />
          <line x1="22" y1="6.5" x2="22" y2="18.5" stroke-width="2" stroke="#000" />
        </svg>
      </button>
      <button class="narrow-mode" @click="change2Narrow">
        <svg width="26" height="26" xmlns="http://www.w3.org/2000/svg">
          <line x1="3" y1="6.5" x2="3" y2="18.5" stroke-width="2" stroke="#000" />
          <line x1="3" y1="6.5" x2="22" y2="6.5" stroke-width="2" stroke="#000" />
          <line x1="3" y1="18.5" x2="22" y2="18.5" stroke-width="2" stroke="#000" />
          <line x1="22" y1="6.5" x2="22" y2="18.5" stroke-width="2" stroke="#000" />
          <line x1="8.5" y1="6.5" x2="8.5" y2="18.5" stroke-width="2" stroke="#000" />
        </svg>
      </button>
      <div class="clear-both"></div>
    </div>
    <div class="search-result">
      <div class="result-text">{{searchType}}</div>
      <VideoBlock v-for="(video, i) in videoList" :key="i" :video="video"></VideoBlock>
      <div v-if="onLoading" class="loading">Loading...</div>
    </div>
  </div>
</template>

<script>
import { getTrendingVideo, searchVideo } from '@/api/search.js';
import VideoBlock from '@/components/Search/VideoBlock/VideoBlock.vue';

export default {
  name: 'search',
  components: {
    VideoBlock
  },
  props: {
    mode: String,
    changeMode: Function
  },
  data: () => ({
    onLoading: false,
    nextPageToken: null,
    videoList: [],
    keyword: null,
    searchType: '熱門影片'
  }),
  methods: {
    searchNewTrending() {
      if (this.onLoading) {
        return;
      }
      this.searchType = '熱門影片';
      this.videoList = [];
      this.keyword = null;
      this.nextPageToken = null;
      this.searchTrending();
    },
    searchNewKeyword(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        if (this.onLoading) {
          return;
        }

        this.searchType = '搜尋結果';
        this.videoList = [];
        this.keyword = e.target.value;
        this.nextPageToken = null;
        this.search(this.keyword);
      }
    },
    searchMore() {
      if (this.onLoading) {
        return;
      }
      if (!this.keyword) {
        this.searchTrending(this.nextPageToken);
        return;
      }
      this.search(this.keyword, this.nextPageToken);
    },
    search(keyword, nextPageToken) {
      this.onLoading = true;
      searchVideo(keyword, nextPageToken).then(response => {
        if (response.status === 200) {
          response.data.items.forEach(video => {
            this.videoList.push(video);
          });
          this.nextPageToken = response.data.nextPageToken;
        }
        this.onLoading = false;
      });
    },
    searchTrending(nextPageToken) {
      this.onLoading = true;
      getTrendingVideo(nextPageToken).then(response => {
        if (response.status === 200) {
          // console.log(response.data.items);
          response.data.items.forEach(video => {
            video.id = { videoId: video.id };
            this.videoList.push(video);
          });
          this.nextPageToken = response.data.nextPageToken;
        }
        this.onLoading = false;
      });
    },
    change2Narrow() {
      this.changeMode('narrow');
    },
    change2Wide() {
      this.changeMode('wide');
    }
  },
  mounted() {
    this.searchTrending();
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/css/breakpoint.scss';
@import '@/assets/css/theme.scss';

#search {
  display: inline-block;
  width: calc(100% - 300px);
  min-height: 50vh;

  .search-video {
    padding: 10px 0;
    text-align: center;
    background-color: #e84545;
    box-shadow: 0px 0px 4px 0px theme(gray);

    .trending {
      margin: 0 1px 0 5px;
      float: left;
      padding: 0;
      height: 30px;

      svg {
        display: block;
      }
    }

    #keyword {
      float: left;
      padding: 3px 5px 1px 5px;
      width: 265px;
      height: 22px;
      font-size: 18px;
      max-width: 320px;
    }

    .narrow-mode,
    .wide-mode {
      margin-right: 1px;
      padding: 0;
      float: right;

      svg {
        display: block;
      }

      @include breakpoint(m) {
        display: none;
      }
    }

    .wide-mode {
      margin-right: 5px;
    }
  }

  .search-result {
    .result-text {
      margin: 10px 0 5px 5px;
      font-size: 16px;
      text-align: left;
      color: theme(gray, dark);
    }

    .loading {
      font-size: 14px;
      text-align: center;
      color: theme(gray, dark);
    }
  }
}

.narrow {
  margin-left: 300px;
}

.wide {
  margin-left: 0;
}

.mobile {
  width: 100% !important;
}
</style>
