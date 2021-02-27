<template>

  <div class="app-container calendar-list-container bill-container">

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
              element-loading-text="正在查询中。。。" border fit highlight-current-row>
      <el-table-column type="index" label="序号" align="center" width="55" :index="indexFun"></el-table-column>
      <el-table-column align="right" label="订单锁库金额" prop="orderLockStockAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.orderLockStockAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column align="right" label="锁库日志金额" prop="lockStockLogAmount" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.lockStockLogAmount).toFixed(4)}}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import {lockPage} from '@/api/erp/financial/balance';

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
      getList() {
        this.list = undefined;
        this.listLoading = true;
        lockPage().then(response => {
          this.list = [response];
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
