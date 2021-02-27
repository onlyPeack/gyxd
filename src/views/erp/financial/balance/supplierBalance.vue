<template>

  <div class="app-container calendar-list-container bill-container" >
    <!--查询和其他操作-->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户号"
                  v-model="listQuery.supplierCode"
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
      <el-table-column align="center" label=" 账户号" fixed="left" prop="supplierCode">
      </el-table-column>
      <el-table-column align="right" label="供应商账上资金" prop="supplierAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="合计" prop="sum2" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.sum2).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="供应商入库金额" prop="supplierStockInAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierStockInAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="供应商直发出库金额" prop="supplierStraightOutAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierStraightOutAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="供应商付款金额" prop="supplierPayAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierPayAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="供应商退款金额" prop="supplierReturnAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierReturnAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="供应商退货金额" prop="supplierReturnGoodsAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.supplierReturnGoodsAmount).toFixed(4)}}
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
  import {supplierPage} from '@/api/erp/financial/balance';

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
          supplierCode:undefined,
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['supplierAmount', 'sum2', 'supplierStockInAmount','supplierStraightOutAmount','supplierPayAmount','supplierReturnAmount','supplierReturnGoodsAmount']);
      },
      handleReset(){
        this.listQuery.page = 1;
        this.listQuery.limit = 10;
        this.listQuery.supplierCode = undefined;
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
        supplierPage(this.listQuery).then(response => {
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
