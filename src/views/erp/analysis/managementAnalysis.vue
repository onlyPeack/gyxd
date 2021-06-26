<template>
  <div style="height: auto;padding: 40px" class="box">
    <div class="line-box">
      <div class="mini-card">
        <div class="title">全站总销售额</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
<!--          <span id="all-sales"></span>-->
          <span>{{toThousands(allData.sales)}}</span>
          <span class="unit">元</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站单数</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
          <span id="all-orders"></span>
          <span class="unit">单</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站佣金</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
<!--          <span id="all-commission"></span>-->
          <span>{{toThousands(allData.commission)}}</span>
          <span class="unit">元</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站调拨利润</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
<!--          <span id="all-transferProfit"></span>-->
          <span>{{toThousands(allData.transferProfit)}}</span>
          <span class="unit">元</span>
        </div>
      </div>
    </div>
    <div class="line-box">
      <div class="mini-card">
        <div class="title">全站有效销售额</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
<!--          <span id="all-effectiveSales"></span>-->
          <span>{{toThousands(allData.effectiveSales)}}</span>
          <span class="unit">元</span>
        </div>
        <div class="compare">环比
          <el-tooltip class="item" effect="dark" :content="`对比上月增长${allData.chainSale}`" placement="top-start" v-if="allData.effectiveSales>=allData.beforeEffectiveSales">
            <span class="chain-up"><i class="iconfont icon-sanjiaoxing"></i>{{allData.chainSale}}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="`对比上月下降${allData.chainSale}`" placement="top-start" v-else>
            <span class="chain-down"><i class="iconfont icon-sanjiaoxingxia-copy"></i>{{allData.chainSale}}</span>
          </el-tooltip>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站有效单数</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
          <span id="all-effectiveOrderCount"></span>
          <span class="unit">单</span>
        </div>
        <div class="compare">环比
          <el-tooltip class="item" effect="dark" :content="`对比上月增长${allData.chainOrder}`" placement="top-start" v-if="allData.effectiveOrderCount>=allData.beforeEffectiveOrderCount">
            <span class="chain-up"><i class="iconfont icon-sanjiaoxing"></i>{{allData.chainOrder}}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="`对比上月下降${allData.chainOrder}`" placement="top-start" v-else>
            <span class="chain-down"><i class="iconfont icon-sanjiaoxingxia-copy"></i>{{allData.chainOrder}}</span>
          </el-tooltip>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站有效佣金</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
<!--          <span id="all-effectiveCommission"></span>-->
          <span>{{toThousands(allData.effectiveCommission)}}</span>
          <span class="unit">元</span>
        </div>
        <div class="compare">环比
          <el-tooltip class="item" effect="dark" :content="`对比上月增长${allData.chainCommission}`" placement="top-start" v-if="allData.effectiveCommission>=allData.beforeEffectiveCommission">
            <span class="chain-up"><i class="iconfont icon-sanjiaoxing"></i>{{allData.chainCommission}}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="`对比上月下降${allData.chainCommission}`" placement="top-start" v-else>
            <span class="chain-down"><i class="iconfont icon-sanjiaoxingxia-copy"></i>{{allData.chainCommission}}</span>
          </el-tooltip>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站有效调拨利润</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
<!--          <span id="all-effectiveTransferProfit"></span>-->
          <span>{{toThousands(allData.effectiveTransferProfit)}}</span>
          <span class="unit">元</span>
        </div>
        <div class="compare">环比
          <el-tooltip class="item" effect="dark" :content="`对比上月增长${allData.chainTransferProfit}`" placement="top-start" v-if="allData.effectiveTransferProfit>=allData.beforeEffectiveTransferProfit">
            <span class="chain-up"><i class="iconfont icon-sanjiaoxing"></i>{{allData.chainTransferProfit}}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="`对比上月下降${allData.chainTransferProfit}`" placement="top-start" v-else>
            <span class="chain-down"><i class="iconfont icon-sanjiaoxingxia-copy"></i>{{allData.chainTransferProfit}}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="line-box">
      <div class="mini-card">
        <div class="title">全站收支</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
