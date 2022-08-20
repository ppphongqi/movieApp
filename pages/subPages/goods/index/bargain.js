import App from "@/common/js/app.js"
let mixin = {
	data() {
		return {
			isToBargain: false,
			showBargainnfo: false,
		}
	},
	computed: {
		isBargain() {
			const {
				bargain_id
			} = this.detail
			return !!bargain_id;
		},
		$bargain_status() {
			if (this.isBargain) {
				const {
					status
				} = this.bargain_data || {};
				return status;
			}
		},
	},
	methods: {
		isBargainToggleTrade() {
			let {
				hasChannel,
				errorMsg
			} = this.hasActivityChannle, {
				status
			} = this.activityStatus;
			if (hasChannel) {
				if (status === 1 && !this.has_stock) {
					if (!!this.bargain_data.is_buy_num) {
						this.$refs.goodsBuyMenu.disabledTally = !0;
						this.$refs.goodsBuyMenu.hideStock = !0;
						this.onToggleTrade(true);
					} else {
						App.showError('已达到发起砍价上限，无法发起砍价');
					}
				} else {
					App.showError(status === 2 ? '活动已结束' : '活动未开始');
				}
			} else {
				App.showError(errorMsg);
			}
		},
	}
}

export default mixin
