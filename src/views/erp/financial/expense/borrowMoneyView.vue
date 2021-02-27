<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>借款单详情</span>
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
              <el-form-item label="借款人:" prop="userName" class="el-form-flex">
                {{dataForm.userName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="费用承担部门:" prop="payOrgName" class="el-form-flex">
                {{dataForm.payOrgName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="借款日期:" prop="borrowMoneyDate" class="el-form-flex">
                {{dataForm.borrowMoneyDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="还款日期:" prop="repayMoneyDate" class="el-form-flex">
                {{dataForm.repayMoneyDate}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="借款类型:" prop="type" class="el-form-flex">
                <div v-for="item in typeOptions">
                  <span v-if="dataForm.type==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="币别:" prop="currencyId" class="el-form-flex">
                <div v-for="item in currencyOptions">
                  <span v-if="dataForm.currencyId==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="关联客户:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联供应商:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="关联项目:" prop="projectName" class="el-form-flex">
                {{dataForm.projectName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联审批:" class="el-form-flex">
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="借款金额:" prop="amount" class="el-form-flex">
                {{dataForm.amount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="借款原因:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收款人:" prop="payUserName" class="el-form-flex">
                {{dataForm.payUserName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收款银行:" prop="depositBank" class="el-form-flex">
                {{dataForm.depositBank}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收款银行账号:" prop="bankAccount" class="el-form-flex">
                {{dataForm.bankAccount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="付款日期:" prop="payDate" class="el-form-flex">
                {{dataForm.payDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款账户:" prop="payBankAccount" class="el-form-flex">
                {{dataForm.payBankAccount}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

    </div>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 弹窗底部 -->
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/financialBorrowMoney';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "borrowMoneyView",
    props: ['id', 'dialogFormVisible', 'typeOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          userId: undefined,
          userName: undefined,
          payUserName: undefined,
          borrowMoneyDate: undefined,
          repayMoneyDate: undefined,
          customerId: undefined,
          customerName: undefined,
          supplierId: undefined,
          supplierName: undefined,
          payOrgId: undefined,
          payOrgName: undefined,
          projectName: undefined,
          amount: undefined,
          currencyId: '1',
          type: '0',
          depositBank: undefined,
          bankAccount: undefined,
          payDate: undefined,
          payBankAccount: undefined,
          note: undefined,
          billStatus: undefined,
        },
        processId: undefined,
        comment: undefined,
        rules: {}
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data;
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
