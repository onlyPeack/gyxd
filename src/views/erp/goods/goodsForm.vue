<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleDialogClose" class="goodsFormDialog"
             :close-on-click-modal="false" :before-close="handleDialogClose">
    <span slot="title" class="con-title">
<!--        <span v-if="!goodsId">商品上架</span>-->
        <span>商品编辑</span>
      </span>

    <div class="app-container calendar-list-container goods-form-container" :style="{height:clientHeight+'px'}">
      <el-form :rules="rules" :model="goods" ref="dataForm" label-width="150px">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="商品名称:" prop="name" class="el-form-flex">
                <el-input v-model="goods.name"></el-input>
              </el-form-item>
            </td>
            <!--<td>-->
            <!--<el-form-item label="商品编码:" prop="goodsCode" class="el-form-flex">-->
            <!--<el-input v-model="goods.goodsCode"></el-input>-->
            <!--</el-form-item>-->
            <!--</td>-->
            <td>
              <el-form-item label="商品标题:" prop="title" class="el-form-flex">
                <el-input v-model="goods.title"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="规格型号:" prop="specModel" class="el-form-flex">
                <el-input v-model="goods.specModel" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="订货号:" prop="itemNo" class="el-form-flex">
                <el-input v-model="goods.itemNo" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="产品面价:" prop="retailPrice" class="el-form-flex">
                <el-input v-model="goods.retailPrice" placeholder="0.00" disabled
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handlePriceInputChange($event,'retailPrice')">
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="预计采购价:" prop="costPrice" class="el-form-flex">
                <el-input v-model="goods.costPrice" placeholder="0.00"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handlePriceInputChange($event,'costPrice')">
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="商品调拨折扣:" class="el-form-flex">
                <el-input v-model="goods.customerDiscount" placeholder="0.00"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handlePriceInputChange($event,'customerDiscount')">
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="商品调拨价:" prop="price" class="el-form-flex">
                <el-input v-model="goods.price" placeholder="0.00" disabled
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handlePriceInputChange($event,'price')">
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="安全折扣:" prop="safeDiscount" class="el-form-flex">
                <el-input v-model="goods.safeDiscount" placeholder="0.00"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handleSafePriceInputChange($event,'safeDiscount')">
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="安全价格:" prop="safePrice" class="el-form-flex">
                <el-input v-model="goods.safePrice" placeholder="0.00"
                          onKeyPress="if((event.keyCode<48 || event.keyCode>57) && event.keyCode!=46)event.returnValue=false"
                          @change="handleSafePriceInputChange($event,'safePrice')">
                </el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="安全库存:" prop="safeQty" class="el-form-flex">
                <el-input v-model="goods.safeQty" onkeyup="this.value=this.value.replace(/\D/g,'')" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="安全点数:" prop="safePoint" class="el-form-flex">
                <el-input v-model="goods.safePoint" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
              </el-form-item>
            </td>
          </tr>
          <!--<tr>
            <td>
              <el-form-item label="折扣等级一:" prop="vipPrice" class="el-form-flex">
                <el-input v-model="goods.discountLevel1" placeholder="0.00">
                </el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="折扣等级二:" prop="discountLevel2" class="el-form-flex">
                <el-input v-model="goods.discountLevel2" placeholder="0.00">
                </el-input>
              </el-form-item>
            </td>
          </tr>-->
          <tr>
            <td>
              <el-form-item label="所属分类:" class="el-form-flex" prop="categoryIds">
                <el-cascader expand-trigger="hover" :options="categoryList" v-model="goods.categoryIds" disabled
                             @change="handleCategoryChange" :change-on-select="true" filterable></el-cascader>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="所属品牌商:" class="el-form-flex" prop="brandId">
                <el-select v-model="goods.brandId" filterable >
                  <el-option v-for="item in brandList" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="unit" label="计量单位:" class="el-form-flex">
                <el-select v-model="goods.unit" placeholder="请选择" size="medium" disabled>
                  <el-option v-for="item in measureunitList" :key="item.id" :label="item.name"
                             :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="系列:" prop="seriesId" class="el-form-flex">
                <el-select v-model="goods.seriesId" placeholder="请选择" disabled>
                  <el-option
                    v-for="item in seriesList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="是否代销:" prop="isAgent" class="el-form-flex">
                <el-select v-model="goods.isAgent" placeholder="请选择" size="medium" disabled>
                  <el-option label="否" :value="0"></el-option>
                  <el-option label="是" :value="1"></el-option>
                </el-select>
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="unit" label="参数模板:" class="el-form-flex">
                <el-select v-model="goods.productAttributeCategoryId" placeholder="请选择" size="medium" filterable disabled>
                  <!--<el-option label="实物类商品" :value="0"></el-option>-->
                  <!--<el-option label="服务类商品" :value="1"></el-option>-->
                  <!--<el-option label="虚拟类商品" :value="2"></el-option>-->
                  <el-option
                    v-for="item in goodsTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="重量:" prop="grossWeight" class="el-form-flex">
                <el-input v-model="goods.grossWeight" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="关键字:" class="el-form-flex" disabled>
                <el-tag :key="tag" v-for="tag in keywords" closable type="primary" @close="handleTagClose(tag)">
                  {{tag}}
                </el-tag>
