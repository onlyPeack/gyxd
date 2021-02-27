<template>
  <div class="bill-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="工号"
                v-model="listQuery.staffCode"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="姓名"
                v-model="listQuery.name"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="部门"
                v-model="listQuery.departmentName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="上级"
                v-model="listQuery.leader"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="职务"
                v-model="listQuery.postName"></el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="手机号"
                v-model="listQuery.mobilePhone"></el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="danger" native-type="reset" icon="el-icon-delete" @click="resetQuery">重置
      </el-button>
    </div>
    <div style="margin-top: 1px;margin-bottom: 5px;">
      <el-button type="text" icon="el-icon-plus" @click="handleCreate">新建</el-button>
      <el-button type="text" icon="el-icon-edit" @click="handleUpdate">编辑</el-button>
      <el-button type="text" icon="el-icon-delete" @click="handleDelete">删除</el-button>
      <el-button class="filter-item" type="text" icon="el-icon-download" :loading="downloadLoading"
                 @click="handleDownload">导出模板
      </el-button>
      <el-upload class="upload" action="/api/hrm/staffRecord/import" :before-upload="beforeUpload"
                 :on-remove="handleRemove" :show-file-list="false"
                 :before-remove="beforeRemove" :limit="5" :on-exceed="handleExceed" :file-list="fileList"
                 :on-success="successClick"
                 :on-error="errorClick"
                 :headers="headers"
                 style="display:inline;">
        <el-button type="text" icon="el-icon-download">
          导入档案
        </el-button>
      </el-upload>
    </div>

    <el-table size="mini" :data="list" v-loading="listLoading" element-loading-text="正在查询中。。。" border fit
              highlight-current-row @selection-change="handleChangeFun" @row-click="handleRowClick" ref="dataTable"
              :height="clientHeight" :default-sort="{prop: 'staffCode', order: 'descending'}">
      <el-table-column align="center" type="selection" width="60"></el-table-column>
      <el-table-column align="center" label="序号" type="index"></el-table-column>
      <el-table-column align="center" label="员工工号" prop="staffCode" sortable></el-table-column>
      <el-table-column align="center" label="员工姓名" prop="name"></el-table-column>
      <el-table-column align="center" label="部门" prop="departmentName"></el-table-column>
      <el-table-column align="center" label="上级" prop="leader"></el-table-column>
      <el-table-column align="center" label="职务" width="120" prop="postName"></el-table-column>
      <el-table-column align="center" label="任职状态" prop="workStatus"></el-table-column>
      <el-table-column align="center" label="性别" prop="sex"></el-table-column>
      <el-table-column align="center" label="籍贯" prop="nativePlace"></el-table-column>
      <el-table-column align="center" label="出生日期" width="120" prop="birthday"></el-table-column>
      <el-table-column align="center" label="手机号" width="120" prop="mobilePhone"></el-table-column>
      <el-table-column align="center" label="办公电话" width="120" prop="telephone"></el-table-column>
      <el-table-column align="center" label="学历" prop="education"></el-table-column>
      <el-table-column align="center" label="毕业院校" width="120" prop="graduateSchool"></el-table-column>
      <el-table-column align="center" label="专业" width="120" prop="major"></el-table-column>

    </el-table>

    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>


    <!--选择部门-->
    <el-dialog title="选择部门" width="45%" :visible.sync="dialogDepartVisible">
      <depart-selector @closeDepartDialog="closeDepartDialog" ref="departSelector"></depart-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetDepart">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerAddDepart" type="primary" icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!--主要信息-->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="billFormDialog">
      <el-form :model="form" :rules="rules" ref="form">
        <table class="topTable">
          <tr>
            <td width="50%">
              <el-form-item label="员工工号:" prop="staffCode" class="el-form-flex">
                <el-input v-model="form.staffCode" placeholder="自动生成" :readonly="true"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="姓名:" prop="name" class="el-form-flex">
                <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="任职状态:" prop="workStatus" class="el-form-flex">
                <el-select v-model="form.workStatus" placeholder="请选择任职状态">
                  <el-option value="实习">实习</el-option>
                  <el-option value="正常">正常</el-option>
                  <el-option value="兼职">兼职</el-option>
                  <el-option value="离职中">离职中</el-option>
                  <el-option value="已离职">已离职</el-option>
                </el-select>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="性别:" prop="sex" class="el-form-flex">
                <el-select v-model="form.sex" placeholder="请选择性别">
                  <el-option value="男">男</el-option>
                  <el-option value="女">女</el-option>
                </el-select>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="职务:" prop="postName" class="el-form-flex">
                <div @click="openPostDialog=true&&dialogStatus ==='create'" style="cursor: pointer;">
                  <el-input v-model="form.postName" :readonly="dialogStatus !=='create'" placeholder="请选择职务"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="员工上级:" prop="leader" class="el-form-flex">
                <div @click="handleUserSelector" style="cursor: pointer;">
                  <el-input v-model="form.leader" placeholder="请选择上级" :readonly="dialogStatus !=='create'"></el-input>
                </div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="部门:" prop="departmentName" class="el-form-flex">
                <div @click="openDepartDialog" style="cursor: pointer;">
                  <el-input v-model="form.departmentName" placeholder="请选择部门"
                            :readonly="dialogStatus !=='create'"></el-input>
                </div>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="关联账号:" prop="linkAccount" class="el-form-flex">
                <el-input v-model="form.linkAccount"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="手机号:" prop="mobilePhone" class="el-form-flex">
                <el-input v-model="form.mobilePhone"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="办公电话:" prop="telephone" class="el-form-flex">
                <el-input v-model="form.telephone"></el-input>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <el-form-item label="QQ:" prop="qq" class="el-form-flex">
                <el-input v-model="form.qq"></el-input>
              </el-form-item>
            </td>
            <td width="50%">
              <el-form-item label="邮箱:" prop="email" class="el-form-flex">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
            </td>
          </tr>
        </table>


        <el-tabs v-model="activeName">
          <el-tab-pane label="个人信息" name="personal">

            <table class="topTable">
              <tr>
                <td width="50%">
                  <el-form-item label="民族:" prop="nation" class="el-form-flex">
                    <el-input v-model="form.nation"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="籍贯:" prop="nativePlace" class="el-form-flex">
                    <el-input v-model="form.nativePlace"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="详细户籍地:" prop="domicile" class="el-form-flex">
                    <el-input v-model="form.domicile"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="学历:" prop="education" class="el-form-flex">
                    <el-input v-model="form.education"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <el-form-item label="本人现住地:" prop="presentPlace" class="el-form-flex">
                    <el-input v-model="form.presentPlace"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="出生日期:" prop="birthday" class="el-form-flex">
                    <el-date-picker v-model="form.birthday" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="身份证号码:" prop="idNumber" class="el-form-flex">
                    <el-input v-model="form.idNumber"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="毕业院校:" prop="graduateSchool" class="el-form-flex">
                    <el-input v-model="form.graduateSchool"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="专业:" prop="major" class="el-form-flex">
                    <el-input v-model="form.major"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="婚姻状况:" prop="marriage" class="el-form-flex">
                    <el-select v-model="form.marriage" placeholder="请选择婚姻状况">
                      <el-option value="未婚">未婚</el-option>
                      <el-option value="已婚">已婚</el-option>
                      <el-option value="其他">其他</el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="择政治面貌:" prop="politicsStatus" class="el-form-flex">
                    <el-select v-model="form.politicsStatus" placeholder="请选择政治面貌">
                      <el-option value="群众">群众</el-option>
                      <el-option value="团员">团员</el-option>
                      <el-option value="党员">党员</el-option>
                      <el-option value="其他">其他</el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="英语等级:" prop="englishLevel" class="el-form-flex">
                    <el-select v-model="form.englishLevel" placeholder="请选择英语等级">
                      <el-option value="其他">其他</el-option>
                      <el-option value="四级">四级</el-option>
                      <el-option value="六级">六级</el-option>
                      <el-option value="八级及以上">八级及以上</el-option>
                    </el-select>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="是否服过兵役:" prop="militaryService" class="el-form-flex">
                    <el-select v-model="form.militaryService" placeholder="请选择是否服过兵役">
                      <el-option value="是">是</el-option>
                      <el-option value="否">否</el-option>
                    </el-select>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="紧急联系人:" prop="emergencyContact" class="el-form-flex">
                    <el-input v-model="form.emergencyContact"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="联系人手机:" prop="emergencyContactPhone" class="el-form-flex">
                    <el-input v-model="form.emergencyContactPhone"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-tab-pane>

          <el-tab-pane label="公司信息" name="company">
            <table class="topTable">
              <tr>
                <td width="50%">
                  <el-form-item label="入司时间:" prop="joinDate" class="el-form-flex">
                    <el-date-picker v-model="form.joinDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="转正日期:" prop="fullDate" class="el-form-flex">
                    <el-date-picker v-model="form.fullDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="参加工作时间:" prop="workDate" class="el-form-flex">
                    <el-date-picker v-model="form.workDate" type="date" placeholder="请选择时间" value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="工作年限:" prop="workAge" class="el-form-flex">
                    <el-input v-model="form.workAge"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="本单位工龄:" prop="companyWorkAge" class="el-form-flex">
                    <el-input v-model="form.companyWorkAge"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="社保账号:" prop="socialSecurityAccount" class="el-form-flex">
                    <el-input v-model="form.socialSecurityAccount"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <td width="50%">
                  <el-form-item label="医保账号:" prop="medicalInsuranceAccount" class="el-form-flex">
                    <el-input v-model="form.medicalInsuranceAccount"></el-input>
                  </el-form-item>
                </td>
                <td width="50%">
                  <el-form-item label="公积金账号:" prop="accumulationFundAccount" class="el-form-flex">
                    <el-input v-model="form.accumulationFundAccount"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
          </el-tab-pane>

          <el-tab-pane label="家庭信息" name="family">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addFamilyRow">新增</el-button>
              <el-table :data="familyTableData" size="mini" highlight-current-row border
                        style="width: 100%;margin-top: 5px;"
                        :header-cell-style="familyHeaderStyle"
                        class="el-tb-edit"
                        @current-change="handleFamilyCurrentChange"
                        ref="familyTable">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column prop="name" label="*姓名">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="relation" label="关系">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.relation"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="age" label="年龄">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.age"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="mobilePhone" label="*联系方式">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.mobilePhone"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="company" label="单位">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.company"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="post" label="职务">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.post"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleFamilyDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

          <el-tab-pane label="教育经历" name="education">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addEducationRow">新增</el-button>
              <el-table :data="educationTableData" size="mini" highlight-current-row border
                        style="width: 100%;margin-top: 5px;"
                        :header-cell-style="educationHeaderStyle"
                        class="el-tb-edit"
                        @current-change="handleEducationCurrentChange"
                        ref="educationTable">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column prop="schoolName" label="*学校名称">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.schoolName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="major" label="专业">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.major"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="beginDate" label="开始时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.beginDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" label="结束时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.endDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="gainHonor" label="所获荣誉" width="200">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.gainHonor"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleEducationDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

          <el-tab-pane label="培训经历" name="train">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addTrainRow">新增</el-button>
              <el-table :data="trainTableData" size="mini" highlight-current-row border
                        style="width: 100%;margin-top: 5px;"
                        :header-cell-style="trainHeaderStyle"
                        class="el-tb-edit"
                        @current-change="handleTrainCurrentChange"
                        ref="trainTable">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column prop="organizationName" label="*组织名称">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.organizationName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="trainContent" label="培训内容">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.trainContent"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="beginDate" label="开始时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.beginDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" label="结束时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.endDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="gainHonor" label="所获荣誉" width="200">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.gainHonor"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleTrainDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>

          <el-tab-pane label="工作经历" name="work">
            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addWorkRow">新增</el-button>
            <el-table :data="workTableData" size="mini" highlight-current-row border
                      style="width: 100%;margin-top: 5px;"
                      :header-cell-style="workHeaderStyle"
                      class="el-tb-edit"
                      @current-change="handleWorkCurrentChange"
                      ref="workTable">
              <el-table-column type="index" width="50" align="center">
              </el-table-column>
              <el-table-column prop="companyName" label="*公司名称">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.companyName"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="post" label="职务">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.post"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="beginDate" label="开始时间" width="150">
                <template slot-scope="scope">
                  <el-date-picker size="mini" v-model="scope.row.beginDate" type="date"
                                  style="width: 100%;" placeholder="请选择"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="endDate" label="结束时间" width="150">
                <template slot-scope="scope">
                  <el-date-picker size="mini" v-model="scope.row.endDate" type="date"
                                  style="width: 100%;" placeholder="请选择"></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column prop="gainHonor" label="所获荣誉" width="200">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.gainHonor"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template slot-scope="scope">
                  <el-button size="mini" type="danger" @click="handleWorkDelete(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="任职经历" name="tenure">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-plus" @click="addTenureRow">新增</el-button>
              <el-table :data="tenureTableData" size="mini" highlight-current-row border
                        style="width: 100%;margin-top: 5px;"
                        :header-cell-style="tenureHeaderStyle"
                        class="el-tb-edit"
                        @current-change="handleTenureCurrentChange"
                        ref="tenureTable">
                <el-table-column type="index" width="50" align="center">
                </el-table-column>
                <el-table-column prop="companyName" label="*公司名称">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.companyName"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="post" label="职务">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.post"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="department" label="部门">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.department"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="beginDate" label="开始时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.beginDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" label="结束时间" width="150">
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.endDate" type="date"
                                    style="width: 100%;" placeholder="请选择"></el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button size="mini" type="danger" @click="handleTenureDelete(scope.$index, scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-tab-pane>


        </el-tabs>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="create('form')" :loading="isLoading">确 定
        </el-button>
        <el-button v-else type="primary" @click="update('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!--选择职务-->
    <el-dialog title="选择职务" width="45%" :visible.sync="openPostDialog">
      <post-selector @closePostDialog="closePostDialog" @handlerResetPost="handlerResetPost"
                     ref="postSelector"></post-selector>
      <span slot="footer" class="dialog-footer">
        <el-button class="filter-item" style="margin-left: 10px;float:left;" @click="handlerResetPost">重选</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" @click="handlerPost" type="primary"
                   icon="edit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 员工选择-->
    <el-dialog title="请选择员工" :visible.sync="userVisible" append-to-body>
      <user-selector @closeUserDialog="closeUserDialog" :isSingle="true" ref="user"></user-selector>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelUser">取 消</el-button>
        <el-button type="primary" @click="handleSubmitUser">确 定</el-button>
      </span>
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
  } from '@/api/erp/hrm/staffRecord';
  import {getToken} from '@/utils/auth'

  export default {
    name: 'staffRecord',
    components: {
      'depart-selector': () => import('@/components/ERP/Depart/depart'),
      'user-selector': () => import('@/components/ERP/User/user'),
      'post-selector': () => import('@/components/ERP/Newposition/newposition'),
    },
    data() {
      return {
        clientHeight: 300,
        isLoading: false,
        headers: null,
        form: {
          isXin: false,
          name: undefined,
          postName: undefined,
          sex: undefined,
          nativePlace: undefined,
          nation: undefined,
          birthday: undefined,
          idNumber: undefined,
          departmentId: undefined,
          departmentName: undefined,
          leader: undefined,
          mobilePhone: undefined,
          marriage: undefined,
          politicsStatus: undefined,
          education: undefined,
          graduateSchool: undefined,
          major: undefined,
          englishLevel: undefined,
          workDate: undefined,
          workAge: undefined,
          militaryService: undefined,
          telephone: undefined,
          email: undefined,
          qq: undefined,
          domicile: undefined,
          presentPlace: undefined,
          staffCategory: undefined,
          workStatus: undefined,
          joinDate: undefined,
          fullDate: undefined,
          companyWorkAge: undefined,
          socialSecurityAccount: undefined,
          medicalInsuranceAccount: undefined,
          accumulationFundAccount: undefined,
          linkAccount: undefined,
          emergencyContact: undefined,
          emergencyContactPhone: undefined,
          familyList: undefined,
          educationList: undefined,
          trainList: undefined,
          workList: undefined,
          tenureList: undefined
        },
        fileList: undefined,
        familyTableData: [],
        educationTableData: [],
        trainTableData: [],
        workTableData: [],
        tenureTableData: [],
        currentRow: null,
        rules: {
          name: [{required: true, message: '请输入姓名'}],
          departmentName: [{
            required: true, message: '请选择部门', trigger: 'blur', validator: (rule, value, callback,) => {
              this.validateForms(rule, value, callback, this.form.departmentName)
            }
          }],
          mobilePhone: [{required: true, message: '请输入手机号'}],
          telephone: [{required: true, message: '请输入办公电话'}],
          postName: [{
            required: true, message: '请输入职务', trigger: 'blur', validator: (rule, value, callback) => {
              this.validateFormss(rule, value, callback, this.form.postName)
            }
          }],
          leader: [{
            required: true, message: '请输入上级', trigger: 'blur', validator: (rule, value, callback) => {
              this.validateForm(rule, value, callback, this.form.leader)
            }
          }],
          nation: [{required: true, message: '请输入民族'}],
          sex: [{required: true, message: '请选择性别'}],
          nativePlace: [{required: true, message: '请输入籍贯'}],
          workStatus: [{required: true, message: '请输入任职状态'}],
          birthday: [{required: true, message: '请输入出生日期'}],
          idNumber: [{required: true, message: '请输入身份证号码'}],
          emergencyContact: [{required: true, message: '请输入紧急联系人'}],
          emergencyContactPhone: [{required: true, message: '请输入紧急联系人手机'}],
          email: [{required: true, message: '请输入邮箱'}],
        },
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20,
          staffCode: undefined,
          name: undefined,
          departmentName: undefined,
          postName: undefined,
          mobilePhone: undefined,
          leader: undefined,
        },
        dialogFormVisible: false,
        dialogDepartVisible: false,
        openPostDialog: false,
        userVisible: false,
        downloadLoading: false,
        dialogStatus: '',
        activeName: 'personal',
        selectedRows: [],
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tableKey: 0
      }
    },
    created() {
      this.headers = {
        Authorization: getToken()
      };
      this.getList();
      const _this = this;
      window.onresize = function () {
        _this.changeDivHeight();
      };
    },
    updated() {
      this.changeDivHeight();
    },
    methods: {
      changeDivHeight() {
        if (document.getElementsByClassName('filter-container')[0]) {
          var height = document.getElementsByClassName('filter-container')[0].clientHeight;
        } else {
          height = 39;
        }
        this.clientHeight = (document.body.clientHeight - (190 + height)) * 1;
      },
      successClick(response) {
        if (response.code == "2000") {
          this.vueMessage('success', response.msg);
          this.getList();
        } else {
          this.vueMessage('warning', response.msg);
        }
      },
      errorClick(err) {
        this.vueMessage('warning', '请联系系统管理员');
      },
      getList() {
        this.listLoading = true;
        page(this.listQuery)
          .then(response => {
            this.list = response.records;
            this.total = response.total;
            this.listLoading = false;
          })
      },
      validateForms(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入部门"))
        } else {
          callback();
        }
      },
      validateFormss(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入职务"))
        } else {
          callback();
        }
      },
      validateForm(rule, val, callback, value) {
        if (value == undefined || value == '') {
          callback(new Error("请输入员工上级"))
        } else {
          callback();
        }
      },
      handleFilter() {
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleCreate() {
        this.resetTemp();
        this.dialogStatus = 'create';
        this.dialogFormVisible = true;
        this.familyTableData = [];
        this.educationTableData = [];
        this.trainTableData = [];
        this.workTableData = [];
        this.tenureTableData = [];
        this.activeName = 'personal';
      },
      handleChangeFun(val) {
        this.selectedRows = val;
      },
      handleRowClick(row, event, column) {
        this.$refs.dataTable.toggleRowSelection(row);
      },
      handleUpdate() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请选择要编辑的条目',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        getObj(this.selectedRows[0].id)
          .then(response => {
            this.form = response.data;
            this.familyTableData = response.data.familyList;
            this.educationTableData = response.data.educationList !== undefined ? response.data.educationList : [];
            this.trainTableData = response.data.trainList !== undefined ? response.data.trainList : [];
            this.workTableData = response.data.workList !== undefined ? response.data.workList : [];
            this.tenureTableData = response.data.tenureList !== undefined ? response.data.tenureList : [];
            this.dialogFormVisible = true;
            this.dialogStatus = 'update';
          });
      },
      handleDelete() {
        if (this.selectedRows.length < 1) {
          this.$notify({
            title: '提示',
            message: '请至少选择一条数据',
            type: 'success',
            duration: 2000
          });
          return false;
        } else if (this.selectedRows.length > 1) {
          this.$notify({
            title: '提示',
            message: '只能编辑一个条目',
            type: 'error',
            duration: 2000
          });
          return false;
        }
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            delObj(this.selectedRows[0].id)
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
        this.form.familyList = this.familyTableData;
        this.form.educationList = this.educationTableData;
        this.form.trainList = this.trainTableData;
        this.form.workList = this.workTableData;
        this.form.tenureList = this.tenureTableData;
        const set = this.$refs;
        this.isLoading = true;
        set[formName].validate(valid => {
          if (valid) {
            addObj(this.form)
              .then(() => {
                this.isLoading = false;
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
            this.isLoading = false;
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
        this.form.familyList = this.familyTableData;
        this.form.educationList = this.educationTableData;
        this.form.trainList = this.trainTableData;
        this.form.workList = this.workTableData;
        this.form.tenureList = this.tenureTableData;
        const set = this.$refs;
        set[formName].validate(valid => {
          if (valid) {
            this.dialogFormVisible = false;
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
        this.form = {};
      },
      //重置查询条件
      resetQuery() {
        this.listQuery.staffCode = undefined;
        this.listQuery.name = undefined;
        this.listQuery.departmentName = undefined;
        this.listQuery.postName = undefined;
        this.listQuery.leader = undefined;
        this.listQuery.mobilePhone = undefined;
      },
      //文件上传
      handleRemove(file, fileList) {
      },
      beforeUpload(file) {
        const isXLS = file.name.lastIndexOf(".xls") > 0 || file.name.lastIndexOf(".XLS") > 0;
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isXLS) {
          this.$message.error('只能上传xls/xlsx表格!');
        }
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isXLS && isLt10M;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      //tab页相关
      addFamilyRow() {
        const d = {
          name: '',
          relation: '',
          age: '',
          mobilePhone: '',
          company: '',
          post: ''
        };
        this.familyTableData.push(d);
        setTimeout(() => {
          this.$refs.familyTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleFamilyCurrentChange(val) {
        this.currentRow = val;
      },
      handleFamilyDelete(index, r) {
        this.familyTableData.splice(index, 1)
      },
      familyHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1 || columnIndex === 4) {
          return 'color:red'
        }
      },

      addEducationRow() {
        const d = {
          schoolName: '',
          major: '',
          beginDate: '',
          endDate: '',
          gainHonor: ''
        };
        this.educationTableData.push(d);
        setTimeout(() => {
          this.$refs.educationTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleEducationCurrentChange(val) {
        this.currentRow = val;
      },
      handleEducationDelete(index, r) {
        this.educationTableData.splice(index, 1)
      },
      educationHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          return 'color:red'
        }
      },

      addTrainRow() {
        const d = {
          organizationName: '',
          trainContent: '',
          beginDate: '',
          endDate: '',
          gainHonor: ''
        };
        this.trainTableData.push(d);
        setTimeout(() => {
          this.$refs.trainTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleTrainCurrentChange(val) {
        this.currentRow = val;
      },
      handleTrainDelete(index, r) {
        this.trainTableData.splice(index, 1)
      },
      trainHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          return 'color:red'
        }
      },

      addWorkRow() {
        const d = {
          companyName: '',
          post: '',
          beginDate: '',
          endDate: '',
          gainHonor: ''
        };
        this.workTableData.push(d);
        setTimeout(() => {
          this.$refs.workTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleWorkCurrentChange(val) {
        this.currentRow = val;
      },
      handleWorkDelete(index, r) {
        this.workTableData.splice(index, 1)
      },
      workHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          return 'color:red'
        }
      },
      addTenureRow() {
        const d = {
          companyName: '',
          post: '',
          department: '',
          beginDate: '',
          endDate: ''
        };
        this.tenureTableData.push(d);
        setTimeout(() => {
          this.$refs.tenureTable.setCurrentRow(d);
        }, 10);// <==用于延时渲染后选中这行
      },
      handleTenureCurrentChange(val) {
        this.currentRow = val;
      },
      handleTenureDelete(index, r) {
        this.tenureTableData.splice(index, 1)
      },
      tenureHeaderStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 1) {
          return 'color:red'
        }
      },

      //部门选择
      handlerAddDepart() {
        this.$refs.departSelector.onSubmit()
      },
      handlerResetDepart() {
        this.$refs.departSelector.reset()
      },
      openDepartDialog() {
        if (this.dialogStatus === 'create') {
          this.dialogDepartVisible = true
        }
      },
      closeDepartDialog(depart) {
        if (depart.id) {
          this.form.departmentId = depart.id;
          this.form.departmentName = depart.label;
          this.$refs['form'].validateField('departmentName');
        } else {
          this.form.departmentId = undefined;
          this.form.departmentName = undefined;
          this.$refs['form'].validateField('departmentName')
        }
        this.dialogDepartVisible = false
      },

      //角色选择
      handlerPost() {
        this.$refs.postSelector.onSubmit()
      },
      handlerResetPost() {
        this.$refs.postSelector.reset()
      },
      closePostDialog(post) {
        if (post.id) {
          this.form.postName = post.label
        } else {
          this.form.postName = undefined;
        }
        this.$refs['form'].validateField('postName')
        this.openPostDialog = false;
      },
      // 用户选择
      handleUserSelector() {
        if (this.dialogStatus === 'create') {
          this.userVisible = true;
        }
      },
      handleCancelUser() {
        this.$refs.user.reset();
        this.userVisible = false;
      },
      handleSubmitUser() {
        this.$refs.user.onSubmit();
      },
      handleUserDel() {
        this.form.leader = undefined;
        this.$refs.user.reset();
      },
      closeUserDialog(list) {
        this.userVisible = false;
        if (list.length > 0) {
          this.form.leader = list[0].no;
          this.$refs['form'].validateField('leader')
        } else {
          this.form.leader = undefined;
          this.$refs['form'].validateField('leader')
        }
      },
      handleDownload() {
        this.downloadLoading = true;
        var newList = [
          this.list[0]
        ];
        this.list = this.list == undefined || this.list == null ? [] : this.list;
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['员工工号(不填自动生成)', '员工姓名', '员工上级', '性别', '籍贯', '民族', '身份证号码', '职务', '部门',
            '任职状态', '手机号', '婚姻状况', '政治面貌', '学历', '毕业院校', '专业', '英语等级', '是否服过兵役',
            '办公电话', '邮箱', 'QQ', '户籍所在地', '现住地', '员工类别', '开户银行', '银行账号'];
          const filterVal = ['staffCode', 'name', 'leader', 'sex', 'nativePlace', 'nation', 'idNumber', 'postName', 'departmentName',
            'workStatus', 'mobilePhone', 'marriage', 'politicsStatus', 'education', 'graduateSchool', 'major', 'englishLevel', 'militaryService',
            'telephone', 'email', 'qq', 'domicile', 'presentPlace', 'staffCategory', 'bankName', 'bankAccount'];
          excel.export_json_to_excel2(tHeader, this.list.length > 0 ? newList : this.list, filterVal, '员工档案模板');
          this.downloadLoading = false;
        })
      },

    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  .staff-record-container {
    .ms-dialog {
      .el-dialog {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        height: 100vh;
      }

      .el-dialog__footer {
        position: absolute;
        bottom: 0px;
        width: 100%;
        text-align: right;
      }
    }
  }
</style>
