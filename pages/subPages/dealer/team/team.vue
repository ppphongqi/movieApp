<template>
	<view class="contaienr" :style="themeColor">
		<u-sticky v-if="navList.length" h5-nav-height="0">
			<page-header v-if="listStyle=='1'">
				<block slot="content">
					<view class="team-list dis-flex flex-dir-row">
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center all">
							<view class="col-9 f-24">全部人员</view>
							<view class="col-3 f-48">{{teamdetail.total_team}}</view>
						</view>
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center already">
							<view class="col-9 f-24">已下单</view>
							<view class="col-3 f-48">{{teamdetail.order_team}}</view>
						</view>
						<view class="team-item t-c dis-flex flex-dir-column flex-x-center">
							<view class="col-9 f-24">未下单</view>
							<view class="col-3 f-48">{{teamdetail.notOrder_team}}</view>
						</view>
					</view>
				</block>
			</page-header>
			<view style="height: 100rpx;"><page-nav-bar :nav-list="navList" :current="lv"  @navItemClick="tabNavbar"></page-nav-bar></view>
			<!-- 二级选择器 -->
			<view v-if="listStyle==='1'" class="radio-nav-list">
				<view class="radio-nav-item" v-for="item in cSubNavList" :key="item.id" :class="{'is-active': item.id == subNavListActiveId}" @click="handleSubNavListClick(item)">
					{{item.title}}
				</view>
			</view>
			<!-- 二级选择器 -->
			<view class="team-user-search b-f" v-if="listStyle==='2'">
				<view class="iconfont icon-search_light"></view>
				<input type="text" value="" class="flex-box f-28 col-3" confirm-type="search" v-model="nickName" @confirm="getTeamDetail(lv, listStyle, 1)"
				 placeholder="请输入用户昵称" placeholder-style="font-size:28rpx;color:#999;" />
			</view>
		</u-sticky>
		<view class="scrollView">
			<block v-if="!!teamdetail.data&&teamdetail.data.length>0">
				<view class="team-user-list" :class="'list-style-'+listStyle">
					<block v-if="listStyle=='1'">
						<view class="team-user-item module-content dis-flex flex-y-center" v-for="(teamItem,index) in teamdetail.data"
						 :key="index" @click="skip" :data-recid="teamItem.id">
							<view class="team-user-avatar">
								<image :src="teamItem.avatarUrl"></image>
							</view>
							<view class="team-user-info flex-box">
								<view class="team-user-title dis-flex flex-x-between flex-y-center">
									<view class="col-3 f-28 flex-box onelist-hidden p-r">{{teamItem.nickName}}<view v-if="[1,2,3].includes(+teamItem.level)" class="label-name help-bg-color auxiliary-color">{{settingData && settingData.diy_font && settingData.diy_font.fxs || ''}}</view></view>
									<block v-if="teamItem.total_order<=0">
										<view class="not-order">未下单</view>
									</block>
									<block v-else>
										<view class="col-3 f-28">{{settingData.currency}}{{teamItem.rebate_money}}</view>
									</block>
								</view>
								<view class="col-9 f-24 user-invite m-top10">邀请：<text>{{teamItem.referee_num}}</text>人</view>
								<view class="f-24 col-9 m-top10">{{teamItem.id?"推荐时间：":""}}{{teamItem.create_time}}</view>
								<view v-if="teamItem.work" class="f-24 col-9 m-top10 dis-flex flex-y-center" @click.stop="handleStatusClick(teamItem)">任务状态：<text class="col-f4">{{teamItem.work_status === false ? '未完成' : '已完成'}}</text><view v-if="teamItem.work && !teamItem.work_status" class="iconfont icon-tishi is-inline m-left12"></view></view>
								<view v-if="teamItem.work && !teamItem.work_status" class="f-24 col-9 m-top10">释放关系：{{teamItem.release_time || ''}}</view>
							</view>
						</view>
					</block>
					<!-- <block v-else-if="listStyle=='2'"> -->
					<block v-else-if="listStyle=='2'">
						<view class="team-user-item module-content dis-flex flex-x-between flex-y-center" v-for="(teamItem,index) in teamdetail.data"
						 :key="index" @click="skip" :data-recid="teamItem.id">
							<view class="team-user-avatar dis-flex flex-y-center">
								<image :src="teamItem.avatarUrl" class="user-avatar"></image>
								<view class="dis-flex flex-dir-column flex-x-around">
									<view class="col-3 f-28">{{teamItem.nickName}}</view>
									<view class="col-9 f-24">{{teamItem.create_time}}</view>
									<view v-if="teamItem.work" class="f-24 col-9 m-top10 dis-flex flex-y-center" @click.stop="handleStatusClick(teamItem)">任务状态：<text class="col-f4">{{teamItem.work_status === false ? '未完成' : '已完成'}}</text><view v-if="teamItem.work && !teamItem.work_status" class="iconfont icon-tishi is-inline m-left12"></view></view>
									<view v-if="teamItem.work && !teamItem.work_status" class="f-24 col-9 m-top10">释放关系：{{teamItem.release_time || ''}}</view>
								</view>
							</view>
							<block v-if="lv === 0">
								<view class="col-m f-24">已绑定</view>
							</block>
							<block v-else>
								<view class="t-r">
									<view class="col-m f-26">{{teamItem.rebate_money}}元</view>
									<view class="col-9 f-24">共计</view>
								</view>
							</block>
						</view>
					</block>
				</view>
				<loadmore :showLoadmore="!showLoadmore"></loadmore>
			</block>
			<block v-else>
				<Abnor :abnor="'DATA'"></Abnor>
			</block>
		</view>
		<page-loading ref="loading"></page-loading>
		<!-- 任务状态弹窗 -->
		<popup-view :show="wrokStatusPopupVisible" type="bottom" @clickmask="wrokStatusPopupVisible = false">
			<view class="work-status-card app-after--safe-bottom">
				<!-- title -->
				<view class="work-status-card__title">任务状态</view>
				<!-- title end -->
				<!-- content -->
				<view class="work-status-card__content">
					<view v-if="wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_num || wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_num" class="work-status-card__attrs">
						<view v-if="wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_num" class="work-status-card__attr">
							<view class="work-status-card__attr__num">{{wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_num}}</view>
							<view class="work-status-card__attr__text">订单总数量</view>
						</view>
						<view v-if="wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_num" class="work-status-card__attr">
							<view class="work-status-card__attr__num is-red">{{wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_num}}</view>
							<view class="work-status-card__attr__text">未完成订单</view>
						</view>
					</view>
					<view v-if="wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_money || wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_money" class="work-status-card__attrs">
						<view v-if="wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_money" class="work-status-card__attr">
							<view class="work-status-card__attr__num"><text class="work-status-card__attr__currency">￥</text>{{wrokStatusItem.work && wrokStatusItem.work.work && wrokStatusItem.work.work.order_money}}</view>
							<view class="work-status-card__attr__text">支付总金额</view>
						</view>
						<view v-if="wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_money" class="work-status-card__attr">
							<view class="work-status-card__attr__num is-red"><text class="work-status-card__attr__currency">￥</text>{{wrokStatusItem.work && wrokStatusItem.work.have_work && wrokStatusItem.work.have_work.order_money}}</view>
							<view class="work-status-card__attr__text">未完成金额</view>
						</view>
					</view>
				</view>
				<!-- content end -->
				<!-- tip -->
				<view v-if="!wrokStatusItem.work_status" class="work-status-card__tip">释放关系：{{wrokStatusItem.release_time}}</view>
				<!-- tip end -->
				<!-- 关闭按钮 -->
				<view class="work-status-card__btn-close iconfont icon-searchclose" @click="wrokStatusPopupVisible = false">
				</view>
				<!-- 关闭按钮 end -->
			</view>
		</popup-view>
		<!-- 任务状态弹窗 end -->
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PageHeader from '@/components/template/PageHeader.vue'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import loadmore from '@/components/template/Loadmore.vue'
import Abnor from '@/components/template/Abnor.vue'
import PopupView from '@/components/template/PopManager.vue'
export default {
	components: {
	    PageHeader,
	    PageNavBar,
	    loadmore,
	    Abnor,
		PopupView
	},
    data() {
        return {
            lv: null,
            current_page: 1,
            teamdetail: {},
            showLoadmore: false,
            scrollHeight: '',
            isMore: false,
            list_page: null,
            navList: [],
            // 样式类型
            listStyle: '1',
            // 搜索昵称
            nickName: '',
            // 当前选中的二级分类的id
            subNavListActiveId: '',
			// 任务状态弹窗是否显示
			wrokStatusPopupVisible: false,
			wrokStatusItem: {}
        }
    },
    computed: {
        // 二级分类
        cSubNavList() {
            return [
                {
                    id: '2',
                    title: '看' + this.$util.deepGet(this.settingData, 'diy_font.fxs', '')
                },
                {
                    id: '1',
                    title: '看' + this.$util.deepGet(this.settingData, 'diy_font.offline', '')
                }
            ]
        }
    },
    
    onLoad(options) {
        this.lv = Number(options.lv)
        this.listStyle = options.listStyle

        console.log(this.listStyle, 'this.listStyle=============')
        this.getMyTeam(options.listStyle)
        this.$nextTick(function () {
            this.getTeamDetail(Number(options.lv), options.listStyle, 1)
        })
        console.log('options++++', options)
    },

    onShow() {

    },
    mounted() {

    },
    methods: {
		// 任务状态点击事件
		handleStatusClick(item) {
			this.wrokStatusPopupVisible = true
			this.wrokStatusItem = item
		},
        // 二级分类点击事件
        handleSubNavListClick(item) {
            if (this.subNavListActiveId == item.id) {
                this.subNavListActiveId = ''
            } else {
                console.log('ha2')
                this.subNavListActiveId = item.id
            }
            this.tabNavbar({
                id: this.lv
            })
        },
        getTeamDetail(lv = 0, types, page, isPage = false) {
            let _this = this,
                params = {
                    lv,
                    page
                }
            if (types === '2') {
                params.types = lv === 0 ? 2 : 1
                params.nickName = _this.nickName || ''
            }
            if (this.listStyle == '1') {
                params.type = this.subNavListActiveId
            } else {
                delete params.type
            }
            App._get('user.dealer.User/getStaffNum', params, result => {
                let data = result.data
                if (isPage === true) {
                    _this.teamdetail.data.push(...data.data)
                } else {
                    _this.teamdetail = data
                }
                _this.showLoadmore = data.data.length === data.per_page
                _this.current_page = page
                App.hideLoading()
                uni.hideLoading()
            })
        },
        getMyTeam(team_diy) {
            let _this = this
            App._get('user.dealer.User/getDealerLv', {}, res => {
                let {
                        lv,
                        dealer_count,
                        user_count,
                        is_move_protect
                    } = res.data,
                    appSetting = _this.$store.state.appSetting,
                    navList = team_diy == '1' ? [
                        {
                            title: '全部团队',
                            id: 0,
                            name: 'lv_team'
                        },
                        {
                            title: '一级团队',
                            id: 1,
                            name: 'lv_one'
                        },
                        {
                            title: '二级团队',
                            id: 2,
                            name: 'lv_two'
                        },
                        {
                            title: '三级团队',
                            id: 3,
                            name: 'lv_three'
                        }
                    ] : [
                        {
                            title: `客户(${user_count})`,
                            id: 0
                        },
                        {
                            title: `销售(${dealer_count})`,
                            id: 1
                        }
                    ]
                console.log('appSetting66666666666666666', appSetting)
                console.log('3333333333222222222111', navList)
                lv = Number(lv)
                navList = navList.map(item => {
                    item.title = appSetting.diy_font[item.name] || item.title
                    return item
                }).filter((val, index) => index <= lv)
                if (is_move_protect && team_diy === '2') {
                    navList = navList.filter(val => val.id !== 0)
                }
                _this.navList.splice(0, navList.length, ...navList)
                console.log(_this.navList, '_this.navList==========')
            })
        },
        tabNavbar(val) {
            this.lv = val.id
            uni.pageScrollTo({
                duration: 0,
                scrollTop: 0
            })
            this.current_page = 1
            this.getTeamDetail(Number(val.id), this.listStyle, 1)
        },

        // 跳转个人详情
        skip(e) {
            let id = e.currentTarget.dataset.recid
            App.navigationTo({
                url: `pages/subPages/dealer/team/detail?id=${id ? id : ''}`
            })
        }
    },
    /**
		 * 上滑加载更多
		 **/
    onReachBottom() {
        console.log('到达最底部')
        if (this.current_page >= this.teamdetail.last_page) {
            this.showLoadmore = false
            return false
        };
        this.getTeamDetail(this.lv, this.listStyle, ++this.current_page, true)
    }
}
</script>

