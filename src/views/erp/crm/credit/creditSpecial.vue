<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号"
                v-model="listQuery.billNo"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户编号"
                v-model="listQuery.customerCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户名称"
                v-model="listQuery.customerName"></el-input>

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
      <el-table-column align="center" label="客户编号" prop="customerCode"></el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
      <el-table-column align="center" label="信用额度" prop="creditLimit"></el-table-column>
      <el-table-column align="center" label="超出额度" prop="limitBeyond"></el-table-column>
      <el-table-column align="center" label="特批有效期" prop="validateTime"></el-table-column>
      <el-table-column align="center" label="特批原因" prop="reason"></el-table-column>
      <el-table-column align="center" label="制单人" prop="crtUserName"></el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,50, 100]" :page-size="listQuery.limit"
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
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                <div @click="handleCreditSelector" style="cursor: pointer;">
                  <el-input v-model="form.customerCode" :readonly="true"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <div @click="handleCreditSelector" style="cursor: pointer;">
                  <el-input v-model="form.customerName" :readonly="true"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="信用额度:" prop="creditLimit" class="el-form-flex">
                <el-input v-model="form.creditLimit" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="超出额度:" prop="limitBeyond" class="el-form-flex">
                <el-input v-model="form.limitBeyond" type="number"></el-input>
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td>
              <el-form-item label="特批类型:" prop="type" class="el-form-flex">
                <el-input v-model="form.type"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="有效日期:" prop="validateTime" class="el-form-flex">
                <el-date-picker v-model="form.validateTime" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="特批原因:" prop="reason" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="form.reason"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" :loading="isLoading">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>


    <!-- 客户信用额度选择-->
    <el-dialog title="请选择客户" :visible.sync="creditVisible" append-to-body>
      <credit-selector @closeCreditDialog="closeCreditDialog" :isSingle="true" ref="credit"></credit-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCredit">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCredit">确 定</el-button>
      </span>
    </el-dialog>

    <!--详情-->
    <credit-special-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                         @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </credit-special-view>
  </div>
</template>

<script>
  import {
    page,
    addBill,
    getObj,
    deleteBill
  } from '@/api/erp/crm/creditSpecial';
  import {mapGetters} from 'vuex';

  export default {
    name: 'creditSpecial',
    components: {
      'credit-selector': () => import('@/components/ERP/Customer/creditSelector'),
      'credit-special-view': () => import('./creditSpecialView')
    },
    data() {
      return {
        isLoading: false,
        form: {
          customerCode: undefined,
          customerName: undefined,
          creditLimit: undefined,
          limitBeyond: undefined,
          validateTime: undefined,
          type: undefined,
          reason: undefined
        },
        rules: {
          customerName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerName)
            }, message: '请输入', trigger: 'blur'
          }],
          customerCode: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerCode)
            }, message: '请输入', trigger: 'blur'
          }],
          credit: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.credit)
            }, message: '请输入', trigger: 'blur'
          }],
          creditLimit: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.creditLimit)
            }, message: '请输入', trigger: 'blur'
          }],
          limitBeyond: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.limitBeyond)
            }, message: '请输入', trigger: 'blur'
          }],
          validateTime: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.validateTime)
            }, message: '请输入', trigger: 'blur'
          }]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerCode: undefined,
          customerName: undefined,
        },
        dialogFormVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        creditVisible: false,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '修改数据',
          create: '添加数据'
        }
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
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
      handleCreditSelector() {
        this.creditVisible = true;
      },
      handleCancelCredit() {
        this.$refs.credit.reset();
        this.creditVisible = false;
      },
      handleSubmitCredit() {
        this.$refs.credit.onSubmit();
      },
      handleCreditDel() {
        this.form.customerCode = undefined;
        this.form.customerName = undefined;
        this.$refs.credit.reset();
      },
      closeCreditDialog(list) {
        this.creditVisible = false;
        if (list.length > 0) {
          this.form.customerName = list[0].customerName;
          this.form.customerCode = list[0].customerCode;
          this.form.creditLimit = list[0].creditLimit;
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
    }
  }
</script>
