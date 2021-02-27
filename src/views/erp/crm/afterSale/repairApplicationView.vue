<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>维修申请详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="商品名称:" prop="goodsName" class="el-form-flex">
                {{dataForm.goodsName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="商品分类:" prop="goodsCategory" class="el-form-flex">
                {{dataForm.goodsCategory}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="商品品牌:" prop="goodsBrand" class="el-form-flex">
                {{dataForm.goodsBrand}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="客户联系人:" prop="customerLinkman" class="el-form-flex">
                {{dataForm.customerLinkman}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户联系方式:" prop="customerPhone" class="el-form-flex">
                {{dataForm.customerPhone}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="故障描述:" prop="faultDescribe" class="el-form-flex">
                {{dataForm.faultDescribe}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="受理备注:" prop="acceptanceRemark" class="el-form-flex">
                {{dataForm.acceptanceRemark}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="处理结果:" prop="repairResult" class="el-form-flex">
                {{dataForm.repairResult}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="维修方式" class="el-form-flex">
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="维修类型:" prop="repairType" class="el-form-flex">
                {{dataForm.repairType}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="是否返厂:" prop="backFactory" class="el-form-flex">
                {{dataForm.backFactory}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="是否申请附件:" prop="attachmentApplication" class="el-form-flex">
                <div v-for="item in attachmentOptions">
                  <span v-if="dataForm.attachmentApplication==item.value">{{item.label}}</span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries" v-if="dataForm.attachmentApplication=='0'">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goodsName" label="附件名称" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="申请数量" width="100" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.num}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalSum" label="金额" width="120" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.totalSum}}</span>
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

    <!-- 新增维修申请弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <div v-if="dataForm.billStatus=='5'">
          <el-button type="primary" @click="handleAuditBill('同意')">重 新 流 转</el-button>
        </div>
        <div v-else>
          <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                     v-if="dataForm.billStatus!=5">驳 回
          </el-button>
          <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
        </div>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {getBill, auditBill} from '@/api/erp/crm/repairApplication';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "repairApplicationView",
    props: ['id', 'dialogFormVisible', 'attachmentOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isAgreeLoading: false,
        isRejectLoading: false,
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          goodsId: undefined,
          goodsName: undefined,
          specifications: undefined,
          goodsCategory: undefined,
          goodsBrand: undefined,
          customerId: undefined,
          customerName: undefined,
          customerLinkman: undefined,
          customerPhone: undefined,
          faultDescribe: undefined,
          acceptanceRemark: undefined,
          repairResult: undefined,
          repairType: undefined,
          backFactory: undefined,
          attachmentApplication: undefined,
          note: undefined,
          billStatus: undefined,
          crtTime: undefined,
          crtUserName: undefined,
          items: []
        },
        comment: undefined,
        processId: undefined,
        items: [],
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
          var height = 509;
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
            this.items = response.data.items;
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
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
          if (column.property === 'totalSum') {
            values = data.map(item => Number(item.num * item.price));
          } else if (column.property === 'num') {
            values = data.map(item => Number(item.num));
          }

          if (column.property === 'num' || column.property === 'totalSum') {
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
