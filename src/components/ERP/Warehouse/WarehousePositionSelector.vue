<template>
  <el-row>
    <el-col :span="16">
      <div class="filter-container">
        <el-input style="width: 200px;" class="filter-item" placeholder="仓位名称" v-model="listQuery.name" clearable>
        </el-input>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="getList">搜索</el-button>
        <el-button class="filter-item" type="primary" icon="search" style="margin-left: 10px;" @click="handleCreate">
          新增
        </el-button>
      </div>
      <el-table :key='tableKey' :data="list" ref="dataTable" border fit highlight-current-row
                @current-change="getRowData" v-loading.body="listLoading" @row-dblclick="onSubmit" height="50vh">
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column align="center" label="仓位名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属仓库">
          <template slot-scope="scope">
            <span>{{scope.row.warehouseName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column align="center" label="所选商品库存">-->
          <!--<template slot-scope="scope">-->
            <!--<span>{{scope.row.qty}}</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </el-col>
    <el-col :span="8">
      已选仓位：
      <el-tag v-show="chooseWarehousePosition.length>0" closable :disable-transitions="true"
              v-for="(tag,index) in chooseWarehousePosition" :key="index" @close="handleTagClose(index)"
              style="margin-right: 15px;">
        {{tag}}
      </el-tag>
    </el-col>
    <!-- 添加或修改对话框 -->
    <el-dialog title="创建" :visible.sync="dialogFormVisible" append-to-body>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="100px">
        <el-form-item label="仓位名称" prop="name">
          <el-input v-model="dataForm.name" clearable onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="仓位位置" prop="note">
          <el-input v-model="dataForm.note" clearable onkeyup="this.value=this.value.replace(/^ +| +$/g,'')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData" :loading="isLoading">确定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import {selectPage} from '@/api/erp/wms/config/warehousePosition';
  import {page, addObj, getObj, delObj, putObj, updateStatus} from '@/api/erp/wms/config/warehousePosition';

  export default {
    props: ['skuNo', 'warehouseId','warehouseName', 'warehouseArr'],
    data() {
      return {
        isLoading: false,
        dialogFormVisible: false,
        dataForm: {
          note: '',
          name: '',
          warehouseId: '',
          warehouseName: ''
        },
        rules: {
          name: [{required: true, message: '仓位名称不能为空', trigger: 'blur'}],
          // note: [{required: true, message: '仓位位置不能为空', trigger: 'blur'}]
        },
        list: [],
        total: null,
        listLoading: false,
        tableKey: 0,
        chooseWarehousePosition: [],
        currentWarehousePosition: [],
        newWarehouseArr:[],
        listQuery: {
          page: 1,
          limit: 20,
          skuNo: undefined,
          warehouseId: undefined,
          name: undefined
        },
      };
    },
    created() {
      if(!this.warehouseArr) {
        this.newWarehouseArr = [{
          warehouseId:this.warehouseId,
          warehouseName:this.warehouseName,
        }]
      } else {
        this.newWarehouseArr = this.warehouseArr
      }
      this.listQuery.warehouseId = this.newWarehouseArr[0].warehouseId;
      this.getList();
    },
    methods: {
      createData() {
        this.isLoading = true;
        this.dataForm.warehouseId = this.newWarehouseArr[0].warehouseId;
        this.dataForm.warehouseName = this.newWarehouseArr[0].warehouseName;

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
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      resetForm() {
        this.dataForm = {
          id: '',
          name: '',
        };
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getRowData(val) {
        if (val) {
          this.chooseWarehousePosition = [val.name];
          this.currentWarehousePosition = [val];
        }
      },
      onSubmit(row) {
        this.$emit('closeWarehousePositionDialog', this.currentWarehousePosition)
      },
      handleTagClose(index) {
        this.chooseWarehousePosition.splice(index, 1);
        this.currentWarehousePosition.splice(index, 1);
      },
      reset() {
        this.chooseWarehousePosition = [];
        this.currentWarehousePosition = [];
        this.$refs.dataTable.setCurrentRow();
      },
    }

  }
</script>

<style scoped>

</style>
