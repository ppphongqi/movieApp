<template>
	<view class="mpvue-picker" :style="themeColor">
		<view :class="{'pickerMask':showPicker}" @click.stop="maskClick" catchtouchmove="true"></view>
		<view class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<view class="mpvue-picker__hd" catchtouchmove="true">
				<view class="mpvue-picker__action" @click.stop="pickerCancel">取消</view>
				<view class="mpvue-picker__action" :style="{color:themeColor}" @click.stop="pickerConfirm">确定</view>
			</view>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
				<picker-view-column>
					<view class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</view>
				</picker-view-column>
				<picker-view-column v-if="cityType==='pca'">
					<view class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</view>
				</picker-view-column>
			</picker-view>
		</view>
	</view>
</template>

<script>
import cityList from '@/common/js/cityData.js'
const {
    provinceData = [],
    cityData = [],
    areaData = []
} = cityList
export default {
    data() {
        return {
            pickerValue: [
                0,
                0,
                0
            ],
            provinceDataList: [],
            cityDataList: [],
            areaDataList: [],
            /* 是否显示控件 */
            showPicker: false
        }
    },
    created() {
        this.init()
    },
    props: {
        /* 默认值 */
        pickerValueDefault: {
            type: Array,
            default() {
                return [
                    '110000000',
                    '110100000',
                    '110101000'
                ]
            }
        },
        /* 主题色 */
        // themeColor: {
        // 	type:String,
        // 	default:''
        // },
        // 省市区类型 pc省市 pca省市区
        cityType: {
            type: String,
            default: 'pca'
        }
        // mpvuePickerVisibilitty: {
        // 	type:Boolean,
        // 	default:true
        // }
    },
    watch: {
        pickerValueDefault(newVlaue, oldValue) {
            let _this = this
            try {
                let provinceIndex = provinceData.findIndex(item => '' + item.value === '' + newVlaue[0]),
                    cityIndex = cityData[provinceIndex].findIndex(item => '' + item.value === '' + newVlaue[1]),
                    areaIndex = areaData[provinceIndex][cityIndex].findIndex(item => '' + item.value === '' + newVlaue[2])
                this.init([
                    provinceIndex !== -1 ? provinceIndex : 0,
                    cityIndex !== -1 ? cityIndex : 0,
                    areaIndex !== -1 ? areaIndex : 0
                ])
                console.log('pickerValueDefault watch 完毕', {
                    provinceIndex,
                    cityIndex,
                    areaIndex
                })
            } catch (e) {
                console.log(e)
                // TODO handle the exception
            }

        }
    },
    mounted() {
        console.log('cityType', this.cityType)
    },
    methods: {
        init(value = [
            0,
            0,
            0
        ]) {
            // 处理参数格式，避免后面的代码读取undefined的属性的问题
            if (!value || value.length != 3 || value[0] == undefined || value[1] == undefined || value[2] == undefined) {
                value = [
                    0,
                    0,
                    0
                ]
            }
            // this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
            this.provinceDataList = provinceData
			try {
				this.cityDataList = cityData[value[0] ? value[0] : 0] ? cityData[value[0] ? value[0] : 0] : []
			}catch(err) {
				this.cityDataList = []
			}
            
			try {
				this.areaDataList = areaData[value[0] ? value[0] : 0][value[1] ? value[1] : 0] ? areaData[value[0] ? value[0] : 0][value[1] ? value[1] : 0] : []
			}catch(err) {
				this.areaDataList = []
			}
     
            // 延时执行value设置，避免picker-view的value失效
            setTimeout(() => {
                this.pickerValue = value
            }, 500)
        },
        show() {
            setTimeout(() => {
                this.showPicker = true
            }, 0)
        },
        maskClick() {
            this.pickerCancel()
        },
        pickerCancel() {
            this.showPicker = false
            this.$emit('onCancelBack')
            this._$emit('onCancel')
        },
        pickerConfirm(e) {
            this.showPicker = false
            this._$emit('onConfirm')
        },
        showPickerView() {
            this.showPicker = true
        },
        handPickValueDefault() {
            if (this.pickerValueDefault !== [
                0,
                0,
                0
            ]) {
                if (this.pickerValueDefault[0] > provinceData.length - 1) {
                    this.pickerValueDefault[0] = provinceData.length - 1
                }
                if (this.pickerValueDefault[1] > cityData[this.pickerValueDefault[0]].length - 1) {
                    this.pickerValueDefault[1] = cityData[this.pickerValueDefault[0]].length - 1
                }
                if (this.pickerValueDefault[2] > areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1) {
                    this.pickerValueDefault[2] = areaData[this.pickerValueDefault[0]][this.pickerValueDefault[1]].length - 1
                }
            }
        },
        pickerChange(e) {
            // console.log("pickerChange");
            let changePickerValue = e.mp.detail.value
            if (this.pickerValue[0] !== changePickerValue[0]) {
                // 第一级发生滚动
                this.cityDataList = cityData[changePickerValue[0]]
                this.areaDataList = areaData[changePickerValue[0]][0]
                changePickerValue[1] = 0
                changePickerValue[2] = 0
            } else if (this.pickerValue[1] !== changePickerValue[1]) {
                // 第二级滚动
                this.areaDataList =
						areaData[changePickerValue[0]][changePickerValue[1]]
                changePickerValue[2] = 0
            }
            this.pickerValue = changePickerValue
            this._$emit('onChange')
        },
        _$emit(emitName) {
            let pickObj = {
                label: this._getLabel(),
                value: this.pickerValue,
                cityCode: this._getCityCode()
            }
            this.$emit(emitName, pickObj)
        },
        _getLabel() {
            let pcikerLabel =
					this.provinceDataList[this.pickerValue[0]].label +
					'-' +
					this.cityDataList[this.pickerValue[1]].label +
					'-' +
					this.areaDataList[this.pickerValue[2]].label
            return pcikerLabel
        },
        _getCityCode() {
            let {
                provinceDataList,
                cityDataList,
                areaDataList,
                pickerValue
            } = this
            return [
                provinceDataList[pickerValue[0]].value,
                cityDataList[pickerValue[1]].value,
                areaDataList[pickerValue[2]].value
            ]
        }
    }
}
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 100000;
		visibility: hidden;
	}

	.mpvue-picker-view-show {
		transform: translateY(0);
		visibility: visible;
	}

	.mpvue-picker .mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}

	.mpvue-picker .mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}

	.mpvue-picker .mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}

	.mpvue-picker .mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}

	.mpvue-picker .mpvue-picker__action:last-child {
		text-align: right;
	}

	.mpvue-picker .picker-item {
		text-align: center;
		height: 40px !important;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 24rpx;
	}

	.mpvue-picker .mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
