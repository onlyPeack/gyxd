<template>
  <div style="height: auto;padding: 40px">
    <div class="top">
      <div style="background-color: rgb(59,118,239);">
        <h2>本期销售额</h2>
        <h4>¥&nbsp;{{allData.sales}}</h4>
        <h2>有效销售额</h2>
        <h4>¥&nbsp;{{allData.effectiveSales}}</h4>
        <h2>上期有效销售额</h2>
        <h4>¥&nbsp;{{allData.beforeEffectiveSales}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(99,199,255);">
        <h2>全部单数</h2>
        <h4>¥&nbsp;{{allData.orderCount}}</h4>
        <h2>有效单数</h2>
        <h4>¥&nbsp;{{allData.effectiveOrderCount}}</h4>
        <h2>上期有效单数</h2>
        <h4>¥&nbsp;{{allData.beforeEffectiveOrderCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(166,109,212);">
        <h2>全部佣金</h2>
        <h4>¥&nbsp;{{allData.commission}}</h4>
        <h2>有效佣金</h2>
        <h4>¥&nbsp;{{allData.effectiveCommission}}</h4>
        <h2>上期有效佣金</h2>
        <h4>¥&nbsp;{{allData.beforeEffectiveCommission}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(166,109,212);">
        <h2>调拨利润</h2>
        <h4>¥&nbsp;{{allData.transferProfit}}</h4>
        <h2>有效调拨利润</h2>
        <h4>¥&nbsp;{{allData.effectiveTransferProfit}}</h4>
        <h2>上期有效调拨利润</h2>
        <h4>¥&nbsp;{{allData.effectiveTransferProfit}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(109,212,177);">
        <h2>平台收支</h2>
        <h4>¥&nbsp;{{allData.platformAccounting}}</h4>
        <h2>有效收支</h2>
        <h4>¥&nbsp;{{allData.effectivePlatformAccounting}}</h4>
        <h2>上期有效收支</h2>
        <h4>¥&nbsp;{{allData.beforeEffectivePlatformAccounting}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
    </div>
    <div style="height: 20px"></div>
    <div class="top">
      <div style="background-color: rgb(59,118,239);">
        <h2>会员数量</h2>
        <h4>{{allData.memberCount}}</h4>
        <h2>本期增加会员数量</h2>
        <h4>{{allData.addMemberCount}}</h4>
        <h2>昨日增加会员数量</h2>
        <h4>{{allData.yesterdayAddMemberCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(99,199,255);">
        <h2>店主数量</h2>
        <h4>{{allData.shopkeeperCount}}</h4>
        <h2>本期店主数量</h2>
        <h4>{{allData.addShopkeeperCount}}</h4>
        <h2>昨日增加店主数量</h2>
        <h4>{{allData.yesterdayAddShopkeeperCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color:rgb(166,109,212);">
        <h2>今日店主活跃数量</h2>
        <h4>{{allData.todayShopkeeperActiveCount}}</h4>
        <h2>本周店主活跃数量</h2>
        <h4>{{allData.weekShopkeeperActiveCount}}</h4>
        <h2>本期店主活跃数量</h2>
        <h4>{{allData.periodShopkeeperActiveCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(166,109,212);">
        <h2>今日会员活跃数量</h2>
        <h4>{{allData.todayMemberActiveCount}}</h4>
        <h2>本周会员活跃数量</h2>
        <h4>{{allData.weekMemberActiveCount}}</h4>
        <h2>本期会员活跃数量</h2>
        <h4>{{allData.periodMemberrActiveCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
      <div style="background-color: rgb(109,212,177);">
        <h2>上架产品数</h2>
        <h4>{{allData.onShelvesCount}}</h4>
        <h2>本周上架产品数</h2>
        <h4>{{allData.periodOnShelvesCount}}</h4>
        <h2>本期上架产品数</h2>
        <h4>{{allData.yesterdayOnShelvesCount}}</h4>
        <!--        <h2>同比增长</h2>-->
        <!--        <h4>20%</h4>-->
      </div>
    </div>
    <!--    <div class="line"></div>-->
    <div class="main">
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
      <div style="height: 500px"></div>
    </div>
  </div>
</template>

<script>
  import { selectPage, selectBasicRank, selectShopRank } from '@/api/erp/analysis/managementAnalysis'
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
        categoryItemList: []//销量前十类别
      }
    },
    components: {shopRank,memberRank,onSaleShopTime,searchTime,orderSaleRank,goodsShareRank,orderConversion},
    created() {
      this.listQuery.startTime = this.oneWeek().after
      this.listQuery.endTime = this.oneWeek().before
      // this.billDate=this.oneWeek().arr
      selectPage(this.listQuery).then(res => {
        this.allData = res.data
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
    height: 500px;
    text-align: center;
    background-color: #fff;
    margin-left: 1.7%;
    margin-top: 15px;
    border-radius: 5px
  }
</style>
