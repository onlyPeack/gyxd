<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">

      <!-- <router-link v-if="item.children.length===1 && !item.children[0].children" :to="item.path+'/'+item.children[0].path" :key="item.children[0].name">
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title">{{generateTitle(item.children[0].meta.title)}}</span>
        </el-menu-item>
      </router-link> -->
      <!--
            <el-submenu v-else :index="item.name||item.path" :key="item.name">
              <template slot="title">
                <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
                <span v-if="item.meta&&item.meta.title">{{generateTitle(item.meta.title)}}</span>
              </template>

              <template v-for="child in item.children" v-if="!child.hidden">
                <sidebar-item :is-nest="true" class="nest-menu" v-if="child.children&&child.children.length>0" :routes="[child]" :key="child.path"></sidebar-item>

                <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
                  <el-menu-item :index="item.path+'/'+child.path">
                    <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
                    <span v-if="child.meta&&child.meta.title">{{generateTitle(child.meta.title)}}</span>
                  </el-menu-item>
                </router-link>
              </template>
            </el-submenu> -->
      <el-submenu :index="item.title" :key="item.name">
        <template slot="title">
          <svg-icon v-if='item.icon' :icon-class="item.icon"
                    style="width: 20px;height: 20px;vertical-align:middle;margin-right:6px"></svg-icon>
          <span>{{item.title}}</span>
        </template>
        <template v-for="child in item.children">
          <sidebar-item :is-nest="true" class='nest-menu' v-if='child.children&&child.children.length>0'
                        :routes='[child]' :key="child.path"></sidebar-item>
          <router-link v-if='!child.children || child.children.length==0'
                       :to="'/'+item.code+'/'+child.code" :key="child.name">
            <el-menu-item :index="'/'+item.code+'/'+child.code" :route="'/'+item.code+'/'+child.code">
              <svg-icon v-if='child.icon' :icon-class="child.icon"
                        style="width: 20px;height: 20px;vertical-align:middle;margin-right:6px"></svg-icon>
              <span>{{child.title}}</span>
            </el-menu-item>
          </router-link>
          <!--<router-link v-if='(!child.children || child.children.length==0) && child.title=="折扣设置"' target="_blank"
                       :to="{path:'/setting',query:{activeName:'first',activeView:'discount-settings'}}" :key="child.name">
            <el-menu-item :index="'/'+item.code+'/'+child.code" :route="'/'+item.code+'/'+child.code">
              <svg-icon v-if='child.icon' :icon-class="child.icon"
                        style="width: 20px;height: 20px;vertical-align:middle;margin-right:6px"></svg-icon>
              <span>{{child.title}}</span>
            </el-menu-item>
          </router-link>-->
        </template>
      </el-submenu>
    </template>
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
    methods: {}
  }
</script>

