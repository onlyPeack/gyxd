<template>
  <div class="full-purchase customer-order-full-purchase">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="单据编号"
                  v-model="listQuery.billNo"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="制单人"
                  v-model="listQuery.crtUserName"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="企业编号"
                  v-model="listQuery.targetCompanyCode"
                  @keyup.enter.native="handleFilter">
        </el-input>
        <el-date-picker
          v-model="createTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="单据开始日期"
          end-placeholder="单据结束日期"
          value-format="yyyy-MM-dd"
          @change="handleCreateTimeSelect"
          style="position: relative;top:-4px;"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button class="filter-item" type="primary" @click="handleFilter" style="margin-left: 30px;">查询
        </el-button>
        <el-button class="filter-item" type="warning" @click="handleReset">重置</el-button>

      </div>
      <div class="query-container">
        <div v-if="choose">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="品牌名称"
                    v-model="listQuery.brandName"
                    @keyup.enter.native="handleFilter" v-if="choose">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="商品名称"
                    v-model="listQuery.skuName"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="订货号"
                    v-model="listQuery.itemNo"
                    @keyup.enter.native="handleFilter">
          </el-input>
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="规格型号"
                    v-model="listQuery.specifications"
                    @keyup.enter.native="handleFilter">
          </el-input>
        </div>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" v-if="!choose">查看</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete" v-if="!choose">删除</el-button>
      <el-switch v-model="choose" active-text="详情" inactive-text="单据" class="switch"
                 @change="handleSwitch"></el-switch>
    </div>

    <!-- 查询结果 -->
    <!--详情-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              size="mini" highlight-current-row element-loading-text="正在查询中。。。"
              :height="clientHeight" v-if="choose" key="dataTable1" class="result-data-table">
      <el-table-column prop="mainDTO.billNo" label="单据编号" width="150"></el-table-column>
      <el-table-column prop="mainDTO.publicType" label="发布方式" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.mainDTO">{{scope.row.mainDTO.publicType | formatPublicType}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="mainDTO.publicCircle" label="发布周期" width="80"></el-table-column>-->
      <el-table-column prop="mainDTO.targetCompanyCode" label="企业编码" width="120"></el-table-column>
      <el-table-column prop="mainDTO.targetCompanyName" label="企业名称" min-width="150"></el-table-column>
      <el-table-column prop="mainDTO.billStatus" label="单据状态" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.mainDTO">{{scope.row.mainDTO.billStatus | formatBillStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mainDTO.crtUserName" label="创建人" width="120"></el-table-column>
      <el-table-column prop="skuName" label="产品名称" min-width="150"></el-table-column>
      <el-table-column prop="skuSeries" label="系列" min-width="150"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" min-width="150"></el-table-column>
      <el-table-column prop="specifications" label="型号" min-width="150"></el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="150"></el-table-column>
      <el-table-column prop="unit" label="单位" width="50"></el-table-column>
      <el-table-column prop="publishPercent" label="发布比例" width="80"></el-table-column>
      <el-table-column prop="publicNum" label="发布数量" width="80"></el-table-column>
      <el-table-column prop="publicHouseName" label="发布仓库" min-width="100"></el-table-column>
    </el-table>
    <!--单据-->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @selection-change="handleChangeFun" size="mini" v-else
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable" class="result-data-table">
      <el-table-column type="selection" width="60"></el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="billNo" label="单据编号" width="150">
        <template slot-scope="scope">
          <div class="colum-billno" @click="handleDetailOpen(scope.row)">
            {{scope.row.billNo}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="publicType" label="发布方式" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.publicType | formatPublicType}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="publicCircle" label="发布周期" width="120"></el-table-column>-->
      <el-table-column prop="targetCompanyCode" label="企业编码" width="120"></el-table-column>
      <el-table-column prop="targetCompanyName" label="企业名称"></el-table-column>
      <el-table-column prop="billStatus" label="单据状态" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.billStatus | formatBillStatus}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="type" label="类型" width="150"></el-table-column>-->
      <el-table-column prop="crtUserName" label="创建人" width="150"></el-table-column>
      <el-table-column prop="crtTime" label="单据日期" width="150"></el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增客户订货单弹窗 -->
    <stock-center-publish-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                               @submitSuccess="submitFormSuccess" @handleClose="handleFormClose">
    </stock-center-publish-form>

    <!-- 客户订货单详情弹窗 -->
    <stock-center-publish-detail :dialogFormVisible="dialogDetailVisible" v-if="dialogDetailVisible" :id="id"
                                 @submitSuccess="submitDetailSuccess" @handleClose="handleDetailClose">
    </stock-center-publish-detail>

  </div>
