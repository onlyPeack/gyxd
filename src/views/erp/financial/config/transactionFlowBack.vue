<template>
  <div class="app-container calendar-list-container sales-summary-list-container bill-container">
    <el-tabs v-model="selectType">
      <el-tab-pane label="员工资金账户" name="1">
        <!-- 查询和其他操作 -->
        <div class="filter-container staff-account-filter-container">
          <div>
            <span style="color: red">此单据会操作资金，未经允许不可操作！</span>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="ID"
                      @keyup.enter.native="handleFilter" v-model="listQuery.id">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户"
                      @keyup.enter.native="handleFilter" v-model="listQuery.accountCode">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="交易单号"
                      @keyup.enter.native="handleFilter" v-model="listQuery.orderNo">
            </el-input>
            <div style="float: right;">
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>

            </div>
          </div>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" key="resultTable1"
                  :default-sort="{prop: 'accountCode', order: 'descending'}">
          <el-table-column align="center" type="index" label="序号">
          </el-table-column>
          <el-table-column align="center" label="类别(1员工，2客户，3供应商，4银行，5库存商品，6其它)" prop="type" sortable>
          </el-table-column>
          <el-table-column align="center" label="账户编号" prop="accountCode" sortable>
          </el-table-column>
          <el-table-column align="left" label="账户名称" prop="accountName" sortable>
          </el-table-column>
          <el-table-column align="right" label="交易金额" prop="amount" sortable>
            <template slot-scope="scope">
              {{Number(scope.row.amount).toFixed(4)}}
            </template>
          </el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
  import { backFunds } from '@/api/erp/financial/financialTransactionFlow'

  export default {
    name: 'transactionFlowBack',
    data() {
      return {
        downloadLoading: false,
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          orderNo: undefined,
          accountCode: undefined
        },
        selectType: '1'
      }
    },
    created() {
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('staff-account-filter-container')[0]) {
          if (this.selectType == '1') {
            var height = document.getElementsByClassName('staff-account-filter-container')[0].clientHeight
          } else {
            var height = document.getElementsByClassName('staff-account-filter-container')[1].clientHeight
          }
        } else {
          height = 48
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        backFunds(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    },
    computed: {},
    watch: {
      selectType: {
        handler(val) {
          if (val == '1') {
            this.getList()
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-summary-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }
</style>
