<template>
  <div class="app-container logistics-container">
    <ul>
      <li class="add">
        <div class="add-box" @click="handleCreate">
          <svg-icon icon-class="add"></svg-icon>
          添加快递方式
        </div>
      </li>
      <li v-if="list && list.length>0" v-for="(item,index) in list" :key="item.id" :class="item.isSwitch?'close':''">
        <div class="name">
          <span>{{item.name}}</span>
        </div>
        <div class="address">{{item.note}}</div>
        <div class="sort-tools">
          <div>
            <el-switch v-model="item.isSwitch" active-color="#C0CCDA" inactive-color="#188AE2"
                       @change="handleSwitchChange($event,item,index)">
            </el-switch>
          </div>
          <div>
            <el-button type="text" icon="el-icon-edit" size="small" @click="handleUpdate(item)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" size="small" @click="handleDelete(item.id)">删除</el-button>
          </div>
        </div>
      </li>
    </ul>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="ms-dialog">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="100%">
              <el-form-item label="快递公司名称:" prop="name" class="el-form-flex">
                <el-select v-model="form.name" style="width: 100%;" filterable>
                  <el-option v-for="item in logisticsCompany" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="100%">
              <el-form-item label="描述:" prop="note" class="el-form-flex">
                <el-input type="textarea" v-model="form.note"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="100%">
              <el-form-item label="状态:" prop="status" class="el-form-flex">
                <div style="margin-top: 6px;">
                  <el-radio v-model="form.status" v-for="item in statusOptionList" :key="item.value"
                            :label="item.value">
                    {{item.label}}
                  </el-radio>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="100%">
              <el-form-item label="显示顺序:" prop="sort" class="el-form-flex">
                <el-input type="number" v-model="form.sort"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import {
    page,
    addObj,
    getObj,
    delObj,
    putObj
  } from '@/api/erp/wms/config/Logistics';
  import {mapGetters} from 'vuex';

  export default {
    name: 'logistics',
    data() {
      return {
        form: {
          name: undefined,
          sort: undefined,
          note: undefined,
          status: '0'
        },
        logisticsCompany: [
          {
            value: '安捷快递',
            label: '安捷快递'
          }, {
            value: '亚马逊物流',
            label: '亚马逊物流'
          }, {
            value: '安能物流',
            label: '安能物流'
          }, {
            value: '安信达快递',
            label: '安信达快递'
          }, {
            value: '澳邮专线',
            label: '澳邮专线'
          }, {
            value: '北青小红帽',
            label: '北青小红帽'
          }, {
            value: '百福东方',
            label: '百福东方'
          }, {
            value: '百世快运',
            label: '百世快运'
          }, {
            value: 'CCES快递',
            label: 'CCES快递'
          }, {
            value: '城市100',
            label: '城市100'
          }, {
            value: '城际快递',
            label: '城际快递'
          }, {
            value: 'CPEX中邮快递',
            label: 'CPEX中邮快递'
          }, {
            value: 'COE东方快递',
            label: 'COE东方快递'
          }, {
            value: '长沙创一',
            label: '长沙创一'
          }, {
            value: '成都善途速运',
            label: '成都善途速运'
          }, {
            value: '联合运通',
            label: '联合运通'
          }, {
            value: '德邦',
            label: '德邦'
          }, {
            value: 'D速物流',
            label: 'D速物流'
          }, {
            value: '大田物流',
            label: '大田物流'
          }, {
            value: 'EMS',
            label: 'EMS'
          }, {
            value: '快捷速递',
            label: '快捷速递'
          }, {
            value: 'FEDEX联邦(国内件）',
            label: 'FEDEX联邦(国内件）'
          }, {
            value: 'FEDEX联邦(国际件）',
            label: 'FEDEX联邦(国际件）'
          }, {
            value: '飞康达',
            label: '飞康达'
          }, {
            value: '广东邮政',
            label: '广东邮政'
          }, {
            value: '共速达',
            label: '共速达'
          }, {
            value: '国通快递',
            label: '国通快递'
          }, {
            value: '高铁速递',
            label: '高铁速递'
          }, {
            value: '汇丰物流',
            label: '汇丰物流'
          }, {
            value: '天天快递',
            label: '天天快递'
          }, {
            value: '恒路物流',
            label: '恒路物流'
          }, {
            value: '天地华宇',
            label: '天地华宇'
          }, {
            value: '鸿桥供应链',
            label: '鸿桥供应链'
          }, {
            value: '海派通物流公司',
            label: '海派通物流公司'
          }, {
            value: '华强物流',
            label: '华强物流'
          }, {
            value: '百世快递',
            label: '百世快递'
          }, {
            value: '华夏龙物流',
            label: '华夏龙物流'
          }, {
            value: '好来运快递',
            label: '好来运快递'
          }, {
            value: '京东',
            label: '京东'
          }, {
            value: '京广速递',
            label: '京广速递'
          }, {
            value: '九曳供应链',
            label: '九曳供应链'
          }, {
            value: '佳吉快运',
            label: '佳吉快运'
          }, {
            value: '嘉里物流',
            label: '嘉里物流'
          }, {
            value: '捷特快递',
            label: '捷特快递'
          }, {
            value: '急先达',
            label: '急先达'
          }, {
            value: '加运美',
            label: '加运美'
          }, {
            value: '佳怡物流',
            label: '佳怡物流'
          }, {
            value: '跨越速运',
            label: '跨越速运'
          }, {
            value: '龙邦快递',
            label: '龙邦快递'
          }, {
            value: '联昊通速递',
            label: '联昊通速递'
          }, {
            value: '民邦快递',
            label: '民邦快递'
          }, {
            value: '民航快递',
            label: '民航快递'
          }, {
            value: '明亮物流',
            label: '明亮物流'
          }, {
            value: '能达速递',
            label: '能达速递'
          }, {
            value: '平安达腾飞快递',
            label: '平安达腾飞快递'
          }, {
            value: 'PCA Express',
            label: 'PCA Express'
          }, {
            value: '全晨快递',
            label: '全晨快递'
          }, {
            value: '全峰快递',
            label: '全峰快递'
          }, {
            value: '全日通快递',
            label: '全日通快递'
          }, {
            value: '全信通',
            label: '全信通'
          }, {
            value: '瑞丰速递',
            label: '瑞丰速递'
          }, {
            value: '如风达',
            label: '如风达'
          }, {
            value: '赛澳递',
            label: '赛澳递'
          }, {
            value: '圣安物流',
            label: '圣安物流'
          }, {
            value: '盛邦物流',
            label: '盛邦物流'
          }, {
            value: '上大物流',
            label: '上大物流'
          }, {
            value: '顺丰速运',
            label: '顺丰速运'
          }, {
            value: '盛丰物流',
            label: '盛丰物流'
          }, {
            value: '盛辉物流',
            label: '盛辉物流'
          }, {
            value: '速通物流',
            label: '速通物流'
          }, {
            value: '速腾快递',
            label: '速腾快递'
          }, {
            value: '速必达物流',
            label: '速必达物流'
          }, {
            value: '速尔快递',
            label: '速尔快递'
          }, {
            value: '全一快递',
            label: '全一快递'
          }, {
            value: 'UEQ Express',
            label: 'UEQ Express'
          }, {
            value: '优速快递',
            label: '优速快递'
          }, {
            value: '万家物流',
            label: '万家物流'
          }, {
            value: '万象物流',
            label: '万象物流'
          }, {
            value: '新邦物流',
            label: '新邦物流'
          }, {
            value: '信丰快递',
            label: '信丰快递'
          }, {
            value: '希优特',
            label: '希优特'
          }, {
            value: '新杰物流',
            label: '新杰物流'
          }, {
            value: '源安达快递',
            label: '源安达快递'
          }, {
            value: '远成物流',
            label: '远成物流'
          }, {
            value: '韵达快递',
            label: '韵达快递'
          }, {
            value: '义达国际物流',
            label: '义达国际物流'
          }, {
            value: '越丰物流',
            label: '越丰物流'
          }, {
            value: '原飞航物流',
            label: '原飞航物流'
          }, {
            value: '亚风快递',
            label: '亚风快递'
          }, {
            value: '运通快递',
            label: '运通快递'
          }, {
            value: '圆通速递',
            label: '圆通速递'
          }, {
            value: '亿翔快递',
            label: '亿翔快递'
          }, {
            value: '邮政平邮/小包',
            label: '邮政平邮/小包'
          }, {
            value: '增益快递',
            label: '增益快递'
          }, {
            value: '汇强快递',
            label: '汇强快递'
          }, {
            value: '宅急送',
            label: '宅急送'
          }, {
            value: '众通快递',
            label: '众通快递'
          }, {
            value: '中铁快运',
            label: '中铁快运'
          }, {
            value: '中通速递',
            label: '中通速递'
          }, {
            value: '中铁物流',
            label: '中铁物流'
          }, {
            value: '中邮物流',
            label: '中邮物流'
          }, {
            value: '自有物流',
            label: '自有物流'
          }, {
            value: '申通快递',
            label: '申通快递'
          }
        ],
        statusOptionList: [
          {
            value: '0',
            label: '开启'
          },
          {
            value: '1',
            label: '关闭'
          }
        ],
        rules: {
          name: [{required: true, message: '请输入', trigger: 'blur'}],
          sort: [{required: true, message: '请输入', trigger: 'blur'}],
        },
        list: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '修改快递方式',
          create: '新增快递方式'
        }
      }
    },
    created() {
      this.getList();
    },
    computed: {
      ...mapGetters([
        'elements'
      ])
    },
    methods: {
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            if (response.data.records) {
              for (var i in response.data.records) {
                response.data.records[i].isSwitch = response.data.records[i].status == '0' ? false : true;
              }
            }
            this.list = response.data.records;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
      },
      handleUpdate(row) {
        getObj(row.id)
          .then(response => {
            this.form = response.data;
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(id)
            .then(() => {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              });
              this.getList();
            });
        });
      },
      create(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.dialogFormVisible = false;
                this.getList();
                this.$notify({
                  title: '成功',
                  message: '创建成功',
                  type: 'success',
                  duration: 2000
                });
              })
          } else {
            return false;
          }
        });
      },
      cancel(formName) {
        this.dialogFormVisible = false;
        const set = this.$refs;
        set[formName].resetFields();
      },
      update(formName) {
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
            this.form.password = undefined;
            putObj(this.form.id, this.form).then(() => {
              this.dialogFormVisible = false;
              this.getList();
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
            });
          } else {
            return false;
          }
        });
      },
      resetTemp() {
        this.form = {
          status: '0'
        };
      },
      handleSwitchChange(val, row, index) {
        if (val) {
          row.status = '1';
        } else {
          row.status = '0';
        }
        this.form = row;
        putObj(this.form.id, this.form).then(() => {
          this.list[index] = row;
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          });
        });
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  .logistics-container {
    ul {
      list-style: none;
      margin: 0px;
      padding: 0px;
      li {
        border: 1px #e8e9ec solid;
        width: 30%;
        height: 132px;
        margin: 20px 1.5% 0 1.5%;
        display: inline-block;
        vertical-align: middle;
      }
      li.add {
        background-color: #fff;
        border: 1px #d0d0d0 dashed;
        .add-box {
          width: 100%;
          height: 100%;
          display: block;
          text-align: center;
          line-height: 126px;
          cursor: pointer;
        }
      }
      li.close {
        background-color: #f7f7f7;
        .sort-tools {
          background-color: #ededed;
          border-color: #e8e9ec;
        }
      }
      .name {
        margin: 10px 20px;
        height: 30px;
        line-height: 30px;
        color: #333;
        font-size: 16px;
        span {
          font-size: 20px;
          color: #409EFF;
          font-weight: bold;
          margin-right: 10px;
        }
      }
      .address {
        margin: 0px 20px;
        height: 40px;
        line-height: 20px;
        font-size: 14px;
        overflow: hidden;
      }
      .sort-tools {
        display: flex;
        height: 30px;
        line-height: 30px;
        background-color: #f8f8f8;
        border-top: 1px solid #f6f6f7;
        padding: 0px 20px;
        margin-top: 10px;
        justify-content: space-between;
      }
    }
    .ms-dialog {
      font-size: 12px;
      .topTable {
        width: 100%;
        margin-bottom: 20px;
        border: none;
        border-spacing: 0;
        border-collapse: collapse;
        color: #444;

        td {
          border: 1px solid #e0e0e0;
          height: 40px;
          padding: 0px;
          margin: 0px;
          padding-left: 10px;
        }
        .el-form-flex {
          display: flex;
          margin-bottom: 0px;
        }
        .el-input, .el-input-number {
          margin-top: 6px;
          width: 100%;
        }
        .el-select {
          width: 100%;
        }
        .el-radio__label {
          padding-left: 5px;
        }
        .el-input input.el-input__inner {
          border: none;
          text-align: left;
        }
        .el-textarea__inner {
          border: none;
          resize: none;
          padding: 10px 15px;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-form-item__content {
          width: 100%;
          .el-form-item__error {
            position: absolute;
            display: inline-block;
            top: 0px;
            right: 15px;
            text-align: right;
          }
        }
        .el-form-item--medium .el-form-item__label, .el-form-item--mini .el-form-item__label {
          line-height: 40px;
          color: #444;
          white-space: nowrap;
        }
      }
    }
  }
</style>
