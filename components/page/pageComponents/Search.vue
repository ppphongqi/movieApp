<template>
	<view>
		<!-- 搜索框 -->
		<view class="diy-search-box dis-flex col-f ts-3" :style="{'background-color':itemStyle.bgcolor}">
		  <navigator class="diy-search cont dis-flex flex-y-center" hover-class="none" openType="navigate" url="/pages/subPages/category/list"  :class="['angle-'+itemStyle.borderstyle,'text-'+itemStyle.align]" :style="{'background-color':itemStyle.bordercolor}">
		    <view class="view iconfont icon-search f-32" :style="{'color':itemStyle.textcolor}"></view>
		    <view class="view f-28 flex-box onelist-hidden" :style="{'color':itemStyle.textcolor}">{{  itemStyle.texttip }}</view>
		  </navigator>
		</view>
	</view>
</template>

<script>

	export default {
		data() {
			return {

			};
		},
		props: {
			 itemIndex: Number,
			itemStyle: Object,
			params: Object
		},
		components: {
			
		},
		computed: {

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
			
		}
	}
</script>

<style>
/* 搜索框 */

.diy-search-box {
  position: unset;
  background: #f1f1f2;
  padding: 20upx 30upx;
  color: #fff;
  -moz-transition: all 0.3s;
  -o-transition: all 0.3s;
  transition: all 0.3s;
}

.diy-search-box .diy-search {
  width: 100%;
  border-bottom: 0;
  background: #fff;
  overflow: hidden;
  position: relative;
  color: #fff;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 0 10px;
  height: 70upx;
  border-radius: unset;
}

.diy-search-box .diy-search .icon-search {
  margin-right: 10upx;
}

.diy-search .view {
  color: #999;
	/* height: 1em; */
}

.diy-search .iconfont {
	/* line-height: .9em; */
}

.diy-search .flex-box {
	/* line-height: 1.2em; */
}

/* 输入框四角风格 */

.diy-search-box .diy-search.angle-1 {
  border-radius: 5px;
}

.diy-search-box .diy-search.angle-2 {
  border-radius: 80upx;
}

/* 文字对齐 */

.diy-search-box .diy-search.text-1 {
  text-align: left;
}

.diy-search-box .diy-search.text-2 {
  text-align: center;
}


</style>
