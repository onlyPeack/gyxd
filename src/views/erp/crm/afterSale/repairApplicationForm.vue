<template>
<!--  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"-->
<!--             :close-on-click-modal="false" :before-close="handleClose">-->
  <div>
<!--      <span slot="title" class="con-title">-->
<!--        <svg-icon icon-class="contract"></svg-icon>-->
<!--        <span v-if="!dataForm.id">新增维修申请</span>-->
<!--        <span v-if="dataForm.id">编辑维修申请</span>-->
<!--        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>-->
<!--      </span>-->
    <el-button @click="handleSubmit" :loading="isFormLoading" plain type="success">提 交</el-button>
    <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
    <div style="height: 15px"></div>
    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium " label-width="120px" label-position="right">
        <table class="topTable" style="width: 100%" cellspacing="0">
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="单据编号:" prop="billNo" class="el-form-flex">
                <el-input v-model="dataForm.billNo" placeholder="自动生成" :readonly="true" disabled></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" align="right" type="date" :readonly="true"
                                tyle="width: 200px">
                </el-date-picker>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="商品名称:" prop="goodsName" class="el-form-flex">
                <el-input v-model="dataForm.goodsName" placeholder="请输入商品名称"
                          @focus="handleProductShow(true)"></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-bottom">
              <el-form-item label="商品型号:" prop="specifications" class="el-form-flex">
                <el-input v-model="dataForm.specifications" placeholder="请输入商品型号"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="商品分类:" prop="goodsCategory" class="el-form-flex">
                <el-input v-model="dataForm.goodsCategory" placeholder="请输入商品分类"></el-input>
                <!--<el-cascader expand-trigger="hover" :options="categoryList" v-model="dataForm.goodsCategory"
                             @change="handleCategoryChange" :change-on-select="true" filterable></el-cascader>-->
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="商品品牌:" prop="goodsBrand" class="el-form-flex">
                <!-- <el-input v-model="dataForm.goodsBrand" placeholder="请输入商品品牌"></el-input>-->
                <el-select v-model="dataForm.goodsBrand">
                  <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value*1">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="客户名称:" prop="customerName" class="el-form-flex">
                <div @click="handleCustomerSelector" style="cursor: pointer;">
                  <el-input v-model="dataForm.customerName" placeholder="请选择客户"></el-input>
                </div>
              </el-form-item>
            </td>
            <td class="from-item no-border-bottom">
              <el-form-item label="客户联系人:" prop="customerLinkman" class="el-form-flex">
                <el-input v-model="dataForm.customerLinkman" placeholder="请选择客户联系人"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="客户联系方式:" prop="customerPhone" class="el-form-flex">
                <el-input v-model="dataForm.customerPhone" placeholder="请输入客户联系方式"></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="故障描述:" prop="faultDescribe" class="el-form-flex">
                <el-input v-model="dataForm.faultDescribe" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="受理备注:" prop="acceptanceRemark" class="el-form-flex">
                <el-input v-model="dataForm.acceptanceRemark"  :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-bottom">
              <el-form-item label="处理结果:" prop="repairResult" class="el-form-flex">
                <el-input v-model="dataForm.repairResult" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="维修方式:" class="el-form-flex" disabled></el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="维修类型:" prop="repairType" class="el-form-flex">
                <el-input v-model="dataForm.repairType" placeholder="请输入维修类型"></el-input>
              </el-form-item>
            </td>
            <td class="from-item no-border-right no-border-bottom">
              <el-form-item label="是否返厂:" prop="backFactory" class="el-form-flex">
                <el-select v-model="dataForm.backFactory" placeholder="请输入是否返厂">
                  <el-option value="是">是</el-option>
                  <el-option value="否">否</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td class="from-item no-border-bottom">
              <el-form-item label="是否申请附件:" prop="attachmentApplication" class="el-form-flex">
                <!--<el-input v-model="dataForm.attachmentApplication" placeholder="请输入是否申请附件"></el-input>-->
                <el-select v-model="dataForm.attachmentApplication" style="width: 100%;"
                           @change="handleAttachmentChange">
                  <el-option v-for="item in attachmentOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="from-item">
              <el-form-item label="备注:" prop="note">
                <el-input v-model="dataForm.note" placeholder="请输入内容" style="width: 97%"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>


    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries" v-if="dataForm.attachmentApplication=='0'">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>


      <el-table-column prop="goodsName" label="附件名称" min-width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow(false)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.goodsName" :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
