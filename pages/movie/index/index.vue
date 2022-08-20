<template>
    <view class="container" :class="tabContainer" :style="themeColor">
        <!-- <HomeHeader :type="cHomeHeaderData.type" :cateVisible="cHomeHeaderData.cateVisible"
			:agentName="cHomeHeaderData.agentName" :agentJump="cHomeHeaderData.agentJump" :title="cHomeHeaderData.title"
			:titleStyle="cHomeHeaderData.titleStyle" :cateData="cHomeHeaderData.cateData"
			:swiperData="cHomeHeaderData.bannerData" :scrollTop="scrollTop" @on-cate-item-click="onTopCateClick"
			@on-swiper-item-click="onTopSwiperItemClick" :navBgColor="cHomeHeaderData.navBgColor"></HomeHeader> -->
        <view style="min-height: 80vh">
            <view class="content">
                <view
                    class="nav"
                    style="background-color: var(--theme-color, #ffd940)"
                    :style="{ paddingTop: paddingTop + 10 + 'px' }"
                >
                    <view class="cityselect" @click="tocity">
                        <view class="cityselect-name">
                            {{ city == "" ? "未获取" : city }}
                        </view>
                        <image
                            src="/static/icon/down.png"
                            mode=""
                            class="city-icon-down"
                        ></image>
                    </view>
                    <view class="search-item" @click="tosearch">
                        <image
                            src="/static/icon/Search.png"
                            mode=""
                            class="search-icon"
                        ></image>
                        <view class="search-text"> 想看什么？ </view>
                    </view>
                </view>
                <view
                    class="scroll-by"
                    :style="{ marginTop: 60 + paddingTop + 'px' }"
                >
                    <swiper class="swiper">
                        <swiper-item>
                            <image
                                src="https://mango-1303204763.cos.ap-nanjing.myqcloud.com/p2627333038.jpg"
                                mode=""
                            >
                            </image>
                        </swiper-item>
                        <swiper-item>
                            <image
                                src="https://mango-1303204763.cos.ap-nanjing.myqcloud.com/p2581407969.jpg"
                                mode=""
                            >
                            </image>
                        </swiper-item>
                        <swiper-item>
                            <image
                                src="https://mango-1303204763.cos.ap-nanjing.myqcloud.com/p2628447276.jpg"
                                mode=""
                            >
                            </image>
                        </swiper-item>
                        <swiper-item>
                            <image
                                src="https://mango-1303204763.cos.ap-nanjing.myqcloud.com/cdzj2.jpeg"
                                mode=""
                            >
                            </image>
                        </swiper-item>
                    </swiper>
                </view>

                <view class="option-list">
                    <view>
                        <view class="inv-h-w">
                            <view
                                :class="['inv-h', Inv == 0 ? 'inv-h-se' : '']"
                                @click="changeTab(0)"
                                >热映中</view
                            >
                            <view
                                :class="['inv-h', Inv == 1 ? 'inv-h-se' : '']"
                                @click="changeTab(1)"
                                >待上映</view
                            >
                        </view>
                        <view class="option-list-view" v-show="Inv == 0">
                            <view
                                class="option-list-view-item"
                                v-for="(item, index) in hotlist"
                                @click="detailtap(item.id, index)"
                                :id="item.id"
                                :key="index"
                            >
                                <image
                                    :src="item.pic"
                                    class="list-item-fm"
                                ></image>
                                <view class="list-item-info">
                                    <view class="item-info-title">
                                        {{ item.name }}
                                    </view>
                                    <view
                                        class="item-info-pingfen"
                                        v-if="item.grade == ''"
                                    >
                                        <view class="item-info-pingfen-num">{{
                                            item.wishNum
                                        }}</view
                                        >人想看
                                    </view>
                                    <view
                                        class="item-info-pingfen"
                                        v-else-if="item.grade != ''"
                                    >
                                        评分<view
                                            class="item-info-pingfen-num"
                                            >{{ item.grade }}</view
                                        >
                                    </view>
                                    <view class="item-info-performer">
                                        主演：{{
                                            item.cast == ""
                                                ? "暂未公开"
                                                : item.cast
                                        }}
                                    </view>
                                    <view class="item-info-starttime">
                                        {{ item.publishTime }} 上映
                                    </view>
                                </view>
                                <view class="list-item-action">
                                    <button
                                        type="default"
                                        v-if="ifbuy(item.publishTime)"
                                    >
                                        购票
                                    </button>
                                    <button type="default" v-else class="yubuy">
                                        预售
                                    </button>
                                </view>
                            </view>
                        </view>
                        <view class="option-list-view" v-show="Inv == 1">
                            <view
                                class="option-list-view-item"
                                v-for="(item, index) in dslist"
                                @click="detailtap(item.id, index)"
                                :key="index"
                            >
                                <image
                                    :src="item.pic"
                                    class="list-item-fm"
                                ></image>
                                <view class="list-item-info">
                                    <view class="item-info-title">
                                        {{ item.name }}
                                    </view>
                                    <view
                                        class="item-info-pingfen"
                                        v-if="item.grade == ''"
                                    >
                                        <view class="item-info-pingfen-num">{{
                                            item.wishNum
                                        }}</view
                                        >人想看
                                    </view>
                                    <view
                                        class="item-info-pingfen"
                                        v-else-if="item.grade != ''"
                                    >
                                        评分<view
                                            class="item-info-pingfen-num"
                                            >{{ item.grade }}</view
                                        >
                                    </view>
                                    <view class="item-info-performer">
                                        主演：{{
                                            item.cast == ""
                                                ? "暂未公开"
                                                : item.cast
                                        }}
                                    </view>
                                    <view class="item-info-starttime">
                                        {{ item.publishTime }} 上映
                                    </view>
                                </view>
                                <view class="list-item-action">
                                    <button
                                        type="default"
                                        v-if="ifbuy(item.publishTime)"
                                    >
                                        购票
                                    </button>
                                    <button type="default" v-else class="yubuy">
                                        预售
                                    </button>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 红包提示 -->
            <view
                class="bonus-tips dis-flex flex-x-around flex-y-center f-24 col-f"
                :class="{ 'bonus-tips-ipx': isIphoneX }"
                v-if="showBonus"
            >
                <view class=""
                    >你还有<text class="col-s">{{
                        pageOptions.redEnvelop_num
                    }}</text
                    >个红包待使用,快快下单立享优惠!</view
                >
                <view
                    class="bonus-tips-btn"
                    @click="
                        navigationTo(
                            'pages/subPages/user/coupon/coupon?type=bonus'
                        )
                    "
                    >立即查看
                </view>
                <view
                    class="iconfont icon-roundclose"
                    @click="showBonus = false"
                ></view>
            </view>
            <!-- 平台提示 -->
            <app-protocol @readSuccess="readSuccess"></app-protocol>
            <!-- 自定义底部菜单 -->
            <diy-tab :cNum="num"></diy-tab>
            <!-- 右上角添加小程序功能提示 -->
            <AddsamllFunction
                ref="addsamllFunction"
                :follow="is_follow"
                :isCustomNav="true"
            ></AddsamllFunction>
            <page-loading ref="loading"></page-loading>
            <voucher
                ref="voucher"
                :config="{ diyItems: diyItems }"
                @closeEvt="advertHandle"
            ></voucher>
        </view>
        <Copyright></Copyright>
        <!-- 分销商 -->
        <DistributorFixed />
        <!-- 分销商 end -->
        <!-- #ifdef H5 -->
        <FollowImgPopup
            v-if="settingData && settingData.qzgz"
            :visible="settingData.qzgz.indexOf('index') !== -1"
        >
        </FollowImgPopup>
        <!-- #endif -->
    </view>
