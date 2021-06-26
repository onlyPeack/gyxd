<template>
  <div class="app-container calendar-list-container sales-detail-list-container full-purchase bill-container">
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input placeholder="品名" style="width: 200px" v-model="listQuery.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="品牌" style="width: 200px" v-model="listQuery.brandName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="系列" style="width: 200px" v-model="listQuery.seriesName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="型号" style="width: 200px" v-model="listQuery.specModel" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="订货号" style="width: 200px" v-model="listQuery.itemNo" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.type" style="width: 200px;" clearable placeholder="类型">
            <el-option v-for="(key,value) in goodsType" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin-top: 1px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleEdit" :disabled="isCanEdit">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="导师" name="5"></el-tab-pane>
      <el-tab-pane label="资深" name="4"></el-tab-pane>
      <el-tab-pane label="专业" name="3"></el-tab-pane>
      <el-tab-pane label="初级" name="2"></el-tab-pane>
      <el-tab-pane label="实习" name="1"></el-tab-pane>
    </el-tabs>


    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable" :row-class-name="tableRowClassName"
              highlight-current-row  @selection-change="handleSelectionChange" :height="clientHeight">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column label="类型" prop="type" v-slot="{row}">
        <span>{{goodsType[row.type]}}</span>
      </el-table-column>
      <el-table-column label="品名" prop="name"></el-table-column>
      <el-table-column label="品牌" prop="brandName"></el-table-column>
      <el-table-column label="系列" prop="seriesName"></el-table-column>
      <el-table-column label="型号" prop="specModel"></el-table-column>
      <el-table-column label="订货号" prop="itemNo"></el-table-column>
      <el-table-column label="面价" prop="retailPrice" align="right"></el-table-column>
