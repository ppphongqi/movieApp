<template>
	<view class="coupon-v2-list">
		<view v-for="(item,index) in cData" :key="item.id" class="coupon-v2-item">
			<coupon-v2
				:type="item.type"
				:priceStr="item.couponPrice"
				:condition="item.title"
				:desc="item.couponCondition"
				:status="item.finalStatus"
				:btnText="item.btnText"
				@on-btn-click="doReceiveCoupon(item,index)"/>
		</view>
	</view>
</template>

<script>
import App from "@/common/js/app.js"
import { couponItemConverter } from '@/common/js/dataConverter/couponItemConverter'
import CouponV2 from '@/components/page/pageComponents/CouponV2.vue'
export default {
    components: {
        CouponV2
    },
    props: {
        params: {
            type: Object,
            default() {
                return {}
            }
        },
        itemData: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
			// 已经领取优惠券的缓存
			couponReceivedIds: []
        }
    },
    computed: {
        // 格式化的优惠券列表数据
        cData() {
            return this.itemData.map(item => {
                // 判断优惠券的状态0:待领取，1:已领取
                let finalStatus = '0'
                if (+item.status !== 1 || +item.is_receive === 1 || this.couponReceivedIds.find(id=>id === item.coupon_id)) {
                    // 接口数据item.status 1=进行中，2=已失效，3=已暂停
                    // 接口数据is_receive 1=已经领取过
                    finalStatus = '1'
                }
                let btnText = '领取'
                if (finalStatus === '1') {
                    btnText = '已领取'
                }
                return {
                    _source: item,
                    ...couponItemConverter(item),
                    type: `type${this.$util.deepGet(this.params, 'pattern', '1')}`,
                    finalStatus,
                    btnText
                }
            })
        }
    },
    methods: {
        // 领取优惠券的操作
        async doReceiveCoupon(item, index) {
            if (item.finalStatus === 1) {
                return
            }
			if(!this.couponReceivedIds.find(id=>id === item.id)) {
				this.couponReceivedIds.push(item.id)
			}
            uni.showLoading()
            try {
				let location = {}
				if([1,2].includes(item.area_restrictions)) {
					location = await App.getLocation() || {}
				}
                const res = await App._postP('user.coupon/receive', {
                    coupon_id: item.id,
					lat: location.latitude || '',
					lng: location.longitude || ''
                })
				if(this.$util.deepGet(item,'_source.suit_goods_type') === 1) {
					uni.showModal({
						title: "领取成功!",
						content: `快去使用您的${this.appCoupon.coupon_title}吧`,
						cancelText: "以后再说",
						confirmText: "立即使用",
						success(res) {
							if (res.confirm) {
								App.navigationTo({
									url: `pages/subPages/coupon/goods?coupon_id=${coupon.coupon_id}`
								})
							}
						}
					})
				}else {
					App.showSuccess(res.msg);
				}
            } catch (e) {
                // TODO handle the exception
				console.log('doReceiveCoupon error',e)
                uni.hideLoading()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
	.coupon-v2-list {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
		padding-bottom: 0rpx;
		background-color: #fff;
	}
	.coupon-v2-item {
		margin-bottom: 27rpx;
	}
</style>
