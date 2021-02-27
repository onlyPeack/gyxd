<template>
  <div class="app-container calendar-list-container customer-visit-container">
    <div class="filter-container">

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
      <el-table-column align="center" label="关联客户编号" prop="customerCode"></el-table-column>
      <el-table-column align="center" label="关联客户名称" prop="customerName" width="260"></el-table-column>
      <el-table-column align="center" label="关联商机" prop="chance"></el-table-column>
      <el-table-column align="center" label="联系人" prop="linkman"></el-table-column>
      <el-table-column align="center" label="跟进阶段" prop="step"></el-table-column>
      <el-table-column align="center" label="执行人" prop="executorName"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="beginTime"></el-table-column>
      <el-table-column align="center" label="结束时间" prop="endTime"></el-table-column>
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
              <el-form-item label="跟进阶段:" prop="step" class="el-form-flex">
                <el-select v-model="form.step" placeholder="请选择跟进阶段">
                  <el-option value="跟踪">跟踪</el-option>
                  <el-option value="成功">成功</el-option>
                  <el-option value="失败">失败</el-option>
                  <el-option value="搁置">搁置</el-option>
                  <el-option value="失效">失效</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="关联客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;">
                  <el-input v-model="form.customerName"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联商机:" prop="chance" class="el-form-flex">
                <div @click="handleChanceSelector" style="cursor: pointer;">
                  <el-input v-model="form.chance"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="联系人:" prop="linkman" class="el-form-flex">
                <el-input v-model="form.linkman"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="执行人:" prop="executorName" class="el-form-flex">
                <el-input v-model="form.executorName"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="跟进描述:" prop="description" class="el-form-flex">
                <el-input v-model="form.description"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开始时间:" prop="beginTime" class="el-form-flex">
                <el-date-picker v-model="form.beginTime" type="datetime" placeholder="请选择时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="结束时间:" prop="endTime" class="el-form-flex">
                <el-date-picker v-model="form.endTime" type="datetime" placeholder="请选择时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
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
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')":loading="isLoading">确 定</el-button>
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

    <!-- 商机选择-->
    <el-dialog title="请选择商机" :visible.sync="chanceVisible" append-to-body>
      <chance-selector @closeChanceDialog="closeChanceDialog" :isSingle="true" ref="chance"></chance-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelChance">取 消</el-button>
        <el-button type="primary" @click="handleSubmitChance">确 定</el-button>
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
  } from '@/api/erp/crm/customerFollow';
  import {mapGetters} from 'vuex';

  export default {
    name: 'customerFollow',
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'chance-selector': () => import('@/components/ERP/Customer/chanceSelector'),
    },
    data() {
      return {
        isLoading:false,
        form: {
          customerCode: undefined,
          customerName: undefined,
          chance: undefined,
          executorNo: undefined,
          executorName: undefined,
          linkman: undefined,
          description: undefined,
          beginTime: undefined,
          endTime: undefined,
          step: undefined,
          note: undefined
        },
        rules: {
          step: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.step)
            }, message: '请输入', trigger: 'blur'
          }],
          linkman: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.linkman)
            }, message: '请输入', trigger: 'blur'
          }],
          customerName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerName)
            }, message: '请输入', trigger: 'blur'
          }],
          description: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.description)
            }, message: '请输入', trigger: 'blur'
          }],
          beginTime: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.beginTime)
            }, message: '请输入', trigger: 'blur'
          }],
          endTime: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.endTime)
            }, message: '请输入', trigger: 'blur'
          }],
          executorName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.executorName)
            }, message: '请输入', trigger: 'blur'
          }],
          chance: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.chance)
            }, message: '请输入', trigger: 'blur'
          }]
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          customerCode: undefined,
          customerName: undefined,
        },
        dialogFormVisible: false,
        customerVisible: false,
        chanceVisible: false,
        selectedRows: [],
        dialogStatus: '',
        textMap: {
          update: '修改跟进记录',
          create: '添加跟进记录'
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
        this.form.executorNo = this.$store.state.user.id;
        this.form.executorName = this.$store.state.user.name;
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
        this.listQuery.customerCode = undefined;
        this.listQuery.customerName = undefined;
      },
      //行点击
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
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
          this.form.customerName = list[0].customerName;
          this.form.customerCode = list[0].customerCode;
        }
      },
      //商机选择
      handleChanceSelector() {
        this.chanceVisible = true;
      },
      handleCancelChance() {
        this.$refs.chance.reset();
        this.chanceVisible = false;
      },
      handleSubmitChance() {
        this.$refs.chance.onSubmit();
      },
      handleChanceDel() {
        this.form.chance = undefined;
        this.$refs.chance.reset();
      },
      closeChanceDialog(list) {
        this.chanceVisible = false;
        if (list.length > 0) {
          this.form.chance = list[0].name;
          this.$refs['form'].validate(valid => { });
        }
      },
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .customer-visit-container {
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
