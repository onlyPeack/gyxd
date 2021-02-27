<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree class="filter-tree" node-key="id" :data="fetchTreeData" :props="defaultProps" default-expand-all :expand-on-click-node="false"
                 :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData"  highlight-current>
        </el-tree>
      </el-col>
      <el-col :span="8">
        <el-row>
          <el-col :span="24" style="line-height: 36px;padding-left: 20px;">
            已选职务：
            <el-tag v-show="chooseDept!=''" closable :disable-transitions="false" @close="reset">{{chooseDept}}</el-tag>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getTree} from '@/api/org/depart/index';
  import {fetchTree} from '@/api/admin/group/index';
  import { mapGetters } from 'vuex';
  export default {
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
          let query={
            groupType:'role'
          };
          fetchTree(query).then(data => {
            this.fetchTreeData = data
          });

      },
      getTreeNodeData(data) {
        this.currentTreeNodeId = data.id;
        this.currentTreeNode = data;
        if(data.children.length==0){
          this.chooseDept=data.label;
        }
      },
      reset(){
        this.chooseDept='';
        this.currentTreeNodeId = undefined;
        this.currentTreeNode = {};
      },
      onSubmit() {
        this.$emit('closePostDialog', this.currentTreeNode)
      }
    },
    created() {
      this.initmainTreeData()
    },
    computed: {
      ...mapGetters(['elements'])
    },
    data() {
      return {
        filterText: '',
        currentTreeNodeId: undefined,
        currentTreeNode: {},
        fetchTreeData:[],
        mainTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        chooseDept:''
      };
    }
  };
</script>
