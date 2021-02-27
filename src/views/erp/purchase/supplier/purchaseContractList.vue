<template>
  <div class="full-purchase bill-container purchase-contract-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="合同名称"
                  v-model="listQuery.contractName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商"
                  v-model="listQuery.supplierName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
        <div class="query-container" >
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
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列"
                      v-model="listQuery.seriesName"
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
        <div class="block">
          <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"-->
          <!--v-model="listQuery.supplierCode"-->
          <!--@keyup.enter.native="handleFilter">-->
          <!--</el-input>-->
          <el-date-picker
            v-model="contractDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="签约开始日期"
            end-placeholder="签约结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleContractDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>

          <el-date-picker
            v-model="effectiveDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="生效开始日期"
            end-placeholder="生效结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleEffectiveDateDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>

          <el-date-picker
            v-model="disabledDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="到期开始日期"
            end-placeholder="到期结束日期"
            value-format="yyyy-MM-dd"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDisabledDateSelect"
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
      <!--<el-button type="text" icon="el-icon-upload2" @click="downloadTap" v-if="!choose">下载合同</el-button>-->

      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm"
              :default-sort="{prop: 'mainDTO.crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" align="center" label="合同编号" width="204" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
            {{scope.row.mainDTO.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.contractName" label="合同名称" width="200">
      </el-table-column>
      <!--<el-table-column prop="mainDTO.supplierCode" label="供应商编号" width="200">-->
      <!--</el-table-column>-->
      <el-table-column prop="mainDTO.supplierName"  label="供应商" width="200">
      </el-table-column>
      <el-table-column prop="crtUserNo" align="center" label="采购员工号" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" align="center" label="采购员姓名" width="100">
      </el-table-column>
      <el-table-column prop="departName" align="center" label="采购部门" width="100">
      </el-table-column>
      <el-table-column label="币别" width="64">
        <template slot-scope="scope">
            <span v-for="item in currencyOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.contractAmount" label="合同金额" align="right" width="108" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.mainDTO.contractAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="mainDTO.note" label="备注" width="180">
      </el-table-column> -->
      <el-table-column prop="skuNo" align="center" label="商品编码" width="204">
      </el-table-column>
      <el-table-column prop="skuName" align="center" label="商品名称" width="204">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" min-width="200">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" min-width="200">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" min-width="200">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
      </el-table-column>
      <el-table-column prop="qty" label="数量" align="right" width="75" class-name="col-required">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="75">
      </el-table-column>
      <el-table-column prop="price" label="单价" align="right" width="75" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.price).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="right" width="104" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.amount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="tax" label="税额" align="right" width="104" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.tax).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxPrice" label="含税单价" align="right" width="78" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.taxPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="taxAmount" label="价税合计" align="right" width="104" class-name="col-required">
         <template slot-scope="scope">
          {{Number(scope.row.taxAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="104">
      </el-table-column>
      <el-table-column prop="mainDTO.contractDate" align="center" label="签约日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.effectiveDate" align="center" label="生效日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.disabledDate" align="center" label="到期日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="mainDTO.crtTime" align="center" label="制单时间" width="150" sortable>
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column prop="billNo" align="center" label="合同编号" min-width="204" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" align="center" label="单据状态" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="contractName" label="合同名称" width="200">
      </el-table-column>
      <!--<el-table-column prop="supplierCode" label="供应商编号" width="200">-->
      <!--</el-table-column>-->
      <el-table-column prop="supplierName" label="供应商" width="200">
      </el-table-column>
      <el-table-column prop="crtUserNo" align="center" label="采购员工号" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" align="center" label="采购员姓名" width="100">
      </el-table-column>
      <el-table-column prop="departName" align="center" label="采购部门" width="100">
      </el-table-column>
      <el-table-column label="币别" width="70" align="center">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="contractAmount" label="合同金额" align="right" width="108" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.contractAmount).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="contractDate" align="center" label="签约日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="effectiveDate" align="center" label="生效日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="disabledDate" align="center" label="到期日期" width="108" sortable>
      </el-table-column>
      <el-table-column prop="crtTime" align="center" label="制单时间" width="150" sortable>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="180">
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right" align="center">
        <template slot-scope="scope">
          <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
            <a class="download" :href="'/api/purchase/purchase-contract/download?id='+ scope.row.id">下载合同</a>
          </div>

        </template>
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

    <!-- 新增合同弹窗 -->
    <purchase-contract-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                            @submitSuccess="submitSuccess" @handleClose="handleClose">
    </purchase-contract-form>

    <!-- 采购合同详情弹窗 -->
    <purchase-contract-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                            @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </purchase-contract-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseContract';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseContractList",
    components: {
      'purchase-contract-form': () => import('./purchaseContractForm'),
      'purchase-contract-view': () => import('./purchaseContractView')
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
          billNo: '',
          contractName: '',
          supplierName: '',
          purchaserName: '',
          skuNo: '',
          skuName: '',
          itemNo: '',
          specifications: '',
          startContractDate: '',
          endContractDate: '',
          startDisabledDate: '',
          endDisabledDate: '',
          startEffectiveDate: '',
          endEffectiveDate: '',
          supplierCode: '',
          crtUserNo: '',
          crtUserName: '',
          billStatus: '',
          departName: '',
          brandName: '',
          selectType: 0 //单据查询时使用，0代表查所有状态，1代表只查正常状态
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
        contractDate: '',
        effectiveDate: '',
        disabledDate: '',
        contractId: undefined
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
      downloadTap() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要下载的合同',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能下载一个合同',
            type: 'error',
            duration: 2000
          });
          return false;
        } else {
          this.contractId = this.selectedRows[0].id;
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
            tHeader = ['签约日期', '生效日期', '到期日期', '合同编号', '合同名称', '供应商', '采购员', '币别', '合同金额', '单据状态', '备注', '商品编码', '商品名称', '订货号', '规格型号', '数量', '单位', '单价', '金额', '税额', '含税单价', '价税合计'];
            filterVal = ['contractDate', 'effectiveDate', 'disabledDate', 'billNo', 'contractName', 'supplierName', 'purchaserName', 'currencyId', 'contractAmount', 'billStatus', 'note', 'skuNo', 'skuName', 'itemNo', 'specifications', 'qty', 'unit', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount'];
          } else {
            tHeader = ['签约日期', '生效日期', '到期日期', '合同编号', '合同名称', '供应商', '采购员', '币别', '合同金额', '单据状态', '备注'];
            filterVal = ['contractDate', 'effectiveDate', 'disabledDate', 'billNo', 'contractName', 'supplierName', 'purchaserName', 'currencyId', 'contractAmount', 'billStatus', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '采购合同');
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
            if (column.property == 'contractAmount' || column.property == 'amount'
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
          this.listQuery.billNo = '',
          this.listQuery.contractName = '',
          this.listQuery.supplierName = '',
          this.listQuery.purchaserName = '',
          this.listQuery.billStatus = '',
          this.listQuery.crtUserNo = '',
          this.listQuery.crtUserName = '',
          this.listQuery.skuNo = '',
          this.listQuery.skuName = '',
          this.listQuery.itemNo = '',
          this.listQuery.seriesName = '',
          this.listQuery.specifications = '',
          this.contractDate = null,
          this.effectiveDate = null,
          this.disabledDate = null,
          this.listQuery.supplierCode = '',
          this.listQuery.departName = '',
          this.listQuery.brandName = ''
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
                  message: '删除成功',
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
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleContractDateSelect(val) {
        this.listQuery. startContractDate = val[0] + ' 00:00:00';
        this.listQuery.endContractDate = val[1] + ' 23:59:59';
      },
      handleDisabledDateSelect(val) {
        this.listQuery.startDisabledDate = val[0] + ' 00:00:00';
        this.listQuery.endDisabledDate = val[1] + ' 23:59:59';
      },
      handleEffectiveDateDateSelect(val) {
        this.listQuery.startEffectiveDate = val[0] + ' 00:00:00';
        this.listQuery.endEffectiveDate = val[1] + ' 23:59:59';
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
      contractDate(value) {
        if (value == null) {
          this.listQuery.startContractDate = '';
          this.listQuery.endContractDate = '';
        }
      },
      effectiveDate(value) {
        if (value == null) {
          this.listQuery.startEffectiveDate = '';
          this.listQuery.endEffectiveDate = '';
        }
      },
      disabledDate(value) {
        if (value == null) {
          this.listQuery.startDisabledDate = '';
          this.listQuery.endDisabledDate = '';
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .download {
    display: block;
    width: 60px;
    padding: 0px 4px;
    font-size: 10px;
    text-align: center;
    background: rgba(255, 246, 231, 1);
    border: 1px solid rgba(235, 144, 0, 1);
    color: rgba(235, 144, 0, 1);
  }
</style>
<style lang="scss">
  .purchase-contract-container {
    .result-data-table {
      .el-table__body-wrapper .cell {
        height: 26px !important;
      }
      .el-table__fixed-body-wrapper .cell {
        height: 26px !important;
      }
    }
  }
</style>
