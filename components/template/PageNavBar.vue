<!-- 
	项目头部选项卡 by 杨智源
	current 选中项id
	navList 选项卡列表 {id,title}
	fixed 是否定位到页面顶部
 -->
<template>
	<view>
		<view class="nav-bar-box" :class="{'fixed':fixed === '1'}">
			<view class="nav-bar-list-bg"></view>
			<view class="nav-bar-list">
				<view class="nav-bar-item" @click="navItemClick(item.id,index)" :class="{'active':currentIndex === item.id }" v-for="(item,index) in navList"
				 :key="index">{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				currentIndex: "",
			};
		},
		props: {
			current: {
				type: String,
				default: ""
			},
			navList: {
				type: Array,
				default: () => []
			},
			fixed:{
				type:String,
				default:"2"
			}
		},
		components: {

		},
		computed: {

		},
		beforeCreate() {

		},
		mounted(options) {
			this.currentIndex = this.current ? this.current : this.navList[0].id;
		},
		watch: {
			current(newValue, oldValue) {
				this.currentIndex = newValue;
			}
		},
		methods: {
			navItemClick(id, index) {
				this.currentIndex = id;
				this.$emit("navItemClick", {
					id,
					index
				})
			}
		}
	}
</script>

<style>
	.nav-bar-box {
		padding: 20upx 30upx;
		/* background: #F0F0F0; */
		position: relative;
		overflow: hidden;
	}
	.nav-bar-box.fixed{
		position: fixed;
		top:0;
		/* #ifdef H5 */
		/* top: 44px; */
		/* #endif */
		left: 0;
		right: 0;
		z-index: 10;
	}

	.nav-bar-list {
		height: 100upx;
		border-radius: 20upx;
		background: #FFFFFF;
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		z-index: 2;
		box-shadow:2upx 0px 4upx #D1D1D1;
	}

	.nav-bar-list-bg {
		width: 180vw;
		height: 300upx;
		background: #FFD940;
		background: var(--theme-color);
		border-radius: 50%;
		position: absolute;
		left: -40vw;
		bottom: 32%;
		z-index: 1;
	}

	.nav-bar-item {
		flex: 1;
		font-size: 28upx;
		color: #333333;
		text-align: center;
		height: 100upx;
		line-height: 100upx;
		position: relative;
	}

	.nav-bar-item::before {
		content: " ";
		position: absolute;
		top: 20upx;
		right: 0;
		bottom: 20upx;
		width: 0;
		border-right: 1upx solid #EEEEEE;
	}

	.nav-bar-list .nav-bar-item:last-child::before {
		content: none;
	}

	.nav-bar-item.active {
		font-size: 30upx;
		font-weight: 400;
	}

	.nav-bar-item.active::after {
		content: " ";
		position: absolute;
		left: 42%;
		right: 42%;
		bottom: 10upx;
		height: 4upx;
		background: #FFD940;
		background: var(--theme-color);
		border-radius: 6upx;
	}
</style>
