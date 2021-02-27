<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>收据申请单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="客户:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                {{dataForm.customerCode}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客服姓名:" prop="customerService" class="el-form-flex">
                {{dataForm.customerService}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客服部门:" prop="customerDepart" class="el-form-flex">
                {{dataForm.customerDepart}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收款类型:" prop="collectionType" class="el-form-flex">
                <el-select v-model="dataForm.collectionType" style="width: 100%;" disabled>
                  <el-option v-for="(item,index) in accountType" :key="index" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收据号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="收据金额:" prop="receiveMoney" class="el-form-flex">
                {{dataForm.receiveMoney}}
              </el-form-item>
            </td>
          </tr>
        </table>
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
      <el-table-column v-if="dataForm.collectionType != '承兑汇票'" prop="receiveNo" label="到款单号" width="180" align="center"></el-table-column>
      <el-table-column v-if="dataForm.collectionType == '承兑汇票'" prop="draftNo" label="汇票号" width="180" align="center"></el-table-column>
      <el-table-column v-if="dataForm.collectionType != '承兑汇票'" prop="receiveMoney" label="到款金额" width="150" align="center" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.receiveMoney).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column v-if="dataForm.collectionType == '承兑汇票'" prop="faceAmount" label="票面金额" width="150" align="center" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.faceAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120" align="center"></el-table-column>
  
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/financial/receiptApply';
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
          receiveMoney:0,
          items: [],
        },
        items: [],
        accountType:[
          {
            label:'微信',
            value:'微信'
          },{
            label:'支付宝',
            value:'支付宝'
          },{
            label:'双乾支付',
            value:'双乾支付'
          },{
            label:'现金支付',
            value:'现金支付'
          },{
            label:'承兑汇票',
            value:'承兑汇票'
          },{
            label:'工行支付',
            value:'工行支付'
          },
        ],
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
            // this.items.forEach(item => {
            //   this.dataForm.receiveMoney += item.receiveMoney
            // })
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
        let {columns, data} = param
        let sums = []
        let values = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (column.property === 'receiveMoney') {
            values = data.map(item => Number(item.receiveMoney))
          }  else if (column.property === 'faceAmount') {
            values = data.map(item => Number(item.faceAmount))
          }

          if (column.property === 'qty' || column.property === 'receiveMoney'
            || column.property === 'tax' || column.property === 'faceAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr)
              if (!isNaN(value)) {
                if (column.property === 'receiveMoney') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'faceAmount') {
                  this.dataForm.invoiceAmount = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4)
              } else {
                return prev
              }
            }, 0).toFixed(4)

            sums[index] += ' '
          } else {
            sums[index] = ' '
          }
        })

        return sums
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