<!--          <span id="all-platformAccounting"></span>-->
          <span>{{toThousands(allData.platformAccounting)}}</span>
          <span class="unit">元</span>
        </div>
      </div>
      <div class="mini-card special">
        <div class="title">全站会员</div>
        <div class="number">
          <span id="all-memberCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card special">
        <div class="title">全站店主</div>
        <div class="number">
          <span id="all-shopkeeperCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card special">
        <div class="title">全站商品</div>
        <div class="number">
          <span id="all-onShelvesCount"></span>
          <span class="unit">个</span>
        </div>
      </div>
<!--      <div class="mini-card hold-space"></div>-->
    </div>
    <div class="line-box">
      <div class="mini-card">
        <div class="title">全站有效收支</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
<!--          <span id="all-effectivePlatformAccounting"></span>-->
          <span>{{toThousands(allData.effectivePlatformAccounting)}}</span>
          <span class="unit">元</span>
        </div>
        <div class="compare">环比
          <el-tooltip class="item" effect="dark" :content="`对比上月增长${allData.chainPlatformAccounting}`" placement="top-start" v-if="allData.effectivePlatformAccounting>=allData.beforeEffectivePlatformAccounting">
            <span class="chain-up"><i class="iconfont icon-sanjiaoxing"></i>{{allData.chainPlatformAccounting}}</span>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" :content="`对比上月下降${allData.chainPlatformAccounting}`" placement="top-start" v-else>
            <span class="chain-down"><i class="iconfont icon-sanjiaoxingxia-copy"></i>{{allData.chainPlatformAccounting}}</span>
          </el-tooltip>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">全站新增会员</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
          <span id="all-addMemberCount"></span>
          <span class="unit">人</span>
        </div>
        <div class="quarter">昨日新增{{allData.yesterdayAddMemberCount}}人</div>
      </div>
      <div class="mini-card">
        <div class="title">全站新增店主</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
          <span id="all-addShopkeeperCount"></span>
          <span class="unit">人</span>
        </div>
        <div class="quarter">昨日新增{{allData.yesterdayAddShopkeeperCount}}人</div>
      </div>
      <div class="mini-card">
        <div class="title">全站上架商品</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number" >
          <span id="all-periodOnShelvesCount"></span>
          <span class="unit">个</span>
        </div>
        <div class="quarter">昨日新增{{allData.yesterdayOnShelvesCount}}个</div>
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="divider-block">
      全站活跃
    </div>
    <div class="line-box">
      <div class="mini-card">
        <div class="title">本月店主活跃数量</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
          <span id="all-periodShopkeeperActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">本周店主活跃数量</div>
        <div class="time">{{this.weekAfter}}~{{this.weekBefore}} | 本周</div>
        <div class="quarter">当前一周</div>
        <div class="number">
          <span id="all-weekShopkeeperActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">本日店主活跃数量</div>
        <div class="time">{{this.today}}~{{this.today}} | 本日</div>
        <div class="quarter">今天</div>
        <div class="number">
          <span id="all-todayShopkeeperActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card hold-space"></div>
    </div>
    <div class="line-box">
      <div class="mini-card">
        <div class="title">本月会员活跃数量</div>
        <div class="time">{{this.startQuarter}}~{{this.endQuarter}} | 本月</div>
        <div class="quarter">第{{quarter}}月</div>
        <div class="number">
          <span id="all-periodMemberrActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">本周会员活跃数量</div>
        <div class="time">{{this.weekAfter}}~{{this.weekBefore}} | 本周</div>
        <div class="quarter">当前一周</div>
        <div class="number">
          <span id="all-weekMemberActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card">
        <div class="title">本日会员活跃数量</div>
        <div class="time">{{this.today}}~{{this.today}} | 本日</div>
        <div class="quarter">今天</div>
        <div class="number">
          <span id="all-todayMemberActiveCount"></span>
          <span class="unit">人</span>
        </div>
      </div>
      <div class="mini-card hold-space"></div>
    </div>
    <div style="height: 50px"></div>
    <div class="main" style="background-color: #fff;">
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">销量前十品牌</h2>
        <el-table align="center" stripe style="margin: 0 auto" :data="brandItemList">
          <el-table-column label="排名" type="index"></el-table-column>
          <el-table-column label="品牌" prop="productBrand"></el-table-column>
          <el-table-column label="销量" prop="productQuantity"></el-table-column>
          <!--          <el-table-column label="销量统计%" v-slot="{row}">-->
          <!--            <el-progress :text-inside="true" :stroke-width="20" :percentage="Math.round((Number(row.amount)/goodsAmount)*100)"></el-progress>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">销量前十类别</h2>
        <el-table align="center" stripe style="margin: 0 auto" :data="categoryItemList">
          <el-table-column label="排名" type="index"></el-table-column>
          <el-table-column label="品牌" prop="productBrand"></el-table-column>
          <el-table-column label="销量" prop="productQuantity"></el-table-column>
          <!--          <el-table-column label="销量统计%" v-slot="{row}">-->
          <!--            <el-progress :text-inside="true" :stroke-width="20" :percentage="Math.round((Number(row.amount)/goodsAmount)*100)"></el-progress>-->
          <!--          </el-table-column>-->
        </el-table>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">店铺排名</h2>
        <shop-rank></shop-rank>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">会员排名</h2>
        <member-rank/>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">上架商品次数排名</h2>
        <on-sale-shop-time/>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">搜索次数排名</h2>
        <search-time/>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">产品销量订单量排名</h2>
        <order-sale-rank/>
      </div>
      <div style="vertical-align: bottom" class="picture-card">
        <!--                <span class="card-title">近7天销售额</span>-->
        <h2 style="font-size: 22px">产品分享次数排名</h2>
        <goods-share-rank/>
      </div>
      <div>
        <h2 style="font-size: 22px">订单转化率</h2>
        <order-conversion/>
      </div>



      <div>
      </div>
      <div style="height: 200px"></div>
    </div>
  </div>
