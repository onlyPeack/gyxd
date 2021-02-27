<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增借款单</span>
        <span v-if="dataForm.id">编辑借款单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="借款人:" prop="userName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in userArr" :key="tag.id" :closable="false">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="费用承担部门:" prop="payOrgName" class="el-form-flex">
                <div @click="handleDepartSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in departArr" :key="tag.id" closable
                          @close="handleDepartDel">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="借款日期:" prop="borrowMoneyDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.borrowMoneyDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="还款日期:" prop="repayMoneyDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.repayMoneyDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="借款类型:" prop="type" class="el-form-flex">
                <el-select v-model="dataForm.type" style="width: 100%;" @change="handleTypeChange">
                  <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;">
                  <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="关联客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                     v-if="dataForm.type=='1'">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in customerArr" :key="tag.id" closable
                          @close="handleCustomerDel">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                     v-if="dataForm.type=='2'">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id" closable
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <!--<tr>-->
          <!--<td>-->
          <!--<el-form-item label="关联项目:" prop="projectName" class="el-form-flex">-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--<td>-->
          <!--<el-form-item label="关联审批:" class="el-form-flex">-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <tr>
            <td colspan="2">
              <el-form-item label="借款金额:" prop="amount" class="el-form-flex">
                <el-input v-model="dataForm.amount" placeholder="0.00"
                          :readonly="dataForm.sourceBillNo && dataForm.sourceBillNo!=''?true:false"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handleEdit('amount',$event)"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="借款原因:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收款人:" prop="payUserName" class="el-form-flex">
                <el-input v-model="dataForm.payUserName" placeholder="请输入收款人"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收款银行:" prop="depositBank" class="el-form-flex">
                <el-input v-model="dataForm.depositBank" placeholder="请输入收款银行"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收款银行账号:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入收款银行账号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="付款日期:" prop="payDate" class="el-form-flex">
                <el-input v-model="dataForm.payDate" placeholder="请输入付款日期" readonly="readonly"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款账户:" prop="payBankAccount" class="el-form-flex">
                <el-input v-model="dataForm.payBankAccount" placeholder="请输入付款账户" readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
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

    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
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

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financialBorrowMoney';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "borrowMoneyForm",
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      const validateAmountFormer = (rule, value, callback) => {
        if (!value || value == '' || value == '0.00' || value == 'NaN') {
          callback(new Error("借款金额为大于0的数字"));
        } else {
          callback();
        }
      };
      return {
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          userId: undefined,
          userName: undefined,
          userCode: undefined,
          payUserName: undefined,
          borrowMoneyDate: undefined,
          repayMoneyDate: undefined,
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          supplierId: undefined,
          supplierName: undefined,
          supplierCode: undefined,
          payOrgId: undefined,
          payOrgName: undefined,
          projectName: undefined,
          amount: undefined,
          currencyId: '1',
          type: '0',
          depositBank: undefined,
          bankAccount: undefined,
          payDate: undefined,
          payBankAccount: undefined,
          note: undefined,
          billStatus: undefined,
        },
        userArr: [],
        customerArr: [],
        customerVisible: false,
        departArr: [],
        supplierArr: [],
        supplierVisible: false,
        departVisible: false,
        rules: {
          borrowName: [
            {
              required: true,
              message: '请选择借款人',
              trigger: 'blur'
            }
          ],
          borrowMoneyDate: [
            {
              required: true,
              message: '请选择借款日期',
              trigger: 'blur'
            }
          ],
          repayMoneyDate: [
            {
              required: true,
              message: '请选择还款日期',
              trigger: 'blur'
            }
          ],
          payOrgName: [
            {
              required: true,
              message: '请选择费用承担部门',
              trigger: 'blur'
            }
          ],
          note: [
            {
              required: true,
              message: '请输入借款原因',
              trigger: 'blur'
            }
          ],
          currencyId: [
            {
              required: true,
              message: '请选择币别',
              trigger: 'blur'
            }
          ],
          amount: [
            {
              required: true,
              validator: validateAmountFormer,
              trigger: 'blur'
            }
          ]
        }
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.userArr = response.data.userArr;
              this.departArr = response.data.departArr;
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.borrowMoneyDate = date;
          this.dataForm.repayMoneyDate = date;
          this.dataForm.payDate = date;
          var userName = this.$store.state.user.name;
          var userId = this.$store.state.user.id;
          var userCode = this.$store.state.user.no;
          this.userArr = [{name: userName, id: userId, code: userCode}];
          this.dataForm.userName = userName;
          this.dataForm.userId = userId;
          this.dataForm.userCode = userCode;
          this.dataForm.payUserName = userName;
          getObj(userId).then(response => {
            if (response.data.departId && response.data.departId.indexOf('{') != -1) {
              this.dataForm.payOrgId = JSON.parse(response.data.departId).id;
              this.dataForm.payOrgName = JSON.parse(response.data.departId).name;
              this.departArr = [{
                name: JSON.parse(response.data.departId).name,
                id: JSON.parse(response.data.departId).id
              }]
            }
          });
        }
      },
      handleTypeChange(val) {
        if (val != '1') {
          this.customerArr = [];
          this.dataForm.customerId = undefined;
          this.dataForm.customerName = undefined;
          this.dataForm.customerCode = undefined;
        } else if (val != '2') {
          this.supplierArr = [];
          this.dataForm.supplierId = undefined;
          this.dataForm.supplierName = undefined;
          this.dataForm.supplierCode = undefined;
          this.dataForm.paymentsMeans = undefined;
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleEdit(type, val, index, row) {
        if (type == 'amount') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4);
            this.dataForm.amount = val;
          }
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
      handleSubmitDepart() {
        this.$refs.depart.onSubmit();
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.dataForm.payOrgName = depart.label;
          this.dataForm.payOrgId = depart.id;
          this.departArr = [{name: depart.label, id: depart.id}];
        }
        this.departVisible = false;
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
        }
      },

      // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true;
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset();
        this.supplierVisible = false;
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1);
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
        this.dataForm.supplierCode = undefined;
        this.dataForm.paymentsMeans = undefined;
        this.$refs.supplier.reset();
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      closeSupplierDialog(list) {
        this.supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName;
          this.dataForm.supplierId = list[0].id;
          this.dataForm.supplierCode = list[0].supplierCode;
          this.dataForm.paymentsMeans = list[0].paymentsMeans;
        }
      },

      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true;
            } else {
              _this.isFormLoading = true;
            }

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
        if (this.dataForm.type == '1') {
          if (!this.dataForm.customerName || this.dataForm.customerName == '') {
            this.$message.error('请选择关联客户');
            return;
          }
        } else if (this.dataForm.type == '2') {
          if (!this.dataForm.supplierName || this.dataForm.supplierName == '') {
            this.$message.error('请选择关联供应商');
            return;
          }
        }
        return true;
      }
    }
  }
</script>
