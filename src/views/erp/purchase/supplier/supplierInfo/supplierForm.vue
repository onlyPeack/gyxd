<template>
  <div class="supplierForm">
    <el-form :model="dataForm" :rules="rules" ref="dataForm" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商全称" prop="supplierName">
            <el-input v-model="dataForm.supplierName" placeholder="请输入供应商全称">
              <!-- <el-button slot="append" icon="el-icon-search" @click="dialogChecksupplierNameVisible = true">查重
              </el-button> -->
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商简称" prop="abbrName">
            <el-input v-model="dataForm.abbrName" placeholder="请输入供应商简称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div @click.stop="handlePurchaserUserSelector">
            <el-form-item label="所属采购工号" prop="managerCode" >
              <el-input v-model="dataForm.managerCode" placeholder="请输入所属采购工号"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属采购" prop="managerName">
            <!--@click="handleManagerShow"-->
            <div>
              <el-input v-model="dataForm.managerName" placeholder="请输入所属采购"  :disabled="true"></el-input>
            </div>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商类型" prop="supplierType">
            <el-select v-model="dataForm.supplierType" placeholder="请选择类型">
              <!-- <el-option label="供应商" :value="0"></el-option>
              <el-option label="渠道商" :value="1"></el-option> -->
              <el-option v-for="item in supplierTypeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商等级" prop="supplierGrade">
            <el-select v-model="dataForm.supplierGrade" placeholder="请选择等级">
              <el-option v-for="item in supplierGradeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="渠道推荐人" prop="channelReferrer">
            <div>
              <el-input v-model="dataForm.channelReferrer" placeholder="请输入渠道推荐人"></el-input>
            </div>

          </el-form-item>
        </el-col>
        <el-col :span="12">
         <el-form-item label="允许发布类型" prop="publishType">
            <el-select v-model="dataForm.publishType" placeholder="请选择等级">
              <el-option v-for="item in publishTypeOption" :key="item.value" :label="item.label"
                             :value="item.value">
                  </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="id != ''">
        <el-col :span="12">
          <el-form-item label="是否为认证" prop="authenticationTypes">
            <el-switch :disabled="true"
                       v-model="dataForm.authenticationType == 'false'? false:true"
                       active-text="是"
                       inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="加入黑名单" prop="types">
            <el-switch :disabled="true"
                       v-model="dataForm.blackType == 'false'? false:true"
                       active-text="是"
                       inactive-text="否">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <!--<el-row>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="供应商负责人" prop="managerId">-->
      <!--<span @click="handleManagerShow">-->
      <!--<svg-icon icon-class="add"></svg-icon>-->
      <!--</span>-->
      <!--<el-tag v-for="tag in supplierManagerArr" :key="tag.name" closable-->
      <!--@close="handleManagerDel">-->
      <!--{{tag.name}}-->
      <!--</el-tag>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--<el-col :span="12">-->
      <!--<el-form-item label="可查看用户">-->
      <!--<span>-->
      <!--<svg-icon icon-class="add"></svg-icon>-->
      <!--</span>-->
      <!--</el-form-item>-->
      <!--</el-col>-->
      <!--</el-row>-->

      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-row>
            <el-col :span="12">
              <el-form-item label="全称" prop="supplierName">
                <el-input v-model="dataForm.supplierName" placeholder="请输入全称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="简称" prop="abbrName">
                <el-input v-model="dataForm.abbrName" placeholder="请输入简称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司网站" prop="website">
                <el-input v-model="dataForm.website" placeholder="请输入公司网站"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电商网站" prop="commerceWebsite">
                <el-input v-model="dataForm.commerceWebsite" placeholder="请输入电商网站"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司邮箱" prop="email">
                <el-input v-model="dataForm.email" placeholder="请输入公司邮箱"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="公司电话" prop="phone">
                <el-input v-model="dataForm.phone" placeholder="请输入公司电话"></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12">-->
