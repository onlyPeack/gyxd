<template>
  <div class="purchase-bill-div">
    <el-row>
      <el-col :span="24" style="padding-left: 20px; padding-bottom: 10px">采购单据审批</el-col>
      <hr color="#DDDDDD">
    </el-row>
    <el-tabs :tab-position="tabPosition" class="billAuditTab">
      <el-tab-pane label="供应商">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购订单">
        <el-form :model="auditForm" size="medium">
          <!-- 采购审批单采购订单 -->
          <table class="publicTable">
            <tr>
              <td colspan="4" class="colorTd">
                审核
              </td>
            </tr>
            <tr>
              <td class="colorTd">
                审核级次
              </td>
              <td colspan="3">
                <el-form-item>
                  <el-select v-model="auditForm.auditLevel" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in auditForm.auditLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="colorTd">
                第1级审核人
              </td>
              <td>
                <el-form-item>
                  <el-select v-model="auditForm.reviewer" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in auditForm.reviewerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <el-checkbox v-model="auditForm.conditionChecked" @change="handleCheckedChoose">条件审批</el-checkbox>
                </el-form-item>
              </td>
              <td>
                <span @click="">
                  <svg-icon icon-class="add"></svg-icon>
                </span>
              </td>
            </tr>
            <tr v-if="auditForm.requisitionVisible">
              <td class="colorTd">
              </td>
              <td>
                <el-form-item>
                  <el-select v-model="auditForm.conditional" placeholder="请选择" style="width: 100%"
                             @change="handleChange('auditForm',$event)">
                    <el-option
                      v-for="item in auditForm.conditionalSelectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item>
                  <el-select v-model="auditForm.symbol" placeholder="请选择" style="width: 100%;"
                             v-if="auditForm.symbolVisible">
                    <el-option
                      v-for="item in auditForm.symbolOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="auditForm.equal" placeholder="请选择" style="width: 100%;"
                             v-if="auditForm.equalVisible">
                    <el-option
                      v-for="item in auditForm.equalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-input v-model="auditForm.numberic" v-if="auditForm.numbericVisible" placeholder="0.00"></el-input>
                  <el-select v-model="auditForm.currency" style="width: 100%;" placeholder="请选择"
                             v-if="auditForm.currencyVisible">
                    <el-option
                      v-for="item in auditForm.currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="auditForm.receipt" style="width: 100%;" placeholder="请选择"
                             v-if="auditForm.receiptTypeVisible">
                    <el-option
                      v-for="item in auditForm.receiptType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="auditForm.supplier" style="width: 100%;" placeholder="请选择"
                             v-if="auditForm.supplierOptionsVisible">
                    <el-option
                      v-for="item in auditForm.supplierOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
        <el-form :model="noticeForm" size="medium">
          <table class="publicTable">
            <tr>
              <td colspan="4" class="colorTd">
                通知入库
              </td>
            </tr>
            <tr>
              <td class="colorTd">
                执行人员
              </td>
              <td>
                <el-form-item>
                  <el-select v-model="noticeForm.notifyStaff" placeholder="请选择执行人员" style="width: 100%">
                    <el-option
                      v-for="item in noticeForm.options"
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
                <el-form-item>
                  <el-checkbox v-model="noticeForm.conditionChecked" @change="handleCheckedChoose">条件审批</el-checkbox>
                  <el-checkbox v-model="noticeForm.checked2">多人执行时，一人完成即可</el-checkbox>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="noticeForm.requisitionVisible">
              <td class="colorTd">
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="noticeForm.conditional" placeholder="请选择" style="width: 100%;"
                             @change="handleChange('noticeForm',$event)">
                    <el-option
                      v-for="item in noticeForm.conditionalSelectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="noticeForm.symbol" placeholder="请选择" style="width: 100%;"
                             v-if="noticeForm.symbolVisible">
                    <el-option
                      v-for="item in noticeForm.symbolOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="noticeForm.equal" placeholder="请选择" style="width: 100%;"
                             v-if="noticeForm.equalVisible">
                    <el-option
                      v-for="item in noticeForm.equalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-input v-model="noticeForm.numberic" v-if="noticeForm.numbericVisible"
                            placeholder="0.00"></el-input>
                  <el-select v-model="noticeForm.currency" style="width: 100%;" placeholder="请选择"
                             v-if="noticeForm.currencyVisible">
                    <el-option
                      v-for="item in noticeForm.currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="noticeForm.receipt" style="width: 100%;" placeholder="请选择"
                             v-if="noticeForm.receiptTypeVisible">
                    <el-option
                      v-for="item in noticeForm.receiptType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="noticeForm.supplier" style="width: 100%;" placeholder="请选择"
                             v-if="noticeForm.supplierOptionsVisible">
                    <el-option
                      v-for="item in noticeForm.supplierOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
        <el-form :model="storageForm" size="medium">
          <table class="publicTable">
            <tr>
              <td colspan="4" class="colorTd">
                入库
              </td>
            </tr>
            <tr>
              <td class="colorTd">
                执行人员
              </td>
              <td>
                <el-form-item>
                  <el-select v-model="storageForm.storageStaff" placeholder="请选择执行人员" style="width: 100%">
                    <el-option
                      v-for="item in storageForm.options"
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
                <el-form-item>
                  <el-checkbox v-model="storageForm.conditionChecked" @change="handleCheckedChoose">条件审批</el-checkbox>
                  <el-checkbox v-model="storageForm.checked2">多人执行时，一人完成即可</el-checkbox>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="storageForm.requisitionVisible">
              <td class="colorTd">
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="storageForm.conditional" placeholder="请选择" style="width: 100%;"
                             @change="handleChange('storageForm',$event)">
                    <el-option
                      v-for="item in storageForm.conditionalSelectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-select v-model="storageForm.symbol" placeholder="请选择" style="width: 100%;"
                             v-if="storageForm.symbolVisible">
                    <el-option
                      v-for="item in storageForm.symbolOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="storageForm.equal" placeholder="请选择" style="width: 100%;"
                             v-if="storageForm.equalVisible">
                    <el-option
                      v-for="item in storageForm.equalOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item class="el-form-flex">
                  <el-input v-model="storageForm.numberic" v-if="storageForm.numbericVisible"
                            placeholder="0.00"></el-input>
                  <el-select v-model="storageForm.currency" style="width: 100%;" placeholder="请选择"
                             v-if="storageForm.currencyVisible">
                    <el-option
                      v-for="item in storageForm.currencyOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="storageForm.receipt" style="width: 100%;" placeholder="请选择"
                             v-if="storageForm.receiptTypeVisible">
                    <el-option
                      v-for="item in storageForm.receiptType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="storageForm.supplier" style="width: 100%;" placeholder="请选择"
                             v-if="storageForm.supplierOptionsVisible">
                    <el-option
                      v-for="item in storageForm.supplierOptions"
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
      <el-tab-pane label="采购申请单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购退货申请单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购订单变更单">
        <el-form :model="purchaseChangeForm" size="medium">
          <el-row>
            <el-col>
              <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
            </el-col>
            <!-- 采购订单变更单 -->
            <table class="publicTable">
              <tr>
                <td class="colorTd">
                  审核级次
                </td>
                <td colspan="3">
                  <el-form-item>
                    <el-select v-model="purchaseChangeForm.auditLevel" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in purchaseChangeForm.auditLevelOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td class="colorTd">
                  第1级审核人
                </td>
                <td colspan="2">
                  <el-form-item>
                    <el-select v-model="purchaseChangeForm.reviewer" placeholder="请选择" style="width: 100%">
                      <el-option
                        v-for="item in purchaseChangeForm.reviewerOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item>
                    <el-checkbox v-model="purchaseChangeForm.conditionChecked" @change="handleCheckedChoose">条件审批
                    </el-checkbox>
                  </el-form-item>
                </td>
              </tr>
              <tr v-if="purchaseChangeForm.requisitionVisible">
                <td class="colorTd">
                  <span class="editSpan">
                    <svg-icon icon-class="add"></svg-icon>
                    <svg-icon icon-class="reduce"></svg-icon>
                  </span>
                </td>
                <td>
                  <el-form-item>
                    <el-select v-model="purchaseChangeForm.changeValue" placeholder="请选择" style="width: 100%"
                               @change="handlePurchaseChange">
                      <el-option
                        v-for="item in purchaseChangeForm.changeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item>
                    <el-select v-model="purchaseChangeForm.symbol" placeholder="请选择" style="width: 100%;"
                               v-if="purchaseChangeForm.symbolVisible">
                      <el-option
                        v-for="item in purchaseChangeForm.symbolOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="purchaseChangeForm.equal" placeholder="请选择" style="width: 100%;"
                               v-if="purchaseChangeForm.equalVisible">
                      <el-option
                        v-for="item in purchaseChangeForm.equalOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td>
                  <el-form-item class="el-form-flex">
                    <el-input v-model="purchaseChangeForm.numberic" v-if="purchaseChangeForm.numbericVisible"
                              placeholder="0.00"></el-input>
                    <el-select v-model="purchaseChangeForm.currency" style="width: 100%;" placeholder="请选择"
                               v-if="purchaseChangeForm.currencyVisible">
                      <el-option
                        v-for="item in purchaseChangeForm.currencyOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                    <el-select v-model="purchaseChangeForm.receipt" style="width: 100%;" placeholder="请选择"
                               v-if="purchaseChangeForm.receiptTypeVisible">
                      <el-option
                        v-for="item in purchaseChangeForm.receiptType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <el-col>
              <el-button size="medium" type="primary">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="收货通知单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="付款通知单">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购合同">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购价格配置">
        <el-row>
          <el-col>
            <el-checkbox size="large" v-model="checked">是否审核</el-checkbox>
          </el-col>
          <el-col>
            <el-button size="medium" type="primary">保存</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="采购返利单">
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

