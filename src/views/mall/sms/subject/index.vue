<template> 
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.recommendStatus" placeholder="推荐状态" style="width: 200px;" clearable class="input-width">
        <el-option v-for="item in recommendOptions"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearchList()">查询</el-button>
      <el-button type="danger" icon="el-icon-refresh" size="mini" @click="handleResetSearch()">重置</el-button>
      <el-button size="mini" type="success" icon="el-icon-plus" @click="handleInsert()">新建</el-button>
    </div>
    <div class="table-container">
      <el-table ref="homeBrandTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="排序" align="center" width="90">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="专题主图" width="420" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.pic"></template>
        </el-table-column>
        <el-table-column label="推荐状态" width="200" align="center">
          <template slot-scope="scope">{{scope.row.recommendStatus == 0 ? '不是':'是'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
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
    <el-dialog :title="subjectData[subjectIndex].text"
               :visible.sync="subjectDialogVisible"
               width="40%">
      <el-form :model="subjectDialogData" :rules="rules" ref="subjectDialogData"
               label-width="150px">
        <el-form-item label="标题：" prop="title">
          <el-input v-model="subjectDialogData.title" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="品牌：" prop="categoryName">
          <el-input v-model="subjectDialogData.categoryName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="subjectDialogData.sort" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="专题主图：" prop="pic">
          <el-upload class="avatar-uploader" :action='uploadPath' list-type="picture-card" :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl"  :class="subjectDialogData.pic?'avatar-box':''">
            <img v-if="subjectDialogData.pic" :src="subjectDialogData.pic" class="avatar" style="max-width:148px;max-height: 148px; ">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="推荐：" prop="recommendStatus">
          <el-radio v-model="subjectDialogData.recommendStatus" :label="1">是</el-radio>
          <el-radio v-model="subjectDialogData.recommendStatus" :label="0">不是</el-radio>
        </el-form-item>

      </el-form>
      <span slot="footer">
        <el-button @click="subjectDialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleUpdate" :loading="isSubject" size="small">确 定</el-button>
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
  import {page,delObj,getObj,addObj,putObj} from '@/api/mall/cms/cmsSubject';
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
        isSubject:false,
        rules: {
          title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
          sort: [{required: true, message: '排序不能为空', trigger: 'blur'}],
          pic: [{required: true, message: '专题主图不能为空', trigger: 'blur'}],
          recommendStatus: [{required: true, message: '推荐不能为空', trigger: 'blur'}],
          categoryName: [{required: true, message: '品牌不能为空', trigger: 'blur'}],
        },
        subjectDialogVisible:false,
        listQuery: Object.assign({}, defaultListQuery),
        recommendOptions: Object.assign({}, defaultRecommendOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operateType: null,
        selectDialogVisible: false,
        subjectIndex:1,
        subjectData:[
          {
            value: 0,
            text: '新增'
          },
          {
            value: 1,
            text:'修改'
          }
        ],
        sortDialogVisible: false,
        subjectDialogData:{
          id: undefined,
          title: null,
          sort: null,
          pic:undefined,
          recommendStatus: undefined,
          categoryName: undefined,
        },
        sortDialogData: {sort: 0, id: null}
      }
    },
    created() {
      this.getList();
    },
    methods: {
      uploadPicUrl: function (response) {
        this.subjectDialogData.pic = response.data.url;
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
      handleInsert(){
        this.subjectIndex = 0;
        this.subjectDialogData ={
            title: null,
            sort: null,
            pic:undefined,
            recommendStatus: undefined,
            categoryName:undefined,
        },
        this.subjectDialogVisible = true;
      },
      handleEditUpdate(index,row){
        getObj(this.list[index].id).then(res=>{
          this.subjectDialogData ={
            id: res.data.id,
            title: res.data.title,
            sort: res.data.sort,
            pic:res.data.pic,
            recommendStatus: res.data.recommendStatus,
            categoryName: res.data.categoryName,
          };
          this.subjectIndex = 1;
          this.subjectDialogVisible = true;
        })

      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该推荐?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(response => {
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
        })
      },
      handleUpdate(){
        this.$refs['subjectDialogData'].validate((valid) => {
          if (valid) {
            this.isSubject = true;
            if(this.subjectIndex == 0){
              addObj(this.subjectDialogData).then(res=>{
                if(res.code == '2000' || res.code == 2000){
                  this.vueMessage('success','添加成功!');
                  this.subjectDialogVisible = false;
                  this.isSubject = false;
                }else{
                  this.vueMessage('warning','添加失败!');
                  this.subjectDialogVisible = false;
                  this.isSubject = false;
                }
                this.getList();
              })
              this.subjectDialogVisible = false;
              this.isSubject = false;
            }else{
              putObj(this.subjectDialogData.id,this.subjectDialogData).then(res=>{
                if(res.code == '2000' || res.code == 2000){
                  this.vueMessage('success','修改成功!');
                  this.subjectDialogVisible = false;
                  this.isSubject = false;
                }else{
                  this.vueMessage('warning','修改失败!');
                  this.subjectDialogVisible = false;
                  this.isSubject = false;
                }
                this.getList();
              })
              this.subjectDialogVisible = false;
              this.isSubject = false;
            }
          }
        })
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.records;
          this.total = response.total;
        })
      },
    }
  }
</script>
<style></style>


