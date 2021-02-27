<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号查询"
                v-model="listQuery.billNo"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户编号查询"
                v-model="listQuery.code"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
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
      <el-table-column align="center" label="客户编号" prop="code"></el-table-column>
      <el-table-column align="center" label="客户名称" prop="name"></el-table-column>
      <el-table-column align="center" label="客户名称-新" prop="nameNew"></el-table-column>
      <el-table-column align="center" label="开户银行" prop="bankName"></el-table-column>
      <el-table-column align="center" label="开户银行-新" prop="bankNameNew"></el-table-column>
      <el-table-column align="center" label="银行账号" prop="bankAccount"></el-table-column>
      <el-table-column align="center" label="银行账号-新" prop="bankAccountNew"></el-table-column>
      <el-table-column align="center" label="客户税号" prop="tax"></el-table-column>
      <el-table-column align="center" label="客户税号-新" prop="taxNew"></el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="billFormDialog" width="70%">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据状态:" prop="billStatus" class="el-form-flex">
                <el-input v-model="form.billStatus" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="form.billNo" :readonly="true"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户编号:" prop="code" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;">
                  <svg-icon icon-class="add" ></svg-icon>
                  <el-input v-model="form.code" :readonly="true" style="display: inline-block;width: 80%"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户名称:" prop="name" class="el-form-flex">
                <el-input v-model="form.name" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户名称-新:" prop="nameNew" class="el-form-flex">
                <el-input v-model="form.nameNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                <el-input v-model="form.bankName" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="开户银行-新:" prop="bankNameNew" class="el-form-flex">
                <el-input v-model="form.bankNameNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="银行账号:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="form.bankAccount" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="银行账号-新:" prop="bankAccountNew" class="el-form-flex">
                <el-input v-model="form.bankAccountNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户税号:" prop="tax" class="el-form-flex">
                <el-input v-model="form.tax" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户税号-新:" prop="taxNew" class="el-form-flex">
                <el-input v-model="form.taxNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票人:" prop="spMan" class="el-form-flex">
                <el-input v-model="form.spMan" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票人-新:" prop="spManNew" class="el-form-flex">
                <el-input v-model="form.spManNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票电话:" prop="spTel" class="el-form-flex">
                <el-input v-model="form.spTel" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票电话-新:" prop="spTelNew" class="el-form-flex">
                <el-input v-model="form.spTelNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票地址:" prop="spAddress" class="el-form-flex">
                <el-input v-model="form.spAddress" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票地址-新:" prop="spAddressNew" class="el-form-flex">
                <el-input v-model="form.spAddressNew"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:" prop="recordFile" class="el-form-flex">
                <el-upload
                  class="upload-demo customer-upload"
                  style="height: 100%"
                  action="api/goods/storage/create"
                  :on-remove="handleRemove"
                  :limit="1"
                  :on-error="handleError"
                  :on-success="handleSuccess"
                  :file-list="fileList">
                  <svg-icon icon-class="add"></svg-icon>
                </el-upload>
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


    <!-- 客户选择-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>


    <!--详情-->
    <detail-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                 @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </detail-view>
  </div>
</template>

<script>
  import {
    page,
    addBill,
    getObj,
    deleteBill
  } from '@/api/erp/crm/customerEdit';

  export default {
    name: 'customerEdit',
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'detail-view': () => import('./customerEditView')
    },
    data() {
      return {
        isLoading: false,
        form: {
          code: undefined,
          name: undefined,
          nameNew: undefined,
          bankName: undefined,
          bankNameNew: undefined,
          bankAccount: undefined,
          bankAccountNew: undefined,
          tax: undefined,
          taxNew: undefined,
          spMan: undefined,
          spManNew: undefined,
          spTel: undefined,
          spTelNew: undefined,
          spAddress: undefined,
          spAddressNew: undefined,
          note: undefined

        },
        fileList:[],
        rules: {
          code: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.code)
            }, message: '请输入', trigger: 'blur'
          }],
          nameNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.nameNew)
            }, message: '请输入', trigger: 'blur'
          }],
          bankNameNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.bankNameNew)
            }, message: '请输入', trigger: 'blur'
          }],
          bankAccountNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.bankAccountNew)
            }, message: '请输入', trigger: 'blur'
          }],
          taxNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.taxNew)
            }, message: '请输入', trigger: 'blur'
          }],
          spManNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.spManNew)
            }, message: '请输入', trigger: 'blur'
          }],
          spTelNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.spTelNew)
            }, message: '请输入', trigger: 'blur'
          }],
          spAddressNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.spAddressNew)
            }, message: '请输入', trigger: 'blur'
          }],
          recordFile:[{required:true,message:'请上传附件',trigger: 'blur'}]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          code: undefined,
        },
        dialogFormVisible: false,
        customerVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '编辑客户修改单',
          create: '新增客户修改单'
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
            this.listLoading = false;
          })
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入"))
        } else {
          callback();
        }
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        getObj(this.selectedRows[0].id)
          .then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
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
                });
                this.getList();
              });
          });
      },
      create(formName) {
        const set = this.$refs;
        this.isLoading = true;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            addBill(this.form).then(response => {
              this.isLoading = false;
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
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
            this.isLoading = false;
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            addBill(this.form).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {};
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.billNo = undefined;
        this.listQuery.customerCode = undefined;
        this.listQuery.customerName = undefined;
      },
      //行点击
      handleRowClick(row, event, column) {
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1]);
        }
        this.selectedRows = val;
      },
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      handleCustomerDel() {
        this.form.customerCode = undefined;
        this.form.customerName = undefined;
        this.$refs.customer.reset();
      },
      closeCustomerDialog(list) {
        this.customerVisible = false;
        if (list.length > 0) {
          this.form.code = list[0].customerCode;
          this.form.name = list[0].customerName;
          this.form.bankName = list[0].bankName;
          this.form.bankAccount = list[0].bankAccount;
          this.form.tax = list[0].taxpayerNumber;
          this.form.spMan = list[0].spMan;
          this.form.spTel = list[0].spTel;
          this.form.spAddress = list[0].spAddress;

          this.$refs['form'].validate(valid => {
          });
        }
      },


      //详情
      handleDetailOpen(row) {
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        this.getList();
      },

      handleSuccess(response, file, fileList){
        this.fileList=fileList
        console.log(fileList)
        this.$set(this.form,'recordFile',response.data.url)
        this.$refs['form'].validateField('recordFile')
      },

      handleError(error){
        this.$message.error('合同上传失败,请检查网络环境!')
      },

      handleRemove(){
        this.form.recordFile=''
        this.fileList=[]
      }
    }
  }
</script>
<style>
  .customer-upload .el-upload{
    vertical-align: sub;
  }
</style>
