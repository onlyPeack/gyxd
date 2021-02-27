<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增企业结算单</span>
        <span v-if="dataForm.id">编辑企业结算单</span>
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
            <td></td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调出公司全称:" prop="outCompanyFullName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.outCompanyFullName" readonly="readonly"
                          placeholder="请输入调出公司全称"></el-input>
              </el-form-item>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调出公司开户行:" prop="outCompanyOpeningBank" class="el-form-flex">
                <el-input type="input" v-model="dataForm.outCompanyOpeningBank" readonly="readonly"
                          placeholder="请输入调出公司开户行"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调出公司银行账户:" prop="outCompanyBankAccount" class="el-form-flex">
                <el-input type="input" v-model="dataForm.outCompanyBankAccount" readonly="readonly"
                          placeholder="请输入调出公司银行账户"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司全称:" prop="inCompanyFullName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyFullName" readonly="readonly"
                          placeholder="请输入调入公司全称"></el-input>
              </el-form-item>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司开户行" prop="inCompanyOpeningBank" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyOpeningBank" readonly="readonly"
                          placeholder="请输入调入公司开户行"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司银行账号" prop="inCompanyBankAccountCode" class="el-form-flex">
                <el-input type="input" v-model="dataForm.inCompanyBankAccountCode" readonly="readonly"
                          placeholder="请输入调入公司银行账号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td colspan="2">
              <el-form-item label="结算方式" prop="settleType" class="el-form-flex">
              <el-select v-model="dataForm.settleType" @click="settleTypeChange">
                <el-option value="1" label="网银结算"></el-option>
                <el-option value="2" label="承兑结算"></el-option>
              </el-select>
                </el-form-item>
            </td>
          </tr> -->
          <tr>
            <!-- <td>
              <el-form-item label="承兑代码:" prop="acceptCode" class="el-form-flex">
                <div  @click="acceptCodeChange">
                  <el-input type="input" v-model="dataForm.acceptCode" placeholder="请输入承兑代码" readonly="readonly"></el-input>
                </div>
              </el-form-item>
            </td> -->
            <td>
              <el-form-item label="承兑金额:" prop="acceptSettleAmt" class="el-form-flex">
                <el-input type="input" v-model="dataForm.acceptSettleAmt" @change="handleAccetpChange"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr >
            <td>
              <el-form-item label="网银结算金额:" prop="onlineSettleAmt" class="el-form-flex">
                <el-input type="input" v-model="dataForm.onlineSettleAmt" readonly="readonly"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="本次结算总额" prop="totalSettleAmt" class="el-form-flex">
                <el-input type="input" v-model="dataForm.totalSettleAmt" readonly="readonly"></el-input>
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
          <div @click.stop="handlePlatformAllocationShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.goodsName" @change="handleEdit(scope.$index, scope.row , 'goodsName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="调拨单号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.sourceBillNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.sourceBillNo}}</span>
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
      <el-table-column prop="retailPrice" label="面价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span style="text-align: right">{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="平台调拨价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlePrice" label="结算单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settlePrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.settlePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferAmt" label="调拨金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferAmt" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.transferAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferQty" label="调拨数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.transferQty" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.transferQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unSettleQty" label="未结算数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unSettleQty" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.unSettleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleQty" label="本次结算数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settleQty" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.settleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleAmt" label=" 本次结算金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settleAmt" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.settleAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleDiscount" label="结算折扣" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.settleDiscount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'settleDiscount', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"
                    :readonly="scope.row.sourceBillId?true:false"
                    :class="scope.row.sourceBillId?'readonly-el-input':''"
                    @input="handleInputFun($event, scope.row, 'settleDiscount')"></el-input>
          <span>{{scope.row.settleDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="备注" width="300">
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
    <!-- 平台调拨单数据-->
    <el-dialog title="调拨数据" width="60%" :visible.sync="platformAllocationVisible" append-to-body class="goodsDialog">
      <platform-allocation-selector ref="platformAllocationSelector" :isSingle="false"
                                    @closeGoodsDialog="closePlatformAllocationDialog"
                                    @submitSelectorSuccess="submitSelectorSuccess"></platform-allocation-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClosePlatformAllocation">取 消</el-button>
        <el-button type="primary" @click="handleSubmitPlatformAllocation">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增销售出库弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
    <el-dialog title="请选择承兑代码" :visible.sync="isAccept" append-to-body>
      <accept-code-selector @closeAcceptDialog="closeAcceptDialog"
                                   :isSelect="isSelect" :isSingle="true"
                                   ref="accept"></accept-code-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAccept">取 消</el-button>
        <el-button type="primary" @click="handleSubmitAccept">确 定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>

<script>
  import { addBill, getBill } from '@/api/erp/wms/bill/companySettlement'

  export default {
    name: 'companySettlementForm',
    components: {
      'platform-allocation-selector': () => import('@/views/erp/financial/components/platformAllocationSelector'),
      'accept-code-selector': () => import('../components/acceptCodeSelector'),

    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        isSelect: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        platformAllocationVisible: false,
        companyType: false,
        dataForm: {
          settleType: '1',
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: undefined,
          outCompanyCode: undefined,
          outCompanyFullName: undefined,
          outCompanyOpeningBank: undefined,
          outCompanyBankAccount: undefined,
          inCompanyCode: undefined,
          inCompanyFullName: undefined,
          inCompanyOpeningBank: undefined,
          inCompanyBankAccountCode: undefined,
          totalSettleAmt: undefined,
          acceptCode: undefined,
          acceptSettleAmt: 0,
          onlineSettleAmt: undefined,
          alreadyBillingAmt: undefined,
          remarks: undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        selectedPlatformAllocation: [],
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
          ]
        },
        isAccept: false,
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        skuNo: undefined,
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
    watch:{
      items:function () {
        this.handleAccetpChange()
      }
    },
    methods: {
      handleAccetpChange() {
          this.dataForm.onlineSettleAmt = (Number(this.dataForm.totalSettleAmt)||0 - Number(this.dataForm.acceptSettleAmt)||0).toFixed(4)
      },
      handleCancelAccept() {
        this.$refs.accept.reset()
        this.isAccept = false
      },
      handleSubmitAccept() {
        this.$refs.accept.onSubmit();
      },
      closeAcceptDialog(list) {
        if(list.length>0){
          this.dataForm.acceptCode = list[0].draftNo;
          this.dataForm.acceptSettleAmt = list[0].amt;
        }
        this.isAccept = false;
      },
      acceptCodeChange(){
        this.isAccept = true;
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
        const d = {}
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
        let price = 0;
        if(this.items.length>0){
          for(let i in this.items){
            if(this.items[i].settleAmt && this.items[i].settleAmt != undefined){
              price = Number(price) + this.items[i].settleAmt;
            }
          }
          this.dataForm.totalSettleAmt = price == 0 ? undefined:price;
        }else{
          this.dataForm.totalSettleAmt = undefined;
        }
        // this.settleTypeChange();
      },
      handleEdit(index, row, type, val) {
        if (row.qty && row.qty != '') {
        }
      },
      //平台调拨单选择
      handlePlatformAllocationShow() {
        this.platformAllocationVisible = true
      },
      handleClosePlatformAllocation() {
        this.platformAllocationVisible = false
        this.selectedPlatformAllocation = []
        this.$refs.platformAllocationSelector.reset()
      },
      handleSubmitPlatformAllocation() {
        this.$refs.platformAllocationSelector.onSubmit()
      },
      closePlatformAllocationDialog() {
        this.platformAllocationVisible = false
        this.selectedPlatformAllocation = []
        this.$refs.platformAllocationSelector.reset()
      },
      submitSelectorSuccess(list) {
        if (list.isClearAll) {
          this.items = []
        }
        this.selectedPlatformAllocation = list.list
        const _this = this
        var totalAmount = 0
        const dataMap = _this.data2Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in this.selectedPlatformAllocation) {
          var item = this.selectedPlatformAllocation[index]
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.goodsCode]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.sourceBillId = item.id
          itemObj.sourceBillNo = item.mainDTO.transOrderNo
          itemObj.goodsCode = item.goodsCode
          itemObj.brandName = item.brandName
          itemObj.series = item.series
          itemObj.specModel = item.specModel
          itemObj.itemNo = item.itemNo
          itemObj.skuNo = item.goodsCode
          itemObj.unit = item.unit
          itemObj.retailPrice = item.retailPrice
          itemObj.goodsName = item.goodsName
          itemObj.transferQty = item.transferQty
          itemObj.settleQty = item.transferQty - item.alreadySettleQty
          itemObj.unSettleQty = item.transferQty - item.alreadySettleQty
          itemObj.transferPrice = item.transferPrice
          itemObj.settlePrice = item.transferPrice
          itemObj.transferAmt = item.transferAmt
          itemObj.settleAmt = item.transferAmt
          itemObj.settleDiscount = 1
          itemObj.stockType = item.stockType
          totalAmount = totalAmount + item.transferAmt
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        this.platformAllocationVisible = false
        this.selectedPlatformAllocation = []
        this.$refs.platformAllocationSelector.reset()

        var each = list.list[0]
        this.dataForm.outCompanyCode = each.orgCodeOut
        this.dataForm.outCompanyFullName = each.orgNameOut
        this.dataForm.outCompanyOpeningBank = each.companyOpeningBankOut
        this.dataForm.outCompanyBankAccount = each.companyBankAccountCodeOut
        this.dataForm.inCompanyCode = each.orgCodeIn
        this.dataForm.inCompanyFullName = each.orgNameIn
        this.dataForm.inCompanyOpeningBank = each.companyOpeningBankIn
        this.dataForm.inCompanyBankAccountCode = each.companyBankAccountCodeIn
        this.dataForm.onlineSettleAmt = (Number(totalAmount.toFixed(4))-Number(this.dataForm.acceptSettleAmt)).toFixed(4);
        this.dataForm.totalSettleAmt = Number(totalAmount).toFixed(4)
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
        return this.getSummariesMethod(param, ['retailPrice', 'unSettleQty', 'settleQty', 'transferPrice', 'settlePrice', 'settleDiscount', 'settleAmt', 'transferAmt'])
      },
      //关联单据选择
      handleCompanySelector(val) {
        if (val) {
          this.companyType = val
        }
        this.dialogSelectorVisible = true
      },
      handleCompanyDel(index, type) {
        if (type) {
          // this.sourceBillNoArr.splice(index, 1)
          // this.dataForm.sourceBillNo = undefined
        } else {

        }
      },
      handleSubmit() {
        if(Number(this.dataForm.onlineSettleAmt) < 0){
          this.vueMessage('warning','网银结算金额不能为负数!');
          return
        }
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
            if (!this.items[i].unSettleQty || this.items[i].unSettleQty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的未结算数量必填项，请填写了再提交')
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

