<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <div class="filter-container sales-detail-list-filter-container">
      <div>
<!--        <el-select v-model="listQuery.analysisType" placeholder="分析类型" clearable style="width: 200px;"-->
<!--                   class="filter-item" @change="handleFilter" filterable>-->
<!--          <el-option v-for="item in analysisOptions" :key="item.value" :label="item.label"-->
<!--                     :value="item.value"></el-option>-->
<!--        </el-select>-->
        <div @click="handleShowBrand" style="display: inline-block">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
          </el-input>
        </div>
        <div style="display: inline-block" @click="seriesVisible=true">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
          </el-input>
        </div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
        @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
        </el-input>
        <el-input clearable class="filter-item" style="width: 190px;" placeholder="订货号" @keyup.enter.native="handleFilter" v-model="listQuery.itemNo"></el-input>
        <el-input clearable class="filter-item" style="width: 190px;" placeholder="品名" @keyup.enter.native="handleFilter" v-model="listQuery.goodsName"></el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号" @keyup.enter.native="handleFilter" v-model="listQuery.specifications"></el-input>
        <el-input clearable class="filter-item" style="width: 190px;" placeholder="仓库" @keyup.enter.native="handleFilter" v-model="listQuery.warehouse"></el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download">导出</el-button>
        </div>
      </div>
      <div>
<!--        <div @click="customerVisible=true" style="display: inline-block">-->
<!--          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"-->
<!--                    @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">-->
<!--          </el-input>-->
<!--        </div>-->
<!--        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"-->
<!--                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">-->
<!--        </el-input>-->
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
    <!--    <div style="float: right">-->
    <!--      <el-switch v-model="isChart" active-text="图表" @change="drawLine"></el-switch>-->
    <!--    </div>-->
    <div style="height: 30px"></div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight" :show-summary='false' :summary-method="getSummaries">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
