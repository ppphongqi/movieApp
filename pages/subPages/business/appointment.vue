<template>
	<view class="page-business-appointment" :style="themeColor">
		<page-nav-bar @navItemClick="expressType" :nav-list="typeData" :current="types" fixed="1"></page-nav-bar>
		<!-- <radio-group @change="handleRadioTypeChange">
			<label v-for="(item, index) in typeData" :key="item.id">
				<view>
					<radio :value="item.id" :checked="index === typeActive" />
				</view>
				<view>{{item.title}}</view>
			</label>
		</radio-group> -->
		<view class="" style="margin: 30rpx;">
			<block v-if="orderData.data.length>0">
				<view class="list-wrap" style="margin-top: 30rpx;" v-for="(item,index) in orderData.data" :key="index">
					<view class="appointment-flex">
						<text>订单号：{{item.order_no}}</text>
						<text style="color: #FE504F;" v-if="item.audit_status==1">已审核</text>
						<text style="color: #FE504F;" v-if="item.audit_status==2">未审核</text>
						<text style="color: #FE504F;" v-if="item.audit_status==3">已拒绝</text>
					</view>
					<view class="">
						<view class="appointment_content" style="margin-top:29rpx ;">
							<view class="">
								<image :src="item && item.order_goods && item.order_goods[0] && item.order_goods[0].image && item.order_goods[0].image.file_path" class="appointment-goodsImg"></image>
							</view>
							<view class="contentWrap">
								<view class="goods-title">

									<p class="">{{item.order_goods[0].goods_name}}</p>
									<p style="font-size: 14px;color: #999999;margin-top: 5px;">{{item.order_goods.goods_attr}}</p>
								</view>

								<view class="appointment-flex" style="width:450rpx ;">
									<text>￥{{item.order_goods[0].goods_price}}</text>
									<text style="color: #999999;">x{{item.order_goods[0].total_num}}</text>
								</view>

							</view>
						</view>
						<view class="" style="margin-top:29rpx ;">
							<view class="appointment-flex">
								<text style="color: #999999;">客户名称：</text>
								<text v-if="item.nickName==null"></text>
								<text v-else>{{item.nickName}}</text>

							</view>
							<view class="appointment-flex" style="margin-top:19rpx ;">
								<text style="color: #999999;">预约门店：</text>
								<text v-if="item.store && item.store[0] && item.store[0].name==0"></text>
								<text v-else>{{item.store && item.store[0] && item.store[0].name}}</text>
							</view>
							<view class="appointment-flex" style="margin-top:19rpx ;">
								<text style="color: #999999;">预约时间：</text>
								<text v-if="item.reserve_time==0"></text>
								<text v-else>{{item.reserve_time | formatDate}}</text>
							</view>
						</view>
						<view class="appointment-flex" style="margin-top:29rpx;">
							<view class="">
								<button type="default" class="remark-btn" @click="open(item.remark)">查看备注</button>
							</view>
							<view class="appointment-flex" v-if="item.audit_status==2">
								<button type="default" class="refuse-btn" @click="operation(item.apply_id)">拒绝</button>
								<button type="default" class="agree-btn" @click="agree(item.apply_id)">同意</button>
							</view>

						</view>

					</view>


				</view>

				<view :hidden="userFeedbackHidden" class="popup_content">
					<view class="popup_title">拒绝原因</view>
					<view class="popup_textarea_item">
						<view class="popup_textarea" style="display: flex;">
							<image src="@/static/images/jujuewrite.png" mode="" class="writes"></image>
							<textarea style="height: 100%;" placeholder="请输入拒绝理由…" v-model="feedbackContent">

							 </textarea>
						</view>

						<view style="margin-left: 35upx;text-align: center;">
							<button class="popup_button" @click="submitFeedback">确认拒绝</button>
							<button class="cancel_btn" @click="cancel">取消</button>
						</view>
					</view>
				</view>
				<view class="popup_overlay" @touchmove.stop.prevent="moveHandle" :hidden="userFeedbackHidden" @click="hideDiv()"></view>
			</block>
			<block v-else>
				<view class="check-orders">
					<Abnor :abnor="'YUYUE'"></Abnor>
				</view>
			</block>

			<!-- <view style="padding: 16rpx;word-break: break-all;" v-for="(item,index) in cAppointmentData" :key="index">{{item.jsonStr}}

			</view> -->
		</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import Abnor from '@/components/template/Abnor.vue'
