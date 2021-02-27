<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
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
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="query-container">
        <div>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联单据编号"
                    v-model="listQuery.sourceBillNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker style="position: relative;top:-4px;"
                          v-model="billDate"
                          type="daterange"
                          :clearable="false"
                          align="right"
                          unlink-panels
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="单据开始日期"
                          end-placeholder="单据结束日期"
                          @change="handleBillDateSelect"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </div>

      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <el-button type="text" id="import_bill" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'mainDTO.billDate', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" sortable align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.billNo">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据" width="140" align="right"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="100" align="right"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100" align="right"></el-table-column>
      <el-table-column prop="skuNo" label="编码" width="160" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列名称" width="100" align="right"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100" align="right"></el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="140" align="right"></el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="right"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100" align="right"></el-table-column>
      <el-table-column prop="qty" label="数量" width="100" align="right"></el-table-column>
      <el-table-column prop="difQty" label="差异数量" width="100" align="right" class-name="col-required">
      </el-table-column>
      <el-table-column prop="abnormalType" label="异常类型" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <div v-for="item in abnormalOptions">
            <span v-if="item.value==scope.row.abnormalType">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" sortable align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="100" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" width="250" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="250" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="部门" width="250" align="center">
      </el-table-column>
      <el-table-column prop="updUserName" align="center" width="250" label="最后更新人">
      </el-table-column>
      <el-table-column prop="updTime" align="center" width="250" label="更新时间">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" width="250" sortable align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增直发出库弹窗 -->
    <delivery_abnormal_feedback_form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                             @submitSuccess="submitSuccess" @handleClose="handleClose">
    </delivery_abnormal_feedback_form>

    <!-- 直发出库详情弹窗 -->
    <delivery_abnormal_feedback_view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                               @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </delivery_abnormal_feedback_view>
  </div>
</template>

<script>
  import { batchDelBill, selectPage, selectPageByItem } from '@/api/erp/wms/bill/deliveryAdnormalFeedback';
  import { getFloat } from '@/utils/util'

  export default {
    name: 'delivery_abnormal_feedback',
    components: {
      'delivery_abnormal_feedback_form': () => import('./delivery_abnormal_feedback_form'),
      'delivery_abnormal_feedback_view': () => import('./delivery_abnormal_feedback_view')
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          salerCode: undefined,
          sourceBillNo: undefined,
          crtUserName: undefined,
          crtUserNo: undefined,
          salerName: undefined,
          customerName: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startReceiptDate: undefined,
          endReceiptDate: undefined,
          billStatus: undefined,
        },
        abnormalOptions:[
          {
            label:"少货",
            value:'1'
          },
          {
            label:"多货",
            value:'2'
          },
          {
            label:"坏货",
            value:'3'
          },
          {
            label:"其他",
            value:'4'
          },
        ],
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: [this.$moment(new Date(new Date().getTime() - 24*7*3600*1000)).format('YYYY-MM-DD'),this.$moment(new Date()).format('YYYY-MM-DD')],
        receiptDate: ''
      }
    },
    created() {
      //this.changeDivHeight();
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
      this.listQuery.startBillDate = this.billDate[0] + ' 00:00:00'
      this.listQuery.endBillDate = this.billDate[1] + ' 23:59:59'
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader
          var filterVal
          var list = JSON.parse(JSON.stringify(this.list))
          if (this.choose == false) {
            tHeader = ['单据日期', '单据编号', '制单人', '业务员', '订货单位', '币别', '金额', '价税合计', '单据状态', '关联单据编号', '开票状态', '记账状态', '打印次数']
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'salerName', 'customerName', 'currencyId', 'billAmount', 'taxBillAmount', 'billStatus', 'sourceBillNo', 'invoiceStatus', 'voucherStatus', 'printCount']
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO)
              delete list[i].mainDTO
            }
            tHeader = ['单据日期', '单据编号', '制单人', '业务员', '订货单位', '供货单位', '币别', '金额', '价税合计', '出库仓库', '单据状态', '关联单据编号', '商品编码', '商品名称', '订货号', '规格型号', '数量', '单位', '单价', '金额', '税额', '含税单价', '价税合计', '记账状态', '开票数量', '开票状态', '打印次数']
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'salerName', 'customerName', 'supplierName', 'currencyId', 'billAmount', 'taxBillAmount', 'warehouseName', 'billStatus', 'sourceBillNo', 'skuNo', 'skuName', 'itemNo', 'specifications', 'qty', 'unit', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'voucherStatus', 'saleInvoiceQty', 'invoiceStatus', 'printCount']
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '直发出库单')
          this.downloadLoading = false
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1
      },
      getList() {
        this.listLoading = true
        selectPage(this.listQuery).then(response => {
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
            if (column.property == 'contractAmount' || column.property == 'amount' || column.property == 'qty'
              || column.property == 'tax' || column.property == 'taxAmount'
              || column.property == 'saleCostAmount' || column.property == 'saleProfit' || column.property == 'taxBillAmount' || column.property == 'sumSaleProfit') {
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
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      getListByItem() {
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
      handleFilter() {
        this.listLoading = true
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      handleCreate() {
        this.id = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleClose() {
        this.id = ''
        this.dialogFormVisible = false
      },
      handleReset() {
        this.listQuery.billNo = undefined
        this.listQuery.sourceBillNo = undefined
        this.listQuery.billStatus = undefined
        this.listQuery.crtUserName = undefined
        this.listQuery.customerName = undefined
        this.listQuery.supplierName = undefined
        this.listQuery.supplierCode = undefined
        this.listQuery.salerName = undefined
        this.listQuery.salerCode = undefined
        this.listQuery.crtUserNo = undefined
        this.listQuery.brandName = undefined
        this.listQuery.skuNo = undefined,
        this.listQuery.skuName = undefined,
        this.listQuery.itemNo = undefined,
        this.listQuery.specifications = undefined,
        this.billDate = undefined
        this.receiptDate = undefined
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          })
          return false
        }
        let ids = []
        this.selectedRows.forEach(function(row) {
          ids.push(row.id)
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
        })
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row)
        this.$refs.dataTable.toggleRowSelection(row)
      },
      submitSuccess() {
        this.dialogFormVisible = false
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1])
        }
        this.selectedRows = val
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          })
          return false
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.id = this.selectedRows[0].id
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      handleSwitch() {
        this.listQuery.page = 1
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      handleBillDateSelect(val) {
        console.log('变化了');
        this.listQuery.startBillDate = val[0] + ' 00:00:00'
        this.listQuery.endBillDate = val[1] + ' 23:59:59'
      },
      handleReceiptDateSelect(val) {
        this.listQuery.startReceiptDate = val[0]
        this.listQuery.endReceiptDate = val[1]
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id
        } else {
          this.id = row.masterId//详情
        }
        this.dialogDetailVisible = true
      },
      handleDetailClose() {
        this.id = ''
        this.dialogDetailVisible = false
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      handleOpenDetailOrForm(row) {
        var billStatus
        billStatus = row.billStatus
        if (billStatus && billStatus == 1) {
          this.id = row.id
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
        } else {
          this.handleDetailOpen(row)
        }
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
        this.listQuery.startBillDate = undefined
        this.listQuery.endBillDate = undefined
        }
      },
      receiptDate(value) {
        if (value == null) {
          this.listQuery.startReceiptDate = undefined
          this.listQuery.endReceiptDate = undefined
        }
      }
    }
  }
</script>
