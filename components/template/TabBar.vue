<template>
	<!-- :style="{ background: tabStyle ? tabStyle.bgcolor : '#ffffff', 'padding-bottom': isIphoneX ? '20px' : '' }" -->
	<view class="">
		<view
			class="diy-tabbar border-line border-top "
			v-if="isPage"
			:style="{ zIndex: zIndex,background: tabStyle ? tabStyle.bgcolor : '#ffffff', 'padding-bottom': isIphoneX ? '20px' : '' }"
		>
			<view
				class="tabbar-item"
				:style="{ color: current === index ? tabStyle.textcoloron : tabStyle.textcolor }"
				v-for="(item, index) in tabList"
				:key="index"
				@click="onTabItem(item)"
			>
				<image class="image" :src="current === index ? item.selectedIconPath : item.iconPath">
					<text class="order-badge" v-if="item.name == 'cart' && (request_num > 0 || newcNum > 0)">{{ !!request_num ? request_num : newcNum }}</text>
				</image>
				<view class="tabbat-item-text">{{ item.text }}</view>
			</view>
		</view>
		<view class="hidden-tab">{{ tabBar }}</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
export default {
    data() {
        return {
            list: null,
            tabStyle: null,
            isPage: true,
            current: -1,
            tabList: [],
            request_num: ''
        }
    },
    props: {
        cNum: {

            default: function () {
                return 0
            }
        },
		zIndex: {
			type: [Number,String],
			default: 199
		}
    },
    computed: {
        newcNum: {
            get() {
                return this.cNum
            },
            set(val) {
                this.request_num = val
            }
        },
        tabBar() {
            let tabData = this.$store.state.tabBar
			// 计算属性里面调用外部方法？？？？
			this.$nextTick(()=>{
				!!tabData && this.setTabData(tabData)
			})
            return tabData || {}

        }
    },
    methods: {
        setTabData(tabBar) {
            if (tabBar) {
                let { list, style, checkList } = tabBar,
                    pages = getCurrentPages(),
                    currentPage = pages[pages.length - 1],
                    pageRoute = currentPage.route || currentPage.__route__,
                    currentIndex = list.findIndex(item => {
						
                        const pagePath = this.$util.deepGet(item,'pagePath.path','') || item.pagePath || ''
						// 如果是diy页面
						if(pagePath.indexOf("pages/mainPages/index/diypage") === 0) {
							console.log(222,pagePath,`${pageRoute}?page_id=${currentPage.options && currentPage.options.page_id}`)
							return pagePath === `${pageRoute}?page_id=${currentPage.options && currentPage.options.page_id}`
						}
                        return pagePath.indexOf(pageRoute) === 0
                    } )
                
                // page = list.filter(item => item.pagePath === pageRoute)[0];
                this.tabStyle = style
                for (var i in list) {
                    if (list[i].name == 'cart') {
                        this.getCartNum('20')
                    }
                }
                if (pageRoute == 'pages/subPages/goodshop/goodshop' || pageRoute == 'pages/subPages/shopDetail/goodShop') {
                    currentIndex = list.findIndex(item => {
						return item.pagePath == 'pages/subPages/goodshop/goodshop' || item.pagePath == 'pages/subPages/shopDetail/goodShop'
					})
					
                }
                this.current = currentIndex
                let flag = false
                console.log(checkList, '==========checkList')
                checkList.forEach(item => {
                    if (item.path == pageRoute) {
                        flag = true
                    }
                })
                this.isPage = flag
                this.tabList.splice(0, list.length, ...list)
                console.log(this.tabList, 'this.tabList')
                // #ifndef MP-TOUTIAO
                uni.setNavigationBarTitle({
                    title: currentPage.text
                })
                // #endif
                // if (!!page) {
                // 	this.current = currentIndex;
                // 	console.log(this.current ,'this.current ==============')
                // 	this.isPage = checkList.includes(page.name);
                // 	this.tabList.splice(0, list.length, ...list);
                // 	console.log(this.tabList,'this.tabList')
                // 	// #ifndef MP-TOUTIAO
                // 	uni.setNavigationBarTitle({
                // 		title: page.text
                // 	});
                // 	// #endif
                // } else {
                // 	console.log( '1111 ==============')
                // 	let tabBarLinks = App.getTabBarLinks(),
                // 		isTabItem = tabBarLinks.findIndex(item => item === pageRoute),
                // 		haveIndex = list.filter(item => item.pagePath === 'pages/mainPages/index/index').length !== 0,
                // 		url = list[0].pagePath;
                // 		console.log(tabBarLinks,isTabItem,haveIndex,url,'this.current11 ==============')
                // 	if (isTabItem !== -1 && !haveIndex) {
                // 		// #ifdef H5
                // 		url += '?i=' + App.getUniacid();
                // 		// #endif
                // 		uni.reLaunch({
                // 			url: '/' + url
                // 		});
                // 	}
                // }

            }
        },
        onTabItem(urlItem) {
            this.navigationTo(urlItem.pagePath)
        },
        getCartNum(type) {
            let _this = this
            App._get(
                'cart/lists',
                {
                    no_login: 1,
                    type
                },
                result => {
                    let { cart_num } = result.data
                    _this.newcNum = cart_num[0] + cart_num[1] + cart_num[2]
                }
            )
        }
    },
    watch: {
        newcNum: {
            handler(newData, oldData) {
                if (newData !== oldData) {
                    this.request_num = newData
                }
            }
        }
    }
}
</script>

<style>
.order-badge {
	position: absolute;
	top: 5rpx;
	font-size: 22rpx;
	background: #ff495e;
	text-align: center;
	line-height: 28rpx;
	color: #fff;
	border-radius: 100%;
	min-height: 30rpx;
	min-width: 30rpx;
	padding: 1rpx;
	margin-left: 20px;
}

.diy-tabbar {
	border-color: rgba(0, 0, 0, 0.33);
	position: fixed;
	z-index: 199;
	height: 96upx;
	background-color: rgb(255, 255, 255);
	color: rgb(110, 109, 107);
	bottom: 0;
	width: 100%;
	display: flex;
}

.tabbar-item {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	flex: 1;
	padding: 10upx 0 0;
	font-size: 0;
	color: #6e6d6b;
	text-align: center;
	z-index: 5;
}

.tabbar-item.item-on {
	/* color: #fd4a5f; */
}

.tabbar-item .image {
	display: inline-block;
	width: 50upx;
	height: 50upx;
}

.tabbat-item-text {
	padding-top: 0;
	padding-bottom: 0;
	font-size: 20upx;
	line-height: 1.8;
	text-align: center;
}

.hidden-tab {
	position: fixed;
	bottom: -100vh;
	z-index: -999;
	opacity: 0;
	visibility: hidden;
}
</style>
