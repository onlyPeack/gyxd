<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  v-model="listQuery.customerCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="制单开始日期"
                        end-placeholder="制单结束日期"
                        :default-time="['00:00:00', '23:59:59']"
                        @change="handleCrtTimeSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

      </div>
      <div class="query-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <!-- <el-select v-model="listQuery.brandId" placeholder="全部品牌" clearable style="width: 200px;"
                     class="filter-item" v-if="brandList" @change="handleFilter" filterable>
            <el-option v-for="item in brandList" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select> -->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <br>
          <span style="color: red "> 注：即时库存加点查询需用  客户编号或客户名称+订货号或型号</span>

        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable1" class="result-data-table" :default-sort="{prop: 'customerCode', order: 'descending'}">
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" width="100" sortable align="center">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="150">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="150">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="80">
      </el-table-column>
      <el-table-column prop="resource" label="调价类型" width="100" align="center">
        <template slot-scope="scope">
          <div v-for="item in typeOptions">
            <span v-if="item.value==scope.row.resource">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="originalPrice" label="原价格" width="100" class-name="col-required" align="right">
      </el-table-column>
      <el-table-column prop="customerDiscount" label="调整折扣" width="100" class-name="col-required" align="right">
      </el-table-column>
      <el-table-column prop="customerPrice" label="调整后价格" width="100" class-name="col-required" align="right">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="170" align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { queryPrice } from '@/api/erp/sales/price/pricePlan'
  import { getFloat } from '@/utils/util'

  export default {
    name: 'priceSearch',
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          customerCode: undefined,
          customerName: undefined,
          itemNo: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          seriesName: undefined,
          startDate: undefined,
          endDate: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
        },
        clientHeight: 300,
        selectedRows: [],
        crtTime: undefined,
        typeOptions: [{
          value: '0',
          label: '单个商品调价'
        },
        {
          value: '1',
          label: '低于安全折扣调价'
        },
        {
          value: '2',
          label: '即时库存加点调价'
        },
        {
            value: '3',
            label: '按系列调价(以面价为准)'
        },{
            value: '4',
            label: '按品牌调价(以面价为准)'
        },{
            value: '5',
            label: '按系列调价(以调拨价为准)'
        },{
            value: '6',
            label: '按品牌调价(以调拨价为准)'
        },{
            value: '9',
            label: '未调价'
        }]
      }
    },
    created() {
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
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1
      },
      getList() {
        this.listLoading = true
        queryPrice(this.listQuery).then(response => {
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
        this.listQuery.customerName = undefined,
        this.listQuery.customerCode = undefined,
        this.listQuery.billStatus = undefined,
        this.listQuery.crtUserNo = undefined,
        this.listQuery.crtUserName = undefined,
        this.listQuery.itemNo = undefined,
        this.listQuery.skuNo = undefined,
        this.listQuery.skuName = undefined,
        this.listQuery.specifications = undefined,
        this.listQuery.seriesName = undefined,
        this.crtTime = undefined
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row)
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handleChangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1])
        }
        this.selectedRows = val
      },
      handleCrtTimeSelect(val) {
        this.listQuery. startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      }
    },
    watch: {
      crtTime(value) {
        if (value == null) {
          this.listQuery.startDate = undefined
          this.listQuery.endDate = undefined
        }
      }
    }
  }
</script>
