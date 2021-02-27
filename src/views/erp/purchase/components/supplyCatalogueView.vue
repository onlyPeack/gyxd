<template>
  <div style="margin: 10px;" class="goods-stock-query-container">
    <el-row>
      <el-col :span="4">
        <!-- 分类树 -->
        <el-card class="box-card" :style="{height:(clientHeight+124)+'px',}">
          <el-row>
            <el-col :span="16">
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="text" icon="plus" @click="handleOpenTree"
                         style="margin-left: 15px;font-size: 14px;">
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
        <div class="filter-container goods-stock-filter-container">
          <el-input clearable class="filter-item" placeholder="商品名称" style="width: 200px"
                    @keyup.enter.native="handleFilter" v-model="listQuery.name">
          </el-input>

          <el-input clearable class="filter-item" placeholder="标准系列" style="width: 200px"
                    @keyup.enter.native="handleFilter" v-model="listQuery.seriesName">
          </el-input>

          <el-input clearable class="filter-item" placeholder="返点系列" style="width: 200px"
                    @keyup.enter.native="handleFilter" v-model="listQuery.rebateSeries">
          </el-input>

          <el-input clearable class="filter-item" placeholder="规格型号" style="width: 200px"
                    @keyup.enter.native="handleFilter" v-model="listQuery.specModel">
          </el-input>

          <el-input clearable class="filter-item" placeholder="订货号" style="width: 200px"
                    @keyup.enter.native="handleFilter" v-model="listQuery.itemNo">
          </el-input>
          <div style="display: inline-block;vertical-align: top">
            <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button type="primary" icon="el-icon-delete" @click="resetForm" style="margin-right: 10px;">重置</el-button>
            <router-link to="/supplierManager/supplyCatalogue">
              <el-button type="success" icon="el-icon-back">返回</el-button>
            </router-link>
          </div>
          <div style="margin-bottom: 10px;">
            <el-button type="primary" @click="dialogFormVisible=true" icon="el-icon-plus">新增</el-button>
            <el-button type="primary" @click="volumeBtn" icon="el-icon-plus">批量加价点</el-button>
            <el-button type="primary" @click="handleDelete" icon="el-icon-delete">删除</el-button>
          </div>


        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row width="100%" :height="clientHeight" :show-header="true" ref="goodsSelectorTable"
                  @select-change="handleSelectChange" @select="handleSelect"
                  @select-all="handleSelectAll" @row-click="handleRowClick">
          <el-table-column type="index" width="50" fixed="left">
          </el-table-column>
          <el-table-column type="selection" width="50" fixed="left">
          </el-table-column>
          <el-table-column label="供应商名称" prop="supplierName" width="150" align="center">
          </el-table-column>
          <el-table-column label="供应商编码" prop="supplierCode" width="160" align="center">
          </el-table-column>
          <el-table-column label="商品名称" prop="name" width="160" align="center">
          </el-table-column>
          <el-table-column label="品牌" prop="brandName" width="100" align="center">
          </el-table-column>
          <el-table-column label="标准系列" prop="seriesName" min-width="120" align="center">
          </el-table-column>
          <el-table-column label="返点系列" prop="rebateSeries" min-width="120" align="center">
          </el-table-column>
          <el-table-column label="规格型号" prop="specModel" min-width="120" align="center">
          </el-table-column>
          <el-table-column label="订货号" prop="itemNo" min-width="180">
          </el-table-column>
          <el-table-column label="面价" prop="retailPrice" width="80" align="center">
          </el-table-column>
          <el-table-column label="计量单位(个)" prop="unit" width="130" align="center">
          </el-table-column>
          <el-table-column label="起订量" align="center" prop="minPack" width="80">
          </el-table-column>
          <el-table-column align="center" label="加价点" prop="point">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,50,200]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="批量加价点" width="30%" :visible.sync="pointVisible" append-to-body>
      <div style="margin-bottom: 20px;">
        <span style="margin-top: 4px;">加价点：</span>
        <el-input
          style="width: 280px;"
          type="text"
          placeholder="请输入批量加价点" v-model="point">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pointVisible = false">取 消</el-button>
        <el-button type="primary" @click="pointSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增供货目录弹窗 -->
    <catalogue-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible"
                    :supplierCode="$route.query.supplierCode" :type="$route.query.type"
                    @submitSuccess="submitSuccess" @handleClose="handleClose" class="bill-container">
    </catalogue-form>
  </div>
