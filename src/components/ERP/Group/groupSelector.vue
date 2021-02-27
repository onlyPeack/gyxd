<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.groupName">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit">
        <el-table-column align="center" label="群组名称">
          <template slot-scope="scope">
            <span>{{scope.row.groupName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成员">
          <template slot-scope="scope">
            <span>{{scope.row.groupUserName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理员">
          <template slot-scope="scope">
            <span>{{scope.row.groupManager}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="8">
      已选群组：
      <el-tag v-show="chooseGroup.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseGroup" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/oa/contactsGroup';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseGroup: [],
        currentGroup: [],
        listQuery: {
          page: 1,
          limit: 20,
          groupName:undefined
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
            this.listLoading = false;
          })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        if(val){
          if (this.isSingle) {
            this.chooseGroup = [val.groupName];
            this.currentGroup = [val];
          } else {
            for (var i in this.chooseGroup) {
              if (this.chooseGroup[i] == val.groupName) {
                return;
              }
            }
            this.chooseGroup.push(val.groupName);
            this.currentGroup.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeGroupDialog', this.currentGroup)
      },
      handleTagClose(index) {
        this.chooseGroup.splice(index, 1);
        this.currentGroup.splice(index, 1);
      },
      reset() {
        this.chooseGroup = [];
        this.currentGroup = [];
        this.$refs.dataTable.setCurrentRow();
      },
      handleFilter() {
        this.getList();
      }
    }

  }
</script>

<style scoped>

</style>
