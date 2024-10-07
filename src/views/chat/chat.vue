<template>
  <div class="container">
    <iframe 
      :src="'http://127.0.0.1:7860?token='+token" 
      frameborder="0">
    </iframe>
  </div>
</template>


<script>
export default{
  data(){
    return {
      token:""
    }
  },
  methods: {
    
  },
  created(){
    this.token = localStorage.getItem("token")
  }
}
</script>
<style lang="less" scoped>
.container{
  height: 100vh;
  iframe{
    width: 100%;
    height: 100%;
  }
}
</style>