import {
	createRouter,
	createWebHashHistory
}
from 'vue-router'
import Login from '../views/login.vue'
import Main from "../views/main.vue"
import Home from "../views/home.vue"
import User from "../views/user/user.vue"
import Tag from "../views/tag/tag.vue"
import Proj from '../views/proj/proj.vue'
import ProjDetail from '../views/proj/proj-detail.vue'
import ProjInfo from '../views/proj/info/proj-info.vue'
import ProjMember from '../views/proj/member/proj-member.vue'
import ProjDoc from '../views/proj/doc/proj-doc.vue'
import ProjDocDetail from '../views/proj/doc/proj-doc-detail.vue'
import ProjDocAddOrUpdate from '../views/proj/doc/proj-doc-add-or-update.vue'
import ProjFile from '../views/proj/file/proj-file.vue'
import Chat from '../views/chat/chat.vue'
import NotFound from "../views/404.vue"


const routes = [{
		path: '/',
		name: 'Main',
		component: Main,
		children: [{
				path: '/',
				name: 'Home',
				component: Home,
				meta: {
					title: '首页',
				}
			},{
				path: '/user',
				name: 'User',
				component: User,
				meta: {
					title: '用户管理',
					isTab: true
				}
			}, {
				path: 'tag',
				name: 'Tag',
				component: Tag,
				meta: {
					title: '标签管理',
					isTab: "true"
				}
			},{
				path: 'proj',
				name: 'Proj',
				component: Proj,
				meta: {
					title: '项目管理',
					isTab: "true"
				}
			},{
				path: '/proj/detail/:id',
				name: 'ProjDetail',
				component: ProjDetail,
				meta: {
					title: '项目管理',
					isTab: true
				},
				children: [{
						path: '/proj/member/:id',
						name: 'ProjMember',
						component: ProjMember,
						meta: {
							title: '项目成员'
						}
					},{
						path: '/proj/info/:id',
						name: 'ProjInfo',
						component: ProjInfo,
						meta: {
							title: '基本信息'
						}
					},{
						path: '/proj/doc/:id',
						name: 'ProjDoc',
						component: ProjDoc,
						meta: {
							title: '项目文档'
						},
						children: [
						]
					},{
						path: '/proj/file/:id',
						name: 'ProjFile',
						component: ProjFile,
						meta: {
							title: '项目资料'
						}
					},{
						path: '/proj/:id/docdetail/:docId',
						name: 'ProjDocDetail',
						component: ProjDocDetail,
						meta: {
							title: '文档内容'
						}
					},{
						path: '/proj/:id/docaddorupdate/:docId',
						name: 'ProjDocAddOrUpdate',
						component: ProjDocAddOrUpdate,
						meta: {
							title: '项目文档'
						}
					}
				]
			}, {
				path: 'chat',
				name: 'Chat',
				component: Chat,
				meta: {
					title: '文档机器人',
					isTab: "true"
				}
			}
		]
	},{
		path: '/login',
		name: 'Login',
		component: Login
	},{
		path: "/404",
		name: "NotFound",
		component: NotFound
	},{
		path: '/:pathMatch(.*)*',
		redirect: "/404"
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})
router.beforeEach((to, from, next) => {
	if (to.name !== "Login") {
		let role = localStorage.getItem("role")
		let token = localStorage.getItem("token")
		if (role == null || role === "" || token == null || token === "") {
			next({
				name: 'Login'
			})
		}
	}
	return next()
})

export default router
