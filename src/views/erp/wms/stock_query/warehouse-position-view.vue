<template>
  <el-dialog :visible.sync="dialogFormVisible" width="60%" @close="handleClose" class="warehousePositionView"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>仓位详情列表</span>
      </span>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="positionName" label="仓位">
        <template slot-scope="scope">
          <span>{{scope.row.positionName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usableQty" label="可用数量" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.qty - scope.row.lockedQty }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="库存数量" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 商品出入库明细详情按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util';
  import {pageBySingleProduct, pageByProduct, pageByProductPosition} from '@/api/erp/wms/stock_query/index';


  export default {
    name: "warehouse-position-view",
    props: ['dialogFormVisible', 'warehouseId','skuNo'],
    data() {
      return {
        clientHeight: 300,
        listQuery: {
          page: 1,
          limit: 10,
          warehouseId:undefined
        },
        items: [],
      };
    },
    created() {
      this.listQuery.warehouseId=this.warehouseId;
      this.init();
      const _this = this;
      this.changeDivHeight();
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated(){
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        this.clientHeight = (document.body.clientHeight - 160) * 0.95;
      },
      init() {
        this.getList();
      },
      getList() {
        this.listLoading = true;
        pageByProductPosition(this.listQuery).then(response => {
          this.items = response.data.records;
          this.listLoading = false;
        }).catch(() => {
          this.items = [];
          this.listLoading = false;
        })
      },
      handleClose() {
        this.$emit('handleWarehousePositionClose');
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'usableQty') {
            values = data.map(item => Number(item.qty*1-item.lockedQty*1));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'qty' || column.property === 'usableQty') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .warehousePositionView {
    font-size: 12px;

    .con-title {
      font-size: 16px;
      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }
    }

    .tb-detail {
      flex: 1 0 auto;
      .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
        background-color: #fff;
      }
      td, th {
        padding: 0px;
        margin: 0px;
        height: 40px;
      }
      th {
        font-weight: 400;
        color: #000;
        background-color: #F7F7F7;
      }
    }
  }
</style>
