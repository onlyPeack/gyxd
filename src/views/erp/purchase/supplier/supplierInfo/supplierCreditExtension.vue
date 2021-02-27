<template>
  <div class="bill-container">
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号查询"
                v-model="listQuery.billNo" clearable></el-input>
      <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                v-model="listQuery.crtUserName"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                v-model="listQuery.crtUserNo"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="供应商编号查询"
                v-model="listQuery.supplierCode" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="供应商名称查询"
                v-model="listQuery.supplierName" clearable></el-input>
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
                      >
      </el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              show-summary :summary-method="getSummaries"
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="单据状态" prop="billStatus" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleDetailOpen(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="供应商编号" prop="supplierCode">
      </el-table-column>
      <el-table-column align="center" label="制单人" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" label="制单人工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="供应商名称" prop="supplierName">
      </el-table-column>
      <el-table-column align="center" label="授信员工" prop="salerName">
      </el-table-column>
      <el-table-column align="center" label="授信金额" prop="creditAmount">
      </el-table-column>
      <el-table-column align="center" label="还信日期" prop="hisenseDate">
    </el-table-column>
      <el-table-column align="center" label="单据日期" prop="crtTime">
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="billFormDialog" width="70%">
      <el-form :model="dataForm" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-input v-model="dataForm.billDate" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" :readonly="true" placeholder="单据编号系统自动生成"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="授信员工:" prop="salerName" class="el-form-flex">
                <el-input v-model="dataForm.salerName" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="员工可用金额:" prop="availableAmount" class="el-form-flex">
                <el-input v-model="dataForm.availableAmount" :readonly="true"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="授信供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;">
                  <el-input v-model="dataForm.supplierName" :readonly="true"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="授信金额:" prop="creditAmount" class="el-form-flex">
                <el-input v-model="dataForm.creditAmount" v-number-input.float></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="还信时间:" prop="hisenseDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.hisenseDate" align="right" type="date" :picker-options="pickerOptions" value-format="yyyy-MM-dd"
                                style="width: 200px;" placeholder="请选择还信时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="dataForm.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" :loading="isLoading">确 定
        </el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 授信供应商弹窗-->
    <el-dialog title="请选择授信供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" :selectType="1" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>

    <!--详情-->
    <credit-extension-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                           @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </credit-extension-view>
  </div>
</template>

<script>
  import {
    page,
    addBill,
    getObj,
    deleteBill,
    queryAmount
  } from '@/api/erp/purchase/supplier/supplierCreditExtension'
  import { mapGetters } from 'vuex'

  export default {
    name: 'creditExtension',
    components: {
      'supplier-selector': () => import('../components/supplierSelector'),
      'sales-user-selector': () => import('@/components/ERP/User/salesUser'),
      'credit-extension-view': () => import('./supplierCreditExtensionView')
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        isLoading: false,
        dataForm: {
          billNo: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          creditAmount: undefined,
          hisenseDate: undefined,
          salerId: undefined,
          salerName: undefined,
          salerCode: undefined,
          availableAmount: undefined,
          note: undefined,
          crtUserNo: undefined,
          billStatus: undefined,
          billDate: undefined,
        },
        rules: {
          supplierName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.supplierName)
            }, message: '请选择授信供应商', trigger: 'blur'
          }],
          creditAmount: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.creditAmount)
            }, message: '请输入授信金额', trigger: 'blur'
          }],
          hisenseDate: [
            {
              required: true,
              message: '请选择还信日期',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
        },
        billDate: undefined,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        availableAmount: undefined,
        supplierVisible: false,
        dialogStatus: '',
        selectedRows: [],
        customerArr: [],
        textMap: {
          update: '编辑供应商授信单',
          create: '新增供应商授信单'
        }
      }
    },
    created() {
      this.init()
      this.getList()
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      init() {
        queryAmount(this.$store.state.user.code).then(response => {
          this.availableAmount = response
        })
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['creditAmount'],4);
      },
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      getList() {
        this.listLoading = true
        page(this.listQuery)
          .then(response => {
            console.log(response)
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
          })
        queryAmount(this.$store.state.user.code).then(response => {
          this.dataForm.availableAmount = response
          this.availableAmount = response
        })
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error('请输入'))
        } else {
          callback()
        }
      },
      handleFilter() {
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
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
        getObj(this.selectedRows[0].id)
          .then(response => {
            this.dataForm = response.data
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
          })
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
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteBill(this.selectedRows[0].id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              })
          })
      },
      create(formName) {
        const set = this.$refs

        set[formName].validate(valid => {
          console.log(valid)
          if (valid) {
            this.isLoading = true
            addBill(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.isLoading = false
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                this.getList()
              } else {
                this.isLoading = false
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
              this.isLoading = false
              this.dialogFormVisible = false
            })
          } else {
            this.isLoading = false
            this.dialogFormVisible = false
            return false
          }
        })
      },
      cancel(formName) {
        this.dialogFormVisible = false
        const set = this.$refs
        set[formName].resetFields()
      },
      update(formName) {
        const set = this.$refs
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false
            addBill(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
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
          } else {
            return false
          }
        })
      },
      resetTemp() {
        this.dataForm = {}
        this.dataForm.salerId = this.$store.state.user.id
        this.dataForm.salerName = this.$store.state.user.name
        this.dataForm.salerCode = this.$store.state.user.code
        this.dataForm.availableAmount = this.availableAmount
        this.dataForm.billDate = this.dataForm.billDate ? this.dataForm.billDate : new Date().toLocaleDateString().replace(/\//g, '-')
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.billNo = undefined,
        this.listQuery.supplierCode = undefined,
        this.listQuery.supplierName = undefined,
        this.listQuery.crtUserNo = undefined,
        this.listQuery.crtUserName = undefined,
        this.listQuery.billStatus = undefined,
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.billDate = undefined;
      },
      //行点击
      handleRowClick(row, event, column) {
        this.controlButtonShow(row)
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handleChangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1])
        }
        this.selectedRows = val
      },

      // 客户选择
      handleSupplierSelector() {
        this.supplierVisible = true
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset()
        this.supplierVisible = false
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1)
        this.dataForm.supplierId = undefined
        this.dataForm.supplierName = undefined
        this.dataForm.supplierCode = undefined
        this.$refs.supplier.reset()
      },
      handleSubmitSupplier() {
        console.log(1)
        this.$refs.supplier.onSubmit()
      },
      closeSupplierDialog(list) {
        console.log(list)
        this.supplierArr = list
        this.supplierVisible = false
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName
          this.dataForm.supplierId = list[0].id
          this.dataForm.supplierCode = list[0].supplierCode
        }
      },

      //详情
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
      }
    }
  }
</script>