</template>

<script>
  import { selectPage, selectBasicRank, selectShopRank } from '@/api/erp/analysis/managementAnalysis'
  import {CountUp} from 'countup.js'
  import shopRank from './components/shopRank'
  import memberRank from './components/memberRank'
  import onSaleShopTime from './components/onSaleShopTime'
  import searchTime from './components/searchTime'
  import orderSaleRank from './components/orderSaleRank'
  import goodsShareRank from './components/goodsShareRank'
  import orderConversion from './components/orderConversion'
  export default {
    name: 'managementAnalysis',
    data() {
      return {
        listQuery: {},
        allData: {},
        xUser: [],
        userPV: [],
        userUV: [],
        brandItemList: [],//销量前十品牌
        categoryItemList: [],//销量前十类别
        startQuarter:'',  //月开始时间
        endQuarter:'',  //月结束时间
        weekAfter:'',
        weekBefore:'',
        today:'',
        quarter:0,  //当前月
      }
    },
    components: {shopRank,memberRank,onSaleShopTime,searchTime,orderSaleRank,goodsShareRank,orderConversion},
    created() {
      this.today=this.getNowFormatDate()
      this.weekAfter=this.getNowWeek().after
      this.weekBefore=this.getNowWeek().before
      this.listQuery.startTime = this.oneWeek().after
      this.listQuery.endTime = this.oneWeek().before

      this.startQuarter=new Date().getFullYear()+'-'
      this.endQuarter=new Date().getFullYear()+'-'
      this.quarter=new Date().getMonth()+1
      if(new Date().getDate()>21){
        this.startQuarter+=(new Date().getMonth()+1)+'-21'
        this.endQuarter+=(new Date().getMonth()+2>12?1:new Date().getMonth()+2)+'-21'
      }else{
        this.startQuarter+=(new Date().getMonth()<1?1:new Date().getMonth())+'-21'
        this.endQuarter+=(new Date().getMonth()+1)+'-21'
      }

      // let quarter=(new Date().getMonth()+1)/3
      //
      // if(quarter<=1){
      //   this.startQuarter+='01-01'
      //   this.endQuarter+='03-31'
      //   this.quarter=1
      // }else if(quarter<=2){
      //   this.startQuarter+='04-01'
      //   this.endQuarter+='06-30'
      //   this.quarter=2
      // }else if(quarter<=3){
      //   this.startQuarter+='07-01'
      //   this.endQuarter+='09-30'
      //   this.quarter=3
      // }else{
      //   this.startQuarter+='10-01'
      //   this.endQuarter+='12-31'
      //   this.quarter=4
      // }


      // this.billDate=this.oneWeek().arr
      selectPage(this.listQuery).then(res => {
        this.allData = res.data

        //销售量环比
        if(this.allData.effectiveSales>=this.allData.beforeEffectiveSales){
          this.allData.chainSale=this.toPercent(this.division(this.allData.effectiveSales,this.allData.beforeEffectiveSales||1).toFixed(4))
        }else{
          this.allData.chainSale=this.toPercent(this.division(this.allData.beforeEffectiveSales,this.allData.effectiveSales||1).toFixed(4))
        }

        //单数环比
        if(this.allData.effectiveOrderCount>=this.allData.beforeEffectiveOrderCount){
          this.allData.chainOrder=this.toPercent(this.division(this.allData.effectiveOrderCount,this.allData.beforeEffectiveOrderCount||1).toFixed(4))
        }else{
          this.allData.chainOrder=this.toPercent(this.division(this.allData.beforeEffectiveOrderCount,this.allData.effectiveOrderCount||1).toFixed(4))
        }

        //佣金环比
        if(this.allData.effectiveCommission>=this.allData.beforeEffectiveCommission){
          this.allData.chainCommission=this.toPercent(this.division(this.allData.effectiveCommission,this.allData.beforeEffectiveCommission||1).toFixed(4))
        }else{
          this.allData.chainCommission=this.toPercent(this.division(this.allData.beforeEffectiveCommission,this.allData.effectiveCommission||1).toFixed(4))
        }

        //调拨利润环比
        if(this.allData.effectiveTransferProfit>=this.allData.beforeEffectiveTransferProfit){
          this.allData.chainTransferProfit=this.toPercent(this.division(this.allData.effectiveTransferProfit,this.allData.beforeEffectiveTransferProfit||1).toFixed(4))
        }else{
          this.allData.chainTransferProfit=this.toPercent(this.division(this.allData.beforeEffectiveTransferProfit,this.allData.effectiveTransferProfit||1).toFixed(4))
        }

        //收支环比
        if(this.allData.effectivePlatformAccounting>=this.allData.beforeEffectivePlatformAccounting){
          this.allData.chainPlatformAccounting=this.toPercent(this.division(this.allData.effectivePlatformAccounting,this.allData.beforeEffectivePlatformAccounting||1).toFixed(4))
        }else{
          this.allData.chainPlatformAccounting=this.toPercent(this.division(this.allData.beforeEffectivePlatformAccounting,this.allData.effectivePlatformAccounting||1).toFixed(4))
        }

        new CountUp('all-sales', this.allData.sales).start()
        new CountUp('all-effectiveSales', this.allData.effectiveSales).start()
        new CountUp('all-orders', this.allData.orderCount).start()
        new CountUp('all-effectiveOrderCount', this.allData.effectiveOrderCount).start()
        new CountUp('all-commission', this.allData.commission).start()
        new CountUp('all-effectiveCommission', this.allData.effectiveCommission).start()
        new CountUp('all-transferProfit', this.allData.transferProfit).start()
        new CountUp('all-effectiveTransferProfit', this.allData.effectiveTransferProfit).start()
        new CountUp('all-platformAccounting', this.allData.platformAccounting).start()
        new CountUp('all-effectivePlatformAccounting', this.allData.effectivePlatformAccounting).start()
        new CountUp('all-memberCount', this.allData.memberCount).start()
        new CountUp('all-addMemberCount', this.allData.addMemberCount).start()
        new CountUp('all-shopkeeperCount', this.allData.shopkeeperCount).start()
        new CountUp('all-addShopkeeperCount', this.allData.addShopkeeperCount).start()
        new CountUp('all-onShelvesCount', this.allData.onShelvesCount).start()
        new CountUp('all-periodOnShelvesCount', this.allData.periodOnShelvesCount).start()
        new CountUp('all-periodShopkeeperActiveCount', this.allData.periodShopkeeperActiveCount).start()
        new CountUp('all-weekShopkeeperActiveCount', this.allData.weekShopkeeperActiveCount).start()
        new CountUp('all-todayShopkeeperActiveCount', this.allData.todayShopkeeperActiveCount).start()
        new CountUp('all-periodMemberrActiveCount', this.allData.periodMemberrActiveCount).start()
        new CountUp('all-weekMemberActiveCount', this.allData.weekMemberActiveCount).start()
        new CountUp('all-todayMemberActiveCount', this.allData.todayMemberActiveCount).start()
        // new CountUp('sales-chain', 5234).start()
        // console.log(Object.keys(this.allData.pvVisitorVolumeByDate))
        // for (let i = 0; i <this.allData.pvVisitorVolumeByDate.length ; i++) {
        //   this.xUser.push(this.allData.pvVisitorVolumeByDate[i].dateTime)
        //   this.userPV.push(this.allData.pvVisitorVolumeByDate[i].count)
        //   this.userUV.push(this.allData.uvVisitorVolumeByDate[i].count)
        // }
        // this.drawLine()

      })
      selectBasicRank().then(res => {
        if (Number(res.code) === 2000 || Number(res.code) === 200) {
          this.brandItemList = res.data.brandItemList
          this.categoryItemList = res.data.categoryItemList
        } else {
          this.$message.error('查询排名失败!')
          console.log(res, 'error')
        }
      })
    },
    methods: {
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
    /*height: 150px;*/
    width: 300px;
    background-color: #fff;
    border-radius: 10px;
    text-align: left;
    color: white;
    padding: 10px 20px;
    transition: 1s;
  }

  .top div:hover {
    background-color: rgb(59, 118, 239) !important;
  }

  .top div h2 {
    font-size: 14px;
    font-weight: normal;
    margin-bottom: 0;
  }

  .top div h4 {
    font-size: 24px;
    margin-top: 10px;
    margin-bottom: 0;
  }

  .line {
    height: 1px;
    background-color: #999;
    margin-top: 50px;
  }

  .picture-card {
    width: 47.6%;
    display: inline-block;
    height: 540px;
    text-align: center;
    background-color: #fff;
    margin-left: 1.7%;
    margin-top: 15px;
    border-radius: 5px
  }
  .box{
    background-color: rgb(247,249,250);
  }
  .line-box{
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
  }
  .mini-card{
    width: 22%;
    background-color: #fff;
    /*height: 100px;*/
    border-radius: 3px;
    box-shadow: 0 2px 11px 0 rgb(190 202 218 / 17%);
    padding: 14px 20px;
    min-height: 149px;
  }
  .mini-card:hover{
    border: 2px solid rgb(24,138,226);
    padding: 12px 18px;
  }
  .mini-card .title{
    font-size: 14px;
    color: #5f6e82;
  }
  .mini-card .time,.mini-card .quarter,.mini-card .unit,.mini-card .compare{
    color: #8492a6;
    font-size: 12px;
    margin-top: 10px;
  }
  .mini-card .quarter{
    margin-top: 20px;
  }
  .mini-card .number{
    font-size: 40px;
    color: #475669;
    margin-top: 5px;
  }
  .compare i{
    font-size: 12px;
  }
  .chain-down{
    color: #FC6772;
  }
  .chain-up{
    color: #2DCA93;
  }
  .special{
    display: table;
  }
  .special{
    position: relative;
  }
  .special .title{
    position: absolute;
    top:14px;
    left: 20px;
  }
  .special:hover .title{
    top: 12px;
    left: 18px;
  }
  .special .number{
    text-align: center;
    display: table-cell;
    vertical-align: middle;

  }
  .hold-space{
    background-color: transparent!important;
    box-shadow: none;
  }
  .hold-space:hover{
    border-color: transparent;
  }
  .divider-block{
    width: 97%;
    margin: 0 auto;
    background-color: #fff;
    padding: 0 20px;
    border-radius: 3px;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    color: #5e6d82;
  }
</style>
