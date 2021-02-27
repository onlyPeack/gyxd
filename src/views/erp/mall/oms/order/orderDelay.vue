<template> 
  <div class="app-container bill-container">
    <div class="filter-container" style="margin-bottom: 20px;">
      <el-input clearable v-model="listQuery.billNo" style="width:200px;" class="input-width" placeholder="单据编号"></el-input>
      <el-select v-model="listQuery.billStatus" style="width:200px;" class="input-width" placeholder="单据状态" clearable>
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-input clearable v-model="listQuery.orderSn" style="width:200px;" class="input-width" placeholder="订单编号"></el-input>
      <el-input clearable v-model="listQuery.crtUserName" style="width:200px;" class="input-width" placeholder="业务员"></el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearchList()">查询</el-button>
      <el-button type="danger" icon="el-icon-refresh" size="mini" @click="handleResetSearch()">重置</el-button>
    </div>
    <div class="table-container">
      <el-table ref="homeBrandTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="单据编号" align="center">>
          <template slot-scope="scope">
            <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)" v-if="scope.row.billNo">
              {{scope.row.billNo}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center" width="90">
          <template slot-scope="scope">
            <div v-for="item in statusOptions" v-if="scope.row.billStatus">
              <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单编号" width="420" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="延时发货天数" width="420" align="center">
          <template slot-scope="scope">{{scope.row.delayedDays}}</template>
        </el-table-column>
        <el-table-column label="延时发货原因" width="400" align="center">
          <template slot-scope="scope">{{scope.row.delayedReason}}</template>
        </el-table-column>
        <el-table-column label="业务员" width="140" align="center">
          <template slot-scope="scope">{{scope.row.crtUserName}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope" v-if="user=='00000'">
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>
    <!-- 详情弹窗 -->
    <order-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                               @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </order-view>
  </div>
</template>
<script>
  import {page,delObj,getObj,addObj,putObj} from '@/api/erp/mall/oms/order/orderDelayed';
  import {uploadPath} from '@/api/erp/goods/storage'

  const defaultListQuery = {
    page: 1,
    limit: 5,
    billStatus: null,
    billNo: null,
    orderSn: null,
    crtUserName:null,
  };
  export default {
    name: 'orderDelay',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        dialogDetailVisible: false,
        user:'',
      }
    },
    components: {
      'order-view': () => import('./orderView'),
    },
    created() {
      this.user = this.$store.getters.code;
      this.getList();
    },
    methods: {
      handleDetailClose(){
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess(){
        this.dialogDetailVisible = false;
        this.id = '';
        this.getList();
      },
      handleOpenDetailOrForm(row){
        this.id = row.id;
        this.dialogDetailVisible = true;
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.records;
          this.total = response.total;
        })
      },
    }
  }
</script>
<style></style>


