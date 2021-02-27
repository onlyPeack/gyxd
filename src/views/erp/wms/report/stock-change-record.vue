<template>
  <div class="bill-container stock-change-record-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-change-record-filter-container">
      <div>
        <!--<el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="categoryList" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in categoryList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据类型"
                  @keyup.enter.native="handleFilter" v-model="listQuery.objectName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="条形码"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.stripeCode">-->
        <!--</el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading"
                     @click="handleDownload">导出
          </el-button>
        </div>
      </div>
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
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
          <!--<el-checkbox label="是否显示下架/删除的商品"></el-checkbox>-->
        <!--</el-checkbox-group>-->
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column align="center" label="单据编号" prop="billNo" width="200" sortable>
      </el-table-column>
      <el-table-column align="center" label="单据类型" prop="objectName">
      </el-table-column>
      <el-table-column align="center" label="仓库" prop="warehouseName">
      </el-table-column>
      <el-table-column align="center" label="仓位" prop="warehousePositionName">
      </el-table-column>
      <!--<el-table-column align="center" label="商品编码" prop="skuNo">-->
      <!--</el-table-column>-->
      <el-table-column label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column label="规格型号" prop="specifications" width="220">
      </el-table-column>
      <el-table-column label="品牌" prop="brandName">
      </el-table-column>
      <el-table-column label="标准系列" prop="seriesName">
      </el-table-column>
      <el-table-column label="返点系列" prop="rebateSeries">
      </el-table-column>
      <el-table-column label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="center" label="操作时间" prop="crtTime" sortable width="200">
      </el-table-column>
      <el-table-column align="center" label="操作" prop="opertionName">
      </el-table-column>
      <el-table-column align="center" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="qtyIn">
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="qtyOut">
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
  import {listCatAndBrand} from '@/api/erp/goods/goods';
  import {page} from '@/api/erp/wms/stock_query/stock-change-records';

  export default {
    name: 'stock-change-record',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        downloadLoading: false,
        queryVisible: false,
        listQuery: {
          skuName: undefined,
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
          billMo: undefined,
          objectName: undefined,
        },
        date: undefined,
        brandList: [],
        categoryList: []
      }
    },
    created() {
      this.init();
      const _this = this;
      //this.changeDivHeight();
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
        if (document.getElementsByClassName('stock-change-record-filter-container')[0]) {
          var height = document.getElementsByClassName('stock-change-record-filter-container')[0].clientHeight;
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
        page(this.listQuery).then(response => {
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
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['仓库', '仓位','规格型号', '商品编码', '商品名称', '单据编号', '单据类型', '操作时间','操作', '单位', '入库数量', '出库数量'];
          const filterVal = ['warehouseName','warehousePositionName', 'specifications', 'skuNo', 'skuName', 'billNo', 'objectName', 'crtTime','opertionName', 'unit', 'qtyIn', 'qtyOut'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '出入库明细');
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
  .stock-change-record-container {
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
