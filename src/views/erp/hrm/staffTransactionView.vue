<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>异动申请详情</span>
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
              <el-form-item label="原部门:" prop="departmentOld" class="el-form-flex">
                {{form.departmentOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新部门:" prop="departmentNameNew" class="el-form-flex">
                {{form.departmentNameNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原上级:" prop="leaderOld" class="el-form-flex">
                {{form.leaderOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新上级:" prop="leaderNew" class="el-form-flex">
                {{form.leaderNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原职务:" prop="postOld" class="el-form-flex">
                {{form.postOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新职务:" prop="postNameNew" class="el-form-flex">
                {{form.postNameNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原薪级:" prop="salaryLevelOld" class="el-form-flex">
                {{form.salaryLevelOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新薪级:" prop="salaryLevelNew" class="el-form-flex">
                {{form.salaryLevelNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原薪档:" prop="salaryFileOld" class="el-form-flex">
                {{form.salaryFileOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新薪档:" prop="salaryFileNew" class="el-form-flex">
                {{form.salaryFileNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="原薪档:" prop="salaryFileOld" class="el-form-flex">
                {{form.salaryFileOld}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="新薪档:" prop="salaryFileNew" class="el-form-flex">
                {{form.salaryFileNew}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="调整时间:" prop="adjustDate" class="el-form-flex">
                {{form.adjustDate}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="调整原因:" prop="adjustReason" class="el-form-flex">
                {{form.adjustReason}}
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
  import {getObj, auditBill} from '@/api/erp/hrm/staffTransaction';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "staffTransactionView",
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
