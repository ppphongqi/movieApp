<!-- 
	单选列表 by 杨智源
	current 当前选中id
	radioList 单选列表 {id,thumb,title}
	type 列表类型 pay-支付列表 
	formName 表单name
 -->
<template>
	<view>
		<radio-group @change="radioChange" :name="formName">
			<label class="order-pay-item dis-flex flex-y-center flex-x-between" v-for="(radioItem,index) in radioList" :key="radioItem.id"
			 :class="{'pay-border':type==='pay'}">
				<radio :value="radioItem.id" class="radio" :checked="current == radioItem.id" />
				<view class="order-pay dis-flex flex-y-center">
					<block v-if="!!radioItem.thumb">
						<image :src="radioItem.thumb"></image>
					</block>
					<view class="order-pay-text col-3" :class="[type==='pay'?'f-30':'f-26']">
						<view>{{radioItem.title}}</view>
						<view class="col-9 f-22" v-if="radioItem.label">{{radioItem.label}}</view>
					</view>
				</view>
				<view class="iconfont" :class="[current == radioItem.id?'icon-radiobox':'icon-round']"></view>
			</label>
		</radio-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: "",
				// dataList: []
			};
		},
		props: {
			selected: {
				type: String,
				default: ""
			},
			defaultPay:{
				type: String,
				default: ""
			},
			type: {
				type: String,
				default: "pay"
			},
			formName: {
				type: String,
				default: "current"
			},
			dataList: {
				type: Array,
				default: () => null
			},
			radioList: {
				type: Array,
				default: () => null
			}
		},
		onLoad(options) {

		},
		mounted() {
		},
		watch: {
			radioList(newValue, oldValue) {
				if (newValue.length > 0 && !this.defaultPay) {
					this.current = newValue[0].id;
				}
			},
			defaultPay(newValue, oldValue){
				console.log(newValue,'newValue')
				this.current = newValue;
			}
		},
		methods: {
			radioChange(e) {
				this.current = e.detail.value;
				this.$emit("radioChange", e.detail);
			}
		}
	}
</script>

<style lang="scss">
	.order-pay-item {
		position: relative;
		padding: 16upx 0;
	}

	.order-pay-item.pay-border {
		padding: 20upx 0;
	}

	.order-pay-item .radio {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
	}

	.order-pay-item .iconfont {
		font-size: 42upx;
		height: 1em;
		width: 1em;
		line-height: 1em;
		color: #CCCCCC;
	}

	.order-pay-item .iconfont.icon-radiobox {
		color: #FFDD00;
		color: var(--theme-color);
	}

	.order-pay-item image {
		width: 60upx;
		height: 60upx;
		display: block;
		border-radius: 50%;
		margin: 0 20upx;
	}

	.order-pay-text {
		margin-left: 20upx;
	}
</style>