<script>
  export default {
    name: "purchaseBillAudit",
    data() {
      return {
        auditForm: {
          auditLevelOptions: [
            {
              value: '1',
              label: '1级'
            }, {
              value: '2',
              label: '2级'
            }, {
              value: '3',
              label: '3级'
            }, {
              value: '4',
              label: '4级'
            }, {
              value: '5',
              label: '5级'
            }, {
              value: '6',
              label: '6级'
            }, {
              value: '7',
              label: '7级'
            }, {
              value: '8',
              label: '8级'
            }, {
              value: '9',
              label: '9级'
            }],
          auditLevel: '1',
          reviewerOptions: [
            {
              value: '1',
              label: '由发起人指定'
            }, {
              value: '2',
              label: '直接上级'
            }, {
              value: '3',
              label: '间接上级'
            }, {
              value: '4',
              label: '三阶上级'
            }, {
              value: '5',
              label: '四阶上级'
            }, {
              value: '6',
              label: '指定人员'
            }, {
              value: '7',
              label: '会审（全部）'
            }, {
              value: '8',
              label: '会审（单一）'
            }, {
              value: '9',
              label: '会审（选择）'
            }],
          reviewer: '1',
          conditionalSelectOptions: [
            {
              value: '1',
              label: '供应商名称'
            }, {
              value: '2',
              label: '总金额'
            }, {
              value: '3',
              label: '采购数量'
            }, {
              value: '4',
              label: '币别'
            }, {
              value: '5',
              label: '单据类型'
            }],
          conditional: '',
          symbolOptions: [{
            value: '1',
            label: '>'
          }, {
            value: '2',
            label: '>='
          }],
          symbol: '1',
          equalOptions: [{
            value: '1',
            label: '='
          }],
          equal: '1',
          currencyOptions: [{
            value: '1',
            label: '人民币'
          }, {
            value: '2',
            label: '加元'
          }, {
            value: '3',
            label: '澳元'
          }],
          currency: '',
          receiptType: [
            {
              value: '1',
              label: '标准调拨单'
            }
          ],
          receipt: '',
          supplierOptions: [
            {
              value: '1',
              label: '上海施耐德'
            }, {
              value: '2',
              label: '测试供应商'
            }],
          supplier: '',
          numberic: '',
          requisitionVisible: false,
          conditionChecked: false,
          checked2: false,
          symbolVisible: true,
          equalVisible: false,
          currencyVisible: false,
          receiptTypeVisible: false,
          numbericVisible: true,
          supplierOptionsVisible: false,
        },
        noticeForm: {
          options: [
            {
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
            }
          ],
          notifyStaff: '1',
          conditionalSelectOptions: [
            {
              value: '1',
              label: '供应商名称'
            }, {
              value: '2',
              label: '总金额'
            }, {
              value: '3',
              label: '采购数量'
            }, {
              value: '4',
              label: '币别'
            }, {
              value: '5',
              label: '单据类型'
            }],
          conditional: '',
          symbolOptions: [{
            value: '1',
            label: '>'
          }, {
            value: '2',
            label: '>='
          }],
          symbol: '1',
          equalOptions: [{
            value: '1',
            label: '='
          }],
          equal: '1',
          currencyOptions: [{
            value: '1',
            label: '人民币'
          }, {
            value: '2',
            label: '加元'
          }, {
            value: '3',
            label: '澳元'
          }],
          currency: '',
          receiptType: [
            {
              value: '1',
              label: '标准调拨单'
            }
          ],
          receipt: '',
          supplierOptions: [
            {
              value: '1',
              label: '上海施耐德'
            }, {
              value: '2',
              label: '测试供应商'
            }],
          supplier: '',
          numberic: '',
          requisitionVisible: false,
          conditionChecked: false,
          checked2: false,
          symbolVisible: true,
          equalVisible: false,
          currencyVisible: false,
          receiptTypeVisible: false,
          numbericVisible: true,
          supplierOptionsVisible: false,
        },
        storageForm: {
          options: [
            {
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
            }
          ],
          storageStaff: '1',
          conditionalSelectOptions: [
            {
              value: '1',
              label: '供应商名称'
            }, {
              value: '2',
              label: '总金额'
            }, {
              value: '3',
              label: '采购数量'
            }, {
              value: '4',
              label: '币别'
            }, {
              value: '5',
              label: '单据类型'
            }],
          conditional: '',
          symbolOptions: [{
            value: '1',
            label: '>'
          }, {
            value: '2',
            label: '>='
          }],
          symbol: '1',
          equalOptions: [{
            value: '1',
            label: '='
          }],
          equal: '1',
          currencyOptions: [{
            value: '1',
            label: '人民币'
          }, {
            value: '2',
            label: '加元'
          }, {
            value: '3',
            label: '澳元'
          }],
          currency: '',
          receiptType: [
            {
              value: '1',
              label: '标准调拨单'
            }
          ],
          receipt: '',
          supplierOptions: [
            {
              value: '1',
              label: '上海施耐德'
            }, {
              value: '2',
              label: '测试供应商'
            }],
          supplier: '',
          numberic: '',
          requisitionVisible: false,
          conditionChecked: false,
          checked2: false,
          symbolVisible: true,
          equalVisible: false,
          currencyVisible: false,
          receiptTypeVisible: false,
          numbericVisible: true,
          supplierOptionsVisible: false,
        },
        purchaseChangeForm: {
          auditLevelOptions: [
            {
              value: '1',
              label: '1级'
            }, {
              value: '2',
              label: '2级'
            }, {
              value: '3',
              label: '3级'
            }, {
              value: '4',
              label: '4级'
            }, {
              value: '5',
              label: '5级'
            }, {
              value: '6',
              label: '6级'
            }, {
              value: '7',
              label: '7级'
            }, {
              value: '8',
              label: '8级'
            }, {
              value: '9',
              label: '9级'
            }],
          auditLevel: '1',
          reviewerOptions: [
            {
              value: '1',
              label: '由发起人指定'
            }, {
              value: '2',
              label: '直接上级'
            }, {
              value: '3',
              label: '间接上级'
            }, {
              value: '4',
              label: '三阶上级'
            }, {
              value: '5',
              label: '四阶上级'
            }, {
              value: '6',
              label: '指定人员'
            }, {
              value: '7',
              label: '会审（全部）'
            }, {
              value: '8',
              label: '会审（单一）'
            }, {
              value: '9',
              label: '会审（选择）'
            }],
          reviewer: '2',
          receiptType: [
            {
              value: '1',
              label: '标准调拨单'
            }
          ],
          receipt: '',
          symbolOptions: [{
            value: '1',
            label: '>'
          }, {
            value: '2',
            label: '>='
          }],
          symbol: '1',
          equalOptions: [{
            value: '1',
            label: '='
          }],
          equal: '1',
          changeOptions: [{
            value: '1',
            label: '单据金额'
          }, {
            value: '2',
            label: '单据数量'
          }, {
            value: '3',
            label: '单据类型'
          }],
          changeValue: '',
          numberic: '',
        },
        tabPosition: 'left',
        checked: false,
      }
    },
    created() {
    },
    methods: {
      handleCheckedChoose() {
        let value = this.auditForm.conditionChecked;
        if (value === true) {
          this.auditForm.requisitionVisible = true;
        } else {
          this.auditForm.requisitionVisible = false;
        }

        let value1 = this.noticeForm.conditionChecked;
        if (value1 === true) {
          this.noticeForm.requisitionVisible = true;
        } else {
          this.noticeForm.requisitionVisible = false;
        }
        let value2 = this.storageForm.conditionChecked;
        if (value2 === true) {
          this.storageForm.requisitionVisible = true;
        } else {
          this.storageForm.requisitionVisible = false;
        }
        let value3 = this.purchaseChangeForm.conditionChecked;
        if (value3 === true) {
          this.purchaseChangeForm.requisitionVisible = true;
        } else {
          this.purchaseChangeForm.requisitionVisible = false;
        }
      },
      handleChange(val) {
        console.log(val)
        console.log(this[val].conditional)
        let value = this[val].conditional;
        if (value === '1') {

          this[val].symbolVisible = false;
          this[val].equalVisible = true;
          this[val].numbericVisible = false;
          this[val].currencyVisible = false;
          this[val].receiptTypeVisible = false;
          this[val].supplierOptionsVisible = true;

        } else if (value === '2' || value === '3') {

          this[val].symbolVisible = true;
          this[val].equalVisible = false;
          this[val].numbericVisible = true;
          this[val].currencyVisible = false;
          this[val].receiptTypeVisible = false;
          this[val].supplierOptionsVisible = false;
        } else if (value === '4') {

          this[val].symbolVisible = false;
          this[val].equalVisible = true;
          this[val].numbericVisible = false;
          this[val].currencyVisible = true;
          this[val].receiptTypeVisible = false;
          this[val].supplierOptionsVisible = false;
        } else if (value === '5') {

          this[val].symbolVisible = false;
          this[val].equalVisible = true;
          this[val].numbericVisible = false;
          this[val].currencyVisible = false;
          this[val].receiptTypeVisible = true;
          this[val].supplierOptionsVisible = false;
        }
      },
      handlePurchaseChange() {
        let value = this.purchaseChangeForm.changeValue;
        if (value === "1" || value === "2") {
          this.purchaseChangeForm.symbolVisible = true;
          this.purchaseChangeForm.equalVisible = false;
          this.purchaseChangeForm.numbericVisible = true;
          this.purchaseChangeForm.receiptTypeVisible = false;
        } else if (value === "3") {
          this.purchaseChangeForm.symbolVisible = false;
          this.purchaseChangeForm.equalVisible = true;
          this.purchaseChangeForm.numbericVisible = false;
          this.purchaseChangeForm.receiptTypeVisible = true;
        }
      }
    }
  }
</script>

<style lang="scss">
  .purchase-bill-div {
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

        .editSpan{
          float: right;
          margin-right: 15px;
          svg{
            margin-left: 10px;
          }
        }

        .colorTd {
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
