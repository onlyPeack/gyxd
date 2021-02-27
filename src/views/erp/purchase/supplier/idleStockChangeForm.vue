<template>
  <div
    width="70%"
    @close="handleClose"
    class="billFormDialog"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <span slot="title" class="con-title">
      <svg-icon icon-class="contract"></svg-icon>
      <span v-if="!dataForm.id">新增闲置库存变更单</span>
      <span v-if="dataForm.id">编辑闲置库存变更单</span>
      <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
    </span>

    <div class="center-container">
      <div style="height: 15px"></div>
        <el-button  @click="handleSubmit" :loading="isFormLoading" type="success" plain>提 交</el-button>
        <el-button @click="handleTempAddBill" :loading="isTemporaryLoading" type="primary" plain>暂 存</el-button>
      <div style="height: 15px"></div>
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <!-- <td>
              <el-form-item label="发布类型:" prop="categoryName" class="el-form-flex">
                <el-select
                  v-model="dataForm.categoryName"
                  style="width: 100%;"
                  @change="$refs.dataForm.validateField('categoryName')"
                >
                  <el-option
                    v-for="item in publishTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td> -->
            <td>
              <el-form-item label="关联单据:" prop="acceptanceAccount" class="el-form-flex">
                <div @click.stop="handleIdleReleaseShow"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                </div>
              </el-form-item>
            </td>
          </tr>
          <!-- <tr>
            <td>
              <el-form-item label="供应商:" prop="supplierName" class="el-form-flex">
                <div @click="handleSupplierSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  {{dataForm.supplierName}}
                </div>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="供应商编号:" prop="supplierCode" class="el-form-flex">
                <el-input v-model="dataForm.supplierCode" placeholder="请输入内容"></el-input>
              </el-form-item>
            </td>
          </tr> -->
          <!-- <tr>
            <td>
              <el-form-item label="发布范围:" prop="publishScope" class="el-form-flex">
                <el-select
                  v-model="dataForm.publishScope"
                  style="width: 100%;"
                  @change="$refs.dataForm.validateField('channelType')"
                >
                  <el-option
                    v-for="item in scopeTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="是否批量设置:" class="el-form-flex">
                <el-switch v-model="isSwitch" style="float: left;margin-top: 10px;"></el-switch>
              </el-form-item>
            </td>
          </tr> -->
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

    <el-table
      :data="items"
      border
      highlight-current-row
      width="100%"
      :height="clientHeight"
      show-summary
      :summary-method="getSummaries"
      class="tb-edit"
    >
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="65">
        <template slot-scope="scope">
          <el-button type="text" size="mini" icon="el-icon-plus" @click="handleValueAdd"></el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-minus"
            @click="handleValueDelete(scope.$index, scope.row)"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" width="180">
        <template slot-scope="scope">
          <div @click.stop="handleIdleReleaseShow" style="cursor: pointer;">
            <el-input size="mini" suffix-icon="el-icon-more"
                      v-model="scope.row.name" @change="handleEdit(scope.$index, scope.row , 'name', $event)"
                      @keyup.native="changeFocusInput($event,scope.$index,scope.$index*tableElInputNum+1)"
                      :ref="'tableElInput'+(scope.$index*tableElInputNum+1)"></el-input>
          </div>
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="140"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="specModel" label="品名" width="100"></el-table-column>
      <el-table-column prop="retailPrice" label="面价" width="100">
        <template slot-scope="scope">
          {{scope.row.retailPrice}}
        </template>
      </el-table-column>
      <el-table-column prop="releasePrice" label="采购发布价格" width="100" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.releasePrice"
          @change="handleEdit(scope.$index, scope.row , 'releasePrice', $event)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="releaseDiscount" label="发布折扣" width="100" class-name="col-required">
        <template slot-scope="scope">
          <el-input v-model="scope.row.releaseDiscount"
          @change="handleEdit(scope.$index, scope.row , 'releaseDiscount', $event)"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="seriesName" label="系列" width="100"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="categoryName" label="产品状态" width="100"></el-table-column>
      <el-table-column prop="unit" label="单位" width="100"></el-table-column>
      <el-table-column prop="point" label="采购加点" width="100"></el-table-column>
      <el-table-column prop="releaseQty" label="总发布数量" width="100"></el-table-column>
      <el-table-column prop="productionDate" label="生产日期" width="100"></el-table-column>
      <el-table-column prop="qty" label="库存数量" width="100"></el-table-column>
      <el-table-column prop="lockedQty" label="锁库数量" width="100"></el-table-column>
      <el-table-column prop="minPack" label="最小起订量" width="100"></el-table-column>
      <el-table-column prop="oldReleasePrice" label="原采购发布价格" width="100"></el-table-column>  
      <el-table-column prop="oldSupplyPrice" label="原供应商发布价格" width="100"></el-table-column>
      <el-table-column prop="supplyAmount" label="发布金额" width="100"></el-table-column>
      <el-table-column prop="supplyPrice" label="供货价" width="100"></el-table-column>
      <el-table-column prop="percentage" label="成色" width="100"></el-table-column>
      <el-table-column prop="purchaserName" label="采购员姓名" width="100"></el-table-column>
      <el-table-column prop="purchaserCode" label="采购员编号" width="100"></el-table-column>
      <el-table-column prop="supplierName" label="供应商" width="100"></el-table-column>
      <el-table-column prop="supplierCode" label="供应商编号" width="100"></el-table-column>
      <el-table-column prop="tags" label="标签" width="100"></el-table-column>
      <el-table-column prop="warehouseName" label="仓库名称" width="100"></el-table-column>
      <el-table-column prop="warehouseAdress" label="仓库地址" width="100"></el-table-column>
      <el-table-column prop="validateTime" label="质保期" width="100"></el-table-column>
      <el-table-column prop="warranty" label="有效期" width="100"></el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!-- 到货仓库弹窗-->
    <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
      <warehouse-selector
        @closeWarehouseDialog="closeWarehouseDialog"
        :isSingle="true"
        ref="warehouse"
        :selectType="1"
      ></warehouse-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 闲置库存发布单-->
    <div v-if="idleReleaseShow">
    <el-dialog
      title="所有商品"
      width="60%"
      :visible.sync="idleReleaseShow"
      append-to-body
      class="goodsDialog"
    >
      <idle-release-selector ref="goodsSelector" :isSingle="false" @closeIdleRelease="closeIdleRelease"></idle-release-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseIdleRelease">取 消</el-button>
        <el-button type="primary" @click="handleSubmitIdleRelease">确 定</el-button>
      </span>
    </el-dialog>
    </div>
    <policy-channel-type-select
      v-if="showPolicyChannelTypeSelect"
      :dialogVisible="showPolicyChannelTypeSelect"
      @handleClose="handleClosePublic"
      @handleSubmit="handleSubmitPublic"
    ></policy-channel-type-select>
     <!-- 供应商列表弹窗-->
    <el-dialog title="请选择供应商" :visible.sync="supplierVisible" append-to-body>
      <supplier-selector @closeSupplierDialog="closeSupplierDialog" :isSingle="true" ref="supplier"></supplier-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelSupplier">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSupplier">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getFloat } from "@/utils/util";
