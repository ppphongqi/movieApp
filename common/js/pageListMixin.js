let mixin = {
	data() {
		return {
			showTopBtn: false,
			pageScroll: 0,
		}
	},
	methods: {

	},
	/**
	 * 显示/隐藏 返回顶部按钮
	 */
	onPageScroll({scrollTop}) {
		
		let _this = this;
		_this.$util.debounce(200,()=>{
			_this.pageScroll = scrollTop;
			// console.log(scrollTop);
		})
	},
}

export default mixin
