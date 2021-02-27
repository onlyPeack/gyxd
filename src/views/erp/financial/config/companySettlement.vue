<template>
  <div class="full-purchase bill-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="中心单号"
                  v-model="listQuery.settOrderNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调出公司全称"
                  v-model="listQuery.outCompanyFullName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调入公司全称"
                  v-model="listQuery.inCompanyFullName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

      </div>
      <div class="query-container">
        <div>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.goodsCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.goodsName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specModel"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <!--<el-date-picker-->
          <!--style="position: relative;top:-4px;"-->
          <!--v-model="billDate"-->
          <!--type="daterange"-->
          <!--align="right"-->
          <!--unlink-panels-->
          <!--value-format="yyyy-MM-dd"-->
          <!--range-separator="至"-->
          <!--start-placeholder="单据开始日期"-->
          <!--end-placeholder="单据结束日期"-->
          <!--@change="handleBillDateSelect"-->
          <!--:picker-options="pickerOptions">-->
          <!--</el-date-picker>-->
        </div>

      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'mainDTO.billDate', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" width="180" sortable align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="goodsCode" label="商品编码" width="240">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180" align="center">
      </el-table-column>
      <el-table-column prop="series" label="系列" width="180" align="left">
      </el-table-column>
      <el-table-column prop="specModel" label=" 规格型号" width="180" align="left">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="120" align="left">
      </el-table-column>
      <el-table-column prop="unit" label="计量单位" width="120" align="center">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="transferQty" label="调拨数量" align="center" width="80">
      </el-table-column>
      <el-table-column prop="unSettleQty" label="未结算数量" align="center" width="100">
      </el-table-column>
      <el-table-column prop="settleQty" label="本次结算数量" align="center" width="100">
      </el-table-column>
      <el-table-column prop="transferPrice" label="平台调拨价" align="right" width="100" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.transferPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="settlePrice" label="结算单价" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.settlePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="settleDiscount" label="结算折扣" width="120" align="right" class-name="col-required">
      </el-table-column>
      <el-table-column prop="settleAmt" label="本次结算金额" width="120" align="right" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.settleAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="transferAmt" label="调拨金额" width="120" align="right" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.transferAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="调拨单号" width="150" sortable align="center">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120" align="left">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'crtTime', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="50" align="center">
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
      <el-table-column prop="billStatus" label="系统状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="制单时间" width="150" align="center">
      </el-table-column>
      <el-table-column prop="settOrderNo" label="中心单号" width="150" align="center">
      </el-table-column>
      <el-table-column prop="settleStatus" label="中心状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item in settleStatusOptions">
            <span v-if="item.value==scope.row.settleStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="outCompanyCode" label="调出公司代码" width="100" align="center">
      </el-table-column>
      <el-table-column prop="outCompanyFullName" label="调出公司全称">
      </el-table-column>
      <el-table-column prop="inCompanyCode" label="调入公司代码" align="center" width="100">
      </el-table-column>
      <el-table-column prop="inCompanyFullName" label="调入公司全称">
      </el-table-column>
      <el-table-column prop="totalSettleAmt" label="本次结算总额" width="120" align="right" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.totalSettleAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="acceptCode" label="承兑代码">
      </el-table-column>
      <el-table-column prop="acceptSettleAmt" label="承兑金额" width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.acceptSettleAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="onlineSettleAmt" label="网银结算金额" width="120" align="right" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.onlineSettleAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="alreadyBillingAmt" label="已开票金额" width="120" align="right" class-name="col-required">
          <template slot-scope="scope">
          {{Number(scope.row.alreadyBillingAmt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
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

    <!-- 企业结算单弹窗 -->
    <company-settlement-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                             @submitSuccess="submitSuccess" @handleClose="handleClose">
    </company-settlement-form>

    <!-- 企业结算单详情弹窗 -->
    <company-settlement-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                             @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </company-settlement-view>
  </div>
</template>

<script>
  import { deleteBill, selectPage, selectPageByItem } from '@/api/erp/wms/bill/companySettlement'

  export default {
    name: 'enterpriseStatement',
    components: {
      'company-settlement-form': () => import('./companySettlementForm'),
      'company-settlement-view': () => import('./companySettlementView')
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
          billStatus: undefined,
          inCompanyFullName: undefined,
          outCompanyFullName: undefined,
          settOrderNo: undefined,
          salerName: undefined,
          customerName: undefined,
          customerCode: undefined,
          goodsCode: undefined,
          goodsName: undefined,
          specModel: undefined,
          itemNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startReceiptDate: undefined,
          endReceiptDate: undefined,
          crtUserName: undefined,
          crtUserNo: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        settleStatusOptions: [
          {
            label: '制单中',
            value: 1
          },
          {
            label: '付款方审核',
            value: 2
          },
          {
            label: '收款方确认',
            value: 3
          },
          {
            label: '已完成',
            value: 4
          },
          {
            label: '已作废',
            value: 5
          }
        ],
        billDate: '',
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
            tHeader = ['单据日期', '单据编号', '制单人', '业务员', '订货单位', '币别', '金额', '价税合计', '出库仓库', '单据状态', '关联单据编号', '开票状态', '记账状态', '打印次数']
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'salerName', 'customerName', 'currencyId', 'billAmount', 'taxBillAmount', 'warehouseName', 'billStatus', 'sourceBillNo', 'invoiceStatus', 'voucherStatus', 'printCount']
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO)
              delete list[i].mainDTO
            }
            tHeader = ['单据日期', '单据编号', '制单人', '业务员', '订货单位', '币别', '金额', '价税合计', '出库仓库', '单据状态', '关联单据编号', '商品编码', '商品名称', '数量', '单位', '单价', '金额', '税额', '含税单价', '价税合计', '记账状态', '开票数量', '开票状态', '打印次数']
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'salerName', 'customerName', 'currencyId', 'billAmount', 'taxBillAmount', 'warehouseName', 'billStatus', 'sourceBillNo', 'skuNo', 'skuName', 'qty', 'unit', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'voucherStatus', 'saleInvoiceQty', 'invoiceStatus', 'printCount']
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售出库单')
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
        return this.getSummariesMethod(param, ['totalSettleAmt', 'acceptSettleAmt', 'onlineSettleAmt', 'alreadyBillingAmt', 'retailPrice', 'transferPrice', 'settlePrice', 'settleDiscount', 'settleAmt', 'transferAmt'])
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
        this.listQuery.inCompanyFullName = undefined
        this.listQuery.outCompanyFullName = undefined
        this.listQuery.settOrderNo = undefined
        this.listQuery.billStatus = undefined
        this.listQuery.itemNo = undefined
        this.listQuery.specModel = undefined
        this.listQuery.goodsName = undefined
        this.listQuery.goodsCode = undefined
        this.listQuery.page = 1
      },
      handleDelete() {
        if (this.selectedRows.length !== 1) {
          this.$notify({
            title: '提示',
            message: '请选择一条数据',
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
          deleteBill(ids)
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
          this.id = row.mainDTO.id//详情
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
        if (row.billStatus) {
          billStatus = row.billStatus
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus
          }
        }
        if (billStatus && billStatus == 1) {
          if (!this.choose) {
            this.id = row.id
          } else {
            this.id = row.mainDTO.id//详情
          }
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
