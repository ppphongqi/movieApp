<template>
	<view class="diy-groups" :style="themeColor">
		<!-- 风格一 -->
		<block v-if="itemStyle.display == '1'">
			<view class="es-seckill-group style-row">
				<!-- <view class="flex es-seckill-title">
					<view class="title"><text class="seckill-title">拼团商品</text></view>
					<view @click="toGroupMore">查看更多 <view class="iconfont icon-jinrujiantou1"></view></view>
				</view> -->
				<view class="group">
					<view class="flex-row flex-warp">
						<view class="es-seckill-col" v-for="(groupItem,groupIndex) in groupsData" :key="groupIndex" @click="toGoodsInfo(groupItem.goods_id, groupItem.groups_id)">
							<view class="image img-center" :style="{'background-image':'url('+ (groupItem.image?groupItem.image.file_path:'') + ')'}">
								<text class="group-tip">{{groupItem.group_number}}人团</text>
							</view>

							<view class="detail">
								<view class="title line-hide twolist-hidden">{{groupItem.goods_name}}</view>
								<view class="subtitle line-hide flex-row flex-justify-b flex-align-c">
									<text class="sub-price"><text class="icon">{{settingData.currency}}</text>{{groupItem.groups_price}}</text>
									<!-- <text class="sub-price line-through"><text class="icon">已拼{{groupItem.already_spell}}件</text></text> -->
								</view>
								<view class="subtitle line-hide flex-row flex-justify-b flex-align-c">
									<text class="sub-price line-through">
										<text class="icon" style="white-space: nowrap;">单购价:{{settingData.currency}}{{groupItem.original_price}}</text>
									</text>
									<view class="group-btn">
										<text class="sub-price line-through"><text class="icon">已拼{{groupItem.already_spell}}件</text></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 风格二 -->
		<block v-if="itemStyle.display == '2'">
			<view class="es-seckill-group style-col">
				<!-- <view class="flex es-seckill-title">
					<view class="title"><text class="seckill-title">拼团商品</text></view>
					<view @click="toGroupMore">查看更多 <view class="iconfont icon-jinrujiantou1"></view></view>
				</view> -->
				<view class="group">
					<view>
						<view class="es-seckill-col flex-row" v-for="(groupItem,groupIndex) in groupsData" :key="groupIndex" @click="toGoodsInfo(groupItem.goods_id, groupItem.groups_id)">
							<view class="image img-center" :style="{'background-image':'url('+ groupItem.image.file_path + ')'}">
							</view>
							<view class="detail flex-col flex-justify-b">
								<view class="flex-col">
									<view class="title  line-hide"><text class="twolist-hidden">{{groupItem.goods_name}}</text></view>
									<view class="flex-row flex-align-c">
										<text class="orders-gray">已拼{{groupItem.already_spell}}件</text>
										<text class="sales-btn">{{groupItem.group_number}}人团</text>
									</view>
								</view>
								<view class="sales-num">
									<view class="flex-row flex-justify-b flex-align-c">
										<view>
											<view class="subtitle line-hide">
												<view>
													<text class="sub-price"><text class="icon">{{settingData.currency}}</text>{{groupItem.groups_price}}</text>
												</view>
											</view>
											<view class="orders-gray">单购价:
												{{settingData.currency}}{{groupItem.original_price}}</view>
										</view>
										<view class="flex-row flex-align-c">
											<view class="group-btn col-list help-bg-color auxiliary-color"><text>去拼团</text></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
	</view>
</template>

