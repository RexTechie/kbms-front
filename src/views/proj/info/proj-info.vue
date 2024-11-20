<template>
  <div>
    <el-card>
      <el-row>
        <el-col class="title" :span="6"><span>项目名称</span></el-col>
        <el-col class="content" :span="12"><span style="font-weight: 700;">{{ dataForm.title}}</span></el-col>
        <el-col class="operation" :span="6">
          <el-button size="small" @click="dialogVisible.title = true; editData.title = dataForm.title">编辑</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>项目ID</span></el-col>
        <el-col class="content" :span="12"><span>{{ dataForm.id}}</span></el-col>
        </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>项目图标</span></el-col>
        <el-col class="content" :span="12" >
          <div class="img" style="width: 40px;">
            <img :src="baseUrl+dataForm.img"
              style="border-radius: 10%;width: 100%;" 
              alt="" />
          </div>
        </el-col>
        <el-col class="operation" :span="6">
          <el-popover placement="left" :width="200" trigger="click">
            <template #reference>
              <el-button size="small">编辑</el-button>
            </template>
            <el-row :gutter="10">
              <el-col :span="6" style="margin-bottom: 10px;"
                v-for="imgUrl in imgList" v-bind:key="imgUrl">
                <div class="img" style="width: 40px;">
                  <img :src="baseUrl+imgUrl"
                    style="border-radius: 10%; width: 100%;" 
                    alt="" 
                    @click="editImgHandler(imgUrl)"
                  />
                </div>
              </el-col>
            </el-row>
          </el-popover>
          
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>简介</span></el-col>
        <el-col class="content" :span="12"><span>{{ dataForm.description}}</span></el-col>
        <el-col class="operation" :span="6">
          <el-button size="small" @click="dialogVisible.description = true; editData.description = dataForm.description;">编辑</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>项目状态</span></el-col>
        <el-col class="content" :span="12">
            <el-tag v-if="dataForm.status === 1" type="danger" effect="plain" size="small" round>未开始</el-tag>
            <el-tag v-if="dataForm.status === 2" type="primary" effect="plain" size="small" round>进行中</el-tag>
            <el-tag v-if="dataForm.status === 3" type="warning" effect="plain" size="small" round>已暂停</el-tag>
            <el-tag v-if="dataForm.status === 4" type="success" effect="plain" size="small" round>已完成</el-tag>
            <el-tag v-if="dataForm.status === 5" type="info" effect="plain" size="small" round>已取消</el-tag>
        </el-col>
        <el-col class="operation" :span="6">
          <el-button size="small" @click="dialogVisible.status = true; editData.status = dataForm.status;">编辑</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>项目所有者</span></el-col>
        <el-col class="content" :span="12"><span>{{ dataForm.owner}}</span></el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>创建时间</span></el-col>
        <el-col class="content" :span="12"><span>{{ dataForm.createTime}}</span></el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>更新时间</span></el-col>
        <el-col class="content" :span="12"><span>{{ dataForm.updateTime}}</span></el-col>
      </el-row>
      <el-row>
        <el-col class="title" :span="6"><span>删除项目</span></el-col>
        <el-col class="content" :span="12"><span>务必谨慎，删除后项目不可以找回</span></el-col>
        <el-col class="operation" :span="6">
          <el-button size="small" type="danger" @click="handleRemove(dataForm.id)">删除</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!--项目名称编辑-->
    <el-dialog 
      v-model="dialogVisible.title" 
      title="修改项目名称"
      width="30%"
      show-close
    >
      <el-input v-model="editData.title"></el-input>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible.title = false">取消</el-button>
        <el-button type="primary" @click="editTitleHandler">
          保存
        </el-button>
      </div>
    </template>
    </el-dialog>
    <!--简介编辑-->
    <el-dialog 
      v-model="dialogVisible.description" 
      title="修改简介"
      show-close
    >
      <el-input 
        type="textarea"
        v-model="editData.description"
      ></el-input>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible.description = false">取消</el-button>
        <el-button type="primary" @click="editDescriptionHandler">
          保存
        </el-button>
      </div>
    </template>
    </el-dialog>
    <!--项目状态-->
    <el-dialog 
      v-model="dialogVisible.status" 
      title="修改项目状态"
      width="30%"
      show-close
    >
      <el-select
        v-model="editData.status"
        placeholder="状态"
        size="large"
        style="width: 240px"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible.status = false">取消</el-button>
        <el-button type="primary" @click="editStatusHandler">
          保存
        </el-button>
      </div>
    </template>
    </el-dialog>
  </div>
