<!-- 
	页面公用头部样式 by 杨智源
 -->
<template>
	<view>
		<view class="pages-header" :class="{'fixed':pos === '1', 'query':comPage }" :style="{'background-color':backgroundColor}">
			<view class="pages-header-info p-r">
				<slot name="user"></slot>
			</view>
			<view class="pages-header-content" v-if="contentShow">
				<slot name="content"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			pos: {
				type: String,
				default: "2"
			},
			backgroundColor:{
				type: String,
				default: "#F7F7F7"
			},
			contentShow:{
				type:Boolean,
				default:true
			},
			comPage:{
				type: String,
				default: ""
			}
		},
		mounted(){
			console.log('this.comPage',this.comPage)
		}
	}
</script>

<style lang="less">
	.pages-header {
		padding: 20upx 30upx;
		/* background: #FFFFFF;  */
		position: relative;
		overflow: hidden;
	}

	.pages-header.fixed {
		position: fixed;
		top: 0;
		/* #ifdef H5 */
		/* top: 44px; */
		/* #endif */
		left: 0;
		right: 0;
		z-index: 30;
	}

	.pages-header::before {
		content: " ";
		width: 400vw;
		height: 600upx;
		background: var(--theme-color);
		border-radius: 60%;
		position: absolute;
		left: -155vw;
		bottom: 25%;
		z-index: 1;
	}
	
	.pages-header.query::before {
		content: " ";
		width: 400vw;
		height: 600upx;
		background: var(--theme-color);
		border-radius: 60%;
		position: absolute;
		left: -155vw;
		bottom: -5%;
		z-index: 1;
	}

	.pages-header-info {
		z-index: 20;
	}

	.pages-header-content {
		box-shadow: 0 2upx 10upx 0 rgba(170, 170, 170, 0.35);
		min-height: 100upx;
		border-radius: 20upx;
		background: #FFFFFF;
		position: relative;
		z-index: 20;
	}
</style>
