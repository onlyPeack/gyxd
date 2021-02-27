<template>
  <div class="app-container calendar-list-container bill-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>

          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="result-container">
        <el-table :data="list" border style="width: 100%;height: 100%;position:relative;" v-loading="listLoading"
                  ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries">
          <el-table-column type="selection" width="50" align="center">
          </el-table-column>
          <el-table-column type="index" width="50" align="center">
          </el-table-column>
          <el-table-column prop="billNo" label="单据编号" width="180" align="center">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.billNo}}</span></template>
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" min-width="150">
          </el-table-column>
          <el-table-column prop="series" label="系列" min-width="150">
          </el-table-column>
          <el-table-column prop="specModel" label="型号" min-width="150">
          </el-table-column>
          <el-table-column prop="itemNo" label="订货号" min-width="150">
          </el-table-column>
          <el-table-column prop="goodsName" label="品名" min-width="150">
          </el-table-column>
          <el-table-column prop="transferQty" label="调拨数量" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="unSettleQty" label="未结算数量" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="settleQty" label="本次结算数量" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="transferPrice" label="平台调拨价" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="settlePrice" label="结算单价" align="right" width="100" class-name="col-required">
          </el-table-column>
          <el-table-column prop="settleAmt" label="本次结算金额" width="100" align="right" class-name="col-required">
          </el-table-column>
          <el-table-column prop="transferAmt" label="调拨金额" width="100" align="right" class-name="col-required">
          </el-table-column>
          <el-table-column prop="sourceBillNo" label="调拨单号" min-width="180" sortable align="center">
          </el-table-column>
          <el-table-column prop="inCompanyCode" label="调入公司代码" align="center" width="100">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.inCompanyCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inCompanyFullName" label="调入公司全称" min-width="180">
            <template slot-scope="scope"><span v-if="scope.row.mainDTO">{{scope.row.mainDTO.inCompanyFullName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inCompanyOpeningBank" label="调入公司开户行" min-width="180">
            <template slot-scope="scope"><span
              v-if="scope.row.mainDTO">{{scope.row.mainDTO.inCompanyOpeningBank}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inCompanyBankAccountCode" label="调入公司银行账号" min-width="180">
            <template slot-scope="scope"><span
              v-if="scope.row.mainDTO">{{scope.row.mainDTO.inCompanyBankAccountCode}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="companyTax" label="调入公司税号" min-width="180" align="center">
          </el-table-column>
          <el-table-column prop="invoiceAddr" label="调入公司开票地址" min-width="200">
          </el-table-column>
          <el-table-column prop="invoiceTel" label="调入公司开票电话" min-width="120">
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
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import { chooseItemPage } from '@/api/erp/wms/bill/companySettlement'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'companySettleSelector',
    props: ['dialogSelectorVisible', 'sourceInCompanyCode'],
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
            if (column.property == 'transferAmt' || column.property == 'settleAmt') {
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
          limit: 20
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
            if (this.selectedRows[0].inCompanyCode != this.selectedRows[i].inCompanyCode) {
              this.$message.error('只支持同一调出公司进行结算，请重新选择')
              return
            }
          }
          if (this.sourceInCompanyCode && this.sourceInCompanyCode != this.selectedRows[0].inCompanyCode) {
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
<style lang="scss" rel="stylesheet/scss" scoped>
  .app-container {
    flex: 1;
    position: relative;
    box-sizing: border-box;
  }

  .main-container {
    position: absolute;
    left: 0px;
    right: 0px;
    height: 100%;
  }

  .result-container {
    overflow: auto;
  }

  .pagination-container {
    position: absolute;
    bottom: 20px;
    background-color: #fff;
  }

  .goods-selector-filter-container {
    padding-bottom: 0px;
  }
</style>
