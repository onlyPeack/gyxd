<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <div @click="customerVisible=true" style="display: inline-block">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                    @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
          </el-input>
        </div>

        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
<!--        <div style="display: inline-block" @click="salerUserVisible=true">-->
<!--          <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"-->
<!--                    @keyup.enter.native="handleFilter" v-model="listQuery.userNo">-->
<!--          </el-input>-->
<!--        </div>-->
<!--        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"-->
<!--                  @keyup.enter.native="handleFilter" v-model="listQuery.userName">-->
<!--        </el-input>-->
<!--        <div style="display: inline-block" @click="departVisible=true">-->
<!--          <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务部门"-->
<!--                    @keyup.enter.native="handleFilter" v-model="listQuery.departName">-->
<!--          </el-input>-->
<!--        </div>-->
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download">导出</el-button>
        </div>
      </div>
      <div>
        <div style="display: inline-block" @click="showBrandSelector=true">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
          </el-input>
        </div>
        <div style="display: inline-block" @click="seriesVisible=true">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
          </el-input>
        </div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
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
        <el-input type="textarea" clearable class="filter-item" style="width: 190px;" placeholder="请输入订货号,多个订货号请输入回车键隔开" @keyup.enter.native="handleFilter"
                  v-model="listQuery.itemNo"></el-input>
      </div>
    </div>