<!--                <el-input class="input-new-keyword" v-if="newKeywordVisible" v-model="newKeyword"-->
<!--                          ref="newKeywordInput"-->
<!--                          size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">-->
<!--                </el-input>-->
<!--                <el-button v-else class="button-new-keyword" size="mini" type="primary" @click="showInput">+ 增加-->
<!--                </el-button>-->
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="最少起订量:" prop="moqMinOrder" class="el-form-flex">
                <el-input v-model="goods.moqMinOrder" onkeyup="this.value=this.value.replace(/\D/g,'')" disabled></el-input>
              </el-form-item>
            </td>
            <td>
              <el-form-item label="是否保护:" prop="isProtection" class="el-form-flex">
                <el-switch v-model="goods.isProtection" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </td>
          </tr>
          <!--<tr>-->
            <!--<td colspan="2">-->
              <!---->
            <!--</td>-->
            <!--&lt;!&ndash;<td>-->
              <!--<el-form-item label="是否称重:" prop="isWeighing" class="el-form-flex">-->
                <!--<el-select v-model="goods.isWeighing" placeholder="请选择" size="medium">-->
                  <!--<el-option label="否" :value="0"></el-option>-->
                  <!--<el-option label="是" :value="1"></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</td>&ndash;&gt;-->
          <!--</tr>-->
          <tr>
            <td colspan="2">
              <el-form-item label="商品简介:" class="el-form-flex">
                <el-input v-model="goods.brief" disabled></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-form-item label="商品链接:" class="el-form-flex" prop="commodityLink">
                <el-input v-model="goods.commodityLink"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

      <div class="small-title-div">商品参数</div>
      <el-table :data="dataForSpcs" size="mini" highlight-current-row border style="width: 80%;margin-top: 10px;"
                class="el-tb-edit">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="attribute" label="商品参数名称">
          <template slot-scope="scope">
            <div>{{scope.row.attribute}}</div>
          </template>
        </el-table-column>
        <el-table-column label="商品参数值">
          <template slot-scope="scope">
            <el-select v-if="scope.row.stringList && scope.row.stringList.length>0" class="filter-item"
                       v-model="scope.row.value">
              <el-option
                v-for="(item, index) in scope.row.stringList"
                :key="index"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <el-input v-else v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>

      </el-table>


      <el-row type="flex" align="middle" :gutter="20" style="padding:20px 0 10px 0px;">
        <el-col :span="12" class="small-title-div">
          商品规格
        </el-col>
        <el-col :span="12" align="right">
          <!--<el-button type="text" icon="el-icon-plus" @click="handleSpecificationShow" style="margin-right: 20px;">添加
          </el-button>-->
        </el-col>
      </el-row>
      <el-table :data="specifications" style="width: 98%;">
        <el-table-column property="specification" label="规格名">
        </el-table-column>
        <el-table-column property="value" label="规格值">
          <template slot-scope="scope">
            <el-tag v-for="(val, index) in scope.row.value" type="primary" :key="val.label"
                    closable @close="handleSpecificationDelete(scope.row, val.index, index, scope.$index)">
              {{val.label}}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <el-table :data="goodsProducts" class="tb-edit" highlight-current-row @row-click="handleCurrentChange"
                style="width: 98%;" border>
        <el-table-column property="value" label="货品规格" width="200">
          <template slot-scope="scope">
            <el-tag :key="tag" v-for="tag in scope.row.specifications.toString().split(',')">
              {{tag}}
            </el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column property="skuNo" label="SKU编码">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.skuNo"
                      @change="handleEdit(scope.$index, scope.row)" readonly="readonly">
            </el-input>
            <span>{{scope.row.skuNo}}</span>
          </template>
        </el-table-column>-->
        <el-table-column property="stripeCode" label="条形码">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.stripeCode"
                      @change="handleEdit(scope.$index, scope.row, 'stripeCode')">
            </el-input>
            <span>{{scope.row.stripeCode}}</span>
          </template>
        </el-table-column>
        <el-table-column property="retailPrice" label="产品面价">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.retailPrice"
                      @change="handleEdit(scope.$index, scope.row, 'retailPrice')">
            </el-input>
            <span>{{scope.row.retailPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column property="customerDiscount" label="客户订货折扣">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.customerDiscount"
                      @change="handleEdit(scope.$index, scope.row, 'customerDiscount')">
            </el-input>
            <span>{{scope.row.customerDiscount}}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="客户订货价">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.price"
                      @change="handleEdit(scope.$index, scope.row, 'price')">
            </el-input>
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column property="costPrice" label="预计采购价">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.costPrice" placeholder="请输入内容"
                      @change="handleEdit(scope.$index, scope.row, 'costPrice')">
            </el-input>
            <span>{{scope.row.costPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column property="url" label="货品图片">
          <template slot-scope="scope">
            <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false"
                       accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
              <img v-if="scope.row.url" :src="scope.row.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </template>
        </el-table-column>

        <el-table-column property="status" label="是否上架" style="text-align: center">
          <template slot-scope="scope">
            <el-checkbox :checked="scope.row.status==0"
                         @change="handleCheckboxChange(scope.$index,$event)"></el-checkbox>
          </template>
        </el-table-column>
      </el-table>

      <div class="small-title-div">商品详细介绍</div>
      <div class="el-editor">
        <editor :init="editorInit" v-model="goods.detail" :disabled=true></editor>
      </div>

      <div class="small-title-div">商品图片</div>
      <div class="goods-img-upload">
        <el-upload class="avatar-uploader" :action="uploadPath" :show-file-list="false" disabled
                   accept=".jpg,.jpeg,.png,.gif" :on-success="uploadPicUrl">
          <img v-if="goods.picUrl" :src="goods.picUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class="small-title-div">商品明细图片</div>
      <div class="goods-img-upload">
        <el-upload
          class="upload-demo"
          :action="uploadPath"
          disabled
          :show-file-list="true"
          :on-remove="handleRemoves"
          :file-list="fileList"
          :on-success="uploadPicUrls"
          list-type="picture-card">
          <i class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <add-goods-spec-dialog :show="specVisiable" :form="dialogForm" @show="getChildDialogShow"
                             @form="getChildDialogForm" class="add-goods-attr-dialog"></add-goods-spec-dialog>

    </div>
    <!-- 新增采购合同弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="isLoading">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {
    addGoods,
    updateGoods,
    listCatAndBrand,
    getAttributeBaseAll,
    getGoodsDetail,
    getSpecificationBaseAll,
    queryParamsAndAttrByGoodsTypeId
  } from '@/api/erp/goods/goods'
  import {page as seriesPage} from '@/api/erp/goods/brandSeries';
  import {all as measureunitPage} from '@/api/erp/goods/measureunit';
  import {allGoodsType as goodsTypePage} from '@/api/erp/goods/goodsType';
  import {createStorage, uploadPath} from '@/api/erp/goods/storage'

  import Editor from '@tinymce/tinymce-vue'
  import {MessageBox} from 'element-ui'
  import addGoodsSpecDialog from './addGoodsSpecDialog'
  import {getFloat, isEmpty} from "../../../utils/util";

  export default {
    name: 'goodsForm',
    components: {Editor, addGoodsSpecDialog},
    props: ['goodsId', 'dialogFormVisible'],
    computed: {
      data2Map() {
        let map = {};
        this.data.forEach(function (item, index) {
          item.index = index;
          map[item.id] = item;
        });
        return map;
      }
    },
    data() {
      return {
        isLoading: false,
        clientHeight: 300,
        data: [],
        dataForSpcs: [],
        uploadPath,
        isIndeterminate: [],
        goodsAttrList: [],
        goodsAttrCheckAll: [],
        selectedGoodsAttrs: [],
        selectedGoodsDatas: [],
        propertyVisiable: true,
        propertyValueVisiable: false,
        newKeywordVisible: false,
        newKeyword: '',
        keywords: [],
        categoryList: [],
        brandList: [],
        fileList: [],
        goods: {
          picUrl: '',
          gallery: [],
          isAgent: 0,
          isWeighing: 0,
          categoryIds: [],
          seriesId: '',
          moqMinOrder: 1,
          grossWeight: '',
          detailPicture: "",
          safeQty:'',
        },
        specVisiable: false,
        specForm: {specification: '', value: '', picUrl: ''},
        dialogForm: [],
        multipleSpec: false,
        specifications: [{specification: '默认', value: [{label: '标准'}]}],
        goodsProducts: [
          //   {
          //   id: 0,
          //   specifications: ['标准'],
          //   price: '',
          //   retailPrice: '',
          //   costPrice: '',
          //   customerDiscount: '',
          //   url: '',
          //   status: 0,
          //   skuNo: ''
          // }
        ],
        productVisiable: false,
        productForm: {
          id: 0,
          specifications: [],
          price: '',
          retailPrice: '',
          costPrice: '',
          url: '',
          customerDiscount: ''
        },
        products: [{
          id: 0,
          specifications: ['标准'],
          price: 0.00,
          retailPrice: 0.00,
          costPrice: 0.00,
          url: '',
          customerDiscount: ''
        }],
        attributeForm: {attribute: '', value: ''},
        attributes: [],
        activeName2: 'first',
        seriesList: [],
        goodsTypeList: [],
        measureunitList: [],
        rules: {
          name: [{required: true, message: '商品名称不能为空', trigger: 'blur'}],
          goodsCode: [{required: true, message: '商品编号不能为空', trigger: 'blur'}],
          retailPrice: [{required: true, message: '商品产品面价不能为空', trigger: 'blur'}],
          safePrice: [{required: true, message: '安全价格不能为空', trigger: 'blur'}],
          safeDiscount: [{required: true, message: '安全折扣不能为空', trigger: 'blur'}],
          categoryIds: [{required: true, message: '分类不能为空', trigger: 'blur'}],
          brandId: [{required: true, message: '品牌不能为空', trigger: 'blur'}],
          customerDiscount: [{required: true, message: '商品调拨折扣不能为空', trigger: 'blur'}],

        },
        editorInit: {
          language: 'zh_CN',
          plugins: ['advlist anchor autolink autoresize autosave emoticons fullscreen hr image imagetools importcss insertdatetime legacyoutput link lists media nonbreaking noneditable pagebreak paste preview print save searchreplace tabfocus table template textcolor textpattern visualblocks visualchars wordcount'],
          toolbar: ['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat subscript superscript ', 'hr bullist numlist link image charmap preview anchor pagebreak fullscreen media table emoticons forecolor backcolor'],
          images_upload_handler: function (blobInfo, success, failure) {
            const formData = new FormData()
            formData.append('file', blobInfo.blob())
            createStorage(formData).then(res => {
              success(res.data.url)
            }).catch(() => {
              failure('上传失败，请重新上传')
            })
          }
        },
      }
    },
    created() {
      this.init();
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      }
    },
    watch: {
      selectedGoodsDatas(val) {
        let isIndeterminate = [];
        let goodsAttrCheckAll = [];
        let goodsAttrList = [];
        val.forEach(function (item) {
          isIndeterminate.push(false);
          goodsAttrCheckAll.push(false);
          goodsAttrList.push([]);
        });
        this.isIndeterminate = isIndeterminate;
        this.goodsAttrCheckAll = isIndeterminate;
        this.goodsAttrList = goodsAttrList;
      },
      // 'goods.moqMinOrder': {
      //   deep: true,
      //   handler: function () {
      //     if (this.goods.moqMinOrder * 1 < 1) {
      //       this.$message.warning('最少起订量不能小于1');
      //     }
      //   }
      // },
      // 'goods.brandId': {
      //   deep: true,
      //   handler: function () {
      //     if (this.goods.brandId) {
      //       this.selectSeriesList(this.goods.brandId);
      //     }
      //   }
      // },
      // 'goods.productAttributeCategoryId': {
      //   deep: true,
      //   handler: function () {
      //     if (this.goods.productAttributeCategoryId) {
      //       queryParamsAndAttrByGoodsTypeId(this.goods.productAttributeCategoryId).then(response => {
      //         var paramList = response.data.param;
      //         this.dataForSpcs = [];
      //
      //         for (var i in paramList) {
      //           if (paramList[i].paramValue.length == 1 && paramList[i].paramValue[0] == '') {
      //             paramList[i].paramValue = [];
      //           }
      //           var value = undefined;
      //           if (this.goods.initAttributes) {
      //             value = this.attributes[i].value;
      //           }
      //           this.dataForSpcs.push({
      //             stringList: paramList[i].paramValue,
      //             attribute: paramList[i].paramName,
      //             value: value
      //           });
      //         }
      //         this.goods.initAttributes = false;
      //
      //       })
      //     }
      //   }
      // }
    },
    methods: {
      handleRemoves(file, fileList) {
        this.fileList = fileList;
        console.log(fileList);
      },
      changeDivHeight() {
        this.clientHeight = (document.body.clientHeight - 120) * 0.98;
      },
      init() {

        if (this.goodsId && this.goodsId != '') {
          getGoodsDetail(this.goodsId).then(response => {
            this.goods = response.data.goods;
            if(response.data.goods.detailPicture){
              var strs =JSON.parse(response.data.goods.detailPicture); //定义一数组
              this.fileList= strs;
            }


            console.log(this.fileList);
            this.goods.categoryIds = response.data.categoryIds;
            this.goods.initAttributes = true;
            var goodsProductList = [];
            if (response.data.products.length > 0) {
              for (var k in response.data.products) {
                var pro = response.data.products[k];
                goodsProductList.push({
                  id: pro.id,
                  specifications: ['标准'],
                  price: pro.price,
                  retailPrice: pro.retailPrice,
                  costPrice: pro.costPrice,
                  customerDiscount: pro.customerDiscount,
                  url: pro.url,
                  status: pro.status,
                  skuNo: pro.skuNo
                });
              }
            }
            this.goodsProducts = goodsProductList;

            this.categoryIds = response.data.categoryIds;
            this.galleryFileList = [];
            if (this.goods.gallery && this.goods.gallery.length > 0) {
              for (var i = 0; i < this.goods.gallery.length; i++) {
                this.galleryFileList.push({
                  url: this.goods.gallery[i]
                })
              }
            }

            if (response.data.attributes.length === 0) {
              this.attributes = [];
            } else {
              this.attributes = response.data.attributes;
            }

            if (response.data.specifications.length === 0) {
              this.specifications = [{specification: '默认', value: [{label: '标准'}]}];
            } else {
              this.handleGoodsSpecView2DialogForm(response.data.specifications).then(data => {
                this.dialogForm = data;
                this.handleGoodsSpecDialogForm2View(data)
              })
            }
          });

        } else {
          this.attributes = [{attribute: '', value: ''}];
        }
        listCatAndBrand().then(response => {
          this.categoryList = this.getCategoryList(response.data.categoryList);
          this.$set(this.goods,'categoryIds',this.goods.categoryIds)
          this.brandList = response.data.brandList;
        });
        goodsTypePage().then(response => {
          this.goodsTypeList = response;
        });
        measureunitPage().then(response => {
          this.measureunitList = response;
        });
      },
      getCategoryList(data) {
        //将最底层中的 children 设为undefined
        // 循环遍历json数据
        for (var i = 0; i < data.length; i++) {

          if (!data[i].children || data[i].children.length < 1) {
            // children若为空数组，则将children设为undefined
            data[i].children = undefined;
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getCategoryList(data[i].children);
          }
        }
        return data;
      },
      /* handleClick(tab, event) {
         this.$refs['goods'].validate((valid) => {
           if (valid) {
             if (tab.name === 'third') {
               this.goodsProducts = [{
                 id: 0,
                 specifications: ['标准'],
                 price: this.goods.price,
                 retailPrice: this.goods.retailPrice,
                 costPrice: this.goods.costPrice,
                 url: this.goods.picUrl
               }]
             }
           } else {
             this.$message('商品基本信息必填项不可为空')
           }
         })
       },*/
      handleCategoryChange(value) {
        this.goods.categoryId = value[value.length - 1]
      },
      selectSeriesList(value) {
        this.seriesList = [];
        seriesPage(value).then(response => {
          // this.goods.seriesId = undefined;
          this.seriesList = response.data;
        });
      },
      handlePriceInputChange(val, type) {
        if (isEmpty(val)) {
          return;
        }
        this.goods[type] = getFloat(val, 2);

        if (type == 'retailPrice' && !isEmpty(this.goods.customerDiscount)) {
          this.goods.price = getFloat(this.goods.retailPrice * this.goods.customerDiscount, 2);
        }
        if (type == 'price' && !isEmpty(this.goods.retailPrice)) {
          this.goods.customerDiscount = getFloat(this.goods.price / this.goods.retailPrice, 2);
        }
        if (type == 'customerDiscount' && !isEmpty(this.goods.retailPrice)) {
          this.goods.price = getFloat(this.goods.retailPrice * this.goods.customerDiscount, 2);
        }
        var obj = JSON.parse(JSON.stringify(this.goods));
        this.goods = obj;

        for (var i in this.goodsProducts) {
          if (!isEmpty(this.goods['retailPrice'])) {
            this.goodsProducts[i]['retailPrice'] = this.goods['retailPrice'];
          }
          if (!isEmpty(this.goods['customerDiscount'])) {
            this.goodsProducts[i]['customerDiscount'] = this.goods['customerDiscount'];
          }
          if (!isEmpty(this.goods['price'])) {
            this.goodsProducts[i]['price'] = this.goods['price'];
          }
        }
      },
      handleSafePriceInputChange(val, type) {
        if (isEmpty(val)) {
          return;
        }
        this.goods[type] = getFloat(val, 2);

        if (type == 'retailPrice' && !isEmpty(this.goods.safeDiscount)) {
          this.goods.safePrice = getFloat(this.goods.retailPrice * this.goods.safeDiscount, 2);
        }
        if (type == 'safePrice' && !isEmpty(this.goods.retailPrice)) {
          this.goods.safeDiscount = getFloat(this.goods.safePrice / this.goods.retailPrice, 2);
        }
        if (type == 'safeDiscount' && !isEmpty(this.goods.retailPrice)) {
          this.goods.safePrice = getFloat(this.goods.retailPrice * this.goods.safeDiscount, 2);
        }
        var obj = JSON.parse(JSON.stringify(this.goods));
        this.goods = obj;

        for (var i in this.goodsProducts) {
          if (!isEmpty(this.goods['retailPrice'])) {
            this.goodsProducts[i]['retailPrice'] = this.goods['retailPrice'];
          }
          if (!isEmpty(this.goods['safeDiscount'])) {
            this.goodsProducts[i]['safeDiscount'] = this.goods['safeDiscount'];
          }
          if (!isEmpty(this.goods['safePrice'])) {
            this.goodsProducts[i]['safePrice'] = this.goods['safePrice'];
          }
        }
      },
      handleCheckboxChange(index, val) {
        if (val) {
          this.goodsProducts[index].status = 0;
        } else {
          this.goodsProducts[index].status = 1;
        }
      },
      handleEdit(index, row, type) {
        if (type == 'retailPrice' && !isEmpty(row.customerDiscount)) {
          row.price = getFloat(row.retailPrice * row.customerDiscount, 2);
        }
        if (type == 'price' && !isEmpty(row.retailPrice)) {
          row.customerDiscount = getFloat(row.price / row.retailPrice, 2);
        }
        if (type == 'customerDiscount' && !isEmpty(row.retailPrice)) {
          row.price = getFloat(row.retailPrice * row.customerDiscount, 2);
        }
        this.vueSet(this.goodsProducts, index, row);
      },
      handleDialogClose() {
        this.$emit('closeGoodsDialog', false)
      },
      handleTagClose(tag) {
        this.keywords.splice(this.keywords.indexOf(tag), 1);
        this.goods.keywords = this.keywords.toString()
      },
      handleSubmit: function () {

        this.goods.detailPicture =JSON.stringify(this.fileList);
        this.isLoading = true;
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const newSpecifications = [];
            this.specifications.forEach(function (item) {
              item.value.forEach(function (item2) {
                newSpecifications.push({
                  specification: item.specification,
                  value: item2.label
                })
              })
            });

            var newAttributes = [];
            this.dataForSpcs.forEach(function (item) {
              if (item.attribute != null && item.attribute != undefined && item.attribute != '') {
                newAttributes.push(item);
              }
            });

            const goodsAllinone = {
              goods: this.goods,
              attributes: newAttributes,
              specifications: newSpecifications,
              products: this.goodsProducts
            };

            if (this.goodsId && this.goodsId != '') {
              updateGoods(goodsAllinone).then(response => {
                this.isLoading = false;
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('goodsSubmitSuccess');
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
              });
            } else {
              goodsAllinone.goods.gallery = JSON.stringify(goodsAllinone.goods.gallery);
              addGoods(goodsAllinone).then(response => {
                this.isLoading = false;
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('goodsSubmitSuccess');
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
              });
            }
            this.isLoading = false;
          } else {
            this.isLoading = false;
          }
        });
      },
      handleCurrentChange(row, event, column) {
        //console.log(row, event, column, event.currentTarget)
      },
      showInput() {
        this.newKeywordVisible = true;
        this.$nextTick(_ => {
          this.$refs.newKeywordInput.$refs.input.focus();
        })
      },
      handleInputConfirm() {
        const newKeyword = this.newKeyword;
        if (newKeyword) {
          this.keywords.push(newKeyword);
          this.goods.keywords = this.keywords.toString();
        }
        this.newKeywordVisible = false;
        this.newKeyword = '';
      },
      uploadPicUrl: function (response) {
        this.goods.picUrl = response.data.url;
      },
      uploadPicUrls: function (response) {
        this.fileList = this.fileList ? this.fileList : [];
        this.fileList.push(response.data);
        console.log(this.fileList);
      },
      uploadOverrun: function () {
        this.$message({
          type: 'error',
          message: '上传文件个数超出限制!最多上传5张图片!'
        })
      },
      handleGalleryUrl(response, file, fileList) {
        if (response.errno === 0) {
          this.goods.gallery.push(response.data.url)
        }
      },
      handleRemove: function (file, fileList) {
        for (var i = 0; i < this.goods.gallery.length; i++) {
          // 这里存在两种情况
          // 1. 如果所删除图片是刚刚上传的图片，那么图片地址是file.response.data.url
          //    此时的file.url虽然存在，但是是本机地址，而不是远程地址。
          // 2. 如果所删除图片是后台返回的已有图片，那么图片地址是file.url
          var url;
          if (file.response === undefined) {
            url = file.url;
          } else {
            url = file.response.data.url;
          }

          if (this.goods.gallery[i] === url) {
            this.goods.gallery.splice(i, 1);
          }
        }
      },
      specChanged: function (label) {
        /*if (label === false) {
          this.specifications = [{specification: '规格', value: '标准', picUrl: ''}];
          this.products = [{id: 0, specifications: ['标准'], price: 0.00, qty: 0, url: ''}];
        } else {
          this.specifications = []  ;
          this.products = [];
        }*/
      },
      uploadSpecPicUrl: function (response) {
        this.specForm.picUrl = response.data.url;
      },
      handleSpecificationShow() {
        this.specForm = {specification: '', value: '', picUrl: ''};
        this.specVisiable = true;
      },
      getChildDialogShow(val) {
        this.specVisiable = val
      },
      getChildDialogForm(val) {
        this.dialogForm = val;
        this.handleGoodsSpecDialogForm2View(val)
      },
      handleGoodsSpecDialogForm2View(val) {
        //console.log(val);
        //console.log(this.specifications);
        let specifications = [];
        let attrsValues = [];
        // 遍历规格名称列表
        val.forEach(function (item, index) {
          // 判断该规格是否选中
          if (item.selected) {
            // 临时变量：当前规格名中选中的规格值对象
            let valuesLabelObj = [];
            // 临时变量：当前规格名中选中的规格值
            let valuesLabel = [];
            // 遍历规格值 取出选中的规格
            item.stringList.forEach(function (valuesItem, index) {
              if (valuesItem.selected) {
                valuesLabelObj.push({label: valuesItem.label, index: index});
                valuesLabel.push(valuesItem.label);
              }
            });
            // 创建新的集合
            specifications.push({
              key: new Date().getTime(),
              specification: item.name,
              value: valuesLabelObj,
              picUrl: '',
              parentKey: item.id,
              index: index
            });
            // 按照规格名分类出的 选中的规格值
            attrsValues.push(valuesLabel)
            //console.log(valuesLabelObj)
          }
        });

        this.specifications = specifications.length > 0 ? specifications : this.specifications;

        const _this = this;
        let goodsProducts = [];
        const tempList = this.doExchange(attrsValues);
        if (tempList) {
          tempList.forEach(function (item) {
            goodsProducts.push({
              key: new Date().getTime(),
              //specifications: typeof item == 'object' ? item : [item],
              specifications: typeof item == 'object' ? item : [item],
              price: _this.goods.price,
              retailPrice: _this.goods.retailPrice,
              costPrice: _this.goods.costPrice,
              vipPrice: _this.goods.vipPrice,
              url: _this.goods.picUrl,
              sKuNo: '',
              stripeCode: '',
              status: 0,
            })
            // console.log(specifications)
          });
          this.goodsProducts = goodsProducts;
          // console.log(goodsProducts)
        }

      },
      handleGoodsSpecView2DialogForm(val) {
        return new Promise((resolve, reject) => {
          const responseData = [];
          const responseDataCount = {};
          val.forEach(function (item) {
            responseData.push(item.specification + '-' + item.value);

            if (responseDataCount[item.specification]) {
              responseDataCount[item.specification] = responseDataCount[item.specification] + 1
            } else {
              responseDataCount[item.specification] = 1
            }
          });

          // getSpecificationBaseAll().then(response => {
          //   let data = [];
          //   response.forEach(function (item) {
          //     item.disabled = false;
          //
          //     if (responseDataCount[item.name]) {
          //       item.selected = true;
          //     } else {
          //       item.selected = false;
          //     }
          //
          //     if (responseDataCount[item.name] && responseDataCount[item.name] > 0) {
          //       item.isIndeterminate = true;
          //
          //       if (responseDataCount[item.name] === item.stringList.length) {
          //         item.checkAll = true;
          //       } else {
          //         item.checkAll = false;
          //       }
          //     } else {
          //       item.isIndeterminate = false
          //     }
          //
          //     let tempList = [];
          //     item.stringList.forEach(function (label, index, array) {
          //       let selected = false;
          //       if (responseData.indexOf(item.name + '-' + label) !== -1) {
          //         selected = true;
          //       }
          //       tempList.push({
          //         id: new Date().getTime() + index,
          //         label: label,
          //         selected: selected
          //       })
          //     });
          //     item.stringList = tempList;
          //     data.push(item)
          //   });
          //   resolve(data)
          // });
        })
      },
      handleSpecificationDelete(row, valueIndex, index, tableIndex) {
        let attrSelectedCount = this.dialogForm.filter(item => {
          return item.selected
        }).length;

        let valuesSelectedCount = this.dialogForm[row.index].stringList.filter(item => {
          return item.selected
        }).length;

        this.dialogForm[row.index].stringList[valueIndex].selected = false;
        valuesSelectedCount = this.dialogForm[row.index].stringList.filter(item => {
          return item.selected
        }).length;

        // 改变全选框状态
        this.dialogForm[row.index].checkAll = false;
        if (valuesSelectedCount === 0) {
          this.dialogForm[row.index].isIndeterminate = false;
          // 改变规格选中状态
          this.dialogForm[row.index].selected = false;
        } else {
          this.dialogForm[row.index].isIndeterminate = true;
        }

        if (attrSelectedCount === 1 && valuesSelectedCount === 0) {
          this.specifications = [{specification: '默认', value: [{label: '标准'}]}];
          this.goodsProducts = [{
            id: 0,
            specifications: ['标准'],
            price: '',
            retailPrice: '',
            costPrice: '',
            vipPrice: '',
            url: '',
            status: 0
          }];
          return;
        }
        this.handleGoodsSpecDialogForm2View(this.dialogForm)
      },
      handleInventorysDelete(index) {
        this.goodsProducts.splice(index, 1);
      },
      handleProductShow(row) {
        this.productForm = Object.assign({}, row);
        this.productVisiable = true
      },
      uploadProductUrl: function (response) {
        this.productForm.url = response.data.url
      },
      handleProductEdit() {
        for (var i = 0; i < this.products.length; i++) {
          const v = this.products[i]
          if (v.id === this.productForm.id) {
            this.products.splice(i, 1, this.productForm);
            break
          }
        }
        this.productVisiable = false
      },
      /*弹出商品参数窗口*/
      handleAttributeShow() {
        this.attributeForm = {};
      },
      doExchange(arr) {
        var len = arr.length;
        // 当数组大于等于2个的时候
        if (len >= 2) {
          // 第一个数组的长度
          var len1 = arr[0].length;
          // 第二个数组的长度
          var len2 = arr[1].length;
          if (len1 === 0) {
            return arr[1];
          }
          if (len2 === 0) {
            return arr[0];
          }
          // 2个数组产生的组合数
          var lenBoth = len1 * len2;
          //  申明一个新数组
          var items = new Array(lenBoth);
          // 申明新数组的索引
          var index = 0;
          for (var i = 0; i < len1; i++) {
            for (var j = 0; j < len2; j++) {
              if (arr[0][i] instanceof Array) {
                items[index] = arr[0][i].concat(arr[1][j]);
              } else {
                items[index] = [arr[0][i]].concat(arr[1][j]);
              }
              index++;
            }
          }
          var newArr = new Array(len - 1);
          for (var i = 2; i < arr.length; i++) {
            newArr[i - 1] = arr[i];
          }
          newArr[0] = items;
          return this.doExchange(newArr);
        } else {
          return arr[0];
        }
      },

    },
  }

