<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
<!--        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"-->
<!--                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">-->
<!--        </el-input>-->
<!--        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"-->
<!--                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">-->
<!--        </el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userName">
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
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download">导出</el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column align="center" label="业务员工号" prop="userNo" width="100"></el-table-column>
      <el-table-column align="center" label="业务员名称" prop="userName" width="100"></el-table-column>
      <el-table-column align="right" label="当月销售额" prop="monthAmount" sortable width="240"></el-table-column>
      <el-table-column align="right" label="出库毛利" prop="profit" sortable></el-table-column>
      <el-table-column align="right" label="出库毛利率" prop="profitPercent" sortable v-slot="{row}">
        <span>{{toPercent(division(row.profitPercent,100).toFixed(4))}}</span>
      </el-table-column>
<!--      <el-table-column align="right" label="近84/3销售额" prop="amount84" sortable></el-table-column>-->
      <el-table-column align="right" label="当月退货金额" prop="monthRefundAmount" sortable></el-table-column>
      <el-table-column align="right" label="退货率" prop="invoiceAmount" sortable v-slot="{row}">
        <span>{{toPercent(division(row.monthRefundAmount||0,row.monthAmount||0).toFixed(4))}}</span>
      </el-table-column>
      <el-table-column align="right" label="收发货费用划拨" prop="monthTransferAmount" sortable></el-table-column>
      <el-table-column align="right" label="充值手续费" prop="reChargeAmount" sortable></el-table-column>

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
  import {page} from '@/api/erp/analysis/sales/saleCheckAnalysis';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'saleCheckAnalysis',
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
        this.listQuery={
          page: 1,
          limit:20,
        }
        this.billDate=[]
        this.getList();
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
          // for(let i in response.data){
          //   response.data[i].outAmount = parseInt(response.data[i].outAmount);
          //   response.data[i].checkAmount = parseInt(response.data[i].checkAmount)
          //   response.data[i].profit = parseInt(response.data[i].profit)
          //   response.data[i].profitRate = Number(response.data[i].profitRate)
          // }
          this.list = response;
          this.total = response.length;
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
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
            if (column.property == 'profit'||column.label==='当月销售额'||column.label==='近84/3销售额'||column.label==='当月退货金额'||column.label==='收发货费用划拨'||column.label==='充值手续费') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }else if(column.label==='退货率'){
              let sum1=0
              let sum2=0
              for (let i = 0; i <data.length ; i++) {
                sum1=this.accAdd(data[i].monthRefundAmount,sum1)
                sum2=this.accAdd(data[i].monthAmount,sum2)
              }
              sums[index]=this.toPercent(this.division(sum1,sum2).toFixed(4))
            }else if(column.label==='出库毛利率'){
              let sum1=0
              let sum2=0
              for (let i = 0; i <data.length ; i++) {
                sum1=this.accAdd(data[i].profit,sum1)
                sum2=this.accAdd(data[i].monthAmount,sum2)
              }
              sums[index]=this.toPercent(this.division(sum1,sum2).toFixed(4))
            }
            // 出库金额合计
            if (column.property == 'outAmount') {
              this.totalAmount = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              this.totalAmount += ' ';
            }
            if (column.property == 'profit') {
              this.totalProfit = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              this.totalProfit += ' ';
            }
            if (column.property == 'profitRate') {
              sums[index] = (Number(this.totalProfit)/Number(this.totalAmount)*100).toFixed(2);
              sums[index] += ' ';
            }
        });

        return sums;
      },

      /**
       * 表格导出
       */
      excelTable() {
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = this.list.map(o => ({...o}))
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            list[i].invoiceAmount=this.toPercent(this.division(list[i].monthRefundAmount||0,list[i].monthAmount||0).toFixed(4))
            // list[i].count=Number(list[i].count).toFixed(0)
            // list[i].closeCount=Number(list[i].closeCount).toFixed(0)
            // list[i].salesmanNo=this.toPercent((this.division(this.accAdd(list[i].count,-list[i].closeCount),list[i].count)||0).toFixed(4))
            //list[i].stockInProfitPercent=this.toPercent(this.division(list[i].stockInProfitPercent,100).toFixed(4))
          }
          for (let i = 0; i < this.$refs['analysisTable'].columns.length; i++) {
            tHeader.push(this.$refs['analysisTable'].columns[i].label)
            if (i === 0) {
              filterVal.push('index')
            } else {
              filterVal.push(this.$refs['analysisTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售综合分析表');
        })
      }
    },
    watch: {
      billDate(val) {
        if (val == null || val.length == 0) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
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
