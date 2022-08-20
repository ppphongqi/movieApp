<template>
		<view class="business-map-wrapper">
			<map class="business-map-wrapper__map" :latitude="latitude" :longitude="longitude" :markers="covers" @markertap="handanchorpointtap"/>
			<!-- <map class="business-map-wrapper__map" :longitude="mapLng" :latitude="mapLat" :markers="cMarkers" @markertap="handleMapMakerClick" /> -->
		</view>
</template>
<script>
	import App from '@/common/js/app.js'
	import agentMixin from '@/mixins/agentMixin'
	import pageShareMixin from '@/common/js/pageShareMixin.js'
	export default {
		mixins: [
			agentMixin,
			pageShareMixin
		],
		data(){
			return{
				id:0,
				// // 当前的纬度
				// lat: 30.57447,
				// // 当前的经度
				// lng: 103.92377,
				latitude: 30.57447,
				longitude: 103.92377,
				 covers: [],
				 item:{},
				businessData:[],
			}
			 
		},
		onLoad(option){
			// console.log("dfdsfsdfsdf",JSON.parse(option.businessData))
			if(option){
				console.log("5555",JSON.parse(option.item))
				this.item=JSON.parse(option.item)
				this.businessData = JSON.parse(option.businessData)
				this.latitude = this.businessData[0].lat || this.latitude
				this.longitude = this.businessData[0].lng || this.longitude
				this.businessData.forEach(item=>{
					this.covers.push({
						id:item.lat+item.lng,
						width: 48,
						height: 48,
						latitude:item.lat,
						longitude:item.lng,
						// iconPath: './static/images/icon-map-maker.png',
						iconPath: this.$util.deepGet(this.settingData, 'card.maker_icon.0.file_path', '') ||
						require(
							'./static/images/icon-map-maker.png'),
					})
				})
			}
			 
			  
		},
		methods:{
			handanchorpointtap(e){
				console.log("9999",e)
				App.navigationTo({
					// pages/subPages/goods/index/index?goods_id=${item.goods_id}&free_id=${item.free_id}
					url: "pages/subPages/goods/index/index?" + App.urlEncode({
						goods_id: this.item.goods_id,
						free_id: this.item.free_id,
						// referee_id:item.user?item.user.user_id:'',
						referee_id: !!this.item.order && this.item.order.length > 0 ? this.item.order[0].mid : '',
					}),
				})
			},
			
		},
		
	}
</script>
<style lang="scss" scoped>
	.business-map-wrapper__map {
		height: 100vh;
		width: 100vw;
	}
</style>