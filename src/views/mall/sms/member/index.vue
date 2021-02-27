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
          <el-form-item label="用户名：">
            <el-input v-model="listQuery.username" class="input-width" placeholder="用户名称"></el-input>
          </el-form-item>
<!--          <el-form-item label="昵称：">-->
<!--            <el-input v-model="listQuery.nickname" class="input-width" placeholder="昵称"></el-input>-->
<!--          </el-form-item>-->
          <el-form-item label="手机号：">
            <el-input v-model="listQuery.mobile" class="input-width" placeholder="手机号码"></el-input>
          </el-form-item>

          <el-form-item label="客户编号：">
            <el-input v-model="listQuery.customer" class="input-width" placeholder="客户编号"></el-input>
          </el-form-item>
          <el-form-item label="公司名称：">
            <el-input v-model="listQuery.companyName" class="input-width" placeholder="公司名称"></el-input>
          </el-form-item>

          <el-form-item label="所属业务员：">
            <el-input v-model="listQuery.salesman" class="input-width" placeholder="所属业务员"></el-input>
          </el-form-item>
           <el-form-item label="来源:" prop="resource" class="el-form-flex">
              <el-select v-model="listQuery.resource" style="width: 100%;">
                <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>会员列表</span>
<!--      <el-button size="mini" class="btn-add" @click="handleAdd()">添加会员信息</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="用户名">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
<!--        <el-table-column label="昵称">-->
<!--          <template slot-scope="scope">{{scope.row.nickname}}</template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="性别" width="120" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            {{scope.row.gender==0?'未知':scope.row.gender==1?'男':scope.row.gender==2?'女':''}}-->
<!--          </template>-->
<!--        </el-table-column>-->
        <el-table-column label="手机号码"align="center">
          <template slot-scope="scope">{{scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column label="客户编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.customer}}</template>
        </el-table-column>
        <el-table-column label="公司名称">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <el-table-column label="来源">
          <template slot-scope="scope">{{scope.row.resource}}</template>
        </el-table-column>
        <el-table-column label="推荐码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.recommendCode}}</template>
        </el-table-column>
        <el-table-column label="所属业务员" width="120" align="center">
          <template slot-scope="scope">{{scope.row.salesman}}</template>
        </el-table-column>
        <el-table-column label="注册时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column label="启动/禁用" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.status == 0 ? '禁用': scope.row.status == 1 ? '启用' : '审核中'  }}
          </template>
        </el-table-column>
        <el-table-column label="审核" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.auditStatus==0?'审核中':scope.row.auditStatus==1?'未通过':'通过'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <!--<el-button size="mini"-->
            <!--type="text"-->
            <!--@click="handleDelete(scope.$index, scope.row)">删除-->
            <!--</el-button>-->
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

    <!--新增、编辑-->
    <home-advertise-form v-if="dialogFormVisible" :dialogFormVisible="dialogFormVisible" :id="id" :isEdit="isEdit"
                         @submitSuccess="submitSuccess" @handleClose="handleClose">
    </home-advertise-form>

  </div>
</template>
<script>
  import {
    fetchList,
    updateStatus,
    deleteHomeCentre,
    createHomeCentre,
    updateHomeCentre,
    getHomeCentre
  } from '@/api/mall/sms/homeCenter';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    page: 1,
    limit: 5,
    username: null,
    companyName: null,
    mobile: null,
    salesman: null,
    customer: null,
    nickname: null
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
        id: null,
        listLoading: false,
        dialogFormVisible: false,
        isEdit: false,
        multipleSelection: [],
        sourceOptions:[{value: '网络搜索', label: '网络搜索'}, {value: '朋友推荐', label: '朋友推荐'}, {value: '其他', label: '其他'}]
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
      handleUpdateStatus(index, row) {
        this.$confirm('是否要修改启用/禁用状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          updateStatus(row.id, {status: row.status}).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });

        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      handleDelete(index, row) {
        this.deleteHomeCentre(row.id);
      },
      handleAdd() {
        this.id = null;
        this.isEdit = false;
        this.dialogFormVisible = true;
      },
      handleUpdate(index, row) {
        this.id = row.id;
        this.isEdit = true;
        this.dialogFormVisible = true;
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleClose() {
        this.id = null;
        this.dialogFormVisible = false;
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.records;
          this.total = response.total;
        })
      },
      deleteHomeCentre(ids) {
        this.$confirm('是否要删除该会员信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteHomeCentre(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      }
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


