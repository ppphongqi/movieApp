<template>
	<view>
		<!-- 弹窗开始 -->
		<popup-view :show="cardUseDescnew" type="center" :overlay="cardUseDescnew">
			<view style="width: 610rpx;height: 760rpx;background: #FFD940;border-radius: 30rpx;">
				<view style="font-size: 36rpx;font-weight: bold;color: #333333;padding: 50rpx 0 50rpx 0;text-align: center;">扫码下单
					自动免单</view>
				<view style="height: 490rpx;width: 610rpx;border-radius: 30rpx;background: #F8F8F8;position:absolute;bottom:72rpx;">
				</view>
				<view style="text-align: center;">
					<view>
						<image style="width: 300rpx;height: 300rpx;padding: 20rpx;background: #FFFFFF;border-radius: 30rpx;" :src="newurl"></image>
					</view>

				</view>
				<view style="text-align: center;position: absolute; width: 100%">
					<view style="color: #333333;font-size: 24rpx;margin: 0rpx 30rpx 0 30rpx;
							 white-space: nowrap;
							    overflow: hidden;
							    text-overflow: ellipsis;
							padding: 30rpx;">
						<text style="font-weight: bold;">{{newnickName}}:</text>
						{{newgoods_name}}
						</view>
					<!-- #ifdef MP-WEIXIN || MP-ALIPAY || MP-TOUTIAO -->
					<view style="border-radius: 10rpx;margin: 0rpx 20rpx 0 20rpx;">
						<button type='warn' open-type="share" style="background: #FFD940;color: #333333;" @click="cardUseDescnew=false">确认分享</button>
					</view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view style="border-radius: 10rpx;margin: 0rpx 20rpx 0 20rpx;">
						<button type='warn' style="background: #FFD940;color: #333333;" @click="hangderbtn">确认分享</button>
					</view>
					<!-- #endif -->
					<view style="background: #F8F8F8;margin: 0rpx 20rpx 0 20rpx;">
						<view style="font-size: 28rpx;font-weight: bold;color: #999999;padding: 20rpx;" @click="closenew">我在想想</view>
					</view>
				</view>
			</view>
			<view class="iconfont icon-roundclose" style="text-align: center;margin-top: 40rpx;color: #FFFFFF;" @click="closenew"></view>
		</popup-view>
		<!-- 弹窗结束 -->
		<view class="page-myfreeBill-index" :style="themeColor" :class="tabContainer">
			<!-- header -->
			<u-sticky :h5-nav-height="baseMixin_cStatusBarHeight" bg-color="transparent" >
				<view class="page-myfreeBill-index-header" :style="cHeaderStyleStr">
					<!-- 搜索框 -->
					<view class="search-wrapper">
						<view class="search-wrapper__city" v-if="agentMixin_cAgentOpen" @click="navigationTo('pages/subPages/address/aid')">
							<view style="display: flex;">
								<view class="agent__icon iconfont iconfont icon-dingweixiao"></view>
								<view>
									<view class="iconfont" style="font-size: 30rpx;"></view>
									<view class="agent__text">{{agentMixin_cAgentName}}</view>
								</view>
							</view>
						</view>
						<view class="search-wrapper__city" v-else>
							<view style="display: flex;">
								<view class="agent__icon iconfont iconfont icon-dingweixiao"></view>
								<view>
									<view class="iconfont" style="font-size: 30rpx;"></view>
									<view class="agent__text">{{agentMixin_cLocationName}}</view>
								</view>
							</view>
						</view>
						<view class="input-wraper">
							<!-- <view class="input-wrapper__text" >搜索好物</view> -->
							<input class="input-wrapper__text" placeholder="搜索好物" v-model="inputGoods_name"></input>
							<view class="">
								<view class="iconfont icon-sousuo" @click="onInput"></view>
							</view>
						</view>
					</view>
					<!-- 搜索框 end -->
					<!-- 分类 -->
					<view class="cate-wrapper" v-if="!showSort && new_user_can==1">

						<scroll-view class="cate-scroll" scroll-x>
							<view style="display: flex;align-items: center;">
								<view class="btn-cate-all" :class="{'active':classSort==-1}" @click="classificationBtn(-1)">免单活动</view>
								<view class="cate-list">
									<view class="cate-item" v-for="(item,index) in cateData" :key="item.category_id" :class="{'active':classSort==index}"
									 @click="classificationBtn(index,item.category_id)">
										{{item.sort_name}}
									</view>
								</view>
							</view>
						</scroll-view>
						<!-- @click="baseMixin_navigationTo({url:'pages/subPages/category/index'})" -->
						<!-- <view class="btn-cate-all" @click="baseMixin_navigationTo({url:'pages/subPages/category/index'})">全部</view> -->
					</view>
					<!-- 分类 end -->
				</view>
			</u-sticky>
			<block v-if="isShowLead">
				<!-- 引导关注公众号 -->
				<lead-attention placement="bottom"></lead-attention>
			</block>
			
			<view style="word-break: break-all;word-wrap:break-word;white-space: normal"></view>

			<!-- header end -->
			<!-- banner -->
			<view v-if="!showSort">
				<swiper class="banner-swiper" :indicator-dots="false" autoplay :interval="3000">
					<!-- @click="handleSwiperItemClick(item,index)" -->
					<swiper-item class="banner-swiper__item" v-for="(item,index) in swiperData" :key="item.id" >
						<image class="banner-swiper_img" :src="item.file_path" @click="hangnewBtn(index)"></image>
					</swiper-item>
				</swiper>
				<!-- banner end -->
				<!-- 第一排按钮 -->
				<view class="button-index">
					<view class="button-index-view" v-for="(item,index) in buttondata" :class="{'active':currentSort==index}" :key="item.id"
					 @click="handlebuttonClickX(index)">
						<view>
							{{item.title}}
						</view>

					</view>
				</view>
				<!--按钮结束 -->
				<!-- 疯狂抢单 第二排按钮-->
				<view class="page-orders" style="position: relative;" v-if="cButtondata==0">
					<!-- 推荐  距我最近  销量最多agentMixin_cAgentOpen -->
					<view class="page-orders-text" style="position: relative;" :class="{'active':orderSort==index}" v-for="(item,index) in ordersdata"
					 :key="item.id" @click="orderBtn(index)">
						{{item.title=='全国'?item.title+free:''}}
						<!-- {{item.title=='距我最近'&&agentMixin_cAgentOpen?agentMixin_cAgentName+free:agentMixin_cLocationName}} -->
						{{item.title=='距我最近'?cAgentMixin_cAgentOpen+free:''}}
						{{item.title=='免单成功'?item.title:''}}
						<view v-if="item.title=='免单成功' && cNumber" style="width: 40rpx;height: 40rpx;text-align: center;line-height: 40rpx;background: #FF4444;color: #FFFFFF;border-radius: 50%;font-size: 20rpx;padding: 5rpx;position: absolute;top: -28rpx;right: -20rpx;">{{cNumber}}</view>
					</view>

					<!-- 推荐  距我最近  销量最多 end -->
				</view>
				<view class="page-orders" v-if="cButtondata==2">
					<!-- 免单成功  进行中  分享列表 -->
					<view class="page-orders-text" :class="{'active':freeSort==index}" v-for="(item,index) in freeData" :key="item.id"
					 @click="freeBtn(index)">
						{{item.title}}
					</view>
					<!-- 免单成功  进行中  分享列表  end -->
				</view>
				<!-- 疯狂抢单免单成功 -->
				<view v-if="orderSort==2 && currentSort==0">
					<view class="page-goods-view" v-for="(item,index) in sucAllData" :key="index">
							<view >
								<!-- goods_name:result.goods[0].goods_name,
									file_path:result.goods[0].image[0].file_path || '' ,
								share_num:result.share_num||'',//多少人助力免单
								return_money:result.return_money || '' , //已返多少钱 -->
								<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 20rpx;">
									<view style="display: flex;">
										<image style="width: 70rpx;height: 70rpx;border-radius: 50%;" :src="!!item.user&&item.user.avatarUrl?item.user.avatarUrl:''"></image>
										<view style="margin-left: 20rpx;">
											<view style="font-size: 26rpx;font-weight: 400;line-height: 40rpx;color: #000000;">{{!!item.user&&item.user.nickName?item.user.nickName:''}}</view>
											<view style="font-size: 24rpx;font-weight: 400;line-height: 40rpx;color: #999999;">{{item.create_time}}</view>
										</view>
									</view>
									<view style="font-size: 26rpx; font-weight: 400;line-height: 40rpx;color: #999999;">免单成功</view>
								</view>
								<view style="height: 130rpx;
									background: #F8F8F8;
									opacity: 1;
									border-radius: 10rpx;">
									<view style="padding: 20rpx;">
										<view style="display: flex;">
											<image style="width: 100rpx;height: 90rpx;border-radius: 10rpx;" :src="item.file_path"></image>
											<view>
												<view style="margin-left: 20rpx;color:#333333;font-size: 28rpx;font-weight: bold; overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 480rpx;">{{item.goods_name}}</view>
												<view style="margin-left: 20rpx;margin-top: 17rpx;display: flex;justify-content: space-between;">
													<view style="font-size: 24rpx;font-weight: 400;color: #FF4444;">已返￥{{item.return_money}}</view>
													<view style="display: flex;align-items: center;">
														<view style="font-size: 24rpx;font-weight: 400;color: #FF4444;">{{item.share_num}}{{a_word}}</view>
														<view style="font-size: 26rpx; font-weight: 400;line-height: 40rpx;color: #999999;">助力免单</view>
													</view>

												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						<view>
						</view>
					</view>
				</view>

				<!-- 商品信息 -->
				<view class="page-goods">
					<!-- 免单成功  进行中  分享列表标识 freeSort
					疯狂抢单   好友专区   我的免单标识   currentSort
				-->
					<view v-if="freeSort!=2 || currentSort!=2">
						<view v-for="(item,index) in goodsData" :key="index">
							<!-- 支持商家弹窗 -->
							<popup-view :show="cardUseDesc" type="center" :overlay="cardUseDesc">
								<view class="" style="background: #FFFFFF;width: 630rpx;height: 620rpx;position: relative;border-radius: 20rpx;">
									<view style="padding: 100rpx 0rpx 0 30rpx;">
										<view style="text-align: center;">共{{businessData.length}}个商家为您服务</view>
										<scroll-view scroll-y="true" style="height: 460rpx;">
											<view style="padding-top: 30rpx;" v-for="(store,storeindex) in businessData" :key="storeindex">
												<!-- 图片暂无，预留位置 -->
												<view style="display: flex;align-items: center;justify-content: space-between;">
													<!-- 门店名称 地址 -->
													<view @click="handbusIdBtn(store.bus_id,store.id)">
														<view style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width: 360rpx;
										 			font-size: 28rpx;
										 			color: #000000;
										 			font-weight: bold;
										 			line-height: 40rpx;
										 			">{{store.name}}</view>
														<view style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width: 360rpx;
										 			font-size: 20rpx;
										 			font-weight: 400;
										 			line-height: 40rpx;
										 			">{{store.address}}</view>
													</view>

													<!-- 图标 -->
													<view style="margin-right: 60rpx;">
														<view style="display: flex;">
															<view class="iconfont icon-dianhua1" style="margin-right:20rpx;border: 1px solid #FFAC40;color: #FFAC40;padding: 16rpx;border-radius: 50%;"
															 @click.stop="storeMobile(store.mobile)"></view>

															<view class="iconfont icon-dingwei" style="border: 1px solid #FFAC40;color: #FFAC40;padding: 16rpx;border-radius: 50%;"
															 @click.stop="storeLocation(store.lat,store.lng,store.name,store.address)"></view>
														</view>
													</view>
												</view>
											</view>
										</scroll-view>
									</view>
									<view class="" style="position: absolute;top: -20rpx;right: 100rpx;">
										<view style="position: relative;text-align: center;">
											<!-- <image style="width:400rpx;height: 70rpx;" :src="getImageRoot('miandan.png')"></image> -->
											<image style="width:400rpx;height: 70rpx;" src="./static/images/shiyongshangjia.png"></image>
											<view style="font-size: 32rpx;font-weight: bold;line-height: 45rpx;color: #333333;position: absolute;top: 10rpx;
										text-align: center;right: 0;left: 0;bottom: 0;">适用商家</view>
										</view>
									</view>
								</view>
								<view class="iconfont icon-roundclose" style="text-align: center;margin-top: 40rpx;color: #FFFFFF;" @click="close"></view>
							</popup-view>
							<!-- 支持商家弹窗结束 -->
							<view v-if="currentSort==1" style="box-sizing: border-box;width: 690rpx;margin: 0 auto;border-radius: 20rpx;padding: 20rpx;margin-top: 20rpx;">
								<view style="display: flex;align-items: center;">
									<image style="margin-right: 20rpx;width: 140rpx;height: 90rpx;border-radius: 50%;" :src="!!item.user&&item.user.avatarUrl?item.user.avatarUrl:''"></image>
									<view style="font-size: 28rpx;font-weight:400;line-height: 44rpx;color: #FFFFFF;"> [{{!!item.user&&item.user.nickName?item.user.nickName:''}}]正在免单活动中，TA曾帮您免单，看看TA想免单什么水平吧~</view>
								</view>
							</view>
							<!-- 好友专区保持不变 -->
							<view class="page-goods-view" v-if="currentSort==1">
								<view style="display: flex;align-items: center;justify-content: space-between;">
									<!-- <view class="page-goods-index">
										<view style="color: #333333;font-size: 24rpx;font-weight: 400;">
											距活动结束：
										</view>
										<view style="display: inline-flex;align-items: center;">
											<view class="date">{{d}}</view>
											<view style="margin: 0 6rpx 0 6rpx;">天</view>
											<view class="date">{{h}}</view>
											<view style="margin: 0 6rpx 0 6rpx;">:</view>
											<view class="date">{{m}}</view>
											<view style="margin: 0 6rpx 0 6rpx;">:</view>
											<view class="date">{{s}}</view>
										</view>
									</view> -->
									<view style="display: flex;align-items: center;">
										<image :src="!!item.user&&item.user.avatarUrl?item.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
										</image>
										<view style="margin-left: 20rpx;">{{!!item.user&&item.user.nickName?item.user.nickName:''}}</view>
									</view>
									<view style="display: flex;align-items: center;" @click="business(item.goods_id,item.bus_id,item.card_id)">
										<view style="color: #999999;font-size: 28rpx;font-weight: bold;margin-right: 20rpx;">
											支持商家
										</view>
										<!-- <view style="color: #999999;font-size: 28rpx;font-weight: bold;margin-right: 20rpx;" @click.stop="handshareBtn(item.type,item)">
										帮TA加速
									</view> -->
										<view>
											<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
										</view>
									</view>
								</view>

								<view class="">
									<view style="position: relative;">
										<image style="width: 630rpx;margin-top: 20rpx;" :src="item.image">
										</image>
										<!-- 免单成功标识 -->
										<view style="position: absolute;top: 60rpx;" v-if="freeSort==1 && currentSort==2">
											<view style="background: #CB2C2E;color: #FFFFFF;font-size: 28rpx;width: 270rpx;height: 60rpx;display: flex;align-items: center;">
												<view style="margin-left: 20rpx;">
													还差{{item.surplus_num}}人，可免单
												</view>
												<image :src="getImageRoot('sanjiaoxin.png')" style="height: 60rpx;width: 20rpx;position: absolute;
														left: 270rpx;">
												</image>
											</view>

										</view>
										<view style="position: absolute;top: 60rpx;" v-if="freeSort==0&&currentSort==2">
											<view style="background: #CB2C2E;color: #FFFFFF;font-size: 28rpx;width: 168rpx;height: 60rpx;display: flex;align-items: center;">
												<view style="margin-left: 20rpx;">
													免单成功
												</view>
												<image :src="getImageRoot('sanjiaoxin.png')" style="height: 60rpx;width: 20rpx;position: absolute;
														left: 168rpx;">
												</image>
											</view>
										</view>
									</view>
									<!-- 商品信息开始 -->
									<view class="page-goods-title">
										<image v-if="currentSort!=1" src="static/images/shang.png" @click="business(item.goods_id,item.bus_id,item.card_id)"
										 style="width: 26rpx;height: 30rpx;margin-right: 16rpx;" />
										{{item.goods_name}}
									</view>
									<view style="display: flex;justify-content: space-between;">
										<view class="page-goods-price" style="display: flex;align-items: center;">
											<view style="color: #CB2C2E;display: flex;align-items: flex-end;">
												<view style="font-size: 24rpx;margin-bottom: 6rpx;">￥</view>
												<view style="font-size: 48rpx;font-weight: bold;">{{item.goods_price}}</view>
											</view>
											<view class="page-goods-marking">
												<view>原价</view>
												<view>￥{{item.line_price}}</view>
											</view>
										</view>
										<view>
											<view v-if="item.status==2 &&currentSort==2&&freeSort==0">
												<button style="background: #CCCCCC;color: #FFFFFF;font-size: 28rpx;font-weight: bold;line-height: 44px;margin-right: 24rpx;">免单成功</button>
											</view>
											<view v-else>
												<button class="btnclass" @click="gotomyOrder(item,2)">差{{item.surplus_share_num}}{{n_myfree}}</button>
												<!-- 	 <button class="btnclass"
														  @click="gotomyOrder(item,1)">差{{item.order[0].surplus_share_num}}{{n_myfree}}</button> -->
											</view>
										</view>
									</view>
									<!-- 商品信息结束 -->
								</view>
								<view style="display: flex;justify-content: space-between;align-items: center;">
									<!-- <view style="display: flex;" class="page-title">
										<view>参与：{{item.participate_num}}人</view>
										<view style="margin-left: 20rpx;">免单成功：{{item.suc_num}}人</view>
									</view> -->
									<!-- 	<view style="color: #CB2C2E;font-size: 28rpx;font-weight: 500;line-height: 44rpx;margin-right: 24rpx;">
										佣金￥{{item.dealer_money}}
									</view> -->
								</view>
							</view>
							<view class="page-goods-view" v-else>
								<!-- 为我的免单免单成功商品信息添加  本单为xxx免单多少元 -->
									<view v-if="(freeSort==1&&currentSort==2)&&item.return_money!=null" style="
								color: #333333;font-size: 28rpx;font-weight: 400;
								overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 630rpx;">
										本单为({{item.pid_nickName?item.pid_nickName:''}})免单{{item.return_money}}元
									</view>
								<!-- 点击我的免单进行中时商品信息头部展示 -->
								<view v-if="currentSort==2&&freeSort==1">
									<view>
										<view style="display: flex;justify-content:space-between;align-items: center;margin-top: 20rpx;">
											<view style="display: flex;align-items: center;">
												<image :src="!!item.user&&item.user.avatarUrl?item.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
												</image>
												<view style="margin-left: 20rpx;">{{!!item.user&&item.user.nickName?item.user.nickName:''}}</view>
											</view>
											
											<view style="display: flex;align-items: center;" @click.stop="handshareBtn(1,item)">
												<view style="color: #999999;font-size: 24rpx;font-weight:400;margin-right: 20rpx;">
													去加速
												</view>
												<view>
													<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 查看弹窗开始 -->
								<popup-view :show="seePopview" type="bottom" :overlay="seePopview" @touchmove.stop="" @clickmask="closeVoucher">
									<view style="width: 750rpx;height: 800rpx;background: #FFFFFF;border-radius: 40rpx 40rpx 0rpx 0rpx;">
										<view style="display: flex;align-items: center;justify-content: space-between;">
											<view style="padding: 40rpx 30rpx;font-weight: bold;color: #333333;opacity: 1;">
												{{seebtn==1?'正在免单':'免单成功'}}({{newtotal}}{{a_word}})
											</view>
											<view style="margin-right: 30rpx;height: 40rpx;width: 40rpx;color: #333333;">
												<view class="iconfont icon-roundclose" @click="handSeeclose"></view>
											</view>
										</view>
										<view style="padding:0 30rpx">
											<!-- <view style="overflow:hidden;text-overflow:ellipsis;width: 112rpx;white-space: nowrap;"> -->
											<scroll-view scroll-y="true" style="height: 600rpx;" @scrolltolower="lower">
												<!-- 2021年9月6日15:40:59
													应需求再次修改样式
												 -->
												<!-- <view v-if="FreeGoodsStatus.length>0" style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 20rpx;"
												 v-for="(seeitem,seeindex) in FreeGoodsStatus">
													<view style="display: flex;align-items: center;">
														<image :src="!!seeitem.user&&seeitem.user?seeitem.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
														</image>
														<view style="margin-left: 20rpx;overflow:hidden;text-overflow:ellipsis;width: 200rpx;white-space: nowrap;font-size: 28rpx;color: #000000;">{{!!seeitem.user&&seeitem.user?seeitem.user.nickName:''}}</view>
													</view>
													<view style="display: flex;" v-if="seeitem.status==1">
														<view style="margin-right: 60rpx;color: #999999;font-size: 28rpx;">
															还差{{seeitem.surplus_share_num}}人免单
														</view>
														<view style="background: #FFD940;padding: 10rpx;border-radius: 10rpx;color: #333333;" @click="newhandshareBtn(newseedata,seeitem)">
															帮TA加速
														</view>
													</view>
													<view v-else>
														<view style="color: #999999;font-size: 28rpx;">免单成功</view>
													</view>
												</view> -->
												<view v-if="FreeGoodsStatus.length>0" style="display: flex;justify-content: space-between;align-items: center;margin-bottom: 20rpx;"
												 v-for="(seeitem,seeindex) in FreeGoodsStatus">
													<view style="display: flex;align-items: center;">
														<view style="margin-right: 20rpx;font-size: 28rpx;color: #000000;" v-if="seeitem.status==1">{{seeitem.id_sort}}</view>
														<image :src="!!seeitem.user&&seeitem.user?seeitem.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
														</image>
														<view >
															<view style="margin-left: 20rpx;overflow:hidden;text-overflow:ellipsis;width: 200rpx;white-space: nowrap;font-size: 28rpx;color: #000000;">{{!!seeitem.user&&seeitem.user?seeitem.user.nickName:''}}</view>
															<view style="margin-left: 20rpx;color: #999999;font-size: 28rpx;" v-if="seeitem.status==1">
																还差{{seeitem.surplus_share_num}}{{n_myfree}}
															</view>
														</view>
													</view>
													<view v-if="seeitem.status==1">
															<text v-if="seeitem.id_sort-1==0" style="color: #ff7171;font-size: 28rpx;">即将进入免单流程</text>
															<text v-else style="color: #999999;font-size: 28rpx;">等待{{seeitem.id_sort-1}}位</text>
														<view style="background: #FFD940;padding: 10rpx;border-radius: 10rpx;color: #333333;width: 150rpx;" :class="seeitem.id_sort-1==0?'lestab':''" @click="newhandshareBtn(newseedata,seeitem)">
															帮TA加速
														</view>
															
													</view>
													<view v-else>
														<view style="color: #999999;font-size: 28rpx;">免单成功</view>
													</view>
												</view>
											</scroll-view>
											<view style="background: #FFFFFF;">
												<LoadMore :showLoadmore="!popuphasMore" v-if="!newshowSort" style="margin-top: 10rpx;"></LoadMore>
												<view v-else style="text-align: center;color: #AAAAAA;font-size: 26rpx;line-height: 26rpx;">上拉加载更多...</view>
											</view>
										</view>
									</view>

								</popup-view>
								<!-- 查看弹窗结束 -->

								<!--疯狂抢单全国免单时商品信息头部展示  如果order的长度大于1时 -->
								<!-- <view v-if="!!item.order&&item.order.length>0"> -->
								<view v-if="!!item.order&&item.order.length>0">

									<!-- 头部展示取数据的第一个 -->
									<view style="display: flex;justify-content:space-between;align-items: center;">
										<view style="display: flex;align-items: center;">
											<image :src="!!item.order[0].user&&item.order[0].user.avatarUrl?item.order[0].user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
											</image>
											<view style="margin-left: 20rpx;">{{!!item.order[0].user&&item.order[0].user.nickName?item.order[0].user.nickName:''}}</view>
										</view>

										<view style="display: flex;align-items: center;" @click.stop="handshareBtn(2,item)">
											<view style="color: #999999;font-size: 28rpx;font-weight: bold;margin-right: 20rpx;">
												帮TA加速
											</view>
											<view>
												<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
											</view>
										</view>
									</view>
									<!-- 商品信息开始 -->
									<view>
										<view class="page-goods-title">

											<view style="position: relative;">
												<image style="width: 630rpx; margin-top: 20rpx;" :src="item.image">
												</image>
												<!-- 	<view class="page-goods-index" style="position: absolute;margin-left: 10rpx;top: 40rpx;background: #000000;opacity: 0.5;border-radius: 31rpx;width: 470rpx;height: 70rpx;">
												</view> -->

												<view class="" style="display: flex;position: absolute;top:12rpx;left: 30rpx;">
													<!-- 又一次改需求，商品名字左边的图标移到商品图片上面  疯狂抢全国免单图标展示-->
													<image v-if="currentSort!=1" src="static/images/shang1.png" @click="business(item.goods_id,item.bus_id,item.card_id)"
													 style="width: 51rpx;height: 46rpx;margin-right: 16rpx;" />
													<image v-if="currentSort!=1" src="static/images/dizhi.png" @click="handtogo(item,item.goods_id,item.bus_id,item.card_id)"
													 style="width: 51rpx;height: 46rpx;margin-right: 16rpx;" />
													
													<!-- <view style="color: #FFFFFF;font-size: 24rpx;font-weight: 400;">
														距活动结束：
													</view>
													<view style="display: inline-flex;align-items: center;">
														 <view class="date" >{{d}}</view>
														 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">天</view>
														 <view class="date">{{h}}</view>
														 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">:</view>
														 <view class="date">{{m}}</view>
														 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">:</view>
														 <view class="date">{{s}}</view>
													</view> -->
												</view>
											</view>
											<!-- v-if="freeSort!=2&&currentSort!=2"
											v-if="currentSort!=1" -->
											<!-- <image v-if="currentSort!=1" src="static/images/shang.png" @click="business(item.goods_id,item.bus_id,item.card_id)" style="width: 26rpx;height: 30rpx;margin-right: 16rpx;"/> -->
											{{item.goods_name}}
										</view>
										<view style="display: flex;justify-content: space-between;">
											<view class="page-goods-price" style="display: flex;align-items: center;">
												<view style="color: #CB2C2E;display: flex;align-items: flex-end;">
													<view style="font-size: 24rpx;margin-bottom: 6rpx;">￥</view>
													<view style="font-size: 48rpx;font-weight: bold;">{{item.goods_price}}</view>
												</view>
												<view class="page-goods-marking">
													<view>原价</view>
													<view>￥{{item.line_price}}</view>
												</view>
											</view>
											<view>
												<view v-if="item.status==2 &&currentSort==2&&freeSort==0">
													<button style="background: #CCCCCC;color: #FFFFFF;font-size: 28rpx;font-weight: bold;line-height: 44px;margin-right: 24rpx;">免单成功</button>
												</view>
												<view v-else>
													<!-- <button class="btnclass"
															 @click="gotomyOrder(item)">差{{item.share_num}}{{n_myfree}}</button> -->
													<!-- <button class="btnclass" @click="gotomyOrder(item,1)">差{{item.order[0].surplus_share_num}}{{n_myfree}}</button> -->
													<button class="btnclass" @click="gotomyOrder(item,1)">立即下单</button>
												</view>
											</view>
										</view>
										<view style="display: flex;justify-content: space-between;align-items: center;">
											<!-- 	<view style="display: flex;" class="page-title">
													<view>参与：{{item.participate_num}}人</view>
													<view style="margin-left: 20rpx;">免单成功：{{item.suc_num}}人</view>
												</view> -->
											<!-- 	<view style="color: #CB2C2E;font-size: 28rpx;font-weight: 500;line-height: 44rpx;margin-right: 24rpx;">
													佣金￥{{item.dealer_money}}
												</view> -->
										</view>
									</view>

									<!-- 商品信息结束 -->
									<!-- 商品信息结束 在商品信息下面展示 -->
									<!-- <scroll-view scroll-y="true" style="height: 150rpx;">
													<view style="display: flex;justify-content:space-between;align-items: center;margin-top: 20rpx;" v-for="(newitem,newindex) in item.order">
														<view style="display: flex;align-items: center;">
															<image :src="!!newitem.user&&newitem.user.avatarUrl?newitem.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;"> </image>
															<view style="margin-left: 20rpx;">{{!!newitem.user&&newitem.user.nickName?newitem.user.nickName:''}}</view>
														</view>
														<view style="display: flex;align-items: center;" @click.stop="handshareBtn(3,newitem,item)">
															<view style="color: #999999;font-size: 24rpx;font-weight:400;margin-right: 20rpx;" >
																帮TA加速
															</view>
															  <view>
																<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
															  </view>
														</view>
														
													</view>
											</scroll-view> -->
									<view v-if="currentSort==0&&(orderSort==0||orderSort==1)">
										<view style="background: #F8F8F8;display: flex;justify-content: space-between;align-items: center;border-top-left-radius:14rpx;border-top-right-radius:14rpx;">
											<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;align-items: center;">
												<view style="margin-right: 20rpx;color: #333333;">{{item.have_num}}{{a_word}}</view>
												<view style="color: #999999;margin-right: 20rpx;" @click="handseebtn(item,1)">
													正在免单
													<image src="static/images/sanjiaoxing3.png" style="height: 16rpx;width: 20rpx;margin-left: 10rpx;"></image>
												</view>
											</view>
											<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;">
												<view style="margin-right: 20rpx;color: #333333;">{{item.suc_num}}{{a_word}}</view>
												<view style="color: #999999;" @click="handseebtn(item,2)">
													免单成功
													<image src="static/images/sanjiaoxing3.png" style="height: 16rpx;width: 20rpx;margin-left: 10rpx;"></image>
												</view>
											</view>
											<!-- <view style="display: flex;">
														<view style="margin-right: 20rpx;color: #999999;font-size: 24rpx;line-height: 44rpx;opacity: 1;" @click="handseebtn(item,1)">查看</view>
														<view>
															<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
														</view>
													</view> -->
										</view>
										<!-- <view style="background: #F8F8F8;display: flex;justify-content: space-between;align-items: center;border-bottom-left-radius:14rpx;border-bottom-right-radius:14rpx;">
													<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;">
														<view style="color: #999999;">免单成功</view>
														<view style="margin-left: 30rpx;color: #333333;">{{item.suc_num}}人</view>
													</view>
													<view style="display: flex;">
														<view style="margin-right: 20rpx;color: #999999;font-size: 24rpx;line-height: 44rpx;opacity: 1;" @click="handseebtn(item,2)">查看</view>
														<view>
															<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
														</view>
													</view>
												</view> -->
									</view>

								</view>
								<view v-else>
									<!-- 商品信息开始 -->
									<view>

										<view class="page-goods-title">
											<!-- 为我的免单免单成功商品信息添加  本单为xxx免单多少元 -->
											<view v-if="(freeSort==0&&currentSort==2)&&item.return_money!=null" style="
										color: #333333;font-size: 28rpx;font-weight: 400;
										overflow: hidden;text-overflow:ellipsis;white-space: nowrap;width: 630rpx;">
												本单为({{item.pid_nickName?item.pid_nickName:''}})免单{{item.return_money}}元
											</view>
											<view style="position: relative;">
												<image style="width: 630rpx;margin-top: 20rpx;" :src="item.image">
												</image>
												<!-- 如果是我的免单免单成功就显示免单成功在图片上，否则显示距离活动结束 -->
												<view style="position: absolute;top: 60rpx;" v-if="freeSort==0&&currentSort==2">
													<view style="background: #FFD940;color: #FFFFFF;font-size: 28rpx;width: 168rpx;height: 60rpx;display: flex;align-items: center;">
														<view style="margin-left: 20rpx;">
															免单成功
														</view>
														<image :src="getImageRoot('sanjiaoxin.png')" style="height: 60rpx;width: 20rpx;position: absolute;
														left: 168rpx;">
														</image>
													</view>
												</view>
												<view v-else>
													<!-- <view class="page-goods-index" style="position: absolute;top: 40rpx;margin-left: 10rpx;background: #000000;opacity: 0.5;border-radius: 31rpx;width: 470rpx;height: 70rpx;">
											</view> -->
													<view class="" style="display: flex;position: absolute;top:12rpx;left: 30rpx;">
														<!-- 之前做了一次兼容，这也是疯狂抢单全国免单的展示 -->
														<image v-if="currentSort!=1" src="static/images/shang1.png" @click="business(item.goods_id,item.bus_id,item.card_id)"
														 style="width: 51rpx;height: 46rpx;margin-right: 16rpx;" />
														<image v-if="currentSort!=1" src="static/images/dizhi.png" @click="handtogo(item,item.goods_id,item.bus_id,item.card_id)"
														 style="width: 51rpx;height: 46rpx;margin-right: 16rpx;" />
														
														<!-- <view style="color: #FFFFFF;font-size: 24rpx;font-weight: 400;">
													距活动结束：
												</view>
												<view style="display: inline-flex;align-items: center;">
													 <view class="date" >{{d}}</view>
													 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">天</view>
													 <view class="date">{{h}}</view>
													 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">:</view>
													 <view class="date">{{m}}</view>
													 <view style="margin: 0 6rpx 0 6rpx;color: #FFFFFF;font-size: 24rpx;">:</view>
													 <view class="date">{{s}}</view>
												</view> -->
													</view>
												</view>
											</view>
											<!-- 	<image v-if="currentSort!=1" src="static/images/shang.png" @click="business(item.goods_id,item.bus_id,item.card_id)" style="width: 26rpx;height: 30rpx;margin-right: 16rpx;"/> -->
											{{item.goods_name}}
										</view>
										<view style="display: flex;justify-content: space-between;">
											<view class="page-goods-price" style="display: flex;align-items: center;">
												<view style="color: #CB2C2E;display: flex;align-items: flex-end;">
													<view style="font-size: 24rpx;margin-bottom: 6rpx;">￥</view>
													<view style="font-size: 48rpx;font-weight: bold;">{{item.goods_price}}</view>
												</view>
												<view class="page-goods-marking">
													<view>原价</view>
													<view>￥{{item.line_price}}</view>
												</view>
											</view>
											<view>
												<view v-if="item.status==2 &&currentSort==2&&freeSort==0">
													<button style="background: #CCCCCC;color: #FFFFFF;font-size: 28rpx;font-weight: bold;line-height: 44px;margin-right: 24rpx;">免单成功</button>
												</view>
												<view v-else>
													<!-- <button class="btnclass" @click="gotomyOrder(item,3)">{{item.share_num}}{{n_myfree}}</button> -->
													<button class="btnclass" @click="gotomyOrder(item,3)">立即下单</button>
												</view>
											</view>
										</view>
										<!-- v-if="currentSort==2&&freeSort==0" -->
										<view style="display: flex;justify-content: space-between;align-items: center;" v-if="currentSort!=2&&freeSort!=0">
											<view style="display: flex;" class="page-title">
												<view>参与：{{item.participate_num}}人</view>
												<view style="margin-left: 20rpx;">免单成功：{{item.suc_num}}人</view>
											</view>
											<!-- 	<view style="color: #CB2C2E;font-size: 28rpx;font-weight: 500;line-height: 44rpx;margin-right: 24rpx;">
											佣金￥{{item.dealer_money}}
										</view> -->
										</view>

										<view v-if="currentSort==0&&(orderSort==0||orderSort==1)">
											<view style="background: #F8F8F8;display: flex;justify-content: space-between;align-items: center;border-top-left-radius:14rpx;border-top-right-radius:14rpx;">
												<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;">
													<view style="margin-right: 20rpx;color: #333333;">{{item.have_num}}{{a_word}}</view>
													<view style="color: #999999;" @click="handseebtn(item,1)">
														正在免单
														<image src="static/images/sanjiaoxing3.png" style="height: 16rpx;width: 20rpx;margin-left: 10rpx;"></image>
													</view>
												</view>
												<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;">
													<view style="margin-right: 20rpx;color: #333333;">{{item.suc_num}}{{a_word}}</view>
													<view style="color: #999999;" @click="handseebtn(item,2)">
														免单成功
														<image src="static/images/sanjiaoxing3.png" style="height: 16rpx;width: 20rpx;margin-left: 10rpx;"></image>
													</view>
												</view>
												<!-- <view style="display: flex;">
											<view style="margin-right: 20rpx;color: #999999;font-size: 24rpx;line-height: 44rpx;opacity: 1;" @click="handseebtn(item,1)">查看</view>
											<view>
												<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
											</view>
										</view> -->
											</view>
											<!-- <view style="background: #F8F8F8;display: flex;justify-content: space-between;align-items: center;border-bottom-left-radius:14rpx;border-bottom-right-radius:14rpx;">
										<view style="padding: 20rpx;display: flex;font-size: 24rpx;line-height: 44rpx;opacity: 1;">
											<view style="color: #999999;">免单成功</view>
											<view style="margin-left: 30rpx;color: #333333;">{{item.suc_num}}人</view>
										</view>
										<view style="display: flex;">
											<view style="margin-right: 20rpx;color: #999999;font-size: 24rpx;line-height: 44rpx;opacity: 1;" @click="handseebtn(item,2)">查看</view>
											<view>
												<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
											</view>
										</view>
									</view> -->
										</view>
									</view>
									<!-- 商品信息结束 -->

								</view>
								<!-- 我的免单进行中时展示 -->
								<view v-if="currentSort==2&&(freeSort==1||freeSort==0)">
									
									<view v-if="!!item.counts&&item.counts.length>0">
									
										<view style="margin-top: 20rpx;" v-for="(newitems,newindexs) in item.counts" :key="newindexs">
											<view style="display: flex;justify-content:space-between;align-items: center;" v-if="!!newitems.status&&newitems.status==1">
												<view style="display: flex;align-items: center;">
													<image :src="!!newitems.user&&newitems.user.avatarUrl?newitems.user.avatarUrl:''" style="height: 60rpx;width: 60rpx;border-radius: 50%;">
													</image>
													<view style="overflow:hidden;text-overflow:ellipsis;width: 100rpx;white-space: nowrap;">{{!!newitems.user&&newitems.user.nickName?newitems.user.nickName:''}}</view>
												</view>
												<view>
													{{newitems.return_rule}}
												</view>
												<view style="color: #999999;font-size: 24rpx;font-weight:400;margin-right: 20rpx;">
													已免单
												</view>
											</view>
											<view style="display: flex;justify-content:space-between;align-items: center;" v-else>
												<view style="display: flex;align-items: center;">
													<image src="static/images/user.png" style="height: 60rpx;width: 60rpx;border-radius: 50%;"> </image>
													<view style="width: 124rpx;">暂无数据</view>
												</view>
												<view>
													{{newitems.return_rule}}
												</view>
												
												<view style="display: flex;align-items: center;" @click.stop="handshareBtn(1,item)">
													<view style="color: #999999;font-size: 24rpx;font-weight:400;margin-right: 20rpx;">
														去加速
													</view>
													<view>
														<image src="static/images/duobianxing.png" style="height: 10rpx;width: 10rpx;margin-bottom: 4rpx;margin-right: 20rpx;"></image>
													</view>
												</view>
											</view>
										</view>
									</view>
								</view>

								<view>

								</view>
							</view>
						</view>
					</view>
					<!-- 分享列表 -->
					<view v-else>
						<view class="page-goods-view" v-if="freelistData.length>0">
							<view style="display: flex;justify-content: space-between;align-items: center;" v-for="(item,index) in freelistData"
							 :key="index">
								<view style="display: flex;">
									<image style="width: 70rpx;height: 70rpx;border-radius: 50%;" :src="!!item.user&&item.user.avatarUrl?item.user.avatarUrl:''"></image>
									<view style="margin-left: 20rpx;">
										<view style="font-size: 26rpx;font-weight: 400;line-height: 40rpx;color: #000000;">{{!!item.user&&item.user.nickName?item.user.nickName:''}}</view>
										<view style="font-size: 24rpx;font-weight: 400;line-height: 40rpx;color: #999999;">{{item.create_time}}</view>
									</view>
								</view>
								<view v-if="item.status==0">
									<view style="font-weight: 400;line-height: 40rpx;color: #CB2C2E;font-size: 26rpx;text-align: center;margin-right: 30rpx;">
										未返现
									</view>
								</view>
								<view v-else style="text-align: center;">
									<view style="font-size: 26rpx; font-weight: 400;line-height: 40rpx;color: #333333;">已购买</view>
									<view style="font-size: 20rpx;font-weight: 400;line-height: 40rpx;color: #999999;">（已返{{item.return_money}}元）</view>
								</view>

							</view>
						</view>
					</view>
					<!-- 分享列表end -->
				</view>
				<!-- <loadmore :showLoadmore="showLoadmore"></loadmore> -->
				<!-- 商品信息end -->

				<!-- 疯狂抢单end -->
				<!-- <view style="height: 20000rpx"></view> -->
			</view>
			<view v-else>
				<view style="background: #F7F7F7;">
					<Abnor abnor="DATA"></Abnor>
				</view>
			</view>
			<page-loading ref="loading"></page-loading>
			<view style="background: #FFFFFF;margin-bottom: 100rpx;">
				<LoadMore :showLoadmore="!hasMore" v-if="!showSort"></LoadMore>
			</view>
			<!-- 底部导航 -->
			<tab-bar zIndex="100" />
			<!-- 底部导航 end -->
			<PopupView :show='isShow' type='top' @clickmask='isShow=false'>
				<view class="">
					<!-- <image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image> -->
					<image src="../../../static/h5/share.png" mode="" style="width: 640rpx;"></image>
				</view>
			</PopupView>
			<!-- H5分享蒙层 -->
			<!-- #ifdef H5 -->
			<share-guide ref="shareGuide"></share-guide>
			<!-- #endif -->
			<!-- H5分享蒙层 end -->
		</view>
		<!-- 我准备放在这里的，不用:style="themeColor"这个包起来 -->
		<!-- <LoadMore :showLoadmore="!hasMore" v-if="!showSort" style="margin-top: 10rpx;"></LoadMore> -->
	</view>
