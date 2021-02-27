<template>
  <el-dialog title="选择销售出库关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase purchase-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-order-filter-container">
        <div>
           <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
            </el-input>
            <el-select v-model="listQuery.billStatus" disabled class="filter-item" placeholder="单据状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
            </el-select>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                    v-model="listQuery.crtUserNo"
                    @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                    v-model="listQuery.customerCode"
                    @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
            </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                        v-model="listQuery.skuName"
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
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订单单号"
                        v-model="listQuery.sourceBillNo"
                        @keyup.enter.native="handleFilter">
            </el-input>
            <el-input  clearable class="filter-item" style="width: 200px;" placeholder="发货单号"
                        v-model="listQuery.deliveryBillNo"
                        @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="出库仓库"
                        v-model="listQuery.warehouseName"
                        @keyup.enter.native="handleFilter">
            </el-input>
            <el-date-picker
                style="position: relative;top:-4px;"
                v-model="billDate"
                type="daterange"
                align="right"
                :clearable="false"
                unlink-panels
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="单据开始日期"
                end-placeholder="单据结束日期"
                @change="handleBillDateSelect"
                :picker-options="pickerOptions">
            </el-date-picker>
          </div>
        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                show-summary :summary-method="getSummaries" class="result-data-table">
        <el-table-column type="selection" width="50" align="center">
        </el-table-column>
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="150" sortable align="center">
            <template slot-scope="scope">
            <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                {{scope.row.mainDTO.billNo}}
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80" align="center">
            <template slot-scope="scope">
            <div v-for="item in statusOptions">
                <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
            </template>
        </el-table-column>
        <el-table-column prop="mainDTO.deliveryBillNo" label="发货单号" width="150" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.sourceBillNo" label="锁库订单" width="150" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.salerCode" label="业务员工号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.crtUserName" label="业务员姓名" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.customerCode" label="客户编号" width="100" align="center">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" width="180">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="出库仓库" width="100"  align="center">
        </el-table-column>
    <!--      <el-table-column prop="skuNo" label="商品编码" width="240">-->
    <!--      </el-table-column>-->
        <el-table-column prop="skuName" label="商品名称" width="180">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="180">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="120">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="stockReturnQty" label="退库数量" align="right" width="80">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="saleCostAmount" label="成本金额" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="saleProfit" label="销售利润" align="right" width="100" class-name="col-required">
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150" sortable align="center">
        </el-table-column>
        <el-table-column prop="lockingOrderNo" label="锁库子订单" width="180" align="center">
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

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {selectPageByItem} from '@/api/erp/wms/bill/salesStockOut';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseOrderSelector",
    props: ['dialogSelectorVisible', 'sourceBillNo'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          salerName: undefined,
          customerName: undefined,
          warehouseName: undefined,
          customerCode: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          itemNo: undefined,
          deliveryBillNo: undefined,
          sourceBillNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startReceiptDate: undefined,
          endReceiptDate: undefined,
          billStatus: 4,
          crtUserName: undefined,
          crtUserNo: undefined
        },
        billDate: [],
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'CGDD-KHDHD',
          name: '采购订单-销售订单锁定记录',
        }],
        sourceObject: {
          key: 'CGDD-KHDHD',
          name: '采购订单-销售订单锁定记录',
        }
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00'
        this.listQuery.endBillDate = val[1] + ' 23:59:59'
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('purchase-order-filter-container')[0]) {
          var height = document.getElementsByClassName('purchase-order-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
        console.log('listQuery');
        console.log(this.listQuery);
        this.listLoading = true;
        selectPageByItem(this.listQuery).then(response => {
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
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
                }
              }, 0);
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
          billStatus: 4,
        };
        this.handleFilter();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleSubmit() {
        if (this.selectedRows.length > 0) {
          for (let i in this.selectedRows) {
            if (this.selectedRows[0].salesOrderBillNo != this.selectedRows[i].salesOrderBillNo) {
              this.$message.error('只支持在同一张客户订货单据内进行关联创建，请重新选择');
              return;
            }
            if (this.selectedRows[0].supplierCode != this.selectedRows[i].supplierCode) {
              this.$message.error('只支持在同一供应商内进行选择，请重新选择');
              return;
            }
          }

          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].salesOrderBillNo) {

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
      }
    }
  }
</script>
