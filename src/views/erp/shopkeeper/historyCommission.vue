<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <!--        <el-input clearable class="filter-item" style="width: 200px;" placeholder="id"-->
        <!--                  @keyup.enter.native="handleFilter" v-model="listQuery.memberId">-->
        <!--        </el-input>-->
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="店铺名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.storeName">
        </el-input>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
    </div>
<!--    <div style="margin-top: 1px;">-->
<!--      <el-button type="text" icon="el-icon-circle-check" @click="handleDone(1)" :disabled="selectedRows.length>1">完成</el-button>-->
<!--      <el-button type="text" icon="el-icon-circle-close" @click="handleDone(2)" :disabled="selectedRows.length>1">驳回</el-button>-->
<!--      <el-button type="text" icon="el-icon-edit-outline" @click="handleRowDelete" :disabled="selectedRows.length>1">备注</el-button>-->
<!--    </div>-->
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row  @selection-change="handleSelectionChange" :height="clientHeight">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
<!--      <el-table-column prop="type" label="类型" width="100" v-slot="{row}">-->
<!--        <span>{{commissionType[row.type]}}</span>-->
<!--      </el-table-column>-->
      <el-table-column label="提现方式" prop="withdraw" v-slot="{row}">
        <span>{{commissionWay[row.withdraw]}}</span>
      </el-table-column>
      <el-table-column label="银行卡号" prop="card"></el-table-column>
<!--      <el-table-column label="处理进度" prop="schedule" v-slot="{row}">-->
<!--        <span>{{commissionSchedule[row.schedule]}}</span>-->
<!--      </el-table-column>-->
      <!--      <el-table-column label="订单号" prop="orderSn"></el-table-column>-->
      <el-table-column label="完成状态" prop="status" v-slot="{row}">
        <span>{{commissionStatus[row.status]}}</span>
      </el-table-column>
      <el-table-column label="提现金额" prop="commission" align="right"></el-table-column>
      <el-table-column label="用户名" prop="username"></el-table-column>
      <el-table-column label="店铺名称" prop="storeName"></el-table-column>
      <el-table-column label="创建时间" prop="crtTime"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
