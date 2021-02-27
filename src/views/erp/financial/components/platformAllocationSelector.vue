<template>
  <div class="platformAllocationSelector calendar-list-container bill-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="中心单号"
                    v-model="listQuery.transOrderNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="调往客户订单"
                    v-model="listQuery.customerOrderNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                    v-model="listQuery.specModel"
                    @keyup.enter.native="handleFilter">
          </el-input>

          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="result-container">
        <el-table :data="list" border style="position:relative;" v-loading="listLoading"
                  ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。"
                  show-summary :summary-method="getSummaries">
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column type="index" width="50" align="center">
          </el-table-column>
          <el-table-column prop="billNo" label="单据编号" width="150" align="center">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.billNo}}</span></template>
          </el-table-column>
          <el-table-column prop="transOrderNo" label="平台单号" width="150" align="center">
          </el-table-column>
          <el-table-column prop="customerOrderNo" label="调往客户订单" align="center" width="280">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.customerOrderNo}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center" width="120">
          </el-table-column>
          <el-table-column prop="series" label="系列" align="center" width="150">
          </el-table-column>
          <el-table-column prop="itemNo" label="订货号" align="center" width="150">
          </el-table-column>
          <el-table-column prop="specModel" label="型号" align="center" width="150">
          </el-table-column>
          <el-table-column prop="goodsName" label="品名" width="150" align="center">
          </el-table-column>
          <el-table-column prop="transferQty" label="调拨数量" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="alreadySettleQty" label="已结算数量" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="transferPrice" label="调拨单价" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="transferAmt" label="调拨总金额" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="customerCode" label="调往客户编码" align="center" width="150">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.customerCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" label="调往客户名称" align="center" width="200">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.customerName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shipperCode" label="调出货主编码" align="center" width="150">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.shipperCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="shipperName" label="调出货主名称" align="center" width="200">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.shipperName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="allocationType" label="调拨类型" width="80" align="center">
            <template slot-scope="scope">
              <span v-for="item in allocationTypeOptions">
                <span v-if="scope.row.mainDTO.allocationType ===item.value">{{item.label}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="alreadySettleAmt" label="已结算金额" align="right" width="120" class-name="col-required">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.alreadySettleQty}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="crtTime" label="单据日期" width="150" align="center" sortable>
          </el-table-column>
          <el-table-column prop="note" label="备注" width="120">
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,100,500]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import { chooseItemPage } from '@/api/erp/wms/bill/platformAllocation'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'platformAllocationSelector',
    props: ['dialogSelectorVisible', 'sourceShipperCode'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          transOrderNo: undefined,
          customerOrderNo: undefined,
          itemNo: undefined,
          specModel: undefined,
          selectType: 1
        },
        allocationTypeOptions: [
          {
            value: 0,
            label: '调出'
          },
          {
            value: 1,
            label: '调入'
          }
        ],
        selectedRows: []
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
        if (document.getElementsByClassName('purchase-order-filter-container')[0]) {
          var height = document.getElementsByClassName('purchase-order-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        chooseItemPage(this.listQuery).then(response => {
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
            if (column.property == 'totalTransferAmt' || column.property == 'alreadySettleAmt') {
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
          } else {
            sums[index] = ' '
          }
        })
        return sums
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleFilter() {
        this.listLoading = true
        this.getList()
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          selectType: 1,
          limit: 10
        }
        this.handleFilter()
      },
      reset() {
        this.handleFilter()
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handleChangeFun(val) {
        this.selectedRows = val
      },
      onSubmit() {
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].shipperCode != this.selectedRows[i].shipperCode) {
              this.$message.error('只支持同一货主进行结算，请重新选择')
              return
            }
          }
          if (this.sourceShipperCode && this.sourceShipperCode != this.selectedRows[0].shipperCode) {
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
      }
    }
  }
</script>
<style lang="scss">
  .platformAllocationSelector {
    flex: 1;
    position: relative;
    box-sizing: border-box;
    .el-table__body-wrapper {
      // height: 601px;
    }
    .main-container {
      position: absolute;
      left: 0px;
      right: 0px;
      height: 100%;
    }

    .result-container {
      overflow: auto;
      height: 78%;
      .el-table {
        // height: 600px!important;
      }
    }
    .pagination-container {
      margin-top: 5px;
    }
    .goods-selector-filter-container {
      padding-bottom: 0px;
    }
  }
</style>
