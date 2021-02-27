<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>付款申请单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <div class="association-creation">
        <el-button type="text" size="medium" @click="handleUpdateBill" v-if="dataForm.billStatus*1===4&&$store.getters.groupNames.indexOf('总经理') > -1" >
          作废
        </el-button>
      </div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款形式:" prop="paymentForm" class="el-form-flex">
                <div v-for="item in paymentFormOptions">
                  <span v-if="dataForm.paymentForm==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="申请人:" prop="applicantName" class="el-form-flex">
                {{dataForm.applicantName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="部门:" prop="departName" class="el-form-flex">
                {{dataForm.departName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="结算方式:" prop="paymentsMeans" class="el-form-flex">
                <div v-for="item in paymentsMeansOptions">
                  <span v-if="dataForm.paymentsMeans==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <div v-for="(item,index) in currencyOptions" :key="index">
                  <span v-if="dataForm.currencyId==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
               <!-- <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                {{dataForm.sourceBillNo}}
              </el-form-item>  -->
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">
                {{dataForm.bankName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="银行账户:" prop="bankAccount" class="el-form-flex">
                {{dataForm.bankAccount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="申请金额:" prop="applyAmount" class="el-form-flex">
                {{dataForm.applyAmount.toFixed(4)}}
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

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据">
        <template slot-scope="scope">
          <span>{{scope.row.sourceObjectName}} {{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillDate" label="单据日期">
        <template slot-scope="scope">
          <span>{{scope.row.sourceBillDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌名称">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列名称">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseAmount" label="采购金额" align="right" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.purchaseAmount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.applyAmount.toFixed(4)}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 付款申请单详情弹窗底部 -->
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
  import { getBill, auditBill,resetBill} from '@/api/erp/purchase/bill/paymentApply';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {page as getPaymentsMeans} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: "paymentApplyView",
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
          supplierId: undefined,
          supplierName: undefined,
          departId: undefined,
          departName: undefined,
          applicantId: undefined,
          applicantName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          applyAmount: undefined,
          currencyId: '1',
          bankName: undefined,
          bankAccount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        paymentsMeansOptions: [],
      };
    },
    created() {
      getPaymentsMeans().then(response => {
        this.paymentsMeansOptions = response.data.records;
      });
      this.init()
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
          var height = 334;
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
            console.log(this.dataForm);
            console.log(this.paymentsMeansOptions);
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
            values = data.map(item => Number(item.amount));
          } else if (column.property === 'applyAmount') {
            values = data.map(item => Number(item.applyAmount));
          } else if (column.property === 'taxBillAmount') {
            values = data.map(item => Number(item.taxBillAmount));
          } else if (column.property === 'purchaseAmount') {
            values = data.map(item => Number(item.purchaseAmount));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'applyAmount' || column.property === 'amount' || column.property === 'taxBillAmount' || column.property === 'purchaseAmount' || column.property === 'qty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                // if (column.property === 'applyAmount') {
                //   this.dataForm.applyAmount = getFloat((prev + curr), 2)
                // }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(2);

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
      },
      handleUpdateBill() {
        this.$confirm('此操作将作废此单据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetBill(this.id).then(res => {
            if(res.code == '2000') {
              this.$message.success('作废成功')
              this.$emit('handleClose', false)
            } else {
              this.$message.warning(res.msg)
            }
          })
        })

      },
    }
  }
</script>

<style scoped>
  .tb-edit {
    height:80%!important
  }
</style>
