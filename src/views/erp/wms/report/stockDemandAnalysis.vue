<template>
  <div class="bill-container stock-change-record-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-change-record-filter-container">
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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specifications">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-select v-model="listQuery.modelType" style="width: 200px;bottom:4px" placeholder="请选择型号类型">
          <el-option v-for="item in modelTypeOptions" :key="item.id" :label="item.labelZhCh" :value="item.labelDefault">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.stockAccuracy" style="width: 200px;bottom:4px" placeholder="请选择备货准确性">
          <el-option v-for="item in source" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download" @click="handleDownload">导出</el-button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column label="型号类型" prop="modelType" width="100" sortable>
      </el-table-column>
      <el-table-column label="备货准确性" prop="stockAccuracy" width="120" sortable>
        <template slot-scope="scope">
          <span v-for="item in source">
            <span v-if="scope.row.stockAccuracy ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="品牌" prop="brandName" width="120"></el-table-column>
      <el-table-column label="品名" prop="goodsName" width="130"></el-table-column>
      <el-table-column label="标准系列" prop="seriesName" width="120"></el-table-column>
      <el-table-column label="返点系列" prop="rebateSeries" width="120"></el-table-column>
      <el-table-column label="型号" prop="specifications" width="160"></el-table-column>
      <el-table-column label="订货号" prop="itemNo" width="140"></el-table-column>
      <el-table-column label="面价" prop="retailPrice" width="120" sortable></el-table-column>
      <el-table-column align="right" label="最佳备货量" prop="bestStock" width="120" sortable></el-table-column>
      <el-table-column align="right" label="库存存量" prop="stock" sortable  width="120"></el-table-column>
      <el-table-column align="right" label="在途数量" prop="stockOnWay" sortable  width="120"></el-table-column>
      <el-table-column align="right" label="YY库存存量" prop="stockYY" width="130" sortable></el-table-column>
      <el-table-column align="right" label="在库超三个月数量" prop="stockOverThreeMonth" width="160" sortable></el-table-column>
      <el-table-column align="right" label="月均销量" prop="monthAverage" width="130" sortable></el-table-column>
      <el-table-column align="right" label="近84天客户数" prop="customer84" width="130" sortable></el-table-column>
      <el-table-column align="right" label="近84天销量" prop="sales84" sortable width="120"></el-table-column>
      <el-table-column align="right" label="近28天客户数" prop="customer28" width="130" sortable></el-table-column>
      <el-table-column align="right" label="近28天销量" prop="sales28" sortable width="120"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,100,500,1000,5000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import { getStockDemandAnalysis } from '@/api/erp/wms/stock_query/index'
  import { getTypeValue } from '@/api/dict/dictValue/index'

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
          specifications: undefined,
          brandName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          modelType: undefined,
          stockAccuracy: undefined,
          page: 1,
          limit: 10
        },
        source: [{
          value: 1,
          label: '严重缺货'
        }, {
          value: 2,
          label: '缺货'
        }, {
          value: 3,
          label: '多货'
        }, {
          value: 4,
          label: '最佳备货'
        }],
        date: undefined,
        brandList: [],
        categoryList: [],
        modelTypeOptions: []
      }
    },
    created() {
      this.init()
      const _this = this
      getTypeValue('model_type').then(response => {
        this.modelTypeOptions = response.data.rows
      })
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list == undefined || this.list == null ? [] : this.list
        for (let i = 0; i < this.list.length; i++) {
            switch (this.list[i].stockAccuracy) {
              case 1:
                this.list[i].stockAccuracy = '严重缺货'
                break;
              case 2:
                this.list[i].stockAccuracy = '缺货'
                break;
              case 3:
                this.list[i].stockAccuracy = '多货'
                break;
              case 4:
                this.list[i].stockAccuracy = '最佳备货'
                break;
            }
          }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = [
            '型号类型',
            '备货准确性',
            '品牌',
            '品名',
            '标准系列',
            '返点系列',
            '型号',
            '订货号',
            '面价',
            '最佳备货量',
            '库存存量',
            '在途数量',
            'YY库存存量',
            '在库超三个月数量',
            '月均销量',
            '近84天客户数',
            '近84天销量',
            '近28天客户数',
            '近28天销量',
          ]
          const filterVal = [
            'modelType',
            'stockAccuracy',
            'brandName',
            'goodsName',
            'seriesName',
            'rebateSeries',
            'specifications',
            'itemNo',
            'retailPrice',
            'bestStock',
            'stock',
            'stockOnWay',
            'stockYY',
            'stockOverThreeMonth',
            'monthAverage',
            'customer84',
            'sales84',
            'customer28',
            'sales28',
          ]
          excel.export_json_to_excel2(
            tHeader,
            this.list,
            filterVal,
            '库存需求分析'
          )
          this.downloadLoading = false
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('stock-change-record-filter-container')[0]) {
          var height = document.getElementsByClassName('stock-change-record-filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (130 + height)) * 0.95
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible
        const _this = this
        setTimeout(function() {
          _this.changeDivHeight()
        }, 1)
      },
      init() {
        // listCatAndBrand().then(response => {
        //   this.categoryList = response.data.categoryList;
        //   this.brandList = response.data.brandList;
        // });
      },
      getList() {
        this.listLoading = true
        getStockDemandAnalysis(this.listQuery).then(response => {
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
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          brandName: undefined,
          seriesName: undefined,
          goodsName: undefined,
          modelType: undefined
        }
        this.getList()
      }
    },
    watch: {}
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
