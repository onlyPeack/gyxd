<template>

  <div class="app-container calendar-list-container bill-container">
    <!--查询和其他操作-->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
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
      <el-table-column align="center" label="单据编号" fixed="left" prop="billNo">
      </el-table-column>
      <el-table-column align="right" label="总利润" prop="totalProfit" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.totalProfit).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="总计" prop="sum2" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.sum2).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="采购利润" prop="purchaseProfit" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.purchaseProfit).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="商务利润" prop="businessProfit" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.businessProfit).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="业务员利润" prop="salesProfit" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.salesProfit).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="税金账户" prop="taxProfit" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxProfit).toFixed(4)}}
        </template>
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
  import {profitPage} from '@/api/erp/financial/balance';

  export default {
    name: 'customerList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery:{
          page: 1,
          limit: 10,
          billNo:undefined,
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['totalProfit', 'sum2', 'purchaseProfit','businessProfit','salesProfit','taxProfit']);
      },
      handleReset(){
        this.listQuery.page = 1;
        this.listQuery.limit = 10;
        this.listQuery.billNo = undefined;
      },
      handleFilter(){
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
      getList() {
        this.list = undefined;
        this.listLoading = true;
        profitPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total
          this.listLoading = false;
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
