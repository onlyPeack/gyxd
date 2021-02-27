<template>
  <div class="full-purchase">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同编号"
                  v-model="listQuery.customerCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同名称"
                  v-model="listQuery.managerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                  v-model="listQuery.abbrName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
        <span @click="queryVisibleChange" v-model="queryVisible"
              style="color: #409EFF;margin-left: 10px;cursor: pointer;">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
          <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
      </div>
      <div class="query-container" v-show="queryVisible">
        <div class="block">
          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="签约开始日期"
            end-placeholder="签约结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>

          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="生效开始日期"
            end-placeholder="生效结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>

          <el-date-picker
            v-model="value7"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="到期开始日期"
            end-placeholder="到期结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="text" >
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>导入</el-button>
      <el-button type="text" >
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>导出</el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun"  size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <template v-if="choose">
        <el-table-column prop="mainDTO.contractDate" label="签约日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.effectiveDate" label="生效日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.disabledDate" label="到期日期" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.billNo" label="合同编号" width="204">
        </el-table-column>
        <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.supplierName" label="供应商" width="200">
        </el-table-column>
        <el-table-column prop="mainDTO.purchaserName" label="采购员" width="84">
        </el-table-column>
        <el-table-column label="币别" width="64">
          <template slot-scope="scope">
            <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="mainDTO.contractAmount" label="合同金额" align="right" width="108">
        </el-table-column>
        <el-table-column prop="mainDTO.note" label="备注" width="180">
        </el-table-column>
        <el-table-column prop="billStatus" label="单据状态" width="80">
        </el-table-column>
        <el-table-column prop="skuNo" label="商品编码" width="204">
        </el-table-column>
        <el-table-column prop="skuName" label="商品名称" width="204">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="400">
        </el-table-column>
        <el-table-column prop="qty" label="数量" align="right" width="75">
        </el-table-column>
        <el-table-column prop="unit" label="单位" align="center" width="75">
        </el-table-column>
        <el-table-column prop="price" label="单价" align="right" width="75">
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="right" width="104">
        </el-table-column>
        <el-table-column prop="tax" label="税额" align="right" width="104">
        </el-table-column>
        <el-table-column prop="taxPrice" label="含税单价" align="right" width="78">
        </el-table-column>
        <el-table-column prop="taxAmount" label="价税合计" align="right" width="104">
        </el-table-column>
        <el-table-column prop="itemNote" label="备注" width="104">
        </el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="contractDate" label="签约日期" width="108">
        </el-table-column>
        <el-table-column prop="effectiveDate" label="生效日期" width="108">
        </el-table-column>
        <el-table-column prop="disabledDate" label="到期日期" width="108">
        </el-table-column>
        <el-table-column prop="billNo" label="合同编号" width="204">
        </el-table-column>
        <el-table-column prop="contractName" label="合同名称" width="200">
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商" width="200">
        </el-table-column>
        <el-table-column prop="purchaserName" label="采购员" width="84">
        </el-table-column>
        <el-table-column label="币别" width="200">
          <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
          </template>
        </el-table-column>
        <el-table-column prop="contractAmount" label="合同金额" align="right" width="108">
        </el-table-column>
        <el-table-column prop="note" label="备注" width="180">
        </el-table-column>
        <el-table-column prop="billStatus" label="单据状态" width="80">
        </el-table-column>
      </template>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增合同弹窗 -->
    <other_stock_in_form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :billNo="billNo"
                                @submitSuccess="submitSuccess" @handleClose="handleClose">
    </other_stock_in_form>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseContract';
  import {getFloat} from '@/utils/util';

  export default {
    name: "other_stock_in",
    components: {
      'other_stock_in_form': () => import('./other_stock_in_form')
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        clientHeight: 300,
        dialogFormVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        currencyOptions: [{
          value: '1',
          label: '人民币'
        }, {
          value: '2',
          label: '加元'
        }, {
          value: '3',
          label: '澳元'
        }],
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value6: '',
        value7: ''
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
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 46;
        }
        this.clientHeight = (document.body.clientHeight - (230 + height)) * 1;
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
                  return getFloat(prev + curr,2);
                } else {
                  return getFloat(prev,2);
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
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      getListByItem() {
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
      handleFilter() {

      },
      handleCreate() {
        this.billNo = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.billNo = '';
        this.dialogFormVisible = false;
      },
      handleReset() {

      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
        });
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.billNo = this.selectedRows[0].billNo;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      }
    }
  }
</script>

<style lang="scss">
  .full-purchase {
    margin: 10px 20px;

    .el-switch {
      float: right;
    }

    .filter-container {
      padding-bottom: 0px;
      ul {
        list-style: none;
        display: block;
        line-height: 40px;
        margin: 0;
        padding: 0;

        li {
          float: left;
          margin-left: 20px;

          svg {
            font-size: 26px;
            margin-right: 8px;
          }
        }
      }

      .query-container {
        font-size: 14px;
        color: #444;
        .block {
          margin-bottom: 10px;
          .demonstration {
            padding-right: 10px;
          }
          .el-date-editor {
            width: 400px;
            margin-right: 15px;
          }
        }
      }
    }
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }
    .el-dialog__body {
      padding-top: 10px;
    }
    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }
    .pagination-container {
      margin-top: 5px;
    }
  }

  .contractDialog {
    .topTable {
      .el-input input.el-input__inner {
        border: none;
        text-align: left;
      }
      .el-textarea__inner {
        border: none;
        resize: none;
        padding: 10px 15px;
      }
      .el-form-item__content {
        width: 100%;
      }
      .el-form-item--medium .el-form-item__label {
        line-height: 40px;
        color: #444;
        width: 95px;
      }
    }
    .tb-edit {
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
      td {
        .cell {
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding: 0px;
          text-align: center;
          background-color: #fff;
        }
        .el-input, el-select {
          width: 100%;
          height: 40px;
        }
        .el-input--mini .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }
        .el-select--small .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }
        .readonly-el-input {
          background-color: rgba(247, 247, 247, 0.5);
          .el-input__inner {
            background-color: rgba(247, 247, 247, 0.5);
          }
        }
        .right-el-input {
          .el-input__inner {
            text-align: right;
          }
        }
        .center-el-input {
          .el-input__inner {
            text-align: center;
          }
        }
      }
    }
  }

  .goodsDialog > .el-dialog {
    margin-top: 0vh !important;
    margin-bottom: 0vh !important;
    height: 100vh;
  }

  .goodsDialog > .el-dialog > .el-dialog__header {
    position: absolute;
    height: 50px;
    width: 100%;
  }

  .goodsDialog > .el-dialog > .el-dialog__body {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 50px 20px 60px 20px;
    display: flex;
  }

  .goodsDialog > .el-dialog > .el-dialog__footer {
    position: absolute;
    width: 100%;
    height: 60px;
    bottom: 0px;
    background-color: #fff;
  }
</style>
