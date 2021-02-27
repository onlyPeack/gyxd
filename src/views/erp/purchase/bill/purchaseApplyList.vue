<template>
  <div class="full-purchase bill-container">
    <el-tabs  v-model="activity">
      <el-tab-pane label="制单" name="first">
        <!-- 新增采购申请单弹窗 -->
        <purchase-apply-form :id="trueId" @submitSuccess="submitSuccess" :typeOptions="typeOptions" v-if="refresh"></purchase-apply-form>
      </el-tab-pane>
      <el-tab-pane label="查询" name="second">
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
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                      v-model="listQuery.customerCode"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
          </div>
          <div class="query-container">
            <div>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                        v-model="listQuery.warehouseName"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                         v-model="listQuery.skuNo"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                         v-model="listQuery.skuName"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                         v-model="listQuery.brandName"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                         v-model="listQuery.seriesName"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                         v-model="listQuery.rebateSeries"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                         v-model="listQuery.specifications"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                         v-model="listQuery.itemNo"
                         @keyup.enter.native="handleFilter">
              </el-input>
              <div></div>
              <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="订货单编号"
                         v-model="listQuery.salesOrderBillNo"
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
            <!--<el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"-->
            <!--v-model="listQuery.brandName"-->
            <!--@keyup.enter.native="handleFilter">-->
            <!--</el-input>-->
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
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight" show-summary :summary-method="getSummaries"
                  v-if="choose" key="dataTable1" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}"
                  @row-dblclick="handleOpenDetailOrForm">
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column  align="center" type="index">
          </el-table-column>
          <el-table-column prop="mainDTO.billNo" align="center" label="单据编号" width="180" sortable>
            <template slot-scope="scope">
              <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.mainDTO">
                {{scope.row.mainDTO.billNo}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="80">
            <template slot-scope="scope">
              <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
                <span v-if="item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="crtUserNo" align="center" label="申请人工号" width="180">
          </el-table-column>
          <el-table-column prop="crtUserName" align="center" label="申请人姓名" width="180">
          </el-table-column>
          <el-table-column prop="departName" align="center" label="申请人部门" width="180">
          </el-table-column>
          <el-table-column prop="mainDTO.customerCode" align="center" label="客户编号" min-width="150">
          </el-table-column>
          <el-table-column prop="mainDTO.customerName"  label="客户名称" min-width="150">
          </el-table-column>
          <el-table-column prop="channelTypeCode"  label="渠道类型编号" min-width="150">
          </el-table-column>
          <el-table-column prop="channelTypeName"  label="渠道类型名称" min-width="150">
          </el-table-column>
          <el-table-column prop="mainDTO.warehouseName" align="center" label="仓库名称" width="120">
          </el-table-column>
          <el-table-column prop="mainDTO.type" align="center" label="申请类型" width="120">
            <template slot-scope="scope">
              <div v-for="item in typeOptions">
                <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.type">{{item.label}}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="skuNo" label="商品编码" width="204">
          </el-table-column>
          <el-table-column prop="brandName" label="品牌" width="204">
          </el-table-column>
          <el-table-column prop="seriesName" label="标准系列" width="204">
          </el-table-column>
          <el-table-column prop="rebateSeries" label="返点系列" width="204">
          </el-table-column>
          <el-table-column prop="skuName" align="center" label="商品名称" width="204">
          </el-table-column>
          <el-table-column prop="specifications" align="center" label="规格型号" width="200">
          </el-table-column>
          <el-table-column prop="itemNo" align="center" label="订货号" width="200">
          </el-table-column>
          <el-table-column prop="unit" align="center" label="单位" width="200">
          </el-table-column>
          <el-table-column prop="releaseQty" label="可用数量" align="right" width="120">
          </el-table-column>
          <el-table-column prop="applyQty" label="申请数量" align="right" width="120" class-name="col-required">
          </el-table-column>
          <el-table-column prop="purchasedQty" label="已采购数量" align="right" width="120">
          </el-table-column>
          <el-table-column prop="stockInQty" label="已入库数量" align="right" width="120">
          </el-table-column>
          <el-table-column prop="retailPrice" label="面价" align="right" width="120"  class-name="col-required">
            <template slot-scope="scope">
              {{scope.row.retailPrice.toFixed(4)}}
            </template>
          </el-table-column>
          <el-table-column prop="releasePrice" label="发布单价" align="right" width="120"  class-name="col-required">
            <template slot-scope="scope">
              {{scope.row.releasePrice.toFixed(4)}}
            </template>
          </el-table-column>
          <el-table-column prop="transferPrice" label="调拨价" align="right" width="120" class-name="col-required">
            <template slot-scope="scope">
              {{scope.row.transferPrice.toFixed(4)}}
            </template>
          </el-table-column>
          <el-table-column prop="transferDiscount" label="调拨折扣" align="right" width="120" class-name="col-required">
          </el-table-column>
          <el-table-column prop="unit" label="单位" align="right" width="75">
          </el-table-column>
          <el-table-column prop="salesOrderBillNo" align="center" label="订货单编号" width="200">
          </el-table-column>
          <el-table-column prop="crtTime" label="单据日期" align="center" width="150" sortable>
          </el-table-column>
          <el-table-column prop="note" label="备注" width="200">
          </el-table-column>
        </el-table>

        <!--单据-->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini" show-summary :summary-method="getSummaries"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  v-else key="dataTable2" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}"
                  @row-dblclick="handleOpenDetailOrForm">
          <el-table-column type="selection" align="center" width="60">
          </el-table-column>
          <el-table-column  align="center" type="index">
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
          <el-table-column prop="crtUserNo" label="申请人工号" align="center" width="180">
          </el-table-column>
          <el-table-column prop="crtUserName" label="申请人姓名" align="center" width="180">
          </el-table-column>
          <el-table-column prop="departName" label="申请部门" align="center" width="180">
          </el-table-column>
          <el-table-column prop="customerCode" label="客户编号" align="center" min-width="150">
          </el-table-column>
          <el-table-column prop="customerName" label="客户名称" align="center" min-width="150">
          </el-table-column>
          <el-table-column prop="warehouseName" label="仓库名称" align="center" width="120">
          </el-table-column>
          <el-table-column prop="type" label="申请类型" align="center" width="120">
            <template slot-scope="scope">
              <div v-for="item in typeOptions">
                <span v-if="item.value==scope.row.type">{{item.label}}</span>
              </div>
            </template>
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

      </el-tab-pane>
    </el-tabs>



    <!-- 采购申请单详情弹窗 -->
    <purchase-apply-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                         @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                         :typeOptions="typeOptions">
    </purchase-apply-view>


  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseApply';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseApplyList",
    components: {
      'purchase-apply-form': () => import('./purchaseApplyForm'),
      'purchase-apply-view': () => import('./purchaseApplyView')
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
          warehouseName: undefined,
          skuNo: undefined,
          skuName: undefined,
          seriesName: undefined,
          itemNo: undefined,
          specifications: undefined,
          customerName: undefined,
          customerCode: undefined,
          crtUserNo: undefined,
          departName: undefined,
          startDate: undefined,
          endDate: undefined,
          brandName: undefined,
          billStatus: undefined,
          selectType: 0  //0代表查询所有状态的单据
        },
        trueId:'',
        id:'',
        refresh:true,
        activity:'second',
        crtTime: undefined,
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        typeOptions: [{
          value: '0',
          label: '备货'
        }, {
          value: '1',
          label: '按期货订单采购'
        },{
          value: '2',
          label: '按调拨订单采购'
        },{
          value: '3',
          label: '按闲置订单采购'
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
      crtTime(value) {
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      },

      activity(value){
        if(value==='second'){
          this.refresh=false
          this.trueId=''
          this.$nextTick(()=>{
            this.refresh=true
          })
        }
      }
    },
    methods: {
      getSummaries(param){
        return this.getSummariesMethod(param,['releaseQty','applyQty','purchasedQty','stockInQty']);
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
            tHeader = [ '单据编号','单据状态','申请人工号','申请人姓名','申请人部门','客户编号','客户名称','仓库名称','申请类型','商品编码','品牌','标准系列','返点系列','商品名称','规格型号','订货号','单位','可用数量','申请数量','已采购数量','已入库数量','面价','发布单价','调拨价','调拨折扣','订货单编号','单据日期','备注'];
            filterVal = [ 'billNo','billStatus','crtUserNo','crtUserName','departName','customerCode','customerName','warehouseName','type','skuNo','brandName','seriesName','rebateSeries','skuName','specifications','itemNo','unit','releaseQty','applyQty','purchasedQty','stockInQty','retailPrice','releasePrice','transferPrice','transferDiscount','salesOrderBillNo','crtTime','note'];
          } else {
            tHeader = [ '单据编号', '单据状态','申请人工号','申请人姓名','申请人部门','客户编号', '客户名称', '仓库名称','申请类型','单据日期','备注'];
            filterVal = [ 'billNo', 'billStatus','crtUserNo','crtUserName','departName','customerCode', 'customerName','warehouseName','type','crtTime','note'];
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
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = undefined,
          this.listQuery.warehouseName = undefined,
          this.listQuery.skuNo = undefined,
          this.listQuery.skuName = undefined,
          this.listQuery.brandName = undefined,
          this.listQuery.seriesName = undefined,
          this.listQuery.itemNo = undefined,
          this.listQuery.billStatus = undefined,
          this.listQuery.crtUserNo = undefined,
          this.listQuery.crtUserName = undefined,
          this.listQuery.specifications = undefined,
          this.listQuery.customerName = undefined,
          this.listQuery.customerCode = undefined,
          this.listQuery.departName = undefined,
          this.listQuery.startDate = undefined,
          this.listQuery.endDate = undefined,
          this.crtTime = undefined
        delete this.listQuery.rebateSeries
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
        this.activity='second'
        // this.dialogFormVisible = false;
        this.$router.replace({
          path: '/refresh',
          query: {
            date: Date.now()
          }
        })
        // if (this.choose == true) { //详情
        //   this.getListByItem();
        // } else { //单据
        //   this.getList();
        // }
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
        this.trueId = this.selectedRows[0].id.toString();
        // this.dialogStatus = 'update';
        // this.dialogFormVisible = true;
        this.activity='first'
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
        //console.log(this.statusOptions,'option')
        var billStatus;
        if (row.billStatus) {
          billStatus = row.billStatus;
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
          }
        }
        // if (billStatus && (billStatus == 1||billStatus==5)) {
        //   if (!this.choose) {
        //     this.trueId = row.id;
        //   } else {
        //     this.trueId = row.mainDTO.id;//详情
        //   }
        //   this.activity='second'
        // } else {
          this.handleDetailOpen(row);
        // }
      }
    }
  }
</script>
