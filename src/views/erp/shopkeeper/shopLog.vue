<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.operation" placeholder="操作名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.ip" placeholder="ip" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="600">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="操作名称" prop="operation"></el-table-column>
      <el-table-column label="操作时间" prop="createTime"></el-table-column>
      <el-table-column label="操作IP" prop="ip"></el-table-column>
      <el-table-column label="操作内容" prop="method"></el-table-column>

    </el-table>

    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[20,50,100,500]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {selectOperationLog} from '@/api/erp/shopkeeper/shopList';
  export default {
    name: 'shopLog',
    data(){
      return{
        list:[],
        listLoading:false,
        listQuery:{
          page:1,
          limit:10
        },
        total:0
      }
    },
    props:['id'],
    created() {
      this.getList()
    },
    methods:{
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getList(){
        this.listQuery.id=this.id
        this.listLoading=true
        selectOperationLog(this.listQuery).then(res=>{
          this.listLoading=false
          if(Number(res.code)===200||Number(res.code)===2000){
            this.list=res.data.records
            this.total=res.data.total

          }
        })
      },

      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.getList()
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
    }
  }
</script>

<style scoped>

</style>
