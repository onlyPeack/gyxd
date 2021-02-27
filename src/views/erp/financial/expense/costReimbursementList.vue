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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联客户"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="报销人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="报销人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="费用承担部门"
                  v-model="listQuery.payOrgName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="query-container">
          <el-date-picker
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
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort = "{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.customerName" label="关联客户" align="center" width="180">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="报销人工号" align="center" width="120">
      </el-table-column>
      <el-table-column prop="crtUserName" label="报销人" align="center" width="120">
      </el-table-column>
      <el-table-column prop="mainDTO.payOrgName" label="费用承担部门" align="center" width="120">
      </el-table-column>
      <el-table-column prop="mainDTO.depositBank" label="开户行" align="center" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.depositName" label="开户名" align="center" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.bankAccount" label="账户号" align="center" width="150">
      </el-table-column>
      <!--<el-table-column prop="mainDTO.payOrgName" label="费用承担部门">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="voucherStatus" label="记账状态">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="mainDTO.printCount" label="打印次数" align="right">-->
      <!--</el-table-column>-->
      <el-table-column prop="type" label="报销类型" width="100" align="center">
        <template slot-scope="scope" v-if="scope.row">
          <div v-for="(item,index) in typeOptions" :key="index">
            <span v-if="item.value==scope.row.type">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="accountCode" label="承担账户" align="center" width="100">
      </el-table-column>
      <el-table-column prop="message" label="用途"  width="150">
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="startDate" label="起始时间">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="endDate" label="终止时间">-->
      <!--</el-table-column>-->
      <el-table-column prop="note" label="备注" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="报销日期" align="center" sortable width="150">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort = "{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="关联客户" align="center" width="180">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="报销人工号" align="center" width="120">
      </el-table-column>
      <el-table-column prop="crtUserName" label="报销人" align="center" width="120">
      </el-table-column>
      <el-table-column prop="payOrgName" label="费用承担部门" align="center" width="120">
      </el-table-column>
      <el-table-column prop="depositBank" label="开户行" align="center" width="150">
      </el-table-column>
      <el-table-column prop="depositName" label="开户名" align="center" width="150">
      </el-table-column>
      <el-table-column prop="bankAccount" label="银行账户" align="center" width="150">
      </el-table-column>
      <el-table-column prop="amount" label="报销金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.amount.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="报销事由" width="150">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150">
      </el-table-column>
      <el-table-column prop="billDate" label="报销日期" align="center" sortable width="150">
      </el-table-column>
      <!--<el-table-column prop="payOrgName" label="费用承担部门">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="voucherStatus" label="记账状态">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="printCount" label="打印次数" align="right">-->
      <!--</el-table-column>-->
    </el-table>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增费用报销单弹窗 -->
    <cost-reimbursement-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                             @submitSuccess="submitSuccess" @handleClose="handleClose"
                             :typeOptions="typeOptions">
    </cost-reimbursement-form>

    <!-- 费用报销单详情弹窗 -->
    <cost-reimbursement-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                             @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                             :typeOptions="typeOptions">
    </cost-reimbursement-view>


  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/financiaCostReimbursement';
  import {getFloat} from '@/utils/util';
  import {getTypeValue} from '@/api/dict/dictValue/index';

  export default {
    name: "costReimbursementList",
    components: {
      'cost-reimbursement-form': () => import('./costReimbursementForm'),
      'cost-reimbursement-view': () => import('./costReimbursementView')
    },
    data() {
      return {
        list: [],
        billDate:'',
        downloadLoading:false,
        total: undefined,
        listLoading: true,
        typeOptions:[],
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          customerName: undefined,
          crtUserName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          payOrgName: undefined,
          userCode:undefined,
          selectType: 0  //0代表查询所有状态的单据
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
      };
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
       getTypeValue('root_gxcl_bxtype').then(response => {
        let tempOptions = [];
        response.data.rows.forEach(item => {
          this.typeOptions.push({
            label:item.labelZhCh,
            value:item.value
          })
        })
      });
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
          if (this.choose == false) {
            tHeader = ['报销日期', '单据编号', '申请人', '报销事由', '金额','关联客户','费用承担部门','记账状态','单据状态','打印次数'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'note', 'amount', 'customerName','payOrgName','voucherStatus','billStatus','printCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['报销日期', '单据编号', '申请人', '报销事由','关联客户','费用承担部门','记账状态','单据状态','打印次数','报销类型','用途','金额','起始时间','终止时间'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'note', 'customerName','payOrgName','voucherStatus','billStatus','printCount','type','message','amount','startDate','endDate'];

          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '费用报销单');
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
        this.listQuery = {
          page: 1,
          limit: 10,
          selectType: 0,
          billStatus: undefined,
          userCode: undefined,
          userName: undefined,
          payOrgName: undefined,
          customerName: undefined,
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
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
