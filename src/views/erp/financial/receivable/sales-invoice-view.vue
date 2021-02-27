<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>销售发票详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container bill-container">
      <div class="association-creation">
        <el-button type="text" icon="el-icon-download" v-if="dataForm.billNo">
          <a :href="'/api/financial/financial-sales-invoice/downTemplate?billNo='+dataForm.billNo">下载开票模板</a>
        </el-button>
      </div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="发票号码:" prop="invoiceNo" :class="processId && processId!='' && taskType=='now' && isStep ? 'el-form-flex color-form':'el-form-flex'">
                <el-input v-if="processId && processId!='' && taskType=='now' && isStep" v-model="dataForm.invoiceNo" placeholder="请输入发票号码"></el-input>
                <span v-else>{{dataForm.invoiceNo}}</span>
              </el-form-item>
            </td>
            <td width="50%">
                <el-form-item label="发票代码:" prop="invoiceCode" :class="processId && processId!='' && taskType=='now' && isStep ? 'el-form-flex color-form':'el-form-flex'">
                  <el-input v-if="processId && processId!='' && taskType=='now' && isStep" v-model="dataForm.invoiceCode" placeholder="请输入发票代码"></el-input>
                  <span v-else>{{dataForm.invoiceCode}}</span>
                </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="快递单号:" prop="expressNumber" :class="processId && processId!='' && taskType=='now' && isStep ? 'el-form-flex color-form':'el-form-flex'">
                <el-input v-if="processId && processId!='' && taskType=='now'&& isStep" v-model="dataForm.expressNumber" disabled></el-input>
                <span v-else>{{dataForm.expressNumber}}</span>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                <div v-for="item in invoiceTypeOptions">
                  <span v-if="dataForm.invoiceType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开票日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
          </tr>
          <!--<tr>-->
            <!--<td>-->
              <!--<el-form-item label="开票地址:" prop="kpAddress" class="el-form-flex">-->
                <!--<el-input v-model="dataForm.kp_phone" placeholder="请输入开票地址"></el-input>-->
              <!--</el-form-item>-->
            <!--</td>-->
            <!--<td>-->
              <!--<el-form-item label="开票电话:" prop="kpTel" class="el-form-flex">-->
                <!--<el-input v-model="dataForm.kp_address" placeholder="请输入开票电话"></el-input>-->
              <!--</el-form-item>-->
            <!--</td>-->
          <!--</tr>-->
          <tr>
            <td colspan="2">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                {{dataForm.sourceBillNo}}
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
                {{dataForm.bankName}}
              </el-form-item>
            </td>
          </tr>
           <tr>
             <td colspan="2">
              <el-form-item label="开票类型:" prop="kpType" class="el-form-flex">
                <div v-for="(item,index) in kpOptions" :key="index">
                  <span v-if="dataForm.kpType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="开票地址:" prop="kpAddress" class="el-form-flex">
                {{dataForm.kpAddress}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开票电话:" prop="kpTel" class="el-form-flex">
                {{dataForm.kpTel}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收票人:" prop="spMan" class="el-form-flex">
                {{dataForm.spMan}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收票电话:" prop="spTel" class="el-form-flex">
                {{dataForm.spTel}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收票地址:" prop="spAddress" class="el-form-flex">
                {{dataForm.spAddress}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="寄票类型:" prop="invoiceType" class="el-form-flex">
                <div v-for="(item,index) in goodTypeOptions" :key="index">
                  <span v-if="dataForm.sendInvoiceType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="寄送方式:" prop="expressName" class="el-form-flex">
                {{dataForm.expressName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="银行账号:" prop="bankAccount" class="el-form-flex">
                {{dataForm.bankAccount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <div style="display: flex;flex-direction: row;justify-content: flex-end;">
      <el-button type="text" @click="handleExportXML">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        XML导出
      </el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        电子清单导出
      </el-button>
    </div>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="订单号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="100" class-name="col-required" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.taxRate}}%</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" class-name="col-required" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId" @stepClicks="stepClicks"
                  :billNo="dataForm.billNo"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 销售发票弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        <!--<el-button type="primary" @click="handleAuditBill('撤销')">撤 销</el-button>-->
      </div>
      <el-dropdown @click="handleClick">
        <el-button type="primary">
          打印面单<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" style="height: 98px !important;overflow: hidden;text-align: center;">
          <router-link target="_blank" :to="{path:'/print/sales-invoice-print',query:{deliverType:1,billNo:dataForm.billNo,id:dataForm.id}}"><el-dropdown-item style="font-size: 14px !important;line-height: 30px;">&nbsp;&nbsp;&nbsp;&nbsp;顺丰&nbsp;&nbsp;&nbsp;&nbsp;</el-dropdown-item></router-link>
          <router-link target="_blank" :to="{path:'/print/sales-invoice-print',query:{deliverType:2,billNo:dataForm.billNo,id:dataForm.id}}"><el-dropdown-item style="font-size: 14px !important;line-height: 30px;">&nbsp;&nbsp;&nbsp;&nbsp;德邦&nbsp;&nbsp;&nbsp;&nbsp;</el-dropdown-item></router-link>
          <router-link target="_blank" :to="{path:'/print/sales-invoice-print',query:{deliverType:3,billNo:dataForm.billNo,id:dataForm.id}}"><el-dropdown-item style="font-size: 14px !important;line-height: 30px;">&nbsp;&nbsp;&nbsp;&nbsp;韵达&nbsp;&nbsp;&nbsp;&nbsp;</el-dropdown-item></router-link>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/financialSalesInvoice';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "sales-invoice-view",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        downloadLoading: false,
        clientHeight: 500,
        isRejectLoading: false,
        isAgreeLoading: false,
         kpOptions:[
           {
            label: '普通开票',
            value: 3,
          }, {
            label: '未出库先开票',
            value: 5,
          }
        ],
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
        dataForm: {
          invoiceCode: undefined,
          expressNumber: undefined,
          expressId : undefined,
          expressName : undefined,
          sendInvoiceType: undefined,
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
          billAmount: undefined,
          invoiceAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        isStep: false,
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        timer:null
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
      this.timer = setInterval(() => {
        if(localStorage.getItem('mainBillNo')) {
          if(this.processId && this.processId!='' && this.taskType=='now' && this.isStep) {
            this.$set(this.dataForm,'expressNumber',localStorage.getItem('mainBillNo'))
            setTimeout(() => {
              localStorage.removeItem('mainBillNo')
            },500)
          }
        }
      },1000)
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        console.log(this.items);
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.items));
            tHeader = ['订单号', '订货号','商品名称', '规格型号', '数量', '金额', '税率', '税额', '含税单价', '价税合计', '单位', '备注'];
            filterVal = ['sourceBillNo','itemNo', 'skuName', 'specifications', 'qty', 'amount', 'taxRate', 'tax', 'taxPrice', 'taxAmount', 'unit', 'note'];
          excel.export_json_to_excel2(tHeader, list, filterVal, this.dataForm.customerName+'-'+this.dataForm.invoiceNo);
          this.downloadLoading = false;
        })
      },

      handleExportXML(){
        window.open('api/financial/financial-sales-invoice/createxml?id='+this.dataForm.id,'_self')
      },

      handleClick(val){
        console.log(val);
      },
      stepClicks(value){
        console.log('value');
        console.log(value);
        this.isStep = value;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 252;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data;
            this.items = response.data.items;
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
          });
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax));
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount));
          }

          if (column.property === 'qty' || column.property === 'amount'
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
      handleAuditBill(val) {
        if(this.isStep && val=='同意'){
          if(this.dataForm.invoiceNo == undefined || this.dataForm.invoiceNo == ''){
            this.vueMessage('warning','请输入发票号码!');
            return
          }
          if(this.dataForm.invoiceCode == undefined || this.dataForm.invoiceCode == ''){
            this.vueMessage('warning','请输入发票代码!');
            return
          }
          if(this.dataForm.expressNumber == undefined || this.dataForm.expressNumber == ''){
            this.vueMessage('warning','请输入快递单号!');
            return
          }
        }
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
      }
    }
  }
</script>
<style lang="scss">
  .color-form{
    .el-form-item__label{
      color: #F56C6C !important;
    }
  }
</style>

