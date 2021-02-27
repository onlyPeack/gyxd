<template>
  <div>
    <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
               class="billFormDialog billDetailDialog"
               :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>客户注册详情</span>
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
                <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                  <div style="cursor: pointer;">
                    {{form.customerCode}}
                  </div>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="公司名称:" prop="companyName" class="el-form-flex">
                  <div style="cursor: pointer;">
                    {{form.companyName}}
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <el-form-item label="手机号:" prop="mobile" class="el-form-flex">
                  <div style="cursor: pointer;">
                    {{form.mobile}}
                  </div>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="用户名:" prop="username" class="el-form-flex">
                  <div style="cursor: pointer;">
                    {{form.username}}
                  </div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <el-form-item label="推荐码:" prop="recommendCode" class="el-form-flex">
                  {{form.recommendCode}}
                </el-form-item>
              </td>
              <td width="50%">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-form-item label="归属业务员名称:" prop="staffName" class="el-form-flex">
                    {{form.staffName}}
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="营业执照:" prop="companyLicense" class="el-form-flex">
                  <div v-if="processId && processId!='' && taskType=='now'">
                    <el-upload class="avatar-uploader" style="margin: 20px 0px;" :action='uploadPath'
                               list-type="picture-card" :show-file-list="false"
                               accept=".jpg,.jpeg,.png,.gif" :on-success="uploadIconUrl">
                      <img v-if="form.companyLicense" :src="form.companyLicense" class="avatar" style="max-height: 148px; max-width: 148px;">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </div>
                  <div v-else style="margin: 20px 0px;">
                    <img v-if="form.companyLicense":src="form.companyLicense" style="max-height: 148px; max-width: 148px;"/>
                  </div>
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
          <el-button type="warning" @click="handleAuditBill('驳回','form')" :loading="isRejectLoading">驳 回</el-button>
          <el-button type="primary" @click="handleAuditBill('同意','form')" :loading="isAgreeLoading">同 意</el-button>
        </div>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 员工选择-->
    <el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="true" ref="user"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getObj, auditBill} from '@/api/erp/crm/customerRegister';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage'

  export default {
    name: "customerRegisterView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory'),
      'user-selector': () => import('@/components/ERP/User/user'),
    },
    data() {
      return {
        uploadPath,
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        form: {
          customerCode: undefined,
          companyName: undefined,
          recommendCode: undefined,
          staffName: undefined,
          mobile: undefined,
          username: undefined,
          userId: undefined,
          note: undefined,
          companyLicense: undefined,
        },
        userVisible: false,
        comment: undefined,
        processId: undefined,
        rules: {
          staffName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.staffName)
            }, message: '请选择业务员', trigger: 'blur'
          }],
        }
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
      uploadIconUrl: function (response) {
        this.$nextTick(() => {
          //this.form.companyLicense = response.data.url
          this.vueSet(this.form, 'companyLicense', response.data.url);
        });
        console.log(this.form);
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请选择业务员"))
        } else {
          callback();
        }
      },

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
      handleAuditBill(val, form) {

        this.form.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        const set = this.$refs;
        set[form].validate(valid => {
          if (valid) {
            this.auditBill(this, 'form', auditBill, 'submitDetailSuccess');
          }
        })
      },
      // 业务员选择
      handleUserSelector() {
        this.userVisible = true;
      },
      handleCancelUser() {
        this.$refs.user.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.user.onSubmit();
      },
      handleUserDel() {
        this.form.userId = undefined;
        this.form.staffName = undefined;
        this.$refs.user.reset();
      },
      closeUserDialog(list) {
        console.log(list)
        this.userVisible = false;
        if (list.length > 0) {
          this.form.userId = list[0].id;
          this.form.staffName = list[0].name;
          this.form.recommendCode = list[0].no;
          console.log(this.$refs.form)
          this.$refs['form'].validateField('staffName');
        }
      },
    }
  }
</script>
