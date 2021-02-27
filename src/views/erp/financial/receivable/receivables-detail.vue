<template>
  <div class="bill-container receivables-detail-full-purchase">

    <!-- 查询和其他操作 -->
    <div class="filter-container  receivables-detail-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.customerName">
        </el-input>
        <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="客户负责人"-->
                  <!--@keyup.enter.native="handleFilter" v-model="listQuery.customerManagerName">-->
        <!--</el-input>-->

        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                  @keyup.enter.native="handleFilter" v-model="listQuery.builderName">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="所属部门"
                  @keyup.enter.native="handleFilter" v-model="listQuery.departName">
        </el-input>
        <div style="float: right;">
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" :loading="downloadLoading"
                     @click="handleDownload">导出
          </el-button>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="handleBillDateSelect"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable2" class="result-data-table" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" sortable>
      </el-table-column>
      <el-table-column prop="objectName" label="单据类型" align="center" sortable>
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" sortable>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" sortable>
      </el-table-column>
      <!--<el-table-column prop="customerManagerName" label="客户负责人">-->
      <!--</el-table-column>-->
      <el-table-column prop="builderName" label="业务员" align="center" sortable>
      </el-table-column>
      <el-table-column prop="departName" label="所属部门" align="center" sortable>
      </el-table-column>
      <!--<el-table-column prop="currencyId" label="币别">-->
        <!--<template slot-scope="scope">-->
          <!--<span v-for="item in currencyOptions">-->
            <!--<span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>-->
          <!--</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="amountFor" label="应收金额" align="right" class-name="col-required" sortable>
      </el-table-column>
      <el-table-column prop="receiptAmountFor" label="已收金额" align="right" class-name="col-required" sortable>
      </el-table-column>
      <el-table-column prop="notReceiptAmountFor" label="未收金额" align="right" class-name="col-required" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.receiptAmountFor==undefined || scope.row.receiptAmountFor==''">
            {{scope.row.amountFor}}
          </span>
          <span v-else>
            {{parseFloat(scope.row.amountFor*1-scope.row.receiptAmountFor*1)}}
          </span>
        </template>
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
  import {selectPage} from '@/api/erp/financial/financialReceivableDetail';
  import {getFloat} from '@/utils/util';

  export default {
    name: "receivables-detail",
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          customerName: undefined,
          customerManagerName: undefined,
          builderName: undefined,
          org: undefined,
          crtUserNo: undefined,
          selectType: 0,  //0代表查询所有字段

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
      getSummaries(param) {
        return this.getSummariesMethod(param, ['amountFor', 'receiptAmountFor']);
      },
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
          tHeader = ['单据日期', '单据类型', '单据编号', '客户', '客户负责人', '业务员', '部门', '币别', '应收金额', '已收金额', '未收金额'];
          filterVal = ['billDate', 'objectName', 'billNo', 'customerName', 'customerManagerName', 'builderName', 'org', 'currencyId', 'amountFor', 'receiptAmountFor', 'notReceiptAmountFor'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '应收明细表');
          this.downloadLoading = false;
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('receivables-detail-filter-container')[0]) {
          var height = document.getElementsByClassName('receivables-detail-filter-container')[0].clientHeight;
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
  .receivables-detail-full-purchase {
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
