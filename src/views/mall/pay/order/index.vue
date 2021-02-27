<template> 
  <div class="app-container bill-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="支付订单号：">
            <el-input v-model="listQuery.payOrderId" class="input-width" placeholder="支付订单号"></el-input>
          </el-form-item>
          <el-form-item label="商户ID：">
            <el-input v-model="listQuery.mchId" class="input-width" placeholder="商户ID"></el-input>
          </el-form-item>
          <el-form-item label="渠道ID：">
            <el-input v-model="listQuery.channelId" class="input-width" placeholder="渠道ID"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>支付订单信息</span>
      <!--<el-button size="mini" class="btn-add" @click="handleAdd()">添加支付渠道信息</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="支付订单号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.payOrderId}}</template>
        </el-table-column>
        <el-table-column label="商户ID" width="120" align="center">
          <template slot-scope="scope">{{scope.row.mchId}}</template>
        </el-table-column>
        <el-table-column label="渠道ID" align="center">
          <template slot-scope="scope">{{scope.row.channelId}}</template>
        </el-table-column>
        <el-table-column label="支付金额" align="center">
          <template slot-scope="scope">{{scope.row.amount}}</template>
        </el-table-column>
        <el-table-column label="支付货币" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.currency=='c'?'人民币':'其他货币'}}
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.status==0?'订单生成':scope.row.status==1?'支付中':scope.row.status==2?'支付成功':'业务处理完成'}}
          </template>
        </el-table-column>
        <el-table-column label="客户端IP" align="center">
          <template slot-scope="scope">{{scope.row.clientIp}}</template>
        </el-table-column>
        <el-table-column label="设备" align="device">
          <template slot-scope="scope">{{scope.row.device}}</template>
        </el-table-column>
        <el-table-column label="商品描述信息" width="120" align="center">
          <template slot-scope="scope">{{scope.row.body}}</template>
        </el-table-column>
        <el-table-column label="渠道商户ID" width="120" align="center">
        <template slot-scope="scope">{{scope.row.channelMchId}}</template>
        </el-table-column>
        <el-table-column label="渠道订单号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.channelOrderNo}}</template>
        </el-table-column>
        <el-table-column label="渠道支付错误码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.errCode}}</template>
        </el-table-column>
        <el-table-column label="通知地址" width="120" align="center">
          <template slot-scope="scope">{{scope.row.notifyUrl}}</template>
        </el-table-column>
        <el-table-column label="通知次数" width="120" align="center">
          <template slot-scope="scope">{{scope.row.notifyCount}}</template>
        </el-table-column>
        <el-table-column label="最后一次通知时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.lastNotifyTime }}</template>
        </el-table-column>
        <el-table-column label="订单失效时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.expireTime }}</template>
        </el-table-column>
        <el-table-column label="订单支付成功时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.paySuccTime }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="更新时间" width="180" align="center">
          <template slot-scope="scope">{{scope.row.updateTime }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">查看信息
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
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

    <!--新增、编辑-->
    <home-advertise-form v-if="dialogFormVisible" :dialogFormVisible="dialogFormVisible" :row="row" :isEdit="isEdit"
                         @submitSuccess="submitSuccess" @handleClose="handleClose">
    </home-advertise-form>

  </div>
</template>
<script>
  import {fetchList, getHomeCentre} from '@/api/mall/pay/order';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    page: 1,
    limit: 5,
    name: null,
    type: null,
    endTime: null
  };

  export default {
    name: 'homeAdvertiseList',
    components: {
      'home-advertise-form': () => import('./form'),
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        row: {},
        listLoading: false,
        dialogFormVisible: false,
        isEdit: false,
        multipleSelection: [],
        operates: [
          {
            // label: "删除",
            //value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      this.getList();
    },

    methods: {
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
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if (this.operateType === 0) {

        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleUpdate(index, row) {
        this.row = JSON.parse(JSON.stringify(row));
        this.isEdit = true;
        this.dialogFormVisible = true;
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleClose() {
        this.row = {};
        this.dialogFormVisible = false;
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        })
      },
    }
  }
</script>
<style lang="scss" scoped>
  .bill-container {
    margin: 0px;

    .el-dialog__body {
      height: 92vh;
    }

    .input-width {
      width: 203px;
    }
  }
</style>


