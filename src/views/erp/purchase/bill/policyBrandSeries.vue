<template>
  <div class="app-container calendar-list-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input clearable class="filter-item" style="width: 200px;" placeholder="请输入返点系列"
                v-model="listQuery.companySeries"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row>
      <el-table-column align="center" label="标准系列" prop="standardSeries"></el-table-column>
      <el-table-column align="center" label="品牌" prop="brand"></el-table-column>
      <el-table-column align="center" label="返点系列" prop="companySeries"></el-table-column>
      <el-table-column align="center" label="渠道类型" prop="channelTypeName"></el-table-column>
      <el-table-column align="center" label="更新时间" prop="updTime"></el-table-column>


      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="listQuery.page"
                     :page-sizes="[10,20,30,50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="700px">
      <el-form :rules="rules" ref="dataForm" :model="dataForm" status-icon label-position="right" label-width="100px"
               style=' margin-left:50px;' size="medium">
        <el-form-item label="标准系列:" prop="standardSeries">
          <div @click="showGoodsLibrarySelector=true">
            <el-input v-model="dataForm.standardSeries" placeholder="请选择标准系列" style="width: 250px;"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="品牌:" prop="brand">
          <el-input v-model="dataForm.brand" placeholder="请输入品牌名称" style="width: 250px;" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="返点系列:" prop="companySeries">
          <el-input v-model="dataForm.companySeries" placeholder="请输入返点系列" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="渠道类型" prop="channelTypeName">
          <div @click="showPolicyChannelTypeSelect=true">
            <el-input v-model="dataForm.channelTypeName" placeholder="请选择渠道类型" style="width: 250px"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

    <policy-channel-type-select v-if="showPolicyChannelTypeSelect" :dialogVisible="showPolicyChannelTypeSelect" @handleClose="handleClosePublic" @handleSubmit="handleSubmitPublic"></policy-channel-type-select>
    <!--        选择标准系列对话框-->
    <goods-library-selector v-if="showGoodsLibrarySelector" ref="goodsLibrarySelector" :dialogVisible="showGoodsLibrarySelector"
                            @handleClose="showGoodsLibrarySelector=false"
                            @handleSubmit="handleSubmitPublic"></goods-library-selector>
  </div>
</template>

