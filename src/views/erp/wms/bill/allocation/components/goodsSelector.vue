<template>
  <div class="app-container calendar-list-container" v-cloak style="width: 100%;">
    <div class="main-container" style="position: unset">

      <!-- 查询和其他操作 -->
      <div class="filter-container goods-selector-filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="货主编码"
                    @keyup.enter.native="handleFilter" v-model="listQuery.shipperCode">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="货主名称"
                    @keyup.enter.native="handleFilter" v-model="listQuery.shipperName">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="品牌"
                    @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="商品名称"
                    @keyup.enter.native="handleFilter" v-model="listQuery.goodsName">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="标准系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.series">
          </el-input>
          <el-input clearable class="filter-item" style="width: 190px;" placeholder="返点系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
          </el-input>
          <el-input class="filter-item" style="width: 190px" placeholder="订货号"
                    v-model="listQuery.itemNo" tclearable>
          </el-input>
          <el-input class="filter-item" style="width: 190px" placeholder="型号"
                    v-model="listQuery.specModel" clearable>
          </el-input>
          <el-input class="filter-item" style="width: 190px" placeholder="仓库"
                    v-model="listQuery.houseCode" clearable>
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        </div>
      </div>

      <div class="result-container">
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row @select-change="handleSelectChange" @select="handleSelect"
                  :show-header="true"
                  @select-all="handleSelectAll" @row-click="chooseData" ref="goodsSelectorTable"
                  style="width: 100%;position:relative;">
          <el-table-column width="90" align="center">
            <template slot="header" slot-scope="scope">
              <el-button @click="batchChoose">选入</el-button>
            </template>
            <template slot-scope="scope">
              <span class="el-icon-plus" style="cursor: pointer;color:#409EFF;" @click="chooseData(scope.row)"></span>
            </template>

          </el-table-column>
          <el-table-column type="selection" align="center">

          </el-table-column>
          <el-table-column type="index" width="50">
          </el-table-column>
          <el-table-column label="仓库编码" prop="houseCode" width="120">
          </el-table-column>
