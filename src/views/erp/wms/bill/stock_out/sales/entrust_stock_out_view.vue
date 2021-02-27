<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>委托发货单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">

      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                 <el-input type="input" v-model="dataForm.billNo" placeholder="单据编号自动带出" readonly></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item v-if="id" label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="委托员工:" prop="entrustedName" class="el-form-flex">
                 <el-input type="input" v-model="dataForm.entrustedName" readonly></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="仓库:" prop="warehouseName" class="el-form-flex">
                <div @click.stop="handleWarehouseSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in dataForm.warehouseArr" :key="tag.warehouseId" closable
                          @close="handleWarehouseDel">
                    {{tag.warehouseName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="仓库管理员:" prop="managerName" class="el-form-flex">
                 <el-input type="input" v-model="dataForm.managerName" readonly></el-input>
              </el-form-item>
            </td>
             <td>
              <el-form-item label="运送方式:" prop="expressName" class="el-form-flex">
                <div @click="handleRepressSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag v-for="tag in expressArr" :key="tag.id" closable v-model="dataForm.expressName"
                          @close="handleExpressDel">
                    {{tag.expressName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发往城市:" prop="receiverCity" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiverCity" placeholder="请输发往城市"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发往地址:" prop="receiverAddress" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiverAddress" placeholder="请输入发往地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiverName" placeholder="请输入收货人"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="收货人电话:" prop="receiverPhone" class="el-form-flex">
                <el-input type="input" v-model="dataForm.receiverPhone" placeholder="请输入收货电话"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="货品价值:" prop="goodsValue" class="el-form-flex">
                <el-input type="input" v-model="dataForm.goodsValue" placeholder="请输入货品价值"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="货品重量:" prop="goodsWeight" class="el-form-flex">
                <el-input type="input" v-model="dataForm.goodsWeight" placeholder="请输入货品重量"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="货运单号:" prop="deliverySn" class="el-form-flex">
                <el-input type="input" v-model="dataForm.deliverySn" placeholder="请输入货运单号"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="预估运费:" prop="estimateFreight" class="el-form-flex">
                <el-input type="number" v-model="dataForm.estimateFreight" placeholder="请输入预估运费"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="货品描述:" prop="goodsDes" class="el-form-flex">
                <el-input v-model="dataForm.goodsDes" type="textarea" :rows="2" placeholder="请输入货品描述"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="注意事项:" prop="precautions" class="el-form-flex">
                <el-input v-model="dataForm.precautions" type="textarea" :rows="2" placeholder="请输入注意事项"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="仓库说明:" prop="warehouseInstructions" class="el-form-flex">
                <el-input v-model="dataForm.warehouseInstructions" type="textarea" :rows="2" placeholder="请输入仓库说明"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
     <!-- 出库仓库弹窗-->
    <el-dialog title="请选择出库仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
    </el-dialog>
    <!--寄送方式-->
    <el-dialog title="请选择寄送方式" :visible.sync="expressVisible" append-to-body>
      <express-selector @closeExpressDialog="closeExpressDialog" :isSingle="true" ref="express"></express-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpress">确 定</el-button>
      </span>
    </el-dialog>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>

    <!-- 新增销售出库弹窗底部 -->
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
        <!--<el-button type="primary" @click="handleAuditBill('1')">撤 销</el-button>-->
        <!--<el-button type="primary">
          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印</router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/wms/bill/entrustStockOut';
  import {pageAll} from '@/api/erp/financial/financialPaymentsMeans';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';

  export default {
    name: "salesStockInView",
    props: ['id', 'dialogFormVisible', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'express-selector': () => import('@/views/erp/financial/components/expressSelector'),
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
          items: [],
        },
        warehouseVisible:false,
        items: [],
        expressVisible:false,
        expressArr:[],
        processId: undefined,
        comment: undefined,
        accountMethodOptions: [],
        transportTypeOptions: [{ value: '0', label: '快递运输' }, { value: '1', label: '运费到付' }, {
          value: '2',
          label: '货物自提'
        },{
          value:'3',
          label:'货运物流'
        }],
        repayConditionOptions: [{value: '1', label: '下月月底结算'}, {value: '2', label: '当天结算'}],
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
      handleExpressDel(){
        this.expressArr = [];
        this.dataForm.expressId = undefined;
        this.dataForm.expressName = undefined;
      },
      //出库仓库
      handleWarehouseSelector() {
        this.warehouseVisible = true
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset()
        this.warehouseVisible = false
      },
      handleWarehouseDel(index) {
        this.dataForm.warehouseArr.splice(index, 1)
        this.dataForm.warehouseId = undefined
        this.dataForm.warehouseName = undefined
        this.$refs.warehouse.reset()
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit()
      },
      closeWarehouseDialog(list) {
        var warehouseArr = []
        for (var i in list) {
          warehouseArr.push({ warehouseId: list[i].id, warehouseName: list[i].name })
        }
        this.dataForm.warehouseArr = warehouseArr
        this.warehouseVisible = false
        if (list.length > 0) {
          this.dataForm.warehouseManagerId = list[0].managerId
          this.dataForm.managerName = list[0].managerName 
          // this.dataForm.warehouseName = list[0].name 
          this.$set(this.dataForm,'warehouseName',list[0].name)
          this.$set(this.dataForm,'warehouseAdress',list[0].province + list[0].city + list[0].country + list[0].address)
          this.$refs.dataForm.validateField('warehouseName')
        }
      },
       closeExpressDialog(list){
        this.expressArr.push({
          expressId:list[0].id,
          expressName:list[0].name
        })
        this.dataForm.expressId = list[0].id;
        this.dataForm.expressName = list[0].name;
        this.expressVisible = false;
      },
      handleSubmitExpress(){
        this.$refs.express.onSubmit()
      },
       handleRepressSelector(){
        this.expressVisible = true;
      },
      handleCancelExpress(){
        this.$refs.express.reset();
        this.expressVisible = false;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 334;
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
             this.dataForm.warehouseArr = [{
                warehouseName:response.data.warehouseName
              }]
              this.expressArr = [{
                expressId:response.data.expressId,
                expressName:response.data.expressName
              }]
            var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
            this.getProcessId(billPrefix);
          });
        pageAll().then(res => {
          this.accountMethodOptions = res.data
        })
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
