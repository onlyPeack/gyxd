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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="发票号码"
                  v-model="listQuery.invoiceNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
      </div>
      <div class="query-container">
        <div class="block">
          <el-date-picker style="position: relative;top:-4px;"
                          v-model="billDate"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="至"
                          start-placeholder="开票开始日期"
                          end-placeholder="开票结束日期"
                          @change="handleBillDateSelect"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerOptions">
          </el-date-picker>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
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
          <el-button class="filter-item" type="primary" @click="handleFilter" icon="el-icon-search">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        </div>
        </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleEdit" v-if="btnStatus.edit">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" v-if="btnStatus.del">删除</el-button>
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
              @row-dblclick="handleOpenDetailOrForm" :default-sort = "{prop: 'billNo', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" min-width="180" sortable>
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
      <el-table-column prop="crtUserNo" label="采购员工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" label="采购员姓名" align="center" width="100">
      </el-table-column>
      <el-table-column prop="departName" label="采购员部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierName" label="供应商" width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierCode" label="供应商编码" width="150">
      </el-table-column>
      <el-table-column prop="invoiceCode" label="发票代码" align="center" width="180">
      </el-table-column>
      <el-table-column prop="invoiceNo" label="发票号码" align="center" width="180">
      </el-table-column>
      <el-table-column prop="invoiceAmount" label="到票金额" align="right" width="180" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.invoiceAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="notTaxPrice" label="不含税金额" align="right" width="180" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.notTaxPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxRate" label="税率" align="center" width="180">
      </el-table-column>
      <el-table-column prop="taxPrice" label="税额" align="center" width="180">
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.taxAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="notCancelAmount" label="未核销金额" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.notCancelAmount).toFixed(4)}}
        </template>
      </el-table-column>
       <el-table-column prop="mainDTO.billDate" label="开票日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.printCount" label="打印次数" align="right" width="100">
      </el-table-column>
      <el-table-column prop="note" label="备注" width="104">
      </el-table-column>

    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort = "{prop: 'billNo', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" align="center" width="150" sortable>
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
      <el-table-column prop="invoiceType" label="发票类型" align="center" width="150">
        <template slot-scope="scope">
          <span v-for="item in invoiceTypeOptions">
            <span v-if="scope.row.invoiceType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="buyer" label="采购员" align="center">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="制单人部门" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商">
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商编码">
      </el-table-column>
      <el-table-column prop="invoiceAmount" label="票面金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.invoiceAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.taxAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="notCancelAmount" label="未核销金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.notCancelAmount).toFixed(4)}}
        </template>
      </el-table-column> -->
      <el-table-column prop="billDate" label="开票日期" align="center" width="150" sortable>
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

    <!-- 新增采购发票弹窗 -->
    <purchase-invoice-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                           @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase-invoice-form>

    <!-- 采购发票详情弹窗 -->
    <purchase-invoice-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                           @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose" @handleUpdate="handleUpdate">
    </purchase-invoice-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/financial/financialPurchaseInvoice';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseInvoiceList",
    components: {
      'purchase-invoice-form': () => import('./purchaseInvoiceForm'),
      'purchase-invoice-view': () => import('./purchaseInvoiceView')
    },
    data() {
      return {
        downloadLoading: false,
        btnStatus: {
          del: true,
          add: true,
          edit: true,
          export: true
        },
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          supplierName: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          invoiceNo: undefined,
          crtUserNo: undefined,
          billStatus: undefined,
          departName: undefined,
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
        this.downloadLoading = true;
        var list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          console.log('引入成功');
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.list));
          console.log('list');
          console.log(list);
          if (this.choose == false) {
            tHeader = ['单据编号', '单据状态', '发票类型', '采购员', '制单人工号', '制单人', '制单人部门', '供应商', '供应商编码','价税合计',];
            filterVal = ['billNo', 'billStatus', 'invoiceType', 'buyer', 'crtUserNo', 'crtUserName', 'departName', 'supplierName', 'supplierCode','taxAmount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据编号', '单据状态','采购员工号','采购员姓名','采购员部门','供应商','供应商编码','发票代码','发票号码','到票金额','不含税金额','税率','税额','价税合计','开票日期','打印次数', '备注'];
            filterVal = ['billNo','billStatus','crtUserNo','crtUserName','departName','supplierName','supplierCode','invoiceCode','invoiceNo','invoiceAmount','notTaxPrice','taxRate','taxPrice','taxAmount','billDate','printCount', 'note'   ];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购发票');
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
            if (column.property == 'notTaxPrice' | column.property == 'notCancelAmount' || column.property == 'invoiceAmount' || column.property == 'amount'
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
        this.listQuery.billStatus = undefined,
        this.listQuery.crtUserNo = undefined,
        this.listQuery.crtUserName = undefined,
        this.listQuery.supplierName = undefined,
        this.listQuery.invoiceNo = undefined,
        this.listQuery.skuNo = undefined,
        this.listQuery.skuName = undefined,
        this.listQuery.specifications = undefined,
        this.billDate = undefined,
        this.listQuery.departName = undefined
        this.handleFilter()
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
      handleEdit() {
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
        // if (!this.choose) {
        //   this.id = row.id;
        // } else {
        //   this.id = row.mainDTO.id;//详情
        // }
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      handleUpdate() {
        this.id = '';
        this.dialogDetailVisible = false;
        if(!!this.choose) {
          this.getListByItem()
        } else {
          this.getList()
        }
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
