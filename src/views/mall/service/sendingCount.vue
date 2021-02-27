<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never" style="padding-bottom: 0px;">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="模板类型：">
            <el-select v-model="listQuery.templateType" clearable>
              <el-option v-for="item in templateTypeOptions" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-radio-group v-model="listQuery.number" @change="handleSearchList">
              <el-radio-button :label="1">上月</el-radio-button>
              <el-radio-button :label="0">本月</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>统计列表</span>
    </el-card>
    <div class="table-container">
      <el-table :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="发送时间" align="center" prop="date">
          <template slot-scope="scope">
            <span>{{scope.row.date.substr(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送总数(条)" align="center" prop="total">
        </el-table-column>
        <el-table-column label="发送成功(条)" align="center" prop="successful">
        </el-table-column>
        <el-table-column label="发送失败(条)" align="center" prop="failure">
        </el-table-column>
        <el-table-column label="发送成功率" align="center" prop="probability">
        </el-table-column>
      </el-table>
    </div>
    <div class="raddar-chart-div">
      <raddar-chart v-if="vocational.xAxis.data.length>0" height="500px" :vocational="vocational"
                    @vocationalChange="vocationalChange" ref="raddarChart"></raddar-chart>
    </div>
  </div>
</template>
<script>
  import {statistical} from '@/api/mall/SMSmessage/index';
  import RaddarChart from '@/views/dashboard/admin/components/RaddarChart'

  const defaultListQuery = {
    templateType: null,
    number: 0
  };

  export default {
    name: 'sendingCount',
    components: {
      RaddarChart,
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        listLoading: false,
        templateTypeOptions: [{
          value: 0,
          label: '验证码'
        }, {
          value: 1,
          label: '短信通知'
        }],
        vocational: {
          title: {
            text: '短信发送数据走势图',
            textStyle: {
              color: '#333',
              fontSize: 14,
              fontWeight: 'normal'
            }
          },
          grid: {
            left: '3%',
            right: '3%',
            bottom: '3%',
            containLabel: true
          },
          dataZoom: {
            realtime: true, //拖动滚动条时是否动态的更新图表数据
            height: 20,//滚动条高度
            start: 10,//滚动条开始位置（共100等份）
            end: 90//结束位置（共100等份）
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['发送总数', '发送成功数', '发送失败数']
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [],
            splitLine: {　　//设置网格线，写在哪个轴就是哪个轴的网格线
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#E5E5E5',
              },
            }
          },
          yAxis: {
            splitLine: {
              show: true,
              lineStyle: {
                type: 'solid',
                color: '#E5E5E5',
              },
            }
          },
          series: [
            {
              name: '发送总数',
              data: [],
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  color: 'rgb(41, 182, 246)',
                  lineStyle: {
                    color: 'rgb(41, 182, 246)'
                  }
                }
              }
            },
            {
              name: '发送成功数',
              data: [],
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  color: 'rgb(156, 204, 102)',
                  lineStyle: {
                    color: 'rgb(156, 204, 102)'
                  }
                }
              }
            },
            {
              name: '发送失败数',
              data: [],
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  color: 'rgb(255, 92, 55)',
                  lineStyle: {
                    color: 'rgb(255, 92, 55)'
                  }
                }
              }
            }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.getList();
      },
      getList() {
        this.listLoading = true;
        this.vocational.xAxis.data = [];
        statistical(this.listQuery).then(response => {
          this.listLoading = false;
          var list = [];
          var dateList = [];
          var totalList = [];
          var successList = [];
          var failList = [];
          response.data.forEach(function (item) {
            item.successful = Number(item.successful);
            item.failure = Number(item.failure);
            item.total = Number(item.successful * 1 + item.failure * 1);
            var probability = Number(item.successful * 100 / item.total).toFixed(2);
            item.probability = probability + '%';
            list.push(item);
            dateList.push(item.date.substr(5, 5));
            totalList.push(item.total);
            successList.push(item.successful);
            failList.push(item.failure);
          });
          this.list = list;
          this.vocational.xAxis.data = dateList;
          this.vocational.series[0].data = totalList;
          this.vocational.series[1].data = successList;
          this.vocational.series[2].data = failList;
        }).catch(res => {
          this.listLoading = false;
        })
      },
      vocationalChange() {
        if (this.$refs['raddarChart']) {
          this.$refs[refName].initChart();
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .raddar-chart-div {
    margin-top: 20px;
  }
</style>


