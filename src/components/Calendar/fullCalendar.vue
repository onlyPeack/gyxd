<template>
  <div class="comp-full-calendar" @click="handleClick">
    <!-- 标题选取月份 -->
    <fc-header :current-month="currentMonth"
               :first-day="firstDay"
               :locale="locale"
               @change="emitChangeMonth">

      <div slot="header-left">
        <slot name="fc-header-left">

        </slot>
      </div>

      <div slot="header-right" style="text-align: right;">
        <slot name="fc-header-right">
          <el-button class="filter-item" type="success" icon="el-icon-plus"
                     @click="handleScheduleShow">新建
          </el-button>
        </slot>
      </div>

    </fc-header>
    <!-- 显示日期和事件 -->
    <div class="full-calendar-body">
      <div class="weeks">
        <strong class="week" v-for="dayIndex in 7">{{ (dayIndex - 1) | localeWeekDay(firstDay, locale) }}</strong>
      </div>
      <div class="dates" ref="dates">
        <div class="dates-bg">
          <div class="week-row" v-for="week in currentDates">
            <div class="day-cell" v-for="day in week"
                 :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}">
              <p class="day-number">{{ day.monthDay }}</p>
            </div>
          </div>
        </div>

        <!-- absolute so we can make dynamic td -->
        <div class="dates-events">
          <div class="events-week" v-for="week in currentDates">

            <div class="events-day" v-for="day in week" track-by="$index"
                 :class="{'today' : day.isToday,
              'not-cur-month' : !day.isCurMonth}" @click.stop="dayClick(day.date, $event)">
              <p class="day-number">{{day.monthDay}}</p>
              <div class="event-box">
                <event-card v-for="event in day.events" :date="day.date" :firstDay="firstDay" :event="event"
                            :key="event.cellIndex" v-show="event.cellIndex <= eventLimit" @click="eventClick">
                  <template slot-scope="p">
                    <slot name="fc-event-card" :event="p.event"></slot>
                  </template>
                </event-card>
                <p v-if="day.events.length > eventLimit"
                   class="more-link" @click.stop="selectThisDay(day, $event)">
                  + {{day.events[day.events.length -1].cellIndex - eventLimit}} more
                </p>
              </div>
            </div>

          </div>
        </div>

        <!--弹出快捷菜单-->
        <ul class="ul-menu" :style="customStyle">
          <li @click="handleScheduleShow">
            <svg-icon icon-class="task"></svg-icon>
            添加任务
          </li>
          <!--<li>
            <svg-icon icon-class="flow"></svg-icon>
            工作流
          </li>-->
        </ul>

        <!-- 单击“显示更多”时的完整事件 -->
        <div class="more-events" v-show="showMore"
             :style="{left: morePos.left + 'px', top: morePos.top + 'px'}">
          <div class="more-header">
            <span class="title">{{ moreTitle(selectDay.date) }}</span>
            <span class="close" @click.stop="showMore = false">x</span>
          </div>
          <div class="more-body">
            <ul class="body-list">
              <li v-for="event in selectDay.events"
                  v-show="event.isShow" class="body-item"
                  @click="eventClick(event, $event)">
                {{event.title}}
              </li>
            </ul>
          </div>
        </div>

        <!-- 创建任务、任务详情弹窗-->
        <el-dialog :visible.sync="scheduleVisiable" class="scheduleFormDialog" width="70%"
                   :before-close="handleScheduleClose">
          <schedule-form v-if="scheduleVisiable" :scheduleId="scheduleId"
                         @handleScheduleClose="handleScheduleClose"></schedule-form>
        </el-dialog>

        <slot name="body-card">

        </slot>

      </div>
    </div>

    <!-- 显示提示信息-->
    <div class="footer">
      <ul>
        <li>
          <svg-icon icon-class="block" class="blue"></svg-icon>
          未完成
        </li>
        <li>
          <svg-icon icon-class="block" class="green"></svg-icon>
          完成、超期完成
        </li>
        <li>
          <svg-icon icon-class="block" class="red"></svg-icon>
          超期
        </li>
        <li>
          <svg-icon icon-class="block" class="purple"></svg-icon>
          请假
        </li>
      </ul>
    </div>
  </div>

