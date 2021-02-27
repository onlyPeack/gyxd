<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <!-- <div style="display: inline-block;margin-left: 50px;">
       <el-button round icon="el-icon-search" @click="openNavigationDialog()"></el-button>
     </div>-->
    <div class="right-menu">
      <!-- <error-log class="errLog-container right-menu-item"></error-log>

       <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
       <screenfull class="screenfull right-menu-item"></screenfull>
       </el-tooltip>

       <lang-select class="international right-menu-item"></lang-select>-->
      <div class="right-menu-operation">
        <el-button round icon="el-icon-search" @click="openNavigationDialog()"></el-button>
      </div>
      <div class="right-menu-operation">
        <el-button round>
          <a :href="emailUrl" target="_blank">
            <svg-icon icon-class="email"></svg-icon>
          </a>
        </el-button>
      </div>
      <el-dropdown trigger="click" v-if="loginno==='00000'" class="right-menu-operation">
        <span>
          <el-button round><svg-icon icon-class="shezhi"></svg-icon></el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'first'}}">
            <el-dropdown-item class="navbar-dropdown">业务配置</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'second'}}">
            <el-dropdown-item divided class="navbar-dropdown">用户管理</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'third'}}">
            <el-dropdown-item divided class="navbar-dropdown">组织架构</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'fourth'}}">
            <el-dropdown-item divided class="navbar-dropdown">角色管理</el-dropdown-item>
          </router-link>
          <router-link target="_blank" :to="{path:'/setting',query:{activeName:'fifth'}}">
            <el-dropdown-item divided class="navbar-dropdown">公司管理</el-dropdown-item>
          </router-link>
          <!--<router-link target="_blank" :to="{path:'/setting',query:{activeName:'sixth'}}">
            <el-dropdown-item divided class="navbar-dropdown">权限配置</el-dropdown-item>
          </router-link>-->
        </el-dropdown-menu>
      </el-dropdown>
      <div style="float: right;">
        <el-tooltip effect="dark" content="换肤" placement="bottom" style="top: 10px;" v-if="false">
          <theme-picker class="theme-switch right-menu-item"></theme-picker>
        </el-tooltip>

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <span v-model="loginName">{{loginName}}</span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item class="navbar-dropdown">
                首页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided class="navbar-dropdown">
              <span @click="onChangePassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="navbar-dropdown">
              <span @click="openTopicDialog" style="display:block;">切换主题</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="navbar-dropdown">
              <span @click="openScreenDialog" style="display:block;">锁定屏幕</span>
            </el-dropdown-item>
            <el-dropdown-item divided class="navbar-dropdown">
              <span @click="logout" style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <el-dialog title="修改密码" width="30%" :visible.sync="dialogPasswordVisible">
        <ChagePassowrd @closePasswordDialog="closePasswordDialog" ref="passwordDialog"></ChagePassowrd>
      </el-dialog>
    </div>
    <div>
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

  <!--<el-menu class="navbar" mode="horizontal" v-if="navbarVisible">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    &lt;!&ndash; <div style="display: inline-block;margin-left: 50px;">
       <el-button round icon="el-icon-search" @click="openNavigationDialog()"></el-button>
     </div>&ndash;&gt;
    <div class="right-menu">
      &lt;!&ndash;<error-log class="errLog-container right-menu-item"></error-log>&ndash;&gt;

      &lt;!&ndash;<el-tooltip effect="dark" :content="全屏" placement="bottom">&ndash;&gt;
      &lt;!&ndash;<screenfull class="screenfull right-menu-item"></screenfull>&ndash;&gt;
      &lt;!&ndash;</el-tooltip>&ndash;&gt;

      &lt;!&ndash;<lang-select class="international right-menu-item"></lang-select>&ndash;&gt;
      <div style="float: left;margin-right: 10px">
        <el-button round icon="el-icon-search" @click="openNavigationDialog()"></el-button>
      </div>
      <div style="float: right;">
        <el-tooltip effect="dark" content="换肤" placement="bottom">
          <theme-picker class="theme-switch right-menu-item"></theme-picker>
        </el-tooltip>

        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                首页
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided>
              <span @click="onChangePassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">退出登录</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="handleNavbarVisible" style="display:block;">切换主题</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="openScreenDialog" style="display:block;">锁定屏幕</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    <div>
      <el-dialog title="修改密码" width="30%" :visible.sync="dialogPasswordVisible">
        <ChagePassowrd @closePasswordDialog="closePasswordDialog" ref="passwordDialog"></ChagePassowrd>
      </el-dialog>
    </div>
    </div>
    <div>
      <el-dialog title="功能导航" width="28%" :visible.sync="dialogNavigationVisible">
        <FunctionalNavigation @closeDepartDialog="closeNavigationDialog" ref="navigationDialog"></FunctionalNavigation>
      </el-dialog>
    </div>
  </el-menu>-->
</template>

<script>
  import {mapGetters} from 'vuex'
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
    components: {
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker,
      ChagePassowrd,
      FunctionalNavigation,
      LockScreen
    },
    data() {
      return {
        dialogPasswordVisible: false,
        dialogNavigationVisible: false,
        dialogScreenVisible: false,
        dialogTopicVisible: false,
        topicChange: '1'
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar'
      ]),
      loginName() {
        return this.$store.getters.name;
      },
      loginno() {
        return this.$store.getters.code;
      },
      emailUrl() {
        if (process.env.NODE_ENV == 'development') {
          return 'http://test.email.hejizx.com/#/login'
        } else {
          return 'http://email.hejizx.com/#/login'
        }
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
          this.$message('当前模式已为左侧模式');
          this.dialogTopicVisible = false;
        } else if (this.topicChange === '2') {
          this.$store.dispatch('app/setTopModel', 2).then(() => {
          })
        }
      },
    }
  }
</script>

<style lang="scss">
  .navbar-dropdown {
    line-height: 30px !important;
    padding: 0px 10px !important;
    font-size: 14px !important;
    margin-top: 0px !important;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0 !important;

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-operation {
        float: left;
        margin-right: 10px;
        .svg-icon {
          color: #606266;
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
          /* margin-top: 5px;*/
          position: relative;

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 18px;
            font-size: 12px;
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

