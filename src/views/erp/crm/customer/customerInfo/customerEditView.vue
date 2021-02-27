<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>客户修改单详情</span>
        <span class="cont-title-billNo" v-if="form.billNo">No.{{form.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据状态:" prop="billStatus" class="el-form-flex">
                <div v-for="item in statusOptions">
                  <span v-if="form.billStatus==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{form.billNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户编号:" prop="code" class="el-form-flex">
                <div style="cursor: pointer;">
                  {{form.code}}
                </div>
              </el-form-item>
            </td>
            <td width="50%">
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户名称:" prop="name" class="el-form-flex">{{form.name}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户名称-新:" prop="nameNew" class="el-form-flex">{{form.nameNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="开户银行:" prop="bankName" class="el-form-flex">{{form.bankName}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="开户银行-新:" prop="bankNameNew" class="el-form-flex">{{form.bankNameNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="银行账号:" prop="bankAccount" class="el-form-flex">{{form.bankAccount}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="银行账号-新:" prop="bankAccountNew" class="el-form-flex">{{form.bankAccountNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="客户税号:" prop="tax" class="el-form-flex">{{form.tax}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="客户税号-新:" prop="taxNew" class="el-form-flex">{{form.taxNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票人:" prop="spMan" class="el-form-flex">{{form.spMan}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票人-新:" prop="spManNew" class="el-form-flex">{{form.spManNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票电话:" prop="spTel" class="el-form-flex">{{form.spTel}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票电话-新:" prop="spTelNew" class="el-form-flex">{{form.spTelNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收票地址:" prop="spAddress" class="el-form-flex">{{form.spAddress}}</el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收票地址-新:" prop="spAddressNew" class="el-form-flex">{{form.spAddressNew}}</el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:" prop="recordFile" class="el-form-flex">
                <el-upload
                  class="upload-demo customer-upload-view"
                  style="height: 100%"
                  disabled
                  :on-preview="handlePreview"
                  action="api/goods/storage/create"
                  :file-list="fileList">
                </el-upload>
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
      <task-history v-if="form.billNo && processId && processId!=''" :processId="processId"
                    :billNo="form.billNo"></task-history>
    </div>

    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <el-button type="primary" @click="handleAuditBill('同意')">同 意</el-button>
        <el-button type="warning" @click="handleAuditBill('驳回')">驳 回</el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getObj, auditBill} from '@/api/erp/crm/customerEdit';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "customerEditView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        form: {
          code: undefined,
          name: undefined,
          nameNew: undefined,
          bankName: undefined,
          bankNameNew: undefined,
          bankAccount: undefined,
          bankAccountNew: undefined,
          tax: undefined,
          taxNew: undefined,
          spMan: undefined,
          spManNew: undefined,
          spTel: undefined,
          spTelNew: undefined,
          spAddress: undefined,
          spAddressNew: undefined,
          note: undefined

        },
        comment: undefined,
        processId: undefined,
        rules: {},
        fileList:[]
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
          var height = 181;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getObj(this.id)
          .then(response => {
            this.form = response.data;
            this.items = response.data.items;
            this.fileList=[
              {
                name:'附件',
                url:response.data.recordFile,
              }
            ]
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
        this.form.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'form', auditBill, 'submitDetailSuccess');
      },
      handlePreview(file){
        window.open(file.url,'_blank')
      }
    }
  }
</script>
<style>
  .customer-upload-view .el-upload--text{
    display: none;
  }
</style>
