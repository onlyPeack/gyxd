<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase sales-invoice-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container sales-invoice-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;"
                     @change="handleSouceObjectChange($event,true)">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <!--销售合同查询条件-->
          <span v-if="sourceObject.key=='XSHT'">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同名称"
                      v-model="listQuery.contractName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                      v-model="listQuery.salerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </span>
          <!--客户订货单、销售出库单、销售退库单、客户退货单查询条件-->
          <span
            v-if="sourceObject.key=='KHDHD' || sourceObject.key=='XSCKD' || sourceObject.key=='XSTKD' || sourceObject.key=='KHTHD'">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                      v-model="listQuery.crtUserName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                      v-model="listQuery.salerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货单位"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </span>
          <!--付款单查询条件-->
          <span v-if="sourceObject.key=='XSHKD'">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联客户"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                      v-model="listQuery.crtUserName"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </span>

          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
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
          <div class="block" v-if="sourceObject.key=='XSHT'">
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
              value-format="yyyy-MM-dd"
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
              value-format="yyyy-MM-dd"
              @change="handleDisabledDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='KHDHD' || sourceObject.key=='KHTHD'">
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
              value-format="yyyy-MM-dd"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='XSCKD'">
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
              :picker-options="pickerOptions">
            </el-date-picker>

            <el-date-picker
              v-model="receiptDate"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="收款截止开始日期"
              end-placeholder="收款截止结束日期"
              value-format="yyyy-MM-dd"
              @change="handleReceiptDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
          </div>
          <div class="block" v-if="sourceObject.key=='XSTKD' || sourceObject.key=='XSHKD'">
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
      <!--销售合同-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableXSHT" v-if="sourceObject.key=='XSHT'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column prop="mainDTO.contractDate" label="签约日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.effectiveDate" label="生效日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.disabledDate" label="到期日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="合同编号" width="204">
        </el-table-column>
        <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="84">
        </el-table-column>
        <el-table-column prop="mainDTO.contractAmount" label="合同金额" align="right" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.customerOrderStatus" label="客户订货状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in orderGoodsStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.customerOrderStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.stockOutStatus" label="出库状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in storageOutStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.stockOutStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.returnStatus" label="回款状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in returnMoneyStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.returnStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="400">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="75">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="75">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="104">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="104">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="78">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="104">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" width="100">
        </el-table-column>
      </el-table>

      <!--销售出库单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableXSCKD" v-if="sourceObject.key=='XSCKD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billDate" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="订货单位" width="150">
        </el-table-column>
        <el-table-column label="币别" width="100">
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
        <el-table-column prop="mainDTO.warehouseName" label="出库仓库" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in statusOptions">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sourceBillNo" label="关联单据编号" width="150">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="120">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="80">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.voucherStatus" label="记账状态" width="80">
        </el-table-column>
        <el-table-column prop="saleInvoiceQty" label="开票数量" width="80">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" width="80">
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
        <el-table-column prop="mainDTO.customerName" label="订货单位" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="stockOutSaleQty" label="出库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockReturnQty" label="退库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="已开票数量" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="invoicableQty" label="可开票数量" align="right" width="104" class-name="col-required">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="400">
        </el-table-column>
          <el-table-column prop="itemNo" label="订货号" width="400">
          </el-table-column>
        <el-table-column prop="unit" label="单位" width="80">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="orderQty" label="采购订货数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="deliverQty" label="发货数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="notStockOutSaleQty" label="未出库数量" align="right" width="100">
        </el-table-column>
        <el-table-column prop="stockInSaleAmount" label="出库金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="notStockInSaleAmount" label="未出库金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="出库状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageOutStatusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="closeStatus" label="关闭状态" width="80">-->
        <!--</el-table-column>-->
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!--客户退货单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableKHTHD" v-if="sourceObject.key=='KHTHD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.companyName" label="供货单位" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="退货单位" width="150">
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
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
              <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
            </div>
          </template>
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
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
      </el-table>

      <!--销售退库单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableXSTKD" v-if="sourceObject.key=='XSTKD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billDate" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="退货单位" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="mainDTO.salerName" label="业务员" width="150">
        </el-table-column>
        <el-table-column label="币别" width="100">
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
        <el-table-column prop="mainDTO.warehouseName" label="入库仓库" width="120">
        </el-table-column>
        <el-table-column prop="positionName" label="仓位" width="120">
          <template slot-scope="scope">
            <div v-if="!scope.row.positionName">默认仓位</div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in statusOptions">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.voucherStatus" label="记账状态" width="80">
        </el-table-column>
        <el-table-column prop="sourceBillNo" label="关联单据" width="150">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="120">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="80">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="80">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="120">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="120">
        </el-table-column>
        <el-table-column prop="saleInvoiceQty" label="开票数量" width="80">
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" width="80">
        </el-table-column>
      </el-table>

      <!--回款单-->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table"
                key="dataTableXSHKD" v-if="sourceObject.key=='XSHKD'">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="billDate" label="回款日期" width="108">
        </el-table-column>
        <el-table-column prop="billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="200">
        </el-table-column>
        <el-table-column prop="currencyId" label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentForm" label="回款形式" width="120">
          <template slot-scope="scope">
            <div v-for="item in moneybackFormOptions">
              <span v-if="scope.row.paymentForm==item.value">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currencyAccuracy" label="回款金额" width="120" align="right">
        </el-table-column>
        <el-table-column prop="customerName" label="关联客户" width="200">
        </el-table-column>
        <el-table-column prop="billStatus" label="单据状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="voucherStatus" label="记账状态" width="100">
        </el-table-column>
        <el-table-column prop="printCount" label="打印次数" width="100" align="right">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,50,80,100,200,500,]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import { selectPageByItem } from '@/api/erp/sales/bill/salesContract'
  import { selectPageByItem as selectPageByItemKHDHD } from '@/api/erp/sales/bill/salesOrder'
  import { selectPageByItem as selectPageByItemKHTHD } from '@/api/erp/sales/bill/salesReturnGoods'
  import { selectPageByItem as selectPageByItemXSCKD } from '@/api/erp/wms/bill/salesStockOut'
  import { selectPageByItem as selectPageByItemXSTKD } from '@/api/erp/wms/bill/salesStockReturn'
  import { selectPage as selectPageByItemXSHKD } from '@/api/erp/financial/financialSalesReceivables'

  import { getFloat } from '@/utils/util'

  export default {
    name: 'salesInvoiceSelector',
    props: ['dialogSelectorVisible', 'sourceBillNo', 'customerId','kpType'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          contractName: undefined,
          supplierName: undefined,
          purchaserName: undefined,
          crtUserName: undefined,
          salerName: undefined,
          applierName: undefined,
          applyDpetName: undefined,
          customerId: this.customerId,
          customerName: undefined,
          skuNo: undefined,
          skuName: undefined,
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
          startReceiptDate: undefined,
          endReceiptDate: undefined,
          refundType:1,
          selectType: this.kpType //type:3 销售发票关联客户订货单时,只查询客户订货单中是否已申请开票标识为0的
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'KHDHD',
          name: '客户订货单'
        }
          // , {
          //   key: 'XSHT',
          //   name: '销售合同',
          // }, {
          //   key: 'XSHKD',
          //   name: '回款单',
          // }, {
          //   key: 'XSCKD',
          //   name: '销售出库单',
          // }, {
          //   key: 'XSTKD',
          //   name: '销售退库单',
          // }, {
          //   key: 'KHTHD',
          //   name: '客户退货单',
          // }
        ],
        sourceObject: {
          key: 'KHDHD',
          name: '客户订货单'
        },
        contractDate: undefined,
        effectiveDate: undefined,
        disabledDate: undefined,
        billDate: undefined,
        deliverDate: undefined,
        receiptDate: undefined
      }
    },
    created() {
      //this.changeDivHeight();
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getListByKHDHD()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function() {
          _this.changeDivHeight()
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-invoice-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-invoice-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      getList() {
        this.listLoading = true
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByKHDHD() {
        this.listLoading = true
        selectPageByItemKHDHD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByKHTHD() {
        this.listLoading = true
        selectPageByItemKHTHD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByXSCKD() {
        this.listLoading = true
        selectPageByItemXSCKD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByXSTKD() {
        this.listLoading = true
        selectPageByItemXSTKD(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getListByXSHKD() {
        this.listLoading = true
        selectPageByItemXSHKD(this.listQuery).then(response => {
          var records = response.data.records
          for (var i in records) {
            records[i].mainDTO = { billNo: records[i].billNo }
          }
          this.list = records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              sums[index] += ' '
            }

          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.handleSouceObjectChange(this.sourceObject.key, false)
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.handleSouceObjectChange(this.sourceObject.key, false)
      },
      handleFilter() {
        this.listLoading = true
        if (this.sourceObject.key == 'XSHT') {
          this.getList()
        } else if (this.sourceObject.key == 'KHDHD') {
          this.getListByKHDHD()
        } else if (this.sourceObject.key == 'XSCKD') {
          this.getListByXSCKD()
        } else if (this.sourceObject.key == 'XSTKD') {
          this.getListByXSTKD()
        } else if (this.sourceObject.key == 'XSHKD') {
          this.getListByXSHKD()
        } else if (this.sourceObject.key == 'KHTHD') {
          this.getListByKHTHD()
        }
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: this.kpType
        }
        this.contractDate = undefined
        this.effectiveDate = undefined
        this.disabledDate = undefined
        this.billDate = undefined
        this.deliverDate = undefined
        this.receiptDate = undefined
        this.handleFilter()
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handlechangeFun(val) {
        this.selectedRows = val
      },
      handleSouceObjectChange(val, clear) {
        if (val == 'XSCKD') {
          this.sourceObject.name = '销售出库单'
          this.getListByXSCKD()
        } else if (val == 'KHDHD') {
          this.sourceObject.name = '客户订货单'
          this.getListByKHDHD()
        } else if (val == 'XSHT') {
          this.sourceObject.name = '销售合同'
          this.getList()
        } else if (val == 'XSTKD') {
          this.sourceObject.name = '销售退库单'
          this.getListByXSTKD()
        } else if (val == 'XSHKD') {
          this.sourceObject.name = '回款单'
          this.getListByXSHKD()
        } else if (val == 'KHTHD') {
          this.sourceObject.name = '客户退货单'
          this.getListByKHTHD()
        }
        if (clear) {
          this.selectedRows = []
        }
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          // 回款单支持多张单据
          if (this.sourceObject.key != 'XSHKD') {
            for (let i in this.selectedRows) {
              if (this.selectedRows[0].mainDTO.customerId != this.selectedRows[i].mainDTO.customerId) {
                this.$message.error('只支持同一客户进行关联内创建，请重新选择')
                return
              }
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
              })
            }).catch(() => {

            })

          } else {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            })
          }

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          })
        }
      },
      handleContractDateSelect(val) {
        this.listQuery.startContractDate = val[0]
        this.listQuery.endContractDate = val[1]
      },
      handleDisabledDateSelect(val) {
        this.listQuery.startDisabledDate = val[0]
        this.listQuery.endDisabledDate = val[1]
      },
      handleEffectiveDateDateSelect(val) {
        this.listQuery.startEffectiveDate = val[0]
        this.listQuery.endEffectiveDate = val[1]
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0]
        this.listQuery.endBillDate = val[1]
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0]
        this.listQuery.endDeliverDate = val[1]
      },
      handleReceiptDateSelect(val) {
        this.listQuery.startReceiptDate = val[0]
        this.listQuery.endReceiptDate = val[1]
      }
    },
    watch: {
      contractDate(value) {
        if (value == null) {
          this.listQuery.startContractDate = undefined
          this.listQuery.endContractDate = undefined
        }
      },
      effectiveDate(value) {
        if (value == null) {
          this.listQuery.startEffectiveDate = undefined
          this.listQuery.endEffectiveDate = undefined
        }
      },
      disabledDate(value) {
        if (value == null) {
          this.listQuery.startDisabledDate = undefined
          this.listQuery.endDisabledDate = undefined
        }
      },
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined
          this.listQuery.endBillDate = undefined
        }
      },
      deliverDate(value) {
        if (value == null) {
          this.listQuery.startDeliverDate = undefined
          this.listQuery.endDeliverDate = undefined
        }
      },
      receiptDate(value) {
        if (value == null) {
          this.listQuery.startReceiptDate = undefined
          this.listQuery.endReceiptDate = undefined
        }
      }
    }
  }
</script>