</template>

<script>
import util from "@/common/js/utils/util.js";
import DiyPage from "@/components/page/DiyPage.vue";
import DiyTab from "@/components/template/TabBar.vue";
import AppProtocol from "@/components/template/AppProtocol.vue";
import App from "@/common/js/app.js";
import AddsamllFunction from "@/components/template/AddsamllFunction.vue";
import Voucher from "@/components/template/Voucher.vue";
import LeadAttention from "@/components/template/LeadAttention.vue";
import Copyright from "@/components/template/Copyright.vue";
import HomeHeader from "@/components/template/HomeHeader.vue";
import GoodsList from "@/components/page/pageComponents/Goods.vue";
import GoodsCard from "@/components/page/pageComponents/GoodsCard.vue";
import LoadMore from "@/components/template/Loadmore.vue";
import DistributorFixed from "@/components/page/pageComponents/DistributorFixed.vue";
// #ifdef H5
import FollowImgPopup from "@/components/page/pageComponents/FollowImgPopup.vue";
// #endif

// #ifdef H5
import wxApi from "@/static/h5/wxApi.js";
// #endif
export default {
    data() {
        return {
            is_follow: "",
            // 新增加
            paddingTop: 0,
            hotlist: [],
            dslist: [],
            city: "",
            cityId: 2,
            Inv: 0,
            pageNum: 0,
            // 新增加结束
            num: "",
            diyItems: [],
            imageList: [],
            express: "",
            // 页面的信息 比如标题等
            pageOptions: null,
            showBonus: false,
            isPageShow: false,
            isFollowWechat: false, // 是否公众号进入
            getBind: {},
            options: {},
            homeconfiginfo: [],
            paramsxdata: [],
            orderCount: {},
            member_Info: {},
            userInfo: {},
            // 当前页面的scrollTop
            scrollTop: 0,
            // 当前顶部分类选中的索引，-1代表没选中 0代表选中的推荐。-1和0都是老的版面样式。其他值都是统一一个列表样式
            topCateIndex: -1,
            // 顶部分类的接口（当取得了顶部信息时，再根据需不需要取顶部分类来决定要不要请求分类的值）
            topCateRes: [],
            // 类别商品列表的接口数据
            goodsListRes: {
                // 原始接口数据
                data: [],
                // 是否正在请求
                isFetching: false,
                // 是否还有更多
                hasMore: true,
                // 当前页码,0代表还未请求
                page: 0,
                // 分页大小
                listRow: 20,
            },
            // 类别商品列表的演示
            goodsItemStyle: {},
            // 代理信息的接口数据
            aidRes: {},
            // 当前地址的接口数据
            locationRes: {},
        };
    },
    components: {
        DiyPage,
        DiyTab,
        AppProtocol,
        AddsamllFunction,
        Voucher,
        LeadAttention,
        Copyright,
        HomeHeader,
        GoodsList,
        LoadMore,
        GoodsCard,
        DistributorFixed,
        // #ifdef H5
        FollowImgPopup,
        // #endif
    },
    computed: {
        // 登陆组件参数
        LoginData() {
            if (this.loginuser_id) {
                return {
                    login: this.loginuser_id,
                    photourl: this.userInfo.avatarUrl,
                    name: this.userInfo.nickName,
                    vipopen: this.userInfo.is_member,
                    card_title: this.member_Info.card_title,
                    account: this.account,
                };
            }
        },
        // 登录组件右侧最终卡卷信息
        account() {
            return this.paramsxdata.map((item) => {
                let number = 0;
                if (this.userInfo && this.userInfo.user_id) {
                    if (item === "余额") {
                        number = this.userInfo.balance;
                    } else if (item === "积分") {
                        number = this.userInfo.integral;
                    } else if (item === "订单") {
                        number = this.orderCount.send;
                    } else if (item === "优惠券") {
                        number = this.userInfo.coupon;
                    } else if (item === "红包") {
                        number = this.orderCount.redEnvelopes;
                    }
                }
                return {
                    name: item,
                    num: number,
                };
            });
        },
        // 返回用户登录id判断登录状态
        loginuser_id() {
            return this.userInfo && this.userInfo.user_id;
        },
        // 返回需要展示的卡卷信息
        // homeconfig() {
        // 	return this.homeconfiginfo && this.homeconfiginfo[0] && this.homeconfiginfo[0].paramsxdata
        // },
        // 类别商品的格式化数据
        cCateGoodsData() {
            // 原始的商品列表数据
            const data = this.goodsListRes.data || [];
            return data.map((item) => ({
                ...item,
                goods_image:
                    this.$util.deepGet(item, "image[0].file_path") || "",
                goods_price:
                    item.spec_type === 20
                        ? item.goods_min_price
                        : this.$util.deepGet(item, "sku[0].goods_price", ""),
                line_price: this.$util.deepGet(item, "sku[0].line_price", ""),
            }));
        },
        // 类别商品应该应用的样式
        cCateGoodsStyle() {
            const itemStyle = {
                display: "3",
                margincol: "10",
                marginrow: "15",
            };
            const is_goods_long = this.$util.deepGet(
                this.settingData,
                "is_goods_long",
                []
            );
            if (is_goods_long.indexOf("2") != "-1") {
                itemStyle.display = "1-2";
            }
            return itemStyle;
        },
        // 新版顶部分类的相关格式化数据
        cHomeHeaderData() {
            const data = this.pageOptions || {};
            let cateVisible = false;
            let agentJump = true;
            if (
                (+this.$util.deepGet(data, "params.pattern") === 3 &&
                    +this.$util.deepGet(data, "params.shownavigation") === 1) ||
                (+this.$util.deepGet(data, "params.classtype") === 1 &&
                    +this.$util.deepGet(data, "params.pattern") === 2)
            ) {
                cateVisible = true;
            }
            let agentName = "";
            if (+this.$util.deepGet(this.settingData, "agent_open") === 1) {
                agentName = this.$util.deepGet(
                    this.aidRes,
                    "areaname",
                    "正在定位"
                );
            } else if (
                +this.$util.deepGet(this.settingData, "is_display_location") ===
                1
            ) {
                agentJump = false;
                agentName = this.$util.deepGet(
                    this.locationRes,
                    "result.addressComponent.city",
                    "正在定位"
                );
            }
            return {
                // 新版header的type
                type: this.$util.deepGet(data, "params.pattern") || 1,
                // 标题栏背景颜色
                navBgColor: this.$util.deepGet(
                    data,
                    "style.bgcolor",
                    "#FFD940"
                ),
                // 标题文字
                title: this.$util.deepGet(data, "params.title") || "",
                // 标题的样式
                titleStyle: `color: ${
                    +this.$util.deepGet(data, "style.texttype") === 1
                        ? "#000"
                        : "#fff"
                };`,
                // 是否显示顶部分类
                cateVisible,
                // 轮播图的数据
                bannerData: (data.data || []).map((item, index) => ({
                    id: index,
                    // 点击时跳转地址
                    link: item.link,
                    // 图片的地址
                    imgUrl: this.$util.deepGet(item, "thumb.file_path") || "",
                })),
                // 顶部分类的数据
                cateData: cateVisible
                    ? [
                          {
                              id: "home",
                              title: "推荐",
                          },
                          ...this.topCateRes.map((item) => ({
                              _item: item,
                              // 分类id 查询商品列表要用
                              id: item.category_id,
                              // 分类名称
                              title: item.name || "",
                          })),
                      ]
                    : [],
                // 代理的名字
                agentName,
                agentJump,
            };
        },
        // 当前显示推荐首页还是商品列表页
        cRecommendHomeVisible() {
            return [-1, 0].indexOf(this.topCateIndex) !== -1;
        },
        isopen_float() {
            return this.$store.state.floatOpen;
        },
        canTip() {
            return (
                !!this.$store.state.userInfo &&
                this.$store.state.userInfo.can_tip
            );
        },
        isShowLead() {
            let isShowLead = false;
            // #ifdef MP
            isShowLead = this.canTip === 3;
            // #endif
            // #ifdef H5
            isShowLead = true;
            // #endif
            return isShowLead;
        },
			// tocity() {
			// 	uni.navigateTo({
			// 		url: "../citys/citys?currentCity=" + this.city,
			// 	});
			// },
    },
    beforeCreate() {
        // #ifdef MP-WEIXIN
        uni.hideTabBar();
        // #endif
    },
		
    onLoad(options) {
        // 将会通过watch跳转到免单首页
        if (this.$util.deepGet(this.settingData, "free.free_home_page") == 1) {
            console.log("onLoad将会通过watch跳转到免单首页");
            return;
        }
        this.pageLoad(options);
        this.getUserDetail();
    },
    async onShow() {
        // 将会通过watch跳转到免单首页
        if (this.$util.deepGet(this.settingData, "free.free_home_page") == 1) {
            console.log("onShow将会通过watch跳转到免单首页");
            return;
        }
        try {
            await this.getUserDetail();
        } catch (e) {
            // TODO handle the exception
        }
        // this.fetchTopCateRes()
        this.getData();
        this.getPageData(this.options.pageLogin ? this.options.pageLogin : 0);
        // 没有用户信息的时候，不触发发券宝
        if (
            this.diyItems &&
            this.diyItems.length > 0 &&
            App.validateUserInfo()
        ) {
            this.getVoucherCoupon("show");
        }
        console.log("jfjfjfjff", this.options);
        // #ifdef MP-WEIXIN
        wx.showShareMenu({
            menus: ["shareAppMessage", "shareTimeline"],
        });
        // #endif
        // #ifdef H5
        // setTimeout(() => {
        //     // console.log('onShow setTimeout index')
        //     uni.pageScrollTo({
        //         scrollTop: 1,
        //         duration: 0
        //     })
        //     setTimeout(() => {
        //         // console.log('onShow setTimeout index')
        //         uni.pageScrollTo({
        //             scrollTop: 0,
        //             duration: 0
        //         })

        //     }, 0)
        // }, 200)
        // #endif
    },
    watch: {
        LoginData(val) {
            console.log("LoginData 222222", val);
        },
        pageOptions(options) {
            // console.log("options",options)
            if (options.params && options.params.title) {
                // console.log('设置标题栏', options.style.texttype === '1' ? '#000000' : '#ffffff', options.style.bgcolor)
                setTimeout(() => {
                    uni.setNavigationBarTitle({
                        title:
                            options.params && options.params.title
                                ? options.params.title
                                : "",
                    });
                    uni.setNavigationBarColor({
                        frontColor:
                            options.style.texttype === "1"
                                ? "#000000"
                                : "#ffffff",
                        backgroundColor: options.style.bgcolor,
                    });
                }, 0);
                if (this.topColor == "#FFD940") {
                    uni.setNavigationBarColor({
                        frontColor:
                            options.style.texttype === "1"
                                ? "#000000"
                                : "#ffffff",
                        backgroundColor: options.style.bgcolor,
                    });
                }
                this.showBonus = options.redEnvelop_num > 0;
                if (this.appClientType === "4") {
                    // console.log(`分享链接是${App.siteInfo.siteroot}h5/#/pages/mainPages/index/index?referee_id=${this.globalSaveRefereeId}&i=${App.getUniacid()}`)
                    let sharepath = options.params.sharepath[0].file_path,
                        wechat_share_image =
                            this.settingData.share &&
                            this.settingData.share.wechat_share_image;
                    wxApi.wxShare({
                        title: options.params.sharetitle, // 分享标题
                        desc: options.params.shareinfo, // 分享描述
                        link: `${
                            App.siteInfo.siteroot
                        }h5/#/pages/mainPages/index/index?referee_id=${
                            this.globalSaveRefereeId
                        }&i=${App.getUniacid()}&aid=${App.siteInfo.aid || ""}`, // 分享链接
                        imgUrl:
                            sharepath === "default_picture.png"
                                ? wechat_share_image
                                    ? wechat_share_image[0].file_path
                                    : ""
                                : sharepath,
                    });
                }
            }
        },
        cHomeHeaderData(val) {
            if (val.cateVisible && !this.topCateResFetched) {
                // 只请求一次
                this.topCateResFetched = true;
                this.fetchTopCateRes();
            }
        },
        settingData: {
            handler(val = {}) {
                if (val && val.is_display_location == 1) {
                    this.fetchLocationRes();
                }
                if (val.free && val.free.free_home_page == 1) {
                    App.navigationTo({
                        url: "pages/subPages/myfreeBill/index",
                        redirect: true,
                    });
                    return;
                }
            },
            immediate: true,
        },
    },

    methods: {
        // 新增
        changeTab(Inv) {
            this.Inv = Inv;
            this.type = Inv;
            var _this = this;
            if (Inv == 1 && this.dslist.length == 0) {
                this.getFirstData();
            }
        },
        async getFirstData() {
            this.pageNum = this.pageNum + 1;
            try {
                const res = await App._postP("movie.mahua/comingList", {
                    pageNum: this.pageNum,
                });
                console.log(res.data);
                this.dslist = res.data;
            } catch (e) {
                console.log("这里出错了", e);
            }
        },
        ifbuy(starttime) {
            // 2700000
            var timestamp = new Date(starttime).getTime();
            var nowtimestamp = new Date().getTime();
            if (timestamp <= nowtimestamp) {
                return true;
            } else {
                return false;
            }
        },
        detailtap(filmid, index) {
            console.log(filmid);
            uni.navigateTo({
                url: "../cinema/cinema?film_id=" + filmid,
            });
        },
        // 新增结束
        async fetchLocationRes() {
            try {
                // 获取当前位置
                const location = await App.getLocation();
                if (!location.latitude || !location.longitude) {
                    return;
                }
                // 获取aid
                const res = await App._postP("agent.index/getLocation", {
                    lat: location.latitude,
                    lng: location.longitude,
                });
                this.locationRes = res.data || {};
            } catch (e) {
                console.log("fetchAidRes error", e);
            }
        },
        // 检查当前代理是否在和当前定位一致
        async checkAgent() {
            try {
                this.$store.dispatch("getTabBarData");
                // 获取当前位置
                const location = await App.getLocation();
                if (!location.latitude || !location.longitude) {
                    // App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    return;
                }
                // 获取aid
                const res = await App._postP("agent.index/aidTip", {
                    lat: location.latitude,
                    lng: location.longitude,
                });
                const data = this.$util.deepGet(res, "data") || {};
                const self = this;
                if (+data.status === 3) {
                    // #ifdef MP-WEIXIN
                    // 存储Storage
                    uni.setStorageSync("aid", {
                        ...data,
                        aid: 0,
                    });
                    App.setSiteInfo();
                    // 刷新页面
                    self.getPageData();
                    self.getData();
                    // #endif
                    // #ifdef H5
                    console.log("h5重启", window.location.href);
                    // window.location.href = self.$util.changeURLArg(window.location.href,'aid',0)
                    window.location.replace(
                        self.$util.changeURLArg(window.location.href, "aid", 0)
                    );
                    window.location.reload();
                    // #endif
                } else if (
                    +data.status === 1 &&
                    this.settingData &&
                    this.settingData.agent_tip_switch == 1
                ) {
                    uni.showModal({
                        title: "友情提示",
                        content: `定位到您在${data.areaname},是否切换到该地区？`,
                        success(res) {
                            if (!res.confirm) return;
                            console.log("success", res);

                            console.log("友情提示", data);
                            // #ifdef MP-WEIXIN
                            // 存储Storage
                            uni.setStorageSync("aid", data);
                            App.setSiteInfo();
                            // 刷新页面
                            self.pageOptions = {};
                            self.getPageData();
                            self.getData();
                            // #endif
                            // #ifdef H5
                            console.log("h5重启", window.location.href);
                            window.location.replace(
                                self.$util.changeURLArg(
                                    window.location.href,
                                    "aid",
                                    data.aid
                                )
                            );
                            window.location.reload();
                            // #endif
                        },
                    });
                } else if (
                    +data.status === 1 &&
                    this.settingData &&
                    this.settingData.agent_auto_switch == 1
                ) {
                    const lastAutoSwitchTime =
                        uni.getStorageSync("lastAutoSwitchTime") || 0;
                    console.log(
                        "lastAutoSwitchTime",
                        lastAutoSwitchTime,
                        +new Date() - lastAutoSwitchTime
                    );
                    if (
                        +new Date() - lastAutoSwitchTime <
                        1000 * 60 * 60 * 24
                    ) {
                        console.log("lastAutoSwitchTime 一天内只自动切换一次");
                        // 一天内只自动切换一次
                        return;
                    }
                    uni.setStorageSync("lastAutoSwitchTime", +new Date());
                    // #ifdef MP-WEIXIN
                    // 存储Storage
                    uni.setStorageSync("aid", data);
                    App.setSiteInfo();
                    // 刷新页面
                    this.pageOptions = {};
                    self.getPageData();
                    self.getData();
                    // #endif
                    // #ifdef H5
                    console.log("h5重启", window.location.href);
                    window.location.replace(
                        self.$util.changeURLArg(
                            window.location.href,
                            "aid",
                            data.aid
                        )
                    );
                    window.location.reload();
                    // #endif
                }
            } catch (e) {
                //TODO handle the exception
            }
        },
        // 代理信息的接口数据
        async fetchAidRes() {
            try {
                // 获取当前位置
                const location = await App.getLocation();
                if (!location.latitude || !location.longitude) {
                    // App.showError('获取当前位置失败，请稍候或检查定位设置后重试')
                    // return
                }
                // 获取aid
                const res = await App._postP("agent.index/getAid", {
                    lat: location.latitude,
                    lng: location.longitude,
                });
                this.aidRes = res.data || {};
                // 存储aid信息到localStorage
                uni.setStorageSync("aid", res.data || {});
                // 更新app.siteInfo
                App.setSiteInfo();
            } catch (e) {
                console.log("fetchAidRes error", e);
                //TODO handle the exception
            }
        },
        // 获取用户当前信息
        async getUserDetail() {
            try {
                const res = await App._getP("user.index/detail", {
                    no_login: 1,
                });
                this.orderCount = res.data.orderCount;
                this.member_Info = res.data.member_Info;
                this.userInfo = res.data.userInfo;
            } catch (e) {
                console.log(e);
                // TODO handle the exception
            }
        },
        // 顶部轮播图点击
        onTopSwiperItemClick(item) {
            this.navigationTo(item.link);
        },
        // 请求顶部分类接口数据的方法
        async fetchTopCateRes() {
            try {
                const res = await App._getP("Category/getCateList");
                this.topCateRes = this.$util.deepGet(res, "data") || [];
            } catch (e) {
                // TODO handle the exception
            }
        },

        getData() {
            App._post_form(
                "user.index/getShareSetting",
                {
                    no_login: 1,
                },
                (res) => {
                    this.is_follow = res.data.is_follow;
                }
            );
        },
        getNum(val) {
            this.num = val;
        },
        getBindReg() {
            let _this = this;
            App._post_form(
                "cgp.Reg/getBindReg",
                {
                    no_login: 1,
                },
                (res) => {
                    _this.getBind = res.data;
                }
            );
        },
        /**
         * 页面加载处理
         */
        pageLoad(options) {
            uni.setStorageSync("isAdvertShow", 1);
            this.isFollowWechat = options ? options.followWechat == 1 : false;
            this.options = options;
        },
        /**
         * 获取自定义首页信息
         */
        getPageData(pageLogin = 0) {
            let _this = this,
                userInfo = uni.getStorageSync("userInfo"),
                isRead =
                    this.settingData.helpbtn === "1"
                        ? userInfo
                            ? userInfo.is_read === 1
                            : !0
                        : !0;
            _this.isPageShow = true;
            let location = {};
            App.getLocation()
                .then((res) => {
                    location = res;
                    this.city = location.city;
                })
                .catch(() => Promise.resolve())
                .then(() => {
                    App._post_form(
                        "movie.mahua/movieList",
                        {
                            cityId: _this.cityId,
                        },
                        (res) => {
                            try {
                                _this.hotlist = res.data;

                                if (App.validateUserInfo()) {
                                    _this.getVoucherCoupon("load");
                                } else if (isRead) {
                                    _this.advertHandle("load");
                                }
                                let flag = false;
                                _this.diyItems.map((rel) => {
                                    if (rel.name == "团购") {
                                        flag = true;
                                    }
                                });
                                flag && this.getBindReg();
                            } catch {}
                            if (
                                +this.$util.deepGet(
                                    this.settingData,
                                    "agent_open"
                                ) === 1
                            ) {
                                this.fetchAidRes().then(() => {
                                    this.checkAgent();
                                });
                            }
                            App.hideLoading();
                            uni.stopPullDownRefresh();
                            // console.log('首页数据--------------',_this.diyItems)
                        },
                        (res) => {},
                        (res) => {
                            App.hideLoading();
                        }
                    );
                });
        },

        /**
         * 弹窗操作
         * @param {Object} showType 显示类型
         */
        advertHandle() {
            const _this = this;
            const index = this.$store.state.openAdvertIndex;
            let advertData =
                _this.diyItems[_this.diyItems.length - 1] &&
                _this.diyItems[_this.diyItems.length - 1].manydata &&
                _this.diyItems[_this.diyItems.length - 1].manydata[index];
            // console.log('advertData', advertData)
            if (!!advertData) {
                _this.getAdvertShow(advertData.params).then((result) => {
                    if (result) {
                        _this.$store.commit("showAdvert", true);
                        uni.setStorageSync("isShowAdvert", "1");
                    }
                });
            }
            this.$store.state.shareSetting.is_follow == 2 &&
                (this.$store.state.shareSetting.is_follow = 1);
        },
        /**
         * 获取弹窗广告是否显示
         */
        getAdvertShow(params) {
            let {
                    open, // 是否开启1开启 2关闭
                    status, // 显示类型 1仅首次 2每次 3多次
                    pattern, // 弹窗样式 1默认 2自定义
                    rate, // 每人/每天显示次数
                    type, // 广告类型 1图片 2商品 3抽奖
                    overtime,
                } = params,
                nowTime = new Date().getTime() / 1000,
                isLogin = !!this.$store.state.userInfo,
                isShowed = uni.getStorageSync("isShowAdvert") === "1"; // 是否已经显示过过弹窗
            // 如果用户未登录，则只显示一次，且不计次数
            if (!isLogin && open === "1") {
                status = "1";
            }
            return new Promise((resolve, reject) => {
                // 倒计时小于当前时间，弹窗不显示
                if (type != "1" && pattern === "2" && nowTime > overtime) {
                    resolve(false);
                    return;
                }
                if (open === "1") {
                    if (status === "1") {
                        resolve(!isShowed);
                    } else if (status === "2") {
                        resolve(true);
                        uni.removeStorageSync("isShowAdvert");
                    } else if (status === "3" && Number(rate) > 0) {
                        // console.log(11111111111111111)
                        App._get(
                            "diy.Diy/getUserAdvertisement",
                            {
                                no_login: 1,
                                rate,
                            },
                            (res) => {
                                resolve(res.data);
                            }
                        );
                    }
                } else {
                    resolve(false);
                }
            });
        },
        /**
         * 用户条款回调
         */
        readSuccess() {
            this.getVoucherCoupon();
        },
    },
    onUnload() {
        this.$store.commit("showAdvert", false);
    },
    onPullDownRefresh() {
        uni.removeStorageSync("showAdvert");
        this.getPageData();
        this.getData();
    },
    onReachBottom() {
        if (
            this.topCateIndex > 0 &&
            !this.goodsListRes.isFetching &&
            this.goodsListRes.hasMore
        ) {
            this.fetchGoodsListRes();
        }
    },
    onPageScroll(e) {
        this.scrollTop = e.scrollTop;
        if (this.isopen_float) {
            this.$store.commit("floatOpen", !1);
        }
    },
    onShareAppMessage(e) {
        // console.log('分享类型',e)
        console.log(
            "onShareAppMessage 1212121212",
            this.pageOptions.params.sharepath[0]
        );
        // console.log(this.pageOptions)
        let file_path = this.pageOptions.params.sharepath[0].file_path;
        return {
            title:
                this.pageOptions.params.sharetitle ||
                this.settingData.share.share_title,
            imageUrl: file_path === "default_picture.png" ? "" : file_path,
            path:
                "/pages/mainPages/index/index?referee_id=" +
                this.globalSaveRefereeId,
        };
    },
    onShareTimeline() {
        let file_path = this.pageOptions.params.sharepath[0].file_path;
        return {
            title:
                this.pageOptions.params.sharetitle ||
                this.settingData.share.share_title,
            imageUrl: file_path === "default_picture.png" ? "" : file_path,
        };
    },
};
</script>

