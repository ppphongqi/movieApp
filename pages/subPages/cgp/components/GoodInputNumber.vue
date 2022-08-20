<template>
	<view class="good-input-number" :class="cContainerClassStr" :style="containerStyle">
		<button class="good-input-number__btn is-reduce btn-normal" :class="{'is-disabled': min >= value}" @click="handleBtnReduceClick" :disabled="min >= value">
			<view class="iconfont icon-move"></view>
		</button>
		<input
			class="good-input-number__input"
			:value="fakeValue !== '' ? fakeValue : value"
			type="number"
			:disabled="inputDisabled"
			@input="handleInput"
			@blur="handleBlur" />
		<button class="good-input-number__btn is-add btn-normal" :class="{'is-disabled': max <= value}" @click="handleBtnAddClick" :disabled="max <= value">
			<view class="iconfont icon-add"></view>
		</button>
	</view>
</template>

<script>
export default {
    props: {
        containerStyle: {
            type: String,
            default: ''
        },
        // 值
        value: {
            type: Number,
            default: 0
        },
        // 最小值
        min: {
            type: Number,
            default: 0
        },
        // 最大值
        max: {
            type: Number,
            default: 999
        },
        // 精度
        precision: {
            type: Number,
            default: 2
        },
        // 步进长度
        step: {
            type: Number,
            default: 1
        },
        // 当减无可减的时候是否隐藏输入框和减按钮
        hideBtnReduceAtMin: {
            type: Boolean,
            default: false
        },
        // 输入框是否disabled
        inputDisabled: {
            type: Boolean,
            default: false
        },
        // 尺寸noraml small
        size: {
            type: String,
            default: 'normal'
        }
    },
    data() {
        return {
            // 用于blur时纠正输入框的值
            fakeValue: ''
            // 是否可以显示全部内容
        }
    },
    computed: {
        // 最外层容器的class
        cContainerClassStr() {
            let classStr = ''
            if (this.hideBtnReduceAtMin && (this.value == '' || this.value <= this.min)) {
                classStr += ' hide-reduce'
            } else {
                classStr += ' show-reduce'
            }
            classStr += ` is-${this.size}`
            return classStr
        }
    },
    methods: {
        // 减按钮点击
        handleBtnReduceClick() {
            const newValue = this.value - this.step
            this.handleInput({
                detail: {
                    value: newValue
                }
            })
        },
        // 加按钮点击
        handleBtnAddClick() {
            const newValue = this.value + this.step
            this.handleInput({
                detail: {
                    value: newValue
                }
            })
        },
        // 输入时
        handleInput(e) {
            const value = e.detail.value
            const validValue = this.getValidValue(value)
            if (value == validValue) {
                this.$emit('input', this.getValidValue(e.detail.value))
            }
        },
        // 失去焦点时
        handleBlur(e) {
            const value = e.detail.value
            const validValue = this.getValidValue(value)
            console.log('handleBlur', {
                value,
                validValue
            })
            if (value === '' || validValue != value) {
                console.log('处理显示问题')
                // 处理显示问题
                this.fakeValue = validValue || '' + this.min
                this.$nextTick(() => {
                    this.fakeValue = ''
                })
                this.$emit('input', validValue)
            }
        },
        // 得到合法的值
        getValidValue(value) {
            if (value < this.min || !+value) {
                value = this.min
            } else if (value > this.max) {
                value = this.max
            }
            return +(+value).toFixed(this.precision)
        }
    }
}
</script>

<style lang="scss" scoped>
	.good-input-number {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 174rpx;

		&.is-small {
			width: 120rpx;
			.good-input-number__btn {
				width: 32rpx;
				height: 32rpx;
				.iconfont {
					font-size: 24rpx;
				}
				.good-input-number__input {
					font-size: 24rpx;
				}
			}
		}
		&.show-reduce {
			.good-input-number__input,
			.good-input-number__btn.is-reduce {
				opacity: 1;
				transform: translateX(0);
				pointer-events: auto;
			}
		}
	}

	.good-input-number__input {
		flex: 1;
		min-width: 0;
		margin: 0 8rpx;
		font-weight: bold;
		font-size: 28rpx;
		text-align: center;
		opacity: 0;
		transform: translateX(100%);
		transition: all .2s ease-in-out;
		pointer-events: none;
	}

	.good-input-number__btn {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		width: 51rpx;
		height: 51rpx;
		border-radius: 100%;
		background: linear-gradient(180deg, #FFDC4D 0%, #FFCC00 100%);

		&.is-reduce {
			opacity: 0;
			transform: translateX(100%);
			transition: all .2s ease-in-out;
			pointer-events: none;
		}

		&.is-disabled {
			background: transparent;
			border: 1px solid #ccc;
		}
	}
</style>
