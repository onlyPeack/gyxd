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
      <el-button class="filter-item" type="primary" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
      <el-button class="filter-item" type="primary" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="仓库编号" prop="warehouseCode">
      </el-table-column>
      <el-table-column align="center" label="仓库名称" prop="warehouseName">
      </el-table-column>
      <el-table-column align="center" label="寄件方式" prop="logisticsType">
        <template slot-scope="scope">
          <span v-for="item in logisticsTypeOptions">
            <span v-if="scope.row.logisticsType ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="订单金额" prop="amountStart">
      </el-table-column>
      <el-table-column align="center" label="订单金额" prop="amountEnd">
      </el-table-column>
      <el-table-column align="center" label="运费金额" prop="freight">
      </el-table-column>
      <el-table-column align="center" label="备注" prop="note">
      </el-table-column>
      <el-table-column align="center" label="操作" width="220" class-name="small-padding fixed-width">
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
    <el-dialog :title="textMap[dialogStatus]" v-if="dialogFormVisible" :visible.sync="dialogFormVisible" width="500px">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px">
        <el-row>
          <el-form-item label="仓库" prop="warehouseName">
            <div @click="warehouseVisible = true">
            <el-input v-model="dataForm.warehouseName" clearable style="width: 300px;" readonly></el-input>
            </div>
          </el-form-item>
          <el-form-item label="寄件方式" prop="logisticsType">
            <el-select v-model="dataForm.logisticsType">
              <el-option
                v-for="item in logisticsTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="地区" prop="area">
            <div @click="areaVisible = true">
              <el-input type="textarea" :rows="2" v-model="dataForm.area" clearable style="width: 300px;" readonly></el-input>
            </div>
          </el-form-item>
          <el-form-item label="订单金额" prop="amountStart">
            <div style="display: flex;flex-direction: row;">
              <el-input v-model="dataForm.amountStart" clearable style="width: 80px;"></el-input>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;&nbsp;&nbsp;</div>
              <el-input v-model="dataForm.amountEnd" clearable style="width: 80px;"></el-input>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;单位:&nbsp;&nbsp;元</span>
            </div>
          </el-form-item>
          <el-form-item label="运费" prop="freight">
            <div style="display: flex;flex-direction: row;">
              <el-input v-model="dataForm.freight" clearable style="width: 220px;"></el-input>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;单位:&nbsp;&nbsp;元</span>
            </div>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="dataForm.note" clearable style="width: 300px;"></el-input>
          </el-form-item>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="isLoading">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="请选择物流" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
              <el-button @click="handleCancelWarehouse">取 消</el-button>
              <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
            </span>
    </el-dialog>
    <el-dialog title="请选择地区" v-if="areaVisible" :visible.sync="areaVisible" append-to-body class="areaList">
      <div style="overflow: auto">
        <el-tree
          :props="props"
          :data="mainTreeData"
          show-checkbox
          @check-change="handleCheckChange">
        </el-tree>
      </div>

      <span slot="footer" class="dialog-footer">
              <el-button @click="handleArea">取 消</el-button>
              <el-button type="primary" @click="handleSubmitArea">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style>

</style>

<script>
  import {page, addObj, getObj, delObj, putObj, changeGoodsTag} from '@/api/erp/wms/config/warehouseLogisticsTemplate';
  import {getTree} from '@/api/erp/mall/cms/area'

  export default {
    name: 'warehouseLogisticsTemplate',
    components: {
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector')
    },
    data() {
      return {
        props: {
          label: 'name',
          children: 'zones'
        },
        areaVisible: false,
        warehouseVisible: false,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        areaList: [],
        listQuery: {
          page: 1,
          limit: 20,
        },
        mainTreeData: [],
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
          freight: '',
          amountEnd: '',
          amountStart: '',
          linkPhone: '',
          logisticsCode: '',
          logisticsName: '',
          warehouseName: '',
          warehouseCode: '',
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          warehouseName: [{required: true, message: '仓库', trigger: 'blur'}],
          logisticsType: [{required: true, message: '请选择寄件方式', trigger: 'blur'}],
          area: [{required: true, message: '请选择地区', trigger: 'blur'}],
          amountStart: [{required: true, message: '请输入订单最小值', trigger: 'blur'}],
          amountEnd: [{required: true, message: '请输入订单最小值', trigger: 'blur'}],
          freight: [{required: true, message: '请输入运费', trigger: 'blur'}],
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleArea() {
        this.areaVisible = false;
      },
      handleSubmitArea() {
        this.areaVisible = false;
        let list = [];
        for(let i in this.areaList){
          list.push(this.areaList[i].name);
        }
        this.dataForm.area = list.toString();
      },
      handleCheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
        if (checked) {
          let flag = true;
          if (this.areaList.length > 0) {
            for (let i in this.areaList) {
              if (this.areaList[i].name == data.name) {
                flag = false;
              }
            }
            if (flag) {
              this.areaList.push(data)
            }
          } else {
            this.areaList.push(data)
          }
        }else{
          if (this.areaList.length > 0) {
            for(let i=this.areaList.length - 1; i>=0;i--){
              if (this.areaList[i].name == data.name) {
                this.areaList.splice(i * 1, 1);
              }
            }
          }
        }
      },
      handleReset() {
        this.listQuery.warehouseName = '';
        this.listQuery.logisticsName = '';
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.dataForm.warehouseCode = list[0].id;
          this.dataForm.warehouseName = list[0].name;s
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
        getTree().then(data => {
          this.mainTreeData = data[0].children;
        })
        this.areaList = [];
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      createData() {
        this.isLoading = true;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataForm.freight = Number(this.dataForm.freight);
            this.dataForm.amountEnd = Number(this.dataForm.amountEnd);
            this.dataForm.amountStart = Number(this.dataForm.amountStart);
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
        this.areaList = [];
        getObj(row.id)
          .then(response => {
            this.dataForm = response.data;
            getTree().then(data => {
              this.mainTreeData = data[0].children;
            })
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
            this.dataForm.freight = Number(this.dataForm.freight);
            this.dataForm.amountEnd = Number(this.dataForm.amountEnd);
            this.dataForm.amountStart = Number(this.dataForm.amountStart);
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
<style lang="scss">
  .areaList {
    .el-dialog {
      margin-top: 0px !important;
    }
    .el-dialog__body {
      overflow: hidden;
      height: 856px;
    }
  }
</style>
