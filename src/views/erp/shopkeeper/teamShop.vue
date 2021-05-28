<template>
    <div>
      <el-form :inline="true">
        <el-form-item>
          <el-input v-model="listQuery.storeName" placeholder="店铺名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.levelId" placeholder="店铺等级" style="width: 200px">
            <el-option
              v-for="(key,value) in levelType"
              :key="key"
              :label="key"
              :value="value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="联系人" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="listQuery.mobile" placeholder="联系电话" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button icon="el-icon-delete" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 查询结果 -->
      <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit ref="analysisTable"
                highlight-current-row :height="600">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column align="center" label="店标" prop="logo" width="100" v-slot="{row}">
          <el-image :previewSrcList="[row.logo]" :src="row.logo" ></el-image>
        </el-table-column>
        <el-table-column label="店名" prop="storeName"></el-table-column>
        <el-table-column label="等级" prop="levelId" v-slot="{row}">
          <span>{{levelType[row.levelId]}}</span>
        </el-table-column>
        <el-table-column label="联系人"></el-table-column>
        <el-table-column label="联系电话" prop="mobile"></el-table-column>
        <el-table-column label="开店时间" ></el-table-column>
        <el-table-column label="开店时长"></el-table-column>
        <el-table-column label="销量" prop="sales"></el-table-column>
        <el-table-column label="店铺类型" prop="type" v-slot="{row}">
          <span>{{shopType[row.type]}}</span>
        </el-table-column>
      </el-table>

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
  import {selectTeamShopInfo} from '@/api/erp/shopkeeper/shopList';
  import {shopType,levelType} from './common/common'
  export default {
    name: 'teamShop',
    data(){
      return{
        list:[],
        listLoading:false,
        listQuery:{
          page:1,
          limit:5
        },
        total:0,
        shopType,
        levelType
      }
    },
    props:['id'],
    created() {
      this.getList()
    },
    methods:{
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      getList(){
        this.listQuery.id=this.id
        selectTeamShopInfo(this.listQuery).then(res=>{
          if(Number(res.code)===200||Number(res.code)===2000){
            this.list=res.data.records
            this.total=res.data.total
          }
        })
      },

      handleReset() {
        this.listQuery = {
          page: 1,
          limit: 20
        }
        this.getList()
      },

      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
    }
  }
</script>

<style scoped>

</style>