<!--      <el-table-column label="库存数量" prop="" align="right"></el-table-column>-->
      <el-table-column label="加价点数" prop="points" align="right" class-name="red-title"></el-table-column>
      <el-table-column label="调拨折扣" prop="discount" align="right" class-name="red-title"></el-table-column>
      <el-table-column label="调拨价" prop="" align="right"></el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>

    </el-table>

    <!-- 分页 -->
    <div class="pagination-container" style="margin-top: 10px;">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>


    <el-dialog title="所有商品" width="65%" v-if="productVisible" :visible.sync="productVisible" class="goodsDialog">
      <goods-selector ref="goodsSelector" :isSingle="false" @closeGoodsDialog="closeGoodsDialog"
                      :isSelectPage="true"></goods-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="productVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitProduct">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量加价弹窗-->
    <el-dialog title="批量加价" width="40%" v-if="isBatchAdjustPrice" :visible.sync="isBatchAdjustPrice" append-to-body :close-on-click-modal="false"
               top="20vh">
      <el-form ref="dataForm" :model="dataForm" label-width="120px" label-position="right" :rules="rules">
        <el-form-item label="商品类型：" prop="type" v-if="!isEdit">
          <el-select v-model="dataForm.type" style="width: 300px" placeholder="请选择商品类型" @change="typeChange">
            <el-option v-for="(key,value) in goodsType" :label="key" :value="value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调价方式：">
          <el-radio-group v-model="changeMoney">
            <el-radio label="points">加价点数</el-radio>
            <el-radio label="discount">调拨折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加价点数：" prop="points" v-if="changeMoney==='points'" :rules="[{ required: !dataForm.discount||dataForm.discount==='', message: '加点数不能为空', trigger: 'blur' }]">
          <el-input v-model="dataForm.points" placeholder="请输入加价点数,大于0的整数" style="width: 300px" @change="positiveInteger['points']"></el-input>
        </el-form-item>
        <el-form-item label="调拨折扣：" v-else prop="discount" :rules="[{ required: !dataForm.points||dataForm.points==='', message: '调拨折扣不能为空', trigger: 'blur' }]">
          <el-input v-model="dataForm.discount" placeholder="请输入调拨折扣,介于0-1的两位小数" style="width: 300px" @change="specialChange"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input v-model="dataForm.note" placeholder="请输入备注" type="textarea" style="width: 300px" :rows="3"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isBatchAdjustPrice=false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { selectPage as pages, insertBatch,deleteBatch,updateBatch,saveOrUpdateBatch } from '@/api/erp/shopkeeper/levelScheme'
  import { goodsType } from './common/common'
  import Vue from 'vue'

  export default {
    name: 'levelScheme',
    components: {
      'goods-selector': () => import('@/components/ERP/Goods/GoodsSelector')
    },
    data() {
      return {
        activeName: '1',
        productVisible: false,
        listQuery: {
          page: 1,
          limit: 20
        },
        rules: {
          type: [{ required: true, message: '商品类型不能为空', trigger: 'blur' }]
        },
        goodsType,
        isBatchAdjustPrice: false,
        dataForm: {},
        goodsListFromERP: [],
        listLoading:false,
        list:[],
        clientHeight: 300,
        total:0,
        isEdit:false,
        isCanEdit:false,
        selectedRows:[],
        positiveInteger:null,
        changeMoney:'points'
      }
    },
    created() {
      let _this=this
      this.getList()
      this.changeDivHeight()
      window.onresize = function () {
        _this.changeDivHeight();
      };
      this.positiveInteger=new Proxy({}, {
        get:function (target, p, receiver) {
          console.log(target,p,receiver,'testProxy')
          return function (num) {
            _this.dataForm[p]=Math.abs(Math.ceil(num))
          }
        }
      })
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('sales-detail-list-filter-container')[0]) {
          var height = document.getElementsByClassName('sales-detail-list-filter-container')[0].clientHeight;
        } else {
          height = 76;
        }
        this.clientHeight = (document.body.clientHeight - (140 + height)) * 0.90;
      },
      handleClick() {
        this.getList()
      },
      handleCreate() {
        this.productVisible = true
        this.changeMoney='points'
        this.dataForm={}
      },

      handleSubmitProduct() {
        this.$refs.goodsSelector.OnSubmit()
      },
      getList() {
        this.listQuery.levelId = this.activeName
        pages(this.listQuery).then(res => {
          if(Number(res.code)===200||Number(res.code)===2000){
            this.list=res.data.records
            this.list.forEach(item=>{
              if(item.discount>0){
                item.discount=this.division(item.discount,100)
              }

            })
            this.total=res.data.total
          }else{

          }
        })
      },

      closeGoodsDialog(list) {
        this.goodsListFromERP = list
        this.isBatchAdjustPrice = true
        this.isEdit=false
      },

      typeChange(data) {
        if (Number(data) === 2) {
          delete this.dataForm.points
        }
      },

      handleSubmit() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let paramsArr = []
            let targetArr=this.isEdit?this.selectedRows:this.goodsListFromERP
            for (let i = 0; i < targetArr.length; i++) {
              let params = targetArr[i]
              if(!this.isEdit){
                delete params.id
              }
              params = Object.assign(params, this.dataForm)
              params.levelId = this.activeName
              if(this.changeMoney==='points'){
                params.discount=0
              }else{
                params.points=0
                params.discount=params.discount*100
              }
              paramsArr.push(params)
            }
            // let method=this.isEdit?updateBatch:insertBatch
            let method=saveOrUpdateBatch
            method(paramsArr).then(res => {
              //console.log(1234,res)
              if (res) {
                this.$message.success('设置成功!')
                this.init()
              } else {
                this.$message.error('设置失败!' + res.msg)
              }
            })
            console.log(paramsArr)
          }
        })
      },

      init() {
        this.isBatchAdjustPrice = false
        this.productVisible = false
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

      handleSelectionChange(val){
        this.isCanEdit=false
        for (let i = 0; i <val.length ; i++) {
          if(val[i].type!==val[0].type){
            this.isCanEdit=true
            break
          }
        }
        this.selectedRows=val
      },

      handleEdit(){
        if(this.selectedRows.length<1){
          this.$message.warning('请选择要编辑的商品!')
          return false
        }
        this.isBatchAdjustPrice=true
        this.isEdit=true
        this.dataForm={
          type:this.selectedRows[0].type
        }
        if(this.selectedRows[0].points>0){
          // this.dataForm.points=this.selectedRows[0].points
          this.$set(this.dataForm,'points',this.selectedRows[0].points)
        }else{
          // this.dataForm.discount=this.selectedRows[0].discount
          this.$set(this.dataForm,'discount',this.selectedRows[0].discount)
        }
        this.changeMoney=this.selectedRows[0].points>0?'points':'discount'
      },

      handleDelete(){
        if (this.selectedRows.length < 1) {
          this.vueMessage('warning', '请至少选择一条数据');
          return false;
        }
        let ids = [];
        this.selectedRows.forEach((row) => {
          ids.push(row.id)
        });
        let that=this
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteBatch(ids.toString()).then((res) => {
            console.log(res,'resss')
            if (Number(res.code) === 200 || Number(res.code) === 2000) {
              //this.showSuccess('删除成功!')
              that.$message.success('删除成功!')
              that.init()
            } else {
              that.showError('删除失败,'+res.msg||res.data)
            }
          }, error => that.showError('删除失败,'+error));
        });
      },

      handleFilter() {
        this.listQuery.page = 1;
        this.getList()
      },

      handleReset(){
        this.listQuery={
          page: 1,
          limit: 20
        }
        this.getList()
      },

      tableRowClassName({row, rowIndex}) {
        if (this.goodsType[row.type]==='调拨') {
          return 'synergy-row';
        } else if (this.goodsType[row.type]==='期货') {
          return 'futures-row';
        }
        return '';
      },

      specialChange(num){
        this.dataForm.discount=Math.abs(num)>1?1:Math.abs(num).toFixed(2)
      }
      // positiveInteger(num) {
      //   console.log(1234,num)
      //   this.dataForm.points=Math.abs(Math.ceil(num))
      // }
    }
  }
</script>

<style>
.red-title{
  color: #F56C6C;
}
  .synergy-row{
    background-color: #9093996e!important;
  }
  .futures-row{
    background-color: #3d96f342!important;
  }
.goodsDialog>.el-dialog>.el-dialog__header{
  z-index: 9999;
}
</style>
