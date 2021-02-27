<template>

  <div class="systemBalance app-container calendar-list-container bill-container">

    <!-- 查询和其他操作 -->
    <!--<div class="filter-container">-->
      <!--<div>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编码"-->
                  <!--v-model="listQuery.customerCode"-->
                  <!--@keyup.enter.native="handleFilter">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="客户全称"-->
                  <!--v-model="listQuery.customerName"-->
                  <!--@keyup.enter.native="handleFilter">-->
        <!--</el-input>-->
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="客户负责人"-->
                  <!--v-model="listQuery.managerName"-->
                  <!--@keyup.enter.native="handleFilter">-->
        <!--</el-input>-->
        <!--&lt;!&ndash;<el-select v-model="timeInterval" placeholder="请选择时间间隔"  style="width: 200px"&ndash;&gt;-->
        <!--&lt;!&ndash;class="filter-item">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-option v-for="item in timeIntervalOptions" :key="item.id" :label="item.labelDefault"&ndash;&gt;-->
        <!--&lt;!&ndash;:value="item.value"></el-option>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
        <!--<el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询-->
        <!--</el-button>-->
        <!--<el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>-->
        <!--&lt;!&ndash;<el-button class="filter-item" type="primary" @click="handleGeneratingCommonPool(timeInterval)">生成公共池客户</el-button>&ndash;&gt;-->
        <!--<el-button class="filter-item" type="primary" @click="handleBatchUpdate">重新分配</el-button>-->
      <!--</div>-->
      <!--&lt;!&ndash;</el-collapse-item>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-collapse>&ndash;&gt;-->
    <!--</div>-->

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" ref="dataTable"
              element-loading-text="正在查询中。。。" border fit highlight-current-row :span-method="arraySpanMethod">
      <el-table-column label="序号" align="center" width="55" prop="index">
      </el-table-column>
      <el-table-column align="right" label="库存资金" prop="stockAmount" class-name="col-required">
         <template slot-scope="scope" v-if="scope.row.stockAmount">
          {{scope.row.stockAmount.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="银行资金" prop="bankAmount" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="客户账上资金" prop="customerAmount" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="公司账上资金" prop="companyAmount" class-name="col-required">
        <template slot-scope="scope" v-if="scope.row.companyAmount">
          {{scope.row.companyAmount.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="员工资金" prop="staffAmount" class-name="col-required">
      </el-table-column>
      <el-table-column align="right" label="供应商账上资金" prop="supplierAmount" class-name="col-required">
         <template slot-scope="scope" v-if="scope.row.supplierAmount">
          {{scope.row.supplierAmount.toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="企业结算" prop="sumAmount" class-name="col-required">
      </el-table-column>
    </el-table>
    <div class="differenceMount" v-if="listLoading == false">
      <div class="grid-content bg-purple">差额</div>
      <div style="color:#F56C6C;text-align:right">{{differenceMount}}</div>
    </div>
  </div>
</template>

<script>
  import {systemPage} from '@/api/erp/financial/balance';
  import { getSumAmount } from '@/api/erp/wms/config/settleOrg'
  export default {
    name: 'customerList',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        sumAmount:undefined,
        differenceMount:undefined
      }
    },
    created() {
      this.getSumAmount()
    },
    methods: {
      getSumAmount() {
        getSumAmount().then(res => {
          this.sumAmount = res.data.toFixed(4);
          this.getList();
        })
      },
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex  === 1) {//判断条件可以设置成你想合并的行的起始位置
          if (columnIndex === 1) {//判断条件可以设置成你想合并的列的起始位置
            return [1, 2];
          }
          console.log(columnIndex);
          if(columnIndex === 2){
            return [2, 5];
          }
        }
      },
      getList() {
        this.list = undefined;
        this.listLoading = true;
        systemPage().then(response => {
            let data = JSON.parse(JSON.stringify(response));
            data.index = 1;
            let datas=[data,{
              index:'合计',
              stockAmount:data.sum1,
              bankAmount:(Number(data.sum2) + Number(this.sumAmount)).toFixed(4)
            }]
            this.list = datas;
            this.list[0].sumAmount = this.sumAmount;
            this.differenceMount = (this.list[1].stockAmount - Number(this.list[1].bankAmount)).toFixed(4);
            this.listLoading = false;
          })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .systemBalance {
    .differenceMount {
      height: 40px;
      line-height: 40px;
      padding-right: 10px;
      border: 1px solid #dfe6ec;
      border-top: 0;
      // padding: 10px;
      font-size: 12px;
      position: relative;
      display: flex;
      justify-content: space-between;
      .grid-content {
        width: 55px;
        height: 40px;
        border-right: 1px solid #dfe6ec;
        text-align: center;
      }
    }
  }

</style>
