<template>
	<view class="tui-steps-box" :class="{ 'tui-steps-column': direction === 'column' }">
		<view
			class="tui-step-item"
			:style="{ width: direction === 'column' ? '100%' : spacing }"
			:class="[direction === 'row' ? 'tui-step-horizontal' : 'tui-step-vertical']"
			v-for="(item, index) in items"
			:key="index"
		>
			<view class="tui-step-item-ico" :style="{ width: direction === 'column' ? '36rpx' : '100%' }">
				<view
					v-if="!item.name && !item.icon"
					class="tui-step-ico"
					:class="[direction === 'column' ? 'tui-step-column_ico' : 'tui-step-row_ico']"
					:style="{
						width: type == 2 || activeSteps === index ? '36rpx' : '16rpx',
						height: type == 2 || activeSteps === index ? '36rpx' : '16rpx',
						backgroundColor: index <= activeSteps ? activeColor : type == 2 ? '#fff' : deactiveColor,
						borderColor: index <= activeSteps ? activeColor : deactiveColor
					}"
				>
					<text v-if="activeSteps !== index" :style="{ color: index <= activeSteps ? '#fff' : '' }">{{ type == 1 ? '' : index + 1 }}</text>
					<tui-icon name="check" :size="16" color="#fff" v-if="activeSteps === index"></tui-icon>
				</view>
				<view class="tui-step-custom" v-if="item.name || item.icon">
					<tui-icon :name="item.name" :size="20" :color="index <= activeSteps ? activeColor : deactiveColor" v-if="item.name"></tui-icon>
					<image :src="index <= activeSteps ? item.activeIcon : item.icon" class="tui-step-img" mode="widthFix" v-if="!item.name"></image>
				</view>
				<view
					class="tui-step-line"
					:class="['tui-step-' + direction + '_line', direction == 'column' && (item.name || item.icon) ? 'tui-custom-left' : '']"
					:style="{
						borderColor: index <= activeSteps - 1 ? activeColor : deactiveColor,
						borderRightStyle: direction == 'column' ? lineStyle : '',
						borderTopStyle: direction == 'column' ? '' : lineStyle
					}"
					v-if="index != items.length - 1"
				></view>
			</view>
			<view class="tui-step-item-main" :class="['tui-step-' + direction + '_item_main']">
				<view
					class="tui-step-item-title"
					:style="{
						color: index <= activeSteps ? activeColor : deactiveColor,
						fontSize: titleSize + 'rpx',
						lineHeight: titleSize + 'rpx',
						fontWeight: bold ? 'bold' : 'normal'
					}"
				>
					{{ item.title }}
				</view>
				<view class="tui-step-item-content" :style="{ color: index <= activeSteps ? activeColor : deactiveColor, fontSize: descSize + 'rpx' }">{{ item.desc }}</view>
			</view>
		</view>
	</view>
</template>

<script>
//?????????????????????????????????????????????????????????
export default {
	name: 'tuiSteps',
	props: {
		// 1-???????????? 2-????????????
		type: {
			type: Number,
			default: 1
		},
		spacing: {
			type: String,
			default: '160rpx'
		},
		// ?????? row column
		direction: {
			type: String,
			default: 'row'
		},
		// ????????????????????????
		activeColor: {
			type: String,
			default: '#5677fc'
		},
		// ?????????????????????
		deactiveColor: {
			type: String,
			default: '#999999'
		},
		//title????????????
		titleSize: {
			type: Number,
			default: 28
		},
		//title????????????
		bold: {
			type: Boolean,
			default: false
		},
		//desc????????????
		descSize: {
			type: Number,
			default: 24
		},
		// ????????????
		activeSteps: {
			type: Number,
			default: -1
		},
		//???????????? ???border????????????
		lineStyle: {
			type: String,
			default: 'solid'
		},
		/**
			 * [{
					title: "??????",
					desc: "??????",
					name:"???????????? thorui icon???", 
					icon:"????????????", 
					activeIcon:"?????????????????????????????????"
				}]
			 * */
		items: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {};
	}
};
</script>

<style scoped>
.tui-steps-box {
	width: 100%;
	display: flex;
	justify-content: center;
}

.tui-steps-column {
	flex-direction: column;
}

.tui-step-ico {
	border-radius: 80rpx;
	position: relative;
	z-index: 3;
	margin: 0 auto;
	border-width: 1rpx;
	border-style: solid;
	display: flex;
	align-items: center;
	justify-content: center;
}

.tui-step-row_ico {
	top: 50%;
	transform: translateY(-50%);
}

.tui-step-column_ico {
	top: 0;
}

.tui-step-line {
	position: absolute;
	left: 50%;
	top: 20rpx;
	width: 100%;
	height: 0rpx;
	border-top-width: 1rpx;
	z-index: 2;
}

.tui-step-row_item_main {
	text-align: center;
}

.tui-step-item {
	font-size: 24rpx;
	position: relative;
	box-sizing: border-box;
}

.tui-step-item-ico {
	height: 36rpx;
	line-height: 36rpx;
	text-align: center;
}
.tui-step-custom {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 48rpx;
	height: 40rpx;
	position: relative;
	z-index: 4;
	background-color: #fff;
	margin: 0 auto;
}
.tui-step-img {
	width: 40rpx;
	height: 40rpx;
}

.tui-step-item-main {
	margin-top: 16rpx;
	clear: both;
}

.tui-step-item-title {
	word-break: break-all;
}

.tui-step-item-content {
	margin-top: 8rpx;
	word-break: break-all;
}

.tui-step-vertical {
	width: 100%;
	display: flex;
	padding-bottom: 60rpx;
}

.tui-step-column_item_main {
	margin-top: 0;
	padding-left: 20rpx;
}

.tui-step-column_line {
	position: absolute;
	height: 100%;
	top: 0;
	left: 18rpx;
	margin: 0;
	width: 0rpx;
	border-right-width: 1rpx;
}
.tui-custom-left {
	left: 20rpx !important;
}
</style>
