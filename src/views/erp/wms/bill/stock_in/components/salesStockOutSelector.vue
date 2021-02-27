<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase sales-stock-out-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container sales-stock-out-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;"
                     @change="handleSouceObjectChange($event,true)">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                    v-model="listQuery.salerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                    v-model="listQuery.customerName" disabled
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="单据开始日期"
              end-placeholder="单据结束日期"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="deliverDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="交货开始日期"
              end-placeholder="交货结束日期"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <!--销售出库单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableCGDD"
                v-if="sourceObject.key=='XSCKD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="150">
        </el-table-column>
        <!--<el-table-column label="币别" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-for="item in currencyOptions">-->
        <!--<span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column prop="mainDTO.warehouseName" label="出库仓库" width="120">
        </el-table-column>
        <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
        <!--</el-table-column>-->
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="180">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="180">
        </el-table-column>
        <el-table-column prop="qty" label="出库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockReturnQty" label="退库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        </el-table-column>
        <!--<el-table-column prop="voucherStatus" label="记账状态" width="80">-->
        <!--</el-table-column>-->
        <el-table-column prop="purchaseInvoiceqty" label="开票数量" width="80">
        </el-table-column>
        <!-- <el-table-column prop="invoiceStatus" label="开票状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="item.value==scope.row.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column> -->
        <!--<el-table-column prop="printCount" label="打印次数" width="80">-->
        <!--</el-table-column>-->
        <el-table-column prop="mainDTO.billDate" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billAmount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.taxBillAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="sourceBillNo" label="关联单据" width="150">
        </el-table-column>
      </el-table>

      <!--直发出库单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableCGDD"
                v-if="sourceObject.key=='ZFCKD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="150">
        </el-table-column>
        <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
        <!--</el-table-column>-->
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="180">
        </el-table-column>
        <el-table-column prop="qty" label="出库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockReturnQty" label="退库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        </el-table-column>
        <!--<el-table-column prop="voucherStatus" label="记账状态" width="80">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="purchaseInvoiceQty" label="开票数量" width="80">-->
        <!--</el-table-column>-->
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
      </el-table>

      <!--客户退货单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableKHTHD"
                v-if="sourceObject.key=='KHTHD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.companyName" label="供货单位" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="150">
        </el-table-column>
        <!--<el-table-column label="币别" width="80">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-for="item in currencyOptions">-->
        <!--<span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
        <!--</el-table-column>-->
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
        </el-table-column>
        <el-table-column prop="qty" label="申请数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockReturnSalesQty" label="退库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billAmount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.taxBillAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import { selectPageByItem } from '@/api/erp/wms/bill/salesStockOut'
  import { selectPageByItem as selectPageByItemKHTHD } from '@/api/erp/sales/bill/salesReturnGoods'
  import { selectPageByItem as selectPageByItemZFCKD } from '@/api/erp/wms/bill/straightStockOut'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'salesStockOutSelector',
    props: ['dialogSelectorVisible', 'sourceBillNo', 'type','customerName','refundType'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: '',
          salerName: '',
          customerName: this.customerName ? this.customerName : '',
          crtUserName: '',
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          startBillDate: '',
          endBillDate: '',
          startDeliverDate: '',
          endDeliverDate: '',
          refundType:this.refundType,
          selectType: this.type //type:1 销售退库单关联客户退货申请单时,只查询客户退货申请单中
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [
          {
            key: 'XSCKD',
            name: '销售出库单'
          },
          // {
          //   key: 'KHTHD',
          //   name: '客户退货单'
          // },
          {
            key: 'ZFCKD',
            name: '直发出库单'
          }
        ],
        sourceObject: {
          key: 'XSCKD',
          name: '销售出库单'
        },
        billDate: '',
        deliverDate: ''
      }
    },
    created() {
      //this.changeDivHeight();
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
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function() {
          _this.changeDivHeight()
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-stock-out-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-stock-out-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByKHTHD() {
        this.listLoading = true
        selectPageByItemKHTHD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByZFCKD() {
        this.listLoading = true
        selectPageByItemZFCKD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
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
            if (column.property == 'amount' || column.property == 'tax' || column.property == 'taxAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2)
                } else {
                  return getFloat(prev, 2)
                }
              }, 0)
              sums[index] += ' '
            }

          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.handleSouceObjectChange(this.sourceObject.key, false)
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.handleSouceObjectChange(this.sourceObject.key, false)
      },
      handleFilter() {
        this.listLoading = true
        if (this.sourceObject.key == 'XSCKD') {
          this.getList()
        } else if (this.sourceObject.key == 'KHTHD') {
          this.getListByKHTHD()
        } else if (this.sourceObject.key == 'ZFCKD') {
          this.getListByZFCKD()
        }
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          customerName: this.customerName ? this.customerName : '',
          selectType: this.type
        }
        this.billDate = null
        this.deliverDate = null
        this.handleFilter()
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handlechangeFun(val) {
        this.selectedRows = val
      },
      handleSouceObjectChange(val, clear) {
        if (val == 'XSCKD') {
          this.sourceObject.name = '销售出库单'
          this.getList()
        } else if (val == 'KHTHD') {
          this.sourceObject.name = '客户退货单'
          this.getListByKHTHD()
        } else if (val == 'ZFCKD') {
          this.sourceObject.name = '直发出库单'
          this.getListByZFCKD()
        }
        if (clear) {
          this.selectedRows = []
        }
      },
      handleSubmit() {
        this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          })
        // if (this.selectedRows.length > 0) {
        //   for (let i in this.selectedRows) {
        //     if (this.selectedRows[0].mainDTO.billNo != this.selectedRows[i].mainDTO.billNo) {
        //       this.$message.error('只支持同一张单据内进行关联创建，请重新选择')
        //       return
        //     }
        //   }

        //   if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].mainDTO.billNo) {

        //     this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       this.$emit('submitSelectorSuccess', {
        //         list: this.selectedRows,
        //         isClearAll: true,
        //         sourceObject: this.sourceObject
        //       })
        //     }).catch(() => {

        //     })

        //   } else {
        //     this.$emit('submitSelectorSuccess', {
        //       list: this.selectedRows,
        //       isClearAll: false,
        //       sourceObject: this.sourceObject
        //     })
        //   }

        // } else {
        //   this.$emit('submitSelectorSuccess', {
        //     list: this.selectedRows,
        //     isClearAll: false,
        //     sourceObject: this.sourceObject
        //   })
        // }

      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0]
        this.listQuery.endBillDate = val[1]
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0]
        this.listQuery.endDeliverDate = val[1]
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = ''
          this.listQuery.endBillDate = ''
        }
      },
      deliverDate(value) {
        if (value == null) {
          this.listQuery.startDeliverDate = ''
          this.listQuery.endDeliverDate = ''
        }
      }
    }
  }
</script>
