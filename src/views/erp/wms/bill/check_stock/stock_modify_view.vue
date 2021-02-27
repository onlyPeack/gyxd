<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>库存修改单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <!-- <div class="association-creation">关联创建</div> -->
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td colspan="2">
              <el-form-item label="操作人:" prop="sourceBillNo" class="el-form-flex">
                <div>
                    {{$store.state.user.name}}
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="入库日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="入库仓库:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"
                          readonly="readonly"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="200" align="left">
      </el-table-column>
      <el-table-column prop="source" label="来源" width="200" align="left">
       <template slot-scope="scope">
          <span v-if="scope.row.source == 0">标准ERP</span>
          <span v-if="scope.row.source == 1">和稷ERP</span>
          <span v-if="scope.row.source == 2">调拨库存</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="库存类型" width="200" align="left">
         <template slot-scope="scope">
          <span v-if="scope.row.type == 0">商务备货</span>
          <span v-if="scope.row.type == 1">按订单采购</span>
          <span v-if="scope.row.type == 2">调拨库存</span>
          <span v-if="scope.row.type == 3">线下库存</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="200" align="left">
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库" width="200" align="left">
      </el-table-column>
      <el-table-column prop="oldGoodsShelf" label="原货架" width="200" align="left">
      </el-table-column>
      <el-table-column prop="newGoodsShelf" label="现货架" width="200" align="left">
      </el-table-column>
      <el-table-column prop="qty" label="库存数量" width="200" align="left">
      </el-table-column>
      <el-table-column prop="lockedQty" label="锁定数量" width="200" align="left">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="200" align="left">
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="200" align="left">
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="200" align="left">
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="200" align="left">
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="200" align="left">
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

    <!-- 盘盈入库单弹窗底部 -->
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
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/stockModify';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "stockModifyView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        isRejectLoading: false,
        isAgreeLoading: false,
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        rules: {},
        processId: undefined,
        comment: undefined,
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
          var height = 129;
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
          if (column.property === 'cost') {
            values = data.map(item => Number(item.cost));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }

          if (column.property === 'qty' || column.property === 'cost') {
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

