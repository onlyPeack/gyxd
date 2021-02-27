<template>
  <div class="bill-container payable-detail-full-purchase">

    <!-- 查询和其他操作 -->
    <div class="filter-container  payable-detail-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商负责人"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.supplierManagerName">-->
        <!--</el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                  @keyup.enter.native="handleFilter" v-model="listQuery.builderName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="所属部门"
                  @keyup.enter.native="handleFilter" v-model="listQuery.departName">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="单据开始日期"
          end-placeholder="单据结束日期"
          value-format="yyyy-MM-dd"
          @change="handleBillDateSelect"
          :picker-options="pickerOptions">
        </el-date-picker>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"  @click="handleDownload">导出</el-button>
        </div>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable2" class="result-data-table">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center"  sortable>
      </el-table-column>
      <el-table-column prop="objectName" label="单据类型" align="center" sortable>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商名称" sortable>
      </el-table-column>
      <!--<el-table-column prop="supplierManagerName" label="供应商负责人">-->
      <!--</el-table-column>-->
      <el-table-column prop="builderName" label="业务员" align="center" sortable>
      </el-table-column>
      <el-table-column prop="departName" label="所属部门" align="center"  sortable>
      </el-table-column>
      <!--<el-table-column prop="currencyId" label="币别">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-for="item in currencyOptions">-->
            <!--<span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="amountFor" label="应付金额" align="right" class-name="col-required" sortable>
        <template slot-scope="scope">
          {{Number(scope.row.amountFor).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="repayAmountFor" label="已付金额" align="right" class-name="col-required" sortable>
        <template slot-scope="scope">
          {{Number(scope.row.repayAmountFor).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="notRepayAmountFor" label="未付金额" align="right" class-name="col-required" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.repayAmountFor==undefined || scope.row.repayAmountFor==''">
            {{Number(scope.row.amountFor).toFixed(4)}}
          </span>
          <span v-else>
            {{parseFloat(scope.row.amountFor*1-scope.row.repayAmountFor*1).toFixed(4)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" sortable>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,500,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {selectPage} from '@/api/erp/financial/financialPayableDetail';
  import {getFloat} from '@/utils/util';

  export default {
    name: "payable-detail",
    data() {
      return {
        downloadLoading:false,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          supplierName: undefined,
          supplierManagerName: undefined,
          builderName: undefined,
          org: undefined,
          selectType:1, //1代表查询所有数据
        },
        clientHeight: 300,
        selectedRows: [],
        billDate: undefined
      };
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          for (var i in list) {
            Object.assign(list[i], list[i].mainDTO);
            list[i].notReceiptAmountFor = list[i].receiptAmountFor ? parseFloat(list[i].amountFor * 1 - list[i].receiptAmountFor * 1).toFixed(4) : list[i].amountFor;
            delete list[i].mainDTO;
          }
          tHeader = ['单据日期', '单据类型', '单据编号', '供应商', '供应商负责人','业务员','部门','币别','应付金额','已付金额','未付金额'];
          filterVal = ['billDate', 'objectName', 'billNo', 'supplierName', 'supplierManagerName', 'builderName','org','currencyId','amountFor','repayAmountFor', 'notReceiptAmountFor'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '应付明细表');
          this.downloadLoading = false;
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('payable-detail-filter-container')[0]) {
          var height = document.getElementsByClassName('payable-detail-filter-container')[0].clientHeight;
        } else {
          height = 46;
        }
        this.clientHeight = (document.body.clientHeight - (210 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .payable-detail-full-purchase {
    margin: 10px 20px;

    .filter-container {
      padding-bottom: 0px;
    }

    .pagination-container {
      margin-top: 5px;
    }

    .result-data-table .cell {
      height: 23px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .colum-billno {
      color: #0078D7;
      cursor: pointer;
    }
  }

</style>
