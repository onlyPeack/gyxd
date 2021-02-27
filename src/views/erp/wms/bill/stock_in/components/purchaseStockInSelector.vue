<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="75%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog dropDialog">
    <div class="full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container payment-apply-filter-container">
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购订单号"
                    v-model="listQuery.batchNumber"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
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
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                    v-model="listQuery.warehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker
            v-model="billDate"
            type="daterange"
            align="right"
            style="width: 403px;vertical-align: top"
            unlink-panels
            range-separator="至"
            start-placeholder="入库开始日期"
            end-placeholder="入库结束日期"
            value-format="yyyy-MM-dd"
            @change="handleBillDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="归属人"
                    v-model="listQuery.ownerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="chooseData" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column width="90" align="center">
          <template slot="header" slot-scope="scope">
            <el-button @click="batchChoose">选入</el-button>
          </template>
          <template slot-scope="scope">
            <span class="el-icon-plus" style="cursor: pointer;color:#409EFF;" @click="chooseData(scope.row)"></span>
          </template>

        </el-table-column>
        <el-table-column type="selection" align="center">

        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="source" label="库存来源" width="108">
          <template slot-scope="scope">
            <span v-if="scope.row.source == '0'">标准ERP</span>
            <span v-if="scope.row.source == '1'">和稷ERP</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="单据编号" width="160">
        </el-table-column>
        <el-table-column prop="source" label="库存类型" width="160" align="left">
        <template slot-scope="scope">
          <div class="gray">
            <span v-if="scope.row.type == 0">商务备货</span>
            <span v-if="scope.row.type == 1">按订单采购</span>
            <span v-if="scope.row.type == 2">调拨库存</span>
            <span v-if="scope.row.type == 3">线下库存</span>
            &nbsp;
            </div>
        </template>
      </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="108">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="108">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="108">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="108">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="108">
        </el-table-column>
        <el-table-column prop="qty" label="数量" width="108">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" width="108">
        </el-table-column>
        <el-table-column prop="allocationPrice" label="调拨价" width="108">
        </el-table-column>
        <el-table-column prop="checkPrice" label="考核价" width="108">
        </el-table-column>
        <el-table-column prop="purchasePrice" label="平均进价" width="108">
        </el-table-column>
        <el-table-column prop="lockedQty" label="锁库数量" width="108">
        </el-table-column>
        <el-table-column prop="ownerName" label="归属人" width="108">
        </el-table-column>
        <el-table-column prop="purchaserName" label="采购员" width="108">
        </el-table-column>
        <el-table-column prop="stockType" label="库存类型" width="108">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" width="108">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" width="108">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="108">
        </el-table-column>
        <el-table-column prop="warehousePositionName" label="仓位名称" width="108">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="140">
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[5,10,20,30,50,100,200]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>

      <el-table :data="listDrop" border style="width: 100%" ref="dataDrop" size="mini"
                highlight-current-row class="result-data-table" :height="450">
        <el-table-column width="60" v-slot="{$index}" align="center">
          <span class="el-icon-minus" style="cursor: pointer;color:#F56C6C;" @click="removeData($index)"></span>
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="source" label="库存来源" width="108">
          <template slot-scope="scope">
            <span v-if="scope.row.source == '0'">标准ERP</span>
            <span v-if="scope.row.source == '1'">和稷ERP</span>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="单据编号" width="160">
        </el-table-column>
        <el-table-column prop="source" label="库存类型" width="160" align="left">
          <template slot-scope="scope">
            <div class="gray">
              <span v-if="scope.row.type == 0">商务备货</span>
              <span v-if="scope.row.type == 1">按订单采购</span>
              <span v-if="scope.row.type == 2">调拨库存</span>
              <span v-if="scope.row.type == 3">线下库存</span>
              &nbsp;
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="108">
        </el-table-column>
        <el-table-column prop="skuName" label="名称" width="108">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="108">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="108">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="108">
        </el-table-column>
        <el-table-column prop="qty" label="数量" width="108">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" width="108">
        </el-table-column>
        <el-table-column prop="allocationPrice" label="调拨价" width="108">
        </el-table-column>
        <el-table-column prop="checkPrice" label="考核价" width="108">
        </el-table-column>
        <el-table-column prop="purchasePrice" label="平均进价" width="108">
        </el-table-column>
        <el-table-column prop="lockedQty" label="锁库数量" width="108">
        </el-table-column>
        <el-table-column prop="ownerName" label="归属人" width="108">
        </el-table-column>
        <el-table-column prop="purchaserName" label="采购员" width="108">
        </el-table-column>
        <el-table-column prop="stockType" label="库存类型" width="108">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" width="108">
        </el-table-column>
        <el-table-column prop="supplierCode" label="供应商编码" width="108">
        </el-table-column>
        <el-table-column prop="warehouseName" label="仓库名称" width="108">
        </el-table-column>
        <el-table-column prop="warehousePositionName" label="仓位名称" width="108">
        </el-table-column>
        <el-table-column prop="crtTime" label="创建时间" width="140">
        </el-table-column>

      </el-table>

    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/wms/bill/purchaseStockInCancel';
  import {getFloat} from '@/utils/util';
  import { queryXSStockDetail } from '@/api/erp/wms/stock_query/index'

  export default {
    name: "salesReturnInvoiceSelector",
    props: ['dialogSelectorVisible', 'sourceBillNo'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        listDrop:[],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 5,
          billNo: '',
          customerName: '',
          crtUserName: '',
          startTime: '',
          endTime: '',
          selectType: 6, //其它单据关联合同时查询，只查状态为正常的单据
          purchaserId:this.$store.state.user.id
        },
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'XSFP',
          name: '销售发票',
        }],
        sourceObject: {
          key: 'XSFP',
          name: '销售发票',
        },
        billDate: '',
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-return-invoice-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-return-invoice-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        this.listLoading = true;
        queryXSStockDetail(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'invoiceAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }


          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
      },
      handleSelectorClose() {
        this.$emit('handleSelectorClose', false)
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: 6,
          purchaserId:this.$store.state.user.id
        };
        this.billDate = undefined;
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSubmit() {
        this.selectedRows=this.listDrop
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].batchNumber != this.selectedRows[i].batchNumber) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
              return
            }
          }

          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].billNo) {

            this.$confirm('切换已选单据将清空相应的数据，确认切换吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$emit('submitSelectorSuccess', {
                list: this.selectedRows,
                isClearAll: true,
                sourceObject: this.sourceObject
              });
            }).catch(() => {

            });

          } else {
            this.$emit('submitSelectorSuccess', {
              list: this.selectedRows,
              isClearAll: false,
              sourceObject: this.sourceObject
            });
          }

        } else {
          this.$emit('submitSelectorSuccess', {
            list: this.selectedRows,
            isClearAll: false,
            sourceObject: this.sourceObject
          });
        }
      },
      handleBillDateSelect(val) {
        this.listQuery.startTime = val[0];
        this.listQuery.endTime = val[1];
      },

      /**
       * 下方存储表格移除数据
       * @param index
       */
      removeData(index) {
        this.listDrop.splice(index, 1)
      },

      /**
       * 表格双击选中添加进下方存储表格
       * @param row
       */
      chooseData(row) {

        for (let i in this.listDrop) {
          if (row.batchNumber != this.listDrop[i].batchNumber) {
            this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
            return
          }
        }
        this.listDrop.push(row)
        let hash = {}
        this.listDrop = this.listDrop.reduce(function (item, next) {
          hash[next.id] ? '' : hash[next.id] = true && item.push(next);
          return item
        }, [])
      },

      batchChoose(){
        if (this.selectedRows.length > 0) {
          for(let i = 0; i < this.selectedRows.length; i++){
            for(let j = i+1; j < this.selectedRows.length; j++){
              if(this.selectedRows[i].batchNumber !== this.selectedRows[j].batchNumber){
                this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
                return false;
              }
            }
          }

          for (let i = 0; i <this.selectedRows.length ; i++) {
            this.chooseData(this.selectedRows[i])
          }
        }
      }


    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startTime = '';
          this.listQuery.endTime = '';
        }
      },
    }
  }
</script>
<style>
  .dropDialog>.el-dialog{
    height: auto!important;
  }
  .dropDialog  .el-dialog__footer{
    bottom: -45px;
  }
</style>
