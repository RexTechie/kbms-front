<template>
  <el-dialog
    :title="dataForm.id === -1 ? '新增' : '修改'"
    v-if="isAuth(['ROLE_ADMIN'])"
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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="dataForm.name"
          size="medium"
          clearable
        />
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
        name: null,
        parentId: null,
        level: null
      },
      dataRule: {
      
      },
    };
  },
  methods: {
    init: function (id, parentId, level) {
      let that = this;
      that.dataForm.id = id || -1;
      that.dataForm.parentId = parentId || -1;
      that.dataForm.level = level || 1;
      that.visible = true;
      that.$nextTick(() => {
        that.$refs["dataForm"].resetFields();
        if (that.dataForm.id !== -1) {
          that.$http(
            `/admin/tag/${that.dataForm.id}`,
            "GET",
            null,
            false,
            function (resp) {
              if (resp.code === 200) {
                that.dataForm.name = resp.data.name;
                that.dataForm.level = resp.data.level;
                that.dataForm.parentId = resp.data.parentId;
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
      })
    },
    dataFormSubmit: function () {
      let that = this
      this.$refs["dataForm"].validate((valid) => {
      if (valid) {  
        //如果是新增id需为null
        if (that.dataForm.id === -1) {
          that.dataForm.id = null;
        }
        console.log(that.dataForm.id)
        that.$http("/admin/tag",
            that.dataForm.id == null ? "POST" : "PUT",
            that.dataForm,
            true,
            (resp) => {
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
                  message: "操作失败",
                  type: "error",
                  duration: 1200,
                });
              }
            }
          )
          console.log(this.dataForm)
        }
      })
    }
  },
};
</script>

<style lang="less" scoped="scoped"></style>