</template>

<script>
  import { selectPage, selectPageByItem, batchDelBill } from '@/api/erp/mall/scs/publish'

  export default {
    name: 'publishList',
    components: {
      'stock-center-publish-form': () => import('./form'),
      'stock-center-publish-detail': () => import('./detail')
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          billNo: undefined,
          crtUserName: undefined,
          startBillDate: undefined,
          endBillDate: undefined,
          targetCompanyCode: undefined,
          brandName: undefined,
          skuName: undefined,
          itemNo: undefined,
          specifications: undefined
        },
        clientHeight: 300,
        dialogFormVisible: false,
        dialogDetailVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        },
        createTime: '',
        availability: true,
        id: null,
        choose: false
      }
    },
    created() {
      const _this = this
      this.changeDivHeight()
      window.onresize = function() {
        _this.changeDivHeight()
      }
      this.getList()
    },
    updated() {
      this.changeDivHeight()
    },
    filters: {
      formatPublicType(value) {
        if (value === 1) {
          return '对外'
        } else if (value === 2) {
          return '对内'
        } else {
          return '未知'
        }
      },
      formatBillStatus(value) {
        if (value === 1) {
          return '制单、暂存'
        } else if (value === 2) {
          return '流转中、待审核'
        } else if (value === 3) {
          return '作废'
        } else if (value === 4) {
          return '正常'
        } else if (value === 5) {
          return '回退'
        } else {
          return '制单、暂存'
        }
      }
    },
    methods: {
      handleSwitch() {
        this.listQuery.page = 1
        if (this.choose == true) { //详情
          this.getListByItem()
        } else { //单据
          this.getList()
        }
      },
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight
        } else {
          height = 38
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1
      },
      getList() {
        this.listLoading = true
        selectPage(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleSizeChange(val) {
        this.listQuery.limit = val
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      getListByItem() {
        this.listLoading = true
        selectPageByItem(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        }).catch(() => {
          this.list = []
          this.total = 0
          this.listLoading = false
        })
      },
      handleFilter() {
        this.listLoading = true
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      handleCreate() {
        this.id = ''
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      handleFormClose() {
        this.id = ''
        this.dialogFormVisible = false
      },
      handleDetailClose() {
        this.id = ''
        this.dialogDetailVisible = false
      },
      handleReset() {
        this.listQuery.billNo = undefined
        this.listQuery.crtUserName = undefined
        this.listQuery.targetCompanyCode = undefined
        this.listQuery.brandName = undefined
        this.listQuery.skuName = undefined
        this.listQuery.itemNo = undefined
        this.listQuery.specifications = undefined
        this.createTime = undefined
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'warning',
            duration: 2000
          })
          return false
        }
        let ids = []
        this.selectedRows.forEach(function(row) {
          ids.push(row.id)
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDelBill(ids)
            .then(response => {
              if (response.code == '2000') {
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                })
                if (this.choose == true) {
                  this.getListByItem()
                } else {
                  this.getList()
                }
              } else {
                this.$notify({
                  title: '失败',
                  message: response.msg,
                  type: 'error',
                  duration: 2000
                })
              }
            })
        })
      },
      submitFormSuccess() {
        this.dialogFormVisible = false
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      handleChangeFun(val) {
        if (val.length > 0) {
          this.availabilityChange(val[val.length - 1])
        }
        this.selectedRows = val
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要查看的条目',
            type: 'warning',
            duration: 2000
          })
          return false
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能查看一个条目',
            type: 'error',
            duration: 2000
          })
          return false
        }
        /*if (this.selectedRows[0].billStatus.toString() !== '1') {
          this.$notify({
            title: '提示',
            message: '当前状态不能编辑',
            type: 'error',
            duration: 2000
          });
          return;
        }*/
        this.id = this.selectedRows[0].id
        this.dialogStatus = 'update'
        this.dialogDetailVisible = true
      },
      handleCreateTimeSelect(val) {
        this.listQuery.startBillDate = val[0]
        this.listQuery.endBillDate = val[1]
      },
      handleDetailOpen(row) {
        this.id = row.id
        this.dialogDetailVisible = true
      },
      handleDetailClose() {
        this.id = ''
        this.dialogDetailVisible = false
      },
      submitDetailSuccess() {
        this.dialogDetailVisible = false
        if (this.choose == true) {
          this.getListByItem()
        } else {
          this.getList()
        }
      },
      availabilityChange(row) {
        var billStatus
        if (row.billStatus) {
          billStatus = row.billStatus
        } else {
          if (row.mainDTO && row.mainDTO.billStatus) {
            billStatus = row.mainDTO.billStatus
          }
        }
        if (!billStatus || billStatus == 1 || billStatus == 5) {
          this.availability = true
        } else {
          this.availability = false
        }
      }
    },
    watch: {
      createTime(value) {
        if (value == null) {
          this.listQuery.startBillDate = undefined
          this.listQuery.endBillDate = undefined
        }
      }
    }
  }
