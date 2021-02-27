<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="员工工号"
                v-model="listQuery.staffCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名"
                v-model="listQuery.staffName"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable"
              :height="clientHeight" :default-sort="{prop: 'staffCode', order: 'descending'}">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="员工工号" prop="staffCode" sortable></el-table-column>
      <el-table-column align="center" label="员工姓名" prop="staffName"></el-table-column>
      <el-table-column align="center" label="年度" prop="year"></el-table-column>
      <el-table-column align="center" label="第一季度" prop="quarter1"></el-table-column>
      <el-table-column align="center" label="第二季度" prop="quarter2"></el-table-column>
      <el-table-column align="center" label="第三季度" prop="quarter3"></el-table-column>
      <el-table-column align="center" label="第四季度" prop="quarter4"></el-table-column>
      <el-table-column align="center" label="年度绩效分数" prop="yearScore"></el-table-column>
      <el-table-column align="center" label="资历分数" prop="seniorityScore"></el-table-column>
      <el-table-column align="center" label="本次绩效分数" prop="performanceScore"></el-table-column>
      <el-table-column align="center" label="累计分数" prop="totalScore"></el-table-column>
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
              <el-form-item label="员工工号:" prop="staffCode" class="el-form-flex">
                <div @click="handleStaffUserSelector" style="cursor: pointer;">
                  <el-input placeholder="请输入员工工号" v-model="form.staffCode" class="input-with-select"
                            readonly="readonly">
                  </el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="姓名:" prop="staffName" class="el-form-flex">
                <el-input v-model="form.staffName" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="年度:" prop="year" class="el-form-flex">
                <el-input v-model="form.year"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="第一季度" prop="quarter1" class="el-form-flex">
                <el-input v-model="form.quarter1"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="第二季度" prop="quarter2" class="el-form-flex">
                <el-input v-model="form.quarter2"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="第三季度" prop="quarter3" class="el-form-flex">
                <el-input v-model="form.quarter3"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="第四季度" prop="quarter4" class="el-form-flex">
                <el-input v-model="form.quarter4"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="年度绩效" prop="yearScore" class="el-form-flex">
                <el-input v-model="form.yearScore"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="资历分数" prop="seniorityScore" class="el-form-flex">
                <el-input v-model="form.seniorityScore"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="本次绩效" prop="performanceScore" class="el-form-flex">
                <el-input v-model="form.performanceScore"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="累计分数" prop="totalScore" class="el-form-flex">
                <el-input v-model="form.totalScore"></el-input>
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

    <!-- 员工档案列表弹窗-->
    <el-dialog title="请选择员工" :visible.sync="selectorVisible" append-to-body>
      <staff-user-selector @closeStaffUserDialog="closeStaffUserDialog"
                           ref="staffUser"></staff-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelStaffUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitStaffUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj
  } from '@/api/erp/hrm/staffPerformance';

  export default {
    name: 'staffPerformance',
    components: {
      'staff-user-selector': () => import('@/components/ERP/Hrm/staffUserSelector'),
    },
    data() {
      return {
        clientHeight: 300,
        isLoading: false,
        form: {
          staffCode: undefined,
          staffName: undefined,
          year: undefined,
          quarter1: undefined,
          quarter2: undefined,
          quarter3: undefined,
          quarter4: undefined,
          yearScore: undefined,
          performanceScore: undefined,
          seniorityScore: undefined,
          totalScore: undefined
        },
        rules: {
          staffCode: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.staffCode)
            }, message: '请输入', trigger: 'blur'
          }],
          staffName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.staffName)
            }, message: '请输入', trigger: 'blur'
          }],
          year: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.year)
            }, message: '请输入', trigger: 'blur'
          }],
          quarter1: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.quarter1)
            }, message: '请输入', trigger: 'blur'
          }],
          quarter2: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.quarter2)
            }, message: '请输入', trigger: 'blur'
          }],
          quarter3: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.quarter3)
            }, message: '请输入', trigger: 'blur'
          }],
          quarter4: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.quarter4)
            }, message: '请输入', trigger: 'blur'
          }],
          yearScore: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.yearScore)
            }, message: '请输入', trigger: 'blur'
          }],
          performanceScore: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.performanceScore)
            }, message: '请输入', trigger: 'blur'
          }],
          seniorityScore: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.seniorityScore)
            }, message: '请输入', trigger: 'blur'
          }],
          totalScore: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.totalScore)
            }, message: '请输入', trigger: 'blur'
          }],

        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          staffCode: undefined,
          staffName: undefined
        },
        dialogFormVisible: false,
        selectorVisible: false,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.getList();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 39;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入"))
        } else {
          callback();
        }
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
            this.listLoading = false;
          })
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
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            addBill(this.form).then(() => {
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
        this.listQuery.staffCode = undefined;
        this.listQuery.staffName = undefined;
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
      // 员工选择
      handleStaffUserSelector() {
        this.selectorVisible = true;
      },
      handleCancelStaffUser() {
        this.$refs.staffUser.reset();
        this.selectorVisible = false;
      },
      handleSubmitStaffUser() {
        this.$refs.staffUser.onSubmit();
      },
      closeStaffUserDialog(list) {
        this.selectorVisible = false;
        if (list.length > 0) {
          this.form.staffCode = list[0].staffCode;
          this.form.staffName = list[0].name;
          this.$refs['form'].validate(valid => {
          });
        }
      },
    }
  }
</script>
