<template>
  <div class="full-purchase bill-container">
    <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
      <el-tab-pane label="客户仓库查询" name="first">
        <div v-if="activeTabName=='first'">
          <div class="filter-container">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户编号"
                      v-model="listQuery.customerCode"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="客户名称"
                      v-model="listQuery.customerName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                      v-model="listQuery.warehouseName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员工号"
                      v-model="listQuery.crtUserNo"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="业务员名称"
                      v-model="listQuery.crtUserName"
                      @keyup.enter.native="handleFilter">
            </el-input>
            <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
            </el-button>
            <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
            <el-button class="filter-item" type="primary" @click="handleBatchDetele()">删除</el-button>
          </div>
          <!--列表-->
          <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                    :height="clientHeight"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60" align="center">
            </el-table-column>
            <el-table-column type="index" label="序号">
            </el-table-column>
            <el-table-column prop="customerCode" label="客户编号" width="150">
            </el-table-column>
            <el-table-column prop="customerName" label="客户名称" min-width="200">
            </el-table-column>
            <el-table-column prop="warehouseId" label="仓库编号" width="150">
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" width="300">
            </el-table-column>
            <el-table-column prop="crtUserNo" label="业务员工号" width="300">
            </el-table-column>
            <el-table-column prop="crtUserName" label="业务员名称" width="300">
            </el-table-column>
            <el-table-column prop="crtTime" label="创建日期" width="150">
            </el-table-column>
            <el-table-column label="操作" width="120" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="handleDelete(scope.row.id)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="listQuery.page"
                           :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="新增客户仓库" name="second">
        <div class="billFormDialog" style="width: 1000px;" v-if="activeTabName=='second'">
          <el-table :data="items" border highlight-current-row class="tb-edit">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="customerName" label="客户" min-width="300" align="left">
              <template slot-scope="scope">
                <div @click="handleCustomerSelector(scope.$index)"
                     style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;height: 40px;overflow: auto;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag closable @close="handleCustomerDel()" v-show="scope.row.customerName">
                    {{scope.row.customerName}}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库" width="300" align="left">
              <template slot-scope="scope">
                <div @click="handleWarehouseSelector(scope.$index)"
                     style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;height: 40px;overflow: auto;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag closable @close="handleWarehouseDel()" v-show="scope.row.warehouseName">
                    {{scope.row.warehouseName}}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
          </el-table>

          <div style="margin-top: 10px">
            <el-button type="primary" @click="handleSubmit" :loading="formLoading">提 交</el-button>
          </div>

          <!-- 客户列表弹窗-->
          <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
            <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true"
                               ref="customer"></customer-selector>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelCustomer">取 消</el-button>
              <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
            </span>
          </el-dialog>

          <!-- 仓库列表弹窗-->
          <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
            <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                                ref="warehouse"></warehouse-selector>
            <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelWarehouse">取 消</el-button>
              <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
            </span>
          </el-dialog>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import {create, list, deletes} from '@/api/mall/cwd/index';

  export default {
    name: "customerWarehouseList",
    components: {
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector')
    },
    data() {
      return {
        clientHeight: 300,
        items: [],
        list: [],
        multipleSelection: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 20,
          customerName: undefined,
          warehouseName: undefined,
          customerCode: undefined,
          crtUserNo: undefined,
          crtUserName: undefined
        },
        total: 0,
        activeTabName: 'first',
        customerVisible: false,
        warehouseVisible: false,
        formLoading: false
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.handleTabClick();
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (210 + height)) * 1;
      },
      handleTabClick() {
        if (this.activeTabName == 'first') {
          this.getList();
        } else {
          this.items = [];
          this.handleValueAdd();
        }
      },
      getList() {
        this.listLoading = true;
        list(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.getList();
      },
      handleReset() {
        this.listQuery.customerName = undefined;
        this.listQuery.warehouseName = undefined;
        this.listQuery.customerCode = undefined;
        this.listQuery.crtUserNo = undefined;
        this.listQuery.crtUserName = undefined;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleValueAdd() {
        const d = {
          customerId: undefined,
          customerName: undefined,
          customerCode: undefined,
          warehouseId: undefined,
          warehouseName: undefined
        };
        this.items.push(d);
      },
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleCustomerDel() {
        this.items[0].customerId = undefined;
        this.items[0].customerName = undefined;
        this.items[0].customerCode = undefined;
        if (this.$refs.customer) {
          this.$refs.customer.reset();
        }
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerVisible = false;
        if (list.length > 0) {
          this.items[0].customerId = list[0].id;
          this.items[0].customerName = list[0].customerName;
          this.items[0].customerCode = list[0].customerCode;
        }
        this.$refs.customer.reset();
      },
      //仓库选择
      handleWarehouseSelector() {
        this.warehouseVisible = true;
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleWarehouseDel() {
        this.items[0].warehouseId = undefined;
        this.items[0].warehouseName = undefined;
        if (this.$refs.warehouse) {
          this.$refs.warehouse.reset();
        }
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.items[0].warehouseId = list[0].id;
          this.items[0].warehouseName = list[0].name;
        }
        this.$refs.warehouse.reset();
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }

        this.formLoading = true;
        create(this.items[0]).then(response => {
          this.formLoading = false;
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.items = [];
            this.handleValueAdd();
            this.activeTabName = 'first';
          } else {
            this.$notify({
              title: '失败',
              message: response.code === '50000000000' ? '该客户的仓库信息已存在' : response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (!this.items[i].customerName || this.items[i].customerName == '') {
            this.$message.error('客户为必填项，请填写了再提交');
            return;
          }

          if (!this.items[i].warehouseName || this.items[i].warehouseName == '') {
            this.$message.error('仓库为必填项，请填写了再提交');
            return;
          }
        }
        return true;
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
      }
    },
  }
</script>

<style scoped>
  .el-tag {
    margin-right: 5px;
  }
</style>
