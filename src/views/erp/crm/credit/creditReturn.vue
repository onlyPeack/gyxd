<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="单据编号"
                v-model="listQuery.billNo" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户编号"
                v-model="listQuery.customerCode" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户名称"
                v-model="listQuery.customerName" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="客户归属部门"
                v-model="listQuery.departName" clearable></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="授信员工工号"
                v-model="listQuery.crtUserNo" clearable></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
      <br/>
      <el-date-picker
        v-model="billDate"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="还信日期"
        end-placeholder="还信日期"
        @change="handleDateSelect"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions">
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
      <el-table-column align="center" label="客户编号" prop="customerCode">
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName">
      </el-table-column>
      <el-table-column align="center" label="客户归属部门" prop="departName">
      </el-table-column>
      <el-table-column align="center" label="授信员工工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="授信员工" prop="salerName">
      </el-table-column>
      <el-table-column align="center" label="授信总金额" prop="creditAmount">
      </el-table-column>
      <el-table-column align="center" label="本次还信金额" prop="thisReturnAmount">
      </el-table-column>
      <el-table-column align="center" label="还信日期" prop="billDate">
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
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
              <el-form-item label="业务员:" prop="salerName" class="el-form-flex">
                <el-input v-model="dataForm.salerName" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handleCreditExtensionSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag.billNo"
                          @close="handleSourceBillNoDel">
                    {{tag.billNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          <tr>
            <td width="50%">
              <el-form-item label="还信客户:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="授信总金额:" prop="creditAmount" class="el-form-flex">
                <el-input v-model="dataForm.creditAmount" :readonly="true"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="已还信金额:" prop="creditAmount" class="el-form-flex">
                <el-input v-model="dataForm.returnAmount" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="本次还信金额:" prop="thisReturnAmount" class="el-form-flex">
                <el-input v-model="dataForm.thisReturnAmount" v-number-input.float></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
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

    <!-- 授信客户选择-->
    <el-dialog title="请选择客户" :visible.sync="creditVisible" append-to-body>
      <credit-selector @closeCreditDialog="closeCreditDialog" :isSingle="true" ref="credit"></credit-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCredit">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCredit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <sales-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                           ref="salerUser"></sales-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSalerUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSalerUser">确 定</el-button>
      </span>
    </el-dialog>

    <!--详情-->
    <credit-return-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                        @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </credit-return-view>

    <!-- 关联单据 -->
    <credit-extension-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                               @submitSelectorSuccess="submitSelectorSuccess"
                               @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </credit-extension-selector>
  </div>
</template>

<script>
  import {
    page,
    addBill,
    getObj,
    deleteBill,
  } from '@/api/erp/crm/creditReturn';
  import {mapGetters} from 'vuex';

  export default {
    name: 'creditReturn',
    components: {
      'credit-selector': () => import('@/components/ERP/Customer/creditSelector'),
      'sales-user-selector': () => import('@/components/ERP/User/salesUser'),
      'credit-return-view': () => import('./creditReturnView'),
      'credit-extension-selector': () => import('@/components/ERP/Customer/creditExtensionSelector'),
    },
    data() {
      return {
        date:undefined,
        isLoading: false,
        billDate: undefined,
        dataForm: {
          billNo: undefined,
          billDate: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          creditAmount: undefined,
          returnAmount: undefined,
          thisReturnAmount: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          salerId: undefined,
          salerName: undefined,
          salerCode: undefined,
          availableAmount: undefined,
          sourceBillId: undefined,
          sourceBillNo: undefined,
          note: undefined
        },
        rules: {
          sourceBillNo: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.sourceBillNo)
            }, message: '请关联客户授信单', trigger: 'blur'
          }],
          thisReturnAmount: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.thisReturnAmount)
            }, message: '请输入本次还信金额', trigger: 'blur'
          }],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerName: undefined,
          customerCode: undefined,
          crtUserNo: undefined,
          departName: undefined,
          startDate: undefined,
          endDate: undefined,
        },
        dialogFormVisible: false,
        dialogDetailVisible: false,
        id: undefined,
        creditVisible: false,
        salerUserVisible: false,
        dialogSelectorVisible: false,
        dialogStatus: '',
        selectedRows: [],
        customerArr: [],
        salerArr: [],
        sourceBillNoArr: [],
        textMap: {
          update: '编辑客户还信单',
          create: '新增客户还信单'
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
        }
      }
    },
    methods: {
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      init() {
        this.salerArr.push({
          "id": this.$store.state.user.id,
          "name": this.$store.state.user.name,
          "code": this.$store.state.user.code
        });
        this.dataForm.salerId = this.$store.state.user.id;
        this.dataForm.salerName = this.$store.state.user.name;
        this.dataForm.salerCode = this.$store.state.user.code;
        this.dataForm.billDate = this.dataForm.billDate ? this.dataForm.billDate : new Date().toLocaleDateString().replace(/\//g, '-');
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
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
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.isLoading = false;
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
        this.sourceBillNoArr = [];
        this.dataForm.billDate = this.dataForm.billDate ? this.dataForm.billDate : new Date().toLocaleDateString().replace(/\//g, '-');
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.billNo = undefined;
        this.listQuery.customerCode = undefined;
        this.listQuery.customerName = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.billDate = undefined;
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
        this.dataForm.customerId = undefined;
        this.dataForm.customerCode = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.credit.reset();
      },
      closeCreditDialog(list) {
        this.creditVisible = false;
        if (list.length > 0) {
          this.dataForm.customerId = list[0].customerId;
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerCode = list[0].customerCode;
          this.$refs['form'].validate(valid => {
          });
        }
      },

      // 业务员选择
      handleSalerUserSelector() {
        this.salerUserVisible = true;
      },
      handleCancelSalerUser() {
        this.$refs.salerUser.reset();
        this.salerUserVisible = false;
      },
      handleSalerUserDel(index) {
        this.salerArr.splice(index, 1);
        this.dataForm.salerId = undefined;
        this.dataForm.salerName = undefined;
        this.dataForm.salerCode = undefined;
        this.$refs.salerUser.reset();
      },
      handleSubmitSalerUser() {
        this.$refs.salerUser.onSubmit();
      },
      closeUserDialog(list) {
        this.salerArr = list;
        this.salerUserVisible = false;
        if (list.length > 0) {
          this.dataForm.salerName = list[0].name;
          this.dataForm.salerId = list[0].id;
          this.dataForm.salerCode = list[0].salerCode;
        }
      },

      //关联单据选择
      handleCreditExtensionSelector() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = undefined;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }
        // this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        // const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        // _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        obj.list.forEach(function (item, index) {
          if (index == 0) {
            _this.dataForm.salerId = item.salerId;
            _this.dataForm.salerName = item.salerName;
            _this.dataForm.salerCode = item.salerCode;
            _this.dataForm.customerId = item.customerId;
            _this.dataForm.customerName = item.customerName;
            _this.dataForm.customerCode = item.customerCode;
            _this.dataForm.creditAmount = item.creditAmount;
            _this.dataForm.returnAmount = item.returnAmount;
            _this.dataForm.sourceBillId = item.id;
            _this.dataForm.sourceBillNo = item.billNo;
            _this.sourceBillNoArr = [{billNo: item.billNo}];
          }
        });

        this.dialogSelectorVisible = false;
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
