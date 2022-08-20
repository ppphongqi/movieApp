let setData = function(obj) {
	let that = this;
	let keys = [];
	let val, data;
	Object.keys(obj).forEach(function(key) {
		keys = key.split('.');
		val = obj[key];
		data = that.$data;
		if (keys.length === 1) {
			if(!!that.$data[key]){
				that.$set(that, key, val);
			}else{
				that[key] = val;
			}
		} else {
			let setKey = keys.slice(0, keys.length - 1),
				setObj = null;
			setKey.map(itemKey => {
				let ojbItem = setObj;
				setObj = !!setObj ? setObj[itemKey] : that[itemKey];
			});
			that.$set(setObj, keys[keys.length - 1], val);
		}
	});
}
export default setData