<!--          <span>{{scope.row.goodsName}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" min-width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly"
                    class="readonly-el-input"></el-input>
<!--          <span>{{scope.row.specifications}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                    class="readonly-el-input center-el-input"></el-input>
<!--          <span>{{scope.row.unit}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="num" label="申请数量" width="100">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.num" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'num', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
<!--          <span>{{scope.row.num}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'price', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
<!--          <span>{{scope.row.price}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="totalSum" label="金额" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.totalSum" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'totalSum', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"></el-input>
<!--          <span>{{scope.row.totalSum}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.note"></el-input>
<!--          <span>{{scope.row.note}}</span>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 15px"></div>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="true" ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="60%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

<!--    &lt;!&ndash; 新增维修申请弹窗底部 &ndash;&gt;-->
<!--    <div slot="footer" class="dialog-footer">-->
<!--      <div v-if="dataForm.billStatus && dataForm.billStatus==1">-->
<!--        &lt;!&ndash;<el-button type="primary" style="float: left;">-->
<!--          打印-->
<!--        </el-button>&ndash;&gt;-->
<!--      </div>-->
<!--      <el-button @click="handleClose">取 消</el-button>-->
<!--      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>-->
<!--      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>-->
<!--    </div>-->
  </div>
<!--  </el-dialog>-->
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/crm/repairApplication';
  import {listCatAndBrand} from '@/api/erp/goods/goods';

  export default {
    name: "repairApplicationForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector')
    },
    props: ['id', 'dialogFormVisible', 'attachmentOptions'],
    watch:{
      id(oldData,newData){
        this.init()
      }
    },
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: new Date(),
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
        items: [],
        purchaserUserArr: [],
        customerArr: [],
        selectedProducts: [],
        customerVisible: false,
        purchaseUserVisible: false,
        productVisible: false,
        rules: {
          customerName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.customerName)
            }, message: '请输入', trigger: 'blur'
          }],
          goodsName: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.goodsName)
            }, message: '请输入', trigger: 'blur'
          }],
          faultDescribe: [{
            required: true, validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.dataForm.faultDescribe)
            }, message: '请输入', trigger: 'blur'
          }],
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 7,
        isSingle: undefined,
        categoryList: [],
        brandList: []
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
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
         // callback(new Error("请输入"))
          callback()
        } else {
          callback();
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 540;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.purchaserUserArr = response.data.purchaserUserArr;
              this.customerArr = response.data.customerArr;
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          this.purchaserUserArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.purchaserId = this.$store.state.user.id;
          this.dataForm.purchaserName = this.$store.state.user.name;
          this.handleValueAdd();
        }

        listCatAndBrand().then(response => {
          this.categoryList = this.getCategoryList(response.data.categoryList);
          this.brandList = response.data.brandList;
        });
      },
      getCategoryList(data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].children.length < 1) {
            data[i].children = undefined;
          } else {
            this.getCategoryList(data[i].children);
          }
        }
        return data;
      },
      handleCategoryChange(value) {
        this.dataForm.goodsCategory = value[value.length - 1]
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          note: ''
        };
        this.items.push(d);
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length;
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(index, row, type, val) {
        if (row.num && row.num != '') {
          if (type == 'num' || type == 'price') {
            if (row.price && row.price != '') {
              //金额
              row.totalSum = Number(row.num * row.price).toFixed(2);
              this.vueSet(this.items[index], 'totalSum', row.totalSum);
            } else {
              this.vueSet(this.items[index], 'totalSum', '0.00');
              return;
            }
          } else if (type == 'totalSum') {
            //单价
            this.vueSet(this.items[index], 'price', Number(row.totalSum / row.num).toFixed(2));
          }
          this.vueSet(this.items, index, this.items[index]);
        }
      },
      handleAttachmentChange() {
        this.items = [];
        this.handleValueAdd();
      },
      // 客户选择
      handleCustomerSelector() {
        this.customerVisible = true;
      },
      handleCancelCustomer() {
        this.$refs.customer.reset();
        this.customerVisible = false;
      },
      handleCustomerDel(index) {
        this.customerArr.splice(index, 1);
        this.dataForm.customerId = undefined;
        this.dataForm.customerName = undefined;
        this.dataForm.customerPhone = undefined;
        this.dataForm.customerLinkman = undefined;
        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      closeCustomerDialog(list) {
        this.customerArr = list;
        this.customerVisible = false;
        if (list.length > 0) {
          this.dataForm.customerId = list[0].id;
          this.dataForm.customerName = list[0].customerName;
          this.dataForm.customerLinkman = list[0].linkMan;
          this.dataForm.customerPhone = list[0].linkPhone;
          this.$refs['dataForm'].validate(valid => {
          });
        }
      },

      //商品选择
      handleProductShow(single) {
        this.isSingle = single;
        this.productVisible = true;
      },
      handleCloseProduct() {
        this.productVisible = false;
        this.selectedProducts = [];
        this.$refs.goodsSelector.reset();
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit();
      },
      closeGoodsDialog(list) {
        if (this.isSingle) {
          this.singleGoods(list);
          return;
        }

        this.selectedProducts = list;
        const _this = this;
        const dataMap = _this.data2Map(_this.items);
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);
        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index];
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.goodsId = item.goodsId;
          itemObj.goodsName = item.goodsName;
          itemObj.goodsBrand = item.brandId;
          itemObj.goodsCategory = item.categoryId;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.price = item.price + '';
          itemObj.num = 1 + '';
          itemObj.totalSum = item.price + '';
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        this.productVisible = false;
        this.selectedProducts = [];
        this.$refs.goodsSelector.reset();
        this.$refs['dataForm'].validate(valid => {
        });
      },
      singleGoods(list) {
        if (list.length == 0) {
          this.productVisible = false;
          return;
        } else if (list.length > 1) {
          this.$message.error('只能选择一个商品');
          return;
        }

        this.dataForm.goodsName = list[0].goodsName;
        this.dataForm.specifications = list[0].specifications;
        this.dataForm.goodsBrand = list[0].brandId;
        this.dataForm.goodsCategory = list[0].categoryId;
        this.productVisible = false;
        this.$refs.goodsSelector.reset();
        this.$refs['dataForm'].validate(valid => {
        });
      },
      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
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
      handleCancel() {
        this.$emit('handleCancelForm');
      },
      async handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        await this.dataFormOnSubmit(this, addBill, 'submitSuccess');
        this.dataForm={}
        this.items=[]
      },
      async handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        await this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
        this.dataForm={}
        this.items=[]
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].goodsId && this.items[i].goodsId != '') {
            if (!this.items[i].goodsName || this.items[i].goodsName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
              return;
            }
            if (!this.items[i].num || this.items[i].num == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品数量必填项，请填写了再提交');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
              return;
            }
            if (!this.items[i].price || this.items[i].price == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品单价必填项，请填写了再提交');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select();
              return;
            }

          }
        }
        return true;
      }
    }
  }
</script>

<style scoped>
  .from-title{
    border: 1px solid #E4E7ED;
    width: 5%;
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    background-color: rgb(234,242,254);
  }
  .from-title-required:before{
    content: '*';
    color: #ff4949;
    margin-right: 4px;
  }
  .from-item{
    width: 25%;
    border: 1px solid #E4E7ED;
    padding: 5px 0;
  }
  .no-border{
    border: 0!important;
  }
  .no-border-left{
    border-left:0
  }
  .no-border-right{
    border-right:0
  }
  .no-border-top{
    border-top:0
  }
  .no-border-bottom{
    border-bottom:0
  }
  .table-from-title{
    display: inline-block;
  }
  .table-from{
    height: 100%;
  }
  .el-form-item{
    margin-bottom: 0!important;
  }
  >>> .el-input__inner{
    border: 0!important;
  }
</style>