</template>
<script type="text/babel">
  // import langSets from './dataMap/langSets'
  import dateFunc from './components/dateFunc'
  import moment from 'moment';
  import EventCard from './components/eventCard.vue';
  import Header from './components/header.vue';
  import scheduleForm from "@/views/erp/oa/components/scheduleForm";


  export default {
    props: {
      events: { // events will be displayed on calendar
        type: Array,
        default: []
      },
      locale: {
        type: String,
        default: 'zh-cn'
      },
      firstDay: {
        type: Number | String,
        validator(val) {
          let res = parseInt(val);
          return res >= 0 && res <= 6
        },
        default: 0
      }
    },
    components: {
      'event-card': EventCard,
      'fc-header': Header,
      'schedule-form': scheduleForm
    },
    mounted() {
      this.emitChangeMonth(this.currentMonth);
    },
    data() {
      return {
        customStyle: 'display: none;',
        currentMonth: moment().startOf('month'),
        isLismit: true,
        eventLimit: 3,
        showMore: false,
        morePos: {
          top: 0,
          left: 0
        },
        selectDay: {},
        scheduleVisiable: false,
        scheduleId: undefined
      };
    },
    computed: {
      currentDates() {
        return this.getCalendar()
      }
    },
    methods: {
      emitChangeMonth(firstDayOfMonth) {
        this.currentMonth = firstDayOfMonth;

        let start = dateFunc.getMonthViewStartDate(firstDayOfMonth, this.firstDay);
        let end = dateFunc.getMonthViewEndDate(firstDayOfMonth, this.firstDay);

        this.$emit('changeMonth', start, end, firstDayOfMonth)
      },
      moreTitle(date) {
        if (!date) return '';
        return moment(date).format('ll');
      },
      getCalendar() {
        // calculate 2d-array of each month
        let monthViewStartDate = dateFunc.getMonthViewStartDate(this.currentMonth, this.firstDay);
        let calendar = [];

        for (let perWeek = 0; perWeek < 6; perWeek++) {
          let week = [];

          for (let perDay = 0; perDay < 7; perDay++) {
            week.push({
              monthDay: monthViewStartDate.date(),
              isToday: monthViewStartDate.isSame(moment(), 'day'),
              isCurMonth: monthViewStartDate.isSame(this.currentMonth, 'month'),
              weekDay: perDay,
              date: moment(monthViewStartDate),
              events: this.slotEvents(monthViewStartDate)
            });

            monthViewStartDate.add(1, 'day');
          }

          calendar.push(week);
        }

        return calendar
      },
      slotEvents(date) {

        // find all events start from this date
        let cellIndexArr = [];
        let thisDayEvents = this.events.filter(day => {
          let st = moment(day.start);
          let ed = moment(day.end ? day.end : st);

          return date.isBetween(st, ed, null, '[]');
        });

        // sort by duration
        thisDayEvents.sort((a, b) => {
          if (!a.cellIndex) return 1;
          if (!b.cellIndex) return -1;
          return a.cellIndex - b.cellIndex
        });

        // mark cellIndex and place holder
        for (let i = 0; i < thisDayEvents.length; i++) {
          thisDayEvents[i].cellIndex = thisDayEvents[i].cellIndex || (i + 1);
          thisDayEvents[i].isShow = true;
          if (thisDayEvents[i].cellIndex == i + 1 || i > 2) continue;
          thisDayEvents.splice(i, 0, {
            title: 'holder',
            cellIndex: i + 1,
            start: date.format(),
            end: date.format(),
            isShow: false
          })
        }

        return thisDayEvents
      },
      selectThisDay(day, jsEvent) {
        this.selectDay = day;
        this.showMore = true;
        this.morePos = this.computePos(event.target);
        this.morePos.top -= 100;
        let events = day.events.filter(item => {
          return item.isShow == true
        });
        this.$emit('moreClick', day.date, events, jsEvent)
      },
      computePos(target) {
        let eventRect = target.getBoundingClientRect();
        let pageRect = this.$refs.dates.getBoundingClientRect();
        return {
          left: eventRect.left - pageRect.left,
          top: eventRect.top + eventRect.height - pageRect.top
        }
      },
      handleClick(event) {
        this.customStyle = 'display: none;';
      },
      dayClick(day, jsEvent) {
        let x = jsEvent.clientX;
        let y = jsEvent.clientY;
        const windowWidth = document.body.clientWidth;
        const windowHeight = document.body.clientHeight;

        if (x + 200 > windowWidth) {
          x = windowWidth;
        }
        if (x < 200) {
          x = x + 200;
        }
        if (y + 120 > windowHeight) {
          y = windowHeight - 120;
        }

        this.customStyle = 'position: absolute; left: ' + (x - 230) + 'px; top: ' + (y - 150) + 'px;';
        this.$emit('dayClick', day, jsEvent)
      },
      eventClick(event, jsEvent) {
        this.scheduleId = event.id;
        this.scheduleVisiable = true;
        if (!event.isShow) return;

        jsEvent.stopPropagation();
        let pos = this.computePos(jsEvent.target);
        this.$emit('eventClick', event, jsEvent, pos);
      },
      handleScheduleShow() {
        this.scheduleVisiable = true;
        this.scheduleId = undefined;
      },
      handleScheduleClose(flag) {
        this.scheduleVisiable = false;
        this.scheduleId = undefined;
        if (flag) {
          this.$emit('refreshData');
        }
      },
      handleClose() {

      },

    },
    filters: {
      localeWeekDay(weekday, firstDay, locale) {
        firstDay = parseInt(firstDay);
        const localMoment = moment().locale(locale);
        return localMoment.localeData().weekdaysShort()[(weekday + firstDay) % 7];
      }
    }
  }

