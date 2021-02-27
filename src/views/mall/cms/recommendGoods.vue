<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="24" style="height:100%">
        <div class="grid-content bg-purple-light">

          <div>
            <!-- 查询和其他操作 -->
            <el-form :inline="true">
              <el-form-item>
                <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入产品编号"
                          v-model="listQuery.goodsCode">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="listQuery.type" style="width: 200px" placeholder="请选择商品类型" clearable
                           @change="handleFilter">
                  <el-option v-for="(key,value) in recommendGoodsType" :label="key" :value="value"></el-option>
                </el-select>
              </el-form-item>
              <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>

              <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate(1)">添加热销商品
              </el-button>
              <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate(0)">添加新品商品
              </el-button>
            </el-form>

            <!-- 查询结果 -->
            <el-table size="small" :data="list" border fit highlight-current-row v-loading="listLoading"
                      element-loading-text="正在查询中。。。">
              <el-table-column align="center" label="ID" prop="id"></el-table-column>
              <el-table-column align="center" label="商品类型" prop="type" v-slot="{row}">
                <span>{{recommendGoodsType[row.type]}}</span>
              </el-table-column>
              <!--                <el-table-column align="center" label="商品编号" prop="skuNo"></el-table-column>-->
              <el-table-column align="center" label="产品编号" prop="goodsCode"></el-table-column>
              <el-table-column align="center" label="商品名称" prop="name"></el-table-column>
              <el-table-column align="center" label="订货号" prop="itemNo"></el-table-column>
              <el-table-column align="center" label="型号" prop="specModel"></el-table-column>
              <el-table-column align="center" label="零售价" prop="retailPrice"></el-table-column>
              <!--                <el-table-column align="center" label="订货价" prop="goodsPrice"></el-table-column>-->
              <el-table-column align="center" label="图片" prop="picUrl" width="200" v-slot="{row}">
                <!--                <el-image-->
                <!--                  style="width: 100px; height: 100px"-->
                <!--                  :src=""></el-image>-->
                <img :src="row.picUrl" alt="" style="width: 100px;height: 100px">
              </el-table-column>
              <el-table-column align="center" label="操作人" prop="crtUserName"></el-table-column>
              <el-table-column align="center" label="创建时间" prop="crtTime"></el-table-column>

              <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
                  <el-button type="danger" size="mini" @click="handleDelete(scope.row)" plain>删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页-->
            <div class="pagination-container">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                             :current-page="listQuery.page"
                             :page-sizes="[5,10,20,30,50]" :page-size="listQuery.limit"
                             layout="total, sizes, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>

            <!-- 添加或修改对话框 -->
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
              <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left"
                       label-width="100px"
                       style='width: 400px; margin-left:50px;'>
                <el-form-item label="分类" prop="treeId" v-show="false">
                  <el-input v-model="dataForm.treeId"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="treeIds" v-show="false">
                  <el-input v-model="dataForm.treeIds"></el-input>
                </el-form-item>
                <el-form-item label="分类名称" prop="parentName">
                  <el-input v-model="dataForm.parentName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="goodsName">
                  <div @click.stop="handleProductShow" style="cursor: pointer;">
                    <el-input v-model="dataForm.goodsName" :disabled="true"></el-input>
                  </div>
                </el-form-item>
                <el-form-item label="产品编号" prop="goodsCode">
                  <el-input v-model="dataForm.goodsCode" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="图片路径" prop="url">
                  <el-input v-model="dataForm.url" :disabled="true"></el-input>
                </el-form-item>


              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
                <el-button v-else type="primary" @click="updateData">确定</el-button>
              </div>
            </el-dialog>

          </div>

        </div>


      </el-col>
    </el-row>
    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="70%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog" :isOnSale="0"
                      :isSelectPage="true"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
  import { insertBatch, page, delObj } from '@/api/mall/cms/recommendGoods'
  import { recommendGoodsType } from './commend/dic'
  import { uploadPath } from '@/api/erp/goods/storage'

  export default {
    name: 'cmsStoreyGood',
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector')
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (this.dataForm.url.length < 1) {
          callback(new Error('图片路径不能为空!'))
        } else {
          callback()
        }
      }
      return {
        uploadPath,
        recommendGoodsType,
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          goodsId: undefined,
          treeId: undefined
        },
        dataForm: {
          treeId: '',
          treeIds: '',
          parentName: '',
          goodsId: '',
          goodsName: '',
          goodsCode: '',
          level: '',
          url: '',
          sort: ''
        },
        dataTreeForm: {
          id: '',
          parentId: '',
          parentName: '',
          level: '',
          sort: '',
          url: undefined,
          name: ''
        },
        dialogFormVisible: false,
        dialogFormVisibleTree: false,
        productVisible: false,
        isSingle: true,
        selectedProducts: [],
        dialogStatus: '',
        dialogStatusTree: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        levelOptions: [
          {
            value: '1',
            label: '楼层'
          }, {
            value: '2',
            label: '分类'
          }
        ],
        rules: {
          goodsName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          url: [{ required: true, message: '图片路径不能为空', trigger: 'blur', validator: validatePass }],
          parentName: [{ required: true, message: '请点击选择一个分类', trigger: 'blur' }]
        },
        rulesTree: {
          name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
          level: [{ required: true, message: '请选择类型', trigger: 'blur' }],
          sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
          url: [{ required: true, message: '图片不能为空', trigger: 'blur' }]
        },

        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    created() {
      this.getList()
      //this.getTree();
    },
    methods: {
      getList() {
        this.listLoading = true
        page(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      getTree() {
        fetchTree().then(data => {
          this.treeData = data
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
      resetForm() {
        this.dataForm = {
          treeId: '',
          treeIds: '',
          parentName: '',
          goodsId: '',
          goodsName: '',
          goodsCode: '',
          level: '',
          sort: ''
        }
      },
      resetTreeForm() {
        this.dataTreeForm = {
          id: '',
          parentId: '',
          parentName: '',
          sort: '',
          url: undefined,
          name: ''
        }
      },

      //重置查询条件
      resetQuery() {
        //this.listQuery.name = undefined;
        //this.listQuery.treeIds = undefined;
        delete this.listQuery.type
        delete this.listQuery.goodsCode
        this.getList()
      },
      handleCreate(flag) {
        //this.resetForm();
        this.type = flag
        this.dialogStatus = 'create'
        this.productVisible = true
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              if (response.code == '2000') {
                this.list.unshift(response.data)
                this.dialogFormVisible = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
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
          } else {
            return false
          }
        })
      },
      handleCreateTree(data) {
        this.resetTreeForm()
        this.dataTreeForm.parentName = data.name
        this.dataTreeForm.parentId = data.id
        this.dialogStatusTree = 'create'
        this.dialogFormVisibleTree = true
        this.$nextTick(() => {
          this.$refs['dataTreeForm'].clearValidate()
        })
      },
      createTreeData() {
        this.$refs['dataTreeForm'].validate((valid) => {
          if (valid) {
            addTreeObj(this.dataTreeForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisibleTree = false
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                this.getTree()
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
            return false
          }
        })
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm.id, this.dataForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisible = false
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
          } else {
            return false
          }
        })
      },
      uploadPicUrl: function(response) {
        this.$nextTick(() => {
          this.dataTreeForm.url = response.data.url
          this.vueSet(this.dataTreeForm, 'url', response.data.url)
        })
      },
      handleUpdateTree(data) {
        this.dataTreeForm = Object.assign({}, data)
        this.dataTreeForm.url = this.dataTreeForm.url ? this.dataTreeForm.url : undefined
        this.dialogStatusTree = 'update'
        this.dialogFormVisibleTree = true
        this.$nextTick(() => {
          this.$refs['dataTreeForm'].clearValidate()
        })
      },
      updateTreeData() {
        this.$refs['dataTreeForm'].validate((valid) => {
          if (valid) {
            putTreeObj(this.dataTreeForm.id, this.dataTreeForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisibleTree = false
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                })
                this.getTree()
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
            return false
          }
        })
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
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
      handleDeleteTree(id) {
        this.$confirm(this.dataTreeForm.id + '将被永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delTreeObj(id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
            this.getTree()
          })
        })
      },
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      getNodeData(data) {
        this.listQuery.treeId = data.id
        this.getList()
      },

      //商品选择
      handleProductShow() {
        this.productVisible = true
      },
      handleCloseProduct() {
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      closeGoodsDialog(list) {
        // if (list.length == 0) {
        //   this.productVisible = false;
        //   return;
        // } else if (list.length > 1) {
        //   this.$message.error('只能选择一个商品');
        //   return;
        // }
        for (let i = 0; i < list.length; i++) {
          list[i].type = this.type
          list[i].goodsId = list[i].id
        }
        insertBatch(list).then(res => {
          if (Number(res.code) === 2000 || Number(res.code) === 200) {
            this.$message.success('新增商品成功!')
            this.getList()
          } else {
            this.$message.error('新增商品失败!' + res.msg || res.data)
          }
        }, error => this.$message.error('新增商品失败!' + error))
        this.productVisible = false

        //console.log(list,'t')
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit()
      }

    }
  }
</script>
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
