<template>

  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-order-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                  v-model="listQuery.customerCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                  v-model="listQuery.customerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户负责人"
                  v-model="listQuery.managerName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户联系人"
                  v-model="listQuery.linkMan"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      </div>
      <div class="query-container">
        <el-select v-model="listQuery.customerType" placeholder="客户类型" clearable style="width: 200px"
                   class="filter-item">
          <el-option v-for="item in customerTypeOptions" :key="item.id" :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
        <el-select v-model="listQuery.customerAttribute" placeholder="客户属性" clearable class="filter-item"
                   style="width: 200px">
          <el-option v-for="item in customerAttributeOptions" :key="item.id" :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态" clearable class="filter-item" style="width: 200px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <el-date-picker style="position: relative;top:-4px;"
                        v-model="date"
                        type="daterange"
                        align="right"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="创建开始日期"
                        end-placeholder="创建结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleDateSelect"
                        :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-dropdown style="margin-left: 10px;">
        <el-button type="text" icon="el-icon-more">更多</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-edit" @click="handleBatchUpdate">批量修改</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-check" @click="handleUpdateStatus('0')">启用</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-close" @click="handleUpdateStatus('1')">禁用</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-upload2" @click="createShopping">生成商城用户</el-button>
          </el-dropdown-item>
          <el-dropdown-item>
            <el-button type="text" icon="el-icon-download" @click="createEnterpriseAndShopUserUsingPOST">生成企业购用户</el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--<el-button type="text" icon="el-icon-download" style="padding-left: 1550px">-->
      <!--<a href="/api/crm/customer/download">下载导入模板</a>-->
      <!--</el-button>-->
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" @row-click="handleRowClick" ref="dataTable"
              element-loading-text="正在查询中。。。" @selection-change="handleChangeFun" border fit highlight-current-row
              :height="clientHeight" :default-sort="{prop: 'customerCode', order: 'descending'}">
      <el-table-column align="center" type="index" width="50" fixed="left">
      </el-table-column>
      <el-table-column align="center" type="selection" width="50" fixed="left">
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status" width="90">
        <template slot-scope="scope">
          <span v-for="item in statusOptions">
            <span v-if="scope.row.status ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户编号" fixed="left" prop="customerCode" width="100" sortable>
      </el-table-column>
      <el-table-column label="客户全称" fixed="left">
        <template slot-scope="scope">
          <span style="color: #4F90E2" @click="handleCustomerInfoShow(scope.row)">{{scope.row.customerName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="客户负责人" prop="managerName" width="100">
      </el-table-column>
      <el-table-column align="center" label="客户联系人" prop="linkMan" width="100">
      </el-table-column>
      <el-table-column align="center" label="客户税号" prop="taxpayerNumber" width="180">
      </el-table-column>
      <el-table-column align="center" label="收票人" prop="spMan" width="100">
      </el-table-column>
      <el-table-column align="center" label="收票电话" prop="spTel" width="100">
      </el-table-column>
      <el-table-column label="收票地址" prop="spAddress">
      </el-table-column>
      <!--      <el-table-column align="center" label="客户类型" prop="customerType" width="100">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-for="item in customerTypeOptions">-->
      <!--            <span v-if="scope.row.customerType ===item.id">{{item.name}}</span>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" label="客户属性" prop="customerAttribute" width="100">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-for="item in customerAttributeOptions">-->
      <!--            <span v-if="scope.row.customerAttribute ===item.name">{{item.name}}</span>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" label="客户行业" prop="customerIndustry" width="100">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-for="item in customerIndustryOptions">-->
      <!--            <span v-if="scope.row.customerIndustry ===item.name">{{item.name}}</span>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" label="客户等级" prop="customerGrade" width="100">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-for="item in customerGradeOptions">-->
      <!--            <span v-if="scope.row.customerGrade ===item.id">{{item.name}}</span>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" label="结算方式" prop="paymentsMeans">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span v-for="item in paymentsMeansOptions">-->
      <!--            <span v-if="scope.row.paymentsMeans ===item.label">{{item.label}}</span>-->
      <!--          </span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="客户等级" prop="level">
        <template slot-scope="scope">
          <span v-for="(item,index) in levelOptions" :key="index">
            <span v-if="scope.row.level ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" prop="crtTime" width="150" sortable>
      </el-table-column>
      <el-table-column align="center" label="修改时间" prop="updTime" width="150">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 客户详情弹窗 -->
    <el-dialog title="客户详情" v-if="customerInfoVisible" :visible.sync="customerInfoVisible" width="70%"
               :before-close="handleClose">
      <customer-view :id="id" ref="customerInfoDialog"
                     :customerTypeOptions="customerTypeOptions"
                     :customerGradeOptions="customerGradeOptions"
                     :customerAttributeOptions="customerAttributeOptions"
                     :customerIndustryOptions="customerIndustryOptions"
                     :paymentsMeansOptions="paymentsMeansOptions"
                     :collectionTermsOptions="customerTypeOptions"></customer-view>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleCustomerInfoClose">关闭</el-button>
      </span>
    </el-dialog>

    <!--创建或编辑客户-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="60%">
      <customer-form :id="id"
                     :customerTypeOptions="customerTypeOptions"
                     :customerGradeOptions="customerGradeOptions"
                     :paymentsMeansOptions="paymentsMeansOptions"
                     :collectionTermsOptions="collectionTermsOptions"
                     :customerAttributeOptions="customerAttributeOptions"
                     :customerIndustryOptions="customerIndustryOptions"
                     :isLoading="isLoading"
                     @submitSuccess="submitSuccess"
                     @submitWaring="submitWaring"
                     ref="customerForm" v-if="dialogFormVisible"></customer-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="filter-item" @click="handlerCancel()">取消</el-button>
        <el-button size="medium" class="filter-item" type="primary" icon="edit"
                   @click="handlerOnSubmit()" :loading="isLoading">提交</el-button>
      </span>
    </el-dialog>

    <!-- 批量修改客户 -->
    <el-dialog title="批量修改" :visible.sync="dialogBatchUpdateVisible">
      <div style="margin-top: -20px;text-align: center"><span style="font-size: large">你已选择{{this.selectedRows.length}}个客户</span>
      </div>
      <el-form :model="dataForm" ref="dataForm">
        <el-form-item label="变更负责人">
          <span @click="handleManagerShow">
            <svg-icon icon-class="add"></svg-icon>
          </span>
          <el-tag v-for="tag in customerManagerArr" :key="tag.name" :type="tag.type" closable
                  @close="handleManagerDel">
            {{tag.name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="新增可查看用户" prop="addCusFollowUserIds">
          <el-input v-model="dataForm.addCusFollowUserIds" clearable></el-input>
        </el-form-item>
        <el-form-item label="移除可查看用户" prop="removeCusFollowUserIds">
          <el-input v-model="dataForm.removeCusFollowUserIds" clearable></el-input>
        </el-form-item>
        <el-form-item label="收款条件" prop="collectionTerms">
          <el-select class="filter-item" v-model="dataForm.collectionTerms" placeholder="请输入收款条件">
            <el-option v-for="item in collectionTermsOptions" :key="item.id" :label="item.labelDefault"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="信用期限" prop="creditPeriod">
          <el-input-number v-model="dataForm.creditPeriod" :min="1" :max="365" label="信用期限"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatchUpdateVisible = false">取消</el-button>
        <el-button type="primary" @click="batchUpdate">确定</el-button>
      </div>
    </el-dialog>

    <!-- 客户负责人列表弹窗-->
    <el-dialog title="请选择人员" :visible.sync="customerManagerVisible" append-to-body>
      <customer-manager @closeUserDialog="closeUserDialog" :isSingle="true"
                        ref="customerManagerDialog"></customer-manager>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="handleManagerCancel">取消</el-button>
        <el-button size="medium" type="primary" @click="handleManagerConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { page, batchDel, updateStatus, batchUpdate } from '@/api/erp/crm/customer/index'
  import { createShopUser,createEnterpriseAndShopUserUsingPOST } from '@/api/mall/sms/homeCenter'
  import { getTypeValue } from '@/api/dict/dictValue/index'
  import { page as pageType } from '@/api/erp/crm/customerType'
  import { page as pageGrade } from '@/api/erp/crm/customerGrade'
  import { page as pagePayments } from '@/api/erp/financial/financialPaymentsMeans'
  import { getToken } from '@/utils/auth'

  export default {
    name: 'customerList',
    components: {
      'customer-form': () => import('./customerForm'),
      'customer-view': () => import('./customerView'),
      'customer-manager': () => import('@/components/ERP/User/user')
    },
    data() {
      return {
        clientHeight: 300,
        headers: null,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        dialogStatus: '',
        dialogFormVisible: false,
        customerInfoVisible: false,
        id: '',
        date: undefined,
        listQuery: {
          page: 1,
          limit: 10,
          crtUserNo: undefined,
          crtUserName: undefined,
          departName: undefined
        },
        customerTypeOptions: [],
        customerGradeOptions: [],
        customerAttributeOptions: [],
        customerIndustryOptions: [],
        collectionTermsOptions: [],
        paymentsMeansOptions: [],
        statusOptions: [{
          value: '2',
          label: '全部'
        }, {
          value: '0',
          label: '正常'
        }, {
          value: '1',
          label: '禁用'
        }],
        levelOptions: [{
          value: 10,
          label: '青铜'
        }, {
          value: 20,
          label: '白银'
        }, {
          value: 30,
          label: '黄金'
        }, {
          value: 40,
          label: '铂金'
        }, {
          value: 50,
          label: '钻石'
        }, {
          value: 60,
          label: '至尊'
        }],
        textMap: {
          update: '编辑客户',
          create: '创建客户'
        },
        selectedRows: [],
        dialogBatchUpdateVisible: false,
        dataForm: {
          managerId: '',
          managerName: '',
          addCusFollowUserIds: '',
          removeCusFollowUserIds: '',
          paymentsMeans: '1',
          creditPeriod: ''
        },
        customerManagerArr: [],
        fileList: [],
        customerManagerVisible: false
      }
    },
    created() {
      this.headers = {
        Authorization: getToken()
      }
      this.getList()
      const listQueryGrade = {
        status: 0, // 启用
        page: 1,
        limit: 20
      }
      const listQueryType = {
        status: 0, // 启用
        name: undefined,
        type: 'customer_type',
        page: 1,
        limit: 20
      }
      const listQueryAttribute = {
        status: 0, // 启用
        name: undefined,
        type: 'customer_attribute',
        page: 1,
        limit: 20
      }
      const listQueryIndustry = {
        status: 0, // 启用
        name: undefined,
        type: 'customer_industry',
        page: 1,
        limit: 20
      }
      pageType(listQueryType).then(response => {
        console.log(1234)
        console.log(response)
        this.customerTypeOptions = response.data.records
      })
      pageType(listQueryAttribute).then(response => {
        this.customerAttributeOptions = response.data.records
      })
      pageType(listQueryIndustry).then(response => {
        this.customerIndustryOptions = response.data.records
      })
      pageGrade(listQueryGrade).then(response => {
        this.customerGradeOptions = response.data.records
      })
      pagePayments(listQueryGrade).then(response => {
        console.log(response)
        if (response) {
          this.paymentsMeansOptions = response.data.records
        }
      })
      getTypeValue('collection_terms').then(response => {
        this.collectionTermsOptions = response.data.rows
      })

      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 114
        }
        this.clientHeight = (document.body.clientHeight - (170 + height)) * 1
      },
      getList() {
        this.listLoading = true
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records
            this.total = response.data.total
            this.listLoading = false
          })
      },
      handleFilter() {
        this.getList()
      },
      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 10,
          crtUserNo: undefined,
          crtUserName: undefined,
          departName: undefined
        }
        this.date = undefined
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
        this.id = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          })
          return false
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        this.id = this.selectedRows[0].id
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      },
      createShopping() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要生成商城客户的条目',
            type: 'success',
            duration: 2000
          })
          return false
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个生成商城客户的条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        var mobile = /^(1[3-9])\d{9}$/
        if (!this.selectedRows[0].linkPhone || this.selectedRows[0].linkPhone == undefined) {
          this.vueMessage('warning', '请确认客户维护了默认收货地址')
          return
        }
        if (!mobile.test(this.selectedRows[0].linkPhone.replace(/\s/g, ''))) {
          this.vueMessage('warning', '请维护客户正确的手机号')
          return
        } else {
          createShopUser(this.selectedRows[0].customerCode).then(res => {
            if (res.code === 200 || res.code === '2000') {
              this.vueMessage('success', '生成商城客户成功!')
            } else {
              this.vueMessage('warning', res.msg)
            }
            this.getList()
          })
        }
      },
      createEnterpriseAndShopUserUsingPOST() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要生成商城客户的条目',
            type: 'success',
            duration: 2000
          })
          return false
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个生成商城客户的条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        var mobile = /^(1[3-9])\d{9}$/
        console.log('this.selectedRows');
        console.log(this.selectedRows);
        // if (!this.selectedRows[0].linkPhone || this.selectedRows[0].linkPhone == undefined) {
        //   this.vueMessage('warning', '请确认客户维护了默认收货地址')
        //   return
        // }
        
        if (!this.selectedRows[0].linkPhone || !mobile.test(this.selectedRows[0].linkPhone.replace(/\s/g, ''))) {
          this.vueMessage('warning', '请维护客户正确的手机号')
          return
        } else {
          createEnterpriseAndShopUserUsingPOST(this.selectedRows[0].customerCode).then(res => {
            if (res.code === 200 || res.code === '2000') {
              this.vueMessage('success', '生成企业购客户成功!')
            } else {
              this.vueMessage('warning', res.msg)
            }
            this.getList()
          })
        }
      },
      handlerCancel() {
        this.dialogFormVisible = false
      },
      handlerOnSubmit() {
        this.isLoading = true
        this.$refs.customerForm.onSubmit()
      },
      submitSuccess() {
        this.isLoading = false
        this.getList()
        this.dialogFormVisible = false
      },
      submitWaring() {
        this.isLoading = false
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          })
          return false
        }
        let ids = []
        this.selectedRows.forEach(function(row) {
          ids.push(row.id)
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDel(ids)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
              this.getList()
            })
        })
      },
      handleUpdateStatus(status) {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条编辑',
            type: 'success',
            duration: 2000
          })
          return false
        }
        let ids = []
        this.selectedRows.forEach(function(row) {
          ids.push(row.id)
        })
        updateStatus(ids, status)
          .then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
          })
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handleChangeFun(val) {
        this.selectedRows = val
        //console.log(val)
      },
      handleBatchUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          })
          return false
        }
        this.dialogBatchUpdateVisible = true
      },
      batchUpdate() {
        let ids = []
        this.selectedRows.forEach(function(row) {
          ids.push(row.id)
        })
        batchUpdate(ids, this.dataForm).then(response => {
          if (response.code == '2000') {
            this.dialogBatchUpdateVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })

      },
      handleCustomerInfoShow(row) {
        this.selectedRows = row
        this.id = this.selectedRows.id
        this.customerInfoVisible = true
        //console.log(this.selectedRows)
        /*console.log(this.selectedRows.id)*/
      },
      handleCustomerInfoClose() {
        this.customerInfoVisible = false
        this.getList()
      },
      handleClose() {
        this.customerInfoVisible = false
        this.getList()
      },
      handleManagerShow() {
        this.customerManagerVisible = true
      },
      handleManagerDel(index) {
        this.customerManagerArr.splice(index, 1)
        this.$refs.customerManagerDialog.reset()
      },
      handleManagerConfirm() {
        this.$refs.customerManagerDialog.onSubmit()
      },
      handleManagerCancel() {
        this.customerManagerVisible = false
      },
      closeUserDialog(list) {
        this.customerManagerArr = list
        this.customerManagerVisible = false
        if (list.length > 0) {
          this.dataForm.managerName = list[0].name
          this.dataForm.managerId = list[0].id
        }
      },
      //文件上传
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      beforeUpload(file) {
        console.log(file)
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0
        const isLt10M = file.size / 1024 / 1024 < 10
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!')
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!')
        }
        return isXLS && isLt10M
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          })
          this.getList()
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleDateSelect(val) {
        this.listQuery.startDate = val[0] + ' 00:00:00'
        this.listQuery.endDate = val[1] + ' 23:59:59'
      }
    },
    watch: {
      date(value) {
        if (!value) {
          this.listQuery.startDate = undefined
          this.listQuery.endDate = undefined
        }
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .customerInfoDialog {
    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh !important;

    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

  }

</style>
