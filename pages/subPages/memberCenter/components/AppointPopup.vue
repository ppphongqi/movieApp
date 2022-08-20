<template>
	<popup-view class="c-popup" :show="dVisible" type="bottom" @clickmask="dVisible = false">
		<view class="c-card" @touchmove.prevent="handleTouchMove">
			<view class="c-card__header">
				{{title}}
			</view>
			<scroll-view scroll-y class="c-card__content">
				<view class="c-card__scroll__content app-clearfix">
					<!-- 选择 -->
					<view v-for="item in cSelectList" :key="item.id">
						<AppointSelect v-if="form[item.id]" v-model="form[item.id]" :list="item.list"></AppointSelect>
					</view>
					<!-- 选择 end -->
					<!-- 到店联系 -->
					<view class="f-32 f-bold col-3 m-btm20 m-top40">到店联系</view>
					<view class="app-card" style="padding-top: 0;padding-bottom: 0;">
						<view class="app-flex app-flex--align-center p-top-bom-30">
							<view class="app-flex-item f-28 col-3" style="width: 115rpx;">
								姓名
							</view>
							<view class="app-flex-item--1">
								<input v-model="form.name" type="text" placeholder="请输入姓名" />
							</view>
						</view>
						<view class="app-line"></view>
						<view class="app-flex app-flex--align-center p-top-bom-30">
							<view class="app-flex-item f-28 col-3" style="width: 115rpx;">
								手机号
							</view>
							<view class="app-flex-item--1">
								<input v-model="form.mobile" type="number" maxlength="13" placeholder="请输入手机号" />
							</view>
						</view>
					</view>
					<!-- 到店联系 end -->
					<!-- 本店特色 -->
					<!-- 到店联系 -->
					<view class="f-32 f-bold col-3 m-btm20 m-top40">本店特色介绍</view>
					<view class="app-card">
						<parse :html="desc"></parse>
					</view>
					<!-- 本店特色 end -->
				</view>
			</scroll-view>
			<view class="c-card__footer app-after--safe-bottom">
				<view class="app-flex app-flex--align-center padding-box-all">
					<view class="app-flex-item app-flex-item--1">{{cFooterText}}</view>
					<view class="app-flex-item app-flex-item--shrink-0">
						<button class="app-btn app-btn-large"
							style="width: auto;height: 80rpx;padding: 0 42rpx;" @click="handleBtnGoClick">下一步</button>
					</view>
				</view>
			</view>
			<view class="c-popup__btn-close iconfont icon-searchclose" @click="dVisible = false"></view>
		</view>
	</popup-view>
</template>

