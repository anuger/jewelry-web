<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <keep-alive>
        <router-view v-if="isRouterAlive"></router-view>
      </keep-alive>
    </div>
  </a-config-provider>
</template>

<script>

import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";

export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      locale: zhCN
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    }
  },
  name: 'App'
}
</script>

<style>
#app {
  height: 100%;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
