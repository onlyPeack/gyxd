<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
      <div class="query-container">
        <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
      </div>
        <div class="block">
          <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
            </div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="关联单据"
                    v-model="listQuery.sourceBillNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker
            style="top:-4px;width: 403px"
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
      <el-button type="text" id="export_bill" :loading="downloadLoading" @click="handleDownload">
        <svg-icon icon-class="export" style="margin-right: 3px;"></svg-icon>
        导出
      </el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
       <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
        <el-table-column prop="skuName" label="名称" width="160">
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" width="160">
        </el-table-column>
        <el-table-column prop="seriesName" label="系列" width="160">
        </el-table-column>
        <el-table-column prop="specifications" label="规格型号" width="240">
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="240">
        </el-table-column>
        <el-table-column prop="batchNumber" label="入库单号" width="220">
        </el-table-column>
        <el-table-column prop="qty" label="可取消数量" width="160" class-name="col-required">
        </el-table-column>
        <el-table-column prop="cancelQty" label="取消数量" width="160" class-name="col-required">
        </el-table-column>
        <el-table-column prop="positionName" label="仓位名称" width="160">
        </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" width="180">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="关联单据" align="center" width="200">
      </el-table-column>
      <el-table-column prop="warehouseName" label="入库仓库" align="center" width="120">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="150">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="150">
      </el-table-column>
      <el-table-column prop="departName" label="部门" align="center" width="150">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商"  width="180">
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码"  width="120">
      </el-table-column>
      <el-table-column label="币别" align="center" width="100">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="invoiceStatus" label="开票状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in invoiceStatusOptions">
            <span v-if="item.value==scope.row.invoiceStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="voucherStatus" label="记账状态" width="80">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="printCount" label="打印次数" width="80">-->
      <!--</el-table-column>-->
      <el-table-column prop="billDate" label="单据日期" align="center" width="150">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增采购入库弹窗 -->
    <purchase_stock_in_cancel_form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                            @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase_stock_in_cancel_form>

    <!-- 采购入库详情弹窗 -->
    <purchase_stock_in_cancel_view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                            @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </purchase_stock_in_cancel_view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/wms/bill/purchaseStockInCancel';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchase_stock_in",
    components: {
      'purchase_stock_in_cancel_form': () => import('./purchase_stock_in_cancel_form'),
      'purchase_stock_in_cancel_view': () => import('./purchase_stock_in_cancel_view')
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: '',
          crtUserName: '',
          supplierName: '',
          purchaserName: '',
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          startBillDate: '',
          endBillDate: '',
          billStatus: '',
          crtUserNo: '',
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
        billDate: '',
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          if (this.choose == false) {
            tHeader = ['单据日期', '单据编号', '制单人', '采购员', '供应商', '币别', '金额', '价税合计', '关联单据', '入库仓库', '备注', '单据状态', '开票状态', '记账状态', '打印次数'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'billAmount', 'taxBillAmount', 'sourceBillNo', 'warehouseName', 'note', 'billStatus', 'invoiceStatus', 'voucherStatus', 'printCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据日期', '单据编号', '制单人', '采购员', '供应商', '币别', '金额', '价税合计', '关联单据', '入库仓库', '仓位', '备注', '单据状态', '开票状态', '记账状态', '商品编码', '商品名称', '数量', '单位', '单价', '金额', '税额', '含税单价', '价税合计', '备注', '开票数量', '打印次数'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'billAmount', 'taxBillAmount', 'sourceBillNo', 'warehouseName', 'positionName', 'note', 'billStatus', 'invoiceStatus', 'voucherStatus', 'skuNo', 'skuName', 'qty', 'unit', 'price', 'billAmount', 'tax', 'taxPrice', 'taxBillAmount', 'itemNote', 'purchaseInvoiceQty', 'printCount'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购入库单');
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
          height = 38;
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
            if (column.property == 'contractAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount'
              || column.property == 'billAmount' || column.property == 'taxBillAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 2);
                } else {
                  return getFloat(prev, 2);
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
        this.listLoading = true;
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
        }
        this.billDate = ''
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.masterId;//详情
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
            this.id = row.masterId;//详情
          }
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
          this.listQuery.startBillDate = '';
          this.listQuery.endBillDate = '';
        }
      },
    }
  }
</script>
