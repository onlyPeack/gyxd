<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>商品报价详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                {{dataForm.customerName}}
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="销售员:" prop="salerName" class="el-form-flex">
                {{dataForm.salerName}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                {{dataForm.disabledDate}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-detail">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="180">
        <template slot-scope="scope">
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180" align="center" v-if="dataForm.type != 2">
        <template slot-scope="scope">
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center" v-if="dataForm.type != 2">
        <template slot-scope="scope">
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="180" align="center" v-if="dataForm.type != 2">
        <template slot-scope="scope">
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center" v-if="dataForm.type != 2">
        <template slot-scope="scope">
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="询价数量" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopePrice" label="期望价格" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.hopePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopeDiscount" label="期望折扣" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.hopeDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopeTime" label="期望货期" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.hopeTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="面价" width="150" align="right">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="quotePrice" label="报价单价" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.quotePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryTime" label="货期(天)" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <span>{{scope.row.deliveryTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
        <template slot-scope="scope">
          <span>{{scope.row.note}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 商品报价弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {getObj, auditBill} from '@/api/mall/inquiry/index';

  export default {
    name: "quotationsView",
    props: ['id', 'dialogFormVisible', 'billNo'],
    components: {
      'taskHistory': () => import('@/components/ERP/Task/taskHistory')
    },
    data() {
      return {
        clientHeight: 300,
        dataForm: {
          id: undefined,
          billNo: undefined,
          disabledDate: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        rules: {},
      };
    },
    created() {
      this.init();
      //this.changeDivHeight();
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
          var height = 42;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getObj(this.id).then(response => {
          this.dataForm = response.data.data;
          this.items = response.data.information;
        });
      },
      handleClose() {
        this.$emit('handleClose', false)
      }
    }
  }
</script>
