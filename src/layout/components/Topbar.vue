<template>
  <el-menu class="topbar" mode="horizontal">
    <div class="menu-logo" v-show="isShowMenuLogo">
      <router-link to="/dashboard">
        <span>工业小店</span>
      </router-link>
    </div>
    <div class="menu-logo" v-show="!isShowMenuLogo">
      <router-link to="/dashboard">
        <span>工业小店</span>
      </router-link>
    </div>
    <div class="menu">
      <sidebar-item v-if="!isNotShow" :routes='permissionMenus'></sidebar-item>
    </div>

    <div class="right-menu">
      <div class="right-menu-operation" v-if="!isNotShow">
        <span @click="openNavigationDialog()">
           <svg-icon icon-class="sousuo"></svg-icon>
        </span>
      </div>
<!--      <div class="right-menu-operation">-->
<!--        <a :href="emailUrl" target="_blank">-->
<!--          <svg-icon icon-class="email" style="color: white"></svg-icon>-->
<!--        </a>-->
<!--      </div>-->
      <el-dropdown trigger="click" v-if="loginno==='00000'" class="right-menu-operation">
        <span>
           <svg-icon icon-class="shezhi"></svg-icon>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'first'}}">
            <el-dropdown-item class="topbar-dropdown">业务配置</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'second'}}">
            <el-dropdown-item divided class="topbar-dropdown">用户管理</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'third'}}">
            <el-dropdown-item divided class="topbar-dropdown">组织架构</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'fourth'}}">
            <el-dropdown-item divided class="topbar-dropdown">角色管理</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'fifth'}}">
            <el-dropdown-item divided class="topbar-dropdown">公司管理</el-dropdown-item>
          </router-link>
          <!--<router-link target="_blank" :to="{path:'/setting',query:{activeName:'sixth'}}">
            <el-dropdown-item divided class="topbar-dropdown">权限配置</el-dropdown-item>
          </router-link>-->
        </el-dropdown-menu>
      </el-dropdown>
      <div style="float: right;">
