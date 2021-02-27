<template>
  <el-dialog title="选择承兑关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase payment-apply-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container payment-apply-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;">
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
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人"
                    v-model="listQuery.applicantName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请部门"
                    v-model="listQuery.departName"
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
              value-format="yyyy-MM-dd"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
       <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" width="180" align="center" sortable>
          <template slot-scope="scope">
            <div  v-if="scope.row">
              {{scope.row.billNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="draftNo" label="汇票编号" width="160">
        </el-table-column>
        <el-table-column prop="paymentBankFullName" label="付款银行全称" width="160">
        </el-table-column>
        <el-table-column prop="amt" label="出票金额" width="120" align="right" class-name="col-required">
        </el-table-column>
        <el-table-column prop="paymentAmt" label="本次支出金额" min-width="120" align="right" class-name="col-required">
        </el-table-column>
        <el-table-column prop="monthRate" label="月利率" width="80" align="right" class-name="col-required">
        </el-table-column>
        <el-table-column prop="discount" label="贴息金额" width="80" align="right" class-name="col-required">
        </el-table-column>
        <el-table-column prop="draftExpireDate" label="汇票到期日" width="120" align="center">
        </el-table-column>
        <el-table-column prop="paymentDate" label="支出时间" width="120"  align="center">
        </el-table-column>
        <el-table-column prop="customerCode" label="原到款客户" width="120">
        </el-table-column>
        <el-table-column prop="toBankCode" label="原到款银行" width="120">
        </el-table-column>
        <el-table-column prop="registerBillNo" label="原登记单号" align="center" width="140">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" align="center" width="150" sortable>
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
//   import { selectPage } from '@/api/erp/purchase/bill/paymentApply'
  import { getFloat } from '@/utils/util'
    import {selectPageByItem} from '@/api/erp/financial/acceptanceExpenditure'
  export default {
    name: 'paymentApplySelector',
    props: ['dialogSelectorVisible', 'sourceBillNo', 'paymentsMeansOptions', 'supplierId'],
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
          applicantName: undefined,
          departName: undefined,
          crtUserName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          supplierId: undefined,
          selectType: 4 //其它单据关联合同时查询，只查状态为正常的单据
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'FKSQD',
          name: '付款申请单'
        }],
        sourceObject: {
          key: 'FKSQD',
          name: '付款申请单'
        },
        billDate: undefined
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
        if (document.getElementsByClassName('payment-apply-filter-container')[0]) {
          var height = document.getElementsByClassName('payment-apply-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        // this.listQuery.supplierId = this.supplierId;

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
            if (column.property == 'applyAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 45)
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
          limit: 20,
          selectType: 1
        }
        this.billDate = undefined
        this.handleFilter()
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handlechangeFun(val) {
        this.selectedRows = val
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].billNo != this.selectedRows[i].billNo) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择')
              return
            }
          }
        this.$emit('submitAcceptSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true,
                sourceObject: this.sourceObject
              })
        //   if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].billNo) {

        //     this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       this.$emit('submitAcceptSelectorSuccess', {
        //         list: this.selectedRows,
        //         isClearAll: true,
        //         sourceObject: this.sourceObject
        //       })
        //     }).catch(() => {

        //     })

        //   } else {
        //     this.$emit('submitAcceptSelectorSuccess', {
        //       list: this.selectedRows,
        //       isClearAll: false,
        //       sourceObject: this.sourceObject
        //     })
        //   }

        } else {
          this.$emit('submitAcceptSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          })
        }
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0]
        this.listQuery.endBillDate = val[1]
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined
          this.listQuery.endBillDate = undefined
        }
      }
    }
  }
</script>

