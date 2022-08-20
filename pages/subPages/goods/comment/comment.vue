<template>
	<view :style="themeColor">
		<!-- v-if="total.all > 0" -->
		<view class="container" v-if="isShow">
			<!-- 顶部选项卡 -->

			<PageNavBar :nav-list="navList" @navItemClick="tabselect" :current="Navcurrent"></PageNavBar>

			<!-- 评价列表 -->
			<block v-if="listShow">
				<scroll-view :scroll-y="true" @scrolltolower="onScrollBottom" :style="{height:swiperHeight+'px'}" @scroll="scrolly"
				 :scroll-top="scroll_Top">
					<view class="comment-list">
						<view class="comment-box module-content m-btm20" v-for="(item,index) in list.data" :key="index" @click="spcomentDetail(item.comment_id)">
							<view class="comment-title dis-flex flex-y-center flex-x-between">
								<view class="comment-user dis-flex flex-y-center ">
									<image :src="item.avatarUrl" mode=""></image>
									<view class="user-info dis-flex flex-dir-column flex-x-between m-left12">
										<view class="user-name col-3 f-24">{{ item.nickName }}</view>
										<view class="user-comment-time col-9 f-24">{{item.create_time}}</view>
									</view>
								</view>
								<view class="comment-star dis-flex flex-y-center">
									<view class="iconfont icon-shoucangxiao select" v-for="(items,scoreIndex) in item.score" :key="scoreIndex"></view>
								</view>
							</view>
							<view class="comment-text col-3 f-28">{{item.content}}</view>
							<view class="comment-reply col-9 f-24" v-for="(replyItem,idx) in item.comment_reply" :key="idx" v-if="!!item.comment_reply">商家回复:{{replyItem.reply_content}}</view>
							<view class="comment-imgs m-top16 dis-flex flex-dir-row m-top10" v-if="!!item.comment_image">
								<view class="comment-img" v-for="(coment_image,idx) in item.comment_image" :key="idx" :style="'background-image:url('+coment_image.file_path+')'"
								 @click="pre_image"></view>
							</view>
							<view class="dis-flex flex-x-end comment-handle m-top20">
								<view class="iconfont icon-appreciatefill" :class="item.isgl?'already':''" @click.stop="givelike(item.comment_id)">{{item.total_comment}}</view>
								<!-- <view class="iconfont icon-forwardfill">分享</view> -->
							</view>
						</view>
					</view>
					<loadmore :showLoadmore="showLoadmore"></loadmore>
				</scroll-view>
			</block>
			<block v-else>
				<Abnor abnor="DATA" title="还没有相关评论哦" v-if="isAbnor"></Abnor>
			</block>
		</view>
	</view>
</template>

