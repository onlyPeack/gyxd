<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container message">
      <el-form :inline="true">
        <el-form-item>
          <el-input clearable class="filter-item" style="width: 200px;vertical-align: super" placeholder="标题"
                    @keyup.enter.native="handleFilter" v-model="listQuery.title">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 200px;vertical-align: top" v-model="listQuery.msgType" placeholder="发布类型">
            <el-option v-for="(key,value) in messageType" :value="value" :label="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="billDate"
            type="daterange"
            align="right"
            unlink-panels
            style="vertical-align: sub"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-select style="width: 200px;vertical-align: top" v-model="listQuery.type" placeholder="发布对象">
            <el-option v-for="(key,value) in messageTargetType" :value="value" :label="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" :disabled="btnStatus.edit">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleRowDelete">删除</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              ref="analysisTable"
              highlight-current-row @selection-change="handleSelectionChange" :height="clientHeight"
              :row-class-name="tableRowClassName">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="消息标题" prop="title"></el-table-column>
      <el-table-column label="消息类型" prop="msgType" v-slot="{row}">
        <span>{{messageType[row.msgType]}}</span>
      </el-table-column>
      <el-table-column label="发布对象" prop="type" v-slot="{row}">
        <span>{{messageTargetType[row.type]}}</span>
      </el-table-column>
      <el-table-column label="发布内容" prop="content"></el-table-column>
      <el-table-column label="描述" prop="description"></el-table-column>
      <el-table-column label="发布时间" prop="releaseTime"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>


    <el-dialog modal-append-to-body append-to-body :title="textMap[dialogStatus]" :visible.sync="isShowDialog"
               v-if="isShowDialog" width="35%" top="15vh">
      <el-form :model="dataForm" label-width="120px" label-position="right" style="width: 90%" :rules="rules"
               ref="dataForm">
        <el-form-item label="消息标题：" prop="title">
          <el-input v-model="dataForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input v-model="dataForm.description" type="textarea" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="指定发布时间：" prop="releaseTime">
          <el-date-picker
            v-model="dataForm.releaseTime"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发布对象：" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio :label="value" v-for="(key,value) in messageTargetType">{{key}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布内容：" prop="content">
          <el-input v-model="dataForm.content" type="textarea" :rows="6"></el-input>
        </el-form-item>
      </el-form>
      <div style="height: 15px"></div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog=false" :loading="isLoading">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { selectPage as pages, updObj, deleteBatch, addObj } from '@/api/erp/operation/message'
  import { messageType, messageTargetType } from './common/common'

  export default {
    name: 'message',
    data() {
      return {
        clientHeight: 300,
        messageType,
        messageTargetType,
        list: undefined,
        total: undefined,
        isShowDialog: false,
        nowRow: {},
        listLoading: false,
        showDialog: false,
        dataForm: {},
        textMap: {//编辑&新建商品系列弹窗头部文字字典
          update: '编辑消息',
          create: '新增消息'
        },
        btnStatus: {
          edit: false
        },
        dialogStatus: 'create',
        rules: {//新增&编辑赠品表单验证
          'content': [{ required: true, message: '发布内容不能为空', trigger: 'blur' }],
          'title': [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
          'stock': [
            { required: true, message: '赠品库存不能为空', trigger: 'blur' },
            { type: 'number', message: '赠品库存只能为数字', trigger: 'blur' }
          ],
          'type': [{ required: true, message: '发布对象不能为空', trigger: 'blur' }],
          'releaseTime': [{ required: true, message: '发布时间不能为空', trigger: 'blur' }],
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
        this.billDate = []
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
        if (this.billDate.length > 0) {
          this.listQuery.startTime = this.billDate[0] + ' 00:00:00'
          this.listQuery.endTime = this.billDate[1] + ' 23:59:59'
        }
        pages(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
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
        this.isShowDialog = true
        this.dialogStatus = 'create'
      },

      /**
       * 设置排序&编辑推荐品牌对话框提交事件
       */
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isLoading = true
            let params = JSON.parse(JSON.stringify(this.dataForm))
            //判断当前为创建还是为编辑 并赋予相应的方法及提示信息
            let method = this.dialogStatus === 'create' ? addObj : updObj
            method(params).then(res => {
              if (Number(res.code) === 2000 || Number(res.code) === 200) {
                this.showSuccess(this.textMap[this.dialogStatus] + '成功!')
              } else {
                this.showError(this.textMap[this.dialogStatus] + '失败,' + res.msg || res.data)
              }
            }, error => this.showError(this.textMap[this.dialogStatus] + '失败,' + error))
          }
        })
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
        this.btnStatus.edit = val.length > 1
      },

      init() {
        this.showDialog = false
        this.isShowDialog = false
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
              this.showSuccess('删除消息成功!')
            } else {
              this.showError('删除消息失败,' + res.msg || res.data)
            }
          }, error => this.showError('删除消息失败,' + error))
        })
      },

      handleUpdate() {
        this.dataForm = this.selectedRows[0]
        this.isShowDialog = true
        this.dialogStatus = 'update'
      },

      showFeedbackDetail(row) {
        this.isShowDialog = true
        this.dataForm = Object.assign({}, row)
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

  .el-image-viewer__wrapper {
    z-index: 2002 !important;
  }
  .message .el-form-item--mini.el-form-item{
    margin-right: 0!important;
  }
</style>
