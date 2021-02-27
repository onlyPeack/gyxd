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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="转入账户"
                  v-model="listQuery.transferInAccount"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="单据日期"
                        end-placeholder="单据日期"
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
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" min-width="150">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="审批状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号"  width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="120" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.transferInAccount" label="转入账户" align="center" ></el-table-column>
      <el-table-column prop="mainDTO.makeAccountType" label="做账类型" align="center" ></el-table-column>
      <el-table-column prop="mainDTO.transferType" label="转账方式" align="center" ></el-table-column>
      <el-table-column prop="transferOutAccount" label="转出账户" align="center"></el-table-column>
      <el-table-column prop="transferOutAccountName" label="转出账户名称" align="center"></el-table-column>
      <el-table-column prop="transferOutMoney" label="转出金额" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.transferOutMoney.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.note" label="备注" align="center"></el-table-column>
      <el-table-column prop="transferOutDate" label="转出时间" align="center" width="150"></el-table-column>

    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" align="center" label="单据编号" min-width="100">
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
      <el-table-column prop="crtUserNo" label="制单人工号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" width="120" align="center">
      </el-table-column>
      <el-table-column prop="transferInAccount" label="转入账户" align="center"></el-table-column>
      <el-table-column prop="makeAccountType" label="做账类型" align="center"></el-table-column>
      <el-table-column prop="transferType" label="转账方式" align="center"></el-table-column>
      <el-table-column prop="transferInMoney" label="转入金额" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferInMoney.toFixed(4)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" align="center"></el-table-column>
      <el-table-column prop="billDate" label="单据日期" align="center"></el-table-column>
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
    <account-transfer-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                             @submitSuccess="submitSuccess" @handleClose="handleClose"
                             :typeOptions="typeOptions">
    </account-transfer-form>

    <!-- 费用报销单详情弹窗 -->
    <account-transfer-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                             @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                             :typeOptions="typeOptions">
    </account-transfer-view>


  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/accountTransfer';
  import {getFloat} from '@/utils/util';

  export default {
    name: "costReimbursementList",
    components: {
      'account-transfer-form': () => import('./accountTransferFrom'),
      'account-transfer-view': () => import('./accountTransferView')
    },
    data() {
      return {
        list: [],
        downloadLoading:false,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerName: undefined,
          transferInAccount: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          note: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: undefined,
        typeOptions: [{
          value: '0',
          label: '差旅费'
        }, {
          value: '1',
          label: '办公费'
        }, {
          value: '2',
          label: '招待费'
        }, {
          value: '3',
          label: '市内交通费'
        }, {
          value: '4',
          label: '通讯费'
        }, {
          value: '5',
          label: '培训费'
        }, {
          value: '6',
          label: '贷款'
        }, {
          value: '7',
          label: '采购付款'
        }, {
          value: '8',
          label: '日常费用支付'
        }, {
          value: '9',
          label: '租金支付'
        }, {
          value: '10',
          label: '其他'
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
        // import('@/vendor/Export2Excel').then(excel => {
        //   var tHeader;
        //   var filterVal;
        //   var list = JSON.parse(JSON.stringify(this.list));
        //   for (var i in list) {
        //     Object.assign(list[i], list[i].mainDTO);
        //     delete list[i].mainDTO;
        //   }
        //   if (this.choose == false) {
        //     tHeader = ['报销日期', '单据编号', '申请人', '报销事由', '金额','关联客户','费用承担部门','记账状态','单据状态','打印次数'];
        //     filterVal = ['billDate', 'billNo', 'transferInAccount', 'note', 'amount', 'customerName','payOrgName','voucherStatus','billStatus','printCount'];
        //   } else {
        //     for (var i in list) {
        //       Object.assign(list[i], list[i].mainDTO);
        //       delete list[i].mainDTO;
        //     }
        //     tHeader = ['报销日期', '单据编号', '申请人', '报销事由','关联客户','费用承担部门','记账状态','单据状态','打印次数','报销类型','用途','金额','起始时间','终止时间'];
        //     filterVal = ['billDate', 'billNo', 'transferInAccount', 'note', 'customerName','payOrgName','voucherStatus','billStatus','printCount','type','message','amount','startDate','endDate'];
        //
        //   }
        //   excel.export_json_to_excel2(tHeader, list, filterVal, '费用报销单');
        //   this.downloadLoading = false;
        // })
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
            if (column.property == 'transferInMoney') {
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
          limit: 20,
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
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
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
    }
  }
</script>

