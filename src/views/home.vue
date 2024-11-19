<template>
  <div class="home">
    <el-row type="flex" justify="center" >
      <el-row type="flex">
        <el-col :span="24">
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="formData.keyword" 
                placeholder="请输入搜索内容"
                prefix-icon="el-icon-search"
                style="width: 700px;"
                autofocus=true
                clearable
                @keydown.enter="onSubmit('ES')"
                ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('ES')">ES查询</el-button>
              <el-button type="primary" @click="onSubmit('MySQL')">MySQL查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row :gutter="70" type="flex" justify="center">
        <el-col :span="9" class="left">
          <h2>企业知识库系统</h2>
          <div class="desc">
            <p>强大的搜索引擎技术</p>
          </div>
          <div class="bottom">
            <div class="remark-container">
              <div class="ball blue">1</div>
              <div class="remark">快速</div>
            </div>
            <div class="remark-container">
              <div class="ball red">2</div>
              <div class="remark">精准</div>
            </div>
            <div class="remark-container">
              <div class="ball green">3</div>
              <div class="remark">稳定</div>
            </div>
          </div>
        </el-col>
        <el-col :span="11" class="right">
          <!--<img src="../assets/home/banner.png" class="banner" alt=""/>-->
          <div ref="chart" style="width: 600px; height: 400px;"></div>
          
        </el-col>
      </el-row>
    </el-row>
    <search-result
      v-if="searchResultVisible"
      ref="SearchResult"
      @refreshDataList="loadDataList"
    ></search-result>
  </div>
</template>
<script>
import SearchResult from './search/search.vue';
export default{
  components: {
    SearchResult
  },
  data(){
    return{
      searchResultVisible: false,
      formData: {
        keyword:""
      }
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      // 绑定 DOM 元素
      this.chart = this.$echarts.init(this.$refs.chart);

      // 设置配置项和数据
      const option = {
        title: {
          text: 'ECharts 示例',
        },
        tooltip: {},
        xAxis: {
          data: ['苹果', '橙子', '香蕉', '葡萄', '菠萝'],
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: [5, 20, 36, 10, 10],
          },
        ],
      };

      // 渲染图表
      this.chart.setOption(option);
    },
    onSubmit(type) {
      this.searchResultVisible = true
      //加载用户数据
      let userId = null;
      let that = this;
      this.$http("/user/current", "GET", null, true, function (resp) {
        if(resp.code === 200) {
          userId = resp.data.id;
          that.$nextTick(() => {
            that.$refs.SearchResult.init(userId, that.formData.keyword, type);
          });
        }else{
          ElMessage.error("请先登录")
          that.$router.push({name: "Login"})
        }
      });

    }
  }
}
</script>

<style lang="less" scoped="scoped">
@import url("home.less");
</style>
