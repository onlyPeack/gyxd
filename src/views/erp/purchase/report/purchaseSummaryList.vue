<template>
  <div class="app-container calendar-list-container purchase-summary-list-container">
    <el-tabs v-model="listQuery.activeName">
      <el-tab-pane label="按商品" name="skuNo">
      </el-tab-pane>
      <!--<el-tab-pane label="按商品" name="goodsId">-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="按分类" name="categoryId">
      </el-tab-pane>
      <el-tab-pane label="按供应商" name="supplier">
      </el-tab-pane>
      <el-tab-pane label="按部门" name="departId">
      </el-tab-pane>
      <el-tab-pane label="按采购员" name="purchaser">
      </el-tab-pane>
    </el-tabs>
    <!-- 查询和其他操作 -->
    <div class="filter-container sales-summary-list-filter-container">
      <div>
        <el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"
                   class="filter-item" v-if="categoryList" @change="handleFilter" filterable>
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleBillDateSelect"
          :picker-options="pickerOptions">
        </el-date-picker>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading" @click="handleDownloadByActiveName">导出</el-button>
        </div>
      </div>
      <div>
        <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"
                   class="filter-item" v-if="brandList" @change="handleFilter" filterable>
          <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                  @keyup.enter.native="handleFilter" v-model="listQuery.purchaserName">
        </el-input>
      </div>
    </div>

    <!-- 查询结果 -->
    <!--按单品、按商品-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight"
              v-if="listQuery.activeName=='skuNo'" key="resultTable1">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="right" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="right" label="入库单价" prop="stockInPurchasePrice">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchasePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInPurchaseQty">
      </el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInPurchaseAmount">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库单价" prop="returnStockPrice">
         <template slot-scope="scope">
          {{Number(scope.row.returnStockPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty">
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount">
         <template slot-scope="scope">
          {{Number(scope.row.returnStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>
    <!--按分类-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='categoryId'" key="resultTable2">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column align="center" label="分类" prop="categoryName">
      </el-table-column>
      <el-table-column align="right" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="right" label="入库单价" prop="stockInPurchasePrice">
         <template slot-scope="scope">
          {{Number(scope.row.stockInPurchasePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInPurchaseQty">
      </el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInPurchaseAmount">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库单价" prop="returnStockPrice">
        <template slot-scope="scope">
          {{Number(scope.row.returnStockPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty">
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount">
        <template slot-scope="scope">
          {{Number(scope.row.returnStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>
    <!--按供应商-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='supplier'" key="resultTable3">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column align="center" label="供应商" prop="supplierName">
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInPurchaseQty">
      </el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInPurchaseAmount">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty">
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount">
        <template slot-scope="scope">
          {{Number(scope.row.returnStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>
    <!--按部门-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='departId'" key="resultTable4">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column align="center" label="部门" prop="departName">
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInPurchaseQty">
      </el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInPurchaseAmount">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty">
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount">
        <template slot-scope="scope">
          {{Number(scope.row.returnStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>
    <!--按采购员-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='purchaser'" key="resultTable5">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column align="center" label="采购员" prop="purchaserName">
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="stockInPurchaseQty">
      </el-table-column>
      <el-table-column align="right" label="入库金额" prop="stockInPurchaseAmount">
        <template slot-scope="scope">
          {{Number(scope.row.stockInPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty">
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount">
         <template slot-scope="scope">
          {{Number(scope.row.returnStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {page, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/wms/config/warehouse';
  import {listCatAndBrand} from '@/api/erp/goods/goods';
  import {selectPage} from '@/api/erp/purchase/bill/purchaseSummary';

  export default {
    name: 'purchaseDetailList',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          skuName: undefined,
          categoryId: undefined,
          brandId: undefined,
          skuNo: undefined,
          supplierName: undefined,
          purchaserName: undefined,
          activeName: 'skuNo'
        },
        billDate: undefined,
        brandList: [],
        categoryList: [],
        downloadLoading: false
      }
    },
    created() {
      this.init();
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
      changeDivHeight() {
        if (document.getElementsByClassName('sales-summary-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-summary-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList;
          this.brandList = response.data.brandList;
        });
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDownloadByActiveName() {
        if (this.listQuery.activeName == 'skuNo') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['商品', '单位', '入库单价', '入库数量', '入库金额', '退库单价', '退库数量', '退库金额'];
            const filterVal = ['skuName', 'unit', 'stockInPurchasePrice', 'stockInPurchaseQty', 'stockInPurchaseAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '采购汇总-按单品/商品');
            this.downloadLoading = false;
          })
        }else if (this.listQuery.activeName == 'categoryId') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['分类', '单位', '入库单价', '入库数量', '入库金额', '退库单价', '退库数量', '退库金额'];
            const filterVal = ['categoryName', 'unit', 'stockInPurchasePrice', 'stockInPurchaseQty', 'stockInPurchaseAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '采购汇总-按分类');
            this.downloadLoading = false;
          })
        }else if (this.listQuery.activeName == 'supplier') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['供应商', '入库数量', '入库金额', '退库数量', '退库金额'];
            const filterVal = ['supplierName', 'stockInPurchaseQty', 'stockInPurchaseAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '采购汇总-按供应商');
            this.downloadLoading = false;
          })
        }else if (this.listQuery.activeName == 'departId') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['部门', '入库数量', '入库金额', '退库数量', '退库金额'];
            const filterVal = ['departName', 'stockInPurchaseQty', 'stockInPurchaseAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '采购汇总-按部门');
            this.downloadLoading = false;
          })
        }else if (this.listQuery.activeName == 'purchaser') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['采购员', '入库数量', '入库金额', '退库数量', '退库金额'];
            const filterVal = ['purchaserName', 'stockInPurchaseQty', 'stockInPurchaseAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '采购汇总-按采购员');
            this.downloadLoading = false;
          });
        }
      },
    },
    computed: {
      activeName() {
        return this.listQuery.activeName;
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
      activeName: {
        handler() {
          this.getList();
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .purchase-summary-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }
</style>
