<template>
    <view class="page-clock-rank app-clearfix">
        <!-- 顶部导航 -->
        <u-sticky h5-nav-height="0">
            <!-- 顶部tab -->
            <page-nav-bar
                class="page-nav"
                :nav-list="cTopCateData"
                :current="cTopCateActiveItem.id"
                @on-nav-item-click="handleTopCateItemClick"
            ></page-nav-bar>
        </u-sticky>
        <!-- 顶部导航 end -->
        <!-- 前三名 -->
        <rank-top :list="cTopList" />
        <!-- 前三名 end -->
        <!-- 前N名 -->
        <rank-list :list="cSiblingslingList" />
        <!-- 前N名 end -->
        <!-- 邀请好友按钮 -->
        <view class="app-wrapper--safe-fixed-bottom" style="bottom: 160rpx">
            <button class="btn-normal page-clock-rank__btn-share" @click="handleBtnInviteClick">
                <view class="iconfont icon-122 m-right12"></view>邀请好友
            </button>
        </view>
        <!-- 邀请好友按钮 end -->
        <!-- 底部导航 -->
        <tab-bar />
        <!-- 底部导航 end -->
		<!-- 海报弹窗 -->
		<share-view ref="shareView" posterType="clock" :customPic="invitePosterRes" :height="667" :width="375">
		</share-view>
		<!-- 海报弹窗 end -->
        <!-- 页面loading -->
        <page-loading ref="loading"></page-loading>
        <!-- 页面loading end -->
    </view>
</template>

<script>
import App from "@/common/js/app.js";
import TabBar from "./components/TabBar.vue";
import PageNavBar from "@/components/template/PageNavBar2.vue";
import RankTop from "./components/RankTop.vue";
import RankList from "./components/RankList.vue";
import ShareView from '@/components/template/ShareView.vue'
export default {
    components: {
        PageNavBar,
        TabBar,
        RankTop,
        RankList,
		ShareView
    },
    data() {
        return {
            options: {},
            // 当前选中的顶部tab索引
            topCateAvtive: 0,
			// 排行榜非分页列表
			listResMap: {
				
			},
			// 邀请好友的接口数据
			invitePosterRes: ''
        };
    },
    computed: {
        // 格式化的顶部tab的数据
        cTopCateData() {
			const rs = []
			if(this.$util.deepGet(this.settingData,'clock.is_morning_open') == 1) {
				rs.push({
                    id: "1",
                    title: `今日早起`,
                })
			}
			if(this.$util.deepGet(this.settingData,'clock.is_night_open') == 1) {
				rs.push({
                    id: "2",
                    title: `昨日早睡`,
                })
			}
            return rs;
        },
        // 当前选中的顶部分类的项
        cTopCateActiveItem() {
            return this.cTopCateData[this.topCateAvtive] || {};
        },
		// 格式化的列表数据
		cList() {
			return (this.listResMap[this.cTopCateActiveItem.id] && this.listResMap[this.cTopCateActiveItem.id].list || []).map((item,index)=>({
				id: item.user_id,
				avatar: item.avatarUrl,
				nickname: item.nickName,
				rank: index+1,
				time: item.clock_time
			}))
		},
		cTopList() {
			return this.cList.slice(0,2) || []
		},
		cSiblingslingList() {
			const list = this.cList.slice(3) || []
			// 自己
			const mine = this.listResMap[this.cTopCateActiveItem.id] && this.listResMap[this.cTopCateActiveItem.id].user || {}
			const index = list.findIndex(item=>item.id === user.user_id)
			if(index === -1) {
				return [...list,{
					id: mine.user_id,
					avatar: mine.avatarUrl,
					nickname: mine.nickName,
					rank: mine.Ranking,
					time: mine.clock_time,
					isMine: true
				}]
			}else {
				list[index].isMine = true
				return list
			}
		}
    },
    async onLoad(options) {
        uni.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
        });
        this.options = options;
		try {
		    // await this.mainMixin_BeforeFetchPageData();
		    uni.setNavigationBarColor({
		        frontColor: "#000000",
		        backgroundColor: "#ffffff",
		    });
			this.fetchInvitePosterRes().catch(()=>{})
			await this.fetchListResMap()
		    App.hideLoading();
		} catch (e) {
		    console.log("onShow 报错", e);
		    // TODO handle the exception
		}
    },
    async onShow() {
        
    },
	watch: {
		cTopCateActiveItem(val) {
			this.fetchListResMap()
		}
	},
    methods: {
		// 立即邀请按钮点击事件
		handleBtnInviteClick() {
			this.$refs.shareView.shareswich()
		},
        // 顶部分类点击事件
        handleTopCateItemClick({ index }) {
            this.topCateAvtive = index;
        },
		async fetchListResMap({
			clock_type = this.cTopCateActiveItem.id
		}={}) {
			try {
				if(!this.listResMap[clock_type]) {
					console.log(333)
					this.listResMap = {
						...this.listResMap,
						[clock_type]: {}
					}
				}
				if(this.listResMap[clock_type] && this.listResMap[clock_type].list && this.listResMap[clock_type].list.length) {
					return
				}
				const res = await App._getP('clock.Clock/getRankingList', {
					clock_type
				})
				this.listResMap[clock_type] = res.data || {}
			} catch (e) {
				console.log('fetchCardCateRes', e)
				return Promise.reject(e)
				// TODO handle the exception
			}
		},
		async fetchInvitePosterRes() {
			try {
				const res = await App._getP('clock.Clock/getClockInvitePoster', {})
				this.invitePosterRes = res.data || ''
			} catch (e) {
				console.log('fetchCardCateRes', e)
				return Promise.reject(e)
				// TODO handle the exception
			}
		},
    },
};
</script>

<style lang="scss" scoped>
.page-clock-rank {
    position: relative;
    min-height: 100vh;
    background-color: #ffd940;
    padding-bottom: 300rpx;

    ::v-deep .navbar-box {
        background-color: #ffd940;
    }

    ::v-deep .select-nav-items {
        color: #000;
    }
}
.page-clock-rank__btn-share {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 690rpx;
    height: 100rpx;
    margin: 0 auto;
    font-size: 32rpx;
    color: #fff;
    border-radius: 20rpx;
    background-color: #2568ee;
}
</style>
