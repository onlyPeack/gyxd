<template>
  <div class="full-purchase bill-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
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
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="query-container">
        <el-input clearable class="filter-item" style="width: 190px;" placeholder="系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.series">
        </el-input>
        <el-input class="filter-item" style="width: 190px;" placeholder="订货号"
                  v-model="listQuery.itemNo" tclearable>
        </el-input>
        <el-input class="filter-item" style="width: 190px;" placeholder="型号"
                  v-model="listQuery.specModel" clearable>
        </el-input>
        <el-input class="filter-item" style="width: 190px;" placeholder="仓库"
                  v-model="listQuery.houseCode" clearable>
        </el-input>
      </div>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight"
              :show-header="true" :summary-method="getSummaries" show-summary
              style="width: 100%;height: 100%;position:relative;">
      <el-table-column type="index" width="50" fixed="left" align="center">
      </el-table-column>
      <el-table-column label="仓库编码" prop="houseCode" width="100" align="center">
      </el-table-column>
      <el-table-column label="仓库名称" prop="houseName" width="100" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="brandName" width="150">
      </el-table-column>
      <el-table-column label="系列名称" prop="series" width="150">
      </el-table-column>
      <el-table-column label="商品名称" prop="goodsName" width="180">
      </el-table-column>
      <el-table-column label="规格型号" prop="specModel" min-width="150">
      </el-table-column>
      <el-table-column label="订货号" prop="itemNo" width="150">
      </el-table-column>
      <!--      <el-table-column label="数量" prop="qty" width="100" align="right">-->
      <!--      </el-table-column>-->
      <el-table-column label="可用数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.qty - scope.row.lockedQty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="锁定数量" prop="lockedQty" width="100" align="right">
      </el-table-column>
      <el-table-column align="right" label="面价" prop="retailPrice" width="150">
      </el-table-column>
      <el-table-column align="right" label="调拨价" prop="transferPrice" width="150" class-name="col-required" sortable="">
      </el-table-column>
      <el-table-column label="货主编码" prop="shipperCode" width="100" align="center">
      </el-table-column>
      <el-table-column label="货主名称" prop="shipperName" width="300" align="center">
      </el-table-column>
      <el-table-column align="center" label="商品编码" prop="goodsCode" width="150">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getStockSharingDataList } from '@/api/erp/wms/stock_query/index'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'goods_release_query',
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          shipperCode: '',
          shipperName: '',
          brandName: '',
          goodsName: '',
          itemNo: '',
          series: '',
          specModel: '',
          houseCode: '',
          selectType: 0 //单据查询时使用，0代表查所有状态，1代表只查正常状态
        },
        clientHeight: 300,
        choose: true,
        publishTypeOptions: [{
          value: '0',
          label: '发布给所有人'
        }/*, {
          value: '1',
          label: '发布给商务'
        }, {
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
        }]
      }
    },
    created() {
      //this.changeDivHeight();
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['retailPrice'])
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 1
      },
      getList() {
        this.listLoading = true
        getStockSharingDataList(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
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
        this.listLoading = true
        this.getList()
      },
      handleReset() {
        this.listQuery.shipperCode = ''
        this.listQuery.shipperName = ''
        this.listQuery.brandName = ''
        this.listQuery.goodsName = ''
        this.listQuery.itemNo = ''
        this.listQuery.series = ''
        this.listQuery.specModel = ''
        this.listQuery.houseCode = ''
        this.getList()
      },
      handleSwitch() {
        this.getList()
      }
    }
  }
</script>
