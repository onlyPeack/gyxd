<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>承兑退回详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td colspan="2">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="支出类型:" prop="backType" class="el-form-flex">
                {{dataForm.backType}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="原到款客户编号:" prop="customerCode" class="el-form-flex">
                {{dataForm.customerCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="原到款客户名称:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="附件:">
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
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" align="center"></el-table-column>
      <el-table-column prop="expenditureType" label="原支出类型" width="100" align="center"></el-table-column>
      <el-table-column prop="sourceBillNo" label="原支出单号" width="180" align="center"></el-table-column>
      <el-table-column prop="draftNo" label="汇票编号" width="180" align="left"></el-table-column>
      <el-table-column prop="paymentBankFullName" label="付款银行全称" align="left" width="180"></el-table-column>
      <el-table-column prop="amt" label="出票金额" width="80" class-name="col-required" align="right"></el-table-column>
      <el-table-column prop="expenditureExpireDate" label="汇票到期日" width="120" align="center"></el-table-column>
      <el-table-column prop="expenditureDate" label="原支出时间" width="120" align="center"></el-table-column>
      <el-table-column prop="monthRate" label="月利率(%)" class-name="col-required" width="80" align="right"></el-table-column>
      <!--<el-table-column prop="discount" label="贴息额" class-name="col-required" width="80"></el-table-column>-->
      <el-table-column prop="fee" label="手续费" class-name="col-required" width="80" align="right"></el-table-column>
      <el-table-column prop="toStaff" label="入到款员工" width="120"></el-table-column>
      <el-table-column prop="customerName" label="入到款客户" width="120"></el-table-column>
      <el-table-column prop="newMonthRate" label="新月利率" width="80" class-name="col-required" align="right"></el-table-column>
      <el-table-column prop="backDate" label="退回时间" width="120" align="center"></el-table-column>
      <el-table-column prop="fee" label="手续费" width="80" class-name="col-required" align="right"></el-table-column>
      <el-table-column prop="registerBillNo" label="原登记单号" width="180" align="center"></el-table-column>
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/acceptanceExpenditureBack';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {uploadPath,downloadPath} from '@/api/erp/goods/storage';

  export default {
    name: "financial-sales-receivables-view",
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        uploadPath,
        attachmentList: [],
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          expenditureType: undefined,
          acceptanceStaffCode: undefined,
          acceptanceStaffName: undefined,
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
            if (response.data.attachment && response.data.attachment != "[null]" && response.data.attachment != '"[null]"') {
              this.attachmentList = JSON.parse(response.data.attachment);
            } else {
              this.attachmentList = [];
            }
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
