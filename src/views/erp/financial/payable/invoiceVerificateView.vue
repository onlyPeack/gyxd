<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>发票核销详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <div class="association-creation">
          <el-button type="text" size="medium" @click="handleUpdateBill">
            作废
          </el-button>
      </div>
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
              <el-form-item label="供应商名称:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发票号码:" prop="invoiceNo" class="el-form-flex">
               {{dataForm.invoiceNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发票代码:" prop="note" class="el-form-flex">
                  {{dataForm.invoiceCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="未核销金额:" prop="notCancelAmount" class="el-form-flex">
                  {{dataForm.notCancelAmount}}
              </el-form-item>
            </td>
          </tr>
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
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="sourceBillNo" label="单据编号" align="left" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.sourceBillNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="型号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
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
      <el-table-column prop="cancelQty" label="核销数量" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.cancelQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="puchaseQty" label="采购数量" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.puchaseQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="returnGoodsQty" label="退货数量" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.returnGoodsQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="puchasePrice" label="采购单价" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.puchasePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cancelAmount" label="核销金额" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.cancelAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="notCancelAmount" label="未核销金额" width="180" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.notCancelAmount}}</span>
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
  import {addBill, getBill, tempAddBill, auditBill, updateBill } from '@/api/erp/financial/invoiceVertificate';
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
      handleUpdateBill() {
        updateBill(this.id).then(res => {
          if(res.code == '2000') {
            this.$message.success('作废成功')
            this.$emit('handleUpdate', false)
          } else {
            this.$message.warning(res.msg)
          }
        })
      },
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
