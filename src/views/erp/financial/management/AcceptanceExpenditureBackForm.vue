<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增承兑退回单</span>
        <span v-if="dataForm.id">编辑承兑退回单</span>
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
                <el-date-picker v-model="dataForm.billDate" align="right" type="date" value-format="yyyy-MM-dd"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
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
            <td>
              <el-form-item label="退回类型:" prop="backType" class="el-form-flex">
                <span style="position:relative;top:6px">
                  退承兑汇票
                </span>
                <!-- <el-select v-model="dataForm.backType" size="small" placeholder="">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select> -->
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="原到款客户编号:" prop="customerCode" class="el-form-flex">
                <el-input v-model="dataForm.customerCode"  disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="原到款客户:" prop="sourceCustomerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName"  disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr v-if="!!dataForm.supplierCode">
            <td>
              <el-form-item label="支出供应商编号:" prop="supplierCode" class="el-form-flex">
                <el-input v-model="dataForm.supplierCode"  disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="支出供应商名称:" prop="supplierName" class="el-form-flex">
                <el-input v-model="dataForm.supplierName"  disabled></el-input>
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
      <el-table-column prop="registerBillNo" label="原支出类型" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.expenditureType" disabled></el-input>
          <span>{{scope.row.expenditureType}}</span>
        </template>
    </el-table-column>
      <el-table-column prop="sourceBillNo" label="汇票编号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.billNo" disabled></el-input>
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇款编号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.draftNo" disabled></el-input>
          <span>{{scope.row.billNo}}</span>
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
          <el-input size="mini" v-model="scope.row.amt" class="right-el-input" disabled ></el-input>
          <span>{{scope.row.amt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="monthRate" label="月利率(%)" width="80" align="right">
        <template slot-scope="scope">
          <div style="position: relative;"><el-input size="mini" v-model="scope.row.monthRate" class="right-el-input" disabled></el-input></div>
          <span>{{scope.row.monthRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newMonthRate" label="新月利率" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newMonthRate"></el-input>
          <span>{{scope.row.newMonthRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="backDate" label="退回时间" width="122" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.backDate" type="date" :picker-options="pickerOptions"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.backDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="draftExpireDate" label="汇票到期日" width="128" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.expenditureExpireDate" class="right-el-input" disabled ></el-input>
          <span>{{scope.row.expenditureExpireDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="paymentDate" label="原支出时间" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.expenditureDate" class="right-el-input" disabled ></el-input>
          <span>{{scope.row.expenditureDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="贴息额" width="120" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" readonly v-model="scope.row.discount" disabled></el-input>
          <span>{{scope.row.discount}}</span>
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

      <el-table-column prop="toStaff" label="入到款员工" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.toStaff" disabled></el-input>
          <span>{{scope.row.toStaff}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fee" label="手续费" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.fee" class="right-el-input" disabled
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.fee}}</span>
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
    <expenditure-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                      @submitSelectorSuccess="submitSelectorSuccess"
                      @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </expenditure-selector>
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
    <!-- 关联单据 -->
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/acceptanceExpenditureBack';
  import {uploadPath} from '@/api/erp/goods/storage';
  import {page as pageName} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: 'AcceptanceExpenditureBackForm',
    components: {
      'expenditure-selector': () => import('../components/expenditureSelector'),
      'acceptance-account-selector': () => import('../components/acceptanceAccountSelector'),

    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        uploadPath,
        dialogSelectorVisible: false,
        invoiceArr:undefined,
        isSelect: false,
        acceptanceVisible: false,
        attachment: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dialogSelectorVisible:false,
        typeOptions: [ {
          value: '2',
          label: '退承兑汇票'
        }],
        dataForm: {
          id: undefined,
          sourceBillNo:undefined,
          billNo: undefined,
          billStatus: undefined,
          billDate: undefined,
          expenditureType: undefined,
          customerCode: undefined,
          customerName: undefined,
          acceptanceAccount: undefined,
          draftAmt: undefined,
          attachment: [],
          alreadyChange: undefined,
          registerBillNo: undefined,
          expenditureExpireDate: undefined,
          backType:'退承兑汇票',
          items: [],
        },
        items: [],
        customerArr: [],
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
        rules: {
          backType: [
            {
              required: true,
              message: '请选择退回类型',
              trigger: 'blur'
            }
          ],
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

      submitSelectorSuccess(list) {
        if(list.list && list.list.length>0){
          this.dataForm.sourceBillNo = list.list[0].billNo;
          this.invoiceArr = list.list[0].billNo;
          this.dataForm.customerName = list.list[0].customerName;
          this.dataForm.customerCode = list.list[0].customerCode;
          if(list.list[0].mainDTO.supplierCode) {
            this.dataForm.supplierCode = list.list[0].mainDTO.supplierCode;
            this.dataForm.supplierName = list.list[0].mainDTO.supplierName;
          } else {
            this.dataForm.supplierCode = undefined
            this.dataForm.supplierName = undefined
          }
          list.list[0].expenditureType = list.list[0].mainDTO.expenditureType;
          list.list[0].expenditureExpireDate = list.list[0].draftExpireDate;
          list.list[0].expenditureDate = list.list[0].updTime;
          list.list[0].backDate = new Date().toLocaleDateString().replace(/\//g, '-');
          list.list[0].toStaff = list.list[0].crtUserName;
          list.list[0].sourceBillNo = list.list[0].billNo;
          list.list[0].newMonthRate = list.list[0].monthRate;
          this.items = [list.list[0]];

          this.vueSet(this.items, 0, this.items[0]);
        }
        this.dialogSelectorVisible = false;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleInvoicesSelector() {
        this.dialogSelectorVisible = true;
      },
      handleAcceptanceSelector(){
        this.acceptanceVisible = true;
      },
      handleCancelAcceptance() {
        this.$refs.acceptance.reset()
        this.acceptanceVisible = false
      },
      handleSubmitAcceptance() {
        this.$refs.acceptance.onSubmit();
      },
      closeAccountDialog(list) {
        if(list.length>0){
          this.dataForm.acceptanceStaffCode = list[0].accountCode;
          this.dataForm.acceptanceStaffName = list[0].name;
        }
        this.acceptanceVisible = false;
      },
      handleEdit(index, val, type, row) {
        console.log(type);
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
              this.customerArr = response.data.customerArr
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
              }
              if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
                this.dataForm.attachment = JSON.parse(response.data.attachment);
              } else {
                this.dataForm.attachment = [];
              }
              this.invoiceArr = response.data.items[0].billNo;
              if (response.data.items == undefined) {
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
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
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerCode = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.customer.reset()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        this.customerArr = list
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerCode = list[0].customerCode;
        }
      },
      getSummaries(param) {
        let {columns, data} = param
        let sums = []
        let values = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price))
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty))
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax))
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount))
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'tax' || column.property === 'taxAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'amount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.invoiceAmount = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4)
              } else {
                return prev
              }
            }, 0).toFixed(4)

            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleSubmit() {
        if(this.items.length<1){
          this.vueMessage('warning','请关联单据!');
          return
        }
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
          if (this.items[i].draftNo && this.items[i].draftNo != '') {
            if (!this.items[i].newMonthRate || this.items[i].newMonthRate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行新月利率必填项，请填写了再提交');
              return
            }
            if (!this.items[i].backDate || this.items[i].backDate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的退回时间必填项，请填写了再提交');
              return
            }
          }
        }
        return true
      }
    }
  }
</script>
