<template>
  <div style="margin: 10px;" class="goods-stock-query-container">
    <el-row>
      <el-col :span="4">
        <!-- 分类树 -->
        <el-card class="box-card" :style="{height:(clientHeight+77)+'px'}">
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
      <el-col :span="20" style='padding-left:10px;'>
        <!-- 查询和其他操作 -->
        <div class="filter-container goods-stock-filter-container">
          <el-row>
            <el-col :span="24">
              <el-col :span="4">
                <el-select v-model="listQuery.brandId" placeholder="全部品牌" class="filter-item"
                           v-if="brandList" @change="handleFilter" filterable clearable>
                  <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input clearable class="filter-item" placeholder="商品名称"
                          @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-input clearable class="filter-item" placeholder="规格型号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-input clearable class="filter-item" placeholder="订货号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
                </el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="listQuery.source" placeholder="库存来源" clearable style="width: 190px"
                           class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
                  <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询
                </el-button>
              </el-col>
            </el-col>
          </el-row>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row width="100%" :height="clientHeight" :show-header="true" ref="goodsSelectorTable"
                  @select-change="handleSelectChange" @select="handleSelect"
                  @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="index" width="50" fixed="left">
          </el-table-column>
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>
          <el-table-column label="品牌" prop="brandName">
          </el-table-column>
          <el-table-column label="商品名称" prop="skuName" width="150">
          </el-table-column>
          <el-table-column label="规格型号" prop="specifications" width="150">
          </el-table-column>
          <el-table-column label="订货号" prop="itemNo" width="150">
          </el-table-column>
          <!--<el-table-column label="仓库" prop="warehouseName" min-width="180">
          </el-table-column>-->
          <el-table-column align="right" label="可用数量">
            <template slot-scope="scope">{{ scope.row.qty - scope.row.lockedQty }}</template>
          </el-table-column>
<!--          <el-table-column align="right" label="库存数量" prop="qty" width="100">-->
<!--          </el-table-column>-->
          <!--<el-table-column align="right" label="在途数量" prop="onWayQty">
          </el-table-column>-->
          <!--<el-table-column align="right" label="面价" prop="costPrice" width="120">
          </el-table-column>-->
          <!--<el-table-column align="right" label="参考售价" prop="retailPrice">
          </el-table-column>-->
<!--          <el-table-column align="right" label="锁定库存" prop="lockedQty">-->
<!--          </el-table-column>-->
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,50,200]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import { listCatAndBrand } from '@/api/erp/goods/goods'
  import { queryStockDetail } from '@/api/erp/wms/stock_query/index'
  import { pageAll } from '@/api/erp/wms/config/warehouse'

  export default {
    props: ['isSingle', 'customerCode'],
    components: {},
    data() {
      return {
        warehouseList: [],
        chooseGoods: [],
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        sourceOption: [{
          value: '0',
          label: '线上库存'
        }, {
          value: '1',
          label: '线下库存'
        }],
        listQuery: {
          page: 1,
          limit: 10,
          categoryId: '',
          brandId: '',
          skuNo: '',
          skuName: '',
          specifications: '',
          warehouseName: '',
          positionName: ''
        },
        dataDTO: {
          skuNo: '',
          skuName: '',
          specifications: '',
          warehouseId: '',
          warehouseName: ''
        },
        brandList: [],
        categoryList: [],
        isOpenTree: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        fileList: undefined
      }
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val)
      }
    },
    created() {
      this.init()
      this.getList()

      const _this = this
      window.onresize = function() {
        _this.changeDivHeight('goods-stock-filter-container')
      }
    },
    updated() {
      this.changeDivHeight('goods-stock-filter-container')
    },
    methods: {
      changeDivHeight(className) {
        if (document.getElementsByClassName(className)[0]) {
          var height = document.getElementsByClassName(className)[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (180 + height)) * 1
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList
          this.brandList = response.data.brandList
        })
        this.getWarehouseList()
      },
      getWarehouseList() {
        pageAll().then(response => {
          this.warehouseList = response.data
        })
      },
      OnSubmit() {
        if (this.isSingle && this.chooseGoods.length > 1) {
          return
        }

        this.$emit('closeGoodsDialog', this.chooseGoods)
      },
      reset() {
        this.$refs.goodsSelectorTable.clearSelection()
        this.chooseGoods = []
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
          if (this.chooseGoods[i].goodsId == row.goodsId) {
            flag = true
            this.chooseGoods.splice(i, 1)
          }
        }
        if (!flag) {
          this.chooseGoods.push(row)
        }
        //切换选中状态
        this.$refs.goodsSelectorTable.toggleRowSelection(row)
        //this.chooseGoods.push(Object.assign({}, row));
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getList() {
        this.listLoading = true
        // 客户id，查询调整后的价格
        this.listQuery.customerCode = this.customerCode
        queryStockDetail(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleOpenTree() {
        this.isOpenTree = !this.isOpenTree
        for (var i in this.$refs.categoryTree.store.nodesMap) {
          this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree
        }
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data) {
        this.listQuery.categoryId = data.value
        this.handleFilter()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-stock-query-container {
    width: 100%;

    .filter-container {
      padding-bottom: 0px;

      .filter-item {
        width: 100%;
        padding-right: 10px;
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__body {
      padding-top: 10px;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }

    .box-card {
      overflow: auto;
    }

    .pagination-container {
      margin-top: 10px;
    }
  }
</style>
