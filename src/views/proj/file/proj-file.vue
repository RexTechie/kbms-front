<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item prop="fileName">
        <el-input
          v-model="dataForm.fileName"
          placeholder="文件名"
          size="medium"
          class="input"
          clearable="clearable"
          prefix-icon="el-icon-search"
          @keydown.enter="searchHandle()"
        />
      </el-form-item>
      <el-form-item>
      <el-button
        size="medium"
        type="primary"
        @click="uploadDialogVisible = true">
        上传
      </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      cell-style="padding: 4px 0"
      style="width: 100%"
      size="medium"
    >
      <el-table-column
        type="index"
        header-align="center"
        align="center"
        width="50"
        label="序号"
        fixed="left"
      >
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="fileName"
        header-align="center"
        align="center"
        min-width="200"
        label="文件名"
        fixed="left"
        show-overflow-tooltip
      />
      <el-table-column
        prop="filePath"
        header-align="center"
        align="center"
        min-width="100"
        label="文件路径"
        show-overflow-tooltip
      />
      <el-table-column
        prop="creator"
        header-align="center"
        align="center"
        min-width="50"
        label="上传者"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        min-width="100"
        label="创建时间"
      />
      <el-table-column
        header-align="center"
        align="center"
        width="150"
        label="操作"
        fixed="right"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="handlePreview(scope.row.id)"
          >
            预览
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleDownload(scope.row.id)"
          >
            下载
          </el-button>
          <el-button
            type="text"
            size="small"
            @click="handleRemove(scope.row.id)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:currentPage="pageIndex"
      v-model:page-size="pageSize"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :page-sizes="[10, 20, 50]"
      :total="totalCount"
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 上传文件 -->
    <el-dialog 
      v-model="uploadDialogVisible" 
      title="上传文件"
      show-close
    >
      <el-upload
        ref="upload"
        v-model:file-list="fileList"
        :headers="{'Authorization': getToken}"
        :data="{'projId': projId}"
        :action="`${baseUrl}/proj/file/upload`"
        :auto-upload="false"
        :on-success="handleSuccess"
        :on-error="handleError"
      >
        <template #trigger>
          <el-button size="small" type="primary">选择文件</el-button>
        </template>
        <el-button style="margin-left: 20px;"
          size="small" type="success" @click="submitUpload">
          上传文件
        </el-button>
        <template #tip>
          <div class="el-upload__tip">
            请上传大小不超过20MB的文件，且上传同名文件会进行覆盖
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery"
import requestConfig from '../../../config/requestConfig';
export default {
  data() {
    return {
      baseUrl: requestConfig.baseUrl,
      dataForm: {
        fileName: ""
      },
      projId: null,
      uploadDialogVisible: false,
      fileList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataRule: {
        
      },
    };
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
    loadDataList: function () {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        projId: that.projId,
        username: that.dataForm.username,
      };
      that.$http("/proj/files", "GET", data, true, function (resp) {
        if (resp.code === 200) {
          let page = resp.data;
          let list = page.records;
          for (let one of list) {
            if (one.gender === 0) {
              one.gender = "男";
            } else if (one.gender === 1) {
              one.gender = "女";
            }
          }
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
    /**
     * 搜索处理
     */
    searchHandle: function () {
      //先执行表单验证
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //清理页面上的表单验证结果
          this.$refs["dataForm"].clearValidate();
          //不允许上传空字符串给后端，但是可以传null值
          if (this.dataForm.fileName === "") {
            this.dataForm.fileName = null;
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

    /**
     * 上传文件
     */
    submitUpload: function() {
      console.log(this.fileList)
      this.$refs.upload.submit();
    },
    /**
     * 上传成功钩子函数
     * @param {Response} response 响应体
     * @param {UploadFile} uploadFile 上传的文件
     */
    handleSuccess: function(response, uploadFile){
      console.log(response)
      if(response.code == 200) {
        this.uploadDialogVisible = false;
        this.$nextTick(() => {
          this.$refs.upload.clearFiles(uploadFile.status);
        });
        this.$message.success("上传成功 ")
        this.loadDataList();

      }else{
        this.$message.error("上传失败: " + response.msg)
      }
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
     * 文件下载
     * @param {String} fileId 文件id
     */
    handleDownload: function(fileId){
      window.open(`${this.baseUrl}/proj/file/download/${fileId}?projid=${this.projId}`)
    },
    /**
     * 点击文件列表中已上传的文件时的钩子
     * @param {String} fileId 文件id
     */
    handlePreview: function(fileId){
      // let url="http://xxx.com/files/demo.doc"
      // window.open("https://view.officeapps.live.com/op/view.aspx?src="+encodeURIComponent(url))
      window.open(`${this.baseUrl}/proj/file/preview/${fileId}?projid=${this.projId}`)
    },
    /**
     * 删除指定的文件
     * @param {String} fileId 文件id
     */
    handleRemove:  function(fileId){
      let that = this;
      that.$confirm(`确定要删除该文件？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that.$http(`/proj/file/${fileId}?projid=${this.projId}`, "DELETE",
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
  },
  created: function () {
    this.projId = this.$route.params.id
    this.loadDataList();
    this.token = localStorage.getItem("token")
  },
};
</script>

<style lang="less" scoped="scoped"></style>
