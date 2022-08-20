import App from "@/common/js/app.js"
let mixin = {
	data() {
		return {
			isSettingStatus: false, //手动设置关闭活动
			showGoGroup: false, //显示团列表
			groupData: {}, //拼团数据
			group_buy_type: null,
			groupsListInfo: [], //用户拼团列表信息
		}
	},
	computed: {
		$min_price() {
			const {
				min_price
			} = this.groupData;
			return min_price
		},
		$groups_price() {
			const {
				groups_price
			} = this.groupData;
			return groups_price
		},
		$hasGroups() {
			return this.$groups_type ? !this.stock_num && !this.goods_price : !this.stock_num;
		},
		$groups_type() {
			return this.group_id && this.group_buy_type === '2';
		},
		groupsShowList() {
			if (this.groupsListInfo.length > 0) {
				return this.groupsListInfo.filter((val, index) => index < 3)
			}
		},
		groupsShowListInfo() {
			let {
				is_show_groups
			} = this.groupData;
			return is_show_groups === 1;
		}
	},
	methods: {
		/**  
		 * 判断是购买拼团商品
		 */
		isGroupToggleTrade(group_buy_type) {
			// console.log()
			let {
				hasChannel,
				errorMsg
			} = this.hasActivityChannle,
				specData = this.specData, {
					status
				} = this.activityStatus;
			if (hasChannel) {
				if (status === 1 && !this.has_stock) {
					this.group_buy_type = group_buy_type;
					this.onToggleTrade();
				} else {
					App.showError(status === 2 ? '活动已结束' : '活动未开始');
				}
			} else {
				App.showError(errorMsg);
			}
		},
		/**
		 * 获取拼团列表信息
		 */
		getGroupList(groups_id, goods_id) {
			let _this = this;
			App._get("groups.Groups/getGroupList", {
				groups_id,
				goods_id
			}, result => {
				if (Array.isArray(result.data)) {
					let $result = result.data
					$result.map(item => {
						clearInterval(item.timer)
						item.overFormat = '00:00:00';
						item.timer = setInterval(() => {
							const scopeTime = parseInt((Number(item.overtime) * 1000 - new Date().getTime()) / 1000);
							if (scopeTime > 0) {
								let hh = parseInt(scopeTime / 60 / 60 / 24 * 24),
									mm = parseInt(scopeTime / 60 % 60),
									ss = parseInt(scopeTime % 60),
									groupTime = {
										hh: hh < 10 ? '0' + hh : hh,
										mm: mm < 10 ? '0' + mm : mm,
										ss: ss < 10 ? '0' + ss : ss
									};
								item.overFormat = `${groupTime.hh}:${groupTime.mm}:${groupTime.ss}`;
							} else {
								item.overFormat = '00:00:00';
								clearInterval(item.timer)
							}
						}, 1000);
						item.isSelf = item.createrid === App.getUserId();
					});
					_this.groupsListInfo = $result
				}
				uni.stopPullDownRefresh();
			});
		},
		/**
		 * 参团获查看团详情
		 */
		goGroupsJoin(groupsItem) {
			console.log('groupsItem',groupsItem)
			App.navigationTo({
				url: `pages/subPages/groups/index/index?${groupsItem.isSelf?"order_id=" + groupsItem.order_id:"groups_group_id=" + groupsItem.id}`
			})
		},
		/**
		 * 去参团按钮
		 */
		joinGroups() {
			let _this = this;
			_this.$refs.goodsBuyMenu.showBuyMenu = false;
			setTimeout(() => {
				_this.showGoGroup = true;
			}, 350);
		}
	}
}

export default mixin