<style>
	.contaienr {
		background: #F7F7F7;
	}

	/* 头部样式 */
	.team-item {
		width: 100%;
		height: 144upx;
		position: relative;
	}

	.team-item::after {
		position: absolute;
		font-size: 36upx;
		color: #333333;
		width: 1em;
		line-height: 1em;
		top: 50%;
		right: -.5em;
		transform: translateY(-50%);
	}

	.team-item.all::after {
		content: "=";
	}

	.team-item.already::after {
		content: "+";
	}

	/* 团队列表 */
	.team-user-list {
		padding: 4rpx 30rpx 0;
		box-sizing: border-box;
	}

	.team-user-item {
		border-radius: 6upx;
		margin-top: 20upx;
	}

	.team-user-avatar {
		margin-right: 25upx;
	}

	.team-user-avatar image {
		width: 96upx;
		height: 96upx;
		display: block;
		border-radius: 50%;
	}

	.list-style-2 .user-avatar {
		width: 66rpx;
		height: 66rpx;
		display: block;
		margin-right: 18rpx;
	}

	.list-style-2 .team-user-item {
		border-radius: 0;
		margin: 0;
		position: relative;
	}

	.list-style-2 .team-user-item::after {
		content: " ";
		position: absolute;
		left: 30rpx;
		right: 30rpx;
		bottom: 1rpx;
		border-bottom: 1rpx solid #eee;
	}

	.list-style-2:first-child {
		border-radius: 10rpx 10rpx 0 0;
	}

	.list-style-2:last-child {
		border-radius: 0 0 10rpx 10rpx;
	}

	.list-style-2 .team-user-item:last-child::after {
		content: none;
	}

	.not-order {
		color: #999999;
		font-size: 24upx;
		padding: 8upx 12upx;
		border: 1upx solid #EEEEEE;
		border-radius: 6upx;
	}

	.user-invite text {
		color: #333333;
	}

	/* 团队搜索 */
	.team-user-search {
		height: 96rpx;
		line-height: 96rpx;
		padding: 12rpx 30rpx;
		box-sizing: border-box;
		z-index: 1;
	}

	.team-user-search .iconfont {
		position: absolute;
		top: 50%;
		left: 50rpx;
		font-size: 30rpx;
		width: 1em;
		height: 1em;
		line-height: 1em;
		transform: translateY(-50%);

	}

	.team-user-search .flex-box {
		width: 100%;
		height: 72rpx;
		line-height: 72rpx;
		background: #F6F6F6;
		border-radius: 72rpx;
		padding-left: 70rpx;
		box-sizing: border-box;
	}
