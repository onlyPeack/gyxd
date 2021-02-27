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
        <el-select v-model="listQuery.paymentsMeans" placeholder="退款方式" clearable style="width: 200px;"
                   class="filter-item" @change="handleFilter" filterable>
          <el-option v-for="item in paymentsMeansOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号" v-if="choose"
                  v-model="listQuery.customerCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称" v-if="choose"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">z
        </el-input>
        <!--<span @click="queryVisibleChange" v-model="queryVisible"-->
        <!--style="color: #409EFF;margin-left: 10px;cursor: pointer;">-->
        <!--<span v-show="!queryVisible">展开</span>-->
        <!--<span v-show="queryVisible">收起</span>-->
        <!--&lt;!&ndash;<svg-icon icon-class="down"></svg-icon>&ndash;&gt;-->
        <!--<i class="el-icon-arrow-down" v-show="!queryVisible"></i>-->
        <!--<i class="el-icon-arrow-up" v-show="queryVisible"></i>-->
        <!--</span>-->
      </div>
      <div class="query-container">
        <!--<el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"-->
        <!--@change="handleSwitch" style="float: right;"></el-switch>-->
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客服姓名" v-if="choose"
                    v-model="listQuery.managerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客服部门" v-if="choose"
                    v-model="listQuery.departName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker
            style="position: relative;top:-3px;"
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
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建
      </el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">
        编辑
      </el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除
      </el-button>
      <!--<el-upload class="upload" action="/api/financial/sales-collections/import" :before-upload="beforeUpload"-->
                 <!--:on-remove="handleRemove" :show-file-list="false"-->
                 <!--:before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"-->
                 <!--style="display:inline;" :on-success="uploadCompleted" :headers="headers" v-loading="uploadLoading">-->
        <!--<el-button type="text" icon="el-icon-download" v-if="listQuery.roleType == 0">-->
          <!--导入-->
        <!--</el-button>-->
      <!--</el-upload>-->
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload"
                 v-if="choose">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <!--<el-button type="text" icon="el-icon-download" style="padding-left: 1400px" v-if="listQuery.roleType == 0">-->
        <!--<a href="/api/financial/sales-refund/downTemplate">下载导入模板</a>-->
      <!--</el-button>-->
      <!--<el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"-->
                 <!--@change="handleSwitch"></el-switch>-->
    </div>

    <!-- 查询结果 -->
    <el-table v-if="choose" :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table"
              :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" width="200" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatusName" label="单据状态" align="center">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center">
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" align="center" width="150">
      </el-table-column>
      <el-table-column prop="managerName" label="客服名称" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="客服部门" align="center">
      </el-table-column>
      <el-table-column prop="paymentsName" label="退款方式1" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.receiveAccount" label="退款账户" align="center">
      </el-table-column>
      <el-table-column prop="amountFormer" label="退款金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amountFormer.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" sortable width="160">
      </el-table-column>
      <el-table-column prop="mainDTO.updTime" label="退款日期" align="center" sortable width="160">
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,50,100,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!--&lt;!&ndash; 新增实际回款弹窗 &ndash;&gt;-->
    <sales-refund-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                           @submitSuccess="submitSuccess" @handleClose="handleClose"
                                           :paymentsMeansOptions="paymentsMeansOptions">
  </sales-refund-form>

    <!--&lt;!&ndash; 实际回款详情弹窗 &ndash;&gt;-->
    <sales-refund-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                      @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                                      :paymentsMeansOptions="paymentsMeansOptions">
    </sales-refund-view>


  </div>
</template>

