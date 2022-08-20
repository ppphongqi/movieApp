<template>
	<!-- 商圈 -->
	<view class="trade-part" v-if="kindData.length">
		<scroll-view scroll-x="true" :scroll-into-view="'item'+selectIndex">
			<view class="dis-flex " >
				<view v-for="(item,index) in kindData" :id='"item"+index'  class="trade-item t-c  f-22" :style="{'margin-left':index?(10+'rpx'):''}" :class="{'trade-active':selectIndex===index}" @click="selectTradeArea(item,index)" :key='index'>
					{{item.circle_name}}
				</view>
		
			</view>
		
		</scroll-view>
		
	</view>
</template>

<!-- 这个组件一点扩展性都没有 -->
<script>
	import App from "@/common/js/app.js";
	export default {
		props: {
			list: {
				type: Array,
				default() {
					return undefined
				}
			},
			autoRequest: {
				type: Boolean,
				default: true
			},
			defaultSelectIndex: {
				type: Number,
				default: 0
			}
		},
		data(){
			return {
				kindData:[],
				selectIndex: this.defaultSelectIndex
			}
		},
		watch: {
			list(val) {
				if(!this.autoRequest) {
					this.kindData = val
				}
			},
			defaultSelectIndex(val) {
				this.selectIndex = this.defaultSelectIndex
			},
		},
		mounted() {
			this.getCategoryData()
		},
		methods:{
			getCategoryData() {
				if(!this.autoRequest) return
				let _this = this
				// 在组件里就直接请求接口？？？？？
				App._post_form('circle.Businesscircle/getBusinessCircle', {}, res => {
					let {
						code,
						data: data = []
					} = res;
					this.kindData = this.kindData.concat(data)
					this.$emit('isHasData',this.kindData)
				})
			},
			selectTradeArea(item,index){
				this.selectIndex = index
				this.$emit('tradeAreaChange',item)
			}
		}
	}
</script>

<style lang="scss" >
	.trade-part {
		margin: 20rpx 0;
	
		.trade-item {
			padding: 9rpx 22rpx;
			background: rgba(232, 232, 232, 1);
			border-radius: 30rpx;
			color: #333333;
			white-space: nowrap;
		}
		.trade-active {
			background:rgba(255,237,226,1) !important;
			border-radius:20rpx;
			color: #F28243;
		}
		
	}
	
</style>
