<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增应收初始化</span>
        <span v-if="dataForm.id">编辑应收初始化</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="会计期间:" prop="accountingPeriod" class="el-form-flex">
                <el-date-picker v-model="dataForm.accountingPeriod" align="right" type="month"
                                style="width: 200px;" placeholder="请选择日期" :readonly="true">
                </el-date-picker>
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
      <el-table-column prop="customerName" label="客户名称" min-width="180" align="left">
        <template slot-scope="scope">
          <div @click="handleCustomerSelector(scope.$index)"
               style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.customerArr" :key="tag.id" closable
                    @close="handleCustomerDel(scope.$index,tagIndex)">
              {{tag.customerName}}
            </el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="billDate" label="业务日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.billDate" align="right" type="date" placeholder="请选择日期" :clearable="false">
          </el-date-picker>
          <span>{{scope.row.billDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveAccount" label="收款账户" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.receiveAccount" size="small">
            <el-option
              v-for="item in bankAccountArr"
              :key="item.value"
              :label="item.name"
              :value="item.accountCode">
            </el-option>
          </el-select>
          <span>{{scope.row.receiveAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiptCondition" label="收款条件" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.receiptCondition" size="small">
            <el-option
              v-for="item in repayConditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.receiptCondition}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deadlineDate" label="收款到期日" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.deadlineDate" readonly
                    class="readonly-el-input left-el-input"></el-input>
          <span>{{scope.row.deadlineDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="currencyId" label="币别" width="120">
        <template slot-scope="scope">
          <el-select v-model="scope.row.currencyId" size="small">
            <el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="receiveAmount" label="应收金额" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.receiveAmount" class="right-el-input"
                    @change="handleEdit($event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.thisPaymentAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
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

    <!-- 新增付款申请单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util';
  import {addObj, getObj} from '@/api/erp/financial/financialReceivableInit';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: "receivables-init-form",
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        dataForm: {
          id: undefined,
          accountingPeriod: undefined,
          items: []
        },
        items: [],
        customerVisible: false,
        customerIndex: undefined,
        bankAccountArr: [],
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
          var height = 40;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getObj(this.id)
            .then(response => {
              this.dataForm.id = response.data.id;
              this.dataForm.accountingPeriod = response.data.accountingPeriod;
              this.items = [response.data];
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.accountingPeriod = date;
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
        let date = new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          customerArr: [],
          deadlineDate: date,
          receiptCondition: '2',
          billDate: date,
          currencyId: '1',
          receiveAmount: undefined,
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
          this.vueSet(this.items[index], 'receiveAmount', val);
        } else {
          this.vueSet(this.items[index], 'receiveAmount', '0.0000');
        }
      },

      // 客户选择
      handleCustomerSelector(index) {
        this.customerIndex = index;
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.customerIndex = undefined;
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleCustomerDel(index, tagIndex) {
        this.items[index].customerArr.splice(tagIndex, 1);
        this.items[index].customerId = undefined;
        this.items[index].customerName = undefined;
        this.items[index].customerCode = undefined;
        this.vueSet(this.items, index, this.items[index]);

        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        if (list.length > 0) {
          if (this.checkedCustomer(list[0].id)) {
            this.$message.warning('此客户已被选中');
            return;
          }
        }
        this.items[this.customerIndex].customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.items[this.customerIndex].customerId = list[0].id;
          this.items[this.customerIndex].customerName = list[0].customerName;
          this.items[this.customerIndex].customerCode = list[0].customerCode;
        }
        this.vueSet(this.items, this.customerIndex, this.items[this.customerIndex]);
        this.$refs.customer.reset();
      },
      checkedCustomer(customerId) {
        for (var i in this.items) {
          if (this.items[i].customerId && customerId == this.items[i].customerId) {
            return true;
          }
        }
        return false;
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'receiveAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }


          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      dataFormSubmit(_this, subFun, subFunSuccessName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            _this.isFormLoading = true;
            var list = [];
            for (var i in _this.items) {
              if (_this.items[i].customerName && _this.items[i].customerName != '') {
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
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, addObj, 'submitSuccess');
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (!this.items[i].customerName || this.items[i].customerName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的客户名称为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].billDate || this.items[i].billDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的业务日期为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].receiveAmount || this.items[i].receiveAmount == ''
            || this.items[i].receiveAmount == '0.00' || this.items[i].receiveAmount == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的应收金额为大于0的数字，请填写了再提交');
            return;
          }
        }
        return true;
      }
    }
  }
</script>
