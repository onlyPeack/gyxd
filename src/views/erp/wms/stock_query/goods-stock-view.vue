<template>
  <el-dialog :visible.sync="dialogFormVisible" width="60%" @close="handleClose" class="goodsStockView"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>商品出入库明细详情</span>
      </span>

    <div class="center-container goods-stock-center-container">
      <table class="topTable">
        <tr>
          <td>
            <span class="label">商品编码:</span>{{this.skuNo}}
          </td>
        </tr>
        <tr>
          <td>
            <span class="label">商品名称:</span>{{this.skuName}}
          </td>
        </tr>
        <tr>
          <td>
            <span class="label">规格型号:</span>{{this.specifications}}
          </td>
        </tr>
        <tr>
          <td>
            <span class="label">仓库名称:</span>{{this.warehouseName}}
          </td>
        </tr>
      </table>
    </div>

    <el-table :data="list" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="objectName" label="单据类型">
        <template slot-scope="scope">
          <span>{{scope.row.objectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="操作日期" width="150">
        <template slot-scope="scope">
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" min-width="150">
        <template slot-scope="scope">
          <span>{{scope.row.billNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="opertionName" label="操作" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.opertionName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qtyIn" label="入库数量" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qtyIn}}</span></template>
      </el-table-column>
      <el-table-column prop="qtyOut" label="出库数量" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qtyOut}}</span></template>
      </el-table-column>
      <el-table-column prop="qtyBalance" label="结余数量" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qtyIn-scope.row.qtyOut}}</span>
        </template>
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

    <!-- 商品出入库明细详情按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util';
  import {page} from '@/api/erp/wms/stock_query/stock-change-records';

  export default {
    name: "goods-stock-view",
    props: ['dialogFormVisible', 'warehouseName', 'warehouseId', 'specifications', 'skuName', 'skuNo'],
    data() {
      return {
        clientHeight: 300,
        dataForm: {},
        list: undefined,
        total: undefined,
        listQuery:{
          page: 1,
          limit: 20,
          warehouseId: undefined,
          skuNo:undefined
        }
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('goods-stock-center-container')[0]) {
          var height = document.getElementsByClassName('goods-stock-center-container')[0].clientHeight;
        } else {
          var height = 124;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        this.listQuery.warehouseId = this.warehouseId
        this.listQuery.skuNo=this.skuNo
        this.getList();
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
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
      handleClose() {
        this.$emit('handleStockClose');
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
          if (column.property === 'qtyIn') {
            values = data.map(item => Number(item.qtyIn*1));
          } else if (column.property === 'qtyOut') {
            values = data.map(item => Number(item.qtyOut*1));
          }else if (column.property === 'qtyBalance') {
            values = data.map(item => Number(item.qtyIn-item.qtyOut));
          }

          if (column.property === 'qtyIn' || column.property === 'qtyBalance'|| column.property === 'qtyOut') {
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
  .goodsStockView {
    font-size: 12px;

    .con-title {
      font-size: 16px;
      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }
    }

    .topTable {
      width: 100%;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;

      td {
        border: 1px solid #e0e0e0;
        height: 40px;
        line-height: 40px;
        padding: 0px;
        margin: 0px;
        padding-left: 10px;
      }

      .label {
        font-size: 14px;
        font-weight: bold;
        margin-right: 12px;
      }
    }

    .tb-detail {
      flex: 1 0 auto;
      margin-top: -1px;
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
