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
          <el-form-item label="模板名称：">
            <el-input v-model="listQuery.templateName" class="input-width" placeholder="模板名称"></el-input>
          </el-form-item>
          <el-form-item label="模板CODE：">
            <el-input v-model="listQuery.templateCode" class="input-width" placeholder="模板CODE"></el-input>
          </el-form-item>
          <!--<el-form-item label="审核状态：">
            <el-select v-model="listQuery.templateStatus" clearable>
              <el-option v-for="item in templateStatusOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>短信列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table :data="list" style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="模板名称" width="150" align="center" prop="templateName"></el-table-column>
        <el-table-column label="模板CODE" width="150" align="center" prop="templateCode"></el-table-column>
        <el-table-column label="说明" width="250" prop="instructions"></el-table-column>
        <el-table-column label="模板内容" prop="templateText"></el-table-column>
        <el-table-column label="创建时间" width="150" align="center" prop="crtTime"></el-table-column>

        <!--        <el-table-column label="模板类型" align="center" prop="templateType">-->
        <!--          <template slot-scope="scope">-->
        <!--            <div v-for="item in templateTypeOptions" v-if="scope.row">-->
        <!--              <span v-if="item.value==scope.row.templateType">{{item.label}}</span>-->
        <!--            </div>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <!--<el-table-column label="审核状态" align="center" prop="templateStatus">
          <template slot-scope="scope">
            <div v-for="item in templateStatusOptions" v-if="scope.row">
              <span v-if="item.value==scope.row.templateStatus">{{item.label}}</span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
            <!--<el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>-->
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
                       :templateTypeOptions="templateTypeOptions"
                       @submitSuccess="submitSuccess" @handleClose="handleClose">
    </short-letter-form>

  </div>
</template>
<script>
  import { list, deletes } from '@/api/mall/SMSmessage/index'

  const defaultListQuery = {
    page: 1,
    limit: 10,
    templateName: null,
    templateCode: null,
    templateStatus: null
  }

  export default {
    name: 'shortLetterList',
    components: {
      'short-letter-form': () => import('./form')
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
        templateStatusOptions: [{
          value: 0,
          label: '未通过'
        }, {
          value: 1,
          label: '已通过'
        }],
        templateTypeOptions: [{
          value: 0,
          label: '验证码'
        }, {
          value: 1,
          label: '短信通知'
        }]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery)
      },
      handleSearchList() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.page = 1
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该短信模板?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('ids', row.id)
          deletes(params).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
      },
      handleAdd() {
        this.id = null
        this.isEdit = false
        this.dialogFormVisible = true
      },
      handleUpdate(index, row) {
        this.id = row.id
        this.isEdit = true
        this.dialogFormVisible = true
      },
      submitSuccess() {
        this.dialogFormVisible = false
        this.getList()
      },
      handleClose() {
        this.id = null
        this.dialogFormVisible = false
      },
      getList() {
        this.listLoading = true
        list(this.listQuery).then(response => {
          this.listLoading = false
          this.list = response.data.records
          this.total = response.data.total
        }).catch(res => {
          this.listLoading = false
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


