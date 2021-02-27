<template> 
  <div class="app-container containes" style="position: relative;height:82vh;">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>发货列表</span>
    </el-card>
    <div class="table-container container">
      <el-table ref="deliverOrderTable"
                style="width: 100%;"
                :data="list" border>
        <el-table-column label="订单编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.orderSn}}</template>
        </el-table-column>
        <el-table-column label="客户编号" width="180" align="center">
          <template slot-scope="scope">{{scope.row.memberId}}</template>
        </el-table-column>
        <el-table-column label="客户名称" width="180" align="center">
          <template slot-scope="scope">{{scope.row.memberUsername}}</template>
        </el-table-column>
        <el-table-column label="收货人" width="180" align="center">
          <template slot-scope="scope">{{scope.row.receiverName||scope.row.mainDTO.receiverName}}</template>
        </el-table-column>
        <el-table-column label="手机号码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.receiverPhone||scope.row.mainDTO.receiverPhone}}</template>
        </el-table-column>
<!--        <el-table-column label="邮政编码" width="160" align="center">-->
<!--          <template slot-scope="scope">{{scope.row.receiverPostCode}}</template>-->
<!--        </el-table-column>-->
        <el-table-column label="收货地址" >
          <template slot-scope="scope">{{(scope.row.receiverProvince||scope.row.mainDTO.receiverProvince)+''+(scope.row.receiverCity||scope.row.mainDTO.receiverCity)+''+(scope.row.receiverRegion?(scope.row.receiverRegion||scope.row.mainDTO.receiverRegion):'')+''+(scope.row.receiverDetailAddress||scope.row.mainDTO.receiverDetailAddress)}}</template>
        </el-table-column>
        <el-table-column label="订单备注" width="160" align="center">
          <template slot-scope="scope">{{scope.row.note}}</template>
        </el-table-column>
<!--        <el-table-column label="配送方式" width="160" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-select placeholder="请选择物流公司"-->
<!--                       v-model="scope.row.deliveryCompany"-->
<!--                       size="small">-->
<!--              <el-option v-for="item in companyOptions"-->
<!--                         :key="item"-->
<!--                         :label="item"-->
<!--                         :value="item">-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </template>-->
<!--        </el-table-column>-->
<!--        <el-table-column label="物流单号" width="180" align="center">-->
<!--          <template slot-scope="scope">-->
<!--            <el-input size="small" v-model="scope.row.deliverySn"></el-input>-->
<!--          </template>-->
<!--        </el-table-column>-->
      </el-table>


    </div>

  </div>
</template>
<script>
  const defaultLogisticsCompanies=["顺丰快递","圆通快递","中通快递","韵达快递"];
  export default {
    name: 'deliverOrderList',
    data() {
      return {
        companyOptions:defaultLogisticsCompanies
      }
    },
    props: ['list'],
    methods:{
      cancel(){
        this.$emit('submitCancel', true)
      },
      confirm(){
        this.$confirm('是否要进行发货操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$emit('submitSuccess', true)
        }).catch(() => {
          this.$emit('submitCancel', true)
          this.$message({
            type: 'info',
            message: '已取消发货'
          });
        });
      }
    }
  }
</script>
<style lang="scss">

</style>

