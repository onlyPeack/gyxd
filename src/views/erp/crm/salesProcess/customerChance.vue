<template>
  <div class="app-container calendar-list-container customer-chance-container">
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="商机名称"
                v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="关联客户编号"
                v-model="listQuery.customerCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="关联客户名称"
                v-model="listQuery.customerName"></el-input>

      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="商机名称" prop="name"></el-table-column>
      <el-table-column align="center" label="商机负责人" prop="headName"></el-table-column>
      <el-table-column align="center" label="关联客户编号" prop="customerCode"></el-table-column>
      <el-table-column align="center" label="关联客户名称" prop="customerName"></el-table-column>
      <el-table-column align="center" label="客户阶段" prop="step"></el-table-column>
      <el-table-column align="center" label="商机来源" prop="source"></el-table-column>
      <el-table-column align="center" label="预计成单日期" prop="expectDate"></el-table-column>
      <el-table-column align="center" label="备注" prop="note"></el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="ms-dialog">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="商机来源:" prop="source" class="el-form-flex">
                <el-select v-model="form.source" placeholder="请选择商机来源" @change="validateAll">
                  <el-option value="互联网">互联网</el-option>
                  <el-option value="客户介绍">客户介绍</el-option>
                  <el-option value="独立开发">独立开发</el-option>
                  <el-option value="媒体宣传">媒体宣传</el-option>
                  <el-option value="老客户">老客户</el-option>
                  <el-option value="合作伙伴">合作伙伴</el-option>
                  <el-option value="代理商">代理商</el-option>
                  <el-option value="其他">其他</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户阶段:" prop="step" class="el-form-flex">
                <el-select v-model="form.step" placeholder="请选择名片类型" @change="validateAll">
                  <el-option value="初级沟通">初级沟通</el-option>
                  <el-option value="立项评估">立项评估</el-option>
                  <el-option value="需求分析">需求分析</el-option>
                  <el-option value="方案定制">方案定制</el-option>
                  <el-option value="招投标/竞争">招投标/竞争</el-option>
                  <el-option value="商务谈判">商务谈判</el-option>
                  <el-option value="签订合约">签订合约</el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="商机负责人:" prop="headName" class="el-form-flex">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-input v-model="form.headName"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;">
                  <el-input v-model="form.customerName"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="商机名称:" prop="name" class="el-form-flex">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="商机状态:" prop="status" class="el-form-flex">
                <el-select v-model="form.status" placeholder="请选择商机状态" @change="validateAll">
                  <el-option value="跟踪">跟踪</el-option>
                  <el-option value="成功">成功</el-option>
                  <el-option value="失败">失败</el-option>
                  <el-option value="搁置">搁置</el-option>
                  <el-option value="失效">失效</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="可能性(%):" prop="possibility" class="el-form-flex">
                <el-input v-model="form.possibility" type="number"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="预计成单金额:" prop="expectMoney" class="el-form-flex">
                <el-input v-model="form.expectMoney" type="number"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="预计成单日期:" prop="expectDate" class="el-form-flex">
                <el-date-picker v-model="form.expectDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"
                                :picker-options="pickerOptions"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" :loading="isLoading">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" :loading="isLoading">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 员工选择-->
    <el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="true" ref="baseUser"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 客户选择-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/erp/crm/customerChance';
  import {mapGetters} from 'vuex';

  export default {
    name: 'customerChance',
    components: {
      'user-selector': () => import('@/components/ERP/User/user'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
    },
    data() {
      return {
        isLoading:false,
        form: {
          source: undefined,
          step: undefined,
          headNo: undefined,
          headName: undefined,
          name: undefined,
          customerCode: undefined,
          customerName: undefined,
          status: undefined,
          possibility: undefined,
          expectMoney: undefined,
          expectDate: undefined,
          note: undefined,
        },
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        rules: {
          headName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.headName)
            }, message: '请输入', trigger: 'blur'
          }],
          customerName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerName)
            }, message: '请输入', trigger: 'blur'
          }],
          name: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.name)
            }, message: '请输入', trigger: 'blur'
          }],
          step: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.step)
            }, message: '请输入', trigger: 'blur'
          }],
          status: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.status)
            }, message: '请输入', trigger: 'blur'
          }],
          source: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.source)
            }, message: '请输入', trigger: 'blur'
          }]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined,
          customerCode: undefined,
          customerName: undefined,
        },
        dialogFormVisible: false,
        userVisible: false,
        customerVisible: false,
        selectedRows: [],
        dialogStatus: '',
        textMap: {
          update: '修改商机',
          create: '添加商机'
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
            delObj(this.selectedRows[0].id)
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
            addObj(this.form)
              .then(() => {
                this.isLoading = false;
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
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
        this.isLoading = true;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {};
      },
      // 重置查询条件
      resetQuery() {
        this.listQuery.name = undefined;
        this.listQuery.customerCode = undefined;
        this.listQuery.customerName = undefined;
      },
      // 行点击
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      // 员工选择
      handleUserSelector() {
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.baseUser.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.baseUser.onSubmit();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          this.form.headNo = list[0].id;
          this.form.headName = list[0].name;
          this.validateAll();
        }
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
          this.form.customerName = list[0].customerName;
          this.form.customerCode = list[0].customerCode;
          this.validateAll();
        }
      },
      validateAll() {
        this.$refs['form'].validate(valid => {
        });
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .customer-chance-container {
    .ms-dialog {
      font-size: 12px;
      .topTable {
        width: 100%;
        margin-bottom: 20px;
        border: none;
        border-spacing: 0;
        border-collapse: collapse;
        color: #444;

        td {
          border: 1px solid #e0e0e0;
          height: 40px;
          padding: 0px;
          margin: 0px;
          padding-left: 10px;
        }
        .el-form-flex {
          display: flex;
          margin-bottom: 0px;
        }
        .el-input, .el-input-number {
          margin-top: 6px;
        }
        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }
        .el-textarea__inner {
          border: none;
          resize: none;
          padding: 10px 15px;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-form-item__content {
          width: 100%;
          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }
        }
        .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
          line-height: 40px;
          color: #444;
          min-width: 120px;
        }
      }
    }
  }
</style>