import {
  addBill,
  getBill,
  tempAddBill,
} from "@/api/erp/purchase/bill/idleStockChange";

export default {
  name: "purchaseGoodsReleaseForm",
  components: {
    "idle-release-selector": () => import("./components/idleReleaseSelector"),
    'supplier-selector': () => import('@/components/ERP/Supplier/supplierSelector'),
    "warehouse-selector": () =>
      import("@/components/ERP/Warehouse/WarehouseSelector"),
    policyChannelTypeSelect: () =>
      import("@/components/ERP/Purchase/policyChannelTypeSelect"),
  },
  props: ["id", "dialogFormVisible", "channelTypeOptions", "scopeTypeOptions"],
  data() {
    return {
      clientHeight: 300,
      isFormLoading: false,
      isTemporaryLoading: false,
      fileList: undefined,
      downloadLoading: false,
      showPolicyChannelTypeSelect: false, //是否展示渠道类型选择对话框
      headers: null,
      dataForm: {
        id: undefined,
        billNo: undefined,
        warehouseId: undefined,
        warehouseName: undefined,
        channelType: undefined,
        categoryName: "二手商品",
        note: undefined,
        billStatus: undefined,
        publishScope: "发布给所有人",
        items: [],
        purchaserName:this.$store.state.user.name,
        purchaserCode:this.$store.state.user.code,
        purchaserId:this.$store.state.user.id,
        createType:1
      },
      items: [],
      selectedProducts: [],
      idleReleaseShow: false,
      warehouseVisible: false,
      isSwitch: false,
      publishTypeOptions: [
        {
          value: "二手商品",
          label: "二手商品",
        },
        {
          value: "滞销商品",
          label: "滞销商品",
        },
        {
          value: "过饱商品",
          label: "过饱商品",
        },
      ],
      rules: {
        publishScope: [
          {
            required: true,
            message: "请选择发布范围",
            trigger: "blur",
          },
        ],
        warehouseName: [
          {
            required: true,
            message: "请选择到货仓库",
            trigger: "blur",
          },
        ],
        channelType: [
          {
            required: true,
            message: "请选择渠道类型",
            trigger: "blur",
          },
        ],
        categoryName: [
          {
            required: true,
            message: "请选择发布类型",
            trigger: "blur",
          },
        ],
      },
      list: null,
      dialogVisible: false,
      tableElInputNum: 6,
      supplierVisible:false
    };
  },
  created() {
    this.headers = {
      // Authorization : getToken()
    };
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
     // 供应商选择
      handleSupplierSelector() {
        this.supplierVisible = true;
      },
      handleCancelSupplier() {
        this.supplierIndex = undefined;
        this.supplierVisible = false;
        this.$refs.supplier.reset();
      },
      handleSupplierDel(index, tagIndex) {
        this.items[index].supplierId = undefined;
        this.items[index].supplierName = undefined;
        this.vueSet(this.items, index, this.items[index]);

        this.$refs.supplier.reset();
      },
       closeSupplierDialog(list) {
        this.supplierVisible = false
        if (list.length > 0) {
          this.dataForm.supplierName = list[0].supplierName
          this.dataForm.supplierId = list[0].id
          this.dataForm.supplierCode = list[0].supplierCode
        }
      },
      handleSubmitSupplier() {
        this.$refs.supplier.onSubmit();
      },
    getSummaries(param) {
      let qtyArr = [];
      let priceArr = [];
      let totalAmount = 0;
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }

        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          if (column.property == "qty") {
            sums[index] = values
              .reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0)
              .toFixed(4);
            sums[index] += " ";
          }
        } else {
          sums[index] = " ";
        }
      });

      return sums;
    },
    changeDivHeight() {
      if (document.getElementsByClassName("center-container")[0]) {
        var height = document.getElementsByClassName("center-container")[0]
          .clientHeight;
      } else {
        var height = 140;
      }
      if (this.id && this.id != "") {
        height = height + 20;
      }
      this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
    },
    uploadCompleted(response, file, fileList) {
      if (response.code == "2000") {
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success",
          duration: 2000,
        });
        console.log(response.data);
        if (response.data.length > 0) {
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
            itemObj.referencePrice = item.referencePrice
              ? item.referencePrice
              : 0;
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
            console.log(itemObj);
          }
          // 添加一个空行
          // _this.items.push([]);
          _this.handleValueAdd();

          for (var j in this.items) {
            this.vueSet(this.items, j, this.items[j]);
          }

          this.idleReleaseShow = false;
          this.selectedProducts = [];
        }
      } else {
        this.$notify({
          title: "失败",
          message: response.msg,
          type: "warning",
          duration: 2000,
        });
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeUpload(file) {
      const isXLS =
        file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isXLS) {
        this.$message.error("只能上传xls/xlsx表格!");
      }
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
      }
      return isXLS && isLt10M;
    },
    changeFocusInput(e, index, number) {
      if (e.keyCode == 37) {
        //console.log('拦截到37');//左
        this.keyboardEvents("left", number);
      } else if (e.keyCode == 38) {
        //console.log('拦截到38');//上
        this.keyboardEvents("up", number);
      } else if (e.keyCode == 39) {
        //console.log('拦截到39');//右
        this.keyboardEvents("right", number);
      } else if (e.keyCode == 40) {
        //console.log('拦截到40');//下
        this.keyboardEvents("down", number);
      } else if (e.keyCode == 13) {
        //console.log('拦截到13');//enter键
        this.keyboardEvents("enter", number);
      }
    },
    keyboardEvents(type, number) {
      var total = this.items.length * this.tableElInputNum;

      if (type == "enter" && number + 1 <= total) {
        number++;
      } else if (type == "left" && number - 1 > 0) {
        number--;
      } else if (type == "right" && number + 1 <= total) {
        number++;
      } else if (type == "up" && number - this.tableElInputNum > 0) {
        number = number - this.tableElInputNum;
      } else if (type == "down" && number + this.tableElInputNum <= total) {
        number = number + this.tableElInputNum;
      }

      this.$refs["tableElInput" + number].$el.querySelector("input").focus();
      this.$refs["tableElInput" + number].$el.querySelector("input").select();
    },
    init() {
      console.log('初始化');
      console.log(this.id);
      if (!!this.id) {
        getBill(this.id).then((response) => {
          this.dataForm = response.data;
          if (response.data.items == undefined) {
            this.handleValueAdd();
          } else {
            this.items = response.data.items;
          }
        });
      } else {
        console.log('add');
        this.handleValueAdd();
      }
    },
    handleClose() {
      this.$emit("handleClose", false);
    },
    handleValueAdd() {
      // var date = new Date().toLocaleDateString().replace(/\//g, '-')
      const d = {
      };
      this.items.push(d);
    },
    handleValueDelete(index, r) {
      let ValueIndex = this.items.length;
      if (ValueIndex === 1) {
        return;
      }
      this.items.splice(index, 1);
    },
    handleEdit(index, row, type, val) {
      if (type == "releasePrice") {
        val = (val * 1).toFixed(4);
        this.vueSet(this.items[index], "releasePrice", val);
        this.vueSet(
          this.items[index],
          "releaseDiscount",
          Number(val / row.retailPrice).toFixed(4)
        );
      } else if (type == "releaseDiscount") {
        val = (val * 1).toFixed(4);
        this.vueSet(this.items[index], "releaseDiscount", val);
        this.vueSet(
          this.items[index],
          "releasePrice",
          Number(val * row.retailPrice).toFixed(4)
        );
      }
      this.vueSet(this.items, index, this.items[index]);
    },

    //到货仓库
    handleWarehouseSelector() {
      this.warehouseVisible = true;
    },
    handleCancelWarehouse() {
      this.$refs.warehouse.reset();
      this.warehouseVisible = false;
    },
    handleWarehouseDel() {
      this.dataForm.warehouseId = undefined;
      this.dataForm.warehouseName = undefined;
      this.dataForm.warehouseAddress = undefined;
      if (this.$refs.warehouse) {
        this.$refs.warehouse.reset();
      }
    },
    handleSubmitWarehouse() {
      this.$refs.warehouse.onSubmit();
    },
    closeWarehouseDialog(list) {
      this.warehouseVisible = false;
      if (list.length > 0) {
        this.dataForm.warehouseId = list[0].id;
        this.dataForm.warehouseName = list[0].name;
        this.dataForm.warehouseAddress = list[0].address;
        this.$refs.warehouse.reset();
        this.$refs.dataForm.validateField("warehouseName");
      }
    },

    //商品选择
    handleIdleReleaseShow() {
      this.idleReleaseShow = true;
    },
    handleCloseIdleRelease() {
      this.idleReleaseShow = false;
      this.selectedProducts = [];
      this.$refs.goodsSelector.reset();
    },
    handleSubmitIdleRelease() {
      this.$refs.goodsSelector.onSubmit();
    },
    closeIdleRelease(list) {
      console.log('list');
      console.log(list);
      //console.log(list);
      this.selectedProducts = list;
      const _this = this;
      const dataMap = _this.data2Map(_this.items);
      // 删除最后一个空行
      _this.items.splice(_this.items.length - 1, 1);
      // 遍历当前选中项
      for (var index in this.selectedProducts) {
        var item = this.selectedProducts[index];
        var itemObj = {};
        itemObj.billNo = item.billNo;
        itemObj.billStatus = item.billStatus;
        itemObj.brandName = item.brandName;
        itemObj.categoryName = item.categoryName;
        itemObj.discount = item.discount;
        itemObj.goodsCode = item.goodsCode;
        itemObj.itemNo = item.itemNo;
        itemObj.lockedQty = item.lockedQty;
        itemObj.masterId = item.masterId;
        itemObj.minPack = item.minPack;
        itemObj.name = item.name;
        itemObj.oldSupplyPrice = item.releasePrice;
        itemObj.oldDiscount = (Number(item.releasePrice)/Number(item.retailPrice)).toFixed(4);
        itemObj.percentage = item.percentage;
        itemObj.point = item.point;
        itemObj.productionDate = item.productionDate;
        itemObj.purchaserName = item.purchaserName;
        itemObj.purchaserCode = item.purchaserCode;
        itemObj.purchaserId = item.purchaserId;
        itemObj.putawayStatus = item.putawayStatus;
        itemObj.qty = item.qty;
        itemObj.releasePrice = item.releasePrice;
        itemObj.releaseDiscount = (Number(item.releasePrice)/Number(item.retailPrice)).toFixed(4);
        itemObj.oldReleaseDiscount = (Number(item.releasePrice)/Number(item.retailPrice)).toFixed(4);
        itemObj.oldReleasePrice = item.releasePrice;
        itemObj.releaseQty = item.releaseQty;
        itemObj.retailPrice = item.retailPrice;
        itemObj.seriesName = item.seriesName;
        itemObj.sourceItemId = item.id;
        itemObj.specModel = item.specModel;
        itemObj.supplierName = item.supplierName;
        itemObj.supplierCode = item.supplierCode;
        itemObj.supplyPrice = item.supplyPrice;
        itemObj.supplyAmount = item.supplyPrice * item.releaseQty;
        itemObj.tags = item.tags;
        itemObj.unit = item.unit;
        itemObj.warranty = item.warranty;
        itemObj.validateTime = item.validateTime;
        itemObj.warehouseName = item.warehouseName;
        itemObj.warehouseAdress = item.warehouseAdress;
        itemObj.warehouseId = item.warehouseId;
        itemObj.crtUserName = item.crtUserName;
        itemObj.crtTime = item.crtTime;
        itemObj.crtUserNo = item.crtUserNo;
        itemObj.picUrls = item.picUrls;
        _this.items.push(itemObj);
      }
      // 添加一个空行
      // _this.items.push([]);
      _this.handleValueAdd();

      for (var j in this.items) {
        this.vueSet(this.items, j, this.items[j]);
      }

      this.idleReleaseShow = false;
      this.selectedProducts = [];
      this.$refs.goodsSelector.reset();
    },
    data2Map(data) {
      let map = {};
      data.forEach(function (item, index) {
        item.index = index;
        map[item.skuNo] = item;
      });
      return map;
    },
    handleSubmit() {
      if (!this.checkItemFuc()) {
        return;
      }
      this.dataFormOnSubmit(this, addBill, "submitSuccess");
    },
    handleTempAddBill() {
      if (!this.checkItemFuc()) {
        return;
      }
      this.dataFormOnSubmit(this, tempAddBill, "submitSuccess", "tempAddBill");
    },
    dataFormOnSubmit(_this, subFun, subFunSuccessName, subFunName) {
      _this.$refs['dataForm'].validate(async (valid) => {
      if (valid) {
        if (subFunName == 'tempAddBill') {
          _this.isTemporaryLoading = true;
        } else {
          _this.isFormLoading = true;
        }

        var list = [];
        for (var i in _this.items) {
          if( _this.items[i].billNo) {
            list.push(_this.items[i]);
          }
        }
        _this.dataForm.items = list;
        await subFun(_this.dataForm).then(response => {
          if (subFunName == 'tempAddBill') {
            _this.isTemporaryLoading = false;
          } else {
            _this.isFormLoading = false;
          }
          if (!response) {
            return;
          }

          if (response.code == '2000') {
            _this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            _this.$emit(subFunSuccessName);
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
            _this.isTemporaryLoading = false;
          } else {
            _this.isFormLoading = false;
          }
        })
      } else {
        return false;
      }
    })
  },
    checkItemFuc() {
      for (var i in this.items) {
        if (this.items[i].skuNo && this.items[i].skuNo != "") {
          if (!this.items[i].skuName || this.items[i].skuName == "") {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的商品名称必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 1)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 1)].$el
              .querySelector("input")
              .select();

            return;
          }

          if (!this.items[i].qty || this.items[i].qty == "") {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的发布数量为必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 2)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 2)].$el
              .querySelector("input")
              .select();

            return;
          }

          if (!this.items[i].price || this.items[i].price == "") {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的发布单价为必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 3)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 3)].$el
              .querySelector("input")
              .select();

            return;
          }

          if (!this.items[i].discount || this.items[i].discount == "") {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的发布折扣为必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 4)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 4)].$el
              .querySelector("input")
              .select();

            return;
          }

          if (!this.items[i].deliveryDate || this.items[i].deliveryDate == "") {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的货期为必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 5)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 5)].$el
              .querySelector("input")
              .select();

            return;
          }

          if (
            !this.items[i].validityPeriod ||
            this.items[i].validityPeriod == ""
          ) {
            this.$message.error(
              "第" + (i * 1 + 1) + "行的信息有效期为必填项，请填写了再提交"
            );

            this.$refs["tableElInput" + (i * this.tableElInputNum + 5)].$el
              .querySelector("input")
              .focus();
            this.$refs["tableElInput" + (i * this.tableElInputNum + 5)].$el
              .querySelector("input")
              .select();

            return;
          }
        }
      }
      return true;
    },

    /**
     * 关闭渠道类型选择对话框
     */
    handleClosePublic() {
      this.showPolicyChannelTypeSelect = false;
      //this.showDialog=false
    },

    /**
     * 从子组件中接收的提交方法
     * @param list
     */
    handleSubmitPublic(list) {
      if (list.type === "policyChannelType") {
        this.showPolicyChannelTypeSelect = false;
        this.$set(this.dataForm, "channelTypeName", list.arr.name);
        this.dataForm.channelType = list.arr.code;
        this.$refs["dataForm"].validateField("channelTypeName");
      }
    },
  },
};
</script>
