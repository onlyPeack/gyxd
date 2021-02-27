<template>
  <div class="app-container calendar-list-container">
    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>首页楼层分类</span>
            </div>
            <div class="filter-container">
              <el-button type="success" icon="el-icon-plus" @click="handleCreateTree">新建</el-button>

            </div>
            <div style="margin-top: 10px">
              <el-row>
                <el-col>
                  <el-tree class="filter-tree" :data="treeData" node-key="id" highlight-current :props="defaultProps"
                           :expand-on-click-node="false" :filter-node-method="filterNode" ref="documentTree"
                           @node-click="getNodeData"
                           :render-content="renderContent">
                  </el-tree>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
      <el-col :span="16" style="height:100%">
        <div class="grid-content bg-purple-light">
          <el-card class="box-card" style="height:100%">
            <div slot="header" class="clearfix">
              <span>楼层商品</span>
            </div>
            <div>

              <!-- 查询和其他操作 -->
              <div class="filter-container">
                <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品SKU"
                          v-model="listQuery.goodsId">
                </el-input>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
                <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="resetQuery">重置</el-button>
                <el-button class="filter-item" type="success" icon="el-icon-add" @click="handleCreate">添加商品</el-button>

              </div>

              <!-- 查询结果 -->
              <el-table size="small" :data="list" border fit highlight-current-row>
                <el-table-column align="center" label="商品编号" prop="goodsId"></el-table-column>
                <el-table-column align="center" label="产品编号" prop="goodsCode"></el-table-column>
                <el-table-column align="center" label="商品名称" prop="goodsName"></el-table-column>
                <el-table-column align="center" label="订货号" prop="itemNo"></el-table-column>
                <el-table-column align="center" label="型号" prop="specModel"></el-table-column>
                <el-table-column align="center" label="零售价" prop="retailPrice"></el-table-column>
                <el-table-column align="center" label="订货价" prop="goodsPrice"></el-table-column>
                <el-table-column align="center" label="图片路径" prop="url" width="200"></el-table-column>
                <el-table-column align="center" label="操作人" prop="crtUserName"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="crtTime"></el-table-column>

                <el-table-column align="center" label="操作" width="80" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>-->
                    <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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


              <!-- 添加或修改分类对话框 -->
              <el-dialog :title="textMap[dialogStatusTree]" :visible.sync="dialogFormVisibleTree">
                <el-form :rules="rulesTree" ref="dataTreeForm" :model="dataTreeForm" status-icon label-position="left"
                         label-width="100px"
                         style='width: 400px; margin-left:50px;'>
                  <el-form-item label="ID" prop="id" v-show="false">
                    <el-input v-model="dataTreeForm.id" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="父级ID" prop="parentId" v-show="false">
                    <el-input v-model="dataTreeForm.parentId" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="父级名称" prop="parentName" v-show="dialogStatusTree==='create'">
                    <el-input v-model="dataTreeForm.parentName" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="分类名称" prop="name">
                    <el-input v-model="dataTreeForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label="类型(分类可添加商品)" prop="level">
                    <el-select v-model="dataTreeForm.level" style="width: 100%;">
                      <el-option v-for="item in levelOptions" :key="item.label" :label="item.label"
                                 :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="图片" prop="url" v-if="dataTreeForm.level=='1'">
                    <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card"
                               :show-file-list="false"
                               accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
                      <img v-if="dataTreeForm.url && dataTreeForm.url!=''" :src="dataTreeForm.url" class="avatar" style="width: auto;height: 148px;">
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                  <el-form-item label="排序" prop="sort">
                    <el-input v-model="dataTreeForm.sort"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisibleTree = false">取消</el-button>
                  <el-button v-if="dialogStatusTree==='create'" type="primary" @click="createTreeData">确定</el-button>
                  <el-button v-else type="primary" @click="updateTreeData">确定</el-button>
                </div>
              </el-dialog>


            </div>
          </el-card>
        </div>


      </el-col>
    </el-row>
    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
  </div>


</template>

