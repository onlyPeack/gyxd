<template>
  <div class="goods-list-container">
    <div class="filter-container">
      <el-cascader expand-trigger="hover" :options="categoryList" v-model="listQuery.categoryIds"
                   @change="handleCategoryChange" :change-on-select="true" style="width: 400px;"
                   class="filter-item" popper-class="my-el-cascader" filterable clearable placeholder="请选择分类"
                   size="small"></el-cascader>

      <el-input clearable class="filter-item" style="width: 400px;display: inline-table;"
                placeholder="请输入订货号、型号、商品名称等关键字"
                v-model="listQuery.goodsName"
                @keyup.enter.native="handleFilter" size="small">
        <el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
      </el-input>

      <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
      </el-button>
      <div class="my-shop-cart">
        <el-badge :value="999">
          <el-button type="text">
            <svg-icon icon-class="shoppingCard"></svg-icon>
            我的购物车
          </el-button>
        </el-badge>
      </div>

      <div class="screen-box">
        <div class="screen-conditions" :class="brandVisible?'show-more':''">
          <div class="conditions-name">品牌</div>
          <div class="conditions-cont">
            <el-tag v-for="(item,index) in brandList" :key="item.value" :type="item.choose?'danger':'info'"
                    @click="handleTagClick(index)">{{item.label}}
            </el-tag>
            <div class="conditions-button">
              <a class="define">确定</a>
              <a class="cancel">取消</a>
            </div>
          </div>
          <div class="conditions-more">
            <span @click="visibleChange('brandVisible')" class="query-visible">
              <span v-show="!brandVisible">展开</span>
              <span v-show="brandVisible">收起</span>
              <i class="el-icon-arrow-down" v-show="!brandVisible"></i>
              <i class="el-icon-arrow-up" v-show="brandVisible"></i>
            </span>
          </div>
        </div>
        <div class="screen-conditions" :class="seriesVisible?'show-more':''">
          <div class="conditions-name">系列</div>
          <div class="conditions-cont">
            <el-tag v-for="o in 30" :key="o+10000" type="info">测试数据-{{o}}</el-tag>
            <div class="conditions-button">
              <a class="define">确定</a>
              <a class="cancel">取消</a>
            </div>
          </div>
          <div class="conditions-more">
            <span @click="visibleChange('seriesVisible')" class="query-visible">
              <span v-show="!seriesVisible">展开</span>
              <span v-show="seriesVisible">收起</span>
              <i class="el-icon-arrow-down" v-show="!seriesVisible"></i>
              <i class="el-icon-arrow-up" v-show="seriesVisible"></i>
            </span>
          </div>
        </div>
      </div>

    </div>

    <el-row>
      <el-col :span="4" class="left-container">
        <div class="left-header">
          规格参数筛选
        </div>
        <div class="left-cont">
          <el-collapse>
            <el-collapse-item title="极数">
              <el-checkbox-group v-for="o in 6" :key="o">
                <el-checkbox :label="o+'P'"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="额定电流">
              <el-checkbox-group v-for="o in 100" :key="o">
                <el-checkbox :label="o+'A'"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="脱口特性">
              <el-checkbox-group v-for="o in 10" :key="o">
                <el-checkbox :label="o+'A'"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="分断能力">
              <el-checkbox-group v-for="o in 10" :key="o">
                <el-checkbox :label="(o+4)+'KA'"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
      <el-col :span="20" class="right-container">
        <div class="right-header">
          <el-radio-group>
            <el-radio-button label="库存"></el-radio-button>
            <el-radio-button label="销量"></el-radio-button>
            <el-radio-button label="价格"></el-radio-button>
          </el-radio-group>

          <el-radio-group style="float: right" v-model="showType">
            <el-radio-button label="list">
              <svg-icon icon-class="component"></svg-icon>
            </el-radio-button>
            <el-radio-button label="table">
              <svg-icon icon-class="category"></svg-icon>
            </el-radio-button>
          </el-radio-group>
        </div>
        <!--按列表展示-->
        <div class="right-cont-list" v-show="showType=='list'">
          <ul class="right-list-box">
            <li class="right-list-item" v-for="o in 20" :key="o">
              <div class="item-box">
                <div class="item-cont" style="text-align: center;">
                  <a href="#">
                    <img
                      src="http://img.gongkongmall.com/upload/product/image/9/2018/07/24/3961075da22843eebe1cf9ca87bd1771.jpg"
                      alt="">
                  </a>
                </div>
                <div class="item-cont">
                  <p>
                    <span class="goods-price">￥9.61</span>
                    <span class="goods-price line-through c999">￥19.61</span>
                  </p>
                  <p>
                    <a class="goods-type goods-red" href="#">德力西电气</a>
                    <a href="#">HDBE-63 小型断路器</a>
                  </p>
                  <p class="c999">1P | 32A | C | 6KA</p>
                  <p class="c999"><span class="c666">订货号: </span>HDBE631C32</p>
                  <p class="c999"><span class="c666">型号: </span>HDBE-63 C型 1P 32A</p>
                  <p class="c999">
                    <span class="goods-type goods-blue">现货</span>
                    <span>1800个</span>
                  </p>
                </div>
                <div class="item-bottom">
                  <a href="#" style=" border-right: 1px solid #e5e5e5;">加入购物车</a>
                  <a href="#">加入货架</a>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!--按表格展示-->
        <div class="right-cont-table" v-show="showType=='table'">
          <table class="right-table-box" cellspacing="0" cellpadding="0">
            <tr>
              <td width="5%">
                <el-checkbox></el-checkbox>
              </td>
              <td width="35%">详情</td>
              <td width="10%">市场价</td>
              <td width="10%">单价</td>
              <td width="12%">渠道</td>
              <td width="12%">数量</td>
              <td width="6%">买立减</td>
              <td width="10%">操作</td>
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
              <td class="goods-operation" align="center">
                <div>
                  <a href="#" class="add-to-shopcart">加入购物车</a>
                </div>
                <div>
                  <a href="#">加入货架</a>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

        <div class="right-footer" v-if="showType=='table'">
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
            <a href="#" class="join-shopcart">加入购物车</a>
            <a href="#" class="join-goods-shelves">加入货架</a>
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  import {page, delObj, listCatAndBrand} from '@/api/erp/goods/goods';

  export default {
    name: "goodsList",
    data() {
      return {
        showType: 'table',
        listQuery: {
          page: 1,
          limit: 20,
          categoryId: undefined,
          categoryIds: [],
          brandId: undefined,
        },
        total: 0,
        categoryList: [],
        brandList: [],
        brandVisible: false,
        seriesVisible: false,
      }
    },
    created() {
      this.init();
    },
    methods: {
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = this.getCategoryList(response.data.categoryList);
          this.brandList = response.data.brandList;
        });
      },
      getCategoryList(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            data[i].children = undefined;
          } else {
            this.getCategoryList(data[i].children);
          }
        }
        return data;
      },
      handleFilter() {
      },
      handleCategoryChange(value) {
        this.listQuery.categoryId = value[value.length - 1]
      },
      handleTagClick(index) {
        if (this.brandList[index].choose) {
          this.vueSet(this.brandList[index], 'choose', false);
        } else {
          this.vueSet(this.brandList[index], 'choose', true);
        }
      },
      visibleChange(type) {
        if (type == 'brandVisible') {
          this.brandVisible = !this.brandVisible;
        } else if (type == 'seriesVisible') {
          this.seriesVisible = !this.seriesVisible;
        }
      },
      handleSizeChange() {
        this.listQuery.limit = val;
      },
      handleCurrentChange() {
        this.listQuery.page = val;
      }
    }
  }
