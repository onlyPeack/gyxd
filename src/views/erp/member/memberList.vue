<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="用户名"
                  @keyup.enter.native="handleFilter" v-model="listQuery.memberName">
        </el-input>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus">新增</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleRowDelete">编辑</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              ref="analysisTable"
              highlight-current-row @selection-change="handleSelectionChange" :height="clientHeight"
              :row-class-name="tableRowClassName">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="用户名" prop="username" align="center"></el-table-column>
      <el-table-column align="center" label="客户编号" prop="customer"></el-table-column>
      <el-table-column align="center" label="店铺" prop="umsMemberShop.storeName"></el-table-column>
      <el-table-column align="center" label="店主" prop="nickname"></el-table-column>
      <el-table-column align="center" label="会员类型" prop="accoutType" v-slot="{row}">
        <span>{{memberType[row.accoutType]}}</span>
      </el-table-column>
      <el-table-column align="center" label="企业抬头" prop="businessRise"></el-table-column>
      <el-table-column align="center" label="行业" prop="job"></el-table-column>
      <el-table-column align="center" label="客服"></el-table-column>
      <el-table-column align="center" label="推荐人" prop="recommendName"></el-table-column>
      <el-table-column align="center" label="注册时间" prop="createTime"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>


    <el-dialog modal-append-to-body append-to-body title="意见反馈" :visible.sync="isShowFeedbackDetail"
               v-if="isShowFeedbackDetail" width="35%" top="5vh">
      <el-form :model="dataForm" label-width="120px" label-position="right" style="width: 90%">
        <el-form-item label="用户名：">
          <el-input v-model="dataForm.memberName" disabled></el-input>
        </el-form-item>
        <el-form-item label="反馈内容：">
          <el-input v-model="dataForm.content" type="textarea" :rows="6" disabled></el-input>
        </el-form-item>
        <el-form-item label="批注：">
          <el-input v-model="dataForm.note" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div style="height: 15px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowFeedbackDetail=false" :loading="isLoading">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { page as pages, updObj,deleteBatch } from '@/api/erp/member/memberList'
  import { memberType } from './common/common'

  export default {
    name: 'memberList',
    data() {
      return {
        clientHeight: 300,
        memberType,
        list: undefined,
        total: undefined,
        isShowFeedbackDetail: false,
        nowRow: {},
        listLoading: false,
        showDialog: false,
        dataForm: {},
        textMap: {//编辑&新建商品系列弹窗头部文字字典
          update: '编辑优惠券',
          create: '新增优惠券'
        },
        rules: {//新增&编辑赠品表单验证
          'limitCollar': [{ required: true, message: '参与次数不能为空', trigger: 'blur' }],
          'name': [{ required: true, message: '优惠券名称不能为空', trigger: 'blur' }],
          'stock': [
            { required: true, message: '赠品库存不能为空', trigger: 'blur' },
            { type: 'number', message: '赠品库存只能为数字', trigger: 'blur' }
          ],
          'number': [{ required: true, message: '总张数不能为空', trigger: 'blur' }],
          'activityTime': [{ required: true, message: '活动时间不能为空', trigger: 'blur' }],
          'status': [{ required: true, message: '启用状态不能为空', trigger: 'blur' }]
        },
        selectedRows: [],
        isLoading: false,

        billDate: [],
        listQuery: {
          customerCode: undefined,
          customerName: undefined,
          userNo: undefined,
          userName: undefined,
          beginDate: undefined,
          endDate: undefined,
          page: 1,
          limit: 20
        }
      }
    },
    created() {
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.billDate=[]
        this.getList()
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight
        } else {
          height = 76
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.90
      },
      getList() {
        this.listLoading = true
        if(this.billDate.length>0){
          this.listQuery.start_time = this.billDate[0] + ' 00:00:00';
          this.listQuery.end_time = this.billDate[1] + ' 23:59:59';
        }
        pages(this.listQuery).then(response => {
          this.list = response.records
          this.total = response.total
          this.listLoading = false
        }).catch((error) => {
          console.log(error)
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },

      handleCreate() {
        this.dataForm = {
          rule: ['红包'],
          tag: ['券']
        }
        this.showDialog = true
        this.dialogStatus = 'create'
      },

      /**
       * 设置排序&编辑推荐品牌对话框提交事件
       */
      handleSubmit() {
        this.isLoading = true
        updObj(this.dataForm).then(res => {
          if (Number(res.code) === 2000 || Number(res.code) === 200) {
            this.showSuccess('操作成功!')
          } else {
            this.showError('操作失败,' + res.msg || res.data)
          }
        }, error => this.showError('操作失败,' + error))
      },

      /**
       * 错误处理方法
       * @param message 错误信息
       * @param code 错误码
       */
      showError(message, code) {
        if (Number(code) === 401) {
          this.$message.warning(message || '操作失败')
        } else {
          this.$message.error(message || '操作失败')
        }
        this.isLoading = false
      },

      /**
       * 成功处理方法
       * @param message 成功提示信息
       */
      showSuccess(message) {
        this.$message.success(message)
        this.init()
      },

      handleSelectionChange(val) {
        this.selectedRows = val
        this.btnStatus.audit = val.length > 1
      },

      init() {
        this.showDialog = false
        this.isShowFeedbackDetail = false
        this.isLoading = false
        this.getList()
      },
      /**
       *顶部按钮删除方法
       */
      handleRowDelete() {
        if (this.selectedRows.length < 1) {
          this.vueMessage('warning', '请至少选择一条数据')
          return false
        }
        let ids = []
        this.selectedRows.forEach((row) => {
          ids.push(row.id)
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBatch(ids.toString()).then((res) => {
            if (Number(res.code) === 200 || Number(res.code) === 2000) {
              this.showSuccess('删除意见反馈成功!')
            } else {
              this.showError('删除意见反馈失败,' + res.msg || res.data)
            }
          }, error => this.showError('删除意见反馈失败,' + error))
        })
      },

      handleUpdate() {
        this.dataForm = this.selectedRows[0]
        this.dataForm.rule = ['红包']
        this.dataForm.tag = ['券']
        this.dataForm.activityTime = [this.dataForm.startTime, this.dataForm.endTime]
        this.showDialog = true
        this.dialogStatus = 'update'
      },

      showFeedbackDetail(row) {
        this.isShowFeedbackDetail = true
        this.dataForm = row
      },

      tableRowClassName({ row, rowIndex }) {
        if (row.profit <= 0) {
          return 'danger-row'
        }
        return ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sales-detail-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }

  .xianji {
    width: 14px;
    height: 14px;
    background: url("http://hejigy.com.cn/questionMarksBlue.png") 100% 100% no-repeat;
    margin: 0;
    padding: 0;
  }
</style>
<style>
  /*.el-table{*/
  /*  overflow:visible !important;*/
  /*}*/
  .el-table .danger-row {
    background: #ffcece80;
  }
</style>
