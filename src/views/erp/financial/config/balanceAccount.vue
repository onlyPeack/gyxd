<template>
  <div class="app-container calendar-list-container sales-summary-list-container">
    <el-tabs v-model="listQuery.selectType">
      <el-tab-pane label="员工资金账户" name="1">
      </el-tab-pane>
      <el-tab-pane label="客户资金账户" name="2">
      </el-tab-pane>
      <el-tab-pane label="供应商资金账户" name="3">
      </el-tab-pane>
      <el-tab-pane label="银行资金账户" name="4">
      </el-tab-pane>
      <el-tab-pane label="库存商品资金账户" name="5">
      </el-tab-pane>
    </el-tabs>
    <!-- 查询和其他操作 -->
    <div class="filter-container sales-summary-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.accountId">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.accountName">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit">导出</el-button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <!--按单品、按商品-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" key="resultTable1">
      <el-table-column align="center" label="账户号" prop="accountId">
      </el-table-column>
      <el-table-column align="right" label="账户名称" prop="accountName">
      </el-table-column>
      <el-table-column align="right" label="账户余额" prop="amount">
      </el-table-column>
      <el-table-column align="right" label="可用余额" prop="availableAmount">
      </el-table-column>
      <el-table-column align="right" label="账户状态" prop="status">
      </el-table-column>
      <el-table-column align="right" label="备注" prop="note">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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
  import {page} from '@/api/erp/financial/financialCapitalAccount';

  export default {
    name: 'salesDetailList',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          accountId:undefined,
          accountName:undefined,
          selectType:"1"
        },
        billDate: undefined,
        brandList: [],
        categoryList: [],
      }
    },
    created() {
      this.init();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('sales-summary-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-summary-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
    },
    computed: {
      selectType() {
        return this.listQuery.selectType;
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
      selectType: {
        handler() {
          this.getList();
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
