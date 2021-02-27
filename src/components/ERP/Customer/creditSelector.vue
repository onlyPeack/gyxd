<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="名称或编号">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit">
        <el-table-column align="center" label="序号" type="index"></el-table-column>
        <el-table-column align="center" label="客户编号" prop="customerCode"></el-table-column>
        <el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
        <el-table-column align="center" label="信用额度" prop="creditLimit"></el-table-column>
        <el-table-column align="center" label="占用额度" prop="limitUsed"></el-table-column>
      </el-table>
    </el-col>
    <el-col :span="8">已选：
      <el-tag v-show="chooseCustomer.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseCustomer" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/crm/creditLimit';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseCustomer: [],
        currentCustomer: [],
        listQuery: {
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
        if (val) {
          if (this.isSingle) {
            this.chooseCustomer = [val.customerName];
            this.currentCustomer = [val];
          } else {
            for (var i in this.chooseCustomer) {
              if (this.chooseCustomer[i] == val.customerName) {
                return;
              }
            }
            this.chooseCustomer.push(val.customerName);
            this.currentCustomer.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeCreditDialog', this.currentCustomer)
      },
      handleTagClose(index) {
        this.chooseCustomer.splice(index, 1);
        this.currentCustomer.splice(index, 1);
      },
      reset() {
        this.chooseCustomer = [];
        this.currentCustomer = [];
        this.$refs.dataTable.setCurrentRow();
      },
    }

  }
</script>

<style scoped>

</style>
