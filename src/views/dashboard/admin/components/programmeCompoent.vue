<template>
  <div :class="isProgramme?'dialog isDialog':'dialog'">
    <div class="dialog_bg"></div>
    <div class="dialog_programme">
      <div class="programme">
        <span>新建日程</span>
        <a @click="programmeClose">×</a>
      </div>
      <div class="programme_div">
        <el-form :model="dataForm" ref="dataForm" label-width="100px">
          <el-form-item label="开始时间:" prop="groupName">
            <el-date-picker
              v-model="dataForm.startDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:">
            <el-date-picker
              v-model="dataForm.endDate"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="日程描述:">
            <el-input type="textarea"></el-input>
          </el-form-item>
          </el-form>
      </div>
      <div class="programme_btn">
        <el-button type="info" @click="programmeClose">取 消</el-button>
        <el-button type="primary" @click="programmeSubmint">确 认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "programmeCompoent",
      props: ['isProgramme'],
      data(){
        return{
          startDate:undefined,
          endDate:undefined,
          dataForm:{
            startDate:'',
            endDate:'',
          },
          rules:[],
        }
      },
      methods:{
        programmeClose(){
          this.$emit('programmeClose');
        },
        programmeSubmint(){
          this.$emit('programmeSubmint');
        }
      }

    }
</script>

<style lang="scss" scoped>
  .isDialog{
    visibility: visible !important;
  }

  .isDialog .dialog_programme {
    transform: scale(1) !important;
  }

  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1200;
    visibility: hidden;
    .dialog_bg {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      background-color: #000;
      opacity: 0.3;
      z-index: 1200;
    }

    .dialog_programme {
      position: absolute;
      background: #ffffff;
      z-index: 1200;
      width: 500px;
      height: 300px;
      top: 240px;
      left: calc(50% - 250px);
      display: flex;
      flex-direction: column;
      box-shadow: 1px 1px 50px rgba(0, 0, 0, .3);
      transform: scale(0);
      transition: all .3s;
      border-radius: 6px;
      .programme {
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        height: 50px;
        background-color: #EEEEEE;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        font-size: 14px;
        color: #333333;
        position: relative;

        a {
          font-size: 20px;
        }
        span:first-child {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }

  }
</style>
<style lang="scss">
  .programme_div{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 24px 0px 12px 0px;
  }
  .programme_btn{
    padding:14px 18px;
    border-top:1px solid #EEEEEE;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
