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
  import {fetchTree, getTreeObj, addTreeObj, delTreeObj, putTreeObj} from '@/api/mall/cms/cmsStoreyTree';
  export default {
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
          label: 'name'
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        fetchTree(this.listQuery).then(data => {
          this.treeData = data;
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        console.log(data);
      }
    }
  }
</script>

