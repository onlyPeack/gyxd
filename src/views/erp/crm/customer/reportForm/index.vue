<template>
  <div class="customer-report">
    <el-tabs style="min-height: 500px">
      <el-tab-pane label="销售业绩报表">
        <el-form ref="salesForm" :model="salesForm" label-width="100px">
          <el-form-item label="指标名称">
            <el-select v-model="salesForm.indicatorName" placeholder="请选择活动区域" size="medium">
              <el-option label="回款金额" value="0"></el-option>
              <el-option label="签约金额" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="人员或部门">
            <span>
              <svg-icon icon-class="add"></svg-icon>
            </span>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              value-format="yyyy-MM-dd"
              end-placeholder="结束日期"
              @change="handleDateSelect">
            </el-date-picker>
            <!--<el-date-picker-->
              <!--type="monthrange"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始月份"-->
              <!--end-placeholder="结束月份"-->
              <!--style="width: 350px;"-->
              <!--size="medium"-->
              <!--v-model="date"-->
              <!--@change="handleDateSelect">
            </el-date-picker>-->
            <!--<el-date-picker type="month" placeholder="选择日期" v-model="salesForm.date1"
                            style="width: 150px;" size="medium"></el-date-picker>
            <span>-</span>
            <el-date-picker type="month" placeholder="选择日期" v-model="salesForm.date2"
                            style="width:  150px;" size="medium" @change="handleDateSelect"></el-date-picker>-->
          </el-form-item>
          <el-form-item label="排序方式">
            <el-select v-model="salesForm.region" style="width:  155px;" size="medium">
              <el-option label="完成率" value="0"></el-option>
              <el-option label="目标(合计)" value="1"></el-option>
              <el-option label="实际(合计)" value="2"></el-option>
            </el-select>
            <el-select v-model="salesForm.region2" style="width:  155px;" size="medium">
              <el-option label="升序" value="0"></el-option>
              <el-option label="降序" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
          <span slot="label">
             <el-button type="primary" size="medium">生成报表</el-button>
          </span>
            <el-button size="medium">导出Excel</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="24">
            (注：金额单位：<span class="spec-text">万元</span>,精度：<span class="spec-text">0.01万元</span>)
          </el-col>
        </el-row>
        <el-table :data="tableData">
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column label="部门名" width="150" align="center">
          </el-table-column>

          <el-table-column label="名字" width="150" align="center">
          </el-table-column>

          <el-table-column label="合计" align="center">
            <el-table-column label="目标" width="120">
            </el-table-column>
            <el-table-column label="预计" width="120">
            </el-table-column>
            <el-table-column label="实际" width="120">
            </el-table-column>
            <el-table-column label="完成率" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="****年*月" align="center">
            <el-table-column label="目标" width="120">
            </el-table-column>
            <el-table-column label="预计" width="120">
            </el-table-column>
            <el-table-column label="实际" width="120">
            </el-table-column>
            <el-table-column label="完成率" width="120">
            </el-table-column>
          </el-table-column>
          <el-table-column label="****年*+1月" align="center">
            <el-table-column label="目标" width="120">
            </el-table-column>
            <el-table-column label="预计" width="120">
            </el-table-column>
            <el-table-column label="实际" width="120">
            </el-table-column>
            <el-table-column label="完成率" width="120">
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="销售行为分析表">
        <el-form ref="salesForm" :model="Form" label-width="100px">
          <el-form-item label="发起人">
            <el-row>
              <el-col>
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-row>
              <el-col :span="10">
                <el-radio-group v-model="dateRange" @change="specChange" size="medium">
                  <el-radio :label="3">本月</el-radio>
                  <el-radio :label="6">上月</el-radio>
                  <el-radio :label="9">本周</el-radio>
                  <el-radio :label="12">上周</el-radio>
                  <el-radio :label="15">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="dateRangeVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="查看范围" v-if="salesVisible">
            <el-row>
              <el-col :span="6">
                <el-select v-model="value" placeholder="请选择" size="medium" style="width: 300px">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="min-width: 60px">关联客户</el-col>
              <el-col :span="8">
                <el-input placeholder="请输入内容" class="input-with-select"
                          style="width: 300px" size="medium">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="动态类别" v-if="salesVisible">
            <el-row>
              <el-col>
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="日志"></el-checkbox>
                  <el-checkbox label="任务"></el-checkbox>
                  <el-checkbox label="信息"></el-checkbox>
                </el-checkbox-group>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="正文内容" v-if="salesVisible">
            <el-row>
              <el-col>
                <el-input placeholder="搜索" size="medium" style="width: 300px"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <span slot="label">
               <el-button type="primary" size="medium">生成报表</el-button>
            </span>
            <el-button size="medium">导出Excel</el-button>
            <span @click="salesVisible = !salesVisible" v-model="salesVisible">
              <el-button type="text" v-if="salesVisible" size="medium">收起筛选</el-button>
              <el-button type="text" v-if="!salesVisible" size="medium">展开筛选</el-button>
            </span>
          </el-form-item>
        </el-form>
        <!--销售行为分析表-->
        <el-table :data="tableData" border>
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column label="发起时间" width="150" align="center">
          </el-table-column>
          <el-table-column label="发起部门" width="150" align="center">
          </el-table-column>
          <el-table-column label="发起人" width="150" align="center">
          </el-table-column>
          <el-table-column label="客户名称" width="150" align="center">
          </el-table-column>
          <el-table-column label="类别" width="100" align="center">
          </el-table-column>
          <el-table-column label="动态内容" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="商机统计汇总表">
        <el-form label-width="100px">
          <el-form-item label="商机负责人">
            <el-row>
              <el-col>
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="创建日期">
            <el-row>
              <el-col :span="8">
                <el-radio-group v-model="createDate" @change="specChange">
                  <el-radio :label="3">全部</el-radio>
                  <el-radio :label="6">本月</el-radio>
                  <el-radio :label="9">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="createDateVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="更新日期">
            <el-row>
              <el-col :span="8">
                <el-radio-group v-model="updateDate" @change="specChange">
                  <el-radio :label="3">全部</el-radio>
                  <el-radio :label="6">本月</el-radio>
                  <el-radio :label="9">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="updateDateVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item label="预计签单日期">
            <el-row>
              <el-col :span="8">
                <el-radio-group v-model="expectedDate" @change="specChange">
                  <el-radio :label="3">全部</el-radio>
                  <el-radio :label="6">本月</el-radio>
                  <el-radio :label="9">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="expectedDateVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="排序方式">
            <el-row>
              <el-col>
                <el-select v-model="salesForm.region" style="width:  155px;" size="medium">
                  <el-option label="完成率" value="0"></el-option>
                  <el-option label="目标(合计)" value="1"></el-option>
                  <el-option label="实际(合计)" value="2"></el-option>
                </el-select>
                <el-select v-model="salesForm.region2" style="width:  155px;" size="medium">
                  <el-option label="升序" value="0"></el-option>
                  <el-option label="降序" value="1"></el-option>
                </el-select>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item>
          <span slot="label">
             <el-button type="primary" size="medium">生成报表</el-button>
          </span>
            <el-button size="medium">导出Excel</el-button>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              (注：金额单位：<span class="spec-text">万元</span>,精度：<span class="spec-text">0.01万元</span>，
              预计总业绩=∑预计金额*可能性，只统计有效商机）
            </el-col>
          </el-row>
        </el-form>
        <el-table :data="tableData" border>
          <el-table-column label="部门" align="center">
          </el-table-column>
          <el-table-column label="商机负责人" align="center">
          </el-table-column>
          <el-table-column label="商机数量" align="center">
          </el-table-column>
          <el-table-column label="预计总金额" align="center">
          </el-table-column>
          <el-table-column label="预计总业绩" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="销售漏斗分析表">
        <el-form label-width="100px">
          <el-form-item label="商机负责人">
            <el-row>
              <el-col>
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-row>
              <el-col :span="10">
                <el-radio-group v-model="fillerUpdateDate" @change="specChange">
                  <el-radio :label="3">全部</el-radio>
                  <el-radio :label="6">本月</el-radio>
                  <el-radio :label="9">本周</el-radio>
                  <el-radio :label="12">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="fillerUpdateDateVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <span slot="label">
               <el-button type="primary" size="medium">生成报表</el-button>
            </span>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="24">
            (注：金额单位：<span class="spec-text">万元</span>,精度：<span class="spec-text">0.01万元</span>，
            只统计有效商机：包括跟踪、成功、搁置）
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客户拜访率报表">
        <el-form label-width="100px">
          <el-form-item label="人员或部门" v-if="visible">
            <el-row>
              <el-col>
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="关联客户" v-if="visible">
            <el-row>
              <el-col>
                <el-input placeholder="请输入内容" class="input-with-select"
                          style="width: 300px" size="medium">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="更新时间" v-if="visible">
            <el-row>
              <el-col :span="10">
                <el-radio-group v-model="visitUpdateDate" @change="specChange">
                  <el-radio :label="3">本月</el-radio>
                  <el-radio :label="6">本季度</el-radio>
                  <el-radio :label="9">本年</el-radio>
                  <el-radio :label="12">自定义</el-radio>
                </el-radio-group>
              </el-col>
              <el-col :span="10">
                <div v-if="visitUpdateDateVisible">
                  <el-date-picker v-model="salesForm.date1" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                  <span style="margin: 0px 15px 0px 15px">到</span>
                  <el-date-picker v-model="salesForm.date2" align="right" type="date" style="width: 150px;"
                                  placeholder="选择日期" :picker-options="pickerOptions1" size="medium">
                  </el-date-picker>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <span slot="label">
               <el-button type="primary" size="medium">生成报表</el-button>
            </span>
            <el-button size="medium">导出Excel</el-button>
            <span @click="visible = !visible" v-model="visible">
             <el-button type="text" v-if="visible" size="medium">收起筛选</el-button>
             <el-button type="text" v-if="!visible" size="medium">展开筛选</el-button>
            </span>
          </el-form-item>
        </el-form>

        <el-table :data="tableData" border>
          <el-table-column type="index" width="100">
          </el-table-column>
          <el-table-column label="部门" align="center">
          </el-table-column>
          <el-table-column label="姓名" align="center">
          </el-table-column>
          <el-table-column label="拜访次数" align="center">
          </el-table-column>
          <el-table-column label="客户总数" align="center">
          </el-table-column>
          <el-table-column label="拜访客户数" align="center">
          </el-table-column>
          <el-table-column label="未拜访客户数" align="center">
          </el-table-column>
          <el-table-column label="拜访率" align="center">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "index",
    data() {
      return {
        salesForm: {
          name: '',
          indicatorName: '',
          region1: '',
          region2: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        Form: {
          dateRange: '',
        },
        tableData: [],
        createDate: '',
        expectedDate: '',
        updateDate: '',
        fillerUpdateDate: '',
        visitUpdateDate: '',
        dateRange: '',
        createDateVisible: false,
        updateDateVisible: false,
        expectedDateVisible: false,
        fillerUpdateDateVisible: false,
        visitUpdateDateVisible: false,
        dateRangeVisible: false,
        salesVisible: true,
        visible: true,
        options: [{
          value: '1',
          label: '全部'
        }, {
          value: '2',
          label: '客户'
        }, {
          value: '3',
          label: '商机'
        }],
        value: '',
        checkList: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        date: undefined
      }
    },
    watch: {
      date(value) {
        if (value == null) {
          this.salesForm.date1 = undefined;
          this.salesForm.date2 = undefined;
        }
      }
    },
    methods: {
      specChange() {

        //点击自定义显示时间选择器
        if (this.createDate === 9) {
          this.createDateVisible = true
        } else {
          this.createDateVisible = false
        }

        if (this.updateDate === 9) {
          this.updateDateVisible = true
        } else {
          this.updateDateVisible = false
        }

        if (this.expectedDate === 9) {
          this.expectedDateVisible = true
        } else {
          this.expectedDateVisible = false
        }

        if (this.fillerUpdateDate === 12) {
          this.fillerUpdateDateVisible = true
        } else {
          this.fillerUpdateDateVisible = false
        }

        if (this.visitUpdateDate === 12) {
          this.visitUpdateDateVisible = true
        } else {
          this.visitUpdateDateVisible = false
        }

        if (this.dateRange === 15) {
          this.dateRangeVisible = true
        } else {
          this.dateRangeVisible = false
        }
      },
      handleDateSelect(val) {
        if(val && val.length>0){
          this.salesForm.date1 = val[0];
          this.salesForm.date2 = val[1];
        }
        console.log(this.salesForm)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .customer-report {
    margin: 10px 25px 0px 25px;

    .el-col {
      margin-left: 20px;
    }

    .spec-text {
      color: #dd1100;
    }

    .el-table {
      margin-top: 30px;
    }
  }
</style>
