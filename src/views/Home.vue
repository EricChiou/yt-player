<template>
  <div id="home" @scroll="onScroll">
    <Player :mode="mode"></Player>
    <div class="main">
      <PlayList :mode="mode"></PlayList>
      <Search ref="search" :mode="mode" :change-mode="changeMode"></Search>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import PlayList from '@/components/PlayList/PlayList.vue';
import Player from '@/components/Player/Player.vue';
import Search from '@/components/Search/Search.vue';

export default {
  name: 'home',
  components: {
    PlayList,
    Player,
    Search
  },
  data: () => ({
    mode: 'narrow'
  }),
  methods: {
    changeMode(mode) {
      this.mode = mode;
    },
    onScroll(e) {
      if (
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) <
        50
      ) {
        this.$refs.search.searchMore();
      }
    }
  },
  mounted() {
    if (window.innerWidth < 768) {
      this.mode = 'mobile';
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        if (this.mode !== 'mobile') {
          this.mode = 'mobile';
        }
      } else {
        if (this.mode !== 'narrow' && this.mode !== 'wide') {
          this.mode = 'narrow';
        }
      }
    });
  }
};
</script>

<style lang="scss" scoped>
#home {
  height: 100vh;
  overflow: auto;
  .main {
    display: flex;
  }
}
</style>