<!--      <el-table-column align="right" :label="analysisMap[listQuery.analysisType]" prop="analysisType"></el-table-column>-->
      <el-table-column align="right" label="品名" prop="goodsName"></el-table-column>
      <el-table-column align="right" label="品牌" prop="brandName"></el-table-column>
      <el-table-column align="right" label="标准系列" prop="seriesName"></el-table-column>
      <el-table-column align="right" label="返点系列" prop="rebateSeries"></el-table-column>
      <el-table-column align="right" label="型号" prop="specifications"></el-table-column>
      <el-table-column align="right" label="订货号" prop="itemNo"></el-table-column>
      <el-table-column align="right" label="仓库" prop="warehouse"></el-table-column>
      <el-table-column align="right" label="出库总量" prop="outCount"></el-table-column>
      <el-table-column align="right" label="平均库存" prop="averageCount"></el-table-column>
      <el-table-column align="right" label="库存周转率" prop="rate" sortable v-slot="{row}">
        <span>{{Number(row.rate).toFixed(2)}}</span>
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
    <!--    <div style="height: 650px" v-if="isChart">-->
    <!--      <div id="myChart" :style="{width: '100%', height: '100%'}"></div>-->
    <!--    </div>-->

    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <sales-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
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
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body width="60%" v-if="reloadDialog">
      <customer-selector
        @closeCustomerDialog="closeCustomerDialog"
        :isSingle="true"
        ref="customer"
      ></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="请选择品牌" :visible.sync="showBrandSelector" append-to-body width="60%">
      <!--    品牌选择弹窗-->
      <brand-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" :isSingle="true" :brandList="brandList"
                      @closeCustomerDialog="handleSubmitPublic" ref="brandSelector"></brand-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showBrandSelector=false">取 消</el-button>
        <el-button type="primary" @click="brandSelectSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 系列弹窗-->
    <el-dialog title="请选择系列" width="40%" :visible.sync="seriesVisible" append-to-body>
      <series-selector ref="series" @closeSeriesDialog="closeSeriesDialog" :isSingle="true"></series-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSeries">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSeries">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {page} from '@/api/erp/analysis/storage/stockTurnover';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'stockTurnover',
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
        isChart: false,
        salerUserVisible: false,
        departVisible: false,
        customerVisible: false,
        seriesVisible: false,
        reloadDialog:true,
        showBrandSelector: false,
        chartX: [],
        chartY: [],
        analysisOptions: [
          {
            value: '10',
            label: '业务员'
          },
          {
            value: '20',
            label: '品牌'
          },
          {
            value: '30',
            label: '系列'
          },
          {
            value: '40',
            label: '型号'
          },
          {
            value: '50',
            label: '订货号'
          },
          {
            value: '60',
            label: '仓库'
          },
          {
            value: '70',
            label: '客户'
          },
          {
            value: '80',
            label: '供应商'
          },
          {
            value: '90',
            label: '库存类型'
          }
        ],
        analysisMap: {
          10: '业务员',
          20: '品牌',
          30: '系列',
          40: '型号',
          50: '订货号',
          60: '仓库',
          70: '客户',
          80: '供应商',
          90: '库存类型'
        },
        list: undefined,
        total: undefined,
        listLoading: false,
        analysisIndex: 0,
        billDate: [],
        brandList:[],
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
          limit: 20,
          billNo: undefined,
          salerName: undefined,
          crtUserNo: undefined,
          userNo: undefined,
          // analysisType: '10'
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
      handleShowBrand() {
        this.showBrandSelector = true;
        console.log(this.listQuery.brandName);
        if(!!this.listQuery.brandName) {
          this.brandList = []
          this.listQuery.brandName.split(',').forEach(item => {
            this.brandList.push({
              name:item
            })
          })
        }
      },
      handleReset() {
        this.listQuery = {}
        this.reloadDialog=false
        this.$nextTick(()=>{
          this.reloadDialog=true
        })
        this.getList();
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.87;
      },
      async getList() {
        this.listLoading = true;
        await page(this.listQuery).then(response => {
          // this.chartY[0] = []
          // this.chartY[1] = []
          // this.chartX = []
          // for (let i in response.data) {
          //   if (i > 9) {
          //     break;
          //   }
          //   this.chartX.push(response.data[i].analysisType)
          //   this.chartY[0].push(response.data[i].profit)
          //   this.chartY[1].push(response.data[i].warehouseAmount)
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
      async handleFilter() {
        this.listQuery.page = 1;
        await this.getList()
        if (this.isChart) {
          this.drawLine()
        }
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
          if (column.label === '库存进价金额' || column.label === '库存考核金额' || column.label === '三个月以内库存' || column.label === '超三个月库存'||column.label === '超六个月库存') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return getFloat(prev, 4);
              }
            }, 0).toFixed(4);
            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        //sums[6] = this.toPercent(Number(this.division(sums[2], sums[5])).toFixed(4))
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

      drawLine() {
        if (!this.isChart) {
          return false
        }

        this.$nextTick(() => {
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))

          // 绘制图表
          myChart.setOption({
            color: ['rgb(46,199,201)', 'rgb(182,162,222)'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: '{b}<br />出库毛利 : {c} <br/> 出库仓库费用 : {c1}'
            },
            toolbox: {
              show: true,
              orient: 'vertical',
              left: 'right',
              top: 'center',
            },
            legend: {
              data: ['出库毛利', '出库仓库费用']
            },
            xAxis: [
              {
                type: 'category',
                axisTick: {show: false},
                data: this.chartX,
                name: this.analysisMap[this.listQuery.analysisType]
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '金额(元)'
              }
            ],
            series: [
              {
                name: '出库毛利',
                type: 'bar',
                barGap: 0,
                label: {
                  position: "top",
                  show: true
                },
                data: this.chartY[0]
              },
              {
                name: '出库仓库费用',
                type: 'bar',
                label: {
                  position: "top",
                  show: true
                },
                data: this.chartY[1]
              },
            ]
          });
        })

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

      closeDepartDialog(depart) {
        // if (depart.id) {
        //   this.dataForm.payOrgName = depart.label;
        //   this.dataForm.payOrgId = depart.id;
        //   this.departArr = [{name: depart.label, id: depart.id}];
        // }
        let departNos = []
        // console.log(depart)
        for (let i = 0; i < depart.checkedNodes.length; i++) {
          departNos.push(depart.checkedNodes[i].label)
        }
        this.listQuery.departName = departNos.toString()
        //console.log(this.listQuery.departName,'departNo')
        this.departVisible = false
      },

      handleSubmitDepart() {
        this.$refs.depart.onSubmit();
      },

      closeCustomerDialog(list) {
        // 单选
        this.customerVisible = false;
        let customNo = []
        let customName = []
        for (let i = 0; i < list.length; i++) {
          customNo.push(list[i].customerCode)
          customName.push(list[i].customerName)
        }
        this.listQuery.customerCode = customNo.toString()
        this.listQuery.customerName = customName.toString()
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
      excelTable() {
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = this.list.map(o => ({...o}))
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            list[i].rate=Number(list[i].rate).toFixed(2)
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
          excel.export_json_to_excel2(tHeader, list, filterVal, '库存周转率分析');
        })
      },

      /**
       * 关闭赠品选择对话框
       */
      handleClosePublic() {
        this.showBrandSelector = false
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
        this.$set(this.listQuery, 'brandName', "")
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
