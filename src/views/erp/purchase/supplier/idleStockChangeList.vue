<template>
  <div class="full-purchase bill-container">
      <el-tabs  v-model="activity">
      <el-tab-pane label="制单" name="first">
        <!-- 新增闲置库存加点 -->
        <idle-stock-change-form @submitSuccess="submitSuccess" @handleClose="handleClose" ref="idlePricePlaneForm"></idle-stock-change-form>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
      
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据号"
                  v-model="listQuery.billNo"
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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商编号"
                  v-model="listQuery.supplierCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌" v-if="!!choose"
                  v-model="listQuery.brandName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="品名" v-if="!!choose"
                  v-model="listQuery.specModel"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="系列" v-if="!!choose"
                  v-model="listQuery.seriesName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号" v-if="!!choose"
                  v-model="listQuery.itemNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
         <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员工号" v-if="!!choose"
                  v-model="listQuery.purchaserCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购员姓名" v-if="!!choose"
                  v-model="listQuery.purchaserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <div class="block">
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions">
        </el-date-picker>
          <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;margin-top:8px">查询
          </el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" style="margin-top:8px">重置</el-button>
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
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据号" width="180">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="specModel" label="品名" width="100"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="100">
      </el-table-column>
      <el-table-column prop="releasePrice" label="采购发布价格" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="releaseDiscount" label="发布折扣" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="point" label="采购加点" width="100"></el-table-column>
      <el-table-column prop="releaseQty" label="总发布数量" width="100"></el-table-column>
      <el-table-column prop="productionDate" label="生产日期" width="100"></el-table-column>
      <el-table-column prop="qty" label="库存数量" width="100"></el-table-column>
      <el-table-column prop="lockedQty" label="锁库数量" width="100"></el-table-column>
      <el-table-column prop="minPack" label="最小起订量" width="100"></el-table-column>
      <el-table-column prop="oldReleasePrice" label="原采购发布价格" width="100"></el-table-column>  
      <el-table-column prop="oldSupplyPrice" label="原供应商发布价格" width="100"></el-table-column>
      <el-table-column prop="supplyAmount" label="发布金额" width="100"></el-table-column>
      <el-table-column prop="supplyPrice" label="供货价" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="purchaserName" label="采购员姓名" width="100"></el-table-column>
      <el-table-column prop="purchaserCode" label="采购员编号" width="100"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="100"></el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" width="100"></el-table-column>
      <el-table-column prop="tags" label="标签" width="100"></el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" width="100"></el-table-column>
      <el-table-column prop="warehouseAdress" label="仓库地址" width="100"></el-table-column>
      <el-table-column prop="validateTime" label="质保期" width="100"></el-table-column>
      <el-table-column prop="warranty" label="有效期" width="100"></el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="100"></el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据号" width="180">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="制单人工号" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="制单人姓名" align="center">
      </el-table-column>
      <el-table-column prop="supplierCode" label="供应商工号" align="center">
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商姓名" align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="150" sortable align="center">
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
     <!-- 变更单详情 -->
    <idle-stock-change-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                     @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                     :typeOptions="typeOptions">
    </idle-stock-change-view>
    </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/idleStockChange';
  import {getFloat} from '@/utils/util';

  export default {
    name: "idleStockChangeList",
    components: {
      'idle-stock-change-form': () => import('./idleStockChangeForm'),
      'idle-stock-change-view': () => import('./idleStockChangeView')
    },
    data() {
      return {
        crtTime:undefined,
        downloadLoading: false,
        activity:'second',
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          customerName: undefined,
          schemeName: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          brandName: undefined,
          itemNo: undefined,
          specifications: undefined,
          seriesName: undefined,
          startDisabledDate: undefined,
          endDisabledDate: undefined,
          startEffectiveDate: undefined,
          endEffectiveDate: undefined,
          billStatus: undefined,
        },
        id:"",
        clientHeight: 300,
        dialogFormVisible: true,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        statusOptions:[{
          value: 2,
          label: '流转中'
        }, {
          value: 3,
          label: '作废'
        }, {
          value: 4,
          label: '正常'
        }, {
          value: 5,
          label: '回退'
        }],
        effectiveDate: '',
        disabledDate: '',
        typeOptions: [{
          value: '0',
          label: '单个商品调价'
        }, {
          value: '1',
          label: '低于安全折扣调价'
        },
        {
            value: '2',
            label: '按系列调价'  //暂时隐藏
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
          for (var i in list) {
            Object.assign(list[i], list[i].mainDTO);
            var customerNames = [];
            for (var j in list[i].customerArr) {
              customerNames.push(list[i].customerArr[j].customerName);
            }
            list[i].customerNames = customerNames.join(',');
            delete list[i].mainDTO;
          }
          if (this.choose == false) {
            tHeader = ['价格方案', '制单日期', '生效日期', '到期日期', '适用客户', '制单人工号', '制单人姓名', '单据状态'];
            filterVal = ['schemeName', 'crtTime', 'effectiveDate', 'disabledDate', 'customerNames', 'crtUserNo', 'crtUserName', 'billStatus'];
          } else {

            tHeader = ['价格方案', '制单日期', '生效日期', '到期日期', '适用客户', '制单人工号', '制单人姓名', '商品名称', '订货号', '规格型号', '单位', '客户订货价', '单据状态'];
            filterVal = ['schemeName', 'crtTime', 'effectiveDate', 'disabledDate', 'customerNames', 'crtUserNo', 'crtUserName', 'skuName', 'itemNo', 'specifications', 'unit', 'customerPrice', 'billStatus'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '价格方案');
          this.downloadLoading = false;
        })
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
            if (column.property == 'customerPrice') {
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
        this.activity = 'first'
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
        this.crtTime = undefined
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
        this.activity = 'second';
        this.$refs.idlePricePlaneForm.dataForm = {}
        this.$refs.idlePricePlaneForm.items = [{}]
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
      handleDisabledDateSelect(val) {
        this.listQuery.startDisabledDate = val[0];
        this.listQuery.endDisabledDate = val[1];
      },
      handleEffectiveDateDateSelect(val) {
        this.listQuery.startEffectiveDate = val[0];
        this.listQuery.endEffectiveDate = val[1];
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.id;//详情
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
        console.log(row);
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
          this.$refs.idlePricePlaneForm.id = this.id
          this.dialogStatus = 'update';
          this.activity = 'first'
        } else {
          this.handleDetailOpen(row);
        }
      },
    },
    watch: {
      effectiveDate(value) {
        if (value == null) {
          this.listQuery.startEffectiveDate = undefined;
          this.listQuery.endEffectiveDate = undefined;
        }
      },
      disabledDate(value) {
        if (value == null) {
          this.listQuery.startDisabledDate = undefined;
          this.listQuery.endDisabledDate = undefined;
        }
      },
      activity(value) {
        console.log(value);
        if(value == 'first' && this.id) {
          this.$refs.idlePricePlaneForm.init()
        }
      },
      crtTime(value) {
        console.log(value);
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        } else {
          this.listQuery.startDate = value[0];
          this.listQuery.endDate = value[1];
        }
      }
    }
  }
</script>
