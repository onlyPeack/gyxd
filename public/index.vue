<template>
  <div class="dashboard-editor-container">
    <el-container>
      <el-main>
        <!-- <el-carousel class="flash" indicator-position="none" :height="height" tigger="click" :autoplay="false">
          <el-carousel-item v-for="item in 2" :key="item">
            <div class="item item-1">
              <span class="item_title">库存预警</span>
              <span class="item_content">{{item}}-9</span>
            </div>
            <div class="item item-2" type="Warning">
              <span class="item_title">未发货销货订单</span>
              <span class="item_content">{{item}}-20</span>
            </div>
            <div class="item item-3">
              <span class="item_title">未审核购货单</span>
              <span class="item_content">{{item}}-15</span>
            </div>
            <div class="item item-4">
              <span class="item_title">未审核销货单</span>
              <span class="item_content">{{item}}-10</span>
            </div>
          </el-carousel-item>
        </el-carousel> -->
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="grid-content bg-green">
              <div class="flex-grid">
                <i class="iconfont1 el-icon-news" ></i>
                <span class="count">0</span>
              </div>
              <div class="grid-name">今日销售额</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-yellow">
              <div class="flex-grid">
                <i class="iconfont1 el-icon-news" ></i>
                <span class="count">0</span>
              </div>
              <div class="grid-name">今日订单数</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-blue">
              <div class="flex-grid">
                <i class="iconfont1 el-icon-news" ></i>
                <span class="count">0</span>
              </div>
              <div class="grid-name">出售商品数</div>
            </div>
            </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">
              <div class="flex-grid">
                <i class="iconfont1 el-icon-news" ></i>
                <span class="count">0</span>
              </div>
              <div class="grid-name">总会员数</div>
            </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="pending">
              <div class="sys-panel span-24">
                <div class="sys-header">
                  <h3>待处理</h3>
                </div>
                <div class="sys-body">
                  <ul class="handling-box" style="height: 133px;">
                    <li class="handling-items">
                      <i class="iconfont1 el-icon-news"></i>
                      <div class="handling-name">待发货</div>
                      <div class="handling-count">1207</div>
                    </li>
                    <li class="handling-items">
                      <i class="iconfont1 el-icon-sold-out"></i>
                      <div class="handling-name">待付款</div>
                      <div class="handling-count">1169</div>
                    </li>
                    <li class="handling-items">
                      <i class="iconfont1 el-icon-refresh"></i>
                      <div class="handling-name">退货/退款</div>
                      <div  class="handling-count">14</div>
                    </li>
                    <li class="handling-items">
                      <i class="iconfont1 el-icon-info"></i>
                      <div class="handling-name">库存预警</div>
                      <div class="handling-count">1</div>
                    </li> 
                    <li class="handling-items">
                      <i  class="iconfont1 el-icon-tickets"></i>
                      <div class="handling-name">商品咨询</div>
                      <div class="handling-count">91</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="pending">
              <div class="sys-panel span-24">
                <div class="sys-header">
                  <h3>常用菜单</h3>
                </div>
                <div class="sys-body">
                  <ul class="handling-box" style="height: 133px;">
                    <li class="handling-items">
                      <div class="color-box color-1"><i class="iconfont1 el-icon-goods"></i></div>
                      <div class="handling-name">商品发布</div>
                    </li>
                    <li class="handling-items">
                       <div class="color-box color-2"><i class="iconfont1 el-icon-picture-outline"></i></div>
                      <div class="handling-name">首页轮播图</div>
                    </li>
                    <li class="handling-items">
                       <div class="color-box color-3"><i class="iconfont1 el-icon-s-finance"></i></div>
                      <div class="handling-name">优惠券</div>
                    </li>
                    <li class="handling-items">
                       <div class="color-box color-4"><i class="iconfont1 el-icon-s-check"></i></div>
                      <div class="handling-name">在线客服</div>
                    </li> 
                    <li class="handling-items">
                       <div class="color-box color-5"><i class="iconfont1 el-icon-document"></i></div>
                      <div class="handling-name">文章发布</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="sys-panel">
              <div class="sys-header">
                <h3>热销商品</h3>
                <div>
                  <el-radio-group v-model="selectRadio">
                    <el-radio-button label="年"></el-radio-button>
                    <el-radio-button label="月"></el-radio-button>
                    <el-radio-button label="日"></el-radio-button>
                  </el-radio-group>
                  <span class="iconfont el-icon-more-outline bbs-ellipsi"></span>
                </div>
              </div>
              <div class="sys-body body-table"></div>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="sys-panel">
              <div class="sys-header">
                <h3>销售额统计</h3>
                <div>
                  <el-radio-group v-model="selectRadioTwo">
                    <el-radio-button label="月"></el-radio-button>
                    <el-radio-button label="年"></el-radio-button>
                  </el-radio-group>
                  <span class="iconfont el-icon-more-outline bbs-ellipsi"></span>
                </div>
              </div>
              <div class="sys-body body-table"></div>
            </div>
          </el-col>
        </el-row>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="销货" name="first">
            <el-row :gutter="32" v-if="activeName=='first'">
              <el-col :xs="24" :sm="24" :lg="8">
                <div class="chart-wrapper">
                  <raddar-chart></raddar-chart>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          
        </el-tabs>

      </el-main>
      <el-aside width="15%" style="margin-right: 10px">
        <el-card class="box-card notice">
          <div slot="header">
            <svg-icon icon-class="notice"></svg-icon>
            <span>通知</span>
          </div>
          <div class="notice-cont">
            
            <ul v-if="messageNotification.length>1">
              <li v-for="item in messageNotification" :key="item.id" >
                {{item.title}}
              </li>
            </ul>
            <div class="unNews"  v-else>暂无新通知~</div>    
          </div>
        </el-card>
        <!-- <div style=" height: 150px">

           <el-card class="box-card">
             <div class="notice">
               <div v-for="o in 4" :key="o" class="text item">
                 {{o +'、'+ '通知通知，特此通知 ' }}
               </div>
             </div>
           </el-card>
           <el-button type="text" class="notice-button">
             <svg-icon icon-class="notice" class="notice-icon"></svg-icon>
           </el-button>
         </div>-->
        <div>

          <el-tabs type="border-card" class="aside-menu">
            <!--svg-icon icon-class="setup" class="setup-icon"  @click="centerDialogVisible = true" ></svg-icon-->
            <el-tab-pane>
              <span slot="label">
                <el-button type="text" @click="handleViewSelect">
                  <svg-icon icon-class="setup" class="setup-icon"></svg-icon>
                </el-button>
                常用功能
              </span>

              <el-dialog title="选择常用功能(最多可选择8个)" :visible.sync="dialogVisible" width="90%"
                         class="dashboard-dialog-box">
                <div class="dialogTop">
                  <el-tag
                    v-for="(tag,tagIndex) in selectedFeatures"
                    :key="tag.title"
                    :type="'success'" class="dialog-tag" closable @close="handleSelectedFeaturesDel(tagIndex)">
                    {{tag.title}}
                  </el-tag>
                </div>
                <div class="dialogBottom">
                  <el-card class="box-card" v-for="(item,idx) in permissionMenus" :key="item.id">
                    <div slot="header" class="">
                      <span>{{item.title}}</span>
                    </div>
                    <div class="box-card-tree">
                      <el-tree
                        class="filter-tree"
                        :data="item.children"
                        node-key="id"
                        highlight-current
                        show-checkbox
                        :props="defaultProps"
                        :expand-on-click-node="false"
                        :ref="'menuTree'+idx"
                        :default-expand-all="false"
                        @check-change="handleTreeCheck"
                      >
                      </el-tree>
                    </div>
                  </el-card>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="handleFunctionAdd">确定</el-button>
                </div>
              </el-dialog>

              <div v-for="fn in myFeatures" class="aside-info" :key="fn.id">
                <router-link :to="fn.path" >
                  <svg-icon icon-class="email" class="aside-icon"></svg-icon>
                  <br>
                  {{fn.title}}
                </router-link>
              </div>

              <!--<el-row class="aside-row">
                <el-col :span="8" :offset="3">
                  <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                  <div v-for="fn in selectedFeatures ">{{fn.name}}</div>购货单
                </el-col>
                <el-col :span="8" :offset="3">
                  <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                  以销定购
                </el-col>
              </el-row>
              <el-row class="aside-row">
              <el-col :span="8" :offset="3">
                <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                销货单
              </el-col>
              <el-col :span="8" :offset="3">
                <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                调拨单
              </el-col>
            </el-row>
              <el-row class="aside-row">
              <el-col :span="8" :offset="3">
                <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                组装单
              </el-col>
              <el-col :span="8" :offset="3">
                <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                盘点
              </el-col>
             </el-row>
              <el-row class="aside-row">
               <el-col :span="8" :offset="3">
                 <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                 收款单
               </el-col>
               <el-col :span="8" :offset="3">
                 <svg-icon icon-class="email" class="aside-icon"></svg-icon><br>
                 增值服务
               </el-col>
             </el-row-->
            </el-tab-pane>

            <el-tab-pane label="关键数据">
              <ul class="Key-data">
                <li>库存总量：<span>9,194.1100000</span></li>
                <li class="Underline">库存成本：<span>272,461.00</span></li>
                <li>现金：<span>1,314,409,190.30</span></li>
                <li class="Underline">银行存款：<span>-13,132.66</span></li>
                <li>客户欠款：<span>-105,305.51</span></li>
                <li class="Underline">供应商欠款：<span>1,129,995.17</span></li>
                <li>销售收入(本月)：<span>20,200.00</span></li>
                <li class="Underline">销售毛利(本月)：<span>10,110.00</span></li>
                <li>采购金额(本月)：<span>10,480.00</span></li>
                <li class="Underline">商品种类(本月)：<span>2</span></li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-aside>
    </el-container>


    <!--panel-group @handleSetLineChartData="handleSetLineChartData"></panel-group-->

    <!--el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"></line-chart>
    </el-row-->

    <!--el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart></raddar-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row-->


    <!--<el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table></transaction-table>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <todo-list></todo-list>
      </el-col>
      <el-col :xs="{span: 12}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 5}">
        <box-card></box-card>
      </el-col>
    </el-row>-->

  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import TransactionTable from './components/TransactionTable'
  import TodoList from './components/TodoList'
  import BoxCard from './components/BoxCard'
  import { getQuickMenu, saveQuickMenu } from '@/api/admin/user'
  import { page, addObj, getObj, putObj, delObj, addComment, readStatus } from '@/api/erp/oa/notice'

  const lineChartData = {
    newVisitis: {
      expectedData: [100, 120, 161, 134, 105, 160, 165],
      actualData: [120, 82, 91, 154, 162, 140, 145]
    },
    messages: {
      expectedData: [200, 192, 120, 144, 160, 130, 140],
      actualData: [180, 160, 151, 106, 145, 150, 130]
    },
    purchases: {
      expectedData: [80, 100, 121, 104, 105, 90, 100],
      actualData: [120, 90, 100, 138, 142, 130, 130]
    },
    shoppings: {
      expectedData: [130, 140, 141, 142, 145, 150, 160],
      actualData: [120, 82, 91, 154, 162, 140, 130]
    }
  };

  export default {
    name: 'dashboard-admin',
    components: {
      PanelGroup,
      LineChart,
      RaddarChart,
      PieChart,
      BarChart,
      TransactionTable,
      TodoList,
      BoxCard
    },
    data() {
      const generateData = _ => {
        const data = [];
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${i}`,
            disabled: i % 4 === 0
          });
        }
        return data;
      };
      return {
        activeName: 'first',
        permissionMenus: this.$store.state.user.permissionMenus,
        defaultProps: {
          children: 'children',
          label: 'title'
        },
        lineChartData: lineChartData.newVisitis,
        dialogVisible: false,
        data: generateData(),
        value1: [1, 4],
        selectedFeatures: [],
        myFeatures: [],
        messageNotification: [],
        selectRadio: '年',
        selectRadioTwo: '月'

      }
    },
    mounted() {
      this.getMyFeatures();
    },
    methods: {
      getMyFeatures() {
        getQuickMenu().then(response => {
          const data = response.data;
          for (const i in data) {
            const arr = data[i].path.split('/');
            arr.splice(1, 1);
            data[i].path = arr.join('/');
          }
          this.myFeatures = data;
        });
        page().then(response => {
          const res = response.records
          const unread = []
          for (const v in res) {
            if (v.status === 1) {
              unread.push(v)
            }
          }
          this.messageNotification = unread
        })
      },
      addSelectedFeatures(data) {
        if (data.children.length > 0) {
          for (const i in data.children) {
            this.addSelectedFeatures(data.children[i]);
          }
        } else {
          if (this.selectedFeatures.length >= 8) {
            this.$message('最多选择八个');
            return false;
          }
          if (this.checkIsSelectedFeature(data)) {
            return false;
          }
          this.selectedFeatures.push({
            id: data.id,
            title: data.title
          });
        }
      },
      deleteSelectedFeatures(data) {
        if (data.children.length > 0) {
          for (const i in data.children) {
            var result = this.checkIsSelectedFeature(data.children[i]);
            if (result) {
              this.selectedFeatures.splice(result, 1);
            }
          }
        } else {
          var result = this.checkIsSelectedFeature(data);
          if (result) {
            this.selectedFeatures.splice(result, 1);
          }
        }
      },
      handleSelectedFeaturesDel(index) {
        this.selectedFeatures.splice(index, 1);
      },
      handleTreeCheck(data, check, currentNode) {
        if (currentNode) {
          return false;
        }
        if (check) {
          this.addSelectedFeatures(data);
        } else {
          this.deleteSelectedFeatures(data,);
        }
      },
      handleViewSelect() {
        this.dialogVisible = true;
        this.selectedFeatures = Object.assign([], this.myFeatures)
      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      handleFunctionAdd() {
        /* this.myFeatures = Object.assign({}, this.selectedFeatures);*/
        const _this = this;
        if (this.selectedFeatures.length < 1) {
          return;
        }
        const menuIds = [];
        for (const value of this.selectedFeatures) {
          menuIds.push(value.id);
        }
        saveQuickMenu(menuIds).then(response => {
          if (response.code == '2000') {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            _this.dialogVisible = false;
            _this.getMyFeatures();
          } else {
            _this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        });
      },
      /**
       * 判断功能是否在选中列表中
       * @param o
       *
       * 在列表中返回下标，不在返回false
       */
      checkIsSelectedFeature(o) {
        const list = this.selectedFeatures;
        for (const i in list) {
          if (list[i].id === o.id) {
            return i
          }
        }
        return false;
      }
    },
    props: {
      height: {
        type: String,
        default: '150px'
      }
    }

  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    min-width: 1280px;
    padding-top: 5px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      background-color: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      margin-top: 45px;
    }

    .flash {
      margin-bottom: 30px;

      .item {
        display: inline-block;
        float: left;
        height: 150px;
        width: 24%;
        border-radius: 5px;
        margin-right: 1%;
      }

      .item_title {
        display: block;
        height: 30px;
        width: 130px;
        font-size: 16px;
        background-color: rgb(240, 242, 245);
        opacity: 0.5;
        text-align: center;
        line-height: 30px;
        color: #000000;
      }

      .item_content {
        font-size: 42px;
        color: #ffffff;
        display: block;
        line-height: 80px;
        width: 100%;
        text-align: center;
      }

      .item-1 {
        background-color: #F56C6C;
        margin-left: 0.5%;
      }

      .item-2 {
        background-color: #67C23A;
      }

      .item-3 {
        background-color: #E6A23C;
      }

      .item-4 {
        background-color: #409EFF;
        margin-right: 0.5%;
      }
    }

    .box-card {
      margin-top: 20px;
      height: 150px;
    }

    .notice {
      .notice-cont{
        list-style: none;
        max-height: 95px;
        overflow-y:auto;
        ul{
          list-style: none;
          padding-left:20px;
          margin: 0px;
          li{
            line-height: 26px;
            white-space:nowrap;     //强制不换行
            overflow:hidden;           //自动隐藏文字
            text-overflow: ellipsis;    //文字隐藏后添加省略号
            font-size: 14px;
          }
        }
      }
    }
    .setup-icon {
      height: 16px;
      width: 30px;
    }

    .dialogTop {
      padding-left: 30px;
      margin-bottom: 20px;
      margin-top: 10px;

      .dialog-tag {
        margin-right: 25px;
        height: 30px;
        text-align: center;
        line-height: 30px;
      }
    }

    .dialogBottom {
      .box-card {
        width: 240px;
        height: 280px;
        display: inline-block;
        margin-left: 20px;
      }

      .box-card-tree {
        height: 200px;
        overflow: auto;
      }
    }

    .dialog-footer {
      text-align: center;
      margin-bottom: 50px;
    }

    .aside-menu {
      margin-top: 30px;

      .aside-info {
        width: 45%;
        float: left;
        text-align: center;
        font-size: 14px;
        margin: 7px 0px;
      }

      .aside-icon {
        margin: 20px 1px;
        width: 35px;
        height: 35px;
      }

      .Key-data {
        margin: 0px;
        padding: 0px;
      }

      .Key-data li {
        list-style: none;
        display: block;
        font-size: 16px;
        line-height: 42px;
        width: 100%;
        padding-left: 5px;
      }

      .Key-data li:hover {
        background-color: #EDEDED;
      }

      .Underline {
        border-bottom: #777777 dashed 1px;
      }

      .Key-data span {
        float: right;
        padding-right: 5px;
      }
    }
  }


</style>
<style lang="scss">
  .dashboard-editor-container {
    .notice{
      .el-card__header{
        padding:8px 10px;
      }
      .el-card__body {
        padding: 10px;
      }
    }
    .dashboard-dialog-box .el-dialog {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      min-height: 100vh !important;
    }
  }
  /*首页*/
.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .grid-content {
    height: 112px;
    padding: 16px 20px;
    background: red;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
}
.bg-green {
    background: #17d57e;
}
.bg-yellow {
    background: #fec92b;
}
.bg-blue{
  background: #2da3fb;
}
.bg-purple{
  background: #c172d8;
}
.grid-name{
    margin-top: 16px;
    text-align: right;
}
.flex-grid{
  display: flex;
  align-items: center;
}
.grid-content  {
  .iconfont1 {
    font-size: 36px;
  }
  .count{
    font-size: 30px;
  }
  .flex-grid{
    display: flex;
    justify-content: space-between;
  }
}
.pending{
  padding-left: 12px;
  padding-right: 12px;
}
.span-24{
  margin-bottom: 24px;
}
.sys-panel {
    border: 1px solid #ececec;
    background: #fff;
}
.sys-header {
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #f5f5f5;
    display: flex;
    justify-content: space-between;
    align-items: center;
      h3 {
      font-size: 16px;
      padding-left: 24px;
      font-weight: 400;
  }
  .bbs-ellipsi{
    margin-left: 25px;
    margin-right: 15px;
    color: #f0f0f0;
    cursor: pointer;
  }
}
.sys-body{
  .handling-box{
    display: flex;
    padding: 24px 47px;
    justify-content: space-between;
    .handling-items {
        cursor: pointer;
        float: left;
        text-align: center;
        .iconfont1 {
            font-size: 28px;
            color: #c0d9ec;
        }
        .handling-name{
          margin-top: 3px;
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          color: #999;
        }
        .handling-count{
          margin-top: 8px;
          font-size: 18px;
          height: 22px;
          line-height: 22px;
          color: #353535;
        }
        .color-box{
          margin: 0 auto;
          width: 64px;
          height: 64px;
          border-radius: 4px;
          text-align: center;
          justify-content: center;
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .iconfont1 {
              color: #fff!important;
              font-size: 36px!important;
          }
        }
    }
  }
}
.body-table{
    height: 345px;
    overflow: hidden;
  }
.color-1{
  background: #ffbe60;
}
.color-2{
  background: #47d7e8;
}
.color-3{
  background: #55de9f;
}
.color-4{
  background: #fb99cc;
}
.color-5{
  background: #87c0ea;
}
ul,li{
  list-style: none;
}
.iconfont, .iconfont1 {
  font-size: 16px;
  font-style: normal;
}
.unNews{
  line-height: 90px;
  text-align: center;
  font-size: 14px;
}
</style>
