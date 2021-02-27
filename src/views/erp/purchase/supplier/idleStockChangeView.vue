<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>闲置库变更布详情</span>
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
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                {{dataForm.billNo}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="制单人:" prop="crtUserName" class="el-form-flex">
                {{dataForm.crtUserName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="制单时间:" prop="crtTime" class="el-form-flex">
                {{dataForm.crtTime}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                {{dataForm.supplierName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商编码:" prop="supplierCode" class="el-form-flex">
                {{dataForm.supplierCode}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="仓库名称:" prop="warehouseName" class="el-form-flex">
                {{dataForm.warehouseName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="仓库地址:" prop="warehouseAdress" class="el-form-flex">
                {{dataForm.warehouseAdress}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="创建方式:" prop="createType" class="el-form-flex">
                <span v-if="dataForm.createType == 1">采购员新建</span>
                <span v-if="dataForm.createType == 2">供应商新建</span>
              </el-form-item>
            </td>
            <td></td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      </el-table-column>
      <el-table-column prop="billNo" label="单据号" width="180">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleOpenDetailOrForm(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="billStatus" label="单据状态" align="center" width="80">
        <template slot-scope="scope">
          <div v-for="item in statusOptions">
            <span v-if="item.value==scope.row.billStatus">{{item.label}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180">
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="specModel" label="品名" width="100"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="100">
      </el-table-column>
      <el-table-column prop="releasePrice" v-if="dataForm.createType == 1" label="采购发布价格" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="releaseDiscount" v-if="dataForm.createType == 1" label="采购发布折扣" width="100" class-name="col-required">
      </el-table-column>
      <el-table-column prop="supplyPrice" v-if="dataForm.createType == 2" label="供应商发布价格" width="120" class-name="col-required">
      </el-table-column>
      <el-table-column prop="supplyDiscount" v-if="dataForm.createType == 2" label="供应商发布折扣" width="120" class-name="col-required">
        <template slot-scope="scope">
          {{(scope.row.supplyPrice/scope.row.retailPrice).toFixed(4)}}
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="point" label="采购加点" width="100"></el-table-column>
      <el-table-column prop="releaseQty" label="总发布数量" width="100"></el-table-column>
      <el-table-column prop="productionDate" label="生产日期" width="100"></el-table-column>
      <el-table-column prop="qty" label="库存数量" width="100"></el-table-column>
      <el-table-column prop="lockedQty" label="锁库数量" width="100"></el-table-column>
      <el-table-column prop="minPack" label="最小起订量" width="100"></el-table-column>
      <el-table-column prop="oldReleasePrice" label="原采购发布价格" width="100"></el-table-column>  
      <el-table-column prop="oldSupplyPrice" label="原供应商发布价格" width="100"></el-table-column>
      <el-table-column prop="supplyAmount" label="发布金额" width="100"></el-table-column>
      <el-table-column prop="supplyPrice" label="供货价" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="purchaserName" label="采购员姓名" width="100"></el-table-column>
      <el-table-column prop="purchaserCode" label="采购员编号" width="100"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="100"></el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" width="100"></el-table-column>
      <el-table-column prop="tags" label="标签" width="100"></el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" width="100"></el-table-column>
      <el-table-column prop="warehouseAdress" label="仓库地址" width="100"></el-table-column>
      <el-table-column prop="validateTime" label="质保期" width="100"></el-table-column>
      <el-table-column prop="warranty" label="有效期" width="100"></el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增采购合同弹窗底部 -->
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
        <el-button type="primary">
          <router-link target="_blank" :to="{path:'/print/purchase-contract-print',query:{id:id}}">打 印</router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/purchase/bill/idleStockChange';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "idleStockView",
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
          contractName: undefined,
          contractDate: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          supplierId: undefined,
          supplierName: undefined,
          purchaserId: undefined,
          purchaserName: undefined,
          contractAmount: undefined,
          currencyId: '1',
          note: undefined,
          billStatus: undefined,
          items: []
        },
        paymentOptions: [{
          value: '1',
          label: '货到付款'
        }, {
          value: '2',
          label: '款到发货'
        }, {
          value: '3',
          label: '月结'
        }, {
          value: '4',
          label: '承兑'
        }],
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
          var height = 303;
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
          if (column.property === 'amount') {
            values = data.map(item => Number(item.qty * item.price));
          } else if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          } else if (column.property === 'tax') {
            //item.tax * item.taxRate
            values = data.map(item => Number(item.tax));
          } else if (column.property === 'taxAmount') {
            //item.qty * item.taxPrice
            values = data.map(item => Number(item.taxAmount));
          }

          if (column.property === 'qty' || column.property === 'amount'
            || column.property === 'tax' || column.property === 'taxAmount') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                if (column.property === 'taxAmount') {
                  this.dataForm.contractAmount = getFloat((prev + curr), 4)
                }
                return getFloat((prev + curr), 4);
              } else {
                return prev;
              }
            }, 0).toFixed(4);

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
