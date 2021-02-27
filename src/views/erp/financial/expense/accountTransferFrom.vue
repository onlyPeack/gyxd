<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增账户转账单</span>
        <span v-if="dataForm.id">编辑账户转账单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="payOrgName" class="el-form-flex">
                <el-input v-model="dataForm.billNo" :disabled="true" type="input" placeholder="自动生成"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" :disabled="true" align="right" type="datetime"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="审批状态:" prop="billStatus" class="el-form-flex">
                <el-select v-model="dataForm.billStatus" disabled>
                  <el-option v-for="item in statusOptions" :key="item.value" :value="item.value"
                             :label="item.label"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="转入账户:" prop="transferInAccount" class="el-form-flex">
                <div @click="handleCustomerSelector(false,0)"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in customerArr" :key="tag.id" closable
                          @close="handleCustomerDel">
                    {{tag.accountName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="做账类型:" prop="makeAccountType" class="el-form-flex">
                <el-select v-model="dataForm.makeAccountType" style="width: 100%;">
                  <el-option v-for="item in makeAccountTypeList" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="转账方式:" prop="transferType" class="el-form-flex">
                <el-select v-model="dataForm.transferType" style="width: 100%;">
                  <el-option v-for="item in transferTypeList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label=" 转入对象:" prop="transferInObject" class="el-form-flex">
                <el-select v-model="dataForm.transferInObject" style="width: 100%;">
                  <el-option v-for="item in transferInObjectList" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="转入金额:" prop="transferInMoney" class="el-form-flex">
                <el-input v-model="dataForm.transferInMoney" :disabled="true" type="input"
                          placeholder="请输入转入金额"></el-input>
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
      <el-table-column prop="message" label="转出账户" class-name="col-required">
        <template slot-scope="scope">
          <div @click.stop="handleCustomerSelector(true,scope.$index)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.transferOutAccount"></el-input>
          </div>
          <span>{{scope.row.transferOutAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="转出账户名称" class-name="col-required" @click="handleCustomerSelector(true)">
        <template slot-scope="scope">
          <div @click.stop="handleCustomerSelector(true,scope.$index)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.transferOutAccountName"></el-input>
          </div>
          <span>{{scope.row.transferOutAccountName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOutMoney" label="转出金额" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.transferOutMoney"  @change="handleEdit($event,scope.$index,scope.row)"></el-input>
          <!-- <span>{{scope.row.transferOutMoney}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="transferOutDate" label="转出时间">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.transferOutDate" type="datetime" placeholder="请选择日期"
                          :clearable="false" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          <span>{{scope.row.transferOutDate}}</span>
        </template>
      </el-table-column>


    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 账户列表弹窗-->
    <el-dialog title="请选择账户" :visible.sync="customerVisible" append-to-body>
      <account-number-selector @closeAccountDialog="closeAccountDialog" @closeAccountDialogs="closeAccountDialogs"
                               :isSelect="isSelect" :isSingle="true"
                               ref="customer"></account-number-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
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
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/accountTransfer';
  import {getObj} from '@/api/admin/user/index';
  import {page} from '@/api/erp/financial/financialCapitalAccount';

  export default {
    name: "accountTransferFrom",
    components: {
      'account-number-selector': () => import('../components/accountNumberSelector'),
    },
    props: ['id', 'dialogFormVisible', 'typeOptions'],
    data() {
      return {
        index: 0,
        clientHeight: 300,
        isSelect: false,
        isFormLoading: false,
        isTemporaryLoading: false,
        makeAccountTypeList: [
          {
            value: '0',
            label: '收入货款',
          },
          {
            value: '1',
            label: '收入退款',
          },
          {
            value: '2',
            label: '内部转账',
          },
          {
            value: '3',
            label: '费用登记单(收入)',
          },
          {
            value: '4',
            label: '分公司转账',
          },
          {
            value: '5',
            label: '期初录入',
          },
          {
            value: '6',
            label: '支付贷款',
          },
          {
            value: '7',
            label: '支付运费',
          },
          {
            value: '8',
            label: '支付退款',
          },
          {
            value: '9',
            label: '费用登记单(支出)',
          },
          {
            value: '10',
            label: '其他类型',
          },
          {
            value: '11',
            label: '投资款',
          }
        ],
        transferInObjectList: [
          {
            value: '0',
            label: '管理部',
          },
          {
            value: '1',
            label: '财务部',
          },
        ],
        transferTypeList: [
          {
            value: '0',
            label: '银行办理',
          },
          {
            value: '1',
            label: '网银办理',
          },
        ],
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          transferInMoney: undefined,
          note: undefined,
          billStatus: 2,
          items: [],
          makeAccountType: '0',
          transferInObject: '0',
          transferInAccount: '',
          transferType: '0',
        },
        items: [],
        customerArr: [],
        departArr: [],
        customerVisible: false,
        rules: {}
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
          var height = 170;
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
              this.dataForm.billStatus = Number(response.data.billStatus);
              this.departArr = response.data.departArr;
              this.customerArr = response.data.customerArr;
              var list = {
                page: 1,
                limit: 20,
                accountCode: response.data.transferInAccount,
                selectType: 4,
              }
              page(list)
                .then(res => {
                  this.customerArr = res.data.records
                })
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = this.formatDate("yyyy-MM-dd hh:mm:ss", new Date());
          this.dataForm.billDate = date;
          var userId = this.$store.state.user.id;
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
      formatDate(fmt, date) {
        if (typeof date === 'string') {
          date = new Date(date);
        }

        var o = {
          "M+": date.getMonth() + 1,                 //月份
          "d+": date.getDate(),                    //日
          "h+": date.getHours(),                   //小时
          "m+": date.getMinutes(),                 //分
          "s+": date.getSeconds(),                 //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        let date = this.formatDate("yyyy-MM-dd hh:mm:ss", new Date());
        const d = {
          transferOutDate: date,
          transferOutAccount: undefined,
          transferOutAccountName: undefined,
          transferOutMoney: undefined,

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
          this.vueSet(this.items[index], 'transferOutMoney', val);
        } else {
          this.vueSet(this.items[index], 'transferOutMoney', '0.0000');
        }
      },

      // 客户选择
      handleCustomerSelector(isSelect, index) {
        this.isSelect = isSelect;
        if (isSelect) {
          this.index = index;
        }

        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.accountId = undefined;
        this.dataForm.transferInAccount = undefined;
        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeAccountDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        for (let i = 0; i < this.items.length; i++) {
          if (list.length > 0) {
            if (list[0].id == this.items[i].transferOutAccount) {
              this.vueMessage('warning', '该账户已包含在转出账户中!');
              return
            }
          }
        }
        if (list.length > 0) {
          this.dataForm.transferInAccount = list[0].accountCode;
          this.dataForm.accountId = list[0].id;

        }
      },
      closeAccountDialogs(list) {
        this.customerVisible = false;
        if (this.customerArr.length > 0) {
          if (this.customerArr[0].id == list[0].id) {
            this.vueMessage('warning', '该账户已包含在转入中!');
            return
          }
        }

        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].transferOutAccount == list[0].accountCode) {
            this.vueMessage('warning', '该账户已包含转出账户中!');
            return
          }
        }

        if (list.length > 0) {
          this.items[this.index].transferOutAccountName = list[0].accountName;
          this.items[this.index].transferOutAccount = list[0].accountCode;
        }
      },

      handleDepartDel(index) {
        this.departArr.splice(index, 1);
        this.dataForm.payOrgName = undefined;
        this.dataForm.payOrgId = undefined;
        if (this.$refs.depart) {
          this.$refs.depart.reset();
        }
      },

      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));

          if (column.property === 'transferOutMoney') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'transferOutMoney') {
                  this.dataForm.transferInMoney = getFloat((prev + curr), 4)
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
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            console.log(subFun, _this.dataForm);

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
          if (!this.items[i].transferOutAccount || this.items[i].transferOutAccount == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的转出账户为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].transferOutAccountName || this.items[i].transferOutAccountName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的转出账户名称为必填项，请填写了再提交');
            return;
          }
          if (!this.items[i].transferOutMoney || this.items[i].transferOutMoney == ''
            || this.items[i].transferOutMoney == '0.00' || this.items[i].transferOutMoney == 'NaN') {
            this.$message.error('第' + (i * 1 + 1) + '行的转出金额为大于0的数字，请填写了再提交');
            return;
          }
        }
        if (this.items.length < 1) {
          this.$message.error('转出账户请填写了再提交');
          return;
        }
        if (this.customerArr.length < 1) {
          this.$message.error('转入账户请填写了再提交');
          return;
        }
        return true;
      }
    },
  }
</script>