<style>
.container {
    overflow-x: hidden;
    background-color: #f8f8f8;
}

/* 这种办法小程序生产环境 不支持 */
/* 	.container.tab-container .attention {
		top: initial;
		bottom: 88rpx;
	} */

.bonus-tips {
    position: fixed;
    left: 40rpx;
    right: 40rpx;
    bottom: 96rpx;
    background: rgba(0, 0, 0, 0.5);
    padding: 8rpx 12rpx;
    border-radius: 8rpx;
    z-index: 2;
}

.bonus-tips.bonus-tips-ipx {
    bottom: calc(96rpx + 20px);
}

.bonus-tips-btn {
    padding: 6rpx 8rpx;
    margin: 0 auto;
    border-radius: 8rpx;
    background: #fe504f;
}

/*每个页面公共css */
@font-face {
    font-family: "webfont";
    font-display: swap;
    src: url("//at.alicdn.com/t/webfont_yhj0b4fc6d.eot");
    /* IE9*/
    src: url("//at.alicdn.com/t/webfont_yhj0b4fc6d.eot?#iefix")
            format("embedded-opentype"),
        /* IE6-IE8 */ url("//at.alicdn.com/t/webfont_yhj0b4fc6d.woff2")
            format("woff2"),
        url("//at.alicdn.com/t/webfont_yhj0b4fc6d.woff") format("woff"),
        /* chrome、firefox */ url("//at.alicdn.com/t/webfont_yhj0b4fc6d.ttf")
            format("truetype"),
        /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
            url("//at.alicdn.com/t/webfont_yhj0b4fc6d.svg#Alibaba-PuHuiTi-Regular")
            format("svg");
    /* iOS 4.1- */
}

