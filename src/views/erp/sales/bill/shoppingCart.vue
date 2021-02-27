<template>
  <div class="shopping-cart-container">
    <table class="goods-table-box" cellspacing="0" cellpadding="0">
      <tr>
        <td width="5%">
          <el-checkbox></el-checkbox>
        </td>
        <td width="30%">商品信息</td>
        <td width="10%">市场价</td>
        <td width="10%">单价</td>
        <td width="12%">渠道</td>
        <td width="12%">购买数量</td>
        <td width="6%">买立减</td>
        <td width="10%">支付金额</td>
        <td width="5%">操作</td>
      </tr>
      <tr v-for="o in 5" :key="o">
        <td align="center">
          <el-checkbox></el-checkbox>
        </td>
        <td>
          <div class="goods-main-info">
            <div>
              <a href="#">
                <img
                  src="http://img.gongkongmall.com/upload/product/image/9/2018/07/24/3961075da22843eebe1cf9ca87bd1771.jpg"
                  alt="">
              </a>
            </div>
            <div>
              <p>
                <a class="goods-type goods-red" href="#">德力西电气</a>
                <a href="#">HDBE-63 小型断路器</a>
              </p>
              <p class="c999"><span class="c666">参数: </span>1P | 32A | C | 6KA</p>
              <p class="c999"><span class="c666">订货号: </span>HDBE631C32</p>
              <p class="c999"><span class="c666">型号: </span>HDBE-63 C型 1P 32A</p>
            </div>
          </div>
        </td>
        <td align="right">
          <p><span class="line-through c999">￥17.47</span></p>
        </td>
        <td align="right">
          <p><span class="goods-price" style="font-size: 12px;">￥9.61</span></p>
        </td>
        <td>
          <p class="c999">
            <span class="goods-type goods-blue">现货</span>
            <span>18675</span>
          </p>
        </td>
        <td align="right">
          <el-input-number controls-position="right" :min="1"></el-input-number>
          <span class="c666">个</span>
        </td>
        <td align="right">
          <span class="c666">-0.00</span>
        </td>
        <td align="right">
          <span class="c333">0.00</span>
        </td>
        <td class="goods-operation" align="center">
          <div>
            <a href="#">删除</a>
          </div>
        </td>
      </tr>
    </table>

    <div class="cart-footer">
      <div style="float: left">
        <el-checkbox>全选</el-checkbox>
      </div>
      <div style="float: right">
            <span style="margin-right: 15px;">
              已选择
              <span class="ce4393c size">0</span>
              种商品，共
              <b class="ce4393c size">0</b>
              件
            </span>
        <span style="margin-right: 15px;">总价 <b class="ce4393c">￥0.00</b> </span>
        <a href="#" class="settlement">去结算</a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shoppingCart"
  }
</script>

<style lang="scss" scoped>
  .shopping-cart-container {
    width: 80%;
    margin: 10px auto;
    font-size: 12px;
    color: #333;
    p {
      height: 24px;
      line-height: 24px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0px;
      padding: 0px;
      font-size: 12px;
    }
    a {
      color: #666;
      text-decoration: none;
      outline: none;
    }
    .c999 {
      color: #999 !important;
    }
    .c666 {
      color: #666 !important;
    }
    .c333 {
      color: #333 !important;
    }
    .goods-price {
      color: #e45050;
      font-size: 18px;
      display: inline-block;
    }
    .line-through {
      font-size: 12px;
      text-decoration: line-through;
    }
    .goods-type {
      padding: 0 2px;
      display: inline-block;
      margin-right: 2px;
      font-size: 12px;
      line-height: 16px;
      border-radius: 2px;
    }
    .goods-red {
      border: 1px #e4393c solid;
      color: #e4393c;
    }
    .goods-blue {
      border: 1px #188AE2 solid;
      color: #188AE2;
    }
    .goods-table-box {
      width: 100%;
      margin-top: 15px;
      font-size: 12px;
      color: #333;
      border-collapse: collapse;
      border-spacing: 0;
      empty-cells: show;
      td {
        padding: 5px;
        border: 1px solid #e5e5e5;
      }
      tr:first-child td {
        line-height: 28px;
        text-align: center;
      }
      .goods-main-info {
        display: flex;
        img {
          width: 80px;
          height: 80px;
        }
      }
      .goods-operation {
        a {
          display: inline-block;
          padding: 0px 5px;
          line-height: 22px;
          font-size: 12px;
          text-align: center;
        }
      }
    }
    .cart-footer {
      width: 100%;
      height: 42px;
      border: 1px solid #e5e5e5;
      line-height: 42px;
      margin: 20px 0px;
      padding-left: 10px;
      font-size: 12px;
      color: #333;
      .ce4393c {
        color: #e4393c;
      }
      .size {
        font-size: 16px;
      }
      a {
        display: inline-block;
        height: 100%;
        padding: 0 10px;
        border: none;
        position: relative;
        top: -2px;
      }
      .settlement {
        color: white;
        background-color: #e4393c;
      }
      .join-goods-shelves {

      }
    }
  }
</style>
