<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>异仓调拨单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
       <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
            <td width="50%">
              <!-- <el-form-item label="调出:" prop="totalTransferAmt" class="el-form-flex">
                {{dataForm.totalTransferAmt}}
              </el-form-item> -->
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调出仓库:" prop="outWarehouseName" class="el-form-flex">
                {{dataForm.outWarehouseName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调入仓库:" prop="inWarehouseName" class="el-form-flex">
                {{dataForm.inWarehouseName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="收货地址:" prop="receiptAdress" class="el-form-flex">
                {{dataForm.receiptAdress}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
                {{dataForm.receiverName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="联系方式:" prop="receiptAdress" class="el-form-flex">
                {{dataForm.receiptAdress}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="寄件方式:" prop="sendType" class="el-form-flex">
                {{dataForm.sendType}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="物流:" prop="deliveryCompany" class="el-form-flex">
                {{dataForm.deliveryCompany}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="物流单号:" prop="deliveryNo" class="el-form-flex">
                {{dataForm.deliveryNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="150" align="center" sortable>
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="outPositionName" label="调出仓位" align="center"  width="180">
      </el-table-column>
      <el-table-column prop="inPositionName" label="调入仓位" align="center"  width="180">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="qty" label="数量" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
      </el-table-column>
      <el-table-column prop="stockType" label="库存类型" width="180">
      </el-table-column>
      <el-table-column label="入库日期" prop="updTime" width="150">
      </el-table-column>
<!--      <el-table-column prop="locationName" label="仓位" width="180" align="left">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.locationName}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="note" label="备注" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

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
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/changeWarehouse';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "platformAllocationOrderView",
    props: ['id', 'dialogFormVisible', 'typeOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isRejectLoading: false,
        isAgreeLoading: false,
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          customerOrderNo: undefined,
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          shipperCode: undefined,
          shipperName: undefined,
          lockingOrderNo: undefined,
          allocationType: 1,
          note: undefined,
          billStatus: undefined,
          totalTransferAmt: undefined,
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
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
          var height = 211;
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
          if (column.property === 'transferQty') {
            values = data.map(item => Number(item.transferQty));
          } else if (column.property === 'transferAmt') {
            values = data.map(item => Number(item.transferAmt));
          }

          if (column.property === 'transferQty' || column.property === 'transferAmt') {
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
