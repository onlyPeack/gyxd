<template>
  <div class="bill-container">
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号"
                v-model="listQuery.billNo"></el-input>
      <el-select placeholder="单据状态" style="width: 200px" class="filter-item" v-model="listQuery.billStatus">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                   :value="item.value"></el-option>
      </el-select>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户编号"
                v-model="listQuery.customerCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="公司名称"
                v-model="listQuery.companyName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="推荐码"
                v-model="listQuery.recommendCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="归属业务员"
                v-model="listQuery.staffName"></el-input>
      <el-date-picker style="position: relative;top: -4px;"
        v-model="date"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="单据时间"
        end-placeholder="单据时间"
        @change="handleDateSelect"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"></el-date-picker>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
<!--      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>-->
<!--      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>-->
      <el-button v-if="user == '00000'" type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
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
      <el-table-column align="center" label="公司名称" prop="companyName"></el-table-column>
      <el-table-column align="center" label="推荐码" prop="recommendCode"></el-table-column>
      <el-table-column align="center" label="归属业务员名称" prop="staffName"></el-table-column>
      <el-table-column align="center" label="单据时间" prop="crtTime"></el-table-column>

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
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                <el-input v-model="form.customerCode" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="公司名称:" prop="companyName" class="el-form-flex">
                <el-input v-model="form.companyName" :readonly="true"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="手机号:" prop="mobile" class="el-form-flex">
                <el-input v-model="form.mobile" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="用户名:" prop="username" class="el-form-flex">
                <el-input v-model="form.username" :readonly="true"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="推荐码:" prop="recommendCode" class="el-form-flex">
                <el-input v-model="form.recommendCode" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="归属业务员名称:" prop="staffName" class="el-form-flex">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-input v-model="form.staffName" :readonly="true"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
        </table>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
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
  } from '@/api/erp/crm/customerRegister';
  import {mapGetters} from 'vuex';

  export default {
    name: 'customerRegister',
    components: {
      'detailView': () => import('./customerRegisterView'),
      'user-selector': () => import('@/components/ERP/User/user'),
    },
    data() {
      return {
        form: {
          customerCode: undefined,
          companyName: undefined,
          username: undefined,
          mobile: undefined,
          userId: undefined,
          staffName: undefined,
          note: undefined,
          recommendCode: undefined,
        },
        date:'',
        rules: {
          companyName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerName)
            }, message: '请输入', trigger: 'blur'
          }],
          customerCode: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.customerCode)
            }, message: '请输入', trigger: 'blur'
          }],
          recommendCode: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.limitOld)
            }, message: '请输入', trigger: 'blur'
          }],
        },
        user:'',
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          companyName: undefined,
          customerCode: undefined,
          billStatus: undefined,
          recommendCode: undefined,
          staffName: undefined,
          startDate:undefined,
          endDate:undefined,
        },
        dialogFormVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        userVisible: false,
        dialogStatus: '',
        selectedRows: [],
        textMap: {
          update: '编辑客户注册单',
          create: '新增客户注册单'
        }
      }
    },
    created() {
      this.user = this.$store.getters.code;
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    watch: {
      date(value) {
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
    },
    methods: {
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
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
        let flag = true;
        for(let i in this.selectedRows){
          if(this.selectedRows[i].billStatus == '4'){
            flag  =  false;
          }
        }
        if(!flag){
          this.vueMessage('warning','单据中包含正常单据不能执行删除操作!');
          return
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
            })
          } else {
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
        this.listQuery.companyName = undefined;
        this.listQuery.billStatus = undefined;
        this.listQuery.recommendCode = undefined;
        this.listQuery.staffName = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate = undefined;
        this.date = undefined;
      },
      //行点击
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleChangeFun(val) {
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
      // 用户选择
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
        this.form.userId = undefined;
        this.form.staffName = undefined;
        this.$refs.user.reset();
      },
      closeUserDialog(list) {
        console.log(list)
        this.userVisible = false;
        if (list.length > 0) {
          this.form.userId = list[0].id;
          this.form.staffName = list[0].name;
          this.form.recommendCode = list[0].no;
          this.$refs['form'].validate(valid => {
          });
        }
      },

    }
  }
</script>
