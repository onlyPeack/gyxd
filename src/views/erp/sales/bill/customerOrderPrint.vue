<template>
  <div class="contractPrintContainer" :style="{width:containerWidth}">
    <div class="print-box" id="printBox">
      <div class="print-container">
        <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
        <div class="print-title">客户订货单</div>
        <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
        <div class="print-hr"></div>
        <table class="formTable">
          <tr>
            <td>
              <span class="label">订货单位:</span>{{dataForm.customerName}}
            </td>
            <td>
              <span class="label">供货单位:</span>{{dataForm.companyName}}
            </td>
          </tr>
          <tr>
            <td width="50%">
              <span class="label">单据日期:</span>{{dataForm.billDate}}
            </td>
            <td width="50%">
              <span class="label">业务员:</span>{{dataForm.salerName}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">交货日期:</span>{{dataForm.deliverDate}}
            </td>
            <td>
              <span class="label">关联合同:</span>{{dataForm.sourceBillNo}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">联系人:</span>{{dataForm.linkPerson}}
            </td>
            <td>
              <span class="label">联系电话:</span>{{dataForm.linkPhone}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">收货地址:</span>{{dataForm.linkAddress}}
            </td>
            <td>
              <div v-for="item in currencyOptions">
                <span v-if="dataForm.currencyId==item.value"><span class="label">币别:</span>{{item.label}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div v-for="item in receiptConditionOptions">
                <span v-if="dataForm.receiptCondition==item.value"><span class="label">收款条件:</span>{{item.label}}</span>
              </div>
            </td>
            <td>
              <div v-for="item in accountMethodOptions">
                <span v-if="dataForm.accountMethod==item.value"><span class="label">结算方式:</span>{{item.label}}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">公司收款行:</span>{{dataForm.receiptBank}}
            </td>
            <td>
              <span class="label">变更次数:</span>{{dataForm.changeCount}}
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <span class="label">备注:</span>{{dataForm.note}}
            </td>
          </tr>

        </table>
        <table class="formTable itemsTable">
          <tr>
            <td></td>
            <td>商品编码</td>
            <td>商品名称</td>
            <td>数量</td>
            <td>发货数量</td>
            <td>单价</td>
            <td>金额</td>
            <td>税率</td>
            <td>税额</td>
            <td>含税单价</td>
            <td>价税合计</td>
            <td>交货日期</td>
            <td>单位</td>
            <td>备注</td>
          </tr>
          <tr v-for="(scope,index) in items">
            <td>{{index+1}}</td>
            <td>{{scope.skuNo}}</td>
            <td>{{scope.skuName}}</td>
            <td align="right">{{scope.qty}}</td>
            <td align="right">{{scope.deliverQty}}</td>
            <td align="right">{{scope.price}}</td>
            <td align="right">{{scope.amount}}</td>
            <td align="center">{{scope.taxRate}}%</td>
            <td align="right">{{scope.tax}}</td>
            <td align="right">{{scope.taxPrice}}</td>
            <td align="right">{{scope.taxAmount}}</td>
            <td align="center">{{scope.deliverDate}}</td>
            <td align="center">{{scope.unit}}</td>
            <td>{{scope.note}}</td>
          </tr>
          <tr>
            <td>合计</td>
            <td colspan="2"></td>
            <td align="right">{{qtyTotal}}</td>
            <td align="right">{{deliverQtyTotal}}</td>
            <td></td>
            <td align="right">{{amountTotal}}</td>
            <td></td>
            <td align="right">{{taxTotal}}</td>
            <td></td>
            <td align="right">{{taxAmountTotal}}</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="14">
              制单人：{{dataForm.crtUserName}}
              <span style="float: right">制单时间：{{dataForm.crtTime}}</span>
            </td>
          </tr>
        </table>
      </div>
      <div v-html="styleText"></div>
    </div>

    <div class="footer-container">
      <el-radio v-model="isPortrait" label="1" @change="handleRadioChange">纵向</el-radio>
      <el-radio v-model="isPortrait" label="0" @change="handleRadioChange">横向</el-radio>
      <el-checkbox v-model="hideHeader">隐藏页头</el-checkbox>
      <el-button v-print="'#printBox'" type="primary">打印</el-button>
    </div>
  </div>

</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/sales/bill/salesOrder';
  import "@/styles/print.scss";
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: "salesOrderPrint",
    data() {
      return {
        containerWidth: '70%',
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          deliverDate: undefined,
          linkPerson: undefined,
          linkPhone: undefined,
          linkAddress: undefined,
          receiptBank: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          currencyId: '1',
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          receiptCondition: '1',
          accountMethod: '1',
          companyName: undefined,
          companyId: undefined,
          changeCount: undefined,
          items: []
        },
        accountMethodOptions: [],
        receiptConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
        items: [],
        qtyTotal: 0,
        amountTotal: 0,
        taxTotal: 0,
        taxAmountTotal: 0,
        deliverQtyTotal: 0,
        isPortrait: '1',
        hideHeader: false,
        styleText: '<style type="text/css" media="print">\n' + '  @page { size: portrait; }\n' + '</style>'
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        getBill(this.$route.query.id)
          .then(response => {
            this.dataForm = response.data;
            this.items = response.data.items;
            this.getTotal();
          });
        pageAll().then(res=>{
          this.accountMethodOptions = res.data
        })
      },
      handleRadioChange() {
        if (this.isPortrait == '1') {
          this.containerWidth = '70%';
          this.styleText = '<style type="text/css" media="print">\ n' + '  @page { size: portrait; }\n' + '</style>';
        } else {
          this.containerWidth = '90%';
          this.styleText = '<style type="text/css" media="print">\n' + '  @page { size: landscape; }\n' + '</style>';
        }
      },
      getTotal() {
        var qtyTotal = 0;
        var amountTotal = 0;
        var taxTotal = 0;
        var taxAmountTotal = 0;
        var deliverQtyTotal = 0;
        for (var i in this.items) {
          if (!isNaN(this.items[i].amount)) {
            amountTotal = this.items[i].amount * 1 + amountTotal;
          }
          if (!isNaN(this.items[i].qty)) {
            qtyTotal = this.items[i].qty * 1 + qtyTotal;
          }
          if (!isNaN(this.items[i].tax)) {
            taxTotal = this.items[i].tax * 1 + taxTotal;
          }
          if (!isNaN(this.items[i].taxAmount)) {
            taxAmountTotal = this.items[i].taxAmount * 1 + taxAmountTotal;
          }
          if (!isNaN(this.items[i].deliverQty)) {
            deliverQtyTotal = this.items[i].deliverQty * 1 + deliverQtyTotal;
          }
        }
        this.qtyTotal = getFloat(qtyTotal, 2);
        this.amountTotal = getFloat(amountTotal, 2);
        this.taxTotal = getFloat(taxTotal, 2);
        this.taxAmountTotal = getFloat(taxAmountTotal, 2);
        this.deliverQtyTotal = getFloat(deliverQtyTotal, 2);
      }
    }
  }
</script>
