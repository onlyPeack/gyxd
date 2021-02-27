<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>退款单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="付款日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <!-- <el-form-item label="付款形式:" prop="paymentForm" class="el-form-flex">
                <div v-for="item in paymentFormOptions">
                  <span v-if="dataForm.paymentForm==item.value">{{item.label}}</span>
                </div>
              </el-form-item> -->
            </td>
          </tr>
          <!-- <tr>
            <td colspan="2">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                {{dataForm.sourceBillNo}}
              </el-form-item>
            </td>
          </tr> -->
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="退款账户:" prop="payAccount">
                {{bankAccountArr.find(item => {
                  return item.accountCode == dataForm.refundAccount
                }).name}}
              </el-form-item>
            </td>
          </tr>
          <tr >
            <td>
            <el-form-item label="退款金额:" prop="refundAmount">
              {{dataForm.refundAmount}}
            </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                {{dataForm.bankName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="银行账户:" prop="bankAccount" class="el-form-flex">
                {{dataForm.bankAccount}}
              </el-form-item>
            </td>
          </tr> -->
          <!-- <tr>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <div v-for="item in currencyOptions">
                  <span v-if="dataForm.currencyId==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款金额:" prop="payAmount" class="el-form-flex">
                {{dataForm.payAmount}}
              </el-form-item>
            </td>
          </tr> -->
          <!-- <tr>
            <td width="50%">
              <el-form-item label="结算方式:" prop="paymentsMeans" class="el-form-flex">
                <div v-for="item in paymentsMeansOptions">
                  <span v-if="dataForm.paymentsMeans==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="冲抵预付金额:" prop="sumOfAdvance" class="el-form-flex">
                {{dataForm.sumOfAdvance}}
              </el-form-item>
            </td>
          </tr> -->
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
     <!-- 承兑单据 -->
    <el-table v-if="dataForm.payAccount == '90006'" :data="acceptItems" border highlight-current-row width="100%" :height="100"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="expenditureNo" label="承兑支出单号">
         <template>
          {{dataForm.expenditureNo}}
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号">
        <template>
          {{dataForm.draftNo}}
        </template>
      </el-table-column>
      <el-table-column prop="expenditureType" label="支出类型">
        <template>
          {{dataForm.expenditureType}}
        </template>
      </el-table-column>
      <el-table-column prop="paymentAmt" label="汇票金额">
        <template>
          {{dataForm.paymentAmt}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 普通单据 -->
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据" width="180">
      </el-table-column>
      <!-- <el-table-column prop="billNo" label="请款单号" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.billNo"
                    class="readonly-el-input left-el-input" readonly></el-input>
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="cashAccount" label="请款账户" align="right"  min-width="120">
      </el-table-column>
      <el-table-column prop="purchaseOrderNo" label="采购订单" width="180">
        <template slot-scope="scope">
          <div style="text-align: left;padding-left: 10px;width: 100%;">
            {{scope.row.purchaseOrderNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseAmount" label="采购金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchaseAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.purchaseAmount}}</span>
        </template>
      </el-table-column>
      <!--请款金额:返回cashAmount给我-->
      <el-table-column prop="cashAmount" label="请款金额" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.cashAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.cashAmount}}</span>
        </template>
      </el-table-column>
      <!--可退款金额 = 请款金额 :返回canRefundAmount给我-->
      <el-table-column prop="canRefundAmount" label="可退款金额" align="right" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.canRefundAmount"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.canRefundAmount}}</span>
        </template>
      </el-table-column>
      <!--本次退款金额：默认为0，手输入，不能大于可退款金额  -->
      <el-table-column prop="thisRefundAmount" label="本次退款金额" align="right" class-name="col-required" width="100">
        <template slot-scope="scope">
           <el-input size="mini" v-model="scope.row.thisRefundAmount" class="right-el-input" readonly
                    @change="handleEdit('thisRefundAmount',$event,scope.$index,scope.row)"
                    onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"></el-input>
          <span>{{scope.row.thisRefundAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="品名" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications"
                    class="readonly-el-input right-el-input" readonly></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
   
    <!-- 付款单详情弹窗底部 -->
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
        <!--<el-button type="primary">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseRefund';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';

  export default {
    name: "purchasePaymentView",
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          payAmount: undefined,
          currencyId: '1',
          payAccount: undefined,
          sumOfAdvance: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        acceptItems:[],
        bankAccountArr:[],
        processId: undefined,
        comment: undefined,
        rules: {}
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 293;
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
            let {expenditureNo,draftNo,expenditureType,paymentAmt} = this.dataForm;
            let tempItem = [];
            tempItem.push({expenditureNo,draftNo,expenditureType,paymentAmt})
            tempItem.forEach((item,index) => {
              this.$set(this.acceptItems,index,item)
            })
            this.items = response.data.items;
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
          });
        pageAll().then(response => {
          this.bankAccountArr = response.data;
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
          if (column.property === 'purchaseAmount') {
            values = data.map(item => Number(item.purchaseAmount));
          } else if (column.property === 'cashAmount') {
            values = data.map(item => Number(item.cashAmount));
          } else if (column.property === 'canRefundAmount') {
            values = data.map(item => Number(item.canRefundAmount));
          } else if (column.property === 'thisRefundAmount') {
            values = data.map(item => Number(item.thisRefundAmount));
          }
          
          if (column.property === 'purchaseAmount' || column.property === 'cashAmount' || column.property === 'canRefundAmount'|| column.property === 'thisRefundAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'thisPaymentAmount') {
                  this.dataForm.payAmount = getFloat((prev + curr), 4)
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
