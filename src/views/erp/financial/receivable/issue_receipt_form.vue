<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">开具收据申请单</span>
        <span v-if="dataForm.id">编辑收据申请单</span>
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
                                style="width: 200px;" :picker-options="pickerOptions" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收据类型:" prop="issueType" class="el-form-flex">
                <el-select v-model="dataForm.issueType" size="small" placeholder="">
                  <el-option
                    v-for="item in acceptanceTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="(tag,tagIndex) in dataForm.customerArr" v-model="dataForm.customerCode" :key="tag.id" closable
                          @close="handleCustomerDel(tagIndex)">
                    {{tag.customerCode}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" disabled=""></el-input>
              </el-form-item>
            </td>
          </tr>
          <!-- 到款 -->
          <tr>
            <td>
              <el-form-item label="收款单号:" prop="receiveBillNo" class="el-form-flex" >
                <div @click.stop="handleInvoicesSelector(2)"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.receiveBillNo" v-model="dataForm.receiveBillNo" @close="handleReceiveBillNoClose" closable>
                    {{dataForm.receiveBillNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到款金额:" prop="receiveMoney" class="el-form-flex">
                <el-input v-model="dataForm.receiveMoney"  disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收款到账银行:" prop="receiveBank" class="el-form-flex">
                <el-input v-model="dataForm.receiveBank"  disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <!-- 承兑汇票 -->
          <tr>
            <td>
              <el-form-item label="汇票单号:" prop="draftNo" class="el-form-flex" >
                <div @click.stop="handleInvoicesSelector(1)"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.draftBillNo" v-model="dataForm.draftNo" @close="handleBillNoClose" closable>
                    {{dataForm.draftBillNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="票面金额:" prop="draftMoney" class="el-form-flex">
                <el-input v-model="dataForm.draftMoney"  disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开具收款金额:" prop="draftMoney" class="el-form-flex">
                <el-input v-model="dataForm.draftMoney"  disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="汇票到款银行:" prop="draftBank" class="el-form-flex">
                <el-input v-model="dataForm.draftBank"  disabled></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
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
    <issue-receipt-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                      @submitSelectorSuccess="submitSelectorSuccess"
                      @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo" :acceptanceType="dataForm.issueType"
                      :customerCode="dataForm.customerCode">
    </issue-receipt-selector>
    <!-- 新增承兑支出弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="!id" @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button v-if="!id" type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                         ref="customer" ></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill,getBillDetail, tempAddBill} from '@/api/erp/financial/issueReceipt';
  import {uploadPath} from '@/api/erp/goods/storage';
  import {page as pageName} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: 'AcceptanceExpenditureBackForm',
    components: {
      'issue-receipt-selector': () => import('../components/issueReceiptSelector'),
      'acceptance-account-selector': () => import('../components/acceptanceAccountSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),

    },
    props: ['id', 'dialogFormVisible','typeOptions','acceptanceTypeOptions'],
    data() {
      return {
        uploadPath,
        invoiceArr:undefined,
        isSelect: false,
        acceptanceVisible: false,
        attachment: [],
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dialogSelectorVisible:false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24;
          },
        },
        dataForm: {
          id: undefined,
          sourceBillNo:undefined,
          billNo: undefined,
          draftBillNo:undefined,
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
          backType:undefined,
          items: [],
          customerArr: [],
        },
        items: [],
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
          billDate: [
            {
              required: true,
              message: '请输入单据日期',
              trigger: 'blur'
            }
          ],
          issueType: [
            {
              required: true,
              message: '请选择收据类型',
              trigger: 'blur'
            }
          ],
          customerCode: [
            {
              required: true,
              message: '请选择客户编号',
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
      submitSelectorSuccess(list,isClearAll) {
        if(list.list && list.list.length>0){
          if(this.dataForm.issueType == 1) {
            // 汇票单号
            this.dataForm.draftBillNo = list.list[0].billNo;
          } else {
            // 收款编号
            this.dataForm.receiveBillNo = list.list[0].mainDTO.billNo;
          }
          // 到款金额
          this.dataForm.receiveMoney = list.list[0].amountFormer;
          // 收款到账依银行
          this.dataForm.receiveBank = list.list[0].mainDTO.receiveAccount;
          this.dataForm.sourceBillNo = list.list[0].billNo;
          
          // 票面金额
          this.dataForm.amt = list.list[0].amt;
          // 开具收款金额
          this.dataForm.draftMoney = list.list[0].amt;
          // 汇票到款银行
          this.dataForm.draftBank = list.list[0].mainDTO.toBankCode;
          // 承兑编号
          this.dataForm.draftNo = list.list[0].billNo;
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
      handleInvoicesSelector(type) {
        if(this.dataForm.customerCode == undefined) {
          this.$message.warning('请先选择客户编号')
        } else if(this.dataForm.issueType == undefined) {
          this.$message.warning('请先选择收据类型')
        } else if (type != this.dataForm.issueType) {
          this.$message.warning('请选择与类型对应的单号')
        } else {
          this.dialogSelectorVisible = true;
        }
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
          let query = {
            id:this.id
          }
          getBillDetail(query)
            .then(response => {
              this.dataForm = response.data;
              this.dataForm.customerArr = [];
              this.dataForm.customerArr.push({
                customerCode:response.data.customerCode,
                id:0
              })
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
              }
              if (response.data.attachment && response.data.attachment != "null" && response.data.attachment != '"null"') {
                this.dataForm.attachment = JSON.parse(response.data.attachment);
              } else {
                this.dataForm.attachment = [];
              }
              // this.invoiceArr = response.data.items[0].billNo;
              this.dataForm.issueType = response.data.issueType;
              this.dataForm.billDate = response.data.crtTime;
              // this.dataForm.customerCode = response.data.customerCode;

              if(response.data.issueType == '1') {
                this.dataForm.draftBillNo = response.data.billNo;
                this.dataForm.receiveBillNo = null;
              } else {
                this.dataForm.receiveBillNo = response.data.billNo;
                this.dataForm.draftBillNo = null;
              }
              console.log('dataForm');
          console.log(this.dataForm);
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
        this.dataForm.customerArr.splice(index, 1);
        this.dataForm.customerCode = undefined;
        this.dataForm.customerName = undefined;
        this.$refs.customer.reset()
      },
      handleReceiveBillNoClose() {
        this.$set(this.dataForm,'receiveBillNo',undefined)
        this.$set(this.dataForm,'amountFormer',undefined)
        this.$set(this.dataForm,'receiveAccount',undefined)
        this.$forceUpdate()
      },
      handleBillNoClose() {
        this.$set(this.dataForm,'billNo',undefined)
        this.$set(this.dataForm,'amt',undefined)
        this.$set(this.dataForm,'draftMoney',undefined)
        this.$set(this.dataForm,'toBankCode',undefined)
        this.$forceUpdate()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        // 单选
        let tempList = [];
        tempList.push(list[list.length - 1])
        this.dataForm.customerArr = tempList
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
         this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(this.dataForm.draftNo);
            if(this.dataForm.issueType == 1 && !this.dataForm.draftNo) {
              this.vueMessage('warning','请选择汇票单号');
            } else if (this.dataForm.issueType == 2 && !this.dataForm.receiveBillNo) {
              this.vueMessage('warning','请选择收款单号');
            } else {
              this.dataFormSubmit(this, addBill, 'submitSuccess');
            }
          } else {
            return false;
          }
        });
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
            console.log(_this.dataForm);
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
