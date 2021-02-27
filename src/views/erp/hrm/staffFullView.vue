<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>转正申请详情</span>
        <span class="cont-title-billNo" v-if="form.billNo">No.{{form.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="form.billNo && processId && processId!==''" :processId="processId"
                    :billNo="form.billNo"></task-history>
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
              <el-form-item label="员工工号:" prop="staffCode" class="el-form-flex">
                {{form.staffCode}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="姓名:" prop="name" class="el-form-flex">
                {{form.name}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="部门:" prop="department" class="el-form-flex">
                {{form.department}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="上级:" prop="leader" class="el-form-flex">
                {{form.leader}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="职务:" prop="post" class="el-form-flex">
                {{form.post}}
              </el-form-item>
            </td>
          </tr>

          <tr>
            <td width="50%">
              <el-form-item label="入司时间:" prop="joinDate" class="el-form-flex">
                {{form.joinDate}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="转正时间:" prop="fullDate" class="el-form-flex">
                {{form.fullDate}}
              </el-form-item>
            </td>
          </tr>


        </table>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!=='' && taskType==='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!=='' && taskType==='now'" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="form.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getObj, auditBill} from '@/api/erp/hrm/staffFull';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "staffFullView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        form: {
          staffCode: undefined,
          name: undefined
        },
        comment: undefined,
        processId: undefined,
        rules: {}
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
      }
    }
  }
</script>
