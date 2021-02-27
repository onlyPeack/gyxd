<template>
  <div>
    <el-row>
      <el-col :span="16">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="账户编号" v-model="listQuery.accountCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="账户名称" v-model="listQuery.accountName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="账户编号">
            <template slot-scope="scope">
              <span>{{scope.row.accountCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账户名称">
            <template slot-scope="scope">
              <span>{{scope.row.accountName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="8">
        已选承担账户：
        <el-tag v-show="chooseCustomer.length>0" closable :disable-transitions="true"
                v-for="(tag,index) in chooseCustomer" :key="index" @close="handleTagClose(index)"
                style="margin-right: 15px;">
          {{tag}}
        </el-tag>
      </el-col>
    </el-row>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {page} from '@/api/erp/crm/customer/index';
  import {getAssignAccount} from '@/api/erp/financial/financialCapitalAccount';
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
        accountCustomer: [],
        listQuery: {
          page: 1,
          limit: 20,
          accountName: undefined,
          accountCode: undefined,
        },
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        getAssignAccount(this.listQuery).then(res=>{
          this.list = res.data.records;
          this.total = res.data.total;
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
          this.chooseCustomer = [val.accountName];
          this.accountCustomer = [val];
        }
      },
      onSubmit(row) {
        this.$emit('closeAccountDialog', this.accountCustomer)
      },
      handleTagClose(index) {
        this.chooseCustomer.splice(index, 1);
        this.accountCustomer.splice(index, 1);
      },
      reset() {
        this.chooseCustomer = [];
        this.accountCustomer = [];
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
