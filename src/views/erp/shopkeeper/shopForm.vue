<template>
    <div class="contain">
      <div class="top-title">
        <span style="font-weight: bolder;font-size: 32px">{{shopData.storeName}}</span>
        <span style="font-size: 16px">(推荐码：{{shopData.recommend}})</span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="1">
          <div style="width: 1200px;margin: 0 auto;padding-top: 30px;">
            <el-form ref="form" :model="shopData" label-width="120px" disabled size="medium">
              <h2>基本信息</h2>
              <el-row :gutter="50">
                <el-col :span="16">
                  <el-row :gutter="50">
                    <el-col :span="12">
                      <el-form-item label="店铺名称：">
                        <el-input v-model="shopData.storeName"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="联系人：">
                        <el-input v-model="shopData.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="50">
                    <el-col :span="12">
                      <el-form-item label="联系人电话：">
                        <el-input v-model="shopData.phone"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="店铺类型：">
                        <el-input :value="shopType[shopData.type]"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="店铺logo：">
                    <el-image :src="shopData.logo" style="height: 66px" fit="contain"></el-image>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="8">
                  <el-form-item label="店铺等级：">
                    <el-input v-model="shopData.shopLevel"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="企业抬头：">
                    <el-input v-model="shopData.businessRise"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="开店日期：">
                    <el-input v-model="shopData.crtTime"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="8">
                  <el-form-item label="店主微信：">
                    <el-input v-model="shopData.wechat"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="店主来源：">
                    <el-input :value="shopSource[shopData.source]"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="推荐人：">
                    <el-input v-model="shopData.recommend"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="50">
                <el-col :span="24">
                  <el-form-item label="备注：">
                    <el-input v-model="shopData.note" type="textarea"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <h2>账号信息</h2>
              <el-row :gutter="50">
                <el-col :span="8">
                  <el-form-item label="账号：">
                    <el-input v-model="shopData.username"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="昵称：">
                    <el-input v-model="shopData.nickName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="注册日期：">
                    <el-input v-model="shopData.registerTime"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <h2>认证材料</h2>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="账户信息" name="2">
          <h2>账户余额：{{balance.availableAmount}}</h2>
          <el-button @click="showAccountMsg('account')">账户信息</el-button>
          <el-button v-if="shopType[shopData.type]==='企业'" @click="showAccountMsg('invoice')">开票信息</el-button>
          <h2>本期营业</h2>
          <div style="display: flex;justify-content: flex-start">
            <div class="turnover-item">
              <h3>本期销售额</h3>
              <h4>¥{{turnover.orderTotalAmount}}</h4>
              <h3>有效销售额</h3>
              <h4>¥{{turnover.todayTurnover}}</h4>
            </div>
            <div class="turnover-item">
              <h3>全部单数</h3>
              <h4>{{turnover.orderCount}}</h4>
              <h3>有效单数</h3>
              <h4>{{turnover.payedOrderCount}}</h4>
            </div>
            <div class="turnover-item">
              <h3>全部佣金</h3>
              <h4>¥{{turnover.commission}}</h4>
              <h3>有效佣金</h3>
              <h4>¥{{turnover.effectiveCommission}}</h4>
            </div>
          </div>
          <el-tabs v-model="moneyHistory" @tab-click="handleMoneyClick">
            <el-tab-pane label="近三个月的收支明细" name="0"></el-tab-pane>
            <el-tab-pane label="历史收支记录" name="1"></el-tab-pane>
          </el-tabs>
          <!-- 查询结果 -->
          <el-table size="small" :data="historyData" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
                    highlight-current-row :height="600">
            <el-table-column type="index" label="序号" align="center"></el-table-column>
            <el-table-column label="时间" prop="tradeDate"></el-table-column>
            <el-table-column align="right" label="金额" prop="amount"></el-table-column>
            <el-table-column label="操作" prop="tradeType" v-slot="{row}">
              <span>{{tradeType[row.tradeType]}}</span>
            </el-table-column>
<!--            <el-table-column align="center" label="操作人" prop="userName"></el-table-column>-->
            <el-table-column label="备注" prop="note"></el-table-column>
          </el-table>

          <div class="pagination-container" style="margin-top: 10px;">
            <el-pagination background @size-change="handleHistorySizeChange" @current-change="handleHistoryCurrentChange"
                           :current-page="historyListQuery.page"
                           :page-sizes="[10,20,30,50]" :page-size="historyListQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="historyTotal">
            </el-pagination>
          </div>


        </el-tab-pane>
<!--        <el-tab-pane label="店铺商品" name="3">-->

<!--        </el-tab-pane>-->
        <el-tab-pane label="团队店铺" name="4">
          <team-shop v-if="activeName==='4'" :id="id"></team-shop>
        </el-tab-pane>
        <el-tab-pane label="店铺会员" name="5">
          <shop-member v-if="activeName==='5'" :id="id"></shop-member>
        </el-tab-pane>
        <el-tab-pane label="店铺优惠" name="6">
          <shop-coupon v-if="activeName==='6'" :id="id"></shop-coupon>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="7">
          <shop-log v-if="activeName==='7'" :id="id"></shop-log>
        </el-tab-pane>
      </el-tabs>