<!--    <div style="float: right">-->
<!--      <el-switch v-model="isChart" active-text="图表"></el-switch>-->
<!--    </div>-->
    <div style="height: 30px"></div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              v-if="!isChart"
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column align="left" label="订单状态" prop="status" v-slot="{row}">
        <span>{{conversionType[row.status]}}</span>
      </el-table-column>
      <el-table-column align="right" label="总订单数" prop="count" sortable></el-table-column>
      <el-table-column align="right" label="关闭订单数" prop="closeCount" sortable></el-table-column>
      <el-table-column align="right" label="订单关闭率" prop="salesmanNo" sortable v-slot="{row}">
        <span>{{toPercent((division(row.closeCount,row.count)).toFixed(4))}}</span>
      </el-table-column>
      <el-table-column align="right" label="订单转化率" prop="orderProbability" sortable v-slot="{row}">
        <span>{{toPercent((division(row.count,orderSum)).toFixed(4))}}</span>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;" v-if="!isChart">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>
    <div style="height: 615px;" v-if="isChart" class="chart">
      <div>
        <span>待支付 {{division(list[0].totalAmount,10000).toFixed(2)+'万'}}</span>
        <span class="analysis">总订单数： {{Number(list[0].count).toFixed(0)}}</span>
        <span class="analysis">关闭订单数： {{Number(list[0].closeCount).toFixed(0)}}</span>
        <span class="analysis">订单关闭率： {{toPercent((division(list[0].closeCount,list[0].count)||0).toFixed(4))}}</span>
        <span class="analysis">订单转化率： {{toPercent((division(list[0].count,orderSum)||0).toFixed(4))}}</span>
      </div>
      <div>
        <span>部分支付 {{division(list[1].totalAmount,10000).toFixed(2)+'万'}}</span>
        <span class="analysis">总订单数： {{Number(list[1].count).toFixed(0)}}</span>
        <span class="analysis">关闭订单数： {{Number(list[1].closeCount).toFixed(0)}}</span>
        <span class="analysis">订单关闭率： {{toPercent((division(list[1].closeCount,list[1].count)||0).toFixed(4))}}</span>
        <span class="analysis">订单转化率： {{toPercent((division(list[1].count,orderSum)||0).toFixed(4))}}</span>
      </div>
      <div>
        <span>待审核 {{division(list[2].totalAmount,10000).toFixed(2)+'万'}}</span>
        <span class="analysis">总订单数： {{Number(list[2].count).toFixed(0)}}</span>
        <span class="analysis">关闭订单数： {{Number(list[2].closeCount).toFixed(0)}}</span>
        <span class="analysis">订单关闭率： {{toPercent((division(list[2].closeCount,list[2].count)||0).toFixed(4))}}</span>
        <span class="analysis">订单转化率： {{toPercent((division(list[2].count,orderSum)||0).toFixed(4))}}</span>
      </div>
      <div>
        <span>待发货 {{division(list[3].totalAmount,10000).toFixed(2)+'万'}}</span>
        <span class="analysis">总订单数： {{Number(list[3].count).toFixed(0)}}</span>
        <span class="analysis">关闭订单数： {{Number(list[3].closeCount).toFixed(0)}}</span>
        <span class="analysis">订单关闭率： {{toPercent((division(list[3].closeCount,list[3].count)||0).toFixed(4))}}</span>
        <span class="analysis">订单转化率： {{toPercent((division(list[3].count,orderSum)||0).toFixed(4))}}</span>
      </div>
      <div>
        <span>已出库 {{division(list[4].totalAmount,10000).toFixed(2)+'万'}}</span>
        <span class="analysis">总订单数： {{Number(list[4].count).toFixed(0)}}</span>
        <span class="analysis">关闭订单数： {{Number(list[4].closeCount).toFixed(0)}}</span>
        <span class="analysis">订单关闭率： {{toPercent((division(list[4].closeCount,list[4].count)||0).toFixed(4))}}</span>
        <span class="analysis">订单转化率： {{toPercent((division(list[4].count,orderSum)||0).toFixed(4))}}</span>
      </div>
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

    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="departVisible" append-to-body>
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="depart" :isSingle="true"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitDepart" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body v-if="reloadDialog">
      <customer-selector
        @closeCustomerDialog="closeCustomerDialog"
        :isSingle="false"
        ref="customer"
      ></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="请选择品牌" :visible.sync="showBrandSelector" append-to-body width="60%">
      <!--    品牌选择弹窗-->
      <brand-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" :isSingle="false"
                      @closeCustomerDialog="handleSubmitPublic" ref="brandSelector"></brand-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBrandSelector=false">取 消</el-button>
        <el-button type="primary" @click="brandSelectSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 系列弹窗-->
    <el-dialog title="请选择系列" width="40%" :visible.sync="seriesVisible" append-to-body>
      <series-selector ref="series" @closeSeriesDialog="closeSeriesDialog" :isSingle="false"></series-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSeries">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSeries">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {orderConversion as page } from '@/api/erp/analysis/managementAnalysis'
  import { getFloat } from '@/utils/util'
  import {conversionType} from '../../../../dic'

  export default {
    name: 'orderConversion',
    components: {
      'sales-user-selector': () => import('@/components/ERP/User/user'),
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      "customer-selector": () => import("@/components/ERP/Customer/customerSelector"),
      'brandSelector': () => import('@/views/erp/purchase/supplier/components/brandSelector'),
      'series-selector': () => import('@/views/erp/sales/components/seriesSelector')
    },
    data() {
      return {
        clientHeight: 300,
        salerUserVisible: false,
        seriesVisible:false,
        departVisible: false,
        reloadDialog:false,
        customerVisible:false,
        showBrandSelector:false,
        conversionType,
        orderSum:0,
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
        isChart: false,
        orderTypeMap: {
          10: '待支付',
          20: '部分支付',
          25: '待审核',
          30: '待发货',
          40: '已出库'
        },
        chartData: [],
        listQuery: {
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerCode: undefined,
          customerName: undefined,
          userNo: undefined,
          userName: undefined,
          departName: undefined,
          page: 1,
          limit: 20
        }
      }
    },
    created() {
      var Date1 = new Date();
      var Date7 = new Date(Date1.getTime() - 168 * 60 * 60 * 1000);
      this.listQuery.endDate = Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate() + ' 00:00:00';
      this.listQuery.beginDate = Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate() + ' 23:59:59';
      this.billDate = [Date7.getFullYear() + '-' + (Date7.getMonth() + 1) + '-' + Date7.getDate(), Date1.getFullYear() + '-' + (Date1.getMonth() + 1) + '-' + Date1.getDate()]
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleReset() {
        this.listQuery={}
        this.billDate=[]
        this.reloadDialog=false
        this.$nextTick(()=>{
          this.reloadDialog=true
        })
        this.getList();
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight
        } else {
          height = 76
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.87
      },
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          //this.chartData = []
          let trueArr=[]
          for (let i = 0; i <response.length ; i++) {
            if(response[i].status!=='9'&&response[i].status!=='10'&&response[i].status!=='11'){
              response[i].count=Number(response[i].count)
              response[i].closeCount=Number(response[i].closeCount||0)
              this.orderSum+=response[i].count
              trueArr.push(response[i])
            }
          }
          this.list = trueArr
          this.total = response.length
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
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'outAmount' || column.property == 'checkAmount' || column.property == 'profit') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              sums[index] += ' '
            }
            // 出库金额合计
            if (column.property == 'outAmount') {
              this.totalAmount = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              this.totalAmount += ' '
            }
            if (column.property == 'profit') {
              this.totalProfit = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              this.totalProfit += ' '
            }
            if (column.property == 'profitRate') {
              sums[index] = (Number(this.totalProfit) / Number(this.totalAmount) * 100).toFixed(2)
              sums[index] += ' '
            }
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品', '客户', '业务员工号', '业务员姓名', '单位', '出库单价', '出库数量', '出库金额', '退库单价', '退库数量', '退库金额']
          const filterVal = ['skuName', 'customerName', 'crtUserNo', 'salerName', 'unit', 'stockOutPrice', 'stockOutQty', 'stockOutAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售明细')
          this.downloadLoading = false
        })
      },

      closeUserDialog(list) {
        this.salerArr = list
        this.salerUserVisible = false
        let userNos = []
        let userNames=[]
        for (let i = 0; i < list.length; i++) {
          userNos.push(list[i].no)
          userNames.push(list[i].name)
        }
        this.listQuery.userNo = userNos.toString()
        this.listQuery.userName = userNames.toString()
      },

      handleCancelSalerUser() {
        this.$refs.salerUser.reset()
        this.salerUserVisible = false
      },

      handleSubmitSalerUser() {
        this.$refs.salerUser.onSubmit()
      },

      closeDepartDialog(depart) {
        // if (depart.id) {
        //   this.dataForm.payOrgName = depart.label;
        //   this.dataForm.payOrgId = depart.id;
        //   this.departArr = [{name: depart.label, id: depart.id}];
        // }
        let departNos = []
        // console.log(depart)
        for (let i = 0; i <depart.checkedNodes.length ; i++) {
          departNos.push(depart.checkedNodes[i].label)
        }
        this.listQuery.departName = departNos.toString()
        //console.log(this.listQuery.departName,'departNo')
        this.departVisible = false
      },

      handleSubmitDepart() {
        this.$refs.depart.onSubmit()
      },

      closeCustomerDialog(list) {
        // 单选
        this.customerVisible = false;
        let customNo=[]
        let customName=[]
        for (let i = 0; i <list.length ; i++) {
          customNo.push(list[i].customerCode)
          customName.push(list[i].customerName)
        }
        this.listQuery.customerCode=customNo.toString()
        this.listQuery.customerName=customName.toString()
      },

      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },

      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
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
            list[i].analysisType=this.orderTypeMap[list[i].analysisType]
            list[i].count=Number(list[i].count).toFixed(0)
            list[i].closeCount=Number(list[i].closeCount).toFixed(0)
            list[i].salesmanNo=this.toPercent((this.division(list[i].closeCount,list[i].count)||0).toFixed(4))
            list[i].orderProbability=this.toPercent((this.division(list[i].count,this.orderSum)||0).toFixed(4))
            //list[i].stockInProfitPercent=this.toPercent(this.division(list[i].stockInProfitPercent,100).toFixed(4))
          }
          for (let i = 0; i <this.$refs['analysisTable'].columns.length ; i++) {
            tHeader.push(this.$refs['analysisTable'].columns[i].label)
            if(i===0){
              filterVal.push('index')
            }else{
              filterVal.push(this.$refs['analysisTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '订单转化分析表');
        })
        //console.log(this.$refs['analysisTable'],'导出')
      },

      /**
       * 从子组件中接收的提交方法
       * @param list
       */
      handleSubmitPublic(list) {
        let arr = []
        for (let i = 0; i < list.length; i++) {
          arr.push(list[i].name)
        }
        this.showBrandSelector = false
        this.$set(this.listQuery, 'brandName', arr.toString())
      },

      brandSelectSubmit() {
        this.$refs['brandSelector'].onSubmit()
      },

      closeSeriesDialog(list) {
        if (list.length > 0) {
          let arr = []
          for (let i = 0; i < list.length; i++) {
            arr.push(list[i].name)
          }
          this.$set(this.listQuery, 'seriesName', arr.toString())
        }
        this.seriesVisible = false;
      },

      handleCancelSeries() {
        this.$refs.series.reset();
        this.seriesVisible = false;
      },

      handleSubmitSeries() {
        this.$refs.series.onSubmit();
      }
    },
    watch: {
      billDate(val) {
        if (val == null) {
          this.listQuery.startBillDate = undefined
          this.listQuery.endBillDate = undefined
        } else {
          this.listQuery.beginDate = val[0] + ' 00:00:00'
          this.listQuery.endDate = val[1] + ' 23:59:59'
        }
        this.handleFilter()
      }
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

  .chart {
    background-image: url('http://gxcl-shop.qiniu.520mro.com/39v4vmqu4hoag6r860ih.jpg');
    background-repeat: no-repeat;
    background-position: left;
    background-size: 128%;
    padding-top: 6.5%;
    width: 90%;
    margin: 0 auto;
  }

  .chart > div {
    margin: 0 auto;
    width: 100%;
    color: white;
    height: 76px;
    font-size: 25px;
    line-height: 76px;
  }

  .chart > div > span {
    display: inline-block;
    width: 26%;
    text-align: center;
  }

  .chart > div > .analysis {
    color: black;
    font-size: 21px;
    text-align: left;
    width: 16%;
  }
</style>
