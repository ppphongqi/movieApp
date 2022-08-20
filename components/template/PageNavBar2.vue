<!--
	新头部选项卡 by 缪启峙
	current 选中项id
	navList 选项卡列表 {id,title}
 -->
<template>
	<view class="navbar-height nav-bar" :class="{'is-auto-width': autoWidth}" style="width: 100%;">
		
		<view class="navbar-box b-f" style="width: 100%;" :class="{ fixed: fixed == '1' }" :style="fixed == '1' ? fixTopHeight : ''">
			<scroll-view :scroll-x="isScroll" style="width: 100%;" :scroll-into-view="'id'+currentIndex" scroll-with-animation="true">
				<view class="nav-list" :style="navListWidth">
					<view class="nav-items" :style="[navItemStyle]" v-for="(items, index) in newNavList" :key="index" @click="navItemClick(items.id, index,item)" :id="'id'+items.id">
						<text :class="{ 'select-nav-ft': currentIndex == items.id }">{{ items.title }}</text>
						<text class="order-badge" v-if="items.num !=undefined &&items.num > 0">{{items.num}}</text>
						<view class="select-nav-items" v-if="currentIndex == items.id"><view class="iconfont icon-110"></view></view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
    data() {
        return {
			// 当前id。。。。。。不是index
            currentIndex: ''
        }
    },
    props: {
        current: {
			type: [String,Number],
            default: ''
        },
        navList: {
            type: Array,
            default: function () {
                return []
            }
        },
        fixed: {
            default: function () {
                return '2'
            }
        },
        fixTop: {
            default: function () {
                return 0
            }
        },
        default_check: {
			type: [String,Number],
            default: 0
        },
        isScroll: {
            type: Boolean,
            default: false
        },
		autoWidth: {
			type: Boolean,
			default: false
		},
		navItemStyle: {
			type: Object,
			default() {
				return {}
			}
		}
    },
    components: {},
    computed: {
        newNavList() {
            let _this = this
            if (!!_this.navList && _this.navList.length > 0) {
                return _this.navList
            }
            console.log('11111111112222222222333333333', _this.navList)
        },
        fixTopHeight() {
            return 'top:' + this.fixTop + 'rpx;'
        },
		// 需要这么复杂？？？？？？不能用css解决？？？？
        navListWidth() {
			if(this.autoWidth) return ''
            let width = 25 * this.navList.length + 'vw',
			    scrollStyle = this.isScroll ? 'width:' + width : ''
            return scrollStyle
        }
    },
    beforeCreate() {},
    mounted() {
        let _this = this
        this.currentIndex = _this.default_check ? _this.default_check : _this.current
		console.log('this.currentIndex',this.currentIndex)
    },
    onLoad(options) {},
    watch: {
		current(val){
			let _this = this
			this.currentIndex = _this.default_check ? _this.default_check : _this.current
		}
    },
    methods: {
        navItemClick(id, index,item) {
            console.log('navItemClick', id, index)
            this.currentIndex = id
            this.$emit('navItemClick', {
                id,
                index,
				item
            })
            // fix 在H5上navItemClick不触发，如果父组件是@nav-item-click这样写的
            // 风格问题。。。
            this.$emit('on-nav-item-click', {
                id,
                index
            })
        }
    }
}
</script>

<style scoped lang="scss">
	.order-badge {
		position: absolute;
		top: 20rpx;
		/* right: 10%; */
		font-size: 22rpx;
		background: #ff495e;
		text-align: center;
		line-height: 28rpx;
		color: #fff;
		border-radius: 100%;
		min-height: 30rpx;
		min-width: 30rpx;
		padding: 1rpx;
	}
.navbar-height {
	height: 100rpx;
}

.nav-list {
	display: flex;
	flex-direction: row;
	height: 100upx;
	.nav-bar.is-auto-width & {
		display: inline-flex;
	}
}

.navbar-box.fixed {
	position: fixed;
	top: 0;
	/* #ifdef H5 */
	/* top: 44px; */
	/* #endif */
	left: 0;
	right: 0;
	z-index: 10;
}

.nav-list .nav-items {
	height: 100%;
	line-height: 100upx;
	text-align: center;
	flex: 1;
	font-size: 24upx;
	color: #333333;
	position: relative;
	.nav-bar.is-auto-width & {
		flex: none;
		padding: 0 15rpx;
	}
}

.select-nav-items {
	position: absolute;
	left: 50%;
	top: 25%;
	width: 56upx;
	height: 10upx;
	transform: translateX(-50%);
	color: var(--theme-color,#FFD940);
}

.select-nav-items image {
	width: 100%;
	height: 100%;
}

.select-nav-ft {
	font-size: 28upx;
	color: #333333;
	font-weight: bold;
}
</style>