<script>
	import dayjs from 'dayjs'
	import PopupView from '@/components/template/PopManager.vue'
	import Parse from '@/components/threeComponents/jyf-Parser/index'
	import AppointSelect from './AppointSelect.vue'
	export default {
		components: {
			PopupView,
			Parse,
			AppointSelect
		},
		props: {
			// 默认是否显示v-model
			value: {
				type: Boolean,
				default: false
			},
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 富文本
			desc: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				dVisible: this.value,
				// 表单的值
				form: {
					name: '',
					mobile: ''
				}
			}
		},
		computed: {
			// 滑动选项列表
			cSelectList() {
				// 日期
				const now = dayjs()
				const dateList = [{
						id: now.format('YYYYMMDD'),
						title: '今天',
						subTitle: '',
					}, {
						id: now.add(1, 'day').format('YYYYMMDD'),
						title: '明天',
						subTitle: '',
					},
					// 往后5天
					...Array(5).fill(1).map((item, index) => {
						const day = now.add(index + 2, 'day')
						let weekdayMap = ['一', '二', '三', '四', '五', '六', '日']
						return {
							id: day.format('YYYYMMDD'),
							title: day.format('MM.DD'),
							subTitle: `星期${weekdayMap[day.day()]}`,
						}
					})
				]
				// 时间
				const startHour = dayjs('2000-01-01 00:00', 'YYYY-MM-DD HH:mm')
				const hourList = Array(48).fill(1).map((item, index) => {
					const hour = startHour.add(0.5 * index, 'hour').format('HH:mm')
					return {
						id: hour,
						title: hour
					}
				})
				// 人数
				const peopleNumList = Array(20).fill(1).map((item, index) => {
					return {
						id: index + 1,
						title: `${index+1}人`
					}
				})
				// 位置
				const typeList = [{
					id: 1,
					title: '大厅'
				}, {
					id: 2,
					title: '包间'
				}]
				// 桌数
				const tableList = Array(20).fill(1).map((item, index) => {
					return {
						id: index + 1,
						title: `${index+1}桌`
					}
				})
				return [{
					id: 'date',
					list: dateList
				}, {
					id: 'hour',
					list: hourList
				}, {
					id: 'peopleNum',
					list: peopleNumList
				}, {
					id: 'type',
					list: typeList
				}, {
					id: 'table',
					list: tableList
				}]
			},
			// 底部显示
			cFooterText() {
				let text = ''
				this.cSelectList.forEach(item=>{
					const targetId = this.form[item.id] && this.form[item.id][0]
					const target = item.list.find(listItem=>listItem.id === targetId)
					console.log({
						targetId,
						target
					})
					if(target) {
						text+=` ${target.title}`
					}
				})
				return text
			}
		},
		watch: {
			value(val) {
				this.dVisible = val
			},
			dVisible(val) {
				this.$emit('input', val)
			},
			cSelectList: {
				handler(val) {
					console.log('cSelectList',val)
					val.forEach(item => {
						if (!this.form[item.id]) {
							this.form[item.id] = [item.list && item.list[0] && item.list[0].id]
						}
					})
					this.form = {
						...this.form
					}
				},
				immediate: true
			}
		},
		methods: {
			handleTouchMove() {

			},
			handleBtnGoClick() {
				// 表单数据(和接口保持一致)
				const params = {
					reservation_date: this.$util.deepGet(this.form,'date.0') || '',
					reservation_time: this.$util.deepGet(this.form,'hour.0') || '',
					reservation_num: this.$util.deepGet(this.form,'peopleNum.0') || '',
					reservation_type: this.$util.deepGet(this.form,'type.0') || '',
					reservation_seat: this.$util.deepGet(this.form,'table.0') || '',
					reservation_name: this.$util.deepGet(this.form,'name') || '',
					reservation_mobile: this.$util.deepGet(this.form,'mobile') || '',
				}
				// 数据校验
				if(!params.reservation_name) {
					uni.showToast({
						icon: 'none',
						title: '请填写姓名'
					})
					return
				}
				// 数据校验
				if(!/^1[3456789]\d{9}$/.test(params.reservation_mobile)) {
					uni.showToast({
						icon: 'none',
						title: '请填写正确的手机号'
					})
					return
				}
				if(!params.reservation_date) {
					uni.showToast({
						icon: 'none',
						title: '请选择日期'
					})
					return
				}
				if(!params.reservation_time) {
					uni.showToast({
						icon: 'none',
						title: '请选择时间'
					})
					return
				}
				if(!params.reservation_num) {
					uni.showToast({
						icon: 'none',
						title: '请选择人数'
					})
					return
				}
				if(!params.reservation_type) {
					uni.showToast({
						icon: 'none',
						title: '请选择大厅还是包间'
					})
					return
				}
				if(!params.reservation_seat) {
					uni.showToast({
						icon: 'none',
						title: '请选择大厅还是包间'
					})
					return
				}
				this.$emit('on-btn-go-click',{
					params,
					form: this.form
				})
				
			}
		}
	}
</script>

<style lang="scss" scoped>
	.c-card {
		position: relative;
		width: 100vw;
		border-radius: 20rpx 20rpx 20rpx 0;
		background-color: #F8F8F8;
	}

	.c-card__header {
		box-sizing: border-box;
		display: flex;
		min-height: 120rpx;
		padding: 0 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 30rpx 40rpx;
		font-size: 36rpx;
		color: #333;
		font-weight: bold;
		text-align: center;
	}

	.c-card__content {
		box-sizing: border-box;
		height: 75vh;
		padding: 30rpx 40rpx;
	}

	.c-popup__btn-close {
		position: absolute;
		top: 24rpx;
		left: 24rpx;
		font-size: 36rpx;
		text-align: center;
	}

	.c-card__footer {
		background-color: #fff;
		border-radius: 30rpx 30rpx 0 0;
	}
</style>
