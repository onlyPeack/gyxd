<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>折扣设置详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable" style="margin-bottom: 0px;">
          <tr>
            <td>
              <el-form-item label="适用客户:" prop="customerName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in dataForm.customerArr" :key="tag.id">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
               <el-form-item label="客户等级:" prop="level" class="el-form-flex">
                 {{dataForm.level}}
               </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="库存加点:" prop="discountPoint" class="el-form-flex">
                {{dataForm.discountPoint}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="生效日期:" prop="effectiveDate" class="el-form-flex">
                {{dataForm.effectiveDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="失效日期:" prop="disabledDate" class="el-form-flex">
                {{dataForm.disabledDate}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增客户价格方案弹窗底部 -->
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
          <router-link target="_blank" :to="{path:'/print/sales-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, auditBill} from '@/api/erp/sales/price/discountSetting';
  import {getProcessId} from '@/api/erp/oa/task/taskBill'

  export default {
    name: "discountSettingsView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        dataForm: {},
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        levelOptions: [{
          value: 10,
          label: '青铜'
        }, {
          value: 20,
          label: '白银'
        }, {
          value: 30,
          label: '黄金'
        }, {
          value: 40,
          label: '铂金'
        }, {
          value: 50,
          label: '钻石'
        }, {
          value: 60,
          label: '至尊'
        }],
      };
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data;
            let tempIndex = this.levelOptions.findIndex(item => {
              return item.value == this.dataForm.customerArr[0].level
            })
            this.dataForm.level = this.levelOptions[tempIndex].label
            this.items = response.data.items;
            if (response.data.billNo) {
              var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
              this.getProcessId(billPrefix);
            }
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
    }
  }
</script>
