<template>
	<view class="c-SearchHeader app-card app-card--fluid app-flex app-flex--align-center">
		<view class="c-SearchHeader__adress app-flex-item app-flex-item--shrink-0 app-flex app-flex--align-center">
			<view class="c-SearchHeader__adress__text app-flex-item">{{address}}</view>
		</view>
		<view class="app-flex-item app-flex-item--1">
			<u-search height="72" shape="square" bg-color="#484848" placeholder-color="#999999" :input-style="{
				fontSize: '28rpx',
				color: '#999999'
			}" :show-action="false" @search="handeSearch"></u-search>
		</view>
		<!-- <view
			class="app-flex-item app-flex-item--shrink-0 app-flex app-flex--column app-flex--align-center app-flex--justify-between" @click="handleBtnComplaintClick">
			<view class="app-flex-item f-32">
				<view class="iconfont is-size-inherit icon-yujing col-f4"></view>
			</view>
			<view class="app-flex-item col-f4 f-24">投诉</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: 'SearchHeader',
		props: {
			address: {
				type: String,
				default: ""
			}
		},
		methods: {
			// 投诉按钮点击事件
			handleBtnComplaintClick(){
				this.$emit('on-btn-complaint-click')
			},
			handeSearch(value) {
				this.$emit('on-search',value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-SearchHeader {
		margin-top: 0;
		margin-bottom: 0;
		background-color: rgb(51,51,51);
	}

	.c-SearchHeader__adress__text {
		font-weight: bold;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 5em;
	}
</style>
