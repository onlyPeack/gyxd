<template>
  <div width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增闲置库存加点</span>
        <span v-if="dataForm.id">编辑闲置库存加点</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <!-- <div class="association-creation">
        <el-upload class="upload"  v-if="dataForm.type != 2" action="/api/sales/sales-pricing-scheme/import" :before-upload="beforeUpload"
        :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
        style="display:inline;" :on-success="uploadCompleted" :headers="headers">
        <el-button type="text" icon="el-icon-download">
        导入
        </el-button>
        </el-upload>
        <el-button type="text" icon="el-icon-download" v-if="dataForm.type != 2" >
          <a href="/api/sales/sales-pricing-scheme/downTemplate">下载导入模板</a>
        </el-button>
      </div> -->
      <div style="height: 15px"></div>
      <el-button  @click="handleSubmit" :loading="isFormLoading" type="success" plain>提 交</el-button>
      <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 15px"></div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="方案名称:" prop="schemeName" class="el-form-flex">
                <el-input v-model="dataForm.schemeName" placeholder="请输入方案名称"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="单据日期:" prop="billDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.billDate" :disabled="true" align="right" type="datetime"
                                style="width: 200px;" placeholder="请选择日期" value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="生效日期:" prop="effectiveDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.effectiveDate" align="right" type="date"
                                style="width: 200px" placeholder="请选择日期" :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="到期日期:" prop="disabledDate" class="el-form-flex">
                <el-date-picker v-model="dataForm.disabledDate" align="right" type="date"
                                style="width: 200px;" :picker-options="pickerOptionsEnd" placeholder="请选择日期"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
            </td>
          </tr>
          <tr>
             <td width="25%">
              <el-form-item label="加点:" prop="point" class="el-form-flex">
                <el-input v-model="dataForm.point" placeholder="请输入加点(1.01为1个点)"></el-input>
              </el-form-item>
            </td>
            <td width="75%">

            </td>
            <td></td>
            <td></td>
          </tr>
          <!-- <tr>
            <td>
              <el-form-item label="是否批量设置:" class="el-form-flex">
                <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="系列名称:" prop="seriesName" class="el-form-flex" v-if="dataForm.type!=2">
                <div @click="handleSeriesSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;"
                     v-if="dataForm.type=='2'">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                  <el-tag closable @close="handleSeriesDel" v-if="dataForm.seriesName">
                    {{dataForm.seriesName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr> -->
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" v-loading="itemsLoading"
              element-loading-text="正在查询中。。。">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="customerName" label="客户名称" width="300" align="left" class="customer-tag">
        <template slot-scope="scope">
          <div @click="handleCustomerSelector(scope.$index)"
                style="cursor: pointer;line-height: 40px;margin: 0px 15px;text-align: left;height: 40px;overflow: auto;">
                <span>{{scope.row.customerName}}</span>
          <!-- <span>
            <svg-icon icon-class="add"></svg-icon>
          </span> -->
            <!-- <el-tag v-for="(tag,tagIndex) in scope.row.customerArr" :key="tag.id" closable
                    @close="handleCustomerDel(scope.$index,tagIndex)">
              {{tag.customerName}}
            </el-tag> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="customerCode" label="客户编号" width="300" align="left" class="customer-tag"></el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 客户列表弹窗-->
    <el-dialog title="请选择客户" :visible.sync="customerVisible" append-to-body>
      <customer-selector @closeCustomerDialog="closeCustomerDialog" :isSingle="false"
                         ref="customer"></customer-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCustomer">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCustomer">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增客户价格方案弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/sales-contract-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/sales/price/idlePrice';
  import {selectGoodsBySeries} from '@/api/erp/goods/goods';
  import {getToken} from '@/utils/auth';

  export default {
    name: "pricePlanForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
      'series-selector': () => import('../components/seriesSelector')
    },
    props: ['dialogFormVisible', 'typeOptions'],
    data() {
      const validateCustomer = (rule, value, callback) => {
        if (this.dataForm.customerArr && this.dataForm.customerArr.length == 0) {
          callback(new Error('请选择客户'));
        } else {
          callback();
        }
      };
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        pickerOptionsEnd: {
          disabledDate: time => {
            if (this.dataForm.effectiveDate == undefined) {
              return time.getTime() <= new Date().getTime() - 3600 * 1000 * 24
            } else {
              const beginDateVal = new Date(this.dataForm.effectiveDate).getTime() - 3600 * 1000 * 24
              if (beginDateVal) {
                return time.getTime() < beginDateVal
              }
            }

          }
        },
        downloadLoading: false,
        fileList: undefined,
        headers:null,
        scopeIndex: '',
        clientHeight: 300,
        itemsLoading: false,
        isFormLoading: false,
        isTemporaryLoading: false,
        isSwitch: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          schemeName: undefined,
          effectiveDate: undefined,
          disabledDate: undefined,
          customerId: undefined,
          customerName: undefined,
          seriesName: undefined,
          customerArr: [],
          billStatus: undefined,
          items: []
        },
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
        items: [],
        selectedProducts: [],
        customerVisible: false,
        productVisible: false,
        rules: {
          schemeName: [
            {
              required: true,
              message: '请输入方案名称',
              trigger: 'blur'
            }
          ],
          effectiveDate: [
            {
              required: true,
              message: '请选择生效日期',
              trigger: 'blur'
            }
          ],
          disabledDate: [
            {
              required: true,
              message: '请选择失效日期',
              trigger: 'blur'
            }
          ],
          point:[
            {
              required: true,
              message: '请输入加点数',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 3
      };
    },
    created() {
      this.headers={
        Authorization : getToken()
      }
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
      let date = new Date().toLocaleDateString().replace(/\//g, '-');
      this.dataForm.billDate = date + ' 00:00:00';
    },
    updated() {
      this.changeDivHeight();
    },
    watch: {
      'dataForm.effectiveDate'(val) {
        if (this.dataForm.effectiveDate != undefined && this.dataForm.effectiveDate != '') {
          if (this.dataForm.disabledDate !== undefined) {
            if (new Date(val).getTime() <= new Date(this.dataForm.disabledDate).getTime()) {
              return
            } else {
              this.dataForm.disabledDate = undefined;
              this.vueMessage('warning', '失效日期不能小于生效日期');
            }
          }
        }
      },
    },
    methods: {
      handleDownload() {
        this.downloadLoading = true;
        this.items = this.items == undefined || this.items == null ? [] : this.items;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.items));
          tHeader = ['商品名称', '订货号', '规格型号', '面价', '单位', '客户订货折扣', '客户订货价', '安全折扣', '安全价格','备注'];
          filterVal = ['skuName', 'itemNo', 'specifications', 'retailPrice', 'unit', 'customerDiscount', 'customerPrice', 'safeDiscount','safePrice','note'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '价格方案');
          this.downloadLoading = false;
        })
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          if(response.data.length>0){
            this.selectedProducts = response.data;
            const _this = this;
            const dataMap = _this.data2Map(_this.items);

            // 删除最后一个空行
            _this.items.splice(_this.items.length - 1, 1);

            // 遍历当前选中项
            for (var index in this.selectedProducts) {
              var item = this.selectedProducts[index];


              var itemObj = {};
              itemObj.skuNo = item.skuNo;
              itemObj.brandId = item.brandId;
              itemObj.brandName = item.brandName;
              itemObj.seriesName = item.seriesName;
              itemObj.goodsId = item.goodsId;
              itemObj.categoryId = item.categoryId;
              itemObj.factoryId = item.factoryId;
              itemObj.specifications = item.specifications;
              itemObj.referencePrice = item.referencePrice?item.referencePrice:0;
              itemObj.unit = item.unit;
              itemObj.itemNo = item.itemNo;
              itemObj.skuName = item.skuName;
              itemObj.customerPrice = item.customerPrice;
              itemObj.customerDiscount = item.customerDiscount;
              itemObj.retailPrice = item.retailPrice;
              itemObj.safeDiscount = item.safeDiscount;
              itemObj.safePrice = item.safePrice;
              itemObj.note = item.note;
              _this.items.push(itemObj);
              console.log(itemObj);

            }
            // 添加一个空行
            // _this.items.push([]);
            _this.handleValueAdd();

            for (var j in this.items) {
              this.vueSet(this.items, j, this.items[j]);
            }

            this.productVisible = false;
            this.selectedProducts = [];
          }
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
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf('.xls') > 0 || file.name.lastIndexOf('.XLS') > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传文件大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
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
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number);

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number);

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number);

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number);

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number);

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum;

        if (type == 'enter' && number + 1 <= total) {
          number++;
        } else if (type == 'left' && number - 1 > 0) {
          number--;
        } else if (type == 'right' && number + 1 <= total) {
          number++;
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum;
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum;
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus();
        this.$refs['tableElInput' + number].$el.querySelector('input').select();

      },
      init() {
        console.log('触发init');
        console.log(this.id);
        if (!!this.id) {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          this.handleValueAdd();
        }
      },
      handleTypeChange(val) {
        console.log(val);
        this.dataForm.seriesName = undefined;
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {};
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
        if (type == 'customerDiscount') {
          val = Number(val).toFixed(4);
          if (val > 1) {
            this.$message.warning('客户订货折扣不能大于1');
            val = 1.0000;
          }
          if (this.isSwitch) {
            for (var i in this.items) {
              this.vueSet(this.items[i], 'customerDiscount', val);
              if (this.items[i].retailPrice) {
                var price = Number(this.items[i].retailPrice * val).toFixed(2);
                this.vueSet(this.items[i], 'customerPrice', price);
              }
              this.vueSet(this.items, i, this.items[i]);
            }
            return;
          } else {
            this.vueSet(this.items[index], 'customerDiscount', val);
            if (row.retailPrice) {
              var price = Number(row.retailPrice * val).toFixed(2);
              this.vueSet(this.items[index], 'customerPrice', price);
            }
          }
        } else {
          val = Number(val).toFixed(2);
          this.vueSet(this.items[index], 'customerPrice', val);

          if (row.retailPrice) {
            var discount = Number(val / row.retailPrice).toFixed(4);
            this.vueSet(this.items[index], 'customerDiscount', discount);
          }
        }
        console.log('row');
        console.log(row);
        row.customerDifference = row.referencePrice != 0 ? ((Number(row.customerPrice) - Number(row.referencePrice))/row.referencePrice.toFixed(2) * 100).toFixed(2) + '%' : '0%'
        this.vueSet(this.items, index, this.items[index]);
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
        this.dataForm.customerArr.splice(index, 1);
        this.$refs.customer.reset();
      },
      handleSubmitCustomer() {
        this.$refs.customer.onSubmit();
      },
      //商品选择
      handleProductShow() {
        if (this.dataForm.type != '2') {
          this.productVisible = true;
        }
      },
      handleCloseProduct() {
        this.productVisible = false;
        this.selectedProducts = [];
        this.$refs.goodsSelector.reset();
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit();
      },
      closeCustomerDialog(list) {
        console.log('list');
        console.log(list);
        this.selectedProducts = list;
        const _this = this;
        const dataMap = _this.data2Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          console.log('index');
          console.log(index);
          var item = this.selectedProducts[index];


          // // 判断data数据中是否有和item.sckName
          // const filter = dataMap[item.skuNo];

          // // 包含相同数据 根据对象中包含的index值删除指定位置商品
          // if (filter) {
          //   continue;
          // }
          console.log('item');
          console.log(item);
          var itemObj = {};
          itemObj.customerCode = item.customerCode;
          itemObj.customerId = item.id;
          itemObj.customerName = item.customerName;
          itemObj.skuNo = index;
          _this.items.push(itemObj);

        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }
        console.log('items');
        console.log(_this.items);
        this.customerVisible = false;
        this.selectedProducts = [];

        this.$refs.customer.reset();
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
          if (column.property === 'customerPrice') {
            values = data.map(item => Number(item.customerPrice));
          } else if (column.property === 'safePrice') {
            values = data.map(item => Number(item.safePrice));
          }

          if (column.property === 'customerPrice' || column.property === 'safePrice') {
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
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
          }
        })
      },
      dataFormSubmit(_this, subFun, subFunSuccessName, subFunName) {
        _this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (subFunName == 'tempAddBill') {
              _this.isTemporaryLoading = true
            } else {
              _this.isFormLoading = true
            }

            var list = []
            for (var i in _this.items) {
              if(this.dataForm.type == '2'){
                if (_this.items[i].seriesName && _this.items[i].seriesName != '') {
                  list.push(_this.items[i])
                }
              }else{
                if (_this.items[i].customerId && _this.items[i].customerId != '') {
                  list.push(_this.items[i])
                }
              }

            }
            _this.dataForm.items = list
            subFun(_this.dataForm).then(response => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }
              if (response.code == '2000') {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success',
                  duration: 2000
                })
                _this.$emit(subFunSuccessName)
              } else {
                _this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            }).catch(res => {
              if (subFunName == 'tempAddBill') {
                _this.isTemporaryLoading = false
              } else {
                _this.isFormLoading = false
              }
            })
          } else {
            return false
          }
        })
      },
      checkItemFuc() {
        // for (var i in this.items) {
        //   if (this.dataForm.type == '2') {
        //     if (!this.items[i].seriesName || this.items[i].seriesName == '') {
        //       this.$message.error('第' + (i * 1 + 1) + '行的系列名称为必填项，请填写了再提交');
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
        //       return false;
        //     }
        //     if (!this.items[i].customerDiscount || this.items[i].customerDiscount == '') {
        //       this.$message.error('第' + (i * 1 + 1) + '行的客户订货折扣为必填项，请填写了再提交');
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
        //       return false;
        //     }
        //   } else {
        //     if (this.items[i].skuNo && this.items[i].skuNo != '') {
        //       if (!this.items[i].skuName || this.items[i].skuName == '') {
        //         this.$message.error('第' + (i * 1 + 1) + '行的商品名称为必填项，请填写了再提交');
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
        //         return false;
        //       }
        //       if (!this.items[i].customerDiscount || this.items[i].customerDiscount == '') {
        //         this.$message.error('第' + (i * 1 + 1) + '行的客户订货折扣为必填项，请填写了再提交');
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
        //         return false;
        //       }

        //       if (this.dataForm.type == '0') {
        //         if (this.items[i].customerDiscount * 1 < this.items[i].safeDiscount * 1) {
        //           this.$message.error('第' + (i * 1 + 1) + '行的客户订货折扣必须大于安全折扣，请重新填写');
        //           this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
        //           this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
        //           return false;
        //         }
        //       }

        //       if (!this.items[i].customerPrice || this.items[i].customerPrice == '') {
        //         this.$message.error('第' + (i * 1 + 1) + '行的客户订货价为必填项，请填写了再提交');
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus();
        //         this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select();

        //         return false;
        //       }

        //     }
        //   }

        // }
        return true;
      }
    }
  }
</script>
