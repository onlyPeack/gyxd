<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>供货信息变更单详情</span>
        <span class="cont-title-billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="发布类型:" prop="publishType" class="el-form-flex">
                <div style="width: 100%;">
                  <span v-if="dataForm.publishType == item.value" v-for="item in publishTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                    {{item.label}}
                  </span>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  {{dataForm.billNo}}
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="到货仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="渠道类型:" prop="channelType" class="el-form-flex">
                <div style="width: 100%;">
                  <span v-if="dataForm.channelType == item.value" v-for="item in channelTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                     {{item.label}}
                  </span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商编号:" prop="supplierCode" class="el-form-flex">
                {{dataForm.supplierCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商仓库:" prop="supplierWarehouse" class="el-form-flex">
                {{dataForm.supplierWarehouse}}
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
              <el-form-item label="供应商地址:" prop="supplierWarehouseAddress" class="el-form-flex">
                {{dataForm.supplierWarehouseAddress}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td  colspan="2">
              <el-form-item label="发布范围:" prop="publishScope" class="el-form-flex">
                <div v-model="dataForm.publishScope" style="width: 100%;"
                           @change="$refs.dataForm.validateField('channelType')">
                  <span v-for="item in scopeTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                     {{item.label}}
                  </span>
                </div>
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
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="140">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="供货价" width="100" align="right" v-if="dataForm.publishType == '0'?false:true">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="point" label="供货折扣" width="100" align="right" v-if="dataForm.publishType == '0'?false:true">
        <template slot-scope="scope">
          <span>{{scope.row.point}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="发布数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="发布单价(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="发布折扣(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amountPrice" label="发布总额(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期(天)" width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.deliveryDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="validityPeriod" label="信息有效期(*)" width="150" align="left" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.validityPeriod}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="moqMinOrder" label="最小起订量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.moqMinOrder}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
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
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill,auditBill } from '@/api/erp/purchase/bill/purchaseGoodsReleaseChange';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "purchaseGoodsReleaseChangeView",
    props: ['id', 'dialogFormVisible', 'publishTypeOptions', 'channelTypeOptions','scopeTypeOptions', 'taskType', 'step'],
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        processId: undefined,
        comment: undefined,
        dataForm: {
          id: undefined,
          billNo: undefined,
          warehouseArr: [],
          warehouseId: undefined,
          warehouseName: undefined,
          channelType: undefined,
          publishType: undefined,
          note: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        rules: {},
        list: null,
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
          var height = 140;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getBill(this.id)
          .then(response => {
            response.data.publishType = response.data.publishType.toString();
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
      }
    }
  }
</script>
