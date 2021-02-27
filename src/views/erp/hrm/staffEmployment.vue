<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名"
                v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门"
                v-model="listQuery.departmentName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职务"
                v-model="listQuery.postName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="上级"
                v-model="listQuery.leader"></el-input>
      <el-date-picker
        style="width: 200px;"
        class="filter-item"
        v-model="listQuery.joinDate"
        type="date"
        placeholder="入司日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
      </el-date-picker>
      <el-date-picker
        style="width: 200px;"
        class="filter-item"
        v-model="listQuery.fullDate"
        type="date"
        align="right"
        placeholder="转正日期"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
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
      <el-table-column align="center" label="姓名" prop="name"></el-table-column>
      <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
      <el-table-column align="center" label="职务" prop="postName"></el-table-column>
      <el-table-column align="center" label="上级" prop="leader"></el-table-column>
      <el-table-column align="center" label="转正时间" prop="fullDate" sortable></el-table-column>
      <el-table-column align="center" label="入司时间" prop="joinDate" sortable></el-table-column>

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
            <td colspan="2">
              <el-form-item label="姓名:" prop="name" class="el-form-flex">
                <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="部门:" prop="departmentName" class="el-form-flex">
                <div @click="openDepartDialog" style="cursor: pointer;">
                  <el-input v-model="form.departmentName" placeholder="请选择部门"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="上级:" prop="leader" class="el-form-flex">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-input v-model="form.leader" placeholder="请选择上级"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="职务:" prop="postName" class="el-form-flex">
                <div @click="openPostDialog=true&&dialogStatus ==='create'" style="cursor: pointer;">
                  <el-input v-model="form.postName" :readonly="dialogStatus !=='create'" placeholder="请选择职务"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="性别:" prop="sex" class="el-form-flex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option value="男">男</el-option>
                  <el-option value="女">女</el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="手机号:" prop="mobilePhone" class="el-form-flex">
                <el-input v-model="form.mobilePhone"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="任职状态:" prop="workStatus" class="el-form-flex">
                <el-select v-model="form.workStatus" placeholder="请选择任职状态">
                  <el-option value="实习">实习</el-option>
                  <el-option value="正常">正常</el-option>
                  <el-option value="兼职">兼职</el-option>
                  <el-option value="离职中">离职中</el-option>
                  <el-option value="已离职">已离职</el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="入司时间:" prop="joinDate" class="el-form-flex">
                <el-date-picker v-model="form.joinDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="转正时间:" prop="fullDate" class="el-form-flex">
                <el-date-picker v-model="form.fullDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="生日:" prop="birthday" class="el-form-flex">
                <el-date-picker v-model="form.birthday" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="身份证号码:" prop="idNumber" class="el-form-flex">
                <el-input v-model="form.idNumber"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="专业:" prop="major" class="el-form-flex">
                <el-input v-model="form.major"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="毕业院校:" prop="graduateSchool" class="el-form-flex">
                <el-input v-model="form.graduateSchool"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="参加工作时间:" prop="workDate" class="el-form-flex">
                <el-date-picker v-model="form.workDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="有效工作年限:" prop="workAge" class="el-form-flex">
                <el-input v-model="form.workAge"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="籍贯:" prop="nativePlace" class="el-form-flex">
                <el-input v-model="form.nativePlace"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="民族" prop="nation" class="el-form-flex">
                <el-input v-model="form.nation"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="户籍所在地:" prop="domicile" class="el-form-flex">
                <el-input v-model="form.domicile"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="现住地:" prop="presentPlace" class="el-form-flex">
                <el-input v-model="form.presentPlace"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="邮箱:" prop="email" class="el-form-flex">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="QQ:" prop="qq" class="el-form-flex">
                <el-input v-model="form.qq"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="紧急联系人:" prop="emergencyContact" class="el-form-flex">
                <el-input v-model="form.emergencyContact"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="紧急联系人手机:" prop="emergencyContactPhone" class="el-form-flex">
                <el-input v-model="form.emergencyContactPhone"></el-input>
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

    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">确定</el-button>
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

    <!--选择职务-->
    <el-dialog title="选择职务" width="45%" :visible.sync="openPostDialog">
      <post-selector @closePostDialog="closePostDialog" @handlerResetPost="handlerResetPost"
                     ref="postSelector"></post-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetPost">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerPost" type="primary"
                   icon="edit">确定</el-button>
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
  } from '@/api/erp/hrm/staffEmployment';

  export default {
    name: 'staffEmployment',
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'user-selector': () => import('@/components/ERP/User/user'),
      'post-selector': () => import('@/components/ERP/Newposition/newposition'),
      'detail-view': () => import('./staffEmploymentView'),
    },
    data() {
      return {
        clientHeight: 300,
        isLoading: false,
        form: {
          name: undefined,
          departmentId: undefined,
          departmentName: undefined,
          postId: undefined,
          postName: undefined,
          leader: undefined,
          fullDate: undefined,
          joinDate: undefined
        },
        rules: {
          sex: [{required: true, message: '请输入'}],
          name: [{required: true, message: '请输入', trigger: 'blur'}],
          workStatus: [{required: true, message: '请输入', trigger: 'blur'}],
          departmentName: [{
            required: true, message: '请输入', trigger: 'blur', validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.departmentName)
            }
          }],
          leader: [{
            required: true, message: '请输入', trigger: 'blur', validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.leader)
            }
          }],
          postName: [{
            required: true, message: '请输入', trigger: 'blur', validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.postName)
            }
          }],
          mobilePhone: [{required: true, message: '请输入', trigger: 'blur'}],
          idNumber: [{required: true, message: '请输入', trigger: 'blur'}],
          emergencyContact: [{required: true, message: '请输入', trigger: 'blur'}],
          emergencyContactPhone: [{required: true, message: '请输入', trigger: 'blur'}],
          fullDate: [{required: true, message: '请输入', trigger: 'blur'}],
          joinDate: [{required: true, message: '请输入', trigger: 'blur'}],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined,
          departmentName: undefined,
          postName: undefined,
          leader: undefined,
          joinDate: undefined,
          fullDate: undefined,
        },
        dialogFormVisible: false,
        dialogDepartVisible: false,
        openPostDialog: false,
        userVisible: false,
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
          callback(new Error("请输入！"))
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
        this.listQuery.name = undefined;
        this.listQuery.departmentName = undefined;
        this.listQuery.postName = undefined;
        this.listQuery.leader = undefined;
        this.listQuery.joinDate = undefined;
        this.listQuery.fullDate = undefined;
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
      //部门选择
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      handlerResetDepart() {
        this.$refs.departSelector.reset()
      },
      openDepartDialog() {
        if (this.dialogStatus === 'create') {
          this.dialogDepartVisible = true
        }
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.form.departmentId = depart.id;
          this.form.departmentName = depart.label
        }
        this.$refs['form'].validateField('departmentName')
        this.dialogDepartVisible = false
      },
      // 上级选择
      handleUserSelector() {
        if (this.dialogStatus === 'create') {
          this.userVisible = true;
        }
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
          this.form.leader = list[0].no;
          this.$refs['form'].validateField('leader');
        }
      },
      //角色选择
      handlerPost() {
        this.$refs.postSelector.onSubmit()
      },
      handlerResetPost() {
        this.$refs.postSelector.reset()
      },
      closePostDialog(post) {
        if (post.id) {
          this.form.postId = post.id;
          this.form.postName = post.label
        } else {
          this.form.postId = undefined;
          this.form.postName = undefined;
        }
        this.$refs['form'].validateField('postName');
        this.openPostDialog = false;
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
