<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="员工工号"
                v-model="listQuery.staffCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名"
                v-model="listQuery.name"></el-input>
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
              :height="clientHeight" :default-sort="{prop: 'billNo', order: 'descending'}">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="单据状态" prop="billStatus" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleDetailOpen(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="员工工号" prop="staffCode"></el-table-column>
      <el-table-column align="center" label="姓名" prop="name"></el-table-column>
      <el-table-column align="center" label="调整时间" prop="adjustDate" width="120px"></el-table-column>
      <el-table-column align="center" label="原部门" prop="departmentOld"></el-table-column>
      <el-table-column align="center" label="原职务" prop="postOld"></el-table-column>
      <el-table-column align="center" label="原上级" prop="leaderOld"></el-table-column>
      <el-table-column align="center" label="新部门" prop="departmentNameNew"></el-table-column>
      <el-table-column align="center" label="新职务" prop="postNameNew"></el-table-column>
      <el-table-column align="center" label="新上级" prop="leaderNew"></el-table-column>
      <el-table-column align="center" label="调整原因" prop="adjustReason" width="200px"></el-table-column>

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
              <el-form-item label="姓名:" prop="name" class="el-form-flex">
                <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原部门:" prop="departmentOld" class="el-form-flex">
                <el-input v-model="form.departmentOld" placeholder="请输入原部门"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新部门:" prop="departmentNameNew" class="el-form-flex">
                <div @click="openDepartDialog" style="cursor: pointer;">
                  <el-input v-model="form.departmentNameNew" placeholder="请选择新部门"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原上级:" prop="leaderOld" class="el-form-flex">
                <el-input v-model="form.leaderOld" placeholder="请输入原上级"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新上级:" prop="leaderNew" class="el-form-flex">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-input v-model="form.leaderNew" placeholder="请选择新上级"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原职务:" prop="postOld" class="el-form-flex">
                <el-input v-model="form.postOld" placeholder="请输入原职务"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新职务:" prop="postNameNew" class="el-form-flex">
                <div @click="openPostDialog=true" style="cursor: pointer;">
                  <el-input v-model="form.postNameNew" placeholder="请输入新职务"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原薪级:" prop="salaryLevelOld" class="el-form-flex">
                <el-input v-model="form.salaryLevelOld" placeholder="请输入原薪级"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新薪级:" prop="salaryLevelNew" class="el-form-flex">
                <el-input v-model="form.salaryLevelNew" placeholder="请输入新薪级"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原薪档:" prop="salaryFileOld" class="el-form-flex">
                <el-input v-model="form.salaryFileOld" placeholder="请输入原薪档"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新薪档:" prop="salaryFileNew" class="el-form-flex">
                <el-input v-model="form.salaryFileNew" placeholder="请输入新薪档"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="调整时间:" prop="adjustDate" class="el-form-flex">
                <el-date-picker v-model="form.adjustDate" type="date" placeholder="请输入调整时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="调整原因:" prop="adjustReason" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="form.adjustReason" placeholder="请输入调整原因"></el-input>
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

    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!--选择职务-->
    <el-dialog title="选择职务" width="45%" :visible.sync="openPostDialog">
      <post-selector @closePostDialog="closePostDialog" @handlerResetPost="handlerResetPost"
                     ref="psotSelector"></post-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetPost">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerPost" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 员工选择-->
    <el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="true" ref="user"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--详情-->
    <bill-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
               @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </bill-view>
  </div>
</template>

<script>
  import {
    page,
    addBill,
    getObj,
    deleteBill
  } from '@/api/erp/hrm/staffTransaction';

  export default {
    name: 'staffTransaction',
    components: {
      'staff-user-selector': () => import('@/components/ERP/Hrm/staffUserSelector'),
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'post-selector': () => import('@/components/ERP/Newposition/newposition'),
      'user-selector': () => import('@/components/ERP/User/user'),
      'bill-view': () => import('./staffTransactionView'),
    },
    data() {
      return {
        clientHeight: 300,
        isLoading: false,
        openPostDialog: false,
        form: {
          staffCode: undefined,
          name: undefined,
          adjustDate: undefined,
          adjustReason: undefined,
          departmentOld: undefined,
          postOld: undefined,
          leaderOld: undefined,
          salaryLevelOld: undefined,
          salaryFileOld: undefined,
          departmentIdNew: undefined,
          departmentNameNew: undefined,
          postIdNew: undefined,
          postNameNew: undefined,
          salaryLevelNew: undefined,
          salaryFileNew: undefined,
          leaderNew: undefined
        },
        rules: {
          staffCode: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.staffCode)
            }, message: '请输入', trigger: 'blur'
          }],
          name: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.name)
            }, message: '请输入', trigger: 'blur'
          }],
          departmentOld: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.departmentOld)
            }, message: '请输入', trigger: 'blur'
          }],
          postOld: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.postOld)
            }, message: '请输入', trigger: 'blur'
          }],
          adjustDate: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.adjustDate)
            }, message: '请输入', trigger: 'blur'
          }],
          adjustReason: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.adjustReason)
            }, message: '请输入', trigger: 'blur'
          }],
          leaderOld: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.leaderOld)
            }, message: '请输入', trigger: 'blur'
          }],
          departmentNameNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.departmentNameNew)
            }, message: '请输入', trigger: 'blur'
          }],
          postNameNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.postNameNew)
            }, message: '请输入', trigger: 'blur'
          }],
          leaderNew: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.leaderNew)
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
          name: undefined,
        },
        dialogDepartVisible: false,
        userVisible: false,
        dialogFormVisible: false,
        selectorVisible: false,
        dialogDetailVisible: false,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '制单'
        },
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
            addBill(this.form)
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
        this.listQuery.name = undefined;
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
          this.form.name = list[0].name;
          this.form.leaderOld = list[0].leader;
          this.form.departmentOld = list[0].departmentName;
          this.form.postOld = list[0].postName;
          this.$refs['form'].validate(valid => {
          });
        }
      },
      //部门选择
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      handlerPost() {
        this.$refs.psotSelector.onSubmit()
      },
      handlerResetPost() {
        this.$refs.psotSelector.reset()
      },
      handlerResetDepart() {
        this.$refs.departSelector.reset()
      },
      openDepartDialog() {
        this.dialogDepartVisible = true
      },
      closePostDialog(psot) {
        if (psot.id) {
          this.form.postIdNew = psot.id;
          this.form.postNameNew = psot.label
        } else {
          this.form.postIdNew = undefined;
          this.form.postNameNew = undefined;
        }
        this.openPostDialog = false;
        this.$refs['form'].validateField('postNameNew');
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.form.departmentIdNew = depart.id;
          this.form.departmentNameNew = depart.label
        } else {
          this.form.departmentIdNew = undefined;
          this.form.departmentNameNew = undefined
        }
        this.$refs['form'].validateField('departmentNameNew');
        this.dialogDepartVisible = false
      },
      // 上级选择
      handleUserSelector() {
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.user.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.user.onSubmit();
      },
      handleUserDel() {
        this.form.leader = undefined;
        this.$refs.user.reset();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          this.form.leaderNew = list[0].no;
          this.$refs['form'].validateField('leaderNew')
        }
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
