<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="73%" @close="handleSelectorClose" append-to-body top="0"
             :modal="true" :before-close="handleSelectorClose" class="billSelectorDialog" custom-class="default-dialog">
    <div class="full-purchase purchase-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-order-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;"
                     @change="handleSouceObjectChange($event,true)">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                    v-model="listQuery.supplierName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                    v-model="listQuery.purchaserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible" style="color: #409EFF">展开</span>
            <span v-show="queryVisible" style="color: #409EFF">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible" style="color: #409EFF"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible" style="color: #409EFF"> </i>
          </span>
        </div>
        <div class="query-container" style="margin-bottom: 0;" v-show="queryVisible">
          <div class="block">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
              style="margin-right: 0;width: 403px;"
              range-separator="至"
              start-placeholder="单据开始日期"
              end-placeholder="单据结束日期"
              @change="handleBillDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="deliverDate"
              type="daterange"
              align="right"
              unlink-panels
              style="vertical-align: top"
              range-separator="至"
              start-placeholder="交货开始日期"
              end-placeholder="交货结束日期"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions" v-if="this.sourceObject.key=='CGDD'">
            </el-date-picker>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                      v-model="listQuery.brandName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                      v-model="listQuery.seriesName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <!--采购订单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableCGDD"
                v-if="sourceObject.key=='CGDD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="150">
        </el-table-column>
        <el-table-column label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billAmount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.taxBillAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.businessflowStatus" label="阶段" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="120">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="deliverQty" label="交货数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="stockInPurchaseQty" label="入库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockInPurchaseQty" label="未入库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInPurchaseAmount" label="入库金额" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockInPurchaseAmount" label="未入库金额" align="right" width="120"
                         class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="入库状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.receiptStatus" label="收货状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in receiptStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.receiptStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="note" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="deliverDate" label="交货日期" width="150">
        </el-table-column>
      </el-table>
      <!--采购合同-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table" key="dataTableCGHT"
                v-if="sourceObject.key=='CGHT'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="合同编号" width="204">
        </el-table-column>
        <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="84">
        </el-table-column>
        <el-table-column label="币别" width="64">
          <template slot-scope="scope">
            <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.contractAmount" label="合同金额" align="right" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.note" label="备注" width="180">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="400">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="75" class-name="col-required">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="75">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="75" class-name="col-required">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="78" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.contractDate" label="签约日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.effectiveDate" label="生效日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.disabledDate" label="到期日期" width="108">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
        </el-table-column>
      </el-table>
      <!--收货通知单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini" @row-dblclick="chooseData"
                highlight-current-row element-loading-text="正在查询中。。。"
                :show-summary="false" :summary-method="getSummaries" class="result-data-table" key="dataTableSHTZD"
                v-if="sourceObject.key=='SHTZD'">
        <el-table-column width="90" align="center">
          <template slot="header" slot-scope="scope">
            <el-button @click="batchChoose">选入</el-button>
          </template>
          <template slot-scope="scope">
            <span class="el-icon-plus" style="cursor: pointer;color:#409EFF;" @click="chooseData(scope.row)"></span>
          </template>

        </el-table-column>
        <el-table-column type="selection" align="center">

        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="160">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="220">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseId" label="仓库ID" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="仓库名称" width="150">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="100">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="140">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="150">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="160">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="160">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80" class-name="col-required">
        </el-table-column>
