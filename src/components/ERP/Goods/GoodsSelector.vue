<template>
  <div class="app-container calendar-list-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
          <!--<el-select @change="handleCategoryChange" expand-trigger="hover" placeholder="全部分类" clearable
                     style="width: 200px"
                     class="filter-item">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>-->
          <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 190px"
                     class="filter-item" filterable>
            <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品名称"
                    @keyup.enter.native="handleFilter" v-model="listQuery.name">
          </el-input>
          <!--<el-input clearable class="filter-item" style="width: 190px;" placeholder="规格型号"-->
                    <!--@keyup.enter.native="handleFilter" v-model="listQuery.specifications">-->
          <!--</el-input>-->
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="标准系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="返点系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
          </el-input>
          <!--<el-input clearable class="filter-item" style="width: 190px;" placeholder="订货号"-->
                    <!--@keyup.enter.native="handleFilter" v-model="listQuery.itemNo">-->
          <!--</el-input>-->
          <el-input  class="filter-item" style="width: 190px;margin-right:5px;" placeholder="请输入订货号,多个订货号用空格隔开"
                     v-model="listQuery.itemNo" type="textarea" clearable>
          </el-input>
          <el-input  class="filter-item" style="width: 190px;margin-right:5px;" placeholder="请输入型号,多个型号用','隔开"
                     v-model="listQuery.specifications" type="textarea" clearable>
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" icon="el-icon-delete" @click="handleReset">重置</el-button>
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

            <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handleSelectChange" v-if="isSelectPage"
                      element-loading-text="正在查询中。。。" border fit
                      highlight-current-row :height="clientHeight"
                      style="width: 100%;height: 100%;position:relative;overflow: auto;">

              <!--<el-table-column align="center" label="商品编码" prop="goodsCode" fixed="left">-->
              <!--</el-table-column>-->
              <el-table-column type="selection" width="60" align="center">
              </el-table-column>
              <el-table-column align="center" min-width="100" label="商品名称" prop="name">
              </el-table-column>
              <el-table-column align="center" min-width="100" label="品牌名称" prop="brandName">
              </el-table-column>
              <el-table-column align="center" min-width="100" label="系列" prop="seriesName">
              </el-table-column>
              <el-table-column align="center" min-width="100" label="规格型号" prop="specModel">
              </el-table-column>
              <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
              </el-table-column>
              <el-table-column align="center" property="iconUrl" label="图片">
                <template slot-scope="scope">
                  <img :src="scope.row.picUrl" width="40"/>
                </template>
              </el-table-column>

              <!--<el-table-column align="center" label="详情" prop="detail">-->
              <!--<template slot-scope="scope">-->
              <!--<el-dialog title="商品详情" :visible.sync="detailDialogVisible" append-to-body>-->
              <!--<el-dialog title="商品详情" :visible.sync="detailDialogVisible" append-to-body>-->
              <!--<div v-html="goodsDetail"></div>-->
              <!--</el-dialog>-->
              <!--<el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>-->
              <!--</template>-->
              <!--</el-table-column>-->

              <el-table-column align="right" label="重量" prop="grossWeight">
              </el-table-column>

              <el-table-column align="right" label="产品面价" prop="retailPrice">
              </el-table-column>

              <el-table-column align="right" label="安全折扣" prop="safeDiscount" min-width="100">
              </el-table-column>

              <el-table-column align="right" label="安全价格" prop="safePrice" min-width="90">
              </el-table-column>

              <!--<el-table-column align="right" label="预计采购价" prop="costPrice" min-width="90">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" label="状态" prop="isOnSale">-->
              <!--<template slot-scope="scope">-->
              <!--<el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{scope.row.isOnSale ? '在售' : '未售'}}</el-tag>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column align="center" label="商品类型" min-width="100">
                <template slot-scope="scope">
                  <span v-for="item in goodsTypeList">
                    <span v-if="scope.row.productAttributeCategoryId ==item.id">{{item.name}}</span>
                </span>
              </template>
            </el-table-column>-->
              <!--<el-table-column align="right" label="所属分类ID" prop="categoryId">-->
              <!--</el-table-column>-->
              <!--<el-table-column align="right" label="所属品牌ID" prop="brandId" min-width="100">-->
              <!--</el-table-column>-->

              <el-table-column label="计量单位" prop="unit"></el-table-column>
              <!--<el-table-column align="center" label="是否代销" prop="isAgent">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isAgent ? 'success' : 'error' ">{{scope.row.isAgent ? '否' : '是'}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否称重" prop="isWeighing">
                <template slot-scope="scope">
                  <el-tag :type="scope.row.isWeighing ? 'success' : 'error' ">{{scope.row.isWeighing ? '否' : '是'}}
                </el-tag>
              </template>
            </el-table-column>-->
              <!--<el-table-column align="center" label="关键字" prop="keywords">-->
              <!--</el-table-column>-->
            </el-table>


            <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit v-else
                      highlight-current-row @select-change="handleSelectChange" @select="handleSelect"
                      :show-header="true"
                      @select-all="handleSelectAll" @row-click="handleRowClick" ref="goodsSelectorTable"
                      :height="clientHeight"
                      style="width: 100%;height: 100%;position:relative;">
              <el-table-column type="index" width="50" fixed="left">
              </el-table-column>
              <el-table-column type="selection" width="50" fixed="left">
              </el-table-column>
              <el-table-column align="center" property="iconUrl" label="图片">
                <template slot-scope="scope">
                  <img :src="scope.row.url" width="40"/>
                </template>
              </el-table-column>
              <!--<el-table-column align="center" label="商品编码" prop="skuNo" width="150">-->
              <!--</el-table-column>-->
              <el-table-column label="商品名称" prop="name" width="150">
              </el-table-column>
              <el-table-column label="品牌名称" prop="brandName" width="150">
              </el-table-column>
              <el-table-column label="标准系列" prop="seriesName" width="150">
              </el-table-column>
              <el-table-column label="返点系列" prop="rebateSeries" width="150">
              </el-table-column>
              <el-table-column label="规格型号" prop="specifications" width="220">
              </el-table-column>
              <el-table-column label="订货号" prop="itemNo" width="150">
              </el-table-column>
              <el-table-column align="center" label="单价" prop="price" width="150">
              </el-table-column>
              <el-table-column align="center" label="单位" prop="unit" width="100">
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
  import {page} from '@/api/erp/goods/goodsProduct';
  import {page as selectPage} from '@/api/erp/goods/goods';
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
          name: undefined,
          specifications: undefined,
          itemNo: undefined

        },
        isOpenTree: true,
        queryVisible: false,
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
    props: ['isSingle','isSelectPage','isOnSale'],
    methods: {
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
      handleReset() {
        this.listQuery = {
          page:1,
          limit:10
        }
        this.getList()
      },
      getList() {
        this.listLoading = true;
        this.listQuery.isOnSale=this.isOnSale
        let method=this.isSelectPage?selectPage:page
        method(this.listQuery)
          .then(response => {
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
        //this.$refs.goodsSelectorTable.clearSelection();
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
        var flag = false;
        for (var i = this.chooseGoods.length - 1; i >= 0; i--) {
          if (this.chooseGoods[i].goodsId == row.goodsId) {
            flag = true;
            this.chooseGoods.splice(i, 1);
          }
        }
        if (!flag) {
          this.chooseGoods.push(row)
        }
        //切换选中状态
        this.$refs.goodsSelectorTable.toggleRowSelection(row);
        //this.chooseGoods.push(Object.assign({}, row));
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
