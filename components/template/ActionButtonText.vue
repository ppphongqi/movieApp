<template>
	<view class="page">
		<view class="zan-actionsheet__btn-content" :class="{'zan-actionsheet__btn--loading':loading}" v-if="btnType === 'list'">
			<view class="zan-actionsheet__name">{{text}}</view>
		</view>
		<block v-else>{{text}}</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		props: {
			text: {
				type: String,
				default: ''
			},
			btnType: {
				type: String,
				default: 'list'
			},
			loading: {
				type: Boolean,
				default: false
			},
		},
		mounted() {

		},
		methods: {

		}
	}
</script>

<style>
	.zan-actionsheet__btn-content {
		display: -webkit-box;
		display: flex;
		-webkit-box-orient: horizontal;
		-webkit-box-direction: normal;
		flex-direction: row;
		-webkit-box-pack: center;
		justify-content: center;
	}

	.zan-actionsheet__btn--loading .zan-actionsheet__subname {
		color: transparent;
	}

	.zan-actionsheet__name,
	.zan-actionsheet__subname {
		height: 45px;
		line-height: 45px;
	}
</style>
