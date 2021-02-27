<template>
  <div class="bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                v-model="listQuery.itemNo" @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="型号"
                v-model="listQuery.specifications" @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                v-model="listQuery.warehouse" @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓位"
                v-model="listQuery.position" @keyup.enter.native="handleFilter">
      </el-input>
      <div></div>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="批次号"
                @keyup.enter.native="handleFilter" v-model="listQuery.batchNumber">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="订单号"
                @keyup.enter.native="handleFilter" v-model="listQuery.orderSn">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库子订单号"
                @keyup.enter.native="handleFilter" v-model="listQuery.lockOrderSn">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="出库单号"
                @keyup.enter.native="handleFilter" v-model="listQuery.billNoOut">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                v-model="listQuery.skuNo" @keyup.enter.native="handleFilter">
      </el-input>
      <div style="display: inline-block;transform: translateY(-3px)">
        <el-date-picker
          v-model="billDate"
          type="daterange"
          @change="handleFilter"
          align="right"
          unlink-panels
          style="width: 404px"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>

<!--      <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"-->
<!--                @keyup.enter.native="handleFilter" v-model="listQuery.skuName">-->
<!--      </el-input>-->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" style="margin-left: 2px;">搜索</el-button>
      <el-button class="filter-item"  @click="handleReset" icon="el-icon-delete">重置</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit :summary-method="getSummaries" show-summary
              highlight-current-row :height="clientHeight">
      <el-table-column type="index"  align="center"></el-table-column>
      <el-table-column align="center" label="品牌" prop="brandName">
      </el-table-column>
      <el-table-column align="center" label="系列" prop="seriesName" >
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="skuName" width="120px">
      </el-table-column>
      <el-table-column align="center" label="订货号" prop="itemNo" >
      </el-table-column>
      <el-table-column align="center" label="型号" prop="specifications" >
      </el-table-column>
      <el-table-column align="center" label="仓库" prop="warehouse" >
      </el-table-column>
      <el-table-column align="center" label="仓位" prop="position">
      </el-table-column>
      <el-table-column align="right" label="入库数量" prop="qty">
      </el-table-column>
      <el-table-column align="right" label="锁库数量" prop="lockQty">
      </el-table-column>
      <el-table-column align="right" label="解锁数量" prop="unlockQty">
      </el-table-column>
      <el-table-column align="right" label="出库数量" prop="qtyOut">
      </el-table-column>
      <el-table-column align="center" label="批次号" prop="batchNumber" width="155px">
      </el-table-column>
      <el-table-column align="center" label="订单号" prop="orderSn" width="150px">
      </el-table-column>
      <el-table-column align="center" label="锁库子订单号" prop="lockOrderSn" width="155px">
      </el-table-column>
      <el-table-column align="center" label="出库单号" prop="billNoOut" width="150px">
      </el-table-column>
      <el-table-column align="center" label="商品编码" prop="skuNo" width="130px">
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="crtTime" width="150px">
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

<style>

</style>

<script>
  import {StockHandlePage as page} from '@/api/erp/wms/stock_query/index';

  export default {
    name: 'stockHandlePage',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          skuName: undefined,
          crtUserName: undefined,

          // selectType: 1  //查询所有锁库记录，包括已经解锁的记录
        },
        billDate:[],
        clientHeight: 300
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    watch: {
      billDate(val) {
        if (val.length<1) {
          this.listQuery.startBillDate = undefined
          this.listQuery.endBillDate = undefined
        } else {
          this.listQuery.startBillDate = val[0] + ' 00:00:00'
          this.listQuery.endBillDate = val[1] + ' 23:59:59'
        }
        this.handleFilter()
      }
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 48;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      filterStatus: function (value, row) {
        return row.status === value;
      },

      handleReset() {
        this.listQuery={
          page:1,
          limit:20
        }
        this.billDate=[]
        this.getList();
      },

      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            if (column.label == '入库数量' || column.label == '锁库数量' || column.label == '解锁数量'|| column.label == '出库数量') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              sums[index] += ' '
            }
            // 出库金额合计
            if (column.property == 'outAmount') {
              this.totalAmount = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              this.totalAmount += ' '
            }
            if (column.property == 'profit') {
              this.totalProfit = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4)
                } else {
                  return getFloat(prev, 4)
                }
              }, 0).toFixed(4)
              this.totalProfit += ' '
            }
            if (column.property == 'profitRate') {
              sums[index] = (Number(this.totalProfit) / Number(this.totalAmount) * 100).toFixed(2)
              sums[index] += ' '
            }
          } else {
            sums[index] = ' '
          }
        })

        return sums
      },
    }
  }
</script>
