<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="仓库名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.warehouseName">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="物流名称"
                @keyup.enter.native="handleFilter" v-model="listQuery.logisticsName">
      </el-input>
      <el-button class="filter-item" type="primary"  @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="warning"  @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary"  @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="仓库编号" prop="warehouseCode">
      </el-table-column>
      <el-table-column align="center" label="仓库名称" prop="warehouseName">
      </el-table-column>
      <el-table-column align="center" label="仓库联系人" prop="linkPerson">
      </el-table-column>
      <el-table-column align="center" label="仓库联系电话" prop="linkPhone">
      </el-table-column>
      <el-table-column align="center" label="物流编号" prop="logisticsCode">
      </el-table-column>
      <el-table-column align="center" label="物流名称" prop="logisticsName">
      </el-table-column>
      <el-table-column align="center" label="物流联系人" prop="logisticsLinkPerson">
      </el-table-column>
      <el-table-column align="center" label="物流联系电话" prop="logisticsLinkPhone">
      </el-table-column>
      <el-table-column align="center" label="运费账户" prop="freightAccount">
      </el-table-column>
      <el-table-column align="center" label="快递类型" prop="logisticsType" width="90">
        <template slot-scope="scope">
          <span v-for="item in logisticsTypeOptions">
            <span v-if="scope.row.logisticsType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" prop="crtTime" width="180">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="仓库名称" prop="warehouseName">
              <div @click="warehouseVisible = true">
                <el-input v-model="dataForm.warehouseName" readonly></el-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库联系人" prop="linkPerson">
              <el-input v-model="dataForm.linkPerson" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库联系电话" prop="linkPhone">
              <el-input v-model="dataForm.linkPhone" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运费账户" prop="freightAccount">
              <el-input v-model="dataForm.freightAccount" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流名称" prop="logisticsName">
              <el-input v-model="dataForm.logisticsName" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流联系电话" prop="logisticsLinkPhone">
              <el-input v-model="dataForm.logisticsLinkPhone" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流联系人" prop="logisticsLinkPerson">
              <el-input v-model="dataForm.logisticsLinkPerson" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="快递类型" prop="logisticsType">
              <el-select v-model="dataForm.logisticsType">
                <el-option
                  v-for="item in logisticsTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="isLoading">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelWarehouse">取 消</el-button>
              <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
  import {page, addObj, getObj, delObj, putObj, changeGoodsTag} from '@/api/erp/wms/config/warehouseLogistics';

  export default {
    name: 'warehouseLogistics',
    components: {
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector')
    },
    data() {
      return {
        warehouseVisible: false,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        logisticsTypeOptions: [
          {
            value: '1',
            label: '快递'
          },
          {
            value: '2',
            label: '货运'
          }
        ],
        dataForm: {
          warehouseName: '',
          freightAccount: '',
          linkPerson: '',
          linkPhone: '',
          logisticsName: '',
          logisticsLinkPhone: '',
          logisticsLinkPerson: '',
          logisticsType: '',
          warehouseCode: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{required: true, message: '商品标签', trigger: 'blur'}]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleReset(){
        this.listQuery.warehouseName= '';
        this.listQuery.logisticsName= '';
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.dataForm.warehouseCode = list[0].id;
          this.dataForm.warehouseName = list[0].name;
          this.dataForm.linkPerson = list[0].contacts;
          this.dataForm.linkPhone = list[0].phone;
        }
        this.$refs.warehouse.reset();
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          console.log(response)
          this.list = response.records;
          this.total = response.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      resetForm() {
        this.dataForm = {
          warehouseCode: '',
          warehouseName: '',
          freightAccount: '',
          linkPerson: '',
          linkPhone: '',
          logisticsName: '',
          logisticsLinkPhone: '',
          logisticsLinkPerson: '',
          logisticsType: '1',
        }
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      createData() {
        this.isLoading = true;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.isLoading = false;
                this.list.unshift(response.data);
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          } else {
            this.isLoading = false;
            return false;
          }
        })
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.dataForm = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
            this.$nextTick(() => {
              this.$refs['dataForm'].clearValidate()
            })
          });
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm.id, this.dataForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisible = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(response => {
            if (response.code == '2000') {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            } else {
              this.$notify({
                title: '失败',
                message: response.msg,
                type: 'warning',
                duration: 2000
              })
            }
          });
        });
      },
      filterStatus: function (value, row) {
        return row.status === value;
      },
    }
  }
</script>
