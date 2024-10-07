# proj_template_vue

Tips: 建议可以改造，用vue2实现，vue3很多工具类不兼容，这里面虽然用的是vue3但是写法大部分都是vue2的写法

- UI：element-plus、quill
- 技术栈：vue3

## 运行环境

- 无要求

## 开发环境

- Node11+

## 使用文档

- npm install初始化依赖包
- npm run dev 运行
- npm run build 编译

## 包结构说明

- dist 编译后的代码
- src 核心代码
  - assets 静态资源
  - components 封装一些常用的组件
  - config 配置文件
  - icons 图标
  - router 路由
  - utils 工具类
  - view 页面
  - App.vue 全局页面
  - main.js 全局配置
- .gitignore git忽略文件
- index.html 主页面，绑定vue
- package-lock.json 锁定安装时的包的版本号，需要上传到git，保证大家的依赖包一致
- package.json 第三方包的依赖管理
- vite.config.js vite打包配置 
