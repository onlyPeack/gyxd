<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>采购退库单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <div class="association-creation">关联创建</div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                {{dataForm.sourceBillNo}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="退货类型:" prop="supplierName" class="el-form-flex">
                <div v-for="item in returnTypeOptions" :key="item.value">
                  <span v-if="dataForm.returnType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <!-- <td>
              <el-form-item label="出库仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td> -->
          </tr>
          <tr>
            <td>
              <el-form-item label="采购员:" prop="purchaserName" class="el-form-flex">
                {{dataForm.purchaserName}}
              </el-form-item>
            </td>
            <td>
               <el-form-item label="部门:" prop="departName" class="el-form-flex">
                {{dataForm.departName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供货单位:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
            <td>
               <el-form-item label="退货仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
                {{dataForm.receiverName}}
              </el-form-item>
            </td>
            <td>
               <el-form-item label="收货人电话:" prop="receiverPhone" class="el-form-flex">
                {{dataForm.receiverPhone}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发货方式:" prop="deliveryType" class="el-form-flex">
                <div v-for="item in deliveryTypeOptions" :key="item.value">
                  <span v-if="dataForm.deliveryType==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="公司地址(省市县):" prop="" class="el-form-flex">
                {{dataForm.province + dataForm.city + dataForm.county}}
              </el-form-item>
            </td>
            <td>
               <el-form-item label="详细地址:" prop="receiverAddress" class="el-form-flex">
                {{dataForm.receiverAddress}}
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
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="采购合同号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus" readonly="readonly" class="readonly-el-input center-el-input">{{item.label}}</span>
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="brandName" label="品牌" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存数量" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="canGoodsQty" label="可退数量" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.canGoodsQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="退货数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="退款单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="退款金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unpaidAmount" label="订单未付款金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.unpaidAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchasingPrice" label="进价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.purchasingPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkPrice" label="考核价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.checkPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebate" label="返点" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.rebate}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.taxRate}}%</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockType" label="库存类型" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.stockType}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="类型" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsShelves" label="货架" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.goodsShelves}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 采购退库详情弹窗底部 -->
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
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/purchaseStockReturn';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "purchaseStockReturnView",
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
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          currencyId: '1',
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {},
        returnTypeOptions: [
          { value: "1", label: "期货退货" },
          { value: "2", label: "实物退货" },
        ],
        deliveryTypeOptions:[
          { value: "1", label: "自提" },
          { value: "2", label: "急件" },
          { value: "3", label: "快件" },
          { value: "4", label: "货运" },
          { value: "5", label: "到付" },
          { value: "6", label: "其他" },
        ],
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
        let { columns, data } = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "合计";
            return;
          }
          if (column.property === "qty") {
            values = data.map((item) => Number(item.qty));
          } else if (column.property === "unpaidAmount") {
            values = data.map((item) => Number(item.unpaidAmount));
          } else if (column.property === "taxAmount") {
            values = data.map((item) => Number(item.taxAmount));
          }

          
          if (
            column.property === "unpaidAmount" ||
            column.property === "taxAmount"
          ) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4).toFixed(4);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += " ";
          } else if (
            column.property === "qty"
          ) {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 0);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += " ";
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
