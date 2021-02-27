<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订单号"
                  v-model="listQuery.sourceBillNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="发票号码"
                  v-model="listQuery.invoiceNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
      </div>
      <div class="query-container">
        <div>
          <el-date-picker style="position: relative;top:-4px;"
                          v-model="billDate"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开票开始日期"
                          end-placeholder="开票结束日期"
                          value-format="yyyy-MM-dd"
                          @change="handleBillDateSelect"
                          :picker-options="pickerOptions">
          </el-date-picker>
          <el-select style="position: relative;top:-3px;width: 200px;" v-model="listQuery.billStatus"
                     class="input-width" placeholder="单据状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"-->
          <!--v-model="listQuery.skuNo"-->
          <!--@keyup.enter.native="handleFilter">-->
          <!--</el-input>-->
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
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
              :default-sort="{prop: 'mainDTO.billNo', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <!--<el-table-column prop="mainDTO.invoiceNo" label="发票号码" width="180">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="mainDTO.invoiceType" label="发票类型" width="150">-->
      <!--<template slot-scope="scope">-->
      <!--<span v-for="item in invoiceTypeOptions">-->
      <!--<span v-if="scope.row.mainDTO.invoiceType ===item.value">{{item.label}}</span>-->
      <!--</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="mainDTO.invoiceAmount" label="发票金额" align="right" width="120">-->
      <!--</el-table-column>-->
      <el-table-column prop="mainDTO.invoiceNo" label="发票号码" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.customerName" label="客户名称" width="200">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="业务员工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" label="业务员" align="center" width="100">
      </el-table-column>
      <el-table-column prop="departName" label="业务员部门" align="center" width="100">
      </el-table-column>
      <!--<el-table-column prop="mainDTO.voucherStatus" label="记账状态" width="100">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="mainDTO.relatedStatus" label="回款状态" width="100">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="100">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="skuNo" label="商品编码" width="120">-->
      <!--</el-table-column>-->
      <el-table-column prop="sourceBillNo" label="订单号" align="center" width="180"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="200">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="200">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="80">
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="price" label="单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.price).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.tax).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="104">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="开票日期" align="center" width="150" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              :default-sort="{prop: 'billNo', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="120">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceNo" label="发票号码" align="center" width="200">
      </el-table-column>

      <el-table-column prop="invoiceType" label="发票类型" align="center" width="180">
        <template slot-scope="scope">
          <span v-for="item in invoiceTypeOptions">
            <span v-if="scope.row.invoiceType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceAmount" label="发票金额" align="right" width="150" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.invoiceAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="业务员工号" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="业务员" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="业务员部门" align="center">
      </el-table-column>
      <el-table-column prop="billDate" label="开票日期" width="150" align="center" sortable>
      </el-table-column>
      <!--<el-table-column prop="voucherStatus" label="记账状态" width="100">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="relatedStatus" label="回款状态" width="100">-->
      <!--</el-table-column>-->
      <!--<el-table-column prop="printCount" label="打印次数" align="right" width="100">-->
      <!--</el-table-column>-->
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50,500,1000]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增销售发票弹窗 -->
    <sales-invoice-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                        @submitSuccess="submitSuccess" @handleClose="handleClose">
    </sales-invoice-form>

    <!-- 销售发票详情弹窗 -->
    <sales-invoice-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                        @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </sales-invoice-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/financialSalesInvoice';
  import {getFloat} from '@/utils/util';

  export default {
    name: "sales-invoice-list",
    components: {
      'sales-invoice-form': () => import('./sales-invoice-form'),
      'sales-invoice-view': () => import('./sales-invoice-view')
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
          billNo: undefined,
          crtUserName: undefined,
          customerName: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          invoiceNo: undefined,
          crtUserNo: undefined,
          departName: undefined,
          billStatus: undefined,
          itemNo: undefined,
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
        billDate: undefined,
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
        if (this.selectedRows.length < 1) {
          this.$notify.warning('请选择要导出的单据');
          return;
        }

        this.downloadLoading = true;
        var selectedRows = this.selectedRows == undefined || this.selectedRows == null ? [] : this.selectedRows;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(selectedRows));
          if (this.choose == false) {
            tHeader = ['开票日期', '单据编号', '发票号码', '发票类型', '制单人', '客户', '发票金额', '单据状态', '记账状态', '回款状态', '打印次数'];
            filterVal = ['billDate', 'billNo', 'invoiceNo', 'invoiceType', 'crtUserName', 'customerName', 'invoiceAmount', 'billStatus', 'voucherStatus', 'relatedStatus', 'printCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['开票日期', '单据编号', '订单号', '发票号码', '发票类型', '制单人', '客户', '发票金额', '单据状态', '记账状态', '回款状态', '打印次数', '商品编码', '商品名称','品牌','系列', '规格型号','订货号', '单位', '数量', '单价', '金额', '税额', '含税单价', '价税合计', '备注'];
            filterVal = ['billDate', 'billNo', 'sourceBillNo', 'invoiceNo', 'invoiceType', 'crtUserName', 'customerName', 'invoiceAmount', 'billStatus', 'voucherStatus', 'relatedStatus', 'printCount', 'skuNo', 'skuName','brandName','seriesName', 'specifications','itemNo', 'unit', 'qty', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售发票');
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
            if (column.property == 'invoiceAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
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
        this.listQuery.billNo = undefined,
          this.listQuery.crtUserName = undefined,
          this.listQuery.billStatus = undefined,
          this.listQuery.customerName = undefined,
          this.listQuery.skuNo = undefined,
          this.listQuery.skuName = undefined,
          this.listQuery.itemNo = undefined,
          this.listQuery.specifications = undefined,
          this.billDate = undefined,
          this.listQuery.invoiceNo = undefined,
          this.listQuery.crtUserNo = undefined,
          this.listQuery.departName = undefined
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
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
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
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
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
