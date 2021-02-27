<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增付款单</span>
        <span v-if="dataForm.id">编辑付款单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>
    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="付款日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款形式:" prop="paymentForm" class="el-form-flex">
                <el-select v-model="dataForm.paymentForm" style="width: 100%;">
                  <el-option v-for="item in paymentFormOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td>
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag"
                          @close="handleSourceBillNoDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款账户:" prop="payAccount" class="el-form-flex">
                <el-select v-model="dataForm.payAccount" style="width: 100%;">
                  <el-option v-for="item in bankAccountArr" :key="item.id" :label="item.name"
                             :value="item.accountCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="1">
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in supplierArr" :key="tag.id" :closable="false"
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td colspan="1">
              <el-form-item label="供应商欠票(参考):" prop="oweAmount" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>{{dataForm.oweAmount}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.payAccount == '90006'">
            <td colspan="2">
              <el-form-item label="承兑单据:" prop="acceptSourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseAcceptContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in acceptSourceBillNoArr" :key="tag"
                          @close="handleAcceptSourceBillNoDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                <el-input v-model="dataForm.bankName" placeholder="请输入开户银行" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="银行账户:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账户" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <el-select v-model="dataForm.currencyId" style="width: 100%;">
                  <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款金额:" prop="payAmount" class="el-form-flex">
                <el-input v-model="dataForm.payAmount" placeholder="0.00"
                          :readonly="dataForm.sourceBillNo && dataForm.sourceBillNo!=''?true:false"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handleEdit('payAmount',$event)"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <!-- <td width="50%">
              <el-form-item label="结算方式:" prop="paymentsMeans" class="el-form-flex">
                <el-select v-model="dataForm.paymentsMeans" style="width: 100%;">
                  <el-option v-for="item in paymentsMeansOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td> -->
            <td width="50%">
              <el-form-item label="冲抵预付金额:" prop="sumOfAdvance" class="el-form-flex">
                <el-input v-model="dataForm.sumOfAdvance" placeholder="请输入冲抵预付金额"></el-input>
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
    <!-- 承兑单据 -->
    <el-table v-if="dataForm.payAccount == '90006'" :data="acceptItems" border highlight-current-row width="100%" :height="100"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
     <el-table-column prop="expenditureNo" label="承兑支出单号">
         <template>
          {{dataForm.expenditureNo}}
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号">
        <template>
          {{dataForm.draftNo}}
        </template>
      </el-table-column>
      <el-table-column prop="expenditureType" label="支出类型">
        <template>
          {{dataForm.expenditureType}}
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmt" label="汇票金额">
        <template>
          {{dataForm.paymentAmt}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 普通单据 -->
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据">
        <template slot-scope="scope">
          <div style="text-align: left;padding-left: 10px;width: 100%;" class="readonly-el-input">
            {{scope.row.sourceObjectName}} {{scope.row.sourceBillNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillDate" label="单据日期">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sourceBillDate"
                    class="readonly-el-input left-el-input" readonly></el-input>
          <span>{{scope.row.sourceBillDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="应付" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.applyAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.applyAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="thisPaymentAmount" label="本次付款" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.thisPaymentAmount" class="right-el-input" readonly
                    @change="handleEdit('thisPaymentAmount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                  ></el-input>
          <span>{{scope.row.thisPaymentAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sumOfAdvance" label="冲抵预付金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sumOfAdvance"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.sumOfAdvance}}</span>
        </template>
      </el-table-column>
    </el-table>


    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增付款申请单弹窗底部 -->
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
    <payment-apply-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="submitSelectorSuccess"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </payment-apply-selector>
    <!-- 付款账户为承兑时的关联单据 -->
    <payment-apply-accept-selector :dialogSelectorVisible="acceptDialogSelectorVisible" v-if="acceptDialogSelectorVisible"
                            @submitAcceptSelectorSuccess="submitAcceptSelectorSuccess"
                            @handleSelectorClose="handleAcceptSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :paymentsMeansOptions="paymentsMeansOptions">
    </payment-apply-accept-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchasePayment';
  import { page as suppilerPayList } from '@/api/erp/analysis/purchase/suppilerPay'
  import {getObj} from '@/api/admin/user/index';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';


  export default {
    name: "purchasePaymentForm",
    components: {
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'payment-apply-selector': () => import('../components/paymentApplySelector'),
      'payment-apply-accept-selector': () => import('../components/paymentApplyAcceptSelector'),
    },
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions'],
    data() {
      const validatePayAmount = (rule, value, callback) => {
        if (!value || value == '' || value == '0.00' || value == 'NaN') {
          callback(new Error("付款金额为大于0的数字"));
        } else {
          callback();
        }
      };
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          payAmount: undefined,
          currencyId: '1',
          payAccount: undefined,
          sumOfAdvance: undefined,
          bankName: undefined,
          bankAccount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillId: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: [],
          oweAmount:undefined
        },
        paymentFormOption:[{value: '0', label: '直接付款'}, {value: '1', label: '预付款'},{value: '2', label: '退款'}],
        items: [],
        acceptItems:[],
        supplierArr: [],
        sourceBillNoArr: [],
        acceptSourceBillNoArr:[],
        supplierVisible: false,
        bankAccountArr: [],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择付款日期',
              trigger: 'blur'
            }
          ],
          paymentForm: [
            {
              required: true,
              message: '请选择付款形式',
              trigger: 'blur'
            }
          ],
          supplierName: [
            {
              required: true,
              message: '请选择供应商',
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
          payAmount: [
            {
              required: true,
              validator: validatePayAmount,
              trigger: 'blur'
            }
          ],
          payAccount: [
            {
              required: true,
              message: '请选择付款账户',
              trigger: 'blur'
            }
          ],
          sourceBillNo: [
            {
              required: true,
              message: '请关联付款申请单',
              trigger: 'blur'
            }
          ],
          // bankName: [
          //   {
          //     required: true,
          //     message: '请输入开户银行',
          //     trigger: 'blur'
          //   }
          // ],
          // bankAccount: [
          //   {
          //     required: true,
          //     message: '请输入银行账户',
          //     trigger: 'blur'
          //   }
          // ],
          paymentsMeans: [
            {
              required: true,
              message: '请选择结算方式',
              trigger: 'blur'
            }
          ],
        },
        dialogSelectorVisible: false,
        acceptDialogSelectorVisible: false,
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
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 293;
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
              let {expenditureNo,draftNo,expenditureType,paymentAmt} = this.dataForm;
              let tempItem = [];
              tempItem.push({expenditureNo,draftNo,expenditureType,paymentAmt})
              tempItem.forEach((item,index) => {
                this.$set(this.acceptItems,index,item)
              })
              this.supplierArr = response.data.supplierArr;
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
          this.handleValueAdd();
        }
        pageAll().then(response => {
          this.bankAccountArr = response.data;
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          sourceBillDate: undefined,
          sourceBillNo: undefined
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
        if (type == 'payAmount') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4);
            this.dataForm.payAmount = val;
          }
        } else {
          if (val * 1 > row.applyAmount * 1) {
            this.$message.error('付款金额不能大于应付金额');
            this.vueSet(this.items[index], 'thisPaymentAmount', Number(row.applyAmount).toFixed(4));
          } else {
            if (val != undefined && val != '') {
              val = Number(val).toFixed(4);
              this.vueSet(this.items[index], 'thisPaymentAmount', val);
            } else {
              this.vueSet(this.items[index], 'thisPaymentAmount', '0.0000');
            }
          }
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
          this.dataForm.paymentsMeans = list[0].paymentsMeans;
        }
      },

      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
      },
      data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
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
          if (column.property === 'thisPaymentAmount') {
            values = data.map(item => Number(item.thisPaymentAmount));
          } else if (column.property === 'applyAmount') {
            values = data.map(item => Number(item.applyAmount));
          }

          if (column.property === 'applyAmount' || column.property === 'thisPaymentAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'thisPaymentAmount') {
                  this.dataForm.payAmount = getFloat((prev + curr), 4)
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
      handleCancel() {
        this.$emit('handleCancelForm');
      },
      //关联单据选择
      handlePurchaseContractSelector() {
          this.dialogSelectorVisible = true;
      },
      handlePurchaseAcceptContractSelector() {
        this.acceptDialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleAcceptSelectorClose() {
        this.acceptDialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      handleAcceptSourceBillNoDel() {
        this.acceptSourceBillNoArr.splice(index, 1);
        this.dataForm.expenditureNo = this.acceptSourceBillNoArr.join(',');
      },
      submitAcceptSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }
        this.acceptSourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            this.dataForm.draftNo = item.draftNo;
            this.dataForm.expenditureType = item.mainDTO.expenditureType;
            this.dataForm.paymentAmt = item.paymentAmt;
          }
          this.acceptSourceBillNoArr.push(item.billNo);
        }
        this.dataForm.expenditureNo = this.acceptSourceBillNoArr.join(',');
        this.acceptDialogSelectorVisible = false;
        let {expenditureNo,draftNo,expenditureType,paymentAmt} = this.dataForm;
        this.acceptItems.push({expenditureNo,draftNo,expenditureType,paymentAmt})
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false;
          return;
        }

        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;
        this.dataForm.sourceBillId = obj.list[0].id;
        this.dataForm.paymentForm = obj.list[0].paymentForm;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        _this.sourceBillNoArr = [];
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            this.supplierArr = item.supplierArr;
            this.dataForm.supplierId = item.supplierId;
            this.dataForm.supplierName = item.supplierName;
            this.dataForm.supplierName = item.supplierName;
            this.dataForm.supplierCode = item.supplierCode;
            this.dataForm.bankAccount = item.bankAccount;
            this.dataForm.bankName = item.bankName;
            if (this.dataForm.bankName) {
              this.$refs['dataForm'].validateField('bankName');
            }
            if (this.dataForm.bankAccount) {
              this.$refs['dataForm'].validateField('bankAccount');
            }
            // 请求供应商欠票
            let query = {
              supplierCode:item.supplierCode
            }
            suppilerPayList(query).then (res => {
              this.dataForm.oweAmount = this.accAdd(this.accAdd(res[0].purchasePayAmount||0,-Number(res[0].invoiceAmount).toFixed(4)||0),-res[0].purchaseRefundMoneyAmount||0).toFixed(4)
            })
          }
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue;
          }
          _this.sourceBillNoArr.push(item.billNo);
          var itemObj = {};
          itemObj.sourceBillDate = item.billDate;
          itemObj.sourceBillNo = item.billNo;
          itemObj.sourceBillId = item.id;
          itemObj.applyAmount = (item.applyAmount - item.paidAmount).toFixed(4);
          itemObj.thisPaymentAmount = (item.applyAmount - item.paidAmount).toFixed(4);
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
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

            var list = [];
            for (var i in _this.items) {
              if (_this.items[i].sourceBillId && _this.items[i].sourceBillId != '') {
                list.push(_this.items[i]);
              }
            }
            _this.dataForm.items = list;

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
          if (this.items[i].sourceBillId && this.items[i].sourceBillId != '') {
            if (!this.items[i].thisPaymentAmount || this.items[i].thisPaymentAmount == ''
              || this.items[i].thisPaymentAmount == '0.00' || this.items[i].thisPaymentAmount == 'NaN') {
              this.$message.error('第' + (i * 1 + 1) + '行的付款金额为大于0的数字，请填写了再提交');
              return;
            }
          }
        }
        return true;
      }
    }
  }
</script>
