<template>
  <el-dialog title="选择承兑单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase payment-apply-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container payment-apply-filter-container">
        <div>
         <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="单据日期"
                        end-placeholder="单据日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column type="selection" width="60">
        </el-table-column>
       <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column label="单据编号" prop="billNo" width="180" align="center">
      </el-table-column>
      <el-table-column label="汇票编号" prop="draftNo" min-width="180" align="left">
      </el-table-column>
      <el-table-column label="客户编号" prop="customerCode" width="120" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.customerCode}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customerName" min-width="180" align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.customerName}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="汇票类型" prop="acceptanceType" width="90" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.acceptanceType}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分公司承兑账户" prop="companyAccount" width="120" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO">
            <span>{{scope.row.mainDTO.companyAccount}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="left"  min-width="180" label="付款银行全称" prop="paymentBankFullName">
      </el-table-column>
      <el-table-column align="right" width="90" label="出票金额" prop="amt" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="贴息额" prop="discount" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="手续费" width="80" prop="fee" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="月利率" width="80" prop="monthRate" class-name="col-required">
      </el-table-column>
      <el-table-column align="left" label="几手背书" width="80" prop="hands">
      </el-table-column>
      <el-table-column align="center" label="汇票到期日" width="100" prop="draftExpireDate">
      </el-table-column>
      <el-table-column align="center" label="制单人工号" prop="crtUserNo" width="120">
    </el-table-column>
      <el-table-column align="center" label="制单人" prop="crtUserName" width="120">
      </el-table-column>
      <el-table-column align="center" label="单据时间" prop="crtTime" width="180">
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
  import {findAllPage} from '@/api/erp/financial/acceptanceRegister';
  import { getFloat } from '@/utils/util'

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
          limit: 20,
          itemNo: '',
          applicantName: undefined,
          departName: undefined,
          crtUserName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          supplierId: undefined,
          roleType:0,
          selectType: 1
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
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
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
        this.listQuery.supplierId = this.supplierId;
        findAllPage(this.listQuery).then(response => {
          for (let item in response.data.records) {
              if (response.data.records[item].mainDTO.billStatus) {
                for (let i in this.statusOptions) {
                  if (this.statusOptions[i].value == response.data.records[item].mainDTO.billStatus) {
                    response.data.records[item].billStatusName = this.statusOptions[i].label
                  }
                }
              }
              if (response.data.records[item].mainDTO.paymentsMeans) {
                for (let i in this.paymentsMeansOptions) {
                  if (this.paymentsMeansOptions[i].value == response.data.records[item].mainDTO.paymentsMeans) {
                    response.data.records[item].paymentsName = this.paymentsMeansOptions[i].label
                  }
                }
              }
              if (response.data.records[item].currencyId) {
                for (let i in this.currencyOptions) {
                  if (this.currencyOptions[i].value == response.data.records[item].currencyId) {
                    response.data.records[item].currencyName = this.currencyOptions[i].label
                  }
                }
              }
              if (response.data.records[item].paymentForm) {
                for (let i in this.moneybackFormOptions) {
                  if (this.moneybackFormOptions[i].value == response.data.records[item].paymentForm) {
                    response.data.records[item].paymentFormName = this.moneybackFormOptions[i].label
                  }
                }
              }
              if (response.data.records[item].invoiceStatus) {
                for (let i in this.invoiceStatusOptions) {
                  if (this.invoiceStatusOptions[i].value == response.data.records[item].invoiceStatus) {
                    response.data.records[item].invoiceStatusName = this.invoiceStatusOptions[i].label
                  }
                }
              }
            }
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
            if (column.property == 'qty' || column.property == 'lockedQty') {
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
          this.$emit('submitSelectorSuccess', this.selectedRows)
        // if (this.selectedRows.length > 0) {
        //   for (let i in this.selectedRows) {
        //     if (this.selectedRows[0].itemNo != this.selectedRows[i].itemNo) {
        //       this.$message.error('只支持同一张单据内进行关联创建，请重新选择')
        //       return
        //     }
        //   }

        //   if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].itemNo) {

        //     this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
        //       confirmButtonText: '确定',
        //       cancelButtonText: '取消',
        //       type: 'warning'
        //     }).then(() => {
        //       this.$emit('submitSelectorSuccess', this.selectedRows,)
        //     }).catch(() => {

        //     })

        //   } else {
        //     this.$emit('submitSelectorSuccess', this.selectedRows)
        //   }

        // } else {
        //   this.$emit('submitSelectorSuccess', this.selectedRows)
        // }
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

