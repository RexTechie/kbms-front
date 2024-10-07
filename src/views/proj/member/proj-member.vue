<template>
  <div>
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item prop="username">
        <el-input
          v-model="dataForm.username"
          placeholder="昵称"
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
          :disabled="!(this.currentUser.type == '所有者')"
          @click="addHandle()">
          邀请
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
        width="100"
        label="序号"
      >
        <template #default="scope">
          <span>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        min-width="120"
        label="用户id"
      />
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        min-width="100"
        label="用户名"
      />
      <el-table-column
        prop="nickName"
        header-align="center"
        align="center"
        min-width="100"
        label="昵称"
      />
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        min-width="150"
        label="角色"
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
            :disabled="!(scope.row.type == '参与者' && this.currentUser.type == '所有者')"
            @click="removeMemberHandler(scope.row.username)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--项目成员邀请-->
    <el-dialog 
      v-model="dialogVisible" 
      title="项目成员邀请"
      width="20%"
      show-close
    >
      <el-input v-model="addMemberForm.username" placeholder="用户账号" @keydown.enter></el-input>
      <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addMemberHandle()">
          保存
        </el-button>
      </div>
    </template>
    </el-dialog>
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
export default {
  data() {
    return {
      dialogVisible: false,
      currentUser: {},
      projId: "",
      dataForm: {
        username: "",
        loginTime: "",
      },
      addMemberForm: {
        username: "",
      },
      addMemberVisible: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,

    };
  },
  methods: {
    /**
     * 移除项目成员
     */
    removeMemberHandler(username){
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        projId: this.projId,
        username: username
      };
      that.$http("/proj/member", "DELETE", data, true, function (resp) {
        if (resp.code === 200) {
          that.$message({message: "已移除", type: "success", duration: 1200});
          that.addMemberVisible = false;
          that.dataListLoading = false;
          that.loadDataList();
        } else {
          that.$message({
            message: resp.msg,
            type: "error",
            duration: 1200,
          });
          that.dataListLoading = false;
        }
      });
    },
    /**
     * 添加项目成员
     */
    addMemberHandle(){
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        projId: this.projId,
        username: this.addMemberForm.username
      };
      that.$http("/proj/member", "POST", data, true, function (resp) {
        if (resp.code === 200) {
          that.$message({message: "已保存", type: "success", duration: 1200});
          that.addMemberVisible = false;
          that.dataListLoading = false;
          that.addMemberForm.username = ""
          that.loadDataList();
          that.dialogVisible = false;
        } else {
          that.$message({
            message: resp.msg,
            type: "error",
            duration: 1200,
          });
          that.dataListLoading = false;
        }
      });
    },
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
        username: that.dataForm.username,
      };
      that.$http("/proj/members", "GET", data, true, function (resp) {
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
          if (this.dataForm.userName === "") {
            this.dataForm.userName = null;
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
     * 添加处理
     */
    addHandle: function () {
      this.dialogVisible = true;
    },

  },
  created: function () {
    let id = this.$route.params.id
    this.projId = id;
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
};
</script>

<style lang="less" scoped="scoped"></style>
