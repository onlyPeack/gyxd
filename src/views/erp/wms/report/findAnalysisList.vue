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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseId">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.series">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <div></div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specModel">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="原归属人工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.oldOwnerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="现归属人工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.ownerCode">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download" :loading="listLoading">导出</el-button>
        </div>
      </div>
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
        </el-input>

        <el-date-picker
          v-model="billDate"
          type="daterange"
          @change="handleFilter"
          align="right"
          style="width: 403px"
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
              highlight-current-row :height="clientHeight" ref="analysisTable"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
<!--      <el-table-column type="selection" width="60" align="center"></el-table-column>-->
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column align="left" :label="analysisOptions[analysisIndex].label" prop="analysisType"></el-table-column>
      <el-table-column align="left" label="数量" prop="transferQty" sortable></el-table-column>
      <el-table-column align="right" label="调拨金额" prop="transferAmt" sortable></el-table-column>
      <el-table-column align="right" label="考核金额" prop="checkAmt" sortable></el-table-column>
      <el-table-column align="right" label="毛利" prop="__profit" class-name="col-required" sortable></el-table-column>
      <el-table-column align="right" label="毛利率" prop="__profitRate" sortable></el-table-column>
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
  import {findAnalysisList} from '@/api/erp/wms/stock_query/index';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'findAnalysisList',
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
            value: '45',
            label: '供应商'
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
            label: '仓库'
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
          series: undefined,
          itemNo: undefined,
          specModel: undefined,
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
      this.listQuery.endDate = Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2,'0') + ' 00:00:00';
      this.listQuery.startDate = Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2,'0') + ' 23:59:59';
      this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2,'0'), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2,'0')]
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
        this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2,'0'), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2,'0')]
        this.listQuery = {
          endDate: Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate().toString().padStart(2,'0') + ' 00:00:00',
          startDate: Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate().toString().padStart(2,'0') + ' 23:59:59',
          analysisType: '10',
          brandName: undefined,
          series: undefined,
          itemNo: undefined,
          specModel: undefined,
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
      async getList() {
        this.listLoading = true;
        await findAnalysisList(this.listQuery).then(response => {
          this.list = response.data;
          for (let i = 0; i <this.list.length ; i++) {
              this.list[i].transferAmt=this.list[i].transferAmt.toFixed(4)
              this.list[i].checkAmt=this.list[i].checkAmt.toFixed(4)
              //毛利=调拨金额-考核金额
              this.list[i].__profit=this.accAdd(this.list[i].transferAmt,-this.list[i].checkAmt).toFixed(4)
              //毛利率= 毛利/调拨金额
              this.list[i].__profitRate=this.division(this.list[i].__profit,this.list[i].transferAmt).toFixed(4)
          }
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
            if (column.property == 'checkAmt' || column.property == 'transferAmt' ||column.property == '__profit'||column.property==='transferQty') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0).toFixed(2);
              sums[index] += ' ';
            }
            // 毛利率
            if (column.property == '__profitRate') {
              let sumProfit=0
              let sumCheckAmt=0
              for (let i = 0; i <this.list.length ; i++) {
                sumProfit=this.accAdd(this.list[i].__profit,sumProfit)
                sumCheckAmt=this.accAdd(this.list[i].transferAmt,sumCheckAmt)
              }
              //console.log(sumProfit,sumCheckAmt,'hjt')
              sums[index] = this.division(sumProfit,sumCheckAmt).toFixed(4)
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
      async excelTable() {
        await this.getList()
        //console.log(this.list,'iswate')
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = this.list.map(o => ({...o}))
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            //list[i].rate=Number(list[i].rate).toFixed(2)
            // list[i].jlr = this.accAdd(list[i].profit, -list[i].warehouseAmount)
            // list[i].jlrl = this.toPercent(this.division(this.accAdd(list[i].profit, -list[i].warehouseAmount), Number(list[i].outAmount)).toFixed(4))
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
          excel.export_json_to_excel2(tHeader, list, filterVal, '库存调拨记录分析');
        })
      },
    },
    watch: {
      billDate(val) {
        if (val == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        } else {
          this.listQuery.startDate = val[0] + ' 00:00:00';
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
