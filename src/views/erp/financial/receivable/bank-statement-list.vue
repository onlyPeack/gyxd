<template>
  <div class="full-purchase bank-statement-full-purchase">

    <!-- 查询和其他操作 -->
    <div class="filter-container  bank-statement-filter-container">
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button type="text" v-if="false">
        <svg-icon icon-class="import1" style="margin-right: 3px;"></svg-icon>
        导入
      </el-button>
    </div>

    <!-- 查询结果 -->
    <el-table :data="list" border style="width: 100%" v-loading="listLoading" ref="dataTable"
              @row-click="handleRowClick" @selection-change="handlechangeFun" size="mini"
              highlight-current-row element-loading-text="正在查询中。。。" :height="clientHeight"
              key="dataTable2" class="result-data-table">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="billDate" label="到账日期">
      </el-table-column>
      <el-table-column prop="billNo" label="汇款银行名称">
      </el-table-column>
      <el-table-column prop="crtUserName" label="汇款人名称">
      </el-table-column>
      <el-table-column prop="currencyId" label="币别">
        <template slot-scope="scope">
          <span v-for="item in currencyOptions">
            <span v-if="scope.row.currencyId ===item.value">{{item.label}}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="currencyAccuracy" label="到账金额" align="right">
      </el-table-column>
      <el-table-column prop="printCount" label="收款账户">
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 编辑银行流水弹窗 -->
    <!--<bank-statement-form :dialogFormVisible="dialogFormVisible" v-if="dialogFormVisible" :id="id"
                                      @submitSuccess="submitSuccess" @handleClose="handleClose">
    </bank-statement-form>-->

  </div>
</template>

<script>
  import {selectPage, batchDelBill} from '@/api/erp/purchase/bill/purchaseApply';
  import {getFloat} from '@/utils/util';

  export default {
    name: "bank-statement-list",
    components: {
      /*'bank-statement-form': () => import('./bank-statement-form'),*/
    },
    data() {
      return {
        list: [],
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
        },
        clientHeight: 300,
        dialogFormVisible: false,
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '新增'
        }
      };
    },
    created() {
      this.changeDivHeight();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('bank-statement-filter-container')[0]) {
          var height = document.getElementsByClassName('bank-statement-filter-container')[0].clientHeight;
        } else {
          height = 46;
        }
        this.clientHeight = (document.body.clientHeight - (220 + height)) * 1;
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
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handlechangeFun(val) {
        this.selectedRows = val;
      },
      handleClose() {
        this.id = '';
        this.dialogFormVisible = false;
      },
      submitSuccess() {
        this.dialogFormVisible = false;
        this.getList();
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        }
        let ids = [];
        this.selectedRows.forEach(function (row) {
          ids.push(row.id)
        });
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
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.id = this.selectedRows[0].id;
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
      }
    }
  }
</script>

<style lang="scss">
  .bank-statement-full-purchase {
    margin: 0px 10px;

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

    .salesReceivablesDialog {
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
        .el-tag {
          margin-right: 5px;
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

    .salesReceivablesDetailDialog {
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
