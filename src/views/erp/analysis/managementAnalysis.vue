<template>
  <div style="height: auto;padding: 40px">
    <div class="top">
      <div style="background-color: rgb(59,118,239);">
        <h2>本期销售额</h2>
        <h4>¥&nbsp;{{allData.sales}}</h4>
      </div>
      <div style="background-color: rgb(99,199,255);">
        <h2>有效销售额</h2>
        <h4>¥&nbsp;{{allData.effectiveSales}}</h4>
      </div>
      <div style="background-color: rgb(166,109,212);">
        <h2>同比增长</h2>
        <h4>%&nbsp;{{allData.sales}}</h4>
      </div>
      <div style="background-color: rgb(109,212,177);">
        <h2>IP数</h2>
        <h4>&nbsp;{{allData.ipCount}}</h4>
      </div>
<!--      <div>-->
<!--        <h3>本期销售额</h3>-->
<!--        <h4>{{allData.sales}}</h4>-->
<!--        <h3>有效销售额</h3>-->
<!--        <h4>{{allData.effectiveSales}}</h4>-->
<!--        <h3>同比增长</h3>-->
<!--        <h4>{{allData.effectiveSales}}</h4>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h3>有效销售额</h3>-->
<!--        <h4>{{allData.effectiveSales}}</h4>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h3>IP数</h3>-->
<!--        <h4>{{allData.ipCount}}</h4>-->
<!--      </div>-->
    </div>
<!--    <div class="line"></div>-->
    <div>
<!--      <div>-->
<!--        <el-button>7天</el-button>-->
<!--        <el-button>14天</el-button>-->
<!--        <el-button>28天</el-button>-->
<!--        <el-button>自定义</el-button>-->
<!--      </div>-->
      <div style="height: 500px;width: 1200px;margin: 0 auto">
        <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
      </div>

    </div>
    <div style="height: 500px"></div>
  </div>
</template>

<script>
  import { selectPage} from '@/api/erp/analysis/managementAnalysis'
  export default {
    name: 'managementAnalysis',
    data(){
      return{
        listQuery:{},
        allData:{},
        xUser:[],
        userPV:[],
        userUV:[]
      }
    },
    created() {
      this.listQuery.startTime=this.oneWeek().after
      this.listQuery.endTime=this.oneWeek().before
      // this.billDate=this.oneWeek().arr
      selectPage(this.listQuery).then(res=>{
        this.allData=res.data
        console.log(Object.keys(this.allData.pvVisitorVolumeByDate))
        // for (let i = 0; i <this.allData.pvVisitorVolumeByDate.length ; i++) {
        //   this.xUser.push(this.allData.pvVisitorVolumeByDate[i].dateTime)
        //   this.userPV.push(this.allData.pvVisitorVolumeByDate[i].count)
        //   this.userUV.push(this.allData.uvVisitorVolumeByDate[i].count)
        // }
        this.drawLine()
      })
    },
    methods:{
      drawLine() {

        this.$nextTick(() => {
          // 基于准备好的dom，初始化echarts实例
          let myChart = this.$echarts.init(document.getElementById('myChart'))

          // 绘制图表
          myChart.setOption({
            title: {
              text: '用户访问量'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['PV', 'UV']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: this.xUser
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'PV',
                type: 'line',
                data: this.userPV
              },
              {
                name: 'UV',
                type: 'line',
                data: this.userUV
              }
            ]
          })
        })

      },
    }
  }
</script>

<style scoped>
  .top {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .top > div {
    height: 150px;
    width: 300px;
    background-color: #fff;
    border-radius: 10px;
    text-align: left;
    color: white;
    padding: 10px 20px;
    transition: 1s;
  }
  .top div:hover{
    background-color: rgb(59,118,239) !important;
  }
  .top div h2{
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 0;
  }
  .top div h4{
    font-size: 28px;
    margin-top: 15px;
  }
  .line{
    height: 1px;
    background-color: #999;
    margin-top: 50px;
  }
</style>
