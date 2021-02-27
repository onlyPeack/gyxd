<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="划入员工"
                  v-model="listQuery.transferIn"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="划出员工"
                  v-model="listQuery.transferOut"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="划拨类型"
                  v-model="listQuery.subjectName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="备注"
                  v-model="listQuery.note"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="付款开始日期"
                        end-placeholder="付款结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleBillDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
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
      <el-button type="text" id="export_bill" v-if="false" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              show-summary :summary-method="getSummaries"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" min-width="200">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="150">
      </el-table-column>
      <el-table-column prop="transferMoney" label="划拨金额" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferMoney.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferIn" label="划入员工" align="center" width="100">
      </el-table-column>
      <el-table-column prop="transferIn" label="划入账户类型" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.accountInType">{{scope.row.accountInType == 'A'?'利润账户':'可用资金'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferOut" label="划出员工" align="center" width="100">
      </el-table-column>
      <el-table-column prop="transferOut" label="划出账户类型" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.accountOutType">{{scope.row.accountOutType == 'A'?'利润账户':'可用资金'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="subjectNo" label="科目编号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="subjectName" label="划拨类型" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="单据日期" width="150" align="center" sortable>
        <template slot-scope="scope">
          {{$moment(scope.row.mainDTO.billDate).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="180">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="180" sortable  align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="180" sortable  align="center">
      </el-table-column>
      <el-table-column prop="departName" label="部门" width="180" sortable  align="center">
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" width="180" sortable  align="center">
        <template slot-scope="scope">
          {{$moment(scope.row.billDate).format('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
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

    <!-- 新增弹窗 -->
    <expense-transfer-batch-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                 @submitSuccess="submitSuccess" @handleClose="handleClose">
    </expense-transfer-batch-form>

    <!-- 详情弹窗 -->
    <expense-transfer-batch-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </expense-transfer-batch-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/expenseTransferBatch';

  export default {
    name: "expenseTransferBatch",
    components: {
      'expense-transfer-batch-form': () => import('./expenseTransferBatchForm'),
      'expense-transfer-batch-view': () => import('./expenseTransferBatchView')
    },
    data() {
      return {
        list: [],
        total: undefined,
        downloadLoading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          billStatus: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
          transferIn: undefined,
          transferOut: undefined,
          subjectName: undefined,
          startDate:undefined,
          endDate:undefined,
          note: undefined,
          selectType: 0  //0代表查询所有状态的单据
        },
        billDate: undefined,
        paymentsMeansOptions: [],
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
      };
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
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
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 46;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['transferMoney'])
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          var list = [];
          response.data.records.forEach(function (item) {
            item.attachment = JSON.parse(item.attachment);
            var attachmentName = [];
            for (var i in item.attachment) {
              attachmentName.push(item.attachment[i].name);
            }
            item.attachmentName = attachmentName.join(',');
            list.push(item);
          });
          this.list = list;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          if (this.choose == true) {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据日期', '单据编号', '附件', '单据状态', '划拨金额', '划入员工', '划入部门', '划出员工', '划出部门', '科目编码', '划拨类型', '备注'];
            filterVal = ['billDate', 'billNo', 'attachment', 'billStatus', 'transferMoney', 'transferIn', 'transferInOffice', 'transferOut', 'transferOutOffice', 'subjectNo', 'subjectName', 'note'];
          } else {
            tHeader = ['单据日期', '单据编号', '附件', '单据状态', '备注'];
            filterVal = ['billDate', 'billNo', 'attachmentName', 'billStatus', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '批量费用划拨');
          this.downloadLoading = false;
        })
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
        this.listLoading = true;
        this.listQuery.page = 1;
        if (this.choose == true) {
          this.getListByItem();
        } else {
          this.getList();
        }
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
          this.listQuery.subjectName = undefined;
          this.listQuery.note = undefined;
          this.listQuery.transferIn = undefined;
          this.listQuery.transferOut = undefined;
          this.listQuery.crtUserNo = undefined;
          this.listQuery.crtUserName = undefined;
          this.listQuery.billStatus = undefined;
          this.listQuery.billNo = undefined;
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
          this.listQuery.departName = undefined;
          this.billDate = undefined;
          this.listQuery.selectType = 0;
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
                this.getListByItem();
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
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleChangeFun(val) {
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
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.mainDTO.id;//详情
        }
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
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
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.mainDTO.id;//详情
          }
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
        }
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
    }
  }
</script>