.empty {
    width: 500rpx;
    height: 500rpx;
    display: block;
    margin: 0 auto;
    margin-top: 100rpx;
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "webfont";
}

.swiper {
    height: 330rpx;
    border-radius: 20rpx;
}

.swiper image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
}

.scroll-by {
    width: 94%;
    border-radius: 20rpx;
}

.nav {
    width: 100%;
    padding: 20rpx 20rpx;
    display: flex;
    position: fixed;
    top: 0;
    z-index: 10;
    background: #fff;
    padding-bottom: 10rpx;
}

.cityselect {
    max-width: 200rpx;
    padding: 20rpx 10rpx;
    display: flex;
    margin-left: 25rpx;
}

.cityselect-name {
    display: inline-block;
    font-size: 28rpx;
    /* float:left; */
    flex: 1;
}

.city-icon-down {
    width: 40rpx;
    height: 40rpx;
    display: inline-block;
    /* float:left; */
    /* flex:1; */
    margin-left: 5rpx;
    /* margin-top:10rpx; */
}

.search-item {
    /* #ifdef H5 */
    width: 60%;
    /* #endif */
    /* #ifdef MP-WEIXIN || MP-TOUTIAO */
    width: 65%;
    /* #endif */
    height: 40rpx;
    background-color: #f8f8f8;
    border-radius: 30rpx;
    display: flex;
    padding: 10rpx 10rpx;
    margin-top: 10rpx;
}

