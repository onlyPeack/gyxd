<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>承兑登记详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
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
          </tr>
          <tr>
            <td>
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                <div
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-if="dataForm.customerName">
                    {{dataForm.customerCode+'/'+dataForm.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="汇票类型:" prop="acceptanceType" class="el-form-flex">
                {{dataForm.acceptanceType}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="到款银行:" prop="toBankCode" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-if="dataForm.toBankCode">
                    {{dataForm.toBankCode + '/' + dataForm.companyAccount}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="公司承兑账户:" prop="comanyAccount" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-if="dataForm.toBankCode">
                    {{dataForm.toBankCode + '/' + dataForm.companyAccount}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:">
                <!--<el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"-->
                <!--:on-success="handleFileSuccess"-->
                <!--:on-remove="handleFileRemove"-->
                <!--:file-list="attachmentList">-->
                <!--</el-upload>-->
                <div style="width: 95%;float: right;">
                  <el-row v-if="attachmentList" v-for="atta in attachmentList" :key="atta.uid" class="annex-item">
                    <el-col :span="16">
                      <i class="el-icon-document"></i>
                      <span style="margin-left: 20px">{{atta.name}}</span>
                    </el-col>
                    <el-col :span="8">
                      <span class="annex-bottom">
                         <!--<a :href="atta.url" :download="atta.name" mce_href="#">下载</a>-->
                         <el-button type="text" @click="handleAttachmentDownLoad(atta.url)"><svg-icon
                           icon-class="import1"></svg-icon>下载</el-button>
                      </span>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="draftNo" label="汇票编号" width="180" align="center"></el-table-column>
      <el-table-column prop="paymentBankFullName" label="付款银行全称" width="180"></el-table-column>
      <el-table-column prop="dateOfIssue" label="出票日" align="center"></el-table-column>
      <el-table-column prop="draftExpireDate" label="汇票到期日" align="center"></el-table-column>
      <el-table-column prop="amt" label="出票金额" width="100" class-name="col-required" align="right"></el-table-column>
      <el-table-column prop="monthRate" label="月利率(%)" width="80" class-name="col-required"
                       align="right"></el-table-column>
      <el-table-column prop="discount" label="贴息额" class-name="col-required" align="right"></el-table-column>
      <el-table-column prop="fee" label="手续费" width="80" align="right" class-name="col-required"></el-table-column>
      <el-table-column prop="alreadyChange" label="已找零金额" width="100" align="right"
                       class-name="col-required"></el-table-column>
      <el-table-column prop="hands" label="几手背书"></el-table-column>
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/acceptanceRegister';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {uploadPath, downloadPath} from '@/api/erp/goods/storage';

  export default {
    name: "financial-sales-receivables-view",
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        uploadPath,
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        attachmentList: [],
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
          items: [],
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        typeOptions: [
          {
            value: '0',
            label: '纸质承兑',
          },
          {
            value: '1',
            label: '电子承兑',
          }
        ],
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
      handleAttachmentDownLoad(url) {
        console.log(url);
        const ele = document.createElement('a');
        ele.setAttribute('href', downloadPath(url)); //设置下载文件的url地址
        ele.click();
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
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
            this.items = response.data.items;
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
            if (response.data.attachment && response.data.attachment != "[]" && response.data.attachment != "[null]" && response.data.attachment != '"[null]"') {
              var jsonstr = JSON.parse(response.data.attachment);
              this.attachmentList = JSON.parse(jsonstr);
            } else {
              this.attachmentList = [];
            }
          });
      },
      getProcessId(billPrefix) {
        console.log(billPrefix,this.taskType);
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
        return this.getSummariesMethod(param, ['amt', 'monthRate', 'fee', 'alreadyChange']);
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
