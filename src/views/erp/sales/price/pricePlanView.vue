<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>客户价格方案详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="方案名称:" prop="schemeName" class="el-form-flex">
                {{dataForm.schemeName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="调价类型:" prop="type" class="el-form-flex">
                <div v-for="(item,index) in typeOptions" :key="index">
                  <span v-if="dataForm.type==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="适用客户:" prop="customerName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-tag v-for="tag in dataForm.customerArr" :key="tag.id">
                    {{tag.customerName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td>
               <el-form-item label="客户等级:" prop="level" class="el-form-flex">
                 {{dataForm.level}}
               </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="生效日期:" prop="effectiveDate" class="el-form-flex">
                {{dataForm.effectiveDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                {{dataForm.disabledDate}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="180" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180" align="center" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="180" align="center" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="80" align="right" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" v-if="dataForm.type == 0 || dataForm.type == 1" label="系列名称" width="120" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" v-if="dataForm.type == 2 || dataForm.type == 4" label="系列名称" width="500" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" v-if="dataForm.type == 3 || dataForm.type == 5" label="品牌名称" width="500" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerDiscount" v-if="dataForm.type == 0 || dataForm.type == 1" label="客户订货折扣" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.customerDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerDiscount" v-if="dataForm.type == 2 || dataForm.type == 4 || dataForm.type == 3 || dataForm.type == 5" label="客户订货折扣" width="500" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.customerDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerPrice" label="客户订货价" width="150" align="right" class-name="col-required" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.customerPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="referencePrice" label="参考价格" width="150" align="right" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.referencePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="customerDifference" label="毛利率" width="150" align="right" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.customerDifference}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="safeDiscount" label="安全折扣" width="120" align="right" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.safeDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="safePrice" label="安全价格" width="150" align="right" v-if="dataForm.type == 0 || dataForm.type == 1">
        <template slot-scope="scope">
          <span>{{scope.row.safePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增客户价格方案弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        <!--<el-button type="primary" @click="handleAuditBill('撤销')">撤 销</el-button>-->
        <!--<el-button type="primary">
          <router-link target="_blank" :to="{path:'/print/sales-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/sales/price/pricePlan';
  import {getProcessId} from '@/api/erp/oa/task/taskBill'

  export default {
    name: "pricePlanView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isAgreeLoading: false,
        isRejectLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          schemeName: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          customerId: undefined,
          customerName: undefined,
          customerArr: [],
          billStatus: undefined,
          type: '0',
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        levelOptions: [{
          value: 10,
          label: '青铜'
        }, {
          value: 20,
          label: '白银'
        }, {
          value: 30,
          label: '黄金'
        }, {
          value: 40,
          label: '铂金'
        }, {
          value: 50,
          label: '钻石'
        }, {
          value: 60,
          label: '至尊'
        }],
        typeOptions: [{
          value: '0',
          label: '单个商品调价'
        },
        {
          value: '1',
          label: '低于安全折扣调价'
        },
        {
            value: '2',
            label: '按系列调价(以面价为准)'
        },{
            value: '3',
            label: '按品牌调价(以面价为准)'
        },{
            value: '4',
            label: '按系列调价(以调拨价为准)'
        },{
            value: '5',
            label: '按品牌调价(以调拨价为准)'
        }],
        rules: {}
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 154;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data;
            let tempIndex = this.levelOptions.findIndex(item => {
              return item.value == this.dataForm.customerArr[0].level
            })
            this.dataForm.level = this.levelOptions[tempIndex].label
            this.items = response.data.items;
            this.getProcessId('JGFA');
          });
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        let {columns, data} = param;
        let sums = [];
        let values = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property === 'price') {
            values = data.map(item => Number(item.price));
          } else if (column.property === 'safePrice') {
            values = data.map(item => Number(item.safePrice));
          }

          if (column.property === 'price' || column.property === 'safePrice') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat((prev + curr), 2);
              } else {
                return prev;
              }
            }, 0);

            sums[index] += ' ';
          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
      }
    }
  }
</script>
