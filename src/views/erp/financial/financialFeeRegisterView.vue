<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>费用登记单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="报销单位:" prop="companyName" class="el-form-flex">
                {{companyName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="登记类型:" prop="registerType" class="el-form-flex">
                <div v-for="item in registerTypeOptions">
                  <span v-if="dataForm.registerType==item.value">{{item.labelDefault}}</span>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="做账类型:" prop="makeAccountType" class="el-form-flex">
                <div v-for="item in makeAccountTypeOptions">
                  <span v-if="dataForm.makeAccountType==item.value">{{item.labelDefault}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
    show-summary :summary-method="getSummaries"
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="accountCode" label="账户" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.accountCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountName" label="账户名称" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.accountName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salerName" label="操作员" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.salerName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salerDepartName" label="操作员部门" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.salerDepartName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectCode" label="科目编号" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.subjectCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectName" label="科目名称" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="报销人" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="userDepartName" label="报销部门" width="150">-->
        <!--<template slot-scope="scope">-->
          <!--<span>{{scope.row.userDepartName}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="registerAmount" label="登记金额" align="right" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.registerAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200" class-name="col-required">
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
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/feeRegisterService';
  import {getTypeValue} from '@/api/dict/dictValue/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "financialFeeRegisterView",
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    data() {
      return {
        companyName: '江苏工享创联网络科技有限公司',
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: 2,
          makeAccountType: undefined,
          registerType: undefined,
          userId: undefined,
          userCode: undefined,
          userName: undefined,
          userDepartId: undefined,
          userDepartName: undefined,
          note: undefined,
          items: []
        },
        items: [],
        makeAccountTypeOptions: [],
        registerTypeOptions: [],
        processId: undefined,
        comment: undefined,
        rules: {}
      };
    },
    created() {
      getTypeValue('comm_tmp_make_account_type').then(response => {
        this.makeAccountTypeOptions = response.data.rows;
      });
      getTypeValue('comm_tmp_register_type').then(response => {
        this.registerTypeOptions = response.data.rows;
      });

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
        getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
           if (column.property === 'registerAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.registerAmount));
          }

          if (column.property === 'registerAmount' ) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'registerAmount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
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
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 140;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (240 + height)) * 0.95;
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

