<template>
  <div class="app-container calendar-list-container" v-cloak>
    <div class="main-container">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
<!--         <el-input clearable class="filter-item" style="width: 160px;" placeholder="单据编号"-->
<!--                  v-model="listQuery.billNo"-->
<!--                  @keyup.enter.native="handleFilter">-->
<!--        </el-input>-->
<!--        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>-->
<!--          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--        <el-input clearable class="filter-item" style="width: 160px;" placeholder="采购员工号"-->
<!--                  v-model="listQuery.crtUserNo"-->
<!--                  @keyup.enter.native="handleFilter">-->
<!--        </el-input>-->
<!--        <el-input clearable class="filter-item" style="width: 160px;" placeholder="采购员姓名"-->
<!--                  v-model="listQuery.crtUserName"-->
<!--                  @keyup.enter.native="handleFilter">-->
<!--        </el-input>-->
<!--        <el-input clearable class="filter-item" style="width: 160px;" placeholder="采购部门"-->
<!--                  v-model="listQuery.departName"-->
<!--                  @keyup.enter.native="handleFilter">-->
<!--        </el-input>-->
<!--        <el-input clearable class="filter-item" style="width: 160px;" placeholder="到货仓库"-->
<!--                  v-model="listQuery.warehouseName"-->
<!--                  @keyup.enter.native="handleFilter">-->
<!--        </el-input>-->
<!--        <el-select v-model="listQuery.publishType" class="filter-item" placeholder="发布类型" disabled>-->
<!--          <el-option v-for="item in publishList" :key="item.value" :label="item.label" :value="item.value">-->
<!--          </el-option>-->
<!--        </el-select>-->
<!--        <el-date-picker style="position: relative;top:-4px;"-->
<!--                        v-model="crtTime"-->
<!--                        type="daterange"-->
<!--                        align="right"-->
<!--                        unlink-panels-->
<!--                        range-separator="至"-->
<!--                        start-placeholder="创建日期"-->
<!--                        end-placeholder="创建日期"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        @change="handleDateSelect"-->
<!--                        :picker-options="pickerOptions">-->
<!--        </el-date-picker>-->
          <el-input clearable class="filter-item" style="width: 160px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 160px;" placeholder="商品名称"
                    v-model="listQuery.goodsName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 160px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 160px;" placeholder="系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 160px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input type="textarea" clearable class="filter-item" style="width: 160px;" placeholder="请输入订货号,多个订货号请输入回车键隔开"
                    v-model="listQuery.itemNo">
          </el-input>
          <div></div>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="danger" icon="el-icon-search" @click="handleReset">重置</el-button>
        </div>
      </div>

      <el-row>
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
                <el-table-column align="center" min-width="100" label="商品名称" prop="goodsName" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="品牌名称" prop="brandName" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="系列" prop="seriesName" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="规格型号" prop="specifications" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
            </el-table-column>
            <el-table-column align="center" property="url" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.url" width="40"/>
              </template>
            </el-table-column>

            <!--<el-table-column align="center" label="详情" prop="detail">-->
              <!--<template slot-scope="scope">-->
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

            <el-table-column align="center" label="计量单位" prop="unit">
            </el-table-column>
            <el-table-column align="center" label="上架状态" width="100">
              <template slot-scope="scope">
                <el-switch
                  @change="handlePublishStatusChange(scope.$index, scope.row)"
                  :active-value=0
                  :inactive-value=1
                  v-model="scope.row.isOnSale">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="标签" width="140" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.tags && scope.row.tags != ''">
                  <el-tag v-for="item in scope.row.tagsList" :key="item" :type="item == '新品'?'' : item == '热卖' ? 'danger': item == '推荐' ? 'warning' : item == '清仓' ? 'success' : 'info'" style="margin-bottom: 8px;margin-right: 8px;">{{item}}</el-tag>
                </div>
              </template>
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
     // import {page} from '@/api/erp/goods/goods';
  import {listCatAndBrand} from '@/api/erp/goods/goods';

  export default {
    data() {
      return {
        crtTime:undefined,
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
          publishType:'0',
          selectType:1,
        },
         publishTypeOptions: [{
          value: '0',
          label: 'GH'
        }],
        typeOptions:[
          {
            value: '0',
            label: 'GH'
          },
          {
            value: '1',
            label: 'VMI'
          }
        ],
        isOpenTree: true,
        queryVisible: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        brandList: [],
         publishList:[
          {
            value:'0',
            label:'GH'
          },
          {
            value: '1',
            label:'VMI'
          }
        ],
         publishTypeOption: [{
          value: '0',
          label: 'GH'
        },/* {
          value: '2',
          label: '发布给指定员工'
        }*/],
        channelTypeOptions: [{
          value: '01',
          label: '厂家'
        }, {
          value: '02',
          label: '厂家库存单'
        }, {
          value: '03',
          label: '厂家促销'
        }, {
          value: '04',
          label: '厂家促销第一季度'
        }, {
          value: '05',
          label: '厂家促销第二季度'
        }, {
          value: '06',
          label: '厂家促销第三季度'
        }, {
          value: '07',
          label: '厂家促销第四季度'
        }, {
          value: '08',
          label: '渠道'
        }],
        sourceOption: [{
          value: '0',
          label: '线上库存'
        }, {
          value: '1',
          label: '线下库存'
        }, {
          value: '2',
          label: '调拨'
        }],
      };
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      },
       crtTime(value) {
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
    },
    created() {
      this.getList();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    props: ['isSingle','sp1'],
    methods: {
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
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
      getList() {
        this.listLoading = true;
        page(this.listQuery)
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
        this.$refs.goodsSelectorTable.clearSelection();
        this.chooseGoods = [];
        this.currentGoods = [];
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          categoryId: undefined,
          brandId: undefined,
          skuNo: undefined,
          goodsName: undefined,
          specifications: undefined,
          itemNo: undefined,
          publishType:'0',
          selectType:1
        }
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
