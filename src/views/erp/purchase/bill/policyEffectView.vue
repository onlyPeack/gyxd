<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>政策资源到账单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" class="el-form-flex">
                <el-input v-model="dataForm.billNo" placeholder="请选择供应商" readonly>
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-input v-model="dataForm.billDate" placeholder="请选择供应商" readonly>
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="返点类型:" prop="rebateType" class="el-form-flex">
                <span v-if="dataForm.rebateType*1===1">抵货款</span>
                <span v-else-if="dataForm.rebateType*1===2">现金</span>
                <span v-else-if="dataForm.rebateType*1===3">特价</span>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                  <el-input v-model="dataForm.supplierName" placeholder="请选择供应商" readonly>
                  </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="协议单号:" prop="agreementNo" class="el-form-flex">
                  <el-input v-model="dataForm.agreementNo" placeholder="请选择协议单" readonly>
                  </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="品牌:" prop="brand" class="el-form-flex">
                  <el-input v-model="dataForm.brand" placeholder="请选择品牌" readonly>
                  </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="返点系列:" prop="companySeries" class="el-form-flex">
                <el-input v-model="dataForm.companySeries" type="textarea" :rows="2" placeholder="请输入返点系列" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="协议类型:" prop="sourceBillNo" class="el-form-flex" >
                <span v-if="dataForm.agreementType*1===0">促销返点</span>
                <span v-else-if="dataForm.agreementType*1===1">个人资源</span>
                <span v-else-if="dataForm.agreementType*1===2">上半年返利</span>
                <span v-else-if="dataForm.agreementType*1===3">月</span>
                <span v-else-if="dataForm.agreementType*1===4">下半年返利</span>
                <span v-else-if="dataForm.agreementType*1===5">年终返利</span>
                <span v-else-if="dataForm.agreementType*1===6">季度(一)</span>
                <span v-else-if="dataForm.agreementType*1===7">季度(二)</span>
                <span v-else-if="dataForm.agreementType*1===8">季度(三)</span>
                <span v-else-if="dataForm.agreementType*1===9">季度(四)</span>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="标准系列:" prop="standardSeries" class="el-form-flex">
                <el-input v-model="dataForm.standardSeries" type="textarea" :rows="2" placeholder="请输入标准系列"  readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="协议年度:" prop="agreementYear" class="el-form-flex">
                <el-input v-model="dataForm.agreementYear" type="textarea" :rows="2" placeholder="请输入协议年度" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="协议说明:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="票据类型" prop="note" class="el-form-flex">
                <span v-if="dataForm.invoiceType*1===1">服务费发票</span>
                <span v-if="dataForm.invoiceType*1===2">红字发票</span>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="dataForm.items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="applyBillNo" label="请款单号" width="180" align="center" v-if="dataForm.rebateType*1!==2">
        <template slot-scope="scope">
          <span>{{scope.row.applyBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveBillNo" label="到账单号" width="180" align="center" v-if="dataForm.rebateType*1!==1">
        <template slot-scope="scope">
          <span>{{scope.row.receiveBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="供应商编号" prop="supplierCode"  align="center" v-slot="{row,$index}">
        <span>{{row.supplierCode}}</span>
      </el-table-column>
      <el-table-column label="供应商名称" prop="supplierName"  align="center" v-slot="{row}">
        <span>{{row.supplierName}}</span>
      </el-table-column>
      <el-table-column label="服务费开票单号" prop="invoiceNo"  align="center" v-slot="{row}">
        <span>{{row.invoiceNo}}</span>
      </el-table-column>
      <el-table-column label="开票供应商名称" prop="invoiceSupplier"  align="center" v-slot="{row}">
        <span>{{row.invoiceSupplier}}</span>
      </el-table-column>
      <el-table-column label="开票金额" prop="invoiceAmount"  align="center" v-slot="{row}">
        <span>{{row.invoiceAmount}}</span>
      </el-table-column>
      <el-table-column label="可到款金额" prop="canAmount"  align="center" v-slot="{row}">
        <span>{{row.canAmount}}</span>
      </el-table-column>
      <el-table-column label="本次到款金额" prop="thisAmount"  align="center" v-slot="{row}">
        <span>{{row.thisAmount}}</span>
      </el-table-column>
      <el-table-column label="备注" prop="note" align="center" v-slot="{row,$index}">
        <span>{{row.note}}</span>
      </el-table-column>

    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增客户订货单弹窗底部 -->
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
        <!-- <el-button type="primary" @click="handleAuditBill('1')">撤 销</el-button>-->
        <el-button type="primary" style="margin-left: 10px;">
          <router-link target="_blank" :to="{path:'/print/sales-order-print',query:{id:id}}">打 印</router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {getBill,auditBill} from '@/api/erp/purchase/bill/policyEffect';
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "policySeriesRebateView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isAgreeLoading: false,
        isRejectLoading: false,
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
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        accountMethodOptions: [{value: '1', label: '现金结算'}, {value: '2', label: '银行转账'}, {
          value: '3',
          label: '支付宝'
        }, {value: '4', label: '微信'}],
        receiptConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}]
      };
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
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 375;
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
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
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
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleAuditBill(val) {
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

