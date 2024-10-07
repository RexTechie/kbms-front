<template>
  <div>
    <el-dialog
      :close-on-click-modal="true"
      :show-close="false"
      :draggable="true"
      top="20vh"
      v-model="visible"
      width="700px"
    >
      <el-row :gutter="10">
        <el-col :span="24" v-if="dataList.length == 0">
          <el-empty description="没有相关信息" />
        </el-col>
        <el-col :span="24">
            <span>{{ dataForm.type }}查询方式，花费时间：{{ duration  }} ms</span>
          </el-col>
        <el-col :span="24" v-for="item in dataList" v-bind:key="item.id">
          <el-card shadow="hover" @click="projDetailHandler(item.projId, item.docId)" >
            <div class="item_proj">
              <span>{{ item.proj }}</span>
            </div>
            <div class="item_title">
              <span> {{ item.title }}</span>
            </div>
            <div class="item_summary">
              <span>{{ item.summary }}</span>
            </div>
            <div class="item_info">
              <span>{{ item.createTime }} · {{ item.creator }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-pagination
        v-model:currentPage="pageIndex"
        v-model:page-size="pageSize"
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :page-sizes="[10]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </el-dialog>
  </div>
</template>
<script>
export default{
  data(){
    return {
      visible: false,
      currentUserId: null,
      dataForm: {
        userId: null,
        keywords: "",
        type: ""
      },
      duration: 0,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalCount: null,
    }
  },
  methods: {
    /**
     * 调转至项目详情页
     */
    projDetailHandler: function(projId, docId){
      this.$router.push({path: `/proj/${projId}/docdetail/${docId}`})
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
        type: that.dataForm.type,
        keyword: that.dataForm.keyword,
        userId: that.dataForm.userId
      };
      that.$http("/proj/doc/search", "GET", data, true, function (resp) {
        if (resp.code === 200) {
          let page = resp.data;
          let list = page.records;
          that.dataList = list;
          that.totalCount = parseInt(page.total);
          that.pageSize = parseInt(page.size);
          that.pageIndex = parseInt(page.current);
          that.duration = parseInt(page.duration);
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
    init: function (userId, keyword, type) {
      this.dataForm.userId = userId;
      this.dataForm.keyword = keyword;
      this.dataForm.type = type;
      let that = this;
      that.visible = true;
      this.loadDataList()
    }
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
  .item_proj{
    // padding-left: 10px;
    font-size: 16px;
    font-weight: 700;
    color: #25a1ff;
    // border-left: 2px solid #25a1ff;
  }
  .item_title{
    font-size: 14px;
    font-weight: 700;
  }
  .item_type{
    font-size: 12px;
    color: rgb(158, 155, 240);
  }
  .item_summary, .item_info{
    color: #82858E;
    font-size: 10px;
  }
  .item_oper{
    .el-link{
      margin-right: 10px;
      font-size: 12px;
    }
  }
}
</style>