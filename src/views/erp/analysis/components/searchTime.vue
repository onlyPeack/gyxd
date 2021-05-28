<template>
  <div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="400">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="品名" prop="name"></el-table-column>
      <el-table-column label="品牌" prop="brandName"></el-table-column>
      <el-table-column label="系列" prop="seriesName"></el-table-column>
      <el-table-column label="订货号" prop="itemNo"></el-table-column>
      <el-table-column label="规格型号" prop="specModel"></el-table-column>
      <el-table-column label="次数" prop="count"></el-table-column>
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
  import {selectSearchFrequencyRank } from '@/api/erp/analysis/managementAnalysis'
  export default {
    name: 'searchTime',
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
        selectSearchFrequencyRank(this.listQuery).then(res=>{
          this.listLoading=false
          if(Number(res.code)===200||Number(res.code)===2000){
            this.list=res.data.records
            for (let i = 0; i <this.list.length ; i++) {
              let date=new Date().getTime() - new Date(this.list[i].crtTime).getTime()
              this.list[i].duration=Math.floor(date/(24*3600*1000))
            }
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
