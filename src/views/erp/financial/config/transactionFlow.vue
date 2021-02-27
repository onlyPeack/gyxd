<template>
  <div class="app-container calendar-list-container sales-summary-list-container">
    <el-tabs v-model="listQuery.selectType">
      <el-tab-pane label="员工交易记录" name="1">
      </el-tab-pane>
      <el-tab-pane label="客户交易记录" name="2">
      </el-tab-pane>
      <el-tab-pane label="供应商交易记录" name="3">
      </el-tab-pane>
      <el-tab-pane label="银行交易记录" name="4">
      </el-tab-pane>
      <el-tab-pane label="库存商品交易记录" name="5">
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
  import {page} from '@/api/erp/financial/financialTransactionFlow';

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
          tradePlace:undefined,
          startTradeDate:'',
          endTradeDate:'',
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
        this.listQuery.startTradeDate = val[0];
        this.listQuery.endTradeDate = val[1];
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
          this.listQuery.startTradeDate = '';
          this.listQuery.endTradeDate = '';
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