<script>
import App from '@/common/js/app.js'
import PageNavBar from '@/components/template/PageNavBar2.vue'
import loadmore from '@/components/template/Loadmore.vue'
import Abnor from '@/components/template/Abnor.vue'
export default {
    data() {
        return {
            // 列表高度
            swiperHeight: 0,

            // 页面参数
            options: {
                goods_id: null,
                scoreType: 0,
                store_id: '',
                bus_id: ''
            },
            navList: [
                {
                    id: '0',
                    title: '全部'
                },
                {
                    id: '3',
                    title: '好评'
                },
                {
                    id: '2',
                    title: '中评'
                },
                {
                    id: '1',
                    title: '差评'
                }
            ],
            // 评论列表
            list: {
                data: []
            },
            Navcurrent: 0, // 当前选项
            // 当前页码
            page: 1,
            list_page: null,
            // 是否加载
            showLoadmore: false,
            // scroll滑动高度
            scroll_Top: 0,
            // show
            isAbnor: false,
            isShow: false
        }
    },
    components: {
        loadmore,
        Abnor,
        PageNavBar
    },
    computed: {
        listShow() {
            return this.list.data.length !== 0
        }
    },
    /**
		 * 生命周期函数--监听页面加载
		 */
		 onLoad(options) {
        let _this = this
        uni.setNavigationBarColor({
            frontColor: '#000000',
            backgroundColor: '#ffffff'
        })
        // 设置swiper的高度
        this.setSwiperHeight()

        // 记录页面参数
			 _this.setData({
            'options.goods_id': options.goods_id,
            'options.store_id': options.store_id,
            'options.bus_id': options.bus_id
        })
        // 获取评论列表

    },
    onShow() {
        this.getCommentList(this.options.goods_id, this.options.scoreType, 1)

    },
    mounted() {

    },
    methods: {
        /**
			 * 设置swiper的高度
			 */
        setSwiperHeight() {
            // 获取系统信息(拿到屏幕宽度)
            let systemInfo = uni.getSystemInfoSync(),
                swiperHeight = systemInfo.windowHeight - 70 // swiper高度
            this.setData({
                swiperHeight
            })
        },
        /**
			 * 获取评论列表
			 */
        getCommentList(goods_id, score, page) {
            uni.showLoading({})
            console.log(this.options, '================')
            let _this = this,
                options = _this.options,
                url = 'Comment/commentList',
                requestData = {
                    goods_id,
                    score,
                    page
                },
                methods = '_get'
            if (options.store_id && options.bus_id) {
                delete options.goods_id
                delete options.scoreType
                methods = '_post_form'
                options.page = page
                options.score = score
                requestData = options
                url = 'Comment/commentAllList'
            }


            App[methods](url, requestData, result => {
                let data = result.data
                if (!!data) {
                    data.data.map(val => {
                        if (!!val.fabulous_id) {
                            val.isgl = true
                        } else {
                            val.isgl = false
                        }
                    })
                }
                _this.setData({
                    list: data,
                    showLoadmore: (_this.page === data.last_page),
                    list_page: data.last_page,
                    isAbnor: true,
                    isShow: true
                })
            }, false, () => {
                uni.hideLoading()
            })
        },
        givelike(comment_id) {
            let that = this,
                comentList = that.list.data,
                singecoment = comentList.filter(val => val.comment_id === comment_id)[0]
            App._get('Comment/fabulous', {
                comment_id
            }, result => {
                if (result.data === 1) {
                    singecoment.isgl = false
                    singecoment.total_comment--
                    App.showSuccess('取消点赞')
                } else if (result.data === 2) {
                    singecoment.isgl = true
                    singecoment.total_comment++
                    App.showSuccess('点赞成功')
                }
            })
        },
        /**
			 * 点击tab切换
			 */
        tabselect(val) {
            let _this = this
            this.page = 1
            this.scroll_Top = 0
            _this.$set(_this.options, 'scoreType', val.id)
            // 获取评论列表
            _this.getCommentList(_this.options.goods_id, val.id, 1)
        },
        /**
			 * 图片预览
			 */
        previewImages(e) {
            let commentIndex = e.target.dataset.commentIndex,
                imgIndex = e.target.dataset.imgIndex,
                images = this.list.data[commentIndex].image,
                imageUrls = []
            images.forEach(function (item) {
                imageUrls.push(item.file_path)
            })
            uni.previewImage({
                current: imageUrls[imgIndex],
                urls: imageUrls
            })
        },
        /**
			 * 上滑加载更多
			 **/
        onScrollBottom(e) {
            console.log('到达最底部')
            let that = this,
                list_page = that.list_page
            if (that.page >= list_page) {
                that.setData({
                    showLoadmore: true
                })
                return false
            };
            !that.showLoadmore && that.toload(that.options.goods_id, that.options.scoreType, ++that.page)
        },
        toload(goods_id, score, page) {
            let that = this
            App._get('Comment/commentList', {
                goods_id,
                score,
                page
            }, that.itemsDataMore)
        },
        /**
			 * 加载更多
			 **/
        itemsDataMore(e) {
            console.log(e, '更多数据')
            let that = this,
                listData = that.list.data,
                ListDataMore = e.data.data
            if (!!ListDataMore) {
                ListDataMore.map(val => {
                    if (!!val.fabulous_id) {
                        val.isgl = true
                    } else {
                        val.isgl = false
                    }
                })
            }
            that.list.data = listData.concat(ListDataMore)
        },
        /**
			 * 滑动高度
			 */
        scrolly(e) {
            // this.scroll_Top = e.detail.scrollTop;
        },

        /**
			 * 跳转到评论详情
			 */
        spcomentDetail(comment_id) {
            App.navigationTo({
                url: `pages/subPages/comment/detail?comment_id=${comment_id}&comment_type=single`
            })
        }
    }
}
</script>

<style lang="scss">
	/* 选项卡 */

	.swiper-tab {
		width: 100%;
		text-align: center;
		height: 80upx;
		background-color: #fff;
		border-bottom: 1px solid #eee;
	}

	.swiper-tab .swiper-tab-item {
		width: 25%;
		height: 100%;
		font-size: 28upx;
		color: #777;
		display: flex;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		border-bottom: 2px solid #ffffff00;
	}

	.swiper-tab .on {
		color: #f74c45;
		border-bottom: 2px solid #f74c45;
	}

	/* 设置scroll-view容器高度 */

	.comment-list,
	.yoshop-notcont {
		/* height: 100.1%; */
		margin: 20upx 30upx 0 30upx;
	}

	/* 评论列表 */

	.comment-box {
		border-radius: 6upx;
	}

	.comment-user image {
		width: 60upx;
		height: 60upx;
		border-radius: 50%;
		display: block;
	}

	.comment-star .iconfont {
		width: 36upx;
		height: 36upx;
		line-height: 36upx;
		font-size: 28upx;
		margin-right: 8upx;
		display: block;
		color: #CCCCCC;
	}

	.comment-star .iconfont.select {
		color: #FFD940;
		color:var(--theme-color);
	}

	.comment-text {
		margin: 40upx 10upx;
	}

	.comment-reply {
		padding: 20upx 25upx;
		background: #F0F0F0;
		border-radius: 6upx;
	}

	.comment-imgs {
		flex-wrap: wrap;
	}

	.comment-img {
		width: 30%;
		padding-top: 30%;
		border-radius: 6upx;
		background-size: 100% 100%;
		margin: 0 1.5% 3%;
	}

	.comment-handle .iconfont {
		font-size: 24upx;
		margin-left: 20upx;
		color: #999999;
	}

	.comment-handle .iconfont.already {
		color: #FE504F;
	}

	.comment-handle .iconfont::before {
		font-size: 36upx;
		margin-right: 10upx;
	}
</style>
