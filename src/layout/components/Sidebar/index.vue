<template>
  <scroll-bar>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" background-color="#188ae2" text-color="#fff" active-text-color="#409EFF" ref="menuList" @open="opentItem">
      <router-link to="/dashboard">
        <el-menu-item index="首页">
          <i style="color:#fff;margin-right: 6px;" class="iconfont icon-shouye"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <sidebar-item :routes='permissionMenus'></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permissionMenus',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods:{
    opentItem(key,path){
      var idx=this.getIndex(this.permissionMenus,key);
      if(!idx){
        this.$refs.menuList.open(key);
      }
    },
    getIndex(list,val){
      var idx;
      for(var key in list){
        var menu = list[key];
        if(menu.title==val){
          idx=key;
        }else{
          this.$refs.menuList.close(menu.title);
        }
      }
      return idx;
    }
  }
}
</script>
