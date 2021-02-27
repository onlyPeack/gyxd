<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <div class="main-container main-container-2">
      <template>
        <topbar :isNotShow="true"></topbar>
      </template>

      <div class="setting-container">
        <el-tabs v-model="activeName">
          <el-tab-pane label="业务配置" name="first">
            <system-configure></system-configure>
          </el-tab-pane>
          <el-tab-pane label="用户管理" name="second">
            <system-user></system-user>
          </el-tab-pane>
          <el-tab-pane label="组织架构" name="third">
            <system-office></system-office>
          </el-tab-pane>
          <el-tab-pane label="角色管理" name="fourth">
            <system-role></system-role>
          </el-tab-pane>
          <el-tab-pane label="公司管理" name="fifth">
            <system-company></system-company>
          </el-tab-pane>
          <!--<el-tab-pane label="权限配置" name="sixth">
          </el-tab-pane>-->
        </el-tabs>
      </div>
    </div>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import {Topbar} from '@/layout/components/index';

  export default {
    name: "setting",
    components: {
      Topbar,
      'system-user': () => import('./tab/systemUser'),
      'system-configure': () => import('./tab/systemConfigure'),
      'system-office': () => import('./tab/systemOffice'),
      'system-role': () => import('./tab/systemRole'),
      'system-company': () => import('./tab/systemCompany'),
    },
    computed: {
      ...mapGetters([
        'topModel',
      ]),
      sidebar() {
        return this.$store.state.app.sidebar
      }
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    mounted() {
      this.getActiveName();
    },
    methods: {
      getActiveName() {
        if (this.$route.query && this.$route.query.activeName) {
          this.activeName = this.$route.query.activeName;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .setting-container {
    margin: 10px;
  }
</style>
