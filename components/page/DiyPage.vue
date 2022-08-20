<template>
	<view>
		
		<block v-for="(item,itemIndex) in diyItems" :key="itemIndex">
			<!-- 公告组 -->
			<block v-if="item.key === 'graphicnotice'">
				<diy-notice :item-index="itemIndex" :item-style="item.style" :params="item.params"></diy-notice>
			</block>

			<!-- 搜索框 -->
			<block v-else-if="item.key === 'graphicfind'">
				<diy-search :item-index="itemIndex" :item-style="item.style" :params="item.params"></diy-search>
			</block>

			<!-- 富文本 -->
			<block v-else-if="item.key === 'graphicueditor'">
				<diy-rich-text :item-index="itemIndex" :item-style="item.style" :params="item.params"></diy-rich-text>
			</block>

			<!-- 辅助线 -->
			<block v-else-if="item.key === 'graphicsubline'">
				<diy-line :item-index="itemIndex" :item-style="item.style"></diy-line>
			</block>

			<!-- 辅助空白 -->
			<block v-else-if="item.key === 'graphicnone'">
				<diy-blank :item-index="itemIndex" :item-style="item.style"></diy-blank>
			</block>

			<!-- 图片轮播 -->
			<block v-else-if="item.key === 'graphicswiper'">
				<diy-swiper :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data" :item-id="item.id"></diy-swiper>
			</block>

			<!-- 单图组 -->
			<block v-else-if="item.key === 'graphicimgs'">
				<diy-images :item-index="itemIndex" :item-style="item.style" :item-data="item.data"></diy-images>
			</block>

			<!-- 图片魔方 -->
			<block v-else-if="item.key === 'graphicmagicsquare'">
				<diy-magic-square :item-index="itemIndex" :item-style="item.style" :item-data="item.data"></diy-magic-square>
			</block>

			<!-- 列表导航 -->
			<block v-else-if="item.key === 'graphicnavlist'">
				<diy-nav-list :item-index="itemIndex" :item-style="item.style" :item-data="item.data"></diy-nav-list>
			</block>

			<!-- 导航按钮 -->
			<block v-else-if="item.key === 'graphicbtns'">
				<diy-nav-btns :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-nav-btns>
			</block>

			<!-- 弹窗广告（多个） -->
			<block v-else-if="item.key === 'otheradvert'">
				<diy-advert v-for="(ad,adIndex) in item.manydata" :key="ad.id" :item-index="adIndex" :item-style="ad.style" :params="ad.params" :item-data="ad.data"></diy-advert>
			</block>

			<!-- 商品列表 -->
			<block v-else-if="item.key === 'goodscol' && item.style && item.style.display === '1-1'">
				<diy-goods :item-index="itemIndex" :item-style="item.style" :params="item.params" @number='getNumber' :item-data="item.data"></diy-goods>
			</block>
			
			<!-- 新版商品列表 -->
			<block v-else-if="item.key === 'goodscol'">
				<diy-goods-v2 :item-index="itemIndex" :item-style="item.style" :params="item.params" @number='getNumber' :item-data="item.data"></diy-goods-v2>
			</block>
			<!-- 新版商品列表 -->

			<!-- 音频 -->
			<block v-else-if="item.key === 'graphicaudio'">
				<diy-audio :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-id="item.id"></diy-audio>
			</block>

			<!-- 视频组 -->
			<block v-else-if="item.key === 'graphicvideo'">
				<diy-video :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-id="item.id"></diy-video>
			</block>

			<!-- 标题 -->
			<block v-else-if="item.key === 'graphictitle'">
				<diy-title :item-index="itemIndex" :item-style="item.style" :params="item.params"></diy-title>
			</block>

			<!-- 优惠券 -->
			
			<block v-else-if="item.key === 'marketcoupon' && item.params.pattern">
				<coupon-v2-list :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data" />
			</block>
			<block v-else-if="item.key === 'marketcoupon'">
				<diy-coupon :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-coupon>
			</block>

			<!-- 秒杀 -->
			<block v-else-if="item.key === 'marketspike'"> 
				<diy-seckill :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-seckill>
			</block>
			
			<!-- 秒杀（新版）-->
			<block v-else-if="item.key === 'newmarketspike'"> 
				<diy-seckill-new :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-seckill-new>
			</block>

			<!-- 拼团 -->
			<block v-else-if="item.key === 'marketgroup'">
				<diy-group :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-group>
			</block>

			<!-- 抽奖 -->
			<block v-else-if="item.key === 'marketlottery'">
				<diy-lottery :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data" :peridosData="item.peridosData"></diy-lottery>
			</block>

			<!-- 砍价 -->
			<block v-else-if="item.key === 'marketbargain'">
				<diy-bargain :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-bargain>
			</block>

			<!-- 热区 -->
			<block v-else-if="item.key === 'graphichotspots'">
				<diy-hots :item-index="itemIndex" :params="item.params" :item-data="item.data"></diy-hots>
			</block>

			<!-- 浮动按钮 -->
			<block v-else-if="item.key === 'graphicfloatbtn'">
				<diy-float-btn :visibleAlways="item.params && item.params.pattern == 2" :item-index="itemIndex" :item-style="item.style" :params="item.params" :item-data="item.data"></diy-float-btn>
			</block>

			<!-- 红包 -->
			<block v-else-if="item.key === 'marketenvelope'">
				<diy-bonus :item-style="item.style" :params="item.params" :item-data="item.data"></diy-bonus>
			</block>
			
			<!-- 社区团购 -->
			<block v-else-if="item.key === 'graphicgroup'">
				<diy-groups :item-style="item.style" :params="item.params" :item-data="item.data" :leaderData='leaderData'></diy-groups>
			</block>
			<!-- 直播 -->
			<block v-else-if="item.key === 'livelist'">
				<diy-live :liveData="item.liveData" :backLiveData="item.backLiveData" :liveShow="item.liveShow"></diy-live>
			</block>
			<!-- 登录 -->
			<block v-else-if="item.key === 'graphiccenter' && item.params && item.params.isshow == 1">  
				<diy-login :login="item.logindata.login" :photourl="item.logindata.photourl" :name="item.logindata.name"
				:vipopen="item.logindata.vipopen" :card_title="item.logindata.card_title"  :account="item.logindata.account">
				</diy-login>
			</block>
			<!-- 信息流广告 -->
			<!-- #ifdef MP-TOUTIAO -->
			<block v-else-if="item.key === 'graphicflowmaster' && item.params && item.params.isshow == 1 && item.params.channel_type == 1">
				<ad :unit-id="item.params.id" :type="item.params.llz_type"></ad>
			</block>
			<!-- #endif -->
			<!-- 信息流广告 -->
			<!-- #ifdef MP-WEIXIN -->
			<block v-else-if="item.key === 'graphicflowmaster' && item.params && item.params.isshow == 1 && item.params.channel_type == 2">
				<ad :unit-id="item.params.id" :type="item.params.llz_type"></ad>
			</block>
			<!-- #endif -->
			<!-- 好店组件 -->
			<block v-else-if="item.key === 'haodian' && item.params && item.params.isshow == 1">
				<StoreDiy :item-style="item.style" :params="item.params" :item-data="item.data"></StoreDiy>
			</block>
			<!-- 好店组件 end -->
		</block>
		<load-more :showLoadmore="true"></load-more>
	</view>
