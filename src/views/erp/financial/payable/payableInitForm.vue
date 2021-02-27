<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增应付初始化</span>
        <span v-if="dataForm.id">编辑应付初始化</span>
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
      <el-table-column prop="supplierName" label="供应商名称" min-width="180" align="left">
        <template slot-scope="scope">
          <div @click="handleSupplierSelector(scope.$index)"
               style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.supplierArr" :key="tag.id" closable
                    @close="handleSupplierDel(scope.$index,tagIndex)">
              {{tag.supplierName}}
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
      <el-table-column prop="payAccount" label="付款账户" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.payAccount" size="small">
            <el-option
              v-for="item in bankAccountArr"
              :key="item.value"
              :label="item.name"
              :value="item.accountCode">
            </el-option>
          </el-select>
          <span>{{scope.row.payAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="repayCondition" label="付款条件" width="150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.repayCondition" size="small">
            <el-option
              v-for="item in repayConditionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.repayCondition}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="repayDate" label="付款到期日" width="150">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.repayDate" readonly
                    class="readonly-el-input left-el-input"></el-input>
          <span>{{scope.row.repayDate}}</span>
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
      <el-table-column prop="payAmount" label="应付金额" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.payAmount" class="right-el-input"
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
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util';
  import {addObj, getObj} from '@/api/erp/financial/financialPayableInit';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: "payableInitForm",
    components: {
      'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector')
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
        supplierVisible: false,
        supplierIndex: undefined,
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
          supplierId: undefined,
          supplierName: undefined,
          supplierArr: [],
          billDate: date,
          repayCondition: '2',
          repayDate: date,
          currencyId: '1',
          payAmount: undefined,
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
          this.vueSet(this.items[index], 'payAmount', val);
        } else {
          this.vueSet(this.items[index], 'payAmount', '0.0000');
        }
      },

      // 供应商选择
      handleSupplierSelector(index) {
        this.supplierIndex = index;
        this.supplierVisible = true;
      },
      handleCancelSupplier() {
        this.supplierIndex = undefined;
        this.supplierVisible = false;
        this.$refs.supplier.reset();
      },
      handleSupplierDel(index, tagIndex) {
        this.items[index].supplierArr.splice(tagIndex, 1);
        this.items[index].supplierId = undefined;
        this.items[index].supplierName = undefined;
        this.vueSet(this.items, index, this.items[index]);

        this.$refs.supplier.reset();
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
      closeSupplierDialog(list) {
        if (list.length > 0) {
          if (this.checkedSupplier(list[0].id)) {
            this.$message.warning('此供应商已被选中');
            return;
          }
        }
        this.items[this.supplierIndex].supplierArr = list;
        this.supplierVisible = false;
        if (list.length > 0) {
          this.items[this.supplierIndex].supplierId = list[0].id;
          this.items[this.supplierIndex].supplierName = list[0].supplierName;
        }
        this.vueSet(this.items, this.supplierIndex, this.items[this.supplierIndex]);
        this.$refs.supplier.reset();
      },
      checkedSupplier(supplierId) {
        for (var i in this.items) {
          if (this.items[i].supplierId && supplierId == this.items[i].supplierId) {
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
            if (column.property == 'payAmount') {
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
              if (_this.items[i].supplierName && _this.items[i].supplierName != '') {
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
          if (!this.items[i].supplierName || this.items[i].supplierName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的供应商名称为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].billDate || this.items[i].billDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的业务日期为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].payAmount || this.items[i].payAmount == ''
            || this.items[i].payAmount == '0.00' || this.items[i].payAmount == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的应付金额为大于0的数字，请填写了再提交');
            return;
          }
        }
        return true;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .payableInitFormDialog {
    font-size: 12px;

    .con-title {
      font-size: 16px;

      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }

      .cont-title-billNo {
        font-weight: bold;
        float: right;
        margin-right: 30px;
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

    .topTable {
      width: 100%;
      margin-bottom: 20px;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;

      td {
        border: 1px solid #e0e0e0;
        height: 40px;
        padding: 0px;
        margin: 0px;
        padding-left: 10px;
      }

      .el-form-flex {
        display: flex;
        margin-bottom: 0px;
      }

      .el-input, .el-select, .el-input-number {
        margin-top: 6px;
      }

      .el-input input.el-input__inner {
        border: none;
        text-align: left;
      }

      .el-textarea__inner {
        border: none;
        resize: none;
        padding: 10px 15px;
      }
    }

    .order-making {
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
    }

    .tb-edit {
      .el-input + span {
        display: none
      }

      .el-select + span {
        display: none
      }

      .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
        background-color: #fff;
      }

      td, th {
        padding: 0px;
        margin: 0px;
        height: 40px;
      }

      th {
        font-weight: 400;
        color: #000;
        background-color: #F7F7F7;
      }

      td {
        .cell {
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding: 0px;
          text-align: center;
          background-color: #fff;
        }

        .el-input, el-select {
          width: 100% !important;
          height: 40px;
        }

        .el-input--mini .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }

        .el-select--small .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }

        .readonly-el-input {
          background-color: rgba(247, 247, 247, 0.5);

          .el-input__inner {
            background-color: rgba(247, 247, 247, 0.5);
          }
        }

        .right-el-input {
          .el-input__inner {
            text-align: right;
          }
        }

        .center-el-input {
          .el-input__inner {
            text-align: center;
          }
        }
      }
    }
  }
</style>
