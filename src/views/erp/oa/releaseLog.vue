<template>
  <div class="releaseLog">
    <el-radio @change="handleLogChange" v-model="isLatest" label="1">最新发版日志</el-radio>
    <el-radio @change="handleLogChange" v-model="isLatest" label="2">历史发版日志</el-radio>
    <!-- 最新发版日志 -->
    <div class="info" v-if="isLatest == '1'">
      
      <div class="title">{{newLogContent.title}}</div>
      <div class="content">
        <div>详情如下：</div>
        <div class="contentHtml" v-html="newLogContent.content"></div>
      </div>
      <div class="lastEdit">
        <i class="el-icon-edit-outline"></i>
        最后编辑：
        {{newLogContent.crtUserName}}
        于
        {{newLogContent.crtTime}}
      </div>
    </div>
    <!-- 历史发版日志 -->
    <div class="info" v-else>
      
      <div v-for="(item,index) in historyLogList" :key="index">
        <div class="title historyTitle">
          <div>
            {{item.title}}
          </div>
          <div class="operate">
            <div :id="'fold' + index" @click="toggleContent(index,'fold')">
              详情 + 
            </div>
            <div class="unfold" :id="'unfold' + index" v-show="selectedIndex == index" @click="toggleContent(index,'unfold')">
              收起 -
            </div>
          </div>
        </div>
        <div class="content" :id="'content' + index" v-show="
        selectedIndex == index">
          <div class="contentHtml" v-html="item.content"></div>
        </div>
      </div>
      <div class="lastEdit">
        <i class="el-icon-edit-outline"></i>
        最后编辑：
        {{historyLogList[0].crtUserName}}
        于
        {{historyLogList[0].crtTime}}
      </div>
    </div>
  </div>
</template>

<script>
import { page, selectNewLog } from "@/api/erp/oa/oaIssueLog";
export default {
  name: "releaseLog",
  data() {
    return {
      isLatest: "1",
      newLogContent: {},
      historyLogList: [],
      selectedIndex:"-1",
      isUnfold:false
    };
  },
  created() {
    this.getNewLog();
    this.getHistoryLog()
  },
  methods: {
    //  新增发版日志
    getNewLog() {
      selectNewLog().then(res => {
        this.newLogContent = res;
      });
    },
    //  切换发版日志
    handleLogChange() {
      if (this.isLatest == "1") {
        this.getNewLog();
      } else {
        this.getHistoryLog();
      }
    },
    //  历史发版日志
    getHistoryLog() {
      page().then(res => {
        this.historyLogList = res.records;
        this.historyLogList.splice(5)
      });
    },
    toggleContent(index,isFold) {
      // 点击详情时所有本元素详情变成收起，其他所有权变为详情

      if(isFold == 'fold') {
        document.getElementById('fold' + index).setAttribute('style','display:none');
        if(this.selectedIndex !== '-1') {
          document.getElementById('fold' + this.selectedIndex).setAttribute('style','display:block');
        }
        document.getElementById('unfold' + index).setAttribute('style','display:block');
        this.selectedIndex = index;
      } else {
        document.getElementById('fold' + index).setAttribute('style','display:block');
        document.getElementById('unfold' + index).setAttribute('style','display:none');
        this.selectedIndex = '-1'
      }
    }
  }
};
</script>

<style lang='scss'>
.releaseLog {
  width: 600px;
  overflow: auto;
  margin: 0 auto;
  margin-top: 60px;
  .el-radio__inner {
    display: none;
  }
  .info {
    margin-top: 50px;
    .title {
      margin-top: 30px;
      margin-bottom: 30px;
    }
    .historyTitle {
      display: flex;
      justify-content: space-between;
      .operate {
        color: #0079FE;
        div {
          cursor: pointer;
        }
        .unfold {
          position: relative;
          right: 4px;
        }
      }
    }
    .contentHtml {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>