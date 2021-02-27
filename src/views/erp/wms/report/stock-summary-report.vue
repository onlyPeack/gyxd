<template>
  <div class="bill-container stock-summary-report-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-summary-report-filter-container">
      <div>
        <!--<el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="categoryList" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in categoryList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"
                   class="filter-item" v-if="brandList" @change="handleFilter" filterable>
          <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="条形码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.stripeCode">-->
        <!--</el-input>-->
        <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
        </span>
        <div style="float: right;">
          <span class="index-explanation"><i class="el-icon-question"></i>指标说明</span>
          <div class="explain-content">
            a）实际库存：所选仓库范围中实际在库的库存<br>
            b）可用库存：所选仓库范围中实际库存-锁定库存<br>
            c）锁定库存：所选仓库范围中通过手工锁定的库存（不包含发货通知单锁库）<br>
            d）销售预出库：全公司客户订货单未出库且未关闭的+未关联客户订货单的发货通知单中未出库的<br>
            e）采购预入库：全公司采购订单未入库且未关闭的+未关联采购订单的收货通知单中未入库的<br>
            f）生产预入库：全公司生产订单未入库且未关闭的<br>
            g）预计库存：预计库存=实际库存+采购预入库+生产预入库-锁定库存-销售预出库
          </div>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                     @click="handleDownload">导出
          </el-button>
        </div>
      </div>
      <div v-show="queryVisible">
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
        </el-input>

        <el-checkbox-group v-model="listQuery.isActualStoreQty">
          <el-checkbox label="只显示有实际库存的" true-label=0 false-label=1></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight">

      <el-table-column align="center" label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="center" label="品牌" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="right" label="实际库存" prop="actualStoreQty">
      </el-table-column>

      <el-table-column align="right" label="可用库存" prop="availableQty">
      </el-table-column>

      <el-table-column align="right" label="锁定库存" prop="lockedQty">
      </el-table-column>

      <el-table-column align="right" label="销售预出库" prop="salesPreDelivery">
      </el-table-column>

      <el-table-column align="right" label="采购预入库" prop="purchasePreWarehousing">
      </el-table-column>

      <el-table-column align="right" label="生产预入库" prop="productionPreWarehousing">
      </el-table-column>

      <el-table-column align="right" label="预计库存" prop="expectedStock">
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
  import {stockSummary} from '@/api/erp/wms/stock_query/index';
  import {listCatAndBrand} from '@/api/erp/goods/goods';

  export default {
    name: 'stock-summary-report',
    data() {
      return {
        clientHeight: 300,
        queryVisible: false,
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
          specifications: undefined,
          warehouseName: undefined,
          stripeCode: undefined,
          isActualStoreQty: undefined,
          brandName: undefined,
          seriesName: undefined,
          itemNo:undefined,
        },
        downloadLoading: false,
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
        if (document.getElementsByClassName('stock-summary-report-filter-container')[0]) {
          var height = document.getElementsByClassName('stock-summary-report-filter-container')[0].clientHeight;
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
        stockSummary(this.listQuery).then(response => {
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
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品名称', '规格型号', '单位', '实际库存', '可用库存', '锁定库存', '销售预出库', '采购预入库', '生产预入库', '预计库存'];
          const filterVal = ['skuName', 'specifications', 'unit', 'actualStoreQty', 'availableQty', 'lockedQty', 'salesPreDelivery', 'purchasePreWarehousing', 'productionPreWarehousing', 'expectedStock'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '库存汇总报表');
          this.downloadLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stock-summary-report-container {
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
