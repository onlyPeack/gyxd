<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入模板名称" v-model="listQuery.name"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleCategorySpec"
                 v-if="categorySpecStatus">从产品库同步信息
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" :disabled="!categorySpecStatus"
                 v-if="!categorySpecStatus">正在同步中
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="goodsTypeList" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" :default-sort="{prop: 'id', order: 'ascending'}">
      <el-table-column align="center" label="类型ID" prop="id" width="120" sortable>
      </el-table-column>
      <el-table-column align="center" label="模板名称" prop="name" width="900">
      </el-table-column>
      <el-table-column align="center" label="属性数量" prop="attributeCount" width="200">
      </el-table-column>
      <el-table-column align="center" label="参数数量" prop="paramCount" width="200">
      </el-table-column>
      <el-table-column align="center" label="设置" width="257">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleAttributeList(scope.row)">属性列表</el-button>
          <el-button size="mini" @click="handleParameterList(scope.row)">参数列表</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="600px">
      <el-form :rules="rules1" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createGoodsType" :loading="isLoading">确定
        </el-button>
        <el-button v-else type="primary" @click="updateGoodsType">确定</el-button>
      </div>
    </el-dialog>

    <!-- 属性列表和参数列表 -->
    <el-dialog :title="textMap[dialogType]" :visible.sync="dialogTypeVisible" width="1500px"
               :before-close="handleFlushPage">
      <el-button
        class="btn-add"
        @click="addProductAttr()"
        size="mini" style="margin-right: 100px;margin-bottom: 20px">
        添加
      </el-button>
      <el-table ref="productAttrTable"
                :data="attrList"
                style="width: 100%"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="140" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="商品类型" width="140" align="center">
          <template slot-scope="scope">{{scope.row.cname}}</template>
        </el-table-column>
        <el-table-column label="属性是否可选" width="120" align="center">
          <template slot-scope="scope">{{scope.row.selectType|selectTypeFilter}}</template>
        </el-table-column>
        <el-table-column label="属性值的录入方式" width="150" align="center">
          <template slot-scope="scope">{{scope.row.inputType|inputTypeFilter}}</template>
        </el-table-column>
        <el-table-column label="可选值列表" align="center">
          <template slot-scope="scope">{{scope.row.inputList}}</template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdateAttr(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDeleteAttr(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="handleAttrSizeChange" @current-change="handleAttrCurrentChange"
                       :current-page="attrListQuery.page"
                       :page-sizes="[10,20,30,50]" :page-size="attrListQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper" :total="attrTotal">
        </el-pagination>
      </div>
    </el-dialog>

    <!-- 新增/修改属性 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogTypeEditorVisible" width="1000px">
      <el-form :model="productAttr" :rules="rules2" ref="productAttrFrom" label-width="150px">
        <el-form-item label="属性名称：" prop="name">
          <el-input v-model="productAttr.name"></el-input>
        </el-form-item>
        <el-form-item label="商品类型：">
          <el-select v-model="productAttr.productAttributeCategoryId" placeholder="请选择">
            <el-option
              v-for="item in goodsTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类筛选样式:">
          <el-radio-group v-model="productAttr.filterType">
            <el-radio :label="0">普通</el-radio>
            <el-radio :label="1">颜色</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="能否进行检索:">
          <el-radio-group v-model="productAttr.searchType">
            <el-radio :label="0">不需要检索</el-radio>
            <el-radio :label="1">关键字检索</el-radio>
            <el-radio :label="2">范围检索</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品属性关联:">
          <el-radio-group v-model="productAttr.relatedStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性是否可选:">
          <el-radio-group v-model="productAttr.selectType">
            <el-radio :label="0">唯一</el-radio>
            <el-radio :label="1">单选</el-radio>
            <el-radio :label="2">复选</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性值的录入方式:">
          <el-radio-group v-model="productAttr.inputType">
            <el-radio :label="0">手工录入</el-radio>
            <el-radio :label="1">从下面列表中选择</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="属性值可选值列表:">
          <el-input :autosize="true" type="textarea" v-model="inputListFormat"></el-input>
        </el-form-item>
        <el-form-item label="是否支持手动新增:">
          <el-radio-group v-model="productAttr.handAddStatus">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序属性：">
          <el-input v-model="productAttr.sort"></el-input>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>-->
        <!--<el-button  v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeEditorVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit('productAttrFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('productAttrFrom')">重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 120px;
    height: 120px;
    display: block;
  }
</style>

<script>
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/goodsType';
  import {handleCategorySpec} from '@/api/erp/goods/goods';
  import {
    page as productAttributePage,
    getObj as getProductAttr,
    addObj as addProductAttr,
    putObj as putProductAttr,
    delObj as delProductAttr
  } from '@/api/erp/goods/productAttribute';
  import {uploadPath} from '@/api/erp/goods/storage'

  const defaultProductAttr = {
    filterType: 0,
    handAddStatus: 0,
    inputList: '',
    inputType: 0,
    name: '',
    productAttributeCategoryId: undefined,
    relatedStatus: 0,
    searchType: 0,
    selectType: 0,
    sort: 0,
    type: 0
  };
  export default {
    name: 'Brand',
    data() {
      return {
        uploadPath,
        clientHeight: 300,
        isLoading: false,
        goodsTypeList: undefined,
        list: undefined,
        total: undefined,
        attrTotal: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          name: undefined
        },
        attrListQuery: {
          page: 1,
          limit: 20,
          productAttributeCategoryId: undefined,
          type: undefined
        },
        dataForm: {
          id: undefined,
          name: undefined,
        },
        productAttr: Object.assign({}, defaultProductAttr),
        dialogFormVisible: false,
        dialogTypeVisible: false,
        dialogTypeEditorVisible: false,
        dialogStatus: '',
        dialogType: '',
        textMap: {
          update: '编辑',
          create: '创建',
          parameter: '参数列表',
          attribute: '属性列表'
        },
        rules1: {
          name: [
            {required: true, message: '类型名称不能为空', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        rules2: {
          name: [
            {required: true, message: '属性名称不能为空', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        attrList: [],
        inputListFormat: undefined,
        isEdit: false,
        attrType: undefined,
        attributeCategoryId: undefined,
        categorySpecStatus: true
      }
    },
    created() {
      this.getList();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
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
        this.clientHeight = (document.body.clientHeight - (170 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.goodsTypeList = response.data.records;
          this.total = response.data.total;
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
      handleAttrSizeChange(val) {
        this.attrListQuery.limit = val;
        this.getList()
      },
      handleAttrCurrentChange(val) {
        this.attrListQuery.page = val;
        this.getList();
      },
      resetFormCate() {
        this.dataForm = {
          id: undefined,
          name: undefined,
        };
      },
      handleCreate() {
        this.resetFormCate();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        })
      },
      handleCategorySpec() {
        this.categorySpecStatus = false;
        handleCategorySpec().then(response => {
          if (response.code == '2000') {
            this.categorySpecStatus = true;
            this.getList();
            this.$notify({
              title: '成功',
              message: '同步成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.categorySpecStatus = true;
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
      createGoodsType() {
        this.isLoading = true;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              this.isLoading = false;
              if (response.code == '2000') {
                // this.list.unshift(response.data);
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
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
        this.dataForm = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateGoodsType() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm).then(response => {
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
          delObj(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            // const index = this.list.indexOf(row);
            // this.list.splice(index, 1);
            this.getList();
          });
        });
      },
      handleAttributeList(row) {
        this.attrList = [];
        this.attrListQuery.productAttributeCategoryId = row.id;
        this.attrListQuery.type = 0;
        this.attrType = 0;
        productAttributePage(this.attrListQuery).then(response => {
          this.attrList = response.data.records;
          this.attrTotal = response.data.total;
        }).catch(() => {
          this.attrList = [];
          this.attrTotal = 0;
        });
        this.dialogTypeVisible = true;
        this.attributeCategoryId = row.id;
        this.dialogType = 'attribute';

      },
      handleParameterList(row) {
        this.attrList = [];
        this.attrListQuery.productAttributeCategoryId = row.id;
        this.attrListQuery.type = 1;
        this.attrType = 1;
        productAttributePage(this.attrListQuery).then(response => {
          this.attrList = response.data.records;
          this.attrTotal = response.data.total;
        }).catch(() => {
          this.attrList = [];
          this.attrTotal = 0;
        });
        this.dialogTypeVisible = true;
        this.attributeCategoryId = row.id;
        this.dialogType = 'parameter';
      },
      addProductAttr() {
        this.resetProductAttr();
        this.dialogTypeEditorVisible = true;
        this.dialogStatus = 'create';
        this.isEdit = false;
      },
      handleUpdateAttr(row) {
        getProductAttr(row.id).then(response => {
          this.productAttr = response.data;
          this.inputListFormat = this.productAttr.inputList.replace(/,/g, '\n');
        });
        this.dialogTypeEditorVisible = true;
        this.dialogStatus = 'update';
        this.isEdit = true;
      },
      handleDeleteAttr(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delProductAttr(row.id).then(() => {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            productAttributePage(this.attrListQuery).then(response => {
              this.attrList = response.data.records;
              this.attrTotal = response.data.total;
            }).catch(() => {
              this.attrList = [];
              this.attrTotal = 0;
            });
          });
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              putProductAttr(this.productAttr).then(() => {
                this.$message({
                  message: '修改成功',
                  type: 'success',
                  duration: 1000
                });
                productAttributePage(this.attrListQuery).then(response => {
                  this.attrList = response.data.records;
                });
                this.dialogTypeEditorVisible = false;
              });
            } else {
              addProductAttr(this.productAttr).then(() => {
                this.$message({
                  message: '添加成功',
                  type: 'success',
                  duration: 1000
                });
                productAttributePage(this.attrListQuery).then(response => {
                  this.attrList = response.data.records;
                });
                this.dialogTypeEditorVisible = false;
              });
            }
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      handleFlushPage() {
        this.dialogTypeVisible = false;
        this.getList();
      },
      resetProductAttr() {
        this.productAttr = Object.assign({}, defaultProductAttr);
        this.productAttr.type = this.attrType;
        this.productAttr.productAttributeCategoryId = this.attributeCategoryId;
        this.inputListFormat = undefined;
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.resetProductAttr();
      }
    },
    filters: {
      inputTypeFilter(value) {
        if (value === 1) {
          return '从列表中选取';
        } else {
          return '手工录入'
        }
      },
      selectTypeFilter(value) {
        if (value === 1) {
          return '单选';
        } else if (value === 2) {
          return '多选';
        } else {
          return '唯一'
        }
      },
    },
    watch: {
      inputListFormat: function (newValue, oldValue) {
        newValue = newValue.replace(/\n/g, ',');
        this.productAttr.inputList = newValue;
      }
    }
  }
</script>
