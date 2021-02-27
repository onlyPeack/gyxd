<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
        </el-input>

        <div></div>
<!--        <div style="display: inline-block" @click="salerUserVisible=true">-->
<!--        </div>-->
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
      <el-table-column align="center" label="采购订单号" prop="billNo" width="170"></el-table-column>
      <el-table-column align="right" label="供应商编号" prop="supplierCode" sortable></el-table-column>
      <el-table-column align="right" label="供应商名称" prop="supplierName" width="150"></el-table-column>
      <el-table-column align="center" label="员工" prop="userNo"></el-table-column>
      <el-table-column align="center" label="员工姓名" prop="userName"></el-table-column>
      <el-table-column align="right" label="部门" prop="departName"></el-table-column>
      <el-table-column align="right" label="订单金额" prop="orderAmount" sortable></el-table-column>
      <el-table-column align="right" label="已付款金额" prop="payedAmount" sortable></el-table-column>
      <el-table-column align="right" label="退款金额" prop="refundMoneyAmount" sortable></el-table-column>
      <el-table-column align="right" label="收票金额" prop="invoiceAmount" sortable></el-table-column>
      <el-table-column align="right" label="订单数量" prop="orderQty" sortable></el-table-column>
      <el-table-column align="right" label="供应商发货数量" prop="deliverQty" sortable width="150"></el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInQty" sortable></el-table-column>
      <el-table-column align="right" label="退货数量" prop="refundQty" sortable></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>
    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <sales-user-selector @closeUserDialog="closeUserDialog" :isSingle="false"
                           ref="salerUser"></sales-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSalerUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSalerUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {page} from '@/api/erp/analysis/purchase/purchaseOrder';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'purchaseOrder',
    components:{
      'sales-user-selector': () => import('@/components/ERP/User/user'),
    },
    data() {
      return {
        clientHeight: 300,
        salerUserVisible:false,
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
            if (column.label === '订单金额' || column.label === '已付款金额' ||column.label === '退款金额'||column.label==='收票金额'||column.label==='订单数量'||column.label==='供应商发货数量'||column.label==='入库数量'||column.label==='退货数量') {
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

      /**
       * 表格导出
       */
      excelTable(){
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader=[];
          var filterVal=[];
          var list = [...this.list]
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
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购订单综合分析表');
        })
        //console.log(this.$refs['analysisTable'],'导出')
      },

      closeUserDialog(list) {
        this.salerArr = list
        this.salerUserVisible = false
        let userNos = []
        let userNames = []
        for (let i = 0; i < list.length; i++) {
          userNos.push(list[i].no)
          userNames.push(list[i].name)
        }
        this.listQuery.userNo = userNos.toString()
        this.listQuery.userName = userNames.toString()
      },

      handleCancelSalerUser() {
        this.$refs.salerUser.reset();
        this.salerUserVisible = false;
      },

      handleSubmitSalerUser() {
        this.$refs.salerUser.onSubmit();
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
