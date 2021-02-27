<template>
  <div>
    <el-row>
      <div style="display: inline-block;line-height: 36px;float: left;">关键字：</div>
      <el-col :span="10">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22">
        <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
                 :expand-on-click-node="false" :filter-node-method="filterNode" ref="menuTree"
                 @node-click="getNodeData">
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    fetchTree, getObj, addObj, delObj, putObj
  } from '@/api/admin/menu/index';
  import {mapGetters} from 'vuex';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    computed: {
      ...mapGetters([
        'permissionMenus'
      ])
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      }
    },
    data() {
      return {
        filterText: '',
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'title'
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.treeData = this.permissionMenus;
        /*fetchTree(this.listQuery).then(data => {
          this.treeData = data;
        });*/
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.title.indexOf(value) !== -1;
      },
      getNodeData(data) {
        if (data.children.length == 0) {
          var path = data.path.substr(1);
          path = path.substr(path.indexOf('/'));
          let parent = undefined;
          for (let i in this.treeData) {

            for (let j in this.treeData[i].children) {
              if (this.treeData[i].children[j].id === data.parentId) {
                parent = this.treeData[i].children[j].code
              }
              // if(this.treeData[i].children[j].id === data.parentId){
              //   parent = this.treeData[i].children[j].code
              // }
            }
          }
          let sum = '/' + parent + '/' + data.code
          this.$router.push({path: sum, name: data.name});
          this.$emit('closeDepartDialog', data);
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .el-dialog__wrapper .el-dialog .el-dialog__header {
    height: auto;
    line-height: normal;
  }
</style>
