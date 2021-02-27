<template>
  <div>
    <el-row>
      <el-col :span="18">
        <div class="filter-container">
          <el-input style="width: 200px;" class="filter-item" placeholder="客户编号" v-model="listQuery.customerCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="客户名称" v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="业务员姓名" v-model="listQuery.managerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="业务员工号" v-model="listQuery.managerCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input style="width: 200px;" class="filter-item" placeholder="业务员部门" v-model="listQuery.departName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleFilter">
            搜索
          </el-button>
          <el-button class="filter-item" type="danger" icon="search" style="margin-left: 10px;" @click="handleReset">
            重置
          </el-button>
        </div>
        <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                  @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit"
                  height="50vh">
          <el-table-column align="center" label="客户编号">
            <template slot-scope="scope">
              <span>{{scope.row.customerCode}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="客户名称">
            <template slot-scope="scope">
              <span>{{scope.row.customerName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="业务员" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.managerCode}}-{{scope.row.managerName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="部门">
            <template slot-scope="scope">
              <span>{{scope.row.departName}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="6" v-if="!isSingle">
        已选客户：
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
          customerName: undefined
        },
      };
    },
    created() {
      this.$nextTick(() => {
        this.getList();
      })
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
        this.$emit('closeCustomerDialog', this.currentCustomer)
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
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
        }
        this.getList();
      }
    }

  }
</script>

<style scoped>

</style>
