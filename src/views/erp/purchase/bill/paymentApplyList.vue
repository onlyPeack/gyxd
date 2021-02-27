<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select style="position: relative;top:-3px;width: 200px;" v-model="listQuery.billStatus" class="input-width"
                   placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-select style="position: relative;top:-3px;width: 200px;" v-model="listQuery.paymentForm" class="input-width"
                   placeholder="付款形式" clearable>
          <el-option v-for="item in paymentOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;"
                   icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
      <div class="query-container">
        <div class="block">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                    v-model="listQuery.supplierCode"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                    v-model="listQuery.supplierName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker style="position: relative;top:-3px;"
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
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" v-if="btnStatus.edit">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" v-if="btnStatus.del">删除</el-button>
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 详情 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose"
              show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="(item,index) in statusOptions" :key="index">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.paymentForm" label="付款形式" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="(item,index) in paymentOptions" :key="index">
            <span v-if="item.value==scope.row.mainDTO.paymentForm">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="申请人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.applicantName" label="申请人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="departName" label="申请人部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierCode" label="供应商编号" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierName" label="供应商" width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.paymentsMeans" label="结算方式" align="center" width="120">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <div v-for="item in paymentsMeansOptions">
            <span v-if="scope.row.mainDTO.paymentsMeans==item.value">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.currencyId" label="币别" align="center" width="80">
        <template slot-scope="scope" v-if="scope.row.mainDTO">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="purchaseAmount" label="采购金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.purchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="thenRefundAmount" label="已退款金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.thenRefundAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.applyAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.bankName" label="开户银行" align="center" width="150">
      </el-table-column>

      <el-table-column prop="mainDTO.bankAccount" label="银行账户" align="center" width="200">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" width="108" sortable>
      </el-table-column>
    </el-table>

    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini" show-summary
              :summary-method="getSummaries"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable1" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column align="center" type="index">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" min-width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope" v-if="scope.row">
          <div v-for="(item,index) in statusOptions" :key="index">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="申请人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="applicantName" label="申请人" align="center" width="100">
      </el-table-column>
      <!-- <el-table-column prop="applicantId" label="申请人ID" align="center" width="100">
      </el-table-column> -->
      <el-table-column prop="departName" label="申请人部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="200">
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" width="100">
      </el-table-column>
      <el-table-column prop="applyAmount" label="申请金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.applyAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="paidAmount" label="已付款金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.paidAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="bankName" label="开户银行" align="center" width="150">
      </el-table-column>
      <el-table-column prop="bankAccount" label="银行账户" align="center" width="200">
      </el-table-column>
      <el-table-column prop="note" label="备注" align="center" width="200">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" width="108" sortable>
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

    <!-- 新增付款申请单弹窗 -->
    <payment-apply-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                        @submitSuccess="submitSuccess" @handleClose="handleClose"
                        :paymentsMeansOptions="paymentsMeansOptions">
    </payment-apply-form>

    <!-- 付款申请单详情弹窗 -->
    <payment-apply-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                        @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                        :paymentsMeansOptions="paymentsMeansOptions">
    </payment-apply-view>


  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/paymentApply';
  import {getFloat} from '@/utils/util';
  import {page as getPaymentsMeans} from '@/api/erp/financial/financialPaymentsMeans';

  export default {
    name: "paymentApplyList",
    components: {
      'payment-apply-form': () => import('./paymentApplyForm'),
      'payment-apply-view': () => import('./paymentApplyView')
    },
    data() {
      return {
        list: [],
        btnStatus: {
          del: true,
          add: true,
          edit: true,
          export: true
        },
        total: undefined,
        downloadLoading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          applicantName: undefined,
          crtUserName: undefined,
          departName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          paymentForm: null,
          crtUserNo: null,
          supplierCode: null,
          supplierName: null,
          billStatus: undefined,
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
        choose: false,
        paymentOptions: [
          {
            label: '直接付款',
            value: '0',
          }, {
            label: '预付款',
            value: '1',
          }
        ],
        billDate: undefined,
        paymentsMeansOptions: [],
      };
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      getPaymentsMeans().then(response => {
        this.paymentsMeansOptions = response.data.records;
      });
      this.getList();
    },
    methods: {
      getList() {
        console.log('列表页');
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
      handleSwitch() {
        this.listQuery.page = 1;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
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
            tHeader = ['单据编号', '单据状态', '申请人工号', '申请人姓名', '申请人部门', '供应商', '供应商编号', '结算方式', '币别', '申请金额', '开户银行', '银行账户', '单据日期'];
            filterVal = ['billNo', 'billStatus', 'crtUserNo', 'applicantName', 'departName', 'supplierName', 'supplierCode', 'paymentsMeans', 'currencyId', 'applyAmount', 'bankName', 'bankAccount', 'crtTime'];
          } else {
            tHeader = ['单据编号', '单据状态', '申请人工号', '申请人姓名', '申请人部门', '供应商', '供应商编号', '申请金额', '开户银行', '银行账户', '备注', '单据日期'];
            filterVal = ['billNo', 'billStatus', 'crtUserNo', 'applicantName', 'departName', 'supplierName', 'supplierCode', 'applyAmount', 'bankName', 'bankAccount', 'note', 'crtTime'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '付款申请单');
          this.downloadLoading = false;
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
            if (column.property == 'applyAmount') {
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
        if (this.choose) {
          this.getListByItem();
        } else {
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        if (this.choose) {
          this.getListByItem();
        } else {
          this.getList()
        }
      },
      handleFilter() {
        this.listLoading = true;
        this.listQuery.page = 1;
        if (!!this.choose) {
          this.getListByItem();
        } else {
          this.getList()
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
          billNo: undefined,
          crtUserName: undefined,
          crtUserNo: null,
          billStatus: null,
          applicantName: undefined,
          departName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          selectType: 0,
          paymentForm: null,
          supplierCode: null,
          supplierName: null
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
                if (!!this.choose) {
                  this.getListByItem();
                } else {
                  this.getList()
                }
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
        if (!!this.choose) {
          this.getListByItem();
        } else {
          this.getList()
        }
      },
      handlechangeFun(val) {
        this.btnStatus = {
          del: true,
          add: true,
          edit: true,
          export: true
        }
        if (val.length > 0) {
          for (let i = 0; i <val.length ; i++) {
            if (val[i].billStatus * 1===2||val[i].billStatus * 1===3||val[i].billStatus * 1===4) {
              this.btnStatus.edit=false
              this.btnStatus.del=false
              break
            }
          }

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
        this.handleFilter()
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        this.getListByItem();
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
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
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    }
  }
</script>
