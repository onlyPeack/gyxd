<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增企业结算开票单</span>
        <span v-if="dataForm.id">编辑企业结算开票单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调出公司全称:" prop="outCompanyFullName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.outCompanyFullName" placeholder="请输入调出公司全称"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开票金额:" prop="totalBillingAmt" class="el-form-flex">
                <el-input type="input" v-model="dataForm.totalBillingAmt" placeholder="请输入开票金额"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开票税额:" prop="totalTaxAmt" class="el-form-flex">
                <el-input type="input" v-model="dataForm.totalTaxAmt" placeholder="请输入已开票税额"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司全称:" prop="inCompanyFullName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyFullName" placeholder="请输入调入公司全称"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司税号" prop="inCompanyTax" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyTax" readonly placeholder="请输入调入公司税号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司开户行" prop="inCompanyOpeningBank" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyOpeningBank" readonly
                          placeholder="请输入调入公司开户行"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司账号" prop="inCompanyBankAccountCode" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyBankAccountCode" readonly
                          placeholder="请输入调入公司账号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司开票地址:" prop="billingAddr" class="el-form-flex">
                <el-input type="input" v-model="dataForm.billingAddr" placeholder="请输入调入公司开票地址"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label=" 调入公司开票电话:" prop="billingTel" class="el-form-flex">
                <el-input type="input" v-model="dataForm.billingTel" placeholder="请输入调入公司开票电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item class="el-form-flex"></el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                <el-select v-model="dataForm.invoiceType" style="width: 100%;">
                  <el-option v-for="item in invoiceOption" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发票代码:" prop="invoiceCode" class="el-form-flex">
                <el-input type="input" v-model="dataForm.invoiceCode" placeholder="请输入发票代码"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票号码:" prop="invoiceNumber" class="el-form-flex">
                <el-input type="input" v-model="dataForm.invoiceNumber" placeholder="请输入发票号码"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发票份数:" prop="num" class="el-form-flex">
                <el-input type="input" v-model="dataForm.num" placeholder="请输入发票份数"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发货方式:" prop="deliveryMode" class="el-form-flex">
                <el-select v-model="dataForm.deliveryMode" style="width: 100%;">
                  <el-option v-for="item in goodTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发货物流名称:" prop="deliveryLogisticsName" class="el-form-flex">
                <div @click="handleRepressSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in expressArr" :key="tag.id" closable
                          @close="handleExpressDel">
                    {{tag.deliveryLogisticsName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="寄件单号:" prop="mailingNumber" class="el-form-flex">
                <el-input type="input" v-model="dataForm.mailingNumber" placeholder="请输入寄件单号"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收件人姓名:" prop="receiveUserName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiveUserName" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>

            <td>
              <el-form-item label="收件电话:" prop="receiveTel" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiveTel" placeholder="请输入收件电话"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收件地址:" prop="receiveAddr" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiveAddr" placeholder="请输入收件地址"></el-input>
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
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.goodsName" @change="handleEdit(scope.$index, scope.row , 'goodsName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsCode" label="商品编码" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.goodsCode" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'goodsCode', $event)"></el-input>
          <span>{{scope.row.goodsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="series" label="系列" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.series" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.series}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specModel" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="计量单位" width="100" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly" class="readonly-el-input" ></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlePrice" label="结算单价" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settlePrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.settlePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleAmt" label="结算金额" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settleAmt" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.settleAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unBillingQty" label="未开票数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unBillingQty" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.unBillingQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billingQty" label="本次开票数量" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.billingQty" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.billingQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billingAmt" label="开票金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.billingAmt" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.billingAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税率" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxPrice" label="不含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.noTaxPrice" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.noTaxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxAmt" label="不含税金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.noTaxAmt" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.noTaxAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmt" label="开票税额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmt" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.taxAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationOrderBillNo" label="调拨单号" width="120" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.allocationOrderBillNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.allocationOrderBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="结算单号" width="120" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sourceBillNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
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
    <!-- 结算数据源-->
    <el-dialog title="结算明细" width="60%" :visible.sync="productVisible" :sourceInCompanyCode="dataForm.inCompanyCode" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @submitSelectorSuccess="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!--寄送方式-->
    <el-dialog title="请选择寄送方式" :visible.sync="expressVisible" append-to-body>
      <express-selector @closeExpressDialog="closeExpressDialog" :isSingle="true" ref="express"></express-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpress">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增企业结算开票单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import { addBill, getBill } from '@/api/erp/wms/bill/companySettlementBilling'

  export default {
    name: 'companySettlementBillingForm',
    components: {
      'goods-selector': () => import('@/views/erp/financial/components/companySettleSelector'),
      'express-selector': () => import('../components/expressSelector'),
    },
    props: ['id', 'dialogFormVisible', 'invoiceOption'],
    data() {
      return {
        expressVisible:false,
        expressArr:[],
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
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        productVisible: false,
        companyType: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: undefined,
          totalBillingAmt: undefined,
          totalTaxAmt: undefined,
          outCompanyCode: undefined,
          outCompanyFullName: undefined,
          inCompanyCode: undefined,
          inCompanyFullName: undefined,
          inCompanyTax: undefined,
          inCompanyOpeningBank: undefined,
          inCompanyBankAccountCode: undefined,
          billingAddr: undefined,
          billingTel: undefined,
          invoiceType: undefined,
          invoiceCode: undefined,
          invoiceNumber: undefined,
          num: undefined,
          deliveryMode: undefined,
          deliveryLogisticsCode: undefined,
          deliveryLogisticsName: undefined,
          mailingNumber: undefined,
          receiveUserName: undefined,
          receiveAddr: undefined,
          receiveTel: undefined,
          note: undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          outCompanyFullName: [
            {
              required: true,
              message: '请选择调出公司全称',
              trigger: 'blur'
            }
          ],
          inCompanyFullName: [
            {
              required: true,
              message: '请选择调入公司全称',
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
          invoiceCode: [
            {
              required: true,
              message: '请选择发票代码',
              trigger: 'blur'
            }
          ],
          invoiceNumber: [
            {
              required: true,
              message: '请选择发票号码',
              trigger: 'blur'
            }
          ],
          receiveUserName: [
            {
              required: true,
              message: '请选择收件人姓名',
              trigger: 'blur'
            }
          ],
          receiveTel: [
            {
              required: true,
              message: '请选择收件人电话',
              trigger: 'blur'
            }
          ],
          receiveAddr: [
            {
              required: true,
              message: '请选择收件地址',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        tableElInputNum: 9,
        warehousePositionIndex: undefined
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleSubmitExpress(){
        this.$refs.express.onSubmit()
      },
      handleCancelExpress(){
        this.$refs.express.reset();
        this.expressVisible = false;
      },
      handleExpressDel(){
        this.expressArr = [];
        this.dataForm.deliveryLogisticsCode = undefined;
        this.dataForm.deliveryLogisticsName = undefined;
      },
      closeExpressDialog(list){
        this.expressArr.push({
          deliveryLogisticsCode:list[0].id,
          deliveryLogisticsName:list[0].name
        })
        this.dataForm.deliveryLogisticsCode = list[0].id;
        this.dataForm.deliveryLogisticsName = list[0].name;
        this.expressVisible = false;
      },
      handleRepressSelector(){
        this.expressVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 334
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

              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-')
          this.dataForm.billDate = date
          this.dataForm.deliverDate = date
          this.dataForm.salerId = this.$store.state.user.id
          this.dataForm.salerName = this.$store.state.user.name
          this.dataForm.salerCode = this.$store.state.user.code
          this.handleValueAdd()
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-')
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
          deliverDate: deliverDate
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

        }
      },
      //数据选择
      handleProductShow() {
        this.productVisible = true
      },
      handleCloseProduct() {
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.onSubmit()
      },
      closeGoodsDialog(list) {
        //console.log(list);
        this.selectedProducts = list.list
        const _this = this
        var totalAmount = 0
        var totalTaxAmount = 0
        const dataMap = _this.data2Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.goodsCode]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.sourceBillId = item.id
          itemObj.sourceBillNo = item.mainDTO.billNo
          itemObj.allocationOrderBillNo = item.sourceBillNo
          itemObj.brandName = item.brandName
          itemObj.series = item.series
          itemObj.goodsName = item.goodsName
          itemObj.goodsCode = item.goodsCode
          itemObj.skuNo = item.goodsCode
          itemObj.specModel = item.specModel
          itemObj.itemNo = item.itemNo
          itemObj.unit = item.unit
          itemObj.retailPrice = item.retailPrice
          itemObj.settlePrice = item.settlePrice
          itemObj.settleQty = item.settleQty
          itemObj.billingQty = item.settleQty - item.alreadyBillingQty
          itemObj.unBillingQty = itemObj.billingQty + item.alreadyBillingQty
          itemObj.settleAmt = item.settleAmt
          itemObj.billingAmt = item.settleAmt
          itemObj.tax = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(4) * 1
          itemObj.taxAmt = ((item.settleAmt / (1 + taxRate)) * taxRate).toFixed(4)
          itemObj.noTaxAmt = (item.settleAmt / (1 + taxRate)).toFixed(4)
          itemObj.noTaxPrice = (item.settlePrice / (1 + taxRate)).toFixed(4)
          totalAmount = totalAmount + item.settleAmt
          totalTaxAmount = totalTaxAmount + ((item.settleAmt / (1 + taxRate)) * taxRate)
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
        var each = list.list[0]
        this.dataForm.outCompanyCode = each.mainDTO.outCompanyCode
        this.dataForm.outCompanyFullName = each.mainDTO.outCompanyFullName
        this.dataForm.inCompanyCode = each.mainDTO.inCompanyCode//调入公司全称
        this.dataForm.inCompanyFullName = each.mainDTO.inCompanyFullName//调入公司全称
        this.dataForm.inCompanyOpeningBank = each.mainDTO.inCompanyOpeningBank//调入公司开户行
        this.dataForm.inCompanyBankAccountCode = each.mainDTO.inCompanyBankAccountCode//调入公司账号
        this.dataForm.inCompanyTax = each.companyTax//调入公司税号
        this.dataForm.billingAddr = each.invoiceAddr//调入公司开票地址
        this.dataForm.billingTel = each.invoiceTel//调入公司开票电话
        this.dataForm.totalBillingAmt = totalAmount.toFixed(4)//开票金额
        this.dataForm.totalTaxAmt = totalTaxAmount.toFixed(4)//开票税额
      },
      data2Map(data) {
        let map = {}
        data.forEach(function(item, index) {
          item.index = index
          map[item.goodsCode] = item
        })
        return map
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['transferPrice', 'settlePrice','settleQty','unBillingQty','billingQty','billingAmt', 'settleDiscount', 'settleAmt', 'transferAmt','noTaxAmt','taxAmt'])
      },

      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].goodsCode && this.items[i].goodsCode != '') {
            if (!this.items[i].goodsName || this.items[i].goodsName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()
              return
            }
            if (!this.items[i].settleQty || this.items[i].settleQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的本次结算数量必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()
              return
            }
          }
        }
        return true
      }
    }
  }
</script>

