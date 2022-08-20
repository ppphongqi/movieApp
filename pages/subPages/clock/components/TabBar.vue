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
                {
                    id: '首页',
                    iconPath: require('../static/images/icon-clock-tabbar--home.png'),
                    selectedIconPath: require('../static/images/icon-clock-tabbar--home--active.png'),
                    text: '首页',
                    routePath: 'pages/subPages/clock/index',
					redirectTo: true
                },
                {
				    id: '排行榜',
				    iconPath: require('../static/images/icon-clock-tabbar--rank.png'),
				    selectedIconPath: require('../static/images/icon-clock-tabbar--rank--active.png'),
				    text: '排行榜',
				    routePath: 'pages/subPages/clock/rank',
					redirectTo: true
                },
                {
				    id: '我的',
				    iconPath: require('../static/images/icon-clock-tabbar--mine.png'),
				    selectedIconPath: require('../static/images/icon-clock-tabbar--mine--active.png'),
				    text: '我的',
				    routePath: 'pages/subPages/clock/mine',
					redirectTo: true
                }
            ],
            // 当前选中项的索引
            active: -1

        }
    },
    mounted() {
        this.setActiveByUrl()
    },
    methods: {
        // 根据当前页面的路径设置Url
        setActiveByUrl() {
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            const route = currentPage.route
            this.active = this.navData.findIndex(item => item.routePath === route)
        },
        handleChange(index) {
            if (index !== this.active) {
				const item = this.navData[index]
                App.navigationTo({
                    url: item.routePath,
                    redirectTo: item.redirectTo
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
