<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>编辑商品报价</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <el-input v-model="dataForm.customerName" readonly></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="销售员:" prop="salerName" class="el-form-flex">
                <el-input v-model="dataForm.salerName" readonly></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.disabledDate" align="right" type="date"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="批量设置折扣:" prop="discount" class="el-form-flex">
                <el-input v-model="dataForm.discount" placeholder="请输入折扣"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handleDiscountChange"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"   show-summary
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="skuName" label="商品名称" min-width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" readonly="readonly" class="readonly-el-input"></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specModel" label="规格型号" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specModel" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.specModel}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="180" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="询价数量" width="150" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopePrice" label="期望价格" width="150" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.hopePrice" class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.hopePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopeDiscount" label="期望折扣" width="150" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.hopeDiscount" class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.hopeDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hopeTime" label="期望货期" width="150" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.hopeTime" class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.hopeTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="面价" width="150" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" disabled class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.discount" class="right-el-input"
                    @input="handleInputFun($event, scope.row, 'discount')"
                    @change="handleEdit(scope.$index, scope.row, $event,'discount')"></el-input>
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="quotePrice" label="报价单价" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.quotePrice" class="right-el-input"
                    @input="handleInputFun($event, scope.row, 'quotePrice')"
                    @change="handleEdit(scope.$index, scope.row, $event,'quotePrice')"></el-input>
          <span>{{scope.row.quotePrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryTime" label="货期(天)" width="150" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.deliveryTime" class="right-el-input"></el-input>
          <span>{{scope.row.deliveryTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
          <span>{{scope.row.unit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="200">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
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
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {getObj, auditBill} from '@/api/mall/inquiry/index';

  export default {
    name: "quotationsForm",
    props: ['id', 'dialogFormVisible', 'billNo'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          },
        },
        dataForm: {
          id: undefined,
          billNo: undefined,
          disabledDate: undefined,
          billStatus: undefined,
          items: []
        },
        items: [],
        rules: {
          disabledDate: [
            {
              required: true,
              message: '请选择到期日期',
              trigger: 'blur'
            }
          ]
        }
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
          var height = 42;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getObj(this.id).then(response => {
            this.dataForm = response.data.data ? response.data.data : {};
            if (response.data.information == undefined) {
              this.handleValueAdd();
            } else {
              this.items = response.data.information;
            }
          });
        } else {
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleEdit(index, row, val, type) {
        val = Number(val).toFixed(4);
        if (type == 'discount') {
          if (val > 1) {
            this.$message.warning('折扣不能大于1');
            val = 1.00;
          }
          this.vueSet(this.items[index], 'discount', val);
          this.vueSet(this.items[index], 'quotePrice', (val * row.price).toFixed(4));
        } else if (type == 'quotePrice') {
          this.vueSet(this.items[index], 'quotePrice', val);
          this.vueSet(this.items[index], 'discount', (val / row.price).toFixed(4));
        }
      },
      handleDiscountChange(val) {
        val = Number(val).toFixed(4);
        if (val > 1) {
          this.$message.warning('折扣不能大于1');
          val = 1.00;
        }
        this.dataForm.discount = val;
        for (var i in this.items) {
          this.items[i].discount = val;
          this.items[i].quotePrice = (val * this.items[i].price).toFixed(4);
        }
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit();
      },
      dataFormOnSubmit() {
        for (var i in this.items) {
          this.items[i].billStatus = '1';
        }
        this.dataForm.items = this.items;
        this.dataForm.billStatus = '1';

        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isFormLoading = true;
            auditBill(this.dataForm).then(response => {
              this.isFormLoading = false;
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                });
                this.$emit('submitSuccess');
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            })
          }
        });

      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的询价数量为必填项，请填写了再提交');
              return;
            }

            if (!this.items[i].quotePrice || this.items[i].quotePrice == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的报价单价为大于0的数字，请重新填写');
              return;
            }

            if (!this.items[i].deliveryTime || this.items[i].deliveryTime == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的货期为必填项，请填写了再提交');
              return;
            }
          }
        }
        return true;
      },
      //合计逻辑
        getSummaries(param) {
          const {columns, data} = param;
          const sums = [];
          columns.forEach((column, index) => {
            if (index === 0) {
              sums[index] = '总价';
              return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += ' 元';
            } else {
              sums[index] = 'N/A';
            }
          });
        }
    }
  }
</script>
