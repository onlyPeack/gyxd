<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="等级名称" v-model="listQuery.name">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit">
        <el-table-column align="center" label="序号" type="index"></el-table-column>
        <el-table-column align="center" label="等级名称" prop="name"></el-table-column>
        <el-table-column align="center" label="商品价格折扣率" prop="discount"></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="8">已选：
      <el-tag v-show="chooseObject.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseObject" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/crm/customerGrade';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseObject: [],
        currentObject: [],
        listQuery: {
          status: 0,//启用
          name: undefined,
          page: 1,
          limit: 20,
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
            this.list = response.data.records;
            this.total = response.data.total;
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
        if (val) {
          if (this.isSingle) {
            this.chooseObject = [val.name];
            this.currentObject = [val];
          } else {
            for (var i in this.chooseObject) {
              if (this.chooseObject[i] == val.name) {
                return;
              }
            }
            this.chooseObject.push(val.name);
            this.currentObject.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeCustomerGradeDialog', this.currentObject)
      },
      handleTagClose(index) {
        this.chooseObject.splice(index, 1);
        this.currentObject.splice(index, 1);
      },
      reset() {
        this.chooseObject = [];
        this.currentObject = [];
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