.yzf-kf {
    width: 65rpx;
    height: 65rpx;
    margin-top: 15rpx;
    margin-left: 25rpx;
}

.yzf-kf image {
    width: 65rpx;
    height: 65rpx;
}

.search-icon {
    width: 35rpx;
    height: 35rpx;
    /* flex:1; */
    margin-left: 10rpx;
    margin-top: 5rpx;
}

.search-text {
    flex: 1;
    font-size: 28rpx;
    margin-left: 10rpx;
    color: #999999;
}

.option-list {
    width: 100%;
}

/* 列表容器 */
.option-list-view {
    padding: 10upx 20upx;
}

/* 电影 */
.option-list-view-item {
    padding: 20upx 0upx;
    display: flex;
    border-bottom: #f1f1f1 solid 1upx;
}

/* 封面 */
.list-item-fm {
    width: 135upx;
    height: 190upx;
    border-radius: 10upx;
}

/* 信息 */
.list-item-info {
    margin-left: 20upx;
}

/* 电影名 */
.item-info-title {
    font-size: 32upx;
}

/* 评价，想看 */
.item-info-pingfen {
    font-size: 23upx;
    display: flex;
    margin-top: 10upx;
    color: #808080;
    line-height: 40upx;
}

.item-info-pingfen view {
    color: #f7af49;
    font-size: 28upx;
    margin-left: 5upx;
    font-weight: bold;
}

