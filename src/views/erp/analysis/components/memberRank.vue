<template>
  <div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="采购额" prop="sales" align="right"></el-table-column>
      <el-table-column label="注册日期" prop="crtTime" align="right"></el-table-column>
    </el-table>

    <div class="pagination-container" style="margin-top: 10px;text-align: left">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {selectMemberRank } from '@/api/erp/analysis/managementAnalysis'
  export default {
    name: 'memberRank',
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
        selectMemberRank(this.listQuery).then(res=>{
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