<!--      账户信息-->
      <el-dialog modal-append-to-body append-to-body title="账户信息" :visible.sync="isShowAccount" v-if="isShowAccount" width="30%" top="20vh">
        <el-form ref="accountMsg" :model="accountMsg" label-width="120px" label-position="right">
          <el-form-item label="开户银行：">
            <el-input v-model="accountMsg.khBank" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="银行户名：">
            <el-input v-model="accountMsg.userName" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="银行账号：">
            <el-input v-model="accountMsg.khAccount" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input v-model="accountMsg.note" placeholder="placeholder" style="width: 300px" :rows="3" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>

<!--      开票信息-->
      <el-dialog modal-append-to-body append-to-body title="账户信息" :visible.sync="isShowInvoice" v-if="isShowInvoice" width="30%" top="20vh">
        <el-form ref="accountMsg" :model="accountMsg" label-width="120px" label-position="right">
          <el-form-item label="名称：">
            <el-input v-model="accountMsg.spPerson" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="税号：">
            <el-input v-model="accountMsg.khParagraph" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="单位地址：">
            <el-input v-model="accountMsg.kpSite" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="电话号码：">
            <el-input v-model="accountMsg.spPhnoe" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
          <el-form-item label="开户银行：">
            <el-input v-model="accountMsg.khBank" placeholder="placeholder" style="width: 300px"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog>




    </div>
</template>

<script>
  import {selectDetailById,turnoverAnalysisByShopId} from '@/api/erp/shopkeeper/shopList';
  import {queryCapitalAccount,selectInvoice,queryTransactionFlow} from '@/api/erp/member/memberList';
  import { shopAuditStatus,shopType,shopSource } from './common/common'
  import {tradeType} from '../../../dic'
  import teamShop from './teamShop'
  import shopMember from './shopMember'
  import shopLog from './shopLog'
  import shopCoupon from './shopCoupon'
  export default {
    name: 'shopForm',
    data(){
      return{
        activeName:'1',
        shopType,
        shopSource,
        shopAuditStatus,
        tradeType,
        shopData:{},
        moneyHistory:'0',
        historyData:[],
        id:'',
        balance:{},
        accountMsg:{},
        isShowAccount:false,
        isShowInvoice:false,
        listLoading:false,
        historyListQuery:{
          page:1,
          limit:10
        },
        historyTotal:0,
        turnover:{}
      }
    },
    created() {
      console.log(this.$route.query.id,'id')
      this.getBasicDetail()
      this.id=this.$route.query.id
    },
    components:{
      teamShop,
      shopMember,
      shopLog,
      shopCoupon
    },
    watch:{
      '$route':function() {
        this.id=this.$route.query.id
        this.getBasicDetail()
        this.activeName='1'
      }
    },
    methods:{
      //获取基本信息
      getBasicDetail(){
        selectDetailById(this.$route.query.id).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.shopData=res.data
          }
        })
      },

      //获取历史收支和近三个月收支
      getMoneyHistory(){
        this.historyListQuery.timeType=this.moneyHistory
        this.historyListQuery.id=this.id
        queryTransactionFlow(this.historyListQuery).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.historyData=res.data.records
            this.historyTotal=res.data.total
          }
        })
      },

      //主Tab点击
      handleClick(e){
        if(e.name==='1'){

        }else if(e.name==='2'){
          this.getBalance()
          this.getMoneyHistory()
          this.getTurnover()
        }
      },

      //账户信息Tab点击
      handleMoneyClick(){
        this.getMoneyHistory()
      },

      //获取账户余额
      getBalance(){
        queryCapitalAccount(this.id).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.balance=res.data
          }
        })
      },

      //获取开票信息和银行信息
      showAccountMsg(flag){
        selectInvoice(this.id).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.accountMsg=res.data
            if(flag==='account'){
              this.isShowAccount=true
            }else{
              this.isShowInvoice=true
            }
          }
        })
      },

      //获取本期营业
      getTurnover(){
        turnoverAnalysisByShopId(this.id).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.turnover=res.data

          }
        })
      },

      handleHistorySizeChange(val) {
        this.historyListQuery.limit = val;
        this.getMoneyHistory()
      },
      handleHistoryCurrentChange(val) {
        this.historyListQuery.page = val;
        this.getMoneyHistory();
      },
    }
  }
</script>

<style scoped>
  .contain{
    padding: 30px ;
  }
.contain .top-title{
  text-align: center;
}
  .turnover-item{
    width: 260px;
    height: 130px;
    background-color: rgb(99,199,255);
    border-radius: 10px;
    text-align: center;
    color: white;
    padding-top: 1px;
    margin-right: 15px;
  }
  .turnover-item h3{
    font-weight: normal;
    margin-bottom: 0;
    font-size: 16px;
  }
  .turnover-item h4{
    margin-top: 2px;
  }
</style>
