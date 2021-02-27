<template>
  <el-dialog
    title="选择关联单据"
    :visible.sync="dialogSelectorVisible"
    width="70%"
    @close="handleSelectorClose"
    :modal="false"
    :before-close="handleSelectorClose"
    class="billSelectorDialog"
  >
    <div class="full-purchase purchase-document-full-purchase">
      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-document-filter-container">
        <div>
          <el-select
            v-model="returnType"
            style="width: 200px;top: -4px;"
            disabled
            v-if="returnType == 1"
            @change="handleSouceObjectChange($event,true)"
          >
            <el-option
              v-for="item in returnTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!--采购合同查询条件-->
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="合同编号"
            v-model="listQuery.billNo"
            @keyup.enter.native="handleFilter"
            v-if="sourceObject.key=='CGHT'"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="合同名称"
            v-model="listQuery.contractName"
            @keyup.enter.native="handleFilter"
            v-if="sourceObject.key=='CGHT'"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="供应商"
            v-model="listQuery.supplierName"
            @keyup.enter.native="handleFilter"
            v-if="sourceObject.key=='CGHT'"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="采购员"
            v-model="listQuery.purchaserName"
            @keyup.enter.native="handleFilter"
            v-if="sourceObject.key=='CGHT'"
          ></el-input>
          <!--采购订单查询条件-->
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="单据编号"
            v-model="listQuery.billNo"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="采购员"
            v-model="listQuery.purchaserName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="供应商"
            v-model="listQuery.supplierName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="制单人"
            v-model="listQuery.crtUserName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="商品名称"
            v-model="listQuery.skuName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="规格型号"
            v-model="listQuery.specifications"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="订货号"
            v-model="listQuery.itemNo"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="品牌名称"
            v-model="listQuery.brandName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="系列名称"
            v-model="listQuery.seriesName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 1"
          ></el-input>
          <!--采购入库单查询条件-->
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="批次号"
            v-model="listQuery.batchNumber"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 2"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="订货号"
            v-model="listQuery.itemNo"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 2"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="规格型号"
            v-model="listQuery.specifications"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 2"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="仓位名称"
            v-model="listQuery.warehousePositionName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 2"
          ></el-input>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="仓库名称"
            v-model="listQuery.warehouseName"
            @keyup.enter.native="handleFilter"
            v-if="returnType == 2"
          ></el-input>
          <el-button
            class="filter-item"
            type="primary"
            @click="handleFilter"
            style="margin-left: 30px;"
          >查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block" v-if="sourceObject.key=='CGHT'">
            <el-date-picker
              v-model="contractDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="签约开始日期"
              end-placeholder="签约结束日期"
              value-format="yyyy-MM-dd"
              @change="handleContractDateSelect"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-date-picker
              v-model="effectiveDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="生效开始日期"
              end-placeholder="生效结束日期"
              value-format="yyyy-MM-dd"
              @change="handleEffectiveDateDateSelect"
              :picker-options="pickerOptions"
            ></el-date-picker>
            <el-date-picker
              v-model="disabledDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="到期开始日期"
              end-placeholder="到期结束日期"
              value-format="yyyy-MM-dd"
              @change="handleDisabledDateSelect"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='CGDD'">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="单据开始日期"
              end-placeholder="单据结束日期"
              value-format="yyyy-MM-dd"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions"
            ></el-date-picker>

            <!--<el-date-picker-->
            <!--v-model="deliverDate"-->
            <!--type="daterange"-->
            <!--align="right"-->
            <!--unlink-panels-->
            <!--range-separator="至"-->
            <!--start-placeholder="交货开始日期"-->
            <!--end-placeholder="交货结束日期"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--@change="handleDeliverDateSelect"-->
            <!--:picker-options="pickerOptions">-->
            <!--</el-date-picker>-->
          </div>
          <div class="block" v-if="sourceObject.key=='CGRKD'">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="单据开始日期"
              end-placeholder="单据结束日期"
              value-format="yyyy-MM-dd"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
          <div v-if="false">
            <el-input
              clearable
              class="filter-item"
              style="width: 200px;"
              placeholder="商品编码"
              v-model="listQuery.skuNo"
              @keyup.enter.native="handleFilter"
            ></el-input>
            <el-input
              clearable
              class="filter-item"
              style="width: 200px;"
              placeholder="商品名称"
              v-model="listQuery.skuName"
              @keyup.enter.native="handleFilter"
            ></el-input>
            <el-input
              clearable
              class="filter-item"
              style="width: 200px;"
              placeholder="订货号"
              v-model="listQuery.itemNo"
              @keyup.enter.native="handleFilter"
            ></el-input>
            <el-input
              clearable
              class="filter-item"
              style="width: 200px;"
              placeholder="规格型号"
              v-model="listQuery.specifications"
              @keyup.enter.native="handleFilter"
            ></el-input>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->

      <!--采购入库单-->
      <el-table
        :data="list"
        border
        style="width: 100%"
        v-loading="listLoading"
        ref="dataTable"
        @row-click="handleRowClick"
        @selection-change="handlechangeFun"
        size="mini"
        highlight-current-row
        element-loading-text="正在查询中。。。"
        :height="clientHeight"
        show-summary
        :summary-method="getSummaries"
        class="result-data-table"
        key="dataTableCGRKD"
        v-if="returnType=='2'"
      >
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="source" label="库存来源" width="108">
          <template slot-scope="scope">
            <span v-if="scope.row.source == '0'">标准ERP</span>
            <span v-if="scope.row.source == '1'">和稷ERP</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批次号" width="180" sortable></el-table-column>
        <el-table-column prop="brandName" label="品牌" width="108" sortable></el-table-column>
        <el-table-column prop="skuName" label="品名" width="108"></el-table-column>
        <el-table-column prop="seriesName" label="系列" width="108" sortable></el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="160" sortable></el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="140" sortable></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="140" sortable></el-table-column>
        <el-table-column prop="supplierCode" label="供应商编号" width="140" sortable></el-table-column>
        <el-table-column prop="retailPrice" label="产品面价" width="108"></el-table-column>
        <el-table-column prop="discount" label="调拨折扣" width="108" sortable>
          <template
            slot-scope="scope"
          >{{(scope.row.allocationPrice/scope.row.retailPrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column prop="allocationPrice" label="系统调拨价" width="108" sortable></el-table-column>
        <el-table-column prop="purchasePrice" label="平均进价" width="108" sortable></el-table-column>
        <!-- <el-table-column prop="itemNo" label="考核价(?)" width="108">
        </el-table-column>-->
        <el-table-column prop="qty" label="库存数量" width="108" class-name="col-required"></el-table-column>
        <el-table-column
          prop="lockedQty"
          label="锁定数量"
          width="108"
          class-name="col-required"
          sortable
        ></el-table-column>
        <el-table-column
          prop="canGoodsQty"
          label="可退数量"
          width="108"
          class-name="col-required"
          sortable
        ></el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="108" sortable></el-table-column>
        <el-table-column prop="crtTime" label="入库日期" width="160" sortable></el-table-column>
        <el-table-column prop="ownerName" label="归属人" width="108"></el-table-column>
      </el-table>

      <!--采购订单-->
      <el-table
        :data="list"
        border
        style="width: 100%"
        v-loading="listLoading"
        ref="dataTable"
        @row-click="handleRowClick"
        @selection-change="handlechangeFun"
        size="mini"
        highlight-current-row
        element-loading-text="正在查询中。。。"
        :height="clientHeight"
        show-summary
        :summary-method="getSummaries"
        class="result-data-table"
        key="dataTableCGDD"
        v-if="returnType==1"
      >
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" min-width="180" sortable>
          <template slot-scope="scope">
            <div class="colum-billno" v-if="scope.row.mainDTO">{{scope.row.mainDTO.billNo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.supplierCode" align="center" label="供应商编号" width="100"></el-table-column>
        <el-table-column
          prop="mainDTO.supplierName"
          label="供应商名称"
          width="200"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="mainDTO.purchaserCode" align="center" label="采购员工号" width="100"></el-table-column>
        <el-table-column prop="mainDTO.purchaserName" align="center" label="采购员姓名" width="100"></el-table-column>
        <el-table-column prop="departName" align="center" label="采购部门" width="120"></el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180"></el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180"></el-table-column>
        <el-table-column prop="brandName" align="center" label="品牌" width="180"></el-table-column>
        <el-table-column prop="seriesName" align="center" label="系列" width="180"></el-table-column>
        <el-table-column prop="specifications" label="型号" width="180"></el-table-column>
        <el-table-column prop="itemNo" label="订货号" align="center" min-width="180"></el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center"></el-table-column>
        <el-table-column prop="mainDTO.factoryName" label="收货人" align="center" min-width="180"></el-table-column>
        <el-table-column prop="mainDTO.factoryPhone" label="收货人电话" align="center" min-width="180"></el-table-column>
        <el-table-column prop="warehouseName" label="收货仓库" align="center" min-width="180"></el-table-column>
        <el-table-column prop="warehouseAdress" label="仓库地址" align="center" min-width="180"></el-table-column>
        <el-table-column prop="mainDTO.paymentsMeans" label="支付方式" align="center" min-width="180"></el-table-column>
        <el-table-column prop="skuNo" label="商品编码" align="center" min-width="220"></el-table-column>
        <el-table-column prop="unit" label="单位" align="right" width="80"></el-table-column>
        <el-table-column prop="applyQty" label="未处理数量" align="right" width="120"></el-table-column>
        <el-table-column prop="qty" label="处理数量" align="right" width="80" class-name="col-required"></el-table-column>
        <el-table-column
          prop="canGoodsQty"
          label="可做退货数量"
          align="right"
          width="100"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="retailPrice"
          label="面价"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.retailPrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="releasePrice"
          label="发布单价"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.releasePrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="discount"
          label="处理折扣"
          align="right"
          width="120"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="taxPrice"
          label="付款单价"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.taxPrice).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="profit"
          label="采购利润"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.profit).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="amount"
          label="金额"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.amount).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">{{Number(scope.row.tax).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="不含税单价"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.price).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="taxAmount"
          label="价税合计"
          align="right"
          width="120"
          class-name="col-required"
        >
          <template slot-scope="scope">{{Number(scope.row.taxAmount).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column
          prop="paymentApplyReturnAmount"
          label="已申请金额"
          align="right"
          width="120"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="deliverQty"
          label="收货数量"
          align="right"
          width="80"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="stockInPurchaseQty"
          label="入库数量"
          align="right"
          width="80"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="notStockInPurchaseQty"
          label="未入库数量"
          align="right"
          width="100"
          class-name="col-required"
        ></el-table-column>
        <el-table-column
          prop="returnGoodsQty"
          label="退货数量"
          align="right"
          width="100"
          class-name="col-required"
        ></el-table-column>
        <el-table-column prop="stockInPurchaseAmount" label="入库金额" align="right" width="120">
          <template slot-scope="scope">{{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column prop="notStockInPurchaseAmount" label="未入库金额" align="right" width="120">
          <template slot-scope="scope">{{Number(scope.row.notStockInPurchaseAmount).toFixed(4)}}</template>
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="入库状态" align="center" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageStatusOptions">
              <span
                v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.storageStatus"
              >{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.receiptStatus" label="收货状态" align="center" width="80">
          <template slot-scope="scope">
            <div v-for="item in receiptStatusOptions">
              <span
                v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.receiptStatus"
              >{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="mainDTO.deliverDate"
          label="交货日期"
          align="center"
          width="150"
          sortable
        ></el-table-column>
        <el-table-column prop="mainDTO.billDate" label="单据日期" align="center" width="150" sortable></el-table-column>

        <el-table-column prop="note" label="备注" width="104"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { selectPage } from "@/api/erp/purchase/bill/purchaseContract";
import { selectPageByItem as selectPageCGDD } from "@/api/erp/purchase/bill/purchaseOrder";
// import {selectPageByItem as selectPageCGRKD} from '@/api/erp/wms/bill/purchaseStockIn';
import { queryXSStockDetail as selectPageCGRKD } from "@/api/erp/wms/stock_query/index";
import { getFloat } from "@/utils/util";

export default {
  name: "purchaseDocumentSelector",
  props: ["dialogSelectorVisible", "returnType"],
  data() {
    return {
      clientHeight: 300,
      list: [],
      total: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        purchaserId: this.returnType == 2 ? this.$store.state.user.id : "",
        supplierCode: undefined,
        billNo: undefined,
        contractName: undefined,
        supplierName: undefined,
        purchaserName: undefined,
        crtUserName: undefined,
        salerName: undefined,
        applierName: undefined,
        applyDpetName: undefined,
        customerName: undefined,
        skuNo: undefined,
        skuName: undefined,
        itemNo: undefined,
        specifications: undefined,
        startContractDate: undefined,
        endContractDate: undefined,
        startDisabledDate: undefined,
        endDisabledDate: undefined,
        startEffectiveDate: undefined,
        endEffectiveDate: undefined,
        startBillDate: undefined,
        endBillDate: undefined,
        startDeliverDate: undefined,
        endDeliverDate: undefined,
        selectType: this.returnType == 1 ? 8 : 4,
      },
      selectedRows: [],
      queryVisible: false,
      returnTypeOptions: [
        { value: "1", label: "采购订单" },
        { value: "2", label: "采购入库单" },
      ],
      sourceObject: {
        key: "CGDD",
        name: "采购订单",
      },
      contractDate: undefined,
      effectiveDate: undefined,
      disabledDate: undefined,
      billDate: undefined,
      deliverDate: undefined,
    };
  },
  created() {
    //this.changeDivHeight();
    this.listQuery.supplierCode = this.supplierCode;
    const _this = this;
    window.onresize = function () {
      _this.changeDivHeight();
    };
    // this.getList();
    if (this.returnType == 1) {
      this.getListByCGDD();
    } else {
      this.getListByCGRKD();
    }
  },
  updated() {
    this.changeDivHeight();
  },
  methods: {
    queryVisibleChange() {
      this.queryVisible = !this.queryVisible;
      const _this = this;
      setTimeout(function () {
        _this.changeDivHeight();
      }, 1);
    },
    changeDivHeight() {
      if (
        document.getElementsByClassName("purchase-document-filter-container")[0]
      ) {
        var height = document.getElementsByClassName(
          "purchase-document-filter-container"
        )[0].clientHeight;
      } else {
        height = 38;
      }
      this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
    },
    getList() {
      this.listLoading = true;
      selectPage(this.listQuery)
        .then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    getListByCGDD() {
      this.listLoading = true;
      selectPageCGDD(this.listQuery)
        .then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    getListByCGRKD() {
      this.listLoading = true;
      selectPageCGRKD(this.listQuery)
        .then((response) => {
          this.list = response.data.records;
          this.list.forEach((item) => {
            item.canGoodsQty = item.qty - item.lockedQty;
          });
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          if (
            column.property == "contractAmount" ||
            column.property == "amount" ||
            column.property == "tax" ||
            column.property == "taxAmount" ||
            column.property == "taxBillAmount" ||
            column.property == "billAmount" ||
            column.property == "prePayment"
          ) {
            sums[index] = values
              .reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0)
              .toFixed(4);
            sums[index] += " ";
          }
        } else {
          sums[index] = " ";
        }
      });

      return sums;
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.handleSouceObjectChange(this.returnType, false);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.handleSouceObjectChange(this.returnType, false);
    },
    handleFilter() {
      this.listLoading = true;
      if (this.returnType == 1) {
        this.getListByCGDD();
      } else if (this.returnType == 2) {
        this.getListByCGRKD();
      }
    },
    handleSelectorClose() {
      this.$emit("handleSelectorClose", false);
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        supplierCode: this.supplierCode,
        purchaserId: this.returnType == 2 ? this.$store.state.user.id : "",
        selectType: this.returnType == 1 ? 8 : 4,
      };
      this.contractDate = undefined;
      this.effectiveDate = undefined;
      this.disabledDate = undefined;
      this.billDate = undefined;
      this.deliverDate = undefined;
      this.handleFilter();
    },
    handleRowClick(row, event, column) {
      this.$refs.dataTable.toggleRowSelection(row);
    },
    handlechangeFun(val) {
      this.selectedRows = val;
    },
    handleSouceObjectChange(val, clear) {
      if (val == 1) {
        this.getListByCGDD();
      } else if (val == 2) {
        this.getListByCGRKD();
      }
      if (clear) {
        this.selectedRows = [];
      }
    },
    handleSubmit() {
      if (this.selectedRows.length > 0) {
        for (let i in this.selectedRows) {
          if (this.selectedRows[0].salesOrderBillNo != this.selectedRows[i].salesOrderBillNo) {
            this.$message.error('只支持在同一张客户订货单据内进行关联创建，请重新选择');
            return;
          }
          if (this.selectedRows[0].supplierCode != this.selectedRows[i].supplierCode) {
            this.$message.error('只支持在同一供应商内进行选择，请重新选择');
            return;
          }
        }

        if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].salesOrderBillNo) {

          this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: true,
              sourceObject: this.sourceObject
            });
          }).catch(() => {

          });

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          });
        }

      } else {
        this.$emit('submitSelectorSuccess', {
          list: this.selectedRows,
          isClearAll: false,
          sourceObject: this.sourceObject
        });
      }
    },
    handleContractDateSelect(val) {
      this.listQuery.startContractDate = val[0];
      this.listQuery.endContractDate = val[1];
    },
    handleDisabledDateSelect(val) {
      this.listQuery.startDisabledDate = val[0];
      this.listQuery.endDisabledDate = val[1];
    },
    handleEffectiveDateDateSelect(val) {
      this.listQuery.startEffectiveDate = val[0];
      this.listQuery.endEffectiveDate = val[1];
    },
    handleBillDateSelect(val) {
      this.listQuery.startBillDate = val[0];
      this.listQuery.endBillDate = val[1];
    },
    handleDeliverDateSelect(val) {
      this.listQuery.startDeliverDate = val[0];
      this.listQuery.endDeliverDate = val[1];
    },
  },
  watch: {
    contractDate(value) {
      if (value == null) {
        this.listQuery.startContractDate = undefined;
        this.listQuery.endContractDate = undefined;
      }
    },
    effectiveDate(value) {
      if (value == null) {
        this.listQuery.startEffectiveDate = undefined;
        this.listQuery.endEffectiveDate = undefined;
      }
    },
    disabledDate(value) {
      if (value == null) {
        this.listQuery.startDisabledDate = undefined;
        this.listQuery.endDisabledDate = undefined;
      }
    },
    billDate(value) {
      if (value == null) {
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
      }
    },
    deliverDate(value) {
      if (value == null) {
        this.listQuery.startDeliverDate = undefined;
        this.listQuery.endDeliverDate = undefined;
      }
    },
  },
};
</script>
