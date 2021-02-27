<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <sidebar v-if="topModel === 1" class="sidebar-container"></sidebar>
    <div :class="'main-container main-container-' + topModel">
      <template v-if="topModel === 1">
        <navbar ></navbar>
      </template>
      <template v-if="topModel === 2">
        <topbar></topbar>
      </template>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {Navbar, Sidebar, AppMain, TagsView, Topbar} from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      TagsView,
      Topbar,
    },
    computed: {
      ...mapGetters([
        'topModel',
      ]),
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    created() {
      // console.log(typeof this.topModel)
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

</style>
