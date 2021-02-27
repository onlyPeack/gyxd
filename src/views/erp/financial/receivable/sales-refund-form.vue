<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增销售退款</span>
        <span v-if="dataForm.id">编辑销售退款</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input placeholder="单据编号由系统自动生成" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <!--<td>-->
            <!--<el-form-item label="回款形式:" prop="paymentForm" class="el-form-flex">-->
            <!--<el-select v-model="dataForm.paymentForm" style="width: 100%;">-->
            <!--<el-option v-for="item in moneybackFormOptions" :key="item.value" :label="item.label"-->
            <!--:value="item.value">-->
            <!--</el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--</td>-->
          </tr>
          <!--<tr>-->
          <!--<td>-->
          <!--<el-form-item label="客户:" prop="customerName" class="el-form-flex">-->
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
          <!--<td>-->
          <!--<el-form-item label="业务员:" prop="salerName" class="el-form-flex">-->
          <!--<div @click="handleSalerUserSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">-->
          <!--<span>-->
          <!--<svg-icon icon-class="add"></svg-icon>-->
          <!--</span>-->
          <!--<el-tag v-for="tag in salerArr" :key="tag.id" closable @close="handleSalerUserDel">-->
          <!--{{tag.name}}-->
          <!--</el-tag>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
          <!--<td colspan="2">-->
          <!--<el-form-item label="币别:" prop="currencyId" class="el-form-flex">-->
          <!--<el-select v-model="dataForm.currencyId" style="width: 100%;">-->
          <!--<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value">-->
          <!--</el-option>-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
          <!--<td>-->
          <!--<el-form-item label="到款金额:" prop="amountFormer" class="el-form-flex">-->
          <!--<el-input v-model="dataForm.amountFormer" placeholder="请输入到款金额(正数为收款,负数为退款)"-->
          <!--@change="handleEdit('amountFormer',$event)"></el-input>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--<td>-->
          <!--<el-form-item label="到款日期:" prop="receiveDate" class="el-form-flex">-->
          <!--<el-date-picker v-model="dataForm.receiveDate" align="right" type="date"-->
          <!--style="width: 200px;" placeholder="请选择日期">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--&lt;!&ndash;<td>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-form-item label="收款账户:" prop="receiveAccount" class="el-form-flex">&ndash;&gt;-->
          <!--&lt;!&ndash;<el-select v-model="dataForm.receiveAccount" style="width: 100%;">&ndash;&gt;-->
          <!--&lt;!&ndash;<el-option v-for="item in bankAccountArr" :key="item.id" :label="item.name"&ndash;&gt;-->
          <!--&lt;!&ndash;:value="item.accountCode">&ndash;&gt;-->
          <!--&lt;!&ndash;</el-option>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--&lt;!&ndash;</td>&ndash;&gt;-->
          <!--</tr>-->
          <tr>
            <!-- <td width="50%">
              <el-form-item label="退款账户:" prop="receiveAccount" class="el-form-flex">
                <el-select v-model="dataForm.receiveAccount" style="width: 100%;">
                  <el-option v-for="item in bankAccountArr" :key="item.id" :label="item.name"
                             :value="item.accountCode">
                  </el-option>
                </el-select>
              </el-form-item>
            </td> -->
            <td width="50%">
              <el-form-item label="退款方式:" prop="paymentsMeans" class="el-form-flex">
                <el-select v-model="dataForm.paymentsMeans" style="width: 100%;" @change="handleReceiveAccount">
                  <el-option v-for="item in paymentsMeansOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <!--<td width="50%">-->
            <!--<el-form-item label="冲抵预收金额:" prop="sumOfAdvance" class="el-form-flex">-->
            <!--<el-input v-model="dataForm.sumOfAdvance" placeholder="请输入冲抵预付金额"></el-input>-->
            <!--</el-form-item>-->
            <!--</td>-->
          </tr>
          <!--<tr>-->
          <!--<td colspan="2">-->
          <!--<el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">-->
          <!--<div @click="handlePurchaseContractSelector"-->
          <!--style="cursor: pointer;line-height: 40px;margin-right: 15px;">-->
          <!--<span>-->
          <!--<svg-icon icon-class="add"></svg-icon>-->
          <!--</span>-->
          <!--<el-tag v-for="(tag,index) in sourceBillNoArr" :key="index"-->
          <!--@close="handleSourceBillNoDel">-->
          <!--{{tag}}-->
          <!--</el-tag>-->
          <!--</div>-->
          <!--</el-form-item>-->
          <!--</td>-->
          <!--</tr>-->
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
              class="tb-edit" :summary-method="getSummaries" title="明细预览">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <!--<el-table-column prop="sourceBillNo" label="关联单据">-->
      <!--<template slot-scope="scope">-->
      <!--<div style="text-align: left;padding-left: 10px;width: 100%;" class="readonly-el-input">-->
      <!--{{scope.row.sourceObjectName}} {{scope.row.sourceBillNo}}-->
      <!--</div>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="customerCode" label="客户编号">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.customerCode"
                    class="readonly-el-input left-el-input" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
        <template slot-scope="scope">
          <div @click="handleCustomerSelector(scope.$index)">
            <el-input size="mini" v-model="scope.row.customerName"
                      class="left-el-input" readonly></el-input>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="salerCode" label="业务员工号">-->
      <!--<el-input size="mini" v-model="dataForm.salerCode"-->
      <!--class="readonly-el-input left-el-input" readonly></el-input>-->
      <!--</el-table-column>-->
      <el-table-column prop="salerName" label="客服姓名">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.managerName"
                    class="readonly-el-input left-el-input" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="depart" label="客服部门">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.departName"
                    class="readonly-el-input left-el-input" readonly></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="amountFormer" label="退款金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amountFormer" class="right-el-input"
                    @change="handleEdit('thisReceivableAmount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{dataForm.amountFormer}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bankName" label="客户银行" align="middle" min-width="120" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.bankName" @input="handleInputChasnge" class="right-el-input"></el-input>
          <!-- <span>{{scope.row.bankName}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="bankAccount" label="客户银行账号" align="middle" min-width="180" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.bankAccount" @input="handleInputChasnge" class="right-el-input"></el-input>
          <!-- <span>{{scope.row.bankAccount}}</span> -->
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="退款日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.receiveDate" type="date" :picker-options="pickerOptions"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.receiveDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"
                    class="right-el-input"></el-input>
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

    <!-- 业务员列表弹窗-->
    <el-dialog title="请选择业务员" :visible.sync="salerUserVisible" append-to-body>
      <sales-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                           ref="salerUser"></sales-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSalerUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSalerUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增实际回款弹窗底部 -->
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
    <receivables-detail-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                                 @submitSelectorSuccess="submitSelectorSuccess"
                                 @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </receivables-detail-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/salesRefund'
  import {getObj} from '@/api/admin/user/index'
  import {pageAll} from '@/api/erp/financial/financialBankAccount'

  export default {
    name: 'sales-refund-form',
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'sales-user-selector': () => import('@/components/ERP/User/user'),
      'receivablesDetailSelector': () => import('../components/receivablesDetailSelector')
    },
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions'],
    data() {
      const validateAmountFormer = (rule, value, callback) => {
        if (!value || value == '' || value == '0.00' || value == 'NaN') {
          callback(new Error('请输入退款金额(不能为0)'))
        } else {
          callback()
        }
      }
      const validatesalerNameFormer = (rule, value, callback) => {
        if (this.salerArr.length < 1) {
          callback(new Error('请选择业务员'))
        } else {
          callback()
        }
      }
      return {
        pickerOptions: {
          disabledDate(time) {
            return (time.getTime() + 3600 * 1000 * 24) < Date.now();
          }
        },
        scopeIndex: '',
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          amountFormer: undefined,
          bankName:undefined,
          bankAccount:undefined,
          currencyId: '1',
          receiveAccount: undefined,
          sumOfAdvance: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        salerArr: [],
        customerArr: [],
        sourceBillNoArr: [],
        salerUserVisible: false,
        customerVisible: false,
        bankAccountArr: [],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          receiveDate: [
            {
              required: true,
              message: '请选择退款日期',
              trigger: 'blur'
            }
          ],
          customerName: [
            {
              required: true,
              message: '请选择客户',
              trigger: 'blur'
            }
          ],
          salerName: [
            {
              required: true,
              validator: validatesalerNameFormer,
              trigger: 'blur'
            }
          ],
          amountFormer: [
            {
              required: true,
              validator: validateAmountFormer,
              trigger: 'blur'
            }
          ],
          receiveAccount: [
            {
              required: true,
              message: '请选择退款账户',
              trigger: 'blur'
            }
          ],
          paymentsMeans: [
            {
              required: true,
              message: '请选择退款方式',
              trigger: 'blur'
            }
          ]
        },
        dialogSelectorVisible: false
      }
    },
    created() {
      this.init()
      console.log(this.paymentsMeansOptions);
      this.changeDivHeight()
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight()
      }

      for (var i in this.paymentsMeansOptions) {
        if (this.paymentsMeansOptions[i].label == '对公转账') {
          this.dataForm.paymentsMeans = this.paymentsMeansOptions[i].value
        }
      }
      this.handleReceiveAccount()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleReceiveAccount() {
        if(this.dataForm.paymentsMeans == '4' || this.dataForm.paymentsMeans == '5' || this.dataForm.paymentsMeans == '6') {
          this.dataForm.receiveAccount = '90002'
        } else if (this.dataForm.paymentsMeans == '7') {
          this.dataForm.receiveAccount = '90006'
        } else if (this.dataForm.paymentsMeans == '8') {
          this.dataForm.receiveAccount = '90007'
        } else if (this.dataForm.paymentsMeans == '1' || this.dataForm.paymentsMeans == '2' || this.dataForm.paymentsMeans == '3') {
          this.dataForm.receiveAccount = '90001'
        }
      },
      handleInputChasnge(val) {
        console.log('val');
        console.log(val);
        this.$forceUpdate()
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 293
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
              this.salerArr = [{id: response.data.salerId, name: response.data.salerName}]
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = response.data.sourceBillNo.split(',')
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
          this.dataForm.receiveDate = date
          this.handleValueAdd()
        }
        // pageAll().then(response => {
        //   this.bankAccountArr = []
        //   for (var i in response.data) {
        //     if (response.data[i].accountCode == '90002') {
        //       this.dataForm.receiveAccount = response.data[i].accountCode
        //       this.bankAccountArr.push(response.data[i])
        //     }
        //     if (response.data[i].accountCode == '90006') {
        //       this.dataForm.receiveAccount = response.data[i].accountCode
        //       this.bankAccountArr.push(response.data[i])
        //     }
        //     console.log(this.dataForm.paymentsMeans);
        //     if(this.dataForm.paymentsMeans == '5') {
        //       this.dataForm.receiveAccount = '90002'
        //     }
        //   }
        // })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          sourceBillDate: undefined,
          sourceBillNo: undefined,
          receiveDate: new Date().toLocaleDateString().replace(/\//g, '-'),
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
      handleEdit(type, val, index, row) {
        if (type == 'thisReceivableAmount') {
          if (val != undefined && val != '') {
            val = Number(val).toFixed(4)
            this.dataForm.amountFormer = val
            this.vueSet(this.items[index], 'amountFormer', val);
          }
        } else {
          if (val * 1 > row.receivableAmount * 1) {
            this.$message.error('回款金额不能大于应收金额')
            this.vueSet(this.items[index], 'thisReceivableAmount', Number(row.receivableAmount).toFixed(4))
          } else {
            if (val != undefined && val != '') {
              val = Number(val).toFixed(4)
              this.vueSet(this.items[index], 'thisReceivableAmount', val)
            } else {
              this.vueSet(this.items[index], 'thisReceivableAmount', '0.00')
            }
          }
        }
      
      },

      // 客户选择
      handleCustomerSelector(val) {
        this.scopeIndex = val;
        this.customerVisible = true
      },
      handleCancelCustomer() {
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1)
        this.dataForm.customerId = undefined
        this.dataForm.customerName = undefined
        this.dataForm.customerCode = undefined
        this.$refs.customer.reset()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        this.customerVisible = false
        if (list.length > 0) {
          this.items[this.scopeIndex].customerName = list[0].customerName;
          this.items[this.scopeIndex].customerId = list[0].id;
          this.items[this.scopeIndex].customerCode = list[0].customerCode;
          this.items[this.scopeIndex].managerId = list[0].managerId;
          this.items[this.scopeIndex].managerName = list[0].managerName;
          this.items[this.scopeIndex].departName = list[0].departName;
          // this.items[this.scopeIndex].bankName = list[0].bankName;
          // this.items[this.scopeIndex].bankAccount = list[0].bankAccount;
          this.vueSet(this.items, this.scopeIndex, this.items[this.scopeIndex]);
        }
      },

      // 业务员选择
      handleSalerUserSelector() {
        if (!this.dataForm.customerName || this.dataForm.customerName == '') {
          this.$message.warning('请选择客户')
          return
        }
        this.salerUserVisible = true
      },
      handleCancelSalerUser() {
        this.$refs.salerUser.reset()
        this.salerUserVisible = false
      },
      handleSalerUserDel(index) {
        this.salerArr.splice(index, 1)
        this.dataForm.salerId = undefined
        this.dataForm.salerName = undefined
        this.$refs.salerUser.reset()
      },
      handleSubmitSalerUser() {
        this.$refs.salerUser.onSubmit()
      },
      closeUserDialog(list) {
        this.salerArr = list
        this.salerUserVisible = false
        if (list.length > 0) {
          this.dataForm.salerName = list[0].name
          this.dataForm.salerId = list[0].id
        }
      },

      data2Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.skuNo] = item
        })
        return map
      },
      data3Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.sourceBillId] = item
        })
        return map
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
          if (column.property === 'thisReceivableAmount') {
            values = data.map(item => Number(item.thisReceivableAmount))
          } else if (column.property === 'receivableAmount') {
            values = data.map(item => Number(item.receivableAmount))
          }

          if (column.property === 'receivableAmount' || column.property === 'thisReceivableAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'thisReceivableAmount') {
                  this.dataForm.amountFormer = getFloat((prev + curr), 4)
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
      handleCancel() {
        this.$emit('handleCancelForm')
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        if (this.dataForm.customerName == undefined || this.dataForm.customerName == '') {
          this.$message.warning('请先选择客户')
          return
        }
        this.dialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1)
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',')
      },
      submitSelectorSuccess(obj) {
        if (obj.list.length == 0) {
          this.dialogSelectorVisible = false
          return
        }
        if (obj.isClearAll) {
          this.items = []
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key
        //this.dataForm.paymentForm = obj.list[0].paymentForm;
        const _this = this
        const dataMap = _this.data3Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        _this.sourceBillNoArr = []
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index]
          // 判断data数据中是否有和item.sourceBillId
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置的数据
          if (filter) {
            continue
          }
          _this.sourceBillNoArr.push(item.billNo)
          var itemObj = {}
          itemObj.sourceBillDate = item.billDate
          itemObj.sourceBillNo = item.billNo
          itemObj.sourceBillId = item.id
          if (item.receiptAmountFor == undefined || item.receiptAmountFor == '') {
            itemObj.receivableAmount = getFloat((item.amountFor), 2)
            itemObj.thisReceivableAmount = getFloat((item.amountFor), 2)
          } else {
            itemObj.receivableAmount = getFloat((item.amountFor * 1 - item.receiptAmountFor * 1), 2)
            itemObj.thisReceivableAmount = getFloat((item.amountFor * 1 - item.receiptAmountFor * 1), 2)
          }
          itemObj.sourceObjectKey = obj.sourceObject.key
          itemObj.sourceObjectName = obj.sourceObject.name
          _this.items.push(itemObj)
        }
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',')
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        this.dialogSelectorVisible = false
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true
            } else {
              _this.isFormLoading = true
            }

            var list = []
            for (var i in _this.items) {
              if (_this.items[i].customerCode && _this.items[i].customerCode != '') {
                list.push(_this.items[i])
              }
            }
            _this.dataForm.items = list
            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }
              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                _this.$emit(subFunSuccessName)
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
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (!this.items[i].customerName || this.items[i].customerName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的客户名称未选择，请选择了再提交');
            return false
          }
          if (!this.items[i].bankName || this.items[i].bankName == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的客户银行未选择，请选择了再提交');
            return false
          }
          if (!this.items[i].bankAccount || this.items[i].bankAccount == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的客户银行账号未选择，请选择了再提交');
            return false
          }
          if (!this.items[i].amountFormer || this.items[i].amountFormer == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的退款金额未填写，请填写了再提交');
            return false
          }
          if (!this.items[i].receiveDate || this.items[i].receiveDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的到款日期未填写，请填写了再提交');
            return false
          }
        }
        return true
      }
    }
  }
</script>
