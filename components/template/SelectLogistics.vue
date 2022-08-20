<!-- 
	物流方式选中弹窗 by 杨智源
	show 是否显示
 -->
<template>
	<view v-show="show">
		<PopManager :show="true" tpye="center" @clickmask="clickmask" :model-data="modelData">
			<view class="select-list">
				<form @submit="selectSubmit" report-submit="">
					<view class="module-title">
						请填写物流信息
						<view class="iconfont icon-close" @click="clickmask"></view>
					</view>
					<view class="select-item dis-flex flex-y-center">
						<view class="f-24 col-3">物流公司</view>
						<view class="select-item-inpt flex-box">
							<picker mode="selector" :range="expressLlist" @change="selectList" name="company">
								<view class="select-input-place" :style="{ color: modelData.company.length > 0 ? '#333' : '#999' }">
									{{ modelData.company.length > 0 ? modelData.company : '请选择物流公司' }}
								</view>
							</picker>
						</view>
						<view class="iconfont icon-jinrujiantou1"></view>
					</view>
					<view class="select-item dis-flex flex-y-center">
						<view class="f-24 col-3">物流单号</view>
						<view class="select-item-inpt flex-box">
							<input type="number" name="number" v-model="modelData.number" placeholder="请填写物流单号" placeholder-class="select-input-place" />
						</view>
					</view>
					<button form-type="submit" class="main-bg-color auxiliary-color">确认</button>
				</form>
			</view>
		</PopManager>
	</view>
</template>

<script>
import PopManager from '@/components/template/PopManager.vue';
import App from '@/common/js/app.js';
export default {
	data() {
		return {
			modelData: {
				number: '',
				company: ''
			},
			expressLlist: []
		};
	},
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	components: {
		PopManager
	},
	computed: {},
	beforeCreate() {},
	mounted() {
		this.getExpressCompany();
	},
	methods: {
		/**
		 * 获取物流公司列表
		 */
		getExpressCompany() {
			let _this = this;
			App._get('Address/getAddressList', {}, res => {
				_this.expressLlist = res.data;
			});
		},
		clickmask() {
			this.modelData = {
				number: '',
				company: ''
			};
			this.$emit('clickmask');
		},
		selectList(e) {
			let that = this;
			that.modelData.company = that.expressLlist[e.detail.value];
		},
		selectSubmit(e) {
			this.$emit('submit', { ...this.modelData });
		}
	}
};
</script>

<style>
.select-list {
	width: 620upx;
	box-sizing: border-box;
	border-radius: 6upx;
	padding: 0 28upx 30upx;
	background: #ffffff;
}

.select-list .icon-close {
	position: absolute;
	top: 50%;
	right: 3%;
	transform: translateY(-50%);
	font-size: 36upx;
	width: 1em;
	height: 1em;
	line-height: 1em;
	color: #333333;
}

.select-item {
	margin-bottom: 24upx;
	height: 78upx;
	line-height: 78upx;
	padding: 0 36upx;
	border: 1upx solid #eeeeee;
	border-radius: 40upx;
}

.select-list button {
	background: #ffd940;
	height: 70upx;
	line-height: 70upx;
	font-size: 28upx;
	border-radius: 40upx;
	margin-top: 30upx;
}

.select-list .module-title {
	margin-bottom: 40upx;
}

.select-item-inpt {
	padding: 0 24upx;
}

.select-item-inpt input {
	font-size: 24upx;
	color: #333333;
}

.select-input-place {
	font-size: 24upx;
	color: #999999;
}
</style>