<!--        <el-table-column prop="taxPrice" label="含税单价" align="right" width="80" class-name="col-required">-->
<!--          <template slot-scope="scope">-->
<!--            <span>{{scope.row.taxPrice.toFixed(4)}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
        <!--<el-table-column prop="price" label="单价" align="right" width="100" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <el-table-column prop="stockInPurchaseQty" label="已入库数量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="100">
        </el-table-column>
        <!--<el-table-column label="币别" width="80">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-for="item in currencyOptions">-->
        <!--<span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.billAmount" label="金额" align="right" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.taxBillAmount" label="价税合计" align="right" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.billStatus" label="状态" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<div v-for="item in statusOptions" v-if="scope.row.mainDTO">-->
        <!--<span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="positionName" label="仓位" width="100">-->
        <!--</el-table-column>-->
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="130">
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="150">
        </el-table-column>

        <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="104">-->
        <!--</el-table-column>-->
      </el-table>
      <div style="border: 1px solid #ddd;border-top: 0;padding-top: 10px;padding-bottom: 10px;margin-bottom: 10px">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[5,10,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <div style="clear: both;display: table"></div>
      </div>

      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row  class="result-data-table"
                v-if="sourceObject.key=='SHTZD'">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="160">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="220">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseId" label="仓库ID" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="仓库名称" width="150">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="100">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="100">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="150">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="160">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="160">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <!--        <el-table-column prop="taxPrice" label="含税单价" align="right" width="80" class-name="col-required">-->
        <!--          <template slot-scope="scope">-->
        <!--            <span>{{scope.row.taxPrice.toFixed(4)}}</span>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--<el-table-column prop="price" label="单价" align="right" width="100" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">-->
        <!--</el-table-column>-->
        <el-table-column prop="stockInPurchaseQty" label="已入库数量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="100">
        </el-table-column>
        <!--<el-table-column label="币别" width="80">-->
        <!--<template slot-scope="scope">-->
        <!--<span v-for="item in currencyOptions">-->
        <!--<span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>-->
        <!--</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.billAmount" label="金额" align="right" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.taxBillAmount" label="价税合计" align="right" width="120">-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="mainDTO.billStatus" label="状态" width="100">-->
        <!--<template slot-scope="scope">-->
        <!--<div v-for="item in statusOptions" v-if="scope.row.mainDTO">-->
        <!--<span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>-->
        <!--</div>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column prop="positionName" label="仓位" width="100">-->
        <!--</el-table-column>-->
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="130">
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="150">
        </el-table-column>

      </el-table>
      <!-- 分页 -->
      <div style="height: 50px"></div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="purchaseStockInSubmit" v-if="this.sourceObject.key=='SHTZD'">提 交</el-button>
      <el-button type="primary" @click="handleSubmit" v-else>提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseOrder';
  import {selectPageByItem as selectPageByItemCGHT} from '@/api/erp/purchase/bill/purchaseContract';
  import {selectPageByItem as selectPageByItemSHTZD} from '@/api/erp/purchase/bill/purchaseReceiptGoodsNotice';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseOrderSelector",
    props: ['dialogSelectorVisible', 'sourceBillNo', 'type'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        listDrop:[],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 5,
          billNo: undefined,
          crtUserName: undefined,
          supplierName: undefined,
          purchaserName: undefined,
          skuNo: undefined,
          itemNo: undefined,
          skuName: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startDeliverDate: undefined,
          endDeliverDate: undefined,
          selectType: this.type //type:1,采购入库单关联采购订单时,只查询采购订单未入库数量大于0的;采购入库单关联收货通知单,只查询收货通知单中未入库数量大于0的
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [
          // {
          //   key: 'CGDD',
          //   name: '采购订单',
          // },
          {
            key: 'SHTZD',
            name: '收货通知单',
          },
          //   {
          //   key: 'CGHT',
          //   name: '采购合同',
          // }
        ],
        sourceObject: {
          key: 'SHTZD',
          name: '收货通知单'
        },
        billDate: undefined,
        deliverDate: undefined,
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
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
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('purchase-order-filter-container')[0]) {
          var height = document.getElementsByClassName('purchase-order-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        // if(this.supplierCode&&this.supplierCode!==''){
        //   this.listQuery.supplierCode=this.supplierCode
        // }
        selectPageByItemSHTZD(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getListByCGHT() {
        this.listLoading = true;
        selectPageByItemCGHT(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getListBySHTZD() {
        this.listLoading = true;
        selectPageByItemSHTZD(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'taxBillAmount' || column.property == 'billAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount'
              || column.property == 'notStockInPurchaseAmount' || column.property == 'stockInPurchaseAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0);
              sums[index] += ' ';
            }


          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.handleSouceObjectChange(this.sourceObject.key, false);
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.handleSouceObjectChange(this.sourceObject.key, false);
      },
      handleFilter() {
        if (this.sourceObject.key == 'SHTZD') {
          this.getListBySHTZD();
        } else if (this.sourceObject.key == 'CGHT') {
          this.getListByCGHT();
        } else {
          this.getList();
        }
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: this.type
        };
        this.billDate = undefined;
        this.deliverDate = undefined;
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },

      /**
       * 表格双击选中添加进下方存储表格
       * @param row
       */
      chooseData(row){
        let isPush=false
        if(this.listDrop.length>0){
          isPush=row.mainDTO.supplierCode===this.listDrop[0].mainDTO.supplierCode
        }else{
          isPush=true
        }
        if(isPush){
          this.listDrop.push(row)
          let hash={}
          this.listDrop=this.listDrop.reduce(function(item, next) {
            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
            return item
          }, [])
        }else{
          this.$message.error('只支持同一个供应商内进行关联创建，请重新选择');
        }

      },

      /**
       * 下方存储表格移除数据
       * @param index
       */
      removeData(index){
        this.listDrop.splice(index,1)
      },

      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSouceObjectChange(val, clear) {
        if (val == 'CGDD') {
          this.sourceObject.name = '采购订单';
          this.getList();
        } else if (val == 'CGHT') {
          this.sourceObject.name = '采购合同';
          this.getListByCGHT();
        } else if (val == 'SHTZD') {
          this.sourceObject.name = '收货通知单';
          this.getListBySHTZD();
        }
        if (clear) {
          this.selectedRows = [];
        }
      },
      handleSubmit() {

        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].mainDTO.billNo != this.selectedRows[i].mainDTO.billNo) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
              return;
            }
          }

          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].mainDTO.billNo) {

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

      purchaseStockInSubmit(){
        if(this.sourceObject.key=='SHTZD'){
          this.selectedRows=this.listDrop
        }
        this.$emit('submitSelectorSuccess', {
          list: this.selectedRows,
          isClearAll: false,
          sourceObject: this.sourceObject
        });
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
      },

      batchChoose(){
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].mainDTO.billNo != this.selectedRows[i].mainDTO.billNo) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
              return;
            }
          }
          for (let i = 0; i <this.selectedRows.length ; i++) {
            this.chooseData(this.selectedRows[i])
          }
        }
      }
    },
    watch: {
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
      }
    }
  }
</script>
<style>
  .default-dialog{
    height: unset!important;
  }
</style>
