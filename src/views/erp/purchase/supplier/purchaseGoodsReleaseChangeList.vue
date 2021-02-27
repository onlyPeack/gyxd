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
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="采购部门"
                  v-model="listQuery.departName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="到货仓库"
                  v-model="listQuery.warehouseName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker style="position: relative;top:-4px;width: 400px"
                        v-model="crtTime"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建日期"
                        end-placeholder="创建日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;" icon="el-icon-search">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>

      </div>
      <div class="query-container" >
        <div>
          <el-select v-model="listQuery.publishType" class="filter-item" placeholder="变更类型" clearable style="width: 200px">
            <el-option v-for="item in publishOption" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="标准系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName"></el-input>

          <el-input v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="返点系列"
                    @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries"></el-input>

          <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
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
          <el-input  v-if="choose" clearable class="filter-item" style="width: 200px;" placeholder="品牌"
                    v-model="listQuery.brandName"
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
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose" key="dataTable1" class="result-data-table" :default-sort="{prop: 'crtTime', order: 'descending'}">
      <el-table-column type="selection" align="center" width="60">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billNo" label="单据编号" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="mainDTO.billStatus" align="center" label="单据状态" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions" v-if="scope.row.mainDTO">
            <span v-if="scope.row.mainDTO && item.value==scope.row.mainDTO.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseName" label="到货仓库" width="100" align="center">
      </el-table-column>
      <el-table-column prop="qty" label="发布数量" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" align="right" width="100" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="price" label="发布单价" align="right" width="100" class-name="col-required">
        <template slot-scope="scope">
          {{Number(scope.row.price).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="发布折扣" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期(天)" width="80" class-name="col-required" align="right">
      </el-table-column>
      <el-table-column label="标准系列" prop="seriesName" width="110" ></el-table-column>
      <el-table-column label="返点系列" prop="rebateSeries" width="110"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" align="center" width="180">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="150">
      </el-table-column>
      <el-table-column prop="validityPeriod" label="信息有效期" width="150" align="center">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="采购员工号" width="120" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="采购员姓名" width="120" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="采购部门" align="center" width="170">
      </el-table-column>
      <el-table-column prop="channelType" label="渠道类型" width="100" align="center">
        <template slot-scope="scope">
            <span v-for="item in channelTypeOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.channelType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="publishType" label="发布类型" width="100" align="center">
        <template slot-scope="scope">
            <span v-for="item in publishTypeOptions">
            <span v-if="scope.row.mainDTO && scope.row.mainDTO.publishType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <!-- <el-form-item label="发布范围:" prop="publishScope" class="el-form-flex">
      <el-select v-model="dataForm.publishScope" style="width: 100%;"
                 @change="$refs.dataForm.validateField('channelType')">
        <el-option v-for="item in scopeTypeOptions" :key="item.value" :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
    </el-form-item> -->
      <el-table-column prop="skuNo" label="商品编码"  width="180"></el-table-column>
      <el-table-column prop="moqMinOrder" label="最小起订量" align="right" width="100">
      </el-table-column>
      <el-table-column prop="purchasedQty" label="已被采购数量" align="right" width="100">
      </el-table-column>
      <el-table-column prop="mainDTO.note" label="备注">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建时间" width="180" sortable  align="center">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" min-width="200" align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="80" align="center">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="publishType" label="变更类型" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.publishType == 0 || scope.row.publishType == '0'?'GH':'调拨类型'}}
        </template>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="采购员工号" width="200" align="center">
      </el-table-column>
      <el-table-column prop="crtUserName" label="采购员姓名" width="200" align="center">
      </el-table-column>
      <el-table-column prop="departName" label="采购部门" align="center" width="200">
      </el-table-column>
      <el-table-column prop="warehouseName" label="到货仓库" width="200" align="center">
      </el-table-column>
      <el-table-column prop="channelType" label="渠道类型" width="150" align="center">
        <template slot-scope="scope">
          <span v-for="item in channelTypeOptions">
            <span v-if="scope.row.channelType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="publishType" label="发布类型" width="150" align="center">
        <template slot-scope="scope">
          <span v-for="item in publishTypeOptions">
            <span v-if="scope.row.publishType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
      </el-table-column>
      <el-table-column prop="crtTime" label="创建时间" width="180" align="center">
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

    <!-- 新增弹窗 -->
    <purchase-goods-release-change-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                 @submitSuccess="submitSuccess" @handleClose="handleClose" :scopeTypeOptions="scopeTypeOptions"
                                 :publishTypeOptions="publishTypeOptions" :channelTypeOptions="channelTypeOptions">
    </purchase-goods-release-change-form>

    <!-- 详情弹窗 -->
    <purchase-goods-release-change-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose"
                                        :scopeTypeOptions="scopeTypeOptions"
                                        :publishTypeOptions="publishTypeOptions" :channelTypeOptions="channelTypeOptions">
    </purchase-goods-release-change-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, batchDelBill} from '@/api/erp/purchase/bill/purchaseGoodsReleaseChange';
  import {getFloat} from '@/utils/util';

  export default {
    name: "purchaseGoodsReleaseChangeList",
    components: {
      'purchase-goods-release-change-form': () => import('./purchaseGoodsReleaseChangeForm'),
      'purchase-goods-release-change-view': () => import('./purchaseGoodsReleaseChangeView')
    },
    data() {
      return {
        publishOption: [
          {
            value: 0,
            label: 'GH'
          },
          {
            value: 1,
            label: 'VMI'
          }
        ],
        scopeTypeOptions:[
          {
            value:'发布给所有人',
            label:'发布给所有人'
          }
        ],
        crtTime:undefined,
        list: [],
        total: undefined,
        downloadLoading: false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: '',
          warehouseName: '',
          crtUserName: '',
          skuNo: '',
          skuName: '',
          specifications: '',
          itemNo: '',
          publishType: undefined,
          startDate:undefined,
          endDate: undefined,
          departName:undefined,
          crtUserNo:'',
          brandName:'',
          billStatus:'',
          selectType: 0 //单据查询时使用，0代表查所有状态，1代表只查正常状态
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        publishTypeOptions: [{
          value: '0',
          label: 'GH'
        }, {
          value: '1',
          label: 'VMI'
        },/* {
          value: '2',
          label: '发布给指定员工'
        }*/],
        channelTypeOptions: [{
          value: '1',
          label: '厂家'
        }, {
          value: '2',
          label: '厂家库存单'
        }, {
          value: '3',
          label: '厂家促销'
        }, {
          value: '4',
          label: '厂家促销第一季度'
        }, {
          value: '5',
          label: '厂家促销第二季度'
        }, {
          value: '6',
          label: '厂家促销第三季度'
        }, {
          value: '7',
          label: '厂家促销第四季度'
        }, {
          value: '8',
          label: '渠道'
        }, {
            value: '9',
            label: '供应商'
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
    watch: {
      crtTime(value) {
        if (!value) {
          this.listQuery.startDate = undefined;
          this.listQuery.endDate = undefined;
        }
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
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
            tHeader = ['单据编号', '到货仓库', '渠道类型', '发布类型', '单据状态', '备注', '商品编码', '商品名称', '规格型号', '订货号', '单位', '面价', '发布数量', '发布单价', '发布折扣', '创建时间',];
            filterVal = ['billNo', 'warehouseName', 'channelType', 'publishType', 'billStatus', 'note', 'skuNo', 'skuName', 'specifications', 'itemNo', 'unit', 'retailPrice', 'qty', 'price', 'discount', 'crtTime'];
          } else {
            tHeader = ['合同编号', '到货仓库', '渠道类型', '发布类型', '单据状态', '备注', '创建时间',];
            filterVal = ['billNo', 'warehouseName', 'channelType', 'publishType', 'billStatus', 'note', 'crtTime'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '供货信息发布单');
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
        this.listQuery.warehouseName = '',
        this.listQuery.crtUserName = '',
        this.listQuery.skuNo = '',
        this.listQuery.skuName = '',
        this.listQuery.itemNo = '',
        this.listQuery.specifications = '';
        this.listQuery.billStatus = '';
        this.listQuery.crtUserNo = '';
        this.listQuery.departName = '';
        this.listQuery.publishType = undefined;
        this.listQuery.startDate = undefined;
        this.listQuery.endDate = undefined;
        this.listQuery.brandName = undefined;
        this.crtTime = undefined;
        delete this.listQuery.seriesName
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
        const _this = this;
        this.selectedRows.forEach(function (row) {
          if (!_this.choose) {
            ids.push(row.id);
          } else {
            ids.push(row.mainDTO.id);//详情
          }
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
                !_this.choose ? this.getList() : this.getListByItem();
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
