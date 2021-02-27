<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增承兑支出单</span>
        <span v-if="dataForm.id">编辑承兑支出单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input :value="dataForm.billNo ? dataForm.billNo : '单据编号由系统自动生成'" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" :picker-options="pickerOptions" type="date" value-format="yyyy-MM-dd"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="支出类型:" prop="expenditureType" class="el-form-flex">
                <el-select v-model="dataForm.expenditureType" size="small" placeholder="">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="承兑账户:" prop="acceptanceAccount" class="el-form-flex">
                <div
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                  </span>
                  <el-tag v-if="dataForm.acceptanceStaffCode">
                    {{dataForm.acceptanceStaffCode + '/' + dataForm.acceptanceStaffName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="关联单据:" prop="acceptanceAccount" class="el-form-flex">
                <div @click.stop="handleInvoicesSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="invoiceArr" closable>
                    {{invoiceArr}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td v-if="dataForm.expenditureType == '背书转让'">
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id" closable v-model="dataForm.supplierName"
                          @close="handleSupplierDel">
                    {{tag.supplierName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td v-if="dataForm.expenditureType == '退承兑' || dataForm.expenditureType == '大票换小票'">
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in customerArr" :key="tag.id" closable v-model="dataForm.customerName"
                          @close="handleCustomerDel">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.expenditureType == '背书转让'">
            <td>
              <el-form-item label="供应商编号" prop="supplierCode" class="el-form-flex">
                <el-input v-model="dataForm.supplierCode" placeholder="请输入供应商编号" :disabled="dataForm.expenditureType != '背书转让'"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商银行账号" prop="supplierBankAccount" class="el-form-flex">
                <el-input v-model="dataForm.supplierBankAccount" placeholder="请输入供应商银行账号" :disabled="dataForm.expenditureType != '背书转让'"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.expenditureType == '背书转让'">
            <td colspan="2">
              <el-form-item label="供应商开户行" prop="supplierBankName" class="el-form-flex">
                <el-input v-model="dataForm.supplierBankName" placeholder="请输入供应商开户行" :disabled="dataForm.expenditureType != '背书转让'"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.expenditureType == '退承兑' || dataForm.expenditureType == '大票换小票'">
            <td>
              <el-form-item label="客户编号" prop="customerCode" class="el-form-flex">
                <el-input v-model="dataForm.customerCode" placeholder="请输入客户编号" :disabled="dataForm.expenditureType != '退承兑' && dataForm.expenditureType != '大票换小票'"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户银行账号" prop="customerBankAccount" class="el-form-flex">
                <el-input v-model="dataForm.customerBankAccount" placeholder="请输入客户银行账号" :disabled="dataForm.expenditureType != '退承兑' && dataForm.expenditureType != '大票换小票'"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.expenditureType == '退承兑' || dataForm.expenditureType == '大票换小票'">
            <td colspan="2">
              <el-form-item label="客户开户行" prop="customerBankName" class="el-form-flex">
                <el-input v-model="dataForm.customerBankName" placeholder="请输入客户开户行" :disabled="dataForm.expenditureType != '退承兑' && dataForm.expenditureType != '大票换小票'"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:">
                <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                           :on-success="handleFileSuccess"
                           :on-remove="handleFileRemove"
                           :file-list="dataForm.attachment">
                  <svg-icon icon-class="add" style="margin-top: 12px;"></svg-icon>
                </el-upload>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" placeholder="请输入备注"></el-input>
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
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="registerBillNo" label="原登记单号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.registerBillNo" disabled></el-input>
          <span>{{scope.row.registerBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.draftNo" disabled></el-input>
          <span>{{scope.row.draftNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentBankFullName" label="付款银行全称" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.paymentBankFullName" disabled></el-input>
          <span>{{scope.row.paymentBankFullName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amt" label="出票金额" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amt" class="right-el-input" disabled
                    @change="handleEdit(scope.$index, scope.row , 'amt', $event)"
                    @input="handleInputFun($event, scope.row, 'amt')"></el-input>
          <span>{{scope.row.amt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmt" label="本次支出金额" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.paymentAmt" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'paymentAmt', $event)"
                    @input="handleInputFun($event, scope.row, 'paymentAmt')"></el-input>
          <span>{{scope.row.paymentAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="draftExpireDate" label="汇票到期日" width="128" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-if="scope.row" v-model="scope.row.draftExpireDate" class="right-el-input" disabled></el-input>
          <span v-if="scope.row">{{scope.row.draftExpireDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentDate" label="支出时间" width="128" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.paymentDate" type="date" :picker-options="pickerOptions"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.paymentDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isAllopatry" label="付款行是否异地" width="120" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.isAllopatry" size="small" placeholder="" disabled
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in allopatryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.isAllopatry}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthRate" label="月利率(%)" width="80" align="right">
        <template slot-scope="scope">
          <div style="position: relative;">
            <el-input size="mini" v-model="scope.row.monthRate" class="right-el-input" disabled></el-input>
          </div>
          <span>{{scope.row.monthRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="贴息额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" readonly v-model="scope.row.discount" disabled></el-input>
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fee" label="手续费" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.fee" class="right-el-input" disabled
                    @change="handleEdit(scope.$index, scope.row , 'fee', $event)"
                    @input="handleInputFun($event, scope.row, 'fee')"></el-input>
          <span>{{scope.row.fee}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserName" label="原到款员工" width="120" align="left">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.crtUserName" disabled></el-input>
          <span>{{scope.row.crtUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerCode" label="原到款客户编号" width="120" align="left">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.customerCode" disabled></el-input>
          <span>{{scope.row.customerCode}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="customerName" label="原到款客户" width="120" align="left">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.customerName" disabled></el-input>
          <span>{{scope.row.customerName}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="toBankCode" label="原到款银行" width="120" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.toBankCode" disabled></el-input>
          <span>{{scope.row.toBankCode}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <el-dialog title="请选择承兑账户" :visible.sync="acceptanceVisible" append-to-body>
      <acceptance-account-selector @closeAccountDialog="closeAccountDialog"
                                   :isSelect="isSelect" :isSingle="true"
                                   ref="acceptance"></acceptance-account-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAcceptance">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAcceptance">确 定</el-button>
      </span>
    </el-dialog>
    <invoice-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                      @submitSelectorSuccess="submitSelectorSuccess"
                      @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </invoice-selector>
    <!-- 新增承兑支出弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
    <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/acceptanceExpenditure';
  import {uploadPath} from '@/api/erp/goods/storage';
  import {page as pageName} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: 'AcceptanceExpenditureForm',
    components: {
      'invoice-selector': () => import('../components/invoiceSelector'),
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
      'acceptance-account-selector': () => import('../components/acceptanceAccountSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector')

    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        uploadPath,
        dialogSelectorVisible: false,
        invoiceArr: undefined,
        isSelect: false,
        acceptanceVisible: false,
        attachment: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          sourceBillNo: undefined,
          billNo: undefined,
          billStatus: undefined,
          billDate: undefined,
          expenditureType: '退承兑',
          supplierCode: undefined,
          supplierName: undefined,
          recitorCode: undefined,
          customerCode: undefined,
          customerName: undefined,
          acceptanceAccount: undefined,
          acceptanceStaffCode: '90006',
          acceptanceStaffName: '承兑专有账户',
          attachment: [],
          items: [],
        },
        customerVisible:false,
        items: [],
        customerArr: [],
        supplierArr: [],
        supplierVisible: false,
        sourceBillNoArr: [],
        customerVisible: false,
        billedOptions: [
          {
            value: '0',
            label: '未'
          },
          {
            value: '1',
            label: '已'
          }
        ],
        showOptions: [
          {
            value: '0',
            label: '可以'
          },
          {
            value: '1',
            label: '不可以'
          }
        ],
        allopatryOptions: [
          {
            value: '0',
            label: '是',
          }, {
            value: '1',
            label: '否',
          }
        ],
        goodTypeOptions: [
          {
            label: '单寄',
            value: 0,
          }, {
            label: '合寄',
            value: 1,
          }, {
            label: '自领',
            value: 2,
          }
        ],
        commonRules:{
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          expenditureType: [
            {
              required: true,
              message: '请选择支出类型',
              trigger: 'blur'
            }
          ],
        },
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          expenditureType: [
            {
              required: true,
              message: '请选择支出类型',
              trigger: 'blur'
            }
          ],
          supplierName:[
            {
              required: true,
              message: '请选择供应商',
              trigger: 'change'
            }
          ],
          supplierCode:[
            {
              required: true,
              message: '请选择供应商编号',
              trigger: 'change'
            }
          ],
          supplierBankAccount:[
            {
              required: true,
              message: '请选择供应商银行账号',
              trigger: 'change'
            }
          ],
          supplierBankName:[
            {
              required: true,
              message: '请选择供应商开户行',
              trigger: 'change'
            }
          ],
          customerName:[
            {
              required: true,
              message: '请选择客户',
              trigger: 'change'
            }
          ],
          // customerCode:[
          //   {
          //     required: true,
          //     message: '请选择客户编号',
          //     trigger: 'change'
          //   }
          // ],
          // customerBankAccount:[
          //   {
          //     required: true,
          //     message: '请选择客户银行账号',
          //     trigger: 'change'
          //   }
          // ],
          // customerBankName:[
          //   {
          //     required: true,
          //     message: '请选择客户开户行',
          //     trigger: 'change'
          //   }
          // ],
        },
        list: null,
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.customerId = list[0].id;
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerCode = list[0].customerCode;
          this.dataForm.customerLinkman = list[0].linkMan;
          this.dataForm.customerPhone = list[0].linkPhone;
          this.dataForm.customerBankAccount = list[0].bankAccount;
          this.dataForm.customerBankName = list[0].bankName;
          this.$refs['dataForm'].validate(valid => {
          });
        }
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      // 供应商选择
      handleSupplierSelector() {
        if(this.dataForm.expenditureType == '背书转让') {
          this.supplierVisible = true;
        }
      },
      handleCancelSupplier() {
        this.$refs.supplier.reset();
        this.supplierVisible = false;
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      handleSupplierDel(index) {
        this.supplierArr.splice(index, 1);
        this.dataForm.supplierId = undefined;
        this.dataForm.supplierName = undefined;
        this.dataForm.supplierCode = undefined;
        this.dataForm.bankName = undefined;
        this.dataForm.bankAccount = undefined;
        this.dataForm.paymentsMeans = undefined;
        this.dataForm.applyAmount = undefined;
        // this.items = [];
        this.$refs.supplier.reset();
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerId = undefined;
        this.dataForm.customerName = undefined;
        this.dataForm.customerCode = undefined;
        this.dataForm.customerBankName = undefined;
        this.dataForm.customerBankAccount = undefined;
        this.dataForm.paymentsMeans = undefined;
        this.dataForm.applyAmount = undefined;
        console.log(this.dataForm);
        // this.items = [];
        // this.$refs.customer.reset();
      },
      closeSupplierDialog(list) {
        this.supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName;
          this.dataForm.supplierId = list[0].id;
          this.dataForm.supplierCode = list[0].supplierCode;
          this.dataForm.bankName = list[0].bankName;
          this.dataForm.bankAccount = list[0].bankAccount;
          this.dataForm.paymentsMeans = list[0].paymentsMeans;
        }
      },
      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.id] = item;
        });
        return map;
      },
      submitSelectorSuccess(list) {
        for (let i = this.items.length - 1; i >= 0; i--) {
          if (!this.items[i].id || this.items[i].id == '') {
            this.items.splice(i, 1);
          }
        }

        const dataMap = this.data2Map(this.items);
        for (let i in list.list) {
          const filter = dataMap[list.list[i].id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {i
            continue;
          }
          list.list[i].registerBillNo = list.list[i].billNo;
          list.list[i].registerBillId = list.list[i].id;
          list.list[i].paymentDate  = new Date().toLocaleDateString().replace(/\//g, '-');
          list.list[i].customerCode = list.list[i].mainDTO.customerCode;
          list.list[i].customerName = list.list[i].mainDTO.customerName;
          list.list[i].toBankCode = list.list[i].mainDTO.toBankCode;
          list.list[i].paymentAmt = list.list[i].amt;
          this.items.push(list.list[i]);
        }
        this.invoiceArr = list.list[0].billNo;
        this.dialogSelectorVisible = false;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleInvoicesSelector() {
        this.dialogSelectorVisible = true;
      },
      handleAcceptanceSelector() {
        if(this.dataForm.expenditureType != '退承兑') {
          this.acceptanceVisible = true;
        }
      },
      handleCancelAcceptance() {
        this.$refs.acceptance.reset()
        this.acceptanceVisible = false
      },
      handleSubmitAcceptance() {
        this.$refs.acceptance.onSubmit();
      },
      closeAccountDialog(list) {
        if (list.length > 0) {
          this.dataForm.acceptanceStaffCode = list[0].accountCode;
          this.dataForm.acceptanceStaffName = list[0].name;
        }
        this.acceptanceVisible = false;
      },
      handleEdit(index, val, type, row) {
        if (type == 'amt') {
          this.items[index].discount = (this.items[index].amt / 10000).toFixed(4);
          this.vueSet(this.items, index, this.items[index]);
        }
      },
      handleFileRemove(file, fileList) {
        this.dataForm.attachment = fileList;
      },
      handleFileSuccess(response) {
        this.dataForm.attachment.push(response.data);
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 252
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data
              this.invoiceArr = this.dataForm.billNo;
              this.supplierArr = [{
                supplierName:response.data.supplierName,
                id:response.data.supplierCode
              }];
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
              }
              if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
                this.dataForm.attachment = JSON.parse(response.data.attachment);
              } else {
                this.dataForm.attachment = [];
              }
              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
          this.handleValueAdd()
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          billNo: undefined,
          isAllopatry: '0',
          isFlaw: '0',
          isGiveChange: '0',
          isBilled: '0',
          isShow: '0',
          paymentDate: new Date().toLocaleDateString().replace(/\//g, '-')
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      // handleCustomerDel(index) {
      //   this.customerArr.splice(index, 1);
      //   this.dataForm.customerCode = undefined;
      //   this.dataForm.customerName = undefined;
      //   this.$refs.customer.reset()
      // },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      // closeCustomerDialog(list) {
      //   this.customerArr = list
      //   this.customerVisible = false
      //   if (list.length > 0) {
      //     this.dataForm.customerName = list[0].customerName;
      //     this.dataForm.customerCode = list[0].customerCode;
      //   }
      // },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['amt', 'paymentAmt', 'monthRate', 'discount','fee']);
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      dataFormSubmit(_this, subFun, subFunSuccessName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            _this.isFormLoading = true;
            var list = [];
            for (var i in _this.items) {
              if (_this.items[i].draftNo && _this.items[i].draftNo != '') {
                list.push(_this.items[i]);
              }
            }
            _this.dataForm.items = list;

            subFun(_this.dataForm).then(response => {
              _this.isFormLoading = false;
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
              _this.isFormLoading = false;
            })
          } else {
            return false;
          }
        })
      },
      checkItemFuc() {
        for (var i in this.items) {
            if (!this.items[i].paymentAmt || this.items[i].paymentAmt == '') {
              this.$message.error('第' + (i * 1 + 1) + '行本次支出金额全称必填项，请填写了再提交');
              return
            }
            if (!this.items[i].paymentDate || this.items[i].paymentDate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的支出时间必填项，请填写了再提交');
              return
            }
        }
        return true
      }
    }
  }
</script>