</script>

<style lang="scss" rel="stylesheet/scss">
  .goods-form-container {
    position: relative;
    overflow: auto;

    .main-container {
      position: absolute;
      left: 0px;
      right: 0px;
      height: 100%;
      overflow: auto;
    }

    .add-goods-attr-dialog .el-dialog {
      margin-top: 50px !important;
    }

    .topTable {
      width: 98%;
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
      }

      .el-form-flex {
        display: flex;
        margin-bottom: 0px;
      }

      .el-input, .el-select, .el-input-number, .el-cascader {
        width: 100%;
        /*margin-top: 2px;*/
      }

      .el-button {
        margin-top: 4px;
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

    .small-title-div {
      height: 30px;
      line-height: 30px;
      color: #444;
      font-weight: bold;
    }

    .tb-edit {
      margin-bottom: 20px;

      .el-input {
        display: none;

        input {
          border: none;
        }
      }

      .current-row .el-input {
        display: block
      }

      .current-row .el-input + span {
        display: none
      }
    }

    .el-tag + .el-tag {
      margin-left: 10px;
    }

    .input-new-keyword {
      width: 90px !important;
      margin-left: 10px;
      vertical-align: bottom;
    }

    .avatar-uploader {
      height: 50px;

      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 50px;
        height: 50px;
      }

      .el-upload:hover {
        border-color: #20a0ff;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }

      .avatar {
        width: 50px;
        height: 50px;
        display: block;
      }
    }

    .goods-img-upload {
      margin-top: 10px;
      margin-bottom: 20px;

      .avatar-uploader {
        height: 80px;

        .el-upload {
          width: 80px;
          height: 80px;
        }

        .avatar {
          width: 80px;
          height: 80px;
        }

        .avatar-uploader-icon {
          width: 80px;
          height: 80px;
          line-height: 80px;
        }
      }
    }

    .op-container {
      padding-left: 40%;
      margin-top: 30px;
    }

    .el-table-add-row {
      margin-top: 10px;
      width: 100%;
      height: 34px;
      border: 1px dashed #c1c1cd;
      border-radius: 3px;
      cursor: pointer;
      justify-content: center;
      display: flex;
      line-height: 34px;
    }

    /*子组件*/
    .specDialogTop {
      width: 100%;
      height: 50px;
    }

    .step {
      list-style: none;
      font-size: 16px;
    }

    .el-steps {
      background: #ffffff;
      width: 400px;
      padding: 0;
    }

    .inventCss {
      width: 100%;
    }

    .step li {
      float: left;
      width: 200px;
      display: block;
      line-height: 50px;
    }

    .step span {
      margin-left: 50px;
    }

    .specDialogMainOne {
      height: 300px;
    }

    .box-card {
      width: 25%;
      height: 300px;
      margin-right: 3%;
      float: left;
    }

    .el-checkbox {
      width: 100%;
    }
  }
</style>
