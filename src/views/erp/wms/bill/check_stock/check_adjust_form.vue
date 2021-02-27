<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增库存调价单</span>
        <span v-if="dataForm.id">编辑库存调价单</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
             <el-form-item label="操作人:" prop="sourceBillNo" class="el-form-flex">
                <div  style="margin-top:5px">
                    {{$store.state.user.name}}
                </div>
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
          <tr>
            <td colspan="2">
              <el-form-item label="是否批量设置:">
                <template v-slot:label>
                  <div style="position: relative;z-index: 2">
                    <span>是否批量设置:</span>
                    <el-tooltip class="item" effect="dark"
                                content="可针对调拨折扣进行批量设置"
                                placement="top-start">
                      <img src="http://hejigy.com.cn/questionMarksBlue.png"/>
                    </el-tooltip>
                  </div>
                </template>

                <el-switch v-model="isBatch" style="float: unset;vertical-align: bottom"></el-switch>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          <div @click.stop="handleBillSelect" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.itemNo"></el-input>
          </div>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="stockQty" label="可调价数量" width="100" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.stockQty" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.stockQty}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="调价数量" width="100" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)" :max="scope.row.qty"></el-input>
        </template>
      </el-table-column>
       <el-table-column prop="newAllocationPrice" label="库存调拨价" width="110" class-name="col-required" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newAllocationPrice" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newAllocationPrice', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          <span>{{scope.row.newAllocationPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="newTransferDiscount" label="调拨折扣" width="110" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.newTransferDiscount" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'newTransferDiscount', $event)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
          <span>{{scope.row.newTransferDiscount}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="grossProfit" label="毛利" width="110" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.grossProfit" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.grossProfit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="grossProfitRate" label="毛利率" width="110" align="right">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.grossProfitRate" readonly="readonly"
                    class="readonly-el-input right-el-input"></el-input>
          <span>{{scope.row.grossProfitRate}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="brandName" label="品牌" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.brandName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.skuName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.skuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="标准系列" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.seriesName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateSeries" label="返点系列" width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.rebateSeries" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.rebateSeries}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
          <span>{{scope.row.specifications}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.itemNo}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" label="归属人" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.ownerName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.ownerName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="retailPrice" label="产品面价" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.retailPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.retailPrice}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="oldAllocationPrice" label="原调拨价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.oldAllocationPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.oldAllocationPrice}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="assessPrice" label="考核价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.assessPrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.assessPrice}}</span>
        </template>
      </el-table-column>
       <el-table-column prop="purchasePrice" label="平均进价" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.purchasePrice" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.purchasePrice}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="source" label="来源" width="160" align="left">
        <template slot-scope="scope">
            <div class="gray">
                <span v-if="scope.row.source == 0">标准ERP</span>
                <span v-if="scope.row.source == 1">和稷ERP</span>
                <span v-if="scope.row.source == 2">调拨库存</span>
                &nbsp;
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="source" label="库存类型" width="140" align="left">
        <template slot-scope="scope">
          <div class="gray">

            <span v-if="scope.row.type == 0">商务备货</span>
            <span v-if="scope.row.type == 1">按订单采购</span>
            <span v-if="scope.row.type == 2">调拨库存</span>
            <span v-if="scope.row.type == 3">线下库存</span>
            &nbsp;
            </div>
        </template>
      </el-table-column>
      <el-table-column prop="crtTime" label="入库时间" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.crtTime" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.crtTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="inDay" label="入库天数" width="120">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.inDay" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.inDay}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehouseName" label="仓库" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.warehouseName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.warehouseName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="warehousePositionName" label="仓位" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.warehousePositionName" readonly="readonly"
                    class="readonly-el-input"></el-input>
          <span>{{scope.row.warehousePositionName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" width="150">
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
    <!-- 关联单据 -->
    <stock-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                            @submitSelectorSuccess="closeGoodsDialog" selectType="1"
                            @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </stock-selector>
    <!-- 新增盘亏出库弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <!--<el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/supplierManager/purchase-contract-print',query:{id:id}}">打 印
          </router-link>
        </el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/checkAdjust';

  export default {
    name: "checkAdjustForm",
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'stock-selector': () => import('./components/stockSelector'),
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        isBatch:false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          note: undefined,
          warehouseArr: undefined,
          warehouseId: undefined,
          warehouseName: undefined,
          items: []
        },
        items: [],
        purchaserUserArr: [],
        supplierArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        supplierVisible: false,
        purchaseUserVisible: false,
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择出库日期',
              trigger: 'blur'
            }
          ],
          warehouseName: [
            {
              required: true,
              message: '请选择出库仓库',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        tableElInputNum: 9,
        warehousePositionIndex: undefined,
        skuNo: undefined,
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
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = this.sourceBillNoArr.join(',');
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      //关联单据选择
      handleBillSelect() {
          this.dialogSelectorVisible = true;
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight;
        } else {
          var height = 129;
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
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.purchaserUserArr = response.data.purchaserUserArr;
              this.supplierArr = response.data.supplierArr;
              if (response.data.sourceBillNo && response.data.sourceBillNo != '') {
                this.sourceBillNoArr = [{billNo: response.data.sourceBillNo}];
              }
              if (response.data.items == undefined) {
                this.handleValueAdd();
              } else {
                this.items = response.data.items;
              }
            });
        } else {
          let date = new Date().toLocaleDateString().replace(/\//g, '-');
          this.dataForm.billDate = date;
          this.dataForm.deliverDate = date;
          this.purchaserUserArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.purchaserId = this.$store.state.user.id;
          this.dataForm.purchaserName = this.$store.state.user.name;
          this.handleValueAdd();
          console.log('dataForm');
          console.log(this.dataForm);
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        var deliverDate = this.dataForm.deliverDate ? this.dataForm.deliverDate : new Date().toLocaleDateString().replace(/\//g, '-');
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
          deliverDate: deliverDate
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

        if(this.isBatch&&type == 'newTransferDiscount'){
          for (let i = 0; i <this.items.length ; i++) {
            if(row.purchasePrice&&this.items[i].itemNo) {
              if(this.$store.state.user.groupNames == '电商销售客服') {
                if(Number(val) * Number(this.items[i].retailPrice) > this.items[i].oldAllocationPrice) {
                  this.$message.warning('业务员仅允许调低')
                  this.vueSet(this.items[i], 'newAllocationPrice', Number(this.items[i].oldAllocationPrice).toFixed(4));
                  this.vueSet(this.items[i], 'newTransferDiscount', Number(this.items[i].newAllocationPrice / this.items[i].retailPrice).toFixed(4));
                } else {
                  this.vueSet(this.items[i], 'newTransferDiscount', Number( val).toFixed(4));
                  this.vueSet(this.items[i], 'newAllocationPrice', Number(this.items[i].retailPrice * val).toFixed(4));
                }
              } else {
                this.vueSet(this.items[i], 'newTransferDiscount', Number( val).toFixed(4));
                this.vueSet(this.items[i], 'newAllocationPrice', Number(this.items[i].retailPrice * val).toFixed(4));
              }
              // 计算毛利
              this.vueSet(this.items[i], 'grossProfit', Number(this.items[i].newAllocationPrice - this.items[i].oldAllocationPrice).toFixed(4));
              // 计算毛利率
              this.vueSet(this.items[i], 'grossProfitRate', (Number(this.items[i].grossProfit/this.items[i].newAllocationPrice)*100).toFixed(4));
              if(this.items[i].grossProfitRate > 5 || this.items[i].grossProfitRate < -5) {
                this.$nextTick(()=>{
                  this.$message.warning(`第${i + 1}行的毛利率已经超过5%`)
                })

              }
            }
          }
        }else if( type == 'qty') {
          if(val > row.stockQty) {
            this.$message.warning('调价数量不能大于可调价数量!')
            val = row.stockQty
            row.qty = row.stockQty
          }
        } else {
          if(row.purchasePrice) {
            if(type == 'newTransferDiscount') {
              if(this.$store.state.user.groupNames == '电商销售客服') {
                if(Number(val) * Number(row.retailPrice) > row.oldAllocationPrice) {
                  this.$message.warning('业务以仅允许调低')
                  this.vueSet(this.items[index], 'newAllocationPrice', Number(row.oldAllocationPrice).toFixed(4));
                  this.vueSet(this.items[index], 'newTransferDiscount', Number(row.newAllocationPrice / row.retailPrice).toFixed(4));
                } else {
                  this.vueSet(this.items[index], 'newTransferDiscount', Number( val).toFixed(4));
                  this.vueSet(this.items[index], 'newAllocationPrice', Number(row.retailPrice * val).toFixed(4));
                }
              } else {
                this.vueSet(this.items[index], 'newTransferDiscount', Number( val).toFixed(4));
                this.vueSet(this.items[index], 'newAllocationPrice', Number(row.retailPrice * val).toFixed(4));
              }
              // 计算毛利
              this.vueSet(this.items[index], 'grossProfit', Number(row.newAllocationPrice - row.oldAllocationPrice).toFixed(4));
              // 计算毛利率
              this.vueSet(this.items[index], 'grossProfitRate', (Number(row.grossProfit/row.newAllocationPrice)*100).toFixed(4));
              if(this.items[index].grossProfitRate > 5 || this.items[index].grossProfitRate < -5) {
                this.$message.warning(`第${index + 1}行的毛利率已经超过5%`)
              }
            } else if (type == "newAllocationPrice") {
              // 业务员仅允许调低
              if(this.$store.state.user.groupNames == '电商销售客服') {
                // 如果调拨价大于原调拨价则调拨价=原调拨价
                if(Number(val) > Number(row.oldAllocationPrice)) {
                  this.$message.warning('业务以仅允许调低')
                  this.vueSet(this.items[index], 'newAllocationPrice', Number(row.oldAllocationPrice).toFixed(4));
                  this.vueSet(this.items[index], 'newTransferDiscount', Number(row.newAllocationPrice / row.retailPrice).toFixed(4));
                } else {
                  this.vueSet(this.items[index], 'newTransferDiscount', Number(val / row.retailPrice).toFixed(4));
                  this.vueSet(this.items[index], 'newAllocationPrice', Number(val).toFixed(4));
                }
              } else {
                this.vueSet(this.items[index], 'newTransferDiscount', Number(val / row.retailPrice).toFixed(4));
                this.vueSet(this.items[index], 'newAllocationPrice', Number(val).toFixed(4));
              }
              // 计算毛利
              this.vueSet(this.items[index], 'grossProfit', Number(row.newAllocationPrice - row.oldAllocationPrice).toFixed(4));
              // 计算毛利率
              this.vueSet(this.items[index], 'grossProfitRate', (Number(row.grossProfit/row.newAllocationPrice)*100).toFixed(4));
              if(this.items[index].grossProfitRate > 5 || this.items[index].grossProfitRate < -5) {
                this.$message.warning(`第${index + 1}行的毛利率已经超过5%`)
              }
            }
          }
        }


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
          itemObj.iid = item.id;
          itemObj.oldAllocationPrice = item.allocationPrice.toFixed(4);
          itemObj.newAllocationPrice = item.allocationPrice.toFixed(4);
          itemObj.assessPrice = item.allocationPrice.toFixed(4);
          itemObj.purchasePrice = item.purchasePrice.toFixed(4);
          itemObj.type = item.type;
          itemObj.ownerName = item.ownerName;
          itemObj.ownerId = item.ownerId;
          itemObj.crtTime = item.crtTime;
          itemObj.inDay = this.$moment(new Date()).diff(this.$moment(itemObj.crtTime),'days' )

          itemObj.purchasePrice = item.purchasePrice;
          itemObj.newTransferDiscount = (item.allocationPrice/item.retailPrice).toFixed(4);
          itemObj.source = item.source;
          itemObj.brandId = item.brandId;
          itemObj.grossProfit = 0;
          itemObj.grossProfitRate = 0;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.rebateSeries = item.rebateSeries;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.retailPrice = item.retailPrice;
          itemObj.skuName = item.skuName;
          itemObj.warehouseName = item.warehouseName;
          itemObj.warehousePositionName = item.warehousePositionName;
          itemObj.stockQty = item.qty - item.lockedQty; // 库存数量,用于控制数量
          itemObj.qty = item.qty - item.lockedQty; // 调价数量
          itemObj.taxRate = _this.defaultTaxRate;
          itemObj.cost = itemObj.price;
          itemObj.unitCost = itemObj.amount;
          itemObj.purchaseAmount = '0.00';
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.productVisible = false;
        this.dialogSelectorVisible = false;
        this.selectedProducts = [];

        // this.$refs.goodsSelector.reset();
      },
      data2Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.skuNo] = item
        });
        return map
      },
      data3Map(data) {
        let map = {};
        data.forEach(function (item, index) {
          item.index = index;
          map[item.sourceBillId] = item
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
          if (column.property === 'qty') {
            values = data.map(item => Number(item.qty));
          }
          if (column.property === 'stockQty') {
            values = data.map(item => Number(item.stockQty));
          }

          if (column.property === 'qty' || column.property === 'stockQty') {
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
        this.dataFormOnSubmit(this, addBill, 'submitSuccess');
      },
      handleTempAddBill() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, tempAddBill, 'submitSuccess', 'tempAddBill');
      },
      checkItemFuc() {
        for (var i in this.items) {

          if (this.items[i].itemNo && this.items[i].itemNo != '') {
            if (!this.items[i].oldAllocationPrice || this.items[i].oldAllocationPrice == '' || this.items[i].oldAllocationPrice == '0.00') {
              this.$message.error('第' + (i * 1 + 1) + '行的平均调拨价为必填项，请填写了再提交')
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();
              return
            }
            if (!this.items[i].newTransferDiscount || this.items[i].newTransferDiscount == '' || this.items[i].newTransferDiscount == '0.00') {
              this.$message.error('第' + (i * 1 + 1) + '行的调拨折扣为必填项，请填写了再提交');
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();
              return false;
            }

          }
        }
        return true;
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .gray {
        background-color: rgb(249, 249, 249);
        text-align: left;
        padding-left: 15px;
    }
</style>
