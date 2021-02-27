<template>
  <div class="goods-details-container">
    <el-row>
      <el-col :span="6" class="header-left">
        <div class="big-img">
          <img :src="bigImg"
               alt="">
        </div>
        <div class="small-img">
          <ul>
            <li v-for="item in imgList" :key="item" @click="handleChangeBigImg(item)">
              <img :src="item" :class="bigImg==item?'active':''" alt="">
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="18" class="header-right">
        <div class="c333 goods-name">
          德力西电气 HDBE-63 小型断路器
        </div>
        <div class="goods-info">
          <div class="goods-price">
            <span class="c999">单价:</span>
            <span class="ce45050 unit-price">￥9.61</span>
          </div>
          <div class="goods-price">
            <span class="c999">市场价:</span>
            <span class="c333 market-price">￥17.47</span>
          </div>
        </div>
        <div class="flex">
          <div class="c999">订货号:</div>
          <div class="c666">HDBE631C32</div>
        </div>
        <div class="flex">
          <div class="c999">型号:</div>
          <div class="c666">HDBE-63 C型 1P 32A</div>
        </div>
        <div class="flex">
          <div class="c999">参数:</div>
          <div class="c666">6KA | 1P | 32A | 230/400VAC</div>
        </div>
        <div class="flex">
          <div class="c999">品牌:</div>
          <div class="c666 goods-brand">
            <span>德力西电气</span>
            <span class="c999">系列:</span>HDBE(电商专供)
            <span class="c999">品类:</span>微型断路器
            <span class="c999">单位:</span>个
          </div>
        </div>
        <div class="flex">
          <div class="c999">商家服务:</div>
          <div class="c666">
            由 <span class="ce45050">和稷工业</span> 提供售后服务
          </div>
        </div>

        <div class="goods-count c666">
          <span class="goods-type goods-blue">现货</span>
          <span>9.61元</span>
          <span>库存: 1864</span>
          <span>
            <el-input-number controls-position="right" :min="1"></el-input-number>
            <span class="ce45050">(最小包装量:1 最小起订量:1)</span>
          </span>
          <span>买立减: -0.00</span>
        </div>
        <div class="goods-count c666">
          <span class="goods-type goods-red">期货</span>
          <span>9.61元</span>
          <span>库存: 1864</span>
          <span>
            <el-input-number controls-position="right" :min="1" :max="10000"></el-input-number>
            <span class="ce45050">(最小包装量:1 最小起订量:1)</span>
          </span>
          <span>买立减: -0.00</span>
        </div>
        <div class="join-shopcart">
          <a>加入购物车</a>
        </div>
      </el-col>
    </el-row>
    <el-row style="padding-top: 15px;">
      <el-col :span="4" class="content-left">
        <div class="left-header">
          相关推荐
        </div>
        <div class="goods-item" v-for="o in 4" :key="o">
          <div style="text-align: center;">
            <a>
              <img
                src="http://img.gongkongmall.com/upload/product/image/9/2018/07/24/7041cefbfa2740ac89b9a08d9ce7dfe8.jpg"
                alt="">
            </a>
          </div>
          <div class="c999">
            <span class="goods-type goods-red">德力西电气</span>
            <span class="c333">HDBE-63 小型断路器</span>
          </div>
          <div class="c999">参数: 6KA|1P|32A|230/400VAC</div>
          <div class="c999">订货号: HDBE631C32</div>
          <div class="c999">型号: HDBE-63 C型 1P 32A</div>
          <div class="price-div">
            <span class="ce45050">￥9.61</span>
            <span class="c999">￥17.47</span>
          </div>
        </div>
      </el-col>
      <el-col :span="20" class="content-right">
        <el-tabs type="border-card">
          <el-tab-pane label="产品详情">
            <img class="detail-img"
                 src="http://img.gongkongmall.com/upload/product/image/9/2018/07/24/8082ea7171e1468e92d2f6f12a13c094.jpg"
                 alt="">
          </el-tab-pane>
          <el-tab-pane label="规格参数">
            <table class="specification-table" cellspacing="0" cellpadding="0">
              <tr>
                <td>分析能力</td>
                <td>6KA</td>
              </tr>
              <tr>
                <td>级数</td>
                <td>1P</td>
              </tr>
              <tr>
                <td>额定电流</td>
                <td>32A</td>
              </tr>
              <tr>
                <td>额定电压</td>
                <td>230/400VAC</td>
              </tr>
              <tr>
                <td>脱扣特性</td>
                <td>C</td>
              </tr>
            </table>
          </el-tab-pane>
          <el-tab-pane label="资料下载">
            <span class="c999">暂无资料下载</span>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: "goodsDetail",
    data() {
      return {
        bigImg: 'http://img.gongkongmall.com/upload/product/image/9/2018/07/24/3961075da22843eebe1cf9ca87bd1771.jpg',
        imgList: [
          'http://img.gongkongmall.com/upload/product/image/9/2018/07/24/3961075da22843eebe1cf9ca87bd1771.jpg',
          'http://img.gongkongmall.com/upload/product/image/9/2018/07/24/9a8b60988c7a4f0d9eb4fb07e8dc8cfb.jpg',
          'http://img.gongkongmall.com/upload/product/image/9/2018/07/24/a5691a12018b4ab699f937e204311753.jpg',
          'http://img.gongkongmall.com/upload/product/image/9/2018/07/24/d30384a3281e4500a85768969088ff49.jpg'
        ],
      }
    },
    methods: {
      handleChangeBigImg(url) {
        this.bigImg = url;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-details-container {
    width: 80%;
    margin: 10px auto;
    font-size: 12px;
    color: #333;
    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .c333 {
      color: #333;
    }
    .c666 {
      color: #666;
    }
    .c999 {
      color: #999;
    }
    .ce45050 {
      color: #e45050;
    }
    .flex {
      display: flex;
    }
    .goods-type {
      padding: 0 2px;
      display: inline-block;
      margin-right: 2px;
      font-size: 12px;
      line-height: 16px;
      border-radius: 2px;
    }
    .goods-blue {
      border: 1px #188AE2 solid;
      color: #188AE2;
    }
    .goods-red {
      border: 1px #e45050 solid;
      color: #e45050;
    }

    .header-left {
      .big-img {
        width: 100%;
        height: 420px;
        border: 1px solid #e5e5e5;
        margin-bottom: 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .small-img {
        width: 100%;
        height: 70px;
        overflow: hidden;
        display: flex;
        ul {
          overflow: auto;
          li {
            float: left;
            width: 60px;
            height: 60px;
            border: 1px solid #e5e5e5;
            margin-bottom: 10px;
            margin-right: 10px;
            cursor: pointer;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .active {
            border: 1px solid #e45050;
          }
        }
      }
    }
    .header-right {
      padding-left: 20px;
      font-size: 12px;
      .c999 {
        letter-spacing: 6px;
      }
      .goods-name {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
        margin-bottom: 5px;
      }
      .goods-info {
        background-color: #f2f2f2;
        padding: 10px;
        line-height: 24px;
        font-size: 12px;
        margin: 10px 0;
        .goods-price {
          .unit-price {
            font-size: 26px;
            font-weight: bold;
          }
          .market-price {
            text-decoration: line-through;
          }
        }
      }
      .flex {
        line-height: 24px;
        padding: 0 10px;
        .c999 {
          white-space: nowrap;
        }
        .goods-brand {
          .c999 {
            margin-left: 20px;
          }
        }
      }

      .el-cascader {
        width: 240px;
      }
      .goods-count {
        margin: 10px;
      }
      .goods-count > span {
        margin-right: 20px;
      }
      .join-shopcart {
        padding: 25px 10px 0px 10px;
        a {
          background-color: #e4393c;
          border-color: #e4393c;
          color: #fff;
          font-size: 16px;
          padding: 10px 15px;
        }
      }
    }

    .content-left {
      border: 1px solid #e5e5e5;
      background-color: #fff;
      .left-header {
        line-height: 40px;
        padding: 0 10px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #e5e5e5;
      }
      .goods-item {
        margin: 0 10px;
        padding: 10px 0px;
        overflow: hidden;
        border-bottom: 1px #e5e5e5 solid;
        img {
          width: 150px;
          height: 150px;
        }
        .c999 {
          line-height: 18px;
        }
        .price-div {
          line-height: 30px;
          .ce45050 {
            font-size: 16px;
          }
          .c999 {
            text-decoration: line-through;
          }
        }
      }
      .goods-item:last-child {
        border-bottom: 0;
      }
    }
    .content-right {
      padding-left: 10px;
      .detail-img {
        width: 100%;
      }
      .specification-table {
        width: 100%;
        margin-top: 20px;
        color: #666;
        border-collapse: collapse;
        border-spacing: 0;
        empty-cells: show;
        td {
          line-height: 40px;
          padding: 0px 15px;
          border: 1px solid #e5e5e5;
        }
      }
    }
  }
</style>
