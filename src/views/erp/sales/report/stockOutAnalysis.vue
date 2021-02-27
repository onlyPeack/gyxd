<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
         <el-select v-model="listQuery.analysisType" placeholder="分析类型" clearable style="width: 200px;"
                   class="filter-item" @change="handleFilter" filterable>
          <el-option v-for="item in analysisOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
       </div>
       <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务部门"
                  @keyup.enter.native="handleFilter" v-model="listQuery.departNo">
        </el-input>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          @change="handleFilter"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="left" :label="analysisOptions[analysisIndex].label" prop="analysisType">
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="outAmount" sortable>
        <template slot-scope="scope" v-if="scope.row.outAmount">
          {{scope.row.outAmount.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="成本金额" prop="checkAmount" sortable>
        <template slot-scope="scope" v-if="scope.row.checkAmount">
          {{scope.row.checkAmount.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="毛利" prop="profit" class-name="col-required" sortable>
         <template slot-scope="scope">
          {{scope.row.profit.toFixed(4)||0}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="毛利率" prop="profitRate" sortable>
        <template slot-scope="scope" v-if="scope.row.profitRate">
          {{scope.row.profitRate.toFixed(2)}}
        </template>
      </el-table-column>

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
  import {page, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/wms/config/warehouse';
  import {listCatAndBrand} from '@/api/erp/goods/goods';
  import {findAnalysisList} from '@/api/erp/wms/bill/stockOutAnalysis';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'stockOutAnalysis',
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
          },
          {
            value: '110',
            label: '省'
          },
          {
            value: '120',
            label: '市'
          },
          {
            value: '130',
            label: '区'
          }
        ],
        list: undefined,
        total: undefined,
        listLoading: false,
        analysisIndex: 0,
        billDate: [],
        listQuery: {
          analysisType: '10',
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerCode: undefined,
          customerName: undefined,
          userName: undefined,
          departName: undefined,
          page: 1,
          // limit: 1000,
          billNo: undefined,
          salerName: undefined,
          crtUserNo: undefined,
          userNo: undefined,
        }
      }
    },
    created() {
      var Date1 = new Date();
      var Date7 = new Date(Date1.getTime() - 168 * 60 * 60 * 1000);
      this.listQuery.endDate = Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate() + ' 00:00:00';
      this.listQuery.beginDate = Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate() + ' 23:59:59';
      this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate(), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate()]
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
        var Date1 = new Date();
        var Date7 = new Date(Date1.getTime() - 168 * 60 * 60 * 1000);
        this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate(), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate()]
        this.listQuery = {
          endDate: Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate() + ' 00:00:00',
          beginDate: Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate() + ' 23:59:59',
          analysisType: '10',
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerCode: undefined,
          customerName: undefined,
          userName: undefined,
          billNo: undefined,
          departName: undefined,
          page: 1,
          limit: 1000,
          salerName: undefined,
          crtUserNo: undefined,
          userNo: undefined,
          totalAmount:undefined,
          totalProfit:undefined,
        }
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
        findAnalysisList(this.listQuery).then(response => {
          for(let i in response.data){
            response.data[i].outAmount = parseInt(response.data[i].outAmount);
            response.data[i].checkAmount = parseInt(response.data[i].checkAmount)
            response.data[i].profit = parseInt(response.data[i].profit)
            response.data[i].profitRate = Number(response.data[i].profitRate)
          }
          this.list = response.data;
          this.total = response.data.length;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        for (let i in this.analysisOptions) {
          if (this.listQuery.analysisType == this.analysisOptions[i].value) {
            this.analysisIndex = i;
          }
        }
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
            if (column.property == 'outAmount' || column.property == 'checkAmount' ||column.property == 'profit') {
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
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品', '客户', '业务员工号', '业务员姓名', '单位', '出库单价', '出库数量', '出库金额', '退库单价', '退库数量', '退库金额'];
          const filterVal = ['skuName', 'customerName', 'crtUserNo', 'salerName', 'unit', 'stockOutPrice', 'stockOutQty', 'stockOutAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售明细');
          this.downloadLoading = false;
        })
      },
    },
    watch: {
      billDate(val) {
        if (val == null) {
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
