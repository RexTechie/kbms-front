import { createApp } from 'vue'
import App from './App.vue'
import 'vite-plugin-svg-icons/register' // 导入Svg图片插件，可以在页面上显示Svg图片
import $ from 'jquery'; // 导入JQuery库，因为Ajax用起来非常方便，支持同步和异步的Ajax请求
import VueCookies from 'vue3-cookies' //导入Cookie库，可以读写Cookie数据
import * as echarts from 'echarts'
import router from './router'
// element相关
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-CN'
import { ElMessage } from 'element-plus' //导入ElementUI的消息通知组件，下面封装全局Ajax的时候处理异常的时候需要弹出通知
// 配置文件
import RequestConfig from "./config/requestConfig";

const app = createApp(App) //创建VUE对象

app.use(router) //挂载路由插件
app.use(VueCookies) //挂载Cookie插件
app.use(ElementPlus, {locale}) //挂载ElementUl-Plus插件

app.config.globalProperties.$echarts = echarts //设置全局变量$echarts
app.config.globalProperties.$baseUrl = RequestConfig.baseUrl //设置全局变量$baseUrl
//用jquery封装全局Ajax公共函数
app.config.globalProperties.$http = function (url, method, data, async, fun) {
	let token = localStorage.getItem("token");
	$.ajax({
		url: RequestConfig.baseUrl + url,
		type: method,
		dataType: 'json',
		contentType: "application/json",
		headers: {
			"Authorization": token,
			'Access-Control-Allow-Origin': '*'
		},
		xhrFields: {
			withCredentials: true
		},
		async: async,
		data: method === "GET" ? data : JSON.stringify(data),
		success: function (resp, state, xhr) {
			fun(resp, state, xhr)
		},
		error: function (e) {
			console.log(e)
			if (e.status === undefined) {
				ElMessage.error({message: "前端页面错误", duration: 1200});
			} else {
				let status = e.status
				if (status === 401) {
					router.push({name: 'Login'})
				} else {
					ElMessage.error({message: e.responseText, duration: 1200});
				}
			}
		}
	})
}
//封装用于判断用户是否具有某些权限的公共函数
app.config.globalProperties.isAuth = function (roles) {
	let myRole = localStorage.getItem("role");
	return roles.includes(myRole);
}

app.mount('#app')