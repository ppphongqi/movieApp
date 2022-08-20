const mutations = {
	floatOpen(state, val) {
		state.floatOpen = val
	},
	userInfo(state, val) {
		uni.setStorageSync("userInfo", val);
		state.userInfo = val
	},
	token(state,val) {
		uni.setStorageSync("token", val);
		state.token = val
	},
	orderPay(state, val) {
		state.orderPay = val;
	},
	addressData(state, val) {
		state.addressData = val;
	},
	storeData(state, val) {
		state.storeData = val;
	},
	showAdvert(state, val) {
		state.openAdvert = val;
	},
	setOpenAdvertIndex(state,val) {
		state.openAdvertIndex = val;
	},
	iswrite(state, val) {
		state.iswrite = val;
		uni.setStorageSync("iswrite", val)
	},
	setTabbar(state, val) {
		state.tabBar = val;
	},
	hiddenTabBar(state, val) {
		state.hiddenTabBar = val;
	},
	saveRefereeId(state, val) {
		console.log('store saveRefereeId',val)
		uni.setStorageSync('referee_id', val);
		state.refereeId = val;
	},
	setClient(state, val) {
		state.clientType = val;
	},
	setAppSetting(state, val) {
		state.appSetting = val;
		
	},
	setSystemInfo(state) {
		state.systemInfo = uni.getSystemInfoSync();
	},
	setPageLoad(state, val) {
		state.pageLoad = val;
	},
	setParseWidth(state, val) {
		state.parseWidth = val.value;
	},
	setAppRoot(state, val) {
		state.appRoot = val;
	},
	setShareSetting(state, val) {
		state.shareSetting = val;
	},
	setWechatFollow(state, val) {
		state.wechatFollow = val;
	},
	setTheme(state,val){
		state.theme=val
		
	},
	setTopColor(state,val){
		state.topColor=val
	},
	setAuxiliaryColor(state,val){
		state.auxiliaryColor=val
	},
	setMemberInfo(state,val={}) {
		state.memberInfo = val
	},
	setUserAll(state,val={}) {
		state.userAll = val
	}
}
export default mutations
