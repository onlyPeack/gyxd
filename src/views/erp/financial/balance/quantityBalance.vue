<template>

  <div class="app-container calendar-list-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  v-model="listQuery.brandName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                  v-model="listQuery.seriesName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                  v-model="listQuery.specifications"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  v-model="listQuery.itemNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="产品编号"
                  v-model="listQuery.skuNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.selectType" placeholder="查询类型" clearable style="width: 190px"
                   class="filter-item" v-if="sourceOption" @change="handleFilter" filterable>
          <el-option v-for="item in sourceOption" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <!--</el-collapse-item>-->
      <!--</el-collapse>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" ref="dataTable" show-summary
              :summary-method="getSummaries"
              element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column align="center" label=" 品牌" fixed="left" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName">
      </el-table-column>
      <el-table-column align="center" label="型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo">
      </el-table-column>
      <el-table-column align="center" label="产品编号" prop="skuNo">
      </el-table-column>
      <el-table-column align="center" label="采购入库" prop="cgrk">
      </el-table-column>
      <el-table-column align="center" label="销售退库" prop="xstk">
      </el-table-column>
      <el-table-column align="center" label="平台调拨" prop="ptdb">
      </el-table-column>
      <el-table-column align="center" label="平台调拨调出" prop="ptdb2">
      </el-table-column>
      <el-table-column align="center" label="销售出库" prop="xsck">
      </el-table-column>
      <el-table-column align="center" label="入库数量" prop="qtyIn">
      </el-table-column>
      <el-table-column align="center" label="出库数量" prop="qtyOut">
      </el-table-column>
      <el-table-column align="center" label="库存数量" prop="stockQty">
      </el-table-column>
      <el-table-column align="center" label="差额" prop="balance">
      </el-table-column>
    </el-table>
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
  import { stockQtyPage } from '@/api/erp/financial/balance'

  export default {
    name: 'customerList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        sourceOption: [{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '仅查不平'
        }],
        listQuery: {
          page: 1,
          limit: 10,
          selectType: '2',
          brandName: undefined,
          seriesName: undefined,
          specifications: undefined,
          itemNo: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['balance', 'stockQty'])
      },
      handleReset() {
        this.listQuery.page = 1
        this.listQuery.limit = 10
        this.listQuery.brandName = undefined
        this.listQuery.seriesName = undefined
        this.listQuery.specifications = undefined
        this.listQuery.itemNo = undefined
      },
      handleFilter() {
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
      getList() {
        this.list = undefined
        this.listLoading = true
        stockQtyPage(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .customerInfoDialog {
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh !important;

    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

  }

</style>
