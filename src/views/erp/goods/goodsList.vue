<template>
  <div class="app-container calendar-list-container goods-list-container">
    <el-row>
      <el-col :span="4">
        <el-card class="box-card" :style="{height:queryVisible?(clientHeight+120)+'px':(clientHeight+90)+'px'}">
          <el-row>
            <el-col :span="16">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="text" icon="plus" @click="handleOpenTree" style="margin-left: 15px;font-size: 14px;">
                <span v-if="isOpenTree">收起<i class="el-icon-arrow-up"></i></span>
                <span v-if="!isOpenTree">展开<i class="el-icon-arrow-down"></i></span>
              </el-button>
            </el-col>
          </el-row>
          <el-tree
            class="filter-tree"
            :data="categoryList"
            node-key="value"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="categoryTree"
            @node-click="getNodeData"
            default-expand-all
            style='margin-top:10px;'
          >
          </el-tree>
        </el-card>
      </el-col>
      <el-col :span="20" style='padding-left:10px;'>
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <span class="curr-classify" v-if="breadcrumbList && breadcrumbList.length>0">当前分类:</span>
          <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length>0"
                         style="display: inline-block;margin-right: 5px;">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
              <a href="javascript:void(0)" @click="changeTreeNode(item,index)">{{item.label}}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品编号"
                    v-model="listQuery.goodsCode">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入商品名称" v-model="listQuery.name">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入品牌名称" v-model="listQuery.brandName">
          </el-input>
          <!--<el-select v-model="listQuery.brandId" placeholder="请输入品牌" clearable style="width: 200px;"-->
                     <!--class="filter-item" v-if="false">-->
            <!--<el-option v-for="item in brandList" :key="item.value" :label="item.label"-->
                       <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button class="filter-item" type="primary" @click="openGoodsDialog" icon="el-icon-edit">添加</el-button>
          <el-button class="filter-item" type="primary" :loading="downloadLoading" icon="el-icon-download"
                     @click="handleDownload">导出
          </el-button>
          <!--<el-button class="filter-item" type="primary" @click="initGoods" icon="el-icon-goods" v-if="!isInitializing"-->
          <!--v-show="initializingShow">-->
          <!--商品初始化-->
          <!--</el-button>-->
          <!--<el-button class="filter-item" type="info" icon="el-icon-goods" v-if="isInitializing"-->
          <!--:disabled="isInitializing">初始化中...-->
          <!--</el-button>-->

          <!--<el-upload class="upload" action="/api/goods/goods/import" :before-upload="beforeUpload"-->
                     <!--:on-remove="handleRemove" :show-file-list="false"-->
                     <!--:before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"-->
                     <!--style="display:inline;" :on-success="uploadCompleted" :headers="headers">-->
            <!--&lt;!&ndash;<el-button type="primary" icon="el-icon-download" class="filter-item">&ndash;&gt;-->
              <!--&lt;!&ndash;导入&ndash;&gt;-->
            <!--&lt;!&ndash;</el-button>&ndash;&gt;-->
          <!--</el-upload>-->
          <!--<el-button type="primary" icon="el-icon-upload2" class="filter-item" @click="handleDownloadTemplate">-->
            <!--下载模板-->
          <!--</el-button>-->
          <el-button type="primary" icon="el-icon-download" class="filter-item" @click="dialogDataVisible">
            导入产品库数据
          </el-button>
          <!--<span @click="queryVisibleChange" v-model="queryVisible" class="query-visible">-->
          <!--<span v-show="!queryVisible">展开</span>-->
          <!--<span v-show="queryVisible">收起</span>-->
          <!--<i class="el-icon-arrow-down" v-show="!queryVisible"></i>-->
          <!--<i class="el-icon-arrow-up" v-show="queryVisible"></i>-->
          <!--</span>-->

          <div style="padding-left: 128px;" v-show="queryVisible">
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入系列"
                      v-model="listQuery.seriesName">
            </el-input>
            <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入规格型号"
                      v-model="listQuery.specModel">
            </el-input>
            <el-input clearable class="filter-item" type="textarea" style="width: 280px;" placeholder="请输入订货号,多个订货号请输入回车键隔开"
                      v-model="listQuery.itemNo">
            </el-input>
            <el-select v-model="listQuery.isOnSale" placeholder="是否上架" clearable class="filter-item"
                       style="width: 200px" @change="handleFilter">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
            <el-button type="primary" icon="el-icon-upload2" class="filter-item" @click="groundingClick(0)">
              批量上架
            </el-button>
            <el-button type="primary" icon="el-icon-download" class="filter-item" @click="groundingClick(1)">
              批量下架
            </el-button>
            <el-button type="primary" icon="el-icon-document" class="filter-item" @click="commodityClick()">
              贴标签
            </el-button>
          </div>

        </div>

        <!-- 查询结果 -->
        <div class="result-container">
          <el-table size="small" :data="list" v-loading="listLoading" @selection-change="handlechangeFun"
                    element-loading-text="正在查询中。。。" border fit
                    highlight-current-row :height="clientHeight"
                    style="width: 100%;height: 100%;position:relative;overflow: auto;">

            <!--<el-table-column align="center" label="商品编码" prop="goodsCode" fixed="left">-->
            <!--</el-table-column>-->
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="商品名称" prop="name" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="品牌名称" prop="brandName" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="系列" prop="seriesName" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="规格型号" prop="specModel" fixed="left">
            </el-table-column>
            <el-table-column align="center" min-width="100" label="订货号" prop="itemNo">
            </el-table-column>
            <el-table-column align="center" property="iconUrl" label="图片">
              <template slot-scope="scope">
                <img :src="scope.row.picUrl" width="40"/>
              </template>
            </el-table-column>

            <!--<el-table-column align="center" label="详情" prop="detail">-->
              <!--<template slot-scope="scope">-->
                <!--<el-dialog title="商品详情" :visible.sync="detailDialogVisible" append-to-body>-->
                  <!--<div v-html="goodsDetail"></div>-->
                <!--</el-dialog>-->
                <!--<el-button type="primary" size="mini" @click="showDetail(scope.row.detail)">查看</el-button>-->
              <!--</template>-->
            <!--</el-table-column>-->

            <el-table-column align="right" label="重量" prop="grossWeight">
            </el-table-column>

            <el-table-column align="right" label="产品面价" prop="retailPrice">
            </el-table-column>

            <el-table-column align="right" label="安全折扣" prop="safeDiscount" min-width="100">
            </el-table-column>

            <el-table-column align="right" label="安全价格" prop="safePrice" min-width="90">
            </el-table-column>

            <!--<el-table-column align="right" label="预计采购价" prop="costPrice" min-width="90">-->
            <!--</el-table-column>-->
            <!--<el-table-column align="center" label="状态" prop="isOnSale">-->
            <!--<template slot-scope="scope">-->
            <!--<el-tag :type="scope.row.isOnSale ? 'success' : 'error' ">{{scope.row.isOnSale ? '在售' : '未售'}}</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column align="center" label="商品类型" min-width="100">
              <template slot-scope="scope">
                <span v-for="item in goodsTypeList">
                  <span v-if="scope.row.productAttributeCategoryId ==item.id">{{item.name}}</span>
                </span>
              </template>
            </el-table-column>-->
            <!--<el-table-column align="right" label="所属分类ID" prop="categoryId">-->
            <!--</el-table-column>-->
            <!--<el-table-column align="right" label="所属品牌ID" prop="brandId" min-width="100">-->
            <!--</el-table-column>-->

            <el-table-column align="center" label="计量单位" prop="unit">
            </el-table-column>
            <el-table-column align="center" label="上架状态" width="100">
              <template slot-scope="scope">
                <el-switch
                  @change="handlePublishStatusChange(scope.$index, scope.row)"
                  :active-value=0
                  :inactive-value=1
                  v-model="scope.row.isOnSale">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column label="标签" width="140" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.tags && scope.row.tags != ''">
                  <el-tag v-for="item in scope.row.tagsList" :key="item" :type="item == '新品'?'' : item == '热卖' ? 'danger': item == '推荐' ? 'warning' : item == '清仓' ? 'success' : 'info'" style="margin-bottom: 8px;margin-right: 8px;">{{item}}</el-tag>
                </div>
              </template>
            </el-table-column>
            <!--<el-table-column align="center" label="是否代销" prop="isAgent">
              <template slot-scope="scope">
                <el-tag :type="scope.row.isAgent ? 'success' : 'error' ">{{scope.row.isAgent ? '否' : '是'}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否称重" prop="isWeighing">
              <template slot-scope="scope">
                <el-tag :type="scope.row.isWeighing ? 'success' : 'error' ">{{scope.row.isWeighing ? '否' : '是'}}
                </el-tag>
              </template>
            </el-table-column>-->
            <!--<el-table-column align="center" label="关键字" prop="keywords">-->
            <!--</el-table-column>-->

            <el-table-column align="center" label="操作" width="180" fixed="right" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagination-container" style="margin-top: 10px;">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,30,50,200,1000]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>

    <el-tooltip placement="top" content="返回顶部">
      <back-to-top :visibilityHeight="100"></back-to-top>
    </el-tooltip>

    <!-- 新增/编辑商品弹窗 -->
    <goods-form :dialogFormVisible="dialogFormVisible" :goodsId="goodsId" v-if="dialogFormVisible"
                @goodsSubmitSuccess="submitSuccess" @closeGoodsDialog="closeGoodsDialog">
    </goods-form>
    <el-dialog title="请选择商品标签" v-if="dialogCommodityVisible" :visible.sync="dialogCommodityVisible" append-to-body>
      <commodity-selector @closeCommodityDialog="closeCommodityDialog" :isSingle="false" ref="commodity" :selectCommodity="selectCommodity"></commodity-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCommodity">取 消</el-button>
        <el-button type="primary" @click="handleSubmitCommodity" :loading="isCommodity">确 定</el-button>
      </span>
    </el-dialog>

    <!--外部产品数据弹窗-->
    <cover-from-out v-if="dialogDataBaseVisible" :dialogDataBaseVisible="dialogDataBaseVisible"
                    @closeCoverDialog="closeCoverDialog"
                    @coverSubmitSuccess="coverSubmitSuccess" :fromOut="fromOut"
                    :selfCategoryId="selfCategoryId" :categoryLists="categoryList"></cover-from-out>
  </div>
</template>


<script>
  import {
    page,
    delObj,
    listCatAndBrand,
    initGoodsFromStandardStore,
    updateOnSaleStatus,
    updateIsNewStatus,
    updateIsHotStatus,
    downTemplate
  } from '@/api/erp/goods/goods';
  import {page as goodsTypePage} from '@/api/erp/goods/goodsType';
  import BackToTop from '@/components/BackToTop';
  import goodsForm from './goodsForm';
  import coverFromOut from './coverFromOut';
  import {getToken} from '@/utils/auth';
  import commoditySelector from '@/components/ERP/Goods/CommoditySelector';
  import {changeGoodsTag} from '@/api/erp/goods/goodsTag';

  export default {
    name: 'GoodsList',
    components: {BackToTop, goodsForm, coverFromOut,commoditySelector},
    data() {
      return {
        headers: null,
        fromOut: '',
        selfCategoryId: undefined,
        clientHeight: 300,
        list: [],
        total: 0,
        isCommodity:false,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          goodsCode: undefined,
          name: undefined,
          categoryId: undefined,
          brandId: undefined,
          itemNo: undefined,
          specModel: undefined,
          seriesName: undefined,
          isOnSale: undefined
        },
        productModeOptions: [{
          value: '0',
          label: '实物类商品'
        }, {
          value: '1',
          label: '服务类商品'
        }, {
          value: '2',
          label: '虚拟类商品'
        }],
        statusOptions: [{
          value: 0,
          label: '是'
        }, {
          value: 1,
          label: '否'
        }],
        goodsTypeList: [],
        fileList: [],
        goodsDetail: '',
        dialogCommodityVisible: false,
        detailDialogVisible: false,
        dialogFormVisible: false,
        goodsDialogTitle: '',
        downloadLoading: false,
        goodsId: null,
        categoryList: [],
        brandList: [],
        isOpenTree: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        breadcrumbList: [{label: '所有分类', value: 0}],
        isInitializing: false,
        initializingShow: true,
        queryVisible: true,
        dialogDataBaseVisible: false,
        selectedRows: [],
        selectCommodity:[],
      }
    },
    created() {
      this.headers = {
        Authorization: getToken()
      }
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.init();
      if (this.$store.state.user.id == '1') {
        this.initializingShow = false; // 超级管理员不显示商品初始化功能
      }
      this.getList();
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      }
    },
    methods: {
      handleSubmitCommodity() {
        this.$refs.commodity.onSubmit();
      },
      handleCancelCommodity() {
        this.$refs.commodity.reset();
        this.dialogCommodityVisible = false;
      },
      closeCommodityDialog(list){
        console.log(list);
        if(list.length>0){
          let tagData = [];
          for(let i in list){
            tagData.push(list[i]);
          }
          let tag = tagData.join(',');
          this.isCommodity = true;
          changeGoodsTag(this.selectedRows[0].id,tag).then(res=>{
            if(res.code == 2000 || res.code == '2000'){
              this.vueMessage('success','成功!');
            }else{
              this.vueMessage('warning',res.msg);
            }
            this.isCommodity = false;
            this.dialogCommodityVisible = false;
            this.getList();
          });
        }else{
          changeGoodsTag(this.selectedRows[0].id,' ').then(res=>{
            if(res.code == 2000 || res.code == '2000'){
              this.vueMessage('success','成功!');
            }else{
              this.vueMessage('warning',res.msg);
            }
            this.isCommodity = false;
            this.dialogCommodityVisible = false;
            this.getList();
          });
          this.isCommodity = false;
          this.dialogCommodityVisible = false;
        }
      },
      commodityClick(){
        if(this.selectedRows.length<1){
          this.vueMessage('warning','请选择商品!');
          return
        }
        if(this.selectedRows.length>1){
          this.vueMessage('warning','请选择一个编辑的商品!');
          return
        }
        this.dialogCommodityVisible = true;
        console.log(this.selectedRows[0]);
        this.selectCommodity = undefined;
        this.selectCommodity = JSON.parse(JSON.stringify(this.selectedRows[0].tagsList));
        console.log(this.selectCommodity);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      groundingClick(val) {
        let obj = [];
        for (let i in this.selectedRows) {
          obj.push(this.selectedRows[i].id)
        }
        if (obj == undefined || obj.length <= 0) {
          this.vueMessage('warning', '请先选择商品');
          return;
        }
        updateOnSaleStatus(val, obj).then(response => {
          if (response.code == '2000') {
            if (val == 0) {
              this.$notify({
                title: '成功',
                message: '上架成功',
                type: 'success',
                duration: 2000
              });
            } else {
              this.$notify({
                title: '成功',
                message: '下架成功',
                type: 'success',
                duration: 2000
              });
            }
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        });

      },
      dialogDataVisible() {
        if (this.listQuery.categoryId !== undefined) {
          this.dialogDataBaseVisible = true;
        } else {
          this.vueMessage('warning', '请选择分类');
        }
      },
      closeCoverDialog() {
        this.dialogDataBaseVisible = false;
      },
      coverSubmitSuccess() {
        this.dialogDataBaseVisible = false;
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(() => {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 49;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      init() {
        listCatAndBrand().then(response => {
          this.categoryList = response.data.categoryList;
          this.brandList = response.data.brandList;
        });
        goodsTypePage().then(response => {
          this.goodsTypeList = response.data.records;
        });
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          for(let i in response.data.records){
            if(response.data.records[i].tags && response.data.records[i].tags!==''){
              response.data.records[i].tagsList = response.data.records[i].tags.split(',');
            }else{
              response.data.records[i].tagsList = [];
            }
          }
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleOpenTree() {
        this.isOpenTree = !this.isOpenTree;
        for (const i in this.$refs.categoryTree.store.nodesMap) {
          this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getAllParentNode(node, arr) {
        if (node.parent && node.parent.label) {
          arr.push({
            label: node.parent.label,
            value: node.parent.key
          });
          if (node.parent.parent) {
            this.getAllParentNode(node.parent, arr);
          }
        }
        return arr;
      },
      getNodeData(data, node) {
        this.listQuery.categoryId = data.value;
        this.fromOut = data.label;
        this.selfCategoryId = data.value;
        let breadcrumbList = [];
        breadcrumbList.push(data);
        if (node.parent) {
          breadcrumbList = this.getAllParentNode(node, breadcrumbList);
        }
        this.breadcrumbList = breadcrumbList.reverse();
        this.handleFilter();
      },
      changeTreeNode(data, index) {
        if (data.label == '所有分类') {
          return;
        }
        this.breadcrumbList.splice(index + 1, this.breadcrumbList.length - index - 1);
        this.listQuery.categoryId = data.value;
        this.$refs.categoryTree.setCurrentKey(data.value);
        this.handleFilter();
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      openGoodsDialog() {
        this.goodsId = '';
        this.goodsDialogTitle = '商品新增';
        this.dialogFormVisible = true;
      },
      closeGoodsDialog() {
        this.dialogFormVisible = false;
      },
      submitSuccess() {
        this.goodsId = '';
        this.dialogFormVisible = false;
        this.getList();
      },
      handleUpdate(index, row) {
        if (row.isOnSale < 1) {
          this.$confirm('该商品未下架不可编辑, 是否下架?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateOnSaleStatus(1, row.id).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList()
                this.goodsId = row.id;
                this.goodsDialogTitle = '商品编辑';
                this.dialogFormVisible = true;

              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
          });
        } else {
          this.goodsId = row.id;
          this.goodsDialogTitle = '商品编辑';
          this.dialogFormVisible = true;
        }
      },
      showDetail(detail) {
        this.goodsDetail = detail;
        this.detailDialogVisible = true;
      },
      handleDelete(index, row) {
        if (row.isOnSale < 1) {
          this.$confirm('该商品未下架不可删除, 是否下架?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            updateOnSaleStatus(1, row.id).then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '更新成功',
                  type: 'success',
                  duration: 2000
                });
                this.getList();
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  delObj(row.id).then(() => {
                    this.$notify({
                      title: '成功',
                      message: '删除成功',
                      type: 'success',
                      duration: 2000
                    });
                    const index = this.list.indexOf(row);
                    this.list.splice(index, 1);
                  });
                });

              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'warning',
                  duration: 2000
                })
              }
            });
          });
        } else {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            delObj(row.id).then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            });
          });
        }

      },
      // 文件上传
      handleRemove(file, fileList) {
        //console.log(file, fileList);
      },
      beforeUpload(file) {
        //console.log(file);
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
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        //return this.$confirm(`确定移除 ${file.name}？`);
      },
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '导入完成',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          this.getList();
        } else {
          this.$notify({
            title: '失败',
            message: response.msg,
            type: 'warning',
            duration: 2000
          })
        }
      },
      handleDownload() {
        this.downloadLoading = true;
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['商品名称','系列', '规格型号', '订货号', '图片', '产品面价', '客户订货折扣', '客户订货价', '预计采购价', '计量单位']
          const filterVal = ['name', 'seriesName','specModel', 'itemNo', 'picUrl', 'retailPrice', 'customerDiscount', 'price', 'costPrice', 'unit']
          excel.export_json_to_excel2(tHeader, this.list, filterVal, '商品列表');
          this.downloadLoading = false;
        })
      },
      handleDownloadTemplate() {
        downTemplate().then(msg => {
          var blob = msg;
          var reader = new FileReader();
          reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            var a = document.createElement('a');
            a.download = '模板.xlsx';
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        });
      },
      initGoods() {
        this.$confirm('初始化会从标准商品库中同步商品信息，并清除现有商品库的所有数据，确认初始化吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.isInitializing = true;
            initGoodsFromStandardStore().then(
              response => {
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '初始化成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.isInitializing = false;
                  this.getList();
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
              }
            )
          }
        )
      },
      handlePublishStatusChange(index, row) {
        updateOnSaleStatus(row.isOnSale, row.id).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
            this.getList()
          }
        });
      },
      handleNewStatusChange(index, row) {
        updateIsNewStatus(row.isNew, row.id).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.getList()
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        });
      },
      handleRecommendStatusChange(index, row) {
        updateIsHotStatus(row.isHot, row.id).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            });
            this.getList()
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
    },
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .goods-list-container {
    .box-card {
      overflow: auto;
    }

    .curr-classify {
      font-size: 14px;
      position: relative;
      top: -2px;
      color: #5a5e66;
    }

    .query-visible {
      color: #409EFF;
      margin-left: 10px;
      cursor: pointer;
      font-size: 14px;
    }

    .el-breadcrumb__inner a {
      color: #1276c3 !important;
      cursor: pointer !important;
    }

    .table-expand {
      font-size: 0;
    }

    .table-expand label {
      width: 100px;
      color: #99a9bf;
    }

    .table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
    }

    .gallery {
      width: 80px;
      margin-right: 10px;
    }

    .goodsFormDialog > .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .goodsFormDialog > .el-dialog > .el-dialog__body {
      width: 100%;
      position: absolute;
      top: 40px;
      padding-top: 10px !important;
    }

    .goodsFormDialog > .el-dialog > .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }

    .goods-form-container {
      .topTable {
        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }

        .el-textarea__inner {
          border: none;
          resize: none;
          padding: 10px 15px;
        }

        .el-form-item__content {
          width: 100%;
          margin-left: 0px !important;
          line-height: 39px;

          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }
        }

        .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
          line-height: 40px;
          color: #444;
          /* width: 220px!important;*/
        }

        .input-new-keyword .el-input__inner {
          border: 1px solid #409EFF !important;
        }
      }
    }
  }
</style>
