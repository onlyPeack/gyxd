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
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="billDate"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="单据日期"
                        end-placeholder="单据日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
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
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight" show-summary :summary-method="getSummaries"
              v-if="choose" key="dataTable1" class="result-data-table" :default-sort="{prop: 'billDate', order: 'descending'}"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态"  align="center" >
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="draftNo" label="汇票编号" width="150">
      </el-table-column>
      <el-table-column prop="paymentBankFullName" label="付款银行全称" min-width="150">
      </el-table-column>
      <el-table-column prop="amt" label="出票金额" min-width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.amt).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="expenditureExpireDate" label="汇票到期日" width="120" align="center">
      </el-table-column>
      <el-table-column prop="expenditureDate" label="原支出时间" width="120" align="center">
      </el-table-column>
      <el-table-column prop="monthRate" label="月利率" width="80" align="right" class-name="col-required">
      </el-table-column>
      <el-table-column prop="newMonthRate" label="新月利率" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="fee" label="手续费" align="right" width="80" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.fee).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="贴息额" class-name="col-required" width="80">
        <template slot-scope="scope">
          {{Number(scope.row.discount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="toStaff" label="入到款员工" width="140">
      </el-table-column>
      <el-table-column prop="customerCode" label="入到款客户" width="100" align="center">
      </el-table-column>
      <el-table-column prop="backDate" label="退回时间" align="center" width="120">
      </el-table-column>
      <el-table-column prop="expenditureType" label="原支出类型" width="100">
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="原支出单号" width="180" align="center">
      </el-table-column>
      <el-table-column prop="registerBillNo" label="原登记单号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" width="140" align="center" sortable>
      </el-table-column>
    </el-table>

    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini" show-summary :summary-method="getSummaries"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table" :default-sort="{prop: 'billDate', order: 'descending'}"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center"  sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="backType" label="退回类型" align="center">
      </el-table-column>
      <el-table-column prop="customerCode" label="原到款客户编号" align="center">
      </el-table-column>
      <el-table-column prop="customerName" label="原到款客户名称" >
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" sortable>
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

    <!--承兑退回单弹窗-->
    <acceptance-expenditure-back-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
    @submitSuccess="submitSuccess" @handleClose="handleClose" :typeOptions="typeOptions">
    </acceptance-expenditure-back-form>

    <!--承兑退回单详情弹窗-->
    <acceptance-expenditure-back-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
    @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
    :typeOptions="typeOptions">
    </acceptance-expenditure-back-view>


  </div>
</template>

<script>

  import  {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/acceptanceExpenditureBack';
  import {getFloat} from '@/utils/util';

  export default {
    name: "AcceptanceExpenditureBackList",
    components: {
      'acceptance-expenditure-back-form':  () => import( './AcceptanceExpenditureBackForm.vue'),
      'acceptance-expenditure-back-view':  () => import( './AcceptanceExpenditureBackView.vue'),
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
          billStatus: undefined,
          crtUserName:undefined,
          crtUserNo:undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          billNo: undefined,//0代表查询所有状态的单据
        },
        billDate: undefined,
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        typeOptions: [{
          value: '0',
          label: '贴现'
        }, {
          value: '1',
          label: '汇票找零'
        }, {
          value: '2',
          label: '退承兑汇票'
        }, {
          value: '3',
          label: '背书转让'
        }],
        deliverDate: undefined,
        selectType: 0  //0代表查询所有状态的单据
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
    watch: {
      billDate(value) {
        if (!value) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    },
    methods: {
      getSummaries(param){
        return this.getSummariesMethod(param,['amt','monthRate','newMonthRate','fee']);
      },
      handleDateSelect(val) {
        this.listQuery. startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      queryVisibleChange() {
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
            tHeader = ['单据日期', '单据编号', '客户名称', '仓库名称', '制单人', '申请类型', '单据状态', '商品编码', '商品名称', '订货号', '规格型号', '可用数量', '申请数量', '已采购数量', '已入库数量', '已出库数量', '面价', '发布单价', '调拨价', '调拨折扣', '单位', '订货单编号', '备注'];
            filterVal = ['billDate', 'billNo', 'customerName', 'warehouseName', 'crtUserName', 'type', 'billStatus', 'skuNo', 'skuName', 'itemNo', 'specifications', 'releaseQty', 'applyQty', 'purchasedQty', 'stockInQty', 'stockOutQty', 'retailPrice', 'releasePrice', 'transferPrice', 'transferDiscount', 'unit', 'salesOrderBillNo', 'note'];
          } else {
            tHeader = ['单据日期', '单据编号', '客户名称', '仓库名称', '制单人', '申请类型', '单据状态', '备注'];
            filterVal = ['billDate', 'billNo', 'customerName', 'warehouseName', 'crtUserName', 'type', 'billStatus', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购申请单');
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
        if (this.choose == true) {
          this.listQuery.page = 1;
          this.getListByItem();
        } else {
          this.listQuery.page = 1;
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
        this.listQuery.billStatus = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.startBillDate = undefined;
        this.listQuery.endBillDate = undefined;
        this.billDate = undefined;
        this.listQuery.billNo = undefined;
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
        //this.controlButtonShow(row);
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
      handleSwitch() {
        this.listQuery.page = 1;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
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
        if (billStatus && billStatus == '1') {
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.id;//详情
          }
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
        }
      }
    }
  }
</script>
