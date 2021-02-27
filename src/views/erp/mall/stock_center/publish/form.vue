<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="customerOrderDialog"
             :close-on-click-modal="false" :before-close="handleClose">
    <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span v-if="!dataForm.id">新增库存发布</span>
        <span v-if="dataForm.id">库存发布详情</span>
        <span class="cont-title-billNo" v-if="dataForm.id">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" :rules="rules" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="单据日期:" prop="crtTime" class="el-form-flex">
                <el-input v-model="dataForm.crtTime" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="创建人:" prop="crtUserName" class="el-form-flex">
                <el-input v-model="dataForm.crtUserName" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <!--<td>
              <el-form-item label="发布周期:" prop="publicCircle" class="el-form-flex">
                <el-input-number :controls="false" :min="1" :max="365" v-model="dataForm.publicCircle" style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </td>-->
            <td colspan="2">
              <el-form-item label="发布企业:" prop="targetCompany" class="el-form-flex">
                <div @click.stop="handleTargetCompanySelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                  </span>
                  <el-tag v-for="tag in targetCompanyArr" :key="tag.id" closable
                          @close="handleTargetCompanyDel">
                    {{tag.companyName}}
                  </el-tag>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="批处理:" class="el-form-flex">
                <el-switch style="margin-top: 10px;" v-model="batchPercent" active-text="是"
                           inactive-text="否"></el-switch>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发布比例:" class="el-form-flex">
                <el-input-number :disabled="!batchPercent" :controls="false" :min="0" :max="1" :precision="2"
                                 v-model="publishPercent" style="width: 100%"></el-input-number>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td >
              <el-form-item label="发布方式:" prop="publicType" class="el-form-flex">
                <el-select v-model="dataForm.publicType" style="width: 100%;" @change="publicBtn">
                  <el-option v-for="item in publicOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
            <td v-if="dataForm.publicType != 2">
              <el-form-item label="选择产品:" class="el-form-flex">
                <!-- <el-button type="primary" @click="handleGoodsSelector">调入</el-button>-->
                <div @click.stop="handleGoodsSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <span>
                    <svg-icon icon-class="add"></svg-icon>
                    调入
                  </span>
                </div>
              </el-form-item>
            </td>
          </tr>

        </table>
      </el-form>
    </div>
    <div style="color: red;">产品调入最多添加200条</div>
    <br/>
    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight"
              class="tb-edit">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="text" class="operator-delete" icon="el-icon-delete"
                     @click="handleDelProductItem(scope.$index)"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="skuName" label="品名" min-width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="100"></el-table-column>
      <el-table-column prop="skuSeries" label="系列" min-width="100"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" min-width="100"></el-table-column>
      <el-table-column prop="specifications" label="型号" min-width="100"></el-table-column>
      <!--      <el-table-column prop="marketPrice" label="面价" min-width="100"></el-table-column>-->
      <el-table-column prop="stockNum" label="可用库存" width="120"></el-table-column>
      <el-table-column label="发布比例" width="80">
        <template slot-scope="scope">
          <el-input-number v-if="!batchPercent" :controls="false" :min="0" :max="1" size="mini"
                           v-model="scope.row.publishPercent" @change="handleChangePercent(scope.$index, $event)">
          </el-input-number>
          <span v-else>{{scope.row.publishPercent}}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布数量" width="80">
        <template slot-scope="scope">
          <el-input v-if="!batchPercent" size="mini" v-model="scope.row.publicNum"
                    @change="handleEdit(scope.$index, $event)"></el-input>
          <span v-else>{{scope.row.publicNum}}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 企业列表弹窗-->
    <el-dialog title="请选择企业" :visible.sync="targetCompanyVisible" append-to-body>
      <company-selector @closeCompanyDialog="closeTargetCompanyDialog" :isSingle="true"
                        ref="targetCompany"></company-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelTargetCompany">取 消</el-button>
        <el-button type="primary" @click="handleSubmitTargetCompany">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 所有商品弹窗-->
    <el-dialog title="所有商品" width="80%" :visible.sync="productVisible" append-to-body class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" :customerCode="dataForm.targetCompany"
                      @closeGoodsDialog="closeGoodsDialog"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseProduct">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==1">
        <el-button type="primary" style="float: left;">
          <router-link target="_blank" :to="{path:'/print/sales-order-print',query:{id:id}}">打 印
          </router-link>
        </el-button>
      </div>
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isFormLoading" v-if="!dataForm.id">提 交</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import {addBill, getBill} from '@/api/erp/mall/scs/publish'
  import {mapGetters} from 'vuex'
  import {formatDate} from '@/utils/date'

  export default {
    name: 'scsPublishForm',
    components: {
      'goods-selector': () => import('../components/GoodsSelector'),
      'company-selector': () => import('../components/CompanySelector')
    },
    props: ['dialogFormVisible', 'id'],
    computed: {
      ...mapGetters([
        'name'
      ])
    },
    data() {
      return {
        publicOptions:[
          {
            value: '1',
            label: '对外'
          },
          {
            value: '2',
            label: '对内'
          }
        ],
        type:false,
        clientHeight: 300,
        isFormLoading: false,
        isTemporaryLoading: false,
        dataForm: {
          id: undefined,
          crtTime: undefined,
          publicType: '1',
          publicCircle: 1,
          targetCompany: undefined,
          targetCompanyName: undefined,
          targetCompanyCode: undefined,
          publishPercent: 1.00,
          publicNum: 0,
          type: undefined,
          items: []
        },
        publishPercent: 1.00,
        batchPercent: true,
        houseList: [],
        items: [],

        selectedProducts: [],
        targetCompanyVisible: false,
        targetCompanyArr: [],
        productVisible: false,
        rules: {
          publicType: [
            {
              required: true,
              message: '请选择发布方式',
              trigger: 'blur'
            }
          ],
          /*publicCircle: [
            {
              required: true,
              message: '请输入发布周期',
              trigger: 'blur'
            }
          ],*/
          targetCompany: [
            {
              required: true,
              message: '请选择发布企业',
              trigger: 'blur'
            }
          ]
        },
        list: null
      }
    },
    created() {
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
      publicBtn(val){
        this.items = []
        if(val == 1){
          this.type = false;
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('center-container')[0]) {
          var height = document.getElementsByClassName('center-container')[0].clientHeight
        } else {
          var height = 375
        }
        if (this.id && this.id != '') {
          height = height + 20
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95
      },
      init() {
        if (this.id != '') {
          getBill(this.id)
            .then(response => {
              this.dataForm = response.data
              this.items = response.data.items
              this.targetCompanyArr = [{
                id: response.data.targetCompany,
                companyName: response.data.targetCompanyName,
                userCode: response.data.targetCompanyCode
              }]
            })
        } else {
          this.dataForm.crtTime = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
          this.dataForm.crtUserName = this.name
        }
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleEdit(index, val) {
        if (this.items[index].publicNum > this.items[index].stockNum) {
          this.items[index].publicNum = this.items[index].stockNum;
        } else {
          this.items[index].publishPercent = Number(this.items[index].publicNum / this.items[index].stockNum).toFixed(2);
        }
      },

      // 企业选择
      handleTargetCompanySelector() {
        this.targetCompanyVisible = true
      },
      handleCancelTargetCompany() {
        this.$refs.targetCompany.reset()
        this.targetCompanyVisible = false
      },
      handleTargetCompanyDel(index) {
        this.targetCompanyArr.splice(index, 1)
        this.dataForm.targetCompany = undefined
        this.dataForm.targetCompanyName = undefined
        this.dataForm.targetCompanyCode = undefined
        this.$refs.targetCompany.reset()
      },
      handleSubmitTargetCompany() {
        this.$refs.targetCompany.onSubmit()
      },
      closeTargetCompanyDialog(list) {
        this.targetCompanyArr = list
        this.targetCompanyVisible = false
        if (list.length > 0) {
          this.dataForm.targetCompany = list[0].id
          this.dataForm.targetCompanyName = list[0].companyName
          this.dataForm.targetCompanyCode = list[0].userCode
        }
      },

      //商品选择
      handleGoodsSelector() {
        if (this.dataForm.targetCompany === null || this.dataForm.targetCompany === undefined) {
          this.$notify({
            title: '提示',
            message: '请先选择发布企业',
            type: 'warning',
            duration: 2000
          })
          return
        }
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
        // console.log(list);

        this.selectedProducts = list
        const _this = this
        const dataMap = _this.data2Map(_this.items)

        // 遍历当前选中项
        for (var index in this.selectedProducts) {
          var item = this.selectedProducts[index]
          //this.selectedProducts.forEach(function (item, index) {
          //判断是否已达1000条数据
          if (_this.items.length === 200) {
            _this.$message({
              type: 'warning',
              message: '最多只能选择200条数据！'
            })
            break
          }

          // 判断data数据中是否有和item.sckName
          const filter = dataMap[item.skuNo]

          // 包含相同数据 根据对象中包含的index值删除指定位置商品
          if (filter) {
            continue;
          }

          var itemObj = {};
          itemObj.skuNo = item.skuNo;
          itemObj.skuName = item.skuName;
          itemObj.brandName = item.brandName;
          itemObj.skuSeries = item.seriesName;
          itemObj.itemNo = item.itemNo;
          itemObj.specifications = item.specifications;
          itemObj.marketPrice = item.retailPrice;
          itemObj.publicHouse = item.warehouseId;
          itemObj.publicHouseName = item.warehouseName;
          itemObj.unit = item.unit;
          itemObj.stockNum = item.qty - item.lockedQty;
          itemObj.publishPercent = _this.publishPercent;
          itemObj.publicNum = parseInt(itemObj.stockNum * _this.publishPercent);
          _this.items.push(itemObj)
          //});
        }

        for (var j in this.items) {
          this.vueSet(this.items, j, this.items[j])
        }

        this.selectedProducts = []
        this.productVisible = false
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
      handleCancel() {
        this.$emit('handleCancelForm')
      },
      handleSubmit() {
        this.dataForm.type = this.dataForm.publicType == 2 ? '2': '1';
        this.dataForm.publishPercent = this.publishPercent;
        if(this.dataForm.type == '2'){
          if(!this.dataForm.publishPercent){
            this.vueMessage('warning','发布比例为必填项');
            return
          }
        }else{
          if(this.items.length<1){
            this.vueMessage('warning','单据明细不能为空!');
            return
          }
        }
        this.dataFormOnSubmit(this, addBill, 'submitSuccess')
      },
      handleDelProductItem(index) {
        this.items.splice(index, 1)
      },
      handleChangePercent(index, val) {
        this.items[index].publishPerceng = val
        this.items[index].publicNum = Math.floor(val * this.items[index].stockNum)
      }
    },
    watch: {
      publishPercent(val) {
        this.items.forEach(function (item) {
          item.publishPercent = val
          item.publicNum = Math.floor(val * item.stockNum)
        })

        for (let i in this.items) {
          this.vueSet(this.items, i, this.items[i])
        }
      },
      dialogFormVisible(val) {

      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .customerOrderDialog {
    font-size: 12px;

    .el-switch {
      float: none;
    }

    .con-title {
      font-size: 16px;

      svg {
        color: #54C07C;
        font-size: 20px;
        margin-right: 8px;
      }

      .cont-title-billNo {
        font-weight: bold;
        float: right;
        margin-right: 30px;
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 20px;
    }

    .topTable {
      width: 100%;
      margin-bottom: 20px;
      border: none;
      border-spacing: 0;
      border-collapse: collapse;
      color: #444;

      td {
        border: 1px solid #e0e0e0;
        height: 40px;
        padding: 0px;
        margin: 0px;
        padding-left: 10px;
      }

      .el-form-flex {
        display: flex;
        margin-bottom: 0px;
      }

      .el-input, .el-select, .el-input-number {
        margin-top: 6px;
      }

      .el-input input.el-input__inner {
        border: none;
        text-align: left;
      }

      .el-textarea__inner {
        border: none;
        resize: none;
        padding: 10px 15px;
      }
    }

    .association-creation {
      height: 30px;
      line-height: 30px;
      text-align: right;
    }

    .order-making {
      height: 40px;
      line-height: 40px;
      margin-bottom: 10px;
    }

    .tb-edit {
      .el-input + span {
        display: none
      }

      .el-select + span {
        display: none
      }

      .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
        background-color: #fff;
      }

      td, th {
        padding: 0px;
        margin: 0px;
        height: 40px;
      }

      th {
        font-weight: 400;
        color: #000;
        background-color: #F7F7F7;
      }

      td {
        .cell {
          width: 100%;
          height: 40px;
          line-height: 40px;
          padding: 0px;
          text-align: center;
          background-color: #fff;
        }

        .el-input, el-select {
          width: 100% !important;
          height: 40px;
        }

        .el-input--mini .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }

        .el-select--small .el-input__inner {
          width: 100%;
          height: 40px;
          border: none;
        }

        .readonly-el-input {
          background-color: rgba(247, 247, 247, 0.5);

          .el-input__inner {
            background-color: rgba(247, 247, 247, 0.5);
          }
        }

        .right-el-input {
          .el-input__inner {
            text-align: right;
          }
        }

        .center-el-input {
          .el-input__inner {
            text-align: center;
          }
        }
      }
    }
  }

  .operator-delete {
    color: #F56C6C;
  }
</style>
