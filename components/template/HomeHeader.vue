<!-- 新版首页header -->
<template>
	<view class="home-header" :class="cContainerClassStr" :style="cContainerStyleStr">
		<!-- fixed在顶部的部分 -->
		<!-- 需要用sticky组件包一下 -->
		<view v-if="cFixedNavVisible" class="fixed-nav-wrapper" :style="cFixedNavStyleStr">
			<!-- 标题部分和搜索框部分 -->
			<view class="title-wrapper">
				<!-- 代理定位 -->
				<view v-if="cAgentVisible && agentJump" class="agent" @click="navigationTo('pages/subPages/address/aid')">
					<view　class="agent__icon iconfont iconfont icon-dingweixiao"></view>
					<view class="agent__text">{{agentName}}</view>
				</view>
				<view v-else-if="cAgentVisible" class="agent">
					<view class="agent__text">{{agentName}}</view>
				</view>
				<!-- 标题 -->
				<view class="title-wrapper__title" :style="titleStyle">{{title}}</view>
				<!-- 假的输入框 -->
				<view v-if="cInputWrapperVisible" class="input-wrapper" @click="baseMixin_navigationTo({url:'pages/subPages/category/index'})">
					<view class="iconfont icon-sousuo"></view>
					<view class="input-wrapper__text">{{inputPlaceholder}}</view>
				</view>
				<!-- 假的输入框 -->
			</view>
			<!-- 标题部分 end -->
			<!-- 分类 -->
			<view v-if="cCateWrapperVisible" class="cate-wrapper">
				<scroll-view class="cate-scroll" :style="cCateWrapperStyle" scroll-x>
					<view class="cate-list">
						<view class="cate-item" :class="{'is-active': index === cateActive}" v-for="(item,index) in cateData" v-key="item.id"
						 :id="item.id" @click="handleCateItemClick(item,index)">{{item.title}}</view>
					</view>
				</scroll-view>
				<view class="btn-cate-all" @click="baseMixin_navigationTo({url:'pages/subPages/category/index'})">全部</view>
			</view>
			<!-- 分类 end -->
		</view>
		<!-- fixed在顶部的部分 -->
		<!-- 随着滚动的部分 -->
		<!-- 轮播图 -->
		<swiper v-if="cBannerSwiperVisible" class="banner-swiper" :indicator-dots="false" autoplay :interval="3000">
			<swiper-item class="banner-swiper__item" v-for="(item,index) in swiperData" :key="item.id" @click="handleSwiperItemClick(item,index)">
				<image class="banner-swiper_img" :src="item.imgUrl"></image>
			</swiper-item>
		</swiper>
		<!-- 轮播图  end -->
		<!-- 随着滚动的部分 -->
	</view>
</template>

