<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>费用报销详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="报销人:" prop="userName" class="el-form-flex">
                {{dataForm.userName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="报销日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
          </tr>


          <tr>
            <td>
              <el-form-item label="开户行:" prop="note" class="el-form-flex">
                {{dataForm.depositBank}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="开户名:" prop="note" class="el-form-flex">
                {{dataForm.depositName}}
              </el-form-item>
            </td>

          </tr>

          <tr>
            <td>
              <el-form-item label="银行账户:" prop="note" class="el-form-flex">
                {{dataForm.bankAccount}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="报销金额:" prop="note" class="el-form-flex">
                {{!!dataForm.amount ? dataForm.amount.toFixed(4) : '0.0000' }}
              </el-form-item>
            </td>

          </tr>

          <tr>
            <td colspan="2">
              <el-form-item label="报销事由:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.reason" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
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
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="type" label="报销类型">
        <template slot-scope="scope">
          <div v-for="item in typeOptions">
            <span v-if="scope.row.type==item.value">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accountName" label="承担账户">
        <template slot-scope="scope">
          <span>{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="message" label="用途">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="note" label="备注">
        <template slot-scope="scope">
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/financiaCostReimbursement';
  import {pageAll} from '@/api/erp/financial/financialBankAccount';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "costReimbursementDetail",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
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
          payDate: undefined,
          payBankAccount: undefined,
          payUserName: undefined,
          depositBank: undefined,
          bankAccount: undefined,
          amount: undefined,
          originalFlushingAmount: undefined,
          actualAfrAmount: undefined,
          currencyId: '1',
          userId: undefined,
          userName: undefined,
          userCode: undefined,
          payOrgId: undefined,
          payOrgName: undefined,
          customerId: undefined,
          customerName: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        payBankAccountOption: [],
        rules: {},
        typeOptions:[]
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };

      pageAll().then(response => {
        this.payBankAccountOption = response.data;
      });
      getTypeValue('root_gxcl_bxtype').then(response => {
        let tempOptions = [];
        response.data.rows.forEach(item => {
          this.typeOptions.push({
            label:item.labelZhCh,
            value:item.value
          })
        })
      });
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 416;
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
            values = data.map(item => Number(item.amount));
          }

          if (column.property === 'amount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
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
