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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="登记人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="登记人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="账户"
                  v-model="listQuery.accountCode"
                  v-if="choose"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="操作员工号"
                  v-model="listQuery.salerCode"
                  v-if="choose"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker
          style="position: relative;top: -4px;"
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="单据开始日期"
          end-placeholder="单据结束日期"
          :default-time="['00:00:00', '23:59:59']"
          @change="handleBillDateSelect"
          value-format="yyyy-MM-dd"
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
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" align="center" width="60">
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
      <el-table-column prop="crtUserName" label="登记人" align="center" width="150">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="登记人工号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="accountCode" label="账户" align="center" width="120">
      </el-table-column>
      <el-table-column prop="accountName" label="账户名称" align="center" width="120">
      </el-table-column>
      <el-table-column prop="subjectCode" label="科目编号" align="center" width="120">
      </el-table-column>
      <el-table-column prop="subjectName" label="科目名称" align="center" width="120">
      </el-table-column>
      <el-table-column prop="salerName" label="操作员" align="center" width="100">
      </el-table-column>
      <el-table-column prop="salerCode" label="操作员工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="salerDepartName" label="操作员部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="userName" label="报销人" align="center" width="150">
      </el-table-column>
      <el-table-column prop="userDepartName" label="报销部门" width="150" align="center">
      </el-table-column>
      <el-table-column prop="registerAmount" label="登记金额" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.registerAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="单据日期" align="center" width="150">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
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
      <el-table-column prop="crtUserName" label="登记人" align="center">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="登记人工号" align="center">
      </el-table-column>
      <el-table-column prop="registerType" label="登记类型" align="center">
        <template slot-scope="scope">
          <div v-for="item in registerTypeOptions" v-if="registerTypeOptions.length>0">
            <span v-if="item.value==scope.row.registerType">{{item.labelDefault}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="makeAccountType" label="做账类型" align="center">
        <template slot-scope="scope">
          <div v-for="item in makeAccountTypeOptions" v-if="makeAccountTypeOptions.length>0">
            <span v-if="item.value==scope.row.makeAccountType">{{item.labelDefault}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" align="center">
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
    <financial-fee-register-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                 :makeAccountTypeOptions="makeAccountTypeOptions"
                                 :registerTypeOptions="registerTypeOptions"
                                 @submitSuccess="submitSuccess" @handleClose="handleClose">
    </financial-fee-register-form>

    <!-- 详情弹窗 -->
    <financial-fee-register-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </financial-fee-register-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/feeRegisterService';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "financialFeeRegister",
    components: {
      'financial-fee-register-form': () => import('./financialFeeRegisterForm'),
      'financial-fee-register-view': () => import('./financialFeeRegisterView')
    },
    data() {
      return {
        list: [],
        makeAccountTypeOptions: [],
        registerTypeOptions: [],
        total: undefined,
        downloadLoading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          accountCode: undefined,
          salerCode: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        billDate: false,
        choose: false,
        selectedRows: [],
      };
    },
    created() {
      getTypeValue('comm_tmp_make_account_type').then(response => {
        this.makeAccountTypeOptions = response.data.rows;
      });
      getTypeValue('comm_tmp_register_type').then(response => {
        this.registerTypeOptions = response.data.rows;
      });

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
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          var list = [];
          this.list = response.data.records;
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
        this.list = this.list == undefined || this.list == null ? [] : this.list;
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
      getSummaries(param) {
        return this.getSummariesMethod(param, ['registerAmount'],4);
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
          limit: 20
        };
        this.billDate = undefined;
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      }
    },
    watch: {
      billDate(value) {
        if (!value) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    }
  }
</script>