<!--        <el-tooltip effect="dark" content="换肤" placement="bottom">-->
<!--          <theme-picker class="theme-switch right-menu-item"></theme-picker>-->
<!--        </el-tooltip>-->

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <!-- <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">-->
            <svg-icon class="user-img" icon-class="headImg"></svg-icon>
            <span style="color: #ffffff" v-model="loginName">{{loginName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item class="topbar-dropdown">
                首页
              </el-dropdown-item>
            </router-link>
<!--            <el-dropdown-item divided class="topbar-dropdown">-->
<!--              <router-link to="/releaseLog">-->
<!--                发版日志-->
<!--              </router-link>-->
<!--            </el-dropdown-item>-->
            <el-dropdown-item divided class="topbar-dropdown">
              <span @click="onChangePassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="topbar-dropdown">
              <span @click="openTopicDialog" style="display:block;">切换主题</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="topbar-dropdown">
              <span @click="openScreenDialog" style="display:block;">锁定屏幕</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="topbar-dropdown">
              <span @click="logout" style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div id="chagePassowrd">
      <el-dialog title="修改密码" width="30%" :visible.sync="dialogPasswordVisible">
        <ChagePassowrd @closePasswordDialog="closePasswordDialog" ref="passwordDialog"></ChagePassowrd>
      </el-dialog>
    </div>
    <div id="functionalNavigation">
      <el-dialog title="功能导航" width="28%" :visible.sync="dialogNavigationVisible">
        <FunctionalNavigation @closeDepartDialog="closeNavigationDialog" ref="navigationDialog"></FunctionalNavigation>
      </el-dialog>
    </div>
    <div id="lockScreen">
      <el-dialog title="锁定屏幕" width="100%" :visible.sync="dialogScreenVisible">
        <LockScreen @closeScreenDialog="closeScreenDialog" ref="screenDialog" :name="name"
                    :avatar="avatar"></LockScreen>
      </el-dialog>
    </div>
    <div class="topicChange">
      <el-dialog title="切换主题" width="28%" :visible.sync="dialogTopicVisible">
        <el-radio-group v-model="topicChange">
          <el-row>
            <el-col :span="24">
              <el-radio label="1">左侧模式</el-radio>
            </el-col>
            <el-col :span="24">
              <el-radio label="2">经典模式</el-radio>
            </el-col>
          </el-row>
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogTopicVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleNavbarVisible">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SidebarItem from './TopbarItem'
  import ScrollBar from '@/components/ScrollBar'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import ChagePassowrd from './ChangePassword'
  import FunctionalNavigation from './FunctionalNavigation'
  import LockScreen from './LockScreen'
  import "@/styles/iconfont.css";

  export default {
    props: ['isNotShow'],
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker,
      ChagePassowrd,
      FunctionalNavigation,
      LockScreen,
      SidebarItem,
      ScrollBar,
    },
    data() {
      return {
        isShowMenuLogo: true,
        dialogPasswordVisible: false,
        dialogNavigationVisible: false,
        dialogScreenVisible: false,
        dialogTopicVisible: false,
        userArr: [],
        loginName: '',
        loginno: '',
        topicChange: '2'
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'permissionMenus',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      emailUrl() {
        if (process.env.NODE_ENV == 'development') {
          return 'http://test.email.hejizx.com/#/login'
        } else {
          return 'http://email.hejizx.com/#/login'
        }
      }
    },
    mounted() {
      this.loginName = this.$store.getters.name;
      this.loginno = this.$store.getters.code;

      const _this = this;
      var width = document.documentElement.clientWidth;
      if (width >= 1400) {
        _this.isShowMenuLogo = true;
      } else {
        _this.isShowMenuLogo = false;
      }
    },
    methods: {

      toggleSideBar() {
        this.$store.dispatch('app/toggleSideBar')
      },
      logout() {
        this.$store.dispatch('user/LogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      onChangePassword() {
        this.dialogPasswordVisible = true
      },
      closePasswordDialog() {
        this.dialogPasswordVisible = false
      },
      openNavigationDialog() {
        this.dialogNavigationVisible = true;
      },
      closeNavigationDialog() {
        this.dialogNavigationVisible = false;
        this.$refs.navigationDialog.filterText = '';
      },
      openScreenDialog() {
        this.dialogScreenVisible = true;
      },
      closeScreenDialog() {
        this.dialogScreenVisible = false;
        this.$refs.screenDialog.password = '';
      },
      openTopicDialog() {
        this.dialogTopicVisible = true;
      },
      handleNavbarVisible() {
        if (this.topicChange === '1') {
          this.$store.dispatch('app/setTopModel', 1).then(() => {
          })
        } else if (this.topicChange === '2') {
          this.$message('当前模式已为经典模式');
          this.dialogTopicVisible = false;
        }
      },
      opentItem(key, path) {
        var idx = this.getIndex(this.permissionMenus, key);
        if (!idx) {
          this.$refs.menuList.open(key);
        }
      },
      getIndex(list, val) {
        var idx;
        for (var key in list) {
          var menu = list[key];
          if (menu.title == val) {
            idx = key;
          } else {
            this.$refs.menuList.close(menu.title);
          }
        }
        return idx;
      }
    }
  }
</script>

<style lang="scss">
  .topbar-dropdown {
    line-height: 30px !important;
    padding: 0px 10px !important;
    font-size: 14px !important;
    margin-top: 0px !important;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .topbar {
    height: 51px;
    min-width: 1280px;
    line-height: 50px;
    border-radius: 0 !important;
    background-color: #188AE2;

    .menu-logo {
      float: left;
      margin-left: 20px;
      color: #ffffff;
      //color: #188AE2;
      font-weight: 500;
      letter-spacing: 2px;
      font-family: 幼圆;
      font-size: 20px;
    }

    .menu {
      width: 72%;
      float: left;
    }

    .right-menu {
      float: right;
      height: 100%;
      background-color: #188AE2;

      &:focus {
        outline: none;
      }

      .right-menu-operation {
        float: left;
        margin-right: 10px;
        font-size: 20px;
        cursor: pointer;

        .svg-icon {
          color: #fff;
        }
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }

      .avatar-container {
        height: 50px;
        margin-right: 30px;

        .avatar-wrapper {
          cursor: pointer;
          vertical-align: middle;
          position: relative;

          /*.user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 40px;
          }*/
          .user-img {
            font-size: 20px;
            color: #fff;
            font-weight: 700;
            position: relative;
            top: 2px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 18px;
            font-size: 12px;
            color: #fff;
          }
        }
      }

    }

    .topicChange {
      .el-col {
        height: 30px;
        line-height: 30px;
        margin-left: 20%;
      }
    }
  }
</style>

