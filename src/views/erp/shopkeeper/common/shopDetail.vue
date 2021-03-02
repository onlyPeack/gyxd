<template>
  <div>
    <el-card shadow="never">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">&nbsp;&nbsp;当前认证状态：</span>{{shopAuditStatus[dataForm.auditStatus]}}
      </div>
    </el-card>
    <div style="height: 30px"></div>
    <el-form ref="form" :model="dataForm" label-width="120px" disabled>
      <el-row :gutter="50">
        <el-col :span="16">
          <el-row :gutter="50">
           <el-col :span="12">
             <el-form-item label="店铺名称：">
               <el-input v-model="dataForm.storeName"></el-input>
             </el-form-item>
           </el-col>
            <el-col :span="12">
              <el-form-item label="联系人：">
                <el-input v-model="dataForm.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="50">
            <el-col :span="12">
              <el-form-item label="联系人电话：">
                <el-input v-model="dataForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺类型：">
                <el-input :value="shopType[dataForm.type]"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店铺logo：">
            <el-image src="http://gxcl-shop.qiniu.520mro.com/c7rvahc603e019p0hwht.png" style="height: 66px" fit="contain"></el-image>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="50">
       <el-col :span="8">
         <el-form-item label="店铺等级：">
           <el-input v-model="dataForm.shopLevel"></el-input>
         </el-form-item>
       </el-col>
       <el-col :span="8">
         <el-form-item label="企业抬头：">
           <el-input v-model="dataForm.businessRise"></el-input>
         </el-form-item>
       </el-col>
       <el-col :span="8">
         <el-form-item label="开店日期：">
           <el-input v-model="dataForm.crtTime"></el-input>
         </el-form-item>
       </el-col>
      </el-row>
      <el-row :gutter="50">
       <el-col :span="8">
         <el-form-item label="店主微信：">
           <el-input v-model="dataForm.wechat"></el-input>
         </el-form-item>
       </el-col>
       <el-col :span="8">
         <el-form-item label="店主来源：">
           <el-input :value="shopSource[dataForm.source]"></el-input>
         </el-form-item>
       </el-col>
       <el-col :span="8">
         <el-form-item label="推荐人：">
           <el-input v-model="dataForm.recommend"></el-input>
         </el-form-item>
       </el-col>
      </el-row>
      <el-row :gutter="50">
       <el-col :span="24">
         <el-form-item label="备注：">
           <el-input v-model="dataForm.note" type="textarea"></el-input>
         </el-form-item>
       </el-col>
      </el-row>
    <h2>账号信息</h2>
      <el-row :gutter="50">
        <el-col :span="8">
          <el-form-item label="账号：">
            <el-input v-model="dataForm.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="昵称：">
            <el-input v-model="dataForm.nickName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="注册日期：">
            <el-input v-model="dataForm.registerTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <h2>认证材料</h2>
    </el-form>
  </div>

</template>

<script>
  import { shopAuditStatus,shopType,shopSource } from './common'
  import { selectDetailById } from '@/api/erp/shopkeeper/checkPending'

  export default {
    name: 'shopDetail',
    props: {
      isReadOnly: Boolean,
      id: {
        type: [String, Number],
        require: true
      }
    },
    data() {
      return {
        shopAuditStatus,
        shopType,
        shopSource,
        dataForm: {}
      }
    },
    watch: {
      id() {
        console.log('idChange')
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        selectDetailById(this.id).then(res => {
          if (Number(res.code) === 2000 || Number(res.code) === 200) {
            this.dataForm = res.data
          } else {
            this.$message.error('查询小店详情失败!')
            console.log(res, '错误日志')
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .color-danger {
    color: #F56C6C;
  }

  .operate-container {
    background: #F2F6FC;
    height: 80px;
    margin: -20px -20px;
    line-height: 80px;
  }

  .color-danger {
    color: #F56C6C;
  }

  .crudListTitle {
    display: inline-block;
    margin: 10px 0px;
  }

  .crudListTitles {
    display: inline-block;
    margin: 0px 0px 10px 0px;
  }

  .logisticsData {
    display: flex;
    flex-direction: column;
    width: 100%;

    div {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;

      .logisticsData_item_div {
        width: calc(20% - 1px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 40px;
        border: 1px solid #EBEEF5;
        border-bottom: none !important;
      }

      .logisticsData_item_div:not(:first-child) {
        border-left: none !important;
      }
    }

    .logisticsData_item {
      border-bottom: 1px solid #EBEEF5 !important;
      margin-bottom: 10px;
    }
  }

  .logisticsDatas {
    display: flex;
    flex-direction: column;
    width: 100%;

    div {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;

      .logisticsData_item_div {
        width: calc(25% - 1px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 40px;
        border: 1px solid #EBEEF5;
        border-bottom: none !important;
      }

      .logisticsData_item_div:not(:first-child) {
        border-left: none !important;
      }
    }

    .logisticsData_item {
      border-bottom: 1px solid #EBEEF5 !important;
      margin-bottom: 10px;
    }
  }

  .avue-crud {
    margin: 0px !important;
  }

  .el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td {
    background-color: #fff !important;
  }

  .el-table__fixed-footer-wrapper tbody td {
    background-color: #fff !important;
  }

  .orderDetail {
    display: inline-block;
    width: 22%;
    border-right: 1px dashed #eee;
    margin-left: 2%;
  }

  .orderDetail h4 {
    font-weight: normal;
    color: #aaa;
  }
</style>