</script>

<style lang="scss">
  .my-el-cascader {
    height: 260px !important;
  }

  .goods-list-container {
    margin: 10px 20px;
    .filter-container {
      .screen-box {
        border: 1px solid #e5e5e5;
      }
      .screen-conditions {
        font-size: 12px;
        color: #333;
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #e5e5e5;
        overflow: hidden;
        .conditions-name {
          padding: 0px 10px;
          width: 120px;
          border-right: 1px solid #e5e5e5;
          background-color: #f3f3f3;
        }
        .conditions-cont {
          padding: 0px 10px;
          flex: 1;
          .conditions-button {
            text-align: center;
            a {
              height: 22px;
              line-height: 22px;
              cursor: pointer;
              display: inline-block;
              text-align: center;
              margin-right: 10px;
              padding: 0px 8px;
              border: 1px solid #fff;
            }
            .define {
              background-color: #188AE2;
              border-color: #188AE2;
              color: #fff;
            }
            .cancel {
              background-color: #fff;
              border-color: #e5e5e5;
              color: #666;
            }
          }
        }
        .conditions-more {
          padding: 0 10px;
          .query-visible {
            color: #409EFF;
            margin-left: 10px;
            cursor: pointer;
            font-size: 12px;
          }
        }
      }
      .screen-conditions:last-child {
        border-bottom: none;
      }
      .show-more {
        height: auto;
      }
      .el-tag {
        margin-right: 5px;
        cursor: pointer;
      }
      .my-shop-cart {
        display: inline-block;
        float: right;
        border: 1px solid #e5e5e5;
        padding: 0 10px;
      }
    }
    .left-container {
      font-size: 14px;
      color: #333;
      border: 1px solid #e5e5e5;
      background-color: #fff;

      .left-header {
        line-height: 40px;
        padding: 0 10px;
        background-color: #f3f3f3;
      }
      .left-cont {
        height: 85vh;
        overflow: auto;
      }
      .el-collapse-item__header {
        padding-left: 10px !important;
      }
      .el-collapse-item__content {
        .el-checkbox-group {
          width: 50%;
          padding-left: 10px;
          float: left;
        }
      }
    }
    .right-container {
      padding-left: 10px;
      .right-header {
        border: 1px solid #e5e5e5;
        padding: 10px;
      }
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

      .right-list-box {
        list-style: none;
        margin: 0px;
        padding: 0px;
        .right-list-item {
          display: inline-block;
          width: 20%;
          .item-box {
            margin-right: 15px;
            margin-top: 15px;
            border: 1px solid #e7e7e7;
            .item-cont {
              padding: 10px;
            }
            img {
              height: 150px;
              width: 150px;
            }
            .item-bottom {
              height: 28px;
              border-top: 1px solid #e5e5e5;
              a {
                width: 50%;
                display: block;
                float: left;
                height: 28px;
                line-height: 28px;
                font-size: 12px;
                text-align: center;
              }
            }
          }
          .item-box:hover {
            border: 1px solid #e45050;
            .item-bottom {
              border-top: 1px solid #e45050;
              a {
                background-color: #e45050;
                color: white;
              }
            }
          }
        }
      }
      .right-table-box {
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
          .add-to-shopcart {
            background-color: #e45050;
            color: white;
            margin-bottom: 5px;
          }
        }
      }
      .right-footer {
        width: 100%;
        height: 42px;
        border: 1px solid #e5e5e5;
        line-height: 42px;
        margin-bottom: 20px;
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
        .join-shopcart {
          color: white;
          background-color: #e4393c;
        }
        .join-goods-shelves {

        }
      }
    }
    .pagination-container {
      display: block;
      width: 100%;
      margin: 10px 0px;
    }
  }
</style>
