<template>

  <div class="app-container calendar-list-container bill-container">

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" ref="dataTable" :span-method="arraySpanMethod"
              element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column label="序号" align="center" width="55" prop="index">
      </el-table-column>
      <el-table-column align="center" label=" 和稷期货入库数量" prop="hjStockInQty">
      </el-table-column>
      <el-table-column align="center" label="和稷直发出库数量" prop="hjStraightOutQty" >
      </el-table-column>
      <el-table-column align="right" label="和稷期货入库金额" prop="hjStockInAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.hjStockInAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="和稷直发出库金额" prop="hjStraightOutAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.hjStraightOutAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import {financialPage} from '@/api/erp/financial/balance';

  export default {
    name: 'customerList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
      }
    },
    created() {
      this.getList();
    },
    methods: {
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex  === 1) {//判断条件可以设置成你想合并的行的起始位置
          if (columnIndex === 1) {//判断条件可以设置成你想合并的列的起始位置
            return [1, 2];
          }
          if(columnIndex === 2){
            return [2, 3];
          }
        }
      },
      getList() {
        this.list = undefined;
        this.listLoading = true;
        financialPage().then(response => {
          let data = JSON.parse(JSON.stringify(response));
          data.index = 1;
          let datas=[data,{
            index:'合计',
            hjStockInQty:data.sum1.toFixed(4),
            hjStraightOutQty:data.sum2.toFixed(4)

          }]
          this.list = datas;
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
