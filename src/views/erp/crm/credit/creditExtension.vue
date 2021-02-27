<template>
  <div class="bill-container">
    <div class="filter-container">

      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号"
                v-model="listQuery.billNo" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户编号"
                v-model="listQuery.customerCode" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户名称"
                v-model="listQuery.customerName" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="授信业务员工号"
                v-model="listQuery.crtUserNo" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户归属部门"
                v-model="listQuery.departName" clearable></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
      <br/>
        <el-date-picker
        v-model="billDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="授信日期"
        end-placeholder="授信日期"
        @change="handleDateSelect"
        value-format="yyyy-MM-dd">
      </el-date-picker>
      <el-date-picker
        v-model="hisenseDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="还信日期"
        end-placeholder="还信日期"
        @change="handleDateSelect"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>

    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
    </div>

    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable" :default-sort="{prop: 'billNo', order: 'descending'}">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="单据状态" prop="billStatus" width="100" >
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo" sortable >
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleDetailOpen(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户编号" prop="customerCode">
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName">
      </el-table-column>
      <el-table-column align="center" label="授信业务员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="客户归属部门" prop="departName">
      </el-table-column>
      <el-table-column align="center" label="授信员工" prop="salerName">
      </el-table-column>
      <el-table-column align="center" label="授信金额" prop="creditAmount">
      </el-table-column>
      <el-table-column align="center" label="授信日期" prop="billDate">
      </el-table-column>
      <el-table-column align="center" label="还信日期" prop="hisenseDate">
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
              <el-form-item label="授信客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;">
                  <div style="text-indent: 10px;display: inline-block">
                    <el-input v-model="dataForm.customerName" :readonly="true"></el-input></div>
                  <span  style="position: absolute;left: 0;top: 6px">
                  <svg-icon icon-class="add" ></svg-icon>
                  </span>
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


    <!-- 授信客户弹窗-->
    <el-dialog title="请选择授信客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
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
  } from '@/api/erp/crm/creditExtension';
  import {mapGetters} from 'vuex';

  export default {
    name: 'creditExtension',
    components: {
      'customer-selector': () => import('./components/customerSelector'),
      'sales-user-selector': () => import('@/components/ERP/User/salesUser'),
      'credit-extension-view': () => import('./creditExtensionView')
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        isLoading: false,
        billDate: undefined,
        hisenseDate: undefined,
        dataForm: {
          billNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          creditAmount: undefined,
          salerId: undefined,
          salerName: undefined,
          salerCode: undefined,
          startHisenseDate: undefined,
          endHisenseDate: undefined,
          availableAmount: undefined,
          note: undefined
        },
        rules: {
          customerName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.customerName)
            }, message: '请选择授信客户', trigger: 'blur'
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
        date:undefined,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerName: undefined,
          customerCode: undefined,
          crtUserNo: undefined,
          departName: undefined,
          startDate:undefined,
          endDate: undefined,

        },
        dialogFormVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        availableAmount: undefined,
        customerVisible: false,
        dialogStatus: '',
        selectedRows: [],
        customerArr: [],
        textMap: {
          update: '编辑客户授信单',
          create: '新增客户授信单'
        }
      }
    },
    created() {
      this.init();
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
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
          this.listQuery.startHisenseDate = undefined;
          this.listQuery.endHisenseDate = undefined;
        }
      },
    },
    methods: {
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
        this.listQuery. startHisenseDate = val[0] + ' 00:00:00';
        this.listQuery.endHisenseDate = val[1] + ' 23:59:59';
      },
      init() {
        queryAmount(this.$store.state.user.code).then(response => {
          this.availableAmount = response;
        });
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            console.log(response);
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          });
        queryAmount(this.$store.state.user.code).then(response => {
          this.dataForm.availableAmount = response;
          this.availableAmount = response;
        });
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
            this.dataForm = response.data;
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
            addBill(this.dataForm).then(response => {
              this.isLoading = false;
              if (response.code == '2000') {
                this.isLoading = false;
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.isLoading = false;
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
            addBill(this.dataForm).then(response => {
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
        this.dataForm = {};
        this.dataForm.salerId = this.$store.state.user.id;
        this.dataForm.salerName = this.$store.state.user.name;
        this.dataForm.salerCode = this.$store.state.user.code;
        this.dataForm.availableAmount = this.availableAmount;
        this.dataForm.billDate = this.dataForm.billDate ? this.dataForm.billDate : new Date().toLocaleDateString().replace(/\//g, '-');
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.billNo = undefined;
        this.listQuery.customerCode = undefined;
        this.listQuery.customerName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.listQuery.startHisenseDate = undefined;
        this.listQuery.endHisenseDate = undefined;
        this.billDate = undefined;
        this.hisenseDate = undefined;
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
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerId = undefined;
        this.dataForm.customerName = undefined;
        this.dataForm.customerCode = undefined;
        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerId = list[0].id;
          this.dataForm.customerCode = list[0].customerCode;
          this.$refs['form'].validateField('customerName');
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
