<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="75%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog dropDialog">
    <div class="full-purchase purchase-contract-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-contract-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;"
                     @change="handleSouceObjectChange($event,true)">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <!--采购合同查询条件-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGHT'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同名称"
                    v-model="listQuery.contractName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGHT'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                    v-model="listQuery.supplierName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGHT'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                    v-model="listQuery.purchaserName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGHT'">
          </el-input>
          <!--客户订货单查询条件-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='KHDHD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='KHDHD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                    v-model="listQuery.salerName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='KHDHD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货单位"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='KHDHD'">
          </el-input>
          <el-select v-model="listQuery.source" placeholder="订单来源" clearable style="width: 240px"
                     class="filter-item" @change="handleFilter" filterable v-if="sourceObject.key=='KHDHD'">
            <el-option v-for="item in source" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-select v-model="listQuery.salesType" placeholder="货物类型" clearable style="width: 240px"
                     class="filter-item" @change="handleFilter" filterable v-if="sourceObject.key=='KHDHD'">
            <el-option v-for="item in salesType" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <!--采购申请单查询条件-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGSQD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人"
                    v-model="listQuery.applierName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGSQD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请单位"
                    v-model="listQuery.applyDpetName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGSQD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGSQD'">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                    v-model="listQuery.crtUserNo"
                    @keyup.enter.native="handleFilter" v-if="sourceObject.key=='CGSQD'">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
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
              :default-time="['00:00:00', '23:59:59']"
              @change="handleContractDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker
              v-model="effectiveDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="生效开始日期"
              end-placeholder="生效结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleEffectiveDateDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker
              v-model="disabledDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="到期开始日期"
              end-placeholder="到期结束日期"
              :default-time="['00:00:00', '23:59:59']"
              @change="handleDisabledDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='KHDHD'">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              align="right"
              unlink-panels
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
              range-separator="至"
              start-placeholder="交货开始日期"
              end-placeholder="交货结束日期"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='CGSQD'">
            <el-date-picker
              v-model="deliverDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="交货开始日期"
              end-placeholder="交货结束日期"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                      v-model="listQuery.brandName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                      v-model="listQuery.seriesName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                      v-model="listQuery.rebateSeries"
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


      <!--采购合同-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableCGHT" v-if="sourceObject.key=='CGHT'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="合同编号" width="180">
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
        <el-table-column prop="skuNo" label="商品编码" width="180">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="300">
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
        <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
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

      <!--采购申请单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="chooseData" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableCGSQD" v-if="sourceObject.key=='CGSQD'">
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
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="180">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="204">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" width="150">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="150">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="204">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="200">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="200">
        </el-table-column>
        <el-table-column align="center" min-width="100" label="渠道类型编号" prop="channelTypeCode">
        </el-table-column>
        <el-table-column align="center" min-width="100" label="渠道类型名称" prop="channelTypeName">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="notPurchasedQty" label="未处理数量" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">
            {{scope.row.applyQty * 1 - scope.row.purchasedQty * 1}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="purchasedQty" label="已采购数量" align="right" width="120" class-name="col-required">
        </el-table-column>-->
        <el-table-column prop="retailPrice" label="面价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="releasePrice" label="发布单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="仓库名称" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.type" label="申请类型" width="120">
          <template slot-scope="scope">
            <div v-for="item in typeOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.type">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="75">
        </el-table-column>
        <el-table-column prop="salesOrderBillNo" label="订货单编号" width="200">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="200">
        </el-table-column>
        <el-table-column prop="crtUserNo" label="制单人工号" width="200">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="200">
        </el-table-column>
      </el-table>

      <!--客户订货单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableKHDHD" v-if="sourceObject.key=='KHDHD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.source" label="订单来源" width="100">
          <template slot-scope="scope">
          <span v-for="item in source">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.source ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="salesType" label="货物类型" width="100">
          <template slot-scope="scope">
          <span v-for="item in salesType">
            <span v-if="scope.row.salesType ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="订货单位" width="150">
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
        <el-table-column prop="mainDTO.billActuallyRebateAmount" label="实付金额" width="120" align="right">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
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
        <el-table-column prop="stockOutSaleQty" label="出库数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="notStockOutSaleQty" label="未出库数量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="stockInSaleAmount" label="出库金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="notStockInSaleAmount" label="未出库金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="storageStatus" label="出库状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageStatusOptions">
              <span v-if="item.value==scope.row.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row class="result-data-table" :height="450"
                v-if="sourceObject.key=='CGSQD'">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="180">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商名称" width="204">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" width="150">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="150">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="204">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="200">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="200">
        </el-table-column>
        <el-table-column align="center" min-width="100" label="渠道类型编号" prop="channelTypeCode">
        </el-table-column>
        <el-table-column align="center" min-width="100" label="渠道类型名称" prop="channelTypeName">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="notPurchasedQty" label="未处理数量" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">
            {{scope.row.applyQty * 1 - scope.row.purchasedQty * 1}}
          </template>
        </el-table-column>
        <!--<el-table-column prop="purchasedQty" label="已采购数量" align="right" width="120" class-name="col-required">
        </el-table-column>-->
        <el-table-column prop="retailPrice" label="面价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="releasePrice" label="发布单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="仓库名称" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.type" label="申请类型" width="120">
          <template slot-scope="scope">
            <div v-for="item in typeOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.type">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="75">
        </el-table-column>
        <el-table-column prop="salesOrderBillNo" label="订货单编号" width="200">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="200">
        </el-table-column>
        <el-table-column prop="crtUserNo" label="制单人工号" width="200">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="200">
        </el-table-column>

      </el-table>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseContract';
  import {selectPageByItem as selectPageByItemKHDHD} from '@/api/erp/sales/bill/salesOrder';
  import {selectPageByItem as selectPageByItemCGSQD} from '@/api/erp/purchase/bill/purchaseApply';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseContractSelector",
    props: ['dialogSelectorVisible', 'warehouseName','type','supplierCode','sp1'],
    data() {
      return {
        clientHeight: 300,
        listDrop:[],
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          type:this.type,
          supplierCode: this.type == 2 ? this.supplierCode : undefined,
          billNo: undefined,
          contractName: undefined,
          supplierName: undefined,
          purchaserName: undefined,
          crtUserName: undefined,
          crtUserNo: undefined,
          salerName: undefined,
          applierName: undefined,
          applyDpetName: undefined,
          customerName: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: this.sp1,
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
          publisherId: undefined,
          selectType: 1 //单据查询时使用，0代表查所有状态，1代表只查正常状态（关联单据时）
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'CGSQD',
          name: '采购申请单',
        },
          //   {
          //   key: 'MDDHSQD',
          //   name: '门店订货申请单',
          // },
          // {
          //   key: 'KHDHD',
          //   name: '客户订货单',
          // }, {
          //   key: 'CGHT',
          //   name: '采购合同',
          // }
        ],
        sourceObject: {
          key: 'CGSQD',
          name: '采购申请单'
        },
        source: [{
          value: 0,
          label: '商城订单'
        }, {
          value: 1,
          label: '线下订单'
        }],
        salesType: [{
          value: 0,
          label: '现货'
        }, {
          value: 1,
          label: '期货'
        }],
        typeOptions: [{
          value: '0',
          label: '备货'
        }, {
          value: '1',
          label: '按订单采购'
        }],
        contractDate: undefined,
        effectiveDate: undefined,
        disabledDate: undefined,
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
      // this.getList();
      this.getListByCGSQD();
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
        if (document.getElementsByClassName('purchase-contract-filter-container')[0]) {
          var height = document.getElementsByClassName('purchase-contract-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        selectPageByItemCGSQD(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getListByKHDHD() {
        this.listLoading = true;
        selectPageByItemKHDHD(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getListByCGSQD() {
        this.listLoading = true;
        this.listQuery.publisherId = this.$store.state.user.id;
        selectPageByItemCGSQD(this.listQuery).then(response => {
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
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount'
              || column.property == 'stockInSaleAmount' || column.property == 'notStockInSaleAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
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
        this.listLoading = true;
        if (this.sourceObject.key == 'CGHT') {
          this.getList();
        } else if (this.sourceObject.key == 'KHDHD') {
          this.getListByKHDHD();
        } else if (this.sourceObject.key == 'CGSQD') {
          this.getListByCGSQD();
        }
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: 1
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
        if (val == 'CGSQD') {
          this.sourceObject.name = '采购申请单';
          this.getListByCGSQD();
        } else if (val == 'MDDHSQD') {
          this.sourceObject.name = '门店订货申请单';
        } else if (val == 'KHDHD') {
          this.sourceObject.name = '客户订货单';
          this.getListByKHDHD();
        } else if (val == 'CGHT') {
          this.sourceObject.name = '采购合同';
          this.getList();
        }
        if (clear) {
          this.selectedRows = [];
        }
      },
      handleSubmit() {
        if(this.sourceObject.key=='CGSQD'){
          this.selectedRows=this.listDrop
        }
        if(this.selectedRows.length>1){
          for (let i in this.selectedRows) {
            if(i>0){
              if (this.selectedRows[0].skuNo == this.selectedRows[i].skuNo) {
                this.$message.error('您选择的数据因订货号['+ this.selectedRows[0].itemNo + ']一致，不能执行调入操作，请重新选择');
                return;
              }
              if (this.selectedRows[0].mainDTO.warehouseName != this.selectedRows[i].mainDTO.warehouseName) {
                this.$message.error('您选择的数据因仓库['+this.selectedRows[0].mainDTO.warehouseName +']数据不一致，不能执行调入操作，请重新选择');
                return;
              }
            }
          }
        }


        if (this.warehouseName && this.warehouseName != this.selectedRows[0].mainDTO.warehouseName) {

          this.$confirm('您选择的数据因[仓库]和已选择的仓库不一致，切换已选单据将清空相应的数据，确认切换吗？', '提示', {
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
      /**
       * 下方存储表格移除数据
       * @param index
       */
      removeData(index) {
        this.listDrop.splice(index, 1)
      },

      /**
       * 表格双击选中添加进下方存储表格
       * @param row
       */
      chooseData(row) {

        for (let i = 0; i < this.listDrop.length; i++) {
            if (row.skuNo == this.listDrop[i].skuNo) {
              this.$message.error('您选择的数据因订货号[' + this.listDrop[i].itemNo + ']一致，不能执行调入操作，请重新选择');
              return;
            }
            if (row.mainDTO.warehouseName != this.listDrop[i].mainDTO.warehouseName) {
              this.$message.error('您选择的数据因仓库[' + this.listDrop[i].mainDTO.warehouseName + ']数据不一致，不能执行调入操作，请重新选择');
              return;
            }
        }
        this.listDrop.push(row)
        let hash = {}
        this.listDrop = this.listDrop.reduce(function (item, next) {
          hash[next.id] ? '' : hash[next.id] = true && item.push(next);
          return item
        }, [])
      },

      batchChoose(){
        if (this.selectedRows.length > 0) {
          for(let i = 0; i < this.selectedRows.length; i++){
            for(let j = i+1; j < this.selectedRows.length; j++){
              if(this.selectedRows[i].skuNo === this.selectedRows[j].skuNo){
                this.$message.error('您选择的数据因订货号['+ this.selectedRows[0].itemNo + ']一致，不能执行调入操作，请重新选择');
                return false;
              }
              if(this.selectedRows[i].mainDTO.warehouseName !== this.selectedRows[j].mainDTO.warehouseName){
                this.$message.error('您选择的数据因仓库['+this.selectedRows[0].mainDTO.warehouseName +']数据不一致，不能执行调入操作，请重新选择');
                return false;
              }
            }
          }
          for (let i = 0; i <this.selectedRows.length ; i++) {
            this.chooseData(this.selectedRows[i])
          }
        }
      }

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
    }
  }
</script>
<style>
  .dropDialog>.el-dialog{
    height: auto!important;
  }
  .dropDialog .el-dialog__footer{
    bottom: -45px;
  }
</style>
