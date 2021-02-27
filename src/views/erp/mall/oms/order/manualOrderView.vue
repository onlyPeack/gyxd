<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>手工下单详情</span>
          <el-upload class="upload" action="/api/goods/storage/create" v-if="processId && processId!='' && taskType=='now'"
                   :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                   style="display:inline;" :on-success="uploadCompleted">
          <el-button type="text" icon="el-icon-download">
            导入合同
          </el-button>
        </el-upload>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="客户编号:" prop="customerCode" class="el-form-flex">
                {{dataForm.customerCode}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                {{dataForm.billDate}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="业务员:" prop="salesmanName" class="el-form-flex">
                {{dataForm.salesmanName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="寄件方式:" prop="distributionMode" class="el-form-flex">
                <template slot-scope="scope">
                <div v-for="(item,index) in distributionOptions" :key="index">
                    <span v-if="item.value==dataForm.distributionMode">{{item.label}}</span>
                </div>
                </template>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="收货人:" prop="receiverName" class="el-form-flex">
                {{dataForm.receiverName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="联系电话:" prop="receiverPhone" class="el-form-flex">
                {{dataForm.receiverPhone}}
              </el-form-item> 
            </td>
          </tr>
          <tr>
              <td>
                <el-form-item label="省份/直辖市:" prop="receiverProvince" class="el-form-flex">
                {{dataForm.receiverProvince}}
              </el-form-item> 
              </td>
              <td>
                <el-form-item label="城市:" prop="receiverCity" class="el-form-flex">
                {{dataForm.receiverCity}}
              </el-form-item> 
              </td>
          </tr>
          <tr>
              <td>
                <el-form-item label="区:" prop="receiverRegion" class="el-form-flex">
                {{dataForm.receiverRegion}}
              </el-form-item> 
              </td>
              <td>
                <el-form-item label="收货地址:" prop="deliverDetailAddress" class="el-form-flex">
                {{dataForm.deliverDetailAddress}}
              </el-form-item> 
              </td>
          </tr>
          <tr>
              <td colspan="2">
              <el-form-item label="下单方式:" prop="createType" class="el-form-flex">
                <template>
                  <div v-for="(item,index) in createOption" :key="index">
                    <span v-if="item.value==dataForm.createType">{{item.label}}</span>
                  </div>
                </template>
              </el-form-item>
              </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="是否代发:" prop="isReplaceDelivery" class="el-form-flex">
                <span v-if="dataForm.isReplaceDelivery == 0">否</span>
                <span v-if="dataForm.isReplaceDelivery == 1">是</span>
              </el-form-item> 
            </td>
            <td>
              <el-form-item label="代发公司:" prop="replaceDeliveryCompany" class="el-form-flex">
                {{dataForm.replaceDeliveryCompany}}
              </el-form-item> 
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="代发联系人:" prop="replaceLinkMan" class="el-form-flex">
                {{dataForm.replaceLinkMan}}
              </el-form-item> 
            </td>
            <td>
              <el-form-item label="代发联系电话:" prop="replaceLinkPhone" class="el-form-flex">
                {{dataForm.replaceLinkPhone}}
              </el-form-item> 
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- items2 -->
    <el-table
      :data="items2"
      border
      highlight-current-row
      width="100%"
      :height="clientHeight"
      v-if="dataForm.createType == 2"
      class="tb-edit"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="180"></el-table-column>
      <el-table-column prop="crtTime" label="单据时间" width="180"></el-table-column>
      <el-table-column prop="productName" label="商品名称" width="180"></el-table-column>
      <!-- <el-table-column prop="productSkuCode" label="商品编码" width="180"></el-table-column> -->
      <el-table-column prop="sp1" label="订货号" width="180"></el-table-column>
      <el-table-column prop="sp2" label="型号" width="180"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="180"></el-table-column>
      <el-table-column prop="productPrice" label="销售价" width="180"></el-table-column>
      <el-table-column prop="quantity" label="库存总数量" width="180"></el-table-column>
      <el-table-column prop="promptQty" label="现货数量" width="180"></el-table-column>
      <el-table-column prop="synergyQty" label="调拨数量" width="180"></el-table-column>
      <el-table-column prop="futuresQty" label="期货数量" width="180"></el-table-column>
    </el-table>  
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="source == '2' ? '调拨' : '现货'" label="渠道类型" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.source == '0'">现货</span>
          <span v-if="scope.row.source == '1'">期货</span>
          <span v-if="scope.row.source == '2'">调拨</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" width="180" align="center"></el-table-column>
      <el-table-column prop="productBrand" label="品牌" width="180" align="center"></el-table-column>
      <el-table-column prop="productSeries" label="系列" width="150" align="center"></el-table-column>
      <el-table-column prop="sp2" label="规格型号" width="150" align="center"></el-table-column>
      <el-table-column prop="sp1" label="订货号" width="120" align="center"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="120" align="center" class="col-required">
       
      </el-table-column>
      <el-table-column prop="allocationDiscount" label="调拨折扣" width="120" align="center"></el-table-column>
      <el-table-column prop="allocationPrice" label="调拨价" width="120" align="center" class="col-required">
       
      </el-table-column>
      <el-table-column prop="discount" label="销售折扣" width="120" align="center"></el-table-column>
      <el-table-column prop="productPrice" label="销售价" width="120" align="center" class="col-required">
      
      </el-table-column>
      <el-table-column prop="productQuantity" label="购买数量" width="120" align="center"></el-table-column>
      <el-table-column prop="subtotal" label="计税合计" width="120" align="center" class="col-required">
      
      </el-table-column>
      <el-table-column prop="referencePrice" label="参考价" width="120" align="center"></el-table-column>
      <el-table-column prop="deliveryWarehouse" label="仓库" align="right" width="120"></el-table-column>
    </el-table>
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                  :billNo="dataForm.billNo"></task-history>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 新增实际回款弹窗底部 -->
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
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/mall/oms/order/manualOrder';
  import {getObj} from '@/api/admin/user/index';
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {uploadPath,downloadPath} from '@/api/erp/goods/storage';

  export default {
    name: "financial-sales-receivables-view",
    props: ['id', 'dialogFormVisible', 'paymentsMeansOptions', 'taskType', 'step'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        uploadPath,
        attachmentList: [],
        clientHeight: 300,
        isRejectLoading: false,
        isAgreeLoading: false,
        fileList: undefined,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          expenditureType: undefined,
          acceptanceStaffCode: undefined,
          acceptanceStaffName: undefined,
          receiveMoney:0,
          items: [],
        },
        items: [],
        createOption:[
          { 
            value: 0,
            label: "商城订单" 
          },
          { 
            value: 1,
            label: "手工订单" 
          },
          { 
            value: 2,
            label: "企业购订单" 
          },
        ],
      distributionOptions: [
        { 
          value: "0",
          label: "快递运输" 
        },
        { 
          value: "1",
          label: "运费到付"
        },
        {
          value: "2",
          label: "货物自提"
        },
        {
          value: "3",
          label: "货运物流"
        }
      ],
        processId: undefined,
        comment: undefined,
        rules: {},
        typeOptions: [
          {
            value: '0',
            label: '纸质承兑',
          },
          {
            value: '1',
            label: '电子承兑',
          }
        ],
      };
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          this.dataForm.fileName = response.data.name;
          this.dataForm.fileUrl = response.data.url;
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleAttachmentDownLoad(url) {
        const ele = document.createElement('a');
        ele.setAttribute('href', downloadPath(url)); //设置下载文件的url地址
        ele.click();
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 293;
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
            this.dataForm.customerName = response.data.memberUsername
            this.dataForm.customerCode = response.data.customer
            this.items = response.data.items;
            this.items2 = response.data.items2;
            // this.items.forEach(item => {
            //   this.dataForm.receiveMoney += item.receiveMoney
            // })
            if (response.data.attachment && response.data.attachment != "[null]" && response.data.attachment != '"[null]"') {
              this.attachmentList = JSON.parse(response.data.attachment);
            } else {
              this.attachmentList = [];
            }
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
      let { columns, data } = param;
      let sums = [];
      let values = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property === "productQuantity") {
          values = data.map(item => Number(item.productQuantity));
        } else if (column.property === "subtotal") {
          values = data.map(item => Number(item.subtotal));
        } 

        if (
          column.property === "productQuantity" ||
          column.property === "subtotal"
        ) {
          sums[index] = values
            .reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
                return getFloat(prev + curr, 4);
              } else {
                return prev;
              }
            }, 0)
            .toFixed(4);

          sums[index] += " ";
        } else {
          sums[index] = " ";
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
        if(val != '驳回' && !this.dataForm.fileUrl) {
          this.$message.warning('请先上传合同')
        } else {
          this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
        }
      }
    }
  }
</script>
