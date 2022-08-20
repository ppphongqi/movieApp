<template>
	<view class="c-PicList app-flex app-flex--column">
		<!-- 分类导航 -->
		<view v-if="tabNavVisible" class="app-flex-item">
			<PageNavBar :navItemStyle="{padding: '0 30rpx'}" :nav-list="tabList" isScroll autoWidth
				:current="currentTabId" @on-nav-item-click="handleNavItemClick"></PageNavBar>
		</view>
		<!-- 分类导航 end -->
		<!-- 图片选择列表 -->
		<view class="app-flex-item app-flex-item--1">
			<scroll-view scroll-y="true" style="height: 100%;" @scrolltolower="$emit('on-scrolltolower')">
				<view style="padding: 0 30rpx;">
					<view class="pic-list">
						<view v-if="uploadEnable" class="pic-list__item" @click="handleUploadItemClick">
							<view class="pic-card">
								<view
									class="pic-card__inner app-flex app-flex--align-center app-flex--column app-flex--justify-center">
									<view class="app-flex-item col-3">
										<view class="iconfont icon-add"></view>
									</view>
									<view class="app-flex-item col-3 m-top10 f-24">上传</view>
								</view>
							</view>
						</view>
						<view v-for="(item,index) in list" :key="item.id" class="pic-list__item"
							@click="handleItemClick(item,index)">
							<view class="pic-card" :class="{
								'is-active': activeId == item.id
							}">
								<view class="pic-card__inner">
									<image class="pic-card__img" :src="item.imgUrl" mode=""></image>
									<!-- 选中项的mask -->
									<view v-if="activeId == item.id" class="pic-card__inner__mask">
										<view class="iconfont icon-roundcheckfill"></view>
									</view>
									<!-- 选中项的mask end -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 图片选择列表 end -->
	</view>
</template>

<script>
	import App from "@/common/js/app.js";
	import PageNavBar from "@/components/template/PageNavBar2.vue";
	export default {
		components: {
			PageNavBar
		},
		props: {
			// 当前选中项的id v-model 受控和不受控都可以
			value: {
				type: [String, Number],
				default: ''
			},
			// 是否自动请求数据
			autoFetchData: {
				type: Boolean,
				default: true
			},
			// 分类导航是否显示
			tabNavVisible: {
				type: Boolean,
				default: true
			},
			// 分类导航的列表数据
			tabList: {
				type: Array,
				default () {
					return [{
							id: "01",
							title: '推荐',
						},
						{
							id: "02",
							title: '风景',
						},
						{
							id: "03",
							title: '风景',
						},
						{
							id: "04",
							title: '风景',
						},
						{
							id: "05",
							title: '风景',
						},
						{
							id: "06",
							title: '风景',
						},
						{
							id: "07",
							title: '风景',
						},
						{
							id: "08",
							title: '风景',
						},
						{
							id: "09",
							title: '风景',
						},
					]
				}
			},
			// 上传功能是否开启
			uploadEnable: {
				type: Boolean,
				default: true
			},
			// 图片列表
			list: {
				type: Array,
				default () {
					return new Array(25).fill(1).map((item, index) => ({
						id: '0' + index,
						imgUrl: 'http://placekitten.com/165/165'
					}))
				}
			},

		},
		data() {
			return {
				// 当前选中的tabId
				currentTabId: '',
				// 当前选中项的id
				activeId: this.value
			}
		},
		watch: {
			value: {
				handler(val) {
					this.activeId = val
				},
				immediate: true
			},
			tabList: {
				handler(val) {
					if (!val.find(item => item.id === this.currentTabId)) {
						this.currentTabId = this.$util.deepGet(val, '0.id', '')
					}
				},
				immediate: true
			},
			currentTabId(val) {
				this.$emit('on-change', val)
			}
		},
		created() {
			uni.$on('uAvatarCropper', this.handleAvatarCropper)
		},
		beforeDestroy(path) {
			console.log('beforeDestroy handleAvatarCropper')
			uni.$off('uAvatarCropper', this.handleAvatarCropper)
		},
		methods: {
			handleAvatarCropper(path) {
				console.log('handleAvatarCropper')
				// #ifdef MP
				App._upLoad(path,222).then(res=>{
					this.$emit('on-upload-success', res)
				})
				// #endif
				// #ifdef H5
				App._postP("upload/base64Image", {
					image: path
				}).then(res=>{
					this.$emit('on-upload-success', res.data)
				});
				// #endif
			},
			handleNavItemClick(e) {
				console.log('handleNavItemClick', e)
				this.currentTabId = e.id
				this.$emit('on-tab-item-click', e.id, e.index)
			},
			handleUploadItemClick() {
				// 打开
				this.navigationTo(`pages/subPages/clock/cropper?destWidth=750&rectWidth=200&fileType=jpg`);
			},
			// 图片项点击事件
			handleItemClick(item, index) {
				this.activeId = item.id
				this.$emit('input', item.id)
				this.$emit('on-item-click', item.id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-PicList {
		height: 100%;
		background-color: #fff;
	}

	.pic-list {
		display: flex;
		flex-wrap: wrap;
		margin: -5rpx;
	}

	.pic-list__item {
		box-sizing: border-box;
		width: percentage(1/4);
		padding: 5rpx;
	}

	.pic-card {
		position: relative;
		width: 100%;
		padding-top: 100%;
	}

	.pic-card__inner {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.pic-card__inner__mask {
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: rgba($color: #1A1A1A, $alpha: 0.5);

		.iconfont {
			color: #fff;
		}
	}

	.pic-card__img {
		width: 100%;
		height: 100%;
	}
</style>
