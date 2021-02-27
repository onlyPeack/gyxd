<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商ID" v-model="listQuery.id"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商名称" v-model="listQuery.name"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌商英文名称" v-model="listQuery.nameEn"
                @keyup.enter.native="handleFilter">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload"
                 :loading="downloadLoading">导出
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row :height="clientHeight" :default-sort="{prop: 'id', order: 'ascending'}">
      <el-table-column align="center" label="品牌商ID" prop="id" sortable>
      </el-table-column>
      <el-table-column align="center" label="品牌商名称" prop="name">
      </el-table-column>
      <el-table-column align="center" label="英文名称" prop="nameEn">
      </el-table-column>
      <el-table-column align="center" property="picUrl" label="品牌商图片">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" width="80" v-if="scope.row.picUrl"/>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="品牌介绍" prop="desc">
      </el-table-column>
      <el-table-column align="center" label="底价" prop="floorPrice">
      </el-table-column>
      <el-table-column align="center" label="排序" prop="sortOrder">
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding fixed-width">
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="left" label-width="100px"
               style='width: 400px; margin-left:50px;'>
        <el-form-item label="品牌商名称" prop="name">
          <el-input v-model="dataForm.name"></el-input>
        </el-form-item>
        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="dataForm.nameEn"></el-input>
        </el-form-item>
        <el-form-item label="首字母" prop="firstLetter">
          <el-input v-model="dataForm.firstLetter"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input v-model="dataForm.sortOrder"></el-input>
        </el-form-item>
        <el-form-item label="品牌介绍" prop="simpleDesc">
          <el-input type="textarea" :rows="3" v-model="dataForm.desc"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="picUrl">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <label class="propose">*&nbsp;&nbsp;建议尺寸为180*60</label>
        </el-form-item>
        <el-form-item label="底价" prop="floorPrice">
          <el-input v-model="dataForm.floorPrice"></el-input>
        </el-form-item>
        <!--<el-form-item label="系列" prop="series">-->
        <!--<el-select v-model="dataForm.seriesIds" multiple placeholder="请选择" @change="handleSelectChange" filterable>-->
        <!--<el-option-->
        <!--v-for="item in seriesList"-->
        <!--:key="item.id"-->
        <!--:label="item.name"-->
        <!--:value="item.id">-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData" :loading="isLoading">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
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

  .propose {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(245, 77, 77, 1);
    margin-top: 20px;
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
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/brand';
  import {page as seriesPage} from '@/api/erp/goods/series';
  import {page as brandSeriesPage} from '@/api/erp/goods/brandSeries';
  import {uploadPath} from '@/api/erp/goods/storage'

  export default {
    name: 'Brand',
    data() {
      return {
        uploadPath,
        clientHeight: 300,
        isLoading: false,
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          id: undefined,
          nameEn: undefined,
          name: undefined
        },
        dataForm: {
          id: undefined,
          name: undefined,
          desc: undefined,
          floorPrice: undefined,
          picUrl: undefined,
          firstLetter: undefined,
          seriesIds: [],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          name: [{required: true, message: '品牌商名称不能为空', trigger: 'blur'}],
          firstLetter: [{required: true, message: '首字母不能为空', trigger: 'blur'}]
        },
        downloadLoading: false,
        seriesList: [],
      }
    },
    created() {
      // this.init();
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
      init() {
        seriesPage().then(response => {
          this.seriesList = response.data.records;
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
          id: undefined,
          name: undefined,
          desc: undefined,
          floorPrice: undefined,
          picUrl: undefined,
          seriesIds: []
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
      uploadPicUrl: function (response) {
        this.dataForm.picUrl = response.data.url;
      },
      createData() {
        this.isLoading = true;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              this.isLoading = false;
              if (response.code == '2000') {
                this.list.unshift(response.data);
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
      handleSelectChange() {
        this.$forceUpdate();
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        brandSeriesPage(row.id).then(response => {
          this.dataForm.seriesIds = [];
          for (var i in response.data) {
            this.dataForm.seriesIds.push(response.data[i].id);
          }
          this.$forceUpdate();
        });
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
            const index = this.list.indexOf(row);
            this.list.splice(index, 1);
            this.getList();
          });
        });
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['品牌商ID', '品牌商名称', '英文名称', '品牌商图片', '介绍', '底价'];
          const filterVal = ['id', 'name', 'nameEn', 'picUrl', 'desc', 'floorPrice'];
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '品牌推荐');
          this.downloadLoading = false
        })
      }
    }
  }
</script>
