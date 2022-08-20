<template>
	<view :style="themeColor">
		<subscribe :room-id="room_id"></subscribe>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				room_id: 0
			}
		},
		onLoad: function(e) {
			let _this = this;
			_this.room_id = e.id
			if (e.id != 0) {
				uni.redirectTo({
				    url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${e.id}`
				});
			}
		},
		methods: {
			
		}
	}
</script>

<style>
page{width:100%; height:100vh; display:flex; flex-direction:column;}
</style>
