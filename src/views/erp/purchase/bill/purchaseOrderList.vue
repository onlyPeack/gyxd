<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                  v-model="listQuery.purchaserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;"
                   icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
      <div class="query-container">
        <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
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
        <el-date-picker
          v-model="deliverDate"
          type="daterange"
          align="right"
          style="width: 403px"
          unlink-panels
          range-separator="至"
          start-placeholder="交货日期"
          end-placeholder="交货日期"
          value-format="yyyy-MM-dd"
          @change="handleDeliverDateSelect"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="单据日期"
          style="width: 403px"
          end-placeholder="单据日期"
          value-format="yyyy-MM-dd"
          @change="handleBillDateSelect"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-input clearable class="filter-item" style="width: 200px;margin-top:6px" placeholder="关联单据"
                  v-model="listQuery.sourceBillNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <el-button type="text" id="import_bill" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleExport">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <el-button type="text" id="export_bill" :loading="isDownloading" @click="handleDownload">
        <i class="el-icon-download"></i>
        下载合同
      </el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'mainDTO.crtTime', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.supplierCode" align="center" label="供应商编号" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierName" label="供应商名称" width="200" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="mainDTO.purchaserCode" align="center" label="采购员工号" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.purchaserName" align="center" label="采购员姓名" width="100">
      </el-table-column>
      <el-table-column prop="departName" align="center" label="采购部门" width="120">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" align="center" label="品牌" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" align="center" label="标准系列" width="180">
      </el-table-column>
      <el-table-column prop="rebateSeries" align="center" label="返点系列" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="型号" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="center" min-width="180">
      </el-table-column>
      <el-table-column align="center" min-width="100" label="渠道类型编号" prop="channelTypeCode">
      </el-table-column>
      <el-table-column align="center" min-width="100" label="渠道类型名称" prop="channelTypeName">
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.factoryName" label="收货人" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.factoryPhone" label="收货人电话" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="warehouseName" label="收货仓库" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="warehouseAdress" label="仓库地址" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.paymentsMeans" label="支付方式" align="center" min-width="180">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" align="center" min-width="220">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="80">
      </el-table-column>
      <el-table-column prop="applyQty" label="未处理数量" align="right" width="120">
      </el-table-column>
      <el-table-column prop="qty" label="处理数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="canGoodsQty" label="可做收货数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="发布单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.releasePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="处理折扣" align="right" width="120" class-name="col-required">
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
      <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.tax).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="不含税单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.price).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxAmount).toFixed(4)}}
        </template>
      </el-table-column>

      <el-table-column prop="paymentApplyReturnAmount" label="已申请金额" align="right" width="120"
                       class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.paymentApplyReturnAmount).toFixed(4)}}
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
      <el-table-column prop="rebate" label="返点(参考)" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="rebatePrice" label="考核价(参考)" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxPrice-scope.row.rebatePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="rebateAmount" label="返利金额(参考)" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.qty*scope.row.rebatePrice).toFixed(4)}}
        </template>
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
      <el-table-column prop="thenCancelAmount" label="已核销金额" align="center" width="150" class-name="col-required"
                       sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.storageStatus" label="入库状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="(item,index) in storageStatusOptions" :key="index">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.storageStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.receiptStatus" label="收货状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="(item,index) in receiptStatusOptions" :key="index">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.receiptStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.deliverDate" label="交货日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="104">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'crtTime', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" width="100">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" width="180" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="purchaserCode" label="采购员工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="purchaserName" label="采购员姓名" align="center" width="100">
      </el-table-column>
      <el-table-column prop="departName" label="采购部门" align="center" width="120">
      </el-table-column>
      <el-table-column prop="billAmount" label="不含税金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.billAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxBillAmount" label="价税合计" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxBillAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="sumProfit" label="采购利润" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.sumProfit).toFixed(4)}}
        </template>
      </el-table-column> -->
      <!--<el-table-column prop="prePayment" label="预付金额" width="120" align="right" class-name="col-required">-->
      <!--</el-table-column>-->
      <el-table-column prop="invoiceStatus" label="开票状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in invoiceStatusOptions">
            <span v-if="item.value==scope.row.invoiceStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="storageStatus" label="入库状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in storageStatusOptions">
            <span v-if="item.value==scope.row.storageStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="receiptStatus" label="收货状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in receiptStatusOptions">
            <span v-if="item.value==scope.row.receiptStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="printCount" label="打印次数" align="right" width="104">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="changeCount" label="变更次数" align="right" width="104">-->
      <!--</el-table-column>-->
      <el-table-column prop="sourceBillNo" label="关联单据" align="center" width="160" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="120" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="deliverDate" label="交货日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
      <!-- <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <div
            style="display: flex;flex-direction: column;justify-content: center;align-items: center;color: rgb(64,158,255)">
            <a class="download"
               @click="handleDownloadContract(scope.row.id,scope.row.supplierId,scope.row.billNo)">下载合同</a>
          </div>
        </template>
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增采购订单弹窗 -->
    <purchase-order-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                         @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase-order-form>

    <!-- 采购订单详情弹窗 -->
    <purchase-order-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                         @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </purchase-order-view>
  </div>
