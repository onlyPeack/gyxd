<template> 
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" class="input-width" placeholder="服务单号"></el-input>
      <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-date-picker class="input-width" v-model="listQuery.createTime"
                      value-format="yyyy-MM-dd" type="date" placeholder="申请时间"></el-date-picker>
      <el-input v-model="listQuery.handleMan" class="input-width" placeholder="操作人员"></el-input>
      <el-date-picker class="input-width" v-model="listQuery.handleTime"
                      value-format="yyyy-MM-dd" type="date" placeholder="处理时间"></el-date-picker>

      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearchList()">查询</el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" @click="handleDownload()" :loading="downloadLoading">导出</el-button>
      <br/>
    </div>
    <div class="filter-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operateOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>

    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="服务单号" width="80" align="center" prop="id"></el-table-column>
        <el-table-column label="申请时间" min-width="80" align="center" prop="createTime"></el-table-column>
        <el-table-column label="用户账号" min-width="120" align="center" prop="memberUsername"></el-table-column>
        <el-table-column label="退款金额" min-width="120" align="center">
          <template slot-scope="scope">￥{{scope.row.returnAmount}}</template>
        </el-table-column>
        <el-table-column label="申请状态" min-width="120" align="center">
          <template slot-scope="scope">{{scope.row.status | formatStatus}}</template>
        </el-table-column>
        <el-table-column label="处理时间" min-width="120" align="center" prop="handleTime"></el-table-column>
        <el-table-column label="操作" width="300" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleViewOrder(scope.$index, scope.row)">查看详情</el-button>
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
        :current-page.sync="listQuery.page"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>

    <apply-detail :id="id" :visible="detailDialogVisible" @handleClose="detailHandleClose"></apply-detail>

  </div>
</template>
<script>
  import {deleteApply,selectPage} from '@/api/erp/mall/oms/apply/apply';
  import {formatDate} from '@/utils/date';
  import ApplyDetail from './applyDetail'
  const defaultListQuery = {
    page: 1,
    limit: 10,
    id: null,
    handleMan: null,
    status: null,
    createTime: null,
    handleTime: null,
  };
  export default {
    name: "returnApplyList",
    components:{ApplyDetail},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        operateOptions: [
          {
            label: "删除订单",
            value: 1
          }
        ],
        statusOptions: [
          {
            label: '待处理',
            value: 0
          },
          {
            label: '退货中',
            value: 1
          },
          {
            label: '已完成',
            value: 2
          },
          {
            label: '已拒绝',
            value: 3
          }
        ],
        id: undefined,
        detailDialogVisible: false,
        downloadLoading: false
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value) {
        if (value === 1) {
          return '退货中';
        } else if (value === 2) {
          return '已完成';
        } else if (value === 3) {
          return '已拒绝';
        } else {
          return '待处理';
        }
      },
    },
    methods: {
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleViewOrder(index, row){
        this.id = row.id
        this.detailDialogVisible = true
      },
      detailHandleClose(val) {
        this.detailDialogVisible = val;
        this.getList();
      },
      handleBatchOperate(){
        if(this.multipleSelection==null||this.multipleSelection.length<1){
          this.$message({
            message: '请选择要操作的订单',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        if(this.operateType===1){
          //删除订单
          let ids=[];
          for(let i=0;i<this.multipleSelection.length;i++){
            ids.push(this.multipleSelection[i].id);
          }
          this.deleteApply(ids);
        }
      },
      handleSizeChange(val){
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.page = val;
        this.getList();
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
        });
      },
      deleteApply(ids){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids",ids);
          deleteApply(params).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        })
      },
      handleDownload() {
        this.downloadLoading = true
        this.list = this.list==undefined||this.list==null?[]:this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['服务单号', '申请时间', '用户账号', '退款金额', '申请状态', '处理时间'];
          const filterVal = ['id', 'createTime', 'memberUsername', 'returnAmount', 'status', 'handleTime'];
          const _this = this;

          const list = this.multipleSelection.length > 0 ? this.multipleSelection : this.list;
          const data = JSON.parse(JSON.stringify(list))
          data.forEach(function (item, index) {
            item.status = _this.$options.filters.formatStatus(item.status);
            item.returnAmount = '￥' + item.returnAmount;
            data.push(item)
          })
          excel.export_json_to_excel2(tHeader, data, filterVal, '退货申请明细');
          this.downloadLoading = false;
        })
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .input-width {
    width: 200px;
  }

  .filter-container,.operate-container,.table-container,.batch-operate-container {
    margin-top: 20px;
  }

</style>

<style rel="stylesheet/scss" lang="scss">
  .oms-order-details-dialog, .oms-order-deliver-dialog {
    /*.el-dialog {
      height: 100vh;
    }*/
    /*.el-dialog__body {
      height: 85vh;
      overflow-y: auto;
    }*/

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__body {
      padding: 10px 20px 20px 20px !important;
      height: 86vh;
      overflow: auto;
    }

    .el-dialog__footer {
      position: absolute;
      background-color: #fff;
      z-index: 999;
      width: 100%;
      bottom: 0px;
      border-top: 1px solid #dcdfe6;
    }
  }

  .order-label {
    width: 100%;
    height: 30px;
  }
</style>