<script>
import baseMixin from '@/mixins/baseMixin.js'
export default {
    components: {},
    mixins: [baseMixin],
    props: {
        // 所在页面的scrollTop，关系到sticky
        scrollTop: {
            type: Number,
            default: 0
        },
        // 1: 默认, 2: 模式二, 3:模式三
        type: {
            type: [
                String,
                Number
            ],
            default: 3
        },
		cateVisible: {
			type: Boolean,
			default: false
		},
        // 导航栏的背景色
        navBgColor: {
            type: String,
            default: '#FFD940'
        },
        // 标题文字
        title: {
            type: String,
            default: ''
        },
        // 标题的样式
        titleStyle: {
            type: String,
            default: ''
        },
        // 输入框的文字
        inputPlaceholder: {
            type: String,
            default: '搜索好物'
        },
        // 分类的数据
        cateData: {
            type: Array,
            default() {
                return [
                    // 	{
                    // 	id: 'tuijian',
                    // 	title: '推荐',
                    // },
                ]
            }
        },
        // 默认选中的分类的索引（当其改变时会变data中的cateActive）
        cateDefaultActive: {
            type: Number,
            default: 0
        },
        // 轮播图的数据
        swiperData: {
            type: Array,
            default() {
                return [
                    // {
                    //     id: 'lunbo1',
                    //     imgUrl: 'http://placekitten.com/750/428'
                    // }
                ]
            }
        },
        // 代理的定位
        agentName: {
            type: String,
            default: ''
        },
		// 点击地址的时候是否跳转到选择代理的页面
		agentJump: {
			type: Boolean,
			default: true
		}
    },
    data() {
        return {
            // 分类当前选中的值(默认值为cateDefaultActive)
            cateActive: this.cateDefaultActive || 0
        }
    },
    watch: {
        // 当默认选中分类的索引改变时改变cateDefaultActive
        cateDefaultActive(val = 0) {
            this.cateActive = val
        }
    },
    computed: {
        // 是否显示代理定位
        cAgentVisible() {
            return !!this.agentName
        },
        // 是否显示输入框
        cInputWrapperVisible() {
            return [
                2,
                3
            ].indexOf(this.type) !== -1
        },
        // 是否显示分类
        cCateWrapperVisible() {
            console.log('cCateWrapperVisible--------', this.cateData.length)
            // return this.cateData.length && [
            //     2,
            //     3
            // ].indexOf(this.type) !== -1
			return this.cateVisible &&　this.cateData.length
        },
        // 是否显示轮播图
        cBannerSwiperVisible() {
            return [3].indexOf(this.type) !== -1
        },
        // cate当前选中项
        cCateItemActive() {
            return this.cateData[this.cateActive] || {}
        },
        // todo:看能不能全部写在css里面
        // 避免用API去取高度 故这样做(因为每种状态各个容器的高度都是写死的)
        // 分类的高度 rpx
        cCateHeight() {
            return this.cCateWrapperVisible ? 84 : 0
        },
        // 轮播的高度 rpx
        cBannerSwiperHeight() {
            return 428
        },
        /**
			 * fixed容器的高度 rpx
			 * type=1时：高度为状态栏+导航栏，type=2，3时，高度为高度为状态栏+导航栏+分类高度
			 */
        cFixedWrapperHeight() {
            if (this.type === 2 || this.type === 3) {
                return this.cCateHeight + this.baseMixin_cNavigationBarHeight + (this.baseMixin_cStatusBarHeight * this.baseMixin_cSystemInfo.
                    pixelRatio)
            }
            return this.baseMixin_cNavigationBarHeight + (this.baseMixin_cStatusBarHeight * this.baseMixin_cSystemInfo.pixelRatio)
        },
        /**
			 * 最外层容器应该有的高度
			 * type=1时：高度为状态栏+导航栏，type=2时，高度为高度为状态栏+导航栏+分类高度，type=3时，高度为轮播图的高度（428rpx）
			 */
        cContainerHeight() {
            // #ifdef H5 || MP-TOUTIAO
            if (!this.cFixedNavVisible) {
                return 0
            }
            // #endif
            if (this.type === 2) {
                return this.cCateHeight + this.baseMixin_cNavigationBarHeight + (this.baseMixin_cStatusBarHeight * 2)
            } else if (this.type === 3) {
                return 428
            }
            return this.baseMixin_cNavigationBarHeight + (this.baseMixin_cStatusBarHeight * 2)

        },
        // 分类容器的动态style
        cCateWrapperStyle() {
            let style = ''
            style += `height: ${this.cCateHeight}rpx`
            return style
        },
        // 最外层容器的动态class
        cContainerClassStr() {
            let classStr = ''
            classStr += ` is-type-${this.type}`
            classStr += ` is-platForm-${this.baseMixin_cPlatform}`
            classStr += this.scrollTop <= 0 ? ' is-relative' : ' is-fixed'
            classStr += this.type === 3 && this.scrollTop > this.cFixedWrapperHeight / this.baseMixin_cSystemInfo.pixelRatio
                ? ' has-bg' : ''
            classStr += this.cAgentVisible ? ' has-agent' : ''
            return classStr
        },
        // 最外层容器的动态style
        cContainerStyleStr() {
            let style = ''
            style +=
					`height:${this.cContainerHeight}rpx;`
            style += this.baseMixin_cThemeColor
            if ([
                1,
                2
            ].indexOf(this.type) !== -1) {
                // 排除高度计算不准确的影响
                style += `background-color: ${this.navBgColor};`
            }
            return style
        },
        // fixed-nav-wrapper容器的动态style
        cFixedNavStyleStr() {
            let style = ''
            // 状态栏高度
            style += `padding-top: ${this.baseMixin_cStatusBarHeight}px;`
            style += `background-color: ${this.navBgColor};`
            // 导航栏高度
            // style += `height: ${this.cFixedWrapperHeight}rpx;`
            return style
        },
        // 顶部导航是否显示
        cFixedNavVisible() {
            // #ifdef H5 || MP-TOUTIAO
            if (this.cAgentVisible || this.type !== 1) {
                return true
            }
            return false


            // #endif
            return true
        }
    },
    onLoad(options) {

    },
    mounted() {

    },
    methods: {
        // 分类项的点击事件
        handleCateItemClick(item, index) {
            this.cateActive = index
            this.$emit('on-cate-item-click', item, index)
        },
        // 轮播图的点击事件
        handleSwiperItemClick(item, index) {
            this.$emit('on-swiper-item-click', item, index)
        }
    }
}
</script>

