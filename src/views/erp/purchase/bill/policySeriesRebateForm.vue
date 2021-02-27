<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增返点系列管理</span>
        <span v-if="dataForm.id">编辑返点系列管理</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>
    <div class="center-container">
      <!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" :disabled="true"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker
                  v-model="dataForm.billDate"
                  valueFormat='yyyy-MM-dd'
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="showSupplierSelector=true">
                  <el-input v-model="dataForm.supplierName" placeholder="请选择供应商">
                    <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
                  </el-input>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="品牌:" prop="brand" class="el-form-flex">
                <div @click="showBrandSelector=true">
                  <el-input v-model="dataForm.brand" placeholder="请选择品牌">
                    <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
                  </el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开始时间:" prop="beginTime" class="el-form-flex">
                <el-date-picker
                  v-model="dataForm.beginTime"
                  valueFormat='yyyy-MM-dd'
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="结束时间:" prop="endTime" class="el-form-flex">
                <el-date-picker
                  v-model="dataForm.endTime"
                  valueFormat='yyyy-MM-dd'
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td :colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入返点系列"></el-input>
              </el-form-item>
            </td>

          </tr>
        </table>
      </el-form>
    </div>
    <el-table :data="dataForm.items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="addAssData"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="deleteAssData(scope.$index)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="standardSeries" label="标准系列" width="180" align="center">
        <template slot-scope="scope">
          <div @click.stop="showAssGoods(scope.$index)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more" v-model="scope.row.standardSeries"></el-input>
          </div>
          <span>{{scope.row.standardSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="companySeries" label="返点系列" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.companySeries" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.companySeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebate" label="返点(0-1)" width="180" align="center" v-slot="{row,$index}">
          <el-input size="mini" v-model="row.rebate" readonly
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{row.rebate}}</span>
      </el-table-column>
      <el-table-column prop="yearRebate" label="年终返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.yearRebate" @input="changeRebate($index)" class="right-el-input"></el-input>
          <span>{{row.yearRebate}}</span>
      </el-table-column>
      <el-table-column prop="monthRebate" label="季月度返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.monthRebate" @input="changeRebate($index)" class="right-el-input"></el-input>
          <span>{{row.monthRebate}}</span>
      </el-table-column>
      <el-table-column prop="salesRebate" label="促销返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.salesRebate" @input="changeRebate($index)" class="right-el-input"></el-input>
          <span>{{row.salesRebate}}</span>
      </el-table-column>
      <el-table-column prop="agreementRebate" label="协议返点" width="180" align="center" v-slot="{row,$index}">
          <el-input size="mini" v-model="row.agreementRebate" readonly
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{row.agreementRebate}}</span>
      </el-table-column>
      <el-table-column prop="agreementYearRebate" label="协议年终返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.agreementYearRebate" @input="changeAgreementRebate($index)" class="right-el-input"></el-input>
          <span>{{row.agreementYearRebate}}</span>
      </el-table-column>
      <el-table-column prop="agreementMonthRebate" label="协议季月度返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.agreementMonthRebate" @input="changeAgreementRebate($index)" class="right-el-input"></el-input>
          <span>{{row.agreementMonthRebate}}</span>
      </el-table-column>
      <el-table-column prop="agreementSalesRebate" label="协议促销返点" width="180" v-slot="{row,$index}" align="center" class-name="red-title">
          <el-input size="mini" v-model="row.agreementSalesRebate" @input="changeAgreementRebate($index)" class="right-el-input"></el-input>
          <span>{{row.agreementSalesRebate}}</span>
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
    <div slot="footer" class="dialog-footer">