/* 主演 */
.item-info-performer {
    width: 300upx;
    height: 30upx;
    font-size: 23upx;
    margin-top: 10upx;
    color: #808080;
    overflow: hidden;
    word-break: break-all;
    /* break-all(允许在单词内换行。) */
    text-overflow: ellipsis;
    /* 超出部分省略号 */
    display: -webkit-box;
    /** 对象作为伸缩盒子模型显示 **/
    -webkit-box-orient: vertical;
    /** 设置或检索伸缩盒对象的子元素的排列方式 **/
    -webkit-line-clamp: 1;
    /** 显示的行数 **/
}

/* 上映时间 */
.item-info-starttime {
    font-size: 23upx;
    margin-top: 10upx;
    color: #808080;
}

.list-item-action {
    width: 200upx;
    flex: 1;
}

.list-item-action button {
    width: 120upx;
    height: 60upx;
    font-size: 23upx;
    border: none;
    border-radius: 50upx;
    background: #ff6666;
    color: #fff;
    margin-top: 60upx;
    float: right;
}

.list-item-action .yubuy {
    background: #208ff7;
}

.inv-h-w {
    height: 100upx;
    background-color: #ffffff;
    display: flex;
    padding: 0 20upx;
    color: #3a3a3a;
    text-align: center;
}

