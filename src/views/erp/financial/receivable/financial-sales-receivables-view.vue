<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>销售收款详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <!--<td>-->
              <!--<el-form-item label="回款形式:" prop="" class="el-form-flex">-->
                <!--<div v-for="item in moneybackFormOptions">-->
                  <!--<span v-if="dataForm.paymentForm==item.value">{{item.label}}</span>-->
                <!--</div>-->
              <!--</el-form-item>-->
            <!--</td>-->
          </tr>
          <!--<tr>-->
            <!--<td>-->
              <!--<el-form-item label="客户:" prop="customerName" class="el-form-flex">-->
                <!--{{dataForm.customerName}}-->
              <!--</el-form-item>-->
            <!--</td>-->
            <!--<td>-->
              <!--<el-form-item label="业务员:" prop="salerName" class="el-form-flex">-->
                <!--{{dataForm.salerName}}-->
              <!--</el-form-item>-->
            <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
            <!--<td colspan="2">-->
              <!--<el-form-item label="币别:" prop="currencyId" class="el-form-flex">-->
                <!--<div v-for="item in currencyOptions">-->
                  <!--<span v-if="dataForm.currencyId==item.value">{{item.label}}</span>-->
                <!--</div>-->
              <!--</el-form-item>-->
            <!--</td>-->
          <!--</tr>-->
          <!--<tr>-->
            <!--<td>-->
              <!--<el-form-item label="到款金额:" prop="amountFormer" class="el-form-flex">-->
                <!--{{dataForm.amountFormer}}-->
              <!--</el-form-item>-->
            <!--</td>-->
            <!--<td>-->
              <!--<el-form-item label="到款日期:" prop="receiveDate" class="el-form-flex">-->
                <!--{{dataForm.receiveDate}}-->
              <!--</el-form-item>-->
            <!--</td>-->
          <!--</tr>-->
          <tr>
            <td width="50%">
              <el-form-item label="收款账户:" prop="receiveAccount" class="el-form-flex">
                <!-- {{dataForm.receiveAccount}} -->
                 <div v-for="(item,index) in bankAccountArr" :key="index">
                  <span v-if="dataForm.receiveAccount==item.accountCode">{{item.name}}</span>
                </div>
              </el-form-item>
              <!-- <div v-for="(item,index) in bankAccountArr" :key="index">
                  <span v-if="dataForm.receiveAccount==item.value">{{item.label}}</span>
                </div> -->
            </td>
            <td width="50%">
              <el-form-item label="结算方式:" prop="paymentsMeans" class="el-form-flex">
                <div v-for="(item,index) in paymentsMeansOptions" :key="index">
                  <span v-if="dataForm.paymentsMeans==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <!--<td width="50%">-->
              <!--<el-form-item label="冲抵预收金额:" prop="sumOfAdvance" class="el-form-flex">-->
                <!--{{dataForm.sumOfAdvance}}-->
              <!--</el-form-item>-->
            <!--</td>-->
          </tr>
          <!--<tr>-->
            <!--<td colspan="2">-->
              <!--<el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">-->
                <!--{{dataForm.sourceBillNo}}-->
              <!--</el-form-item>-->
            <!--</td>-->
          <!--</tr>-->
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
      <el-table-column prop="customerCode" label="客户编号" align="center" width="100"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="250"></el-table-column>
      <el-table-column prop="managerName" label="客服姓名"></el-table-column>
      <el-table-column prop="departName" label="客服部门"></el-table-column>
      <el-table-column prop="amountFormer" label="到款金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amountFormer.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="receiveDate" label="到款日期"></el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增实际回款弹窗底部 -->
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/financialSalesReceivables';
  import {getObj} from '@/api/admin/user/index';
  import { pageAll } from '@/api/erp/financial/financialBankAccount'
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "financial-sales-receivables-view",
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          customerId: undefined,
          customerName: undefined,
          paymentForm: '0',
          paymentsMeans: undefined,
          amountFormer: undefined,
          currencyId: '1',
          receiveAccount: undefined,
          sumOfAdvance: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        bankAccountArr:[],
        items: [],
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
            console.log('dataForm');
            console.log(this.dataForm);
            this.items = response.data.items;
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
          });
        pageAll().then(response => {
          this.bankAccountArr = []
          for (var i in response.data) {
            if (response.data[i].accountCode == '90002') {
              // this.dataForm.receiveAccount = response.data[i].accountCode
              this.bankAccountArr.push(response.data[i])
            }
            if (response.data[i].accountCode == '90006') {
              // this.dataForm.receiveAccount = response.data[i].accountCode
              this.bankAccountArr.push(response.data[i])
            }
            if (response.data[i].accountCode == '90004') {
              // this.dataForm.receiveAccount = response.data[i].accountCode
              this.bankAccountArr.push(response.data[i])
            }
          }
          console.log('this.bankAccountArr');
          console.log(this.bankAccountArr);
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
          if (column.property === 'thisReceivableAmount') {
            values = data.map(item => Number(item.thisReceivableAmount));
          } else if (column.property === 'receivableAmount') {
            values = data.map(item => Number(item.receivableAmount));
          }

          if (column.property === 'receivableAmount' || column.property === 'thisReceivableAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'thisReceivableAmount') {
                  this.dataForm.amountFormer = getFloat((prev + curr), 4)
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
