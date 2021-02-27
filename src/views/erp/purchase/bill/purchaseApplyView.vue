<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>采购申请单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td colspan="2">
              <el-form-item label="需求客户:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="需求仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="申请类型:" prop="type" class="el-form-flex">
                <div v-for="item in typeOptions">
                  <span v-if="dataForm.type==item.value">{{item.label}}</span>
                </div>
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

    <el-table :data="items" border highlight-current-row width="100%" show-summary :summary-method="getSummaries" :height="clientHeight"
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="salesOrderBillNo" label="客户订货单编号" align="left" width="180" v-if="dataForm.type=='1'">
        <template slot-scope="scope">
          <span>{{scope.row.salesOrderBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notOrderQty" label="未订货数量" align="right" width="150" v-if="dataForm.type=='1'">
        <template slot-scope="scope">
          <span>{{scope.row.notOrderQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" align="left" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" align="left" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.deliveryDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releaseQty" label="可用数量" align="right" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.releaseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="applyQty" label="申请数量(*)" align="right" width="100" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.applyQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="releasePrice" label="发布单价" align="right" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.releasePrice}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="transferPrice" label="调拨价(*)" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣(*)" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPriceSum" label="调拨金额" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.transferPriceSum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="publisherName" label="采购员" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.publisherName}}</span>
        </template>
      </el-table-column>
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>


    <!-- 新增采购申请单弹窗底部 -->
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
        <!--<el-button type="primary">-->
        <!--<router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印</router-link>-->
        <!--</el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseApply';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "purchaseApplyView",
    props: ['id', 'dialogFormVisible', 'typeOptions', 'taskType', 'step'],
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
          customerCode: undefined,
          customerName: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          type: '1',
          note: undefined,
          billStatus: undefined,
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
          var height = 252;
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
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'applyQty') {
            values = data.map(item => Number(item.applyQty));
          } else if (column.property === 'transferPriceSum') {
            values = data.map(item => Number(item.transferPriceSum));
          }

          if (column.property === 'applyQty' || column.property === 'transferPriceSum' ) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'applyQty') {
                  this.dataForm.applyQty = getFloat((prev + curr), 4)
                }
                if (column.property === 'transferPriceSum') {
                  this.dataForm.transferPriceSum = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(2);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
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
