<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item prop="title">
        <el-input
          v-model="dataForm.title"
          placeholder="搜索"
          size="medium"
          class="input"
          prefix-icon="el-icon-search"
          clearable="clearable"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="medium"
          type="primary"
          @click="handleCreate()"
        >
          创建文档
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-upload
          ref="upload"
          accept="application/msword"
          :headers="{'Authorization': getToken}"
          :data="{'projId': projId}"
          :action="`${baseUrl}/proj/doc/upload`"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <el-button type="primary">上传文档(仅word)</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-row :gutter="10">
      <el-col :span="24" v-if="dataList.length == 0">
        <el-empty description="没有相关信息" />
      </el-col>
      <el-col :span="24" v-for="item in dataList" v-bind:key="item.id">
        <el-card shadow="hover" @click="projDetailHandler(item.id)" >
          <div class="item_title">
            <span>{{ item.title }}</span>
          </div>
          <div class="item_summary">
            <span>{{ item.summary }}</span>
          </div>
          <div class="item_info">
            <span>{{ item.createTime }} · {{ item.owner }}</span>
          </div>
          <div class="item_oper">
            <el-link 
              type="primary" 
              icon="el-icon-edit"
              v-if = "item.isUpload != 1"
              @click.stop.prevent="handleEdit(item.id)"
            >编辑</el-link>
            <el-link 
              type="primary" 
              icon="el-icon-delete"
              @click.stop.prevent="handleRemove(item.id)"
            >移除</el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-pagination
      v-model:currentPage="pageIndex"
      v-model:page-size="pageSize"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :page-sizes="[10, 20, 50]"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
  </div>
</template>

<script>
import requestConfig from '../../../config/requestConfig';
export default{
  data(){
    return {
      baseUrl: requestConfig.baseUrl,
      addOrUpdateVisible: false,
      projId: null,
      dataList: [{
        id: 1,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      },{
        id: 2,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      },{
        id: 3,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      },{
        id: 4,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      },{
        id: 5,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      },{
        id: 6,
        title: "课程评估系统",
        summary: "这是一个课程评估系统...",
        owner: "管理员",
        createTime: "2024-01-01 00:00:00",
        updateTime: "2024-01-01 00:00:00"
      }],
      dataForm: {
        title: ""
      },
      pageIndex: 1,
      pageSize: 5,
      totalCount: 10
    }
    
  },
  computed: {
    getToken(){
      return localStorage.getItem("token");
    }
  },
  methods: {
    /**
     * 加载数据
     */
    loadDataList() {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        projId: that.projId,
        title: that.dataForm.title,
      };
      that.$http("/proj/docs", "GET", data, true, function (resp) {
        if (resp.code === 200) {
          let page = resp.data;
          let list = page.records;
          that.dataList = list;
          that.totalCount = parseInt(page.total);
          that.pageSize = parseInt(page.size);
          that.pageIndex = parseInt(page.current);
          that.dataListLoading = false;
        } else {
          that.$message({
            message: resp.msg,
            type: "error",
            duration: 1200,
          });
          that.$router.push({ name: 'Proj' })
        }
      });
    },
    /**
     * 上传成功钩子函数
     * @param {Response} response 响应体
     * @param {UploadFile} uploadFile 上传的文件
     */
    handleSuccess: function(response, uploadFile){
      if(response.code == 200) {
        this.$message.success("上传成功 ")
        this.loadDataList();
      }else{
        this.$message.error("上传失败: " + response.msg)
      }
      this.$refs.upload.clearFiles()
    },
    /**
     * 上传失败的钩子函数
     * @param {Error} error 错误信息
     * @param {UploadFile} uploadFile 上传的文件
     */
    handleError: function(error, uploadFile){
      this.$message.error("上传失败: " + error)
    },
    /**
     * 处理创建文档
     */
    handleCreate: function(){
      this.$router.push({ path: `/proj/${this.projId}/docaddorupdate/-1`})
    },
    /**
     * 处理编辑文档
     * @param {String} id 文档id
     */
    handleEdit: function(id){
      this.$router.push({ path: `/proj/${this.projId}/docaddorupdate/${id}`})
    },
    /**
     * 删除文档
     * @param {String} id 文档id
     */
    handleRemove: function(id){
      let that = this;
      that.$confirm(`确定要删除该文件？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that.$http(`/proj/doc/${id}?projid=${this.projId}`, "DELETE",
            null, true, function (resp) {
              if (resp.code === 200) {
                that.$message({message: "操作成功", type: "success", duration: 1200});
                that.loadDataList();
              } else {
                that.$message({message: "未能删除记录", type: "warning", duration: 1200});
              }
            }
        );
      });
    },
    /**
     * 调转至项目详情页
     */
    projDetailHandler: function(id){
      this.$router.push({path: `/proj/${this.projId}/docdetail/${id}`})
    },
    /**
     * 每页条数切换
     * @param {Integer} val 每页大小
     */
    sizeChangeHandle(val) {
      this.pageSize = val;
      //更改每页显示记录数量后，都从第一页开始查询
      this.pageIndex = 1;
      this.loadDataList();
    },
    /**
     * 当前页切换
     * @param {Integer} val 跳转页数
     */
    currentChangeHandle(val) {
      if (val == null) return;
      this.pageIndex = val;
      this.loadDataList();
    },
  },
  created() {
    this.projId = this.$route.params.id
    this.loadDataList();
    let that = this;
    //加载用户数据
    that.$http(`/proj/current/${this.projId}`, "GET", null, true, function (resp) {
      if(resp.code === 200) {
        that.currentUser = resp.data;
      }else{
        ElMessage.error("请先登录")
        that.$router.push({name: "Login"})
      }
    });
  },
}
</script>
<style lang="less" scoped>
.el-col {
  margin-bottom: 20px;
}
.el-card {
  div{
    margin-bottom: 8px;
  }
  .item_title{
    font-size: 16px;
    font-weight: 700;
  }
  .item_summary, .item_info{
    color: #82858E;
    font-size: 12px;
  }
  .item_oper{
    .el-link{
      margin-right: 10px;
      font-size: 12px;
    }
  }
}
</style>