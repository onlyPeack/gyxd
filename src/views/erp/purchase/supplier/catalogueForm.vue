<template>
  <div class="bill-container">
    <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
               :close-on-click-modal="false" :before-close="handleClose" :modal-append-to-body="false" >
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增供货目录</span>
        <span v-if="dataForm.id">编辑供货目录</span>
        <el-upload class="upload"  action="/api/srm/srm-supply-list/import" :before-upload="beforeUpload"
                   :show-file-list="false" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                   style="display:inline;" :on-success="uploadCompleted">
                    <el-button type="text" icon="el-icon-upload2">
                      导入(最多导入500条)
                    </el-button>
                  </el-upload>
                  <el-button type="text" icon="el-icon-download">
                    <a target="_blank" href="/api/srm/srm-supply-list/downTemplate">下载导入模板</a>
                  </el-button>
      </span>

      <div class="center-container">
        <el-form :model="dataForm" :rules="rules" ref="dataForm">
          <table class="topTable">
            <tr>
              <td>
                <el-form-item label="是否批量设置:" class="el-form-flex">
                  <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>

      <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
                class="tb-edit" show-summary :summary-method="getSummaries" v-loading="itemsLoading"
                element-loading-text="正在查询中。。。">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column width="65">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
            <el-button type="text" size="mini" icon="el-icon-minus"
                       @click="handleValueDelete(scope.$index, scope.row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" min-width="180">
          <template slot-scope="scope">
            <div @click.stop="handleProductShow" style="cursor: pointer;">
              <el-input size="mini" suffix-icon="el-icon-more" v-model="scope.row.name"
                        @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                        :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
            </div>
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" min-width="120">
          <template slot-scope="scope">
            <div style="cursor: pointer;">
              <el-input size="mini" sreadonly="readonly"
                        class="readonly-el-input center-el-input" v-model="scope.row.brandName"></el-input>
            </div>
            <span>{{scope.row.brandName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="标准系列" min-width="120">
          <template slot-scope="scope">
            <div style="cursor: pointer;">
              <el-input size="mini" readonly="readonly"
                        class="readonly-el-input center-el-input" v-model="scope.row.seriesName"></el-input>
            </div>
            <span>{{scope.row.seriesName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="seriesName" label="返点系列" min-width="120">
          <template slot-scope="scope">
            <div style="cursor: pointer;">
              <el-input size="mini" readonly="readonly"
                        class="readonly-el-input center-el-input" v-model="scope.row.rebateSeries"></el-input>
            </div>
            <span>{{scope.row.rebateSeries}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="itemNo" label="订货号" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                      class="readonly-el-input center-el-input"></el-input>
            <span>{{scope.row.itemNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="specModel" label="规格型号" width="180" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.specModel" readonly="readonly"
                      class="readonly-el-input center-el-input"></el-input>
            <span>{{scope.row.specModel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="面价" width="80" align="right">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                      class="readonly-el-input center-el-input"></el-input>
            <span>{{scope.row.retailPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.unit" readonly="readonly"
                      class="readonly-el-input center-el-input"></el-input>
            <span>{{scope.row.unit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="minPack" label="起订量" width="80" align="center">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.minPack" readonly="readonly"
                      class="readonly-el-input center-el-input"></el-input>
            <span>{{scope.row.minPack}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="point" label="加价点" width="120" align="right" class-name="col-required">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.point" class="right-el-input"
                      @change="handleEdit(scope.$index, scope.row , 'point', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
            <span>{{scope.row.point}}</span>
          </template>
        </el-table-column>
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


      <!-- 所有商品弹窗-->
      <el-dialog title="所有商品" width="70%" :visible.sync="productVisible" append-to-body class="goodsDialog">
        <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"></goods-selector>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
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
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill,selectListCat} from '@/api/erp/srm/supplyList';
  import {selectGoodsBySeries} from '@/api/erp/goods/goods';
  import {getToken} from '@/utils/auth';

  export default {
    name: "catalogueForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'customer-selector': () => import('@/components/ERP/Customer/customerSelector'),
    },
    props: ['supplierCode', 'dialogFormVisible', 'typeOptions','type'],
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
        headers: null,
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
          supplierCode:undefined,
          type: '0',
          items: []
        },
        items: [],
        selectedProducts: [],
        customerVisible: false,
        productVisible: false,
        seriesVisible: false,
        rules: {
          schemeName: [
            {
              required: true,
              message: '请输入方案名称',
              trigger: 'blur'
            }
          ],
          customerName: [
            {
              required: true,
              validator: validateCustomer,
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
          type: [
            {
              required: true,
              message: '请选择调价类型',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 3
      };
    },
    created() {
      this.headers = {
        Authorization: getToken()
      }
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
      }
    },
    methods: {
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
      handleDownload() {
        this.downloadLoading = true;
        this.items = this.items == undefined || this.items == null ? [] : this.items;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(this.items));
          tHeader = ['商品名称', '订货号', '规格型号', '面价', '单位', '客户订货折扣', '客户订货价', '安全折扣', '安全价格', '备注'];
          filterVal = ['skuName', 'itemNo', 'specifications', 'retailPrice', 'unit', 'customerDiscount', 'customerPrice', 'safeDiscount', 'safePrice', 'note'];
          excel.export_json_to_excel2(tHeader, list, filterVal, '价格方案');
          this.downloadLoading = false;
        })
      },
      uploadCompleted(response, file, fileList) {
        console.log(response);
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          if (response.data.length > 0) {
            this.selectedProducts = response.data.slice(0,500);
            const _this = this;
            const dataMap = _this.data2Map(_this.items);

            // 删除最后一个空行
            _this.items.splice(_this.items.length - 1, 1);

            // 遍历当前选中项
            for (var index in this.selectedProducts) {
              var item = this.selectedProducts[index];
              var itemObj = {};
              itemObj.id = item.id;
              itemObj.brandName = item.brandName;
              itemObj.goodsCode = item.goodsCode;
              itemObj.itemNo = item.itemNo;
              itemObj.minPack = item.minPack;
              itemObj.name = item.name;
              itemObj.point = item.point;
              itemObj.retailPrice = item.retailPrice;
              itemObj.seriesName = item.seriesName;
              itemObj.specModel = item.specModel;
              itemObj.supplierCode = item.supplierCode;
              itemObj.supplierName = item.supplierName;
              itemObj.unit = item.unit;
              _this.items.push(itemObj);

            }
            // 添加一个空行
            // _this.items.push([]);
            // _this.handleValueAdd();

            for (var j in this.items) {
              this.vueSet(this.items, j, this.items[j]);
            }

            this.productVisible = false;
            this.selectedProducts = [];
          }
        } else {
          this.$notify({
            title: '失败',
            message: response.data,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
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
        this.handleValueAdd();
        this.dataForm.supplierCode = this.supplierCode;
      },
      handleTypeChange(val) {
        this.dataForm.seriesName = undefined;
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          customerPrice: undefined,
          customerDiscount: undefined,
          safeDiscount: undefined,
          safePrice: undefined,
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

        val = val.replace(/[^\d.]/g,"");
        if (type == 'point') {
          if (val < 0) {
            this.$message.warning('客户加价点不能小于0');
            val = 1;
          }
          if (this.isSwitch) {
            for (var i in this.items) {
              this.vueSet(this.items[i], 'point', Number(val).toFixed(4));
              this.vueSet(this.items, i, this.items[i]);
            }
            return;
          } else {
            this.vueSet(this.items[index], 'point', Number(val).toFixed(4));
            this.vueSet(this.items, i, this.items[i]);
          }
        }
         this.items.filter(item => {
          return !!item.skuNo
        })
         let tempArr = [];
          tempArr = [...this.items]
          this.items = JSON.parse(JSON.stringify(tempArr))
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
      closeCustomerDialog(list) {
        var customerArr = [];
        if (list.length > 0) {
          for (var i in list) {
            customerArr.push({
              customerId: list[i].id,
              customerName: list[i].customerName,
              customerCode: list[i].customerCode
            });
          }
        }
        this.dataForm.customerArr = customerArr;
        this.customerVisible = false;
        this.$refs['dataForm'].validateField('customerName');
      },

      //系列
      handleSeriesSelector() {
        this.seriesVisible = true;
      },
      handleCancelSeries() {
        this.$refs.series.reset();
        this.seriesVisible = false;
      },
      handleSeriesDel() {
        this.dataForm.seriesName = undefined;
        this.items = [];
        if (this.$refs.series) {
          this.$refs.series.reset();
        }
      },
      handleSubmitSeries() {
        this.$refs.series.onSubmit();
      },
      closeSeriesDialog(list) {
        if (list.length > 0) {
          this.dataForm.seriesName = list[0].name;

          if (this.dataForm.type == 2) {
            this.items[this.scopeIndex].seriesName = list[0].name;
            this.vueSet(this.items, this.scopeIndex, this.items[this.scopeIndex]);
          } else {
            this.itemsLoading = true;
            selectGoodsBySeries(this.dataForm.seriesName).then(response => {
              var list = [];
              if (response.data.length > 0) {
                for (var i in response.data) {
                  var item = response.data[i];
                  var itemObj = {};
                  itemObj.skuNo = item.goodsCode;
                  itemObj.brandId = item.brandId;
                  itemObj.brandName = item.brandName;
                  itemObj.seriesName = item.seriesName;
                  itemObj.goodsId = item.id;
                  itemObj.categoryId = item.categoryId;
                  itemObj.factoryId = item.factoryId;
                  itemObj.specifications = item.specModel;
                  itemObj.unit = item.unit;
                  itemObj.itemNo = item.itemNo;
                  itemObj.skuName = item.name;
                  itemObj.retailPrice = item.retailPrice;
                  itemObj.safeDiscount = item.safeDiscount;
                  itemObj.safePrice = item.safePrice;
                  list.push(itemObj);
                }
              }
              this.items = list;
              this.itemsLoading = false;
            }).catch(() => {
              this.itemsLoading = false;
            })
          }

        }
        this.seriesVisible = false;
      },

      //商品选择
      handleProductShow() {
        if (this.dataForm.type != '2') {
          this.productVisible = true;
        }
      },
      handleSeriesNameShow(val) {
        this.scopeIndex = val;
        this.seriesVisible = true;
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
          itemObj.goodsCode = item.skuNo;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.rebateSeries = item.rebateSeries;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.minPack = item.moqMinOrder;
          itemObj.specModel = item.specifications;
          itemObj.name = item.goodsName;
          itemObj.specifications = item.specifications;
          itemObj.referencePrice = item.referencePrice ? item.referencePrice : 0;
          itemObj.unit = item.unit;
          itemObj.itemNo = item.itemNo;
          itemObj.skuName = item.goodsName;
          itemObj.retailPrice = item.retailPrice;
          itemObj.safeDiscount = item.safeDiscount;
          itemObj.safePrice = item.safePrice;
          itemObj.point = 0.0;
          _this.items.push(itemObj);

        }
        // 添加一个空行
        // _this.handleValueAdd();
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.productVisible = false;
        this.selectedProducts = [];

        this.$refs.goodsSelector.reset();
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
          } else if (column.property === 'point') {
            values = data.map(item => Number(item.point));
          }

          if (column.property === 'customerPrice' || column.property === 'safePrice' || column.property === 'point') {
            sums[index] = values.reduce((prev, curr) => {
              let value = Number(curr);
              if (!isNaN(value)) {
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
      handleCancel() {
        this.$emit('handleCancelForm');
      },
      handleSubmit() {
        // this.items.filter(item => {
        //   return !!item.itemNo
        // })
        //   console.log('items1');
          // console.log(this.items);
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataForm.type=this.type
        this.dataFormSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataForm.type=this.type
        this.dataFormSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
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
              list.push(_this.items[i])
                // if (_this.items[i].skuNo && _this.items[i].skuNo != '') {
                // }
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
        //   console.log(this.items[i]);
        //   if (this.items[i].skuNo && this.items[i].skuNo != '') {
        //     if (!this.items[i].point || this.items[i].point == '') {
        //       this.$message.error('第' + (i * 1 + 1) + '行的加价点为必填项，请填写了再提交');
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
        //       this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
        //       return false;
        //     }
        //   }
        // }
        return true;
      }
    }
  }
</script>