</template>
<script>
	import {sleep} from '@/common/js/sleep.js'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	import agentMixin from "@/mixins/agentMixin.js"
	import Abnor from "@/components/template/Abnor.vue"
	import LeadAttention from '@/components/template/LeadAttention.vue'
	import Util from '@/common/js/util.js'
	import TabBar from '@/components/template/TabBar'
	import LoadMore from '@/components/template/Loadmore.vue'
	import PopupView from '@/components/template/PopManager.vue'
	import CountDown from '@/components/template/newCount.vue';
	import ShareView from "@/components/template/ShareView.vue"
	// import NewData from './components/newData.vue'
	import App from '@/common/js/app.js'
	import baseMixin from '@/mixins/baseMixin.js'
	export default {
		mixins: [baseMixin, agentMixin, pageShareMixin],
		components: {
			CountDown,
			Abnor,
			PopupView,
			LoadMore,
			TabBar,
			ShareView,
			LeadAttention
		},
		data() {
			return {
				newurl: '',
				newnickName: '',
				newgoods_name: '',
				isShow: false,
				cardUseDescnew: false,
				formData: {},
				// 当前的纬度
				lat: '',
				// 当前的经度
				lng: '',
				free: '',
				seebtn: '',
				number: '',
				newseedata: {},
				setting: {},
				new_user_can: '',
				n_myfree: '',
				a_word:'',
				currentSort: 0,
				hasMore: true,
				popuphasMore: true,
				orderSort: 0,
				classSort: -1,
				freeSort: 0,
				showSort: false,
				newshowSort: false,
				cardUseDesc: false,
				seePopview: false,
				inputGoods_name: '',
				FreeGoodsStatus: [],
				showLoadmore: false,
				activity_etime: '',
				sucAllData: [],
				free_id: '',
				category_id: '',
				d: '',
				h: '',
				m: '',
				s: '',
				page: 1,
				list_row: 3,
				user: {},
				newtotal: '',
				businessData: [],
				goodsData: [],
				cateData: [],
				swiperData: [],
				freelistData: [],
				buttondata: [],
				freeData: [{
						id: 'index1',
						title: '免单成功'
					},
					{
						id: 'index2',
						title: '进行中'
					},
					{
						id: 'index3',
						title: '分享列表'
					},
				],
				ordersdata: [{
						id: 'order1',
						title: '全国',
						num: ''
					},
					{
						id: 'order2',
						title: '距我最近',
						num: ''
					},
					{
						id: 'order3',
						title: '免单成功',
						num: '100',
					},
				]
			}
			goods: []
		},
		computed: {
			cHeaderStyleStr() {
				let style = ''
				// 状态栏高度
				style += `padding-top: ${this.baseMixin_cStatusBarHeight}px;`
				return style
			},
			cButtondata() {
				return this.currentSort
			},
			cOrderdata() {
				return this.orderSort
			},
			newFreeData() {
				let newOrder = []
				this.goodsData.forEach((item) => {
					newOrder.push(item.order)
				})
				console.log("lllssssssssssfff...0", newOrder)
				return newOrder
			},
			cNumber() {
				return this.number > 99 ? this.number = 99 + '+' : this.number
			},
			cAgentMixin_cAgentOpen() {
				return this.agentMixin_cAgentOpen ? this.agentMixin_cAgentName : this.agentMixin_cLocationName
			},
			canTip() {
				console.log("jjjjssssssssss", this.$store.state)
				return !!this.$store.state.userInfo && this.$store.state.userInfo.can_tip
			},
			isShowLead() {
				let isShowLead = false
				// #ifdef MP
				isShowLead = this.canTip === 3
				// #endif
				// #ifdef H5
				isShowLead = true
				// #endif
				return isShowLead
			},
			displayClass(){
				return 
			}


		},
		
		mounted() {
			console.log("454554545455", this.newsetting)
		},
		watch: {
			'setting.free': {
				handler(val) {
					setTimeout(() => {
						uni.setNavigationBarTitle({
							title: val
						})
					}, 100)
				},
				immediate: true,
			},
			formData(val) {
				console.log('哈哈哈哈啊哈', val)
				// let newdescribe = !!val.etting.describe?val.etting.describe:''
				this.shareData = this.pageShareMixin_createShareData({
					url: '/pages/subPages/myfreeBill/index',
					imgUrl: this.$util.deepGet(val, 'setting.image.0.file_path', ''),
					// desc: this.$util.deepGet(val,'setting.describe',''),
					desc: this.$util.deepGet(val, 'setting.describe', ''),
					title: this.$util.deepGet(val, 'free.title', ''),
				})
			},
		},
		
		async onLoad(options) {
			// console.log("2222222777",options.category_id)
			
			try {
				// #ifdef H5
				if (getCurrentPages().length <= 1) {
					await sleep(200)
					App.navigationTo({
						url: 'pages/subPages/myfreeBill/index?' + App.urlEncode({
							hackTop: (+options.hackTop || 0) + 1
						}),
						redirectTo: true
					})
					return
				}
				// #endif
				await this.mainMixin_BeforeFetchPageData()
				await this.agentMixin_checkAgentIfNeeded()
				const location = await App.getLocation().catch(() => {}) || {}
				this.lat = location.latitude
				this.lng = location.longitude

				this.goodsData = []

				await this.fetchdata({}).catch(() => {})
				if(options&&options.category_id){
					this.goodsData = []
					 let  category_id= options.category_id
					 let line= this.cateData.findIndex((value)=>value.category_id == category_id)
					 console.log("25555",line)
					 this.classSort  = line
					await this.cIntegration(category_id).catch(() => {})
				}
			
				//时间函数
				this.countTime()
			} catch (e) {

			}
			App.hideLoading()
		},
		//上拉加载
		onReachBottom() {
			//分页数据处理
			// 按钮标识
			if (this.currentSort == 0 && this.orderSort == 0) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					// 上拉加载的时候处理默认选中免单活动，但在这里处理不好
					// this.classSort = '-1'
					this.cIntegration(this.page++)
				}
				if (this.goodsData.length == this.total) {
					this.hasMore = false
					
				}
			}
			if (this.currentSort == 0 && this.orderSort == 1) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					// this.classSort = '-1'
					this.cIntegration(this.page++)
				}
				if (this.goodsData.length == this.total) {
					this.hasMore = false
				}
			}
			if (this.currentSort == 1) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					this.cFreeFriend(this.page++)
				}
				if (this.goodsData.length == this.total) {
					this.hasMore = false
				}
			}
			if (this.currentSort == 2 && this.freeSort == 0) {
				if (this.current_page < this.last_page) {
					this.freesuccess(this.page++)
				}
				if (this.goodsData.length == this.total) {
					this.hasMore = false
				}
			}
			//我的免单进行中的开启上拉加载
			if (this.currentSort == 2 && this.freeSort == 1) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					this.haveinhand(this.page++)
				}
				if (this.goodsData.length == this.total) {
					this.hasMore = false
				}
			}
			if (this.currentSort == 2 && this.freeSort == 2) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					this.handfreelist(this.page++)
				}
				if (this.freelistData.length == this.total) {
					this.hasMore = false
				}
			}
			//疯狂抢单免单成功
			if (this.currentSort == 0 && this.orderSort == 2) {
				this.hasMore = true
				if (this.current_page < this.last_page) {
					this.asucAllDatabtn(this.page++)
				}
				if (this.sucAllData.length == this.total) {
					this.hasMore = false
				}
			}
			console.log("11111123333", this.currentSort, this.orderSort)
			// if(this.seePopview ==true){
			// 		this.hasMore = true
			// 		if(this.current_page<this.last_page){
			// 			this.FreeGoodsStatusNum(this.page++)
			// 		}
			// 		if(this.goodsData.length==this.total){
			// 			this.hasMore = false
			// 		}
			// }
		},
		// 下拉刷新
		async onPullDownRefresh() {
			this.goodsData = []
			this.page = 1
			this.orderSort = 0
			this.classSort = '-1'
			try {
				await this.mainMixin_BeforeFetchPageData()
				await Promise.all([
					this.fetchdata({}).catch((res) => {
						if (res.data.goods.data.length == 0) {
							// this.currentSort=0
							this.showSort = true
							this.hasMore = false
						} else {
							this.hasMore = true
							this.currentSort = 0
							this.orderSort = 0
						}
					}),
				])
			} catch (e) {

			}
			uni.stopPullDownRefresh()
		},
		created() {
			// 点击免单商品,切换全国免单时
			this.debounceK = this.$util.debounceNew(() => {
				this.cIntegration()
			}, 500, false)

			// 点击我的免单,切换免单成功,进行中
			// 1.切换免单成功时
			this.cgdebounceK = this.$util.debounceNew(() => {
				this.freesuccess()
			}, 500, false)
			this.ingdebounceK = this.$util.debounceNew(() => {
				this.haveinhand()
			}, 500, false)
			this.cIntdebounceK = this.$util.debounceNew(() => {
				this.cIntegration()
			}, 500)
			this.cFreedebounceK = this.$util.debounceNew(() => {
				this.cFreeFriend()
			}, 500)
			this.cfreeBtn = this.$util.debounceNew((index) => {
				this.freeBtn(index)
			}, 500)
			this.handlebuttonClickDebounce = this.$util.debounceNew((index) => {
				// this.freeBtn(index)
				this.handlebuttonClick(index)
			}, 200)
		},
		methods: {
			hangnewBtn(index){
				// console.log("123999",this.swiperData)
				// console.log("12399910",swiperData[index].link)
				const item = this.swiperData[index]
				if(item.link){
					this.navigationTo(item.link)
				}
			},
			closeVoucher() {
				console.log("2222222")
				this.seePopview = false;
			},
			async handtogo(item,goods_id, bus_id, card_id) {
				try {
					const res = await App._postP('Business/lists', {
						bus_id: bus_id,
						goods_id: goods_id,
						card_id: card_id,
					})
					console.log("6666666",item)
					App.navigationTo({
						url: `pages/subPages/myfreeBill/indexmap?businessData=${JSON.stringify(res.data)}&item=${JSON.stringify(item)}`
					})
				} catch (e) {
					return Promise.reject(e)
				}
			},
			//防止滑动穿透
			moveStop() {
				return
			},

			// 弹窗上拉加载
			lower() {
				this.popuphasMore = true
				if (this.current_page < this.last_page) {
					this.newshowSort = true
					// this.popuphasMore = false
					this.FreeGoodsStatusNum(this.newseedata, this.seebtn, this.page++)
				}
				console.log("dsfdsfdsfdsfds", this.FreeGoodsStatus.length, this.newtotal)
				if (this.FreeGoodsStatus.length == this.newtotal) {
					this.newshowSort = false
					this.popuphasMore = false
				}
			},
			handseebtn(item, num) {
				console.log("sssshhhhhhhhhhhhhh", item, num)
				this.popuphasMore = false
				this.newseedata = item
				this.seePopview = true
				this.seebtn = num
				this.page = 1
				this.FreeGoodsStatus = []
				this.FreeGoodsStatusNum(item, num, this.page)
			},
			handSeeclose() {
				this.seePopview = false
			},
			// 查看弹窗数据
			async FreeGoodsStatusNum(item, num) {
				try {
					const res = await App._postP('free.Free/FreeGoodsStatusNum', {
						status: num,
						goods_id: item.goods_id,
						card_id: item.card_id,
						free_id: item.free_id,
						page: this.page,
					})
					this.current_page = res.data.current_page
					this.last_page = res.data.last_page
					this.newtotal = res.data.total
					if (this.current_page < this.last_page) {
						this.newshowSort = true
					}
					if (this.current_page == this.last_page) {
						this.popuphasMore = false
					}

					res.data.data.map(res => {
						this.FreeGoodsStatus.push({
							user: res.user,
							surplus_share_num: res.surplus_share_num,
							status: res.status,
							goods_name: res.goods_name,
							mid: res.mid,
							goods_id: res.goods_id,
							card_id: res.card_id,
							free_id: res.free_id,
							id_sort:res.id_sort,
						})
					})
					console.log("ddddddddddddd", this.FreeGoodsStatus)

				} catch (e) {
					return Promise.reject(e)
				}
			},
			newhandshareBtn(newseedata, seeitem) {
				console.log("ddddd222222222", newseedata, seeitem)
				this.seePopview = false
				this.cardUseDescnew = true
				this.newnickName = seeitem.user.nickName || ''
				this.newgoods_name = newseedata.goods_name || ''
				this.cFreeGoodsQRCode(seeitem)
				this.shareData = this.pageShareMixin_createShareData({
					url: newseedata.is_goods == 1 ? '/pages/subPages/goods/index/index' : 'pages/subPages/card/createOrder',
					imgUrl: this.$util.deepGet(newseedata, 'image', ''),
					desc: this.$util.deepGet(seeitem, 'user.nickName', '') + "," + this.$util.deepGet(this.setting, 'describe', ''),
					title: this.$util.deepGet(newseedata, 'goods_name', ''),
					query: {
						free_id: this.$util.deepGet(newseedata, 'free_id', ''),
						card_id: this.$util.deepGet(newseedata, 'card_id', ''),
						goods_id: this.$util.deepGet(newseedata, 'goods_id', ''),
						referee_id: this.$util.deepGet(seeitem, 'mid', ''),
					}
				})

			},
			//分享操作
			handshareBtn(type, item, newitem) {
				console.log("dddddfdsfsdfdsfds", type, item)
				this.newgoods_name = item.goods_name
				// type==1  我的免单头部去加速和商品详情下面去加速
				if (type == 1) {
					this.cardUseDescnew = true
					this.newnickName = item.user.nickName || ''
					this.newgoods_name = item.goods_name || ''
					this.cFreeGoodsQRCode(item)
					if (item.is_goods == 1) {
						url: "pages/subPages/goods/index/index?" + App.urlEncode({
							goods_id: item.goods_id,
							free_id: item.free_id,
							referee_id: item.user ? item.user.user_id : '',
						})
					}
					else {
						url: "pages/subPages/card/createOrder?" + App.urlEncode({
							free_id: item.free_id,
							referee_id: item.user ? item.user.user_id : '',
							card_id: item.card_id,
						})
					}

					console.log("4444444444", item)
					this.shareData = this.pageShareMixin_createShareData({
						url: item.is_goods == 1 ? '/pages/subPages/goods/index/index' : 'pages/subPages/card/createOrder',
						imgUrl: this.$util.deepGet(item, 'image', ''),
						desc: this.$util.deepGet(item, 'user.nickName', '') + "," + this.$util.deepGet(this.setting, 'describe', ''),
						title: this.$util.deepGet(item, 'goods_name', ''),
						query: {
							free_id: this.$util.deepGet(item, 'free_id', ''),
							card_id: this.$util.deepGet(item, 'card_id', ''),
							goods_id: this.$util.deepGet(item, 'goods_id', ''),
							referee_id: this.$util.deepGet(item, 'user.user_id', ''),
						}
					})
				}
				// type==2 疯狂抢单全国免单帮TA去加速 这里取的是order[0].user.user_id
				if (type == 2) {
					this.cardUseDescnew = true
					this.newnickName = item.order[0].user.nickName || ''
					this.cFreeGoodsQRCode(item)
					if (item.is_goods == 1) {
						url: "pages/subPages/goods/index/index?" + App.urlEncode({
							goods_id: item.goods_id,
							free_id: item.free_id,
							referee_id: !!item.order[0].user && item.order[0].user.user_id ? item.order[0].user.user_id : '',
						})
					}
					else {
						url: "pages/subPages/card/createOrder?" + App.urlEncode({
							free_id: item.free_id,
							referee_id: !!item.order[0].user && item.order[0].user.user_id ? item.order[0].user.user_id : '',
							card_id: item.card_id,
						})
					}

					// 
					this.shareData = this.pageShareMixin_createShareData({
						url: item.is_goods == 1 ? '/pages/subPages/goods/index/index' : 'pages/subPages/card/createOrder',
						imgUrl: this.$util.deepGet(item, 'image', ''),
						desc: this.$util.deepGet(item, 'order[0].user.nickName', '') + "," + this.$util.deepGet(this.setting,
							'describe', ''),
						title: this.$util.deepGet(item, 'goods_name', ''),
						query: {
							free_id: this.$util.deepGet(item, 'free_id', ''),
							card_id: this.$util.deepGet(item, 'card_id', ''),
							goods_id: this.$util.deepGet(item, 'goods_id', ''),
							referee_id: this.$util.deepGet(item, 'order[0].user.user_id', ''),
						}
					})
				}

				//疯狂抢单全国免单帮,商品详情下面帮TA加速时
				if (type == 3) {
					this.cardUseDescnew = true
					this.cFreeGoodsQRCode(item)
					if (item.is_goods == 1) {
						url: "pages/subPages/goods/index/index?" + App.urlEncode({
							goods_id: item.goods_id,
							free_id: item.free_id,
							referee_id: item.user.user_id,
						})
					}
					else {
						url: "pages/subPages/card/createOrder?" + App.urlEncode({
							free_id: item.free_id,
							referee_id: item.user.user_id,
							card_id: item.card_id,
						})
					}
					this.shareData = this.pageShareMixin_createShareData({
						url: item.is_goods == 1 ? '/pages/subPages/goods/index/index' : 'pages/subPages/card/createOrder',
						imgUrl: this.$util.deepGet(newitem, 'image', ''),
						desc: this.$util.deepGet(newitem, '', ''),
						title: this.$util.deepGet(newitem, 'goods_name', ''),
						query: {
							free_id: this.$util.deepGet(item, 'free_id', ''),
							card_id: this.$util.deepGet(item, 'card_id', ''),
							goods_id: this.$util.deepGet(item, 'goods_id', ''),
							referee_id: this.$util.deepGet(item, 'user.user_id', ''),
						}
					})
				}

			},
			async cFreeGoodsQRCode(item) {
				try {
					const res = await App._postP('free.Free/freeGoodsQRCode', {
						goods_id: item.goods_id,
						card_id: item.card_id,
						free_id: item.free_id,
						referee_id: !!item.order && item.order[0].user.user_id ? item.order[0].user.user_id : item.user.user_id,
					})
					console.log("333333333.3.3.3.", res.data)
					this.newurl = res.data
				} catch (e) {
					return Promise.reject(e)
				}
			},

			// 弹窗操作
			closenew() {
				this.cardUseDescnew = false
			},
			shareBtn() {
				if (this.appClientType === "3") {
					uni.showToast({
						icon: "none",
						title: "请使用自带浏览器分享~"
					})
				} else if (this.appClientType === "4") {
					this.isShow = true;
				}

			},
			hangderbtn() {
				// #ifdef H5
				this.shareBtn()
				this.cardUseDescnew = false
				// #endif

			},
			// 搜索,分类,推荐接口请求
			async cIntegration(category_id) {
				try {
					if(this.currentSort != 0) return 
					const res = await App._postP('free.Free/getWhereFreeGoods', {
						category_id: this.classSort == -1 ? '' : this.category_id || category_id,
						goods_name: this.inputGoods_name,
						free_id: this.free_id,
						orderSort: this.orderSort,
						list_row: this.list_row,
						page: this.page,
						lat: this.orderSort == 1 ? this.lat : '',
						lng: this.orderSort == 1 ? this.lng : '',
					})
					if(this.currentSort != 0) return 
					if (this.currentSort == 0 && this.page == 0) {
						this.goodsData = []
					}
					if (res.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {

						if (res.data.data.length == 0) {
							//data为
							this.goodsData = []
							this.hasMore = false
						} else {
							this.current_page = res.data.current_page
							this.last_page = res.data.last_page
							this.total = res.data.total
							if (this.current_page == this.last_page) {
								this.hasMore = false
							}
							res.data.data.map(result => {
								//如果is_goods==1就取goods下面的数据，否则去card下面的数据
								if (result.is_goods == 1) {
									this.goodsData.push({
										goods_name: result.goods[0].goods_name, //商品名称
										image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
										goods_price: result.goods[0].sku[0].goods_price, //商品价格
										line_price: result.goods[0].sku[0].line_price, //划线价格
										dealer_money: result.dealer_money, //佣金
										participate_num: result.participate_num, //参与人数
										suc_num: result.suc_num, //免单成功人数
										goods_id: result.goods_id,
										free_id: result.free_id,
										have_num: result.have_num,
										share_num: result.share_num, //n人免单
										is_goods: result.is_goods,
										order: result.order
									})
								} else {
									this.goodsData.push({
										// 划线价,佣金,,,,,,暂无
										goods_name: result.card[0].title, //商品名称
										image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
										goods_price: result.card[0].unit_price, //商品价格
										line_price: result.card[0].unit_price, //划线价格
										participate_num: result.participate_num, //参与人数
										suc_num: result.suc_num, //免单成功人数,
										dealer_money: result.dealer_money, //佣金
										card_id: result.card_id,
										share_num: result.share_num, //n人免单
										free_id: result.free_id,
										have_num: result.have_num,
										is_goods: result.is_goods,
										order: result.order
									})
								}
							})
						}
					}
				} catch (e) {
					return Promise.reject(e)
				}
			},
			handlebuttonClickX(index) {
				this.goodsData = []
				this.currentSort = index;
				this.page = 1
				this.hasMore = true
				this.handlebuttonClickDebounce(index)
			},
			handlebuttonClick(index) {
				this.goodsData = []
				this.currentSort = index;
				this.page = 1
				this.hasMore = true
				//index等于1---好友专区
				console.log("idnddddd", index)
				if (index == 1) {
					// this.hasMore = true
					// // this.fetchdata()
					this.goodsData = []
					this.hasMore = true
					this.cFreedebounceK()
					// this.cFreeFriend()
				} else if (index == 0) {
					this.orderSort = 0
					this.goodsData = []
					this.hasMore = true
					// this.ingFreeOrderList()
					this.cIntdebounceK()
				} else if (index == 2) {
					console.log("jjjjj")
					this.goodsData = []
					this.hasMore = true
					this.cfreeBtn(index = 1)
				}
				// if(index==3){

				// }
			},
			// 分类搜索
			async classificationBtn(index, category_id) {
				this.goodsData = []
				this.classSort = index
				this.category_id = index == -1 ? '' : category_id
				this.currentSort = 0
				if (this.orderSort == 2) {
					this.orderSort = 0
				}
				// currentSort
				// this.orderSort = 0
				this.page = 1
				this.hasMore = true
				this.cIntegration(this.category_id)
				console.log("sdfdsfdsf", this.category_id)
			},
			// 搜索
			async onInput(e) {
				console.log("5885888")
				this.currentSort = 0
				// orderSort
				if (this.orderSort == 2) {
					this.orderSort = 0
				}
				this.page = 1
				this.hasMore = true
				this.goodsData = []
				this.cIntegration()
			},
			/**
			 * 查看门店地址
			 */
			storeLocation(lat, lng, name, address) {
				App.openLocation({
					name,
					address,
					latitude: Number(lat),
					longitude: Number(lng),
					success() {
						console.log('success');
					}
				});
			},
			/**
			 * 拨打门店电话
			 */
			storeMobile(mobile) {
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
			handbusIdBtn(bus_id, store_id) {
				App.navigationTo({
					url: `pages/subPages/shopDetail/shopDetail?bus_id=${bus_id}&store_id=${store_id}`
				})
			},
			close() {
				this.cardUseDesc = false
			},
			//适用商家
			async business(goods_id, bus_id, card_id) {
				// console.log("sssss000000000",goods_id, bus_id,card_id)
				this.cardUseDesc = true
				try {
					const res = await App._postP('Business/lists', {
						bus_id: bus_id,
						goods_id: goods_id,
						card_id: card_id,
					})
					this.businessData = res.data

				} catch (e) {
					return Promise.reject(e)
				}
			},
			gotomyOrder(item, num) {
				console.log("zjhess大家伙的海岛大亨", item, num)
				// num=1疯狂抢单全国免单差几人免单按钮
				//num=2 好友专区免单按钮
				// num=3
				if (num == 1) {
					if (item.is_goods == 1) {
						App.navigationTo({
							// pages/subPages/goods/index/index?goods_id=${item.goods_id}&free_id=${item.free_id}
							url: "pages/subPages/goods/index/index?" + App.urlEncode({
								goods_id: item.goods_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: !!item.order && item.order.length > 0 ? item.order[0].mid : '',
							}),
						})
					} else {
						App.navigationTo({
							// url: `pages/subPages/card/createOrder?card_id=${item.card_id}&free_id=${item.free_id}&referee_id=${item.user?item.user.user_id:''}`
							url: "pages/subPages/card/createOrder?" + App.urlEncode({
								card_id: item.card_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: !!item.order && item.order.length > 0 ? item.order[0].mid : '',
								from: "free",
							})
						})
					}
				} else if(num==2) {
					if (item.is_goods == 1) {
						App.navigationTo({
							// pages/subPages/goods/index/index?goods_id=${item.goods_id}&free_id=${item.free_id}
							url: "pages/subPages/goods/index/index?" + App.urlEncode({
								goods_id: item.goods_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: item.mid,
							}),
						})
					} else {
						App.navigationTo({
							// url: `pages/subPages/card/createOrder?card_id=${item.card_id}&free_id=${item.free_id}&referee_id=${item.user?item.user.user_id:''}`
							url: "pages/subPages/card/createOrder?" + App.urlEncode({
								card_id: item.card_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: item.mid,
								from: "free",
							})
						})
					}
				}else{
					if (item.is_goods == 1) {
						App.navigationTo({
							// pages/subPages/goods/index/index?goods_id=${item.goods_id}&free_id=${item.free_id}
							url: "pages/subPages/goods/index/index?" + App.urlEncode({
								goods_id: item.goods_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: item.mid,
							}),
						})
					} else {
						App.navigationTo({
							// url: `pages/subPages/card/createOrder?card_id=${item.card_id}&free_id=${item.free_id}&referee_id=${item.user?item.user.user_id:''}`
							url: "pages/subPages/card/createOrder?" + App.urlEncode({
								card_id: item.card_id,
								free_id: item.free_id,
								// referee_id:item.user?item.user.user_id:'',
								referee_id: item.mid,
								from: "free",
							})
						})
					}
				}

			},

			async orderBtn(index) {
				this.orderSort = index;
				this.page = 1
				this.goodsData = []
				this.hasMore = true
				//运用防抖函数  如果不做防抖，每点击一次都会请求接口，都会触发事件处理，造成性能浪费
				console.log("11111", index)
				if (index == 2) {
					this.page = 1
					this.hasMore = true
					this.sucAllData = []
					this.asucAllDatabtn()
				} else {
					this.debounceK()
				}

			},
			async asucAllDatabtn() {
				try {
					const res = await App._postP('free.Free/FreeSucAll', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					if (res.data.data.length == 0) {
						this.sucAllData = []
						this.hasMore = false
					} else {
						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total
						// this.sucAllData = res.data.data
						if (res.data.data.length == 0) {
							this.sucAllData = []
							this.hasMore = false
						} else {
							this.current_page = res.data.current_page
							this.last_page = res.data.last_page
							this.total = res.data.total
							res.data.data.map(result => {
								if (result.is_goods == 1) {
									this.sucAllData.push({
										user: result.user,
										create_time: result.create_time,
										goods_name: result.goods[0].goods_name,
										file_path: result.goods[0].image[0].file_path || '',
										share_num: result.share_num || '', //多少人助力免单
										return_money: result.return_money || '', //已返多少钱
									})
								} else {
									this.sucAllData.push({
										user: result.user,
										create_time: result.create_time,
										goods_name: result.card[0].title,
										file_path: result.card[0].image[0].file_path || '',
										share_num: result.share_num || '', //多少人助力免单
										return_money: result.return_money || '', //已返多少钱
									})
								}

							})
							if (this.current_page == this.last_page) {
								this.hasMore = false
							}
						}
						console.log("222222222ssss", this.sucAllData)
					}

				} catch (e) {
					return Promise.reject(e)
				}
			},
			async ingFreeOrderList() {

				try {
					const res = await App._postP('free.Free/ingFreeOrderList', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					// this.freelistData = res.data.data
					if (res.data.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {
						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total
						if (this.current_page == this.last_page) {
							this.hasMore = false
						}
						res.data.data.map(result => {
							if (result.is_goods == 1) {
								this.goodsData.push({
									goods_name: result.goods[0].goods_name, //商品名称
									image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.goods[0].sku[0].goods_price, //商品价格
									line_price: result.goods[0].sku[0].line_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									surplus_num: result.surplus_num, //还差多少人可免单
									goods_id: result.goods_id,
									user: result.user,
									free_id: result.free_id,
									share_num: result.share_num, //n人免单
									is_goods: result.is_goods,
								})
							} else {
								this.goodsData.push({
									goods_name: result.card[0].title, //商品名称
									image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.card[0].unit_price, //商品价格
									line_price: result.card[0].unit_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									surplus_num: result.surplus_num, //还差多少人可免单
									free_id: result.free_id,
									user: result.user,
									share_num: result.share_num, //n人免单
									card_id: result.card_id,
									is_goods: result.is_goods,
								})
							}

						})
					}

				} catch (e) {
					return Promise.reject(e)
				}
			},
			async freeBtn(index) {
				this.freeSort = index;
				this.goodsData = []
				this.page = 1
				this.hasMore = true
				// console.log("fsdfds",index)
				// 点击我的免单分享列表之后请求接口 free.Free/getShareList
				if (index == 2) {
					this.page = 1
					this.freelistData = []
					this.hasMore = true
					this.handfreelist()
				}
				// 点击我的免单分享列表之后请求接口 free.Free/ingFreeList
				// participate_num  还差多少人可免单
				if (index == 1) {
					this.ingdebounceK()
				}
				// 点击我的免单免单成功之后请求接口 free.Free/sucFreeList
				if (index == 0) {
					this.cgdebounceK()
				}
			},
			//分享列表
			async handfreelist() {
				try {
					const res = await App._postP('free.Free/getShareList', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					if (res.data.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {

						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total
						// this.freelistData = res.data.data
						if (res.data.data.length == 0) {
							this.freelistData = []
							this.hasMore = false
						} else {
							this.current_page = res.data.current_page
							this.last_page = res.data.last_page
							this.total = res.data.total
							res.data.data.map(result => {
								this.freelistData.push({
									user: result.user,
									create_time: result.create_time,
									return_money: result.return_money,
									status: result.status,
								})
							})
						}
						if (this.current_page == this.last_page) {
							this.hasMore = false
						}
					}

				} catch (e) {
					return Promise.reject(e)
				}
			},
			//进行中
			async haveinhand() {
				try {
					const res = await App._postP('free.Free/ingFreeList', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					// this.freelistData = res.data.data
					if (res.data.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {
						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total
						// this.goodsData = []
						res.data.data.map(result => {
							if (result.is_goods == 1) {
								this.goodsData.push({
									goods_name: result.goods[0].goods_name, //商品名称
									image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.goods[0].sku[0].goods_price, //商品价格
									line_price: result.goods[0].sku[0].line_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									surplus_num: result.surplus_num, //还差多少人可免单
									goods_id: result.goods_id,
									free_id: result.free_id,
									user: result.user,
									share_num: result.share_num, //n人免单
									is_goods: result.is_goods,
									counts: result.counts,
									mid:result.mid,
									pid_nickName: result.pid_nickName,
									return_money: result.return_money,
								})
							} else {
								this.goodsData.push({
									goods_name: result.card[0].title, //商品名称
									image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.card[0].unit_price, //商品价格
									line_price: result.card[0].unit_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									surplus_num: result.surplus_num, //还差多少人可免单
									free_id: result.free_id,
									share_num: result.share_num, //n人免单
									card_id: result.card_id,
									user: result.user,
									mid:result.mid,
									is_goods: result.is_goods,
									counts: result.counts,
									pid_nickName: result.pid_nickName,
									return_money: result.return_money,
								})
							}

						})
						if (this.current_page == this.last_page) {
							this.hasMore = false
						}
					}

				} catch (e) {
					return Promise.reject(e)
				}
			},
			// 免单成功
			async freesuccess() {

				try {
					if(this.currentSort != 2) return
					const res = await App._postP('free.Free/sucFreeList', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					if(this.currentSort != 2) return 
					if (this.currentSort == 2 && this.page == 1) {
						this.goodsData = []
					}
					if (res.data.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {
						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total
						// this.goodsData = []
						res.data.data.map(result => {
							if (result.is_goods == 1) {
								this.goodsData.push({
									goods_name: result.goods[0].goods_name, //商品名称
									image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.goods[0].sku[0].goods_price, //商品价格
									line_price: result.goods[0].sku[0].line_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									goods_id: result.goods_id,
									free_id: result.free_id,
									share_num: result.share_num, //n人免单
									status: result.status, //免单成功
									is_goods: result.is_goods,
									counts: result.counts,
									pid_nickName: result.pid_nickName,
									return_money: result.return_money,
								})
							} else {
								this.goodsData.push({
									goods_name: result.card[0].title, //商品名称
									image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.card[0].unit_price, //商品价格
									line_price: result.card[0].unit_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									goods_id: result.goods_id,
									free_id: result.free_id,
									share_num: result.share_num, //n人免单
									status: result.status, //免单成功
									is_goods: result.is_goods,
									card_id: result.card_id,
									counts: result.counts,
									pid_nickName: result.pid_nickName,
									return_money: result.return_money,
								})
							}
							if (this.goodsData.length == this.total) {
								this.hasMore = false
							}
						})
					}
				} catch (e) {
					return Promise.reject(e)
				}
			},
			async fetchdata() {
				try {
					const res = await App._postP('free.Free/getFree')
					// 如果接口请求回来的数据，data为空就不显示整个页面
					if (res.data.length == 0) {
						this.showSort = true
						this.hasMore = false
					} else {
						this.hasMore = false
						// this.orderSort = 0
						this.currentSort = 0
						this.page = 1
						this.formData = res.data || {}
						this.current_page = res.data.goods.current_page
						this.last_page = res.data.goods.last_page
						this.total = res.data.goods.total
						// this.category_id=res.data.category[0].category_id
						this.cateData = res.data.category
						this.swiperData = res.data.setting.cover
						this.free_id = res.data.free.free_id
						this.activity_etime = res.data.free.activity_etime
						this.new_user_can = res.data.setting.new_user_can
						this.free = res.data.setting.free
						this.n_myfree = res.data.setting.n_myfree
						this.number = res.data.number
						this.a_word= res.data.setting.a_word
						//接收全部setting
						this.setting = res.data.setting
						this.buttondata = []
						console.log("dhhdhd|ssssssssss", this.setting)
						this.buttondata.push({
								id: 'index0',
								title: res.data.setting.free_order
							},
							// {
							// 	id:'index1',
							// 	title:res.data.setting.crazy
							// },
							{
								id: 'index1',
								title: res.data.setting.friend
							}, {
								id: 'index2',
								title: res.data.setting.myfree
							},
						)
						// 处理商品数据 暂时没有考虑卡包数据
						// 1.处理时间
						res.data.goods.data.map(result => {
							if (result.is_goods == 1) {
								this.goodsData.push({
									goods_name: result.goods[0].goods_name, //商品名称
									image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.goods[0].sku[0].goods_price, //商品价格
									line_price: result.goods[0].sku[0].line_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									//跳转页面需要带的参数
									goods_id: result.goods_id,
									user: result.user,
									free_id: result.free_id,
									have_num: result.have_num,
									bus_id: result.goods[0].bus_id,
									share_num: result.share_num, //n人免单
									is_goods: result.is_goods,
									order: result.order,
								})
							} else {
								this.goodsData.push({
									goods_name: result.card[0].title, //商品名称
									image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.card[0].unit_price, //商品价格
									line_price: result.card[0].unit_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									goods_id: result.goods_id,
									free_id: result.free_id,
									user: result.user,
									have_num: result.have_num,
									surplus_num: result.surplus_num,
									share_num: result.share_num, //n人免单
									status: result.status, //免单成功
									is_goods: result.is_goods,
									card_id: result.card_id,
									order: result.order,
								})
							}
							if (this.goodsData.length == res.data.goods.total) {
								this.hasMore = false
							}
							// console.log("fdsfdsf",this.goodsData)
						})

					}
				} catch (e) {
					return Promise.reject(e)
				}
			},
			//处理时间函数
			countTime() {
				//获取当前时间
				var date = new Date()
				var now = date.getTime()
				//设置截止时间
				// var endDate = new Date('2019-10-22 23:23:23')
				// var end = endDate.getTime()
				var timestamp = (new Date()).getTime();
				var timeCa = this.activity_etime * 1000 - timestamp
				//时间差
				// var leftTime = end - now
				//定义变量 d,h,m,s保存倒计时的时间
				if (timeCa >= 0) {
					this.d = Math.floor(timeCa / 1000 / 60 / 60 / 24) //天数我没用到，暂且写上
					this.h = Math.floor((timeCa / 1000 / 60 / 60) % 24)
					this.m = Math.floor((timeCa / 1000 / 60) % 60)
					this.s = Math.floor((timeCa / 1000) % 60)
				} else {
					this.d = '0'
					this.h = '0'
					this.m = '0'
					this.s = '0'
				}
				if (this.d < 10) {
					this.d = '0' + this.d
				}
				if (this.h < 10) {
					this.h = '0' + this.h
				}
				if (this.m < 10) {
					this.m = '0' + this.m
				}
				if (this.s < 10) {
					this.s = '0' + this.s
				}
				//递归每秒调用countTime方法，显示动态时间效果
				setTimeout(this.countTime, 1000)
			},
			async cFreeFriend() {
				try {
					if(this.currentSort != 1) return
					const res = await App._postP('free.Free/getFreeFriend', {
						free_id: this.free_id,
						page: this.page,
						list_row: this.list_row,
					})
					if(this.currentSort != 1) return 
					if (this.currentSort == 1 && this.page == 1) {
						this.goodsData = []
					}
					if (res.data.data.length == 0) {
						this.goodsData = []
						this.hasMore = false
					} else {
						this.current_page = res.data.current_page
						this.last_page = res.data.last_page
						this.total = res.data.total


						res.data.data.map(result => {
							if (result.is_goods == 1) {
								this.goodsData.push({
									goods_name: result.goods[0].goods_name, //商品名称
									image: result.goods[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.goods[0].sku[0].goods_price, //商品价格
									line_price: result.goods[0].sku[0].line_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									user: result.user,
									mid: result.mid,
									goods_id: result.goods_id,
									free_id: result.free_id,
									user: result.user,
									share_num: result.share_num,
									is_goods: result.is_goods,
									surplus_share_num: result.surplus_share_num,
								})
							} else {
								this.goodsData.push({
									goods_name: result.card[0].title, //商品名称
									image: result.card[0].image[0].file_path, //商品图片，只取第一张图片
									goods_price: result.card[0].unit_price, //商品价格
									line_price: result.card[0].unit_price, //划线价格
									dealer_money: result.dealer_money, //佣金
									participate_num: result.participate_num, //参与人数
									suc_num: result.suc_num, //免单成功人数
									goods_id: result.goods_id,
									free_id: result.free_id,
									user: result.user,
									mid: result.mid,
									share_num: result.share_num, //n人免单
									status: result.status, //免单成功
									is_goods: result.is_goods,
									card_id: result.card_id,
									surplus_share_num: result.surplus_share_num,
								})
							}
							if (this.goodsData.length == this.total) {
								this.hasMore = false
							}
							console.log("jjjjjjjjjjj00000.0.0.", this.goodsData)


						})
					}

				} catch (e) {
					return Promise.reject(e)
				}
			}
		},




	}
</script>
<style lang="scss" scoped>
	.page-myfreeBill-index {
		min-height: 10;
		background: var(--theme-color);
		// background-color: var(--theme-color);
	}

	.page-myfreeBill-index-header {
		background-color: var(--theme-color);
	}

	.page-title {
		color: #999999;
		font-size: 24rpx;
		font-weight: 400;
		line-height: 44px;
	}

	.search-wrapper {
		display: flex;
		align-items: center;
		/*#ifndef H5*/
		padding: 0 0 20rpx 0;
		/* #endif */
		/* #ifdef H5 */
		padding: 20rpx 0 20rpx 0;
		/* #endif */

		.search-wrapper__city {
			flex-shrink: 0;
			max-width: 6em;
			font-size: 28rpx;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;

			.agent__text {
				flex: 1;
				min-width: 0;
				margin-left: 8rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.input-wraper {
			display: flex;
			align-items: center;
			height: 62rpx;
			margin-left: 20rpx;
			/* #ifdef MP */
			padding: 0 30rpx;
			/* #endif */
			/* #ifdef H5 */
			padding: 0 30rpx;
			width: 70%;
			/* #endif */
			font-size: 24rpx;
			color: #999;
			// white-space: nowrap;
			background-color: #fff;
			border-radius: 31rpx;
		}

		.input-wrapper__text {
			margin-left: 10rpx;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			/* #ifdef MP */
			width: 300rpx;
			/* #endif */
			/* #ifdef H5 */
			width: 100%;
			/* #endif */
		}


	}

	//分类
	.cate-wrapper {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.cate-scroll {
		box-sizing: border-box;
		width: 440rpx;
		flex: 1;

		.active {
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 43px;
		}
	}

	.cate-list {
		display: inline-flex;
		align-items: center;
		height: 84rpx;

		.active {
			font-size: 36rpx;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 43px;
		}
	}


	.cate-item {
		box-sizing: border-box;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #000);
		white-space: nowrap;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;

		&.is-active {
			font-size: 40rpx;
			font-weight: bold;
		}
	}

	.btn-cate-all {
		position: relative;
		box-sizing: border-box;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: var(--auxiliary-color, #000);
		white-space: nowrap;
		text-align: center;

		&::after {
			position: absolute;
			content: "\20";
			left: -10rpx;
			top: -4rpx;
			bottom: -4rpx;
			width: 10rpx;
			background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.1));
			border-top-left-radius: 4rpx;
			border-bottom-left-radius: 4rpx;
		}
	}

	//分类结束
	// banner轮播
	.banner-swiper {
		// position: absolute;
		// left: 0;
		// top: 0;
		width: 750rpx;
		height: 200rpx;
		z-index: 2;
	}

	.banner-swiper__item {
		width: 100%;
		height: 100%;
	}

	.banner-swiper_img {
		width: 100%;
		height: 100%;
	}

	.button-index {
		width: 100%;
		background: #FFAC40;
		height: 70rpx;
		display: flex;
		justify-content: space-evenly;

		.button-index-view {
			// width: 33.33%;
			line-height: 35rpx;
			padding: 20rpx;
			color: #333333;
			font-weight: 400;
			text-align: center;
		}

		.active {
			// background: #FFFFFF;
			// color: #333333;
			// font-size: 28rpx;
			// font-weight: bold;
			padding-top: 44rpx;
			width: 176rpx;
			height: 30rpx;
			background: #FFD940;
			opacity: 1;
			border-radius: 20rpx 20rpx 0rpx 0rpx;
			position: relative;
			top: -20rpx;

		}
	}

	// banner轮播 end
	.page-orders {
		padding: 10rpx;
		background: var(--theme-color);
		display: flex;

		.page-orders-text {
			font-weight: 400;
			font-size: 28rpx;
			color: #FFFFFF;
			padding: 10rpx 20rpx;
			margin-left: 20rpx;
			margin-top: 20rpx;
		}

		.active {
			border: 1rpx solid #FFFFFF;
			border-radius: 31rpx;
		}
	}

	.page-goods {
		position: relative;
		width: 100%;
	}

	.page-goods-view {
		box-sizing: border-box;
		background: #FFFFFF;
		width: 690rpx;
		margin: 0 auto;
		border-radius: 20rpx;

		padding: 20rpx;
		margin-top: 20rpx;
	}

	.page-goods-index {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.page-goods-title {
		color: #333333;
		font-size: 32rpx;
		font-weight: bold;
		line-height: 52rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		margin-top: 10rpx;
	}

	.btnclass {
		padding: 12rpx;
		background: var(--theme-color);
		color: #FFFFFF;
		font-size: 28rpx;
		font-weight: bold;
		line-height: 44rpx;
		margin-right: 24rpx;
	}

	.page-goods-marking {
		color: #999999;
		font-size: 24rpx;
		font-weight: 500;
		display: flex;
		text-decoration: line-through;
		margin-left: 20rpx;
	}

	.date {
		background: #FFD940;
		font-size: 28rpx;
		color: #333333;
		line-height: 34rpx;
		padding: 6rpx;
		border-radius: 10rpx;
	}
	.lestab{
		margin-left: 60rpx;
	}
</style>
