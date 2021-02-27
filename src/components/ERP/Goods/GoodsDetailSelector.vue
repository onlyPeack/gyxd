<template>
  <div class="app-container calendar-list-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
          <el-input v-model="listQuery.brandName" placeholder="全部品牌" clearable style="width: 200px"
                          class="filter-item" v-if="brandList" filterable>
                </el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品名称"
                          @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
                </el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="系列"
                          @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
                </el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="规格型号"
                          @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
                </el-input>
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="仓库"
                          @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
                </el-input>
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="仓位"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.positionName">-->
<!--                </el-input>-->
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="批次号"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.batchNumber">-->
<!--                </el-input>-->
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="锁库单号"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.lockingOrderNo">-->
<!--                </el-input>-->
                <el-select v-model="listQuery.source" placeholder="库存来源" clearable style="width: 190px"
                           class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
                  <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="入库类型"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.stockType">-->
<!--                </el-input>-->
                <el-input clearable class="filter-item" style="width: 190px;" placeholder="归属人"
                          @keyup.enter.native="handleFilter" v-model="listQuery.ownerName">
                </el-input>
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="采购"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.purchaserName">-->
<!--                </el-input>-->
<!--                <el-input clearable class="filter-item" style="width: 190px;" placeholder="供应商"-->
<!--                          @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">-->
<!--                </el-input>-->
                  <el-input type="textarea" clearable class="filter-item" style="width: 190px;" placeholder="请输入订货号,多个订货号请输入回车键隔开"
                          v-model="listQuery.itemNo">
                </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="danger" icon="el-icon-search" @click="handleReset">重置</el-button>
          <!--<span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">-->
          <!--<span v-show="!queryVisible">展开</span>-->
          <!--<span v-show="queryVisible">收起</span>-->
          <!--<i class="el-icon-arrow-down" v-show="!queryVisible"></i>-->
          <!--<i class="el-icon-arrow-up" v-show="queryVisible"></i>-->
          <!--</span>-->
        </div>
        <!--<div v-show="queryVisible">-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"-->
        <!--@keyup.enter.native="handleFilter" v-model="listQuery.specifications">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"-->
        <!--@keyup.enter.native="handleFilter" v-model="listQuery.itemNo">-->
        <!--</el-input>-->
        <!--</div>-->
      </div>

      <el-row>