</script>

<style lang="scss">
  .customer-order-full-purchase {
    margin: 10px 20px;

    .el-switch {
      float: right;
    }

    .filter-container {
      padding-bottom: 0px;

      .query-visible {
        color: #409EFF;
        margin-left: 10px;
        cursor: pointer;
        font-size: 14px;
      }

      ul {
        list-style: none;
        display: block;
        line-height: 40px;
        margin: 0;
        padding: 0;

        li {
          float: left;
          margin-left: 20px;

          svg {
            font-size: 26px;
            margin-right: 8px;
          }
        }
      }

      .query-container {
        font-size: 14px;
        color: #444;

        .block {
          margin-bottom: 10px;

          .demonstration {
            padding-right: 10px;
          }

          .el-date-editor {
            width: 400px;
            margin-right: 15px;
          }
        }
      }
    }

    .el-dialog {
      margin-top: 0vh !important;
      margin-bottom: 0vh !important;
      height: 100vh;
    }

    .el-dialog__body {
      padding-top: 10px;
    }

    .el-dialog__footer {
      position: absolute;
      width: 100%;
      bottom: 0px;
    }

    .pagination-container {
      margin-top: 5px;
    }

    .result-data-table .cell {
      height: 23px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .colum-billno {
      color: #0078D7;
      cursor: pointer;
    }

    .customerOrderDialog {
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
          white-space: nowrap;
        }
      }

      .tb-edit {
        flex: 1 0 auto;

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

          .el-input, .el-select {
            width: 100%;
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

    .customerOrderDetailDialog {
      .topTable {
        .el-form-item__content {
          line-height: 40px;
        }
      }

      .tb-detail {
        flex: 1 0 auto;

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
      }
    }
  }

  .goodsDialog > .el-dialog {
    margin-top: 0vh !important;
    margin-bottom: 0vh !important;
    height: 100vh;
  }

  .goodsDialog > .el-dialog > .el-dialog__header {
    position: absolute;
    height: 50px;
    width: 100%;
  }

  .goodsDialog > .el-dialog > .el-dialog__body {
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    padding: 50px 20px 60px 20px;
    display: flex;
  }

  .goodsDialog > .el-dialog > .el-dialog__footer {
    position: absolute;
    width: 100%;
    height: 60px;
    bottom: 0px;
    background-color: #fff;
  }

</style>
