<template>
  <el-dialog title="选择退款关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
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
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                    v-model="listQuery.specifications"
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
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" align="center" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="(item,index) in statusOptions"  :key="index">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.paymentForm" label="付款形式" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="(item,index) in paymentFormOptions" :key="index">
            <span v-if="item.value==scope.row.mainDTO.paymentForm">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="申请人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.applicantName" label="申请人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="departName" label="申请人部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierCode" label="供应商编号"  width="100">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号"  width="200">
      </el-table-column>
      <el-table-column prop="specifications" label="型号"  width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierName" label="供应商"  width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.paymentsMeans" label="结算方式" align="center" width="120">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="item in paymentsMeansOptions">
            <span v-if="scope.row.mainDTO.paymentsMeans==item.value">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.currencyId" label="币别" align="center" width="80">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.applyAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.bankName" label="开户银行" align="center" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.bankAccount" label="银行账户" align="center" width="200">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" width="108" sortable>
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
  import { selectPageByItem } from '@/api/erp/purchase/bill/paymentApply'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'paymentApplySelector',
    props: ['dialogSelectorVisible', 'sourceBillNo', 'paymentsMeansOptions', 'supplierId','supplierCode'],
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
          applicantName: undefined,
          supplierCode: undefined,
          departName: undefined,
          crtUserName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          supplierId: undefined,
          selectType: 1 //其它单据关联合同时查询，只查状态为正常的单据
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
      this.listQuery.supplierCode = this.supplierCode;
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
        this.listQuery.supplierId = this.supplierId;
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
          supplierCode: this.supplierCode,
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
         this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            })
        // if (this.selectedRows.length > 0) {
        //   for (let i in this.selectedRows) {
        //     if (this.selectedRows[0].billNo != this.selectedRows[i].billNo) {
        //       this.$message.error('只支持同一张单据内进行关联创建，请重新选择')
        //       return
        //     }
        //   }

        //   if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].billNo) {

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

