<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="padding-bottom: 0px;">
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
          <el-form-item label="单位名称：">
            <el-input v-model="listQuery.entityName" class="input-width" placeholder="单位名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人：">
            <el-input v-model="listQuery.contact" class="input-width" placeholder="联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：">
            <el-input v-model="listQuery.phone" class="input-width" placeholder="联系电话"></el-input>
          </el-form-item>
          <el-form-item label="经营类别：">
            <el-input v-model="listQuery.category" class="input-width" placeholder="经营类别"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>报名信息列表</span>
      <el-button size="mini" @click="handleAdd()">添加</el-button>
      <el-button size="mini" type="primary" @click="handleBatchDetele()">删除</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                @selection-change="handleSelectionChange"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column label="单位名称" width="150" align="center" prop="entityName">
        </el-table-column>
        <el-table-column label="经营类别" align="center" prop="category">
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="contact">
        </el-table-column>
        <el-table-column label="联系电话" align="center" prop="phone">
        </el-table-column>
        <el-table-column label="邮箱" align="center" prop="email">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="note">
        </el-table-column>
        <el-table-column label="创建日期" align="center" prop="crtTime">
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <!--<el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>-->
            <el-button size="mini" type="text" @click="handleDelete(scope.row.id)">删除
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

    <!--新增、编辑-->
    <short-letter-form v-if="dialogFormVisible" :dialogFormVisible="dialogFormVisible" :id="id" :isEdit="isEdit"
                       @submitSuccess="submitSuccess" @handleClose="handleClose">
    </short-letter-form>

  </div>
</template>
<script>
  import {list, deletes} from '@/api/mall/online/index';
  import {formatDate} from '@/utils/date';

  const defaultListQuery = {
    page: 1,
    limit: 5,
    entityName: null,
    contact: null,
    phone: null,
    category: null,
  };

  export default {
    name: 'signUpInfoList',
    components: {
      'short-letter-form': () => import('./form'),
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        multipleSelection: [],
        list: null,
        total: null,
        id: null,
        listLoading: false,
        dialogFormVisible: false,
        isEdit: false,
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
      handleDelete(ids) {
        this.$confirm('是否要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deletes(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
      handleBatchDetele() {
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
        //删除
        this.handleDelete(ids);
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
        list(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        }).catch(res => {
          this.listLoading = false;
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


