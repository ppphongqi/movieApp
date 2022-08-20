<template>
	<view class="c-MemberCard app-card app-card--fluid app-clearfix">
		<!-- card -->
		<view class="c-MemberCard-card app-card app-flex app-flex--column" :style="[cCardStyle]">
			<!-- card__header -->
			<view class="c-MemberCard-card__header app-flex">
				<view class="app-flex-item app-flex-item--1 app-flex app-flex--align-center" style="padding-right: 100rpx;">
					
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<view class="c-MemberCard-card__ruleTitle" @click="$emit('on-rule-click')">{{ruleTitle}}</view>
				</view>
			</view>
			<!-- card__header end -->
			<!-- card__footer -->
			<view class="app-flex app-flex--align-center" style="margin-top: auto;">
				<view class="app-flex-item app-flex-item--1 f-24 app-flex app-flex--align-center" style="color: #856F18;">
					<view v-if="isMember" class="app-flex-item app-flex-item--shrink-0">
						<image class="c-MemberCard-card__avatar" :src="avatar" mode="aspectFill"></image>
					</view>
					<view  v-if="isMember" class="app-flex-item app-flex-item--1">
						<view class="f-32 f-bold col-f onelist-hidden">{{name}}</view>
						<view class="f-22 col-f">NO {{no}}</view>
					</view>
				</view>
				<view class="app-flex-item app-flex-item--shrink-0">
					<view  v-if="expireVisible" class="f-24 t-r col-f">
						{{expire}}到期
					</view>
					<view  v-else-if="timesVisible" class="m-top10 c-MemberCard-card__times">
						剩余{{times}}次<text class="m-left12" @click="$emit('on-renew-member-click')">续费</text>
					</view>
					<view v-else-if="!isMember" class="m-top10 c-MemberCard-card__times" @click="$emit('on-open-member-click')">
						立即开通会员
					</view>
				</view>
			</view>
			<!-- card__footer end -->
			<!-- 消费记录 -->
			<view class="c-MemberCard-card__btn-map" @click="navigationTo('pages/subPages/memberCenter/record')">消费记录</view>
			<!-- 消费记录 end -->
		</view>
		<!-- card end -->
		<!-- 统计数据 -->
		<view class="c-MemberCard-statistics app-card app-card--fluid app-card--transparent app-flex app-flex--align-center">
			<view class="c-MemberCard-statistics__item app-flex-item app-flex-item--1 app-flex-item--shrink-0 app-flex app-flex--column app-flex--align-center app-flex--justify-between">
				<view class="f-24 col-f"><text class="f-bold f-36">{{cMembersNum.num}}</text>{{cMembersNum.units}}</view>
				<view class="m-top10 f-24 col-9">累计会员数</text></view>
			</view>
			<view class="c-MemberCard-statistics__split app-flex-item"></view>
			<view class="c-MemberCard-statistics__item app-flex-item app-flex-item--1 app-flex-item--shrink-0 app-flex app-flex--column app-flex--align-center app-flex--justify-between">
				<view class="f-24 col-f">￥<text class="f-bold f-36">{{save}}</text></view>
				<view class="m-top10 f-24 col-9">已为您节省(元)</text></view>
			</view>
		</view>
		<!-- 统计数据 end -->
	</view>
</template>

<script>
	export default {
		name: 'MemberCard',
		props: {
			// 是否是会员
			isMember: {
				type: Boolean,
				default: false
			},
			// 头像
			avatar: {
				type: String,
				default: ''
			},
			// 名称
			name: {
				type: String,
				default: ''
			},
			// 编号
			no: {
				type: String,
				default: ''
			},
			// 规则标题
			ruleTitle: {
				type: String,
				default: '用卡说明'
			},
			// 规则富文本
			rule: {
				type: String,
				default: ''
			},
			// 到期时间
			expire: {
				type: String,
				default: '-'
			},
			// 到期时间是否显示
			expireVisible: {
				type:　Boolean,
				default: false
			},
			// 剩余次数
			times: {
				type: [String,Number],
				default: 0
			},
			// 剩余次数是否显示
			timesVisible: {
				type:　Boolean,
				default: false
			},
			// 背景图片
			bgUrl: {
				type: String,
				default: ''
			},
			// 累计会员数
			membersNum: {
				type: Number,
				default: 0
			},
			// 为您节省
			save: {
				type: [Number,String],
				default: 0
			}
		},
		data() {
			return {
				// 用卡说明弹窗是否显示
				
			}
		},
		computed: {
			// 格式化的卡片样式
			cCardStyle() {
				// return {
				// 	background: `linear-gradient(134deg, rgba(254, 228, 119, 0.8) 0%, rgba(254, 228, 119, 0.6) 36%, rgba(255, 255, 255, 0) 100%),no-repeat center/cover url('${this.bgUrl}')`
				// }
				return {
					background: `no-repeat center/cover url('${this.bgUrl}')`
				}
			},
			// 格式化的累计会员数
			cMembersNum() {
				const num = +this.membersNum || 0
				if(num > 10000) {
					return {
						num: (num/10000).toFixed(2),
						units: '万'
					}
				}
				return {
					num,
					units: ''
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.c-MemberCard {
		background-color: rgb(51,51,51);
	}
	.c-MemberCard {
		margin-top: 0;
		margin-bottom: 0;
		padding-top: 0;
		padding-bottom: 0;
		
	}
	.c-MemberCard-card {
		position: relative;
		height: 360rpx;
		margin-top: 0;
		padding-bottom: 50rpx;
	}
	.c-MemberCard-card__avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 100%;
	}
	.c-MemberCard-card__ruleTitle {
		position: absolute;
		top: 30rpx;
		right: 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rpx 12rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: rgba(#000000,0.5);
		border-radius: 9999rpx 0 0 9999rpx;
	}
	.c-MemberCard-card__times {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		padding: 6rpx 15rpx;
		justify-content: center;
		background-color: rgba(#000000,0.5);
		font-size: 24rpx;
		color: #fff;
		border-radius: 10rpx;
	}
	.c-MemberCard-card__btn-map {
		position: absolute;
		left: 50%;
		top: 100%;
		transform: translate(-50%,-50%);
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90rpx;
		height: 90rpx;
		padding: 10rpx;
		font-size: 24rpx;
		border: 4rpx solid #fff;
		background-color: #333333;
		border-radius: 100%;
		color: #fff;
		text-align: center;
	}
	.c-MemberCard-statistics {
		margin-top: 40rpx;
		margin-bottom: 40rpx;
	}
	.c-MemberCard-statistics__split {
		height: 52rpx;
		width: 1px;
		background-color: #555555;
	}
</style>