</template>

<script>
  import {listCatAndBrand} from '@/api/erp/goods/goods';
  import {queryStockDetail} from '@/api/erp/wms/stock_query/index';
  import {pageAll} from '@/api/erp/wms/config/warehouse';
  import {selectPageByItem, updatePoint, selectListCat, batchDelBill} from '@/api/erp/srm/supplyList';

  export default {
    props: ['isSingle', 'customerCode'],
    components: {
      'catalogue-form': () => import('../supplier/catalogueForm'),
    },
    data() {
      return {
        id: undefined,
        dialogFormVisible: undefined,
        point: undefined,
        pointVisible: false,
        warehouseList: [],
        chooseGoods: [],
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          categoryId: '',
          brandId: '',
          skuNo: '',
          name: '',
          seriesName: '',
          specModel: '',
          warehouseName: '',
          positionName: '',
          type: this.$route.query.type
          // supplierCode: ''
        },
        dataDTO: {
          skuNo: '',
          skuName: '',
          specifications: '',
          warehouseId: '',
          warehouseName: ''
        },
        brandList: [],
        categoryList: [],
        isOpenTree: true,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        filterText: '',
        fileList: undefined,
      };
    },
    watch: {
      filterText(val) {
        this.$refs.categoryTree.filter(val);
      }
    },
    created() {
      this.init();
      this.getList();
      const _this = this
      window.onresize = function () {
        _this.changeDivHeight('goods-stock-filter-container');
      }
    },
    updated() {
      this.changeDivHeight('goods-stock-filter-container');
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
      uploadCompleted(response, file, fileList) {
        if (response.code == '2000') {
          this.$notify({
            title: '成功',
            message: response.msg,
            type: 'success',
            duration: 2000
          });
          if (response.data.length > 0) {
            this.list = [...this.list, ...response.data]
            // this.selectedProducts = response.data;
            // console.log(this.selectedProducts);
            // const _this = this;
            // const dataMap = _this.data2Map(_this.items);

            // // 删除最后一个空行
            // _this.items.splice(_this.items.length - 1, 1);

            // // 遍历当前选中项
            // for (var index in this.selectedProducts) {
            //   var item = this.selectedProducts[index];


            //   var itemObj = {};
            //   itemObj.invoiceAmount = item.invoiceAmount;
            //   itemObj.notTaxPrice = item.notTaxPrice;
            //   itemObj.taxRate = String(item.taxRate);
            //   itemObj.taxPrice = item.taxPrice;
            //   itemObj.taxAmount = item.taxAmount;
            //   itemObj.notCancelAmount = item.taxAmount;
            //   itemObj.invoiceCode = item.invoiceAmount;
            //   itemObj.invoiceNo = item.invoiceNo;
            //   itemObj.makeInvoiceDate = item.makeInvoiceDate;
            //   itemObj.ticketDate = item.ticketDate;


            //   _this.items.push(itemObj);

            // }
            // // 添加一个空行
            // // _this.items.push([]);
            // _this.handleValueAdd();

            // for (var j in this.items) {
            //   this.vueSet(this.items, j, this.items[j]);
            // }

            // this.productVisible = false;
            // this.selectedProducts = [];
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
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      pointSubmit() {
        if (!this.point) {
          this.vueMessage('warning', '请输入加价点!');
          return
        }
        let ids = [];
        this.chooseGoods.forEach((row) => {
          ids.push(row.id)
        });
        updatePoint(ids, this.point).then((res) => {
          if (res.code == '2000') {
            this.$message({
              type: "success",
              message: "更新成功!"
            });
            this.getList(this.page);
            this.pointVisible = false;
          } else {
            this.$message({
              type: "error",
              message: "更新失败!"
            });
            this.pointVisible = false;
          }
        }, error => {
        });
      },
      volumeBtn() {
        this.point = undefined;
        if (this.chooseGoods.length < 1) {
          this.vueMessage('warning', '请选择至少一条数据!');
        } else {
          this.pointVisible = true;
        }
      },
      handleDelete() {
        if (this.chooseGoods.length < 1) {
          this.vueMessage('warning', '请选择至少一条数据!');
        } else {
          let ids = [];
          this.chooseGoods.forEach((row) => {
            ids.push(row.id)
          });
          batchDelBill(ids).then(() => {
            this.$message.success('删除成功')
            this.chooseGoods = []
            this.getList();
          })
        }
      },
      changeDivHeight(className) {
        if (document.getElementsByClassName(className)[0]) {
          var height = document.getElementsByClassName(className)[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (180 + height)) * 1;
      },
      init() {
        selectListCat().then(response => {
          this.categoryList = response.data;
          //this.brandList = response.data.brandList;
        });
        this.getWarehouseList();
      },
      getWarehouseList() {
        pageAll().then(response => {
          this.warehouseList = response.data;
        })
      },
      OnSubmit() {
        if (this.isSingle && this.chooseGoods.length > 1) {
          return
        }

        this.$emit('closeGoodsDialog', this.chooseGoods);
      },
      reset() {
        this.$refs.goodsSelectorTable.clearSelection();
        this.chooseGoods = [];
      },
      handleSelect(selection, row) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleSelectChange(selection, row) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleSelectAll(selection) {
        this.chooseGoods = Object.assign([], selection)
      },
      handleRowClick(row, event, column) {
        //判断是否已选中
        var flag = false;
        for (var i = this.chooseGoods.length - 1; i >= 0; i--) {
          if (this.chooseGoods[i].goodsId == row.goodsId) {
            flag = true;
            this.chooseGoods.splice(i, 1);
          }
        }
        if (!flag) {
          this.chooseGoods.push(row)
        }
        //切换选中状态
        this.$refs.goodsSelectorTable.toggleRowSelection(row);
        //this.chooseGoods.push(Object.assign({}, row));
      },
      handleClose() {
        this.dialogFormVisible = false;
      },
      getList() {
        this.listLoading = true;
        // 客户id，查询调整后的价格
        this.listQuery.customerCode = this.customerCode;
        this.listQuery.supplierCode = this.$route.query.supplierCode;
        this.listQuery.type = this.$route.query.type
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        // this.listQuery.page = 1;
        this.getList();
      },
      handleOpenTree() {
        this.isOpenTree = !this.isOpenTree;
        for (var i in this.$refs.categoryTree.store.nodesMap) {
          this.$refs.categoryTree.store.nodesMap[i].expanded = this.isOpenTree;
        }
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      getNodeData(data) {
        this.listQuery.categoryId = data.value;
        this.handleFilter();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      //重置按钮
      resetForm() {
        this.listQuery = {}
        this.getList()
      },
      //删除按钮
      deleteBtn() {
        batchDelBill().then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-stock-query-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    margin-top: 10px;
    padding-top: 10px;

    .el-col-20 {
      height: 93vh;
    }

    .filter-container {
      padding-bottom: 0px;

      .filter-item {
        width: 100%;
        padding-right: 10px;
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-table {
      height: 720px;
    }

    .el-dialog__body {
      padding-top: 10px;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }

    .box-card {
      overflow: auto;
      height: 93vh !important;
    }

    .pagination-container {
      margin-top: 10px;
    }
  }
</style>
