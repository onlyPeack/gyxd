<template>
  <div class="personal-all">
    <div class="personal-left">
      <div class="personal-details-item">
        <div class="personal-details-img">
        </div>
        <div class="personal-details-content">
          <el-row>
            <el-col :span="24">
              <span>哈哈哈</span>
            </el-col>
            <el-col :span="10">
              <span class="content-list">职务：</span>
            </el-col>
            <el-col :span="10">
              <span class="content-list">电话：</span>
            </el-col>
            <el-col :span="10">
              <span class="content-list">工作邮箱：</span>
            </el-col>
            <el-col :span="10">
              <span class="content-list">工作手机：</span>
            </el-col>
          </el-row>
        </div>
        <div class="personal-button">
          <el-button type="primary" size="medium">私信</el-button>
        </div>
      </div>
      <div class="personal-news-title">
        <span>个人动态</span>
      </div>
      <div class="personal-news-item" v-for="o in 6" :key="o">
        <el-card>
          <div slot="header">
            <div class="header-img"></div>
            <div class="header-title">
              <span>哈哈哈</span>
              <span>2019-03-20 15:35</span>
            </div>
            <span style="float: right; padding: 3px 0">类型</span>
          </div>
          <div style="padding: 15px; font-size: 16px">
            <span>内容内容内容</span>
            <div class="card-bottom">
              <span>发送至：接收者</span><br>
              <span>某某某【某状态】某某某的日志</span>
              <span>更改时间</span>
              <div class="card-function">
                <el-button type="text" icon="el-icon-edit">编辑</el-button>
                <el-button type="text"><i class="iconfont icon--pingfen"></i>评分</el-button>
                <el-button type="text"><i class="iconfont icon-shanchu3"></i>删除</el-button>
                <el-button type="text" @click="handleReplyShow"><i class="iconfont icon-icon_huifu-xian"></i>回复
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="personal-right">
      <div class="type-title">
            <span>
              <i class="iconfont icon-chakantiezihuifu"></i>消息
            </span>
      </div>
      <div class="right-main">
        <div class="right-content">
          <div class="header-item">
            <div class="header-img"></div>
            <div class="header-title">
              <span>哈哈哈</span>
              <span>2019-03-20 15:35</span>
              <span>发起</span>
            </div>
          </div>
          <div class="header-cont">
            内容内容内容
          </div>
        </div>

      </div>
      <div class="right-footer" v-if="!replyVisible">
        <span class="one">
          <el-button type="primary"><i class="iconfont icon-shanchu3"></i>删除</el-button>
        </span>
        <span class="two">
          <el-button type="primary" @click="handleReplyShow"><i class="iconfont icon-icon_huifu-xian"></i>回复
          </el-button>
        </span>
      </div>
      <div class="right-footer" v-if="replyVisible">
        <el-input type="textarea" :autosize="{ minRows: 2}"
                  style="width: 100%; margin-bottom: 10px" v-model="replyContent">
        </el-input>
        <span class="one">
          <el-button type="text"><i class="iconfont icon-fujian2"></i>附件</el-button>
          <el-button type="text"><i class="iconfont icon-aite"></i>抄送</el-button>
        </span>
        <span class="two">
          <el-button @click="handleReplyCancel">取消</el-button>
          <el-button type="primary">发送</el-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "personalDynamicsDialog",
    data() {
      return {
        replyContent: '',
        replyVisible: false
      }
    },
    methods: {
      handleReplyShow() {
        this.replyVisible = true;
      },
      handleReplyCancel() {
        this.replyVisible = false;
      }
    }
  }
</script>

<style scoped lang="scss">
  .personal-all {
    width: 100%;
    border-bottom: #cccccc solid 1px;

    .header-img {
      width: 48px;
      height: 48px;
      float: left;
      border-radius: 3px;
      overflow: hidden;
      background-color: #409EFF;
    }

    .header-title {
      float: left;
      padding-left: 20px;
      padding-top: 15px;
      font-size: 16px;

      span {
        margin-right: 5px;
      }

    }

    .personal-left {
      float: left;
      width: 50%;
      height: 90vh;
      border-right: #cccccc solid 1px;
      overflow: auto;

      .personal-details-item {
        position: relative;
        padding: 15px;
        height: 100px;
        margin-right: 25px;

        .personal-details-img {
          width: 48px;
          height: 48px;
          position: absolute;
          border-radius: 3px;
          overflow: hidden;
          background-color: #409EFF;
        }

        .personal-details-content {
          position: relative;
          left: 65px;
          top: 0px;
          right: 0;
          width: 92%;
          float: left;
          font-size: 16px;
          color: #409EFF;

          .content-list {
            font-size: 14px;
            color: #888888;
          }

          .el-col {
            height: 25px;
            line-height: 25px;
          }

        }

        .personal-button {
          float: right;
          position: relative;
          top: -50px;
          right: -20px;
          background-color: #c8c9cc;
        }

      }

      .personal-news-title {
        padding-bottom: 10px;
        border-bottom: 1px solid #cccccc;

        span {
          padding-left: 15px;
          font-size: 16px;
        }

      }

      .personal-news-item {
        position: relative;
        padding-top: 15px;
        padding-right: 10px;

        .el-card {

          .el-card__body {

            .card-bottom {
              color: #999;
              margin-top: 10px;
              font-size: 12px;

              span {
                height: 24px;
                line-height: 24px;
                margin-top: 10px;
              }

              .card-function {
                float: right;
                font-size: 14px;

                .el-button {
                  color: #999;
                  .iconfont {
                    margin-right: 5px;
                    position: relative;
                    top: 2px;
                  }
                }
                .el-button:hover {
                  color: #4A9DE9;
                }

              }
            }
          }
        }
      }
    }

    .personal-right {
      width: 50%;
      height: 90vh;
      float: left;
      position: relative;

      .type-title {
        width: 100%;
        padding: 20px 30px 0px 30px;

        span {
          display: block;
          font-size: 16px;

          .iconfont {
            color: #409EFF;
            margin-right: 5px;
            font-weight: bold;
            font-size: 18px;
          }

        }
      }

      .right-content {
        width: 100%;
        height: 100%;
        padding: 20px 0px 0px 30px;

        .header-item {
          height: 60px;
        }

        .header-cont {
          width: 100%;
          font-size: 16px;
          padding: 20px 0px 15px 0px;
          border-bottom: #cccccc solid 1px;
        }

      }

      .right-footer {
        width: 100%;
        position: absolute;
        bottom: 5px;
        font-size: 14px;
        padding: 0px 20px;
        padding-top: 15px;
        border-top: #cccccc solid 1px;

        .el-button {
          .iconfont {
            margin-right: 5px;
            position: relative;
            top: 2px;
          }
        }

        .one {
          float: left;
        }

        .two {
          float: right;
        }
      }
    }
  }
</style>
