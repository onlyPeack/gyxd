<template>
  <div class="company-members-div">

    <el-row>
      <el-col :span="8">
        <div class="grid-content bg-purple" style="margin-right: 10px;height: 89vh;margin-top: 1vh;">
          <el-card class="box-card"  style="height: 89vh;overflow: auto">
            <div slot="header" class="clearfix">
              <span>组织架构</span>
            </div>
            <div>
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree" node-key="id" :data="mainTreeData" :props="defaultProps" :default-expand-all="false" :default-expanded-keys="keys" :expand-on-click-node="false"
                       :filter-node-method="filterNode" ref="mainTree" @node-click="getTreeNodeData" highlight-current :render-content="renderContent">
              </el-tree>
            </div>
          </el-card>
        </div>
      </el-col>
        <el-col :span="15" style="height:100%;margin-top: 1vh;">
          <el-col style='margin-top:15px;'>
            <el-form :label-position="labelPosition"  label-width="80px" :model="form" ref="form" :rules="rules">
              <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" :disabled="formEdit"></el-input>
              </el-form-item>
              <el-form-item label="经度" prop="lat">
                <el-input v-model="form.lat" :disabled="formEdit"></el-input>
              </el-form-item>
              <el-form-item label="纬度" prop="lng">
                <el-input v-model="form.lng" :disabled="formEdit"></el-input>
              </el-form-item>
              <el-form-item label="父级编号" prop="parentIds">
                <el-input v-model="form.parentIds" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="父级编号" prop="parentId">
                <el-input v-model="form.parentId" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item v-if="formStatus == 'update'">
                <el-button type="primary" v-if="groupManager_btn_edit" @click="update('form')">更新</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
              <el-form-item v-if="formStatus == 'create'">
                <el-button type="primary" v-if="groupManager_btn_add" @click="create('form')">保存</el-button>
                <el-button @click="onCancel">取消</el-button>
              </el-form-item>
            </el-form>
          </el-col>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import {getTree ,addObj, delObj, putObj}  from '@/api/erp/mall/cms/area'
  export default {
    name: "areaList",
    data(){
      return{
        keys:['100000'],
        mainTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        form:{
          name:'',
          lat:'',
          lng:'',
          parentIds: '',
          parentId: '',
          id: undefined,
        },
        rules: {
          name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
          lat: [{ required: true, message: '请输入经度', trigger: 'blur' }],
          lng: [{ required: true, message: '请输入纬度', trigger: 'blur' }]
        },
        formEdit:true,
        filterText: '',
        groupManager_btn_edit:false,
        groupManager_btn_add:false,
        formStatus: '',
        labelPosition: '',


      }
    },
    created() {
      const set = this.$refs;
      this.initmainTreeData();
    },
    watch: {
      filterText(val) {
        this.$refs.mainTree.filter(val);
      }
    },
    methods:{

      onCancel(){

      },
      update(){
        putObj(this.form.id, this.form).then(res=>{
          if(res.code===2000){
            this.vueMessage('success','修改成功');
            this.formEdit = false;
            this.groupManager_btn_edit = false;
          }else{
            this.vueMessage('warning','修改失败');
          }
          this.initmainTreeData()
        })
      },
      create(formName){
        const set = this.$refs;
        set[formName].validate(valid => {
          if(valid){
            addObj(this.form).then(res => {
              if(res.code===2000){
                this.vueMessage('success','新增成功!');
                this.formEdit = false;
                this.groupManager_btn_add = false;
              }else{
                this.vueMessage('warning','新增失败!');
              }
              this.initmainTreeData()
            })
          }
        })
      },
      renderContent(h, {node, data}) {
        return (
          < span class = "office-tree-node" > < span > {node.label }< /span>
        < span >
        < el-button size = "mini" type = "text" icon = "el-icon-plus" on-click = {() => this.append(node,data) }> 添加下级 < /el-button>
        < el-button size = "mini" type = "text" icon = "el-icon-edit" on-click = {() => this.edit(node,data) }> 修改 < /el-button>
        < el-button size = "mini" type = "text" icon = "el-icon-delete" on-click = {() => this.remove(node,data) }> 删除 < /el-button>
        < /span>
        < /span>
      )
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      initmainTreeData(){
        getTree().then(data => {
          this.mainTreeData = data;
        })
      },
      getTreeNodeData(data) {
      },
      append(node,data){
        this.formEdit = false;
        this.groupManager_btn_add = true;
        this.formStatus='create';
        this.form.name = '';
        this.form.lat = '';
        this.form.lng = '';
        this.form.id = undefined;
        this.form.parentIds = data.parentIds+","+data.id;
        this.form.parentId = data.id;
        this.form.type = parseInt(data.type)+1;

      },
      edit(node,data){
        this.formEdit = false;
        this.groupManager_btn_edit = true;
        this.formStatus='update';
        this.form.name = data.name;
        this.form.lat = data.lat;
        this.form.lng = data.lng;
        this.form.parentIds = data.parentIds;
        this.form.parentId = data.parentId;
        this.form.id = data.id;
        this.form.type = parseInt(data.type);
      },
      remove(node,data){
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delObj(data.id).then(res=>{
            if(res.code===2000){
              this.vueMessage('success','删除成功!');
            }else{
              this.vueMessage('success','删除失败!');
            }
            this.initmainTreeData();
          })
        });
      }
    }
  }
</script>

<style>
  .office-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .form_item{
    display: flex;
    flex-direction: row;
    align-items: center;

    div{
      flex:1;
      margin-right:10px;
    }
  }
</style>
