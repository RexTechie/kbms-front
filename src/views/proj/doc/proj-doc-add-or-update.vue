<template>
  <div>
    <el-form :model="dataForm" ref="dataForm" :rules="dataRule" label-width="120px">
      <el-form-item label="文档标题" prop="title">
        <el-input v-model="dataForm.title" @input="autoGenerateSummary"/>
      </el-form-item>
      <el-form-item label="自动生成摘要">
        <el-switch v-model="autoSummary" @change="autoGenerateSummary" />
      </el-form-item>
      <el-form-item label="摘要" prop="summary">
        <el-input v-model="dataForm.summary" :disabled="autoSummary" />
      </el-form-item>
      <el-form-item id="editor-item" label="内容" style="line-height: 0" prop="contentHtml">
        <QuillEditor
            id="editorId" ref="myQuillEditor" v-model:content="dataForm.contentHtml"
            theme="snow" contentType="html" :options="editorOption"
            placeholder="输入文档内容" style="height: 40vh;"
        >
        </QuillEditor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dataFormSubmit">提交</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
// import RequestConfig from "../../../config/requestConfig";
import router from "../../../router";

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
  ['blockquote', 'code-block'],                      //引用，代码块
  [{ 'header': 1 }, { 'header': 2 }],               // 几级标题
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],     // 有序列表，无序列表
  [{ 'script': 'sub' }, { 'script': 'super' }],      // 下角标，上角标
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // 缩进
  [{ 'direction': 'rtl' }],                         // 文字输入方向
  [{ 'size': ['small', false, 'large', 'huge'] }],  // 字体大小
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],        // 标题
  [{ 'color': [] }, /*{ 'background': [] }*/],          // 颜色选择
  // [{ 'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial'] }],// 字体
  [{ 'align': [] }], // 居中
  ['clean'],                                       // 清除样式,
  ['link'/*, 'image'*/],  // 链接，上传图片、上传视频
]
export default {
  components: {
    QuillEditor
  },
  data(){
    return {
      headers: {
        Authorization: null,
      },
      dataRule: {
        title: [{
            required: true,
            message: "标题不能为空",
          },
        ],
      },
      editorOption: {
        debug: 'error',
        readOnly: false,
        theme: 'snow',
        myQuillEditor: null,
        modules: {
          history: {
            delay: 1000,
            maxStack: 50,
            userOnly: false
          },
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // image: function (value) {
              //   if (value) {
              //     // 调用element的图片上传组件
              //     document.querySelector('.editor-img-uploader input').click()
              //   } else {
              //     this.quill.format('image', false)
              //   }
              // }
            }
          }
        }
      },

      autoSummary: false,
      dataForm: {
        id: null,
        projId: null,
        title: "",
        contentText: "",
        contentHtml: "",
        summary: ""
      },
    }
  },
  name: "article-add-or-update.vue",
  methods: {
    /**
     * 自动生成摘要
     */
    autoGenerateSummary(){
      if (this.autoSummary){
        this.dataForm.summary = this.dataForm.title;
      }
    },
    /**
     * 提交表单
     */
    dataFormSubmit(){
      let that = this;
      let quill = this.$refs.myQuillEditor;
      this.dataForm.contentText = quill.getText();
      console.log(this.dataForm);
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
            that.$http("/proj/doc", that.dataForm.id == null ? "POST" : "PUT",
              that.dataForm, true,(resp) => {
                if (resp.code === 200) {
                  that.$message({message: "操作成功", type: "success", duration: 1200});
                  router.go(-1)
                } else {
                  that.$message({message: "操作失败", type: "error", duration: 1200});
                }
              }
            )
            console.log(this.dataForm)
          }
      })
    },
    // // 图片上传成功返回图片地址
    // handleAvatarSuccess(res, file) {
    //   // 获取富文本组件实例
    //   console.log(this.$refs.myQuillEditor)
    //   let quill = this.$refs.myQuillEditor.getQuill()
    //   // 如果上传成功
    //   if (res) {
    //     // 获取光标所在位置
    //     let length = quill.getSelection().index;
    //     // 插入图片，res为服务器返回的图片链接地址
    //     quill.insertEmbed(length, 'image', res.data)
    //     // 调整光标到最后
    //     quill.setSelection(length + 1)
    //   } else {
    //     // 提示信息，需引入Message
    //     this.$message.error('图片插入失败！')
    //   }
    // },
    // // 图片上传前拦截
    // beforeAvatarUpload(file) {
    //   console.log(file)
    //   this.headers.Authorization = localStorage.getItem("token");
    //   const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
    //   const isJPG = type.includes(file.type);
    //   const maxSize = 2
    //   const isLt2M = file.size / 1024 / 1024 < maxSize;
    //   if (!isJPG) {
    //     this.$message({
    //       message: "图片格式错误",
    //       type: "error",
    //     });
    //   }
    //   if (!isLt2M) {
    //     this.$message({
    //       message: "上传图片不能超过" + maxSize + "M",
    //       type: "error",
    //     });
    //   }
    //   return isJPG && isLt2M;
    // }
},
  computed: {
  },
  mounted() {
    let id = this.$route.params.docId
    if (id === "-1"){
      id = null
    }
    this.dataForm.id = id;
    this.dataForm.projId = this.$route.params.id
    let that = this;
    let quill = this.$refs.myQuillEditor;
    that.$nextTick(() => {
      that.$refs["dataForm"].resetFields();
      // 加载数据
      if (id !== null){
        that.$http(`/proj/doc/${that.dataForm.id}`,
            "GET", null, false, (resp) => {
              if (resp.code === 200) {
                that.dataForm.title = resp.data.title;
                that.dataForm.summary = resp.data.summary;
                that.dataForm.contentHtml = resp.data.contentHtml;
                that.dataForm.contentText = resp.data.contentText;
                console.log(resp.data.contentHtml)
                quill.setHTML(resp.data.contentHtml)
              } else {
                that.$message({message: "文章不存在", type: "error", duration: 1200});
              }
            }
        )
      }
    })
  },
  created() {

  }
}
</script>

<style scoped>
/*强制修改样式*/
/deep/ #editor-item .el-form-item__content{
  line-height: 20px !important;

}
.editor-img-uploader {
  display: none;
}
.ql-editor {
  min-height: 300px;
}
</style>
