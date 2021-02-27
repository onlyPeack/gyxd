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
        <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px"
                   class="filter-item" filterable>
          <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
        </el-input>
        <el-select v-model="listQuery.source" placeholder="库存来源" clearable style="width: 190px"
                   class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
          <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      </div>

      <el-row>
        <el-col :span="5">
          <!-- 分类树 -->
          <el-card class="box-card" :style="{height:clientHeight+'px'}">
            <el-row>
              <el-col :span="16">
                <el-input
                  placeholder="输入关键字进行过滤"
                  v-model="filterText">
                </el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="text" icon="plus" @click="handleOpenTree"
                           style="margin-left: 15px;font-size: 14px;">
                  <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>
                  <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>
                </el-button>
              </el-col>
            </el-row>
            <el-tree
              class="filter-tree"
              :data="categoryList"
              node-key="value"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="categoryTree"
              @node-click="getNodeData"
              default-expand-all
              style='margin-top:10px;'
            >
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19" style='padding-left:10px;'>
          <!-- 查询结果 -->
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
              <el-table-column align="center" label="品牌名称" prop="brandName" width="150">
              </el-table-column>
              <el-table-column align="center" label="商品编码" prop="skuNo" width="150">
              </el-table-column>
              <el-table-column label="商品名称" prop="skuName" width="200">
              </el-table-column>
              <el-table-column label="规格型号" prop="specifications" width="220">
              </el-table-column>
              <el-table-column label="库存来源" prop="source">
                <template slot-scope="scope">
                  <div v-for="item in sourceOption">
                    <span v-if="item.value==scope.row.source">{{item.label}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="仓库" prop="warehouseName" width="150">
              </el-table-column>
              <el-table-column align="center" label="仓位" prop="positionName" width="150">
              </el-table-column>
              <el-table-column align="center" label="单位" prop="unit" width="100">
              </el-table-column>
              <el-table-column align="center" label="可用数量" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.qty - scope.row.lockedQty }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="库存数量" prop="qty" width="100">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>

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
  import {pageBySingleProduct} from '@/api/erp/wms/stock_query/index';
  import {listCatAndBrand} from '@/api/erp/goods/goods';

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
          categoryId: '',
          brandId: '',
          skuNo: '',
          goodsName: '',
          specifications: '',
          warehouseName: '',
          warehouseId: ''
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
      this.getList();
      this.init();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    props: ['isSingle','warehouseId'],
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('goods-selector-filter-container')[0]) {
          var height = document.getElementsByClassName('goods-selector-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      handleOpenTree() {
        this.isOpenTree = !this.isOpenTree;
        for (var i in this.$refs.categoryTree.store.nodesMap) {
          this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.categoryId = data.value;
        this.handleFilter();
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList;
          this.brandList = response.data.brandList;
        });
      },
      getList() {
        this.listLoading = true;
        pageBySingleProduct(this.listQuery)
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
        this.$refs.goodsSelectorTable.toggleRowSelection(row);
        this.chooseGoods.push(Object.assign({}, row));
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
