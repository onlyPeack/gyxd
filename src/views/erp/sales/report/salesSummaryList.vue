<template>
  <div class="app-container calendar-list-container sales-summary-list-container">
    <el-tabs v-model="listQuery.activeName">
      <el-tab-pane label="按商品" name="skuNo">
      </el-tab-pane>
      <!--<el-tab-pane label="按商品" name="goodsId">-->
      <!--</el-tab-pane>-->
      <el-tab-pane label="按分类" name="categoryId">
      </el-tab-pane>
      <el-tab-pane label="按客户" name="customer">
      </el-tab-pane>
      <el-tab-pane label="按部门" name="departId">
      </el-tab-pane>
      <el-tab-pane label="按业务员" name="salerId">
      </el-tab-pane>
    </el-tabs>
    <!-- 查询和其他操作 -->
    <div class="filter-container sales-summary-list-filter-container">
      <div>
        <!--<el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"-->
        <!--class="filter-item" v-if="categoryList" @change="handleFilter" filterable>-->
        <!--<el-option v-for="item in categoryList" :key="item.value" :label="item.label"-->
        <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"-->
        <!--class="filter-item" v-if="brandList" @change="handleFilter" filterable>-->
        <!--<el-option v-for="item in brandList" :key="item.value" :label="item.label"-->
        <!--:value="item.label"></el-option>-->
        <!--</el-select>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
        <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading"
                     @click="handleDownloadByActiveName">导出
          </el-button>
        </div>
      </div>

      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="分类名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.categoryName"
                  v-if="listQuery.activeName=='categoryId'">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName"
                  v-if="listQuery.activeName=='customer'">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode"
                  v-if="listQuery.activeName=='customer'">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.salerName"
                  v-if="listQuery.activeName=='salerId'">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.salerCode"
                  v-if="listQuery.activeName=='salerId'">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="部门名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.departName"
                  v-if="listQuery.activeName=='departId'">
        </el-input>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleBillDateSelect"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>

    </div>

    <!-- 查询结果 -->
    <!--按商品-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight"
              v-if="listQuery.activeName=='skuNo'" key="resultTable1"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column align="center" label="品牌名称" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="right" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="right" label="出库单价" prop="stockOutPrice" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="stockOutQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="stockOutAmount" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库单价" prop="returnStockPrice" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount" sortable>
      </el-table-column>
    </el-table>
    <!--按分类-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='categoryId'" key="resultTable2"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="center" label="分类" prop="categoryName">
      </el-table-column>
      <el-table-column align="right" label="单位" prop="unit">
      </el-table-column>
      <el-table-column align="right" label="出库单价" prop="stockOutPrice" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="stockOutQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="stockOutAmount" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库单价" prop="returnStockPrice" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount" sortable>
      </el-table-column>
    </el-table>
    <!--按客户-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='customer'" key="resultTable3"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName">
      </el-table-column>
      <el-table-column align="center" label="客户编号" prop="customerCode">
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="stockOutQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="stockOutAmount" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount" sortable>
      </el-table-column>
    </el-table>
    <!--按部门-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='departId'" key="resultTable4"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="left" label="部门" prop="departName">
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="stockOutQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="stockOutAmount" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount" sortable>
      </el-table-column>
    </el-table>
    <!--按业务员-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" v-if="listQuery.activeName=='salerId'" key="resultTable5"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="center" label="业务员" prop="salerName">
        <template slot-scope="scope">
          {{scope.row.salerCode}} <span v-if="scope.row.salerCode">-</span> {{scope.row.salerName}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="stockOutQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="出库金额" prop="stockOutAmount" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库数量" prop="returnStockQty" sortable>
      </el-table-column>
      <el-table-column align="right" label="退库金额" prop="returnStockAmount" sortable>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,500,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {page, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/wms/config/warehouse';
  import {listCatAndBrand} from '@/api/erp/goods/goods';
  import {selectPage} from '@/api/erp/sales/bill/salesSummary';
  import {getFloat} from '@/utils/util';

  export default {
    name: 'salesDetailList',
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
          categoryName: undefined,
          brandId: undefined,
          skuNo: undefined,
          itemNo: undefined,
          specifications: undefined,
          seriesName: undefined,
          brandName: undefined,
          departName: undefined,
          customerName: undefined,
          customerCode: undefined,
          salerName: undefined,
          salerCode: undefined,
          activeName: 'skuNo'
        },
        billDate: undefined,
        brandList: [],
        categoryList: [],
        downloadLoading: false,
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
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 0.95;
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
        if (val) {
          this.listQuery.startBillDate = val[0];
          this.listQuery.endBillDate = val[1];
        }
      },
      handleDownloadByActiveName() {
        if (this.listQuery.activeName == 'skuNo') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['商品名称', '品牌名称', '订货号', '型号', '单位', '出库单价', '出库数量', '出库金额', '退库单价', '退库数量', '退库金额'];
            const filterVal = ['skuName', 'brandName', 'itemNo', 'specifications', 'unit', 'stockOutPrice', 'stockOutQty', 'stockOutAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售汇总-按单品/商品');
            this.downloadLoading = false;
          })
        } else if (this.listQuery.activeName == 'categoryId') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['分类', '单位', '出库单价', '出库数量', '出库金额', '退库单价', '退库数量', '退库金额'];
            const filterVal = ['categoryName', 'unit', 'stockOutPrice', 'stockOutQty', 'stockOutAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售汇总-按分类');
            this.downloadLoading = false;
          })
        } else if (this.listQuery.activeName == 'customer') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['客户名称', '客户编码', '出库数量', '出库金额', '退库数量', '退库金额'];
            const filterVal = ['customerName', 'customerCode', 'stockOutQty', 'stockOutAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售汇总-按客户');
            this.downloadLoading = false;
          })
        } else if (this.listQuery.activeName == 'departId') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['部门', '出库数量', '出库金额', '退库数量', '退库金额'];
            const filterVal = ['departName', 'stockOutQty', 'stockOutAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售汇总-按部门');
            this.downloadLoading = false;
          })
        } else if (this.listQuery.activeName == 'salerId') {
          this.downloadLoading = true;
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['业务员工号', '业务员姓名', '出库数量', '出库金额', '退库数量', '退库金额'];
            const filterVal = ['salerCode', 'salerName', 'stockOutQty', 'stockOutAmount', 'returnStockQty', 'returnStockAmount'];
            excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售汇总-按业务员');
            this.downloadLoading = false;
          });
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
            if (column.property == 'stockOutQty' || column.property == 'stockOutAmount' || column.property == 'returnStockQty'
              || column.property == 'returnStockAmount') {
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
    }
  }
</script>

<style lang="scss" scoped>
  .sales-summary-list-container {
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
