<template>
  <div>
    <el-button
      size="medium"
      type="primary"
      style="margin-bottom: 10px;"
      :disabled="!isAuth(['ROLE_ADMIN'])"
      @click="addHandle()"
    >
      创建一级标签
    </el-button>
    <el-table
        :data="dataList"
        row-key="id"
        default-expand-all
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        cell-style="padding: 4px 0"
        style="width: 100%"
        size="medium"
    >
      <el-table-column
          prop="name"
          min-width="200"
          label="标签名称"
      ></el-table-column>
      <el-table-column
          prop="level"
          header-align="center"
          align="center"
          min-width="100"
          label="级别"
      ></el-table-column>
      <el-table-column
          prop="createTime"
          header-align="center"
          align="center"
          min-width="150"
          label="创建时间"
      ></el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="250"
          label="操作"
      >
        <template #default="scope">
          <el-button
              type="text"
              size="small"
              :disabled = "scope.row.level == 3"
              v-if="isAuth(['ROLE_ADMIN'])"
              @click="addHandle(scope.row.id, scope.row.level+1)"
          >
            新增子级
          </el-button>
          <el-button
              type="text"
              size="small"
              v-if="isAuth(['ROLE_ADMIN', 'ARTICLE:UPDATE'])"
              @click="updateHandle(scope.row.id, scope.row.level+1)"
          >
            修改
          </el-button>
          <el-button
              type="text"
              size="small"
              :disabled="scope.row.root"
              v-if="isAuth(['ROLE_ADMIN', 'ARTICLE:DELETE'])"
              @click="deleteHandle(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="loadDataList"
    ></add-or-update>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import AddOrUpdate from './tag-add-or-update.vue'
export default {
  components: {
    AddOrUpdate,
  },
  data() {
    return {
      dataForm: {
        title: ''
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      dataRule: [],
      dataListSelections: [],
    };
  },
  methods: {
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
    addHandle(parentId, level) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(null, parentId, level);
      });
    },
    updateHandle(id, level) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, null, level);
      });
    },
    searchHandle: function () {
      //先执行表单验证
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          //清理页面上的表单验证结果
          this.$refs["dataForm"].clearValidate();
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
     * 表格的数据转换
     */
    dataListConvert: function(dataList){
      // console.log("list", dataList)
      dataList.forEach(data=>{
        // console.log(data)
        if(data.level != "3"){
          data.correctRate = "/"
          data.questionNum = "/"
        }else{
          
          data.correctRate = Math.round(data.correctRate*100)/100;
        }
        data.createTime = dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss")
        if(data.children != null){
          this.dataListConvert(data.children);
        }
      })

    },
    loadDataList: function () {
      let that = this;
      //请求后端数据的时候，让表格出现循环滚动的等待图标
      that.dataListLoading = true;
      let data = {
        page: that.pageIndex,
        size: that.pageSize
      };

      that.$http("/tags", "GET", data, true, function (resp) {
        if (resp.code === 200) {
          that.dataList = resp.data;
          that.dataListConvert(that.dataList);
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
    deleteHandle: function (id) {
      let that = this;
      that.$confirm(`确定要删除选中的记录？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        that.$http(
            "/admin/tag/"+id,
            "DELETE",
            null,
            true,
            function (resp) {
              if (resp.code === 200) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1200,
                });
                that.loadDataList();
              } else {
                that.$message({
                  message: "未能删除记录",
                  type: "warning",
                  duration: 1200,
                });
              }
            }
        );
      });
    },
    selectionChangeHandle: function (val) {
      this.dataListSelections = val;
    },
  },
  created() {
    this.loadDataList();
  },
};
</script>
