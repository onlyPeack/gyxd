<template>
  <div class="dashboard-container">
    <el-row>
<!--      <el-col :span="24" class="viewCol">-->
<!--        查看对象：<span><svg-icon icon-class="add"></svg-icon></span>-->
<!--      </el-col>-->
      <el-col :span="24" class="spanCol">
        业绩报告：
        <el-select v-model="value" placeholder="请选择" size="medium">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart></pie-chart>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="spanCol" style="background-color:#F5F5F5 ">客户报告</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="chart-wrapper">
          <bar-chart></bar-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PieChart from '@/views/dashboard/admin/components/PieChart'
  import BarChart from '@/views/dashboard/admin/components/BarChart'
  export default {
    name: "index",
    components: {
      PieChart,
      BarChart,
    },
    data() {
      return {
        value: '3',
        options: [{
          value: '1',
          label: '本年'
        }, {
          value: '2',
          label: '本季度'
        }, {
          value: '3',
          label: '本月'
        }],
      }
    }
  }
</script>

<style scoped lang="scss">
  .dashboard-container {
    padding-top: 15px;

    .spanCol {
      margin-top: 10px;
      padding-left: 20px;
      height: 45px;
      line-height: 45px;
      background-color: #F5F5F5
    }

    .viewCol {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
    }

    .chart-wrapper {
      background-color: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      margin-top: 15px;
    }
  }
</style>