export default {
    components: {
        PageNavBar,
        Abnor
    },
    data() {
        return {
            // 当前页面的query
            pageQuery: {},
            dataType: 1,
            types: 2,
            type: 2,
            page: 1,
            bus_id: '',
            apply_id: 0,
            value: false,
            userFeedbackHidden: true, // 默认隐藏
            feedbackContent: '', // 用户反馈内容

            // 分类的数据
            typeData: [
                {
                    id: '2',
                    title: '未审核'
                },
                {
                    id: '1',
                    title: '已审核'
                },
                {
                    id: '3',
                    title: '已拒绝'
                },
                {
                    id: '4',
                    title: '全部'
                }
            ],
            orderData: {
                data: []
            },
            isMore: true,

            // 当前分类选中的项的索引
            typeActive: 0,
            // 预约列表的接口数据
            appointmentListRes: {
                // 原始接口数据
                data: [],
                // 是否正在请求
                isFetching: false,
                // 是否还有更多
                hasMore: true,
                // 当前页码,0代表还未请求
                page: 0,
                // 分页大小
                listRow: 20
            }
        }
    },
    computed: {
        // 格式化预约列表的data
        cAppointmentData() {
            return (this.appointmentListRes.data || []).map(item => ({
                jsonStr: JSON.stringify(item)
            }))
        }
    },
    onLoad(query) {
        console.log(query)
        this.bus_id = query.bus_id
        this.pageQuery = query
        // this.fetchappointmentListRes()
        this.getAppointmentList()

    },


    methods: {
        open(item) {
            if (item == '') {
                item = '客户暂没填写备注信息'
            }
            uni.showModal({
                title: '客户备注',
                content: item,
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#000000',
                success: res => {
                    console.log(res)
                }
            })
        },
        move() {

        },
        showDiv() {

        },
        hideDiv() {
            // 隐藏输入弹出框
            this.userFeedbackHidden = true
        },
        submitFeedback() {
            if(this.submitFeedbacking) return 
			this.submitFeedbacking = true
			uni.showLoading({
				icon: 'none',
				title: '请稍候...'
			})
			let postData = {
				apply_id: this.apply_id,
				audit_status: 3,
				refuse_cause: this.feedbackContent
			}
			// 提交反馈
			
			App._postP('merchant.Index/editReserveApply', postData).then(res => {
				uni.hideLoading()
				this.submitFeedbacking = true
				if (res.code == 1) {
					this.userFeedbackHidden = true
					this.listInit(this.type)
					this.getAppointmentList(1, false)
				}
			}).catch(()=>{
				uni.hideLoading()
				this.submitFeedbacking = false
			})

			var _this = this
			// 提交反馈内容
			console.log(_this.feedbackContent)
        },

        cancel() {
            this.userFeedbackHidden = true
        },
        operation(id) {
            // 显示输入弹出框
            this.feedbackContent = ''
            this.userFeedbackHidden = false
            this.apply_id = id


        },
        getAppointmentList(page = 1, isPage = false) {
            let _this = this
            let postData
            if (this.type == null) {
                postData = {
                    bus_id: this.bus_id,
                    page
                }
            } else {
                postData = {
                    bus_id: this.bus_id,
                    type: this.type,
                    page
                }
            }
            App._postP('merchant.Index/getBusReserveApplyList', postData).then(res => {
                console.log('--------------------------')
                console.log(res)
                if (isPage) {
                    if (res.data.data.length > 0) {
                        _this.orderData.data.push(...res.data.data)
                    }
                } else {
                    _this.orderData = res.data
                };
                _this.isMore = res.data.data.length == res.data.per_page
                App.hideLoading(1000)
            })
        },
        listInit(express_type) {
            this.type = express_type
            this.page = 1
            uni.pageScrollTo({
                duration: 0,
                scrollTop: 0
            })
        },
        onReachBottom() {
            console.log('触底事件——————————')
            let _this = this
            let orderData = _this.orderData
            if (_this.page < orderData.last_page) {
                _this.getAppointmentList(++_this.page, true)
            }
        },
        expressType(item) {
            console.log(item)
            switch (item.id) {
            case '1':
                this.type = 1
                this.types = 1
                break
            case '2':
                this.type = 2
                this.types = 2
                break
            case '3':
                this.type = 3
                this.types = 3
                break
            case '4':
                this.type = null
                this.types = 4
                break
            };
            this.listInit(this.type)
            this.getAppointmentList(1, false)

        },
        // 拒绝
        refuse() {

        },
        // 同意
        agree(id) {
            let postData = {
                apply_id: id,
                audit_status: 1

            }
            App._postP('merchant.Index/editReserveApply', postData).then(res => {
                console.log(res)
                if (res.code == 1) {
                    this.listInit(this.type)
                    this.getAppointmentList(1, false)
                }
            })
        },
        handleRadioTypeChange(e) {
            this.typeActive = this.typeData.findIndex(item => item.id === e.detail.value)
            this.fetchappointmentListRes({
                resetBeforeFetch: true
            })
        },
        // 请求appointmentListRes数据的方法
        async fetchappointmentListRes({
            // 请求之前是否重置当前的列表
            resetBeforeFetch = false
        } = {}) {
            if (resetBeforeFetch) {
                this.appointmentListRes = {
                    ...this.appointmentListRes,
                    data: [],
                    isFetching: false,
                    hasMore: true,
                    page: 0
                }
            }
            try {
                // 如果是点击推荐也不必请求
                if (this.topCateIndex <= 0) {
                    return Promise.reject()
                }
                // 没有更多了就不必再请求了
                if (!this.appointmentListRes.hasMore) {
                    return Promise.reject()
                }
                // 如果没有指定type也不用请求了
                const type = this.$util.deepGet(this.typeData, `${this.typeActive}.id`, '')
                if (!type) {
                    return Promise.reject()
                }
                // 应该还要判断当前是否有正在进行的请求，若有，则取消。但是当前底层方法不支持
                // 设置为正在请求
                this.appointmentListRes.isFetching = true
                // 请求数据
                const res = await App._postP('merchant.Index/getBusReserveApplyList', {
                    page: this.appointmentListRes.page + 1,
                    listRow: this.appointmentListRes.listRow,
                    bus_id: this.pageQuery.bus_id,
                    type
                })
                // 取得新的数据
                const newData = this.$util.deepGet(res, 'data.data', [])
                // 判断是否有更多
                const hasMore = newData.length >= this.appointmentListRes.listRow
                console.log()
                // 设置新的数据
                this.appointmentListRes = {
                    ...this.appointmentListRes,
                    page: this.appointmentListRes.page + 1,
                    data: this.appointmentListRes.data.concat(newData),
                    hasMore,
                    isFetching: false
                }
            } catch (e) {
                console.log('+++++++++++')
                console.log(e)
                // TODO handle the exception
            }
        }
    },
    // 时间戳的处理
    filters: {
        formatDate: function (value) {
            var time = new Date(value * 1000)
            var y = time.getFullYear()
            var m = time.getMonth() + 1
            var d = time.getDate()
            var h = time.getHours()
            var mm = time.getMinutes()
            var s = time.getSeconds()
            return y + '-' + m + '-' + d

        }

    }
}
</script>

