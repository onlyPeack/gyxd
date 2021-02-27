<template>
  <el-dialog :visible.sync="dialogFormVisible" width="70%" class="billFormDialog billDetailDialog"
             :close-on-click-modal="false" @close="$emit('handleDialogClose')">
    <task-history v-if="dataForm.billNo && processId && processId!=''" :processId="processId"
                    :billNo="dataForm.billNo"></task-history>
    <el-form :model="dataForm" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商编号" prop="supplierCode">
            <el-input v-model="dataForm.supplierCode" placeholder="请输入供应商编号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商全称" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="请输入供应商全称" :disabled="true">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商简称" prop="abbrName">
            <el-input v-model="dataForm.abbrName" placeholder="请输入供应商简称" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="所属采购" prop="crtUserName">
            <div @click="handleManagerShow">
              <el-input v-model="dataForm.crtUserName" placeholder="请输入所属采购"  :disabled="true"></el-input>
            </div>

          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属采购工号" prop="crtUserNo">
            <el-input v-model="dataForm.crtUserNo" placeholder="请输入所属采购工号" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商类型" prop="supplierType">
            <div v-for="item in supplierTypes">
              <span v-if="dataForm.supplierType==item.value">{{item.label}}</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
         <el-col :span="8">
          <el-form-item label="渠道推荐人" prop="channelReferrer">
            <el-input v-model="dataForm.channelReferrer" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="允许发布类型" prop="channelReferrer">
           <el-select v-model="dataForm.publishType" disabled placeholder="请选择等级">
              <el-option v-for="item in publishTypeOption"  :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="供应商等级" prop="supplierGrade">
            <div v-for="item in supplierGrades">
              <span v-if="dataForm.supplierGrade==item.value">{{item.label}}</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否已认证" prop="authenticationTypes">
            <el-switch :disabled="true"
                       v-model="dataForm.authenticationType == 'false'? false:true"
                       active-text="是"
                       inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否黑名单" prop="types">
            <el-switch :disabled="true"
                       v-model="dataForm.blackType == 'false'? false:true"
                       active-text="是"
                       inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>



      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="全称" prop="supplierName">
                <el-input v-model="dataForm.supplierName" :disabled="true" placeholder="请输入全称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="简称" prop="abbrName">
                <el-input v-model="dataForm.abbrName" :disabled="true" placeholder="请输入简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司网站" prop="website">
                <el-input v-model="dataForm.website" :disabled="true" placeholder="请输入公司网站"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电商网站" prop="commerceWebsite">
                <el-input v-model="dataForm.commerceWebsite" :disabled="true" placeholder="请输入电商网站"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司邮箱" prop="email">
                <el-input v-model="dataForm.email" :disabled="true" placeholder="请输入公司邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司电话" prop="phone">
                <el-input v-model="dataForm.phone" :disabled="true" placeholder="请输入公司电话"></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12">-->
<!--              <el-form-item label="公司地址" prop="companyAdress">-->
<!--                <el-input v-model="dataForm.companyAdress" placeholder="请输入公司地址" :disabled="true"></el-input>-->
<!--              </el-form-item>regionCodes-->
<!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="公司地址" prop="regionCode">
<!--                <el-cascader :disabled="true"-->
<!--                  size="large"-->
<!--                  :options="options"-->
<!--                  v-model="dataForm.regionCodes"-->
<!--                  style="width: 100%;margin-top: -6px;" class="regionCode_input"-->
<!--                  @change="handleChange">-->
<!--                </el-cascader>-->
                 <div style="display: inline-block;width: 100px;">
                  <el-input v-model="dataForm.province" disabled>
                  </el-input>
                </div>省
                 <div style="display: inline-block;width: 100px;padding-left: 20px">
                  <el-input
                    v-model="dataForm.city" disabled>
                  </el-input></div>市<div style="display: inline-block;width: 100px;padding-left: 20px">
                  <el-input
                    v-model="dataForm.county" disabled>
                  </el-input>
                </div>县

              </el-form-item>
            </el-col>
            <el-row>
              <el-col :span="12">
                <el-form-item label="详细地址" prop="address">
                  <el-input v-model="dataForm.address" :disabled="true" placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主品类/优势品牌" prop="mainBrand">
                <el-input v-model="dataForm.mainBrand" :disabled="true" placeholder="请输入主品类/优势品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公司简介" prop="companyProfile">
                <el-input v-model="dataForm.companyProfile" :disabled="true" placeholder="请输入公司简介"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="备注" prop="note">
            <el-input v-model="dataForm.note" placeholder="请输入备注" :disabled="true"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="third">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="bankName">
                <el-input v-model="dataForm.bankName" :disabled="true" placeholder="请输入开户银行"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="bankAccount">
                <el-input v-model="dataForm.bankAccount" :disabled="true" placeholder="请输入银行账号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="taxpayerNumber">
                <el-input v-model="dataForm.taxpayerNumber" :disabled="true" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式" prop="paymentsMeans">
                <el-select class="filter-item" v-model="dataForm.paymentsMeans" placeholder="请输入结算方式" :disabled="true">
                  <el-option v-for="item in payments" :key="item.id" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="second">
          <el-table :data="linkManTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="linkManTable">
            <el-table-column type="index" width="50">
            </el-table-column>