<!--      <div v-if="dataForm.billStatus && dataForm.billStatus==1">-->
<!--        <el-button type="primary" style="float: left;">-->
<!--          <router-link target="_blank" :to="{path:'/print/sales-order-print',query:{id:id}}">打 印-->
<!--          </router-link>-->
<!--        </el-button>-->
<!--      </div>-->
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

    <!-- 供应商列表弹窗-->
    <supplier-selector  v-if="showSupplierSelector" :dialogVisible="showSupplierSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></supplier-selector>
    <!--    品牌选择弹窗-->
    <brand-selector v-if="showBrandSelector" :dialogVisible="showBrandSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></brand-selector>
    <!--    品牌返点系列选择弹窗-->
    <policy-brand-series-selector v-if="showPolicyBrandSeriesSelector" :brand="dataForm.brand" :dialogVisible="showPolicyBrandSeriesSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></policy-brand-series-selector>
    <!--    政策资源登记明细选择弹窗-->
    <policy-register-selector v-if="showPolicyRegisterSelector" :dialogVisible="showPolicyRegisterSelector" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></policy-register-selector>

    <policy-channel-type-select v-if="showPolicyChannelTypeSelect" :dialogVisible="showPolicyChannelTypeSelect" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></policy-channel-type-select>
    <!--        从产品库导入对话框-->
    <goods-library-selector v-if="showGoodsLibrarySelector" ref="goodsLibrarySelector" :dialogVisible="showGoodsLibrarySelector"
                            @handleClose="showGoodsLibrarySelector=false"
                            @handleSubmit="handleSubmitPublic"></goods-library-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill,selectPage as page,batchDelBill,tempAddBill,getBill} from '@/api/erp/purchase/bill/policySeriesRebate';

  export default {
    name: 'policySeriesRebateForm',
    components: {
      'supplier-selector': () => import('@/components/ERP/Purchase/supplierSelector'),
      'brandSelector': () => import('@/components/ERP/Purchase/brandSelector'),
      'policyBrandSeriesSelector': () => import('@/components/ERP/Purchase/policyBrandSeriesSelector'),
      'policyRegisterSelector': () => import('@/components/ERP/Purchase/policyRegisterSelector'),
      'policyRegisterForm': () => import('./policyRegisterForm'),
      'policyChannelTypeSelect': () => import('@/components/ERP/Purchase/policyChannelTypeSelect'),
      'goodsLibrarySelector': () => import('@/components/ERP/Purchase/goodsLibrarySelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          items: [{}],
          billDate:new Date().toLocaleDateString().replace(/\//g, '-')
        },
        showSupplierSelector:false,//是否显示供应商选择对话框
        showBrandSelector:false,//是否显示品牌选择对话框
        showPolicyBrandSeriesSelector:false,//是否显示品牌返点系列选择框
        showPolicyRegisterSelector:false,//是否显示政策资源登记单选择框
        accountMethodOptions: [],
        receiptConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
        items: [],
        salerArr: [],
        customerArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        customerVisible: false,
        salerUserVisible: false,
        productVisible: false,
        showPolicyChannelTypeSelect:false,
        showGoodsLibrarySelector:false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择单据日期',
              trigger: 'blur'
            }
          ],
          companyName: [
            {
              required: true,
              message: '请选择供货单位',
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
          salerName: [
            {
              required: true,
              message: '请选择业务员',
              trigger: 'blur'
            }
          ],
          customerName: [
            {
              required: true,
              message: '请选择订货单位',
              trigger: 'blur'
            }
          ],
          beginTime: [
            {
              required: true,
              message: '请选择开始时间',
              trigger: 'blur'
            }
          ],
          endTime: [
            {
              required: true,
              message: '请选择结束时间',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 7,
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
          var height = 375
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
              this.dataForm = response.data;
            });
        }
      },
      handleDeliverDateChange(val) {
        // for (let i in this.items) {
        //   this.vueSet(this.items[i], 'deliverDate', val)
        // }
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
          if (type == 'qty' || type == 'price' || type == 'taxRate') {
            if (row.price && row.price != '') {
              //金额
              row.amount = Number(row.qty * row.price).toFixed(2)
              this.vueSet(this.items[index], 'amount', row.amount)
            } else {
              this.vueSet(this.items[index], 'amount', '0.00')
              this.vueSet(this.items[index], 'tax', '0.00')
              this.vueSet(this.items[index], 'taxAmount', '0.00')
              return
            }
          } else if (type == 'amount') {
            //单价
            this.vueSet(this.items[index], 'price', Number(row.amount / row.qty).toFixed(2))
          } else if (type == 'taxPrice') {
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2)
            this.vueSet(this.items[index], 'price', row.price)
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2))
          } else if (type == 'taxAmount') {
            //含税单价
            row.taxPrice = Number(row.taxAmount / row.qty).toFixed(2)
            //this.vueSet(this.items[index], 'taxPrice',row.taxPrice);
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2)
            this.vueSet(this.items[index], 'price', row.price)
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2))
          }
          //税额
          this.vueSet(this.items[index], 'tax', Number(row.amount * parseInt(row.taxRate) / 100).toFixed(2))
          //含税单价
          this.vueSet(this.items[index], 'taxPrice', Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(2))
          //价税合计
          this.vueSet(this.items[index], 'taxAmount', Number(row.taxPrice * row.qty).toFixed(2))

          this.vueSet(this.items, index, this.items[index])

        }

      },

      // 业务员选择
      handleSalerUserSelector() {
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
        this.dataForm.salerCode = undefined
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
          this.dataForm.salerCode = list[0].salerCode
        }
      },

      // 订货单位选择
      handleCustomerSelector() {
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
        this.customerArr = list
        this.customerVisible = false
        if (list.length > 0) {
          this.dataForm.customerName = list[0].customerName
          this.dataForm.customerId = list[0].id
          this.dataForm.customerCode = list[0].customerCode
          this.dataForm.linkPerson = list[0].linkMan
          this.dataForm.linkPhone = list[0].linkPhone
          this.dataForm.linkAddress = list[0].linkAddress
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
          itemObj.deliverDate = _this.dataForm.deliverDate ? _this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-')
          itemObj.skuNo = item.skuNo
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.price = item.retailPrice + ''
          itemObj.skuName = item.goodsName
          itemObj.qty = 1 + ''
          itemObj.amount = item.retailPrice + ''
          itemObj.taxRate = _this.defaultTaxRate
          var taxRate = (_this.defaultTaxRate * 1 / 100).toFixed(2) * 1
          itemObj.tax = (item.retailPrice * taxRate).toFixed(2)
          itemObj.taxPrice = (item.retailPrice * (1 + taxRate)).toFixed(2)
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
                  this.dataForm.billAmount = getFloat((prev + curr), 2)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.taxBillAmount = getFloat((prev + curr), 2)
                }
                return getFloat((prev + curr), 2)
              } else {
                return prev
              }
            }, 0)

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
      handleSalesContractSelector() {
        this.dialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1)
        this.dataForm.sourceBillNo = undefined
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = []
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key

        const _this = this
        const dataMap = _this.data3Map(_this.items)

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            /*_this.salerArr=item.mainDTO.salerArr;
            _this.dataForm.salerName=item.mainDTO.salerName;
            _this.dataForm.salerId=item.mainDTO.salerId;*/

            _this.customerArr = item.mainDTO.customerArr
            _this.dataForm.customerId = item.mainDTO.customerId
            _this.dataForm.customerName = item.mainDTO.customerName

            _this.dataForm.sourceBillNo = item.mainDTO.billNo
            _this.sourceBillNoArr = [{billNo: item.mainDTO.billNo}]
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {}
          itemObj.deliverDate = _this.dataForm.deliverDate ? _this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-')
          itemObj.skuNo = item.skuNo
          itemObj.sourceBillId = item.id
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.itemNo = item.itemNo
          itemObj.specifications = item.specifications
          itemObj.unit = item.unit
          itemObj.price = item.price + ''
          itemObj.skuName = item.skuName
          itemObj.qty = item.qty + ''
          itemObj.amount = item.amount + ''
          itemObj.taxRate = item.taxRate + ''
          itemObj.tax = item.tax + ''
          itemObj.taxPrice = item.taxPrice + ''
          itemObj.taxAmount = item.taxAmount + ''
          itemObj.sourceObjectKey = obj.sourceObject.key
          itemObj.sourceObjectName = obj.sourceObject.name
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.dialogSelectorVisible = false

      },
      handleSubmit() {
        // if (!this.checkItemFuc()) {
        //   return
        // }
        //this.dataFormOnSubmit(this, addBill, 'submitSuccess')
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            for (let i = 0; i <this.dataForm.items.length ; i++) {
              if(!this.dataForm.items[i].standardSeries||this.dataForm.items[i].standardSeries===''){
                this.$message.warning('请选择第'+(i+1)+'行的标准系列！')
                return false
              }
            }
            addBill(this.dataForm).then(res => {
              if (Number(res.code) === 2000 || Number(res.code) === 200) {
                let ids = {
                  type: 'policySeriesRebateForm',
                  flag: true
                };
                this.$emit('submitSuccess', ids);
              } else {
                if (Number(res.code) === 401) {
                  this.$message.warning('创建政策资源登记单失败,' + res.msg || res.data)
                }
                {
                  this.$message.error('创建政策资源登记单失败,' + res.msg || res.data)
                }
              }
            }, error => this.$message.error('创建政策资源等级单失败,' + error))
          }
        })
      },
      handleTempAddBill() {
        // if (!this.checkItemFuc()) {
        //   return
        // }
        // this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
        tempAddBill(this.dataForm).then(res=>{
          if(Number(res.code)===2000||Number(res.code)===200){
            let ids = {
              type:'policySeriesRebateForm',
              flag:true
            };
            this.$emit('submitSuccess', ids);
          }else{
            if(Number(res.code)===401){
              this.$message.warning('暂存政策资源登记单失败,'+res.msg||res.data)
            }{
              this.$message.error('暂存政策资源登记单失败,'+res.msg||res.data)
            }
          }
        },error=>this.$message.error('暂存政策资源等级单失败,'+error))
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
      },
      /**
       * 关闭赠品选择对话框
       */
      handleClosePublic() {
        this.showSupplierSelector=false
        this.showGoodsLibrarySelector=false
        this.showBrandSelector=false
        this.showPolicyChannelTypeSelect=false
        this.showPolicyBrandSeriesSelector=false
        this.showPolicyRegisterSelector=false
        this.showDialog=false
      },

      /**
       * 从子组件中接收的提交方法
       * @param list
       */
      handleSubmitPublic(list){
        console.log(list);
        if(list.type==='policyChannelType'){
          this.showPolicyChannelTypeSelect=false
          this.$set(this.dataForm,'channelTypeName',list.arr.name)
          this.dataForm.channelTypeId=list.arr.id
          this.$refs['dataForm'].validateField('channelTypeName')
        }else if(list.type==='goodsLibrary'){
          this.showGoodsLibrarySelector=false
          this.dataForm.seriesId=list.arr.seriesId
          this.$set(this.dataForm,'standardSeries',list.arr.seriesName)
          this.$set(this.dataForm,'brand',list.arr.brandName)
          this.$refs['dataForm'].validateField('standardSeries')
          this.$refs['dataForm'].validateField('brand')
        }else if(list.type==='supplierSelector'){
          this.showSupplierSelector=false
          // this.dataForm.supplierName=list.arr.supplierName
          // this.dataForm.supplierCode=list.arr.supplierCode
          this.$set(this.dataForm,'supplierName',list.arr.supplierName)
          this.$set(this.dataForm,'supplierCode',list.arr.supplierCode)
          this.$refs['dataForm'].validateField('supplierName')
        }else if(list.type==='brand'){
          this.showBrandSelector=false
          this.dataForm.brand=list.arr.name
        }else if(list.type==='policyBrandSeries'){
          this.showPolicyBrandSeriesSelector=false
          this.$set(this.dataForm.items,this.clickRow,list.arr)
          //数组去重
          try {
            let hash={}
            this.dataForm.items=this.dataForm.items.reduce(function(item, next) {
              hash[next.standardSeries] ? '' : hash[next.standardSeries] = true && item.push(next);
              return item
            }, [])
          }catch (e) {console.log('标准系列去重发生错误,'+e)}

        }else if(list.type==='policyRegister'){
          this.showPolicyRegisterSelector=false
          console.log(list.arr,'登记单行')
          this.dataForm.companySeries=list.arr.companySeries
          this.dataForm.agreementType=list.arr.agreementType
          this.dataForm.agreementYear=list.arr.agreementYear
          this.dataForm.note=list.arr.note
        }
      },

      /**
       * 放大镜图标点击事件
       * @param index 当前行索引
       */
      showAssGoods(index){
        if(this.isView){
          return false
        }
        this.showPolicyBrandSeriesSelector=true
        this.clickRow=index
      },

      /**
       * 计算返点
       */
      changeRebate(index){
        let sum=0
        sum=this.accAdd(this.accAdd(this.dataForm.items[index].yearRebate||0,this.dataForm.items[index].monthRebate||0),this.dataForm.items[index].salesRebate||0)
        if(Number(sum)>1){
          this.$message.warning('返点不能大于1！')
          return false
        }else{
          this.dataForm.items[index].rebate=sum
        }
      },

      /**
       * 计算协议返点
       */
      changeAgreementRebate(index){
        let sum=0
        sum=this.accAdd(this.accAdd(this.dataForm.items[index].agreementYearRebate||0,this.dataForm.items[index].agreementMonthRebate||0),this.dataForm.items[index].agreementSalesRebate||0)
        if(Number(sum)>1){
          this.$message.warning('返点不能大于1！')
          return false
        }else{
          this.dataForm.items[index].agreementRebate=sum
        }

      },

      /**
       * 删除关联商品行
       * @param index 当前行索引
       */
      deleteAssData(index){
        this.dataForm.items.splice(index,1)
        if(this.dataForm.items.length===0){
          this.dataForm.items=[{}]
        }
      },

      /**
       * 新增关联商品行
       */
      addAssData(){
        this.dataForm.items.push({})
      },
    }
  }
</script>
<style>
  .red-title{
    color: red!important;
  }
</style>

