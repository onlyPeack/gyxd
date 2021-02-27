<template>
  <div class="bill-container stock-change-record-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container stock-change-record-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调拨单号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.allocationOrderBillNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.goodsName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                  @keyup.enter.native="handleFilter" v-model="listQuery.brandName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.specModel">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.series">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                  @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="批次号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.batchNumber">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库"
                  @keyup.enter.native="handleFilter" v-model="listQuery.warehouseId">
        </el-input>
        <div></div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="原归属人(工号)"
                  @keyup.enter.native="handleFilter" v-model="listQuery.oldOwnerCode">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="现归属人(工号)"
                  @keyup.enter.native="handleFilter" v-model="listQuery.ownerCode">
        </el-input>
         <el-date-picker
                  style="position: relative;top: -4px;width: 403px"
                  v-model="listQuery.validateTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="起始入库时间"
                  end-placeholder="中止入库时间"
                  @change="handleTwoDateSelect"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
                <el-date-picker
                  style="position: relative;top: -4px;width: 403px"
                  v-model="listQuery.updTime"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="调拨起始时间"
                  end-placeholder="调拨中止时间"
                  @change="handleOneDateSelect"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
     show-summary="" :summary-method="getSummaries"
              highlight-current-row :height="clientHeight" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column label="序号" type="index" align="center"> </el-table-column>
      <el-table-column label="调拨单号" prop="allocationOrderBillNo" width="160"></el-table-column>
      <el-table-column label="商品名称" prop="goodsName" width="130"></el-table-column>
      <el-table-column label="品牌" prop="brandName"></el-table-column>
      <el-table-column label="规格型号" prop="specModel" width="190"></el-table-column>
      <el-table-column label="标准系列" prop="series" width="130"></el-table-column>
      <el-table-column label="返点系列" prop="rebateSeries" width="130"></el-table-column>
      <el-table-column label="订货号" prop="itemNo" width="130"></el-table-column>
      <el-table-column label="面价" prop="retailPrice" class-name="col-required"></el-table-column>
      <el-table-column label="进价" prop="purchasePrice" class-name="col-required" v-if="$store.getters.groupNames.indexOf('总经理') > -1 || $store.getters.groupNames.indexOf('采购经理') > -1 || $store.getters.groupNames.indexOf('采购') > -1"></el-table-column>
      <el-table-column label="供应商名称" prop="supplierName" width="200"></el-table-column>
      <el-table-column label="供应商编号" prop="supplierCode" width="100"></el-table-column>
      <el-table-column label="客户名称" prop="customerName" width="200"></el-table-column>
      <el-table-column label="客户编号" prop="customerCode" width="100"></el-table-column>
      <el-table-column label="仓库" prop="warehouseId"></el-table-column>
      <el-table-column label="仓位" prop="positionName"></el-table-column>
      <el-table-column label="批次号" prop="batchNumber" width="200"></el-table-column>
      <el-table-column label="调拨数量" prop="transferQty" sortable width="100"></el-table-column>
      <el-table-column label="调拨价" prop="transferPrice" class-name="col-required"></el-table-column>
      <el-table-column label="调拨折扣" class-name="col-required">
        <template slot-scope="scope">
          {{(scope.row.transferPrice/scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column label="调拨金额" prop="transferAmt" class-name="col-required" width="100" sortable></el-table-column>
      <el-table-column label="考核价" prop="checkPrice" class-name="col-required">
        <template slot-scope="scope">
          <!-- 采购展示考核价 -->
          <span v-if="$store.getters.groupNames.indexOf('总经理') > -1 || $store.getters.groupNames.indexOf('采购经理') > -1 || $store.getters.groupNames.indexOf('采购') > -1">{{scope.row.checkPrice}}</span>
          <!-- 销售展示调拨价 -->
          <span v-if="$store.getters.groupNames == '电商销售客服'">{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
       <el-table-column label="考核折扣" class-name="col-required">
        <template slot-scope="scope">
          <span v-if="$store.getters.groupNames.indexOf('总经理') > -1 || $store.getters.groupNames.indexOf('采购经理') > -1 || $store.getters.groupNames.indexOf('采购') > -1">{{(scope.row.checkPrice/scope.row.retailPrice).toFixed(4)}}</span>
          <span v-if="$store.getters.groupNames == '电商销售客服'">{{(scope.row.transferPrice/scope.row.retailPrice).toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="考核金额" prop="checkAmt" class-name="col-required" sortable width="120" v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1"></el-table-column>
      <el-table-column label="利润" prop="profit" class-name="col-required" sortable width="120" v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">
        <!-- <template slot-scope="scope">
          {{((scope.row.transferPrice - scope.row.checkPrice)*scope.row.transferQty).toFixed(4)}}
        </template> -->
      </el-table-column>
      <el-table-column label="毛利率" prop="grossProfit" class-name="col-required" sortable width="120" v-if="$store.getters.groupNames.indexOf('采购') > -1 || $store.getters.groupNames.indexOf('总经理') > -1">
        <!-- <template slot-scope="scope">
          {{(scope.row.profit/scope.row.transferAmt).toFixed(4)}}
        </template> -->
      </el-table-column>
      <el-table-column label="原归属人" prop="oldOwnerName" class-name="col-required"></el-table-column>
      <el-table-column label="原归属人工号" prop="oldOwnerCode" class-name="col-required" width="100"></el-table-column>
      <el-table-column label="现归属人" prop="ownerName" class-name="col-required"></el-table-column>
      <el-table-column label="现归属人工号" prop="ownerCode" class-name="col-required" width="100"></el-table-column>
      <el-table-column label="入库日期" prop="stockDate" width="160"></el-table-column>
      <el-table-column label="调拨时间" prop="crtTime" width="160"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,50,100,500,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {stockExchangeRecord} from '@/api/erp/wms/stock_query/index';
  import {getTypeValue} from '@/api/dict/dictValue/index';

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
          modelType:undefined,
          page:1,
          limit:10
        },
        date: undefined,
        brandList: [],
        categoryList: [],
        modelTypeOptions:[]
      }
    },
    created() {
      this.init();
      const _this = this;
      getTypeValue('model_type').then(response => {
        this.modelTypeOptions = response.data.rows;
      });
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      getSummaries(param){
        //return this.getSummariesMethod(param,['profit','transferQty','transferAmt'],4);

        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (column.label === '利润' || column.label === '调拨数量' || column.label === '调拨金额'||column.label === '考核金额') {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return this.accAdd(prev , curr).toFixed(4)
              } else {
                return Number(prev).toFixed(4)
              }
            }, 0)
            sums[index] += ' '
          }
          if (column.label === '毛利率') {
            let sumProfit=0
            let sumTransferAmt=0
            for (let i = 0; i <data.length ; i++) {
              sumProfit=this.accAdd(sumProfit,Number(data[i].profit))
              sumTransferAmt=this.accAdd(sumTransferAmt,Number(data[i].transferAmt))
            }
            sums[index]=this.division(sumProfit,sumTransferAmt).toFixed(4)
          }
        })

        return sums

      },
      changeDivHeight() {
        if (document.getElementsByClassName('stock-change-record-filter-container')[0]) {
          var height = document.getElementsByClassName('stock-change-record-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (130 + height)) * 0.95;
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      init() {
        // listCatAndBrand().then(response => {
        //   this.categoryList = response.data.categoryList;
        //   this.brandList = response.data.brandList;
        // });
      },
      /**
       * 入库时间筛选
       */
      handleTwoDateSelect(val) {
        if (val == null) {
          this.listQuery.startStockDate = undefined;
          this.listQuery.endStockDate = undefined;
        } else {
          this.listQuery.startStockDate = val[0] + ' 00:00:00';
          this.listQuery.endStockDate = val[1] + ' 23:59:59';
        }
        this.handleFilter()
      },
      /**
       * 调拨时间筛选
       */
      handleOneDateSelect(val) {
        if (val == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        } else {
          this.listQuery.startDate = val[0] + ' 00:00:00';
          this.listQuery.endDate = val[1] + ' 23:59:59';
        }
        this.handleFilter()
      },
      getList() {
        this.listLoading = true;
        stockExchangeRecord(this.listQuery).then(response => {
          this.list = response.data.records;
          this.list.forEach(item => {
            item.profit = ((item.transferPrice - item.checkPrice)*item.transferQty).toFixed(4)
            item.grossProfit = (item.profit/item.transferAmt).toFixed(4)
          })
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
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
        };
        this.getList()
      },
    },
    watch: {
    }
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