<!--              <el-form-item label="公司地址" prop="companyAdress">-->
<!--                <el-input v-model="dataForm.companyAdress" placeholder="请输入公司地址"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="公司地址" prop="regionCode">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="dataForm.regionCodes"
                  style="width: 100%;margin-top: -6px;" class="regionCode_input"
                  @change="handleChange">
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址" prop="address">
                <el-input v-model="dataForm.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主品类/优势品牌" prop="mainBrand">
                <el-input v-model="dataForm.mainBrand" placeholder="请输入主品类/优势品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="公司简介" prop="companyProfile">
                <el-input v-model="dataForm.companyProfile" placeholder="请输入公司简介"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="备注" prop="note">
            <el-input v-model="dataForm.note" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="财务信息" name="third">
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户银行" prop="bankName">
                <el-input v-model="dataForm.bankName" placeholder="请输入开户银行"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="银行账号" prop="bankAccount">
                <el-input v-model="dataForm.bankAccount" placeholder="请输入银行账号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="纳税人识别号" prop="taxpayerNumber">
                <el-input v-model="dataForm.taxpayerNumber" placeholder="请输入纳税人识别号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="结算方式" prop="paymentsMeans">
                <el-select class="filter-item" v-model="dataForm.paymentsMeans" placeholder="请输入结算方式">
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
                    :rules="linkManRules"
                    @current-change="handleValueCurrentChange"
                    ref="linkManTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column width="65">
              <template slot-scope="scope">
                <el-button type="text" size="mini" icon="el-icon-plus" @click="addValueRow"></el-button>
                <el-button type="text" size="mini" icon="el-icon-minus"
                           @click="handleValueDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="linkMan" label='供应商联系人(*)' width="180">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkMan" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkMan}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkPosition" label="联系人职务" width="180">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkPosition" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkPosition}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkPhone" label="联系人电话(*)" width="220">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkPhone" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkPhone}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="linkEmail" label="联系人邮箱" width="220">
              <template slot-scope="scope">
                <el-input size="mini" v-model="scope.row.linkEmail" placeholder="请输入内容"></el-input>
                <span>{{scope.row.linkEmail}}</span>
              </template>
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
                <el-checkbox size="mini" v-model="scope.row.linkIsMain"
                             @change="handleLinkManChange(scope.$index, scope.row)"></el-checkbox>
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
            <el-col :span="12" :offset="2">
              <div style="margin-left: -25px;margin-bottom: 10px">
                <el-button type="primary" @click="sendUserPassword">发送</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="selectedAuthenticationType == 1">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userNo.username" placeholder="请输入用户名" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="密码" prop="passWord">
                <el-input value="******" placeholder="请输入密码" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <span style="line-height: 28px;margin-left: 20px; font-size:14px;cursor: pointer;color: rgb(64,158,255)"
                    @click="initPassword">初始化密码</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系人" prop="managerName">
                <el-input v-model="userNo.name" placeholder="请输入联系人" :disabled="!userNo.id"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="telPhone">
                <el-input v-model="userNo.telPhone" placeholder="请输入联系电话" :disabled="!userNo.id"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane v-if="id != ''" label="仓库信息" name="fifth">
          <el-button type="text" icon="el-icon-plus" @click="warehouseVisible = true">新建</el-button>
          <el-table :data="storeHouseTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="storeHouseTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="warehouseCode" label='仓库编号' width="180">
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
            <el-table-column prop="opt;" label="操作" width="180" align="center" fixed="right">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" icon="el-icon-edit" @click="updateWarehouse(scope.row.id)">编辑</el-button>
                  <el-button type="text" icon="el-icon-delete" @click="delWarehouse(scope.row.id)">删除</el-button>
                </div>
              </template>
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
        <!-- 编辑附件 -->
        <el-tab-pane v-if="id != ''" label="附件信息" name="sixth">
          <el-button type="text" icon="el-icon-plus" @click="accessoryVisible = true">新建</el-button>
          <el-table :data="appendixTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="appendixTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label='名称' min-width="180">
            </el-table-column>
            <el-table-column prop="status" label='审核状态' min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'">未审核</span>
                <span v-else>已审核</span>
              </template>
            </el-table-column>
            <el-table-column prop="accessoryType;" label="附件类型" width="120">
              <template slot-scope="scope">
                  <span v-for="item in accessoryOptions1" v-if="scope.row.accessoryType==item.value" :key="item.value">
                    {{item.label}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column prop="validity" label="有效期" width="220">
              <template slot-scope="scope">
                {{scope.row.validity}}
                <!-- 代理证书过期了提示 -->
                <span v-if="scope.row.accessoryType == 2 && new Date().getTime() > new Date(scope.row.validity).getTime()">
                  (已过期,请更新代理证书)
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="crtTime" label="更新时间" width="220">
            </el-table-column>
            <el-table-column prop="opt;" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span>
                  <el-button type="text" icon="el-icon-delete" @click="delAccessory(scope.row.id)">删除</el-button>
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
         <!-- 新增时附件信息 -->
          <el-tab-pane v-if="id == ''" label="附件信息" name="seventh">
            <el-button type="text" icon="el-icon-plus" @click="accessoryVisible = true">新建</el-button>
          <el-table :data="appendixTableData" size="mini" highlight-current-row border
                    :header-cell-style="linkManHeaderStyle"
                    class="el-tb-edit"
                    @current-change="handleValueCurrentChange"
                    ref="appendixTable">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column prop="name" label='名称' min-width="180">
            </el-table-column>
            <el-table-column prop="status" label='审核状态' min-width="180">
              <template slot-scope="scope">
                <span v-if="scope.row.status == '0'">未审核</span>
                <span v-else>已审核</span>
              </template>
            </el-table-column>
            <el-table-column prop="accessoryType;" label="附件类型" width="120">
              <template slot-scope="scope">
                  <span v-for="item in accessoryOptions" v-if="scope.row.accessoryType==item.value" :key="item.value">
                    {{item.label}}
                  </span>
              </template>
            </el-table-column>
            <el-table-column prop="brandName" label="品牌名称" width="220">
            </el-table-column>
            <el-table-column prop="validity" label="有效期" width="220">
            </el-table-column>
            <!-- <el-table-column prop="crtTime" label="更新时间" width="220">
            </el-table-column> -->
            <el-table-column prop="opt;" label="操作" width="180" align="center">
              <template slot-scope="scope">
                <div>
                  <!-- <span style="color:#1890ff;cursor:pointer" @click="showDetail(scope.row.url)">查看</span> -->
                  <el-button type="text" icon="el-icon-delete" @click="delAccessory(scope.row.id)">删除</el-button>
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
    <el-dialog :title="warehouseMap[warehouseIndex].label" :visible.sync="warehouseVisible" v-if="warehouseVisible"
               append-to-body>
      <div class="center-container">
        <el-form :model="warehouseForm" :rules="warehouseRules" ref="warehouseForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td width="50%">
                <el-form-item label="仓库编号" prop="warehouseCode" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseCode" placeholder="自动生成仓库编号"
                            :disabled="true"></el-input>
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
                <el-form-item label="仓库人员:" prop="warehouseKeeper" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseKeeper" placeholder="请输入仓库共有多少工作人员"></el-input>
                  <el-button type="info" disabled style="position:relative;top:-1px;background-color:#F5F7FA;border-color:#DDE0E6;color:black">人</el-button>
                </el-form-item>
              </td>
              <td width="50%">
                <el-form-item label="仓库占地面积" prop="warehouseFloor" class="el-form-flex">
                  <el-input type="input" v-model="warehouseForm.warehouseFloor" placeholder="请输入仓库占地面积多少(请带上单位)"></el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="accessoryMap[accessoryIndex].label" :visible.sync="accessoryVisible" v-if="accessoryVisible"
               append-to-body>
      <div class="center-container">
        <el-form :model="accessoryForm" :rules="accessoryRules" ref="accessoryForm">
          <table class="topTable" style="width: 100%;">
            <tr>
              <td>
                <el-form-item label="附件类型:" prop="accessoryType" class="el-form-flex">
                  <el-select v-model="accessoryForm.accessoryType" placeholder="请选择" style="width: 160px">
                    <el-option
                      v-for="item in accessoryOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <td v-if=" accessoryForm.accessoryType == 1 ||  accessoryForm.accessoryType == 2">
                <el-form-item label="品牌名称:" prop="brandName" class="el-form-flex">
                <div @click.stop="handleBrandSelector"
                     style="cursor: pointer;line-height: 40px;margin-right: 15px;">
                  <el-input v-model="accessoryForm.brandName"  suffix-icon="el-icon-search" style="width: 160px">
                  </el-input>
                </div>
              </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item label="有效期至" prop="validity" class="el-form-flex">
                  <el-date-picker
                    v-model="accessoryForm.validity"
                    type="date"
                    style="width: 160px"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <el-form-item label="上传附件" prop="name" class="el-form-flex">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
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
      <express-selector v-if="expressVisible" @closeExpressDialog="closeExpressDialog" :isSingle="false"
                        ref="express"></express-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelExpress">取 消</el-button>
        <el-button type="primary" @click="handleSubmitExpress">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 采购员列表弹窗-->
    <el-dialog title="请选择采购员" :visible.sync="purchaseUserVisible" append-to-body>
      <purchase-user-selector @closeUserDialog="closeBuyerDialog" :isSingle="true"
                              ref="purchaseUser"></purchase-user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelPurchaserUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitPurchaserUser">确 定</el-button>
      </span>
    </el-dialog>
     <!-- 品牌列表弹窗-->
    <el-dialog title="请选择品牌" :visible.sync="brandVisible" append-to-body>
      <brand-selector @closeCustomerDialog="closeBrandDialog" :isSingle="true"
                         ref="brandSelector"></brand-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelBrand">取 消</el-button>
        <el-button type="primary" @click="handleSubmitBrand">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <img-viewer ref="viewer"/>
  </div>
</template>

<script>
  import {addObj, getObj, page, putObj} from '@/api/erp/purchase/supplier/index';
  import {regionData, CodeToText,} from 'element-china-area-data';
  import ImgViewer from '@/components/imgViewer/imgViewer'
  import {
    addObj as warehouseAddObj,
    page as warehousePage,
    getObj as warehouseGetObj,
    delObj as warehouseDelObj
  } from '@/api/erp/srm/srmWarehouse';
  import {uploadPath} from '@/api/erp/goods/storage'
  import {selectPageByItem, getUserByNo,sendUserPassword, initPassword,updateUser} from '@/api/erp/srm/srmSupplier';
  import {
    addObj as attachmentAddObj,
    page as selectSupplierAttachment,
    delObj as attachmentDelObj
  } from '@/api/erp/srm/srmAttachment';

  export default {
    name: "supplierForm",
    props: ['id', 'collectionTermsOptions', 'paymentsMeansOptions','selectedBillStatus','selectedAuthenticationType'],
    components: {
      'purchase-user-selector': () => import('@/components/ERP/User/user'),
      'supplier-manager': () => import('@/components/ERP/User/user'),
      'warehouses-selector': () => import('../../components/warehouseSelector'),
      'brand-selector': () => import('../components/brandSelector'),
      'express-selector': () => import('@/views/erp/financial/components/expressSelector'),
      ImgViewer
    },
    data() {
      return {
        uploadPath,
        userNo: {
          mobilePhone: '',
          username: '',
          name: '',
          id:''
        },
        expressVisible: false,
        brandVisible: false,
        warehouseForm: {
          warehouseName: '',
          warehouseKeeper: '',
          warehouseFloor: '',
          warehouseCode: '',
          straightExpress: '',
          companyAdress: '',
          phone: '',
          contact: '',
        },
        imgList:[],
        accessoryForm: {
          validity: '',
          name: '',
          brandName:'',
          accessoryType: undefined
        },
        accessoryRules: {
          accessoryType: [
            {
              required: true,
              message: '请选择附件类型',
              trigger: 'blur'
            }
          ],
          // brandName: [
          //   {
          //     required: true,
          //     message: '请选择品牌名称',
          //     trigger: 'blur'
          //   }
          // ],
          validity: [
            {
              required: true,
              message: '请选择有效期',
              trigger: 'blur'
            }
          ],
          // accessoryType: [
          //   {
          //     required: true,
          //     message: '请选择附件类型',
          //     trigger: 'blur'
          //   }
          // ],
        },
        warehouseRules: {
          warehouseName: [
            {
              required: true,
              message: '请输入仓库名称',
              trigger: 'blur'
            }
          ],
          address: [
            {
              required: true,
              message: '请输入仓库地址',
              trigger: 'blur'
            }
          ],
          contact: [
            {
              required: true,
              message: '请输入联系人',
              trigger: 'blur'
            }
          ],
          phone: [
            {
              required: true,
              message: '请输入联系电话',
              trigger: 'blur'
            }
          ],
        },
        warehouseListQuery: {
          page: 1,
          limit: 10,
          supplierCode: undefined,
        },
        accessoryListQuery: {
          page: 1,
          limit: 10,
          supplierCode: undefined,
        },
        supplierGradeOption:[{
          value:'0',
          label:'一级'
        },{
          value:'1',
          label:'二级'
        },{
          value:'2',
          label:'三级'
        }],
        supplierTypeOption:[{
          value:'0',
          label:'厂家'
        },{
          value:'1',
          label:'代理商'
        },{
          value:'2',
          label:'经销商'
        }],
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
        warehouseTotal: undefined,
        accessoryTotal: undefined,
        warehouseIndex: 0,
        accessoryIndex: 0,
        warehouseMap: [
          {
            value: 0,
            label: '新建仓库信息'
          },
          {
            value: 1,
            label: '修改仓库信息'
          }
        ],
        accessoryMap: [
          {
            value: 0,
            label: '新建附件信息'
          },
          {
            value: 1,
            label: '修改附件信息'
          }
        ],
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
          // {
          //   value: 4,
          //   label: '供应商认证资料',
          // },
          {
            value: 8,
            label: '营业执照',
          },
          {
            value: 7,
            label: '其他',
          },
        ],
        accessoryOptions1: [
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
        payments:[{
          value: '1',
          label: '手工结算'
        },],
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
        typeOptions: [{
          value: '0',
          label: '一级'
        }, {
          value: '1',
          label: '二级'
        }, {
          value: '2',
          label: '三级'
        }],
        list: undefined,
        total: undefined,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          supplierName: ''
        },
        dataForm: {
          authenticationTypes: undefined,
          types: undefined,
          id: '',
          publishType:1,
          supplierCode: '',
          supplierName: '',
          abbrName: '',
          supplierCategory: '',
          commerceWebsite: '',
          managerId: this.$store.state.user.id,
          managerCode: this.$store.state.user.code,
          managerName: this.$store.state.user.name,
          cusFollowOrg: '',
          cusFollowGroup: '',
          supplierType: '',
          supplierAttribute: '',
          supplierIndustry: '',
          companyProfile: '',
          website: '',
          email: '',
          phone: '',
          companyAdress: '',
          mainBrand: '',
          fax: '',
          regionCodes: [],
          location: '',
          country: '',
          province: '',
          city: '',
          county: '',
          address: '',
          taxpayerNumber: '',
          bankName: '',
          bankAccount: '',
          paymentsMeans: '1',
          collectionTerms: '',
          creditPeriod: '',
          note: '',
          dataOrg: '',
          linkManTableData: [],
          storeHouseTableData: [],
          appendixTableData: [],
        },
        options: regionData,
        CodeToText,
        activeName: 'first',
        linkManTableData: [],
        storeHouseTableData: [],
        appendixTableData: [],
        warehousesArr: [],
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
        linkManRules: {
          linkMan: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            },
          ],
          linkPosition: [
            {
              required: true,
              message: '请输入',
              trigger: 'blur'
            }
          ]
        },
        storeHouseRules: {},
        appendixRules: {},
        expressArr: [],
        purchaseUserVisible: false,
        attachmentList: [],
        rules: {
          supplierName: [
            {
              required: true,
              message: '请输入供应商全称',
              trigger: 'blur'
            },

            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20 个字符',
              trigger: 'blur'
            }
          ],
          abbrName:[{
              required: true,
              message: '请输入供应商简称',
              trigger: 'blur'
            }],
          phone: [
            {
              required: true,
              message: '请输入公司电话',
              trigger: 'blur'
            },
          ],
          managerName:[
             {
              required: false,
              message: '所属采购',
              trigger: 'blur'
            },
          ],
          managerCode:[
             {
              required: false,
              message: '所属采购工号',
              trigger: 'blur'
            },
          ],
          supplierGrade:[
             {
              required: true,
              message: '请选择供应商等级',
              trigger: 'blur'
            },
          ],
          supplierType:[
             {
              required: true,
              message: '请选择供应商类型',
              trigger: 'blur'
            },
          ],
          managerId: [
            {
              required: true,
              message: '请选择负责人',
              trigger: 'blur'
            }
          ],
          managerId: [
            {
              required: true,
              message: '请选择负责人',
              trigger: 'blur'
            }
          ],
          bankName: [
            {
              required: true,
              message: '请输入开户银行',
              trigger: 'blur'
            }
          ],
          bankAccount: [
            {
              required: true,
              message: '请输入银行账号',
              trigger: 'blur'
            }
          ],
          taxpayerNumber: [
            {
              required: true,
              message: '请输入纳税人识别号',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    mounted() {
      this.init();
    },
    watch: {
      activeName(val) {
        if (val == 'fifth') {
          this.insertWarehouse();
        }
        if (val == 'sixth') {
          this.selsectPage();
        }
        if (val == 'fourth') {
          this.getUserByNo();
        }
      }
    },
    methods: {
      showDetail(url) {
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
      closeBrandDialog(list) {
        this.brandVisible = false
        if (list.length > 0) {
          this.accessoryForm.brandName = list[0].name
          this.$refs.accessoryForm.validateField('brandName')
        }
        this.$refs.brandSelector.reset()
      },
      handleCancelBrand() {
        this.$refs.brandSelector.reset()
        this.brandVisible = false
      },
      handleSubmitBrand() {
        this.$refs.brandSelector.onSubmit()
      },
      // 品牌选择
      handleBrandSelector() {
        // if(this.dataForm.supplierType == 1) {
        //   }
          this.brandVisible = true
      },
      closeBuyerDialog(list) {
        if (list.length > 0) {
           this.dataForm.managerName = list[0].name;
          this.dataForm.managerCode = list[0].no;
        }
        this.purchaserUserArr = list;
        this.purchaseUserVisible = false;
      },
      // 采购员选择
      handlePurchaserUserSelector() {
        this.purchaseUserVisible = true;
      },
      handleCancelPurchaserUser() {
        this.$refs.purchaseUser.reset();
        this.purchaseUserVisible = false;
      },
      handleSubmitPurchaserUser() {
        this.$refs.purchaseUser.onSubmit();
      },
      sendUserPassword(){
        if(this.selectedBillStatus != '4') {
          this.$message.warning('请先流转完单据');
          return
        }
        if(this.selectedAuthenticationType != '1') {
          this.$message.warning('请选择已认证的供应商');
          return
        }
        sendUserPassword(this.dataForm.supplierCode).then(res=>{
            this.$message.success('发送成功')
          }
        ).catch(reject => {
          this.$message.warning(reject.msg)
        })
      },
      delAccessory(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.id);
          let tempIndex = this.appendixTableData.findIndex(item => {
            return item.id == id
          })
          if(!this.id) {
            this.appendixTableData.splice(tempIndex,1)
          } else {
            attachmentDelObj(id).then(res => {
              if (res.code == 2000) {
                this.vueMessage('success', '删除成功!');
              } else {
                this.vueMessage('warning', res.msg);
              }
              this.selsectPage();
            })
          }
        });

      },
      initPassword() {
        initPassword(this.dataForm.supplierCode).then(res => {
          if (res.code == '2000') {
            this.vueMessage('success', '初始化密码成功!');
          } else {
            this.vueMessage('success', res.msg);
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
      updateWarehouse(id) {
        warehouseGetObj(id).then(res => {
          if (res.code == 2000) {
            this.warehouseForm = res.data;
            this.expressArr = res.data.straightExpress.split(',');
            this.warehouseVisible = true;
          }
        })
      },
      delWarehouse(id) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          warehouseDelObj(id).then(res => {
            if (res.code == 2000) {
              this.vueMessage('success', '删除成功!');
            } else {
              this.vueMessage('warning', res.msg);
            }
            this.insertWarehouse();
          })
        });
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
      handleRepressSelector() {
        this.expressVisible = true;
      },
      handleCancelExpress() {
        this.$refs.express.reset();
        this.expressVisible = false;
      },
      handleSubmitExpress() {
        this.$refs.express.onSubmit()
      },
      handleWarehouseDel() {
        this.warehousesArr = [];
      },
      handleExpressDel(index) {
        this.expressArr.splice(index, 1);
        this.dataForm.straightExpress = this.expressArr.join(',');
      },
      closeExpressDialog(list) {
        for (let i in list) {
          this.expressArr.push(list[i].name);
        }
        this.expressArr = this.unique(this.expressArr);
        this.warehouseForm.straightExpress = this.expressArr.join(',');
        this.expressVisible = false;
      },
      unique(arr) {
        //Set数据结构，它类似于数组，其成员的值都是唯一的
        return Array.from(new Set(arr)); // 利用Array.from将Set结构转换成数组
      },
      handleClose() {
        this.warehouseVisible = false;
        this.accessoryVisible = false;
        this.warehouseForm = {
          warehouseName: '',
          warehouseKeeper: '',
          warehouseFloor: '',
          warehouseCode: '',
          straightExpress: '',
          phone: '',
          contact: '',
          address: '',
        };
        this.expressArr = [];
        this.attachmentList = [];
        this.accessoryForm = {
          validity: '',
          name: '',
          brandName:'',
          accessoryType: undefined
        };
      },
      handleConfirm() {
        if (this.warehouseVisible) {
          if (this.warehouseForm.id != '') {
            this.warehouseForm.supplierName = this.dataForm.supplierName;
            this.warehouseForm.supplierCode = this.dataForm.supplierCode;
            warehouseAddObj(this.warehouseForm).then(res => {
              if (res.code == 2000) {
                this.vueMessage('success', '修改仓库地址成功!');
                this.warehouseForm = {
                  warehouseName: '',
                  warehouseKeeper: '',
                  warehouseFloor: '',
                  warehouseCode: '',
                  straightExpress: '',
                  phone: '',
                  contact: '',
                  address: '',
                };
              }
              this.expressArr = [];
              this.insertWarehouse();
              this.handleClose();
            })
          } else {
            warehouseAddObj(this.warehouseForm).then(res => {
              if (res.code == 2000) {
                this.vueMessage('success', '新增仓库地址成功!');
                this.warehouseForm = {
                  warehouseName: '',
                  warehouseKeeper: '',
                  warehouseFloor: '',
                  warehouseCode: '',
                  straightExpress: '',
                  phone: '',
                  contact: '',
                  address: '',
                };
                this.expressArr = [];
              } else {
                this.vueMessage('warning', res.msg);
              }

              this.insertWarehouse();
              this.handleClose();
            })
          }

        } else {
          if(this.accessoryForm.accessoryType == 1) {
              if(!this.accessoryForm.brandName) {
                this.$message.warning('请选择品牌')
              this.$emit('submitWarning');
              return
            }
          }
          // 验证附件信息
           this.$refs['accessoryForm'].validate((valid) => {
            if (valid) {
              let queryObj = {
            name: this.attachmentList[0].name,
            url: this.attachmentList[0].url,
            size: this.attachmentList[0].size,
            brandName:this.accessoryForm.brandName,
            supplierCode: this.dataForm.supplierCode,
            validity:  this.$moment(new Date(this.accessoryForm.validity)).format("YYYY-MM-DD HH:mm:ss"),
            accessoryType: this.accessoryForm.accessoryType
          };
          attachmentAddObj(queryObj).then(res => {
            if (res.code == 2000) {
              this.attachmentList = [];
              this.accessoryForm = {
                validity: '',
                name: '',
                brandName:'',
                accessoryType: undefined
              };
              this.vueMessage('success', '新增附件成功!');
              // 如果是新增附件,则将返回的信息push到appendixTableData
              if(this.id == '') {
                this.appendixTableData.push(res.data)
              }
            } else {
              this.vueMessage('warning', res.msg);
            }
            // 编辑才执行selsectPage方法获取附件信息
            if(this.id != '') {
              this.selsectPage();
            }
            this.handleClose();
          })
            }
           })
        }
      },
      selsectPage() {
        let queryObjs = Object.assign({supplierCode: this.dataForm.supplierCode}, this.accessoryListQuery);
        selectSupplierAttachment(queryObjs).then(res => {
          this.appendixTableData = res.records;
          this.accessoryTotal = res.total;
        })
      },
      insertWarehouse() {
        warehousePage(this.warehouseListQuery).then(res => {
          this.storeHouseTableData = res.records;
          this.warehouseTotal = res.total;

        })
      },
      getUserByNo() {
        getUserByNo(this.dataForm.supplierCode).then(res => {
          if(res.data) {
            this.userNo = Object.assign(res.data,{});
          }
        })
      },
      init() {
        this.activeName = 'first';
        if (this.id != '') {
          getObj(this.id)
            .then(response => {
              this.dataForm = response.data;
              this.warehouseListQuery.supplierCode = response.data.supplierCode;
              this.accessoryListQuery.supplierCode = response.data.supplierCode;
              this.supplierManagerArr = response.data.supplierManagerArr;
              this.linkManTableData = response.data.linkManTableData;
              if (this.linkManTableData == undefined) {
                this.linkManTableData = [];
                this.addValueRow();
              } else if (this.linkManTableData.length > 0) {
                this.$refs.linkManTable.setCurrentRow(this.linkManTableData[0]);
              };
              this.selsectPage()
            });
        } else {
          this.supplierManagerArr.push({"id": this.$store.state.user.id, "name": this.$store.state.user.name});
          this.dataForm.managerId = this.$store.state.user.id;
          this.dataForm.managerName = this.$store.state.user.name;
          this.addValueRow();
        }
      },
      handleChange() {
        this.dataForm.province = CodeToText[this.dataForm.regionCodes[0]];
        this.dataForm.city = CodeToText[this.dataForm.regionCodes[1]];
        this.dataForm.county = CodeToText[this.dataForm.regionCodes[2]];
        this.dataForm.location = CodeToText[this.dataForm.regionCodes[0]] + '/' + CodeToText[this.dataForm.regionCodes[1]] + '/' + CodeToText[this.dataForm.regionCodes[2]];
      },
      onSubmit() {
        // 检查基本信息
        if(!this.dataForm.supplierName || !this.dataForm.abbrName || !this.dataForm.supplierType || !this.dataForm.phone) {
          this.$notify({
            message: '基本信息不完整',
            type: 'warning'
          });
          this.activeName = 'first'
          this.$emit('submitWarning');
          return;
        }
        if(!this.dataForm.bankName || !this.dataForm.bankAccount || !this.dataForm.taxpayerNumber ) {
          this.$notify({
            message: '财务信息不完整',
            type: 'warning'
          });
          this.activeName = 'third'
          this.$emit('submitWarning');
          return;
        }
        if (!this.checkLinkManTableData()) {
          this.$notify({
            message: '联系人信息不完整',
            type: 'warning'
          });
          this.activeName = 'second'
          this.$emit('submitWarning');
          return;
        }
        console.log(this.appendixTableData);
        console.log(this.dataForm.supplierType);
        // 如果选择代理商，必须要上传代理证书和营业执照
        if(this.dataForm.supplierType == 1) {
          if(
            this.appendixTableData.findIndex(item => {
            return item.accessoryType == 1
          }) < 0 && this.appendixTableData.findIndex(item => {
            return item.accessoryType == 8
          }) < 0 || this.appendixTableData.findIndex(item => {
            return item.accessoryType == 2
          }) < 0 && this.appendixTableData.findIndex(item => {
            return item.accessoryType == 8
          }) < 0
          ) {
            this.$notify({
              message: '供货商类型为代理商时,必须要上传营业执照和代理证书，或营业执照和品牌授权证书',
              type: 'warning',
              duration:3000
            });
            this.$emit('submitWarning');
            return
          }
        }
        // 如果选择经销商和厂商，必须要上传营业执照
        if(this.dataForm.supplierType == 0 || this.dataForm.supplierType == 2) {
          if( this.appendixTableData.findIndex(item => {
            return item.accessoryType == 8
          }) < 0 ) {
            this.$notify({
              message: '供货商类型为经销商或厂商时,必须要上传营业执照',
              type: 'warning',
              duration:3000
            });
            this.$emit('submitWarning');
            return
          }
        }
        // ///////////////////////////////////////////////////////////////////////
        if (!this.id || this.id == '') {
          this.$emit('showLoading');
          this.dataForm.linkManTableData = this.linkManTableData
          this.$refs['dataForm'].validate((valid) => {
            if (valid) {
              this.dataForm.attachmentDTOS = this.appendixTableData
              addObj(this.dataForm).then(response => {
                if (response.code == '2000') {
                  this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 1000
                  });
                  if(this.activeName == 'fourth') {
                    setTimeout(() => {
                      this.handleContractAdd()
                    },2000)
                  }
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
              }).catch(reject => {
                this.$emit('submitWarning');
                  this.$notify({
                    title: '失败',
                    message: reject.msg,
                    type: 'warning',
                    duration: 2000
                  })
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
                  this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 1000
                  });
                  if(this.activeName == 'fourth') {
                    setTimeout(() => {
                      this.handleContractAdd()
                    },2000)
                  }
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
      handleContractAdd() {
         //更改联系人和联系电话
          let data={
            'name':this.userNo.name,
            'telPhone':this.userNo.telPhone,
            'id':this.userNo.id
          }
          if(this.id.length > 0) {
            updateUser(data).then(res => {
              this.$message({
                message: '提交联系人资料成功',
                type:'success'
              })
              // 提交资料
              this.handleSubmitDate()
            },error=>{
              this.$message({
                message:error.msg,
                type:'warning'
              })
              this.$emit('submitWarning');
            })
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
          this.dataForm.managerName = list[0].name;
          this.dataForm.managerCode = list[0].no;
        }
      },
      addValueRow() {
        let flag = true
        for (let i in this.linkManTableData) {
          if (this.linkManTableData[i].linkIsMain) {
            flag = false
          }
        }
        const d = {
          linkMan: '',
          linkPosition: '',
          linkPhone: '',
          linkEmail: '',
          linkIsMain: flag
        };
        this.linkManTableData.push(d);
        setTimeout(() => {
          this.$refs.linkManTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleValueCurrentChange(val) {
        this.currentRow = val;
      },
      handleValueDelete(index, r) {
        let ValueIndex = this.linkManTableData.length
        if (ValueIndex === 1) {
          return
        }
        this.linkManTableData.splice(index, 1)
      },
      // checkbox 当change触发的事件
      handleLinkManChange(index, r) {
        for (let i in this.linkManTableData) {
          if (r.linkIsMain) {
            this.linkManTableData[i].linkIsMain = false
            if (parseInt(index) === parseInt(i)) {
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
.supplierForm {
  .regionCode_input {
    .el-input__inner {
      height: 28px;
    }
  }
  .viewer-container {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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

  .topTable {
    tr {
      td {
        .el-form-item__content {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        }

      }
    }
  }
}
</style>
