<template>
	<view class="page-card-poster">
		<!-- 分享菜单 -->
		<share-view ref="shareView" poster-type="cardBag" :height="667" :width="375"></share-view>
		<!-- 分享菜单 end -->
	</view>
</template>

<script>
import TabBar from './components/TabBar.vue'
import ShareView from '@/components/template/ShareView.vue'
export default {
    components: {
        ShareView,
        TabBar
    },
    data() {
        return {
            // 海报的接口数据
        }
    },
    computed: {
        cShareViewStyle() {
            return 'bottom: 100rpx;'
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.shareView.shareswich()
        })
    }
}
</script>

<style lang="scss" scoped>
</style>
