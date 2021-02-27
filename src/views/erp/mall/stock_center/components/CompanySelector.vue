<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="客户名称" v-model="listQuery.companyName">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit">
        <el-table-column align="center" label="客户编号">
          <template slot-scope="scope">
            <span>{{scope.row.userCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户名称">
          <template slot-scope="scope">
            <span>{{scope.row.companyName}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="8">
      已选客户：
      <el-tag v-show="chooseCompany.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseCompany" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {selectPage as page} from '@/api/erp/mall/scs/company';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseCompany: [],
        currentCompany: [],
        listQuery: {
          page: 1,
          limit: 20,
          companyName:undefined
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
        if(val){
          if (this.isSingle) {
            this.chooseCompany = [val.companyName];
            this.currentCompany = [val];
          } else {
            for (var i in this.chooseCompany) {
              if (this.chooseCompany[i] == val.companyName) {
                return;
              }
            }
            this.chooseCompany.push(val.companyName);
            this.currentCompany.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeCompanyDialog', this.currentCompany)
      },
      handleTagClose(index) {
        this.chooseCompany.splice(index, 1);
        this.currentCompany.splice(index, 1);
      },
      reset() {
        this.chooseCompany = [];
        this.currentCompany = [];
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
