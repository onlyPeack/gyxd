<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" append-to-body @close="handleSelectorClose"
             :modal="true" :before-close="handleSelectorClose" class="billSelectorDialog purchaseOrderSelector">
    <div class="full-purchase purchase-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-order-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;">
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
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-date-picker
              v-model="billDate"
              type="daterange"
              style="vertical-align: top;width: 403px"
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
              style="vertical-align: top;width: 403px"
              unlink-panels
              range-separator="至"
              start-placeholder="交货开始日期"
              end-placeholder="交货结束日期"
              value-format="yyyy-MM-dd"
              @change="handleDeliverDateSelect"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>
          <div class="block">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
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
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="chooseData" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。"
                show-summary :summary-method="getSummaries" class="result-data-table">
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
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="180">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="180">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" min-width="320">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" min-width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="applyQty" label="未处理数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="qty" label="处理数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="canGoodsQty" label="可收货数量" align="right" width="90" class-name="col-required">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="120">
          <template slot-scope="scope">
              {{Number(scope.row.retailPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="releasePrice" label="发布单价" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.releasePrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="处理折扣" align="right" width="120" class-name="col-required">
           <template slot-scope="scope">
              {{Number(scope.row.discount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="taxPrice" label="付款单价" align="right" width="120" class-name="col-required">
           <template slot-scope="scope">
              {{Number(scope.row.taxPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="采购利润" align="right" width="120" class-name="col-required">
           <template slot-scope="scope">
              {{Number(scope.row.profit).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.amount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.tax).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="不含税单价" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.price).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.taxAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="deliverQty" label="收货数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInPurchaseQty" label="入库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockInPurchaseQty" label="未入库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="returnGoodsQty" label="退货数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInPurchaseAmount" label="入库金额" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="notStockInPurchaseAmount" label="未入库金额" align="right" width="120">
           <template slot-scope="scope">
              {{Number(scope.row.notStockInPurchaseAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="入库状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.receiptStatus" label="收货状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in receiptStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.receiptStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="170" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billAmount" label="单据金额" align="right" width="120">
          <template slot-scope="scope">
              {{Number(scope.row.mainDTO.billAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.taxBillAmount" label="单据价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.deliverDate" label="交货日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billDate" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="104">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container" style="margin-top: 15px;margin-bottom: 15px;">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[5,10,20,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row class="result-data-table" :height="450">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="180">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="180">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="180">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" min-width="320">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" min-width="180">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="applyQty" label="未处理数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="qty" label="处理数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="canGoodsQty" label="可收货数量" align="right" width="90" class-name="col-required">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.retailPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="releasePrice" label="发布单价" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.releasePrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="处理折扣" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">
            {{Number(scope.row.discount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="taxPrice" label="付款单价" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">
            {{Number(scope.row.taxPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="profit" label="采购利润" align="right" width="120" class-name="col-required">
          <template slot-scope="scope">
            {{Number(scope.row.profit).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.amount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.tax).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="不含税单价" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.price).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.taxAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="deliverQty" label="收货数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInPurchaseQty" label="入库数量" align="right" width="80" class-name="col-required">
        </el-table-column>
        <el-table-column prop="notStockInPurchaseQty" label="未入库数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="returnGoodsQty" label="退货数量" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="stockInPurchaseAmount" label="入库金额" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="notStockInPurchaseAmount" label="未入库金额" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.notStockInPurchaseAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.storageStatus" label="入库状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in storageStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.receiptStatus" label="收货状态" width="80">
          <template slot-scope="scope">
            <div v-for="item in receiptStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.receiptStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="170" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="币别" width="80">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billAmount" label="单据金额" align="right" width="120">
          <template slot-scope="scope">
            {{Number(scope.row.mainDTO.billAmount).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.taxBillAmount" label="单据价税合计" align="right" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.invoiceStatus" label="开票状态" width="100">
          <template slot-scope="scope">
            <div v-for="item in invoiceStatusOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.invoiceStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.deliverDate" label="交货日期" width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.billDate" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="100">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="104">
        </el-table-column>
        <el-table-column prop="purchaseInvoiceQty" label="开票数量" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="104">
        </el-table-column>
        <el-table-column prop="mainDTO.changeCount" label="变更次数" align="right" width="104">
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
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseOrder';
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
          billNo: '',
          supplierName: '',
          purchaserName: '',
          crtUserName: '',
          startBillDate: '',
          endBillDate: '',
          startDeliverDate: undefined,
          endDeliverDate: undefined,
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          selectType: this.type,  //type:2,采购退货申请单关联采购订单时,只查询采购订单入库数量大于0的
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'CGDD',
          name: '采购订单',
        }],
        sourceObject: {
          key: 'CGDD',
          name: '采购订单',
        },
        billDate: '',
        deliverDate: ''
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
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records;
          for (let i = 0; i <this.list.length ; i++) {
            this.list[i].retailPrice=Number(this.list[i].retailPrice).toFixed(4)
            this.list[i].releasePrice=Number(this.list[i].releasePrice).toFixed(4)
            this.list[i].taxPrice=Number(this.list[i].taxPrice).toFixed(4)
            this.list[i].taxAmount=Number(this.list[i].taxAmount).toFixed(4)
            this.list[i].profit=Number(this.list[i].profit).toFixed(4)
            this.list[i].amount=Number(this.list[i].amount).toFixed(4)
            this.list[i].stockInPurchaseAmount=Number(this.list[i].stockInPurchaseAmount).toFixed(4)
            this.list[i].notStockInPurchaseAmount=Number(this.list[i].notStockInPurchaseAmount).toFixed(4)
            this.list[i].mainDTO.billAmount=Number(this.list[i].mainDTO.billAmount).toFixed(4)
            this.list[i].mainDTO.taxBillAmount=Number(this.list[i].mainDTO.taxBillAmount).toFixed(4)
          }
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
            if (column.property == 'billAmount' || column.property == 'amount' || column.property == 'taxBillAmount'
              || column.property == 'tax' || column.property == 'taxAmount' || column.property == 'profit'
              || column.property == 'stockInPurchaseAmount' || column.property == 'notStockInPurchaseAmount') {
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
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
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
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSubmit() {
        this.selectedRows=this.listDrop
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        if (val.length > 0) {
          this.listQuery.startDeliverDate = val[0];
          this.listQuery.endDeliverDate = val[1];
        }
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
          if (row.mainDTO.billNo !== this.listDrop[i].mainDTO.billNo) {
            this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
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
              if(this.selectedRows[i].mainDTO.billNo !== this.selectedRows[j].mainDTO.billNo){
                this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
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
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = '';
          this.listQuery.endBillDate = '';
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

<style lang="scss">
  .purchaseOrderSelector {
    .el-dialog {
      margin-top:
      -10px!important;
    }
    .dialog-footer {
      margin-top: -20px;
    }
  }
</style>
<style scoped>
  .query-visible{
    color: #2da3fb;
    cursor: pointer;
  }
</style>