<!--            <el-table-column width="65">-->
<!--            </el-table-column>-->
            <el-table-column prop="linkMan" label='供应商联系人' width="180">
            </el-table-column>
            <el-table-column prop="linkPosition" label="联系人职务" width="180">
            </el-table-column>
            <el-table-column prop="linkPhone" label="联系人电话" width="220">
            </el-table-column>
            <el-table-column prop="linkEmail" label="联系人邮箱" width="220">
            </el-table-column>
            <el-table-column prop="linkSix" label="性别" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.linkSix" placeholder="请选择">
                  <el-option
                    v-for="item in sixOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span>{{scope.row.linkSix == '1'?'女':'男'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkIsMain" label="是否主要联系人" width="180">
              <template slot-scope="scope">
                <span>{{({true:"是",false:"否"})[scope.row.linkIsMain]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注" width="220">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.note" placeholder="请输入内容"></el-input>
                <span>{{scope.row.note}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-if="id != ''" label="账户信息" name="fourth">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userNo.username" placeholder="请输入用户名" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="密码" prop="passWord">
                <el-input value="******" placeholder="请输入密码" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="crtUserName">
                <el-input v-model="userNo.name" placeholder="请输入联系人" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="telPhone">
                <el-input v-model="userNo.telPhone" placeholder="请输入联系电话" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane v-if="id != ''" label="仓库信息" name="fifth">
          <el-table :data="storeHouseTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="storeHouseTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="warehouseCode" label='仓库编号' min-width="180">
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="仓库地址" width="220">
            </el-table-column>
            <el-table-column prop="contact" label="联系人" width="220">
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" width="120">
            </el-table-column>
            <el-table-column prop="straightExpress" label="直发快递" width="220">
            </el-table-column>
            <el-table-column prop="warehouseFloor" label="仓库占地面积" width="220">
            </el-table-column>
            <el-table-column prop="warehouseKeeper" label="仓库人员" width="220">
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page="warehouseListQuery.page"
                           :page-sizes="[10,20,50,100]" :page-size="warehouseListQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="warehouseTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="id != ''" label="附件信息" name="sixth">
          <el-table :data="appendixTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="appendixTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label='名称' min-width="180">
            </el-table-column>
            <el-table-column prop="accessoryType;" label="附件类型" width="120">
              <template slot-scope="scope">
                  <span  v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
                    {{item.label}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column prop="validity" label="有效期"  width="220">
            </el-table-column>
            <el-table-column prop="opt;" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <a @click="showDetail(scope.row.url)">
                    <el-button type="text" icon="el-icon-view">查看</el-button>
                  </a>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChanges" @current-change="handleCurrentChanges"
                           :current-page="accessoryListQuery.page"
                           :page-sizes="[10,20,50,100]" :page-size="accessoryListQuery.limit"
                           layout="total, sizes, prev, pager, next, jumper" :total="accessoryTotal">
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 供应商负责人列表弹窗-->
    <el-dialog title="请选择人员" :visible.sync="managerVisible" append-to-body>
      <supplier-manager @closeUserDialog="closeUserDialog" :isSingle="true"
                        ref="supplierManagerDialog"></supplier-manager>
      <span slot="footer" class="dialog-footer">
        <el-button @click="managerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleManagerConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="warehouseMap[warehouseIndex].label" :visible.sync="warehouseVisible" v-if="warehouseVisible" append-to-body>
      <div class="center-container">
        <el-form :model="warehouseForm" ref="warehouseForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td width="50%">
                <el-form-item label="仓库编号" prop="warehouseCode" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseCode" placeholder="自动生成仓库编号" :disabled="true"></el-input>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="仓库名称:" prop="warehouseName" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseName" placeholder="请输入仓库名称"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <el-form-item label="仓库地址" prop="address" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.address" placeholder="请输入仓库地址"></el-input>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="联系人:" prop="contact" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.contact" placeholder="请输入联系人"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td width="50%">
                <el-form-item label="联系电话" prop="phone" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.phone" placeholder="请输入联系电话"></el-input>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="直发快递:" prop="straightExpress" class="el-form-flex">
                  <div @click="handleRepressSelector" style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                <span>
                  <svg-icon icon-class="add"></svg-icon>
                </span>
                    <el-tag v-for="tag in expressArr" :key="tag" closable
                            @close="handleExpressDel">
                      {{tag}}
                    </el-tag>
                  </div>
                </el-form-item>
              </td>
            <tr>
              <td width="50%">
                <el-form-item label="仓库占地面积" prop="warehouseFloor" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseFloor" placeholder="请输入仓库占地面积"></el-input>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="仓库人员:" prop="warehouseKeeper" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseKeeper" placeholder="请输入仓库人员"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog :title="accessoryMap[accessoryIndex].label" :visible.sync="accessoryVisible" v-if="accessoryVisible" append-to-body>
      <div class="center-container">
        <el-form :model="accessoryForm" ref="accessoryForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td>
                <el-form-item label="附件类型:" prop="accessoryType" class="el-form-flex">
                  <el-select v-model="accessoryForm.accessoryType" placeholder="请选择">
                    <el-option
                      v-for="item in accessoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td>
                <el-form-item label="有效期" prop="validity" class="el-form-flex">
                  <el-date-picker
                    v-model="accessoryForm.validity"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="附件名称" prop="name" class="el-form-flex">
                  <el-upload class="attachment-upload" :action="uploadPath" :show-file-list="true"
                             :on-success="handleFileSuccess"
                             :on-remove="handleFileRemove"
                             :file-list="attachmentList">
                    <svg-icon icon-class="add"></svg-icon>
                  </el-upload>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
    </el-dialog>
    <!-- 供应商名称查重弹窗-->
    <el-dialog title="供应商名称查重" :visible.sync="dialogChecksupplierNameVisible" append-to-body>
      <div class="app-container calendar-list-container">

        <!-- 查询和其他操作 -->
        <div class="filter-container">
          <el-input clearable class="filter-item" style="width: 200px;" placeholder="供应商名称"
                    @keyup.enter.native="handleFilter" v-model="listQuery.supplierName">
          </el-input>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        </div>

        <!-- 查询结果 -->
        <el-table size="small" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
                  highlight-current-row>

          <el-table-column label="供应商名称" prop="supplierName">
          </el-table-column>
          <el-table-column label="负责人" prop="managerName">
          </el-table-column>
          <el-table-column label="创建日期" prop="crtTime">
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination background :current-page="listQuery.page"
                         :page-sizes="[10,20]" :page-size="listQuery.limit"
                         layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>


      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="dialogChecksupplierNameVisible = false">关 闭</el-button>
      </span>

    </el-dialog>
    <!--寄送方式-->
    <el-dialog title="请选择直发快递" :visible.sync="expressVisible" append-to-body>
      <express-selector v-if="expressVisible" @closeExpressDialog="closeExpressDialog" :isSingle="false" ref="express"></express-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpress">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 新增采购入库弹窗底部 -->
    <div slot="footer" class="dialog-footer">
      <div style="margin-bottom: 10px;" v-if="processId && processId!='' && taskType=='now'">
        <el-input type="textarea" style="width: 100%;" :rows="2" placeholder="请输入流转备注" v-model="comment"></el-input>
      </div>
      <div v-if="processId && processId!='' && taskType=='now'" style="float: left;display: inline-block;">
        <el-button type="warning" @click="handleAuditBill('驳回')" :loading="isRejectLoading"
                   v-if="dataForm.billStatus!=5">驳 回
        </el-button>
        <el-button type="primary" @click="handleAuditBill('同意')" :loading="isAgreeLoading">同 意</el-button>
      </div>
      <div v-if="dataForm.billStatus && dataForm.billStatus==4" style="float: left;display: inline-block;">
      </div>
      <el-button v-if="taskType=='now'" @click="handleClose">取 消</el-button>
    </div>
    <!-- 图片预览 -->
    <img-viewer ref="viewer"/>
    <!-- pdf预览 -->
      <!-- <pdf :src="pdfUrl"></pdf> -->
  </el-dialog>
</template>

<script>
  import {auditBill, getObj, page, putObj} from '@/api/erp/purchase/supplier/index';
  import ImgViewer from '@/components/imgViewer/imgViewer'
  import {regionData, CodeToText,} from 'element-china-area-data';
  import {addObj as warehouseAddObj, page as warehousePage,getObj as warehouseGetObj,putObj as warehousePutObj, delObj as warehouseDelObj} from '@/api/erp/srm/srmWarehouse';
  import {uploadPath} from '@/api/erp/goods/storage'
  import {getProcessId} from '@/api/erp/oa/task/taskBill';
  import {selectPageByItem,getUserByNo,initPassword} from '@/api/erp/srm/srmSupplier';
  import {addObj as attachmentAddObj,page as selectSupplierAttachment,delObj as attachmentDelObj} from '@/api/erp/srm/srmAttachment';
  import { pdf } from 'vue-pdf'
  export default {
    name: "supplierView",
    props: ['id','collectionTermsOptions', 'paymentsMeansOptions','dialogFormVisible','taskType','step'],
    components: {
      'supplier-manager': () => import('@/components/ERP/User/user'),
      'warehouses-selector': () => import('../../components/warehouseSelector'),
      'express-selector': () => import('@/views/erp/financial/components/expressSelector'),
      'taskHistory': () => import('@/components/ERP/Task/taskHistory'),
      ImgViewer,
      pdf
    },
    data() {
      return {
        uploadPath,
        userNo:{
          mobilePhone:'',
          username: '',
          name: '',
        },
        pdfUrl:"",
        showPdf:false,
        comment: undefined,
        isRejectLoading: false,
        isAgreeLoading: false,
        expressVisible: false,
        warehouseForm:{
          warehouseName: '',
          warehouseKeeper: '',
          warehouseFloor: '',
          warehouseCode: '',
          straightExpress: '',
          phone: '',
          contact: '',
          address: '',
          companyAdress: '',
        },
        accessoryForm:{
          validity: '',
          name: '',
          accessoryType: undefined
        },
        accessoryRules: {

        },
        warehouseRules:{

        },
        warehouseListQuery: {
          page: 1,
          limit: 10,
        },
        accessoryListQuery: {
          page: 1,
          limit: 10,
        },
        warehouseTotal: undefined,
        accessoryTotal: undefined,
        warehouseIndex: 0,
        accessoryIndex: 0,
        warehouseMap:[
          {
            value:0,
            label: '新建仓库信息'
          },
          {
            value:1,
            label: '修改仓库信息'
          }
        ],
        sixOptions: [
          {
            value: '0',
            label: '男'
          },
          {
            value: '1',
            label: '女'
          }
        ],
        accessoryMap:[
          {
            value:0,
            label: '新建附件信息'
          },
          {
            value:1,
            label: '修改附件信息'
          }
        ],
        publishTypeOption:[
          {
            value:1,
            label:'调拨'
          },
          {
            value:2,
            label:'闲置'
          },
        ],
        supplierGrades: [{
          value: '0',
          label: '一级'
        }, {
          value: '1',
          label: '二级'
        },{
          value: '2',
          label: '三级'
        }],
        supplierTypes: [{
          value:'0',
          label:'厂家'
        },{
          value:'1',
          label:'代理商'
        },{
          value:'2',
          label:'经销商'
        }],
        linkSixs: [{
          value: '0',
          label: '男'
        }, {
          value: '1',
          label: '女'
        }],

        authenticationTypes: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '否'
        }],
        warehouseVisible: false,
        accessoryVisible: false,
        accessoryOptions: [
          {
            value: 1,
            label: '品牌授权证书',
          },
          {
            value: 2,
            label: '代理证书',
          },
          {
            value: 3,
            label: '生产证书',
          },
          {
            value: 4,
            label: '供应商认证资料',
          },
          {
            value: 5,
            label: '供应商协议',
          },
          {
            value: 6,
            label: '法人代表有效证明',
          },
          {
            value: 8,
            label: '营业执照',
          },
          {
            value: 7,
            label: '其他',
          },
        ],
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          supplierName: ''
        },
        supplierCode:"",
        dataForm: {
          authenticationTypes: undefined,
          types: undefined,
          id: '',
          supplierCode: '',
          supplierName: '',
          abbrName: '',
          supplierCategory: '',
          commerceWebsite: '',
          managerId: '',
          managerName: '',
          cusFollowOrg: '',
          cusFollowGroup: '',
          supplierType: '',
          supplierAttribute: '',
          supplierIndustry: '',
          companyProfile: '',
          website: '',
          email: '',
          phone: '',
          mainBrand: '',
          fax: '',
          regionCodes: [],
          location: '',
          country: '',
          province: '',
          city: '',
          county: '',
          address: '',
          companyAdress: '',
          taxpayerNumber: '',
          bankName: '',
          bankAccount: '',
          paymentsMeans: '',
          collectionTerms: '',
          creditPeriod: '',
          note: '',
          dataOrg: '',
          linkManTableData: [],
          storeHouseTableData:[],
          appendixTableData:[],
        },
        processId:undefined,
        options: regionData,
        CodeToText,
        activeName: 'first',
        linkManTableData: [],
        storeHouseTableData:[],
        appendixTableData:[],
        warehousesArr:[],
        supplierManagerArr: [],
        managerVisible: false,
        dialogChecksupplierNameVisible: false,
        supplierCategoryOptions: [
          {
            value: '0',
            label: '普通供应商'
          }, {
            value: '1',
            label: '商超供应商'
          }
        ],
        payments:[{
          value: '1',
          label: '手工结算'
        },],
        storeHouseRules:{},
        appendixRules:{},
        expressArr: [],
        attachmentList:[],
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      activeName(val) {
        if(val == 'fifth'){
          this.insertWarehouse();
        }
        if(val == 'sixth'){
          this.selsectPage();
        }
        if(val == 'fourth'){
          this.getUserByNo();
        }
      }
    },
    methods: {
      showDetail(url) {
        // window.open(url, '_blank');
        if(url.indexOf('jpg') > -1 || url.indexOf('JPG') > -1 || url.indexOf('jpeg') > -1 || url.indexOf('png') > -1 || url.indexOf('bmp') > -1) {
          this.imgList = [{
            source:url,
            thumbnail:url
          }]
          this.$refs.viewer.show(
           this.imgList,
            0
          );
        } else {
          window.open(url, '_blank');
        }
      },
      handleAuditBill(val) {
        this.dataForm.taskMap = {
          step: this.step,
          opinion: val,
          comment: this.comment
        };
        this.auditBill(this, 'dataForm', auditBill, 'submitDetailSuccess');
      },
      handleClose() {
        this.$emit('handleClose', false)
      },
      initPassword(){
        initPassword(this.dataForm.supplierCode).then(res=>{
          if(res.code == '2000'){
            this.vueMessage('success','初始化密码成功!');
          }else{
            this.vueMessage('success',res.msg);
          }
        })
      },
      /*附件*/
      handleFileSuccess(response) {
        this.attachmentList.push(response.data);
      },
      handleFileRemove(file, fileList) {
        this.attachmentList = fileList;
      },
      handleSizeChange(val) {
        this.warehouseListQuery.limit = val;
        this.insertWarehouse();
      },
      handleCurrentChange(val) {
        this.warehouseListQuery.page = val;
        this.insertWarehouse();
      },
      handleSizeChanges(val) {
        this.accessoryListQuery.limit = val;
        this.selsectPage();
      },
      handleCurrentChanges(val) {
        this.accessoryListQuery.page = val;
        this.selsectPage();
      },
      handleRepressSelector(){
        this.expressVisible = true;
      },
      handleCancelExpress(){
        this.$refs.express.reset();
        this.expressVisible = false;
      },
      handleSubmitExpress(){
        this.$refs.express.onSubmit()
      },
      handleWarehouseDel(){
        this.warehousesArr = [];
      },
      handleExpressDel(index) {
        this.expressArr.splice(index, 1);
        this.dataForm.straightExpress = this.expressArr.join(',');
      },
      closeExpressDialog(list){
        for(let i in list){
          this.expressArr.push(list[i].name);
        }
        this.expressArr = this.unique(this.expressArr);
        this.warehouseForm.straightExpress = this.expressArr.join(',');
        this.expressVisible = false;
      },
      unique(arr){
        //Set数据结构，它类似于数组，其成员的值都是唯一的
        return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
      },
      selsectPage(){
        let queryObjs = Object.assign({supplierCode: this.dataForm.supplierCode},this.accessoryListQuery);
        selectSupplierAttachment(queryObjs).then(res=>{
          this.appendixTableData = res.records;
          this.accessoryTotal = res.total;
        })
      },
      insertWarehouse(){
        // this.supplierCode
        let params = this.warehouseListQuery;
        params.supplierCode = this.dataForm.supplierCode
        warehousePage(params).then(res=>{
          this.storeHouseTableData = res.records;
          this.warehouseTotal = res.total;
          this.supplierCode = res.supplierCode;

        })
      },
      getUserByNo(){
        getUserByNo(this.dataForm.supplierCode).then(res=>{
          if(res.data){
            this.userNo = res.data;
          }
        })
      },
      init() {
        this.activeName = 'first';
        if (this.id != '') {
          getObj(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.$set(this.dataForm.regionCodes,0,110000)
              this.$set(this.dataForm.regionCodes,1,110000)
              this.$set(this.dataForm.regionCodes,2,110000)
              var billPrefix = response.data.billNo.replace(/[^a-z]+/ig, "");
              this.getProcessId(billPrefix);
              this.supplierManagerArr = response.data.supplierManagerArr;
              this.linkManTableData = response.data.linkManTableData;
              if (this.linkManTableData == undefined) {
                this.linkManTableData = [];
              }
            });
        } else {
          this.supplierManagerArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.managerId = this.$store.state.user.id;
          this.dataForm.managerName = this.$store.state.user.name;
        }
      },
      getProcessId(billPrefix) {
        getProcessId({
          billPrefix: billPrefix
        }).then(response => {
          if (response != null && response != '') {
            this.processId = response;
          }
        });
      },
      handleChange() {
        this.dataForm.province = CodeToText[this.dataForm.regionCodes[0]];
        this.dataForm.city = CodeToText[this.dataForm.regionCodes[1]];
        this.dataForm.county = CodeToText[this.dataForm.regionCodes[2]];
        this.dataForm.location = CodeToText[this.dataForm.regionCodes[0]] + '/' + CodeToText[this.dataForm.regionCodes[1]] + '/' + CodeToText[this.dataForm.regionCodes[2]];
      },
      onSubmit() {
        this.dataForm.linkManTableData = this.linkManTableData;
        if (!this.checkLinkManTableData()) {
          this.$notify({
            message: '联系人信息不完整',
            type: 'warning'
          });
          this.$emit('submitWarning');
          return;
        }
        if (this.id == '') {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              addObj(this.dataForm).then(response => {
                if (response.code == '2000') {
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('submitSuccess');
                } else {
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                  this.$emit('submitWarning');
                }
              })
            } else {
              this.$emit('submitWarning');
              return false;
            }
          })
        } else {
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              putObj(this.dataForm.id, this.dataForm).then(response => {
                if (response.code == '2000') {
                  this.dialogFormVisible = false;
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                  });
                  this.$emit('submitSuccess');
                } else {
                  this.$emit('submitWarning');
                  this.$notify({
                    title: '失败',
                    message: response.msg,
                    type: 'warning',
                    duration: 2000
                  })
                }
              });
            } else {
              this.$emit('submitWarning');
              return false;
            }
          });
        }
      },
      handleManagerShow() {
        this.managerVisible = true;
      },
      handleManagerDel(index) {
        this.supplierManagerArr.splice(index, 1);
        this.$refs.supplierManagerDialog.reset();
      },
      handleManagerConfirm() {
        this.$refs.supplierManagerDialog.onSubmit();
      },
      closeUserDialog(list) {
        this.supplierManagerArr = list;
        this.managerVisible = false
        if (list.length > 0) {
          this.dataForm.crtUserName = list[0].name;
          this.dataForm.crtUserNo = list[0].no;
        }
      },
      handleValueCurrentChange(val) {
        this.currentRow = val;
      },
      // checkbox 当change触发的事件
      handleLinkManChange(index, r) {
        for(let i in this.linkManTableData){
          if(r.linkIsMain){
            this.linkManTableData[i].linkIsMain = false
            if(parseInt(index)===parseInt(i)){
              this.linkManTableData[i].linkIsMain = true
            }
          }
        }

        if (r.linkMan == '' && r.linkPhone == '') {
          return;
        }
        if (r.linkMan == '') {
          this.$notify({
            message: '联系人姓名不能为空',
            type: 'warning'
          });
          r.linkIsMain = false;
          return;
        }
        if (r.linkPhone == '') {
          this.$notify({
            message: '联系人电话不能为空',
            type: 'warning'
          });
          r.linkIsMain = false;
          return;
        }

        if (this.linkManTableData.length > 1 && r.linkIsMain == true) { // 设置其它联系人为非主要联系人
          const newlinkManTableData = [];
          let linkIsMain = false;
          this.linkManTableData.forEach(row => {
            if (row.linkMan === r.linkMan && row.linkPhone === r.linkPhone && r.linkIsMain == true) {
              linkIsMain = true;
            } else {
              linkIsMain = false
            }
            const d = {
              linkMan: row.linkMan,
              linkPosition: row.linkPosition,
              linkPhone: row.linkPhone,
              linkEmail: row.linkEmail,
              linkIsMain: linkIsMain
            };
            newlinkManTableData.push(d);
          });
          this.linkManTableData = newlinkManTableData;
        }
      },
      checkLinkManTableData() {
        let flag = true;
        if (this.linkManTableData != undefined && this.linkManTableData.length > 0) {
          this.linkManTableData.forEach(row => {
            if (row.linkMan == '' && row.linkPhone == '') {
              flag = false;
            } else if (row.linkMan == '' || row.linkPhone == '') {
              flag = false;
            }
          });
          if (flag == false) {
            this.activeName = 'second';
          }
        }
        return flag;
      },
      linkManHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex == 2 || columnIndex == 4) {
          return 'color:red'
        }
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.data.records;
            this.total = response.data.total;
            this.listLoading = false;
          })
      },
      handleFilter() {
        this.getList();
      },
    }
  }
</script>

<style lang="scss">
  .regionCode_input{
    .el-input__inner{
      height: 28px;
    }
  }
   .viewer-container {
    z-index: 3000;
  }
  /* 可编辑表格 */

  .el-tb-edit .el-input,
  .el-tb-edit .el-input-number,
  .el-tb-edit .el-select {
    display: none;
    width: 100%;
  }

  .el-tb-edit .current-row .el-input,
  .el-tb-edit .current-row .el-input-number,
  .el-tb-edit .current-row .el-select {
    display: inherit;
  }

  .el-tb-edit .current-row .el-input + span,
  .el-tb-edit .current-row .el-input-number + span,
  .el-tb-edit .current-row .el-select + span {
    display: none;
  }
  .topTable{
    tr{
      td{
        .el-form-item__content{
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        }

      }
    }
  }
</style>
