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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调出仓库"
                  v-model="listQuery.warehouseOutName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="调入仓库"
                  v-model="listQuery.warehouseInName"
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
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
      </div>
        <div class="block">
          <el-date-picker
            v-model="billDate"
            type="daterange"
            align="right"
            style="width: 403px"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="单据开始日期"
            end-placeholder="单据结束日期"
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
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight" :default-sort="{prop: 'mainDTO.billDate', order: 'descending'}"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" width="150" align="center" sortable>
        <template slot-scope="scope">
          <div v-if="scope.row.mainDTO" class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="调拨类型"  align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in typeOptions">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.type">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseOutName" label="调出仓库" align="center" width="180">
      </el-table-column>
      <el-table-column prop="positionOutName" label="调出仓位" align="center"  width="180">
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseInName" label="调入仓库" align="center"  width="180">
      </el-table-column>
      <el-table-column prop="positionInName" label="调入仓位" align="center"  width="180">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="180">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center" width="100">
      </el-table-column>
      <el-table-column prop="outUnitCost" label="出库单位成本" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="outCostAmt" label="出库成本" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="differencePrice" label="调拨差价" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="inUnitCost" label="入库单位成本" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="inCostAmt" label="入库成本" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="mainDTO.printCount" label="打印次数" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.billDate" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight" :default-sort="{prop: 'billDate', order: 'descending'}"
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
      <el-table-column prop="billStatus" label="单据状态" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人" align="center">
      </el-table-column>
      <el-table-column prop="type" label="调拨类型" align="center">
        <template slot-scope="scope">
          <div v-for="item in typeOptions">
            <span v-if="item.value==scope.row.type">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseOutName" label="调出仓库" align="center">
      </el-table-column>
      <el-table-column prop="warehouseInName" label="调入仓库" align="center">
      </el-table-column>
      <el-table-column prop="printCount" label="打印次数" align="right">
      </el-table-column>
      <el-table-column prop="billDate" label="单据日期" align="center" sortable>
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

    <!-- 新增商品调拨弹窗 -->
    <allocation-stock-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                           @submitSuccess="submitSuccess" @handleClose="handleClose" :typeOptions="typeOptions">
    </allocation-stock-form>

    <!-- 商品调拨详情弹窗 -->
    <allocation-stock-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                           @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                           :typeOptions="typeOptions">
    </allocation-stock-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/wms/bill/allocationStock';
  import {getFloat} from '@/utils/util';

  export default {
    name: "allocation_stock_list",
    components: {
      'allocation-stock-form': () => import('./allocation_stock_form'),
      'allocation-stock-view': () => import('./allocation_stock_view')
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
          warehouseOutName: undefined,
          warehouseInName: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          crtUserNo: undefined,
          brandName: undefined,
          seriesName: undefined,
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
        typeOptions: [{
          value: '0',
          label: '同价调拨'
        }, {
          value: '1',
          label: '异价调拨'
        }]
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
            tHeader = ['单据日期', '调拨类型', '单据编号', '制单人', '调出仓库', '调入仓库', '单据状态', '打印次数'];
            filterVal = ['billDate', 'type', 'billNo', 'crtUserName', 'warehouseOutName', 'warehouseInName', 'billStatus', 'printCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据日期', '调拨类型', '单据编号', '制单人', '调出仓库', '调出仓位', '调入仓库', '调入仓位', '单据状态', '商品编码', '商品名称', '单位', '出库单位成本', '出库成本', '调拨差价', '入库单位成本', '入库成本', '打印次数'];
            filterVal = ['billDate', 'type', 'billNo', 'crtUserName', 'warehouseOutName', 'positionOutName', 'warehouseInName', 'positionInName', 'billStatus', 'skuNo', 'skuName', 'unit', 'outUnitCost', 'outCostAmt', 'differencePrice', 'inUnitCost', 'inCostAmt', 'printCount'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '商品调拨单');
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
            if (column.property == 'outUnitCost' || column.property == 'outCostAmt'
              || column.property == 'inUnitCost' || column.property == 'inCostAmt') {
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
          selectType: 0,
          billNo: undefined,
          crtUserName: undefined,
          warehouseOutName: undefined,
          warehouseInName: undefined,
          billStatus: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          crtUserNo: undefined,
          brandName: undefined,
          seriesName: undefined,
        };
        this.billDate = null;
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
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
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
