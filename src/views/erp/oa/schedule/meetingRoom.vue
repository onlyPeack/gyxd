<template>
  <div class="conference-room-advance">
    <div class="header">
      <div class="hander-left">

      </div>
      <div class="header-center">
        <span class="prev-date" @click.stop="goPrev"><svg-icon icon-class="left"></svg-icon></span>
        <span class="title">
          <el-date-picker :clearable="false" style="width: 180px;" v-model="date" type="date" prefix-icon="none"
                          placeholder="日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                          @change="handleFilter"></el-date-picker>
        </span>
        <span class="next-date" @click.stop="goNext"><svg-icon icon-class="right"></svg-icon></span>
      </div>
      <div class="hander-right">
        <el-select placeholder="会议室名称" style="width: 200px" class="filter-item" v-model="listQuery.name">
          <el-option v-for="item in meetingRoomOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询</el-button>
        <el-button type="success" icon="el-icon-plus" @click="handleFormOpen(false)" style="margin-right: 10px;">新建
        </el-button>
      </div>
    </div>

    <!-- 显示时刻 -->
    <div class="full-time-body">
      <div class="times">
        <div class="time" v-for="item in times" :key="item.time">
          <div class="event-time">
            {{item.time}}
          </div>
          <div class="event-content">
            <p v-if="item.event && item.event.length>0" v-for="(e,eIdx) in item.event"
               :key="item.event[item.event.length-1-eIdx].id"
               @click="handleFormOpen(item.event[item.event.length-1-eIdx].id)"
               :class="item.event[item.event.length-1-eIdx].cssClass?item.event[item.event.length-1-eIdx].cssClass:''"
               :title="item.event[item.event.length-1-eIdx].content"
               :style="{width:item.event[item.event.length-1-eIdx].width}">

              {{item.event[item.event.length-1-eIdx].cssClass=='is-start' ||
              item.event[item.event.length-1-eIdx].cssClass=='is-start is-end'
              ?item.event[item.event.length-1-eIdx].content:''}}
            </p>
          </div>
        </div>
      </div>
    </div>

    <meetingRoomForm :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                     @submitFormSuccess="submitFormSuccess" @handleFormClose="handleFormClose">
    </meetingRoomForm>
  </div>
</template>