<style lang="less" scoped>
	text {
		font-size: 26rpx;
	}

	.writes {
		width: 20px;
		height: 20px;
		// margin: -6rpx 5px;
		margin-right: 5px;
		margin-top: 5rpx;
	}

	.appointment-flex {
		display: flex;
		justify-content: space-between;
	}

	.appointment_content {
		display: flex;

	}

	.appointment-goodsImg {
		width: 170rpx;
		height: 170rpx;
		border-radius: 10px;
		margin-right: 19rpx;
	}

	.list-wrap {
		background: rgba(255, 255, 255, 1);
		border-radius: 15rpx;
		padding: 30rpx;
	}

	.goods-title {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		font-weight: 500;
		color: rgba(51, 51, 51, 1);

	}

	.contentWrap {
		display: flex;
		flex-direction: column;
		justify-content: space-between;

	}

	.refuse-btn {
		background-color: #FE504F;

		height: 50rpx;
		color: #FFFFFF;
		margin-right: 16px;
		font-size: 26rpx;
		line-height: 50rpx;
	}

	.agree-btn {
		background-color: #FFD940;

		height: 50rpx;

		font-size: 26rpx;
		line-height: 50rpx;
	}

	.remark-btn {
		border: 1px solid rgba(204, 204, 204, 1);
		height: 50rpx;

		font-size: 26rpx;
		line-height: 50rpx;
	}

	.popup_overlay {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.4);
		z-index: 1001;
		// -moz-opacity: 0.6;
		// opacity: 0.6;
		// filter: alpha(opacity=66);
	}

	.popup_content {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 520upx;
		height: 500upx;
		margin-left: -270upx;
		margin-top: -270upx;
		border: 10px solid white;
		background-color: white;
		z-index: 1002;
		overflow: auto;
		border-radius: 20upx;
	}

	.popup_title {
		padding-top: 20upx;
		width: 480upx;
		text-align: center;
		font-size: 32upx;
	}

	.popup_textarea_item {
		padding-top: 5upx;
		height: 140upx;
		width: 480upx;

		margin-top: 30upx;
		// margin-left: 20upx;
	}

	.popup_textarea {
		padding: 10rpx;
		width: 460upx;
		height: 200upx;
		margin-bottom: 10px;
		font-size: 26upx;
		margin-left: 20upx;
		border-radius: 10rpx;
		background: #F7F7F7;
	}

	.popup_button {

		font-size: 16px;
		background-color: #FFD940;

		width: 100%;
	}

	.cancel_btn {
		color: #999999;
		font-size: 16px;
		background-color: #FFFFFF;
		width: 100%;
	}
</style>