<!--          <el-table-column label="数量" prop="qty" width="100" align="right">-->
<!--          </el-table-column>-->
          <el-table-column align="right" label="可用数量" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.qty - scope.row.lockedQty }}</span>
            </template>
          </el-table-column>
          <el-table-column label="锁定数量" prop="lockedQty" width="100" align="right">
          </el-table-column>
          <el-table-column label="品牌名称" prop="brandName" width="150">
          </el-table-column>
          <el-table-column label="标准系列" prop="series" width="150">
          </el-table-column>
          <el-table-column label="返点系列" prop="rebateSeries" width="150">
          </el-table-column>
          <el-table-column label="商品名称" prop="goodsName" width="150">
          </el-table-column>
          <el-table-column label="规格型号" prop="specModel" width="220">
          </el-table-column>
          <el-table-column label="订货号" prop="itemNo" width="150">
          </el-table-column>
          <el-table-column align="right" label="面价" prop="retailPrice" width="150">
            <template slot-scope="scope" v-if="scope.row.retailPrice">
              {{Number(scope.row.retailPrice).toFixed(4)}}
            </template>
          </el-table-column>
          <el-table-column align="right" label="调拨价" prop="transferPrice" width="150" class-name="col-required">
            <template slot-scope="scope" v-if="scope.row.transferPrice">
              {{Number(scope.row.transferPrice).toFixed(4)}}
            </template>
          </el-table-column>
          <el-table-column label="仓库名称" prop="houseName" width="120">
          </el-table-column>
          <el-table-column label="货主编码" prop="shipperCode">
          </el-table-column>
          <el-table-column label="货主名称" prop="shipperName" width="300">
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination-container" style="position: unset;margin: 15px 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row class="result-data-table" :height="450">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column label="仓库编码" prop="houseCode" width="120">
        </el-table-column>
        <!--          <el-table-column label="数量" prop="qty" width="100" align="right">-->
        <!--          </el-table-column>-->
        <el-table-column align="right" label="可用数量" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.qty - scope.row.lockedQty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="锁定数量" prop="lockedQty" width="100" align="right">
        </el-table-column>
        <el-table-column label="品牌名称" prop="brandName" width="150">
        </el-table-column>
        <el-table-column label="标准系列" prop="series" width="150">
        </el-table-column>
        <el-table-column label="返点系列" prop="rebateSeries" width="150">
        </el-table-column>
        <el-table-column label="商品名称" prop="goodsName" width="150">
        </el-table-column>
        <el-table-column label="规格型号" prop="specModel" width="220">
        </el-table-column>
        <el-table-column label="订货号" prop="itemNo" width="150">
        </el-table-column>
        <el-table-column align="right" label="面价" prop="retailPrice" width="150">
          <template slot-scope="scope" v-if="scope.row.retailPrice">
            {{Number(scope.row.retailPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column align="right" label="调拨价" prop="transferPrice" width="150" class-name="col-required">
          <template slot-scope="scope" v-if="scope.row.transferPrice">
            {{Number(scope.row.transferPrice).toFixed(4)}}
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" prop="houseName" width="120">
        </el-table-column>
        <el-table-column label="货主编码" prop="shipperCode">
        </el-table-column>
        <el-table-column label="货主名称" prop="shipperName" width="300">
        </el-table-column>

      </el-table>

    </div>

  </div>
</template>

<script>
  import { getStockSharingDataList } from '@/api/erp/wms/stock_query/index'

  export default {
    data() {
      return {
        clientHeight: 300,
        list: [],
        listDrop:[],
        total: 0,
        listLoading: false,
        tableKey: 0,
        chooseGoods: [],
        currentGoods: [],
        listQuery: {
          page: 1,
          limit: 10,
          series: undefined,
          goodsName: undefined,
          specModel: undefined,
          itemNo: undefined
        }
      }
    },
    created() {
      this.getList()
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    props: ['isSingle', 'shipperCode'],
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('goods-selector-filter-container')[0]) {
          var height = document.getElementsByClassName('goods-selector-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data) {
        this.listQuery.categoryId = data.value
        this.handleFilter()
      },
      getList() {
        this.listLoading = true
        getStockSharingDataList(this.listQuery).then(response => {
          var list = []
          response.data.records.forEach(function(item) {
            item.price = item.retailPrice
            list.push(item)
          })
          this.list = list
          this.total = response.data.total
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleFilter() {
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
      },
      OnSubmit() {
        this.chooseGoods=this.listDrop
        if (this.chooseGoods.length > 0) {
          for (let i in this.chooseGoods) {
            if (this.chooseGoods[0].shipperCode != this.chooseGoods[i].shipperCode) {
              this.$message.error('只支持同一货主进行结算，请重新选择')
              return
            }
            if ((this.chooseGoods[0].itemNo == this.chooseGoods[i].itemNo)&&i>0) {
              this.$message.error('同一单同一型号只支持一条明细，请分多次制单！'+ this.chooseGoods[i].itemNo)
              return
            }
          }
          if (this.shipperCode && this.shipperCode != this.chooseGoods.shipperCode) {
            this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('closeGoodsDialog', {
                list: this.chooseGoods,
                isClearAll: true,
                sourceObject: this.sourceObject
              })
            }).catch(() => {
            })
          } else {
            this.$emit('closeGoodsDialog', {
              list: this.chooseGoods,
              isClearAll: false,
              sourceObject: this.sourceObject
            })
          }
        } else {
          this.$emit('closeGoodsDialog', {
            list: this.chooseGoods,
            isClearAll: false,
            sourceObject: this.sourceObject
          })
        }
      },
      reset() {
        this.$refs.goodsSelectorTable.clearSelection()
        this.chooseGoods = []
        this.currentGoods = []
      },

      /**
       * 下方存储表格移除数据
       * @param index
       */
      removeData(index) {
        this.listDrop.splice(index, 1)
      },

      /**
       * 表格双击选中添加进下方存储表格
       * @param row
       */
      chooseData(row) {

        for (let i = 0; i < this.listDrop.length; i++) {
          if (row.shipperCode != this.listDrop[i].shipperCode) {
            this.$message.error('只支持同一货主进行结算，请重新选择')
            return;
          }
          if (row.itemNo != this.listDrop[i].itemNo) {
            this.$message.error('同一单同一型号只支持一条明细，请分多次制单！'+ this.listDrop[i].itemNo)
            return;
          }
        }
        this.listDrop.push(row)
        let hash = {}
        this.listDrop = this.listDrop.reduce(function (item, next) {
          hash[next.id] ? '' : hash[next.id] = true && item.push(next);
          return item
        }, [])
      },

      batchChoose(){
        if (this.chooseGoods.length > 0) {
          for(let i = 0; i < this.chooseGoods.length; i++){
            for(let j = i+1; j < this.chooseGoods.length; j++){
              if(this.chooseGoods[i].shipperCode !== this.chooseGoods[j].shipperCode){
                this.$message.error('只支持同一货主进行结算，请重新选择')
                return;
              }
              if(this.chooseGoods[i].itemNo !== this.chooseGoods[j].itemNo){
                this.$message.error('同一单同一型号只支持一条明细，请分多次制单！'+ this.chooseGoods[i].itemNo)
                return;
              }
            }
          }

          for (let i = 0; i <this.chooseGoods.length ; i++) {
            this.chooseData(this.chooseGoods[i])
          }
        }
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
