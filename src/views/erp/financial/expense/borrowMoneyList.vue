<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联客户"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="借款人"
                  v-model="listQuery.userName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="query-container">
        <div class="block">
          <el-date-picker
            v-model="borrowMoneyDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="借款开始日期"
            end-placeholder="借款结束日期"
            @change="handleBorrowMoneyDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
      <el-button type="text" id="import_bill" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading"  @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="审批状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" align="center">
      </el-table-column>
      <el-table-column prop="borrowMoneyDate" label="借款日期" align="center">
      </el-table-column>
      <el-table-column prop="userName" label="借款人" align="center">
      </el-table-column>
      <el-table-column prop="payOrgName" label="费用承担部门" align="center">
      </el-table-column>
      <el-table-column prop="currencyId" label="币别" align="center">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="借款金额" width="120" align="right"  class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="借款事由">
      </el-table-column>
      <el-table-column prop="customerName" label="关联客户">
      </el-table-column>
      <el-table-column prop="supplierName" label="关联供应商">
      </el-table-column>
      <el-table-column prop="voucherStatus" label="记账状态" align="center">
      </el-table-column>
      <el-table-column prop="isAfr" label="是否报销" align="center">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增借款单弹窗 -->
    <borrow-money-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                       @submitSuccess="submitSuccess" @handleClose="handleClose"
                       :typeOptions="typeOptions">
    </borrow-money-form>

    <!-- 借款单详情弹窗 -->
    <borrow-money-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                       @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                       :typeOptions="typeOptions">
    </borrow-money-view>


  </div>
</template>

<script>
  import {selectPage, batchDelBill} from '@/api/erp/financial/financialBorrowMoney';
  import {getFloat} from '@/utils/util';

  export default {
    name: "borrowMoneyList",
    components: {
      'borrow-money-form': () => import('./borrowMoneyForm'),
      'borrow-money-view': () => import('./borrowMoneyView')
    },
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
          customerName: undefined,
          supplierName: undefined,
          userName: undefined,
          startBorrowMoneyDate: undefined,
          endBorrowMoneyDate: undefined,
          selectType: 0  //0代表查询所有状态的单据
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        borrowMoneyDate: undefined,
        typeOptions: [{
          value: '0',
          label: '员工'
        }, {
          value: '1',
          label: '客户'
        }, {
          value: '2',
          label: '供应商'
        }],
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
            delete list[i].mainDTO;
          }
          tHeader = ['单据日期', '借款日期', '单据编号', '借款人','费用承担部门','币别','借款金额','借款事由','关联客户','关联供应商','审批状态','记账状态','是否报销'];
          filterVal = ['billDate', 'borrowMoneyDate', 'billNo', 'userName', 'payOrgName', 'currencyId','amount','note','customerName','supplierName','billStatus','voucherStatus','isAfr'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '费用申请单');
          this.downloadLoading = false;
        })
      },
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
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
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
            if (column.property == 'amount') {
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
        this.listQuery.page = 1;
        this.getList();
      },
      handleCreate() {
        this.id = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20,
          selectType: 0
        };
        this.borrowMoneyDate = undefined;
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
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1]);
        }
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
        this.id = this.selectedRows[0].id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      },
      handleDetailOpen(row) {
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        this.getList();
      },
      handleBorrowMoneyDateSelect(val) {
        this.listQuery.startBorrowMoneyDate = val[0];
        this.listQuery.endBorrowMoneyDate = val[1];
      },
      handleOpenDetailOrForm(row) {
        var billStatus;
        if (row.billStatus) {
          billStatus = row.billStatus;
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
          }
        }
        if (billStatus && billStatus == 1) {
          this.id = row.id;
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
        }
      }
    },
    watch: {
      borrowMoneyDate(value) {
        if (value == null) {
          this.listQuery.startBorrowMoneyDate = undefined;
          this.listQuery.endBorrowMoneyDate = undefined;
        }
      }
    }
  }
</script>