</template>
<script>
import requestConfig from '../../../config/requestConfig';
export default{
  data(){
    return{
      baseUrl: requestConfig.baseUrl,
      editData: {
        title: "",
        description: "",
        status: null,
      },
      statusList: [{
        value: 1,
        label: "未开始"
      },{
        value: 2,
        label: "进行中"
      },{
        value: 3,
        label: "已暂停"
      },{
        value: 4,
        label: "已完成"
      },{
        value: 5,
        label: "已取消"
      }],
      dialogVisible: {
        title: false,
        img: false,
        description: false,
        status: false
      },
      imgList: [
        "/static/img/proj/1.jpg",
        "/static/img/proj/2.jpg",
        "/static/img/proj/3.jpg",
        "/static/img/proj/4.jpg",
        "/static/img/proj/5.jpg",
        "/static/img/proj/6.jpg",
        "/static/img/proj/7.jpg",
        "/static/img/proj/8.jpg",
        "/static/img/proj/9.jpg",
        "/static/img/proj/10.jpg",
        "/static/img/proj/11.jpg",
        "/static/img/proj/12.jpg",
        "/static/img/proj/13.jpg",
        "/static/img/proj/14.jpg",
        "/static/img/proj/15.jpg",
        "/static/img/proj/16.jpg",
        "/static/img/proj/17.jpg",
        "/static/img/proj/18.jpg",
        "/static/img/proj/19.jpg",
        "/static/img/proj/20.jpg",
      ],
      dataForm: {
        id: 1,        
        title: "课程评估系统",
        description: "这是一个课程评估系统...",
        tag: "业务管理软件",
        img: "/static/img/proj/1.jpg",
        status: 1,
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      }
    }
  },
  methods:{
    /**
     * 加载项目信息
     */
    loadDataForm(){
      let that = this;
      that.$http(`/proj/${that.dataForm.id}`, 
        "GET", null, false,(resp) => {
          if (resp.code === 200) {
            that.dataForm = resp.data
            that.editData.title = that.dataForm.title;
            that.editData.description = that.dataForm.description;
            that.editData.status = that.dataForm.status;
            console.log(that.dataForm)
          } else {
            that.$message({
              message: "文章不存在",
              type: "error",
              duration: 1200,
            });
          }
        }
      )
    },
    dataFormSubmit(data){
      let that = this;
      that.$http("/proj", "PUT",
        data, true, (resp) => {
          if (resp.code === 200) {
            that.$message({message: "已保存", type: "success", duration: 1200});
            that.loadDataForm();
          } else {
            that.$message({message: resp.msg, type: "error", duration: 1200});
          }
        }
      );
    },
    /**
     * 删除项目
     * @param {String} id 项目id
     */
    handleRemove(id){
      let that = this;
      that.$confirm(`确定要删除该文件？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that.$http(`/proj/${id}`, "DELETE",
            null, true, function (resp) {
              if (resp.code === 200) {
                that.$message({message: "操作成功", type: "success", duration: 1200});
                that.$router.push({ name: 'Proj' });
              } else {
                that.$message({message: "未能删除记录", type: "warning", duration: 1200});
              }
            }
        );
      });
    },
    /** 
     * 状态编辑处理
     */
    editStatusHandler(){
      // 后端
      this.dataFormSubmit({
        id: this.dataForm.id,
        status: this.editData.status
      })
      this.dialogVisible.status = false
    },
    /** 
     * 简介编辑处理
     */
    editDescriptionHandler(){
      // 后端
      this.dataFormSubmit({
        id: this.dataForm.id,
        description: this.editData.description
      })    
      this.dialogVisible.description = false
    },
    /** 
     * 标题编辑处理
     */
    editTitleHandler(){
      // 后端
      this.dataFormSubmit({
        id: this.dataForm.id,
        title: this.editData.title
      })           
      this.dialogVisible.title = false
    },
    /** 
     * 图片编辑处理
     */
    editImgHandler(imgUrl){
      this.dataForm.img = imgUrl
      // 后端
      this.dataFormSubmit({
        id: this.dataForm.id,
        img: this.dataForm.img
      })   
    }
  },
  mounted() {
    let id = this.$route.params.id
    this.dataForm.id = id;
    this.loadDataForm()
  }
}
</script>
<style lang="less" scoped>
.el-card{
  .el-row{
    border: 1px solid #F2F4F7;
    border-bottom: none;
    line-height: 40px;
    .el-col{
      padding: 5px 10px;
    }
  }
  .el-row:last-of-type{
    
    border-bottom: 1px solid #F2F4F7;
  }
  .title{
    font-weight: 700;
  }
}
</style>