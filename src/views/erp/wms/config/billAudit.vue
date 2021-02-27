<template>
  <div class="bill-div">
    <el-row>
      <el-col :span="24" style="padding-left: 20px; padding-bottom: 10px">仓库单据审批</el-col>
      <hr color="#DDDDDD">
    </el-row>
    <el-tabs :tab-position="tabPosition" class="billAuditTab">
      <el-tab-pane label="采购入库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购退库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="生产入库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="生产退库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="盘盈入库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他入库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="销售入库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="销售退库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="盘亏出库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="其他出库单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="调拨单">
        <el-form size="medium">
          <table class="publicTable">
            <tr>
              <td colspan="4" class="colorTd">
                收货
              </td>
            </tr>
            <tr>
              <td class="colorTd">
                执行人员
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="value" placeholder="请选择执行人员" style="width: 100%">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td colspan="2">
              <span @click="">
                <svg-icon icon-class="add"></svg-icon>
              </span>
              </td>
            </tr>
            <tr>
              <td class="colorTd">
              </td>
              <td colspan="3">
                <el-form-item class="el-form-flex">
                  <el-checkbox v-model="conditionChecked" @change="handleCheckedChoose">条件审批</el-checkbox>
                  <el-checkbox v-model="checked2">多人执行时，一人完成即可</el-checkbox>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="requisitionVisible">
              <td class="colorTd">
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="value1" placeholder="请选择" @change="handleChange" style="width: 100%;">
                    <el-option
                      v-for="item in options2"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="value2" placeholder="请选择" style="width: 100%;" v-if="operationVisible">
                    <el-option
                      v-for="item in options3"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                 <el-select v-model="value3" placeholder="请选择" style="width: 100%;" v-if="equalVisible">
                    <el-option
                      v-for="item in equalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-input v-model="numberic" v-if="numbericVisible"></el-input>
                  <el-select v-model="value4" style="width: 100%;" placeholder="请选择"
                             multiple v-if="transferTypeVisible">
                    <el-option
                      v-for="item in transferType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                 <el-select v-model="value5" style="width: 100%;" placeholder="请选择"
                            v-if="receiptTypeVisible">
                    <el-option
                      v-for="item in receiptType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
          <el-row>
            <el-col>
              <el-button size="medium" type="primary">确定</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="外借单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="归还单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="发货通知单">
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

<style lang="scss">
  .bill-div {
    margin-top: 20px;
    height: 100%;

    .billAuditTab {
      height: 100vh !important;
      //padding-bottom: 10vh;
      .el-col {
        line-height: 45px;
        padding-left: 20px;
      }

      .publicTable {
        width: 1200px;
        border: none;
        border-spacing: 0;
        border-collapse: collapse;
        margin: 20px;

        td {
          border: 1px solid #e0e0e0;
          height: 45px;
          width: 300px;
          padding-left: 20px;
          margin: 0;
        }

        .el-form-item {
           margin: 0px;
        }

        .colorTd{
          background-color: #F8F8F8;
        }

        .el-input input.el-input__inner {
          border: none !important;
          padding: 0px 0px 0px 10px;
        }

      }
    }
  }

</style>

<script>
  /* import {page, addObj, getObj, delObj, putObj} from '@/api/erp/goods/brand';
   import {uploadPath} from '@/api/erp/goods/storage'*/

export default {
name: 'Brand',
data() {
return {
tabPosition: 'left',
checked: false,
options: [{
  value: '1',
  label: '由发起人指定'
}, {
  value: '2',
  label: '由发起人执行'
}, {
  value: '3',
  label: '由上一级执行人指定'
}, {
  value: '4',
  label: '固定执行人'
}],
value: '1',
requisitionVisible: false,
options2: [{
  value: '1',
  label: '总金额'
}, {
  value: '2',
  label: '总数量'
}, {
  value: '3',
  label: '调拨类型'
}, {
  value: '4',
  label: '单据类型'
}],
value1: '1',
options3: [{
  value: '1',
  label: '>'
}, {
  value: '2',
  label: '>='
}],
value2: '1',
equalOptions:[{
  value: '1',
  label: '='
}],
value3:'1',
transferType:[
{
  value: '1',
  label: '同价调拨'
}, {
  value: '2',
  label: '异价调拨'
}
],
value4:'',
receiptType:[
{
  value: '1',
  label: '标准调拨单'
}
],
value5:'',
numberic:'0.00',
conditionChecked:false,
checked2:false,
operationVisible:true,
equalVisible:false,
transferTypeVisible:false,
receiptTypeVisible:false,
numbericVisible:true,
}
},
created() {
},
methods: {
handleCheckedChoose() {
  let value = this.conditionChecked;
if (value === true) {
  this.requisitionVisible = true;
}else{
   this.requisitionVisible = false;
 }
},
handleChange(){
  let value = this.value1;
if ( value === '1' || value === '2') {
  this.operationVisible = true;
  this.equalVisible = false;
  this.numbericVisible = true;
  this.transferTypeVisible = false;
  this.receiptTypeVisible = false;
}else if ( value === '3'){
  this.operationVisible = false;
  this.equalVisible = true;
  this.numbericVisible = false;
  this.transferTypeVisible=true;
  this.receiptTypeVisible=false;
}else if ( value === '4'){
  this.operationVisible = false;
  this.equalVisible = true;
  this.numbericVisible = false;
  this.transferTypeVisible=false;
  this.receiptTypeVisible=true;
}
}
}
}
</script>