<style lang="scss" scoped>
	.home-header {
		position: relative;

		&.is-type-1 {
			.title-wrapper {
				justify-content: space-around;
			}
		}

		&.is-type-2,
		&.is-type-3 {
			.title-wrapper {
				padding-left: 30rpx;
				padding-right: 240rpx;
				// #ifdef H5
				padding-right: 30rpx;
				// #endif
			}
		}

		&.has-agent {
			.title-wrapper {
				justify-content: flex-start;
			}
		}

		&.is-type-3.is-relative {
			.fixed-nav-wrapper {
				background-color: transparent !important;
			}
		}

		&.is-fixed {
			.fixed-nav-wrapper {
				position: fixed;
				left: 0;
				top: 0;
				right: 0;
				z-index: 99;
			}

			&.has-bg {
				.fixed-nav-wrapper {
					background-color: var(--theme-color, #fff);
				}
			}
		}
	}

	.fixed-nav-wrapper {
		box-sizing: border-box;
		position: relative;
		color: var(--auxiliary-color, #000);
		background-color: var(--theme-color, #fff);
		z-index: 20;
		z-index: 5;
		transition: background-color ease .3s;
	}

	.title-wrapper {
		display: flex;
		align-items: center;
		height: 88rpx;
		padding-left: 30rpx;
		padding-right: 30rpx;
	}
	.agent {
		display: flex;
		max-width: 160rpx;
		align-items: center;
		overflow: hidden;
		white-space: nowrap;
		margin-right: 30rpx;
	}
	.agent__text,.agent__icon {
		font-size: 30rpx;
	}
	.agent__text {
		flex: 1;
		min-width: 0;
		margin-left: 8rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.title-wrapper__title {
		flex-shrink: 0;
		max-width: 6em;
		font-size: 28rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		.is-type-1 & {
			max-width: 100%;
			font-size: 30rpx;
			font-weight: bold;
		}
	}

	.input-wrapper {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex: 1;
		height: 62rpx;
		margin-left: 20rpx;
		padding: 0 30rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
		background-color: #fff;
		border-radius: 31rpx;
	}

	.input-wrapper__text {
		flex: 1;
		width: 0;
		margin-left: 16px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	// 分类
	.cate-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.cate-scroll {
		box-sizing: border-box;
		width: 640rpx;
		flex: 1;
	}

	.cate-list {
		display: inline-flex;
		align-items: center;
		height: 84rpx;
	}

	.cate-item {
		box-sizing: border-box;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #000);
		white-space: nowrap;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;

		&.is-active {
			font-size: 40rpx;
			font-weight: bold;
		}
	}

	.btn-cate-all {
		position: relative;
		box-sizing: border-box;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #000);
		white-space: nowrap;
		text-align: center;

		&::after {
			position: absolute;
			content: "\20";
			left: -10rpx;
			top: -4rpx;
			bottom: -4rpx;
			width: 10rpx;
			background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1));
			border-top-left-radius: 4rpx;
			border-bottom-left-radius: 4rpx;
		}
	}

	// 分类 end
	// banner轮播
	.banner-swiper {
		position: absolute;
		left: 0;
		top: 0;
		width: 750rpx;
		height: 428rpx;
		z-index: 2;
	}

	.banner-swiper__item {
		width: 100%;
		height: 100%;
	}

	.banner-swiper_img {
		width: 100%;
		height: 100%;
	}

	// banner轮播 end
</style>
