<template>
	<view :style="themeColor">
		<view v-if="isShow">
			<view class="comment-detail-box b-f">
				<comment-item type="detail" :comment_detail="comment_detail"></comment-item>
				<view class="comment-praise dis-flex flex-y-center flex-x-center" @click="givelike(options.comment_id)">
					<view class="iconfont icon-appreciatefill"></view>
					<view class="f-24">{{isgl}}</view>
				</view>
			</view>
			<view class="comment-other" v-if="options.comment_type!=='single' && othercomment_detail.length>0">
				<view class="module-title">其他精彩好评</view>
				<view class="comment-other-info b-f">
					<block v-for="(otercommentItem,index) in othercomment_detail" :key="index">
						<comment-item type="other" :comment_detail="otercommentItem"></comment-item>
					</block>
					<!-- 				<view class="comment-all dis-flex flex-y-center flex-x-center">
						<view class="col-3 f-28" @click="gateBack">查看全部评论</view>
						<view class="iconfont icon-jinrujiantou1"></view>
					</view> -->
				</view>
			</view>
		</view>
		<block v-if="options.comment_type!=='single'">
			<ShareView ref="shareView" :pid="options.comment_id" :poster-type="'evaluate'" viewStyle="2"></ShareView>
		</block>
	</view>

</template>

<script>
	import App from '@/common/js/app.js';
	import CommentItem from "@/components/template/CommentItem.vue";
	import ShareView from "@/components/template/ShareView.vue"
	// #ifdef H5
	import wxApi from "@/static/h5/wxApi.js"
	// #endif
	export default {
		data() {
			return {
				options: {},
				comment_detail: {},
				othercomment_detail: [],
				isgl: null,
				isShow: false,
				shareData: null
			};
		},
		components: {
			CommentItem,
			ShareView
		},
		computed: {

		},
		beforeCreate() {

		},
		onLoad(options) {
			this.options = {
				'comment_type': options.comment_type,
				'comment_id': options.comment_id
			}
		},

		onShow() {
			this.getCommentdetail(this.options.comment_id)
		},
		mounted() {

		},
		methods: {
			getCommentdetail(comment_id) {
				let _this = this,
					url = 'Comment/commentDetail'
				App._get(url, {
					comment_id,
					no_login: 1
				}, (result) => {
					console.log(result, '评论详情')
					let data = result.data;
					_this.setShareData(data)
					_this.setData({
						isgl: !!data.fabulous_id ? '已点赞' : '赞一下',
						comment_detail: data,
						othercomment_detail: data.otherComment,
						isShow: true
					});
				}, false, () => {

				});
			},
			setShareData(detail) {
				let clientType = App.getClientType(),
					options = {
						...this.options,
						i: App.getUniacid(),
						referee_id: this.globalSaveRefereeId
					},
					shareData = null;
				if (clientType === "4") {
					jWeixin.ready(() => {
						wxApi.wxShare({
							title: `${detail.nickName}邀请您来看看他(她)的商品评价~`, // 分享标题
							desc: detail.content, // 分享描述
							link: `${App.siteInfo.siteroot}h5/#/pages/subPages/comment/detail?${App.urlEncode(options)}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: detail.recommend_goods.image ? detail.recommend_goods.image.file_path : "",
						});
					});
				} else {
					shareData = {
						title: `${detail.nickName}邀请您来看看他(她)的商品评价~`,
						imageUrl: detail.recommend_goods.image ? detail.recommend_goods.image.file_path : "",
						path: `/pages/subPages/comment/detail?${App.urlEncode(options)}`
					};
				}
				this.shareData = shareData;
			},
			givelike(comment_id) {
				let that = this;
				App._get('Comment/fabulous', {
					comment_id
				}, (result) => {
					if (result.data === 1) {
						that.$set(that, 'isgl', '赞一下')
						App.showSuccess('取消点赞');
					} else if (result.data === 2) {
						that.$set(that, 'isgl', '已点赞')
						App.showSuccess('点赞成功');
					}
				})
			},
			gateBack() {
				uni.redirectTo({
					url: '/pages/subPages/comment/index'
				});
			}
		},
		onShareAppMessage(res) {
			return this.shareData;
		}
	}
</script>

<style>
	.comment-detail-box {
		margin: 20upx 30upx 30upx;
		border-radius: 20upx;
		padding-bottom: 30upx;
	}

	.comment-praise {
		width: 200upx;
		height: 70upx;
		background: rgba(254, 80, 79, 1);
		border-radius: 40px;
		margin: 0 auto;
		color: #FFFFFF;
		text-align: center;
		margin-top: 10upx;
	}

	.comment-praise .iconfont {
		font-size: 32upx;
		margin-right: 15upx;
	}

	.comment-other {
		margin: 0 30upx 120upx;
		border-radius: 20upx;
		overflow: hidden;
	}

	.comment-other-info {
		padding-bottom: 20upx;
	}
</style>
