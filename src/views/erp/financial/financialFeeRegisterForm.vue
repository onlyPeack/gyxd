<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增费用登记单</span>
        <span v-if="dataForm.id">编辑费用登记单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" :disabled="true" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="报销单位:" prop="companyName" class="el-form-flex">
                <el-input v-model="companyName" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="登记类型:" prop="registerType" class="el-form-flex">
                <el-select v-model="dataForm.registerType" style="width: 100%;">
                  <el-option v-for="item in registerTypeOptions" :key="item.value" :label="item.labelDefault"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="做账类型:" prop="makeAccountType" class="el-form-flex">
                <el-select v-model="dataForm.makeAccountType" style="width: 100%;" @change="handleAccountTypeChange">
                  <el-option v-for="item in makeAccountTypeOptions" :key="item.value" :label="item.labelDefault"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row show-summary width="100%" :height="clientHeight"
              class="tb-edit" :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="accountCode" label="账户" width="120" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleAccountSelector(scope.$index)">
            <el-input v-model="scope.row.accountCode" readonly suffix-icon="el-icon-more"></el-input>
          </div>
          <span>{{scope.row.accountCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountName" label="账户名称" width="120" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleAccountSelector(scope.$index)">
            <el-input v-model="scope.row.accountName" readonly :disabled="true"></el-input>
          </div>
          <span>{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salerName" label="操作员" width="128">
        <template slot-scope="scope">
          <div @click="handleUserSelector('saler',scope.$index)">
            <el-input v-model="scope.row.salerName" readonly suffix-icon="el-icon-more"></el-input>
          </div>
          <span>{{scope.row.salerName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salerDepartName" label="操作员部门" width="160">
        <template slot-scope="scope">
          <div @click="handleUserSelector('saler',scope.$index)">
            <el-input v-model="scope.row.salerDepartName" readonly :disabled="true"></el-input>
          </div>
          <span>{{scope.row.salerDepartName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectCode" label="科目编号" width="160" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleSubjectSelector(scope.$index)">
            <el-input v-model="scope.row.subjectCode" readonly suffix-icon="el-icon-more"></el-input>
          </div>
          <span>{{scope.row.subjectCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectName" label="科目名称" width="160" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleSubjectSelector(scope.$index)">
            <el-input v-model="scope.row.subjectName" readonly :disabled="true"></el-input>
          </div>
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="报销人" width="110" class-name="col-required">
        <template slot-scope="scope">
          <div @click="handleUserSelector(dataForm.makeAccountType == 13 ? 'staff' : 'user',scope.$index)"
               style="text-align: left;padding-left: 10px;color: #0078D7;">
            <el-input v-model="scope.row.userName" readonly></el-input>
          </div>
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerAmount" label="登记金额" align="right" width="110" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.registerAmount" class="right-el-input"
                    @change="handleEdit($event,scope.$index,scope.row)"
                    @input="handleInputFuns($event, scope.row, 'registerAmount')"></el-input>
          <span>{{scope.row.registerAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120">
        <template slot-scope="scope">
          <el-input v-model="scope.row.note"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 操作员列表弹窗-->
    <el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                     ref="userSelector"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 员工弹出列表 -->
    <el-dialog title="请选择员工" :visible.sync="staffVisible" append-to-body>
      <staff-selector @closeStaffDialog="closeStaffDialog" :isSingle="true"
                     ref="staffSelector"></staff-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelStaff">取 消</el-button>
        <el-button type="primary" @click="handleSubmitStaff">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 账户列表弹窗-->
    <el-dialog title="请选择报销人" :visible.sync="expenseAccountVisible" append-to-body>
      <expense-account-selector @closeExpenseAccountDialog="closeExpenseAccountDialog" :isSingle="true"
                        ref="expenseAccountSelector"></expense-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpenseAccount">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpenseAccount">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 账户列表弹窗-->
    <el-dialog title="请选择账户" :visible.sync="accountVisible" append-to-body>
      <account-selector @closeAccountDialog="closeAccountDialog" :isSingle="true"
                        ref="accountSelector"></account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAccount">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAccount">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 科目列表弹窗-->
    <el-dialog title="请选择科目" :visible.sync="subjectVisible" append-to-body>
      <subject-info-selector @closeSubjectDialog="closeSubjectDialog" :isSingle="true"
                             ref="subjectSelector"></subject-info-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSubject">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSubject">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat, isEmpty} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/feeRegisterService';
  import {getObj} from '@/api/admin/user/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "financialFeeRegisterForm",
    components: {
      'user-selector': () => import('@/components/ERP/User/user'),
      'accountSelector': () => import('./components/accountSelector'),
      'subjectInfoSelector': () => import('./components/subjectInfoSelector'),
      'expenseAccountSelector': () => import('./components/expenseAccountSelector'),
      'staffSelector':() => import('./components/staffSelector'),
    },
    props: ['id', 'dialogFormVisible', 'registerTypeOptions', 'makeAccountTypeOptions'],
    data() {
      return {
        expenseAccountVisible:false,
        companyName: '江苏工享创联网络科技有限公司',
        headers: null,
        fileList: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: 2,
          makeAccountType: undefined,
          registerType: undefined,
          userId: undefined,
          userCode: undefined,
          userName: undefined,
          userDepartId: undefined,
          userDepartName: undefined,
          note: undefined,
          items: []
        },
        items: [],
        userVisible: false,
        accountVisible: false,
        subjectVisible: false,
        staffVisible:false,
        userType: undefined,
        userIndex: undefined,
        accountIndex: undefined,
        subjectIndex: undefined,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          makeAccountType: [
            {
              required: true,
              message: '请选择做账类型',
              trigger: 'blur'
            }
          ],
          registerType: [
            {
              required: true,
              message: '请选择登记类型',
              trigger: 'blur'
            }
          ],
        }
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleAccountTypeChange() {
        this.items[0].userName = ""
      },
      handleInputFuns($event, item, key){
        if (key == 'qty') {
          item[key] = ($event || '').replace(/\D/g, '');
        } else {
          item[key] = ($event || '').replace(/[^-?\d^\.]+/g, '').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 140;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.dataForm.billStatus = Number(response.data.billStatus);
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date + ' 00:00:00';
          var userId = this.$store.state.user.id;
          this.getUserInfo(userId);
        }
      },
      getUserInfo(userId) {
        getObj(userId).then(response => {
          this.dataForm.userId = response.data.id;
          this.dataForm.userCode = response.data.no;
          this.dataForm.userName = response.data.name;
          if (response.data.departId.indexOf('{') != -1) {
            this.dataForm.userDepartId = JSON.parse(response.data.departId).id;
            this.dataForm.userDepartName = JSON.parse(response.data.departId).name;
          }
          this.handleValueAdd();
        });
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          accountId: undefined,
          accountCode: undefined,
          accountName: undefined,
          salerId: undefined,
          salerCode: undefined,
          salerName: undefined,
          salerDepartId: undefined,
          salerDepartName: undefined,
          subjectCode: undefined,
          subjectName: undefined,
          userId: undefined,
          userCode:undefined,
          userName: undefined,
          userDepartId: undefined,
          userDepartName: undefined,
          registerAmount: undefined,
          note: undefined,
        };
        this.items.push(d);
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length;
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(val, index, row) {
        if (val != undefined && val != '') {
          val = Number(val).toFixed(4);
          this.vueSet(this.items[index], 'registerAmount', val);
        } else {
          this.vueSet(this.items[index], 'registerAmount', '0.00');
        }
      },

      // 员工选择
      handleUserSelector(type, index) {
        this.userType = type;
        this.userIndex = index;
        if(type=="user"){
          this.expenseAccountVisible = true;
        } else if (type == 'saler'){
          this.userVisible = true;
        } else {
          this.staffVisible = true
        }
      },
      handleCancelUser() {
        this.$refs.userSelector.reset();
        this.userVisible = false;
        this.userType = undefined;
        this.userIndex = undefined;
      },
      handleSubmitExpenseAccount(){
        this.$refs.expenseAccountSelector.onSubmit();
      },
      handleSubmitStaff() {
        this.$refs.staffSelector.onSubmit();
      },
      handleSubmitUser() {
        this.$refs.userSelector.onSubmit();
      },
      handleCancelExpenseAccount(){
        this.userType = undefined;
        this.userIndex = undefined;
        this.expenseAccountVisible = false;
        this.$refs.expenseAccountSelector.reset();
      },
      handleCancelStaff() {
        this.userType = undefined;
        this.userIndex = undefined;
        this.staffVisible = false;
        this.$refs.staffSelector.reset();
      },
      closeUserDialog(list) {
        if (list.length > 0) {
          const index = this.userIndex;
          if (this.userType == 'user') {
            this.items[index].userId = list[0].id;
            this.items[index].userCode = list[0].no;
            this.items[index].userName = list[0].name;
            if (list[0].departId.indexOf('{') != -1) {
              this.items[index].userDepartId = JSON.parse(list[0].departId).id;
              this.items[index].userDepartName = JSON.parse(list[0].departId).name;
            }
          } else {
            this.items[index].salerId = list[0].id;
            this.items[index].salerCode = list[0].no;
            this.items[index].salerName = list[0].name;
            if (list[0].departId.indexOf('{') != -1) {
              this.items[index].salerDepartId = JSON.parse(list[0].departId).id;
              this.items[index].salerDepartName = JSON.parse(list[0].departId).name;
            }
          }
          this.vueSet(this.items, index, this.items[index]);
          this.$refs.userSelector.reset();
        }
        this.userVisible = false;
      },
      closeExpenseAccountDialog(list) {
        if (list.length > 0) {
          const index = this.userIndex;
          if (this.userType == 'user') {
            this.items[index].userId = list[0].id;
            this.items[index].userCode = list[0].accountCode;
            this.items[index].userName = list[0].accountName;
            if (list[0].departId.indexOf('{') != -1) {
              this.items[index].userDepartId = JSON.parse(list[0].departId).id;
              this.items[index].userDepartName = JSON.parse(list[0].departId).accountName;
            }
          } else {
          }
          this.vueSet(this.items, index, this.items[index]);
          this.$refs.expenseAccountSelector.reset();
        }
        this.expenseAccountVisible = false;
      },
      closeStaffDialog(list) {
        if (list.length > 0) {
          const index = this.userIndex;
          if (this.userType == 'staff') {
            this.items[index].userId = list[0].id;
            this.items[index].userCode = list[0].accountCode;
            this.items[index].userName = list[0].accountName;
            if (list[0].departId.indexOf('{') != -1) {
              this.items[index].userDepartId = JSON.parse(list[0].departId).id;
              this.items[index].userDepartName = JSON.parse(list[0].departId).accountName;
            }
          } else {
          }
          this.vueSet(this.items, index, this.items[index]);
          this.$refs.staffSelector.reset();
        }
        this.staffVisible = false;
      },
      //账户选择
      handleAccountSelector(index) {
        this.accountIndex = index;
        this.accountVisible = true;
      },
      handleCancelAccount() {
        this.$refs.accountSelector.reset();
        this.accountVisible = false;
        this.accountIndex = undefined;
      },
      handleSubmitAccount() {
        this.$refs.accountSelector.onSubmit();
      },
      closeAccountDialog(list) {
        if (list.length > 0) {
          const index = this.accountIndex;
          this.items[index].accountId = list[0].id;
          this.items[index].accountCode = list[0].accountCode;
          this.items[index].accountName = list[0].name;
          this.vueSet(this.items, index, this.items[index]);
          this.$refs.accountSelector.reset();
        }
        this.accountVisible = false;
      },
      //科目选择
      handleSubjectSelector(index) {
        this.subjectIndex = index;
        this.subjectVisible = true;
      },
      handleCancelSubject() {
        this.$refs.subjectSelector.reset();
        this.subjectVisible = false;
        this.subjectIndex = undefined;
      },
      handleSubmitSubject() {
        this.$refs.subjectSelector.onSubmit();
      },
      closeSubjectDialog(list) {
        if (list.length > 0) {
          const index = this.subjectIndex;
          this.items[index].subjectCode = list[0].number;
          this.items[index].subjectName = list[0].name;
          this.vueSet(this.items, index, this.items[index]);
          this.$refs.subjectSelector.reset();
        }
        this.subjectVisible = false;
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true;
            } else {
              _this.isFormLoading = true;
            }

            _this.dataForm.items = _this.items;

            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }

              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                _this.$emit(subFunSuccessName);
              } else {
                _this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false;
              } else {
                _this.isFormLoading = false;
              }
            })
          } else {
            return false;
          }
        })
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (isEmpty(this.items[i].accountCode)) {
            this.$message.error('第' + (i * 1 + 1) + '行的账户为必填项，请填写了再提交');
            return;
          }

          if (isEmpty(this.items[i].accountName)) {
            this.$message.error('第' + (i * 1 + 1) + '行的账户名称为必填项，请填写了再提交');
            return;
          }

          if (isEmpty(this.items[i].subjectCode)) {
            this.$message.error('第' + (i * 1 + 1) + '行的科目编号为必填项，请填写了再提交');
            return;
          }

          if (isEmpty(this.items[i].subjectName)) {
            this.$message.error('第' + (i * 1 + 1) + '行的科目名称为必填项，请填写了再提交');
            return;
          }

          if (isEmpty(this.items[i].registerAmount) || this.items[i].registerAmount == '0.00' || this.items[i].registerAmount == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的登记金额为大于0的数字，请填写了再提交');
            return;
          }

          if (isEmpty(this.items[i].note)) {
            this.$message.error('第' + (i * 1 + 1) + '行的备注为必填项，请填写了再提交');
            return;
          }
        }
        return true;
      },
      //合计
      getSummaries(param){
        const { columns, data } = param;
        console.log(columns)
        console.log(data)
        let sum=['合计',data.length,"","","","","","","",0,""];
        for(let i=0;i<data.length;i++){
          sum[sum.length-2]+=Number(data[i].registerAmount)||0
        }
        return sum
      }
    },
  }
</script>

