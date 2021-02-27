<template>
  <div class="full-purchase bill-container">
    <el-tabs type="border-card" v-model="activity">
      <el-tab-pane label="制单" name="first">
        <!-- 新增外借单弹窗 -->
        <loan_out_form :id="trueId" @submitSuccess="submitSuccess" @handleClose="handleClose"></loan_out_form>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <div>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                      v-model="listQuery.billNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                      v-model="listQuery.crtUserName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请人"
                      v-model="listQuery.applierName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="申请部门"
                      v-model="listQuery.conDeptName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
            <span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">
            <span v-show="!queryVisible">展开</span>
            <span v-show="queryVisible">收起</span>
              <!--<svg-icon icon-class="down"></svg-icon>-->
            <i class="el-icon-arrow-down" v-show="!queryVisible"></i>
            <i class="el-icon-arrow-up" v-show="queryVisible"></i>
          </span>
          </div>
          <div class="query-container" v-show="queryVisible">
            <div class="block">
              <el-date-picker
                v-model="billDate"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="外借开始日期"
                end-placeholder="外借结束日期"
                @change="handleBillDateSelect"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
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
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="mainDTO.billNo" label="单据编号" min-width="180" sortable>
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                {{scope.row.mainDTO.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mainDTO.billStatus" label="单据状态" width="80">
            <template slot-scope="scope">
              <div v-for="item in statusOptions">
                <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="crtUserName" label="制单人" width="100">
          </el-table-column>
          <el-table-column prop="mainDTO.applierName" label="申请人" width="150">
          </el-table-column>
          <el-table-column prop="mainDTO.conDeptName" label="申请部门" width="150">
          </el-table-column>
          <el-table-column prop="warehouseName" label="外借仓库" width="150">
          </el-table-column>
          <el-table-column prop="positionName" label="外借仓位" width="150">
          </el-table-column>
          <el-table-column prop="skuNo" label="商品编码" width="120">
          </el-table-column>
          <el-table-column prop="skuName" label="商品名称" width="180">
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center" width="180">
          </el-table-column>
          <el-table-column prop="seriesName" label="系列" width="180">
          </el-table-column>
          <el-table-column prop="itemNo" label="订货号" width="180">
          </el-table-column>
          <el-table-column prop="specifications" label="规格型号" width="180">
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="center" width="80">
          </el-table-column>
          <el-table-column prop="qty" label="外借数量" align="right" width="80" class-name="col-required">
          </el-table-column>
          <el-table-column prop="mainDTO.printCount" label="打印次数" width="80">
          </el-table-column>
          <el-table-column prop="mainDTO.billDate" label="外借日期" width="150" sortable>
          </el-table-column>
        </el-table>
        <!--单据-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries" v-else key="dataTable2" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column type="index">
          </el-table-column>
          <el-table-column prop="billNo" label="单据编号" min-width="180" sortable>
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
                {{scope.row.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="单据状态" width="80">
            <template slot-scope="scope">
              <div v-for="item in statusOptions">
                <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="crtUserName" label="制单人" width="150">
          </el-table-column>
          <el-table-column prop="applierName" label="申请人" width="150">
          </el-table-column>
          <el-table-column prop="conDeptName" label="申请部门" width="150">
          </el-table-column>
          <el-table-column prop="printCount" label="打印次数" width="80">
          </el-table-column>
          <el-table-column prop="crtTime" label="外借日期" width="150" sortable>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>



    <!-- 外借单详情弹窗 -->
    <loan_out_view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                   @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </loan_out_view>
  </div>
</template>

<script>
  import {batchDelBill, selectPage, selectPageByItem} from '@/api/erp/wms/bill/borrowStock';
  import {getFloat} from '@/utils/util';

  export default {
    name: "loanOut",
    components: {
      'loan_out_form': () => import('./loan_out_form'),
      'loan_out_view': () => import('./loan_out_view')
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        listLoading: true,
        id:'',
        trueId:'',
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          crtUserName: undefined,
          applierName: undefined,
          conDeptName: undefined,
          skuNo: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
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
        availability: true,
        activity:'second'
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
            tHeader = ['外借日期', '单据编号', '制单人', '申请人', '申请部门', '单据状态', '打印次数'];
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'applierName', 'conDeptName', 'billStatus', 'printCount'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['外借日期', '单据编号', '制单人', '申请人', '申请部门', '单据状态', '外借仓库', '外借仓位', '商品编码', '商品名称', '单位', '外借数量', '打印次数'];
            filterVal = ['crtTime', 'billNo', 'crtUserName', 'applierName', 'conDeptName', 'billStatus', 'warehouseName', 'positionName', 'skuNo', 'skuName', 'unit', 'qty', 'printCount'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '外借单');
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
        this.clientHeight = (document.body.clientHeight - (300 + height)) * 1;
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
            if (column.property == 'qty') {
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
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = undefined;
        this.listQuery.crtUserName = undefined;
        this.listQuery.applierName = undefined;
        this.listQuery.conDeptName = undefined;
        this.listQuery.skuNo = undefined,
          this.listQuery.skuName = undefined,
          this.listQuery.itemNo = undefined,
          this.listQuery.specifications = undefined,
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
        this.activity='second'
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
        this.trueId = this.selectedRows[0].id;
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
        // if (billStatus && billStatus == 1) {
        //   if (!this.choose) {
        //     this.id = row.id;
        //   } else {
        //     this.id = row.mainDTO.id;//详情
        //   }
        //   this.dialogStatus = 'update';
        //   this.dialogFormVisible = true;
        // } else {
          this.handleDetailOpen(row);
        // }
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      },
    }
  }
</script>