</style>

<style scoped lang="scss">
	.label-name {
		display: inline-block;
		padding: 4rpx;
		border-radius: 4rpx;
		font-size: 20rpx;
		margin-left: 8rpx;
	}
	/* 二级选择器 */
	.radio-nav-list {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 30rpx 30rpx 30rpx;
		background-color: #fff;
	}
	.radio-nav-item {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		max-width: 100%;
		height: 54rpx;
		margin-right: 20rpx;
		padding: 0 16rpx;
		color: #333;
		font-size: 24rpx;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 9999rpx;
		background-color: #EEEEEE;
		&.is-active {
			background-color: var(--theme-color, #333);
			color: var(--auxiliary-color, #333);
		}
	}
	/* 二级选择器 */
	// 卡包二维码
	.work-status-card {
		position: relative;
		box-sizing: border-box;
		width: 100vw;
		padding-top: 42rpx;
		padding-bottom: 60rpx;
		background-color: #fff;
		border-radius: 20rpx 20rpx 0px 0px;
	}
	.work-status-card__title {
		margin-bottom: 40px;
		text-align: center;
		font-size: 36rpx;
		color: #333333;
		font-weight: bold;
	}
	
	.work-status-card__content {
		box-sizing: border-box;
		padding: 0 30rpx;
	}
	
	.work-status-card__attrs {
		display: flex;
		align-items: center;
		height: 194rpx;
		border-radius: 20rpx;
		background-color: #F8F8F8;
		&+& {
			margin-top: 20rpx;
		}
	}
	
	.work-status-card__attr {
		position: relative;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		&+&::before {
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			box-sizing: border-box;
			content: "\20";
			display: block;
			width: 2rpx;
			height: 70rpx;
			background-color: #EEEEEE;
		}
	}
	.work-status-card__attr__num {
		font-size: 58rpx;
		color: #333333;
		&.is-red {
			color: #FF4444;
		}
	}
	.work-status-card__attr__text {
		font-size: 24rpx;
		color: #999;
	}
	.work-status-card__attr__currency {
		font-size: 28rpx;
	}
	
	.work-status-card__tip {
		margin-top: 38rpx;
		font-size: 24rpx;
		color: #999;
		text-align: center;
	}
	
	.work-status-card__btn-close {
		position: absolute;
		top: 24rpx;
		right: 33rpx;
		color: #333;
		font-size: 36rpx;
	}
	
	// 卡包二维码 end
</style>
