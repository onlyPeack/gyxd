<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="优惠券名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.name">
        </el-input>
        <el-select v-model="listQuery.type" placeholder="优惠券类型" style="width: 200px;vertical-align: top">
          <el-option v-for="(key,value) in couponType" :label="key" :value="value"></el-option>
        </el-select>
        <el-date-picker
          v-model="billDate"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <el-select v-model="listQuery.expired" placeholder="是否过期" style="width: 200px;vertical-align: top">
          <el-option v-for="(key,value) in isExpired" :label="key" :value="value"></el-option>
        </el-select>
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate" :disabled="btnStatus.edit">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleRowDelete" :disabled="btnStatus.del">删除</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="优惠券ID" prop="id" sortable width="100"></el-table-column>
      <el-table-column label="优惠券名称" prop="name" width="250"></el-table-column>
      <el-table-column label="优惠券类型" prop="type" v-slot="{row}">
        <span>{{couponType[row.type]}}</span>
      </el-table-column>
      <el-table-column label="面额" prop="discountAmount" align="right"></el-table-column>
<!--      <el-table-column align="center" label="默认发放张数" prop="number" sortable></el-table-column>-->
      <el-table-column label="每人可领次数" prop="limitCollar" sortable align="right"></el-table-column>
      <el-table-column label="已领取张数" prop="receive" sortable align="right"></el-table-column>
      <el-table-column label="有效时间" width="250">
        <template slot-scope="scope" >
          <span>开始时间：{{scope.row.startTime}}</span><div></div>
          <span>结束时间：{{scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否过期" prop="expired">
        <template slot-scope="scope" >
          <span style="color:#F56C6C;" v-if="new Date(scope.row.endTime)<new Date()">已过期</span>
          <span style="color:#67C23A" v-else>未过期</span>
        </template>
      </el-table-column>
      <el-table-column align="right" label="是否启用" prop="status">
        <template slot="header">
          <span>是否启用</span>
          <el-tooltip class="item" effect="dark" content="有用户领取的优惠券下架后无法编辑和启用，启用状态下无法编辑和删除" placement="top-start" style="display: inline-block">
            <div class="xianji"></div>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
            <el-switch :active-value="1" :inactive-value="0" v-model="scope.row.status" @change="handleUpdateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
<!--      <el-table-column align="right" label="默认发放" prop="defaultSend">-->
<!--        <template slot-scope="scope" >-->
<!--          <span style="color:#F56C6C;" v-if="defaultSendType[scope.row.defaultSend]==='是'">是</span>-->
<!--          <span style="color:#67C23A" v-else>否</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="创建人" prop="crtUserName"></el-table-column>
      <el-table-column label="创建时间" prop="crtTime" sortable></el-table-column>

    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="showDialog" v-if="showDialog" width="55%" :close-on-click-modal="false"
               :title="textMap[dialogStatus]" append-to-body class="public-dialog">
      <el-form :model="dataForm" ref="dataForm" label-position="right" label-width="160px" size="medium" :rules="rules">
        <el-form-item label="优惠券名称:" prop="name">
          <el-input v-model="dataForm.name" autocomplete="off"  placeholder="请输入优惠券名称" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型:" :required="true">
          <el-checkbox-group v-model="dataForm.rule">
            <el-checkbox label="红包" disabled></el-checkbox>
          </el-checkbox-group>
          <span style="margin-right: 15px;">面额</span>
          <div style="display: inline-block;width: 150px"><el-input v-model="dataForm.discountAmount"></el-input></div>
          <span style="margin-right: 15px;margin-left: 15px;">元，使用规则：最低消费</span>
          <div style="display: inline-block;width: 150px"><el-input v-model="dataForm.useConditions"></el-input></div>
          <span style="margin-right: 15px;margin-left: 15px;">元，才可以使用此券</span><div></div>
          <span>备注:代金券不兑现金，不设找零</span>
        </el-form-item>
<!--        <el-form-item label="默认发放张数:" prop="number">-->
<!--          <el-input v-model="dataForm.number" autocomplete="off"  placeholder="请输入优惠券数量" style="width: 50%"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="每个会员id可领张数:" prop="limitCollar">
          <el-input v-model="dataForm.limitCollar" autocomplete="off"  placeholder="请输入领取张数" style="width: 50%"></el-input>
        </el-form-item>

        <el-form-item label="优惠券有效时间:" prop="activityTime">
          <el-date-picker
            v-model="dataForm.activityTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <!--                <el-form-item label="商品标签:" >-->
        <!--                    <el-checkbox-group v-model="addList.tag">-->
        <!--                        <el-checkbox label="券" disabled></el-checkbox>-->
        <!--                    </el-checkbox-group>-->
        <!--                </el-form-item>-->
<!--        <el-form-item label="默认发放:" prop="defaultSend">-->
<!--          <el-radio-group v-model="dataForm.defaultSend">-->
<!--            <el-radio :label='value' v-for="(key,value) in defaultSendType">{{key}}</el-radio>-->
<!--          </el-radio-group>-->
<!--        </el-form-item>-->
        <el-form-item label="是否启用:" prop="status">
          <el-radio-group v-model="dataForm.status">
            <el-radio :label='0'>否</el-radio>
            <el-radio :label='1'>是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {createCoupon,page  as pages,updateCoupon,deleteCoupon,updateCouponStatus} from '@/api/erp/marketing/coupon';
  import {couponType,isExpired,defaultSendType} from './common/common'

  export default {
    name: 'coupon',
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        analysisIndex: 0,
        couponType,
        isExpired,
        defaultSendType,
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
          'number': [{required: true, message: '默认发放张数不能为空', trigger: 'blur'}],
          'activityTime': [{required: true, message: '活动时间不能为空', trigger: 'blur'},],
          'defaultSend': [{required: true, trigger: 'blur'},],
          'status': [{required: true, message: '启用状态不能为空', trigger: 'blur'},],
        },
        dialogStatus:'',
        btnStatus:{
          edit:false,
          del:false
        },
        selectedRows:[],
        isLoading:false,

        billDate: [],
        listQuery: {
          customerCode: undefined,
          customerName: undefined,
          userNo: undefined,
          userName: undefined,
          beginDate: undefined,
          endDate: undefined,
          page: 1,
          limit:20,
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
    updated() {
      this.changeDivHeight();
    },
    methods: {
      handleReset() {
        this.listQuery={}
        this.billDate=[]
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
        if(this.billDate.length>0){
          this.listQuery.startTime = this.billDate[0] + ' 00:00:00';
          this.listQuery.endTime = this.billDate[1] + ' 23:59:59';
        }
        pages(this.listQuery).then(response => {
          this.list = response.data.records;
          this.total = response.data.total;
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

      handleCreate(){
        this.dataForm={
          rule:['红包'],
          tag:['券']
        }
        this.showDialog=true
        this.dialogStatus='create'
      },

      /**
       * 设置排序&编辑推荐品牌对话框提交事件
       */
      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isLoading=true
            let params=JSON.parse(JSON.stringify(this.dataForm))
            params.type=1
            params.startTime=params.activityTime[0] + ' 00:00:00'
            params.endTime=params.activityTime[1] + ' 23:59:59'
            //优惠券截至时间必须大于此刻
            if(new Date(params.activityTime[1])<new Date()){
              this.showError('时间设置错误!',401)
              return false
            }
            delete params.activityTime


            params.tag=params.tag.toString()
            if(this.dialogStatus!=='create'){
              params.id=this.selectedRows[0]?.id
            }
            //判断当前为创建还是为编辑 并赋予相应的方法及提示信息
            let method=this.dialogStatus==='create'?createCoupon:updateCoupon
            let message=this.dialogStatus==='create'?"新建优惠券":"编辑优惠券"
            method(params).then(res => {
              if (Number(res.code) === 2000 || Number(res.code) === 200) {
                this.showSuccess(message+'成功!')
              } else {
                this.showError(message+'失败,' + res.msg || res.data)
              }
            }, error => this.showError(message+'失败,' + error))
          }
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
        this.btnStatus.edit=false
        this.btnStatus.del=false
        if(val.length>1){
          this.btnStatus.edit=true
        }
        for (let i = 0; i <val.length ; i++) {
          if(val[i].status===1){
            this.btnStatus.del=true
            this.btnStatus.edit=true
            break
          }
        }
      },

      init(){
        this.showDialog=false
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
            status:Number(row.status)
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
