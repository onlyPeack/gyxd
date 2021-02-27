<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增销售发票</span>
        <span v-if="dataForm.id">编辑销售发票</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click="handlePurchaseContractSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag.billNo"
                          @close="handleSourceBillNoDel">
                    {{tag}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;" @click="handleCustomerSelector">
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
          </tr>
          <tr>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                <el-select v-model="dataForm.invoiceType" style="width: 100%;">
                  <el-option v-for="item in invoiceTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="开票类型:" prop="kpType" class="el-form-flex">
                <el-select v-model="dataForm.kpType" style="width: 100%;">
                  <el-option v-for="item in kpOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开票地址:" prop="kpAddress" class="el-form-flex">
                <el-input v-model="dataForm.kpAddress" placeholder="请输入开票地址"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开票电话:" prop="kpTel" class="el-form-flex">
                <el-input v-model="dataForm.kpTel" placeholder="请输入开票电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收票人:" prop="spMan" class="el-form-flex">
                <el-input v-model="dataForm.spMan" placeholder="请输入收票人"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收票电话:" prop="spTel" class="el-form-flex">
                <el-input v-model="dataForm.spTel" placeholder="请输入收票电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收票地址:" prop="spAddress" class="el-form-flex">
                <el-input v-model="dataForm.spAddress" placeholder="收票地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="寄票类型:" prop="sendInvoiceType" class="el-form-flex">
                <el-select v-model="dataForm.sendInvoiceType" style="width: 100%;">
                  <el-option v-for="item in goodTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="寄送方式:" prop="expressName" class="el-form-flex">
                <div @click="handleRepressSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in expressArr" :key="tag.id" closable v-model="dataForm.expressName"
                          @close="handleExpressDel">
                    {{tag.expressName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="纳税人识别号:" prop="taxpayerNumber" class="el-form-flex">
                <el-input v-model="dataForm.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                <el-input v-model="dataForm.bankName" placeholder="请输入开户银行"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="银行账号:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账号"></el-input>
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
      <el-table-column prop="sourceBillNo" label="订单号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sourceBillNo" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'sourceBillNo', $event)"></el-input>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div  style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName" @change="handleEdit(scope.$index, scope.row , 'skuName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="invoicableQty" label="可开票数量" align="right" width="180" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.invoicableQty" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.invoicableQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    @input="handleInputFun($event, scope.row, 'qty')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'price', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    @input="handleInputFun($event, scope.row, 'price')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'amount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
                    @input="handleInputFun($event, scope.row, 'amount')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.taxRate" size="small" placeholder=" "
                     @change="handleEdit(scope.$index, scope.row , 'taxRate', $event)"
                     @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+5)"
                     :ref="'tableElInput'+(scope.$index*tableElInputNum+5)"
                     :disabled="scope.row.sourceBillId?true:false"
                     :class="scope.row.sourceBillId?'readonly-el-input':''">
            <el-option
              v-for="item in taxRateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span>{{scope.row.taxRate}}</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly" class="readonly-el-input right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'tax', $event)"></el-input>
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
                    @input="handleInputFun($event, scope.row, 'taxPrice')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'taxAmount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+7)"
                    @input="handleInputFun($event, scope.row, 'taxAmount')"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+7)"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'unit', $event)"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300" >
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
    <!--寄送方式-->
    <el-dialog title="请选择寄送方式" :visible.sync="expressVisible" append-to-body>
      <express-selector @closeExpressDialog="closeExpressDialog" :isSingle="true" ref="express"></express-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpress">确 定</el-button>
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

    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增采购订单弹窗底部 -->
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
    <sales-invoice-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="submitSelectorSuccess"
                            :kpType="dataForm.kpType"
                            :refundType="1"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                            :customerId="dataForm.customerId">
    </sales-invoice-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/financial/financialSalesInvoice'
  import {getObj} from '@/api/erp/crm/customer/index'
  import {
    page,
  } from '@/api/erp/wms/config/Logistics';

  export default {
    name: 'sales-invoice-form',
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'sales-invoice-selector': () => import('../components/salesInvoiceSelector'),
      'express-selector': () => import('../components/expressSelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        expressArr:[],
        expressVisible:false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          expressId : undefined,
          expressName : undefined,
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          invoiceNo: undefined,
          customerId: undefined,
          customerName: undefined,
          bankName: undefined,
          bankAccount: undefined,
          taxpayerNumber: undefined,
          invoiceType: '1',
          kpType:3,
          billAmount: undefined,
          invoiceAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillId: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: [],
          kpAddress: undefined,
          kpTel: undefined,
          spAddress: undefined,
          spTel: undefined,
          spMan: undefined,
          sendInvoiceType: undefined,
        },
        items: [],
        customerArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        customerVisible: false,
        productVisible: false,
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
        kpOptions:[
           {
            label: '普通开票',
            value: 3,
          }, {
            label: '未出库先开票',
            value: 5,
          }
        ],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择开票日期',
              trigger: 'blur'
            }
          ],
          invoiceType: [
            {
              required: true,
              message: '请选择发票类型',
              trigger: 'blur'
            }
          ],
          kpType: [
            {
              required: true,
              message: '请选择开票类型',
              trigger: 'blur'
            }
          ],
          kpTel: [
            {
              required: true,
              message: '请输入开票电话',
              trigger: 'blur'
            }
          ],
          kpAddress: [
            {
              required: true,
              message: '请输入开票地址',
              trigger: 'blur'
            }
          ],
          spTel: [
            {
              required: true,
              message: '请输入收票电话',
              trigger: 'blur'
            }
          ],
          spAddress: [
            {
              required: true,
              message: '请输入收票地址',
              trigger: 'blur'
            }
          ],
          spMan: [
            {
              required: true,
              message: '请输入收票人',
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
          expressName:[
            {
              required: true,
              message: '请选择寄送方式',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 7
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
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number)

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number)

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number)

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number)

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number)

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum

        if (type == 'enter' && number + 1 <= total) {
          number++
        } else if (type == 'left' && number - 1 > 0) {
          number--
        } else if (type == 'right' && number + 1 <= total) {
          number++
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus()
        this.$refs['tableElInput' + number].$el.querySelector('input').select()

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
          date: '',
          taxRate: this.defaultTaxRate
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
      handleEdit(index, row, type, val) {

        if (row.qty && row.qty != '') {
          if (type == 'qty' || type == 'price' || type == 'taxRate') {
            if (type == 'qty' && row.invoicableQty && row.qty * 1 > row.invoicableQty) {
              this.$message.warning('数量不能大于可开票数量[' + row.invoicableQty + ']');
              row.qty = row.invoicableQty;
            }
            if (row.price && row.price != '') {
              //金额
              row.amount = Number(row.qty * row.price).toFixed(4)
              this.vueSet(this.items[index], 'amount', row.amount)
            } else {
              this.vueSet(this.items[index], 'amount', '0.0000')
              this.vueSet(this.items[index], 'tax', '0.0000')
              this.vueSet(this.items[index], 'taxAmount', '0.0000')
              return
            }
          } else if (type == 'amount') {
            //单价
            this.vueSet(this.items[index], 'price', Number(row.amount / row.qty).toFixed(4))
          } else if (type == 'taxPrice') {
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(4)
            this.vueSet(this.items[index], 'price', row.price)
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(4))
          } else if (type == 'taxAmount') {
            //含税单价
            row.taxPrice = Number(row.taxAmount / row.qty).toFixed(4)
            //this.vueSet(this.items[index], 'taxPrice',row.taxPrice);
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(4)
            this.vueSet(this.items[index], 'price', row.price)
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(4))
          }
          //税额
          this.vueSet(this.items[index], 'tax', Number(row.amount * parseInt(row.taxRate) / 100).toFixed(4))
          //含税单价
          this.vueSet(this.items[index], 'taxPrice', Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(4))
          //价税合计
          this.vueSet(this.items[index], 'taxAmount', Number(row.taxPrice * row.qty).toFixed(4))

          this.vueSet(this.items, index, this.items[index])

        }

      },

      // 客户选择
      handleCustomerSelector() {
        if(this.sourceBillNoArr.length<1){
          this.vueMessage('warning','请先关联单据!');
        }
      },
      handleRepressSelector(){
        this.expressVisible = true;
      },
      handleCancelExpress(){
        this.$refs.express.reset();
        this.expressVisible = false;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1)
        this.dataForm.customerId = undefined
        this.dataForm.customerName = undefined
        this.dataForm.bankAccount = undefined
        this.dataForm.bankName = undefined
        this.dataForm.taxpayerNumber = undefined
        this.$refs.customer.reset()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      handleSubmitExpress(){
        this.$refs.express.onSubmit()
      },
      handleExpressDel(){
        this.expressArr = [];
        this.dataForm.expressId = undefined;
        this.dataForm.expressName = undefined;
      },
      closeExpressDialog(list){
        this.expressArr.push({
          expressId:list[0].id,
          expressName:list[0].name
        })
        this.dataForm.expressId = list[0].id;
        this.dataForm.expressName = list[0].name;
        this.expressVisible = false;
      },
      closeCustomerDialog(list) {
        this.customerArr = list
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerId = list[0].id;
          this.dataForm.bankAccount = list[0].bankAccount;
          this.dataForm.bankName = list[0].bankName;
          this.dataForm.taxpayerNumber = list[0].taxpayerNumber;
          this.dataForm.kpTel = list[0].kpTel;
          this.dataForm.kpAddress = list[0].kpAddress;
          this.dataForm.spAddress = list[0].spAddress;
          this.dataForm.spMan = list[0].spMan;
          this.dataForm.spTel = list[0].spTel;
        }
      },

      //商品选择
      handleProductShow() {
        this.productVisible = true
      },
      handleCloseProduct() {
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit()
      },
      closeGoodsDialog(list) {
        //console.log(list);
        this.selectedProducts = list
        const _this = this
        const dataMap = _this.data2Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index];
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {}
          itemObj.skuNo = item.skuNo
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.skuName = item.goodsName
          itemObj.qty = 1 + ''
          itemObj.amount = item.price + ''
          itemObj.taxRate = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1
          itemObj.tax = (item.price * taxRate).toFixed(4)
          itemObj.taxPrice = (item.price * (1 + taxRate)).toFixed(4)
          itemObj.taxAmount = itemObj.taxPrice
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.productVisible = false
        this.selectedProducts = []

        this.$refs.goodsSelector.reset()
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price))
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty))
          } else if (column.property === 'tax') {
            values = data.map(item => Number(item.tax))
          } else if (column.property === 'taxAmount') {
            values = data.map(item => Number(item.taxAmount))
          } else if (column.property === 'invoicableQty') {
            values = data.map(item => Number(item.invoicableQty))
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'tax' || column.property === 'taxAmount' || column.property === 'invoicableQty') {
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
      handleCancel() {
        this.$emit('handleCancelForm')
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        // if (!this.dataForm.customerName || this.dataForm.customerName == '') {
        //   this.$message.warning('请选择客户')
        //   return
        // }
        if (!this.dataForm.kpType) {
          this.$message.warning('请先选择开票类型!')
        } else {
          this.dialogSelectorVisible = true
        }
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1)
        this.dataForm.sourceBillNo = undefined
        this.dataForm.sourceBillId = undefined
      },
      submitSelectorSuccess(obj) {
        console.log(obj);
        if (obj.isClearAll) {
          this.items = []
        }
        getObj(obj.list[0].mainDTO.customerId).then(res=>{
          console.log(obj.sourceObject);
          this.customerArr = [res.data];
          this.dataForm.customerName = res.data.customerName;
          this.dataForm.customerId = res.data.id;
          this.dataForm.bankAccount = res.data.bankAccount;
          this.dataForm.bankName = res.data.bankName;
          this.dataForm.taxpayerNumber = res.data.taxpayerNumber;
          this.dataForm.kpTel = res.data.kpTel;
          this.dataForm.kpAddress = res.data.kpAddress;
          this.dataForm.spAddress = res.data.spAddress;
          this.dataForm.spMan = res.data.spMan;
          this.dataForm.spTel = res.data.spTel;
        })
        this.dataForm.sourceObjectKey = obj.sourceObject.key
        this.dataForm.sourceBillId = obj.sourceObject.id
        this.dataForm.sourceBillNo = obj.sourceObject.billNo
        const _this = this
        if (obj.sourceObject.key == 'XSHKD') {
          _this.items = []
          _this.handleValueAdd()
          _this.sourceBillNoArr = []
          obj.list.forEach(function (item, index) {
            _this.sourceBillNoArr.push(item.mainDTO.billNo)
          })
          _this.dataForm.sourceBillNo = _this.sourceBillNoArr.join(',')
          _this.dialogSelectorVisible = false
          return
        }
        const dataMap = _this.data3Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.dataForm.sourceBillNo = item.mainDTO.billNo
            _this.dataForm.sourceBillId = item.mainDTO.id
            _this.sourceBillNoArr = [item.mainDTO.billNo]
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {}
          itemObj.sourceBillNo = item.billNo
          itemObj.skuNo = item.skuNo
          itemObj.sourceBillId = item.id
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.skuName = item.skuName
          // 数量  出库数量-退库数量-已开票数量
          itemObj.qty = item.stockOutSaleQty - item.stockReturnQty - item.purchaseInvoiceQty + ''
          // 可开票数量 可开票数量
          itemObj.invoicableQty = item.invoicableQty;
          itemObj.amount = getFloat(Number(item.price * (item.stockOutSaleQty - item.stockReturnQty - item.purchaseInvoiceQty)), 2)
          itemObj.taxRate = item.taxRate + ''
          itemObj.tax = getFloat(Number(item.price * (item.stockOutSaleQty - item.stockReturnQty - item.purchaseInvoiceQty) * item.taxRate / 100), 2)
          itemObj.taxPrice = item.taxPrice + ''
          itemObj.taxAmount = getFloat(Number(item.taxPrice * (item.stockOutSaleQty - item.stockReturnQty - item.purchaseInvoiceQty)), 2)
          itemObj.sourceObjectKey = obj.sourceObject.key
          itemObj.sourceObjectName = obj.sourceObject.name
          _this.items.push(itemObj)
        }
        // 添加一个空行
        _this.handleValueAdd()
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        console.log(this.items);
        this.dialogSelectorVisible = false
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }

        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        for (var i in this.items) {

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].skuName || this.items[i].skuName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()

              return
            }

            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品数量必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select()

              return
            }

            if (!this.items[i].price || this.items[i].price == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品单价必填项，请填写了再提交')

              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select()

              return
            }
          }
        }
        return true
      }
    }
  }
</script>
