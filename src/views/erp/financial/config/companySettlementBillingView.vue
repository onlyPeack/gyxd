<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>企业结算开票单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="开票金额:" prop="totalBillingAmt" class="el-form-flex">
                {{dataForm.totalBillingAmt}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开票税额:" prop="totalTaxAmt" class="el-form-flex">
                {{dataForm.totalTaxAmt}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调出公司代码:" prop="outCompanyCode" class="el-form-flex">
                {{dataForm.outCompanyCode}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调出公司全称:" prop="outCompanyFullName" class="el-form-flex">
                {{dataForm.outCompanyFullName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司代码:" prop="inCompanyCode" class="el-form-flex">
                {{dataForm.inCompanyCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司全称:" prop="inCompanyFullName" class="el-form-flex">
                {{dataForm.inCompanyFullName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司税号:" prop="inCompanyTax" class="el-form-flex">
                {{dataForm.inCompanyTax}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司开户行:" prop="inCompanyOpeningBank" class="el-form-flex">
                {{dataForm.inCompanyOpeningBank}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司账号:" prop="inCompanyBankAccountCode" class="el-form-flex">
                {{dataForm.inCompanyBankAccountCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司开票电话:" prop="billingTel" class="el-form-flex">
                 <el-input type="input" v-model="dataForm.billingTel" placeholder="请输入调入公司开票电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="调入公司开票地址:" prop="billingAddr" class="el-form-flex">
                <el-input type="input" v-model="dataForm.billingAddr" placeholder="请输入调入公司开票地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票类型:" prop="invoiceType" class="el-form-flex">
                 <el-select v-model="dataForm.invoiceType" style="width: 100%;">
                  <el-option v-for="item in invoiceTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
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
              <el-form-item label="发票代码:" prop="invoiceCode" class="el-form-flex">
                <el-input type="input" v-model="dataForm.invoiceCode" placeholder="请输入发票份数"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发票号码:" prop="invoiceNumber" class="el-form-flex">
                <el-input type="input" v-model="dataForm.invoiceNumber" placeholder="请输入发票代码"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>

            <td>
              <el-form-item label="发货方式:" prop="deliveryMode" class="el-form-flex">
                <!-- {{dataForm.deliveryMode}} -->
                <el-input type="input" v-model="dataForm.deliveryMode" placeholder="请输入发货方式"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发货物流名称:" prop="deliveryLogisticsName" class="el-form-flex">
                <!-- {{dataForm.deliveryLogisticsName}} -->
                <el-input type="input" v-model="dataForm.deliveryLogisticsName" placeholder="请输入发货物流名称"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发货物流编码:" prop="deliveryLogisticsCode" class="el-form-flex">
                <!-- {{dataForm.deliveryLogisticsCode}} -->
                <el-input type="input" v-model="dataForm.deliveryLogisticsCode" placeholder="请输入发货物流编码"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="寄件单号:" prop="mailingNumber" class="el-form-flex">
                <!-- {{dataForm.mailingNumber}} -->
                <el-input type="input" v-model="dataForm.mailingNumber" placeholder="请输入寄件单号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收件人姓名:" prop="receiveUserName" class="el-form-flex">
                <!-- {{dataForm.receiveUserName}} -->
                <el-input type="input" v-model="dataForm.receiveUserName" placeholder="请输入收件人姓名"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收件电话:" prop="receiveTel" class="el-form-flex">
                <!-- {{dataForm.receiveTel}} -->
                 <el-input type="input" v-model="dataForm.receiveTel" placeholder="请输入收件电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="制单人:" prop="crtUserName" class="el-form-flex">
                <!-- {{dataForm.crtUserName}} -->
                <el-input type="input" v-model="dataForm.crtUserName" placeholder="请输入制单人"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="制单时间:" prop="crtTime" class="el-form-flex">
                <!-- {{dataForm.crtTime}} -->
                <el-input type="input" v-model="dataForm.crtTime" placeholder="请输入制单时间"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收件地址:" prop="receiveAddr" class="el-form-flex">
                <!-- {{dataForm.receiveAddr}} -->
                <el-input type="input" v-model="dataForm.receiveAddr" placeholder="请输入收件地址"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <div style="display: flex;flex-direction: row;justify-content: flex-end;">
        <el-button type="text" icon="el-icon-download">
          <a :href="'/api/wms/companySettlementBilling/downTemplate?billNo='+dataForm.billNo">下载开票模板</a>
        </el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        电子清单导出
      </el-button>
    </div>
    <el-table :data="items" border highlight-current-row width="100%" class="detailTable" :height="clientHeight" ref="itemsTable"
              show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsCode" label="商品编码" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.goodsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="series" label="系列" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.series}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="计量单位" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlePrice" label="结算单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settlePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleAmt" label="结算金额" width="120" align="center" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settleAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleQty" label="结算数量" width="120" align="center" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unBillingQty" label="未开票数量" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.unBillingQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billingQty" label="本次开票数量" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.billingQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billingAmt" label="开票金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.billingAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税率" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxPrice" label="不含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.noTaxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="noTaxAmt" label="不含税金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.noTaxAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmt" label="开票税额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="allocationOrderBillNo" label="调拨单号" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.allocationOrderBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="结算单号" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 企业结算单弹窗底部 -->
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
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getBill, auditBill } from '@/api/erp/wms/bill/companySettlementBilling'
  import { getProcessId } from '@/api/erp/oa/task/taskBill'

  export default {
    name: 'companySettlementBillingView',
    props: ['id', 'dialogFormVisible', 'taskType', 'step', 'invoiceOption'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        downloadLoading:false,
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
        processId: undefined,
        comment: undefined,
        rules: {}
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
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data
            this.dataForm.invoiceType = String(this.dataForm.invoiceType)
            this.items = response.data.items
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, '')
            this.getProcessId(billPrefix)
          })
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response
          }
        })
      },

      handleDownload() {
        this.downloadLoading = true;
        //console.log(this.items);
        // import('@/vendor/Export2Excel').then(excel => {
        //   var tHeader;
        //   var filterVal;
        //   var list = JSON.parse(JSON.stringify(this.items));
        //   tHeader = ['订单号', '订货号','商品名称', '规格型号', '数量', '金额', '税率', '税额', '含税单价', '价税合计', '单位', '备注'];
        //   filterVal = ['sourceBillNo','itemNo', 'skuName', 'specifications', 'qty', 'amount', 'taxRate', 'tax', 'taxPrice', 'taxAmount', 'unit', 'note'];
        //   excel.export_json_to_excel2(tHeader, list, filterVal, this.dataForm.customerName+'-'+this.dataForm.invoiceNo);
        //   this.downloadLoading = false;
        // })


        import('@/vendor/Export2Excel').then(excel => {
          var tHeader = [];
          var filterVal = [];
          var list = this.items.map(o => ({...o}))
          for (let i = 0; i < list.length; i++) {
            list[i].index = i + 1
            //list[i].invoiceAmount=this.toPercent(this.division(list[i].monthRefundAmount||0,list[i].monthAmount||0).toFixed(4))
            // list[i].count=Number(list[i].count).toFixed(0)
            // list[i].closeCount=Number(list[i].closeCount).toFixed(0)
            // list[i].salesmanNo=this.toPercent((this.division(this.accAdd(list[i].count,-list[i].closeCount),list[i].count)||0).toFixed(4))
            //list[i].stockInProfitPercent=this.toPercent(this.division(list[i].stockInProfitPercent,100).toFixed(4))
          }
          for (let i = 0; i < this.$refs['itemsTable'].columns.length; i++) {
            tHeader.push(this.$refs['itemsTable'].columns[i].label)
            if (i === 0) {
              filterVal.push('index')
            } else {
              filterVal.push(this.$refs['itemsTable'].columns[i].property)
            }

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, this.dataForm.inCompanyFullName);
          this.downloadLoading = false;
        })


      },

      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['transferPrice', 'settlePrice','settleQty','unBillingQty','billingQty','billingAmt', 'settleDiscount', 'settleAmt', 'transferAmt','noTaxAmt','taxAmt'])
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        }
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess')
      }
    }
  }
</script>

<style scoped>
.detailTable {
  height: 400px!important;
}
</style>