<script>
  import { selectPage, batchDelBill, selectPageByItem } from '@/api/erp/financial/salesRefund'
  import { getFloat } from '@/utils/util'
  import { pageRe as getPaymentsMeans } from '@/api/erp/financial/financialPaymentsMeans'
  import { pageAll } from '@/api/erp/financial/financialBankAccount'

  import { getToken } from '@/utils/auth'

  export default {
    name: 'sales-refund-list',
    components: {
      'sales-refund-form': () => import('./sales-refund-form'),
      'sales-refund-view': () => import('./sales-refund-view')
    },
    data() {
      return {
        choose: true,
        downloadLoading: false,
        fileList:[],
        list: [],
        total: undefined,
        listLoading: true,
        uploadLoading:false,
        listQuery: {
          paymentsMeans: undefined,
          page: 1,
          limit: 10,
          billNo: undefined,
          customerCode: undefined,
          customerName: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
          salerNo: undefined,
          salerName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          departName: undefined,
          roleType: 1,
          selectType: 0  //0代表查询所有状态的单据
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: undefined,
        paymentsMeansOptions: []

      }
    },
    created() {
      this.headers={
        Authorization : getToken()
      }
      let group = this.$store.getters.groupNames
      this.listQuery.roleType = group.indexOf('财务') > -1 || group.indexOf('总经理') > -1 || group.indexOf('ERP') > -1 ? 0 : 1
      this.changeDivHeight()
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }

      getPaymentsMeans().then(response => {
        this.paymentsMeansOptions = response.data.records
        console.log(this.paymentsMeansOptions);
        this.getList()
      })
    },
    methods: {
      handleSwitch(val) {
        this.selectedRows = []
        this.listQuery.page = 1
        this.getList()
      },
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader
          var filterVal
          var list = JSON.parse(JSON.stringify(this.list))
          for (var i in list) {
            Object.assign(list[i], list[i].mainDTO)
            delete list[i].mainDTO
          }
          tHeader = ['单据编号', '单据状态', '收款账户', '结算方式', '客户编号', '客户名称', '客服姓名', '客服部门', '到款金额', '到款日期', '备注']
          filterVal = ['billNo', 'billStatusName', 'receiveAccount', 'paymentsName', 'customerCode', 'customerName', 'managerName', 'departName', 'amountFormer', 'receiveDate', 'note']
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售退款')
          this.downloadLoading = false
        })
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function() {
          _this.changeDivHeight()
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 46
        }
        this.clientHeight = (document.body.clientHeight - (250 + height)) * 1
      },
      getList() {
        this.list = []
        this.listLoading = true
        if (this.choose) {
          selectPageByItem(this.listQuery).then(response => {
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

        } else {
          selectPage(this.listQuery).then(response => {
            for (let item in response.data.records) {
              if (response.data.records[item].billStatus) {
                for (let i in this.statusOptions) {
                  if (this.statusOptions[i].value == response.data.records[item].billStatus) {
                    response.data.records[item].billStatusName = this.statusOptions[i].label
                  }
                }
              }
              if (response.data.records[item].paymentsMeans) {
                for (let i in this.paymentsMeansOptions) {
                  if (this.paymentsMeansOptions[i].value == response.data.records[item].paymentsMeans) {
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
        }

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
            if (column.property == 'amountFormer') {
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
        this.listQuery.page = 1
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
        let group = this.$store.getters.groupNames
        this.listQuery = {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          selectType: 0,
          crtUserNo: undefined,
          crtUserName: undefined,
          billStatus: undefined,
          customerCode: undefined,
          salerNo: undefined,
          salerName: undefined,
          departName: undefined,
          roleType: group.indexOf('财务') > -1 || group.indexOf('总经理') > -1 || group.indexOf('ERP') > -1 ? 0 : 1
        }
        this.billDate = undefined
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00'
        this.listQuery.endBillDate = val[1] + ' 23:59:59'
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
      },
      //文件上传
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      beforeUpload(file) {
        this.uploadLoading=true
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isXLS && isLt10M
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          })
          this.uploadLoading =false
          this.getList()
        } else if (response.code == '401') {
          this.uploadLoading =false
          this.$message.warning(response.msg)
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
          this.uploadLoading =false
        }
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
