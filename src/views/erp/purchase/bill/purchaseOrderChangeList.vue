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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员"
                  v-model="listQuery.purchaserName"
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
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
      <div class="query-container">
        <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                    v-model="listQuery.rebateSeries"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
      </div>
        <div class="block">
          <el-date-picker
            v-model="billDate"
            type="daterange"
            align="right"
            style="width: 403px;vertical-align: top"
            unlink-panels
            range-separator="至"
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期"
            value-format="yyyy-MM-dd"
            @change="handleBillDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购订单"
                    v-model="listQuery.sourceBillNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <!--<el-date-picker-->
            <!--v-model="billDates"-->
            <!--type="daterange"-->
            <!--align="right"-->
            <!--unlink-panels-->
            <!--range-separator="至"-->
            <!--start-placeholder="交货开始日期"-->
            <!--end-placeholder="交货结束日期"-->
            <!--value-format="yyyy-MM-dd"-->
            <!--@change="handlerDateSelect"-->
            <!--:picker-options="pickerOptions">-->
          <!--</el-date-picker>-->
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
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'carTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" align="center" width="190" sortable>
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
      <el-table-column prop="departName" label="采购员部门" align="center" width="140">
      </el-table-column>
      <el-table-column prop="mainDTO.purchaserName" label="采购员" align="center" width="140">
      </el-table-column>
      <el-table-column prop="mainDTO.supplierName" label="供应商" width="150">
      </el-table-column>
      <el-table-column label="币别" width="80" align="center">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oldPurchaseAmount" label="原总金额" align="right" width="110" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.oldPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="newPurchaseAmount" label="新总金额" align="right" width="110" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.newPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="120">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="120">
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="120">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="120">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="300">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="80">
      </el-table-column>
      <el-table-column prop="qty" label="原数量" align="right" width="80">
      </el-table-column>
      <el-table-column prop="price" label="原单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.price).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="原采购金额" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="newQty" label="新数量" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="newPrice" label="新单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.newPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="newAmount" label="新采购金额" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.newAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.changeReason" label="变更原因" width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries1" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm"  :default-sort="{prop: 'carTime', order: 'descending'}">
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
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="采购员工号" align="center">
      </el-table-column>
      <el-table-column prop="purchaserName" label="采购员" align="center">
      </el-table-column>
      <el-table-column prop="sourceBillNo" label="采购订单" align="center" width="160">
      </el-table-column>
      <el-table-column prop="departName" label="采购员部门" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商">
      </el-table-column>
      <el-table-column label="币别" width="80" align="center">
        <template slot-scope="scope">
            <span v-for="item in currencyOptions">
              <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="oldPurchaseAmount" label="原总金额" align="right" width="120" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.oldPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="newPurchaseAmount" label="新总金额" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.newPurchaseAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="changeReason" label="变更原因">
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" width="150" align="center" sortable>
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

    <!-- 采购订单变更单弹窗 -->
    <purchase-order-change-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase-order-change-form>

    <!-- 采购订单变更单详情弹窗 -->
    <purchase-order-change-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </purchase-order-change-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseOrderChange';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseOrderChangeList",
    components: {
      'purchase-order-change-form': () => import('./purchaseOrderChangeForm'),
      'purchase-order-change-view': () => import('./purchaseOrderChangeView')
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
          purchaserName: undefined,
          supplierName: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          startDate:undefined,
          endDate: undefined,
          departName: undefined,
          crtUserNo: undefined,
          brandName: undefined,
          billStatus: undefined,
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
        billDates:null,
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
      handlerDateSelect(val) {
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
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
            tHeader = ['单据日期', '单据编号', '制单人', '采购员', '供应商', '币别', '原总金额', '新总金额', '单据状态', '商品编码', '商品名称', '订货号', '规格型号', '单位', '原数量', '原单价', '原采购金额', '新数量', '新单价', '新采购金额', '变更原因'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'oldPurchaseAmount', 'newPurchaseAmount', 'billStatus', 'skuNo', 'skuName', 'itemNo', 'specifications', 'unit', 'qty', 'price', 'amount', 'newQty', 'newPrice', 'newAmount', 'changeReason'];
          } else {
            tHeader = ['单据日期', '单据编号', '制单人', '采购员', '供应商', '币别', '原总金额', '新总金额', '单据状态', '变更原因'];
            filterVal = ['billDate', 'billNo', 'crtUserName', 'purchaserName', 'supplierName', 'currencyId', 'oldPurchaseAmount', 'newPurchaseAmount', 'billStatus', 'changeReason'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购订单变更单');
          this.downloadLoading = false;
        })
      },
      getSummaries1(param) {
        return this.getSummariesMethod(param, ['oldPurchaseAmount','newPurchaseAmount'],4);
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
            if ( column.property == 'newQty' || column.property == 'oldPurchaseAmount' || column.property == 'newPurchaseAmount'
              || column.property == 'amount' || column.property == 'newAmount') {
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
          this.list.forEach(item => {
            item.oldPurchaseAmount = item.mainDTO.oldPurchaseAmount,
            item.newPurchaseAmount = item.mainDTO.newPurchaseAmount
          })
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
        this.listQuery.billNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.customerName = undefined;
        this.listQuery.salerName = undefined;
        this.listQuery.skuNo = undefined,
        this.listQuery.skuName = undefined,
        this.listQuery.itemNo = undefined,
        this.listQuery.specifications = undefined,
        this.listQuery.seriesName = undefined,
        this.billDate = undefined;
        this.billDates = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate = undefined;
        this.billDates = undefined;
        this.listQuery.brandName = undefined;
        this.listQuery.departName = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.billStatus = undefined;
        this.listQuery.purchaserName = undefined;
        this.listQuery.supplierName = undefined;
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
      }
    },
    watch: {
      billDates(value) {
        if (value == null) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      },
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
    }
  }
</script>