.inv-h {
    font-size: 25upx;
    text-align: center;
    color: #000;
    height: 90upx;
    line-height: 120upx;
    padding: 0 20upx;
}

.inv-h-se {
    color: #ff6666;
    border-bottom: 4upx solid red;
}

.region-box {
    width: 100%;
    height: 712rpx;
    padding: 36rpx 30rpx 40rpx;
    box-sizing: border-box;
    overflow: hidden;
    background-color: #fff;
    display: flex;
    flex-direction: column;
}

.avatar-login {
    margin: 0 auto;
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
    overflow: hidden;
    margin-top: 50rpx;
}

.avatar-login image {
    width: 130rpx;
    height: 130rpx;
    border-radius: 50%;
}

.get-auth-text {
    padding: 30rpx 10rpx;
    padding-top: 60rpx;
}

.get-auth-text-a {
    font-size: 35rpx;
}

.get-auth-text-b {
    font-size: 30rpx;
    color: #a3a3a3;
    margin-top: 30rpx;
}

.get-auth-btn {
    margin-top: 50rpx;
}

.get-auth-btn button {
    width: 600rpx;
    height: 70rpx;
    background: #19be6b;
    border-radius: 40rpx;
    color: #fff;
    font-size: 33rpx;
    line-height: 65rpx;
}

