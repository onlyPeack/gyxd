<template>
  <div class="full-purchase bill-container">
    <el-tabs  v-model="activity">
      <el-tab-pane label="新建" name="first">
        <!-- 新增弹窗 -->
        <article-form :nowRow="nowRow" @submitSuccess="submitSuccess" @handleClose="handleClose"></article-form>
      </el-tab-pane>
      <el-tab-pane label="列表" name="second">
        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <div class="query-container">
            <div>
              <el-input clearable class="filter-item" style="width: 200px;" placeholder="文章标题"
                        v-model="listQuery.title"
                        @keyup.enter.native="handleFilter">
              </el-input>
              <el-select v-model="listQuery.type" class="filter-item" placeholder="文章类型" clearable>
                <el-option value="文章"></el-option>
              </el-select>
              <el-select v-model="listQuery.recommend" class="filter-item" placeholder="热点推荐" clearable>
                <el-option value="1" label="是"></el-option>
                <el-option value="0" label="否"></el-option>
              </el-select>
              <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
              </el-button>
              <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>
            </div>
          </div>
        </div>
<!--        <div style="margin-top: 1px;">-->
<!--          <el-button type="text" icon="el-icon-plus" @click="handleCreate" id="add_bill">新建</el-button>-->
<!--          <el-button type="text" icon="el-icon-edit" @click="handleUpdate" id="edit_bill">编辑</el-button>-->
<!--          <el-button type="text" icon="el-icon-delete" @click="handleDelete" id="delete_bill">删除</el-button>-->
<!--        </div>-->

        <!-- 查询结果 -->
        <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
                  @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
                  highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
                  show-summary :summary-method="getSummaries" key="dataTable2" class="result-data-table"
                  @row-dblclick="handleOpenDetailOrForm" >
          <el-table-column label="#" prop="type" align="center" type="index">
          </el-table-column>
          <el-table-column label="文章类型" prop="type" align="center">
          </el-table-column>
          <el-table-column prop="columns" label="栏目名" align="center">
          </el-table-column>
          <el-table-column prop="title" label="文章标题" align="center">
          </el-table-column>
          <el-table-column prop="author" label="作者" width="120">
          </el-table-column>
          <el-table-column prop="sort" label="排序" sortable>
          </el-table-column>
          <el-table-column prop="recommend" label="是否热点推荐" v-slot="{row}">
            <span v-if="row.recommend*1===1">是</span>
            <span v-else>否</span>
          </el-table-column>
          <el-table-column prop="pageviews" label="浏览量" sortable>
          </el-table-column>
          <el-table-column prop="startTime" label="发布时间">
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <span style="color:#409EFF;cursor: pointer;margin-right: 15px;" @click="handleUpdate(scope.row)">编辑</span>
              <span style="color:#409EFF;cursor: pointer" @click="handleDelete(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="listQuery.page"
                         :page-sizes="[10,20,50,100]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>

      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script>
  import {page as selectPage,delObj} from '@/api/mall/statistical/article';
  import {getFloat} from '@/utils/util';

  export default {
    name: "article",
    components: {
      'article-form': () => import('./articleForm'),
    },
    data() {
      return {
        downloadLoading: false,
        list: [],
        total: undefined,
        id:'',
        nowRow:{},
        listLoading: true,
        activity:'second',
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          skuNo: undefined,
          skuName: undefined,
          specifications: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          invoiceNo: undefined,
          crtUserNo: undefined,
          customerName:undefined,
          billStatus:undefined,
          departName:undefined,
          itemNo:undefined,
        },
        createOption:[
          {
            value: "0",
            label: "商城订单"
          },
          {
            value: "1",
            label: "手工订单"
          },
        ],
        sp3Option:[
          {
            value: "0",
            label: "现货"
          },
          {
            value: "1",
            label: "期货"
          },
          {
            value: "2",
            label: "调拨"
          },
        ],
        distributionOptions: [
          {
            value: "0",
            label: "快递运输"
          },
          {
            value: "1",
            label: "运费到付"
          },
          {
            value: "2",
            label: "货物自提"
          },
          {
            value: "3",
            label: "货运物流"
          }
        ],
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        choose: false,
        selectedRows: [],
        queryVisible: false,
        textMap: {
          update: '编辑',
          create: '新增'
        },
        billDate: undefined,
      };
    },
    created() {
      //this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
      // this.$axios.post()
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleViewContract(url) {
        window.location.href = url
      },
      handleDownloadContract(orderSn,customerCode) {
        window.location.href = window.location.origin + `/api/mall/oms-order-manual/download?billNo=${orderSn}&customerCode=${customerCode}`
      },
      handleDownload() {
        if (this.selectedRows.length < 1) {
          this.$notify.warning('请选择要导出的单据');
          return;
        }

        this.downloadLoading = true;
        var selectedRows = this.selectedRows == undefined || this.selectedRows == null ? [] : this.selectedRows;
        import('@/vendor/Export2Excel').then(excel => {
          var tHeader;
          var filterVal;
          var list = JSON.parse(JSON.stringify(selectedRows));
          if (this.choose == false) {
            tHeader = ['单据编号', '单据状态', '发票号码', '发票类型', '退票金额', '客户名称', '纳税人识别号', '开户银行', '银行账号', '关联单据', '退票原因', '单据日期', '制单人'];
            filterVal = ['billNo', 'billStatus', 'invoiceNo', 'invoiceType', 'invoiceAmount', 'customerName', 'taxpayerNumber', 'bankName', 'bankAccount', 'sourceBillNo', 'note', 'billDate', 'crtUserName'];
          } else {
            for (var i in list) {
              Object.assign(list[i], list[i].mainDTO);
              delete list[i].mainDTO;
            }
            tHeader = ['单据编号', '单据状态', '发票号码', '发票类型', '退票金额', '客户名称', '单据日期', '制单人', '商品名称', '规格型号', '单位', '开票数量', '退票数量', '单价', '金额', '税额', '含税单价', '价税合计', '退票原因'];
            filterVal = ['billNo', 'billStatus', 'invoiceNo', 'invoiceType', 'invoiceAmount', 'customerName', 'billDate', 'crtUserName', 'skuName', 'specifications', 'unit', 'invoiceQty', 'qty', 'price', 'amount', 'tax', 'taxPrice', 'taxAmount', 'note'];
          }
          excel.export_json_to_excel2(tHeader, list, filterVal, '销售退票');
          this.downloadLoading = false;
        })
      },
      queryVisibleChange() {
        this.queryVisible = !this.queryVisible;
        const _this = this;
        setTimeout(function () {
          _this.changeDivHeight();
        }, 1)
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 38;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      getList() {
        this.listLoading = true;
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        }).catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            if (column.property == 'invoiceAmount' || column.property == 'amount'
              || column.property == 'tax' || column.property == 'taxAmount') {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return getFloat(prev + curr, 4);
                } else {
                  return getFloat(prev, 4);
                }
              }, 0).toFixed(4);
              sums[index] += ' ';
            }

          } else {
            sums[index] = ' ';
          }
        });

        return sums;
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      getListByItem() {
        this.listLoading = true;
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
        this.listLoading = true;
        if (this.choose == true) {
          this.listQuery.page = 1;
          this.getListByItem();
        } else {
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleCreate() {
        this.id = '';
        // this.dialogStatus = 'create';
        // this.dialogFormVisible = true;
        this.activity='first'
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      handleReset() {
        delete this.listQuery.recommend
        delete this.listQuery.title
        delete this.listQuery.type
        this.handleFilter()
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
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
            });
        });
      },
      handleRowClick(row, event, column) {
        this.controlButtonShow(row);
        this.$refs.dataTable.toggleRowSelection(row);
      },
      submitSuccess() {
        //this.dialogFormVisible = false;
        // if (this.choose == true) { //详情
        //   this.getListByItem();
        // } else { //单据
        //   this.getList();
        // }
        this.$router.replace({
          path: '/refresh',
          query: {
            date: Date.now()
          }
        })
      },
      handlechangeFun(val) {
        if (val.length > 0) {
          this.controlButtonShow(val[val.length - 1]);
        }
        this.selectedRows = val;
      },
      handleUpdate(row) {
        // this.dialogStatus = 'update';
        // this.dialogFormVisible = true;
        this.activity='first'
        this.nowRow=row
      },
      handleSwitch() {
        if (this.choose == true) { //详情
          this.listQuery.page = 1;
          this.getListByItem();
        } else { //单据
          this.listQuery.page = 1;
          this.getList();
        }
      },
      handleDetailOpen(row) {
        if (!this.choose) {
          this.id = row.id;
        } else {
          this.id = row.mainDTO.id;//详情
        }
        // this.dialogFormVisible = true
        this.dialogDetailVisible = true;
      },
      handleDetailClose() {
        this.id = '';
        this.dialogDetailVisible = false;
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false;
        if (this.choose == true) { //详情
          this.getListByItem();
        } else { //单据
          this.getList();
        }
      },
      handleBillDateSelect(val) {
        this.listQuery.startBillDate = val[0];
        this.listQuery.endBillDate = val[1];
      },
      handleDeliverDateSelect(val) {
        this.listQuery.startDeliverDate = val[0];
        this.listQuery.endDeliverDate = val[1];
      },
      handleOpenDetailOrForm(row) {
        var billStatus;
        if (row.billStatus) {
          billStatus = row.billStatus;
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus;
          }
        }
        //console.log('billStatus');
        //console.log(billStatus);
        if (billStatus && billStatus == 1) {
          //console.log('打开编辑页');
          if (!this.choose) {
            this.id = row.id;
          } else {
            this.id = row.mainDTO.id;//详情
          }
          //this.dialogStatus = 'update';
          //this.dialogFormVisible = true;
          this.activity='first'
        } else {
          console.log('打开详情');
          this.handleDetailOpen(row);
        }
      }
    },
    watch: {
      billDate(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined;
          this.listQuery.endBillDate = undefined;
        }
      }
    }
  }
</script>
