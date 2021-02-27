<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-select clearable class="filter-item" style="width: 200px;" placeholder="单据状态"
                   v-model="listQuery.billStatus"
                   @change="handleFilter">
          <el-option label="报价中" value="0"></el-option>
          <el-option label="已报价" value="1"></el-option>
        </el-select>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>

        <el-input clearable class="filter-item" style="width: 200px;" placeholder="销售员工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="销售员名称"
                  v-model="listQuery.salerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

      </div>
      <div class="query-container" >
        <div v-if="choose">
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
                    v-model="listQuery.specModel"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
        <div class="block">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                    v-model="listQuery.skuNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker
            v-model="crtTime"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="制单开始日期"
            end-placeholder="制单结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleCrtTimeSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-date-picker
            v-model="disabledDate"
            type="daterange"
            align="right"
            unlink-panels
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="到期开始日期"
            end-placeholder="到期结束日期"
            :default-time="['00:00:00', '23:59:59']"
            @change="handleDisabledDateSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>
      </div>
    </div>
    <div style="margin-top: 1px;height: 29px;">
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" v-if="availability" id="edit_bill">编辑</el-button>
      <!--<el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>-->
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-if="choose" key="dataTable1" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'billNo', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180" sortable>
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态"  align="center">
        <template slot-scope="scope">
          <div>
            <span>{{scope.row.billStatus=='0'?'报价中':scope.row.billStatus=='1'?'已报价':''}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称">
      </el-table-column>
      <el-table-column prop="crtUserNo" label="销售员工号" width="100" align="center">
      </el-table-column>
      <el-table-column prop="salerName" label="销售员姓名" width="100" align="center">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="180">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" align="center" width="180">
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" align="center" width="180">
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" align="center" width="180">
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="right" width="80">
      </el-table-column>
      <el-table-column prop="qty" label="询价数量" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="hopePrice" label="期望价格" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="hopeDiscount" label="期望折扣" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="hopeTime" label="期望货期" align="right" width="160">
      </el-table-column>
      <el-table-column prop="price" label="面价" align="right" width="150">
      </el-table-column>
      <el-table-column prop="discount" label="折扣" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="quotePrice" label="报价单价" align="right" width="150" class-name="col-required">
      </el-table-column>
      <el-table-column prop="deliveryTime" label="货期(天)" align="right" width="80" class-name="col-required">
      </el-table-column>
      <el-table-column prop="disabledDate" label="到期日期" width="100" sortable align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="180" sortable align="center">
      </el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handleChangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              v-else key="dataTable2" class="result-data-table"
              @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'billNo', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="200" sortable align="center">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.billStatus=='0'?'报价中':scope.row.billStatus=='1'?'已报价':''}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" >
      </el-table-column>
      <el-table-column prop="crtUserNo" label="销售员工号"  align="center">
      </el-table-column>
      <el-table-column prop="salerName" label="销售员姓名" align="center">
      </el-table-column>
      <el-table-column prop="disabledDate" label="到期日期" width="200" sortable align="center">
      </el-table-column>
      <el-table-column prop="crtTime" label="制单日期" width="200" sortable align="center">
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

    <!-- 新增商品报价弹窗 -->
    <quotations-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id" :billNo="billNo"
                     @submitSuccess="submitSuccess" @handleClose="handleClose">
    </quotations-form>

    <!-- 商品报价详情弹窗 -->
    <quotations-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id" :billNo="billNo"
                     @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </quotations-view>
  </div>
</template>

<script>
  import {selectPage, selectPageByItem, deleteObj} from '@/api/mall/inquiry/index';

  export default {
    name: "quotationsList",
    components: {
      'quotations-form': () => import('./quotationsForm'),
      'quotations-view': () => import('./quotationsView')
    },
    data() {
      return {
        list: [],
        id: undefined,
        billNo: undefined,
        total: undefined,
        listLoading: true,
        availability: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          customerName: undefined,
          billStatus: undefined,
          skuNo: undefined,
          skuName: undefined,
          specModel: undefined,
          itemNo: undefined,
          brandName: undefined,
          crtUserNo: undefined,
          salerName: undefined,
          seriesName: undefined,
          dateOne: undefined,
          dateTwo: undefined,
          startDate: undefined,
          endDate: undefined,
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        crtTime: undefined,
        disabledDate: '',
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
        this.billNo = '';
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleClose() {
        this.id = '';
        this.billNo = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        this.listQuery.billNo = undefined;
        this.listQuery.customerName = undefined;
        this.listQuery.billStatus = undefined;
        this.listQuery.skuNo = undefined;
        this.listQuery.skuName = undefined;
        this.listQuery.specModel = undefined;
        this.listQuery.brandName = undefined;
        this.listQuery.itemNo = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.salerName = undefined;
        this.listQuery.seriesName = undefined;
        this.crtTime = undefined;
        this.disabledDate = undefined;
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
          deleteObj(ids)
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
        this.availabilityChange(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      availabilityChange(row) {
        if (row.billStatus == '0') {
          this.availability = true;
        } else {
          this.availability = false;
        }
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
        console.log('val');
        console.log(val);
        if(val.some(item => {
          return item.billStatus == '1'
        })) {
          this.availability = false;
        } else {
          this.availability = true;
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
        this.billNo = this.selectedRows[0].billNo;
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
        this.listQuery.dateOne = val[0];
        this.listQuery.dateTwo = val[1];
      },
      handleCrtTimeSelect(val) {
        this.listQuery.startBillDate = val[0] + ' 00:00:00';
        this.listQuery.endBillDate = val[1] + ' 23:59:59';
      },
      handleDetailOpen(row) {
        this.id = row.id;
        this.billNo = row.billNo;
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.billNo = '';
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
        }
        if (billStatus && billStatus == '0') {
          this.id = row.id;
          this.billNo = row.billNo;
          this.dialogStatus = 'update';
          this.dialogFormVisible = true;
        } else {
          this.handleDetailOpen(row);
        }
      }
    },
    watch: {
      disabledDate(value) {
        if (value == null) {
          this.listQuery.dateOne = undefined;
          this.listQuery.dateTwo = undefined;
        }
      },
      crtTime(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    }
  }
</script>