<script>
  import {page, addObj, getObj, delObj, putObj} from '@/api/erp/purchase/bill/policyBrandSeries';

  export default {
    name: 'policyChannelType',
    components: {
      'policyChannelTypeSelect': () => import('@/components/ERP/Purchase/policyChannelTypeSelect'),
      'goodsLibrarySelector': () => import('@/components/ERP/Purchase/goodsLibrarySelector'),
    },
    data() {
      return {
        list: undefined,
        total: undefined,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined,
          number: undefined
        },
        showPolicyChannelTypeSelect:false,//展示渠道类型选择
        showGoodsLibrarySelector:false,//展示产品库商品选择
        activeName: 'value',
        dataForm: {
          number: undefined,
          name: undefined,
          dcKey: undefined,
          groupKey: undefined,
          attribute: '0',
          isAdjustRate: '0',
          status: '0',
          detailJson: undefined
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        rules: {
          standardSeries: [{required: true, message: '标准系列不能为空', trigger: 'blur'}],
          companySeries: [{required: true, message: '返点系列不能为空', trigger: 'blur'}],
          channelTypeName: [{required: true, message: '渠道类型不能为空', trigger: 'blur'}],
        },
        yesOrNo: [{
          value: '0',
          label: '否'
        }, {
          value: '1',
          label: '是'
        }],
        attributeList: [{
          value: '0',
          label: '无'
        }, {
          value: '1',
          label: '银行科目'
        }, {
          value: '2',
          label: '现金科目'
        }, {
          value: '3',
          label: '现金等价物'
        }],
        statusList: [{
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }],
        detailJsonList: [{
          value: '1',
          label: '银行账户'
        }, {
          value: '2',
          label: '客户'
        }, {
          value: '3',
          label: '供应商'
        }, {
          value: '4',
          label: '部门'
        }, {
          value: '5',
          label: '仓库'
        }, {
          value: '6',
          label: '用户'
        }, {
          value: '7',
          label: '项目'
        }, {
          value: '8',
          label: '门店'
        }, {
          value: '9',
          label: '商品'
        }],
        groupKeyList: [{
          value: '1',
          label: '负债类'
        }, {
          value: '2',
          label: '损益类'
        }, {
          value: '3',
          label: '所有者权益类'
        }, {
          value: '4',
          label: '资产类'
        }
          //   ,{
          //   value: '5',
          //   label: '所有者权益'
          // }, {
          //   value: '6',
          //   label: '成本'
          // }, {
          //   value: '7',
          //   label: '营业收入'
          // }, {
          //   value: '8',
          //   label: '营业成本及税金'
          // }, {
          //   value: '9',
          //   label: '期间费用'
          // }, {
          //   value: '10',
          //   label: '其他收益'
          // }, {
          //   value: '11',
          //   label: '其他损失'
          // }, {
          //   value: '12',
          //   label: '以前年度损益调整'
          // }, {
          //   value: '13',
          //   label: '所得税'
          // }
        ],
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery).then(response => {
          console.log(response,'获取数据')
          this.list = response.records;
          this.total = response.total;
          this.listLoading = false;
        }).catch(error => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
          console.log(error,'获取数据发生了错误')
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
      resetForm() {
        this.dataForm = {
          number: undefined,
          name: undefined,
          dcKey: undefined,
          groupKey: undefined,
          detailJson: undefined
        }
      },
      handleCreate() {
        this.resetForm();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate();
        });
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            addObj(this.dataForm).then(response => {
              if (Number(response.code) === 2000||Number(response.code)===200) {
                this.showSuccess('新增品牌返点系列成功!')
              } else {
                this.showError('新增品牌返点系列失败,'+response.msg||response.data,response.code)
              }
            })
          } else {
            this.showError('请正确填写内容!',401)
            return false;
          }
        })
      },
      handleUpdate(row) {
        this.dataForm = Object.assign({}, row);
        this.dialogStatus = 'update';
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            putObj(this.dataForm.id, this.dataForm).then(response => {
              if (Number(response.code) === 2000||Number(response.code)===200) {
                this.showSuccess('编辑品牌返点系列成功!')
              } else {
                this.showError('编辑品牌返点系列失败,'+response.msg||response.data,response.code)
              }
            });
          } else {
            return false;
          }
        });
      },
      handleDelete(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(row.id).then(() => {
            this.showSuccess('删除品牌返点系列成功!')
          });
        });
      },

      /**
       * 数字前补零
       * @param num 需要补零的数字
       * @returns {string|*} 补零后的数字
       */
      addPreZero(num){
        if(num<10){
          return '00'+num;
        }else if(num<100){
          return '0'+num;
        }else{
          return num;
        }
      },

      /**
       * 关闭赠品选择对话框
       */
      handleClosePublic() {
        this.showPolicyChannelTypeSelect=false
        this.showDialog=false
      },

      /**
       * 从子组件中接收的提交方法
       * @param list
       */
      handleSubmitPublic(list){
        if(list.type==='policyChannelType'){
          this.showPolicyChannelTypeSelect=false
          this.$set(this.dataForm,'channelTypeName',list.arr.name)
          this.dataForm.channelTypeId=list.arr.id
          this.dataForm.channelTypeCode=list.arr.code
          this.$refs['dataForm'].validateField('channelTypeName')
        }else if(list.type==='goodsLibrary'){
          this.showGoodsLibrarySelector=false
          this.dataForm.seriesId=list.arr.id
          this.dataForm.brandId=list.arr.brandId
          this.$set(this.dataForm,'standardSeries',list.arr.name)
          this.$set(this.dataForm,'brand',list.arr.brandName)

          this.$refs['dataForm'].validateField('standardSeries')
          this.$refs['dataForm'].validateField('brand')
        }
      },

      /**
       * 成功处理方法
       * @param message 成功提示信息
       */
      showSuccess(message){
        this.$message.success(message)
        this.init()
      },

      /**
       * 错误处理方法
       * @param message 错误信息
       */
      showError(message){
        this.$message.error(message)
        this.isLoading=false
      },

      init(){
        this.dialogFormVisible=false
        this.getList()
      }
    }
  }
</script>
