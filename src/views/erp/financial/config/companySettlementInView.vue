<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>企业调入结算单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td width="50%"></td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="调出公司全称:" prop="outCompanyFullName" class="el-form-flex">
                {{dataForm.outCompanyFullName}}
              </el-form-item>
            </td>
            <td width="50%"></td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调出公司开户行:" prop="outCompanyOpeningBank" class="el-form-flex">
                {{dataForm.outCompanyOpeningBank}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调出公司银行账户:" prop="outCompanyBankAccount" class="el-form-flex">
                {{dataForm.outCompanyBankAccount}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司全称:" prop="inCompanyFullName" class="el-form-flex">
                {{dataForm.inCompanyFullName}}
              </el-form-item>
            </td>
            <td></td>
          </tr>
          <tr>
            <td>
              <el-form-item label="调入公司开户行:" prop="inCompanyOpeningBank" class="el-form-flex">
                {{dataForm.inCompanyOpeningBank}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="调入公司银行账号:" prop="inCompanyBankAccountCode" class="el-form-flex">
                {{dataForm.inCompanyBankAccountCode}}
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.settleType">
            <td colspan="2">
              <el-form-item label="结算方式" prop="settleType" class="el-form-flex">
               {{dataForm.settleType == '1'?'网银结算':'承兑结算'}}
              </el-form-item>
            </td>
          </tr>
          <tr v-if="dataForm.settleType && dataForm.settleType=='2'">
            <td>
              <el-form-item label="承兑代码:" prop="acceptCode" class="el-form-flex">
                {{dataForm.acceptCode}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="网银结算金额:" prop="onlineSettleAmt" class="el-form-flex">
                {{dataForm.onlineSettleAmt}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="已开票金额:" prop="alreadyBillingAmt" class="el-form-flex">
                {{dataForm.alreadyBillingAmt}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="本次结算总额:" prop="totalSettleAmt" class="el-form-flex">
                {{dataForm.totalSettleAmt}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="承兑金额:" prop="acceptSettleAmt" class="el-form-flex">
                {{dataForm.acceptSettleAmt}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="制单人:" prop="crtUserName" class="el-form-flex">
                {{dataForm.crtUserName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="制单时间:" prop="crtTime" class="el-form-flex">
                {{dataForm.crtTime}}
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
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" width="180" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.goodsName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsCode" label="商品编码" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.goodsCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="series" label="系列" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.series}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferQty" label="调拨数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unSettleQty" label="未结算数量" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.unSettleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleQty" label="本次结算数量" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settleQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferPrice" label="平台调拨价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settlePrice" label="结算单价" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settlePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleDiscount" label="结算折扣" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settleDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleAmt" label="本次结算金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.settleAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transferAmt" label="调拨金额" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.transferAmt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="300">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 企业结算单弹窗底部 -->
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
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getBill, auditBillIn } from '@/api/erp/wms/bill/companySettlement'
  import { getProcessId } from '@/api/erp/oa/task/taskBill'

  export default {
    name: 'companySettlementView',
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          deliverDate: undefined,
          customerId: undefined,
          customerName: undefined,
          salerId: undefined,
          salerName: undefined,
          currencyId: '1',
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          accountMethod: '1',
          repayCondition: '2',
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        processId: undefined,
        comment: undefined,
        rules: {}
      }
    },
    created() {
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function() {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 334
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data
            this.items = response.data.items
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, '')
            this.getProcessId(billPrefix)
          })
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response
          }
        })
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      getSummaries(param) {
        return this.getSummariesMethod(param, ['retailPrice', 'unSettleQty', 'settleQty', 'transferPrice', 'settlePrice', 'settleDiscount', 'settleAmt', 'transferAmt'])
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        }
        this.auditBill(this, 'dataForm', auditBillIn, 'submitDetailSuccess')
      }
    }
  }
</script>
