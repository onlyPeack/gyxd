<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="员工工号"
                v-model="listQuery.staffCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名"
                v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门"
                v-model="listQuery.department"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职务"
                v-model="listQuery.post"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="上级"
                v-model="listQuery.leader"></el-input>
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
      <el-table-column align="center" label="部门" prop="department"></el-table-column>
      <el-table-column align="center" label="职务" prop="post"></el-table-column>
      <el-table-column align="center" label="上级" prop="leader"></el-table-column>
      <el-table-column align="center" label="工作地点" prop="workPlace"></el-table-column>
      <el-table-column align="center" label="请假类型" prop="type"></el-table-column>
      <el-table-column align="center" label="请假天数" prop="days"></el-table-column>
      <el-table-column align="center" label="开始时间" prop="beginDate"></el-table-column>
      <el-table-column align="center" label="结束时间" prop="endDate"></el-table-column>

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
                  <el-input placeholder="请选择员工工号" v-model="form.staffCode" class="input-with-select"
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
              <el-form-item label="部门:" prop="department" class="el-form-flex">
                <el-input v-model="form.department" placeholder="请输入部门"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="上级:" prop="leader" class="el-form-flex">
                <el-input v-model="form.leader" placeholder="请输入上级"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="职务:" prop="post" class="el-form-flex">
                <el-input v-model="form.post" placeholder="请输入职务"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="工作地点:" prop="workPlace" class="el-form-flex">
                <el-input v-model="form.workPlace" placeholder="请输入工作地点"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="请假类型:" prop="type" class="el-form-flex">
                <el-select v-model="form.type" placeholder="请选择请假请假类型">
                  <el-option value="事假">事假</el-option>
                  <el-option value="病假">病假</el-option>
                  <el-option value="年假">年假</el-option>
                  <el-option value="婚假">婚假</el-option>
                  <el-option value="产假">产假</el-option>
                  <el-option value="丧假">丧假</el-option>
                  <el-option value="工伤假">工伤假</el-option>
                  <el-option value="探亲假">探亲假</el-option>
                  <el-option value="其他">其他</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="请假天数:" prop="days" class="el-form-flex">
                <el-input v-model="form.days" type="number" placeholder="请输入请假天数"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开始时间:" prop="beginDate" class="el-form-flex">
                <el-date-picker v-model="form.beginDate" type="datetime" placeholder="请选择时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="结束时间:" prop="endDate" class="el-form-flex">
                <el-date-picker v-model="form.endDate" type="datetime" placeholder="请选择时间"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                format="yyyy-MM-dd HH:mm:ss" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="请假原因:" prop="reason" class="el-form-flex">
                <el-input type="textarea" :rows="2" v-model="form.reason" placeholder="请输入请假原因"></el-input>
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
  } from '@/api/erp/hrm/staffLeave';

  export default {
    name: 'staffLeave',
    components: {
      'staff-user-selector': () => import('@/components/ERP/Hrm/staffUserSelector'),
      'bill-view': () => import('./staffLeaveView'),
    },
    data() {
      return {
        clientHeight: 300,
        isLoading: false,
        form: {
          staffCode: undefined,
          name: undefined,
          department: undefined,
          post: undefined,
          leader: undefined,
          workPlace: undefined,
          days: undefined,
          beginDate: undefined,
          endDate: undefined,
          type: undefined,
          reason: undefined,
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
          department: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.department)
            }, message: '请输入', trigger: 'blur'
          }],
          post: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.post)
            }, message: '请输入', trigger: 'blur'
          }],
          leader: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.leader)
            }, message: '请输入', trigger: 'blur'
          }],
          workPlace: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.workPlace)
            }, message: '请输入', trigger: 'blur'
          }],
          type: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.type)
            }, message: '请输入', trigger: 'blur'
          }],
          days: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.days)
            }, message: '请输入', trigger: 'blur'
          }],
          beginDate: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.beginDate)
            }, message: '请输入', trigger: 'blur'
          }],
          endDate: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.endDate)
            }, message: '请输入', trigger: 'blur'
          }],
          reason: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.reason)
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
          department: undefined,
          post: undefined,
          leader: undefined,
        },
        dialogFormVisible: false,
        selectorVisible: false,
        dialogDetailVisible: false,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '制单'
        }
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
        this.listQuery.department = undefined;
        this.listQuery.post = undefined;
        this.listQuery.leader = undefined;
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
          this.form.leader = list[0].leader;
          this.form.department = list[0].departmentName;
          this.form.post = list[0].postName;
          this.$refs['form'].validate(valid => {
          });
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

