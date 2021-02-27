<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>批量费用划拨详情</span>
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
                  {{$moment(dataForm.billDate).format('YYYY-MM-DD')}}
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
              <el-form-item label="附件:" class="el-form-flex">
                <div v-for="atta in attachmentList">
                  {{atta.name}}
                  <el-button style="margin-left: 30px;" type="text" @click="handleAttachmentDownLoad(atta.url)">
                    <svg-icon icon-class="import1"></svg-icon>
                    下载
                  </el-button>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" readonly="readonly"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="transferIn" label="划入员工" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.transferIn}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferIn" label="划入账户类型" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.accountInType">{{scope.row.accountInType == 'A'?'利润账户':'可用资金'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOut" label="划出员工" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.transferOut}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOut" label="划出账户类型" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.accountOutType">{{scope.row.accountOutType == 'A'?'利润账户':'可用资金'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectNo" label="科目编号" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.subjectNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectName" label="划拨类型" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.subjectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferMoney" label="划拨金额" align="right" width="150" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferMoney.toFixed(4)}}</span>
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
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/expenseTransferBatch';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "expenseTransferBatchView",
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    data() {
      return {
        uploadPath,
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          billStatus: undefined,
          attachment: [],
          note: undefined,
          items: []
        },
        items: [],
        attachmentList: [],
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
          var height = 99;
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
            if(this.dataForm.billStatus=='1'){
              this.dataForm.billStatus = "暂存";
            }
            console.log(this.dataForm.billStatus);
            this.attachmentList = JSON.parse(response.data.attachment);
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
      handleAttachmentDownLoad(url) {
        const ele = document.createElement('a');
        ele.setAttribute('href', downloadPath(url)); //设置下载文件的url地址
        ele.click();
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

