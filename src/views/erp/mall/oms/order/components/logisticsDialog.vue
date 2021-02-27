<template>
  <!-- 手机号获取验证码 -->
  <div :class="isTracking?'dialog isDialog':'dialog'">
    <div class="dialog_bg"></div>
    <div class="dialog_tracking">
      <div class="tracking">
        <div class="tracking_hr"></div>
        <span>物流跟踪</span>
        <a @click="rest">×</a>
      </div>
      <div class="follow" v-if="itemData">
        <div>运单编号：<font class="c333">{{itemData.orderSubList[0].deliverySn}}</font></div>
        <div>物流快递：<font class="c333">{{itemData.orderSubList[0].deliveryCompany}}</font></div>
        <div>收货人：<font class="c333">{{itemData.receiverName}}</font></div>
        <div>收货电话：<font class="c333">{{itemData.receiverPhone}}</font></div>
        <div>收货地址：<font class="c333">{{itemData.receiverAddress}}</font></div>
        <!-- <div>收货地址：<font class="c333">{{itemData.receiverProvince+''+itemData.receiverCity+''+itemData.receiverRegion+''+itemData.receiverDetailAddress}}</font></div> -->
      </div>
      <div class="trackings">
        <ul class="tracks" v-if="logisticsData">
          <li v-for="(item,index) in logisticsData" :key="index">
            <div class="tracks_data">{{item.acceptTime}}</div>
            <div class="tracks_text">
              <!-- <span v-if="item.opcode == 'GOT'">已揽收</span>
              <span v-if="item.opcode == 'DEPARTURE'">运输中</span>
              <span v-if="item.opcode == 'ARRIVAL'">运输中</span>
              <span v-if="item.opcode == 'SIGNED'">已签收</span> -->
              <span>{{item.remark}}</span>
            </div>
            <!-- <div class="tracks_icon">
              <i class="node-icon">
                <i :class="item.status===1?'transport':item.status===2?'delivered':item.status===3?'signed':'trans'"></i>
              </i>
            </div>
            <div class="tracks_text">
              <span class="tracks_title">{{item.status===3?'已签收':item.status===2?'派送中':item.status===1?'运输中':''}}</span>
              <span>{{item.AcceptStation}}</span>
            </div> -->
          </li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "tracking",
    props:['isTracking','logisticsData','itemData'],
    data() {
      return {
      }
    },
    methods:{
      rest(){
        this.$emit('closeTracking');
      }
    },
    created(){

    },
    mounted() {
    },
    watch:{
      logisticsData(val){
        if(val.Traces){
          val.Traces =val.Traces.reverse();
          for(let i in val.Traces){
            if(val.State== "3"){
              val.Traces[0].status = 3;
              val.Traces[1].status = 2;
              val.Traces[2].status = 1;
            }
            if(val.State== "2"&&(val.Traces[i].AcceptStation.indexOf('派件')>-1||val.Traces[0].AcceptStation.indexOf('派送')>-1)){
              val.Traces[0].status = 2;
              val.Traces[1].status = 1;
            }
            if(val.State== "2"&&(!val.Traces[0].AcceptStation.indexOf('派件')>-1||!val.Traces[0].AcceptStation.indexOf('派送')>-1)){
              val.Traces[0].status = 1;
            }
          }
        }
      }
    },
    computed:{
    }
  }
</script>

<style lang="scss" scoped>
  .c333{
    color:#333333;
  }
  input::-webkit-input-placeholder {
    font-size: 12px;
    color: #C0C4CC;
  }
  .isDialog {
    visibility: visible !important;
  }

  .isDialog .dialog_tracking {
    transform: scale(1) !important;
  }
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 9999;
    visibility: hidden;
    .dialog_bg {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #000;
      opacity: 0.3;
      z-index: 1200;
    }
    .dialog_tracking {
      position: absolute;
      background: #ffffff;
      z-index: 1200;
      width: 900px;
      height: 815px;
      top: 90px;
      left: calc(50% - 450px);
      display: flex;
      flex-direction: column;
      box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
      transform: scale(0);
      transition: all .3s;
      .tracking {
        height: 65px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;
        font-size: 14px;
        color: #333333;
        position: relative;
        font-weight:bold;
        .tracking_hr {
          position: absolute;
          left: 0px;
          top: 0;
          width: 900px;
          height: 4px;
          background: rgba(244, 159, 48, 1);
        }
        a {
          font-size: 20px;
        }
        span:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
      .follow{
        margin: 0 auto;
        width:820px;
        height:160px;
        border:1px solid #E5E5E5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
        div{
          line-height: 26px;
          margin-left: 32px;
        }
      }
      .trackings{
        height:540px;
        margin: 35px auto;
        overflow: auto;
      }
      .tracks{
        width:820px;
        height:auto;
        display: flex;
        flex-direction: column;

        li{
          display: flex;
          flex-direction: row;
          font-size: 12px;
          line-height: 32px;
          .tracks_data{
            width: 150px;
            height: 22px;
            margin-right: 41px;
            text-align: right;
            padding: 14px 0 0;
          }
          .tracks_icon{
            padding: 26px 0 0;
            width: 22px;
            margin-right: 3px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            position: relative;
            .node-icon{
              position: absolute;
              top: 25px;
              width: 22px;
              height: 100%;
              background: url('http://hejigy.com.cn/line.png') 0 #fff repeat-y;
              i.trans{
                display: inline-block;
                vertical-align: top;
                width: 13px;
                height: 13px;
                margin-left: 4px;
                background: url('http://hejigy.com.cn/yuan.png')  0 no-repeat ;
                background-size: 100%;
                overflow: hidden;
              }
              i.transport{
                display: inline-block;
                vertical-align: top;
                width: 24px;
                height: 24px;
                margin-left: -1px;
                background: url('http://hejigy.com.cn/transit.png')  0 no-repeat ;
                background-size: 100%;
                overflow: hidden;
                margin-top:-12px;
              }
              i.delivered{
                display: inline-block;
                vertical-align: top;
                width: 24px;
                height: 24px;
                margin-left: -1px;
                background: url('http://hejigy.com.cn/dispatch.png')  0 no-repeat ;
                background-size: 100%;
                overflow: hidden;
                margin-top:-12px;
              }
              i.signed{
                display: inline-block;
                vertical-align: top;
                width: 24px;
                height: 24px;
                margin-left: -1px;
                background: url('http://hejigy.com.cn/yes.png')  0 no-repeat ;
                background-size: 100%;
                overflow: hidden;
                margin-top:-12px;
              }
            }
          }
          .tracks_text{
            padding: 14px 0 0 14px;
            display: flex;
            flex-direction: column;
            .tracks_title{
              font-size: 14px;
              font-weight:bold;
              line-height: 10px;
            }
            width: 474px;
            text-align: left;
            color:#333333;
          }
        }
        li:first-child{
          padding:0px;
        }
        li:last-child{
          padding:0px;
          .tracks_icon{
            .node-icon{
              height: 5px;
            }
          }
        }
      }
    }
  }
</style>
