<template>
  <div>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-select v-model="type" placeholder="优惠券状态" @change="switchType">
            <el-option label="未使用优惠券" :value="0"></el-option>
            <el-option label="已使用优惠券" :value="1"></el-option>
            <el-option label="过期优惠券" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              ref="analysisTable"
              highlight-current-row :height="600">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column align="center" label="优惠券ID" prop="id" sortable width="100"></el-table-column>
      <el-table-column label="优惠券名称" prop="name" align="center"></el-table-column>
      <el-table-column align="center" label="优惠券类型" prop="type" v-slot="{row}">
        <span>{{couponType[row.type]}}</span>
      </el-table-column>
      <el-table-column align="center" label="面额" prop="discountAmount"></el-table-column>
      <!--      <el-table-column align="center" label="默认发放张数" prop="number" sortable></el-table-column>-->
      <!--      <el-table-column align="center" label="每人可领次数" prop="limitCollar" sortable></el-table-column>-->
      <!--      <el-table-column align="center" label="已领取张数" prop="receive" sortable></el-table-column>-->
      <el-table-column align="center" label="有效时间" width="250">
        <template slot-scope="scope">
          <span>开始时间：{{scope.row.startTime}}</span>
          <div></div>
          <span>结束时间：{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否过期" prop="expired">
        <template slot-scope="scope">
          <span style="color:#F56C6C;" v-if="new Date(scope.row.endTime)<new Date()">已过期</span>
          <span style="color:#67C23A" v-else>未过期</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="创建时间" prop="crtTime" sortable></el-table-column>
    </el-table>

    <!--    <div class="pagination-container" style="margin-top: 10px;">-->
    <!--      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"-->
    <!--                     :current-page="listQuery.page"-->
    <!--                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"-->
    <!--                     layout="total, sizes, prev, pager, next, jumper" :total="total">-->
    <!--      </el-pagination>-->
    <!--    </div>-->

  </div>
</template>

<script>
  import { selectCoupon } from '@/api/erp/shopkeeper/shopList'
  // import {couponType,isExpired,defaultSendType} from './common/common'
  import { couponType, isExpired, defaultSendType } from '../marketing/common/common'

  export default {
    name: 'shopMember',
    data() {
      return {
        list: [],
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 5
        },
        type: 0,
        total: 0,
        couponType,
        isExpired,
        defaultSendType,
        allData: []
      }
    },
    props: ['id'],
    created() {
      this.getList()
    },
    methods: {
      handleSizeChange(val) {
        this.listQuery.limit = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
        this.getList()
      },
      getList() {
        this.listQuery.id = this.id
        this.listLoading = true
        selectCoupon(this.id).then(res => {
          this.listLoading = false
          if (Number(res.code) === 200 || Number(res.code) === 2000) {
            this.allData = res.data
            this.total = res.data.length
            res.data.forEach(item => {
              item.endTime = item.endTime.replace(/\-/g, '/')
            })
            // 可用优惠券
            this.canUseCouponList = res.data.filter(item => {
              return item.use == 0 && new Date().getTime() < new Date(item.endTime).getTime()
            })
            // 已用优惠券
            this.usedCouponPageList = res.data.filter(item => {
              return item.use == 1
            })
            // 过期优惠券
            this.overdueCouponList = res.data.filter(item => {
              return new Date().getTime() > new Date(item.endTime).getTime()
            })
            this.list=this.canUseCouponList
          }
        })
      },

      switchType(type) {
        switch (type) {
          case 0:
            this.list = this.canUseCouponList
            break
          case 1:
            this.list = this.usedCouponPageList
            break
          default:
            this.list = this.overdueCouponList
        }
      }
    }
  }
</script>

<style scoped>

</style>
