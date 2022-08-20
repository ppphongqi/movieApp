import App from './app.js'
export default {
	data(){},
	onshow(){
		
	},
	onReady() {
		document.body.style.setProperty("--theme-color", '#FFD940')
		document.body.style.setProperty("--top-color", '#FFD940')
		document.body.style.setProperty("--auxiliary-color", '#FFD940')
		App._post_form('diy.Diy/getThemeInfo',{},res=> {
			let {code,
			 data:{
				 theme_color,
				 top_color,
				 auxiliary_color
			 }} = res
			 document.body.style.setProperty("--theme-color", theme_color)
			 document.body.style.setProperty("--top-color", top_color)
			 document.body.style.setProperty("--auxiliary-color", auxiliary_color)
		})
		
	},
}