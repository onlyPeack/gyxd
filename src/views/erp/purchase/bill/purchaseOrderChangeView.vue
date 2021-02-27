<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>采购订单变更单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
<!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                {{dataForm.sourceBillNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="采购员:" prop="purchaserName" class="el-form-flex">
                {{dataForm.purchaserName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="币别:" prop="currencyName" class="el-form-flex">
                <div v-for="item in currencyOptions">
                  <span v-if="dataForm.currencyId==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="变更原因:" prop="changeReason" class="el-form-flex">
                <el-input v-model="dataForm.changeReason" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
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
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="原数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="原单价" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.price.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="原采购金额" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newQty" label="新数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.newQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newPrice" label="新单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.newPrice.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newAmount" label="新采购金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.newAmount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliverDate" label="交货日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.deliverDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
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


    <!-- 采购订单变更单详情弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <!-- <div v-if="dataForm.billStatus && dataForm.billStatus==2 && isPurchaseOrder == false" style="margin-bottom: 10px;">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div> -->
      <div v-if="dataForm.billStatus && dataForm.billStatus==2 && isPurchaseOrder == false">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
        <span  style="float: left;display: inline-block;margin:10px 0">

        <el-button type="warning" @click="handleAuditBill('5')" :loading="isRejectLoading">驳 回</el-button>
        <el-button type="primary" @click="handleAuditBill('4')" :loading="isAgreeLoading">同 意</el-button>
        </span>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        <!--<el-button type="primary" @click="handleAuditBill('1')" :loading="isRevokeLoading">撤 销</el-button>-->
        <!--<el-button type="primary">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose" style="">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseOrderChange';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "purchaseOrderChangeView",
    props: ['id', 'dialogFormVisible','step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isAgreeLoading: false,
        isRejectLoading: false,
        isRevokeLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          supplierId: undefined,
          supplierName: undefined,
          currencyId: '1',
          changeReason: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        supplierVisible: false,
        purchaseUserVisible: false,
        productVisible: false,
        rules: {},
        isPurchaseOrder: window.location.hash.includes('purchase_order_change'),
        comment:undefined,
        processId: undefined,
      };
    },
    created() {
      console.log('billStatus');
      console.log(this.dataForm.billStatus);
      console.log('是否在采购订单');
      console.log(this.isPurchaseOrder);
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'newQty') {
            values = data.map(item => Number(item.newQty));
          } else if (column.property === 'newAmount') {
            values = data.map(item => Number(item.newQty * item.newPrice));
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'newQty' || column.property === 'newAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
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
          opinion: val == 5 ? '驳回' : '同意',
          comment: this.comment
        };
        console.log('dataForm');
        console.log(this.dataForm);
        if (val == '5') {
          this.isRejectLoading = true;
        } else if (val == '4') {
          this.isAgreeLoading = true;
        } else {
          this.isRevokeLoading = true;
        }
        auditBill(this.dataForm).then(response => {
          if (val == '5') {
            this.isRejectLoading = false;
          } else if (val == '4') {
            this.isAgreeLoading = false;
          } else {
            this.isRevokeLoading = false;
          }
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('submitDetailSuccess');
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        }).catch(res => {
          if (val == '5') {
            this.isRejectLoading = false;
          } else if (val == '4') {
            this.isAgreeLoading = false;
          } else {
            this.isRevokeLoading = false;
          }
        })
      }
    }
  }
</script>
