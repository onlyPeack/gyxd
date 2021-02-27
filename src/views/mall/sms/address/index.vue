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
          <el-form-item label="公司名称：">
            <el-input v-model="listQuery.companyName" class="input-width" placeholder="公司名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号：">
            <el-input v-model="listQuery.mobile" class="input-width" placeholder="手机号码"></el-input>
          </el-form-item>
          <el-form-item label="职业：">
            <el-input v-model="listQuery.job" class="input-width" placeholder="职业"></el-input>
          </el-form-item>

        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>会员列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加会员信息</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.memberId}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="120" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="手机号" align="center">
          <template slot-scope="scope">{{scope.row.phoneNumber}}</template>
        </el-table-column>
        <!--<el-table-column label="性别" width="120" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.row.gender==0?'未知':scope.row.gender==1?'男':'女'}}-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="手机号码" width="120" align="center">-->
          <!--<template slot-scope="scope">{{scope.row.mobile }}</template>-->
        <!--</el-table-column>-->
        <el-table-column label="邮政编码" width="120" align="center">
          <template slot-scope="scope">{{scope.row.postCode}}</template>
        </el-table-column>
        <el-table-column label="省份直辖区" width="120" align="center">
          <template slot-scope="scope">{{scope.row.province}}</template>
        </el-table-column>
        <!--<el-table-column label="生日" width="180" align="center">-->
          <!--<template slot-scope="scope">{{scope.row.birthday }}</template>-->
        <!--</el-table-column>-->
        <el-table-column label="所在城市" width="120" align="center">
          <template slot-scope="scope">{{scope.row.city}}</template>
        </el-table-column>
        <el-table-column label="区域" width="120" align="center">
          <template slot-scope="scope">{{scope.row.region}}</template>
        </el-table-column>
        <el-table-column label="详细地址" width="120" align="center">
          <template slot-scope="scope">{{scope.row.detailAddress }}</template>
        </el-table-column>

        <!--<el-table-column label="启动/禁用" width="120" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<el-switch-->
              <!--@change="handleUpdateStatus(scope.$index, scope.row)"-->
              <!--:active-value="0"-->
              <!--:inactive-value="1"-->
              <!--v-model="scope.row.status">-->
            <!--</el-switch>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
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
    <home-advertise-form v-if="dialogFormVisible" :dialogFormVisible="dialogFormVisible" :id="id" :isEdit="isEdit"
                         @submitSuccess="submitSuccess" @handleClose="handleClose">
    </home-advertise-form>

  </div>
</template>
<script>
  import {fetchList, updateStatus, deleteHomeCentre,createHomeCentre,updateHomeCentre,getHomeCentre} from '@/api/mall/sms/homeCenter';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    page: 1,
    limit: 5,
    name: null,
    type: null,
    endTime: null
  };
  const defaultTypeOptions = [
    {
      label: 'PC首页轮播',
      value: 0
    },
    {
      label: 'APP首页轮播',
      value: 1
    }
  ];
  export default {
    name: 'homeAdvertiseList',
    components: {
      'home-advertise-form': () => import('./form'),
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        id: null,
        listLoading: false,
        dialogFormVisible: false,
        isEdit: false,
        multipleSelection: [],
        operates: [
          {
            label: "删除",
            value: 0
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
          //删除
          this.deleteHomeCentre(ids);
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
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
          this.list = response.data.records;
          this.total = response.data.total;
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


