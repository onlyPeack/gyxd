<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>发货异常通知单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="crtTime" class="el-form-flex">
                {{dataForm.crtTime}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="附件：">
                <div>
                    <span style="display:inline-block;position:relative;top:5px;width: 200px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">
                      {{dataForm.fileName}}
                    </span>
                    <a :href="dataForm.fileUrl" v-if="dataForm.fileName" target="_blank" style="color:#1890ff">下载合同</a>
                  </div>

              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
       </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" sortable align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.billNo">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据" width="160" align="right"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="100" align="right"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100" align="right"></el-table-column>
      <el-table-column prop="skuNo" label="编码" width="160" align="right"></el-table-column>
      <el-table-column prop="seriesName" label="系列名称" width="100" align="right"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100" align="right"></el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="100" align="right"></el-table-column>
      <el-table-column prop="price" label="单价" width="100" align="right"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100" align="right"></el-table-column>
      <el-table-column prop="qty" label="数量" width="100" align="right"></el-table-column>
      <el-table-column prop="difQty" label="差异数量" width="100" align="right" class-name="col-required">
      </el-table-column>
      <el-table-column prop="abnormalType" label="异常类型" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <div v-for="item in abnormalOptions">
            <span v-if="item.value==scope.row.abnormalType">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增销售出库弹窗底部 -->
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
        <!--<el-button type="primary" @click="handleAuditBill('1')">撤 销</el-button>-->
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/deliveryAdnormalFeedback';
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "straightStockOutView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          deliverDate: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          currencyId: '1',
          note: undefined,
          accountMethod: '1',
          repayCondition: '2',
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        abnormalOptions:[
          {
            label:"少货",
            value:'1'
          },
          {
            label:"多货",
            value:'2'
          },
          {
            label:"坏货",
            value:'3'
          },
          {
            label:"其他",
            value:'4'
          },
        ],
        processId: undefined,
        comment: undefined,
        accountMethodOptions: [],
        repayConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
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
          var height = 334;
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
          });
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax));
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount));
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'tax' || column.property === 'taxAmount') {
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
