<template>
  <div class="app-container calendar-list-container">

    <el-row>
      <el-col :span="4">
        <el-card class="box-card" :style="{height:(clientHeight+90)+'px'}" style="overflow: auto;">
          <el-row>
            <el-col :span="16">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="text" icon="plus" @click="handleOpenTree" style="margin-left: 15px;font-size: 14px;">
                <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>
                <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>
              </el-button>
            </el-col>
          </el-row>
          <el-tree
            class="filter-tree"
            :data="categoryList"
            node-key="value"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="categoryTree"
            @node-click="getNodeData"
            default-expand-all
            style='margin-top:10px;'
          >
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="20" style='padding-left:10px;'>
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>
          <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                         style="display: inline-block;margin-right: 5px;">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
              <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入父类目ID" v-model="listQuery.pid">
          </el-input>-->
          <!--<el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目ID" v-model="listQuery.id">-->
          <!--</el-input>-->
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入类目名称" v-model="listQuery.name"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <div style="display: inline-block;vertical-align: top">
            <el-select v-model="listQuery.level" clearable placeholder="请选择类目级别">
              <el-option value="L1" label="一级类目"></el-option>
              <el-option value="L2" label="二级类目"></el-option>
              <el-option value="L3" label="三级类目"></el-option>
              <el-option value="L4" label="四级类目"></el-option>
            </el-select>
          </div>

          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="handleCreate" icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download"
                     @click="handleDownload">导出
          </el-button>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row :height="clientHeight" style="width: 100%;height: 100%;position:relative;"
                  :default-sort="{prop: 'id', order: 'ascending'}">
          <el-table-column align="center" label="类目ID" prop="id" width="120" sortable>
          </el-table-column>
          <el-table-column align="center" label="类目名" prop="name">
          </el-table-column>
          <el-table-column align="center" property="iconUrl" label="类目图标">
            <template slot-scope="scope">
              <img :src="scope.row.iconUrl" width="40" v-if="scope.row.iconUrl"/>
            </template>
          </el-table-column>
          <el-table-column align="center" property="picUrl" label="类目图片">
            <template slot-scope="scope">
              <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
            </template>
          </el-table-column>
          <el-table-column align="center" label="关键字" prop="keywords">
          </el-table-column>
          <el-table-column align="center" min-width="100" label="简介" prop="desc">
          </el-table-column>
          <el-table-column label="导航栏" width="100" align="center">
            <template slot-scope="scope">
              <el-switch
                @change="handleNavStatusChange(scope.$index, scope.row)"
                :active-value=1
                :inactive-value=0
                v-model="scope.row.navStatus">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="是否显示" width="100" align="center">
            <template slot-scope="scope">
              <el-switch
                @change="handleShowStatusChange(scope.$index, scope.row)"
                :active-value=1
                :inactive-value=0
                v-model="scope.row.showStatus">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="级别" prop="level">
            <template slot-scope="scope">
              <el-tag :type="scope.row.level === 'L1' ? 'primary' : 'info' ">
                <span v-if="scope.row.level === 'L1'">一级类目</span>
                <span v-if="scope.row.level === 'L2'">二级类目</span>
                <span v-if="scope.row.level === 'L3'">三级类目</span>
                <span v-if="scope.row.level === 'L4'">四级类目</span>
              </el-tag>
            </template>
          </el-table-column>

          <!--<el-table-column align="center" label="父类目ID" prop="pid">
          </el-table-column>-->

          <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
              <!--<el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
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
      </el-col>
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="类目名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="dataForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="dataForm.level" @change="onLevelChange">
            <el-option label="一级类目" value="L1">
            </el-option>
            <el-option label="二级类目" value="L2">
            </el-option>
            <el-option label="三级类目" value="L3">
            </el-option>
            <el-option label="四级类目" value="L4">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父类目" prop="pid" v-if="dataForm.level != 'L1'">
          <el-select v-model="dataForm.pid" filterable>
            <el-option v-for="item in catLevel" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="dataForm.sortOrder"></el-input>
        </el-form-item>
        <el-form-item label="类目图标" prop="iconUrl">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :on-success="uploadIconUrl">
            <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="类目图片" prop="picUrl">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="类目简介" prop="desc">
          <el-input v-model="dataForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="dataForm.brandIds" multiple placeholder="请选择" @change="handleSelectChange" filterable>
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="dataForm.showStatus">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示在导航栏">
          <el-radio-group v-model="dataForm.navStatus">
            <el-radio :label=1>是</el-radio>
            <el-radio :label=0>否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="isLoading">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<style scoped>
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

  .curr-classify {
    font-size: 14px;
    position: relative;
    top: -2px;
    color: #5a5e66;
  }

  .el-breadcrumb__inner a {
    color: #1276c3 !important;
    cursor: pointer !important;
  }
</style>

