<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>账户转账单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}

              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="审批状态:" prop="billStatus" class="el-form-flex">
                <div v-for="item in statusOptions">
                  <span v-if="dataForm.billStatus==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="转入账户:" prop="transferInAccount" class="el-form-flex">
                {{dataForm.transferInAccount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="做账类型:" prop="makeAccountType" class="el-form-flex">
                <div v-for="item in makeAccountTypeList">
                  <span v-if="dataForm.makeAccountType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="转账方式:" prop="transferType" class="el-form-flex">
                <div v-for="item in transferTypeList">
                  <span v-if="dataForm.transferType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>

              <el-form-item label="转入对象:" prop="transferInObject" class="el-form-flex">
                <div v-for="item in transferInObjectList">
                  <span v-if="dataForm.transferInObject==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="转入金额:" prop="transferInMoney" class="el-form-flex">
                {{dataForm.transferInMoney ? dataForm.transferInMoney.toFixed(4) : ""}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                {{dataForm.note}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>

      <el-table-column prop="transferOutAccount" label="转出账户">
        <template slot-scope="scope">
          <span>{{scope.row.transferOutAccount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOutAccountName" label="转出账户名称">
        <template slot-scope="scope">
          <span>{{scope.row.transferOutAccountName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOutMoney" label="转出金额">
        <template slot-scope="scope">
          <span>{{scope.row.transferOutMoney ? scope.row.transferOutMoney.toFixed(4) : ""}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOutDate" label="转出时间">
        <template slot-scope="scope">
          <span>{{scope.row.transferOutDate}}</span>
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/accountTransfer';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "accountTransferView",
    props: ['id', 'dialogFormVisible', 'typeOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        makeAccountTypeList: [
          {
            value: '0',
            label: '收入货款',
          },
          {
            value: '1',
            label: '收入退款',
          },
          {
            value: '2',
            label: '内部转账',
          },
          {
            value: '3',
            label: '费用登记单(收入)',
          },
          {
            value: '4',
            label: '分公司转账',
          },
          {
            value: '5',
            label: '期初录入',
          },
          {
            value: '6',
            label: '支付贷款',
          },
          {
            value: '7',
            label: '支付运费',
          },
          {
            value: '8',
            label: '支付退款',
          },
          {
            value: '9',
            label: '费用登记单(支出)',
          },
          {
            value: '10',
            label: '其他类型',
          },
          {
            value: '11',
            label: '投资款',
          }
        ],
        transferInObjectList: [
          {
            value: '0',
            label: '管理部',
          },
          {
            value: '1',
            label: '财务部',
          },
        ],
        transferTypeList: [
          {
            value: '0',
            label: '银行办理',
          },
          {
            value: '1',
            label: '网银办理',
          },
        ],
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          transferInAccount: undefined,
          makeAccountType: '0',
          transferType: '0',
          transferInObject:'0',
          transferInMoney: undefined,
          billStatus: undefined,
          items: []
        },
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
          var height = 170;
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
          const values = data.map(item => Number(item[column.property]));

          if (column.property === 'transferOutMoney') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'transferOutMoney') {
                  this.dataForm.amount = getFloat((prev + curr), 4)
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
    },
  }
</script>

