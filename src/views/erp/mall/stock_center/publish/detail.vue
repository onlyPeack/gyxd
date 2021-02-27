<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose"
             class="customerOrderDialog customerOrderDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>库存发布单详情</span>
        <span class="cont-title-billNo" v-if="dataForm.billNo">No.{{dataForm.billNo}}</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item label="企业名称:" prop="targetCompanyName" class="el-form-flex">
                {{dataForm.targetCompanyName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="企业编码:" prop="targetCompanyCode" class="el-form-flex">
                {{dataForm.targetCompanyCode}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item label="发布比例:" prop="publishPercent" class="el-form-flex">
                {{dataForm.publishPercent}}
              </el-form-item>
            </td>
            <td>
              <el-form-item label="发布方式:" prop="publicType" class="el-form-flex">
                <el-select v-model="dataForm.publicType" style="width: 100%;margin-top: 0px;">
                  <el-option v-for="item in publicOptions" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>

    <el-table :data="items" border highlight-current-row width="100%" :height="clientHeight" class="tb-detail">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="skuName" label="品名" min-width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" min-width="100"></el-table-column>
      <el-table-column prop="skuSeries" label="系列" min-width="100"></el-table-column>
      <el-table-column prop="specifications" label="型号" min-width="100"></el-table-column>
      <el-table-column prop="itemNo" label="订货号" min-width="100"></el-table-column>
      <el-table-column prop="marketPrice" label="面价" min-width="100"></el-table-column>
      <el-table-column prop="stockNum" label="可用库存" width="120"></el-table-column>
      <el-table-column prop="publishPercent" label="发布比例" width="80"></el-table-column>
      <el-table-column prop="publicNum" label="发布数量" width="80"></el-table-column>
    </el-table>
    <div class="order-making" v-if="dataForm.billNo">
      <span>制单人：{{dataForm.crtUserName}}</span>
      <span style="float: right;">制单时间：{{dataForm.crtTime}}</span>
    </div>

    <!--<div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.pageNum"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>-->

    <!-- 新增客户订货单弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div v-if="dataForm.billStatus && dataForm.billStatus==2" style="float: left;display: inline-block;">
        <!--<el-button type="warning" @click="handleAuditBill(5)">驳 回</el-button>
        <el-button type="primary" @click="handleAuditBill(4)">同 意</el-button>-->
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
        <!--<el-button type="primary" @click="handleAuditBill(1)">撤 销</el-button>-->
      </div>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {addBill, getBill, tempAddBill, auditBill} from '@/api/erp/mall/scs/publish';

  export default {
    name: "scsPublishDetail",
    components: {},
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        dataForm: {
          id: undefined,
          crtTime: undefined,
          publicType: undefined,
          publicCircle: 1,
          targetCompany: undefined,
          targetCompanyName: undefined,
          targetCompanyCode: undefined,
          publishPercent: undefined,
          publicNum: 0,
          items: []
        },
        total: 0,
        listQuery: {
          id: undefined,
          pageNum: 1,
          pageSize: 20
        },
        publicOptions:[
          {
            value: 1,
            label: '对外'
          },
          {
            value: 2,
            label: '对内'
          }
        ],
        items: []
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
        this.clientHeight = (document.body.clientHeight - 200) * 0.95;
      },
      init() {
        this.listQuery.id = this.id;
        getBill(this.id)
          .then(response => {
            this.dataForm = response.data;
            this.items = response.data.items;
          });
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.init();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.init();
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      handleAuditBill(val) {
        const data = {
          id: this.id,
          billStatus: val
        }
        auditBill(data).then(response => {
          if (response.code == '2000') {
            this.$notify({
              title: '成功',
              message: '操作成功',
              type: 'success',
              duration: 2000
            });
            this.$emit('submitSuccess');
          } else {
            this.$notify({
              title: '失败',
              message: response.msg,
              type: 'warning',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .customerOrderDialog {
    font-size: 12px;

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
  }
</style>