<script>
  import {
    page,
    getCategoryBylevel,
    addObj,
    putObj,
    delObj,
    categoryTree,
    updateNavStatus,
    updateShowStatus
  } from '@/api/erp/goods/category'
  import {uploadPath} from '@/api/erp/goods/storage'
  import {allBrand, pageBycategoryId} from '@/api/erp/goods/brand';

  export default {
    name: 'Category',
    data() {
      return {
        uploadPath,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          name: undefined
        },
        catLevel: {},
        dataForm: {
          id: undefined,
          name: '',
          keywords: '',
          level: 'L2',
          pid: undefined,
          desc: '',
          iconUrl: undefined,
          picUrl: undefined,
          navStatus: 1,
          showStatus: 1,
          brandIds: []
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{required: true, message: '类目名不能为空', trigger: 'blur'}],
          sortOrder: [{required: true, message: '排序不能为空', trigger: 'blur'}]
        },
        downloadLoading: false,
        categoryList: [],
        clientHeight: 300,
        isOpenTree: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        breadcrumbList: [{label: '所有分类', value: 0}],
        brandList: []
      }
    },
    watch: {
      filterText(val) {
        this.$refs.menuTree.filter(val);
      }
    },
    created() {
      this.getCategoryList();
      this.init();
      this.getList();
      this.changeDivHeight();
      this.getCatBylevel('L1');
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    methods: {
      changeDivHeight() {
        this.clientHeight = document.body.clientHeight - 230;
      },
      getCategoryList() {
        categoryTree().then(response => {
          this.categoryList = response.data.categoryList;
        });
      },
      init() {
        allBrand().then(response => {
          this.brandList = response;
        })
      },
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
        });
      },
      handleOpenTree() {
        this.isOpenTree = !this.isOpenTree;
        for (var i in this.$refs.categoryTree.store.nodesMap) {
          this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getAllParentNode(node, arr) {
        if (node.parent && node.parent.label) {
          arr.push({
            label: node.parent.label,
            value: node.parent.key
          });
          if (node.parent.parent) {
            this.getAllParentNode(node.parent, arr);
          }
        }
        return arr;
      },
      getNodeData(data, node) {
        this.listQuery.pid = data.value;
        var breadcrumbList = [];
        breadcrumbList.push(data);
        if (node.parent) {
          breadcrumbList = this.getAllParentNode(node, breadcrumbList);
        }
        this.breadcrumbList = breadcrumbList.reverse();
        this.handleFilter();
      },
      changeTreeNode(data, index) {
        this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
        this.listQuery.pid = data.value;
        this.$refs.categoryTree.setCurrentKey(data.value);
        this.handleFilter();
      },
      getCatBylevel(level) {
        getCategoryBylevel(level).then(response => {
          this.catLevel = response.data;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      resetForm() {
        this.dataForm = {
          id: undefined,
          name: '',
          keywords: '',
          level: 'L2',
          pid: undefined,
          desc: '',
          iconUrl: undefined,
          picUrl: undefined,
          navStatus: 1,
          showStatus: 1,
          brandIds: []
        }
      },
      filterLevel: function (value, row) {
        return row.level === value;
      },
      onLevelChange: function (value) {
        this.dataForm.pid = undefined;
        if (value === 'L2') {
          this.getCatBylevel('L1');
        } else if (value === 'L3') {
          this.getCatBylevel('L2');
        } else if (value === 'L4') {
          this.getCatBylevel('L3');
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
      uploadIconUrl: function (response) {
        this.dataForm.iconUrl = response.data.url
      },
      uploadPicUrl: function (response) {
        this.dataForm.picUrl = response.data.url
      },
      createData() {
        this.isLoading = true;
        if (this.dataForm.level != 'L1' && this.dataForm.pid == undefined) {
          this.$notify({
            title: '提示',
            message: '请选择父类目',
            type: 'warning',
            duration: 2000
          });
          this.isLoading = false;
          return;
        }

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              this.isLoading = false;
              if (response.code == '2000') {
                this.list.unshift(response.data);
                this.dialogFormVisible = false;
                this.getCategoryList();
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
      handleSelectChange() {
        this.$forceUpdate();
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        if (!this.dataForm.brandIds) {
          this.dataForm.brandIds = [];
        }
        this.$forceUpdate();
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
                this.getList();
                this.getCategoryList();
                this.$notify({
                  title: '成功',
                  message: '更新成功',
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
            });
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('该操作将删除该类目及其下属所有子类目，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.getCategoryList();
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            });
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
          });
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['类目ID', '类目名', '类目图标', '类目图片', '关键字', '简介', '导航栏', '是否显示', '级别'];
          const filterVal = ['id', 'name', 'iconUrl', 'picUrl', 'keywords', 'desc', 'navStatus', 'showStatus', 'level']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品类目')
          this.downloadLoading = false
        })
      },
      handleNavStatusChange(index, row) {
        updateNavStatus(row.navStatus, row.id).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
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
      handleShowStatusChange(index, row) {
        updateShowStatus(row.showStatus, row.id).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
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
      }
    }
  }
</script>
