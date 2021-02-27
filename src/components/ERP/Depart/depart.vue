<template>
<div>
   <el-row>
     <el-col :span="16">
       <el-input placeholder="输入关键字进行过滤" v-model="filterText">
       </el-input>
       <el-tree class="filter-tree" node-key="id" :data="mainTreeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" show-checkbox @check="handleCheckChange"
                :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData"  highlight-current>
       </el-tree>
     </el-col>
     <el-col :span="8" v-if="!isSingle">
       <el-row>
         <el-col :span="24" style="line-height: 36px;padding-left: 20px;">
           已选部门：
           <el-tag v-show="chooseDept!=''" closable :disable-transitions="false" @close="reset">{{chooseDept}}</el-tag>
         </el-col>
       </el-row>
     </el-col>
  </el-row>
</div>
</template>

<script>
import {
  getTree
} from '@/api/org/depart/index';
import { mapGetters } from 'vuex';
export default {
  props:['isSingle'],
  watch: {
    filterText(val) {
      this.$refs.mainTree.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    initmainTreeData() {
      getTree().then(data => {
        this.mainTreeData = data
      });
    },
    getTreeNodeData(data) {
      this.currentTreeNodeId = data.id
      this.currentTreeNode = data;
      if(data.children.length==0){
        this.chooseDept=data.label;
      }
    },
    reset(){
      this.chooseDept='';
      this.currentTreeNodeId = undefined
      this.currentTreeNode = {};
    },
    onSubmit() {
      this.$emit('closeDepartDialog', this.isSingle?this.selectedRows:this.currentTreeNode)
    },

    handleCheckChange(data, checked) {
      this.selectedRows=checked
    },

    onBatchSubmit(){

    }
  },
  created() {
    this.initmainTreeData()
    // 加载树
    // this.departManager_btn_user_del = this.elements['departManager:btn_user_del'];
  },
  computed: {
    ...mapGetters(['elements'])
  },
  data() {
    return {
      filterText: '',
      currentTreeNodeId: undefined,
      currentTreeNode: {},
      mainTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      chooseDept:'',
      selectedRows:[]
    };
  }
};
</script>