<script>
  import {fetchTree, getTreeObj, addTreeObj, delTreeObj, putTreeObj} from '@/api/mall/cms/cmsStoreyTree';
  import {page, addObj, getObj, delObj, putObj} from '@/api/mall/cms/cmsStoreyGood'
  import {uploadPath} from '@/api/erp/goods/storage'

  export default {
    name: 'cmsStoreyGood',
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
    },
    data() {
      const validatePass = (rule, value, callback) => {
        if (this.dataForm.url.length < 1) {
          callback(new Error('图片路径不能为空!'));
        } else {
          callback();
        }
      };
      return {
        uploadPath,
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          goodsId: undefined,
          treeId: undefined,
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
            label: '楼层',
          }, {
            value: '2',
            label: '分类',
          }
        ],
        rules: {
          goodsName: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          url: [{required: true, message: '图片路径不能为空', trigger: 'blur', validator: validatePass}],
          parentName: [{required: true, message: '请点击选择一个分类', trigger: 'blur'}],
        },
        rulesTree: {
          name: [{required: true, message: '名称不能为空', trigger: 'blur'}],
          level: [{required: true, message: '请选择类型', trigger: 'blur'}],
          sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
          url: [{required: true, message: '图片不能为空', trigger: 'blur'}],
        },

        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
      };
    },
    created() {
      this.getList();
      this.getTree();
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getTree() {
        fetchTree().then(data => {
          this.treeData = data;
        });
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
        this.listQuery.name = undefined;
        this.listQuery.treeIds = undefined;
      },
      handleCreate() {
        if (this.$refs.documentTree.getCurrentNode() === null) {
          this.$notify({
            title: '请点击选择左侧一个分类',
            message: '请点击选择左侧一个分类!',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        if (this.$refs.documentTree.getCurrentNode().level != 2) {
          this.$notify({
            title: '只有分类可以添加商品！',
            message: '只有分类可以添加商品！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.resetForm();
        this.dataForm.treeId = this.$refs.documentTree.getCurrentNode().id;
        this.dataForm.treeIds = this.$refs.documentTree.getCurrentNode().parentIds + "," + this.$refs.documentTree.getCurrentNode().id;
        this.dataForm.parentName = this.$refs.documentTree.getCurrentNode().name;
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              if (response.code == '2000') {
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
            return false;
          }
        })
      },
      handleCreateTree(data) {
        this.resetTreeForm();
        this.dataTreeForm.parentName = data.name;
        this.dataTreeForm.parentId = data.id;
        this.dialogStatusTree = 'create';
        this.dialogFormVisibleTree = true;
        this.$nextTick(() => {
          this.$refs['dataTreeForm'].clearValidate();
        })
      },
      createTreeData() {
        this.$refs['dataTreeForm'].validate((valid) => {
          if (valid) {
            addTreeObj(this.dataTreeForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisibleTree = false;
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
                this.getTree();
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
            return false;
          }
        })
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
      uploadPicUrl: function (response) {
        this.$nextTick(() => {
          this.dataTreeForm.url = response.data.url;
          this.vueSet(this.dataTreeForm, 'url', response.data.url);
        });
      },
      handleUpdateTree(data) {
        this.dataTreeForm = Object.assign({}, data);
        this.dataTreeForm.url = this.dataTreeForm.url ? this.dataTreeForm.url : undefined;
        this.dialogStatusTree = 'update';
        this.dialogFormVisibleTree = true;
        this.$nextTick(() => {
          this.$refs['dataTreeForm'].clearValidate()
        })
      },
      updateTreeData() {
        this.$refs['dataTreeForm'].validate((valid) => {
          if (valid) {
            putTreeObj(this.dataTreeForm.id, this.dataTreeForm).then(response => {
              if (response.code == '2000') {
                this.dialogFormVisibleTree = false;
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.getTree();
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
          delObj(row.id).then(() => {
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
            });
            this.getTree();
          });
        });
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.treeId = data.id;
        this.getList();
      },
      renderContent(h, {node, data}) {
        return (
          < span class = "custom-tree-node" > < span > {node.label }< /span>
        < span >
        < el-button size = "mini" type = "text" icon = "el-icon-plus" on-click = {() => this.handleCreateTree(data) }> 添加下级 < /el-button>
        < el-button size = "mini" type = "text" icon = "el-icon-edit" on-click = {() => this.handleUpdateTree(data) }> 修改 < /el-button>
        < el-button size = "mini" type = "text" icon = "el-icon-delete" on-click = {() => this.handleDeleteTree(data.id) }> 删除 < /el-button>
        < /span>
        < /span>

      )
      },

      //商品选择
      handleProductShow() {
        this.productVisible = true;
      },
      handleCloseProduct() {
        this.productVisible = false;
        this.selectedProducts = [];
        this.$refs.goodsSelector.reset();
      },
      closeGoodsDialog(list) {
        if (list.length == 0) {
          this.productVisible = false;
          return;
        } else if (list.length > 1) {
          this.$message.error('只能选择一个商品');
          return;
        }
        this.dataForm.goodsId = list[0].goodsId;
        this.dataForm.goodsName = list[0].goodsName;
        this.dataForm.goodsCode = list[0].skuNo;
        this.dataForm.url = list[0].url;
        this.productVisible = false;
        this.$refs.goodsSelector.reset();
        this.$refs['dataForm'].validate(valid => {
        });
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit();
      },

    }
  };
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
