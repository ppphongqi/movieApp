<!-- 探店首页 -->
<template>
	<view class="explore-container" :style="themeColor">
		<page-nav-bar @navItemClick="exploreChange" :nav-list="navList" :current="exploreType" fixed="1"></page-nav-bar>
		<block v-if="exploreType === 0">
			<!-- 话题列表 -->
			<scroll-view scroll-x="true" class="topics-list">
				<view class="topic-item" v-for="(item,index) in 6" :key="index" :style="{'background-image':'url(http://photocdn.sohu.com/20120323/Img338614056.jpg)'}">
					<view class="topic-title col-f dis-flex flex-dir-column flex-x-center ">
						<view class="topic-text f-26">家庭话题</view>
						<view class="topic-num f-24">100家好店</view>
					</view>
				</view>
			</scroll-view>
			<!-- 热门探店 -->
			<view class="explore-title dis-flex flex-y-center">
				<image src="/static/images/explore/hots.png" class="explore-title-icon"></image>
				<view class="col-3 f-28 m-left12">本周热门探店</view>
			</view>
			<scroll-view scroll-x="true" class="hots-list">
				<view class="hots-item p-r" v-for="(item,index) in 6" :key="index" :style="{'background-image':'url(https://weliam-test-1256186923.cos.ap-chengdu.myqcloud.com/image/2019/08/20190827100743c4d758878.jpg)'}">
					<view class="hots-store">
						<view class="store-name dis-flex flex-y-around col-f f-22">
							<view class="iconfont icon-shop"></view>
							<view class="">二龙转老火锅</view>
						</view>
						<view class="store-users col-f f-22 dis-flex flex-y-center">
							<view class="user-list dis-flex flex-y-center">
								<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
								 class="user-item"></image>
								<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
								 class="user-item"></image>
								<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
								 class="user-item"></image>
							</view>
							<view class="">1311人浏览</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 帖子列表 -->
			<view class="explore-title dis-flex flex-y-center">
				<image src="/static/images/explore/recommend.png" class="explore-title-icon"></image>
				<view class="col-3 f-28 m-left12">本周热门探店</view>
				<view class="col-9 f-26 m-left12">当地达人正在分享逛吃体验</view>
			</view>
		</block>
		<view class="post-list m-left-right-30" v-if="exploreType !== 2" :style="{'margin-top':exploreType === 0?0:'120rpx'}">
			<view class="post-item" v-for="(item,index) in imgs" :key="index">
				<image :src="item" class="post-img" mode="widthFix"></image>
				<view class="post-info b-f">
					<view class="post-title f-28 twolist-hidden">今晚很嗨呀·好久没有唱歌咯，这家烤鱼正儿八经的好久没有唱歌咯，这家烤鱼正儿八经的好久没有唱歌咯，这家烤鱼正儿八经的</view>
					<view class="post-store dis-flex flex-y-around col-9 f-22 m-top12">
						<view class="iconfont icon-shop f-24"></view>
						<view class="">二龙转老火锅</view>
					</view>
					<view class="dis-flex flex-x-between flex-y-center m-top12">
						<view class="poster-author dis-flex flex-y-center">
							<image src="https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erCztSdax7nDKM0G0kmWDCJJda8AjUVK0BuwQia2HB7voUNe72kuqBBhHLMCul0hl90l0cwziagicKNw/132"
							 class="author-avatal m-right12"></image>
							<view class="col-9 f-24">名扬天下</view>
						</view>
						<view class="dis-flex flex-y-center col-9">
							<view class="iconfont icon-appreciatefill"></view>
							<view class="f-24">赞</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 我的帖子 -->
		<view class="my-post-list" v-if="exploreType === 2">
			<PostItem></PostItem>
		</view>
		<page-loading ref="loading"></page-loading>
	</view>
</template>

<script>
	import PageNavBar from "@/components/template/PageNavBar2.vue"
	import PostItem from "@/components/template/PostItem.vue"
	import App from "@/common/js/app.js";
	export default {
		data() {
			return {
				navList: [{
						id: 0,
						title: "推荐",
					},
					{
						id: 1,
						title: "视频",
					},
					{
						id: 2,
						title: "我的",
					}
				],
				exploreType: 2,
				imgs: [
					"/static/images/explore/test/1.png",
					"/static/images/explore/test/2.png",
					"/static/images/explore/test/3.png",
					"/static/images/explore/test/1.png",
					"/static/images/explore/test/4.png",
					"/static/images/explore/test/5.png",
					"/static/images/explore/test/1.png",
				]
			};
		},
		components: {
			PageNavBar,
			PostItem
		},
		computed: {

		},
		onLoad(options) {
			App.hideLoading();
		},
		methods: {
			exploreChange(e) {
				this.exploreType = e.id;
				uni.pageScrollTo({
					duration: 0,
					scrollTop: 0
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$spacing:30rpx;
	$spacing-light:20rpx;
	$border-radius:10rpx;

	.explore-container {
		.iconfont {
			width: 1em;
			height: 1em;
			line-height: 1em;
		}
	}


	// 话题列表
	.topics-list {
		margin-top: 120rpx;
		white-space: nowrap;
	}

	.topic-item {
		display: inline-block;
		width: 32%;
		height: 120rpx;
		border-radius: $border-radius;
		margin-left: $spacing-light;
		overflow: hidden;
		background-size: 100% 100%;

		&:first-child {
			margin-left: $spacing;
		}

		.topic-title {
			height: 120rpx;
			box-sizing: border-box;
			padding-left: $spacing-light;
			background-image: linear-gradient(to right, #844C2B 58%, transparent);
		}

		&:nth-child(2n) {
			.topic-title {
				background-image: linear-gradient(to right, #333C65 58%, transparent);
			}
		}
	}

	.explore-title {
		margin: $spacing;

		.explore-title-icon {
			width: 44rpx;
			height: 44rpx;
			display: inline-block;
		}
	}

	// 热门探店
	.hots-list {
		white-space: nowrap;

		.hots-item {
			width: 32%;
			height: 308rpx;
			display: inline-block;
			border-radius: $border-radius;
			margin-left: $spacing-light;
			overflow: hidden;
			background-size: 100% 100%;

			&:first-child {
				margin-left: $spacing;
			}

			.hots-store {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				height: 74rpx;
				padding: 10rpx;
				background-image: linear-gradient(to top, #000000, transparent);

				.iconfont {
					font-size: 26rpx;
					margin-right: 10rpx;
				}

				.user-item {
					width: 28rpx;
					height: 28rpx;
					display: block;
					border-radius: 50%;
					border: 1rpx solid #FFFFFF;

					&:not(:first-child) {
						margin-left: -8rpx;
					}
				}

			}
		}
	}

	// 帖子列表
	.post-list {
		column-count: 2;
		column-gap: 30rpx;

		.post-item {
			break-inside: avoid;
			border-radius: $border-radius;
			overflow: hidden;
			margin-bottom: $spacing;

			.post-img {
				width: 100%;
				border-radius: $border-radius $border-radius 0 0;
				display: block;
			}

			.author-avatal {
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
				display: block;
			}

			.post-info {
				padding: $spacing-light;

				.post-store {}
			}
		}
	}

	// 我的帖子
	.my-post-list {
		margin: 120rpx 30rpx 30rpx;
		margin-top: 20rpx;
	}
</style>
