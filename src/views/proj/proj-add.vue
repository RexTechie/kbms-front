<template>
  <el-dialog
    title="创建项目"
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
      <el-form-item label="项目名称" prop="title">
        <el-input
          v-model="dataForm.title"
          placeholder="项目名称"
          size="medium"
          clearable
        />
      </el-form-item>
      <el-form-item label="标签" prop="tagId">
        <el-cascader
          v-model="dataForm.tagId"
          :options="tagList"
          :props="tagProps"
          :show-all-levels="false"
          class="input"
          placeholder="标签"
          size='large'
          clearable="clearable"
        >
        </el-cascader>
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
        title: null,
        tagId: null
      },
      tagProps: {
        "value": "id",
        "label": "name",
        checkStrictly: true
      },
      tagList: [],
      dataRule: {
        title: [{
            required: true,
            message: "项目名称不能为空",
          },
        ],
      },
    };
  },
  methods: {
    /**
     * 加载标签列表
     */
    loadTagList(){
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
      };
      that.$http("/tags", "GET", data, true, function (resp) {
        if (resp.code === 200) {
          that.tagList = resp.data;
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
    init: function () {
      let that = this;
      that.visible = true;
    },
    dataFormSubmit: function () {
      let that = this;
      // 多级标签处理
      let tagId = this.dataForm.tagId;
      if(typeof(tagId) != "string" ){
        let tagIdArrLen = this.dataForm.tagId.length
        this.dataForm.tagId = this.dataForm.tagId[tagIdArrLen-1]
      }else{
        this.dataForm.tagId = tagId
      }
      console.log(this.dataForm.tagId)
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let data = {
            title: that.dataForm.title,
            tagId: that.dataForm.tagId,
          };
          that.$http("/proj", "POST",
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
  created(){
    this.loadTagList();
  }
};
</script>

<style lang="less" scoped="scoped"></style>
