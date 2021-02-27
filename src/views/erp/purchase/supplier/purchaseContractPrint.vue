<template>
  <div class="contractPrintContainer" :style="{width:containerWidth}">
    <div class="print-box" id="printBox">
      <div class="print-container">
        <div class="company-name" v-show="!hideHeader">{{dataForm.companyName}}</div>
        <div class="print-title">采购合同</div>
        <div class="print-title" style="text-align: right;" v-if="dataForm.billNo">{{dataForm.billNo}}</div>
        <div class="print-hr"></div>
        <table class="formTable">
          <tr>
            <td colspan="2">
              <span class="label">合同编号:</span>{{dataForm.billNo}}
            </td>
          </tr>
          <tr>
            <td width="50%">
              <span class="label">合同名称:</span>{{dataForm.contractName}}
            </td>
            <td width="50%">
              <span class="label">签约日期:</span>{{dataForm.contractDate}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">供应商:</span>{{dataForm.supplierName}}
            </td>
            <td>
              <span class="label">采购员:</span>{{dataForm.purchaserName}}
            </td>
          </tr>
          <tr>
            <td>
              <div v-for="item in currencyOptions">
                <span v-if="dataForm.currencyId==item.value"><span class="label">币别:</span>{{item.label}}</span>
              </div>
            </td>
            <td>
              <span class="label">合同金额:</span>{{dataForm.contractAmount}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="label">生效日期:</span>{{dataForm.effectiveDate}}
            </td>
            <td>
              <span class="label">到期日期:</span>{{dataForm.disabledDate}}
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
            <td>品牌</td>
            <td>系列</td>
            <td>规格型号</td>
            <td>订货号</td>
            <td>数量</td>
            <td>单价</td>
            <td>金额</td>
            <td>税率</td>
            <td>税额</td>
            <td>含税单价</td>
            <td>价税合计</td>
            <td>单位</td>
            <td>备注</td>
          </tr>
          <tr v-for="(scope,index) in items">
            <td>{{index+1}}</td>
            <td>{{scope.skuNo}}</td>
            <td>{{scope.skuName}}</td>
            <td>{{scope.brandName}}</td>
            <td>{{scope.seriesName}}</td>
            <td>{{scope.specifications}}</td>
            <td>{{scope.itemNo}}</td>
            <td align="right">{{scope.qty}}</td>
            <td align="right">{{scope.price}}</td>
            <td align="right">{{scope.amount}}</td>
            <td align="center">{{scope.taxRate}}%</td>
            <td align="right">{{scope.tax}}</td>
            <td align="right">{{scope.taxPrice}}</td>
            <td align="right">{{scope.taxAmount}}</td>
            <td align="center">{{scope.unit}}</td>
            <td>{{scope.note}}</td>
          </tr>
          <tr>
            <td>合计</td>
            <td colspan="3"></td>
            <td align="right">{{qtyTotal}}</td>
            <td></td>
            <td align="right">{{amountTotal}}</td>
            <td></td>
            <td align="right">{{taxTotal}}</td>
            <td></td>
            <td align="right">{{taxAmountTotal}}</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td colspan="13">
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseContract';
  import "@/styles/print.scss";

  export default {
    name: "purchaseContractPrint",
    data() {
      return {
        containerWidth: '70%',
        dataForm: {
          id: undefined,
          billNo: undefined,
          contractName: undefined,
          contractDate: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          contractAmount: undefined,
          currencyId: '1',
          note: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        qtyTotal: 0,
        amountTotal: 0,
        taxTotal: 0,
        taxAmountTotal: 0,
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
        }
        this.qtyTotal = getFloat(qtyTotal, 2);
        this.amountTotal = getFloat(amountTotal, 2);
        this.taxTotal = getFloat(taxTotal, 2);
        this.taxAmountTotal = getFloat(taxAmountTotal, 2);
      }
    }
  }
</script>