<script>
  import {page, addObj, getObj, putObj, delObj} from '@/api/erp/oa/meetingRoom';

  export default {
    name: "meetingRoom",
    components: {
      'meetingRoomForm': () => import('../components/meetingRoomForm')
    },
    data() {
      return {
        listQuery: {
          name: 1,
          beginDate: undefined,
          endDate: undefined
        },
        date: undefined,
        times: [],
        dialogFormVisible: false,
        id: undefined,
        meetingRoomOptions: [
          {
            value: 1,
            label: '会议室1',
          },
          {
            value: 2,
            label: '会议室2',
          },
          {
            value: 3,
            label: '会议室3',
          }
        ],
        list: []
      }
    },
    created() {
      this.date = this.formatDate('yyyy-MM-dd', new Date());
      this.init();
      this.getList();
    },
    methods: {
      init() {
        this.times = [
          {time: '01:00', event: []},
          {time: '02:00', event: []},
          {time: '03:00', event: []},
          {time: '04:00', event: []},
          {time: '05:00', event: []},
          {time: '06:00', event: []},
          {time: '07:00', event: []},
          {time: '08:00', event: []},
          {time: '09:00', event: []},
          {time: '10:00', event: []},
          {time: '11:00', event: []},
          {time: '12:00', event: []},
          {time: '13:00', event: []},
          {time: '14:00', event: []},
          {time: '15:00', event: []},
          {time: '16:00', event: []},
          {time: '17:00', event: []},
          {time: '18:00', event: []},
          {time: '19:00', event: []},
          {time: '20:00', event: []},
          {time: '21:00', event: []},
          {time: '22:00', event: []},
          {time: '23:00', event: []},
          {time: '24:00', event: []}
        ];
      },
      handleFilter() {
        this.getList();
      },
      getList() {
        this.listQuery.beginDate = this.date + ' 00:00:00';
        this.listQuery.endDate = this.date + ' 23:59:59';

        page(this.listQuery).then(response => {
          this.list = response.records;
          this.init();

          if (response.records.length > 0) {
            for (var i in response.records) {
              this.slotEvents(response.records[i], this.times);
            }
          }

        });
      },
      slotEvents(item, times) {
        var beginDate = item.beginDate.substr(0, 10);
        var endDate = item.endDate.substr(0, 10);
        //通过分钟计算百分比
        var beginWidth = parseInt((60 - item.beginDate.substr(14, 2) * 1) / 60 * 100);
        var endWidth = parseInt(item.endDate.substr(14, 2) * 1 / 60 * 100);
        beginWidth = beginWidth == 0 ? 100 : beginWidth;
        endWidth = endWidth == 0 ? 100 : endWidth;

        var currDate = this.date;
        var startHour;
        var endHour;

        //开始日期或结束日期是否为同一天
        if (beginDate != endDate) {
          if (currDate == beginDate) {
            //判断当前日期与开始日期是否为同一天,如果为同一天，结束时间为'23:00'
            startHour = item.beginDate.substr(11, 2);
            endHour = 23;
          } else if (currDate == endDate) {
            //判断当前日期与结束日期是否为同一天，如果为同一天，开始时间为'00:00'
            startHour = 0;
            endHour = item.endDate.substr(11, 2);
          } else if (currDate != beginDate && currDate != endDate) {
            //当前日期与开始日期结束日期都不为同一天，那么开始时间为'00:00'，结束时间为'23:00'
            startHour = 0;
            endHour = 23;
          }
        } else {
          startHour = item.beginDate.substr(11, 2);
          endHour = item.endDate.substr(11, 2);
        }
        startHour = parseInt(startHour) + 1;
        endHour = parseInt(endHour) + 1;
        //获取当前日期与结束日期相差的天数
        var differDay = (new Date(endDate) - new Date(currDate)) / 86400000;

        for (var i in times) {
          var val = parseInt(times[i].time.substr(0, 2));
          //判断
          if (val >= startHour && val <= endHour) {

            var obj = JSON.parse(JSON.stringify(item));
            var cssClass = [];
            //当前日期与开始日期、结束日期为同一天时
            if (currDate == beginDate && currDate == endDate && val == startHour && val == endHour) {
              cssClass.push('is-start');
              cssClass.push('is-end');
              obj.width = '100%';
            } else {
              if (currDate == beginDate && val == startHour) {
                cssClass.push('is-start');
                obj.width = beginWidth + '%';
              } else if ((currDate == endDate && val == endHour) || (differDay == 1 && val == endHour)) {
                //当结束时间为00:00，并且当前日期与结束日期相差一天时
                cssClass.push('is-end');
                obj.width = endWidth + '%';
              } else {
                obj.width = '100%';
              }
            }

            obj.cssClass = cssClass.join(' ');
            times[i].event.push(obj);

          }
        }
        this.times = [];
        this.times = times;
      },
      formatDate(fmt, date) {
        if (typeof date === 'string') {
          date = new Date(date);
        }

        var o = {
          "M+": date.getMonth() + 1,                 //月份
          "d+": date.getDate(),                    //日
          "h+": date.getHours(),                   //小时
          "m+": date.getMinutes(),                 //分
          "s+": date.getSeconds(),                 //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      },
      goPrev() {
        var d = new Date(this.date);
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
        this.date = this.formatDate('yyyy-MM-dd', date);
        this.getList();
      },
      goNext() {
        var d = new Date(this.date);
        var date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
        this.date = this.formatDate('yyyy-MM-dd', date);
        this.getList();
      },
      handleFormClose() {
        this.dialogFormVisible = false;
        this.id = undefined;
      },
      handleFormOpen(id) {
        if (id) {
          this.id = id;
        }
        this.dialogFormVisible = true;
      },
      submitFormSuccess() {
        this.dialogFormVisible = false;
        this.id = undefined;
        this.getList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .conference-room-advance {
    padding: 10px;
    background: #fff;
    width: 100%;

    .header {
      display: flex;
      align-items: center;
      .header-left, .header-right {
        flex: 1;
      }
      .header-center {
        flex: 3;
        text-align: center;
        .title {
          margin: 0 10px;
          font-size: 18px;
        }
        .prev-date, .next-date {
          cursor: pointer;
          font-size: 22px;
        }
      }
    }

    .full-time-body {
      width: 100%;
      margin-top: 20px;
      .times {
        .time {
          width: 16.666%;
          float: left;
          text-align: right;
          border: 1px solid #e0e0e0;
          margin: 0 -1px -1px 0;
          .event-time {
            padding: 10px;
          }
        }

        .event-content {
          border-top: 1px solid #e0e0e0;
          height: 120px;
          overflow: auto;
          text-align: left;
          p {
            display: inline-block;
            background-color: #C7E6FD;
            cursor: pointer;
            font-size: 12px;
            margin-bottom: 2px;
            color: rgba(0, 0, 0, 0.87);
            padding: 0 0 0 4px;
            height: 18px;
            line-height: 18px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .is-start {
            float: right;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
          }
          .is-end {
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
          }
        }
      }
    }
  }
</style>
<style lang="scss">
  .conference-room-advance {
    .header-center {
      .title {
        .el-date-editor .el-input__inner {
          font-size: 18px;
          border: none;
          padding: 0px;
          text-align: center;
        }
      }
    }
    .meetingRoomForm {
      .el-dialog {
        margin: 0vh auto !important;
        height: 100vh !important;
      }
      .el-dialog__body {
        padding: 10px 20px !important;
      }
      .dialog-footer {
        bottom: 20px;
        position: absolute;
        float: right;
        right: 20px;
      }

      .create-conference {
        .el-form-item__content {
          .el-textarea__inner {
            border: none;
          }
        }
        .el-form-item__label {
          white-space: nowrap;
        }
        .el-form-item__error {
          position: absolute;
          display: inline-block;
          top: 0px;
          right: 15px;
          text-align: right;
        }

        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }

        .attachment-upload {
          .el-upload {
            vertical-align: top;
          }
          .el-upload-list {
            display: inline-block;
            margin-left: 15px;
          }
        }
      }
    }
  }
</style>
