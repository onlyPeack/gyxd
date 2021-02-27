<template>
  <el-dialog
    :visible.sync="dialogFormVisible"
    width="70%"
    @close="handleClose"
    class="billFormDialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <span slot="title" class="con-title">
      <svg-icon icon-class="contract"></svg-icon>
      <span v-if="!dataForm.id">新增采购退库单</span>
      <span v-if="dataForm.id">编辑采购退库单</span>
      <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
    </span>

    <div class="center-container">
      <!--      <div class="association-creation">关联创建</div>-->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" type="text" placeholder="单据编号自动带出" readonly></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker
                  v-model="dataForm.billDate"
                  align="right"
                  type="date"
                  style="width: 200px;"
                  placeholder="请选择日期"
                ></el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="退货类型:" prop="returnType" class="el-form-flex">
                <el-select v-model="dataForm.returnType" style="width: 100%;">
                  <el-option
                    v-for="item in returnTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div
                  @click="handlePurchaseOrderSelector"
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                >
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag
                    v-for="tag in sourceBillNoArr"
                    :key="tag.billNo"
                    @close="handleSourceBillNoDel"
                  >{{tag.billNo}}</el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="采购员:" prop="supplierName" class="el-form-flex">
                <div
                  @click="handlePurchaseOrderSelector"
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                >
                  <svg-icon icon-class="add"></svg-icon>
                  <el-tag v-for="tag in dataForm.purchaserUserArr" :key="tag.id">{{tag.name}}</el-tag>
                </div>
              </el-form-item>
            </td>
            <!-- <td>
              <el-form-item label="部门:" prop="departName" class="el-form-flex">
                <el-input v-model="dataForm.departName"></el-input>
              </el-form-item>
            </td> -->
          </tr>
          <tr>
            <td>
              <el-form-item label="供货单位:" prop="supplierName" class="el-form-flex">
                 <div
                  @click="handleSupplierSelector"
                  style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                >
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in supplierArr" :key="tag.id">{{tag.supplierName}}</el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item
                label="退货仓库:"
                prop="warehouseName"
                class="el-form-flex"
                v-if="dataForm.warehouseArr && dataForm.warehouseArr[0].warehouseName"
              >
                <el-tag
                  v-for="tag in dataForm.warehouseArr"
                  :key="tag.warehouseId"
                >{{tag.warehouseName}}</el-tag>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
                <el-input v-model="dataForm.receiverName" placeholder="请输入收货人姓名"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收货人电话:" prop="receiverPhone" class="el-form-flex">
                <el-input v-model="dataForm.receiverPhone" placeholder="请输入收货人电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="公司地址(省市县)" prop="regionCodes" class="el-form-flex">
                <template slot="label">
                  <span style="vertical-align: sub">公司地址(省市县)</span>
                </template>
                <div style="width: 100%;display: inline-block;padding-top: 5px;">
                  <el-cascader
                    style="width: 100%"
                    size="large"
                    :options="options"
                    v-model="dataForm.regionCodes"
                    class="regionCode_input"
                    @change="handleChange"
                  ></el-cascader>
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="详细地址:" prop="receiverAddress" class="el-form-flex">
                <el-input v-model="dataForm.receiverAddress" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发货方式:" prop="deliveryType" class="el-form-flex">
                <el-select v-model="dataForm.deliveryType" style="width: 100%;">
                  <el-option
                    v-for="item in deliveryTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table
      :data="items"
      border
      highlight-current-row
      width="100%"
      :height="clientHeight"
      class="tb-edit"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-minus"
            @click="handleValueDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="billNo" label="采购合同号" width="180" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.billNo"
            readonly="readonly"
            class="readonly-el-input center-el-input"
          ></el-input>
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.skuName"
            readonly="readonly"
            class="readonly-el-input center-el-input"
          ></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus" readonly="readonly" class="readonly-el-input center-el-input">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column prop="brandName" label="品牌" width="180" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.brandName"
            readonly="readonly"
            class="readonly-el-input center-el-input"
          ></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.seriesName"
            readonly="readonly"
            class="readonly-el-input center-el-input"
          ></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.itemNo"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'itemNo', $event)"
          ></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.specifications"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"
          ></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存数量" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.stock"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'stock', $event)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="canGoodsQty" label="可退数量" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.canGoodsQty"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'canGoodsQty', $event)"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="退货数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.qty"
            class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
            :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
            @input="handleInputFun($event, scope.row, 'qty')"
          ></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="taxPrice"
        label="退款单价"
        width="120"
        align="right"
        class-name="col-required"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.taxPrice"
            class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
            :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"
            @input="handleInputFun($event, scope.row, 'taxPrice')"
          ></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="taxAmount"
        label="退货金额"
        width="120"
        align="right"
        class-name="col-required"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.taxAmount"
            class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'taxAmount', $event)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
            :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"
            @input="handleInputFun($event, scope.row, 'taxAmount')"
          ></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unpaidAmount" label="订单未付款金额" width="180" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.unpaidAmount"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'unpaidAmount', $event)"
          ></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="purchasingPrice" label="进价" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.purchasingPrice"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'purchasingPrice', $event)"
          ></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="checkPrice" label="考核价" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.checkPrice"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'checkPrice', $event)"
          ></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebate" label="返点" width="180">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.rebate"
            readonly="readonly"
            class="readonly-el-input"
            @change="handleEdit(scope.$index, scope.row , 'rebate', $event)"
          ></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="taxRate" label="税率" width="80" align="center">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.taxRate"
            size="small"
            placeholder=" "
            @change="handleEdit(scope.$index, scope.row , 'taxRate', $event)"
          >
            <el-option
              v-for="item in taxRateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span>{{scope.row.taxRate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" width="120" align="right">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.tax"
            readonly="readonly"
            class="readonly-el-input right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'tax', $event)"
          ></el-input>
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="taxPrice"
        label="含税单价"
        width="120"
        align="right"
        class-name="col-required"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.taxPrice"
            class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'taxPrice', $event)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+5)"
            :ref="'tableElInput'+(scope.$index*tableElInputNum+5)"
            @input="handleInputFun($event, scope.row, 'taxPrice')"
          ></el-input>
          <span>{{scope.row.taxPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="taxAmount"
        label="价税合计"
        width="120"
        align="right"
        class-name="col-required"
      >
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.taxAmount"
            class="right-el-input"
            @change="handleEdit(scope.$index, scope.row , 'taxAmount', $event)"
            @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
            :ref="'tableElInput'+(scope.$index*tableElInputNum+6)"
            @input="handleInputFun($event, scope.row, 'taxAmount')"
          ></el-input>
          <span>{{scope.row.taxAmount}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.unit"
            readonly="readonly"
            class="readonly-el-input center-el-input"
            @change="handleEdit(scope.$index, scope.row , 'unit', $event)"
          ></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="stockType" label="库存类型" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.stockType"></el-input>
          <span>{{scope.row.stockType}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.type"></el-input>
          <span>{{scope.row.type}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="goodsShelves" label="货架" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.goodsShelves"></el-input>
          <span>{{scope.row.goodsShelves}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 供货单位列表弹窗-->
    <div v-if="supplierVisible">
      <el-dialog title="请选择供货单位" :visible.sync="supplierVisible" append-to-body>
        <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier" :supplierName="dataForm.supplierName"></supplier-selector>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancelSupplier">取 消</el-button>
          <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 采购员列表弹窗-->
    <el-dialog title="请选择采购员" :visible.sync="purchaseUserVisible" append-to-body>
      <purchase-user-selector
        @closeUserDialog="closeUserDialog"
        :isSingle="true"
        ref="purchaseUser"
      ></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelPurchaserUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitPurchaserUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增采购退库弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>

    <!-- 关联单据 -->
    <purchase-stock-in-selector
      :dialogSelectorVisible="dialogSelectorVisible"
      v-if="dialogSelectorVisible"
      @submitSelectorSuccess="submitSelectorSuccess"
      @handleSelectorClose="handleSelectorClose"
      :returnType="dataForm.returnType"
    ></purchase-stock-in-selector>
  </el-dialog>
</template>

<script>
import { getFloat } from "@/utils/util";
import { getObj } from "@/api/erp/purchase/supplier/index";
import { regionData, CodeToText } from "element-china-area-data";
import {
  addBill,
  getBill,
  tempAddBill,
} from "@/api/erp/wms/bill/purchaseStockReturn";
import { page as userPage } from '@/api/admin/user/index'
import {page as supplierPage} from '@/api/erp/purchase/supplier/index';

export default {
  name: "purchaseStockReturnForm",
  components: {
    "purchase-user-selector": () => import("@/components/ERP/User/user"),
    "supplier-selector": () =>
      import("@/components/ERP/Supplier/supplierSelector"),
    "warehouse-selector": () =>
      import("@/components/ERP/Warehouse/WarehouseSelector"),
    "purchase-stock-in-selector": () =>
      import("../components/purchaseStockInSelector"),
  },
  props: ["id", "dialogFormVisible"],
  data() {
    return {
      clientHeight: 300,
      isFormLoading: false,
      isTemporaryLoading: false,
      dataForm: {
        id: undefined,
        billNo: undefined,
        billDate: undefined,
        supplierId: undefined,
        supplierName: undefined,
        supplierCode: undefined,
        purchaserId: undefined,
        purchaserName: undefined,
        purchaserCode: undefined,
        currencyId: "1",
        regionCodes: [],
        billAmount: undefined,
        taxBillAmount: undefined,
        note: undefined,
        warehouseArr: undefined,
        warehouseId: undefined,
        warehouseName: undefined,
        billStatus: undefined,
        sourceBillNo: undefined,
        sourceObjectKey: undefined,
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
      },
      items: [],
      purchaserUserArr: [],
      supplierArr: [],
      sourceBillNoArr: [],
      selectedProducts: [],
      supplierVisible: false,
      purchaseUserVisible: false,
      options: regionData,
      CodeToText,
      rules: {
        billDate: [
          {
            required: true,
            message: "请选择单据日期",
            trigger: "blur",
          },
        ],
        sourceBillNo: [
          {
            required: true,
            message: "请选择关联单据",
            trigger: "blur",
          },
        ],
        purchaserName: [
          {
            required: true,
            message: "请选择采购员",
            trigger: "blur",
          },
        ],
        regionCodes: [
          {
            required: true,
            message: "请选择公司地址",
            trigger: "blur",
          },
        ],
        supplierName: [
          {
            required: true,
            message: "请选择供货单位",
            trigger: "blur",
          },
        ],
        warehouseName: [
          {
            required: true,
            message: "请选择出库仓库",
            trigger: "blur",
          },
        ],
        receiverName: [
          {
            required: true,
            message: "请输入收货人姓名",
            trigger: "blur",
          },
        ],
        receiverPhone: [
          {
            required: true,
            message: "请输入收货人电话",
            trigger: "blur",
          },
        ],
        receiverAddress: [
          {
            required: true,
            message: "请输入收货地址",
            trigger: "blur",
          },
        ],
        deliveryType: [
          {
            required: true,
            message: "请选择发货方式",
            trigger: "blur",
          },
        ],
      },
      returnTypeOptions: [
        { value: "1", label: "期货退货" },
        { value: "2", label: "实物退货" },
      ],
      deliveryTypeOptions: [
        { value: "1", label: "自提" },
        { value: "2", label: "急件" },
        { value: "3", label: "快件" },
        { value: "4", label: "货运" },
        { value: "5", label: "到付" },
        { value: "6", label: "其他" },
      ],
      list: null,
      dialogVisible: false,
      dialogSelectorVisible: false,
      warehouseVisible: false,
      tableElInputNum: 6,
      warehousePositionIndex: undefined,
      skuNo: undefined,
    };
  },
  created() {
    this.init();
    this.changeDivHeight();
    const _this = this;
    window.onresize = function () {
      _this.changeDivHeight();
    };
  },
  updated() {
    this.changeDivHeight();
  },
  methods: {
    handleChange() {
      this.dataForm.province = CodeToText[this.dataForm.regionCodes[0]];
      this.dataForm.city = CodeToText[this.dataForm.regionCodes[1]];
      this.dataForm.county = CodeToText[this.dataForm.regionCodes[2]];
      this.dataForm.location =
        CodeToText[this.dataForm.regionCodes[0]] +
        "/" +
        CodeToText[this.dataForm.regionCodes[1]] +
        "/" +
        CodeToText[this.dataForm.regionCodes[2]];
    },
    changeDivHeight() {
      if (document.getElementsByClassName("center-container")[0]) {
        var height = document.getElementsByClassName("center-container")[0]
          .clientHeight;
      } else {
        var height = 211;
      }
      if (this.id && this.id != "") {
        height = height + 20;
      }
      this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
    },
    changeFocusInput(e, index, number) {
      if (e.keyCode == 37) {
        //console.log('拦截到37');//左
        this.keyboardEvents("left", number);
      } else if (e.keyCode == 38) {
        //console.log('拦截到38');//上
        this.keyboardEvents("up", number);
      } else if (e.keyCode == 39) {
        //console.log('拦截到39');//右
        this.keyboardEvents("right", number);
      } else if (e.keyCode == 40) {
        //console.log('拦截到40');//下
        this.keyboardEvents("down", number);
      } else if (e.keyCode == 13) {
        //console.log('拦截到13');//enter键
        this.keyboardEvents("enter", number);
      }
    },
    keyboardEvents(type, number) {
      var total = this.items.length * this.tableElInputNum;

      if (type == "enter" && number + 1 <= total) {
        number++;
      } else if (type == "left" && number - 1 > 0) {
        number--;
      } else if (type == "right" && number + 1 <= total) {
        number++;
      } else if (type == "up" && number - this.tableElInputNum > 0) {
        number = number - this.tableElInputNum;
      } else if (type == "down" && number + this.tableElInputNum <= total) {
        number = number + this.tableElInputNum;
      }

      this.$refs["tableElInput" + number].$el.querySelector("input").focus();
      this.$refs["tableElInput" + number].$el.querySelector("input").select();
    },
    init() {
      if (this.id != "") {
        getBill(this.id).then((response) => {
          this.dataForm = response.data;
          this.dataForm.returnType = String(this.dataForm.returnType);
          this.dataForm.deliveryType = String(this.dataForm.deliveryType);
          this.dataForm.purchaserUserArr = [];
          this.dataForm.purchaserUserArr.push({
            id: response.data.purchaserId,
            name: response.data.purchaserName,
          });
          this.supplierArr = [];
          this.supplierArr.push({
            id: response.data.supplierId,
            supplierName: response.data.supplierName,
          });
          if (response.data.sourceBillNo && response.data.sourceBillNo != "") {
            this.sourceBillNoArr = [{ billNo: response.data.sourceBillNo }];
          }
          if (response.data.items == undefined) {
            this.handleValueAdd();
          } else {
            this.items = response.data.items;
          }
        });
      } else {
        let date = new Date().toLocaleDateString().replace(/\//g, "-");
        this.dataForm.billDate = date;
        this.dataForm.purchaserId = this.$store.state.user.id;
        this.dataForm.purchaserName = this.$store.state.user.name;
        this.dataForm.purchaserCode = this.$store.state.user.code;
        this.handleValueAdd();
      }
    },
    handleClose() {
      this.$emit("handleClose", false);
    },
    handleValueAdd() {
      const d = {
        date: "",
        taxRate: this.defaultTaxRate,
      };
      this.items.push(d);
    },
    handleValueDelete(index, r) {
      let ValueIndex = this.items.length;
      if (ValueIndex === 1) {
        return;
      }
      this.items.splice(index, 1);
    },
    handleEdit(index, row, type, val) {
      if (row.qty && row.qty != "") {
        if (type == "qty" || type == "price" || type == "taxRate") {
          if (type == "qty") {
            if (this.dataForm.returnType == 2 && row.qty > row.canGoodsQty) {
              this.$message.warning("退货数量不能大于可退数量!");
              row.qty = row.canGoodsQty;
              this.vueSet(
                this.items[index],
                "taxAmount",
                Number(row.taxPrice * row.qty).toFixed(2)
              );
              return;
            }
          }
          if(this.dataForm.returnType == 1) {
            if (row.price && row.price != "") {
              //金额
              row.amount = Number(row.qty * row.price).toFixed(2);
              this.vueSet(this.items[index], "amount", row.amount);
            } else {
              this.vueSet(this.items[index], "amount", "0.00");
              this.vueSet(this.items[index], "tax", "0.00");
              this.vueSet(this.items[index], "taxAmount", "0.00");
              return;
            }
          } else {
            //金额
              row.amount = Number(row.qty * row.taxPrice).toFixed(2);
              this.vueSet(this.items[index], "amount", row.amount);
          }
        } else if (type == "amount") {
          //单价
          this.vueSet(
            this.items[index],
            "price",
            Number(row.amount / row.qty).toFixed(2)
          );
        } else if (type == "taxPrice") {
          //单价
          row.price = Number(
            row.taxPrice / (1 + parseInt(row.taxRate) / 100)
          ).toFixed(2);
          this.vueSet(this.items[index], "price", row.price);
          //金额
          this.vueSet(
            this.items[index],
            "amount",
            (row.price * row.qty).toFixed(2)
          );
        } else if (type == "taxAmount") {
          //含税单价
          row.taxPrice = Number(row.taxAmount / row.qty).toFixed(2);
          //this.vueSet(this.items[index], 'taxPrice',row.taxPrice);
          //单价
          row.price = Number(
            row.taxPrice / (1 + parseInt(row.taxRate) / 100)
          ).toFixed(2);
          this.vueSet(this.items[index], "price", row.price);
          //金额
          this.vueSet(
            this.items[index],
            "amount",
            (row.price * row.qty).toFixed(2)
          );
        }
        //税额
        this.vueSet(
          this.items[index],
          "tax",
          Number((row.amount * parseInt(row.taxRate)) / 100).toFixed(2)
        );
        //含税单价
        if(this.dataForm.returnType == 1) {
          this.vueSet(
            this.items[index],
            "taxPrice",
            Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(2)
          );
        } else {
          this.vueSet(
            this.items[index],
            "taxPrice",
            row.taxPrice
          );
        }
        //价税合计
        this.vueSet(
          this.items[index],
          "taxAmount",
          Number(row.taxPrice * row.qty).toFixed(2)
        );

        this.vueSet(this.items, index, this.items[index]);
      }
    },

    // 采购员选择
    handlePurchaserUserSelector() {
      this.purchaseUserVisible = true;
    },
    handleCancelPurchaserUser() {
      this.$refs.purchaseUser.reset();
      this.purchaseUserVisible = false;
    },
    handlePurchaserUserDel(index) {
      this.purchaserUserArr.splice(index, 1);
      this.dataForm.purchaserId = undefined;
      this.dataForm.purchaserName = undefined;
      this.dataForm.purchaserCode = undefined;
      this.$refs.purchaseUser.reset();
    },
    handleSubmitPurchaserUser() {
      this.$refs.purchaseUser.onSubmit();
    },
    closeUserDialog(list) {
      this.purchaserUserArr = list;
      this.purchaseUserVisible = false;
      if (list.length > 0) {
        this.dataForm.purchaserName = list[0].name;
        this.dataForm.purchaserId = list[0].id;
        this.dataForm.purchaserCode = list[0].purchaserCode;
      }
    },

    // 供货单位选择
    handleSupplierSelector() {
      // if(!this.supplierArr[0].id) {
      //   this.supplierVisible = true;
      // }
      this.supplierVisible = true;
    },
    handleCancelSupplier() {
      this.$refs.supplier.reset();
      this.supplierVisible = false;
    },
    handleSupplierDel(index) {
      this.supplierArr.splice(index, 1);
      this.dataForm.supplierId = undefined;
      this.dataForm.supplierName = undefined;
      this.dataForm.supplierCode = undefined;
      this.$refs.supplier.reset();
    },
    handleSubmitSupplier() {
      this.$refs.supplier.onSubmit();
    },
    closeSupplierDialog(list) {
      this.supplierArr = list;
      this.supplierVisible = false;
      if (list.length > 0) {
        this.dataForm.supplierName = list[0].supplierName;
        this.dataForm.supplierId = list[0].id;
        this.dataForm.supplierCode = list[0].supplierCode;
      }
    },

    //出库仓库
    handleWarehouseSelector() {
      this.warehouseVisible = true;
    },
    handleCancelWarehouse() {
      this.$refs.warehouse.reset();
      this.warehouseVisible = false;
    },
    data2Map(data) {
      let map = {};
      data.forEach(function (item, index) {
        item.index = index;
        map[item.skuNo] = item;
      });
      return map;
    },
    data3Map(data) {
      let map = {};
      data.forEach(function (item, index) {
        item.index = index;
        map[item.sourceBillId] = item;
      });
      return map;
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
              if (column.property === "amount") {
                this.dataForm.billAmount = getFloat(prev + curr, 4);
              }
              if (column.property === "taxAmount") {
                this.dataForm.taxBillAmount = getFloat(prev + curr, 4);
              }
              return getFloat(prev + curr, 4).toFixed(4);
            } else {
              return prev;
            }
          }, 0);

          sums[index] += " ";
        } else if (column.property === "qty") {
          sums[index] = values.reduce((prev, curr) => {
            let value = Number(curr);
            if (!isNaN(value)) {
              if (column.property === "amount") {
                this.dataForm.billAmount = getFloat(prev + curr, 0);
              }
              if (column.property === "taxAmount") {
                this.dataForm.taxBillAmount = getFloat(prev + curr, 0);
              }
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
    handleCancel() {
      this.$emit("handleCancelForm");
    },

    //关联单据选择
    handlePurchaseOrderSelector() {
      if (!this.dataForm.returnType) {
        this.$message.warning("请先选择退货类型!");
      } else {
        this.dialogSelectorVisible = true;
      }
    },
    handleSelectorClose() {
      this.dialogSelectorVisible = false;
    },
    handleSourceBillNoDel(index) {
      this.sourceBillNoArr.splice(index, 1);
      this.dataForm.sourceBillNo = undefined;
    },
    submitSelectorSuccess(obj) {
      // 期货退货
      if (this.dataForm.returnType == 1) {
        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.supplierArr = item.mainDTO.supplierArr; // 没有
            _this.dataForm.departName = item.departName;
            _this.dataForm.supplierName = item.mainDTO.supplierName;
            _this.dataForm.supplierCode = item.mainDTO.supplierCode;
            _this.dataForm.supplierId = item.mainDTO.supplierId;
            _this.dataForm.billNo = item.billNo;
            _this.dataForm.warehouseId = item.mainDTO.warehouseId;
            _this.dataForm.warehouseName = item.mainDTO.warehouseName;
            _this.dataForm.warehouseArr = [
              {
                warehouseName: item.mainDTO.warehouseName,
                warehouseId: item.mainDTO.warehouseId,
              },
            ];
            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.sourceBillNoArr = [{ billNo: item.mainDTO.billNo }];
            _this.dataForm.purchaserUserArr = item.mainDTO.purchaserUserArr;
            // 根据供应商ID查询供应商联系人
            getObj(_this.dataForm.supplierId).then((res) => {
            
              _this.$set(this.dataForm, "receiverName", res.data.linkMan);
              _this.$set(this.dataForm, "receiverPhone", res.data.linkPhone);
            });
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.billNo = item.billNo;
          itemObj.billStatus = item.billStatus;
          itemObj.sourceBillId = item.id;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsShelves = item.positionName;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.price + "";
          itemObj.skuName = item.skuName;
          itemObj.retailPrice = item.retailPrice;
          if (_this.dataForm.returnType == 1) {
            itemObj.qty = item.notStockInPurchaseQty + "";
          } else {
            itemObj.qty = item.qty + "";
          }
          if (_this.dataForm.returnType == 2) {
            itemObj.stock = item.qty;
          }
          itemObj.canGoodsQty = item.canGoodsQty + "";
          itemObj.amount = item.amount + "";
          // itemObj.rebate = item.rebate + "";
          itemObj.taxRate = item.taxRate + "";
          itemObj.tax = item.tax + "";
          itemObj.taxPrice = item.taxPrice + "";
          itemObj.taxAmount = item.taxAmount + "";
          itemObj.unpaidAmount = item.taxAmount - item.paymentApplyReturnAmount;
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.dialogSelectorVisible = false;
      } else {
        // 检查选择的商品的供应商和现有items里的供应商
        console.log('obj');
        console.log(obj);
        console.log('items');
        console.log(this.items);
        if(this.items.length > 1) {
          this.items.forEach(i => {
            if(i.supplierCode != obj.list[0].supplierCode) {
              this.$message.warning('仅支持关联同一供应商,请重新选择!');
              return;
            }
          })
        } else {
          // 实物退货
        if (obj.isClearAll) {
          this.items = [];
        }
        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);
        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            // _this.supplierArr = item.mainDTO.supplierArr; // 没有
            // _this.dataForm.departName = item.departName;
            if(item.supplierCode) {
              _this.dataForm.supplierName = item.supplierName;
              _this.dataForm.supplierCode = item.supplierCode;
            }
            // 根据供应商code查询供应商信息
            supplierPage({
              supplierCode:item.supplierCode
            }).then(res => {
              _this.$set(this.dataForm, "receiverName", res.data.records[0].linkMan);
              _this.$set(this.dataForm, "receiverPhone", res.data.records[0].linkPhone);
              _this.supplierArr = [{
                id:res.data.records[0].id,
                supplierCode:res.data.records[0].supplierCode,
                supplierName:res.data.records[0].supplierName,
              }]
            })
            // _this.dataForm.supplierId = item.mainDTO.supplierId;
            // _this.dataForm.billNo = item.billNo;
            _this.dataForm.warehouseId = item.warehouseId;
            _this.dataForm.warehouseName = item.warehouseName;
            _this.dataForm.warehouseArr = [
              {
                warehouseName: item.warehouseName,
                warehouseId: item.warehouseId,
              },
            ];
            _this.dataForm.sourceBillNo = item.batchNumber;
            _this.sourceBillNoArr = [{ billNo: item.batchNumber }];
            // 根据员工name获取原员工信息
            
            userPage({
              name:item.ownerName
            }).then(res => {
              _this.dataForm.purchaserUserArr = [{
                // code暂时没有
                code:res.data.rows[0].code,
                id:item.ownerId,
                name:item.ownerName
              }]
            })
            // 根据供应商ID查询供应商联系人
            // getObj(_this.dataForm.supplierId).then((res) => {
            //  
            //   _this.$set(this.dataForm, "receiverName", res.data.linkMan);
            //   _this.$set(this.dataForm, "receiverPhone", res.data.linkPhone);
            // });
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.taxPrice = item.purchasePrice;
          // itemObj.billNo = item.billNo;
          // itemObj.billStatus = item.billStatus;
          itemObj.sourceBillNo = item.batchNumber;
          // itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName; //有的有有的没有
          itemObj.seriesName = item.seriesName;
          itemObj.goodsShelves = item.warehousePositionName;
          // itemObj.categoryId = item.categoryId;
          // itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.iid = item.id;
          // itemObj.unit = item.unit;
          // itemObj.price = item.price + "";
          itemObj.skuName = item.skuName;
          itemObj.retailPrice = item.retailPrice;
          itemObj.qty = item.canGoodsQty + "";
          itemObj.stock = item.qty;
          itemObj.canGoodsQty = item.canGoodsQty;
          // itemObj.amount = item.amount + "";
          itemObj.taxRate = 13
          // itemObj.tax = item.tax + "";
          // itemObj.taxPrice = item.taxPrice + "";
          itemObj.taxAmount =  Number(itemObj.taxPrice * itemObj.qty).toFixed(2)
          // itemObj.unpaidAmount = item.taxAmount - item.paymentApplyReturnAmount;
          // itemObj.sourceObjectKey = obj.sourceObject.key;
          // itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        }
        
        this.dialogSelectorVisible = false;
      }
    },
    handleSubmit() {
      if (!this.checkItemFuc()) {
        return;
      }
      this.dataFormOnSubmit(this, addBill, "submitSuccess");
    },
    handleTempAddBill() {
      if (!this.checkItemFuc()) {
        return;
      }
      this.dataFormOnSubmit(this, tempAddBill, "submitSuccess", "tempAddBill");
    },
    checkItemFuc() {
      for (var i in this.items) {
        if (this.items[i].skuNo && this.items[i].skuNo != "") {
          // if (!this.items[i].qty || this.items[i].qty == "") {
          //   this.$message.error(
          //     "第" + (i * 1 + 1) + "行的商品数量必填项，请填写了再提交"
          //   );
          //   this.$refs["tableElInput" + (i * this.tableElInputNum + 2)].$el
          //     .querySelector("input")
          //     .focus();
          //   this.$refs["tableElInput" + (i * this.tableElInputNum + 2)].$el
          //     .querySelector("input")
          //     .select();
          //   return;
          // }
          // if (!this.items[i].price || this.items[i].price == "") {
          //   this.$message.error(
          //     "第" + (i * 1 + 1) + "行的商品单价必填项，请填写了再提交"
          //   );
          //   this.$refs["tableElInput" + (i * this.tableElInputNum + 3)].$el
          //     .querySelector("input")
          //     .focus();
          //   this.$refs["tableElInput" + (i * this.tableElInputNum + 3)].$el
          //     .querySelector("input")
          //     .select();
          //   return;
          // }
        }
      }
      return true;
    },
  },
};
</script>
