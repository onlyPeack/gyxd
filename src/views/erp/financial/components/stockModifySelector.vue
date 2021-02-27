<template>
  <el-dialog
    title="选择关联单据"
    :visible.sync="dialogSelectorVisible"
    width="70%"
    @close="handleSelectorClose"
    :modal="false"
    :before-close="handleSelectorClose"
    class="billSelectorDialog"
  >
    <div class="full-purchase sales-contract-full-purchase">
      <!-- 查询和其他操作 -->
      <div class="filter-container sales-contract-filter-container">
        <div>
          <el-input
            clearable
            class="filter-item"
            style="width: 200px;"
            placeholder="单据编号"
            v-model="listQuery.billNo"
            @keyup.enter.native="handleFilter"
          ></el-input>
          <el-button
            class="filter-item"
            type="primary"
            @click="handleFilter"
            style="margin-left: 30px;"
          >查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        </div>
      </div>
      <!-- 查询结果 -->
      <!--汇票库-->
      <el-table
        :data="list"
        border
        style="width: 100%"
        v-loading="listLoading"
        ref="dataTable"
        @row-click="handleRowClick"
        @selection-change="handlechangeFun"
        size="mini"
        highlight-current-row
        element-loading-text="正在查询中。。。"
        :height="clientHeight"
        show-summary
        :summary-method="getSummaries"
        class="result-data-table"
      >
        <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" width="200" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO" class="colum-billno" align="center" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="250">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="盘点人工号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="crtUserName" label="盘点人" align="center" width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseName" label="盘点仓库" align="center" width="180">
      </el-table-column>
      <el-table-column prop="positionName" label="盘点仓位" align="center" width="180">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="150">
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="takingQty" label="盘点数量" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="盘点日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="150">
      </el-table-column>
      </el-table>
      <!-- 到款库 -->
      <el-table
        v-if="acceptanceType == 2"
        :data="list"
        border
        style="width: 100%"
        v-loading="listLoading"
        ref="dataTable"
        @row-click="handleRowClick"
        @selection-change="handlechangeFun"
        size="mini"
        highlight-current-row
        element-loading-text="正在查询中。。。"
        :height="clientHeight"
        show-summary
        :summary-method="getSummaries"
        class="result-data-table"
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column prop="billNo" label="单据编号" width="200" align="center" sortable>
          <template slot-scope="scope">
            <div
              class="colum-billno"
            >{{scope.row.mainDTO.billNo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="billStatusName" label="单据状态" align="center" width="100"></el-table-column>
        <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="100"></el-table-column>
        <el-table-column prop="crtUserName" label="制单人" align="center" width="150"></el-table-column>
        <el-table-column
          prop="mainDTO.receiveAccount"
          label="收款账户"
          align="center"
          width="100"
          sortable
        ></el-table-column>
        <el-table-column prop="paymentsName" label="结算方式" align="center" width="100"></el-table-column>
        <el-table-column prop="customerCode" label="客户编号" align="center" width="80"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名" width="200"></el-table-column>
        <el-table-column prop="managerName" label="客服姓名" align="center" width="100" sortable></el-table-column>
        <el-table-column prop="departName" label="客服部门" width="120"></el-table-column>
        <el-table-column
          prop="amountFormer"
          label="到款金额"
          align="right"
          class-name="col-required"
          sortable
        ></el-table-column>
        <el-table-column prop="note" label="备注" width="150"></el-table-column>
        <el-table-column prop="crtTime" label="单据日期" align="center" width="180" sortable></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleSelectorClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import {
//   selectPage,
//   batchDelBill,
//   getBill,
// } from '@/api/erp/wms/bill/stockModify';
import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/wms/bill/stockTaking';
import { getFloat } from "@/utils/util";

export default {
  name: "invoiceSelector",
  props: ["dialogSelectorVisible", "sourceBillNo", "acceptanceType", "customerCode"],
  watch: {
    acceptanceType: function(val) {
      console.log(val);
    }
  },
  data() {
    return {
      clientHeight: 300,
      list: [],
      total: undefined,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        roleType: 0,
        selectType: 0,
        customerCode:!!this.customerCode ? this.customerCode : undefined,
        billNo: undefined
      },
      selectedRows: [],
      queryVisible: false,
      contractDate: undefined,
      effectiveDate: undefined,
      disabledDate: undefined
    };
  },
  created() {
    //this.changeDivHeight();
    const _this = this;
    window.onresize = function() {
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
      setTimeout(function() {
        _this.changeDivHeight();
      }, 1);
    },
    changeDivHeight() {
      if (
        document.getElementsByClassName("sales-contract-filter-container")[0]
      ) {
        var height = document.getElementsByClassName(
          "sales-contract-filter-container"
        )[0].clientHeight;
      } else {
        height = 38;
      }
      this.clientHeight = (document.body.clientHeight - (160 + height)) * 0.95;
    },
    getList() {
      this.listLoading = true;
      this.list = [];
      this.total = 0;
      this.listLoading = false;
        selectPageByItem(this.listQuery)
            .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
            })
            .catch(() => {
            this.list = [];
            this.total = 0;
            this.listLoading = false;
            });
    },
    getSummaries(param) {
      return this.getSummariesMethod(param, [
        "amt",
        "paymentAmt",
        "monthRate",
        "discount"
      ]);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.handleSouceObjectChange(false);
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.handleSouceObjectChange(false);
    },
    handleFilter() {
      this.listLoading = true;
      this.getList();
    },
    handleSelectorClose() {
      this.$emit("handleSelectorClose", false);
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        selectType: 3
      };
      this.contractDate = undefined;
      this.effectiveDate = undefined;
      this.disabledDate = undefined;
      this.handleFilter();
    },
    handleRowClick(row, event, column) {
      this.$refs.dataTable.toggleRowSelection(row);
    },
    handlechangeFun(val) {
      this.selectedRows = val;
    },
    handleSouceObjectChange(clear) {
      if (clear) {
        this.selectedRows = [];
      }
    },
    handleSubmit() {
      if (this.selectedRows.length == 1) {
        for (let i in this.selectedRows) {
          if (this.selectedRows[0].billNo != this.selectedRows[i].billNo) {
            this.$message.error("只支持同一张单据内进行关联创建，请重新选择");
            return;
          }
        }

        if (
          this.sourceBillNo &&
          this.sourceBillNo != this.selectedRows[0].billNo
        ) {
          this.$confirm("切换已选单据将清空相应的数据，确认切换吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.$emit("submitSelectorSuccess", {
                list: this.selectedRows,
                isClearAll: true
              });
            })
            .catch(() => {});
        } else {
          this.$emit("submitSelectorSuccess", {
            list: this.selectedRows,
            isClearAll: false
          });
        }
      } else {
        this.vueMessage("warning", "请选择一条单据!");
        // this.$emit('submitSelectorSuccess', {
        //   list: this.selectedRows,
        //   isClearAll: false,
        // });
      }
    },
    handleContractDateSelect(val) {
      this.listQuery.startContractDate = val[0];
      this.listQuery.endContractDate = val[1];
    },
    handleDisabledDateSelect(val) {
      this.listQuery.startDisabledDate = val[0];
      this.listQuery.endDisabledDate = val[1];
    },
    handleEffectiveDateDateSelect(val) {
      this.listQuery.startEffectiveDate = val[0];
      this.listQuery.endEffectiveDate = val[1];
    }
  },
  watch: {
    contractDate(value) {
      if (value == null) {
        this.listQuery.startContractDate = undefined;
        this.listQuery.endContractDate = undefined;
      }
    },
    effectiveDate(value) {
      if (value == null) {
        this.listQuery.startEffectiveDate = undefined;
        this.listQuery.endEffectiveDate = undefined;
      }
    },
    disabledDate(value) {
      if (value == null) {
        this.listQuery.startDisabledDate = undefined;
        this.listQuery.endDisabledDate = undefined;
      }
    }
  }
};
</script>
