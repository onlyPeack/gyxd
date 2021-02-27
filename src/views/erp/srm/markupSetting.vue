<template>
  <div class="full-purchase bill-container">
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane label="加价点设置" name="second">
        <div class="filter-container">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="供应商名称"
                    v-model="listQuery.customerName"></el-input>
          <el-select v-model="listQuery.billStatus" class="filter-item" placeholder="单据状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人工号"
                    v-model="listQuery.crtUserNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人姓名"
                    v-model="listQuery.crtUserName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-date-picker
            style="position: relative;top: -4px;"
            v-model="crtTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="创建开始日期"
            end-placeholder="创建结束日期"
            value-format="yyyy-MM-dd"
            @change="handleCrtTimeSelect"
            :picker-options="pickerOptions">
          </el-date-picker>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>
          <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>
        </div>
        <div v-if="activeTabName=='second'">
          <!--列表-->
          <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable" height="60vh"
                    highlight-current-row @row-click="handleRowClick" @selection-change="handleChangeFun"
                    @row-dblclick="handleOpenDetailOrForm" :default-sort="{prop: 'crtTime', order: 'descending'}">
            <el-table-column type="selection" width="60" align="center">
            </el-table-column>
            <el-table-column type="index" label="序号" align="center">
            </el-table-column>
            <el-table-column prop="billStatus" label="单据状态" width="100" align="center">
              <template slot-scope="scope">
                <div v-for="item in statusOptions">
                  <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="crtUserNo" label="制单人工号" align="center">
            </el-table-column>
            <el-table-column prop="crtUserName" label="制单人姓名" align="center">
            </el-table-column>
            <el-table-column prop="customerNames" label="供应商名称" sortable>
              <template slot-scope="scope">
                <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
                  {{scope.row.customerNames}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="discountPoint" label="库存加点" width="180"  sortable align="right">
            </el-table-column>
            <el-table-column prop="effectiveDate" label="生效日期" width="180" sortable align="center">
            </el-table-column>
            <el-table-column prop="disabledDate" label="到期日期" width="180" sortable align="center">
            </el-table-column>
            <el-table-column prop="crtTime" label="创建时间" width="180"  sortable align="center">
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page"
                           :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="items[0] && items[0].id ? '编辑加价点设置' : '新增加价点设置'" name="first">
        <div class="billFormDialog" style="width: 1000px;" v-if="activeTabName=='first'">
          <el-table :data="items" border highlight-current-row class="tb-edit">
            <el-table-column type="index" width="50"></el-table-column>
            <!--<el-table-column width="65">
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
                <el-button type="text" size="mini" icon="el-icon-minus"
                           @click="handleValueDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>-->
            <el-table-column prop="customerName" label="供应商名称" min-width="300" align="left" class="customer-tag">
              <template slot-scope="scope">
                <div @click="handleCustomerSelector(scope.$index)"
                     style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;height: 40px;overflow: auto;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="(tag,tagIndex) in scope.row.customerArr" :key="tag.id" closable
                          @close="handleCustomerDel(scope.$index,tagIndex)">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="discountPoint" label="加价点" width="150" align="right">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.discountPoint" class="right-el-input"
                          @change="handleEdit($event,scope.$index,scope.row)"
                          @input="handleInputFun($event, scope.row, 'discountPoint')"></el-input>
                <span>{{scope.row.discountPoint}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveDate" label="生效日期" width="200">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.effectiveDate" type="date"
                                placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span>{{scope.row.effectiveDate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="disabledDate" label="失效日期" width="200">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.disabledDate" type="date"
                                placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span>{{scope.row.disabledDate}}</span>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 10px">
            <el-button @click="handleCancel" v-if="items[0] && items[0].id">取 消</el-button>
            <el-button type="primary" @click="handleSubmit" v-if="!operationResult">提 交</el-button>
            <el-button type="primary" v-if="operationResult" :disabled="operationResult">正在进行价格调整...</el-button>
          </div>

          <!-- 供应商列表弹窗-->
          <el-dialog title="请选择供应商" :visible.sync="customerVisible" append-to-body>
            <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                               ref="customer"></customer-selector>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelCustomer">取 消</el-button>
              <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </el-tab-pane>
      <el-tab-pane v-if="$store.state.user.code == '00000'" :label="items[0] && items[0].id ? '编辑所有供应商加价点设置' : '新增所有供应商加价点设置'" name="tree">
        <div class="billFormDialog" style="width: 1000px;" v-if="activeTabName=='first' || activeTabName=='tree'">
          <el-table :data="items" border highlight-current-row class="tb-edit">
            <el-table-column type="index" width="50"></el-table-column>
            <!--<el-table-column width="65">
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
                <el-button type="text" size="mini" icon="el-icon-minus"
                           @click="handleValueDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>-->
            <el-table-column prop="customerName" label="供应商名称" min-width="300" align="left" class="customer-tag">
              <template slot-scope="scope">
                <div style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;height: 40px;overflow: auto;">
                <span>
                  ALL
                </span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="discountPoint" label="库存加点" width="150" align="right">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.discountPoint" class="right-el-input"
                          @change="handleEdit($event,scope.$index,scope.row)"
                          @input="handleInputFun($event, scope.row, 'discountPoint')"></el-input>
                <span>{{scope.row.discountPoint}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveDate" label="生效日期" width="200">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.effectiveDate" type="date"
                                placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span>{{scope.row.effectiveDate}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="disabledDate" label="失效日期" width="200">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.disabledDate" type="date"
                                placeholder="请选择日期" value-format="yyyy-MM-dd">
                </el-date-picker>
                <span>{{scope.row.disabledDate}}</span>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 10px">
            <el-button @click="handleCancel" v-if="items[0] && items[0].id">取 消</el-button>
            <el-button type="primary" @click="handleSubmit" v-if="!operationResult">提 交</el-button>
            <el-button type="primary" v-if="operationResult" :disabled="operationResult">正在进行价格调整...</el-button>
          </div>

          <!-- 供应商列表弹窗-->
          <el-dialog title="请选择供应商" :visible.sync="customerVisible" append-to-body>
            <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                               ref="customer"></customer-selector>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelCustomer">取 消</el-button>
              <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </el-tab-pane>
    </el-tabs>

    <discount-settings-view :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                            @submitDetailSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </discount-settings-view>

  </div>
</template>

<script>
  import { addBill, selectPage, getBill, batchDelBill } from '@/api/erp/srm/markUpSetting'

  export default {
    name: 'discountSettingsList',
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'discount-settings-view': () => import('./discountSettingsView')
    },
    data() {
      return {
        dataForm: {
          items: []
        },
        items: [],
        list: [],
        id: undefined,
        selectedRows: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          startDate: undefined,
          endDate: undefined,
          customerName: undefined,
          billStatus: undefined,
          crtUserNo: undefined,
          crtUserName: undefined,
        },
        total: 0,
        activeTabName: 'second',
        customerVisible: false,
        customerIndex: undefined,
        crtTime: undefined,
        dialogDetailVisible: false,
        operationResult: false
      }
    },
    created() {
      this.handleTabClick()
    },
    watch: {
      activeTabName(val){
        if(val == 'tree'){
          for (let i in this.items){
            this.items[i].customerArr = [{
              customerName: 'ALL'
            }]
          }
        }
      },
      crtTime(value) {
        if (!value) {
          this.listQuery.startDate = undefined
          this.listQuery.endDate = undefined
        }
      }
    },
    methods: {
      handleTabClick() {
        if (this.activeTabName == 'second') {
          this.getList()
        } else {
          this.items = []
          this.handleValueAdd()
        }
      },
      getList() {
        this.listLoading = true
        selectPage(this.listQuery).then(response => {
          var list = []
          response.data.records.forEach(function(item) {
            item.customerArr = item.customerArr ? item.customerArr : []
            var customerName = []
            for (var i in item.customerArr) {
              customerName.push(item.customerArr[i].customerName)
            }
            item.customerNames = customerName.join(',')
            list.push(item)
          })
          this.list = list
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      handleFilter() {
        this.getList()
      },
      handleCrtTimeSelect(val) {
        this.listQuery. startDate = val[0] + ' 00:00:00';
        this.listQuery.endDate = val[1] + ' 23:59:59';
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.customerName = undefined,
        this.listQuery.billStatus = undefined,
        this.listQuery.crtUserNo = undefined,
        this.listQuery.crtUserName = undefined,
        this.crtTime = undefined
      },
      //表格的行点击事件
      handleRowClick(row, event, column) {
        this.controlButtonShow(row)
        this.$refs.dataTable.toggleRowSelection(row)
      },
      handleChangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1])
        }
        this.selectedRows = val
      },
      //编辑
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
        this.handleGetBill(this.selectedRows[0].id)
      },
      //删除
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            batchDelBill(this.selectedRows[0].id)
              .then(() => {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              });
          });
      },
      handleGetBill(id) {
        this.activeTabName = 'first'
        getBill(id)
          .then(response => {
            this.items = [response.data]
          })
      },
      handleDeleteBill(id) {
        this.activeTabName = 'first'
        getBill(id)
          .then(response => {
            this.items = [response.data]
          })
      },
      //打开详情弹窗 或者 编辑
      handleOpenDetailOrForm(row) {
        var billStatus = row.billStatus
        this.id = row.id
        if (billStatus && (billStatus == 1 || billStatus == 5)) {
          //编辑
          this.handleGetBill(row.id)
        } else {
          //详情
          this.dialogDetailVisible = true
        }
      },
      handleValueAdd() {
        var date = new Date().toLocaleDateString().replace(/\//g, '-')
        const d = {
          customerArr: [],
          effectiveDate: date,
          disabledDate: undefined,
          discountPoint: undefined
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(val, index, row) {
        if (val != undefined && val != '') {
          if (val * 1 <= 1) {
            this.$message.warning('库存加点为大于1的数字')
          }
        }
      },
      //详情
      handleDetailClose() {
        this.id = ''
        this.dialogDetailVisible = false
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false
        this.getList()
      },
      // 供应商选择
      handleCustomerSelector(index) {
        this.customerIndex = index
        this.customerVisible = true
      },
      handleCancelCustomer() {
        this.customerIndex = undefined
        this.$refs.customer.reset()
        this.customerVisible = false
      },
      handleCustomerDel(index, tagIndex) {
        this.items[index].customerArr.splice(tagIndex, 1)
        this.vueSet(this.items, index, this.items[index])

        this.$refs.customer.reset()
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit()
      },
      closeCustomerDialog(list) {
        this.customerVisible = false
        var customerArr = JSON.parse(JSON.stringify(this.items[this.customerIndex].customerArr))
        if (list.length > 0) {
          const dataMap = this.dataMap()
          for (var i in list) {
            if (!dataMap[list[i].id]) {
              customerArr.push({
                customerId: list[i].id,
                customerName: list[i].customerName,
                customerCode: list[i].customerCode
              })
            }
          }
        }
        this.items[this.customerIndex].customerArr = customerArr
        this.vueSet(this.items, this.customerIndex, this.items[this.customerIndex])
        this.$refs.customer.reset()
      },
      dataMap() {
        var map = {}
        for (var i in this.items) {
          if (this.items[i].customerArr.length > 0) {
            var arr = this.items[i].customerArr
            for (var j in arr) {
              map[arr[j].customerId] = arr[j]
            }
          }
        }
        return map
      },
      dataFormSubmit(_this, subFun) {
        var list = []
        for (var i in _this.items) {
          if (_this.items[i].customerArr.length > 0) {
            list.push(_this.items[i])
          }
        }

        if (list.length < 1) {
          return
        }
        _this.dataForm = list[0]

        subFun(_this.dataForm).then(response => {
          if (response.code == '2000') {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            _this.items = []
            _this.handleValueAdd()
          } else {
            _this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
          this.operationResult = false
        }).catch(() => {
          this.operationResult = false
        })
      },
      //取消
      handleCancel() {
        this.items = []
        this.handleValueAdd()
      },
      //提交
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.operationResult = true
        this.dataFormSubmit(this, addBill)
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (!this.items[i].customerArr || this.items[i].customerArr.length == 0) {
            this.$message.error('第' + (i * 1 + 1) + '行的适用供应商为必填项，请填写了再提交')
            return
          }

          if (!this.items[i].discountPoint || this.items[i].discountPoint == '' || this.items[i].discountPoint * 1 <= 1) {
            this.$message.error('第' + (i * 1 + 1) + '行的库存加点为大于1的数字，请填写了再提交')
            return
          }

          if (!this.items[i].effectiveDate || this.items[i].effectiveDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的生效日期为必填项，请填写了再提交')
            return
          }

          if (!this.items[i].disabledDate || this.items[i].disabledDate == '') {
            this.$message.error('第' + (i * 1 + 1) + '行的失效日期为必填项，请填写了再提交')
            return
          }
        }
        return true
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin-right: 5px;
  }
</style>
