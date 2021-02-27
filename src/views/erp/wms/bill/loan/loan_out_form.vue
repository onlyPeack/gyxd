<template>
<!--  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog"-->
<!--             :close-on-click-modal="false" :before-close="handleClose">-->
<!--      <span slot="title" class="con-title">-->
<!--        <svg-icon icon-class="contract"></svg-icon>-->
<!--        <span v-if="!dataForm.id">新增外借单</span>-->
<!--        <span v-if="dataForm.id">编辑外借单</span>-->
<!--        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>-->
<!--      </span>-->
<div>
    <div class="center-container">
      <el-button type="success" @click="handleSubmit" :loading="isFormLoading" plain>提 交</el-button>
      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 5px"></div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm" size="medium " label-width="100px" label-position="right">
        <table class="topTable" style="width: 100%" cellspacing="0">
          <tr>
            <td class="from-item no-border-right">
              <el-form-item label="外借日期:" prop="billDate" class="table-from">
                <el-date-picker v-model="dataForm.billDate" align="left" style="width: 350px" type="date" placeholder="请选择日期"></el-date-picker>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="关联单据:" prop="sourceBillNo" class="el-form-flex">
                <div style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in sourceBillNoArr" :key="tag.billNo"
                          @close="handleSourceBillNoDel">
                    {{tag.billNo}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td class="from-item no-border-right">
              <el-form-item label="申请人:" prop="applierName" class="el-form-flex">
                <div @click.stop="handleApplierUserSelector"
                     style="cursor: pointer;line-height: 36px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in applicantUserArr" :key="tag.id" closable
                          @close="handleApplierUserDel">
                    {{tag.name}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
            <td class="from-item">
              <el-form-item label="申请部门:" prop="conDeptName" class="el-form-flex">
                <div style="cursor: pointer;line-height: 36px;margin-right: 15px;">
                  <el-tag v-for="tag in applicantUserArr" :key="tag.id" :closable="false">
                    {{tag.departName==null?JSON.parse(tag.departId).name:tag.departName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="4" class="from-item no-border-top no-border-bottom">
              <el-form-item label="备注:" prop="note">
                <el-input v-model="dataForm.note" placeholder="请输入内容" style="width: 97%"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit" show-summary :summary-method="getSummaries">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button type="text" size="mini" icon="el-icon-minus"
                     @click="handleValueDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column label="外借仓库:" prop="warehouseName" width="150" align="left">
        <template slot-scope="scope">
          <div @click.stop="handleWarehouseSelector(scope.$index)"
               style="text-align: left;margin-left: 15px;cursor: pointer;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.warehouseArr" :key="tag.warehouseId" closable
                    @close="handleWarehouseDel(scope.$index,tagIndex)">
              {{tag.name}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="positionName" label="仓位" width="150" align="left">
        <template slot-scope="scope">
          <div @click.stop="handleWarehousePositionSelector(scope.$index)"
               style="text-align: left;margin-left: 15px;cursor: pointer;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
            <el-tag v-for="(tag,tagIndex) in scope.row.positionArr" :key="tag.id" closable
                    @close="handleWarehousePositionDel(scope.$index,tagIndex)">
              {{tag.name}}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleProductShow(scope)" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.skuName" @change="handleEdit(scope.$index, scope.row , 'skuName', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
<!--          <span>{{scope.row.skuName}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.brandName" readonly="readonly" disabled
                    class="readonly-el-input"></el-input>
<!--          <span>{{scope.row.brandName}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.seriesName" readonly="readonly" disabled
                    class="readonly-el-input"></el-input>
<!--          <span>{{scope.row.seriesName}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.itemNo" readonly="readonly" disabled
                    class="readonly-el-input"></el-input>
<!--          <span>{{scope.row.itemNo}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="specifications" label="规格型号" width="160">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.specifications" readonly="readonly" class="readonly-el-input" disabled
                    @change="handleEdit(scope.$index, scope.row , 'specifications', $event)"></el-input>
<!--          <span>{{scope.row.specifications}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="unit" label="单位" width="80" align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unit" readonly="readonly" disabled
                    class="readonly-el-input center-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'unit', $event)"></el-input>
<!--          <span>{{scope.row.unit}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="qty" label="外借数量" width="70" align="right" class-name="col-required">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.qty" class="right-el-input"
                    @change="handleEdit(scope.$index, scope.row , 'qty', $event)"
                    @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+2)"
                    :ref="'tableElInput'+(scope.$index*tableElInputNum+2)"></el-input>
<!--          <span>{{scope.row.qty}}</span>-->
        </template>
      </el-table-column>
      <el-table-column prop="expectedReturnDate" label="预计归还日期" width="150">
        <template slot-scope="scope">
          <el-date-picker v-model="scope.row.expectedReturnDate" type="date"
                          placeholder="请选择日期">
          </el-date-picker>
          <span>{{scope.row.expectedReturnDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注">
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

    <!-- 申请人列表弹窗-->
    <el-dialog title="请选择申请人" :visible.sync="applicantUserVisible" append-to-body>
      <purchase-user-selector @closeUserDialog="closeUserDialog" :isSingle="true"
                              ref="applicantUser"></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelApplierUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitApplierUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 外借仓库弹窗-->
    <el-dialog title="请选择外借仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                          ref="warehouse"></warehouse-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 仓位弹窗-->
    <el-dialog title="请选择仓位" :visible.sync="warehousePositionVisible" append-to-body>
      <warehouse-position-selector @closeWarehousePositionDialog="closeWarehousePositionDialog" :isSingle="true"
                                   ref="warehousePosition" :warehouseId="dataForm.warehouseId"
                                   :skuNo="skuNo"></warehouse-position-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehousePosition">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehousePosition">确 定</el-button>
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

<!--    &lt;!&ndash; 新增外界单弹窗底部 &ndash;&gt;-->
<!--    <div slot="footer" class="dialog-footer">-->
<!--      <div v-if="dataForm.billStatus && dataForm.billStatus==1">-->
<!--        &lt;!&ndash;<el-button type="primary" style="float: left;">-->
<!--          <router-link target="_blank" :to="{path:'/print/purchase-order-print',query:{id:id}}">打 印-->
<!--          </router-link>-->
<!--        </el-button>&ndash;&gt;-->
<!--      </div>-->
<!--      <el-button @click="handleClose">取 消</el-button>-->
<!--      <el-button @click="handleTempAddBill()" :loading="isTemporaryLoading">暂 存</el-button>-->
<!--      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading">提 交</el-button>-->
<!--    </div>-->

    <!-- 关联单据 -->
    <purchase-sales-selector :dialogSelectorVisible="dialogSelectorVisible" v-if="dialogSelectorVisible"
                             @submitSelectorSuccess="submitSelectorSuccess"
                             @handleSelectorClose="handleSelectorClose" :sourceBillNo="dataForm.sourceBillNo">
    </purchase-sales-selector>
<!--  </el-dialog>-->
</div>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill} from '@/api/erp/wms/bill/borrowStock';
  import {getObj} from '@/api/admin/user/index';

  export default {
    name: "loanOutForm",
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector'),
      'warehouse-position-selector': () => import('@/components/ERP/Warehouse/WarehousePositionSelector'),
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector'),
      'purchase-sales-selector': () => import('./components/purchaseSalesStockSelector')
    },
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        clickRow:Number,//当前点击表格行索引
        dataForm: {
          id: undefined,
          billNo: undefined,
          billDate: undefined,
          conDeptId: undefined,
          conDeptName: undefined,
          applierId: undefined,
          applierName: undefined,
          note: undefined,
          billStatus: undefined,
          sourceBillNo: undefined,
          sourceObjectKey: undefined,
          items: []
        },
        items: [],
        applicantUserArr: [],
        sourceBillNoArr: [],
        selectedProducts: [],
        customerVisible: false,
        applicantUserVisible: false,
        productVisible: false,
        rules: {
          billDate: [
            {
              required: true,
              message: '请选择外借日期',
              trigger: 'blur'
            }
          ],
          applierName: [
            {
              required: true,
              message: '请选择申请人',
              trigger: 'blur'
            }
          ],
        },
        list: null,
        dialogVisible: false,
        dialogSelectorVisible: false,
        warehouseVisible: false,
        warehousePositionVisible: false,
        skuNo: undefined,
        tableElInputNum: 9,
        warehousePositionIndex: undefined,
        warehouseIndex: undefined
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
          var height = 334;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.94;
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
              this.applicantUserArr = response.data.applicantUserArr;
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
          // this.applicantUserArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.applierId = this.$store.state.user.id;
          this.dataForm.applierName = this.$store.state.user.name;
          getObj(this.$store.state.user.id).then(response => {
            if (response.data.departId.indexOf('{') != -1) {
              this.dataForm.conDeptId = JSON.parse(response.data.departId).id;
              this.dataForm.conDeptName = JSON.parse(response.data.departId).name;
              this.applicantUserArr.push({
                "id": this.$store.state.user.id,
                "name": this.$store.state.user.name,
                "departId": JSON.parse(response.data.departId).id,
                "departName": JSON.parse(response.data.departId).name
              });
            }
          });
          this.handleValueAdd();
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleValueAdd() {
        const d = {
          date: '',
          taxRate: this.defaultTaxRate,
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

        if (row.qty && row.qty != '') {
          if (type == 'qty' || type == 'price' || type == 'taxRate') {
            if (row.price && row.price != '') {
              //金额
              row.amount = Number(row.qty * row.price).toFixed(2);
              this.vueSet(this.items[index], 'amount', row.amount);
            } else {
              this.vueSet(this.items[index], 'amount', '0.00');
              this.vueSet(this.items[index], 'tax', '0.00');
              this.vueSet(this.items[index], 'taxAmount', '0.00');
              this.vueSet(this.items[index], 'unitCost', '0.00');
              return;
            }
          } else if (type == 'amount') {
            //单价
            this.vueSet(this.items[index], 'price', Number(row.amount / row.qty).toFixed(2));
          } else if (type == 'taxPrice') {
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2);
            this.vueSet(this.items[index], 'price', row.price);
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2));
          } else if (type == 'taxAmount') {
            //含税单价
            row.taxPrice = Number(row.taxAmount / row.qty).toFixed(2);
            //this.vueSet(this.items[index], 'taxPrice',row.taxPrice);
            //单价
            row.price = Number(row.taxPrice / (1 + parseInt(row.taxRate) / 100)).toFixed(2);
            this.vueSet(this.items[index], 'price', row.price);
            //金额
            this.vueSet(this.items[index], 'amount', (row.price * row.qty).toFixed(2));
          }
          //税额
          this.vueSet(this.items[index], 'tax', Number(row.amount * parseInt(row.taxRate) / 100).toFixed(2));
          //含税单价
          this.vueSet(this.items[index], 'taxPrice', Number(row.price * (1 + parseInt(row.taxRate) / 100)).toFixed(2));
          //价税合计
          this.vueSet(this.items[index], 'taxAmount', Number(row.taxPrice * row.qty).toFixed(2));
          this.vueSet(this.items, index, this.items[index]);
        }

      },

      // 申请人选择
      handleApplierUserSelector() {
        this.applicantUserVisible = true;
      },
      handleCancelApplierUser() {
        this.$refs.applicantUser.reset();
        this.applicantUserVisible = false;
      },
      handleApplierUserDel(index) {
        this.applicantUserArr.splice(index, 1);
        this.dataForm.applierId = undefined;
        this.dataForm.applierName = undefined;
        this.dataForm.conDeptId = undefined;
        this.dataForm.conDeptName = undefined;
        if (this.$refs.applicantUser) {
          this.$refs.applicantUser.reset();
        }
      },
      handleSubmitApplierUser() {
        this.$refs.applicantUser.onSubmit();
      },
      closeUserDialog(list) {
        this.applicantUserArr = list;
        this.dataForm.conDeptId = JSON.parse(list[0].departId).id;
        this.dataForm.conDeptName = JSON.parse(list[0].departId).name;
        this.applicantUserVisible = false;
        if (list.length > 0) {
          this.dataForm.applierName = list[0].name;
          this.dataForm.applierId = list[0].id;
          this.dataForm.conDeptId = JSON.parse(list[0].departId).id;
          this.dataForm.conDeptName = JSON.parse(list[0].departId).name;
        }
      },

      //外借仓库
      handleWarehouseSelector(index) {
        this.warehouseIndex = index;
        this.warehouseVisible = true;
      },
      handleCancelWarehouse() {
        this.warehouseIndex = undefined;
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },
      handleWarehouseDel(index) {
        this.items[index].warehouseArr.splice(index, 1);
        this.items[index].warehouseId = undefined;
        this.items[index].warehouseName = undefined;
        this.vueSet(this.items, index, this.items[index]);
        if (this.$refs.warehouse) {
          this.$refs.warehouse.reset();
        }
      },
      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },
      closeWarehouseDialog(list) {
        this.items[this.warehouseIndex].warehouseArr = list;
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.items[this.warehouseIndex].warehouseId = list[0].id;
          this.items[this.warehouseIndex].warehouseName = list[0].name;
        }
        this.vueSet(this.items, this.warehouseIndex, this.items[this.warehouseIndex]);
        this.$refs.warehouse.reset();
      },

      //仓位
      handleWarehousePositionSelector(index) {
        if (!this.items[index].warehouseId) {
          this.$message.error('请先选择外借仓库');
          return;
        }
        this.skuNo = this.items[index].skuNo;
        this.warehousePositionIndex = index;
        this.warehousePositionVisible = true;
      },
      handleCancelWarehousePosition() {
        this.warehousePositionIndex = undefined;
        this.$refs.warehousePosition.reset();
        this.warehousePositionVisible = false;
      },
      handleWarehousePositionDel(index, tagIndex) {
        this.items[index].positionArr.splice(tagIndex, 1);
        this.items[index].positionId = undefined;
        this.items[index].positionName = undefined;
        this.vueSet(this.items, index, this.items[index]);
        if (this.$refs.warehousePosition) {
          this.$refs.warehousePosition.reset();
        }
      },
      handleSubmitWarehousePosition() {
        this.$refs.warehousePosition.onSubmit();
      },
      closeWarehousePositionDialog(list) {
        this.items[this.warehousePositionIndex].positionArr = list;
        this.warehousePositionVisible = false;
        if (list.length > 0) {
          this.items[this.warehousePositionIndex].positionId = list[0].id;
          this.items[this.warehousePositionIndex].positionName = list[0].name;
        }
        this.vueSet(this.items, this.warehousePositionIndex, this.items[this.warehousePositionIndex]);
        this.$refs.warehousePosition.reset();
      },

      //商品选择
      handleProductShow(row) {
        this.clickRow=row.$index
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
        //console.log(list);

        this.selectedProducts = list;

        const _this = this;
        const dataMap = _this.data2Map(_this.items);

        // 删除最后一个空行
        //_this.items.splice(_this.items.length - 1, 1);

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
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.skuName = item.goodsName;
          itemObj.qty = 1 + '';
          console.log(this.clickRow,itemObj,this.items[this.clickRow])
          Object.assign(this.items[this.clickRow],itemObj)
          // _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        // for (var j in this.items) {
        //   this.vueSet(this.items, j, this.items[j]);
        // }

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

          if (column.property === 'qty') {
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

      //关联单据选择
      handleSalesOrderSelector() {
        this.dialogSelectorVisible = true;
      },
      handleSelectorClose() {
        this.dialogSelectorVisible = false;
      },
      handleSourceBillNoDel(index) {
        this.sourceBillNoArr.splice(index, 1);
        this.dataForm.sourceBillNo = undefined;
      },
      submitSelectorSuccess(obj) {
        if (obj.isClearAll) {
          this.items = [];
        }
        this.dataForm.sourceObjectKey = obj.sourceObject.key;

        const _this = this;
        const dataMap = _this.data3Map(_this.items);

        // 删除最后一个空行
        _this.items.splice(_this.items.length - 1, 1);

        // 遍历当前选中项
        for (var index in obj.list) {
          var item = obj.list[index];
          if (index == 0) {
            _this.customerArr = item.mainDTO.customerArr;
            _this.dataForm.customerId = item.mainDTO.customerId;
            _this.dataForm.customerName = item.mainDTO.customerName;
            _this.dataForm.sourceBillNo = item.mainDTO.billNo;
            _this.sourceBillNoArr = [{billNo: item.mainDTO.billNo}];
          }
          // 判断data数据中是否有和item.skuNo
          const filter = dataMap[item.id];
          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }
          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.sourceBillId = item.id;
          itemObj.brandId = item.brandId;
          itemObj.brandName = item.brandName;
          itemObj.seriesName = item.seriesName;
          itemObj.itemNo = item.itemNo;
          itemObj.goodsId = item.goodsId;
          itemObj.categoryId = item.categoryId;
          itemObj.factoryId = item.factoryId;
          itemObj.specifications = item.specifications;
          itemObj.unit = item.unit;
          itemObj.skuName = item.skuName;
          itemObj.qty = item.qty + '';
          itemObj.sourceObjectKey = obj.sourceObject.key;
          itemObj.sourceObjectName = obj.sourceObject.name;
          _this.items.push(itemObj);
        }
        // 添加一个空行
        // _this.items.push([]);
        _this.handleValueAdd();

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j]);
        }

        this.dialogSelectorVisible = false;

      },
      async handleSubmit() {
        if (!this.checkItemFuc()) {
          return;
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess');
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

          if (this.items[i].skuNo && this.items[i].skuNo != '') {

            if (!this.items[i].skuName || this.items[i].skuName == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品名称必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 1)].$el.querySelector('input').select();

              return;
            }

            if (!this.items[i].qty || this.items[i].qty == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的商品数量必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

              return;
            }
            if (!this.items[i].warehouseId || this.items[i].warehouseId == '') {
              this.$message.error('第' + (i * 1 + 1) + '行的仓库必填项，请填写了再提交');

              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').focus();
              this.$refs['tableElInput' + (i * this.tableElInputNum + 2)].$el.querySelector('input').select();

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

