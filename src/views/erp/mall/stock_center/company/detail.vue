<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="handleClose" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" :before-close="handleClose">
      <span slot="title" class="con-title">
        <svg-icon icon-class="contract"></svg-icon>
        <span>发布企业详情</span>
      </span>

    <div class="center-container">
      <el-form :model="dataForm" ref="dataForm">
        <table class="topTable">
          <tr>
            <td>
              <el-form-item prop="companyName" label="企业:" class="el-form-flex">
                {{dataForm.companyName}}
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="contact" label="联系人:" class="el-form-flex">
                {{dataForm.contact}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="telephone" label="联系电话:" class="el-form-flex">
                {{dataForm.telephone}}
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="mobile" label="手机:" class="el-form-flex">
                {{dataForm.mobile}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="email" label="邮箱:" class="el-form-flex">
                {{dataForm.email}}
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="qq" label="QQ:" class="el-form-flex">
                {{dataForm.qq}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="wx" label="微信:" class="el-form-flex">
                {{dataForm.wx}}
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="city" label="城市:" class="el-form-flex">
                {{dataForm.city}}
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td>
              <el-form-item prop="fax" label="传真:" class="el-form-flex">
                {{dataForm.fax}}
              </el-form-item>
            </td>
            <td>
              <el-form-item prop="note" label="备注:" class="el-form-flex">
                {{dataForm.note}}
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
    <!-- 弹窗底部 -->
    <div class="dialog-footer" style="text-align: right;">
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {getFloat} from '@/utils/util'
  import {getCompanyDetail} from '@/api/erp/mall/scs/company';

  export default {
    name: "companyDetail",
    components: {},
    props: ['id', 'dialogFormVisible'],
    data() {
      return {
        clientHeight: 300,
        dataForm: {
          id: undefined,
          userCode: undefined,
          companyName: undefined,
          telephone: undefined,
          contact: undefined,
          mobile: undefined,
          email: undefined,
          qq: undefined,
          wx: undefined,
          city: undefined,
          fax: undefined,
          note: undefined
        }
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
          var height = 375;
        }
        if (this.id && this.id != '') {
          height = height + 20;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.95;
      },
      init() {
        getCompanyDetail(this.id)
          .then(response => {
            this.dataForm = response.data;
          });
      },
      handleClose() {
        this.$emit('handleClose', false)
      }
    }
  }
</script>