</template>

<script>
  import {getBill, selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseOrder';
  import {getObj} from '@/api/erp/purchase/supplier/index'
  import {getFloat} from '@/utils/util';
  import "@/styles/print.scss";

  export default {
    name: "purchaseOrderList",
    components: {
      'purchase-order-form': () => import('./purchaseOrderForm'),
      'purchase-order-view': () => import('./purchaseOrderView')
    },
    data() {
      return {
        list: [],
        total: undefined,
        downloadLoading: false,
        listLoading: true,
        dataForm: {
          // currentDay: this.$moment().add(0, 'days').format("YYYY-MM-DD"),
          // validityDay: this.$moment().add(1, 'years').format("YYYY-MM-DD"),
          taxAmountTotalBig: '',
        },
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          supplierName: undefined,
          purchaserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: this.$moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD'),
          endBillDate: this.$moment().format("YYYY-MM-DD"),
          startDeliverDate: undefined,
          endDeliverDate: undefined,
          supplierCode: undefined,
          crtUserNo: undefined,
          departName: undefined,
          billStatus: undefined,
          brandName: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        //最近七天
        billDate: [this.$moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD'), this.$moment().format("YYYY-MM-DD")],
        deliverDate: undefined,
        isDownloading:false
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
      async handleDownloadContract(id, supplierId, billNo) {
        this.isDownloading = true;
        await getObj(supplierId).then(res => {
          console.log('res');
          console.log(res);
          this.$set(this.dataForm, 'bankName', res.data.bankName)
          this.$set(this.dataForm, 'bankAccount', res.data.bankAccount)
          this.$set(this.dataForm, 'taxpayerNumber', res.data.taxpayerNumber)
          this.$set(this.dataForm, 'warehouseAdress', res.data.warehouseAdress)
          this.$set(this.dataForm, 'linkPhone', res.data.linkPhone)
          this.$set(this.dataForm, 'linkMan', res.data.linkMan)
          
        })
        await getBill(id)
          .then(response => {
            console.log('response');
            console.log(response);
            this.dataForm = Object.assign(this.dataForm, response.data);
            this.$set(this.dataForm, 'currentDay', this.$moment(response.data.billDate).add(0, 'days').format("YYYY-MM-DD"))
            this.$set(this.dataForm, 'validityDay', this.$moment(response.data.billDate).add(1, 'years').format("YYYY-MM-DD"),)
            this.items = response.data.items;
            this.items.forEach((item, index) => [
              item.index = index + 1
            ])
            this.getTotal();
          });
        await this.exportWord(billNo)
          this.isDownloading = false        
      },
      getTotal() {
        var qtyTotal = 0;
        var amountTotal = 0;
        var taxTotal = 0;
        var taxAmountTotal = 0;
        for (var i in this.items) {
          if (!isNaN(this.items[i].amount)) {
            amountTotal = this.items[i].amount * 1 + amountTotal;
          }
          if (!isNaN(this.items[i].qty)) {
            qtyTotal = this.items[i].qty * 1 + qtyTotal;
          }
          if (!isNaN(this.items[i].tax)) {
            taxTotal = this.items[i].tax * 1 + taxTotal;
          }
          if (!isNaN(this.items[i].taxAmount)) {
            taxAmountTotal = this.items[i].taxAmount * 1 + taxAmountTotal;
          }
        }
        this.qtyTotal = getFloat(qtyTotal, 2);
        this.amountTotal = getFloat(amountTotal, 2);
        this.taxTotal = getFloat(taxTotal, 2);
        this.dataForm.taxAmountTotal = getFloat(taxAmountTotal, 2);
        // 大写
        this.dataForm.taxAmountTotalBig = this.convertCurrency(this.dataForm.taxAmountTotal)
      },
      // 点击导出word
      exportWord: function (billNo) {
        let _this = this;
        // 如果商品数量大于3个,用另外的模板
        let str = '';
        str = this.items.length >= 3 ? 'template1.docx' : 'template2.docx';
        // 读取并获得模板文件的二进制内容
        JSZipUtils.getBinaryContent(str, function (error, content) {
          // input.docx是模板。我们在导出的时候，会根据此模板来导出对应的数据
          // 抛出异常
          if (error) {
            throw error;
          }

          // 创建一个JSZip实例，内容为模板的内容
          let zip = new JSZip(content);
          // 创建并加载docxtemplater实例对象
          let doc = new window.docxtemplater().loadZip(zip);
          // 设置模板变量的值
          console.log('表单');
          console.log(_this.dataForm);
          doc.setData({
            ..._this.dataForm,
            table: _this.tableData
          });
          try {
            // 用模板变量的值替换所有模板变量
            doc.render();
          } catch (error) {
            // 抛出异常
            let e = {
              message: error.message,
              name: error.name,
              stack: error.stack,
              properties: error.properties
            };
            console.log(JSON.stringify({error: e}));
            throw error;
          }

          // 生成一个代表docxtemplater对象的zip文件（不是一个真实的文件，而是在内存中的表示）
          let out = doc.getZip().generate({
            type: "blob",
            mimeType:
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          });
          // 将目标文件对象保存为目标类型的文件，并命名
          saveAs(out, billNo + '.docx');
        });
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      // 导出
      handleExport() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          if (this.choose == true) {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据日期', '交货日期', '单据编号', '制单人', '采购员', '供应商', '币别', '金额', '价税合计', '状态', '开票状态', '商品编码', '商品名称', '订货号', '规格型号', '未处理数量', '处理数量', '单位', '面价', '发布单价', '处理折扣', '付款单价', '采购利润', '金额', '税额', '不含税单价', '价税合计', '收货数量', '入库数量', '未入库数量', '已付款金额', '入库金额', '未入库金额', '入库状态', '收货状态', '备注', '开票数量', '打印次数', '变更次数'];
            filterVal = ['billDate', 'deliverDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'billAmount', 'taxBillAmount', 'billStatus', 'invoiceStatus', 'skuNo', 'skuName', 'itemNo', 'specifications', 'applyQty', 'qty', 'unit', 'retailPrice', 'releasePrice', 'discount', 'taxPrice', 'profit', 'amount', 'tax', 'price', 'taxAmount', 'deliverQty', 'stockInPurchaseQty', 'paymentApplyReturnAmount', 'notStockInPurchaseQty', 'stockInPurchaseAmount', 'notStockInPurchaseAmount', 'storageStatus', 'receiptStatus', 'note', 'purchaseInvoiceQty', 'printCount', 'changeCount'];
          } else {
            tHeader = ['单据日期', '交货日期', '单据编号', '制单人', '采购员', '供应商', '币别', '金额', '已付款金额', '价税合计', '预付金额', '状态', '开票状态', '入库状态', '收货状态', '打印次数', '变更次数'];
            filterVal = ['billDate', 'deliverDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'billAmount', 'paymentApplyReturnAmount', 'taxBillAmount', 'prePayment', 'billStatus', 'invoiceStatus', 'storageStatus', 'receiptStatus', 'printCount', 'changeCount'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购订单');
          this.downloadLoading = false;
        })
      },
      // 下载合同
      handleDownload() {
       if(this.selectedRows.length == 0) {
         this.$message.warning('请先选择订单')
       } else if (this.selectedRows.length > 1) {
         this.$message.warning('只能选择一条订单')
       } else {
         if(!!this.choose) {
           this.handleDownloadContract(this.selectedRows[0].mainDTO.id,this.selectedRows[0].mainDTO.supplierId,this.selectedRows[0].mainDTO.billNo)
         } else {
           this.handleDownloadContract(this.selectedRows[0].id,this.selectedRows[0].supplierId,this.selectedRows[0].billNo)
         }
       }
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
            if (column.property == 'applyQty' || column.property == 'qty' || column.property == 'canGoodsQty' || column.property == 'sumProfit' || column.property == 'price' || column.property == 'billAmount' || column.property == 'amount' || column.property == 'taxBillAmount'
              || column.property == 'tax' || column.property == 'taxAmount' || column.property == 'profit' || column.property == 'prePayment'
              || column.property == 'stockInPurchaseAmount' || column.property == 'notStockInPurchaseAmount' || column.property == 'paymentApplyReturnAmount' || column.property == 'deliverQty' || column.property == 'stockInPurchaseQty' || column.property == 'notStockInPurchaseQty' || column.property == 'rebateAmount') {
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
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      getListByItem() {
        this.listLoading = true;
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records;
          this.list.forEach(item => {
            item.notStockInPurchaseAmount = (item.notStockInPurchaseQty * item.taxPrice).toFixed(4)
            // item.stockInPurchaseAmount = (item.stockInPurchaseQty * item.taxPrice).toFixed(4)
          })
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listLoading = true;
        if (this.choose == true) {
          this.listQuery.page = 1;
          this.getListByItem();
        } else {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = undefined,
          this.listQuery.supplierName = undefined,
          this.listQuery.purchaserName = undefined,
          this.listQuery.skuNo = undefined,
          this.listQuery.skuName = undefined,
          this.listQuery.seriesName = undefined,
          this.listQuery.itemNo = undefined,
          this.listQuery.specifications = undefined,
          this.listQuery.crtUserNo = undefined,
          this.listQuery.billStatus = undefined,
          this.listQuery.crtUserName = undefined,
          this.listQuery.sourceBillNo = undefined,
          this.billDate = undefined,
          this.deliverDate = undefined,
          this.listQuery.supplierCode = undefined,
          this.listQuery.departName = undefined,
          this.listQuery.brandName = undefined
        delete this.listQuery.rebateSeries
        this.handleFilter()
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
        });
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1]);
        }
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.id = this.selectedRows[0].id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.mainDTO.id;//详情
        }
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleBillDateSelect(val) {
        console.log(this.billDate);
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
      },
      handleOpenDetailOrForm(row) {
        var billStatus;
        if (row.billStatus) {
          billStatus = row.billStatus;
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
          }
        }
        if (billStatus && billStatus == 1) {
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.mainDTO.id;//详情
          }
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
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
