<template>
  <div class="topbar-menu">
    <!--遍历当前路由-->
    <div class="topbar-menu-all" @click.stop="menuVisible">
      <div class="topbar-menu-item" v-for="(item, index) in routes">
      <span class="top-menu" @click="handleMenuShow(index)" style="height: 49px;">
        <!--<svg-icon v-if='item.icon' :icon-class="item.icon"
                   style="width: 20px;height: 20px;vertical-align:middle;margin-right:6px">
                    @click="handleMenuClose" @mousedown="handleMenuClose(index)"</svg-icon>-->
        {{item.title}}
        <span class="top-menu-icon">
          <svg-icon icon-class="down"></svg-icon>
        </span>
      </span>

        <div class="sub-menu" v-if="submenuVisibleList[index]">
          <div class="sub-menu-all">
            <template v-for="child in item.children">
              <div class="sub-menu-item">
                <div class="sub-menu-title">
                  <el-row>
                    <el-col :span="24">
                      <span class="sub-menu-child-title">{{child.title}}</span>
                    </el-col>
                  </el-row>
                  <template v-for="childItem in child.children">
                    <el-row :class="isNowRoute(childItem) ? 'nowRoute' : ''">
                      <el-col :span="24">
                        <!--<router-link :to="'/'+child.code+'/'+childItem.code" :key="childItem.name" v-if="childItem.title!='折扣设置'">
                          <a class="sub-menu-children-title" @click="handleMenuClick(index)">{{childItem.title}}</a>
                        </router-link>
                        <router-link target="_blank" :to="{path:'/setting',query:{activeName:'first',activeView:'discount-settings'}}" v-else>
                          <a class="sub-menu-children-title" @click="handleMenuClick(index)">{{childItem.title}}</a>
                        </router-link>-->
                        <router-link :to="'/'+child.code+'/'+childItem.code" :key="childItem.name">
                          <a class="sub-menu-children-title" @click="handleMenuClick(index)">{{childItem.title}}</a>
                        </router-link>
                      </el-col>
                    </el-row>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    <!--遮罩层-->
    <div class="topbar-mask" v-if="showMask"></div>
  </div>
</template>


<script>

  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        submenuVisibleList: [],
        showMask: false
      }
    },
    created() {
      this.initSubmenuVisibleList()
      // console.log(this.routes);
    },
    methods: {
      isNowRoute(route) {
        if (route.name === this.$route.name) {
          return true
        } else {
          return false
        }
      },
      handleMenuShow(index) {
        this.initSubmenuVisibleList();
        this.submenuVisibleList[index] = true;
        this.showMask = true;
      },
      menuVisible(value) {
        if (value) {
          document.body.addEventListener('click', this.handleMenuClose)
        } else {
          document.body.removeEventListener('click', this.handleMenuClose)
        }
      },
      handleMenuClose(index) {
        this.initSubmenuVisibleList();
        this.submenuVisibleList[index] = false;
        this.showMask = false;
      },
      initSubmenuVisibleList() {
        this.submenuVisibleList = [];
        const _this = this;
        if (this.routes && this.routes.length > 0) {
          for (let i = 0; i < this.routes.length; i++) {
            _this.submenuVisibleList.push(false)
          }
        }

      },
      handleMenuClick(index) {
        this.initSubmenuVisibleList();
        this.submenuVisibleList[index] = false;
        this.showMask = false;
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

  .topbar-menu {
    width: 100%;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    justify-content: space-around;

    .topbar-menu-item {
      background: #188ae2;
      color: white;
      float: left;

      .top-menu {
        display: block;
        font-size: 14px;
        height: 50px;
        padding: 0px 20px;

        .svg-icon {
          font-size: 10px;
        }

        .top-menu-icon {
          font-size: 8px;
          margin-left: 3px;

          .svg-icon {
            width: 8px;
            height: 10px;
          }
        }
      }

      .top-menu:hover {
        background-color: #1276c3;
        color: #ffffff;
      }

      .sub-menu {
        width: 100%;
        z-index: 3999;
        font-size: 14px;
        color: #000000;
        position: absolute;
        left: 0px;
        display: flex;
        justify-content: space-around;
        padding: 15px 0px;
        background-color: #ffffff;
        -moz-box-shadow: 0 10px 15px #777;
        -webkit-box-shadow: 0 10px 15px #777;
        box-shadow: 0 10px 15px #777;

        .sub-menu-all {
          /*display: flex;*/
        }

        .sub-menu-item {
          float: left;
          display: inline-block;
          vertical-align: top;
          height: 100%;
          border-right: #cccccc solid 1px;

          .sub-menu-title {

            .el-row, .el-col {
              margin-bottom: 0px !important;
            }

            .sub-menu-child-title {
              color: #188ae2;
              height: 30px;
              display: block;
              line-height: 30px;
              padding: 0 40px;
              font-weight: bold;
            }

            .sub-menu-children-title {
              height: 30px;
              display: block;
              line-height: 30px;
              padding: 0 40px;
            }

            .sub-menu-children-title:hover {
              //background-color: #F5F7FA;
              background-color: #CFE5F5;
            }
          }

        }

      }

    }

    .topbar-mask {
      width: 100%;
      z-index: 3666;
      position: fixed;
      left: 0px;
      bottom: 0px;
      top: 50px;
      background: #000;
      opacity: .45;
    }
  }

</style>
