<template>
  <div>
    <!-- 查询结果 -->
    <el-table size="small" :data="cleanArr" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row show-summary>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="日期" prop="dateTime"></el-table-column>
      <el-table-column label="店主访问量" prop="pv" align="right"></el-table-column>
      <el-table-column label="客户访问量" prop="uv" align="right"></el-table-column>
    </el-table>

<!--    <div class="pagination-container" style="margin-top: 10px;text-align: left">-->
<!--      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
<!--                     :current-page="listQuery.page"-->
<!--                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"-->
<!--                     layout="total, sizes, prev, pager, next, jumper" :total="total">-->
<!--      </el-pagination>-->
<!--    </div>-->

  </div>
</template>

<script>
  import {selectShopRank } from '@/api/erp/analysis/managementAnalysis'
  export default {
    name: 'visitTime',
    data(){
      return{
        list:[],
        listLoading:false,
        listQuery:{
          page:1,
          limit:10
        },
        total:0,
        cleanArr:[]
      }
    },
    props:['data'],
    created() {
      console.log(this.data)

      this.dataCompute()
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
        selectShopRank(this.listQuery).then(res=>{
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
      dataCompute(){
        this.cleanArr=[]
        for (let i = 0; i <this.data.pvVisitorVolumeByDate.length ; i++) {
          this.cleanArr.push({
            dateTime:this.data.pvVisitorVolumeByDate[i].dateTime,
            pv:this.data.pvVisitorVolumeByDate[i].count,
            uv:this.data.uvVisitorVolumeByDate[i].count
          })
        }
      }
    },

    watch:{
      data(){
        this.dataCompute()
      }
    }
  }
</script>

<style scoped>

</style>
