<template> 
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.brandName" class="input-width" style="width: 200px;" placeholder="品牌名称"></el-input>
      <el-select v-model="listQuery.recommendStatus" placeholder="推荐状态" style="width: 200px;" clearable
                 class="input-width">
        <el-option v-for="item in recommendOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearchList()">查询</el-button>
      <el-button type="danger" icon="el-icon-refresh" size="mini" @click="handleResetSearch()">重置</el-button>
      <el-button type="success" icon="el-icon-circle-plus-outline" :class="select===1?'selectActive':'select'"
                 @click="handleSelectBrand()">选择品牌
      </el-button>
    </div>
    <div class="table-container">
      <el-table ref="homeBrandTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{scope.row.brandName}}</template>
        </el-table-column>
        <el-table-column label="标语" align="center">
          <template slot-scope="scope">{{scope.row.slogan}}</template>
        </el-table-column>
        <el-table-column label="标语图片" width="188" align="center">
          <template slot-scope="scope"><img style="max-width: 148px;max-height: 148px;margin: 20px;"
                                            :src="scope.row.sloganPic"></template>
        </el-table-column>
        <el-table-column label="是否推荐" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleRecommendStatusStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.recommendStatus">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="160" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="状态" width="160" align="center">
          <template slot-scope="scope">{{scope.row.recommendStatus | formatRecommendStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleEditSort(scope.$index, scope.row)">设置排序
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleEditUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog title="选择品牌" :visible.sync="selectDialogVisible" width="40%">
      <el-input v-model="dialogData.listQuery.name"
                style="width: 250px;margin-bottom: 20px"
                size="small"
                placeholder="品牌名称搜索">
        <el-button slot="append" icon="el-icon-search" @click="handleSelectSearch()"></el-button>
      </el-input>
      <el-table :data="dialogData.list"
                @selection-change="handleDialogSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
<!--        <el-table-column label="相关" width="220" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            商品：<span class="color-main">{{scope.row.productCount}}</span>-->
<!--            评价：<span class="color-main">{{scope.row.productCommentCount}}</span>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleDialogSizeChange"
          @current-change="handleDialogCurrentChange"
          layout="prev, pager, next"
          :current-page.sync="dialogData.listQuery.page"
          :page-size="dialogData.listQuery.limit"
          :page-sizes="[5,10,15]"
          :total="dialogData.total">
        </el-pagination>
      </div>
      <div style="clear: both;"></div>
      <div slot="footer">
        <el-button size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSelectDialogConfirm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设置排序"
               :visible.sync="sortDialogVisible"
               width="40%">
      <el-form :model="sortDialogData"
               label-width="150px">
        <el-form-item label="排序：">
          <el-input v-model="sortDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="sortDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdateSort" size="small">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑"
               :visible.sync="updateDialogVisible"
               width="40%">
      <el-form :model="updateDialogData"
               label-width="150px">
        <el-form-item label="标语：">
          <el-input v-model="updateDialogData.slogan" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="标语图片：">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl"
                     :class="updateDialogData.sloganPic?'avatar-box':''">
            <img v-if="updateDialogData.sloganPic" :src="updateDialogData.sloganPic" class="avatar"
                 style="max-width: 145px;max-height: 145px;">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="updateDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdate" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    updateRecommendStatus,
    deleteHomeBrand,
    createHomeBrand,
    updateHomeBrandSort,
    update
  } from '@/api/mall/sms/homeBrand';
  import {page as fetchBrandList, putObj, getObjs} from '@/api/erp/goods/brand';
  import {uploadPath} from '@/api/erp/goods/storage'

  const defaultListQuery = {
    page: 1,
    limit: 5,
    brandName: null,
    recommendStatus: null
  };
  const defaultRecommendOptions = [
    {
      label: '未推荐',
      value: 0
    },
    {
      label: '推荐中',
      value: 1
    }
  ];
  export default {
    name: 'homeBrandList',
    data() {
      return {
        uploadPath,
        select: 1,
        updateDialogVisible: false,
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "设为推荐",
            value: 0
          },
          {
            label: "取消推荐",
            value: 1
          },
          {
            label: "删除",
            value: 2
          }
        ],
        operateType: null,
        selectDialogVisible: false,
        dialogData: {
          list: null,
          total: null,
          multipleSelection: [],
          listQuery: {
            name: null,
            page: 1,
            limit: 5
          }
        },
        sortDialogVisible: false,
        updateDialogData: {
          id: undefined,
          slogan: null,
          sloganPic: null,
        },
        sortDialogData: {sort: 0, id: null}
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatRecommendStatus(status) {
        if (status === 1) {
          return '推荐中';
        } else {
          return '未推荐';
        }
      }
    },
    methods: {
      uploadPicUrl: function (response) {
        this.updateDialogData.sloganPic = response.data.url;
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleRecommendStatusStatusChange(index, row) {
        this.updateRecommendStatusStatus(row.id, row.recommendStatus);
      },
      handleEditUpdate(index, row) {
        let data = JSON.parse(JSON.stringify(this.list[index]));
        this.updateDialogData.id = data.id;
        getObjs(data.id).then(res => {
          if (res.code == '2000' || res.code == 2000) {
            if (res.data && res.data.slogan) {
              this.updateDialogData.slogan = res.data.slogan;
            } else {
              this.updateDialogData.slogan = undefined;
            }
            if (res.data && res.data.sloganPic) {
              this.updateDialogData.sloganPic = res.data.sloganPic;
            } else {
              this.updateDialogData.sloganPic = undefined;
            }
            this.updateDialogVisible = true;
          } else {
            this.updateDialogData.slogan = undefined;
            this.updateDialogData.sloganPic = undefined;
          }
        })

      },
      handleDelete(index, row) {
        this.deleteBrand(row.id);
      },
      handleBatchOperate() {
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
        if (this.operateType === 0) {
          //设为推荐
          this.updateRecommendStatusStatus(ids, 1);
        } else if (this.operateType === 1) {
          //取消推荐
          this.updateRecommendStatusStatus(ids, 0);
        } else if (this.operateType === 2) {
          //删除
          this.deleteBrand(ids);
        } else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
          return;
        }
      },
      handleSelectBrand() {
        this.selectDialogVisible = true;
        this.getDialogList();
      },
      handleSelectSearch() {
        this.getDialogList();
      },
      handleDialogSizeChange(val) {
        this.dialogData.listQuery.page = 1;
        this.dialogData.listQuery.limit = val;
        this.getDialogList();
      },
      handleDialogCurrentChange(val) {
        this.dialogData.listQuery.page = val;
        this.getDialogList();
      },
      handleDialogSelectionChange(val) {
        this.dialogData.multipleSelection = val;
      },
      handleSelectDialogConfirm() {
        if (this.dialogData.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let selectBrands = [];
        for (let i = 0; i < this.dialogData.multipleSelection.length; i++) {
          selectBrands.push({
            brandId: this.dialogData.multipleSelection[i].id,
            brandName: this.dialogData.multipleSelection[i].name
          });
        }
        this.$confirm('使用要进行添加操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          createHomeBrand(selectBrands).then(response => {
            this.selectDialogVisible = false;
            this.dialogData.multipleSelection = [];
            this.getList();
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
          });
        });
      },
      handleEditSort(index, row) {
        this.sortDialogVisible = true;
        this.sortDialogData.sort = row.sort;
        this.sortDialogData.id = row.id;
      },
      handleUpdateSort() {
        this.$confirm('是否要修改排序?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateHomeBrandSort(this.sortDialogData).then(response => {
            this.sortDialogVisible = false;
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        })
      },
      handleUpdate() {
        this.$confirm('是否要编辑当前数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          update(this.updateDialogData).then(response => {
            this.updateDialogVisible = false;
            this.getList();
            this.$message({
              type: 'success',
              message: '编辑成功!'
            });
          });
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.records;
          this.total = response.data.total;
        })
      },
      updateRecommendStatusStatus(ids, status) {
        this.$confirm('是否要修改推荐状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          params.append("recommendStatus", status);
          updateRecommendStatus(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      deleteBrand(ids) {
        this.$confirm('是否要删除该推荐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = new URLSearchParams();
          params.append("ids", ids);
          deleteHomeBrand(params).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删成功!'
            });
          });
        })
      },
      getDialogList() {
        fetchBrandList(this.dialogData.listQuery).then(response => {
          this.dialogData.list = response.data.records;
          this.dialogData.total = response.data.total;
        })
      }
    }
  }
</script>
<style></style>


