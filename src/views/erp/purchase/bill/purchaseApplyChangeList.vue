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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  v-model="listQuery.customerCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人姓名"
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
        <div>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="新需求仓库" v-if="choose"
                    v-model="listQuery.newWarehouseName"
                    @keyup.enter.native="handleFilter">
          </el-input>
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
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    v-model="listQuery.seriesName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                    v-model="listQuery.rebateSeries"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <div></div>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker style="position: relative;top:-4px;width: 403px"
                          v-model="crtTime"
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
              v-if="choose" key="dataTable1" class="result-data-table"
              :default-sort="{prop: 'crtTime', order: 'descending'}"
              @row-dblclick="handleOpenDetailOrForm" show-summary :summary-method="getSummaries">
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
      <el-table-column prop="mainDTO.billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.customerCode" label="客户编号" min-width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.customerName" label="客户名称" min-width="150">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="申请人工号" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="crtUserName" label="申请人姓名" align="center" width="180">
      </el-table-column>
      <el-table-column prop="departName" label="申请人部门" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="mainDTO.oldWarehouseName" label="原需求仓库" width="120">
      </el-table-column>
      <el-table-column prop="mainDTO.newWarehouseName" label="新需求仓库" width="120">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" min-width="204">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="204">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="204">
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="204">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="204">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="200">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="75" align="center">
      </el-table-column>
      <el-table-column prop="releaseQty" label="发布数量" align="right" width="120">
      </el-table-column>
      <el-table-column prop="oldApplyQty" label="原申请数量" align="right" width="120">
      </el-table-column>
      <el-table-column prop="newApplyQty" label="新申请数量" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="canChangeQty" label="可变更数量" align="right" width="120">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="发布单价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.releasePrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="调拨价" align="right" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.transferPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="transferDiscount" label="调拨折扣" align="right" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="salesOrderBillNo" label="订货单编号" width="200">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" width="150" align="center" sortable>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
      </el-table-column>
    </el-table>

    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}"
              @row-dblclick="handleOpenDetailOrForm" show-summary :summary-method="getSummaries">
      <el-table-column type="selection" width="60" align="center">
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
      <el-table-column prop="billStatus" label="单据状态" align="center" width="100">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" min-width="150">
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" min-width="150">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="申请人工号" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="crtUserName" label="申请人姓名" align="center" width="180">
      </el-table-column>
      <el-table-column prop="departName" label="申请人部门" align="center" min-width="150">
      </el-table-column>
      <el-table-column prop="oldWarehouseName" label="原需求仓库" width="120">
      </el-table-column>
      <el-table-column prop="newWarehouseName" label="新需求仓库" width="120">
      </el-table-column>
      <el-table-column prop="crtTime" label="单据日期" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
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

    <!-- 新增采购申请变更单弹窗 -->
    <purchase-apply-change-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase-apply-change-form>

    <!-- 采购申请变更单详情弹窗 -->
    <purchase-apply-change-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </purchase-apply-change-view>


  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseApplyChange';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseApplyChangeList",
    components: {
      'purchase-apply-change-form': () => import('./purchaseApplyChangeForm'),
      'purchase-apply-change-view': () => import('./purchaseApplyChangeView')
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
          crtUserName: undefined,
          skuNo: undefined,
          itemNo: undefined,
          skuName: undefined,
          seriesName: undefined,
          specifications: undefined,
          customerCode: undefined,
          customerName: undefined,
          newWarehouseName: undefined,
          crtUserNo: undefined,
          departName: undefined,
          brandName: undefined,
          startDate: undefined,
          endDate: undefined,
          billStatus: undefined,
          selectType: 0  //0代表查询所有状态的单据
        },
        crtTime: undefined,
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false
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
      crtTime(value) {
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
    },
    methods: {
      getSummaries(param) {
        return this.getSummariesMethod(param, ['releaseQty', 'oldApplyQty', 'newApplyQty', 'canChangeQty']);
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
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
            tHeader = ['单据日期', '单据编号', '客户编号', '客户名称', '原需求仓库', '新需求仓库', '制单人', '单据状态', '商品编码', '商品名称', '订货号', '规格型号', '发布数量', '原申请数量', '新申请数量', '可变更数量', '面价', '发布单价', '调拨价', '调拨折扣', '单位', '订货单编号', '备注'];
            filterVal = ['crtTime', 'billNo', 'customerCode', 'customerName', 'oldWarehouseName', 'newWarehouseName', 'crtUserName', 'billStatus', 'skuNo', 'skuName', 'itemNo', 'specifications', 'releaseQty', 'oldApplyQty', 'newApplyQty', 'canChangeQty', 'retailPrice', 'releasePrice', 'transferPrice', 'transferDiscount', 'unit', 'salesOrderBillNo', 'note'];
          } else {
            tHeader = ['单据日期', '单据编号', '客户名称', '客户名称', '原需求仓库', '新需求仓库', '制单人', '单据状态', '备注'];
            filterVal = ['crtTime', 'billNo', 'customerCode', 'customerName', 'oldWarehouseName', 'newWarehouseName', 'crtUserName', 'billStatus', 'note'];
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
        this.listQuery.billNo = undefined
        this.listQuery.crtUserName = undefined
        this.listQuery.skuNo = undefined
        this.listQuery.itemNo = undefined
        this.listQuery.skuName = undefined
        this.listQuery.seriesName = undefined
        this.listQuery.specifications = undefined
        this.listQuery.customerCode = undefined
        this.listQuery.customerName = undefined
        this.listQuery.newWarehouseName = undefined
        this.listQuery.departName = undefined
        this.listQuery.crtUserNo = undefined
        this.listQuery.brandName = undefined
        this.listQuery.startDate = undefined
        this.listQuery.endDate = undefined
        this.listQuery.billStatus = undefined
        delete this.listQuery.rebateSeries
        this.crtTime = undefined;
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
    }
  }
</script>
