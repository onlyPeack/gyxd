<template>
  <div class="app-container calendar-list-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <!--       <el-select @change="handleCategoryChange" expand-trigger="hover" placeholder="全部分类" clearable
                          style="width: 200px"
                          class="filter-item">
                 <el-option v-for="item in categoryList" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
               </el-select>-->
        <!-- <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px"
                   class="filter-item" filterable>
          <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select> -->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName" disabled>
        </el-input>
        <!-- <el-select v-model="listQuery.source" placeholder="库存来源" clearable style="width: 190px"
                   class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
          <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select> -->
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="result-container">
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row @select-change="handleSelectChange" @select="handleSelect"
                  :show-header="true"
                  @select-all="handleSelectAll" @row-click="handleRowClick" ref="goodsSelectorTable"
                  :height="clientHeight"
                  style="width: 100%;height: 100%;position:relative;">
          <el-table-column type="index" width="50" fixed="left">
          </el-table-column>
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>
          <el-table-column label="仓库编码" prop="warehouseId" width="120">
          </el-table-column>
          <el-table-column label="仓库名称" prop="warehouseName" width="120">
          </el-table-column>
          <el-table-column label="仓位名称" prop="warehousePositionName" width="120">
          </el-table-column>
          <el-table-column label="商品名称" prop="skuName" width="150">
          </el-table-column>
          <el-table-column label="品牌名称" prop="brandName" width="150">
          </el-table-column>
          <el-table-column label="系列名称" prop="seriesName" width="150">
          </el-table-column>
          <el-table-column label="规格型号" prop="specifications" width="150">
          </el-table-column>
          <el-table-column label="商品编码" prop="skuNo" width="220">
          </el-table-column>
          <el-table-column label="订货号" prop="itemNo" width="150">
          </el-table-column>
          <el-table-column label="批次号" prop="batchNumber" width="150">
          </el-table-column>
          <el-table-column label="库存类型" prop="stockType" width="150">
          </el-table-column>
          <el-table-column label="供应商" prop="supplierName" width="150">
          </el-table-column>
          <el-table-column align="right" class-name="col-required" label="面价" prop="retailPrice" width="150">
          </el-table-column>
          <el-table-column align="right" class-name="col-required" label="调拨价" prop="allocationPrice" width="150">
          </el-table-column>
          <el-table-column align="right" class-name="col-required" label="考核价" prop="checkPrice" width="150">
          </el-table-column>
          <el-table-column label="数量" prop="qty" width="150">
          </el-table-column>
          <el-table-column label="锁定数量" prop="lockedQty" width="150">
          </el-table-column>
          <el-table-column label="入库人员" prop="ownerName" width="150">
          </el-table-column>
          <el-table-column label="入库日期" prop="updTime" width="150">
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
  import { queryXSStockDetail } from '@/api/erp/wms/stock_query/index'

  export default {
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: 0,
        listLoading: false,
        tableKey: 0,
        chooseGoods: [],
        currentGoods: [],
        listQuery: {
          page: 1,
          limit: 10,
          selectType:5,
          warehouseId: '',
          warehouseName: ''
        },
        sourceOption: [{
          value: '0',
          label: '线上库存',
        }, {
          value: '1',
          label: '线下库存'
        }],
        isOpenTree: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        brandList: [],
        categoryList: []
      };
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      }
    },
    created() {
      this.listQuery.warehouseId=this.warehouseId;
      this.listQuery.warehouseName=this.warehouseName;
      this.getList();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    props: ['isSingle','warehouseId','warehouseName'],
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('goods-selector-filter-container')[0]) {
          var height = document.getElementsByClassName('goods-selector-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          selectType:5,
          warehouseId: this.warehouseId,
          warehouseName: this.warehouseName,
        }
      },
      getList() {
        this.listLoading = true;
        queryXSStockDetail(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleCategoryChange(val) {
        this.listQuery.categoryId = val;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        if (this.isSingle) {
          this.chooseGoods = [val.name];
          this.currentGoods = [val];
        } else {
          for (var i in this.chooseGoods) {
            if (this.chooseGoods[i] == val.name) {
              return;
            }
          }
          this.chooseGoods.push(val.name);
          this.currentGoods.push(val);
        }
      },
      OnSubmit(row) {
        this.$emit('closeGoodsDialog', this.chooseGoods);
      },
      reset() {
        this.$refs.goodsSelectorTable.clearSelection();
        this.chooseGoods = [];
        this.currentGoods = [];
      },
      handleFilter() {
        this.getList();
      },
      handleSelect(selection, row) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleSelectChange(selection, row) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleSelectAll(selection) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleRowClick(row, event, column) {
        //判断是否已选中
        var flag = false
        for (var i = this.chooseGoods.length - 1; i >= 0; i--) {
          if (this.chooseGoods[i].id == row.id) {
            flag = true
            this.chooseGoods.splice(i, 1)
          }
        }
        if (!flag) {
          this.chooseGoods.push(row)
        }
        this.$refs.goodsSelectorTable.toggleRowSelection(row);
        // this.chooseGoods.push(Object.assign({}, row));
      }
    }

  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .app-container {
    flex: 1;
    position: relative;
    box-sizing: border-box;
  }

  .main-container {
    position: absolute;
    left: 0px;
    right: 0px;
    height: 100%;
  }

  .result-container {
    height: 78%;
    overflow: auto;
  }

  .pagination-container {
    position: absolute;
    bottom: 20px;
    background-color: #fff;
  }

  .box-card {
    overflow: auto;
  }
</style>
