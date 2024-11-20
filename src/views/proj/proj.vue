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
          @keydown.enter="searchHandle()"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          size="medium"
          type="primary"
          @click="addHandle()"
        >
          创建项目
        </el-button>
      </el-form-item>
    </el-form>
    <el-empty v-if="dataList.length == 0" :description="暂无项目" />
    <el-row :gutter="10">
      <el-col :span="6" v-for="item in dataList" v-bind:key="item.id">
        <el-card shadow="hover" @click="projDetailHandler(item.id)" >
          <div class="item_img" style="width: 40px;">
            <el-image :src="baseUrl+item.img" 
              style="border-radius: 10%;" 
              alt="" />
          </div>
          <div class="item_title">
              <span v-if="item.title && item.title.length <= 15">
                  {{item.title}}
              </span>
              <span v-if="item.title&& item.title.length > 15">                
                  {{item.title.substr(0, 15) + "..."}}
              </span>
          </div>
          <div class="item_description">
              简介：
              <span v-if="item.description&& item.description.length > 15">                
                {{item.description.substr(0, 15) + "..."}}
              </span>
              <span v-else>
                  {{item.description}}
              </span>
          </div>
          <div class="item_status">
            <el-tag v-if="item.status === 1" type="danger" effect="plain" size="small" round>未开始</el-tag>
            <el-tag v-if="item.status === 2" type="primary" effect="plain" size="small" round>进行中</el-tag>
            <el-tag v-if="item.status === 3" type="warning" effect="plain" size="small" round>已暂停</el-tag>
            <el-tag v-if="item.status === 4" type="success" effect="plain" size="small" round>已完成</el-tag>
            <el-tag v-if="item.status === 5" type="info" effect="plain" size="small" round>已取消</el-tag>
          </div>
          <span></span>
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

    <proj-add
      v-if="ProjaddVisible"
      ref="Projadd"
      @refreshDataList="loadDataList"
    ></proj-add>
  </div>
</template>

<script>
import ProjAdd from "./proj-add.vue";
import requestConfig from "../../config/requestConfig";
import { ElTooltip } from "element-plus";
export default{
  components: { ProjAdd, ElTooltip},
  data(){
    return {
      baseUrl: requestConfig.baseUrl,
      dataList: [],
      dataForm: {
        title: null
      },
      ProjaddVisible: false,
      pageIndex: 1,
      pageSize: 5,
      totalCount: 10
    }
    
  },
  methods: {
    addHandle: function () {
      this.ProjaddVisible = true;
      this.$nextTick(() => {
        this.$refs.Projadd.init();
      });
    },
    /**
     * 调转至项目详情页
     */
    projDetailHandler: function(id){
      this.$router.push({path: '/proj/info/'+ id})
    },
    /**
     * 加载项目数据
     */
    loadDataList: function () {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        title: that.dataForm.title,
      };
      that.$http("/projs", "GET", data, true, function (resp) {
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
        }
      });
    },
    sizeChangeHandle(val) {
      this.pageSize = val;
      //更改每页显示记录数量后，都从第一页开始查询
      this.pageIndex = 1;
      this.loadDataList();
    },
    currentChangeHandle(val) {
      if (val == null) return;
      this.pageIndex = val;
      this.loadDataList();
    },
    searchHandle: function () {
      //先执行表单验证
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //清理页面上的表单验证结果
          this.$refs["dataForm"].clearValidate();
          //不允许上传空字符串给后端，但是可以传null值
          if (this.dataForm.title === "") {
            this.dataForm.title = null;
          }
          //如果当前页面不是第一页，则跳转到第一页显示查询的结果
          if (this.pageIndex !== 1) {
            this.pageIndex = 1;
          }
          this.loadDataList();
        } else {
          return false;
        }
      });
    },
  },
  created(){
    this.loadDataList();
  }
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
  .item_tag{
    font-size: 14px;
    color: rgb(158, 155, 240);
  }
  .item_description{
    color: #82858E;
    font-size: 12px;
  }
}
</style>