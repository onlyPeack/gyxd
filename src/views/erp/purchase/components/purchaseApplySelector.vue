<template>
  <el-dialog title="选择关联单据" :visible.sync="dialogSelectorVisible" width="70%" @close="handleSelectorClose"
             :modal="false" :before-close="handleSelectorClose" class="billSelectorDialog">
    <div class="full-purchase purchase-order-full-purchase">

      <!-- 查询和其他操作 -->
      <div class="filter-container purchase-apply-filter-container">
        <div>
          <el-select v-model="sourceObject.key" style="width: 200px;top: -4px;">
            <el-option v-for="item in billOptions" :key="item.key" :label="item.name" :value="item.key">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                    v-model="listQuery.billNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                    v-model="listQuery.customerName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                    v-model="listQuery.warehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
        </div>
        <div class="query-container" v-show="queryVisible">
          <div class="block">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                      v-model="listQuery.skuNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                      v-model="listQuery.skuName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                      v-model="listQuery.brandName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                      v-model="listQuery.seriesName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                      v-model="listQuery.rebateSeries"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <div></div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                      v-model="listQuery.specifications"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                      v-model="listQuery.itemNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
          </div>

        </div>
      </div>

      <!-- 查询结果 -->
      <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                class="result-data-table">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="单据编号" width="180">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="204">
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" width="204">
        </el-table-column>
        <el-table-column prop="rebateSeries" label="返点系列" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="型号" width="200">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="200">
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
        </el-table-column>
        <el-table-column prop="releaseQty" label="可用数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="applyQty" label="申请数量" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="purchasedQty" label="已采购数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="stockInQty" label="已入库数量" align="right" width="120">
        </el-table-column>
        <el-table-column prop="retailPrice" label="面价" align="right" width="120" v-slot="{row}">
          <span>{{Number(row.retailPrice).toFixed(4)}}</span>
        </el-table-column>
        <el-table-column prop="releasePrice" label="发布单价" align="right" width="120" v-slot="{row}">
          <span>{{Number(row.releasePrice).toFixed(4)}}</span>
        </el-table-column>
        <el-table-column prop="transferPrice" label="调拨价" align="right" width="120" class-name="col-required" v-slot="{row}">
          <span>{{Number(row.transferPrice).toFixed(4)}}</span>
        </el-table-column>
        <el-table-column prop="transferDiscount" label="调拨折扣" align="right" width="120" class-name="col-required">
        </el-table-column>
        <el-table-column prop="mainDTO.customerName" label="客户名称" min-width="150">
        </el-table-column>
        <el-table-column prop="mainDTO.warehouseName" label="仓库名称" width="120">
        </el-table-column>
        <el-table-column prop="mainDTO.type" label="申请类型" width="120">
          <template slot-scope="scope">
            <div v-for="item in typeOptions">
              <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.type">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="crtTime" label="单据日期" width="150">
        </el-table-column>
        <el-table-column prop="crtUserName" label="制单人" width="180">
        </el-table-column>
        <el-table-column prop="salesOrderBillNo" label="订货单编号" width="200">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="200">
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
  import {selectPageByItem} from '@/api/erp/purchase/bill/purchaseApply';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseApplySelector",
    props: ['dialogSelectorVisible', 'sourceBillNo', 'type'],
    data() {
      return {
        clientHeight: 300,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          crtUserName: undefined,
          warehouseName: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerName: undefined,
          selectType: this.type
        },
        typeOptions: [{
          value: '0',
          label: '备货'
        }, {
          value: '1',
          label: '按订单采购'
        }],
        selectedRows: [],
        queryVisible: false,
        billOptions: [{
          key: 'CGSQD',
          name: '采购申请单',
        }],
        sourceObject: {
          key: 'CGSQD',
          name: '采购申请单',
        }
      };
    },
    created() {
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
        if (document.getElementsByClassName('purchase-apply-filter-container')[0]) {
          var height = document.getElementsByClassName('purchase-apply-filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
      },
      getList() {
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
          selectType: 2
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
            if (this.selectedRows[0].mainDTO.billNo != this.selectedRows[i].mainDTO.billNo) {
              this.$message.error('只支持同一张单据内进行关联创建，请重新选择');
              return;
            }
          }

          if (this.sourceBillNo && this.sourceBillNo != this.selectedRows[0].mainDTO.billNo) {

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
