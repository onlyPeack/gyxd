<template>
  <div>
    <div class="dashboard-editor-container">
      <el-container>
        <el-main class="mainView">

          <el-row :gutter="20" class="rowsView">
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="grid-content bg-green"   v-loading.body="oneLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
                <div class="gridLeft">
                  <div class="gridItem">
                    <label>今日销售额</label>
                    <h2 v-if="mall && mall.dayMoney">￥{{mall.dayMoney}}</h2>
                  </div>
                </div>
                <img src="../../../assets/mallIndex/sale.png" width="47" height="47"/>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="grid-content bg-yellow" v-loading.body="twoLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
                <div class="gridLeft">
                  <div class="gridItem">
                    <label>今日订单数</label>
                    <h2 v-if="mall && mall.dayOrderCollect">{{mall.dayOrderCollect}}</h2>
                  </div>
                </div>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
                <img src="../../../assets/mallIndex/order.png" width="47" height="47"/>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="grid-content bg-blue" v-loading.body="treeLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
                <div class="gridLeft">
                  <div class="gridItem">
                    <label>出售总商品数</label>
                    <h2  v-if="mall && mall.sellGoods">{{mall.sellGoods}}</h2>
                  </div>
                </div>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
                <img src="../../../assets/mallIndex/commodity.png" width="47" height="47"/>
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
              <div class="grid-content bg-purple" v-loading.body="fourLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
                <div class="gridLeft">
                  <div class="gridItem">
                    <label>总会员数</label>
                    <h2 v-if="mall && mall.memberNumber">{{mall.memberNumber}}</h2>
                  </div>
                </div>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(4)"></i>
                <img src="../../../assets/mallIndex/person.png" width="47" height="47"/>
              </div>
            </el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="iconView">
              <div class="ViewItem" v-loading.body="oneEchartLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
                <div class="analyse">热销商品(单位:个)
                  <div class="trea-analyse">
                    <div><i class="el-icon-refresh" @click="saleTap(0)"></i></div>
                    <div><el-dropdown trigger="click">
                      <i class="el-icon-setting"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button @click="vocationalTap(0,0)" class="btn">本周</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(1,0)" class="btn">本月</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(2,0)" class="btn">本季度</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(3,0)" class="btn">本年</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(4,0)" class="btn">去年</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown></div>
                  </div>
                </div>
                <raddar-chart v-if="vocational[0].option.series[0].data.length>0" :height="height"  :vocational="vocational[0].option" @vocationalChange="vocationalChange" ref="vocational1"></raddar-chart>
                <div v-show="vocational[0].option.series[0].data.length<1" class="available">
                  <svg-icon icon-class="line" class="available-icon"></svg-icon>
                  <span>暂无数据~</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="iconView">
              <div class="ViewItem" v-loading.body="twoEchartLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
                <div class="analyse">订单数(单位:个)
                  <div class="trea-analyse">
                    <div><i class="el-icon-refresh" @click="saleTap(1)"></i></div>
                    <div><el-dropdown trigger="click">
                      <i class="el-icon-setting"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button @click="vocationalTap(0,1)" class="btn">本周</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(1,1)" class="btn">本月</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(2,1)" class="btn">本季度</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(3,1)" class="btn">本年</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(4,1)" class="btn">去年</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown></div>
                  </div>
                </div>
                <raddar-chart v-if="vocational[1].option.series[0].data.length>0" :height="height"  :vocational="vocational[1].option" @vocationalChange="vocationalChange" ref="vocational2"></raddar-chart>
                <div v-show="vocational[1].option.series[0].data.length<1" class="available">
                  <svg-icon icon-class="line" class="available-icon"></svg-icon>
                  <span>暂无数据~</span>
                </div>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="iconView">
              <div class="ViewItem" v-loading.body="treeEchartLoading"  element-loading-text="刷新中..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
                <div class="analyse">销售额(单位:金额)
                  <div class="trea-analyse">
                    <div><i class="el-icon-refresh" @click="saleTap(2)"></i></div>
                    <div><el-dropdown trigger="click">
                      <i class="el-icon-setting"></i>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item><el-button @click="vocationalTap(0,2)" class="btn">本周</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(1,2)" class="btn">本月</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(2,2)" class="btn">本季度</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(3,2)" class="btn">本年</el-button></el-dropdown-item>
                        <el-dropdown-item><el-button @click="vocationalTap(4,2)" class="btn">去年</el-button></el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown></div>
                  </div>
                </div>
                <raddar-chart v-if="vocational[2].option.series[0].data.length>0"  :height="height" :vocational="vocational[2].option" @vocationalChange="vocationalChange" ref="vocational3"></raddar-chart>
                <div v-show="vocational[2].option.series[0].data.length<1" class="available">
                  <svg-icon icon-class="line" class="available-icon"></svg-icon>
                  <span>暂无数据~</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
  import {getCollect,selectCounts,getComprehensiveCollect,comprehensiveSales} from "@/api/mall/statistical/index.js";
  import RaddarChart from '@/views/dashboard/admin/components/RaddarChart'
  export default {
    ame: "index.vue",
    components: {
      RaddarChart,
    },
    data(){
      return {
        mall:undefined,
        height: '500px',
        vocational: [
          {
            title: '本周',
            tote: 0,
            option: {
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
              },
              legend: {
                left: 'left',
                data: []
              },
              backgroundColor: '#ffffff',
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  },
                  formatter: function(value) {
                    // console.log(value);
                    var valueDetal = value.split("-").join("");
                    var ret = ""; //拼接加\n返回的类目项
                    var maxLength = 4; //每项显示文字个数
                    var valLength = valueDetal.length; //X轴类目项的文字个数
                    // console.log(valLength);
                    var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                    if (rowN > 1) { //如果类目项的文字大于3,
                      for (var i = 0; i < rowN; i++) {
                        var temp = ""; //每次截取的字符串
                        var start = i * maxLength; //开始截取的位置
                        var end = start + maxLength; //结束截取的位置
                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        temp = valueDetal.substring(start, end) + "\n";
                        ret += temp; //凭借最终的字符串
                      }
                      return ret;
                    } else {
                      return valueDetal;
                    }
                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    // color: ['#aaa', 'red'],    //设置网格线的颜色，可单独设置
                    color: '#E5E5E5',
                  },
                }
              },
              yAxis: {
                show:true,
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666',

                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    // color: ['#aaa', 'red'],    //设置网格线的颜色，可单独设置
                    color: '#E5E5E5',
                  },
                }
              },
              series: [{
                name: '热销产品',
                data: [],
                type: 'line',
                smooth: true,
                itemStyle : {
                  normal : {
                    color:'rgba(38,128,235,1)',
                    lineStyle:{
                      color:'rgba(38,128,235,1)'
                    }
                  }
                },
                areaStyle: {
                  normal: {
                    color: 'rgba(38,128,235,0.05)',
                  }
                }
              }]
            }
          },
          {
            title: '本周',
            tote: 0,
            option: {
              backgroundColor:"#ffffff",
              dataZoom:{
                realtime:true, //拖动滚动条时是否动态的更新图表数据
                height:25,//滚动条高度
                start:0,//滚动条开始位置（共100等份）
                end:100//结束位置（共100等份）
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
              },
              legend: {
                left: 'left',
                data: []
              },
              xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    color: '#E5E5E5',
                  },
                }
              },
              yAxis: {
                type: 'value',
                show:true,
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    color: '#E5E5E5',
                  },
                }
              },
              series: [{
                name: '订单数',
                data: [],
                type: 'bar',
                smooth: true,
                itemStyle: {
                  normal: {
                    color: function(params){
                      let colorList = [
                        'rgba(255,99,132,0.15)','rgba(38,128,235,0.15)','rgba(255,206,86,0.15);','rgba(75,192,192,0.15)',' rgba(153,102,255,0.15)',
                        'rgba(255,162,94,0.15)','rgba(0,190,84,0.15)'
                      ];
                      return colorList[1]
                    },
                  },

                },
              }]
            }
          },
          {
            title: '本周',
            tote: 0,
            option: {
              dataZoom:{
                realtime:true, //拖动滚动条时是否动态的更新图表数据
                height:25,//滚动条高度
                start:0,//滚动条开始位置（共100等份）
                end:100//结束位置（共100等份）
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
              },
              legend: {
                left: 'left',
                data: []
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    // color: ['#aaa', 'red'],    //设置网格线的颜色，可单独设置
                    color: '#E5E5E5',
                  },
                }
              },
              yAxis: {
                axisLine:{
                  lineStyle:{
                    color:'#E5E5E5',//这里是为了突出显示加上的
                  }
                },
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  }
                },
                splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
                  show: true,
                  lineStyle: {
                    type: 'solid',
                    // color: ['#aaa', 'red'],    //设置网格线的颜色，可单独设置
                    color: '#E5E5E5',
                  },
                }
              },
              series: [{
                name: '销售额',
                data: [],
                type: 'line',
                smooth: true,
                itemStyle: {
                  normal: {
                    color: 'rgba(255,162,94,1)',
                    lineStyle: {
                      color: 'rgba(255,162,94,1)'
                    }
                  }
                },
              }]
            }
          }
        ],
        animate: false,
        intNum: undefined,
        activeName: 'first',
        permissionMenus: this.$store.state.user.permissionMenus,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        dialogVisible: false,
        value1: [1, 4],
        selectedFeatures: [],
        myFeatures: [],
        messageNotification: [],
        selectRadio: '年',
        selectRadioTwo: '月',
        commonVisible: false,
        tableVisible: false,
        saleList: {
          saleroomThisDay: '',
          saleroomThisMonth: '',
          saleroomThisYear: '',
          salesMarginThisDay: '',
          salesMarginThisMonth: '',
          salesMarginThisYear: '',
          stockCostPrice: '',
          stockTotal: ''
        },
        fourLoading: false,
        treeLoading: false,
        twoLoading: false,
        oneLoading: false,
        tableLoading: false,
        oneEchartLoading: false,
        twoEchartLoading: false,
        treeEchartLoading: false,
        fourEchartLoading: false,
        freeEchartLoading: false,
        list: [],
        billOptions: [],
        taskAuditOptions: [],
        timer: undefined,
        scrollWidth: 0
      }
    },
    methods:{
      vocationalTap(index,val){
        this.vocational[val].title = index;
        if(val===0){
          this.oneEchartLoading = true;
          this.selectCounts(index)
        }
        if(val===1){
          this.twoEchartLoading = true;
          this.comprehensiveSales(index)
        }
        if(val===2){
          this.treeEchartLoading = true;
          this.getComprehensiveCollect(index)
        }
      },
      renovateTap(sum) {
        if (parseInt(sum) === 1) {
          this.oneLoading = true;
        }
        if (parseInt(sum) === 2) {
          this.twoLoading = true;
        }
        if (parseInt(sum) === 3) {
          this.treeLoading = true;
        }
        if (parseInt(sum) === 4) {
          this.fourLoading = true;
        }
        getCollect().then(res=>{
          if (parseInt(sum) === 1) {
            this.mall.dayMoney = res.data.dayMoney==null?0:res.data.dayMoney;
          }
          if (parseInt(sum) === 2) {
            this.mall.dayOrderCollect = res.data.dayOrderCollect==null?0:res.data.dayOrderCollect;
          }
          if (parseInt(sum) === 3) {
            this.mall.sellGoods = res.data.sellGoods==null?0:res.data.sellGoods;
          }
          if (parseInt(sum) === 4) {
            this.mall.memberNumber  = res.data.memberNumber==null?0:res.data.memberNumber;
          }
          setInterval(() => {
            this.oneLoading = false;
            this.twoLoading = false;
            this.treeLoading = false;
            this.fourLoading = false;
          }, 1000);
        })

      },
      saleTap(val){
        this.vocationalTap( this.vocational[val].title,val)
      },
      init() {
        getCollect().then(res => {
          this.mall = res.data
        })
        this.selectCounts(0)
        this.getComprehensiveCollect(0)
        this.comprehensiveSales(0)
      },
      vocationalChange(type) {
        const refName = 'vocational' + type;
        if (this.$refs[refName]) {
          this.$refs[refName].initChart();
        }
        setInterval(() => {
          this.oneEchartLoading = false;
          this.twoEchartLoading = false;
          this.treeEchartLoading = false;
        }, 1000);
      },
      selectCounts(val){
        selectCounts(val).then(res=> {
          let xObj = []
          let yObj = []
          for (let i in res.data) {
            xObj.push(res.data[i].productQuantity)
            yObj.push(res.data[i].productName)
          }
          this.vocational[0].option.series[0].data = xObj;
          this.vocational[0].option.xAxis.data = yObj;
          this.vocational[0].option.legend.data= yObj;
          this.vocationalChange(1)
        })
      },
      getComprehensiveCollect(val){
        getComprehensiveCollect(val).then(res=>{
          let xObj = []
          let yObj = []
          for(let i in res.data){
            xObj.push(res.data[i].totalAmount)
            yObj.push(res.data[i].date)
          }
          this.vocational[2].option.series[0].data=xObj;
          this.vocational[2].option.xAxis.data=yObj;
          this.vocational[2].option.legend.data= yObj;
          this.vocationalChange(3)
        })
      },
      comprehensiveSales(val){
        comprehensiveSales(val).then(res=>{
          let xObj = []
          let yObj = []
          for(let i in res.data){
            xObj.push(res.data[i].orderNumber)
            yObj.push(res.data[i].date)
          }
          this.vocational[1].option.series[0].data=xObj;
          this.vocational[1].option.xAxis.data=yObj;
          this.vocational[1].option.legend.data= yObj;
          this.vocationalChange(2)
        })
      },
    },
    created(){
      this.init()
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard-editor-container {
    min-width: 1280px;
    background-color: #f0f2f5;
  }
  /*首页*/
  .rowsView{
    margin-bottom:0;
  .el-col{
    margin-bottom: 10px;
  }
  }
  .el-row {
    margin-bottom: 4px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .grid-content  {
    max-width: 466px;
    max-height: 250px;
    min-width: 396px;
    min-height: 180px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    .el-icon-refresh{
      color:#ffffff;
      font-size: 18px;
      margin-right: 10px;
      margin-top: 10px;
    }
    .gridLeft{

    }
    img{
      position: absolute;
      right:25px;
      top:34px;
    }
    .gridItem{
      margin-left: 30px;
      margin-top: 38px;
      label{
        font-family:AlibabaPuHuiTiR;
        font-weight:400;
        color: #ffffff;
        font-size:18px;
      }
      h2{
        font-weight: normal !important;
        font-size:36px;
        color:#ffffff;
      }
    }
  .iconfont1 {
    font-size: 36px;
  }
  }
  .bg-green {
    background: url("../../../assets/mallIndex/rectangle1.png") no-repeat ;
    background-size: 100% 100%;
  }
  .bg-yellow {
    background: url("../../../assets/mallIndex/rectangle2.png") no-repeat ;
    background-size: 100% 100%;
  }
  .bg-blue{
    background: url("../../../assets/mallIndex/rectangle3.png") no-repeat ;
    background-size: 100% 100%;
  }
  .bg-purple{
    background: url("../../../assets/mallIndex/rectangle4.png") no-repeat ;
    background-size: 100% 100%;
  }
  .iconView{
    display: flex;
    flex-direction: column;
    justify-content: center;
    .ViewItem{
      background:rgba(255,255,255,1);
      border-radius:5px;
      display: flex;
      flex-direction: column;
      position: relative;
      margin-bottom: 16px;
      .analyse{
        padding-left: 20px;
        padding-top:5px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color:#373737;
        position: relative;
        .trea-analyse{
          position: absolute;
          right: 10px;
          top:0;
          display: flex;
          flex-direction: row;
          .el-icon-refresh,.el-icon-setting{
            padding-top:5px;
            color: #B4BAC1;
            margin-left: 10px;
          }
        }
      }
      .chart{
        margin-top: 10px;
      }
      .amount{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background: #F5F5F5;
        height: 40px;
        border-top:1px solid #DDDDDD;
        padding: 0 12px;
        span{
          color:#373737;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          margin: 0 14px;
          font-size: 12px;
        }
      }
    }
  }
  .iconView .ViewItem .chart {
    margin-top: 0px;
  }
  .btn{
    border: 0 !important;
    margin: 0;
    padding: 0;
    background: none;
    width: 100%;
    height: 24px;
    line-height: 24px;
    width:50px;
  }
  .available {
    width: 100%;
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .available-icon {
      width: 8rem;
      height: 8rem;
    }
    span {
      font-size: 14px;
      margin-top: 10px;
      color: #CDCDCD;
    }
  }
</style>