</template>

<script>
	import DiyNotice from "@/components/page/pageComponents/Notice.vue"
	import DiySearch from "@/components/page/pageComponents/Search.vue"
	import DiyRichText from "@/components/page/pageComponents/RichText.vue"
	import DiyLine from "@/components/page/pageComponents/Line.vue"
	import DiyBlank from "@/components/page/pageComponents/Blank.vue"
	import DiyVideo from "@/components/page/pageComponents/Video.vue"
	import DiySwiper from "@/components/page/pageComponents/Swiper.vue"
	import DiyImages from "@/components/page/pageComponents/Images.vue"
	import DiyMagicSquare from "@/components/page/pageComponents/MagicSquare.vue"
	import DiyNavBtns from "@/components/page/pageComponents/NavBtns.vue"
	import DiyNavList from "@/components/page/pageComponents/NavList.vue"
	import DiyAdvert from "@/components/page/pageComponents/Advert.vue"
	import DiyGoods from "@/components/page/pageComponents/Goods.vue"
	import DiyGoodsV2 from "@/components/page/pageComponents/GoodsV2.vue"
	import DiyAudio from "@/components/page/pageComponents/Audio.vue"
	import DiyTitle from "@/components/page/pageComponents/Title.vue"
	import DiyCoupon from "@/components/page/pageComponents/Coupon.vue"
	import DiySeckillNew from "@/components/page/pageComponents/seckillGoodsNew.vue"  //新版秒杀
	import DiySeckill from "@/components/page/pageComponents/seckillGoods.vue"  //旧版秒杀
	import DiyGroup from "@/components/page/pageComponents/Group.vue"
	import DiyLottery from "@/components/page/pageComponents/Lottery.vue"
	import DiyBargain from "@/components/page/pageComponents/Bargain.vue"
	import DiyHots from "@/components/page/pageComponents/Hots.vue"
	import DiyFloatBtn from "@/components/page/pageComponents/FloatBtn.vue"
	import DiyBonus from "@/components/page/pageComponents/Bonus.vue"
	import diyGroups from "@/components/template/Groups.vue"
	import LoadMore from "@/components/template/Loadmore.vue"
	import DiyLive from '@/components/page/pageComponents/Live.vue'
	import CouponV2List from '@/components/page/pageComponents/CouponV2List.vue'
	import DiyLogin from '@/components/template/DiyLogin.vue'
	import StoreDiy from '@/components/page/pageComponents/StoreDiy.vue'
	export default {
		data() {
			return {
				leaderData:{}
			}
		},
		props: {
			diyItems: Array,
			getBind:{}
		},
		components: {
			DiyNotice,
			DiySearch,
			DiyRichText,
			DiyLine,
			DiyBlank,
			DiyVideo,
			DiySwiper,
			DiyImages,
			DiyMagicSquare,
			DiyNavBtns,
			DiyNavList,
			DiyAdvert,
			DiyGoods,
			DiyGoodsV2,
			DiyAudio,
			DiyTitle,
			DiyCoupon,
			DiySeckill,
			DiyGroup,
			DiyLottery,
			DiyBargain,
			DiyHots,
			DiyFloatBtn,
			DiyBonus,
			diyGroups,
			LoadMore,
			DiyLive,
			DiyLogin,
			DiySeckillNew,
			CouponV2List,
			StoreDiy
		},
		computed: {
			
		},
		watch:{
			getBind:{
				handler(data){
					this.leaderData = data
				},
				immediate:true,
				deep:true
			}
		},
		beforeCreate() {

		},
		onLoad(options) {
	
		},
		onShow() {
	
		},
		mounted() {
	
		},
		methods: {
			getNumber(value){
				this.$emit('getNum',value)
			},
			// 格式化广告数据的方法
			formatAdvert(item = {}) {
				if(item.manydata instanceof Array) {
					return item.manydata.map((data,index)=> {
						const dataKeyMap = ({
							'1': '',
							'2': 'goodsdata',
							'3': 'luckdata',
						})
						const dataKey = dataKeyMap[data.params.type]
						console.log('formatAdvert',{
							id: index,
							data: data[dataKey] && data[dataKey][0] || {},
							params: data.params,
							style: item.style
						})
						return {
							id: index,
							data: data[dataKey] && data[dataKey][0] || {},
							params: data.params,
							style: item.style
						}
					})
				}
				// 兼容老数据
				return [item]
			}
	
		}
	}
</script>

<style>
	/* .cont {
		margin: 0;
		padding: 0;
		margin-top: 108upx;
		line-height: 1;
	} */
</style>
