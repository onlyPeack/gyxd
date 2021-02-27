<template>
  <div class="dashboard-editor-container">
    <div class="doView">
      <div class="doLeft">
        <span>待</span>
        <span>办</span>
        <span>事</span>
        <span>项</span>
        <i class="el-icon-date common-icon"></i>
      </div>
      <div class="doRight">
        <div class="tableView">
          <div class="table-title">
            <div class="title-table"><i class="el-icon-date"></i><span>代办任务</span></div>
            <i class="el-icon-refresh" @click="tabTap"></i></div>
          <el-table v-loading.body="tableLoading" element-loading-text="刷新中..."
                    element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)"
                    :data="list" class="tableView" height="260" border width="100%">
            <el-table-column prop="billNo" label="单据编号" width="240">
              <template slot-scope="scope">
                <div class="colum-billno" @click="handleOpenDialog(scope.row)">
                  {{scope.row.billName}}: {{scope.row.billNo}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="logicKey" label="执行环节" width="90">
              <template slot-scope="scope">
                <div v-for="item in taskAuditOptions">
                  <span v-if="scope.row.logicKey==item.value">{{item.labelDefault}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <router-link :to="{path:'/task/taskNowList',query:{billNo:scope.row.billNo}}"
                             @click="handleClick(scope.row)" type="text" size="small" style="color:#D87A80;">任务办理
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="commonView">
      <div @click="handleViewSelect" class="commonLeft">
        <span>常</span>
        <span>用</span>
        <span>功</span>
        <span>能</span>
        <i class="el-icon-setting common-icon"></i>
      </div>
      <div class="commonRight">
        <div v-for="fn in myFeatures" class="aside-info" :key="fn.id" @click="commonVisible=false">
          <router-link :to="fn.path">
            <svg-icon icon-class="email" class="aside-icon"></svg-icon>
            <span>{{fn.title}}</span>
          </router-link>
        </div>
      </div>
    </div>
    <el-container>
      <el-main class="mainView">
        <div id="demo" class="qimo8">
          <div class="qimo">
            <div id="demo1">
              <ul id="demoScroll" v-if="messageNotification && messageNotification.length > 0">
                <li v-for="(item,index) in messageNotification" :key="index">
                  <a @click="showNotice">
                    <svg-icon icon-class="xiaox" class="xiaox-icons"></svg-icon>
                    <a href='#'>{{item && item.title ? item.title :''}}</a>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <el-row :gutter="20" class="rowsView" v-if="role == 1">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-green" v-loading.body="oneLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">
                    {{selectElectyicitySummary.resultEntity.stockAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>库存总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              <svg-icon icon-class="kucun" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-yellow" v-loading.body="twoLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">
                    {{selectElectyicitySummary.resultEntity.saleOutMonthAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月出库总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
              <svg-icon icon-class="mei" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-blue" v-loading.body="treeLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">
                    {{selectElectyicitySummary.resultEntity.saleOutMonthProfit || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月出库利润</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple" v-loading.body="fourLoading"
                 element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">
                    {{selectElectyicitySummary.resultEntity.outYesterdayAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日出库总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(4)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView" v-if="role == 2">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-green" v-loading.body="oneLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                    {{selectSalesSummary.resultEntity.saleOutMonthAmount}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月出库总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              <svg-icon icon-class="kucun" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-yellow" v-loading.body="twoLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                    {{selectSalesSummary.resultEntity.saleOutMonthProfit || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月出库利润</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
              <svg-icon icon-class="mei" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-blue" v-loading.body="treeLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                    {{selectSalesSummary.resultEntity.outYesterdayAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日出库总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple" v-loading.body="fourLoading"
                 element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                    {{selectSalesSummary.resultEntity.outYesterdayProfit}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日出库利润</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(4)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView" v-if="role == 3">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-blue" v-loading.body="treeLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectFinancialSummary && selectFinancialSummary.resultEntity.purchaseOrderMonthAmount">
                    {{selectFinancialSummary.resultEntity.purchaseOrderMonthAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月采购总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple" v-loading.body="fourLoading"
                 element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                    {{selectSalesSummary.resultEntity.purchaseOrderMonthProfit}}</h2>
                  <h2 v-else>0</h2>
                  <h5>本月采购利润</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(4)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-green" v-loading.body="oneLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectFinancialSummary && selectFinancialSummary.resultEntity">
                    {{selectFinancialSummary.resultEntity.purchaseOrderAmount}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日采购总额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              <svg-icon icon-class="kucun" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-yellow" v-loading.body="twoLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectFinancialSummary && selectFinancialSummary.resultEntity">
                    {{selectFinancialSummary.resultEntity.purchaseOrderProfit || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日采购利润</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
              <svg-icon icon-class="mei" class="title-icon"></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView" v-if="role == 4">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-green" v-loading.body="oneLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectParagraphSummary && selectParagraphSummary.salesParagraph">
                    {{selectParagraphSummary.salesParagraph}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日销售到款</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              <svg-icon icon-class="kucun" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-yellow" v-loading.body="twoLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectParagraphSummary && selectParagraphSummary.yesterdayPurchasingPayment">
                    {{selectParagraphSummary.yesterdayPurchasingPayment || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日采购付款</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
              <svg-icon icon-class="mei" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-blue" v-loading.body="treeLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2 v-if="selectParagraphSummary && selectParagraphSummary.yesterdayTicketAmount">
                    {{selectParagraphSummary.yesterdayTicketAmount || 0}}</h2>
                  <h2 v-else>0</h2>
                  <h5>昨日收票金额</h5>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView" v-if="role == 5">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-green" v-loading.body="oneLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2>0</h2>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(1)"></i>
              <svg-icon icon-class="kucun" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-yellow" v-loading.body="twoLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2>0</h2>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(2)"></i>
              <svg-icon icon-class="mei" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-blue" v-loading.body="treeLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2>0</h2>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(3)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6">
            <div class="grid-content bg-purple" v-loading.body="fourLoading"
                 element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.5)">
              <div class="gridLeft">
                <div class="gridItem">
                  <h2>0</h2>
                </div>
              </div>
              <i class="el-icon-refresh heard-refresh" @click="renovateTap(4)"></i>
              <svg-icon icon-class="ren" class="title-icon"></svg-icon>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="operating">
              <h4>操作流程</h4>
              <div class="operating_view">
                <div class="operating-btn">
                  <img src="http://hejigy.com.cn/operating1.png" width="28" height="32"/>
                  <a>销售场景及流程</a>
                </div>
                <div class="operating-btn">
                  <img src="http://hejigy.com.cn/operating2.png" width="32" height="34"/>
                  <a>采购场景及流程</a>
                </div>
                <div class="operating-btn">
                  <img src="http://hejigy.com.cn/operating3.png" width="29" height="30"/>
                  <a>财务场景及流程</a>
                </div>
                <div class="operating-btn">
                  <img src="http://hejigy.com.cn/operating4.png" width="32" height="32"/>
                  <a>仓储场景及流程</a>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div v-if="role == 1" class="operating">
              <h4>数据统计</h4>
              <div class="operating_view">
                <router-link :to="{path:'/oms/order',query:{checkList: ['部分支付', '待发货', '发货中', '已发货', '已完成']}}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/operating1_cusmte.png" width="43" height="44"/>
                    <a>今日新增订单：<font class="sum"
                                    v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">{{selectElectyicitySummary.resultEntity.orderCount?selectElectyicitySummary.resultEntity.orderCount:0}}</font></a>
                  </div>
                </router-link>
                <router-link :to="{path:'/customer/customerInfo',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/operating1_cusmter.png" width="46" height="37"/>
                    <a>今日新增客户：<font class="sum"
                                    v-if="selectElectyicitySummary && selectElectyicitySummary.resultEntity">{{selectElectyicitySummary.resultEntity.newCustomerCount?selectElectyicitySummary.resultEntity.newCustomerCount:0}}</font></a>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-if="role == 2"
                 class="operating">
              <h4>数据统计</h4>
              <div class="operating_view">
                <router-link :to="{path:'/oms/order',query:{checkList: ['待付款']}}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/sell1.png" width="39" height="39"/>
                    <a>待支付</a>
                    <div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                      <p>
                        {{selectSalesSummary.resultEntity.waitPay}}</p>
                    </div>
                  </div>
                </router-link>
                <router-link :to="{path:'/oms/order',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/sell2.png" width="41" height="38"/>
                    <a>待审核</a>
                    <div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                      <p>
                        {{selectSalesSummary.resultEntity.waitAudit}}</p>
                    </div>
                  </div>
                </router-link>
                <router-link :to="{path:'/oms/order',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/sell3.png" width="49" height="38"/>
                    <a>待发货</a>
                    <div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                      <p>
                        {{selectSalesSummary.resultEntity.waitDeliver}}</p>
                    </div>
                  </div>
                </router-link>
                <!--<router-link :to="{path:'/purchase_bill/purchase_apply',}">-->
                  <!--<div class="statistics-btn">-->
                    <!--<img src="http://hejigy.com.cn/procured.png" width="44" height="42"/>-->
                    <!--<a>待采购</a>-->
                    <!--<div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">-->
                      <!--<p>-->
                        <!--{{selectSalesSummary.resultEntity.waitPurchase}}</p>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</router-link>-->
                <!--<router-link :to="{path:'/stock_in/purchase_stock_in',}">-->
                  <!--<div class="statistics-btn">-->
                    <!--<img src="http://hejigy.com.cn/sell7.png" width="44" height="42"/>-->
                    <!--<a>待入库</a>-->
                    <!--<div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">-->
                      <!--<p>-->
                        <!--{{selectSalesSummary.resultEntity.waitStockIn}}</p>-->
                    <!--</div>-->
                  <!--</div>-->
                <!--</router-link>-->
                <router-link :to="{path:'/stock_out/sales_stock_out',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/sell4.png" width="44" height="42"/>
                    <a>待出库</a>
                    <div class="hot" v-if="selectSalesSummary && selectSalesSummary.resultEntity">
                      <p>
                        {{selectSalesSummary.resultEntity.waitStockOut}}</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
            <div v-if="role == 3" class="operating">
              <h4>数据统计</h4>
              <div class="operating_view">
                <router-link :to="{path:'/purchase_bill/purchase_order',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/purchase1.png" width="34" height="42"/>
                    <a class="order_item"> 待采购 订单</a>
                    <!--<div class="hot">-->
                    <!--<p>0</p>-->
                    <!--</div>-->
                  </div>
                </router-link>
                <router-link :to="{path:'/purchase_bill/payment_apply',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/purchase2.png" width="41" height="38"/>
                    <a class="order_item">待请款 订单</a>
                    <!--<div class="hot">-->
                    <!--<p>0</p>-->
                    <!--</div>-->
                  </div>
                </router-link>
                <router-link :to="{path:'/stock_query/goods_stock_query',}">
                  <div class="statistics-btn">
                    <img src="http://hejigy.com.cn/purchase3.png" width="41" height="40"/>
                    <a class="order_item">库存预警</a>
                    <!--<div class="hot">-->
                    <!--<p>0</p>-->
                    <!--</div>-->
                  </div>
                </router-link>
              </div>
            </div>
            <div v-if="role == 4" class="operating">
              <h4>数据统计</h4>
              <div class="operating_view">
                <div class="statistics-btn">
                  <img src="http://hejigy.com.cn/no.png" width="43" height="43"/>
                  <a style="color: #999999;">暂无数据...</a>
                </div>
              </div>
            </div>
            <div v-if="role == 5" class="operating">
              <h4 style="height: 18px;"></h4>
              <div class="operating_view">
                <div class="statistics-btn">
                  <img src="http://hejigy.com.cn/no.png" width="43" height="43"/>
                  <a style="color: #999999;">暂无数据...</a>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="rowsView">
          <el-col v-if="role == 1 || role == 2"
                  :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="oneEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 元</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(5)"></i>
              </div>
              <raddar-chart v-if="vocational[1].option.dataset.source.length>0" :vocational="vocational[1].option"
                            ref="vocationalSale" height="352px"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 2" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="twoEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 位</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(6)"></i>
              </div>
              <raddar-chart v-if="vocational[2].option.xAxis.data.length>0" height="352px"
                            :vocational="vocational[2].option" ref="vocationalParagraph"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 1"
                  :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="treeEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 元</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(7)"></i>
              </div>
              <raddar-chart v-if="vocational[3].option.dataset.source.length>0" :vocational="vocational[3].option"
                            ref="vocationalRanking" height="352px"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 3" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="oneEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 元</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(5)"></i>
              </div>
              <raddar-chart v-if="vocational[1].option.dataset.source.length>0" height="352px"
                            :vocational="vocational[1].option" ref="vocationalAmount"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 3" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="twoEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 元</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(6)"></i>
              </div>
              <bar-chart v-if="vocationalBar.legend.data.length>0" :vocationalBar="vocationalBar" height="352px"
                         ref="vocational5"></bar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="oneEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 元</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(5)"></i>
              </div>
              <raddar-chart v-if="vocational[2].option.xAxis.data.length>0" height="352px"
                            :vocational="vocational[2].option" ref="vocationalParagraph"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 4" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="twoEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="programme_title">
                <h4>单位: 份</h4>
                <i class="el-icon-refresh heard-refresh" @click="renovateTap(6)"></i>
              </div>
              <raddar-chart v-if="vocational[0].option.dataset.source.length>0" height="352px"
                            :vocational="vocational[0].option" ref="vocationalsParagraph"></raddar-chart>
              <div v-else class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 5" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="twoEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col v-if="role == 5" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="programme" v-loading.body="twoEchartLoading" element-loading-text="刷新中..."
                 element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255)">
              <div class="available">
                <svg-icon icon-class="line" class="available-icon"></svg-icon>
                <span>暂无数据~</span>
              </div>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" v-if="false">
            <div class="programme">
              <div class="programme_title">
                <h4>日程</h4>
                <el-button type="primary" @click="insertProgramme">新建日程</el-button>
              </div>
              <div class="programme_conent">
                <div style="width: 400px;height: 336px;border: 1px solid #dfe6ec;margin-top: 10px;">
                  <full-calendar :events="events" @dayClick="getChildDayClick" @eventClick="getChildEventClick"
                                 @refreshData="refreshData" @changeMonth="changeMonth"></full-calendar>
                </div>

              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <div style="text-align: center;color: #2da3fb;background: #ffffff;font-size: 15px;padding-top: 10px;">
            </div>
            <div style="text-align: center;color: #2da3fb;background: #ffffff;font-size: 14px;padding-top: 5px;padding-bottom: 10px;">云电商ERP管理软件  V1.0</div>
          </el-col>
        </el-row>
      </el-main>
      <el-dialog title="选择
      常用功能(最多可选择8个)" :visible.sync="dialogVisible" width="90%"
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
    </el-container>
<!--    公告弹窗-->
    <el-dialog  :visible.sync="isShowNotice" width="30%" v-if="isShowNotice" @close="closeNotice">
      <template slot="title">
        <span style="font-size: 19px">{{noticeData.title}}</span><span style="font-size: 12px;margin-left: 20px;">更新时间：{{noticeData.updTime}}</span>
      </template>
      <div v-html="noticeData.content">

      </div>
    </el-dialog>
    <programme-compoent :isProgramme="isProgramme" @programmeClose="programmeClose"
                        @programmeSubmint="programmeSubmint"></programme-compoent>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import programmeCompoent from './components/programmeCompoent'
  import LineChart from './components/LineChart'
  import RaddarChart from './components/RaddarChart'
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import TransactionTable from './components/TransactionTable'
  import TodoList from './components/TodoList'
  import BoxCard from './components/BoxCard'
  import {getQuickMenu, saveQuickMenu} from '@/api/admin/user'
  import {page,getNote,readNote} from '@/api/erp/oa/notice'
  import {
    selectSalesSummary,
    selectParagraphSummary,
    selectFinancialSummary,
    selectElectricitySummary,
    shopManager,
    salesman,
    purchase
  } from '@/api/mall/sales/sales'
  import {
    queryStockAndCostPrice,
    queryWarehouseRank,
    queryStockBrand,
    querySalerRank,
    queryCustomerRank,
    querySalesReceivableRank
  } from '@/api/erp/wms/stock_query/index'
  import {page as sthData} from '@/api/erp/oa/task/taskNow'
  import {getTypeValue} from '@/api/dict/dictValue/index'
  import FullCalendar from './components/fullCalendar';
  import {page as pages} from '@/api/erp/oa/schedule';

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
  }

  export default {
    name: 'dashboard-admin',
    components: {
      programmeCompoent,
      FullCalendar,
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
        const data = []
        for (let i = 1; i <= 15; i++) {
          data.push({
            key: i,
            label: `备选项 ${i}`,
            disabled: i % 4 === 0
          })
        }
        return data
      }
      return {
        isShowNotice:false,//是否展示公告弹窗
        noticeData:{},//公告内容
        noticeId:'',//公告id
        isSell: false,
        isProgramme: false,
        tableIndex: 1,
        role: '',
        listQuery: {
          beginDate: undefined,
          endDate: undefined,
        },
        listQuerys: {
          page: 1,
          limit: 5,
        },
        events: [],
        value: new Date(),
        vocationalBar: {
          tote: 0,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            x: 'left',
            data: []
          },
          calculable: true,
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                normal: {
                  label: {
                    show: false
                  },
                  labelLine: {
                    show: false
                  }
                },
                emphasis: {
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                }
              },
              data: []
            }
          ]
        },
        vocational: [
          {
            option: {
              legend: {},
              tooltip: {},
              dataset: {
                source: []
              },
              xAxis: {type: 'category'},
              yAxis: {},
              // Declare several bar series, each will be mapped
              // to a column of dataset.source by default.
              series: [
                {type: 'bar'}
              ]
            }
          }, {
            option: {
              legend: {},
              tooltip: {},
              dataset: {
                source: []
              },
              xAxis: {type: 'category'},
              yAxis: {},
              // Declare several bar series, each will be mapped
              // to a column of dataset.source by default.
              series: [
                {type: 'bar'},
                {type: 'bar'}
              ]
            }
          }, {
            option: {
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['近7天销售到款']
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  name: '新增客户',
                  type: 'line',
                  stack: '总量',
                  data: []
                }
              ]
            }
          }, {
            option: {
              legend: {},
              tooltip: {},
              dataset: {
                source: []
              },
              xAxis: {type: 'category'},
              yAxis: {},
              // Declare several bar series, each will be mapped
              // to a column of dataset.source by default.
              series: [
                {type: 'bar'},
                {type: 'bar'}
              ]
            }
          }, {
            option: {
              xAxis: {
                type: 'category',
                data: [],
                axisLabel: {
                  show: true,
                  textStyle: {
                    color: '#666666'
                  },
                  formatter: function (value) {
                    var valueDetal = value.split('-').join('')
                    var ret = '' //拼接加\n返回的类目项
                    var maxLength = 3 //每项显示文字个数
                    var valLength = valueDetal.length //X轴类目项的文字个数
                    var rowN = Math.ceil(valLength / maxLength) //类目项需要换行的行数
                    if (rowN > 1) { //如果类目项的文字大于3,
                      for (var i = 0; i < rowN; i++) {
                        var temp = '' //每次截取的字符串
                        var start = i * maxLength //开始截取的位置
                        var end = start + maxLength //结束截取的位置
                        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                        temp = valueDetal.substring(start, end) + '\n'
                        ret += temp //凭借最终的字符串
                      }
                      return ret
                    } else {
                      return valueDetal
                    }
                  }
                }
              },
              yAxis: {
                type: 'value'
              },
              series: [{
                data: [],
                type: 'bar',
                itemStyle: {
                  normal: {
                    label: {
                      show: true,
                      position: 'top',
                      textStyle: {
                        color: '#615a5a'
                      }
                    }
                  }
                }
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
        lineChartData: lineChartData.newVisitis,
        dialogVisible: false,
        data: generateData(),
        value1: [1, 4],
        selectedFeatures: [],
        myFeatures: [],
        messageNotification: [],
        selectRadio: '年',
        selectRadioTwo: '月',
        commonVisible: false,
        tableVisible: false,
        selectSalesSummary: undefined,
        selectParagraphSummary: undefined,
        selectFinancialSummary: undefined,
        selectElectyicitySummary: undefined,
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
        scrollWidth: 0,
        payOrder: 0,
        shippedOrder: 0,
      }
    },
    watch: {
      $route(to, from) {
        if (to.path == '/dashboard') {
          this.timer = setInterval(this.scrollLeft, 50)
        } else {
          clearInterval(this.timer)
        }
      }
    },
    mounted() {
      this.listQuerys.page = 1;
      let group = this.$store.getters.groupNames;
      if (group.indexOf('总经理') > -1) {
        this.role = 1;
        this.electricityData(10);
      } else if (group.indexOf('销售') > -1 || group.indexOf('销售经理') > -1 || group.indexOf('区域经理') > -1) {
        this.role = 2;
        this.saleData(10);
      } else if (group.indexOf('采购') > -1) {
        this.role = 3;
        this.selectData(10);
      } else if (group.indexOf('财务') > -1) {
        this.role = 5;
        //this.paragraphData(10);
      } else {
        this.role = 5;
      }
      getTypeValue('root_bill').then(response => {
        this.billOptions = response.data.rows
      })
      getTypeValue('task_audit').then(response => {
        this.taskAuditOptions = response.data.rows
        sthData().then(response => {
          this.list = []
          for (const i in response.records) {
            if (response.records[i].billNo) {
              let key = response.records[i].billNo.replace(/[^a-z]+/ig, '')
              key = 'root_bill_' + key
              response.records[i].billName = this.getBillName(key)
            }
          }
          this.list = response.records
        })
      })
      this.getMyFeatures()
      const _this = this
      // 设置滚动速度
      _this.timer = setInterval(_this.scrollLeft, 50)
      const demo1 = document.getElementById('demo1')
      // demo1.onmouseover = function() {
      //   clearInterval(_this.timer)
      // }
      // demo1.onmouseout = function() {
      //   _this.timer = setInterval(_this.scrollLeft, 50)
      // }
      getNote().then(res=>{
        if(res.data&&res.data.status===1){
          this.isShowNotice=true
          this.noticeData=res.data
          this.noticeId=res.data.id
        }else{
          this.isShowNotice=false
        }
      },err=>this.$message.error('获取公告失败!'+err))
    },
    methods: {
      vocationalTap(sum) {
        this.listQuerys.page = 1;
        this.tableIndex = sum;
        this.renovateTap(6);
      },
      // 触发刷新操作
      renovateTap(sum) {
        this.listQuerys.page = 1;
        if (parseInt(sum) === 1) {
          this.oneLoading = true
        }
        if (parseInt(sum) === 2) {
          this.twoLoading = true
        }
        if (parseInt(sum) === 3) {
          this.treeLoading = true
        }
        if (parseInt(sum) === 4) {
          this.fourLoading = true
        }
        if (parseInt(sum) === 5) {
          this.oneEchartLoading = true
        }
        if (parseInt(sum) === 6) {
          this.twoEchartLoading = true
        }
        if (parseInt(sum) === 7) {
          this.treeEchartLoading = true
        }
        if (this.role == 1) {
          this.electricityData(parseInt(sum));
        } else if (this.role == 2) {
          this.saleData(sum);
        } else if (this.role == 3) {
          this.selectData(parseInt(sum));
        } else if (this.role == 4) {
          this.paragraphData(parseInt(sum));
        } else {
        }
      },
      selectData(sum) {
        purchase().then(response => {
          if (sum == 10) {
            this.selectFinancialSummary = response;
            let selectData = [['product', '采购额', '利润']];
            for (var key in this.selectFinancialSummary.purchaseOrderResultList) {
              selectData.push([this.selectFinancialSummary.purchaseOrderResultList[key].time, this.selectFinancialSummary.purchaseOrderResultList[key].purchaseOrderAmount, this.selectFinancialSummary.purchaseOrderResultList[key].purchaseOrderProfit]);
            }
            this.vocational[1].option.dataset.source = selectData;
            const refNameTwo = 'vocationalAmount';
            if (response.purchaseOrderResultList.length > 0) {
              if (this.$refs[refNameTwo]) {
                this.$refs[refNameTwo].initChart();
              }
            }
            this.vocationalBar.legend.data = ['已到票订单', '未到票订单'];
            this.vocationalBar.series[0].data = [
              {
                value: this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount,
                name: '已到票订单',
              },
              {
                value: Number(this.selectFinancialSummary.resultEntity.purchaseOrderTotalAmount) - Number(this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount),
                name: '未到票订单',
              }
            ]
            const refNameTree = 'vocational5';
            if (this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount) {
              if (this.$refs[refNameTree]) {
                this.$refs[refNameTree].initChart();
              }
            }

          } else {
            if (sum == 5 || sum == 6) {
              this.selectFinancialSummary = response;
              if (sum == 5) {
                let selectData = [['product', '采购额', '利润']];
                for (var key in this.selectFinancialSummary.purchaseOrderResultList) {
                  selectData.push([this.selectFinancialSummary.purchaseOrderResultList[key].time, this.selectFinancialSummary.purchaseOrderResultList[key].purchaseOrderAmount, this.selectFinancialSummary.purchaseOrderResultList[key].purchaseOrderAmount]);
                }
                this.vocational[1].option.dataset.source = selectData;
                const refNameTwo = 'vocationalAmount';
                if (this.selectFinancialSummary.purchaseOrderResultList.length > 0) {
                  if (this.$refs[refNameTwo]) {
                    this.$refs[refNameTwo].initChart();
                  }
                }
              }
              if (sum == 6) {
                this.vocationalBar.legend.data = ['已到票订单', '未到票订单'];
                this.vocationalBar.series[0].data = [
                  {
                    value: this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount,
                    name: '已到票订单',
                  },
                  {
                    value: Number(this.selectFinancialSummary.resultEntity.purchaseOrderTotalAmount) - Number(this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount),
                    name: '未到票订单',
                  }
                ]
                const refNameTree = 'vocational5';
                if (this.selectFinancialSummary.resultEntity.purchaseTicketTotalAmount) {
                  if (this.$refs[refNameTree]) {
                    this.$refs[refNameTree].initChart();
                  }
                }
              }
            } else {
              if (sum == 1) {
                this.selectFinancialSummary.resultEntity.purchaseOrderAmount = response.resultEntity.purchaseOrderAmount;
              }
              if (sum == 2) {
                this.selectFinancialSummary.resultEntity.purchaseOrderProfit = response.resultEntity.purchaseOrderProfit;
              }
              if (sum == 3) {
                this.selectFinancialSummary.resultEntity.purchaseOrderMonthAmount = response.resultEntity.purchaseOrderMonthAmount;
              }
              if (sum == 4) {
                this.selectFinancialSummary.resultEntity.purchaseOrderMonthProfit = response.resultEntity.purchaseOrderMonthProfit;
              }
            }
            setTimeout(() => {
              this.oneLoading = false;
              this.twoLoading = false;
              this.treeLoading = false;
              this.fourLoading = false;
              this.oneEchartLoading = false;
              this.twoEchartLoading = false;
              this.treeEchartLoading = false;
            }, 1000);
          }
        })
      },
      handleCurrentChange(val) {
        this.listQuerys.page = val;
        this.renovateTap(6);
      },
      paragraphData(sum) {
        selectParagraphSummary().then(response => {
          if (sum == 10) {
            this.selectParagraphSummary = response.data;
            let dateData = [];
            let incomeData = [];
            for (var key of Object.keys(this.selectParagraphSummary.sevenPurchasingPayment)) {
              dateData.push(key);
              incomeData.push(this.selectParagraphSummary.sevenPurchasingPayment[key].sales);
            }
            this.vocational[2].option.xAxis.data = dateData;
            this.vocational[2].option.series[0].data = incomeData;
            const refNameOne = 'vocationalParagraph';
            if (response.data.sevenPurchasingPayment.length > 0) {
              if (this.$refs[refNameOne]) {
                this.$refs[refNameOne].initChart();
              }
            }
            let copiesData = [['product', '近7天销售到款']];
            for (var key of Object.keys(this.selectParagraphSummary.sevenSalesParagraph)) {
              copiesData.push([key, this.selectParagraphSummary.sevenSalesParagraph[key].sales]);
            }
            this.vocational[0].option.dataset.source = copiesData;
            const refNameTwo = 'vocationalsParagraph';
            if (response.data.sevenSalesParagraph.length > 0) {
              if (this.$refs[refNameTwo]) {
                this.$refs[refNameTwo].initChart();
              }
            }
          } else {
            if (sum == 5 || sum == 6) {
              this.selectParagraphSummary = response.data;
              if (sum == 5) {
                let dateData = [];
                let incomeData = [];
                for (var key of Object.keys(this.selectParagraphSummary.sevenPurchasingPayment)) {
                  dateData.push(key);
                  incomeData.push(this.selectParagraphSummary.sevenPurchasingPayment[key].sales);
                }
                this.vocational[2].option.xAxis.data = dateData;
                this.vocational[2].option.series[0].data = incomeData;
                const refNameOne = 'vocationalParagraph';
                if (response.data.sevenPurchasingPayment.length > 0) {
                  if (this.$refs[refNameOne]) {
                    this.$refs[refNameOne].initChart();
                  }
                }
              }
              if (sum == 6) {
                let copiesData = [['product', '近7天销售到款']];
                for (var key of Object.keys(this.selectParagraphSummary.sevenSalesParagraph)) {
                  copiesData.push([key, this.selectParagraphSummary.sevenSalesParagraph[key].sales]);
                }
                this.vocational[0].option.dataset.source = copiesData;
                const refNameTwo = 'vocationalsParagraph';
                if (response.data.sevenSalesParagraph.length > 0) {
                  if (this.$refs[refNameTwo]) {
                    this.$refs[refNameTwo].initChart();
                  }
                }
              }
            } else {
              if (sum == 1) {
                this.selectParagraphSummary.salesParagraph = response.data.salesParagraph;
              }
              if (sum == 2) {
                this.selectParagraphSummary.yesterdayPurchasingPayment = response.data.yesterdayPurchasingPayment;
              }
              if (sum == 3) {
                this.selectParagraphSummary.yesterdayTicketAmount = response.data.yesterdayTicketAmount;
              }
            }
            setTimeout(() => {
              this.oneLoading = false;
              this.twoLoading = false;
              this.treeLoading = false;
              this.fourLoading = false;
              this.oneEchartLoading = false;
              this.twoEchartLoading = false;
              this.treeEchartLoading = false;
            }, 1000);
          }
        })
      },
      electricityData(sum) {
        shopManager().then(res => {
          if (sum == 10) {
            this.selectElectyicitySummary = res;
            let saleList = [['product', '出库额', '利润'],];
            for (var key in this.selectElectyicitySummary.saleOutResultList) {
              saleList.push([this.selectElectyicitySummary.saleOutResultList[key].time, this.selectElectyicitySummary.saleOutResultList[key].saleOutAmount, this.selectElectyicitySummary.saleOutResultList[key].saleOutProfit]);
            }
            this.vocational[1].option.dataset.source = saleList;
            const refNameOne = 'vocationalSale';
            if (this.selectElectyicitySummary.saleOutResultList && this.selectElectyicitySummary.saleOutResultList.length > 0) {
              if (this.$refs[refNameOne]) {
                this.$refs[refNameOne].initChart();
              }
            }
            let turnOver = [['product', '采购额', '利润',]];
            for (var key in this.selectElectyicitySummary.purchaseOrderResultList) {
              turnOver.push([this.selectElectyicitySummary.purchaseOrderResultList[key].time, this.selectElectyicitySummary.purchaseOrderResultList[key].purchaseOrderAmount, this.selectElectyicitySummary.purchaseOrderResultList[key].purchaseOrderProfit]);
            }
            this.vocational[3].option.dataset.source = turnOver;
            const refNameTwo = 'vocationalRanking';
            if (this.selectElectyicitySummary.purchaseOrderResultList && this.selectElectyicitySummary.purchaseOrderResultList.length > 0) {
              if (this.$refs[refNameTwo]) {
                this.$refs[refNameTwo].initChart();
              }
            }
          } else {
            if (sum == 5 || sum == 7) {
              this.selectElectyicitySummary = res;
              if (sum == 5) {
                let saleList = [['product', '出库额', '利润'],];
                for (var key in this.selectElectyicitySummary.saleOutResultList) {
                  saleList.push([this.selectElectyicitySummary.saleOutResultList[key].time, this.selectElectyicitySummary.saleOutResultList[key].saleOutAmount, this.selectElectyicitySummary.saleOutResultList[key].saleOutProfit]);
                }
                this.vocational[1].option.dataset.source = saleList;
                const refNameOne = 'vocationalSale';
                if (this.selectElectyicitySummary.saleOutResultList && this.selectElectyicitySummary.saleOutResultList.length > 0) {
                  if (this.$refs[refNameOne]) {
                    this.$refs[refNameOne].initChart();
                  }
                }
              }
              if (sum == 7) {
                let turnOver = [['product', '采购额', '利润',]];
                for (var key in this.selectElectyicitySummary.purchaseOrderResultList) {
                  turnOver.push([this.selectElectyicitySummary.purchaseOrderResultList[key].time, this.selectElectyicitySummary.purchaseOrderResultList[key].purchaseOrderAmount, this.selectElectyicitySummary.purchaseOrderResultList[key].purchaseOrderProfit]);
                }
                this.vocational[3].option.dataset.source = turnOver;
                const refNameTwo = 'vocationalRanking';
                if (this.selectElectyicitySummary.purchaseOrderResultList.length > 0) {
                  if (this.$refs[refNameTwo]) {
                    this.$refs[refNameTwo].initChart();
                  }
                }
              }
            } else {
              if (sum == 1) {
                this.selectElectyicitySummary.resultEntity.stockAmount = res.resultEntity.stockAmount;
              }
              if (sum == 2) {
                this.selectElectyicitySummary.resultEntity.saleOutMonthAmount = res.resultEntity.saleOutMonthAmount;
              }
              if (sum == 3) {
                this.selectElectyicitySummary.resultEntity.saleOutMonthProfit = res.resultEntity.saleOutMonthProfit;
              }
              if (sum == 4) {
                this.selectElectyicitySummary.resultEntity.outYesterdayAmount = res.resultEntity.outYesterdayAmount;
              }
            }
            setTimeout(() => {
              this.oneLoading = false;
              this.twoLoading = false;
              this.treeLoading = false;
              this.fourLoading = false;
              this.oneEchartLoading = false;
              this.twoEchartLoading = false;
              this.treeEchartLoading = false;
            }, 1000);
          }
        })
      },
      saleData(sum) {
        salesman(this.tableIndex, this.listQuerys).then(res => {
          if (sum == 10) {
            this.selectSalesSummary = res;
            let saleList = [['product', '出库额', '利润'],];
            for (var key in this.selectSalesSummary.saleOutResultList) {
              saleList.push([this.selectSalesSummary.saleOutResultList[key].time, this.selectSalesSummary.saleOutResultList[key].saleOutAmount, this.selectSalesSummary.saleOutResultList[key].saleOutProfit]);
            }
            this.vocational[1].option.dataset.source = saleList;
            const refNameOne = 'vocationalSale';
            if (this.selectSalesSummary && this.selectSalesSummary.saleOutResultList.length > 0) {
              if (this.$refs[refNameOne]) {
                this.$refs[refNameOne].initChart();
              }
            }
            let dateData = [];
            let incomeData = [];
            for (var key in this.selectSalesSummary.newCustomerResultList) {
              dateData.push(this.selectSalesSummary.newCustomerResultList[key].time);
              incomeData.push(this.selectSalesSummary.newCustomerResultList[key].newCustomerCount);
            }
            this.vocational[2].option.xAxis.data = dateData;
            this.vocational[2].option.series[0].data = incomeData;
            const refNameTwo = 'vocationalParagraph';
            if (this.selectSalesSummary.newCustomerResultList && this.selectSalesSummary.newCustomerResultList.length > 0) {
              if (this.$refs[refNameTwo]) {
                this.$refs[refNameTwo].initChart();
              }
            }
          } else {
            if (sum == 5 || sum == 6) {
              this.selectSalesSummary = res;
              if (sum == 5) {
                let saleList = [['product', '出库额', '利润'],];
                for (var key in this.selectSalesSummary.saleOutResultList) {
                  saleList.push([this.selectSalesSummary.saleOutResultList[key].time, this.selectSalesSummary.saleOutResultList[key].saleOutAmount, this.selectSalesSummary.saleOutResultList[key].saleOutProfit]);
                }
                this.vocational[1].option.dataset.source = saleList;
                const refNameOne = 'vocationalSale';
                if (this.selectSalesSummary.saleOutResultList && this.selectSalesSummary.saleOutResultList.length > 0) {
                  if (this.$refs[refNameOne]) {
                    this.$refs[refNameOne].initChart();
                  }
                }
              }
              if (sum == 6) {
                let dateData = [];
                let incomeData = [];
                for (var key in this.selectSalesSummary.newCustomerResultList) {
                  dateData.push(this.selectSalesSummary.newCustomerResultList[key].time);
                  incomeData.push(this.selectSalesSummary.newCustomerResultList[key].newCustomerCount);
                }
                this.vocational[2].option.xAxis.data = dateData;
                this.vocational[2].option.series[0].data = incomeData;
                const refNameTwo = 'vocationalParagraph';
                if (this.selectSalesSummary.newCustomerResultList.length > 0) {
                  if (this.$refs[refNameTwo]) {
                    this.$refs[refNameTwo].initChart();
                  }
                }
              }
            } else {
              if (sum == 1) {
                this.selectSalesSummary.resultEntity.saleOutMonthAmount = res.resultEntity.saleOutMonthAmount;
              }
              if (sum == 2) {
                this.selectSalesSummary.resultEntity.saleOutMonthProfit = res.resultEntity.saleOutMonthProfit;
              }
              if (sum == 3) {
                this.selectSalesSummary.resultEntity.outYesterdayAmount = res.resultEntity.outYesterdayAmount;
              }
              if (sum == 4) {
                this.selectSalesSummary.resultEntity.outYesterdayProfit = res.resultEntity.outYesterdayProfit;
              }
            }
            setTimeout(() => {
              this.oneLoading = false;
              this.twoLoading = false;
              this.treeLoading = false;
              this.fourLoading = false;
              this.oneEchartLoading = false;
              this.twoEchartLoading = false;
              this.treeEchartLoading = false;
            }, 1000);
          }
        })
      },
      programmeSubmint() {
        this.isProgramme = false;
      },
      programmeClose() {
        this.isProgramme = false;
      },
      insertProgramme() {
        this.isProgramme = true;
      },
      getList() {
        this.loading = true;
        pages(this.listQuery).then(response => {
          this.loading = false;
          var data = response.records;
          var events = [];
          if (data.length > 0) {
            for (var i in data) {
              var currDate = new Date(new Date().toLocaleDateString());
              var endDate = new Date(data[i].endDate.substr(0, 10));
              if (currDate - endDate > 0 && data[i].state == 0) {
                data[i].state = 10;
              }

              var cssClass = data[i].state == 0 ? 'event-weiwancheng' : data[i].state == 1 ? 'event-wancheng' : data[i].state == 10 ? 'event-chaoqi' : undefined;
              events.push({
                id: data[i].id,
                title: data[i].content,
                start: data[i].beginDate.substr(0, 10),
                end: data[i].endDate.substr(0, 10),
                cssClass: cssClass,
                YOUR_DATA: {},
              })
            }
          }
          this.events = events;
        });
      },
      //在新增、修改完成之后刷新数据
      refreshData() {
        this.getList();
      },
      //在切换月份时重新加载数据
      changeMonth(start, end, firstDayOfMonth) {
        var beginDate = start._d;
        var endDate = new Date(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate() + 41);
        this.listQuery.beginDate = beginDate;
        this.listQuery.endDate = endDate;
        this.getList();
      },
      getChildDayClick(day, jsEvent) {
      },
      getChildEventClick(event, jsEvent) {
      },
      scrollLeft() {
        if (!document.getElementById('demo') || !document.getElementById('demoScroll')) {
          clearInterval(this.timer)
          return
        }
        const w1 = document.getElementById('demo').clientWidth
        const w2 = document.getElementById('demoScroll').clientWidth
        if (w2 < w1) {
          return
        }
        const scrollWidth = w2 * -1
        if (this.scrollWidth == scrollWidth) {
          this.scrollWidth = 0
        }
        this.scrollWidth -= 1
        document.getElementById('demoScroll').style.marginLeft = this.scrollWidth + 'px'
      },
      tabTap() {
        this.tableLoading = true
        sthData().then(response => {
          this.list = []
          for (const i in response.records) {
            if (response.records[i].billNo) {
              let key = response.records[i].billNo.replace(/[^a-z]+/ig, '')
              key = 'root_bill_' + key
              response.records[i].billName = this.getBillName(key)
            }
          }
          this.list = response.records
        })
        setTimeout(() => {
          this.tableLoading = false
        }, 100)
      },
      getMyFeatures() {
        getQuickMenu().then(response => {
          const data = response.data
          for (const i in data) {
            const arr = data[i].path.split('/')
            arr.splice(1, 1)
            data[i].path = arr.join('/')
          }
          this.myFeatures = data
        })
        this.messageNotification = []
        page({page:1,limit:1}).then(response => {
          const res = response.records
          const unread = []
          if(res.length > 0) {
            for (const v in res) {
                unread.push(res[v])
           }
            //只显示最新的公告
            this.messageNotification = unread
          }
        })
      },
      getBillName(key) {
        for (const j in this.billOptions) {
          if (key === this.billOptions[j].code) {
            return this.billOptions[j].labelDefault
          }
        }
      },
      addSelectedFeatures(data) {
        if (data.children.length > 0) {
          for (const i in data.children) {
            this.addSelectedFeatures(data.children[i])
          }
        } else {
          if (this.selectedFeatures.length >= 8) {
            this.$message('最多选择八个')
            return false
          }
          if (this.checkIsSelectedFeature(data)) {
            return false
          }
          this.selectedFeatures.push({
            id: data.id,
            title: data.title
          })
        }
      },
      deleteSelectedFeatures(data) {
        if (data.children.length > 0) {
          for (const i in data.children) {
            // eslint-disable-next-line no-var
            var result = this.checkIsSelectedFeature(data.children[i])
            if (result) {
              this.selectedFeatures.splice(result, 1)
            }
          }
        } else {
          var result = this.checkIsSelectedFeature(data)
          if (result) {
            this.selectedFeatures.splice(result, 1)
          }
        }
      },
      handleSelectedFeaturesDel(index) {
        this.selectedFeatures.splice(index, 1)
      },
      handleTreeCheck(data, check, currentNode) {
        if (currentNode) {
          return false
        }
        if (check) {
          this.addSelectedFeatures(data)
        } else {
          this.deleteSelectedFeatures(data)
        }
      },
      handleViewSelects() {
        this.commonVisible = true
        this.tableVisible = false
      },
      handleViewTab() {
        this.commonVisible = false
        this.tableVisible = true
      },
      handleViewSelect() {
        this.dialogVisible = true
        this.selectedFeatures = Object.assign([], this.myFeatures)
      },
      handleSetLineChartData(type) {
        this.lineChartData = lineChartData[type]
      },
      handleFunctionAdd() {
        /* this.myFeatures = Object.assign({}, this.selectedFeatures);*/
        const _this = this
        if (this.selectedFeatures.length < 1) {
          this.dialogVisible = false
          return
        }
        const menuIds = []
        for (const value of this.selectedFeatures) {
          menuIds.push(value.id)
        }
        saveQuickMenu(menuIds).then(response => {
          if (response.code === '2000') {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            })
            _this.dialogVisible = false
            _this.getMyFeatures()
          } else {
            _this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      },
      /**
       * 判断功能是否在选中列表中
       * @param o
       *
       * 在列表中返回下标，不在返回false
       */
      checkIsSelectedFeature(o) {
        const list = this.selectedFeatures
        for (const i in list) {
          if (list[i].id === o.id) {
            return i
          }
        }
        return false
      },

      /**
       * 关闭公告
       */
      closeNotice(){
        if(this.noticeData.status&&this.noticeData.status===1){
          readNote(this.noticeId,this.$store.getters.id).then(res=>{

          },error=>this.$message.error('阅读公告失败!'+error))
        }

      },

      showNotice(){
        getNote().then(res=>{
          if(res.data){
            this.isShowNotice=true
            this.noticeData=res.data
            this.noticeId=res.data.id
          }else{
            this.isShowNotice=false
          }
        },err=>this.$message.error('获取公告失败!'+err))
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

<style lang="scss" rel="stylesheet/scss" scoped>
  .dashboard-editor-container {
    min-width: 1280px;
    background-color: rgb(240, 242, 245);
    .box-card {
      margin-top: 20px;
      height: 150px;
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
  }

  .dashboard-editor-container {
    .dashboard-dialog-box .el-dialog {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      min-height: 100vh !important;
    }
  }

  ul, li {
    list-style: none;
  }

  .iconfont, .iconfont1 {
    font-size: 16px;
    font-style: normal;
  }

  /*首页*/
  .rowsView {
    margin-bottom: 0;

    .el-col {
      margin-bottom: 10px;
    }
  }

  .el-row {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .grid-content {
    .iconfont1 {
      font-size: 36px;
    }
  }

  .bg-green {
    background: #17d57e;
  }

  .bg-yellow {
    background: #fec92b;
  }

  .bg-blue {
    background: #2da3fb;
  }

  .bg-purple {
    background: #c172d8;
  }

  /*分界线*/
  .hrView {
    display: block;
    height: 0;
    overflow: hidden;
    font-size: 0;
    border-width: 1px 0 0 0;
    border-top: 1px solid #DDDDDD;
    margin: 10px 0 20px 0;
  }

  .iconView {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .ViewItem {
      background: #ffffff;
      border: 1px solid #DDDDDD;
      display: flex;
      flex-direction: column;
      position: relative;
      margin-bottom: 16px;

      .analyse {
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #373737;
        position: relative;

        .trea-analyse {
          position: absolute;
          right: 10px;
          top: 0;
          display: flex;
          flex-direction: row;
        }
      }

      .chart {
        margin-top: 10px;
      }

      .amount {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background: #F5F5F5;
        height: 40px;
        border-top: 1px solid #DDDDDD;
        padding: 0 12px;

        span {
          color: #373737;
          display: inline-block;
          height: 40px;
          line-height: 40px;
          margin: 0 14px;
          font-size: 12px;
        }
      }
    }
  }

  /*图表布局*/
  .grid-content {
    height: auto;
    padding: 14px 14px;
    color: #fff;
    cursor: pointer;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    .gridLeft {
      display: flex;
      flex-direction: column;
      height: 62px;
      .gridItem {
        display: flex;
        flex-direction: column;
        h2, h5 {
          font-weight: 400;
          color: #ffffff;
          margin: 0;
        }

        h2 {
          height: 27px;
          margin-bottom: 10px;
        }
      }

      .gridItem:first-child {
        margin-bottom: 10px;
      }
    }
    .LeftOne {
      margin: 18px 0px !important;
      .gridItem {
        h5 {
          margin-top: 8px;
        }
      }
    }
  }

  * {
    font-weight: 400 !important;
  }

  /*图表设置*/
  .el-dropdown {
    color: #606266;
    font-size: 18px;
    margin-left: 12px;
    margin-right: 2px;
    margin-top: 1px;
  }

  /*消息提示*/
  .qimo8 {
    overflow: hidden;
    min-width: 1400px;
  }

  .qimo8 .qimo {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .qimo8 .qimo ul {
    height: 30px;
    overflow: hidden;
    padding: 0;
    margin: 0;
    zoom: 1;
    white-space: nowrap;
  }

  .qimo8 .qimo ul li {
    line-height: 30px;
    list-style: none;
    display: inline-block;
    flex-direction: row;
    align-items: center;
    margin-right: 6px;

    a {
      margin-right: 10px;
      color: #444444;
      font-size: 14px;
    }
  }

  .xiaox-icons {
    width: 18px;
    height: 18px;
    color: #fec92b;
    margin-top: -2px;
    margin-right: 4px;
  }

  .el-icon-refresh {
    line-height: 40px;
    font-size: 18px;
  }

  .fristView {
    margin-top: 0 !important;
  }

  .heard-refresh {
    line-height: 22px !important;
    z-index: 999;
  }

  /*待办事项以及常用功能*/
  .commonView, .doView {
    position: fixed;
    top: 14%;
    right: -420px;
    width: 460px;
    height: 300px;
    display: flex;
    flex-direction: row;
    z-index: 1990;
    color: #ffffff;
    transition: all .6s;
    box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.06);
  }

  .commonView:hover, .doView:hover {
    right: 0;
    transition: all .6s;
  }

  .commonView {
    top: calc(14% + 340px) !important;
  }

  .commonLeft, .doLeft {
    width: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #2da3fb;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;

    span {
      margin-bottom: 8px;
      font-size: 14px;
    }
  }

  .doLeft {
    background: #D87A80 !important;
  }

  .common-icon {
    font-size: 20px;
    color: #ffffff;
  }

  .commonRight, .doRight {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 420px;
    background: #ffffff;
  }

  .aside-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 33%;

    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .aside-icon {
        font-size: 28px;
        margin-bottom: 6px;
        color: #2da3fb;
      }

      span {
        font-size: 14px;
        color: #2da3fb;
      }
    }
  }

  .mainView {
    position: relative;
    padding-right: 50px;
    padding-top: 0;
  }

  .tableView {
    width: 100%;
    display: flex;
    flex-direction: column;

    .table-title {
      padding: 0 10px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #EBEEF5;
      border-bottom: none;
      color: #D87A80;
      height: 40px;

      .title-table {
        display: flex;
        flex-direction: row;
        align-items: center;
        color: #D87A80;

        span {
          font-size: 12px;
        }

        i {
          margin-right: 6px;
          color: #D87A80;
        }
      }
    }
  }

  .title-icon {
    position: absolute;
    top: 1rem;
    right: 1.2rem;
    width: 3.8rem !important;
    height: 3.8rem !important;
    z-index: 9;
  }

  .el-button--text {
    color: #D87A80;
  }

  .btn {
    border: 0 !important;
    margin: 0;
    padding: 0;
    background: none;
    width: 100%;
    height: 24px;
    line-height: 24px;
    width: 50px;
  }

  .available {
    width: 100%;
    height: 352px;
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

  .iconView .ViewItem .chart {
    margin-top: 0px;
  }

  .new-list {
    width: 100%;
    min-width: 1200px;
    line-height: 60px;
    list-style: none;
    padding-left: 0;
  }

  .new-list li {
    float: left;
    margin-right: 6px;
  }

  .winBox {
    width: 1200px;
    height: 40px;
    overflow: hidden;
    position: relative;
    background: pink;
  }

  .scroll {
    width: 1200px;
    position: absolute;
    left: 0px;
    top: 0px;
    height: 40px;
    line-height: 40px;
  }

  .scroll li {
    width: 150px;
    float: left;
    line-height: 40px;
    text-align: center;
  }

  li {
    list-style: none;
  }

  a {
    text-decoration: none;
  }

</style>
<style lang="scss" rel="stylesheet/scss" scoped>
  .operating {
    background: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    padding: 23px;
    h4 {
      margin: 0px !important;
    }
    .operating_view {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      padding: 21px;
      .operating-btn {
        width: 100px;
        height: 110px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(238, 238, 238, 1);
        border-radius: 8px;
        margin-right: 28px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #666666;
        font-size: 14px;
        a {
          display: inline-block;
          width: 60px;
          text-align: center;
          line-height: 18px;
          margin-top: 8px;
        }
      }
      .operating-btn:hover {
        color: #188AE2;
        box-shadow: 0px 1px 30px 2px rgba(206, 206, 206, 0.35);
      }
      .statistics-btn {
        min-width: 110px;
        height: 110px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #666666;
        font-size: 14px;
        margin-right: 28px;
        position: relative;
        .hot {
          position: absolute;
          bottom: 30px;
          right: 2px;
          line-height: 20px;
          text-align: center;
          padding: 2px 4px;
          width: auto;

          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          border-radius: 14px;
          background: #F54D4D;
          color: white;
          p {
            margin: 0px;
            line-height: 14px;
          }
        }
        a {
          margin-top: 8px;
          line-height: 14px;
        }
        .order_item {
          display: inline-block;
          text-align: center;
          width: 56px;
          line-height: 18px;
          height: 30px;
        }
        .sum {
          color: #1890FF;
        }
      }
    }
  }
  .programme {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    padding: 21px;
    .programme_title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      h4 {
        margin: 0px;
      }
    }
  }
  .programme_conent {
    display: flex;
    flex-direction: row;
   justify-content: flex-start;
    align-items: center;
  }
  .is-selected {
    color: #1989FA;
  }
  .el-calendar-day {
    padding: 12px 20px 20px;
    text-align: center;
    height: 32px !important;
    span {
      font-size: 12px;
      height: auto;

    }
  }
  .day-cell {
    min-height: 34px !important;
    height: 34px !important;
    font-size: 12px;
  }
  .day-number {
    text-align: center;
  }
</style>
