<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                  @keyup.enter.native="handleFilter" v-model="listQuery.userName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                  @keyup.enter.native="handleFilter" v-model="listQuery.departName">
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
      <el-table-column align="right" label="供应商编号" prop="supplierCode" sortable></el-table-column>
      <el-table-column align="right" label="供应商名称" prop="supplierName"></el-table-column>
      <el-table-column align="right" label="采购毛利" prop="purchaseProfit"></el-table-column>
      <el-table-column align="right" label="销售毛利" prop="saleProfit"></el-table-column>
      <el-table-column align="right" label="总贡献值" prop="purchaseAmount" sortable></el-table-column>
      <el-table-column align="right" label="供应商库存" prop="stockAmount" sortable></el-table-column>
      <el-table-column align="right" label="总占用成本" prop="checkAmount" sortable></el-table-column>
      <el-table-column align="right" label="贡献净值" prop="totalProfit" sortable></el-table-column>
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
  import {page} from '@/api/erp/analysis/purchase/channelAnalysis';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'channelAnalysis',
    data() {
      return {
        clientHeight: 300,
        analysisOptions: [
          {
            value: '10',
            label: '采购日'
          },
          {
            value: '20',
            label: '采购周'
          },
          {
            value: '30',
            label: '采购月'
          },
          {
            value: '40',
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
          // {
          //   value: '110',
          //   label: '省'
          // },
          // {
          //   value: '120',
          //   label: '市'
          // },
          // {
          //   value: '130',
          //   label: '区'
          // }
        ],
        analysisMap:{
          10:'采购日',
          20:'采购周',
          30:'采购月',
          40:'供应商',
          50:'业务员',
          60:'部门',
          70:'品牌',
          80:'系列',
          90:'型号',
          100:'订货号'
        },
        list: undefined,
        total: undefined,
        listLoading: false,
        analysisIndex: 0,
        billDate: [],
        listQuery: {
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerCode: undefined,
          customerName: undefined,
          userName: undefined,
          departName: undefined,
          page: 1,
          analysisType:'10',
          limit:20,
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
        this.listQuery={}
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
          if (!values.every(value => isNaN(value))) {
            if (column.label === '采购毛利' || column.label === '销售毛利' ||column.label === '总贡献值'||column.label === '供应商库存'||column.label === '总占用成本'||column.label === '贡献净值') {
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

      /**
       * 表格导出
       */
      excelTable(){
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader=[];
          var filterVal=[];
          var list = this.list.map(o => ({...o}))
          for (let i = 0; i <list.length ; i++) {
            list[i].index=i+1
          }
          for (let i = 0; i <this.$refs['analysisTable'].columns.length ; i++) {
            tHeader.push(this.$refs['analysisTable'].columns[i].label)
            if(i===0){
              filterVal.push('index')
            }else{
              filterVal.push(this.$refs['analysisTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '渠道贡献分析表');
        })
        //console.log(this.$refs['analysisTable'],'导出')
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