<!--        <el-col :span="5">-->
<!--          &lt;!&ndash; 分类树 &ndash;&gt;-->
<!--          <el-card class="box-card" :style="{height:clientHeight+'px'}">-->
<!--            <el-row>-->
<!--              <el-col :span="16">-->
<!--                <el-input-->
<!--                  placeholder="输入关键字进行过滤"-->
<!--                  v-model="filterText">-->
<!--                </el-input>-->
<!--              </el-col>-->
<!--              <el-col :span="8">-->
<!--                <el-button type="text" icon="plus" @click="handleOpenTree"-->
<!--                           style="margin-left: 15px;font-size: 14px;">-->
<!--                  <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>-->
<!--                  <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>-->
<!--                </el-button>-->
<!--              </el-col>-->
<!--            </el-row>-->
<!--            <el-tree-->
<!--              class="filter-tree"-->
<!--              :data="categoryList"-->
<!--              node-key="value"-->
<!--              highlight-current-->
<!--              :props="defaultProps"-->
<!--              :expand-on-click-node="false"-->
<!--              :filter-node-method="filterNode"-->
<!--              ref="categoryTree"-->
<!--              @node-click="getNodeData"-->
<!--              default-expand-all-->
<!--              style='margin-top:10px;'-->
<!--            >-->
<!--            </el-tree>-->
<!--          </el-card>-->
<!--        </el-col>-->
        <el-col :span="24" style='padding-left:10px;'>
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
               <el-table-column label="品牌" prop="brandName" width="100">
              </el-table-column>
              <el-table-column label="系列" prop="seriesName" width="100">
              </el-table-column>
              <el-table-column label="商品名称" prop="skuName" width="150">
              </el-table-column>
              <el-table-column label="规格型号" prop="specifications" width="150">
              </el-table-column>
              <el-table-column label="订货号" prop="itemNo" width="150">
              </el-table-column>
              <el-table-column label="仓库" prop="warehouseName" width="100">
              </el-table-column>
              <el-table-column label="仓位" prop="positionName" width="100">
              </el-table-column>
              <el-table-column label="库存数量" prop="qty" align="right" width="100" sortable>
              </el-table-column>
              <el-table-column label="锁定数量" prop="lockedQty" align="right" width="100" sortable>
              </el-table-column>
              <el-table-column label="可售数量" prop="vendibility" align="right" width="100" sortable>
                <template slot-scope="scope">{{ scope.row.qty - scope.row.lockedQty }}</template>
              </el-table-column>
              <el-table-column label="面价" prop="retailPrice" align="right" class-name="col-requireds" width="90">
                 <template slot-scope="scope">
                  {{Number(scope.row.retailPrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column label="调拨价" prop="allocationPrice" align="right" class-name="col-requireds" sortable>
                <template slot-scope="scope">
                  {{Number(scope.row.allocationPrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column label="采购价" v-if="$store.getters.groupNames.indexOf('总经理') > -1" prop="purchasePrice" align="right" class-name="col-requireds" sortable>
                 <template slot-scope="scope">
                  {{Number(scope.row.purchasePrice).toFixed(4)}}
                </template>
              </el-table-column>
              <el-table-column label="调拨折扣" prop="discount" align="right" class-name="col-requireds" sortable
                               width="100">
                <template slot-scope="scope">{{ (scope.row.allocationPrice / scope.row.retailPrice).toFixed(4) }}</template>
              </el-table-column>
              <el-table-column label="库存金额" prop="amount" align="right" class-name="col-requireds" width="120">
                <template slot-scope="scope">
                  <span v-if="$store.getters.groupNames.indexOf('总经理') > -1">{{(scope.row.purchasePrice * scope.row.qty).toFixed(4)}}</span>
                  <span v-else>{{(scope.row.allocationPrice * scope.row.qty).toFixed(4)}}</span>
                </template>
              </el-table-column>
              <el-table-column label="库存来源" prop="source" width="90">
                <template slot-scope="scope">
                  <div v-for="item in sourceOption">
                    <span v-if="item.value==scope.row.source">{{item.label}}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="型号类型" prop="modelType" width="100">
              </el-table-column>
              <el-table-column label="入库类型" prop="stockType" width="100">
              </el-table-column>
              <el-table-column label="批次号" prop="batchNumber" width="170">
              </el-table-column>
              <el-table-column label="锁库单号" prop="lockingOrderNo" width="160">
              </el-table-column>
              <el-table-column label="库存操作人（归属人）" prop="ownerName" width="100">
              </el-table-column>
              <el-table-column label="采购" prop="purchaserName" width="100">
              </el-table-column>
              <el-table-column label="供应商" prop="supplierName" width="150">
              </el-table-column>
              <el-table-column label="入库时间" prop="crtTime" width="150">
              </el-table-column>
              <el-table-column label="商品编码" prop="skuNo" width="150">
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>


      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

  </div>
</template>

<script>
//   import {page} from '@/api/erp/goods/goodsProduct';
   import {selectDetailItem} from '@/api/erp/wms/stock_query/index'
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
          categoryId: undefined,
          brandId: undefined,
          skuNo: undefined,
          goodsName: undefined,
          specifications: undefined,
          itemNo: this.sp1,
          selectType:1,
          source:this.source
        },
        resetQuery:{

        },
        isOpenTree: true,
        queryVisible: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        brandList: [],
        categoryList: [],
        sourceOption: this.source == 0 ? [{
          value: '0',
          label: '线上库存'
        }, {
          value: '1',
          label: '线下库存'
        }] : [{
          value: '2',
          label: '调拨'
        }],
      };
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      }
    },
    created() {
      this.resetQuery = JSON.parse(JSON.stringify(this.listQuery))
      console.log(this.listQuery,this.sp1,this._props.sp1,'sp1')
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
    props: ['isSingle','source','sp1'],
    methods: {
      handleSource() {
        console.log('类型');
        console.log(this.source);
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
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
        console.log(this.listQuery,this.sp1,this._props,'sp1111')
        console.log('sp1111')
        selectDetailItem(this.listQuery).then(response => {
            var list = [];
            response.data.records.forEach(function (item) {
              item.price = item.retailPrice;
              list.push(item);
            });
            this.list = list;
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
        console.log(1111)
        this.getList();
      },
      handleReset() {
        this.listQuery = JSON.parse(JSON.stringify(this.resetQuery))
        this.getList()
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
        var flag = false;
        for (var i = this.chooseGoods.length - 1; i >= 0; i--) {
          if (this.chooseGoods[i].id == row.id) {
            flag = true;
            this.chooseGoods.splice(i, 1);
          }
        }
        if (!flag) {
          this.chooseGoods.push(row)
        }
        //切换选中状态
        this.$refs.goodsSelectorTable.toggleRowSelection(row);
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

  .goods-selector-filter-container {
    padding-bottom: 0px;

    .query-visible {
      color: #409EFF;
      margin-left: 10px;
      cursor: pointer;
      font-size: 14px;
    }

    .query-container {
      font-size: 14px;
      color: #444;
    }
  }
</style>
