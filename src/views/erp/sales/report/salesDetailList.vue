<template>
  <div class="app-container calendar-list-container sales-detail-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <!--<el-select v-model="listQuery.categoryId" placeholder="全部分类" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="false" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in categoryList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <!--<el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"-->
                   <!--class="filter-item" v-if="false" @change="handleFilter" filterable>-->
          <!--<el-option v-for="item in brandList" :key="item.value" :label="item.label"-->
                     <!--:value="item.value"></el-option>-->
        <!--</el-select>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.crtUserNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员姓名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.salerName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单位"
                  @keyup.enter.native="handleFilter" v-model="listQuery.unit">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
        <!--@keyup.enter.native="handleFilter" v-model="listQuery.skuNo">-->
        <!--</el-input>-->
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-download" :loading="downloadLoading"
                     @click="handleDownload">导出
          </el-button>
        </div>
      </div>
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
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
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight"
              :default-sort="{prop: 'stockOutAmount', order: 'descending'}" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号">
      </el-table-column>
      <el-table-column align="center" label="单据编号" prop="billNo">
      </el-table-column>
      <el-table-column align="center" label="业务员工号" prop="crtUserNo">
      </el-table-column>
      <el-table-column align="center" label="业务员姓名" prop="salerName">
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column align="center" label="品牌" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="center" label="客户名称" prop="customerName">
      </el-table-column>
      <el-table-column align="center" label="单位" prop="unit">
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

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
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
  import {selectPage} from '@/api/erp/sales/bill/salesDetail';
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
          brandName: undefined,
          seriesName: undefined,
          unit: undefined,
          categoryId: undefined,
          brandId: undefined,
          billNo: undefined,
          skuNo: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerName: undefined,
          salerName: undefined,
          crtUserNo: undefined,
        },
        brandList: [],
        categoryList: [],
        billDate: undefined,
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
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
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
          this.listQuery.startBillDate = val[0] + ' 00:00:00';
          this.listQuery.endBillDate = val[1] + ' 23:59:59';
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
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品', '客户', '业务员工号', '业务员姓名', '单位', '出库单价', '出库数量', '出库金额', '退库单价', '退库数量', '退库金额'];
          const filterVal = ['skuName', 'customerName', 'crtUserNo', 'salerName', 'unit', 'stockOutPrice', 'stockOutQty', 'stockOutAmount', 'returnStockPrice', 'returnStockQty', 'returnStockAmount'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '销售明细');
          this.downloadLoading = false;
        })
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .sales-detail-list-container {
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
