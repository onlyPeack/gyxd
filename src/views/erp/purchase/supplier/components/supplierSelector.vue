<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="名称或编号" :disabled="!!isDisabled" v-model="listQuery.key">
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">搜索</el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit">
        <el-table-column align="center" label="供应商编号">
          <template slot-scope="scope">
            <span>{{scope.row.supplierCode}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="供应商名称">
          <template slot-scope="scope">
            <span>{{scope.row.supplierName}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-col>
    <el-col :span="8">
      已选供应商：
      <el-tag v-show="chooseSupplier.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseSupplier" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
  </el-row>
</template>

<script>
  import {page} from '@/api/erp/purchase/supplier/index';

  export default {
    //isSingle是否为单选 true单选、false多选
    props: ['isSingle','supplierName','selectType'],
    data() {
      return {
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseSupplier: [],
        currentSupplier: [],
        listQuery: {
          page: 1,
          limit: 10,
          key:''
        },
        isDisabled:false
      };
    },
    created() {
      this.getList();
      if(this.supplierName) {
        this.listQuery.key = this.supplierName;
        this.isDisabled = true;
      }
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
            this.chooseSupplier = [val.supplierName];
            this.currentSupplier = [val];
          } else {
            for (var i in this.chooseSupplier) {
              if (this.chooseSupplier[i] == val.supplierName) {
                return;
              }
            }
            this.chooseSupplier.push(val.supplierName);
            this.currentSupplier.push(val);
          }
        }
      },
      onSubmit(row) {
        this.$emit('closeSupplierDialog', this.currentSupplier)
      },
      handleTagClose(index) {
        this.chooseSupplier.splice(index, 1);
        this.currentSupplier.splice(index, 1);
      },
      reset() {
        this.chooseSupplier = [];
        this.currentSupplier = [];
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
