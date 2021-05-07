<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container sales-detail-list-filter-container" v-if="false">
      <div>
        <el-input clearable class="filter-item" style="width: 200px;" placeholder="优惠券名称"
                  @keyup.enter.native="handleFilter" v-model="listQuery.name">
        </el-input>
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
        <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
        <el-button class="filter-item" type="warning" @click="handleReset" icon="el-icon-delete">重置</el-button>
      </div>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleRowDelete">删除</el-button>
    </div>
    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
              highlight-current-row :height="clientHeight" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column align="center" label="配送城市" prop="city" sortable></el-table-column>
      <el-table-column label="仓库名称" prop="warehouseName" align="center"></el-table-column>


    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total" :total="total">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="showDialog" v-if="showDialog" width="40%" :close-on-click-modal="false"
               :title="textMap[dialogStatus]" append-to-body class="public-dialog">
      <el-form :model="dataForm" ref="dataForm" label-position="right" label-width="160px" size="medium" :rules="rules">
        <el-form-item label="仓库:" prop="warehouseName">
          <div @click="warehouseVisible=true">
            <el-input v-model="dataForm.warehouseName" autocomplete="off"  placeholder="请选择仓库" style="width: 50%">
              <i class="el-icon-search" style="color:rgb(42,140,254);font-size: 20px;float: right;cursor: pointer;line-height: 34px" slot="suffix"></i>
            </el-input>
          </div>

        </el-form-item>
        <el-form-item label="配送城市:" prop="regionCodes">
          <el-cascader
            :options="provinceAndCityData"
            :show-all-levels="false"
            style="width: 50%"
            v-model="dataForm.regionCodes"
            @change="handleChange">
          </el-cascader>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="isLoading">确 认</el-button>
      </div>

      <!-- 仓库弹窗-->
      <el-dialog title="请选择仓库" :visible.sync="warehouseVisible" append-to-body>
        <warehouse-selector @closeWarehouseDialog="closeWarehouseDialog" :isSingle="true"
                            ref="warehouse"></warehouse-selector>
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelWarehouse">取 消</el-button>
        <el-button type="primary" @click="handleSubmitWarehouse">确 定</el-button>
      </span>
      </el-dialog>
    </el-dialog>

  </div>
</template>

<script>
  import {createObj,page  as pages,updateCoupon,deleteCoupon,updateCouponStatus} from '@/api/erp/operation/t-goods-warehouse-radiation';
  import {CodeToText,provinceAndCityData,TextToCode } from 'element-china-area-data'
  // import {couponType,isExpired,defaultSendType} from './common/common'

  export default {
    name: 't-goods-warehouse-radiation',
    components: {
      'warehouse-selector': () => import('@/components/ERP/Warehouse/WarehouseSelector')
    },
    data() {
      return {
        clientHeight: 300,
        list: undefined,
        total: undefined,
        listLoading: false,
        warehouseVisible:false,
        provinceAndCityData,
        TextToCode,
        analysisIndex: 0,
        // couponType,
        // isExpired,
        // defaultSendType,
        showDialog:false,
        dataForm:{},
        textMap: {//编辑&新建头部文字字典
          update: '编辑仓库辐射',
          create: '新增仓库辐射'
        },
        rules: {//新增&编辑赠品表单验证
          'warehouseName': [{required: true, message: '仓库不能为空', trigger: 'blur'}],
          'regionCodes': [{required: true, message: '配送城市', trigger: 'blur'}],
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
      for (let i = 0; i <this.provinceAndCityData.length ; i++) {
        delete this.provinceAndCityData[i].children
      }
      console.log(provinceAndCityData,'data')
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

      handleCreate(){
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
            delete params.regionCodes
            //判断当前为创建还是为编辑 并赋予相应的方法及提示信息
            let method=this.dialogStatus==='create'?createObj:updateCoupon
            let message=this.dialogStatus==='create'?"新建仓库辐射":"编辑仓库辐射"
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
              this.showSuccess('删除成功!')
            } else {
              this.showError('删除失败,'+res.msg||res.data)
            }
          }, error => this.showError('删除失败,'+error));
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
        this.dataForm=Object.assign({},this.selectedRows[0])
        // this.dataForm.city = CodeToText[this.dataForm.regionCodes[0]];
        console.log(TextToCode[this.dataForm.city],'test')
        this.dataForm.regionCodes = [TextToCode[this.dataForm.city].code];
        this.showDialog=true
        this.dialogStatus='update'
      },

      closeWarehouseDialog(list) {
        this.warehouseVisible = false;
        if (list.length > 0) {
          this.dataForm.warehouseId = list[0].id;
          this.$set(this.dataForm,'warehouseName',list[0].name)
          // this.dataForm.warehouseName = list[0].name;
          this.$refs.warehouse.reset();
          this.$refs.dataForm.validateField('warehouseName');
        }
      },

      handleCancelWarehouse() {
        this.$refs.warehouse.reset();
        this.warehouseVisible = false;
      },

      handleSubmitWarehouse() {
        this.$refs.warehouse.onSubmit();
      },

      handleChange() {
        // this.dataForm.province = CodeToText[this.dataForm.regionCodes[0]];
        // this.dataForm.city = CodeToText[this.dataForm.regionCodes[1]];
        // this.dataForm.county = CodeToText[this.dataForm.regionCodes[2]];
        // this.dataForm.location = CodeToText[this.dataForm.regionCodes[0]] + '/' + CodeToText[this.dataForm.regionCodes[1]] + '/' + CodeToText[this.dataForm.regionCodes[2]];
        this.dataForm.city = CodeToText[this.dataForm.regionCodes[0]];
        console.log(this.dataForm.regionCodes)
      },
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
