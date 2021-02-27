<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增供货信息变更单</span>
        <span v-if="dataForm.id">编辑供货信息变更单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="发布类型:" prop="publishType" class="el-form-flex">
                <el-select v-model="dataForm.publishType" style="width: 100%;"
                           @change="handlePublishTypeChange">
                  <el-option v-for="item in publishTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div @click.stop="handleSourceBillNoSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-if="dataForm.sourceBillNo" closable @close="handleSourceBillNoDel()">
                    {{dataForm.sourceBillNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="到货仓库:" prop="warehouseName" class="el-form-flex">
                <el-input v-model="dataForm.warehouseName" readonly="readonly" placeholder="请输入到货仓库"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="渠道类型:" prop="channelType" class="el-form-flex">
                <el-select v-model="dataForm.channelType" style="width: 100%;"
                           @change="$refs.dataForm.validateField('channelType')">
                  <el-option v-for="item in channelTypeOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商编号:" prop="supplierCode" class="el-form-flex">
                <el-input v-model="dataForm.supplierCode" readonly="readonly" placeholder="请输入供应商编号"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商仓库:" prop="supplierWarehouse" class="el-form-flex">
                <el-input v-model="dataForm.supplierWarehouse" readonly="readonly" placeholder="请输入供应商仓库"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="供应商名称:" prop="supplierName" class="el-form-flex">
                <el-input v-model="dataForm.supplierName" readonly="readonly" placeholder="请输入供应商名称"></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商仓库地址:" prop="supplierWarehouseAddress" class="el-form-flex">
                <el-input v-model="dataForm.supplierWarehouseAddress" readonly="readonly" placeholder="请输入供应商地址"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
            <el-form-item label="发布范围:" prop="publishScope" class="el-form-flex">
              <el-select v-model="dataForm.publishScope" style="width: 100%;"
                         @change="$refs.dataForm.validateField('channelType')">
                <el-option v-for="item in scopeTypeOptions" :key="item.value" :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            </td>
            <td>
              <el-form-item label="是否批量设置:" class="el-form-flex">
                <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="备注:" prop="note" class="el-form-flex">
                <el-input v-model="dataForm.note" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <!--<el-table-column width="65">-->
        <!--<template slot-scope="scope">-->
          <!--<el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>-->
          <!--<el-button type="text" size="mini" icon="el-icon-minus"-->
                     <!--@click="handleValueDelete(scope.$index, scope.row)"></el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rebateSeries" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="supplyPrice" label="供货价" width="100" align="right" v-if="dataForm.publishType == '0'?false:true">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="point" label="供货折扣" width="100" align="right" v-if="dataForm.publishType != '0'?false:true">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.point" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.point}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="发布数量(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty"  :class="dataForm.publishType == '0'?'right-el-input':'right-el-input readonly-el-input'"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"  :readonly="dataForm.publishType == '0' ? false:true"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"></el-input>
          <span>{{scope.row.qty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="发布单价(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.price"
                    @change="handleEdit(scope.$index, scope.row , 'price', $event)"  :class="dataForm.publishType == '0'?'right-el-input':'right-el-input readonly-el-input'"
                    @input="handleInputFun($event, scope.row, 'price')" :readonly="dataForm.publishType == '0' ? false:true"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+3)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+3)"></el-input>
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="发布折扣(*)" width="120" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.discount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'discount', $event)"
                    @input="handleInputFun($event, scope.row, 'discount')"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+4)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+4)"></el-input>
          <span>{{scope.row.discount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amountPrice" label="发布总额(*)" width="100" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.amountPrice" class="right-el-input readonly-el-input"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)" :readonly="true"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"></el-input>
          <span>{{scope.row.amountPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deliveryDate" label="货期(天)" width="80" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.deliveryDate" :class="dataForm.publishType == '0'?'right-el-input':'right-el-input readonly-el-input'"
                    @change="handleEdit(scope.$index, scope.row , 'deliveryDate', $event)" :readonly="dataForm.publishType == '0' ? false:true"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+5)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+5)"
                    onKeyPress="if(event.keyCode<48 || event.keyCode>57)event.returnValue=false"></el-input>
          <span>{{scope.row.deliveryDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="validityPeriod" label="信息有效期(*)" width="150" align="left" class-name="col-required">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.validityPeriod" type="date" class="right-el-input"
                          @change="handleEdit(scope.$index, scope.row , 'validityPeriod', $event)"
                          placeholder="请选择"
                          @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+6)"
                          :ref="'tableElInput'+(scope.$index*tableElInputNum+6)">
          </el-date-picker>
          <span>{{scope.row.validityPeriod}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="moqMinOrder" label="最小起订量" width="100" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.moqMinOrder" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.moqMinOrder}}</span>
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
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 到货仓库弹窗-->
    <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse" :selectType="1"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="请选择关联单据" :visible.sync="sourceBillNoVisible" append-to-body width="60%">
      <source-bill-no-selector v-if="sourceBillNoVisible" @closeSourceDialog="closeSourceDialog" :isSingle="true" :publishType="dataForm.publishType"
                          ref="source" :selectType="2"></source-bill-no-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSource">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSource">确 定</el-button>
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

    <!-- 新增采购合同弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/purchase/bill/purchaseGoodsReleaseChange'

  export default {
    name: 'purchaseGoodsReleaseChangeForm',
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'source-bill-no-selector': () => import('./components/sourceBillNoSelector')
    },
    props: ['id', 'dialogFormVisible', 'scopeTypeOptions', 'publishTypeOptions', 'channelTypeOptions'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        fileList: undefined,
        downloadLoading: false,
        headers:null,
        sourceBillNoVisible: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          channelType: undefined,
          publishType: '0',
          note: undefined,
          billStatus: undefined,
          publishScope: undefined,
          supplierWarehouseAddress:undefined,
          items: []
        },
        items: [],
        selectedProducts: [],
        productVisible: false,
        warehouseVisible: false,
        isSwitch: false,
        rules: {
          channelType: [
            {
              required: true,
              message: '请选择渠道类型',
              trigger: 'blur'
            }
          ],
          publishType: [
            {
              required: true,
              message: '请选择发布类型',
              trigger: 'blur'
            }
          ],
          publishScope: [
            {
              required: true,
              message: '请选择发布范围',
              trigger: 'blur'
            }
          ]
        },
        list: null,
        dialogVisible: false,
        tableElInputNum: 6
      }
    },
    created() {
      this.headers={
        // Authorization : getToken()
      }
      this.init()
      this.changeDivHeight()
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight()
      }
    },
    updated() {
      this.changeDivHeight()
    },
    methods: {
      handlePublishTypeChange() {
        this.dataForm.sourceBillNo = undefined;
        this.items = []
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 140
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
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
              itemObj.billNo = item.billNo;
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
              itemObj.moqMinOrder = item.moqMinOrder;
              itemObj.price = item.price;
              itemObj.qty = item.qty;
              itemObj.retailPrice = item.retailPrice;
              itemObj.discount = item.discount;
              itemObj.skuName = item.skuName;
              itemObj.deliveryDate = item.deliveryDate;
              itemObj.customerPrice = item.customerPrice;
              itemObj.customerDiscount = item.customerDiscount;
              itemObj.safeDiscount = item.safeDiscount;
              itemObj.safePrice = item.safePrice;
              itemObj.note = item.note;
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
      changeFocusInput(e, index, number) {
        if (e.keyCode == 37) {
          //console.log('拦截到37');//左
          this.keyboardEvents('left', number)

        } else if (e.keyCode == 38) {
          //console.log('拦截到38');//上
          this.keyboardEvents('up', number)

        } else if (e.keyCode == 39) {
          //console.log('拦截到39');//右
          this.keyboardEvents('right', number)

        } else if (e.keyCode == 40) {
          //console.log('拦截到40');//下
          this.keyboardEvents('down', number)

        } else if (e.keyCode == 13) {
          //console.log('拦截到13');//enter键
          this.keyboardEvents('enter', number)

        }
      },
      keyboardEvents(type, number) {
        var total = this.items.length * this.tableElInputNum

        if (type == 'enter' && number + 1 <= total) {
          number++
        } else if (type == 'left' && number - 1 > 0) {
          number--
        } else if (type == 'right' && number + 1 <= total) {
          number++
        } else if (type == 'up' && number - this.tableElInputNum > 0) {
          number = number - this.tableElInputNum
        } else if (type == 'down' && number + this.tableElInputNum <= total) {
          number = number + this.tableElInputNum
        }

        this.$refs['tableElInput' + number].$el.querySelector('input').focus()
        this.$refs['tableElInput' + number].$el.querySelector('input').select()

      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              response.data.publishType = response.data.publishType.toString();
              this.dataForm = response.data
              if (response.data.items == undefined) {
                this.handleValueAdd()
              } else {
                this.items = response.data.items
              }
            })
        } else {
          this.handleValueAdd()
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        // var date = new Date().toLocaleDateString().replace(/\//g, '-')
        const d = {
          validityPeriod: ''
        }
        this.items.push(d)
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.items.length
        if (ValueIndex === 1) {
          return
        }
        this.items.splice(index, 1)
      },
      handleEdit(index, row, type, val) {
        if (type == 'price') {
          val = (val * 1).toFixed(4)
          this.vueSet(this.items[index], 'price', val)
          this.vueSet(this.items[index], 'discount', Number(val / row.retailPrice).toFixed(4))
          this.vueSet(this.items[index], 'amountPrice', Number(val * row.qty).toFixed(4))
        }else if (type == 'qty') {
          val = (val * 1).toFixed(4)
          this.vueSet(this.items[index], 'amountPrice', Number(val * row.price).toFixed(4))
        } else if (type == 'discount') {
          val = (val * 1).toFixed(4)
          if (this.isSwitch) {
            for (var i in this.items) {
              if (this.items[i].skuNo) {
                this.vueSet(this.items[i], 'discount', val)
                this.vueSet(this.items[i], 'price', Number(val * this.items[i].retailPrice).toFixed(4))
              }
            }
          } else {
            this.vueSet(this.items[index], 'discount', val)
            this.vueSet(this.items[index], 'price', Number(val * row.retailPrice).toFixed(4))
          }
        } else {
          if (this.isSwitch) {
            for (var i in this.items) {
              if (this.items[i].skuNo) {
                this.vueSet(this.items[i], type, val)
              }
            }
          }
        }
        this.vueSet(this.items, index, this.items[index])
      },

      //到货仓库
      handleWarehouseSelector() {
        this.warehouseVisible = true
      },
      handleSourceBillNoSelector(){
        this.sourceBillNoVisible = true
      },
      handleCancelWarehouse() {
        this.$refs.warehouse.reset()
        this.warehouseVisible = false
      },
      handleCancelSource() {
        this.$refs.source.reset()
        this.sourceBillNoVisible = false
      },
      handleWarehouseDel() {
        this.dataForm.warehouseId = undefined
        this.dataForm.warehouseName = undefined
        if (this.$refs.warehouse) {
          this.$refs.warehouse.reset()
        }
      },
      handleSourceBillNoDel() {
        this.dataForm.sourceBillNo = undefined;
        if (this.$refs.source) {
          this.$refs.source.reset()
        }
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit()
      },
      handleSubmitSource() {
        this.$refs.source.onSubmit()
      },
      closeWarehouseDialog(list) {
        this.warehouseVisible = false
        if (list.length > 0) {
          this.dataForm.warehouseId = list[0].id
          this.dataForm.warehouseName = list[0].name
          this.$refs.warehouse.reset()
          this.$refs.dataForm.validateField('warehouseName')
        }
      },
      closeSourceDialog(list) {
        this.items =[];
        this.sourceBillNoVisible = false
        if (list.length > 0) {
          this.dataForm.sourceBillNo = list[0].billNo;
          if(list[0].mainDTO){
            this.dataForm.warehouseId = list[0].mainDTO.warehouseId;
            this.dataForm.sourceId = list[0].id;
            this.dataForm.warehouseName = list[0].mainDTO.warehouseName;
            this.dataForm.channelType = parseInt(list[0].mainDTO.channelType).toString();
            this.dataForm.supplierCode = list[0].mainDTO.supplierCode;
            this.dataForm.supplierName = list[0].mainDTO.supplierName;
            this.dataForm.supplierWarehouse = list[0].mainDTO.supplierWarehouse;
            this.dataForm.supplierWarehouseAddress = list[0].mainDTO.supplierWarehouseAddress;
          }
          this.selectedProducts = list
          const _this = this
          const dataMap = _this.data2Map(_this.items)
          // 删除最后一个空行
          _this.items.splice(_this.items.length - 1, 1)
          // 遍历当前选中项
          for (var index in this.selectedProducts) {
            var item = this.selectedProducts[index]
            // 判断data数据中是否有和item.sckName
            const filter = dataMap[item.skuNo]
            // 包含相同数据 根据对象中包含的index值删除指定位置商品
            if (filter) {
              continue
            }
            var itemObj = {}
            itemObj.skuNo = item.skuNo;
            itemObj.brandId = item.brandId;
            itemObj.brandName = item.brandName;
            itemObj.seriesName = item.seriesName;
            itemObj.goodsId = item.goodsId;
            itemObj.sourceId = item.id;
            itemObj.categoryId = item.categoryId;
            itemObj.factoryId = item.factoryId;
            itemObj.specifications = item.specifications;
            itemObj.unit = item.unit;
            itemObj.itemNo = item.itemNo;
            itemObj.rebateSeries = item.rebateSeries;
            itemObj.retailPrice = item.retailPrice;
            itemObj.price = item.price;
            itemObj.discount = item.discount;
            itemObj.skuName = item.skuName;
            // var date = new Date().toLocaleDateString().replace(/\//g, '-')
            itemObj.validityPeriod = '';
            itemObj.moqMinOrder = 1;
            itemObj.qty = item.qty;
            itemObj.amountPrice = (item.qty * itemObj.price).toFixed(4);
            itemObj.purchasedQty = item.purchasedQty;
            itemObj.deliveryDate = item.deliveryDate;
            itemObj.validityPeriod = item.validityPeriod;
            _this.items.push(itemObj)
          }
          // 添加一个空行
          // _this.items.push([]);
          _this.handleValueAdd()
          for (var j in this.items) {
            this.vueSet(this.items, j, this.items[j])
          }
          this.$refs.source.reset()
          this.$refs.dataForm.validateField('source')
        }
      },
      //商品选择
      handleProductShow() {
        this.productVisible = true
      },
      handleCloseProduct() {
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit()
      },
      closeGoodsDialog(list) {
        this.selectedProducts = list
        const _this = this
        const dataMap = _this.data2Map(_this.items)
        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1)
        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo]
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue
          }
          var itemObj = {}
          itemObj.skuNo = item.skuNo
          itemObj.brandId = item.brandId
          itemObj.brandName = item.brandName
          itemObj.seriesName = item.seriesName
          itemObj.goodsId = item.goodsId
          itemObj.categoryId = item.categoryId
          itemObj.factoryId = item.factoryId
          itemObj.specifications = item.specifications
          itemObj.rebateSeries = item.rebateSeries
          itemObj.unit = item.unit
          itemObj.itemNo = item.itemNo
          itemObj.retailPrice = item.retailPrice + ''
          itemObj.skuName = item.goodsName
          // var date = new Date().toLocaleDateString().replace(/\//g, '-')
          itemObj.validityPeriod = ''
          itemObj.moqMinOrder = 1 + ''
          itemObj.qty = 1 + ''
          _this.items.push(itemObj)
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd()
        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }
        this.productVisible = false
        this.selectedProducts = []
        this.$refs.goodsSelector.reset()
      },
      data2Map(data) {
        let map = {}
        data.forEach(function (item, index) {
          item.index = index
          map[item.skuNo] = item
        })
        return map
      },
      handleSubmit() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return
        }
        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill')
      },
      checkItemFuc() {
        for (var i in this.items) {
          if (this.items[i].skuNo && this.items[i].skuNo != '') {
            if (!this.items[i].skuName || this.items[i].skuName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select()
              return
            }
            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的发布数量为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select()
              return
            }
            if (!this.items[i].price || this.items[i].price == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的发布单价为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 3)].$el.querySelector('input').select()
              return
            }

            if (!this.items[i].discount || this.items[i].discount == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的发布折扣为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 4)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 4)].$el.querySelector('input').select()
              return
            }
            if (!this.items[i].deliveryDate || this.items[i].deliveryDate == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的货期为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 5)].$el.querySelector('input').focus()
              this.$refs['tableElInput' + (i * this.tableElInputNum + 5)].$el.querySelector('input').select()
              return
            }
          }
        }
        return true
      }
    }
  }
</script>
