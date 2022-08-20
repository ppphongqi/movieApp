<template>
	<u-tabbar
		v-model="active"
		:list="navData"
		border-top
		inactive-color="#9A9A9A"
		active-color="#FF4444"
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
                    iconPath: require('../static/images/icon-coupon-nav-home.png'),
                    selectedIconPath: require('../static/images/icon-coupon-nav-home.png'),
                    text: '首页',
                    routePath: 'pages/mainPages/index/index'
                },
                {
				    id: '领券',
				    iconPath: require('../static/images/icon-coupon-nav-receive.png'),
				    selectedIconPath: require('../static/images/icon-coupon-nav-receive--active.png'),
				    text: '领券',
				    routePath: 'pages/subPages/couponCenter/index'
                },
                {
				    id: '我的券',
				    iconPath: require('../static/images/icon-coupon-nav-mine.png'),
				    selectedIconPath: require('../static/images/icon-coupon-nav-mine--active.png'),
				    text: '我的券',
				    routePath: 'pages/subPages/couponCenter/myList'
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
                App.navigationTo({
                    url: this.$util.deepGet(this.navData, `${index}.routePath`, ''),
					redirectTo: true
                })
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>
