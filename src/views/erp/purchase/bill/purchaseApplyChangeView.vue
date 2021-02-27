<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>采购申请变更单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="新需求仓库:" prop="newWarehouseName" class="el-form-flex">
                {{dataForm.newWarehouseName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="原需求仓库:" prop="oldWarehouseName" class="el-form-flex">
                {{dataForm.oldWarehouseName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="变更原因:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.changeReason" type="textarea" :rows="3" placeholder="请输入内容"
                          readonly></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight" show-summary
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
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
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releaseQty" label="发布数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.releaseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="oldApplyQty" label="原申请数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.oldApplyQty}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="canChangeQty" label="可变更数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.canChangeQty}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="newApplyQty" label="新申请数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.newApplyQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="发布单价" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.releasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="调拨价" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.transferDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!--弹窗底部 -->
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
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseApplyChange';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "purchaseApplyChangeView",
    props: ['id', 'dialogFormVisible','taskType','step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          customerCode: undefined,
          customerName: undefined,
          oldWarehouseId: undefined,
          newWarehouseId: undefined,
          oldWarehouseName: undefined,
          newWarehouseName: undefined,
          note: undefined,
          sourceBillNo: undefined,
          changeReason: undefined,
          billStatus: undefined,
          items: [],
        },
        processId:undefined,
        items: [],
        rules: {},
        list: null
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
      handleAuditBill(val) {
        console.log(this.step);
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 158;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              if (response.data.items == undefined) {
                this.this.items = [];
              } else {
                this.items = response.data.items;
              }
               var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
              this.getProcessId(billPrefix);
            });
        }
      },
      getProcessId(billPrefix) {
        console.log('请求id');
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          console.log('response');
          console.log(response);
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
      handleClose() {
        this.$emit('handleClose', false)
      }
    }
  }
</script>
