<template>
  <div style="height: auto;padding: 40px">
    <div class="top">
      <div style="background-color: rgb(59,118,239);">
        <h2>今日访问量</h2>
        <h4>¥&nbsp;{{allData.pvCount}}</h4>
      </div>
      <div style="background-color: rgb(99,199,255);">
        <h2>今日访客数</h2>
        <h4>¥&nbsp;{{allData.uvCount}}</h4>
      </div>
      <div style="background-color: rgb(166,109,212);">
        <h2>IP数</h2>
        <h4>{{allData.ipCount}}</h4>
      </div>
<!--      <div style="background-color: rgb(109,212,177);">-->
<!--        <h2>IP数</h2>-->
<!--        <h4>&nbsp;{{allData.ipCount}}</h4>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h3>今日访问量</h3>-->
<!--        <h4>{{allData.pvCount}}</h4>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h3>今日访客数</h3>-->
<!--        <h4>{{allData.uvCount}}</h4>-->
<!--      </div>-->
<!--      <div>-->
<!--        <h3>IP数</h3>-->
<!--        <h4>{{allData.ipCount}}</h4>-->
<!--      </div>-->
<!--    </div>-->
<!--    <div class="line"></div>-->
    </div>
    <div style="height: 50px"></div>
    <div>
      <div style="text-align: center;margin-bottom: 20px;">
        <el-form label-width="120px" label-position="right" style="width: 400px;margin: 0 auto">
          <el-form-item label="时间范围：">
            <el-date-picker
              v-model="timeArr"
              type="daterange"
              align="right"
              unlink-panels
              @change="timeChange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>

<!--      <div>-->
<!--        <el-button :autofocus="true">7天</el-button>-->
<!--        <el-button>14天</el-button>-->
<!--        <el-button>28天</el-button>-->
<!--        <el-button>自定义</el-button>-->
<!--      </div>-->
      <div style="height: 500px;width: 1200px;margin: 0 auto">
        <div id="myChart" :style="{width: '100%', height: '100%'}"></div>
      </div>

    </div>
    <div style="margin-top: 30px;">
      <visit-time :data="allData" v-if="isAllLoad"/>
    </div>
  </div>

</template>

<script>
  import { selectPage} from '@/api/erp/analysis/visitorVolume'
  import visitTime from './components/visitTime'
  export default {
    name: 'visitorVolume',
    data(){
      return{
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近十四天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近二十八天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 28);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        listQuery:{},
        allData:{},
        xUser:[],
        userPV:[],
        userUV:[],
        timeArr:[],
        isAllLoad:false
      }
    },
    components:{visitTime},
    created() {
      // this.listQuery.startTime=this.oneWeek().after
      // this.listQuery.endTime=this.oneWeek().before
      this.timeArr=[this.oneWeek().after,this.oneWeek().before]
      // this.billDate=this.oneWeek().arr
      this.getData()
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

      getData(){
        this.listQuery.startTime=this.timeArr[0] +' 00:00:00'
        this.listQuery.endTime=this.timeArr[1] +' 23:59:59'
        selectPage(this.listQuery).then(res=>{
          this.allData=res.data
          console.log(Object.keys(this.allData.pvVisitorVolumeByDate))
          for (let i = 0; i <this.allData.pvVisitorVolumeByDate.length ; i++) {
            this.xUser.push(this.allData.pvVisitorVolumeByDate[i].dateTime)
            this.userPV.push(this.allData.pvVisitorVolumeByDate[i].count)
            this.userUV.push(this.allData.uvVisitorVolumeByDate[i].count)
          }
          this.isAllLoad=true
          this.drawLine()
        })
      },

      timeChange(value){
        this.getData()
      }
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
