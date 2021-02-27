<template>
  <div class="full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库单号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库人工号"
                  v-model="listQuery.crtUserNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="锁库人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                  v-model="listQuery.skuNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                  v-model="listQuery.skuName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" @click="handleCreate">
        <svg-icon icon-class="unstocklock" style="margin-right: 3px;"></svg-icon>
        锁库
      </el-button>
      <el-button type="text" @click="handleUnlock">
        <svg-icon icon-class="stocklock" style="margin-right: 3px;"></svg-icon>
        解锁
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              show-summary :summary-method="getSummaries" key="dataTable1" class="result-data-table"  :default-sort="{prop: 'mainDTO.deadline', order: 'descending'}">
      <el-table-column type="selection" width="60" align="center">
      </el-table-column>
      <el-table-column type="index" align="center">
      </el-table-column>
      <el-table-column prop="billNo" label="锁库单号" align="center" sortable>
      </el-table-column>
      <el-table-column prop="crtUserNo" label="锁库人工号" align="center" width="100">
      </el-table-column>
      <el-table-column prop="crtUserName" label="锁库人" align="center" width="100">
      </el-table-column>
      <el-table-column prop="skuNo" label="商品编码" width="204">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" align="center" width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.warehouseName" label="仓库名称" align="center" width="200">
      </el-table-column>
      <el-table-column prop="positionName" label="仓位" align="center" width="200">
      </el-table-column>
      <el-table-column prop="mainDTO.deadline" label="锁库期限" align="center" width="150" sortable>
      </el-table-column>
      <el-table-column prop="unit" label="单位" align="center" width="100">
      </el-table-column>
      <el-table-column prop="lockedQty" label="锁库数量" align="right" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="itemNote" label="备注" width="104">
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

    <!-- 新增锁库单弹窗 -->
    <stock-lock-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                     @submitSuccess="submitSuccess" @handleClose="handleClose">
    </stock-lock-form>

    <!-- 新增解锁单弹窗 -->
    <stock-unlock-form :dialogFormVisible="dialogUnlockVisible" v-if="dialogUnlockVisible" :id="id"
                       @submitSuccess="submitUnlockSuccess" @handleClose="handleUnlockClose"
                       :selectedRows="selectedRows">
    </stock-unlock-form>
  </div>
</template>

<script>
  import {page} from '@/api/erp/wms/config/stockLock';
  import {getFloat} from '@/utils/util';

  export default {
    name: "stock-lock-list",
    components: {
      'stock-lock-form': () => import('./form'),
      'stock-unlock-form': () => import('./unlock'),
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          crtUserNo: undefined,
          selectType: 0  //只查询还未解锁的锁库记录
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogUnlockVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        }
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
    methods: {
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
        page(this.listQuery).then(response => {
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
            if (column.property == 'lockedQty') {
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
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleFilter() {
        this.listLoading = true;
        this.getList();
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
          limit: 20,
          selectType: 0,
          crtUserNo:undefined,
          crtUserName:undefined,
          skuNo: undefined,
          skuName: undefined,
        }
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleUnlock() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要解锁的单据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        this.id = '';
        this.dialogUnlockVisible = true;
      },
      handleUnlockClose() {
        this.id = '';
        this.dialogUnlockVisible = false;
      },
      submitUnlockSuccess() {
        this.dialogUnlockVisible = false;
        this.getList();
      },
    },
  }
</script>
