<template>
  <div v-if="isAuth(['ROLE_ADMIN'])">
    <el-form :inline="true" :model="dataForm" :rules="dataRule" ref="dataForm">
      <el-form-item prop="username">
        <el-input
          v-model="dataForm.username"
          placeholder="用户名"
          size="medium"
          class="input"
          clearable="clearable"
        />
      </el-form-item>
      <el-form-item>
        <el-button size="medium" type="primary" @click="searchHandle()"
          >查询</el-button
        >
        <el-button
          size="medium"
          type="primary"
          :disabled="!isAuth(['ROLE_ADMIN', 'USER:INSERT'])"
          @click="addHandle()"
        >
          新增
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      cell-style="padding: 4px 0"
      style="width: 100%"
      size="medium"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
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
        prop="loginTime"
        header-align="center"
        align="center"
        min-width="150"
        label="上次登陆时间"
        :show-overflow-tooltip="true"
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
            :disabled="scope.row.ROLE_ADMIN"
            v-if="isAuth(['ROLE_ADMIN'])"
            @click="resetHandle(scope.row.id)"
          >
            重置[88888888]
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

    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="loadDataList"
    ></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./user-add-or-update.vue";
export default {
  components: {
    AddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        username: "",
        loginTime: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      dataRule: {
        username: [
          {
            required: false,
            pattern: "^[0-9a-zA-Z_]{1,10}$",
            message: "用户名格式错误",
          },
        ],
      },
    };
  },
  methods: {
    loadDataList: function () {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize,
        username: that.dataForm.username,
      };
      that.$http("/admin/users", "GET", data, true, function (resp) {
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
    addHandle: function () {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init();
      });
    },
    selectionChangeHandle: function (val) {
      this.dataListSelections = val;
    },
    resetHandle: function (id) {
      let that = this;
      console.log(id)
      that.$confirm(`确定重置选中用户的密码？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          that.$http(
            '/admin/resetpwd?userId='+id,
            "PUT",
            {},
            true,
            function (resp) {
              if ((resp.code == 200)) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1200,
                });
                that.loadDataList();
              } else {
                that.$message({
                  message: "未能重置记录",
                  type: "warning",
                  duration: 1200,
                });
              }
            }
          );
        });
      
    },
  },
  created: function () {
    this.loadDataList();
  },
};
</script>

<style lang="less" scoped="scoped"></style>
