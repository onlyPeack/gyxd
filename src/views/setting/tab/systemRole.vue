<template>
  <div class="tab-container" style="margin-top: 0px!important;">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.name" :key='item.id' :name="item.code">
        <keep-alive>
          <tab-pane v-if='activeName==item.code' :type='item.id'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tabPane from '@/views/admin/group/components/groupDetail';
  import {
    getAllGroupTypes
  } from '@/api/admin/group/index';

  export default {
    name: 'group',
    components: {
      tabPane
    },
    data() {
      return {
        tabMapOptions: [],
        activeName: 'role'
      }
    },
    created() {
      this.fetchData();
    },
    methods: {
      fetchData() {
        getAllGroupTypes().then(data => {
          this.tabMapOptions = [];
          for (var i in data) {
            if (data[i].code == 'role') {
              this.tabMapOptions.push(data[i]);
            }
          }

          for (var j = 0; j < this.tabMapOptions.length; j++) {
            if (this.tabMapOptions[j].name === "自定义类型") {
              this.tabMapOptions.splice(j, 1);
            }
          }
        });
      }
    }
  }
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
