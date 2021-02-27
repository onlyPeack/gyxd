<template>
  <div>
    <el-row>
      <el-col :span="20">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree class="filter-tree" :data="mainTreeData" :props="defaultProps"
                 :expand-on-click-node="false" show-checkbox node-key="id" :filter-node-method="filterNode"
                 ref="mainTree" @node-click="getTreeNodeData" highlight-current show-checkbox
                 check-strictly
                 :default-expand-all="isGrade"
                 @check-change="handleNodeClick">
        </el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {regionData, CodeToText,TextToCode} from 'element-china-area-data';

  export default {
    watch: {
      filterText(val) {
        this.$refs.mainTree.filter(val);
      }
    },
    props: ['ids', 'grade', 'coverRegionNames', 'secondRegion', 'firstRegion'],
    mounted() {
      this.init();
    },
    methods: {
      init() {
        var json = JSON.stringify(regionData).replace(/value/g, 'id');
        var data = JSON.parse(json);
        console.log(this.ids)
        if (this.grade == '1') {
          var list = [];
          for (var i in data) {
            for (var j in data[i].children) {
              delete  data[i].children[j].children
            }
            list.push(data[i]);
          }
          this.isGrade = true;
          this.mainTreeData = list;
        } else {
          this.isGrade = false;
          this.mainTreeData = data;
        }

        if (this.ids && this.ids.length > 0) {
          this.$refs.mainTree.setCheckedKeys(this.ids);
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getTreeNodeData(data) {
      },
      handleNodeClick(data, checked, indeterminate) {

      },
      reset() {
        this.currentTreeNode = [];
        this.$refs.mainTree.setCheckedKeys([]);
      },
      onSubmit() {
        var list = this.$refs.mainTree.getCheckedNodes();
        var nodes = [];
        for (var i in list) {
          if (!list[i].children||this.grade==='1') {
            nodes.push({
              id: list[i].id,
              label: list[i].label
            });
          }else{
            nodes.push({
              id: list[i].id,
              label: list[i].label
            });
          }
        }
        this.currentTreeNode = nodes;
        console.log(nodes)
        this.$emit('closeAreaDialog', this.currentTreeNode)
      }
    },
    computed: {
      ...mapGetters(['elements'])
    },
    data() {
      return {
        filterText: '',
        currentTreeNode: [],
        mainTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          id: 'value'
        },
        selectOrg: {
          orgsid: []
        },
        isGrade: false,
      };
    }
  };
</script>
