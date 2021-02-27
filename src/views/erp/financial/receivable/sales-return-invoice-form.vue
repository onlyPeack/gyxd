<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增销售退票</span>
        <span v-if="dataForm.id">编辑销售退票</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
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
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                placeholder="请选择日期" :disabled="true">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                <el-select v-model="dataForm.invoiceType" style="width: 100%;" :disabled="true">
                  <el-option v-for="item in invoiceTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="纳税人识别号:" prop="taxpayerNumber" class="el-form-flex">
                <el-input v-model="dataForm.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" placeholder="请输入客户" readonly></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="发票号码:" prop="invoiceNo" class="el-form-flex">
                <el-input v-model="dataForm.invoiceNo" placeholder="请输入发票号码" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                <el-input v-model="dataForm.bankName" placeholder="请输入开户银行" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="银行账号:" prop="bankAccount" class="el-form-flex">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账号" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
           <td >
             <el-form-item label="退票类型:" prop="refundType" class="el-form-flex" style="position:relative">
               <span style="position:absolute;left:15px;top:-9px;z-index:100;font-size:12px;color:red">请谨慎选择退票类型，退货退票不能再次调出数据开票</span>
               <el-select v-model="dataForm.refundType" :disabled="isDisabled">
                  <el-option v-for="item in refundOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
               </el-select>
             </el-form-item>
           </td>
            <td colspan="2">
              <el-form-item label="退票原因:" prop="note" class="el-form-flex">
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
          <!--<el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>-->
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more" v-model="scope.row.skuName"
                      readonly class="readonly-el-input"></el-input>
          </div>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly"
                    class="readonly-el-input"></el-input>
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
      <el-table-column prop="invoiceQty" label="开票数量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.invoiceQty" readonly
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.invoiceQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="退票数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" readonly class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amount" readonly class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.taxRate" size="small" placeholder=" " disabled>
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
          <el-input size="mini" v-model="scope.row.tax" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxPrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.taxAmount" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
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

    <!-- 弹窗底部 -->
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
    <sales-return-invoice-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                                   @submitSelectorSuccess="submitSelectorSuccess"
                                   @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo"
                                   :customerId="dataForm.customerId">
    </sales-return-invoice-selector>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, getBillitem} from '@/api/erp/financial/financialSalesReturnInvoice'

  export default {
    name: 'sales-return-invoice-form',
    components: {
      'sales-return-invoice-selector': () => import('../components/salesReturnInvoiceSelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          invoiceNo: undefined,
          customerId: undefined,
          customerCode: undefined,
          customerName: undefined,
          bankName: undefined,
          bankAccount: undefined,
          taxpayerNumber: undefined,
          invoiceType: '1',
          billAmount: undefined,
          invoiceAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillId: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: [],
          refundType:0
        },
        isDisabled:false,
        refundOptions:[
           {
            label: '退货退票',
            value: 0,
          }, 
          {
            label: '退票重开',
            value: 1,
          }
        ],
        items: [],
        sourceBillNoArr: [],
        rules: {
          sourceBillNo: [
            {
              required: true,
              message: '请选择关联单据',
              trigger: 'blur'
            }
          ],
          // 'refundType': [
          //   {
          //     required: true,
          //     message: '请选择退票类型',
          //     trigger: 'blur'
          //   }
          // ],
        },
        list: null,
        dialogSelectorVisible: false,
        tableElInputNum: 1
      }
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
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
        var total = this.items.length * this.tableElInputNum;

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

        this.$refs['tableElInput' + number].$el.querySelector('input').focus();
        this.$refs['tableElInput' + number].$el.querySelector('input').select();

      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = [response.data.sourceBillNo];
              }
              this.items = response.data.items ? response.data.items : [];
            })
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          date: '',
          taxRate: this.defaultTaxRate
        };
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length;
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(index, row, type, val) {
        if (row.qty && row.qty != '') {
          row.qty = Number(val);
          if (row.qty < 1) {
            this.$message.warning('退票数量不能小于1');
            row.qty = 1;
          } else if (row.qty > row.invoiceQty * 1) {
            this.$message.warning('退票数量不能大于开票数量');
            row.qty = row.invoiceQty * 1;
          }
          this.vueSet(this.items[index], 'qty', row.qty);

          if (row.price && row.price != '') {
            //金额
            row.amount = Number(row.qty * row.price).toFixed(4);
            this.vueSet(this.items[index], 'amount', row.amount);
          } else {
            this.vueSet(this.items[index], 'amount', '0.0000');
            this.vueSet(this.items[index], 'tax', '0.0000');
            this.vueSet(this.items[index], 'taxAmount', '0.0000');
            return;
          }

          //税额
          this.vueSet(this.items[index], 'tax', Number(row.amount * parseInt(row.taxRate) / 100).toFixed(4));
          //含税单价
          this.vueSet(this.items[index], 'taxPrice', Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(4));
          //价税合计
          this.vueSet(this.items[index], 'taxAmount', Number(row.taxPrice * row.qty).toFixed(4));

          this.vueSet(this.items, index, this.items[index]);
        }
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return
          }
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price))
          } else if (column.property === 'invoiceQty') {
            values = data.map(item => Number(item.invoiceQty))
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty))
          } else if (column.property === 'tax') {
            values = data.map(item => Number(item.tax))
          } else if (column.property === 'taxAmount') {
            values = data.map(item => Number(item.taxAmount))
          }

          if (column.property === 'qty' || column.property === 'amount' || column.property === 'invoiceQty'
            || column.property === 'tax' || column.property === 'taxAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
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
            }, 0).toFixed(4);

            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        });

        return sums
      },
      //关联单据选择
      handlePurchaseContractSelector() {
        this.dialogSelectorVisible = true
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = undefined;
        this.dataForm.sourceBillId = undefined;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = []
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;
        this.dataForm.sourceBillId = obj.sourceObject.id;
        const _this = this;

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.dataForm.sourceBillNo = item.billNo;
            _this.dataForm.sourceBillId = item.id;
            _this.sourceBillNoArr = [item.billNo];
            _this.dataForm.invoiceNo = item.invoiceNo;
            _this.dataForm.invoiceType = item.invoiceType;
            _this.dataForm.invoiceAmount = item.invoiceAmount;
            _this.dataForm.customerId = item.customerId;
            _this.dataForm.customerCode = item.customerCode;
            _this.dataForm.customerName = item.customerName;
            _this.dataForm.taxpayerNumber = item.taxpayerNumber;
            _this.dataForm.bankName = item.bankName;
            _this.dataForm.bankAccount = item.bankAccount;
            if(item.kpType == 5) {
              _this.dataForm.refundType = 1
              _this.isDisabled = true
            } else {
               _this.isDisabled = false
            }
            this.handleGetBillItem(item.id, obj);
          }
        }
        this.dialogSelectorVisible = false;
      },
      handleGetBillItem(id, obj) {
        const dataMap = this.data2Map(this.items);
        getBillitem(id).then(response => {
          for (var i in response.data) {
            var item = response.data[i];

            //判断是否包含相同数据
            const filter = dataMap[item.id];
            if (filter) {
              continue;
            }

            var itemObj = {};
            itemObj.skuNo = item.skuNo;
            itemObj.sourceBillId = item.id;
            itemObj.brandId = item.brandId;
            itemObj.brandName = item.brandName;
            itemObj.seriesName = item.seriesName;
            itemObj.goodsId = item.goodsId;
            itemObj.categoryId = item.categoryId;
            itemObj.factoryId = item.factoryId;
            itemObj.itemNo = item.itemNo;
            itemObj.specifications = item.specifications;
            itemObj.unit = item.unit;
            itemObj.price = item.price + '';
            itemObj.skuName = item.skuName;
            itemObj.qty = item.qty + '';
            itemObj.invoiceQty = item.qty + '';
            itemObj.amount = item.amount + '';
            itemObj.taxRate = item.taxRate + '';
            itemObj.tax = item.tax + '';
            itemObj.taxPrice = item.taxPrice + '';
            itemObj.taxAmount = item.taxAmount + '';
            itemObj.sourceObjectKey = obj.sourceObject.key;
            itemObj.sourceObjectName = obj.sourceObject.name;
            this.items.push(itemObj);
          }

          for (var j in this.items) {
            this.vueSet(this.items, j, this.items[j])
          }
        }).catch(() => {
        })
      },
      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
        });
        return map
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

            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的数量必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return
            }
          }
        }
        return true
      }
    }
  }
</script>
