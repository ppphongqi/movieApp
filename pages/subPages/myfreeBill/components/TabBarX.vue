<!-- 智能化的团购专用底部菜单 从vuex里面读取相关配置 -->
<template>
	<u-tabbar
		v-model="active"
		:list="navData"
		border-top
		inactive-color="#999999"
		active-color="#333333"
		@change="handleChange"
		height="100rpx"></u-tabbar>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            // 导航的数据
            navData: [
                // {
                //     id: '',
                //     iconPath: '',
                //     selectedIconPath: '',
                //     text: '',
                //     routePath: ''
                // }
            ],
            // 当前选中项的索引
            active: -1

        }
    },
    computed: {
        cStoresNavData() {
			const bottom = this.$store.state.cgp.setting && this.$store.state.cgp.setting.bottom || {}
			return Object.keys(bottom).map(key=>{
				const item = bottom[key]
				return {
					id: key,
					iconPath: item.unselect_image,
					selectedIconPath: item.select_image,
					text: item.text,
					routePath: item.path
				}
			})
        }
    },
	watch: {
		cStoresNavData(val) {
			this.navData = val || []
			console.log('cStoresNavData watch',this.navData)
			this.setActiveByUrl()
		}
	},
    methods: {
        // 根据当前页面的路径设置激活项
        setActiveByUrl() {
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            const route = currentPage.route
            this.active = this.navData.findIndex(item => item.routePath === route)
        },
        handleChange(index) {
            if (index !== this.active) {
				const item  = this.$util.deepGet(this.navData, `${index}`, {})
				let url = item.routePath
				console.log('item.id',item.id)
				if(item.id === 'index') {
					url += '?page_id='+(this.$store.state.cgp.setting && this.$store.state.cgp.setting.diy_page_id)

				}
				console.log('url',item.id)
                App.navigationTo({
                    url,
                    redirectTo: true
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