.tui-share {
    background: #e8e8e8;
    position: relative;
    padding-bottom: env(safe-area-inset-bottom);
}

.tui-share-title {
    font-size: 26rpx;
    color: #7e7e7e;
    text-align: center;
    line-height: 26rpx;
    padding: 20rpx 0 50rpx 0;
}

.tui-share-top,
.tui-share-bottom {
    min-width: 101%;
    padding: 0 20rpx 0 30rpx;
    white-space: nowrap;
}

.tui-mt {
    margin-top: 30rpx;
    padding-bottom: 150rpx;
}

.tui-share-item {
    width: 126rpx;
    display: inline-block;
    margin-right: 24rpx;
    text-align: center;
}

.tui-item-last {
    margin: 0;
}

.tui-empty {
    display: inline-block;
    width: 30rpx;
    visibility: hidden;
}

.tui-share-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    height: 126rpx;
    width: 126rpx;
    border-radius: 32rpx;
}

.tui-share-text {
    font-size: 24rpx;
    color: #7e7e7e;
    line-height: 24rpx;
    padding: 20rpx 0;
    white-space: nowrap;
}

.tui-btn-cancle {
    width: 100%;
    height: 100rpx;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #f6f6f6;
    font-size: 36rpx;
    color: #3e3e3e;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom);
}

.tui-hover {
    background: rgba(0, 0, 0, 0.2);
}
</style>