</script>
<style lang="scss" scoped>
  .comp-full-calendar {
    // font-family: "elvetica neue", tahoma, "hiragino sans gb";
    padding: 10px;
    background: #fff;
    width: 100%;
    //margin:0 auto;
    ul, p {
      margin: 0;
      padding: 0;
    }

    .ul-menu {
      display: block;
      list-style: none;
      line-height: 30px;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.15);
      background-color: #ffffff;
      width: 180px;
      position: absolute;
      z-index: 99;
      li {
        padding-left: 15px;
        padding-top: 5px;
      }
      svg {
        margin-right: 10px;
      }
      li:hover {
        background-color: #edf0ed;
      }
    }

    .full-calendar-body {
      width: 100%;
      margin-top: 20px;
      .weeks {
        display: flex;
        border-top: 1px solid #e0e0e0;
        border-bottom: 1px solid #e0e0e0;
        border-left: 1px solid #e0e0e0;
        .week {
          padding: 10px;
          flex: 1;
          text-align: center;
          border-right: 1px solid #e0e0e0;
        }
      }
      .dates {
        position: relative;
        .week-row {
          // width: 100%;
          // position:absolute;
          border-left: 1px solid #e0e0e0;
          display: flex;
          .day-cell {
            flex: 1;
            min-height: 120px;
            //height: 123px;
            padding: 4px;
            border-right: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            .day-number {
              text-align: right;
            }
            &.today {
              background-color: #fcf8e3;
            }
            &.not-cur-month {
              .day-number {
                color: rgba(0, 0, 0, .24);
              }
            }
          }
        }
        .dates-events {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          .events-week {
            display: flex;
            .events-day {
              cursor: pointer;
              flex: 1;
              min-height: 120px;
              //height: 123px;
              overflow: hidden;
              text-overflow: ellipsis;
              .day-number {
                text-align: right;
                padding: 4px 5px 4px 4px;
                opacity: 0;
              }
              &.not-cur-month {
                .day-number {
                  color: rgba(0, 0, 0, .24);
                }
              }
              .event-box {
                .event-item {
                  cursor: pointer;
                  font-size: 12px;
                  background-color: #C7E6FD;
                  margin-bottom: 2px;
                  color: rgba(0, 0, 0, .87);
                  padding: 0 0 0 4px;
                  height: 18px;
                  line-height: 18px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  &.is-start {
                    margin-left: 4px;
                    border-top-left-radius: 15px;
                    border-bottom-left-radius: 15px;
                  }
                  &.is-end {
                    margin-right: 4px;
                    border-top-right-radius: 15px;
                    border-bottom-right-radius: 15px;
                  }
                  &.is-opacity {
                    opacity: 0;
                  }
                }
                .more-link {
                  cursor: pointer;
                  // text-align: right;
                  padding-left: 8px;
                  padding-right: 2px;
                  color: rgba(0, 0, 0, .38);
                  font-size: 14px;
                }
              }
              .event-weiwancheng {
                background-color: #C7E6FD !important;
              }
              .event-wancheng {
                background-color: #57C688 !important;
              }
              .event-chaoqi {
                background-color: #ED5959 !important;
              }
              .event-qingjia {
                background-color: #8089DE !important;
              }
            }
          }
        }
        .more-events {
          position: absolute;
          width: 150px;
          z-index: 2;
          border: 1px solid #eee;
          box-shadow: 0 2px 6px rgba(0, 0, 0, .15);
          .more-header {
            background-color: #eee;
            padding: 5px;
            display: flex;
            align-items: center;
            font-size: 14px;
            .title {
              flex: 1;
            }
            .close {
              margin-right: 2px;
              cursor: pointer;
              font-size: 16px;
            }
          }
          .more-body {
            height: 146px;
            overflow: hidden;
            .body-list {
              height: 144px;
              padding: 5px;
              overflow: auto;
              background-color: #fff;
              .body-item {
                cursor: pointer;
                font-size: 12px;
                background-color: #C7E6FD;
                margin-bottom: 2px;
                color: rgba(0, 0, 0, .87);
                padding: 0 0 0 4px;
                height: 18px;
                line-height: 18px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }

    .footer {
      width: 100%;
      margin-top: 10px;
      ul {
        display: block;
        list-style: none;
        margin-top: 3px;
        font-size: 14px;
        li {
          float: left;
          margin-left: 15px;
        }
        svg {
          margin-right: 5px;
        }
        .blue {
          color: #C7E6FD;
        }
        .green {
          color: #57C688;
        }
        .red {
          color: #ED5959;
        }
        .purple {
          color: #8089DE;
        }
      }
    }

  }
</style>
<style lang="scss">
  .comp-full-calendar{
    .scheduleFormDialog {
      .el-dialog {
        margin: 0vh auto !important;
        height: 100vh !important;
      }
      .el-dialog__body {
        padding: 10px !important;
      }
    }
  }
</style>
