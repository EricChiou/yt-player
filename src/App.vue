<template>
  <div id="app">
    <router-view v-if="init" />
  </div>
</template>

<script>
import { getCountryCode } from '@/service/countryCode.js';

export default {
  name: 'app',
  data: () => ({
    init: false
  }),
  mounted() {
    getCountryCode().then(resp => {
      this.$store.dispatch('setCountryCode', resp);
      this.init = true;
    });
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Noto Sans TC', Helvetica, Arial, Sans-Serif,
    'Microsoft JhengHei';
}

button {
  cursor: pointer;
}

.align-middle {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.clear-both {
  clear: both;
}
</style>
