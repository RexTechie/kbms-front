<template>
  <el-container style="height: 600px">
    <el-aside width="150px">
      <el-menu style="height: 100%;"
        :default-active="$route.path"
        router
      >
        <el-menu-item :index="`/proj/info/${projData.id}`" 
        >
          <SvgIcon name="info" class="icon-svg" />
          <span>基本信息</span>
        </el-menu-item>
        <el-menu-item :index="`/proj/member/${projData.id}`" 
        >
          <SvgIcon name="user_fill" class="icon-svg" />
          <span>项目成员</span>
        </el-menu-item>
        <el-menu-item :index="`/proj/doc/${projData.id}`"
        >
          <SvgIcon name="doc" class="icon-svg" />
          <span>项目文档</span>
        </el-menu-item>
        <el-menu-item :index="`/proj/file/${projData.id}`"
        >
          <SvgIcon name="file" class="icon-svg" />
          <span>项目资料</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import SvgIcon from "../../components/SvgIcon.vue";
export default{
  components: { SvgIcon },
  data(){
    return{
      activeIdx: "info",
      projData: {
        id: 1
      }
    }
  },
  methods:{

    /** 
     * 切换菜单
     */
    handleMenuSelect(target){
      this.$router.push(`/proj/${target}/${this.projData.id}`)
    },
  },
  created() {
    let id = this.$route.params.id
    this.projData.id = id;
  }
}
</script>

<style lang="less" scoped>
.icon-svg{
  margin-right: 5px;
}
</style>