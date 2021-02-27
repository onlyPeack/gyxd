<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase sales-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container sales-order-filter-container">
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
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库订单编号"
                    v-model="listQuery.lockingOrderNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
           <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                      v-model="listQuery.salerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                      v-model="listQuery.warehouseName"
                      @keyup.enter.native="handleFilter">
            </el-input>
             <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
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
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 查询结果 -->
      <!--客户订货单订单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableCGDD"
                v-if="sourceObject.key=='KHDHD'">
        <el-table-column type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" width="180" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="180">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="80">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="80">
        </el-table-column>
        <!--<el-table-column prop="billActuallyRebateAmount" label="实付金额" width="120" align="right">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="skuNo" label="商品编码" width="180">-->
        <!--</el-table-column>-->
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="120">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="120">
        </el-table-column>
        <el-table-column prop="stockOutSaleQty" label="出库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockOutSaleQty" label="未出库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInSaleAmount" label="出库金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockInSaleAmount" label="未出库金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="出库状态" width="80" class-name="col-required">
          <template slot-scope="scope">
            <div v-for="item in storageOutStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="100">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150" align="center">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100" align="center">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" width="120">
        </el-table-column>
      </el-table>

      <!--订单-库存锁定记录-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableFHTZD"
                v-if="sourceObject.key=='KC-KHDHD'">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="billNo" label="单据编号" width="180" align="center"></el-table-column>
        <el-table-column prop="lockingOrderNo" label="锁库订单编号" width="180" align="center"></el-table-column>
        <el-table-column prop="customerName" label="客户名称" min-width="250"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="warehouseName" label="锁库仓库" align="right" width="100"
                         class-name="col-required"></el-table-column>
        <el-table-column prop="positionName" label="锁库仓位" align="right" width="100"
                         class-name="col-required"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
        <el-table-column prop="seriesName" label="系列" width="100"></el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="120"></el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="120"></el-table-column>
        <el-table-column prop="lockedQty" label="锁定数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="qty" label="订单数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockOutSaleQty" label="已出库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockOutSaleQty" label="未出库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="salerName" label="业务员" width="120" align="center">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="180">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="120"></el-table-column>
        <el-table-column prop="linkPerson" label="联系人" width="100"></el-table-column>
        <el-table-column prop="linkPhone" label="联系电话" width="100"></el-table-column>
        <el-table-column prop="linkAddress" label="收货地址" width="120"></el-table-column>
        <el-table-column prop="isReplaceDelivery" label="是否代发货" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.isReplaceDelivery == 0">否</span>
            <span v-if="scope.row.isReplaceDelivery == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="deliverCompany" label="代发货公司" width="120"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
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
  import { selectPageByItem } from '@/api/erp/sales/bill/salesOrder'
  import { querySalesOrderItem } from '@/api/erp/wms/bill/stockSalesOrder'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'purchaseOrderSelector',
    props: ['dialogSelectorVisible', 'sourceBillNo', 'sourceWarehouse', 'type','linkAddress','linkPhone','linkPerson'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: '',
          lockingOrderNo: '',
          salerName: '',
          customerName: '',
          crtUserName: '',
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          startBillDate: '',
          endBillDate: '',
          startDeliverDate: '',
          endDeliverDate: '',
          selectType: this.type  //type:1,销售出库单关联销售订单时,只查询销售订单中未出库数量大于0
        },
        selectedRows: [],
        billOptions: [
          //   {
          //   key: 'KHDHD',
          //   name: '客户订货单',
          // },
          {
            key: 'KC-KHDHD',
            name: '订单-库存锁定记录'
          }],
        sourceObject: {
          key: 'KC-KHDHD',
          name: '订单-库存锁定记录'
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
      changeDivHeight() {
        if (document.getElementsByClassName('sales-order-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-order-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        querySalesOrderItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByFHTZD() {
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
            if (column.property == 'taxAmount'
              || column.property == 'stockInSaleAmount'
              || column.property == 'notStockInSaleAmount'
              || column.property == 'taxPrice') {
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
        if (this.sourceObject.key == 'KC-KHDHD') {
          this.getList()
        } else if (this.sourceObject.key == 'KHDHD') {
          this.getListByFHTZD()
        }
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
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
        if (val == 'KHDHD') {
          this.sourceObject.name = '客户订货单'
          // this.getList();
          this.getListByFHTZD()
        } else if (val == 'XSHT') {
          this.sourceObject.name = '销售合同'
        } else if (val == 'KC-KHDHD') {
          this.sourceObject.name = '订单-库存锁定记录'
          // this.getListByFHTZD();
          this.getList()
        } else if (val == 'GHD') {
          this.sourceObject.name = '归还单'
        } else if (val == 'GZL') {
          this.sourceObject.name = '工作流'
        }
        if (clear) {
          this.selectedRows = []
        }
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            // if (this.selectedRows[0].billNo != this.selectedRows[i].billNo) {
            //   this.$message.error('只支持同一张单据内进行关联创建，请重新选择')
            //   return
            // }
            if (this.selectedRows[0].warehouseName != this.selectedRows[i].warehouseName) {
              this.$message.error('只支持同一锁库仓库进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].linkPerson != this.selectedRows[i].linkPerson) {
              this.$message.error('只支持同一收货人进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].linkPhone != this.selectedRows[i].linkPhone) {
              this.$message.error('只支持同一收货电话进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].linkAddress != this.selectedRows[i].linkAddress) {
              this.$message.error('只支持同一收货地址进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].isReplaceDelivery != this.selectedRows[i].isReplaceDelivery) {
              this.$message.error('只支持相同的代发货类型进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].isReplaceDelivery == 1 && this.selectedRows[i].isReplaceDelivery == 1 && this.selectedRows[0].deliverCompany != this.selectedRows[i].deliverCompany) {
              this.$message.error('只支同一代发货公司进行关联创建，请重新选择')
              return
            }
            if (this.selectedRows[0].customerCode != this.selectedRows[i].customerCode) {
              this.$message.error('只支持同一客户进行关联创建，请重新选择')
              return
            }
          }

          if ((this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].billNo) || (this.sourceWarehouse && this.sourceWarehouse != this.selectedRows[0].warehouseName)|| (this.linkPerson && this.linkPerson != this.selectedRows[0].linkPerson)|| (this.linkPhone && this.linkPhone != this.selectedRows[0].linkPhone)|| (this.linkAddress && this.linkAddress != this.selectedRows[0].linkAddress)) {

            this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('submitSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true,
                sourceObject: this.sourceObject
              })
            }).catch(() => {

            })

          } else {
            console.log(this.selectedRows)
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            })
          }

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          })
        }

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
