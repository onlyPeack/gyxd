<template>
  <div class="bill-container  stock-change-record-summary-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-change-record-summary-filter">
      <div>
        <!--<el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="categoryList" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in categoryList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="brandList" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in brandList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="条形码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.stripeCode">-->
        <!--</el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
        </span>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                     @click="handleDownload">导出
          </el-button>
        </div>
      </div>
      <div v-show="queryVisible">
        <el-date-picker
          v-model="date"
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
        <!--<el-checkbox-group>-->
        <!--<el-checkbox label="选择时间内无出入库记录不显示"></el-checkbox>-->
        <!--<el-checkbox label="不显示明细分类"></el-checkbox>-->
        <!--</el-checkbox-group>-->
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight">
      <el-table-column align="center" label="商品" prop="skuName" width="180">
      </el-table-column>
      <el-table-column align="center" label="品牌" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="仓库" prop="warehouseName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="center" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="center" label="期初" prop="beginningPeriod">
      </el-table-column>
      <el-table-column align="center" label="采购入库" prop="purchaseStockIn">
      </el-table-column>
      <el-table-column align="center" label="生产入库" prop="productStockIn">
      </el-table-column>
      <el-table-column align="center" label="调拨入库" prop="allocateStockIn">
      </el-table-column>
      <el-table-column align="center" label="盘盈入库" prop="inventoryProfitStockIn">
      </el-table-column>
      <el-table-column align="center" label="销售退库" prop="salesStockReturn">
      </el-table-column>
      <el-table-column align="center" label="其它入库" prop="otherStockIn">
      </el-table-column>
      <el-table-column align="center" label="其他类型入库" prop="otherTypeStockIn" width="100">
      </el-table-column>
      <el-table-column align="center" label="入库合计" prop="totalStockIn">
      </el-table-column>
      <el-table-column align="right" label="销售出库" prop="salesStockOut">
      </el-table-column>
      <el-table-column align="right" label="领料出库" prop="pickingStockOut">
      </el-table-column>
      <el-table-column align="right" label="调拨出库" prop="allocateStockOut">
      </el-table-column>
      <el-table-column align="right" label="盘亏出库" prop="inventoryLossesStockOut">
      </el-table-column>
      <el-table-column align="right" label="采购退库" prop="purchaseStockReturn">
      </el-table-column>
      <el-table-column align="right" label="其他出库" prop="otherStockOut">
      </el-table-column>
      <el-table-column align="right" label="其他类型出库" prop="otherTypeStockOut" width="100">
      </el-table-column>
      <el-table-column align="right" label="出库合计" prop="totalStockOut">
      </el-table-column>
      <el-table-column align="right" label="期末" prop="endPeriod">
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
  import {summary} from '@/api/erp/wms/stock_query/stock-change-records';
  import {listCatAndBrand} from '@/api/erp/goods/goods';

  export default {
    name: 'stock-change-record-summary',
    data() {
      return {
        clientHeight: 300,
        queryVisible: false,
        list: undefined,
        total: undefined,
        listLoading: false,
        downloadLoading: false,
        listQuery: {
          categoryId: undefined,
          brandId: undefined,
          skuNo: undefined,
          specifications: undefined,
          warehouseName: undefined,
          stripeCode: undefined,
          startDate: undefined,
          endDate: undefined,
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
        },
        date: undefined,
        brandList: [],
        categoryList: []
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
        if (document.getElementsByClassName('stock-change-record-summary-filter')[0]) {
          var height = document.getElementsByClassName('stock-change-record-summary-filter')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (130 + height)) * 0.95;
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList;
          this.brandList = response.data.brandList;
        });
      },
      getList() {
        this.listLoading = true;
        summary(this.listQuery).then(response => {
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
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品', '规格型号', '单位', '仓库', '期初', '采购入库', '生产入库', '调拨入库', '盘盈入库', '销售退库', '其它入库', '其它类型入库', '入库合计',
            '销售出库', '领料出库', '调拨出库', '盘亏出库', '采购退库', '其它出库', '其它类型出库', '出库合计', '期末'];
          const filterVal = ['skuName', 'specifications', 'unit', 'warehouseName', 'beginningPeriod', 'purchaseStockIn', 'productStockIn', 'allocateStockIn', 'inventoryProfitStockIn',
            'salesStockReturn', 'otherStockIn', 'otherTypeStockIn', 'totalStockIn', 'salesStockOut', 'pickingStockOut', 'allocateStockOut', 'inventoryLossesStockOut',
            'purchaseStockReturn', 'otherStockOut', 'otherTypeStockOut', 'totalStockOut', 'endPeriod'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '出入库汇总');
          this.downloadLoading = false;
        })
      }
    },
    watch: {
      date(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .stock-change-record-summary-container {
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
