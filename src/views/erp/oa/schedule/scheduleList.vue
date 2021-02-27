<template>
  <div class="full">
    <full-calendar :events="events" @dayClick="getChildDayClick" @eventClick="getChildEventClick"
                   @refreshData="refreshData" @changeMonth="changeMonth"></full-calendar>
  </div>

</template>

<script>
  import FullCalendar from '@/components/Calendar/fullCalendar';
  import {page} from '@/api/erp/oa/schedule';

  export default {
    name: "scheduleList",
    components: {
      FullCalendar,
    },
    data() {
      return {
        listQuery:{
          beginDate:undefined,
          endDate:undefined
        },
        events: []
      };
    },
    methods: {
      getList() {
        this.loading = true;
        page(this.listQuery).then(response => {
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
      changeMonth(start, end, firstDayOfMonth){
        var beginDate=start._d;
        var endDate=new Date(beginDate.getFullYear(),beginDate.getMonth(),beginDate.getDate()+41);
        this.listQuery.beginDate=beginDate;
        this.listQuery.endDate=endDate;
        this.getList();
      },
      getChildDayClick(day, jsEvent) {
      },
      getChildEventClick(event, jsEvent) {
      }
    }

  }

</script>

<style lang="scss">

</style>
