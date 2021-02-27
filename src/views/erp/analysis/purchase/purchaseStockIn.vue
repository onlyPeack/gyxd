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

<!--        <div style="display: inline-block" @click="showBrandSelector=true">-->
<!--        </div>-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
          </el-input>

<!--        <div style="display: inline-block" @click="seriesVisible=true">-->
<!--        </div>-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
          </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>

        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.goodsName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouse">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
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
          style="width: 403px"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
<!--        <el-input type="textarea" clearable class="filter-item" style="width: 190px;" placeholder="请输入订货号,多个订货号请输入回车键隔开" @keyup.enter.native="handleFilter"-->
<!--                  v-model="listQuery.itemNo"></el-input>-->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        <el-button class="filter-item" type="success" @click="excelTable" icon="el-icon-download">导出</el-button>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column align="right" :label="analysisMap[listQuery.analysisType]" prop="analysisType"></el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInAmount" sortable></el-table-column>
      <el-table-column align="right" label="考核金额" prop="stockInCheckAmount" sortable></el-table-column>
      <el-table-column align="right" label="毛利" prop="stockInProfit" sortable></el-table-column>
      <el-table-column align="right" label="分配毛利率" prop="stockInProfitPercent" sortable v-slot="{row}">
        <span>{{toPercent(division(row.stockInProfitPercent,100))}}</span>
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
  import {page} from '@/api/erp/analysis/purchase/purchaseStockIn';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'purchaseStockIn',
    components:{
      'brandSelector': () => import('@/views/erp/purchase/supplier/components/brandSelector'),
      'series-selector': () => import('@/views/erp/sales/components/seriesSelector'),
      'sales-user-selector': () => import('@/components/ERP/User/user'),
    },
    data() {
      return {
        clientHeight: 300,
        showBrandSelector:false,
        seriesVisible:false,
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
            if (column.label === '入库金额' || column.label === '考核金额' ||column.label === '毛利') {
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

            if(column.label==='分配毛利率'){
              let sum1=0
              let sum2=0
              for (let i = 0; i <data.length ; i++) {
                sum1=this.accAdd(sum1,data[i].stockInProfit)
                sum2=this.accAdd(sum2,data[i].stockInAmount)
              }
              sums[index]=this.toPercent(this.division(sum1,sum2).toFixed(4))
            }
            // 出库金额合计
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
            list[i].stockInProfitPercent=this.toPercent(this.division(list[i].stockInProfitPercent,100).toFixed(4))
          }
          for (let i = 0; i <this.$refs['analysisTable'].columns.length ; i++) {
            tHeader.push(this.$refs['analysisTable'].columns[i].label)
            if(i===0){
              filterVal.push('index')
            }else{
              filterVal.push(this.$refs['analysisTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购入库综合分析表');
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