<!--      <el-table-column label="开始金额" prop="beginMoney" align="right"></el-table-column>-->
<!--      <el-table-column label="结束金额" prop="endMoney" align="right"></el-table-column>-->

    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {page  as pages,updObj} from '@/api/erp/shopkeeper/commission';
  import {shopType,commissionType,commissionWay,commissionSchedule,commissionStatus} from './common/common'
  import shopDetail from './common/shopDetail'

  export default {
    name: 'historyCommission',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        shopType,
        commissionType,
        commissionWay,
        commissionSchedule,
        commissionStatus,
        isShowShopDetail:false,
        nowRow:{},
        listLoading: false,
        showDialog:false,
        dataForm:{},
        textMap: {//编辑&新建商品系列弹窗头部文字字典
          update: '编辑优惠券',
          create: '新增优惠券'
        },
        rules: {//新增&编辑赠品表单验证
          'limitCollar': [{required: true, message: '参与次数不能为空', trigger: 'blur'}],
          'name': [{required: true, message: '优惠券名称不能为空', trigger: 'blur'}],
          'stock': [
            {required: true, message: '赠品库存不能为空', trigger: 'blur'},
            {type: 'number', message: '赠品库存只能为数字', trigger: 'blur'},
          ],
          'number': [{required: true, message: '总张数不能为空', trigger: 'blur'}],
          'activityTime': [{required: true, message: '活动时间不能为空', trigger: 'blur'},],
          'status': [{required: true, message: '启用状态不能为空', trigger: 'blur'},],
        },
        dialogStatus:'',
        btnStatus:{
          audit:false,
        },
        selectedRows:[],
        isLoading:false,

        billDate: [],
        listQuery: {
          page: 1,
          limit:20,
          // status:0
        }
      }
    },
    created() {
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.getList();
    },
    components:{
      shopDetail
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleReset() {
        this.listQuery={
          page: 1,
          limit:20,
        }
        this.getList()
      },
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.90;
      },
      getList() {
        this.listLoading = true;
        pages(this.listQuery).then(response => {
          this.list = response.records;
          this.total = response.total;
          this.listLoading = false;
        }).catch((error) => {
          console.log(error)
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        })
      },
      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },

      handleDone(flag){
        this.$confirm('是否确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params=this.selectedRows[0]
          params.status=flag
          updObj(params).then(res => {
            if (res) {
              this.showSuccess('操作成功!')
            } else {
              this.showError('操作失败!,' + res.msg || res.data)
            }
          }, error => this.showError('操作失败!,' + error))
        })
      },

      /**
       * 设置排序&编辑推荐品牌对话框提交事件
       */
      handleSubmit(status) {
        this.$confirm('是否确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLoading=true
          let message=status===2?"审核":"驳回"
          auditStatus(this.selectedRows[0]?.id,status).then(res => {
            if (Number(res.code) === 2000 || Number(res.code) === 200) {
              this.showSuccess(message+'成功!')
            } else {
              this.showError(message+'失败,' + res.msg || res.data)
            }
          }, error => this.showError(message+'失败,' + error))
        })
      },

      /**
       * 错误处理方法
       * @param message 错误信息
       * @param code 错误码
       */
      showError(message,code){
        if(Number(code)===401){
          this.$message.warning(message||'操作失败')
        }else{
          this.$message.error(message||'操作失败')
        }
        this.isLoading=false
      },

      /**
       * 成功处理方法
       * @param message 成功提示信息
       */
      showSuccess(message){
        this.$message.success(message)
        this.init()
      },

      handleSelectionChange(val){
        this.selectedRows=val
        this.btnStatus.audit=val.length>1
      },

      init(){
        this.showDialog=false
        this.isShowShopDetail=false
        this.isLoading=false
        this.getList()
      },
      /**
       *顶部按钮删除方法
       */
      handleRowDelete() {
        if (this.selectedRows.length < 1) {
          this.vueMessage('warning', '请至少选择一条数据');
          return false;
        }
        let ids = [];
        this.selectedRows.forEach((row) => {
          ids.push(row.id)
        });
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCoupon(ids.toString()).then((res) => {
            if (Number(res.code) === 200 || Number(res.code) === 2000) {
              this.showSuccess('删除优惠券成功!')
            } else {
              this.showError('删除优惠券失败,'+res.msg||res.data)
            }
          }, error => this.showError('删除优惠券失败,'+error));
        });
      },

      /**
       * 行内更变推荐状态方法
       */
      handleUpdateStatus(row) {
        let msg='您确定执行该操作?'
        if(new Date(row.endTime)<new Date()&&row.status*1===0){
          this.showError('该活动已过期，请修改活动时间或新建活动',401)
          return false
        }
        if(row.receive*1>0&&row.status*1===1){
          msg='该优惠券已有用户领取，关闭后，无法启用和编辑'
        }
        this.$confirm(msg, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params={
            id:row.id,
            status:Number(row.status)===1?0:1
          }
          updateCouponStatus(params).then(response => {
            if (Number(response.code) === 2000||Number(response.code)===200) {
              this.showSuccess('更变启用状态成功!')
            } else {
              this.showError('更变启用状态失败,'+response.msg||response.data,response.code)
            }
          },error => this.showError('更变启用状态失败,'+error));
        },()=>{
          this.getList()
        })
      },

      handleUpdate(){
        this.dataForm=this.selectedRows[0]
        this.dataForm.rule=['红包']
        this.dataForm.tag=['券']
        this.dataForm.activityTime=[this.dataForm.startTime,this.dataForm.endTime]
        this.showDialog=true
        this.dialogStatus='update'
      },

      showShopDetail(row){
        // this.isShowShopDetail=true
        // this.nowRow=row
        this.$router.push({
          path:'/shopkeeper/shopForm?id='+row.id
        })
      },

      handleCancel(){

      }
    },
  }
</script>

<style lang="scss" scoped>
  .sales-detail-list-container {
    .el-date-editor {
      position: relative;
      top: -4px;
    }

    .el-checkbox-group {
      position: relative;
      top: -4px;
      display: inline-block;
    }

    .box-card {
      overflow: auto;
    }

    .index-explanation {
      color: #5890E1;
      font-size: 12px;
      position: relative;
      top: -5px;
      cursor: pointer;
    }

    .index-explanation:hover + .explain-content {
      display: block;
    }

    .explain-content {
      background-color: rgba(0, 0, 0, 0.6);
      color: #fff;
      line-height: 20px;
      position: absolute;
      z-index: 2000;
      padding: 15px;
      font-size: 12px;
      right: 50px;
      display: none;
    }
  }
  .xianji {
    width: 14px;
    height: 14px;
    background: url("http://hejigy.com.cn/questionMarksBlue.png") 100% 100% no-repeat;
    margin:0;
    padding: 0;
  }
</style>
<style>
  /*.el-table{*/
  /*  overflow:visible !important;*/
  /*}*/
</style>
