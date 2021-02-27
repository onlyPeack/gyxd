<template>
  <div class="bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                @keyup.enter.native="handleFilter" v-model="listQuery.billNo">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="操作人"
                @keyup.enter.native="handleFilter" v-model="listQuery.crtUserName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品编码"
                v-model="listQuery.skuNo"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.skuName">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight">
      <el-table-column align="center" label="单据编号" prop="orderNum">
      </el-table-column>
      <el-table-column align="center" label="操作人" prop="crtUserName">
      </el-table-column>
      <el-table-column align="center" label="商品编码" prop="skuNo">
      </el-table-column>
      <el-table-column align="center" label="商品名称" prop="skuName">
      </el-table-column>
      <el-table-column align="center" label="规格型号" prop="specifications">
      </el-table-column>
      <el-table-column align="center" label="仓库名称" prop="warehouseName">
      </el-table-column>
      <el-table-column align="center" label="仓位" prop="positionName">
      </el-table-column>
      <el-table-column align="center" label="操作类型" prop="operationName">
        <template slot-scope="scope">
          <span v-if="scope.row.operationName == '1'">解锁</span>
          <span v-else>锁库</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作数量" prop="count">
      </el-table-column>
      <el-table-column align="center" label="备注" prop="note">
      </el-table-column>
      <el-table-column align="center" label="单据时间" prop="crtTime">
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
  </div>
</template>

<style>

</style>

<script>
  import {page} from '@/api/erp/wms/config/stockLockLog';

  export default {
    name: 'index',
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          billNo: undefined,
          skuName: undefined,
          crtUserName: undefined,
          selectType: 1  //查询所有锁库记录，包括已经解锁的记录
        },
        clientHeight: 300
      }
    },
    created() {
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
          height = 48;
        }
        this.clientHeight = (document.body.clientHeight - (160 + height)) * 1;
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
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      filterStatus: function (value, row) {
        return row.status === value;
      },
    }
  }
</script>
