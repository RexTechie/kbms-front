const path = require('path')
import vue from '@vitejs/plugin-vue'
import viteSvgIcons from 'vite-plugin-svg-icons';

module.exports = {
	base: '/',
	server: {
		port: 3000,
		//是否弹出浏览器
		open: false,
		//允许跨域
		cors: true
	},
	plugins: [
		vue(),
		//引入SVG图标素材文件
		viteSvgIcons({
			iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
			symbolId: '[name]',
		})
	],
	build: {
		sourcemap: true,
		outDir: 'dist', //指定输出路径
		assetsDir: 'static/img/', // 指定生成静态资源的存放路径
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('node_modules')) {
						const arr = id.toString().split('node_modules/')[1].split('/')
						switch (arr[0]) {
							case '@kangc':
							case '@naturefw':
							case '@popperjs':
							case '@vue':
							case 'axios':
							case 'element-plus':
								return '_' + arr[0]
							default:
								return '__vendor'
						}
					}
				},
				chunkFileNames: 'static/js1/[name]-[hash].js',
				entryFileNames: 'static/js2/[name]-[hash].js',
				assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
			},
			brotliSize: false, // 不统计
			target: 'esnext',
			minify: 'esbuild' // 混淆器，terser构建后文件体积更小
		}
	},
}