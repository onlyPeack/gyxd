<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog "
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>闲置库存加点详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container idlePricePlanView">
      
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="方案名称:" prop="schemeName" class="el-form-flex">
                {{dataForm.schemeName}}
              </el-form-item>
            </td>
             <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="生效日期:" prop="effectiveDate" class="el-form-flex">
                {{dataForm.effectiveDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                {{dataForm.disabledDate}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
               <el-form-item label="加点数:" prop="point" class="el-form-flex">
                {{dataForm.point}}
              </el-form-item>
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </table>
      </el-form>
      <task-history v-if="dataForm.billNo && processId" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="customerName" label="客户名称" min-width="180">
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" min-width="180">
      </el-table-column>
    </el-table>
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/sales/price/idlePrice';
  import {getProcessId} from '@/api/erp/oa/task/taskBill'

  export default {
    name: "pricePlanView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isAgreeLoading: false,
        isRejectLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          schemeName: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          customerId: undefined,
          customerName: undefined,
          customerArr: [],
          billStatus: undefined,
          type: '0',
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
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
        typeOptions: [{
          value: '0',
          label: '单个商品调价'
        }, {
          value: '1',
          label: '低于安全折扣调价'
        }, {
          value: '2',
          label: '按系列调价'  //暂时隐藏
         }],
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
          var height = 154;
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
            // let tempIndex = this.levelOptions.findIndex(item => {
            //   return item.value == this.dataForm.customerArr[0].level
            // })
            // this.dataForm.level = this.levelOptions[tempIndex].label
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.items = response.data.items;
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
          if (column.property === 'price') {
            values = data.map(item => Number(item.price));
          } else if (column.property === 'safePrice') {
            values = data.map(item => Number(item.safePrice));
          }

          if (column.property === 'price' || column.property === 'safePrice') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

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

<style lang="scss" scoped>
  .idlePricePlanView  {
    td {
      width: 25%!important;
      border: 1px solid #e0e0e0;
      height: 40px;
      padding: 0px;
      margin: 0px;
      padding-left: 10px;
    }
  }
</style>