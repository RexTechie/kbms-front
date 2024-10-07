<template>
  <el-dialog
    :title="dataForm.id === -1 ? '新增【初始密码：88888888】' : '修改'"
    v-if="isAuth(['ROLE_ADMIN', 'USER:INSERT', 'USER:UPDATE'])"
    :close-on-click-modal="false"
    v-model="visible"
    width="450px"
  >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      label-width="80px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="dataForm.username"
          size="medium"
          placeholder="用户名"
          clearable
          :disabled="dataForm.id!==-1"
        />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input
          v-model="dataForm.nickName"
          placeholder="昵称"
          size="medium"
          clearable
        />
      </el-form-item>
      <el-form-item label="角色" prop="username">
        <el-select
          v-model="dataForm.role"
          class="input"
          placeholder="角色"
          size="medium"
          clearable="clearable"
        >
          <el-option
            :key="one.id"
            v-for="one in roleList"
            :label="one.name"
            :value="one.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="medium" @click="visible = false">取消</el-button>
        <el-button type="primary" size="medium" @click="dataFormSubmit"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data: function () {
    return {
      visible: false,
      dataForm: {
        id: null,
        username: null,
        nickName: null,
        role: null
      },
      roleList: [{
        name: "管理员",
        id: 0
      }, {
        name: "用户",
        id: 1,
      }
      ],
      dataRule: {
        username: [
          {
            required: true,
            pattern: "^[a-zA-Z0-9]{2,20}$",
            message: "用户名格式错误",
          },
        ],
      },
    };
  },
  methods: {
    init: function (id) {
      let that = this;
      that.dataForm.id = id || -1;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs["dataForm"].resetFields();
      });
    },
    dataFormSubmit: function () {
      let that = this;
      let roles = Array.from(that.dataForm.role);
      let roleIds = [];
      this.roleList.forEach((role) => {
        roles.forEach((roleName) => {
          if (roleName === role.name) {
            roleIds.push(role.id);
          }
        });
      });
      console.log(roleIds);
      console.log(roles);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let data = {
            username: that.dataForm.username,
            nickName: that.dataForm.nickName,
            role: that.dataForm.role,
          };
          that.$http("/admin/user", "POST",
            data, true, (resp) => {
              if (resp.code === 200) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1200,
                });
                that.visible = false;
                that.$emit("refreshDataList");
              } else {
                that.$message({
                  message: resp.msg,
                  type: "error",
                  duration: 1200,
                });
              }
            }
          );
        }
      });
    },
  },
};
</script>

<style lang="less" scoped="scoped"></style>
