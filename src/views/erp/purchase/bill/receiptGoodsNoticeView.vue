<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>收货通知单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
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
            <td width="50%">
              <el-form-item label="联系人:" prop="linkPerson" class="el-form-flex">
                {{dataForm.linkPerson}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="联系电话:" prop="linkPhone" class="el-form-flex">
                {{dataForm.linkPhone}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
               <el-form-item label="发货日期:" prop="deliverTime" class="el-form-flex">
                {{dataForm.deliverTime}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="预计到货日期:" prop="expectArrivalDate" class="el-form-flex">
                {{dataForm.expectArrivalDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到货仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="币别:" prop="currencyName" class="el-form-flex">
                <div v-for="item in currencyOptions">
                  <span v-if="dataForm.currencyId==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="付款条件:" prop="repayCondition" class="el-form-flex">
                <div v-for="item in repayConditionOptions">
                  <span v-if="dataForm.repayCondition==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="结算方式:" prop="accountMethod" class="el-form-flex">
                <div v-for="item in accountMethodOptions">
                  <span v-if="dataForm.accountMethod==item.value">{{item.label}}</span>
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
              class="tb-detail tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <!-- <el-table-column prop="positionName" label="仓位" width="150" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column> -->
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
<!--      <el-table-column prop="canGoodsQty" label="可做收货数量" width="120" align="right" class-name="col-required">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{scope.row.canGoodsQty}}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column prop="qty" label="数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.price.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.taxRate}}%</span></template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.tax.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxPrice.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.taxAmount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliverDate" label="交货日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.deliverDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="packingNumber" label="装箱单号" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.packingNumber}}</span>
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

    <!-- 收货通知单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==2" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('5')" :loading="isRejectLoading">驳 回</el-button>
        <el-button type="primary" @click="handleAuditBill('4')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        <el-button type="primary" @click="handleAuditBill('1')" :loading="isRevokeLoading">撤 销</el-button>
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
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/purchaseReceiptGoodsNotice';
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: "receiptGoodsNoticeView",
    props: ['id', 'dialogFormVisible'],
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
          deliverDate: undefined,
          linkPerson: undefined,
          linkPhone: undefined,
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          currencyId: '1',
          billAmount: undefined,
          taxBillAmount: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          accountMethod: '1',
          repayCondition: '1',
          items: []
        },
        items: [],
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
          });
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
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
                if (column.property === 'amount') {
                  this.dataForm.billAmount = getFloat((prev + curr), 4)
                }
                if (column.property === 'taxAmount') {
                  this.dataForm.taxBillAmount = getFloat((prev + curr), 4)
                }
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
        if (val == '5') {
          this.isRejectLoading = true;
        } else if (val == '4') {
          this.isAgreeLoading = true;
        } else {
          this.isRevokeLoading = true;
        }
        auditBill(this.id, val).then(response => {
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
