<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增费用报销</span>
        <span v-if="dataForm.id">编辑费用报销</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="报销人:" prop="userName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <!--<svg-icon icon-class="add"></svg-icon>-->
                  </span>
                  <el-tag v-for="tag in userArr" :key="tag.id" :closable="false">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="报销日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <!--<tr>-->
          <!--<td>-->
          <!--<el-form-item label="费用承担部门:" prop="payOrgName" class="el-form-flex">-->
          <!--<div @click="handleDepartSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">-->
          <!--<span>-->
          <!--<svg-icon icon-class="add"></svg-icon>-->
          <!--</span>-->
          <!--<el-tag v-for="tag in departArr" :key="tag.id" closable-->
          <!--@close="handleDepartDel">-->
          <!--{{tag.name}}-->
          <!--</el-tag>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--<td>-->
          <!--<el-form-item label="币别:" prop="currencyId" class="el-form-flex">-->
          <!--<el-select v-model="dataForm.currencyId" style="width: 100%;">-->
          <!--<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
          <!--<td colspan="2">-->
          <!--<el-form-item label="关联客户:" prop="customerName" class="el-form-flex">-->
          <!--<div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">-->
          <!--<span>-->
          <!--<svg-icon icon-class="add"></svg-icon>-->
          <!--</span>-->
          <!--<el-tag v-for="tag in customerArr" :key="tag.id" closable-->
          <!--@close="handleCustomerDel">-->
          <!--{{tag.customerName}}-->
          <!--</el-tag>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
          <!--<td colspan="2">-->
          <!--<el-form-item label="付款对象:" prop="note" class="el-form-flex">-->
          <!--<el-input v-model="dataForm.payUserName" placeholder="请输入付款对象"></el-input>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <tr>
            <td>
              <el-form-item label="开户行:" prop="depositBank" class="el-form-flex">
                <el-input v-model="dataForm.depositBank" placeholder="请输入开银行"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开户名:" prop="depositName" class="el-form-flex">
                <el-input v-model="dataForm.depositName" placeholder="请输入开户名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="账户号:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入账户号"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="报销金额:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.amount" readonly="readonly"></el-input>
              </el-form-item>
            </td>

          </tr>
          <!--<tr>-->
          <!--<td>-->
          <!--<el-form-item label="付款日期:" prop="note" class="el-form-flex">-->
          <!--<el-input v-model="dataForm.payDate" readonly="readonly" placeholder="请输入冲抵金额"></el-input>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--<td>-->
          <!--<el-form-item label="付款账号:" prop="note" class="el-form-flex">-->
          <!--<el-input v-model="dataForm.payBankAccount" readonly="readonly" placeholder="请输入冲抵金额"></el-input>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <tr>
            <td colspan="2">
              <el-form-item label="报销事由:" prop="reason" class="el-form-flex">
                <el-input v-model="dataForm.reason  " type="textarea" :rows="2" placeholder="请输入内容"></el-input>
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

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="报销类型">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" placeholder="请选择" size="small">
            <el-option
              v-for="item in billOptions"
              :key="item.value"
              :label="item.labelZhCh"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountCode" label="承担账户" class-name="col-required">
        <template slot-scope="scope">
          <div @click="takeAccountTap(scope.$index)">
            <el-input v-model="scope.row.accountCode" suffix-icon="el-icon-more"></el-input>
          </div>
          <span>{{scope.row.accountCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="用途" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.message"></el-input>
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" class="right-el-input"
                    @change="handleEdit('amount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="startDate" label="起始时间">-->
      <!--<template slot-scope="scope">-->
      <!--<el-date-picker v-model="scope.row.startDate" type="date" placeholder="请选择日期"-->
      <!--:clearable="false" value-format="yyyy-MM-dd"></el-date-picker>-->
      <!--<span>{{scope.row.startDate}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="endDate" label="终止时间">-->
      <!--<template slot-scope="scope">-->
      <!--<el-date-picker v-model="scope.row.endDate" type="date" placeholder="请选择日期"-->
      <!--:clearable="false" value-format="yyyy-MM-dd"></el-date-picker>-->
      <!--<span>{{scope.row.endDate}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="note" label="备注" >
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

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择承担账户" width="45%" :visible.sync="accountVisible" append-to-body
               @before-close="handleCancelAccount">
      <take-account-selector @closeAccountDialog="closeAccountDialog" ref="account"></take-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;"
                   @click="handleCancelAccount">取 消</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitAccount" type="primary"
                   icon="edit">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="departVisible" append-to-body>
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="depart"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handleResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handleSubmitDepart" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

    <!-- 关联单据 -->
    <borrow-money-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                           @submitSelectorSuccess="submitSelectorSuccess"
                           @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </borrow-money-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financiaCostReimbursement';
  import {getObj} from '@/api/admin/user/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';


  export default {
    name: "costReimbursementForm",
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'borrow-money-selector': () => import('../components/borrowMoneySelector'),
      'take-account-selector': () => import('../components/takeAccountSelector'),
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        accountVisible: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          depositName: undefined,
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          payDate: undefined,
          payBankAccount: undefined,
          payUserName: undefined,
          depositBank: undefined,
          bankAccount: undefined,
          amount: 0,
          originalFlushingAmount: undefined,
          actualAfrAmount: undefined,
          currencyId: '1',
          userId: undefined,
          userName: undefined,
          customerId: undefined,
          customerName: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        accountIndex: '',
        items: [],
        sourceBillNoArr: [],
        billOptions:undefined,
        userArr: [],
        departArr: [],
        customerArr: [],
        departVisible: false,
        customerVisible: false,
        rules: {
          bankAccount: [
            {
              required: true,
              message: '请输入银行账号',
              trigger: 'blur'
            }
          ],
          userName: [
            {
              required: true,
              message: '请选择报销人',
              trigger: 'blur'
            }
          ],
          depositName: [
            {
              required: true,
              message: '请输入开户名',
              trigger: 'blur'
            }
          ],
          depositBank: [
            {
              required: true,
              message: '请输入开户行',
              trigger: 'blur'
            }
          ],
          billDate: [
            {
              required: true,
              message: '请选择报销日期',
              trigger: 'blur'
            }
          ],

        },
        dialogSelectorVisible: false
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      getTypeValue('root_gxcl_bxtype').then(response => {
        this.billOptions = response.data.rows;
      });
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      takeAccountTap(index) {
        this.accountIndex = index;
        this.accountVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 416;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.userArr = response.data.userArr;
              this.departArr = response.data.departArr;
              this.customerArr = response.data.customerArr;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',');
              }
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
          this.dataForm.payDate = date;
          var userName = this.$store.state.user.name;
          var userId = this.$store.state.user.id;
          var userCode = this.$store.state.user.code;
          this.dataForm.payUserName = userName;
          this.userArr = [{name: userName, id: userId, code: userCode}];
          this.dataForm.userName = userName;
          this.dataForm.userId = userId;
          this.dataForm.userCode = userCode;
          getObj(userId).then(response => {
            if (response.data.departId.indexOf('{') != -1) {
              this.dataForm.payOrgId = JSON.parse(response.data.departId).id;
              this.dataForm.payOrgName = JSON.parse(response.data.departId).name;
              this.departArr = [{
                name: JSON.parse(response.data.departId).name,
                id: JSON.parse(response.data.departId).id
              }]
            }
          });
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var date = new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          startDate: date,
          endDate: date,
          type: undefined
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
      handleEdit(type, val, index, row) {
        if (val != undefined && val != '') {
          val = Number(val).toFixed(4);
          this.vueSet(this.items[index], 'amount', val);
        } else {
          this.vueSet(this.items[index], 'amount', '0.00');
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
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerId = undefined;
        this.dataForm.customerName = undefined;
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
        }
      },

      //部门选择
      handleDepartSelector() {
        this.departVisible = true;
      },
      handleResetDepart() {
        this.$refs.depart.reset();
      },
      handleDepartDel(index) {
        this.departArr.splice(index, 1);
        this.dataForm.payOrgName = undefined;
        this.dataForm.payOrgId = undefined;
        if (this.$refs.depart) {
          this.$refs.depart.reset();
        }
      },
      handleCancelAccount() {
        this.accountVisible = false;
      },
      handleSubmitAccount() {
        this.$refs.account.onSubmit();
      },
      handleSubmitDepart() {
        this.$refs.depart.onSubmit();
      },
      closeAccountDialog(account) {
        this.vueSet(this.items[this.accountIndex], 'accountName', account[0].accountName);
        this.vueSet(this.items[this.accountIndex], 'accountCode', account[0].accountCode);
        this.vueSet(this.items[this.accountIndex], 'accountId', account[0].accountId);
        this.accountVisible = false;
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.dataForm.payOrgName = depart.label;
          this.dataForm.payOrgId = depart.id;
          this.departArr = [{name: depart.label, id: depart.id}];
        }
        this.departVisible = false;
      },

      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'amount') {
            values = data.map(item => Number(item.amount));
          }

          if (column.property === 'amount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'amount') {
                  this.dataForm.amount = getFloat((prev + curr), 4);
                }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(4);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        } else if (obj.list.length > 1) {
          this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
          return;
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;

        var item = obj.list[0];
        this.sourceBillNoArr = [];
        this.sourceBillNoArr.push(item.billNo);
        item.repaymentAmount = item.repaymentAmount ? item.repaymentAmount : 0;
        item.afrAmount = item.afrAmount ? item.afrAmount : 0;
        // this.dataForm.originalFlushingAmount = Number(item.amount - item.repaymentAmount - item.afrAmount).toFixed(2);
        this.dataForm.amount = this.dataForm.amount ? this.dataForm.amount : 0.00;
        // this.dataForm.actualAfrAmount = getFloat(this.dataForm.amount * 1 - this.dataForm.originalFlushingAmount * 1, 2);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        this.dialogSelectorVisible = false;
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
          if (!this.items[i].type || this.items[i].type == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的报销类型为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].amount || this.items[i].amount == ''
            || this.items[i].amount == '0.00' || this.items[i].amount == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的金额为大于0的数字，请填写了再提交');
            return;
          }

          // if (!this.items[i].startDate || this.items[i].startDate == '') {
          //   this.$message.error('第' + (i * 1 + 1) + '行的起始时间为必填项，请填写了再提交');
          //   return;
          // }
          //
          // if (!this.items[i].endDate || this.items[i].endDate == '') {
          //   this.$message.error('第' + (i * 1 + 1) + '行的终止时间为必填项，请填写了再提交');
          //   return;
          // }

        }
        return true;
      }
    }
  }
</script>
