<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker
            style="position: relative;top:-4px;"
            v-model="billDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期"
            @change="handleBillDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
          <el-input v-model="listQuery.entrustedName" style="width:160px;top:-5px" placeholder="请输入委托员工姓名"></el-input>
          <el-input v-model="listQuery.entrustedId" style="width:160px;top:-5px" placeholder="请输入委托员工ID"></el-input>
          <el-input v-model="listQuery.warehouseName" style="width:160px;top:-5px" placeholder="请输入仓库"></el-input>
          <el-input v-model="listQuery.receiverCity" style="width:160px;top:-5px" placeholder="请输入发往城市"></el-input>
          <el-input v-model="listQuery.receiverName" style="width:160px;top:-5px" placeholder="请输入收货人"></el-input>
          <el-input v-model="listQuery.deliverySn" style="width:160px;top:-5px" placeholder="请输入收货人"></el-input>
          <el-input v-model="listQuery.deliverySn" style="width:160px;top:-5px" placeholder="请输入货运单号"></el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

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
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'crtTime', order: 'descending'}"
              show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table"
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
      <el-table-column prop="billStatus" label="单据状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="(item,index) in statusOptions" :key="index">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="180" align="center">
      </el-table-column>
      <el-table-column prop="entrustedCode" label="委托员工编号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="entrustedId" label="委托员工ID" width="180" align="center">
      </el-table-column>
      <el-table-column prop="entrustedName" label="委托员工" width="180" align="center">
      </el-table-column>
      <el-table-column prop="estimateFreight" label="预估运费" width="180" align="center">
      </el-table-column>
      <el-table-column prop="expressId" label="快递id" width="180" align="center">
      </el-table-column>
      <el-table-column prop="expressName" label="快递名称" width="180" align="center">
      </el-table-column>
      <el-table-column prop="goodsValue" label="货品价值" width="180" align="center">
      </el-table-column>
      <el-table-column prop="goodsWeight" label="货品重量" width="180" align="center">
      </el-table-column>
      <el-table-column prop="managerName" label="仓库管理员" width="180" align="center">
      </el-table-column>
      <el-table-column prop="receiverCity" label="收货人城市" width="180" align="center">
      </el-table-column>
      <el-table-column prop="receiverAddress" label="收货人地址" width="180" align="center">
      </el-table-column>
      <el-table-column prop="receiverName" label="收货人" width="180" align="center">
      </el-table-column>
      <el-table-column prop="receiverPhone" label="收货人电话" width="180" align="center">
      </el-table-column>
      <el-table-column prop="warehouseAdress" label="仓库地址" width="180" align="center">
      </el-table-column>
      <el-table-column prop="warehouseInstructions" label="仓库说明" width="180" align="center">
      </el-table-column>
      <el-table-column prop="warehouseManagerId" label="仓库管理员ID" width="180" align="center">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" width="180" align="center">
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

    <!-- 新增销售出库弹窗 -->
    <entrust_stock_out_form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                          @submitSuccess="submitSuccess" @handleClose="handleClose">
    </entrust_stock_out_form>

    <!-- 销售出库详情弹窗 -->
    <entrust_stock_out_detail :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                            @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </entrust_stock_out_detail>
  </div>
</template>

<script>
  import { batchDelBill, selectPage, selectPageByItem } from '@/api/erp/wms/bill/entrustStockOut'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'sales_stock_out',
    components: {
      'entrust_stock_out_form': () => import('./entrust_stock_out_form'),
      'entrust_stock_out_detail': () => import('./entrust_stock_out_view')
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
          salerName: undefined,
          customerName: undefined,
          warehouseName: undefined,
          customerCode: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          itemNo: undefined,
          deliveryBillNo: undefined,
          sourceBillNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startReceiptDate: undefined,
          endReceiptDate: undefined,
          billStatus: undefined,
          crtUserName: undefined,
          crtUserNo: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
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
          tHeader = ['单据编号','单据状态','单据日期','制单人','委托员工编号', '委托员工','仓库','仓库管理员','运送方式','发往城市','发往地址','收货人','收货人电话','货品价值','货品重量','货运单号','预估运费','货品描述','注意事项','仓库说明']
          filterVal = ['billNo', 'billStatus','billDate','crtUserName','entrustedCode','entrustedName','warehouseName','managerName','expressName','receiverCity','receiverAddress','receiverName','receiverPhone','goodsValue','goodsWeight','deliverySn','estimateFreight','goodsDes','precautions', 'warehouseInstructions']
          excel.export_json_to_excel2(tHeader, list, filterVal, '委托发货单')
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
            if (column.property == 'taxAmount'
              || column.property == 'saleCostAmount'
              || column.property == 'qty'
              || column.property == 'stockReturnQty'
              || column.property == 'saleProfit'
              || column.property == 'taxBillAmount'
              || column.property == 'sumSaleProfit') {
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

        this.listQuery = {
          page:1,
          limit:10
        }
        // this.listQuery.billNo = undefined
        // this.listQuery.billStatus = undefined
        // this.listQuery.crtUserName = undefined
        // this.listQuery.customerCode = undefined
        // this.listQuery.customerName = undefined
        // this.listQuery.warehouseName = undefined
        // this.listQuery.itemNo = undefined
        // this.listQuery.salerName = undefined
        // this.listQuery.skuNo = undefined,
        // this.listQuery.deliveryBillNo = undefined,
        // this.listQuery.sourceBillNo = undefined,
        // this.listQuery.skuName = undefined,
        // this.listQuery.specifications = undefined,
        // this.billDate = undefined,
        // this.receiptDate = undefined,
        // this.listQuery.crtUserNo = undefined
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
        this.getList()
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
        this.getList()
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
        this.id = row.id
        this.dialogDetailVisible = true
      },
      handleDetailClose() {
        this.id = ''
        this.dialogDetailVisible = false
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false
        this.getList()
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