<script>
	import App from "@/common/js/app.js"
	export default {
		data() {
			return {
				currentIndex: 1,
			};
		},
		props: {
			itemIndex: Number,
			itemStyle: Object,
			params: Object,
			itemData: Array
		},
		components: {

		},
		computed: {
			groupsData() {
				if (this.itemData.length > 0) {
					return this.itemData.filter(val => val.status !== 3);
				}
			}
		},
		beforeCreate() {

		},
		onLoad(options) {

		},

		onShow() {

		},
		mounted() {

		},
		methods: {
			toGroupMore() {
				App.navigationTo({
					url: "pages/subPages/groups/more/more"
				})
			},
			toGoodsInfo(goods_id, group_id) {
				App.navigationTo({
					url: "pages/subPages/goods/index/index?goods_id=" + goods_id + (!!group_id ? '&group_id=' + group_id : '')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.diy-groups {
		.es-seckill-group {
			background: #ffffff;
			overflow: hidden;
		}

		.twolist-hidden {
			white-space: normal;
		}

		.icon-jinrujiantou1 {
			display: inline-block;
			vertical-align: middle;
			line-height: 1;
			font-size: 30upx;
			margin-left: 5upx;
		}

		.orders-gray {
			color: #999;
		}

		.flex,
		.flex-column {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
		}

		.pos-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			-webkit-transform: translate(-50%, -50%);
			-ms-transform: translate(-50%, -50%);
			-moz-transform: translate(-50%, -50%);
			-o-transform: translate(-50%, -50%);
		}

		.pos-row-center {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			-webkit-transform: translateX(-50%);
			-ms-transform: translateX(-50%);
			-moz-transform: translateX(-50%);
			-o-transform: translateX(-50%);
		}

		.pos-col-center {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			-webkit-transform: translateY(-50%);
			-ms-transform: translateY(-50%);
			-moz-transform: translateY(-50%);
			-o-transform: translateY(-50%);
		}

		.img-center {
			background-position: center;
			background-size: cover;
			background-repeat: no-repeat;
		}

		.flex-row {
			display: -webkit-box;
			/* 老版本语法: Safari, iOS, Android browser, older WebKit browsers.  */
			display: -moz-box;
			/* 老版本语法: Firefox (buggy)  */
			display: -ms-flexbox;
			/* 混合版本语法: IE 10    */
			display: -webkit-flex;
			/* 新版本语法: Chrome 21+ */
			display: flex;
			/* 新版本语法: Opera 12.1, Firefox 22+ */
			-webkit-box-orient: horizontal;
			-webkit-flex-direction: row;
			-ms-flex-direction: row;
			flex-direction: row;
		}

		.flex-warp {
			flex-wrap: wrap;
		}

		.flex-row-reverse {
			flex-direction: row-reverse;
		}

		.inline {
			display: inline-block;
		}

		.flex-col {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-orient: vertical;
			-webkit-flex-direction: column;
			-ms-flex-direction: column;
			flex-direction: column;
		}

		.flex-col-reverse {
			flex-direction: column-reverse;
		}

		.flex-align-s {
			align-items: flex-start;
		}

		.flex-align-c {
			align-items: center;
		}

		.flex-align-e {
			align-items: flex-end;
		}

		.flex-justify-s {
			justify-content: flex-start;
		}

		.flex-justify-c {
			justify-content: center;
		}

		.flex-justify-e {
			justify-content: flex-end;
		}

		.flex-justify-b {
			justify-content: space-between;
		}

		.flex-grow-1 {
			flex-grow: 1
		}

		.flex-justify-a {
			justify-content: space-around;
		}

		.no-nowrap {
			white-space: nowrap;
		}

		.scale-grow {
			width: 0;
			flex-grow: 1;
		}

		.group-btn {
			color: #fff;
			padding: 0 6px;
			line-height: 22px;
			border-radius: 8px;
			font-size: 12px;
			height: 22px;

			&.col-list {
				background: #fd463e;
				width: 75px;
				padding: 5upx 0;
				text-align: center;
				color: #fff;
				font-weight: bold;
				border-radius: 14px;
			}
		}

		.es-seckill-title {
			margin: 20px 20px 6px;
			height: 22px;
			font-size: 11px;
			-webkit-box-pack: justify;
			-webkit-justify-content: space-between;
			-ms-flex-pack: justify;
			justify-content: space-between;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
		}

		.es-seckill-title .title {
			.seckill-title {
				font-size: 18px;
				font-weight: 700;
				color: #3d404d;
				background: #fff;
			}

			font-size: 16px;

			image {
				vertical-align: middle;
				zoom: .5;
			}

			&+view {
				color: #999;
				margin-right: -5px;
			}
		}

		.es-seckill-title text {
			background: #fff;
			display: inline-block;
			color: #333;
			text-align: center;
			line-height: 18px;
			width: 17px;
		}

		.es-seckill-title text:first-of-type {
			width: auto;
			background: #fe504f;
			color: #fff;
			font-size: 12px;
			margin-right: 8px;
			padding: 1px 3px;
		}

		.es-seckill-group.style-row .group {
			overflow: hidden;

			&>view {
				font-size: 0;
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col {
			display: inline-block;
			padding: 0 30upx;
			width: 50%;
			box-sizing: border-box;
			border-radius: 2px;

			&:nth-of-type(odd) {
				padding-right: 15upx;
			}

			&:nth-of-type(even) {
				padding-left: 15upx;
			}

			.image {
				position: relative;
				padding-bottom: 100%;
				// background: url('/static/images/ordergl.png');
				margin: 4px 0 8px;
				width: 100%;
				// border: 1px solid #e5e5e5;
				border-radius: 3px;

				.group-tip {
					display: inline-block;
					white-space: nowrap;
					position: absolute;
					color: #ffffff;
					font-size: 24upx;
					top: 25upx;
					height: 38upx;
					height: 38upx;
					font-weight: 500;
					padding: 0 5upx;
					left: 0;
					z-index: 2;
					background: linear-gradient(90deg, rgba(254, 80, 79, 1), rgba(254, 133, 79, 1));
					/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
					border-radius: 6upx 0 6upx 0;
				}

				image {
					height: 100%;
					width: 100%;
					object-fit: cover;
					border-radius: 10px;
					display: block;
				}
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col .image text {
			line-height: 16px;
			padding: 0 6px;
			border-radius: 0 5px 0 0;
			background: #fd463e;
			color: #fff;
			position: absolute;
			display: none;
			bottom: 0;
			left: 0;
			font-weight: 700;
			font-size: 12px;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail {
			width: 100%;
			font-size: 12px;
			padding-bottom: 20px;

			.title {
				height: 80upx;
				line-height: 40upx;
				margin-bottom: 10upx;
				font-size: 14px;
				overflow: hidden;
			}

			.subtitle {
				height: 24px;
				line-height: 1;

				.sub-price {
					font-size: 14px;

					.icon {
						font-size: 12px;
					}

					&:not(.line-through) {
						font-size: 20px;
						color: #fd463e;
						font-weight: 600;
					}

					&.line-through {
						color: #999;
						text-decoration: none;
					}
				}
			}

			.sales-num {
				.num {
					font-size: 14px;
					color: #999;
				}

				.progress {
					width: 50px;
					height: 10px;
					border-radius: 10px;
					line-height: 10px;
					background: rgb(242, 242, 242);

					.progress-num {
						display: inline-block;
						background: #fd463e;
						width: 40%;
						height: 10px;
						border-radius: 10px;
					}
				}
			}
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price .num {
			color: #999ca7;
			font-size: 9px;
			line-height: 25px;
			margin-left: 6px;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price .flex {
			-webkit-box-pack: start;
			-webkit-justify-content: flex-start;
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.es-seckill-group.style-row .group .es-seckill-col .detail .price text {
			font-size: 16px;
		}

		//   style2
		.es-seckill-group.style-col .group {
			overflow: hidden;

			&>view {
				white-space: nowrap;
				font-size: 0;
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col {
			padding: 0 15px;
			box-sizing: border-box;
			border-radius: 2px;
			margin-bottom: 10px;
			// border-bottom: 1px solid #999;
			// padding-bottom: 12px;

			.image {
				position: relative;
				margin: 4px 0 4px;
				// border: 1px solid #e5e5e5;
				border-radius: 5px;
				height: 115px;
				width: 115px;
				// .group-tip{
				// 	display: inline-block;
				// 	white-space: nowrap;
				// 	position: absolute;
				// 	color: #ffffff;
				// 	font-size: 24upx;
				// 	top: 25upx;
				// 	height:38upx;
				// 	height:38upx;
				// 	font-weight:500;
				// 	padding: 0 5upx;
				// 	left: 0;
				// 	z-index: 2;
				// 	background:linear-gradient(90deg,rgba(254,80,79,1),rgba(254,133,79,1));
				// 	/* box-shadow:0 2upx 10upx 0 rgba(254,80,79,0.54); */
				// 	border-radius:6upx 0 6upx 0;
				// }
				// image {
				// 	height: 95px;
				// 	width: 95px;
				// 	object-fit: cover;
				// 	border-radius: 10px;
				// 	display: block;
				// }
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col .image text {
			line-height: 16px;
			padding: 0 6px;
			border-radius: 0 5px 0 0;
			background: #fd463e;
			color: #fff;
			position: absolute;
			display: none;
			bottom: 0;
			left: 0;
			font-weight: 700;
			font-size: 12px;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail {
			width: 0;
			height: 135px;
			flex-grow: 1;
			font-size: 12px;
			margin-left: 15px;
			margin-right: 0;

			.title {
				font-size: 14px;
				margin: 5px 0;
				// height: 80upx;
				overflow: hidden;
				text-overflow: ellipsis;
				width: 215px;
				color: #495060;
				// margin-bottom: 22upx;
			}

			.sales-num {
				padding-bottom: 10px;
				border-bottom: .5px solid #e5e5e5;
			}

			.sales-btn {
				display: inline-block;
				margin-left: 4px;
				border: 1px solid #fd463e;
				color: #fd463e;
				padding: 0 6px;
				font-size: 24upx;
				height: 30upx;
				line-height: 28upx;
				padding: 0px 8px;
				border-radius: 4px;
				margin-right: 8px;
				font-size: 24upx;
			}

			.subtitle {
				.sub-price {
					font-size: 14px;

					.icon {
						font-size: 12px;
					}

					&:not(.line-through) {
						font-size: 17px;
						color: #fd463e;
						font-weight: 600;
					}

					&.line-through {
						color: #999;
						text-decoration: line-through;
					}
				}
			}

			.progress-box {
				position: relative;
				height: 15px;
				margin-bottom: 15px;

				.progress {
					width: 55%;
					height: 15px;
					border-radius: 10px;
					line-height: 16px;
					text-align: center;
					background-color: #f7cfcd;

					.progress-num {
						color: #fff;
						display: inline-block;
						height: 15px;
						border-radius: 10px;
					}
				}
			}
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price .num {
			color: #999ca7;
			font-size: 9px;
			line-height: 25px;
			margin-left: 6px;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price .flex {
			-webkit-box-pack: start;
			-webkit-justify-content: flex-start;
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.es-seckill-group.style-col .group .es-seckill-col .detail .price text {
			font-size: 16px;
		}
	}
</style>
