<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>

        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download">导出</el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: '__differAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column align="center" label="客户编号" prop="customerCode" sortable width="100"></el-table-column>
      <el-table-column label="客户名称" prop="customerName" width="250"></el-table-column>
      <el-table-column align="right" label="授信金额" prop="creditAmount" sortable></el-table-column>
      <el-table-column align="right" label="还信金额" prop="returnAmount" sortable></el-table-column>
      <el-table-column align="right" label="应收余额" prop="__ReceivableAmount" sortable></el-table-column>
      <el-table-column align="right" label="账户总金额" prop="accountAmount" sortable></el-table-column>
      <el-table-column align="right" label="差额" prop="__differAmount" sortable></el-table-column>
      <el-table-column align="right" label="销售出库金额" prop="saleOutAmount" sortable></el-table-column>
      <el-table-column align="right" label="直发出库金额" prop="straightOutAmount" sortable></el-table-column>
      <el-table-column align="right" label="销售退库金额" prop="saleReturnGoodsAmount" sortable></el-table-column>
      <el-table-column align="right" label="销售收款金额" prop="saleReceiveAmount" sortable></el-table-column>
      <el-table-column align="right" label="销售退款金额" prop="saleRefundMoneyAmount" sortable></el-table-column>

    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {customerAccountBalance as page} from '@/api/erp/analysis/sales/customerReceivable';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'customerReceivable',
    data() {
      return {
        clientHeight: 300,
        analysisOptions: [
          {
            value: '10',
            label: '销售日'
          },
          {
            value: '20',
            label: '销售周'
          },
          {
            value: '30',
            label: '销售月'
          },
          {
            value: '40',
            label: '客户'
          },
          {
            value: '50',
            label: '业务员'
          },
          {
            value: '60',
            label: '部门'
          },
          {
            value: '70',
            label: '品牌'
          },
          {
            value: '80',
            label: '系列'
          },
          {
            value: '90',
            label: '型号'
          },
          {
            value: '100',
            label: '订货号'
          }
        ],
        list: undefined,
        total: undefined,
        listLoading: false,
        analysisIndex: 0,
        billDate: [],
        listQuery: {
          customerCode: undefined,
          customerName: undefined,
          userNo: undefined,
          userName: undefined,
          beginDate: undefined,
          endDate: undefined,
          page: 1,
          limit:20,

        }
      }
    },
    created() {
      this.listQuery.endDate=this.oneWeek().after
      this.listQuery.beginDate=this.oneWeek().before
      this.billDate=this.oneWeek().arr
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
      handleReset() {
        this.listQuery={}
        this.listQuery.endDate=this.oneWeek().after
        this.listQuery.beginDate=this.oneWeek().before
        this.billDate=this.oneWeek().arr
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.90;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          for (let i = 0; i <response.length ; i++) {
            //应收余额=出库金额+直发出库金额-退库金额-收款金额+退款金额+授信金额-还信金额
            response[i].__ReceivableAmount = Number(Number(response[i].saleOutAmount)+Number(response[i].straightOutAmount)-Number(response[i].saleReturnGoodsAmount)-Number(response[i].saleReceiveAmount))
            response[i].__ReceivableAmount = Number(response[i].__ReceivableAmount+Number(response[i].saleRefundMoneyAmount)+Number(response[i].creditAmount)-Number(response[i].returnAmount)).toFixed(4)
            //差额=应收余额-账户总金额
            response[i].__differAmount=Number(response[i].__ReceivableAmount-response[i].accountAmount).toFixed(4)
          }
          this.list = response;
          this.total = response.length;
          this.listLoading = false;
        }).catch((error) => {
          console.log(error)
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
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.label !== '客户名称' && column.label !== '客户编号') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },

      /**
       * 表格导出
       */
      excelTable(){
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = this.list.map(o => ({...o}))
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
          }
          for (let i = 0; i < this.$refs['analysisTable'].columns.length; i++) {
            tHeader.push(this.$refs['analysisTable'].columns[i].label)
            if (i === 0) {
              filterVal.push('index')
            } else {
              filterVal.push(this.$refs['analysisTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '客户资金平衡表');
        })
      },
    },
    watch: {
      billDate(val) {
        if (val == null) {
          this.listQuery.beginDate = undefined;
          this.listQuery.endDate = undefined;
        } else {
          this.listQuery.beginDate = val[0] + ' 00:00:00';
          this.listQuery.endDate = val[1] + ' 23:59:59';
        }
        this.handleFilter()
      },
    }
  }
</script>

<style lang="scss" scoped>
  .sales-detail-list-container {
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
