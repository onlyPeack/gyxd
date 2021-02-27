<template>
  <div class="customer-order-div">
    <el-row>
      <el-col :span="24" style="padding-left: 20px; padding-bottom: 10px">客户订单审批</el-col>
      <hr color="#DDDDDD">
    </el-row>
    <el-tabs :tab-position="tabPosition" class="customerOrderAuditTab">
      <el-tab-pane label="客户订货单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客户退货单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客户订货变更单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="销售返利单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客户价格配置">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: "customerOrderAudit",
    data() {
      return {
        tabPosition: 'left',
        checked: false,
      }
    },
    created() {
    },
    methods: {}
  }
</script>

<style scoped lang="scss">
  .customer-order-div {
    margin-top: 20px;
    height: 100%;

    .customerOrderAuditTab {
      height: 100vh !important;

      .el-col {
        line-height: 45px;
        padding-left: 20px;
      }
    }
  }
</style>
