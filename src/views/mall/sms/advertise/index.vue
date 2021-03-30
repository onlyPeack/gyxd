<template> 
  <div class="app-container bill-container sales-detail-list-container full-purchase bill-container">
    <div style="margin-top: 15px">
      <el-input v-model="listQuery.name" placeholder="广告名称" style="width: 200px"></el-input>
      <!--          <el-form-item label="广告位置：">-->
      <!--            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">-->
      <!--              <el-option v-for="item in typeOptions"-->
      <!--                         :key="item.value"-->
      <!--                         :label="item.label"-->
      <!--                         :value="item.value">-->
      <!--              </el-option>-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <el-date-picker
        v-model="listQuery.endTime"
        value-format="yyyy-MM-dd"
        type="date"
        placeholder="到期时间">
      </el-date-picker>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearchList">
        搜索
      </el-button>
      <el-button
        icon="el-icon-delete"
        @click="handleResetSearch">
        重置
      </el-button>
    </div>
    <el-button size="mini" class="btn-add" @click="handleAdd" type="text" icon="el-icon-plus">添加</el-button>
    <el-button size="mini" class="btn-add" @click="handleBatchOperate" type="text" icon="el-icon-delete">删除</el-button>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                :height="clientHeight"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="广告名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <!--        <el-table-column label="广告位置" width="120" align="center">-->
        <!--          <template slot-scope="scope">{{scope.row.type | formatType}}</template>-->
        <!--        </el-table-column>-->
        <el-table-column label="广告类型" width="120" align="center" v-slot="{row}">
          <span v-if="row.urlType*1===0">地址链接</span>
          <span v-else-if="row.urlType*1===1">视频链接</span>
        </el-table-column>
        <el-table-column label="广告图片" align="center" prop="pic" v-slot="{row}">
          <el-image :src="row.pic" style="height: 80px" :preview-src-list="[row.pic]"></el-image>
        </el-table-column>
        <el-table-column label="时间" width="220" align="center">
          <template slot-scope="scope">
            <p>开始时间：{{scope.row.startTime | formatTime}}</p>
            <p>到期时间：{{scope.row.endTime | formatTime}}</p>
          </template>
        </el-table-column>
        <el-table-column label="上线/下线" width="120" align="right">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.status">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="点击次数" width="120" align="center">
          <template slot-scope="scope">{{scope.row.clickCount}}</template>
        </el-table-column>
        <el-table-column label="生成订单" width="120" align="center">
          <template slot-scope="scope">{{scope.row.orderCount}}</template>
        </el-table-column>
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
  import { fetchList, updateStatus, deleteHomeAdvertise } from '@/api/mall/sms/homeAdvertise'
  import { formatDate } from '@/utils/date'

  const defaultListQuery = {
    page: 1,
    limit: 5,
    name: null,
    type: null,
    endTime: null
  }
  const defaultTypeOptions = [
    {
      label: 'PC首页轮播',
      value: 0
    },
    {
      label: 'APP首页轮播',
      value: 1
    },
    {
      label: '闲置首页轮播',
      value: 2
    },
    {
      label: '工业小店轮播',
      value: 3
    }
  ]
  export default {
    name: 'homeAdvertiseList',
    components: {
      'home-advertise-form': () => import('./form')
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        clientHeight: 300,
        list: null,
        total: null,
        id: null,
        listLoading: false,
        dialogFormVisible: false,
        isEdit: false,
        multipleSelection: [],
        operates: [
          {
            label: '删除',
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
      // this.$nextTick(()=>{
      //   this.$refs['homeAdvertiseTable'].doLayout()
      // })
    },
    updated() {
      this.changeDivHeight()
    },
    filters: {
      formatType(type) {
        if (type === 1) {
          return 'APP首页轮播'
        } else if (type === 0) {
          return 'PC首页轮播'
        } else {
          return '闲置首页轮播'
        }
      },
      formatTime(time) {
        if (time == null || time === '') {
          return 'N/A'
        }
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery)
      },
      handleSearchList() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
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
      handleUpdateStatus(index, row) {
        this.$confirm('是否要修改上线/下线状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStatus(row.id, { status: row.status }).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          })
          this.getList()
        })
      },
      handleDelete(index, row) {
        this.deleteHomeAdvertise(row.id)
      },
      handleBatchOperate() {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          })
          return
        }
        let ids = []
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id)
        }
        if (this.operateType === 0) {
          //删除
          this.deleteHomeAdvertise(ids)
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          })
        }
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
        this.listQuery.type = 3
        fetchList(this.listQuery).then(response => {
          this.listLoading = false
          this.list = response.data.records
          this.total = response.data.total
        })
      },
      deleteHomeAdvertise(ids) {
        this.$confirm('是否要删除该广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams()
          params.append('ids', ids)
          deleteHomeAdvertise(params).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight
        } else {
          height = 76
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.90
      },
    }
  }
</script>
<style lang="scss" scoped>
  .bill-container {
    margin: 0px;

    .batch-operate-container {
      margin-top: 10px;
    }

    .el-dialog__body {
      height: 92vh;
    }

    .input-width {
      width: 203px;
    }
  }
</style>


